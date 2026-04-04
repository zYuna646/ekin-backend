import { IApiResponse } from 'src/common/interface/api.interface';
import { IIndicator } from 'src/common/interface/indicator.interface';
import { ISubKegiatan } from 'src/sub-kegiatan/interface/sub-kegiatan.interface';

export interface IRkt {
  id: string;
  name: string;
  unitId: string;
  totalAnggaran: number;
  renstraId: string;
  subKegiatan?: ISubKegiatan[];
  input?: IIndicator[];
  output?: IIndicator[];
  outcome?: IIndicator[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRktService {
  checkData(id: string): Promise<IRkt>;
  create(createRktDto: any): Promise<IApiResponse<IRkt> | null>;
  findAll(filters: any): Promise<IApiResponse<IRkt[]> | null>;
  findOne(id: string): Promise<IApiResponse<IRkt> | null>;
  update(id: string, updateRktDto: any): Promise<IApiResponse<IRkt> | null>;
  remove(id: string): Promise<IApiResponse<IRkt> | null>;
}
