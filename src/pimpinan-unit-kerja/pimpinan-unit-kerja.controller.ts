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
import { PimpinanUnitKerjaService } from './pimpinan-unit-kerja.service';
import { CreatePimpinanUnitKerjaDto } from './dto/create-pimpinan-unit-kerja.dto';
import { UpdatePimpinanUnitKerjaDto } from './dto/update-pimpinan-unit-kerja.dto';
import { FiltersPimpinanUnitKerjaDto } from './dto/filters-pimpinan-unit-kerja.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { IPimpinanUnitKerja } from './interface/pimpinan-unit-kerja.interface';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ROLES } from 'src/common/const/role.const';

@UseGuards(JwtGuard, RolesGuard)
@Controller('pimpinan-unit-kerja')
export class PimpinanUnitKerjaController {
  constructor(
    private readonly pimpinanUnitKerjaService: PimpinanUnitKerjaService,
  ) {}

  @Roles(ROLES.ADMIN)
  @Post()
  create(
    @Body() createPimpinanUnitKerjaDto: CreatePimpinanUnitKerjaDto,
  ): Promise<IApiResponse<IPimpinanUnitKerja> | null> {
    return this.pimpinanUnitKerjaService.create(createPimpinanUnitKerjaDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersPimpinanUnitKerjaDto,
  ): Promise<IApiResponse<IPimpinanUnitKerja[]> | null> {
    return this.pimpinanUnitKerjaService.findAll(filters);
  }

  @Get('unit/:unitId')
  findByUnitId(
    @Param('unitId') unitId: string,
  ): Promise<IApiResponse<IPimpinanUnitKerja[]> | null> {
    return this.pimpinanUnitKerjaService.findByUnitId(unitId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IPimpinanUnitKerja> | null> {
    return this.pimpinanUnitKerjaService.findOne(id);
  }

  @Roles(ROLES.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePimpinanUnitKerjaDto: UpdatePimpinanUnitKerjaDto,
  ): Promise<IApiResponse<IPimpinanUnitKerja> | null> {
    return this.pimpinanUnitKerjaService.update(id, updatePimpinanUnitKerjaDto);
  }

  @Roles(ROLES.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IPimpinanUnitKerja> | null> {
    return this.pimpinanUnitKerjaService.remove(id);
  }
}
