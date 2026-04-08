import { IAsn, IEselon } from './jabatan.interface';

export interface IUnor {
  id: string;
  nama: string;
  id_sapk: string;
  id_simpeg: string;
  nama_unor: string;
}

export interface IUnitKerja {
  id: string;
  nama: string;
  atasan: IUnitKerjaAtasan | null;
  induk: IUnor | null;
}

export interface IUnitKerjaAtasan {
  unor_id: string;
  unor_nama: string;
  unor_jabatan: string;
  asn: {
    idasn_atasan: string | null;
    nip_atasan: string | null;
    nama_atasan: string | null;
  };
}

export interface IUnorDetails {
  id: string;
  induk: IUnor;
  namaUnor: string;
  namaJabatan: string;
  eselon: IEselon;
  asn: IAsn;
  atasan: string;
  bawahan: IUnorDetails[];
}

export interface IUnorService {
  getUnorById(id: string): Promise<IUnor>;
  getUnor(): Promise<IUnor[]>;
  getUnorDetails(id: string): Promise<IUnorDetails>;
}
