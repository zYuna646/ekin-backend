import { IApiResponse } from 'src/common/interface/api.interface';

export interface ISkpStatus {
  id: string;
  value: string;
  remarks?: string;
  createdAt: Date;
}

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
  statuses?: ISkpStatus[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ISkpService {
  checkData(id: string, includeStatuses?: boolean): Promise<ISkp>;
  create(
    createSkpDto: any,
    userNip: string,
  ): Promise<IApiResponse<ISkp> | null>;
  createBawahan(
    parentSkpId: string,
    createBawahanSkpDto: any,
  ): Promise<IApiResponse<ISkp> | null>;
  findAll(
    filters: any,
    userNip?: string,
    userRoles?: string[],
  ): Promise<IApiResponse<ISkp[]> | null>;
  findOne(id: string): Promise<IApiResponse<ISkp> | null>;
  findBawahan(
    parentSkpId: string,
    filtersSkpDto: any,
  ): Promise<IApiResponse<ISkp[]> | null>;
  update(id: string, updateSkpDto: any): Promise<IApiResponse<ISkp> | null>;
  updateLampirans(
    id: string,
    updateSkpLampiranDto: any,
  ): Promise<IApiResponse<ISkp> | null>;
  remove(id: string, userNip?: string): Promise<IApiResponse<ISkp> | null>;
  permanentDelete(id: string): Promise<IApiResponse<any> | null>;
  restore(id: string): Promise<IApiResponse<ISkp> | null>;
  submit(id: string, userNip: string): Promise<IApiResponse<ISkp> | null>;
  approve(
    id: string,
    userNip: string,
    remarks?: string,
  ): Promise<IApiResponse<ISkp> | null>;
  reject(
    id: string,
    userNip: string,
    remarks?: string,
  ): Promise<IApiResponse<ISkp> | null>;
}
