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
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { FiltersProgramDto } from './dto/filters-program.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { IProgram } from './interface/program.interface';
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
@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Post()
  create(
    @Body() createProgramDto: CreateProgramDto,
  ): Promise<IApiResponse<IProgram> | null> {
    return this.programService.create(createProgramDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersProgramDto,
    @Request() req: any,
  ): Promise<IApiResponse<IProgram[]> | null> {
    // If user has UMPEG role but NOT ADMIN, restrict to user's UMPEG units
    if (
      req.user?.roles?.includes(ROLES.UMPEG) &&
      !req.user?.roles?.includes(ROLES.ADMIN) &&
      req.user?.umpeg
    ) {
      filters.unitIds = req.user.umpeg;
    }
    return this.programService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IProgram> | null> {
    return this.programService.findOne(id);
  }

  @Owner(MODEL_LIST.PROGRAM, OWNER_FIELD_LIST.PROGRAM_OWNER, {
    operator: COMPARISON_OPERATOR.EQUAL,
    userField: COMPARISION_USER_FIELD_LIST.UMPEG,
  })
  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @UseGuards(OwnerGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDto,
  ): Promise<IApiResponse<IProgram> | null> {
    return this.programService.update(id, updateProgramDto);
  }

  @Roles(ROLES.ADMIN, ROLES.UMPEG)
  @Owner(MODEL_LIST.PROGRAM, OWNER_FIELD_LIST.PROGRAM_OWNER, {
    operator: COMPARISON_OPERATOR.EQUAL,
    userField: COMPARISION_USER_FIELD_LIST.UMPEG,
  })
  @UseGuards(OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IProgram> | null> {
    return this.programService.remove(id);
  }
}
