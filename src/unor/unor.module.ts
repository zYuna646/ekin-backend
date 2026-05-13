import { Module } from '@nestjs/common';
import { UnorService } from './unor.service';
import { UnorController } from './unor.controller';
import { IdasnModule } from 'src/idasn/idasn.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [IdasnModule, PrismaModule],
  controllers: [UnorController],
  providers: [UnorService],
})
export class UnorModule {}
