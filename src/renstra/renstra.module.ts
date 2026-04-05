import { Module } from '@nestjs/common';
import { RenstraService } from './renstra.service';
import { RenstraController } from './renstra.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IdasnModule } from 'src/idasn/idasn.module';

@Module({
  imports: [PrismaModule, IdasnModule],
  controllers: [RenstraController],
  providers: [RenstraService],
})
export class RenstraModule {}
