import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  OWNER_METADATA_KEY,
  OwnerMetadata,
} from '../decorator/owner.decorator';
import { ROLES } from 'src/common/const/role.const';

@Injectable()
export class OwnerGuard implements CanActivate {
  private readonly logger = new Logger(OwnerGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ownerMetadata = this.reflector.getAllAndOverride<OwnerMetadata>(
      OWNER_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!ownerMetadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.roles?.includes(ROLES.ADMIN)) {
      return true;
    }

    const userValue = user?.[ownerMetadata.userField ?? 'nipBaru'];
    if (!userValue) {
      throw new ForbiddenException('Current user owner identity not found');
    }

    const recordId = request.params?.[ownerMetadata.paramKey ?? 'id'];
    if (!recordId) {
      throw new BadRequestException('Owner guard requires a valid resource id');
    }

    const delegateName = this.getDelegateName(ownerMetadata.model);
    const delegate = (this.prisma as Record<string, any>)[delegateName];

    if (!delegate?.findUnique) {
      this.logger.error(`Prisma model delegate ${delegateName} not found`);
      throw new BadRequestException(
        `Owner guard model ${ownerMetadata.model} is not supported`,
      );
    }

    const record = await delegate.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      throw new NotFoundException(
        `${ownerMetadata.model} with id ${recordId} not found`,
      );
    }

    const ownerValue = record[ownerMetadata.field];
    if (ownerValue === undefined) {
      throw new BadRequestException(
        `Field ${ownerMetadata.field} does not exist on ${ownerMetadata.model}`,
      );
    }

    if (Array.isArray(ownerValue)) {
      if (!ownerValue.includes(userValue)) {
        throw new ForbiddenException('You do not have access to this resource');
      }
      return true;
    }

    if (ownerValue !== userValue) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    return true;
  }

  private getDelegateName(model: string): string {
    return model.charAt(0).toLowerCase() + model.slice(1);
  }
}
