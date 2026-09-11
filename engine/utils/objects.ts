// engine/utils/objects.ts

export function deepMerge<T extends object, U extends object>(a: T, b: U): T & U {
  const result: any = { ...a };
  for (const key of Object.keys(b)) {
    const v: any = (b as any)[key];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      result[key] = deepMerge((result as any)[key] || {}, v);
    } else {
      result[key] = v;
    }
  }
  return result;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const out = {} as any;
  keys.forEach(k => (out[k] = obj[k]));
  return out;
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const out = { ...obj } as any;
  keys.forEach(k => delete out[k]);
  return out;
}

export function camelToSnake(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
