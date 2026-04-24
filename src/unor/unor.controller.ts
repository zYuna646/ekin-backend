import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UnorService } from './unor.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ROLES } from 'src/common/const/role.const';
import { IUnor, IUnorAsn } from './interface/unor.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { FilterUnorDto } from './dto/filter-unor.dto';
import type { AuthenticatedRequest } from 'src/auth/interface/auth.interface';

@UseGuards(JwtGuard, RolesGuard)
@Controller('unor')
export class UnorController {
  constructor(private readonly unorService: UnorService) {}

  @Roles(ROLES.ADMIN, ROLES.UMPEG, ROLES.JPT)
  @Get()
  getUnor(
    @Query() filters: FilterUnorDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<IApiResponse<IUnor[]>> {
    const userRoles = req.user?.roles || [];
    const userUmpeg = req.user?.umpeg || [];
    const userJpt = req.user?.jpt || [];
    return this.unorService.getUnor(filters, userRoles, userUmpeg, userJpt);
  }

  @Roles(ROLES.ADMIN, ROLES.UMPEG, ROLES.JPT)
  @Get(':id/jabatan')
  getJabatanByUnorWithBawahan(
    @Param('id') unorId: string,
    @Request() req: AuthenticatedRequest,
    @Query('unitId') unitId?: string,
    @Query() filters: FilterUnorDto = {},
  ): Promise<IApiResponse<IUnorAsn[]>> {
    const userRoles = req.user?.roles || [];
    const userUmpeg = req.user?.umpeg || [];
    const userJpt = req.user?.jpt || [];
    const userNip = req.user?.nipBaru || '';
    return this.unorService.getJabatanByUnorWithBawahan(
      unorId,
      unitId,
      filters,
      userRoles,
      userUmpeg,
      userJpt,
      userNip,
    );
  }

  @Roles(ROLES.ADMIN, ROLES.UMPEG, ROLES.JPT)
  @Get(':id')
  getUnorById(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<IApiResponse<IUnor>> {
    const userRoles = req.user?.roles || [];
    const userUmpeg = req.user?.umpeg || [];
    const userJpt = req.user?.jpt || [];
    return this.unorService.getUnorById(id, userRoles, userUmpeg, userJpt);
  }

  @Roles(ROLES.ADMIN, ROLES.UMPEG, ROLES.JPT)
  @Get(':id/asn')
  getUnorAsn(
    @Param('id') id: string,
    @Query() filters: FilterUnorDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<IApiResponse<IUnorAsn[]>> {
    const userRoles = req.user?.roles || [];
    const userUmpeg = req.user?.umpeg || [];
    const userJpt = req.user?.jpt || [];
    return this.unorService.getUnorAsn(
      id,
      filters,
      userRoles,
      userUmpeg,
      userJpt,
    );
  }
}
