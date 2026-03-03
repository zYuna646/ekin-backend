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
import { VisiService } from './visi.service';
import { CreateVisiDto } from './dto/create-visi.dto';
import { UpdateVisiDto } from './dto/update-visi.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { IVisi } from './interface/visi.interface';
import { FiltersVisiDto } from './dto/filters-visi.dto';

@Controller('visi')
export class VisiController {
  constructor(private readonly visiService: VisiService) {}

  @Post()
  create(
    @Body() createVisiDto: CreateVisiDto,
  ): Promise<IApiResponse<IVisi> | null> {
    return this.visiService.create(createVisiDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersVisiDto,
  ): Promise<IApiResponse<IVisi[]> | null> {
    return this.visiService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IVisi> | null> {
    return this.visiService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVisiDto: UpdateVisiDto,
  ): Promise<IApiResponse<IVisi> | null> {
    return this.visiService.update(id, updateVisiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IVisi> | null> {
    return this.visiService.remove(id);
  }
}
