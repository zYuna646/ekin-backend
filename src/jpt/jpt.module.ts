import { Module } from '@nestjs/common';
import { JptService } from './jpt.service';
import { JptController } from './jpt.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JptController],
  providers: [JptService],
})
export class JptModule {}
