import { IApiResponse } from 'src/common/interface/api.interface';

export interface IJpt {
  id: string;
  name: string;
  unitId: string;
  nip: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IJptService {
  checkData(id: string): Promise<IJpt>;
  create(createJptDto: any): Promise<IApiResponse<IJpt> | null>;
  findAll(filters: any): Promise<IApiResponse<IJpt[]> | null>;
  findOne(id: string): Promise<IApiResponse<IJpt> | null>;
  update(id: string, updateJptDto: any): Promise<IApiResponse<IJpt> | null>;
  remove(id: string): Promise<IApiResponse<IJpt> | null>;
}
