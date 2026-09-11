// engine/lib/config.ts
import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  APP_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_PORT: z.string().default("3000"),

  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),

  JWT_SECRET: z.string().min(16, "JWT_SECRET too short"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(" Invalid environment configuration");
  console.error(parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;

export const isProd = config.APP_ENV === "production";
export const isDev = config.APP_ENV === "development";
