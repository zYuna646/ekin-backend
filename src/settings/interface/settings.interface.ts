import { IApiResponse } from 'src/common/interface/api.interface';
import { UpdateSettingsDto } from '../dto/update-settings.dto';
import { FiltersSettingsDto } from '../dto/filters-settings.dto';

export interface ISettings {
  id: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISettingsService {
  checkData(id: string): Promise<ISettings>;
  findAll(
    filters: FiltersSettingsDto,
  ): Promise<IApiResponse<ISettings[]> | null>;
  findOne(id: string): Promise<IApiResponse<ISettings> | null>;
  findByKey(key: string): Promise<IApiResponse<ISettings> | null>;
  update(
    id: string,
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<IApiResponse<ISettings> | null>;
}
