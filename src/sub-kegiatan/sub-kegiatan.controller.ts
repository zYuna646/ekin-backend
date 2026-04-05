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
import { Owner } from 'src/auth/decorator/owner.decorator';
import { OwnerGuard } from 'src/auth/guard/owner.guard';
import {
  COMPARISON_OPERATOR,
  MODEL_LIST,
  OWNER_FIELD_LIST,
  COMPARISION_USER_FIELD_LIST,
} from 'src/common/const/common.const';

@UseGuards(JwtGuard, RolesGuard)
@Controller('sub-kegiatan')
export class SubKegiatanController {
  constructor(private readonly subKegiatanService: SubKegiatanService) {}

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Post()
  create(
    @Body() createSubKegiatanDto: CreateSubKegiatanDto,
  ): Promise<IApiResponse<ISubKegiatan> | null> {
    return this.subKegiatanService.create(createSubKegiatanDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersSubKegiatanDto,
    @Request() req: any,
  ): Promise<IApiResponse<ISubKegiatan[]> | null> {
    // If user has UMPEG role but NOT ADMIN, restrict to user's UMPEG units
    if (
      req.user?.roles?.includes(ROLES.UMPEG) &&
      !req.user?.roles?.includes(ROLES.ADMIN) &&
      req.user?.umpeg
    ) {
      filters.unitIds = req.user.umpeg;
    }
    return this.subKegiatanService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<ISubKegiatan> | null> {
    return this.subKegiatanService.findOne(id);
  }

  @Owner(MODEL_LIST.SUB_KEGIATAN, OWNER_FIELD_LIST.SUB_KEGIATAN_OWNER, {
    operator: COMPARISON_OPERATOR.EQUAL,
    userField: COMPARISION_USER_FIELD_LIST.UMPEG,
  })
  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @UseGuards(OwnerGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubKegiatanDto: UpdateSubKegiatanDto,
  ): Promise<IApiResponse<ISubKegiatan> | null> {
    return this.subKegiatanService.update(id, updateSubKegiatanDto);
  }

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Owner(MODEL_LIST.SUB_KEGIATAN, OWNER_FIELD_LIST.SUB_KEGIATAN_OWNER, {
    operator: COMPARISON_OPERATOR.EQUAL,
    userField: COMPARISION_USER_FIELD_LIST.UMPEG,
  })
  @UseGuards(OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<ISubKegiatan> | null> {
    return this.subKegiatanService.remove(id);
  }
}
