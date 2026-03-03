import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MisiService } from './misi.service';
import { CreateMisiDto } from './dto/create-misi.dto';
import { UpdateMisiDto } from './dto/update-misi.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { IMisi } from './interface/misi.interface';
import { FiltersMisiDto } from './dto/filters-misi.dto';

@Controller('misi')
export class MisiController {
  constructor(private readonly misiService: MisiService) {}

  @Post()
  create(
    @Body() createMisiDto: CreateMisiDto,
  ): Promise<IApiResponse<IMisi> | null> {
    return this.misiService.create(createMisiDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersMisiDto,
  ): Promise<IApiResponse<IMisi[]> | null> {
    return this.misiService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IMisi> | null> {
    return this.misiService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMisiDto: UpdateMisiDto,
  ): Promise<IApiResponse<IMisi> | null> {
    return this.misiService.update(id, updateMisiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IMisi> | null> {
    return this.misiService.remove(id);
  }
}
