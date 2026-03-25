import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { VisiModule } from './visi/visi.module';
import { MisiModule } from './misi/misi.module';
import { RenstraModule } from './renstra/renstra.module';
import { TujuanModule } from './tujuan/tujuan.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    VisiModule,
    MisiModule,
    RenstraModule,
    TujuanModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
