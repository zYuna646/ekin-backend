import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { IIdasnResponse } from './interface/idasn.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IdasnService {
  protected readonly baseLogger = new Logger(IdasnService.name);
  constructor(
    private readonly http: HttpService,
    protected readonly configService: ConfigService,
  ) {}

  /* ===================== GET ===================== */
  protected async get<T, P extends object = object>(
    endpoint: string,
    params?: P,
    config?: AxiosRequestConfig,
  ): Promise<IIdasnResponse<T>> {
    try {
      this.logInfo(
        'GET',
        endpoint,
        `Fetching data with params: ${JSON.stringify(params)}`,
      );
      const response = await firstValueFrom(
        this.http.get<IIdasnResponse<T>>(endpoint, {
          ...config,
          params,
        }),
      );
      return response.data;
    } catch (error) {
      this.logError('GET', endpoint, error);
      throw error;
    }
  }

  /* ===================== POST ===================== */
  protected async post<T, B extends object = object>(
    endpoint: string,
    body: B,
    config?: AxiosRequestConfig,
  ): Promise<IIdasnResponse<T>> {
    try {
      this.logInfo('POST', endpoint, `Posting data: ${JSON.stringify(body)}`);
      const response = await firstValueFrom(
        this.http.post<IIdasnResponse<T>>(endpoint, body, config),
      );
      return response.data;
    } catch (error) {
      this.logError('POST', endpoint, error);
      throw error;
    }
  }

  /* ===================== PUT ===================== */
  protected async put<T, B extends object = object>(
    endpoint: string,
    body: B,
    config?: AxiosRequestConfig,
  ): Promise<IIdasnResponse<T>> {
    try {
      this.logInfo('PUT', endpoint, `Putting data: ${JSON.stringify(body)}`);
      const response = await firstValueFrom(
        this.http.put<IIdasnResponse<T>>(endpoint, body, config),
      );
      return response.data;
    } catch (error) {
      this.logError('PUT', endpoint, error);
      throw error;
    }
  }

  /* ===================== PATCH ===================== */
  protected async patch<T, B extends object = object>(
    endpoint: string,
    body: B,
    config?: AxiosRequestConfig,
  ): Promise<IIdasnResponse<T>> {
    try {
      this.logInfo('PATCH', endpoint, `Patching data: ${JSON.stringify(body)}`);
      const response = await firstValueFrom(
        this.http.patch<IIdasnResponse<T>>(endpoint, body, config),
      );
      return response.data;
    } catch (error) {
      this.logError('PATCH', endpoint, error);
      throw error;
    }
  }

  /* ===================== DELETE ===================== */
  protected async delete<T, P extends object = object>(
    endpoint: string,
    params?: P,
    config?: AxiosRequestConfig,
  ): Promise<IIdasnResponse<T>> {
    try {
      this.logInfo(
        'DELETE',
        endpoint,
        `Deleting with params: ${JSON.stringify(params)}`,
      );
      const response = await firstValueFrom(
        this.http.delete<IIdasnResponse<T>>(endpoint, {
          ...config,
          params,
        }),
      );
      return response.data;
    } catch (error) {
      this.logError('DELETE', endpoint, error);
      throw error;
    }
  }

  /* ===================== PRIVATE ===================== */
  protected logError(method: string, endpoint: string, error: unknown) {
    this.baseLogger.error(
      `[IDASN API] ${method} ${endpoint} failed`,
      error instanceof Error ? error.message : error,
    );
  }

  private logInfo(method: string, endpoint: string, message: string) {
    this.baseLogger.log(`[IDASN API] ${method} ${endpoint}: ${message}`);
  }
}
