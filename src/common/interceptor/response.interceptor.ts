import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { IApiResponse } from '../interface/api.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  IApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IApiResponse<T>> | Promise<Observable<IApiResponse<T>>> {
    return next.handle().pipe(
      map((response: T | IApiResponse<T>) => {
        const res = response as IApiResponse<T>;
        const data = res.data || null;
        const message = res.message || 'Success';
        const code = res.code || 200;
        const pagination = res.pagination || null;
        const status = res.status || 'success';
        return {
          status,
          code,
          message,
          data,
          pagination,
        };
      }),
    );
  }
}
