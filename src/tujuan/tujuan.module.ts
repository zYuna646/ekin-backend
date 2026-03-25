import { Module } from '@nestjs/common';
import { TujuanService } from './tujuan.service';
import { TujuanController } from './tujuan.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TujuanController],
  providers: [TujuanService],
})
export class TujuanModule {}
