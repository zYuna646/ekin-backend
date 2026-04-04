import { Module } from '@nestjs/common';
import { UmpegService } from './umpeg.service';
import { UmpegController } from './umpeg.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UmpegController],
  providers: [UmpegService],
})
export class UmpegModule {}
