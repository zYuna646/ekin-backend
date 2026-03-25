import { IApiResponse } from 'src/common/interface/api.interface';
import { IRenstra } from 'src/renstra/interface/renstra.interface';
import { IIndicator } from 'src/common/interface/indicator.interface';

export interface ITujuan {
  id: string;
  name: string;
  unitId: string;
  renstraId: string;
  renstra?: IRenstra;
  indicators?: IIndicator[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITujuanService {
  checkData(id: string): Promise<ITujuan>;
  create(createTujuanDto: any): Promise<IApiResponse<ITujuan> | null>;
  findAll(filters: any): Promise<IApiResponse<ITujuan[]> | null>;
  findOne(id: string): Promise<IApiResponse<ITujuan> | null>;
  update(
    id: string,
    updateTujuanDto: any,
  ): Promise<IApiResponse<ITujuan> | null>;
  remove(id: string): Promise<IApiResponse<ITujuan> | null>;
}
