import { IApiResponse } from 'src/common/interface/api.interface';
import { IProgram } from 'src/program/interface/program.interface';
import { IIndicator } from 'src/common/interface/indicator.interface';

export interface IKegiatan {
  id: string;
  name: string;
  unitId: string;
  totalAnggaran: number;
  programId: string;
  program?: IProgram;
  indicators?: IIndicator[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IKegiatanService {
  checkData(id: string): Promise<IKegiatan>;
  create(createKegiatanDto: any): Promise<IApiResponse<IKegiatan> | null>;
  findAll(filters: any): Promise<IApiResponse<IKegiatan[]> | null>;
  findOne(id: string): Promise<IApiResponse<IKegiatan> | null>;
  update(
    id: string,
    updateKegiatanDto: any,
  ): Promise<IApiResponse<IKegiatan> | null>;
  remove(id: string): Promise<IApiResponse<IKegiatan> | null>;
}
