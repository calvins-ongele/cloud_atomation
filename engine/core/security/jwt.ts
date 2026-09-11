// engine/core/security/jwt.ts
//import jwt from "jsonwebtoken";
var jwt = require('jsonwebtoken'); 

const ACCESS_SECRET = process.env.JWT_SECRET || "dev-secret";

export interface JwtPayload {
  id: number | string; 
  email?: string;
  role?: string;
  user_company_id?: string;
  [key: string]: any;
} 

export function signToken(payload: JwtPayload, expires = "12h") {
  
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: expires });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
