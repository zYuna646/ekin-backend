import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UnorService } from './unor.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ROLES } from 'src/common/const/role.const';
import { IUnor, IUnorAsn } from './interface/unor.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { FilterUnorDto } from './dto/filter-unor.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('unor')
export class UnorController {
  constructor(private readonly unorService: UnorService) {}

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Get()
  getUnor(@Query() filters: FilterUnorDto): Promise<IApiResponse<IUnor[]>> {
    return this.unorService.getUnor(filters);
  }

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Get(':id')
  getUnorById(@Param('id') id: string): Promise<IApiResponse<IUnor>> {
    return this.unorService.getUnorById(id);
  }

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Get(':id/asn')
  getUnorAsn(
    @Param('id') id: string,
    @Query() filters: FilterUnorDto,
  ): Promise<IApiResponse<IUnorAsn[]>> {
    return this.unorService.getUnorAsn(id, filters);
  }
}
