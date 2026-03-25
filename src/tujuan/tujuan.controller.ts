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
import { TujuanService } from './tujuan.service';
import { CreateTujuanDto } from './dto/create-tujuan.dto';
import { UpdateTujuanDto } from './dto/update-tujuan.dto';
import { FiltersTujuanDto } from './dto/filters-tujuan.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { ITujuan } from './interface/tujuan.interface';

@Controller('tujuan')
export class TujuanController {
  constructor(private readonly tujuanService: TujuanService) {}

  @Post()
  create(
    @Body() createTujuanDto: CreateTujuanDto,
  ): Promise<IApiResponse<ITujuan> | null> {
    return this.tujuanService.create(createTujuanDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersTujuanDto,
  ): Promise<IApiResponse<ITujuan[]> | null> {
    return this.tujuanService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<ITujuan> | null> {
    return this.tujuanService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTujuanDto: UpdateTujuanDto,
  ): Promise<IApiResponse<ITujuan> | null> {
    return this.tujuanService.update(id, updateTujuanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<ITujuan> | null> {
    return this.tujuanService.remove(id);
  }
}
