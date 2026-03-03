import { Module } from '@nestjs/common';
import { VisiService } from './visi.service';
import { VisiController } from './visi.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VisiController],
  providers: [VisiService],
})
export class VisiModule {}
