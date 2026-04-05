import { Module } from '@nestjs/common';
import { RktService } from './rkt.service';
import { RktController } from './rkt.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IdasnModule } from 'src/idasn/idasn.module';

@Module({
  imports: [PrismaModule, IdasnModule],
  controllers: [RktController],
  providers: [RktService],
})
export class RktModule {}
