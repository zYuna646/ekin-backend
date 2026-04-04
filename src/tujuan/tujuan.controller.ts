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
import { TujuanService } from './tujuan.service';
import { CreateTujuanDto } from './dto/create-tujuan.dto';
import { UpdateTujuanDto } from './dto/update-tujuan.dto';
import { FiltersTujuanDto } from './dto/filters-tujuan.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { ITujuan } from './interface/tujuan.interface';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ROLES } from 'src/common/const/role.const';

@UseGuards(JwtGuard, RolesGuard)
@Controller('tujuan')
export class TujuanController {
  constructor(private readonly tujuanService: TujuanService) {}

  @Roles(ROLES.ADMIN)
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

  @Roles(ROLES.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTujuanDto: UpdateTujuanDto,
  ): Promise<IApiResponse<ITujuan> | null> {
    return this.tujuanService.update(id, updateTujuanDto);
  }

  @Roles(ROLES.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<ITujuan> | null> {
    return this.tujuanService.remove(id);
  }
}
