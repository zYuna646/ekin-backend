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
import { RenstraService } from './renstra.service';
import { CreateRenstraDto } from './dto/create-renstra.dto';
import { UpdateRenstraDto } from './dto/update-renstra.dto';
import { IRenstra } from './interface/renstra.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { FiltersRenstraDto } from './dto/filters-renstra.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ROLES } from 'src/common/const/role.const';

@UseGuards(JwtGuard, RolesGuard)
@Controller('renstra')
export class RenstraController {
  constructor(private readonly renstraService: RenstraService) {}

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Post()
  create(
    @Body() createRenstraDto: CreateRenstraDto,
  ): Promise<IApiResponse<IRenstra> | null> {
    return this.renstraService.create(createRenstraDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersRenstraDto,
  ): Promise<IApiResponse<IRenstra[]> | null> {
    return this.renstraService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IRenstra> | null> {
    return this.renstraService.findOne(id);
  }

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRenstraDto: UpdateRenstraDto,
  ): Promise<IApiResponse<IRenstra> | null> {
    return this.renstraService.update(id, updateRenstraDto);
  }

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IRenstra> | null> {
    return this.renstraService.remove(id);
  }
}
