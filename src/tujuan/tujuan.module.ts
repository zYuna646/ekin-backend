import { Module } from '@nestjs/common';
import { TujuanService } from './tujuan.service';
import { TujuanController } from './tujuan.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IdasnModule } from 'src/idasn/idasn.module';

@Module({
  imports: [PrismaModule, IdasnModule],
  controllers: [TujuanController],
  providers: [TujuanService],
})
export class TujuanModule {}
