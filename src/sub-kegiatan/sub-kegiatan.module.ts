import { Module } from '@nestjs/common';
import { SubKegiatanService } from './sub-kegiatan.service';
import { SubKegiatanController } from './sub-kegiatan.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IdasnModule } from 'src/idasn/idasn.module';

@Module({
  imports: [PrismaModule, IdasnModule],
  controllers: [SubKegiatanController],
  providers: [SubKegiatanService],
})
export class SubKegiatanModule {}
