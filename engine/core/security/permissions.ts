// engine/core/security/permissions.ts
import { ForbiddenError } from "../http/errors";
import { AuthError } from "../http/errors";
import { hasRole, Role } from "./roles";

export function requireRole(userRole: Role, required: Role) {
  if (!hasRole(userRole, required)) {
    throw new AuthError("You do not have permission to perform this action");
  }
} 

export function requireRolex(user: any, roles: string[]) {
  if (!user) throw new ForbiddenError("Not authenticated");
  if (!roles.includes(user.role)) throw new ForbiddenError("Insufficient permissions");
}

export function requireOwnership(userId: any, resourceUserId: any) {
  if (String(userId) !== String(resourceUserId)) {
    throw new ForbiddenError("Not allowed to access this resource");
  }
}
