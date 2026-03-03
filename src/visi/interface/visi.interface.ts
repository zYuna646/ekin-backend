import { IMisi } from 'src/misi/interface/misi.interface';

export interface IVisi {
  id: string;
  name: string;
  desc?: string | null;
  misis?: IMisi[];
  createdAt: Date;
  updatedAt: Date;
}
