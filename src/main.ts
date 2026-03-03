import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-execption.filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error']
        : ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') ?? 3000;
  const host = configService.get<string>('HOST') ?? 'localhost';

  const corsOrigin = configService.get<string>('CORS_ORIGIN') ?? '*';
  const corsMethods =
    configService.get<string>('CORS_METHODS') ??
    'GET,HEAD,PUT,PATCH,POST,DELETE';
  const corsCredentials =
    configService.get<boolean>('CORS_CREDENTIALS') ?? true;

  app.enableCors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
    methods: corsMethods.split(',').map((method) => method.trim()),
    credentials: corsCredentials,
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(port, host);
  const url = await app.getUrl();
  logger.log(`Application is running on: ${url}`);
}
bootstrap();
