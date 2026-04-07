import { IApiResponse } from 'src/common/interface/api.interface';
import { FilterUnorDto } from '../dto/filter-unor.dto';

export interface IUnor {
  id: string;
  name: string;
}

export interface IUnorService {
  getUnorById(id: string): Promise<IApiResponse<IUnor>>;
  getUnor(filters: FilterUnorDto): Promise<IApiResponse<IUnor[]>>;
}
