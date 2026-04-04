import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export interface RolesMetadata {
  roles: string[];
  requireAll?: boolean;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesMetadata = this.reflector.get<RolesMetadata | string[]>(
      'roles',
      context.getHandler(),
    );
    if (!rolesMetadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('User roles not found');
    }

    // Handle both string[] and RolesMetadata formats
    let requiredRoles: string[] = [];
    let requireAll = false;

    if (Array.isArray(rolesMetadata)) {
      requiredRoles = rolesMetadata;
    } else if (typeof rolesMetadata === 'object' && rolesMetadata.roles) {
      requiredRoles = rolesMetadata.roles;
      requireAll = rolesMetadata.requireAll || false;
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Check roles based on requireAll flag
    const hasRequiredRoles = requireAll
      ? requiredRoles.every((role) => user.roles.includes(role))
      : requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRequiredRoles) {
      const logic = requireAll ? 'all of' : 'any of';
      throw new ForbiddenException(
        `User does not have ${logic} required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
