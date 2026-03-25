import { IApiResponse } from 'src/common/interface/api.interface';
import { IKegiatan } from 'src/kegiatan/interface/kegiatan.interface';
import { IIndicator } from 'src/common/interface/indicator.interface';

export interface ISubKegiatan {
  id: string;
  name: string;
  unitId: string;
  totalAnggaran: number;
  kegiatanId: string;
  kegiatan?: IKegiatan;
  indicators?: IIndicator[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubKegiatanService {
  checkData(id: string): Promise<ISubKegiatan>;
  create(createSubKegiatanDto: any): Promise<IApiResponse<ISubKegiatan> | null>;
  findAll(filters: any): Promise<IApiResponse<ISubKegiatan[]> | null>;
  findOne(id: string): Promise<IApiResponse<ISubKegiatan> | null>;
  update(
    id: string,
    updateSubKegiatanDto: any,
  ): Promise<IApiResponse<ISubKegiatan> | null>;
  remove(id: string): Promise<IApiResponse<ISubKegiatan> | null>;
}
