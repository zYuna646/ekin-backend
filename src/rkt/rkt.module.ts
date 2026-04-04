import { Module } from '@nestjs/common';
import { RktService } from './rkt.service';
import { RktController } from './rkt.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RktController],
  providers: [RktService],
})
export class RktModule {}
