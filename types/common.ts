export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface Translations {
  name?: string;
  description?: string;
  language: string;
  id: number;
  code?: string | null;
}