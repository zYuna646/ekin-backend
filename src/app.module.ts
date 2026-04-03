import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { VisiModule } from './visi/visi.module';
import { MisiModule } from './misi/misi.module';
import { RenstraModule } from './renstra/renstra.module';
import { TujuanModule } from './tujuan/tujuan.module';
import { AuthModule } from './auth/auth.module';
import { ProgramModule } from './program/program.module';
import { KegiatanModule } from './kegiatan/kegiatan.module';
import { SubKegiatanModule } from './sub-kegiatan/sub-kegiatan.module';
import { IdasnModule } from './idasn/idasn.module';

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
    ProgramModule,
    KegiatanModule,
    SubKegiatanModule,
    IdasnModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
