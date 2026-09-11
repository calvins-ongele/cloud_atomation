// engine/utils/crypto.ts
import crypto from "crypto";

export function randomId(length = 16): string {
  return crypto.randomBytes(length).toString("hex");
}

export function randomToken(length = 32): string {
  return crypto.randomBytes(length).toString("base64url");
}

export function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function hmacSign(value: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function hmacVerify(value: string, secret: string, signature: string): boolean {
  const expected = hmacSign(value, secret);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function uuid(): string { 
  return crypto.randomUUID?.() ??
    ([1e7] as any)+-1e3+-4e3+-8e3+-1e11;
}

export function generateTempPassword( length = 10 ): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ" + // no O
    "abcdefghijkmnopqrstuvwxyz" + // no l
    "23456789!#@&";                   // no 0,1

  const bytes = crypto.randomBytes(length);
  let password = ""; 
  for (let i = 0; i < length; i++) {
    password += chars[bytes[i] % chars.length];
  } 
  return password;
}
export function generateStrongTempPassword( length = 12 ): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ" +
    "abcdefghijkmnopqrstuvwxyz" +
    "23456789";

  const bytes = crypto.randomBytes(length);

  return Array.from(bytes, b => chars[b % chars.length]).join("");
}

/**
 * Generates a random integer between min and max (inclusive).
 * Equivalent to PHP's rand(min, max)
 */
export function rand(min: number = 10, max: number = 1000):number {
 return Math.floor(Math.random() * (max - min + 1)) + min;
}
 