export type Role = "user" | "moderator" | "admin";

export const Roles = {
  USER: "User",
  MODERATOR: "Moderator",
  ADMIN: "Admin",
} as const;

// hierarchy — higher index = more power
export const ROLE_PRIORITY: Record<Role, number> = {
  user: 1,
  moderator: 2,
  admin: 3,
};

export function hasRole(userRole: Role, required: Role) {
  return ROLE_PRIORITY[userRole] >= ROLE_PRIORITY[required];
}
