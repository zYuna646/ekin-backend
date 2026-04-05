import { IApiResponse } from 'src/common/interface/api.interface';

export interface ISkp {
  id: string;
  nip: string;
  startDate: Date;
  endDate: Date;
  status: string;
  pendekatan: string;
  cascading: string;
  unitId: string[];
  jabatan?: any[];
  renstraId: string;
  childSkps?: ISkp[];
  parentSkps?: ISkp[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISkpService {
  checkData(id: string): Promise<ISkp>;
  create(createSkpDto: any): Promise<IApiResponse<ISkp> | null>;
  findAll(filters: any): Promise<IApiResponse<ISkp[]> | null>;
  findOne(id: string): Promise<IApiResponse<ISkp> | null>;
  update(id: string, updateSkpDto: any): Promise<IApiResponse<ISkp> | null>;
  remove(id: string): Promise<IApiResponse<ISkp> | null>;
}
