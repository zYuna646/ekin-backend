import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesGuard } from './guard/roles.guard';
import { OwnerGuard } from './guard/owner.guard';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL:
          configService.get<string>('IDASN_AUTH_URL') ??
          'http://localhost:3000/api',
        timeout: configService.get<number>('IDASN_TIMEOUT') ?? 10000,
        maxRedirects: configService.get<number>('IDASN_MAX_REDIRECTS') ?? 5,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, OwnerGuard],
  exports: [PassportModule, RolesGuard, OwnerGuard],
})
export class AuthModule {}
