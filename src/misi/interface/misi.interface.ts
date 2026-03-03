import { IVisi } from 'src/visi/interface/visi.interface';

export interface IMisi {
  id: string;
  name: string;
  desc?: string;
  visi: IVisi;
  createdAt: Date;
  updatedAt: Date;
}
