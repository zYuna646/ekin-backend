import { Module } from '@nestjs/common';
import { PeriodePenilaianService } from './periode-penilaian.service';
import { PeriodePenilaianController } from './periode-penilaian.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IdasnModule } from 'src/idasn/idasn.module';

@Module({
  imports: [PrismaModule, IdasnModule],
  controllers: [PeriodePenilaianController],
  providers: [PeriodePenilaianService],
})
export class PeriodePenilaianModule {}
