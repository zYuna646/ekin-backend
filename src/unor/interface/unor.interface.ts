import { IApiResponse } from 'src/common/interface/api.interface';
import { FilterUnorDto } from '../dto/filter-unor.dto';

export interface IUnor {
  id: string;
  name: string;
}
export interface IUnitKerja {
  id: string;
  name: string;
}

export interface IUnorAsn {
  unor: IUnor;
  unitKerja: IUnitKerja;
  nip: string;
  name: string;
  jabatan: string;
}

export interface IUnorService {
  getUnorById(id: string): Promise<IApiResponse<IUnor>>;
  getUnor(filters: FilterUnorDto): Promise<IApiResponse<IUnor[]>>;
  getUnorAsn(
    id: string,
    filters: FilterUnorDto,
  ): Promise<IApiResponse<IUnorAsn[]>>;
}
