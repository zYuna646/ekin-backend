import { IApiResponse } from 'src/common/interface/api.interface';
import { IVisi } from 'src/visi/interface/visi.interface';

export interface IMisi {
  id: string;
  name: string;
  desc?: string | null;
  visi?: IVisi;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMisiService {
  checkData(id: string): Promise<IMisi>;
  create(createMisiDto: any): Promise<IApiResponse<IMisi> | null>;
  findAll(filters: any): Promise<IApiResponse<IMisi[]> | null>;
  findOne(id: string): Promise<IApiResponse<IMisi> | null>;
  update(id: string, updateMisiDto: any): Promise<IApiResponse<IMisi> | null>;
  remove(id: string): Promise<IApiResponse<IMisi> | null>;
}
