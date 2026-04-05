import { Module } from '@nestjs/common';
import { KegiatanService } from './kegiatan.service';
import { KegiatanController } from './kegiatan.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IdasnModule } from 'src/idasn/idasn.module';

@Module({
  imports: [PrismaModule, IdasnModule],
  controllers: [KegiatanController],
  providers: [KegiatanService],
})
export class KegiatanModule {}
