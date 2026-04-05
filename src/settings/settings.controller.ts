import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import { ISettings } from './interface/settings.interface';
import { FiltersSettingsDto } from './dto/filters-settings.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ROLES } from 'src/common/const/role.const';

@UseGuards(JwtGuard, RolesGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAll(
    @Query() filters: FiltersSettingsDto,
  ): Promise<IApiResponse<ISettings[]> | null> {
    return this.settingsService.findAll(filters);
  }

  @Get('key/:key')
  findByKey(
    @Param('key') key: string,
  ): Promise<IApiResponse<ISettings> | null> {
    return this.settingsService.findByKey(key);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IApiResponse<ISettings> | null> {
    return this.settingsService.findOne(id);
  }

  @Roles(ROLES.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ): Promise<IApiResponse<ISettings> | null> {
    return this.settingsService.update(id, updateSettingsDto);
  }
}
