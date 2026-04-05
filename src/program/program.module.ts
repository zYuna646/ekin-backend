import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IdasnModule } from 'src/idasn/idasn.module';

@Module({
  imports: [PrismaModule, IdasnModule],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
