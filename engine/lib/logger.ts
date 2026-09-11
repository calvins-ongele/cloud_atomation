// engine/lib/logger.ts
import { isProd } from "./config";

function format(level: string, message: string, meta?: any) {
  const base = { level, message, timestamp: new Date().toISOString() };
  return meta ? { ...base, meta } : base;
}

export const logger = {
  info(message: string, meta?: any) {
    isProd ? console.log(JSON.stringify(format("info", message, meta)))
           : console.log("[INFO]", message, meta ?? "");
  },

  warn(message: string, meta?: any) {
    isProd ? console.warn(JSON.stringify(format("warn", message, meta)))
           : console.warn("[WARN]", message, meta ?? "");
  },

  error(message: string, meta?: any) {
    isProd ? console.error(JSON.stringify(format("error", message, meta)))
           : console.error("[ERROR]", message, meta ?? "");
  },
};
