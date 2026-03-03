import { StatusApi } from '../enum/status.enum';

export interface IPagination {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface IApiResponse<T> {
  data: T | null;
  message: string;
  code: number;
  status: StatusApi;
  pagination?: IPagination | null;
}
