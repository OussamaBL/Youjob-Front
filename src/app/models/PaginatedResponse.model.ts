export interface PaginatedResponse<T> {
  content: T[];  // Data content
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
