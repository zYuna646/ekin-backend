import { IApiResponse } from 'src/common/interface/api.interface';
import { IMisi } from 'src/misi/interface/misi.interface';

export interface IVisi {
  id: string;
  name: string;
  desc?: string | null;
  misis?: IMisi[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IVisiService {
  checkData(id: string): Promise<IVisi>;
  create(createVisiDto: any): Promise<IApiResponse<IVisi> | null>;
  findAll(filters: any): Promise<IApiResponse<IVisi[]> | null>;
  findOne(id: string): Promise<IApiResponse<IVisi> | null>;
  update(id: string, updateVisiDto: any): Promise<IApiResponse<IVisi> | null>;
  remove(id: string): Promise<IApiResponse<IVisi> | null>;
}
