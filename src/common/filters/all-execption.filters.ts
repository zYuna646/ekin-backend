import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  ConflictException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { statusApi } from '../enum/status.enum';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    const status: statusApi = statusApi.ERROR;

    if (exception instanceof BadRequestException) {
      const response = exception.getResponse() as {
        message: string | string[];
      };
      message = response.message || 'An error occurred';
      code = exception.getStatus();
    } else if (exception instanceof ConflictException) {
      message = exception.message || 'Conflict error';
      code = exception.getStatus();
    } else if (exception instanceof HttpException) {
      message = exception.message || 'Bad request error';
      code = exception.getStatus();
    } else if (exception instanceof Error) {
      message = exception.message;
      code = HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      message = 'An unexpected error occurred';
      code = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(code).json({
      status,
      code,
      message,
      data: null,
    });
  }
}
