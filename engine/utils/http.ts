// engine/utils/http.ts

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(query: any, defaults = { page: 1, limit: 20 }): PaginationParams {
  const page = Math.max(parseInt(query?.page) || defaults.page, 1);
  const limit = Math.max(parseInt(query?.limit) || defaults.limit, 1);
  return { page, limit, offset: (page - 1) * limit };
}

export function normalizeQuery(value: any): any {
  if (value === undefined || value === null) return null;
  if (Array.isArray(value)) return value.map(normalizeQuery);
  if (value === "true") return true;
  if (value === "false") return false;
  if (!isNaN(value as any)) return Number(value);
  return value;
}

export function buildMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
}
