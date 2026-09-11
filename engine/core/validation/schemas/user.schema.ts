// engine/core/validation/schemas/user.schema.ts
import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  cpassword: z.string().min(6),
  phone: z.string().min(10),
  role: z.number().int().positive(),
  status: z.number().int().positive(),
});
export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(2),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().min(10)
});
