import { Module } from '@nestjs/common';
import { MisiService } from './misi.service';
import { MisiController } from './misi.controller';

@Module({
  controllers: [MisiController],
  providers: [MisiService],
})
export class MisiModule {}
