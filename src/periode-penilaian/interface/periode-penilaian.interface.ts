import { IApiResponse } from 'src/common/interface/api.interface';

export interface IPeriodePenilaian {
  id: string;
  startDate: Date;
  endDate: Date;
  unitId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPeriodePenilaianService {
  create(createPeriodePenilaianDto: any): Promise<IApiResponse<IPeriodePenilaian> | null>;
  findAll(filters: any): Promise<IApiResponse<IPeriodePenilaian[]> | null>;
  findOne(id: string): Promise<IApiResponse<IPeriodePenilaian> | null>;
  update(id: string, updatePeriodePenilaianDto: any): Promise<IApiResponse<IPeriodePenilaian> | null>;
  remove(id: string): Promise<IApiResponse<IPeriodePenilaian> | null>;
}
