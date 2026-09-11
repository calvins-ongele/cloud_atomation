// engine/core/validation/schemas/optional.ts
import { z } from "zod";

export const optionalField = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    value => value === "" || value === null ? undefined : value,
    schema.optional()
  );