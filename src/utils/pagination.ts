import type { PaginationQuery } from "../interface.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function parsePagination(query: Record<string, unknown>): PaginationQuery {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));

  return { page, limit };
}

export function paginate<T>(data: T[], total: number, { page, limit }: PaginationQuery) {
  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
