// types/api.types.ts
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiMeta {
  paging?: PagingMeta;
  [key: string]: any;
}

export interface PagingMeta {
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Custom error class for API errors
export class ApiException extends Error {
  code: string;
  details?: any;
  statusCode?: number;

  constructor(message: string, code: string, details?: any, statusCode?: number) {
    super(message);
    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
    this.name = 'ApiException';
  }
}