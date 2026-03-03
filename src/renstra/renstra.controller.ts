import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RenstraService } from './renstra.service';
import { CreateRenstraDto } from './dto/create-renstra.dto';
import { UpdateRenstraDto } from './dto/update-renstra.dto';
import { IRenstra } from './interface/renstra.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { FiltersRenstraDto } from './dto/filters-renstra.dto';

@Controller('renstra')
export class RenstraController {
  constructor(private readonly renstraService: RenstraService) {}

  @Post()
  create(
    @Body() createRenstraDto: CreateRenstraDto,
  ): Promise<IApiResponse<IRenstra> | null> {
    return this.renstraService.create(createRenstraDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersRenstraDto,
  ): Promise<IApiResponse<IRenstra[]> | null> {
    return this.renstraService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IRenstra> | null> {
    return this.renstraService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRenstraDto: UpdateRenstraDto,
  ): Promise<IApiResponse<IRenstra> | null> {
    return this.renstraService.update(id, updateRenstraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IRenstra> | null> {
    return this.renstraService.remove(id);
  }
}
