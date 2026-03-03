import { statusApi } from '../enum/status.enum';

export interface IPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface IApiResponse<T> {
  data: T | null;
  message: string;
  code: number;
  status: statusApi;
  pagination?: IPagination | null;
}
