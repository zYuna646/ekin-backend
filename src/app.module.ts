import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { VisiModule } from './visi/visi.module';
import { MisiModule } from './misi/misi.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    VisiModule,
    MisiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
