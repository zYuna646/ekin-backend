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
import { PeriodePenilaianService } from './periode-penilaian.service';
import { CreatePeriodePenilaianDto } from './dto/create-periode-penilaian.dto';
import { UpdatePeriodePenilaianDto } from './dto/update-periode-penilaian.dto';
import { IPeriodePenilaian } from './interface/periode-penilaian.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { FiltersPeriodePenilaianDto } from './dto/filters-periode-penilaian.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ROLES } from 'src/common/const/role.const';
import { Owner } from 'src/auth/decorator/owner.decorator';
import {
  COMPARISON_OPERATOR,
  MODEL_LIST,
  OWNER_FIELD_LIST,
  COMPARISION_USER_FIELD_LIST,
} from 'src/common/const/common.const';
import { OwnerGuard } from 'src/auth/guard/owner.guard';

@UseGuards(JwtGuard, RolesGuard)
@Controller('periode-penilaian')
export class PeriodePenilaianController {
  constructor(private readonly periodePenilaianService: PeriodePenilaianService) {}

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Post()
  create(
    @Body() createPeriodePenilaianDto: CreatePeriodePenilaianDto,
  ): Promise<IApiResponse<IPeriodePenilaian> | null> {
    return this.periodePenilaianService.create(createPeriodePenilaianDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersPeriodePenilaianDto,
    @Request() req: any,
  ): Promise<IApiResponse<IPeriodePenilaian[]> | null> {
    // If user has UMPEG role but NOT ADMIN, restrict to user's UMPEG units
    if (
      req.user?.roles?.includes(ROLES.UMPEG) &&
      !req.user?.roles?.includes(ROLES.ADMIN) &&
      req.user?.umpeg
    ) {
      filters.unitIds = req.user.umpeg;
    }
    return this.periodePenilaianService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IPeriodePenilaian> | null> {
    return this.periodePenilaianService.findOne(id);
  }

  @Owner(MODEL_LIST.PERIODE_PENILAIAN, OWNER_FIELD_LIST.PERIODE_PENILAIAN_OWNER, {
    operator: COMPARISON_OPERATOR.EQUAL,
    userField: COMPARISION_USER_FIELD_LIST.ROLES,
  })
  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @UseGuards(OwnerGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePeriodePenilaianDto: UpdatePeriodePenilaianDto,
  ): Promise<IApiResponse<IPeriodePenilaian> | null> {
    return this.periodePenilaianService.update(id, updatePeriodePenilaianDto);
  }

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Owner(MODEL_LIST.PERIODE_PENILAIAN, OWNER_FIELD_LIST.PERIODE_PENILAIAN_OWNER, {
    operator: COMPARISON_OPERATOR.EQUAL,
    userField: COMPARISION_USER_FIELD_LIST.ROLES,
  })
  @UseGuards(OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IPeriodePenilaian> | null> {
    return this.periodePenilaianService.remove(id);
  }
}
