import { Module } from '@nestjs/common';
import { SubKegiatanService } from './sub-kegiatan.service';
import { SubKegiatanController } from './sub-kegiatan.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubKegiatanController],
  providers: [SubKegiatanService],
})
export class SubKegiatanModule {}
