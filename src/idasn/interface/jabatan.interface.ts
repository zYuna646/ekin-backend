import { IUnitKerja } from './unor.interface';

export interface IJabatan {
  id_posjab: string;
  unor: IUnitKerja;
  jenis_jabatan: IJenisJabatan;
  jabatan_status: IJabatanStatus;
  eselon: IEselon;
  golongan_pns: IGolonganPNS;
  id_asn: string;
  nip_asn: string;
  nama_asn: string;
  jenis_asn: string;
  nama_jabatan: string;
  tunjangan: number;
}

export interface IJabatanService {
  getJabatanByUnorId(unorId: string): Promise<IJabatan[]>;
  getJabatanByUnorIdWithBawahan(
    unorId: string,
    unitId: string,
  ): Promise<IJabatan[]>;
}

export interface IJenisJabatan {
  id: string;
  nama: string;
}

export interface IJabatanStatus {
  id: string;
  nama: string;
}

export interface IGolonganPNS {
  id: string;
  nama: string;
}

export interface IEselon {
  id: string;
  nama: string;
}

export interface IAsn {
  asn_id: string;
  asn_nama: string;
}
