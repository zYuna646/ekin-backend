import { IApiResponse } from 'src/common/interface/api.interface';
import { ITujuan } from 'src/tujuan/interface/tujuan.interface';
import { IIndicator } from 'src/common/interface/indicator.interface';

export interface IProgram {
  id: string;
  name: string;
  unitId: string;
  totalAnggaran: number;
  tujuanId: string;
  tujuan?: ITujuan;
  indicators?: IIndicator[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProgramService {
  checkData(id: string): Promise<IProgram>;
  create(createProgramDto: any): Promise<IApiResponse<IProgram> | null>;
  findAll(filters: any): Promise<IApiResponse<IProgram[]> | null>;
  findOne(id: string): Promise<IApiResponse<IProgram> | null>;
  update(
    id: string,
    updateProgramDto: any,
  ): Promise<IApiResponse<IProgram> | null>;
  remove(id: string): Promise<IApiResponse<IProgram> | null>;
}
