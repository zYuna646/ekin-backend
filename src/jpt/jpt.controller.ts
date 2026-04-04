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
import { JptService } from './jpt.service';
import { CreateJptDto } from './dto/create-jpt.dto';
import { UpdateJptDto } from './dto/update-jpt.dto';
import { FiltersJptDto } from './dto/filters-jpt.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { IJpt } from './interface/jpt.interface';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ROLES } from 'src/common/const/role.const';

@UseGuards(JwtGuard, RolesGuard)
@Controller('jpt')
export class JptController {
  constructor(private readonly jptService: JptService) {}

  @Roles(ROLES.ADMIN)
  @Post()
  create(
    @Body() createJptDto: CreateJptDto,
  ): Promise<IApiResponse<IJpt> | null> {
    return this.jptService.create(createJptDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersJptDto,
  ): Promise<IApiResponse<IJpt[]> | null> {
    return this.jptService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IJpt> | null> {
    return this.jptService.findOne(id);
  }

  @Roles(ROLES.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJptDto: UpdateJptDto,
  ): Promise<IApiResponse<IJpt> | null> {
    return this.jptService.update(id, updateJptDto);
  }

  @Roles(ROLES.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IJpt> | null> {
    return this.jptService.remove(id);
  }
}
