// engine/utils/strings.ts

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function truncateSafe(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length - 3) + "...";
}

// Light sanitation for text input (NOT HTML sanitizer)
export function sanitizeBasic(value: string): string {
  return value.replace(/[<>]/g, "");
}
