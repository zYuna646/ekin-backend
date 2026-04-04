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
import { UmpegService } from './umpeg.service';
import { CreateUmpegDto } from './dto/create-umpeg.dto';
import { UpdateUmpegDto } from './dto/update-umpeg.dto';
import { FiltersUmpegDto } from './dto/filters-umpeg.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { IUmpeg } from './interface/umpeg.interface';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ROLES } from 'src/common/const/role.const';

@UseGuards(JwtGuard, RolesGuard)
@Controller('umpeg')
export class UmpegController {
  constructor(private readonly umpegService: UmpegService) {}

  @Roles(ROLES.ADMIN)
  @Post()
  create(
    @Body() createUmpegDto: CreateUmpegDto,
  ): Promise<IApiResponse<IUmpeg> | null> {
    return this.umpegService.create(createUmpegDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersUmpegDto,
  ): Promise<IApiResponse<IUmpeg[]> | null> {
    return this.umpegService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IUmpeg> | null> {
    return this.umpegService.findOne(id);
  }

  @Roles(ROLES.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUmpegDto: UpdateUmpegDto,
  ): Promise<IApiResponse<IUmpeg> | null> {
    return this.umpegService.update(id, updateUmpegDto);
  }

  @Roles(ROLES.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IUmpeg> | null> {
    return this.umpegService.remove(id);
  }
}
