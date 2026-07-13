export interface PaginationInput {
  page?: string | null;
  limit?: string | null;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const DEFAULT_PAGE_SIZE = 15;
export const MAX_PAGE_SIZE = 100;

export function getPagination(page?: string | null, limit?: string | null): PaginationResult {
  const parsedLimit = limit ? parseInt(limit, 10) : NaN;
  const parsedPage = page ? parseInt(page, 10) : NaN;

  const limitValid = Number.isFinite(parsedLimit);
  const size = Math.max(1, Math.min(limitValid ? parsedLimit : DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE));

  const pageValid = Number.isFinite(parsedPage);
  const current = Math.max(1, pageValid ? parsedPage : 1);

  return {
    page: current,
    limit: size,
    skip: (current - 1) * size,
    take: size,
  };
}

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
