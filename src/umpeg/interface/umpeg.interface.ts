import { IApiResponse } from 'src/common/interface/api.interface';

export interface IUmpeg {
  id: string;
  name: string;
  unitId: string;
  nip: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUmpegService {
  checkData(id: string): Promise<IUmpeg>;
  create(createUmpegDto: any): Promise<IApiResponse<IUmpeg> | null>;
  findAll(filters: any): Promise<IApiResponse<IUmpeg[]> | null>;
  findOne(id: string): Promise<IApiResponse<IUmpeg> | null>;
  update(id: string, updateUmpegDto: any): Promise<IApiResponse<IUmpeg> | null>;
  remove(id: string): Promise<IApiResponse<IUmpeg> | null>;
}
