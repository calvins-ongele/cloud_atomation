// engine/core/http/validator.ts
import { ValidationError } from "./errors";


 async function validate(schema: any, payload: any) {
  try {
    return await schema.parseAsync(payload);
  } catch (err: any) {
    // Zod error
    if (err?.issues) {
      const details = err.issues.map((issue: any) => ({
        field: issue.path?.join(".") ?? "unknown",
        message: issue.message.replace("Too small:", "Minimum length:"),
        code: issue.code,
      }));

      //console.log("Validation Issues:", details);

      throw new ValidationError("Invalid request data", details);
    }

    // Fallback
    throw new ValidationError("Invalid request data");
  }
}

/**
 * Validates a string is not empty (after trimming whitespace) and
 * sanitizes it by allowing only safe, basic text characters (alphanumeric and common punctuation).
 *
 * @param input The string to validate and sanitize.
 * @returns The sanitized string if valid, otherwise null or an empty string depending on desired error handling.
 */
 function validateAndSanitizeString(
  input: string | null | undefined,
  options?: {
    minLength?: number;
    maxLength?: number;
  }
): string | null {

  if (input == null) return null;

  // Normalize unicode (turn fancy quotes into normal ones, etc.)
  let value = input.normalize("NFKC").trim();

  if (value.length === 0) return null;

  const min = options?.minLength ?? 1;
  const max = options?.maxLength ?? 255;

  if (value.length < min || value.length > max) return null;

  /**
   * Allowed:
   * - Letters from all languages
   * - Numbers
   * - Spaces
   * - Common punctuation & symbols used in emails, refs, notes
   */
  const safePattern =
    /^[\p{L}\p{N}\s.,'’"()\-_/&:+#@!?%=*[\]{}|~$;]+$/u;

  if (!safePattern.test(value)) {
    return null;
  }

  return value;
}


export function isNumericInteger(value: unknown): boolean {
  if (typeof value === 'number') {
    return Number.isInteger(value);
  }

  if (typeof value === 'string') {
    // Reject empty strings and whitespace
    if (value.trim() === '') return false;

    // Only digits with optional leading sign
    return /^[-+]?\d+$/.test(value);
  }

  return false;
}

export function isDouble(value: unknown): boolean {
  if (typeof value === 'number') {
    return Number.isFinite(value) && !Number.isInteger(value);
  }

  if (typeof value === 'string') {
    if (value.trim() === '') return false;

    // Must be a valid decimal number with a dot
    return /^[-+]?\d*\.\d+$/.test(value);
  }

  return false;
}

export function isANumber(value:unknown):boolean {
  const n = Number(value);
  if (isNaN(n)) return false;
  return true;
}


/**
 * Validates an email address format using a regular expression.
 * This function performs client-side format checking but does not verify 
 * that the email address actually exists or can receive mail.
 * 
 * @param email The email address string to validate.
 * @returns true if the email format is valid, false otherwise.
 */
function isValidEmail(email: string): boolean {
  // A commonly used, balanced regex for email validation
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Check for invalid input like null, undefined, or empty string
  if (!email || email.length === 0) {
    return false;
  }
  
  //  Check maximum length as per RFC 5321 (254 characters)
  const MAX_EMAIL_LENGTH = 254;
  if (email.length > MAX_EMAIL_LENGTH) {
    return false;
  }

  return emailRegex.test(email);
}
 



export const valid = { 
  schema: validate,
  string:validateAndSanitizeString,
  int:isNumericInteger,
  double:isDouble,
  email:isValidEmail,
  isANumber
}

