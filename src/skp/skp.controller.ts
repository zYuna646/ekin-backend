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
import { SkpService } from './skp.service';
import { CreateSkpDto } from './dto/create-skp.dto';
import { CreateBawahanSkpDto } from './dto/create-bawahan-skp.dto';
import { CreateRhkDto } from './dto/create-rhk.dto';
import { UpdateRhkDto } from './dto/update-rhk.dto';
import { UpdateSkpLampiranDto } from './dto/update-skp-lampiran.dto';
import { SubmitSkpDto } from './dto/submit-skp.dto';
import { ApproveSkpDto } from './dto/approve-skp.dto';
import { RejectSkpDto } from './dto/reject-skp.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { ISkp } from './interface/skp.interface';
import { FiltersSkpDto } from './dto/filters-skp.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { OwnerGuard } from 'src/auth/guard/owner.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Owner } from 'src/auth/decorator/owner.decorator';
import { ROLES } from 'src/common/const/role.const';
import { MODEL_LIST } from 'src/common/const/common.const';
import type { AuthenticatedRequest } from 'src/auth/interface/auth.interface';

@UseGuards(JwtGuard, RolesGuard)
@Controller('skp')
export class SkpController {
  constructor(private readonly skpService: SkpService) {}

  @Roles(ROLES.JPT)
  @Post()
  create(
    @Body() createSkpDto: CreateSkpDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<IApiResponse<ISkp> | null> {
    const userNip = req.user?.nipBaru;
    return this.skpService.create(createSkpDto, userNip);
  }

  @Roles(ROLES.JPT, ROLES.ASN)
  @Post(':id/bawahan')
  createBawahan(
    @Param('id') parentSkpId: string,
    @Body() createBawahanSkpDto: CreateBawahanSkpDto,
  ): Promise<IApiResponse<ISkp> | null> {
    return this.skpService.createBawahan(parentSkpId, createBawahanSkpDto);
  }

  @Roles(ROLES.JPT, ROLES.ASN)
  @Get(':id/bawahan')
  findBawahan(
    @Param('id') parentSkpId: string,
    @Query() filters: FiltersSkpDto,
  ): Promise<IApiResponse<ISkp[]> | null> {
    return this.skpService.findBawahan(parentSkpId, filters);
  }

  @Get()
  findAll(
    @Query() filters: FiltersSkpDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<IApiResponse<ISkp[]> | null> {
    const userNip = req.user?.nipBaru;
    const userRoles = req.user?.roles || [];
    return this.skpService.findAll(filters, userNip, userRoles);
  }

  @Owner(MODEL_LIST.SKP, 'nip')
  @Roles(ROLES.JPT)
  @UseGuards(OwnerGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<ISkp> | null> {
    return this.skpService.findOne(id);
  }

  @Owner(MODEL_LIST.SKP, 'nip')
  @Roles(ROLES.JPT, ROLES.ASN)
  @UseGuards(OwnerGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSkpLampiranDto: UpdateSkpLampiranDto,
  ): Promise<IApiResponse<ISkp> | null> {
    return this.skpService.updateLampirans(id, updateSkpLampiranDto);
  }

  @Roles(ROLES.JPT)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<IApiResponse<ISkp> | null> {
    const userNip = req.user?.nipBaru;
    return this.skpService.remove(id, userNip);
  }

  @Owner(MODEL_LIST.SKP, 'nip')
  @Roles(ROLES.ASN)
  @UseGuards(OwnerGuard)
  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<IApiResponse<ISkp> | null> {
    const userNip = req.user?.nipBaru;
    return this.skpService.submit(id, userNip);
  }

  @Roles(ROLES.JPT, ROLES.ASN)
  @Post(':id/approve')
  approve(
    @Param('id') id: string,
    @Body() approveSkpDto: ApproveSkpDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<IApiResponse<ISkp> | null> {
    const userNip = req.user?.nipBaru;
    return this.skpService.approve(id, userNip, approveSkpDto.remarks);
  }

  @Roles(ROLES.JPT, ROLES.ASN)
  @Post(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() rejectSkpDto: RejectSkpDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<IApiResponse<ISkp> | null> {
    const userNip = req.user?.nipBaru;
    return this.skpService.reject(id, userNip, rejectSkpDto.remarks);
  }

  @Owner(MODEL_LIST.SKP, 'nip')
  @Roles(ROLES.ASN)
  @UseGuards(OwnerGuard)
  @Post(':id/rhk/add')
  addRhk(
    @Param('id') skpId: string,
    @Body() createRhkDto: CreateRhkDto,
  ): Promise<IApiResponse<any> | null> {
    return this.skpService.addRhk(skpId, createRhkDto);
  }

  @Owner(MODEL_LIST.SKP, 'nip')
  @Roles(ROLES.ASN)
  @UseGuards(OwnerGuard)
  @Patch(':id/rhk/:rhkId')
  updateRhk(
    @Param('id') skpId: string,
    @Param('rhkId') rhkId: string,
    @Body() updateRhkDto: UpdateRhkDto,
  ): Promise<IApiResponse<any> | null> {
    return this.skpService.updateRhk(skpId, rhkId, updateRhkDto);
  }

  @Owner(MODEL_LIST.SKP, 'nip')
  @Roles(ROLES.ASN)
  @UseGuards(OwnerGuard)
  @Delete(':id/rhk/:rhkId')
  removeRhk(
    @Param('id') skpId: string,
    @Param('rhkId') rhkId: string,
  ): Promise<IApiResponse<any> | null> {
    return this.skpService.removeRhk(skpId, rhkId);
  }
}
