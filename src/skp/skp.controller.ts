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
import { SkpService } from './skp.service';
import { CreateSkpDto } from './dto/create-skp.dto';
import { UpdateSkpDto } from './dto/update-skp.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { ISkp } from './interface/skp.interface';
import { FiltersSkpDto } from './dto/filters-skp.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { OwnerGuard } from 'src/auth/guard/owner.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Owner } from 'src/auth/decorator/owner.decorator';
import { ROLES } from 'src/common/const/role.const';
import { MODEL_LIST } from 'src/common/const/common.const';

@UseGuards(JwtGuard, RolesGuard)
@Controller('skp')
export class SkpController {
  constructor(private readonly skpService: SkpService) {}

  @Roles(ROLES.JPT)
  @Post()
  create(
    @Body() createSkpDto: CreateSkpDto,
  ): Promise<IApiResponse<ISkp> | null> {
    return this.skpService.create(createSkpDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersSkpDto,
  ): Promise<IApiResponse<ISkp[]> | null> {
    return this.skpService.findAll(filters);
  }

  @Owner(MODEL_LIST.SKP, 'nip')
  @Roles(ROLES.JPT)
  @UseGuards(OwnerGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<ISkp> | null> {
    return this.skpService.findOne(id);
  }

  @Owner(MODEL_LIST.SKP, 'nip')
  @Roles(ROLES.JPT)
  @UseGuards(OwnerGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSkpDto: UpdateSkpDto,
  ): Promise<IApiResponse<ISkp> | null> {
    return this.skpService.update(id, updateSkpDto);
  }

  @Owner(MODEL_LIST.SKP, 'nip')
  @Roles(ROLES.JPT)
  @UseGuards(OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<ISkp> | null> {
    return this.skpService.remove(id);
  }
}
