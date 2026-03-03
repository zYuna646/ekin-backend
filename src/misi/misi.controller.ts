import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MisiService } from './misi.service';
import { CreateMisiDto } from './dto/create-misi.dto';
import { UpdateMisiDto } from './dto/update-misi.dto';

@Controller('misi')
export class MisiController {
  constructor(private readonly misiService: MisiService) {}

  @Post()
  create(@Body() createMisiDto: CreateMisiDto) {
    return this.misiService.create(createMisiDto);
  }

  @Get()
  findAll() {
    return this.misiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.misiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMisiDto: UpdateMisiDto) {
    return this.misiService.update(+id, updateMisiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.misiService.remove(+id);
  }
}
