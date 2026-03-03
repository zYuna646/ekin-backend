import { Module } from '@nestjs/common';
import { MisiService } from './misi.service';
import { MisiController } from './misi.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MisiController],
  providers: [MisiService],
})
export class MisiModule {}
