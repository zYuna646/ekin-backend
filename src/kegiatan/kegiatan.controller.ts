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
import { KegiatanService } from './kegiatan.service';
import { CreateKegiatanDto } from './dto/create-kegiatan.dto';
import { UpdateKegiatanDto } from './dto/update-kegiatan.dto';
import { FiltersKegiatanDto } from './dto/filters-kegiatan.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { IKegiatan } from './interface/kegiatan.interface';

@Controller('kegiatan')
export class KegiatanController {
  constructor(private readonly kegiatanService: KegiatanService) {}

  @Post()
  create(
    @Body() createKegiatanDto: CreateKegiatanDto,
  ): Promise<IApiResponse<IKegiatan> | null> {
    return this.kegiatanService.create(createKegiatanDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersKegiatanDto,
  ): Promise<IApiResponse<IKegiatan[]> | null> {
    return this.kegiatanService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IKegiatan> | null> {
    return this.kegiatanService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateKegiatanDto: UpdateKegiatanDto,
  ): Promise<IApiResponse<IKegiatan> | null> {
    return this.kegiatanService.update(id, updateKegiatanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IKegiatan> | null> {
    return this.kegiatanService.remove(id);
  }
}
