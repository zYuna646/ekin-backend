import { Module } from '@nestjs/common';
import { SkpService } from './skp.service';
import { SkpController } from './skp.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { IdasnModule } from 'src/idasn/idasn.module';

@Module({
  imports: [PrismaModule, AuthModule, IdasnModule],
  controllers: [SkpController],
  providers: [SkpService],
})
export class SkpModule {}
