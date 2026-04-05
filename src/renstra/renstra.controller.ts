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
import { Owner } from 'src/auth/decorator/owner.decorator';
import {
  COMPARISON_OPERATOR,
  MODEL_LIST,
  OWNER_FIELD_LIST,
  COMPARISION_USER_FIELD_LIST,
} from 'src/common/const/common.const';
import { OwnerGuard } from 'src/auth/guard/owner.guard';

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
    @Request() req: any,
  ): Promise<IApiResponse<IRenstra[]> | null> {
    // If user has UMPEG role but NOT ADMIN, restrict to user's UMPEG units
    if (
      req.user?.roles?.includes(ROLES.UMPEG) &&
      !req.user?.roles?.includes(ROLES.ADMIN) &&
      req.user?.umpeg
    ) {
      filters.unitIds = req.user.umpeg;
    }
    return this.renstraService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IRenstra> | null> {
    return this.renstraService.findOne(id);
  }

  @Owner(MODEL_LIST.RENSTRA, OWNER_FIELD_LIST.RENSTRA_OWNER, {
    operator: COMPARISON_OPERATOR.EQUAL,
    userField: COMPARISION_USER_FIELD_LIST.ROLES,
  })
  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @UseGuards(OwnerGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRenstraDto: UpdateRenstraDto,
  ): Promise<IApiResponse<IRenstra> | null> {
    return this.renstraService.update(id, updateRenstraDto);
  }

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Owner(MODEL_LIST.RENSTRA, OWNER_FIELD_LIST.RENSTRA_OWNER, {
    operator: COMPARISON_OPERATOR.EQUAL,
    userField: COMPARISION_USER_FIELD_LIST.ROLES,
  })
  @UseGuards(OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IRenstra> | null> {
    return this.renstraService.remove(id);
  }
}
