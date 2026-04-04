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
import { RktService } from './rkt.service';
import { CreateRktDto } from './dto/create-rkt.dto';
import { UpdateRktDto } from './dto/update-rkt.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { IRkt } from './interface/rkt.interface';
import { FiltersRktDto } from './dto/filters-rkt.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('rkt')
export class RktController {
  constructor(private readonly rktService: RktService) {}

  @Post()
  create(
    @Body() createRktDto: CreateRktDto,
  ): Promise<IApiResponse<IRkt> | null> {
    return this.rktService.create(createRktDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersRktDto,
  ): Promise<IApiResponse<IRkt[]> | null> {
    return this.rktService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IRkt> | null> {
    return this.rktService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRktDto: UpdateRktDto,
  ): Promise<IApiResponse<IRkt> | null> {
    return this.rktService.update(id, updateRktDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IRkt> | null> {
    return this.rktService.remove(id);
  }
}
