export function parseId(id: string, name = "id"): number {
  const n = Number(id);
  if (Number.isNaN(n)) {
    throw new Error(`Invalid ${name}`);
  }
  return n;
} 
