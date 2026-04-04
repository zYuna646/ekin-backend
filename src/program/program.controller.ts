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
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { FiltersProgramDto } from './dto/filters-program.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { IProgram } from './interface/program.interface';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Post()
  create(
    @Body() createProgramDto: CreateProgramDto,
  ): Promise<IApiResponse<IProgram> | null> {
    return this.programService.create(createProgramDto);
  }

  @Get()
  findAll(
    @Query() filters: FiltersProgramDto,
  ): Promise<IApiResponse<IProgram[]> | null> {
    return this.programService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<IProgram> | null> {
    return this.programService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDto,
  ): Promise<IApiResponse<IProgram> | null> {
    return this.programService.update(id, updateProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IApiResponse<IProgram> | null> {
    return this.programService.remove(id);
  }
}
