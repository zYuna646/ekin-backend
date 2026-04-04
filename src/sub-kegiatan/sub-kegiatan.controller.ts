import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubKegiatanService } from './sub-kegiatan.service';
import { CreateSubKegiatanDto } from './dto/create-sub-kegiatan.dto';
import { UpdateSubKegiatanDto } from './dto/update-sub-kegiatan.dto';
import { FiltersSubKegiatanDto } from './dto/filters-sub-kegiatan.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { ISubKegiatan } from './interface/sub-kegiatan.interface';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ROLES } from 'src/common/const/role.const';

@UseGuards(JwtGuard, RolesGuard)
@Controller('sub-kegiatan')
export class SubKegiatanController {
  constructor(private readonly subKegiatanService: SubKegiatanService) {}

  @Roles(ROLES.ADMIN)
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

  @Roles(ROLES.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubKegiatanDto: UpdateSubKegiatanDto,
  ): Promise<IApiResponse<ISubKegiatan> | null> {
    return this.subKegiatanService.update(id, updateSubKegiatanDto);
  }

  @Roles(ROLES.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<ISubKegiatan> | null> {
    return this.subKegiatanService.remove(id);
  }
}
