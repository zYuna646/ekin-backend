import { IApiResponse } from 'src/common/interface/api.interface';

export interface IPimpinanUnitKerja {
  id: string;
  name: string;
  unitKerjaId: string;
  unitId: string;
  nip: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPimpinanUnitKerjaService {
  checkData(id: string): Promise<IPimpinanUnitKerja>;
  create(
    createPimpinanUnitKerjaDto: any,
  ): Promise<IApiResponse<IPimpinanUnitKerja> | null>;
  findAll(filters: any): Promise<IApiResponse<IPimpinanUnitKerja[]> | null>;
  findOne(id: string): Promise<IApiResponse<IPimpinanUnitKerja> | null>;
  findByUnitId(
    unitId: string,
  ): Promise<IApiResponse<IPimpinanUnitKerja[]> | null>;
  update(
    id: string,
    updatePimpinanUnitKerjaDto: any,
  ): Promise<IApiResponse<IPimpinanUnitKerja> | null>;
  remove(id: string): Promise<IApiResponse<IPimpinanUnitKerja> | null>;
}
