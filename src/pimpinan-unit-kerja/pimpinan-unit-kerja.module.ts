import { Module } from '@nestjs/common';
import { PimpinanUnitKerjaService } from './pimpinan-unit-kerja.service';
import { PimpinanUnitKerjaController } from './pimpinan-unit-kerja.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PimpinanUnitKerjaController],
  providers: [PimpinanUnitKerjaService],
})
export class PimpinanUnitKerjaModule {}
