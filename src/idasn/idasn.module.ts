import { Module } from '@nestjs/common';
import { IdasnService } from './idasn.service';
import { IdasnController } from './idasn.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UnorService } from './services/unor.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL:
          configService.get<string>('IDASN_API_URL') ??
          'http://localhost:3000/api',
        timeout: configService.get<number>('IDASN_TIMEOUT') ?? 10000,
        maxRedirects: configService.get<number>('IDASN_MAX_REDIRECTS') ?? 5,
      }),
    }),
  ],
  controllers: [IdasnController],
  providers: [IdasnService, UnorService],
  exports: [UnorService],
})
export class IdasnModule {}
