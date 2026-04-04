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
import { VisiService } from './visi.service';
import { CreateVisiDto } from './dto/create-visi.dto';
import { UpdateVisiDto } from './dto/update-visi.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { IVisi } from './interface/visi.interface';
import { FiltersVisiDto } from './dto/filters-visi.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ROLES } from 'src/common/const/role.const';

@UseGuards(JwtGuard, RolesGuard)
@Controller('visi')
export class VisiController {
  constructor(private readonly visiService: VisiService) {}

  @Roles(ROLES.ADMIN)
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

  @Roles(ROLES.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVisiDto: UpdateVisiDto,
  ): Promise<IApiResponse<IVisi> | null> {
    return this.visiService.update(id, updateVisiDto);
  }

  @Roles(ROLES.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IVisi> | null> {
    return this.visiService.remove(id);
  }
}
