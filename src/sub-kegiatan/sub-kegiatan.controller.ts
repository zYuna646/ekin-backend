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
import { SubKegiatanService } from './sub-kegiatan.service';
import { CreateSubKegiatanDto } from './dto/create-sub-kegiatan.dto';
import { UpdateSubKegiatanDto } from './dto/update-sub-kegiatan.dto';
import { FiltersSubKegiatanDto } from './dto/filters-sub-kegiatan.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { ISubKegiatan } from './interface/sub-kegiatan.interface';

@Controller('sub-kegiatan')
export class SubKegiatanController {
  constructor(private readonly subKegiatanService: SubKegiatanService) {}

  @Post()
  create(
    @Body() createSubKegiatanDto: CreateSubKegiatanDto,
  ): Promise<IApiResponse<ISubKegiatan> | null> {
    return this.subKegiatanService.create(createSubKegiatanDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersSubKegiatanDto,
  ): Promise<IApiResponse<ISubKegiatan[]> | null> {
    return this.subKegiatanService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<ISubKegiatan> | null> {
    return this.subKegiatanService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubKegiatanDto: UpdateSubKegiatanDto,
  ): Promise<IApiResponse<ISubKegiatan> | null> {
    return this.subKegiatanService.update(id, updateSubKegiatanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<ISubKegiatan> | null> {
    return this.subKegiatanService.remove(id);
  }
}
