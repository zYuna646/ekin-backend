import { IMisi } from 'src/misi/interface/misi.interface';

export interface IRenstra {
  id: string;
  name: string;
  desc?: string | null;
  startDate: Date;
  endDate: Date;
  unitId: string;
  misis?: IMisi[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRenstraMisi {
  id: string;
  renstra: IRenstra;
  misi: IMisi;
  createdAt: Date;
  updatedAt: Date;
}
