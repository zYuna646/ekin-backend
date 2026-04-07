import { Module } from '@nestjs/common';
import { UnorService } from './unor.service';
import { UnorController } from './unor.controller';
import { IdasnModule } from 'src/idasn/idasn.module';

@Module({
  imports: [IdasnModule],
  controllers: [UnorController],
  providers: [UnorService],
})
export class UnorModule {}
