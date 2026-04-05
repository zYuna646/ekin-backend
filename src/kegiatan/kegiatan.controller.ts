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
import { KegiatanService } from './kegiatan.service';
import { CreateKegiatanDto } from './dto/create-kegiatan.dto';
import { UpdateKegiatanDto } from './dto/update-kegiatan.dto';
import { FiltersKegiatanDto } from './dto/filters-kegiatan.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { IKegiatan } from './interface/kegiatan.interface';
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
@Controller('kegiatan')
export class KegiatanController {
  constructor(private readonly kegiatanService: KegiatanService) {}

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Post()
  create(
    @Body() createKegiatanDto: CreateKegiatanDto,
  ): Promise<IApiResponse<IKegiatan> | null> {
    return this.kegiatanService.create(createKegiatanDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersKegiatanDto,
    @Request() req: any,
  ): Promise<IApiResponse<IKegiatan[]> | null> {
    // If user has UMPEG role but NOT ADMIN, restrict to user's UMPEG units
    if (
      req.user?.roles?.includes(ROLES.UMPEG) &&
      !req.user?.roles?.includes(ROLES.ADMIN) &&
      req.user?.umpeg
    ) {
      filters.unitIds = req.user.umpeg;
    }
    return this.kegiatanService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IKegiatan> | null> {
    return this.kegiatanService.findOne(id);
  }

  @Owner(MODEL_LIST.KEGIATAN, OWNER_FIELD_LIST.KEGIATAN_OWNER, {
    operator: COMPARISON_OPERATOR.EQUAL,
    userField: COMPARISION_USER_FIELD_LIST.UMPEG,
  })
  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @UseGuards(OwnerGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateKegiatanDto: UpdateKegiatanDto,
  ): Promise<IApiResponse<IKegiatan> | null> {
    return this.kegiatanService.update(id, updateKegiatanDto);
  }

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Owner(MODEL_LIST.KEGIATAN, OWNER_FIELD_LIST.KEGIATAN_OWNER, {
    operator: COMPARISON_OPERATOR.EQUAL,
    userField: COMPARISION_USER_FIELD_LIST.UMPEG,
  })
  @UseGuards(OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IKegiatan> | null> {
    return this.kegiatanService.remove(id);
  }
}
