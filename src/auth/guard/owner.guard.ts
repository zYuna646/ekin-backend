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
  ComparisonOperator,
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

    // Skip owner check for admin unless excludeAdmin is true
    if (!ownerMetadata.excludeAdmin && user?.roles?.includes(ROLES.ADMIN)) {
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

    const operator = (ownerMetadata.operator ?? 'eq') as ComparisonOperator;
    if (!this.compareValues(ownerValue, userValue, operator)) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    return true;
  }

  private compareValues(
    ownerValue: any,
    userValue: any,
    operator: ComparisonOperator,
  ): boolean {
    switch (operator) {
      case 'eq': {
        // Equal: ownerValue === userValue (or includes if array)
        if (Array.isArray(ownerValue)) {
          return ownerValue.includes(userValue);
        }
        return ownerValue === userValue;
      }

      case 'ne': {
        // Not equal: ownerValue !== userValue (or not includes if array)
        if (Array.isArray(ownerValue)) {
          return !ownerValue.includes(userValue);
        }
        return ownerValue !== userValue;
      }

      case 'in': {
        // In array: userValue is in ownerValue array
        if (!Array.isArray(ownerValue)) {
          throw new BadRequestException(
            `Operator 'in' requires ownerValue to be an array`,
          );
        }
        return ownerValue.includes(userValue);
      }

      case 'nin': {
        // Not in array: userValue is not in ownerValue array
        if (!Array.isArray(ownerValue)) {
          throw new BadRequestException(
            `Operator 'nin' requires ownerValue to be an array`,
          );
        }
        return !ownerValue.includes(userValue);
      }

      default: {
        this.logger.error(`Unknown comparison operator: ${operator}`);
        throw new BadRequestException(
          `Unknown comparison operator: ${operator}`,
        );
      }
    }
  }

  private getDelegateName(model: string): string {
    return model.charAt(0).toLowerCase() + model.slice(1);
  }
}
