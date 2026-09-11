// engine/core/http/auth-guard.ts
import { AuthError, ForbiddenError } from "./errors";
import { verifyToken } from "@/engine/core/security/jwt";
import { redirect } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
 

export async function requireAuth(req: Request) {
  // Try Authorization header first
  const header = req.headers.get("authorization");
  let token: string | null = null;

  if (header && header.startsWith("Bearer ")) {
    token = header.replace("Bearer ", "");
  }

  // Fallback to http-only cookie
  if (!token) {
    token = (await cookies()).get("token")?.value ?? null;
  }

  if (!token) {
    throw new AuthError("Missing auth token");
  }

  const user = verifyToken(token);
  if (!user) {  
    throw new AuthError("Invalid or expired token. Please login again");
  }

  return user;
}

export async function noAuth(req: Request) {
  // Try Authorization header first
  const header = req.headers.get("authorization");
  let token: string | null = null;

  if (header && header.startsWith("Bearer ")) {
    token = header.replace("Bearer ", "");
  }

  // Fallback to http-only cookie
  if (!token) {
    token = (await cookies()).get("token")?.value ?? null;
  }

  if (!token) {
    throw(new Error(""))
    return false;
  }

  const user = verifyToken(token);
  if (!user) {   throw(new Error(""))
    return false;
  }

  return true;
}
export function requireAdmin(role:string) {
  const roles = ['SuperAdmin', 'Admin'];
  if (!roles.includes(role)) throw new ForbiddenError();
}

export function requireRole(user: any, roles: string[]) {
  if (!roles.includes(user.role)) throw new ForbiddenError();
}
