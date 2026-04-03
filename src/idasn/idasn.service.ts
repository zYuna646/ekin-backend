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
      return await firstValueFrom(
        this.http.get<T>(endpoint, {
          ...config,
          params,
        }),
      );
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
      return await firstValueFrom(this.http.post<T>(endpoint, body, config));
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
      return await firstValueFrom(this.http.put<T>(endpoint, body, config));
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
      return await firstValueFrom(this.http.patch<T>(endpoint, body, config));
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
      return await firstValueFrom(
        this.http.delete<T>(endpoint, {
          ...config,
          params,
        }),
      );
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
