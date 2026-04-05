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
  Request,
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
import { Owner } from 'src/auth/decorator/owner.decorator';
import { OwnerGuard } from 'src/auth/guard/owner.guard';
import {
  COMPARISON_OPERATOR,
  MODEL_LIST,
  OWNER_FIELD_LIST,
  COMPARISION_USER_FIELD_LIST,
} from 'src/common/const/common.const';

@UseGuards(JwtGuard, RolesGuard)
@Controller('tujuan')
export class TujuanController {
  constructor(private readonly tujuanService: TujuanService) {}

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Post()
  create(
    @Body() createTujuanDto: CreateTujuanDto,
  ): Promise<IApiResponse<ITujuan> | null> {
    return this.tujuanService.create(createTujuanDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersTujuanDto,
    @Request() req: any,
  ): Promise<IApiResponse<ITujuan[]> | null> {
    // If user has UMPEG role but NOT ADMIN, restrict to user's UMPEG units
    if (
      req.user?.roles?.includes(ROLES.UMPEG) &&
      !req.user?.roles?.includes(ROLES.ADMIN) &&
      req.user?.umpeg
    ) {
      filters.unitIds = req.user.umpeg;
    }
    return this.tujuanService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<ITujuan> | null> {
    return this.tujuanService.findOne(id);
  }

  @Owner(MODEL_LIST.TUJUAN, OWNER_FIELD_LIST.TUJUAN_OWNER, {
    operator: COMPARISON_OPERATOR.EQUAL,
    userField: COMPARISION_USER_FIELD_LIST.UMPEG,
  })
  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @UseGuards(OwnerGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTujuanDto: UpdateTujuanDto,
  ): Promise<IApiResponse<ITujuan> | null> {
    return this.tujuanService.update(id, updateTujuanDto);
  }

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Owner(MODEL_LIST.TUJUAN, OWNER_FIELD_LIST.TUJUAN_OWNER, {
    operator: COMPARISON_OPERATOR.EQUAL,
    userField: COMPARISION_USER_FIELD_LIST.UMPEG,
  })
  @UseGuards(OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<ITujuan> | null> {
    return this.tujuanService.remove(id);
  }
}
