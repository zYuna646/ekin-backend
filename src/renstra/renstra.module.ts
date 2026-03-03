import { Module } from '@nestjs/common';
import { RenstraService } from './renstra.service';
import { RenstraController } from './renstra.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RenstraController],
  providers: [RenstraService],
})
export class RenstraModule {}
