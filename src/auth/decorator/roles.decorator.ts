import { SetMetadata } from '@nestjs/common';

export interface RolesMetadata {
  roles: string[];
  requireAll?: boolean;
}

/**
 * Roles decorator for specifying required roles on endpoints
 *
 * Usage:
 * - Single role: @Roles(ROLES.ADMIN)
 * - Multiple roles (any one): @Roles(ROLES.ADMIN, ROLES.VERIFIKATOR)
 * - Multiple roles (all required): @Roles({ roles: [ROLES.ADMIN, ROLES.JPT], requireAll: true })
 */
export const Roles = (...rolesOrMetadata: any[]) => {
  let metadata: RolesMetadata | string[];

  // Check if first argument is a RolesMetadata object with requireAll option
  if (
    rolesOrMetadata.length === 1 &&
    typeof rolesOrMetadata[0] === 'object' &&
    'roles' in rolesOrMetadata[0]
  ) {
    metadata = rolesOrMetadata[0];
  } else {
    // Convert spread arguments to string array (OR logic, any one role required)
    metadata = rolesOrMetadata;
  }

  return SetMetadata('roles', metadata);
};

/**
 * AllRoles decorator for specifying that user must have ALL specified roles
 *
 * Usage: @AllRoles(ROLES.ADMIN, ROLES.JPT) - user must have both
 */
export const AllRoles = (...roles: string[]) => {
  const metadata: RolesMetadata = { roles, requireAll: true };
  return SetMetadata('roles', metadata);
};
