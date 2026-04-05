export interface IIdasnResponse<T> {
  success: boolean;
  message: string;
  mapData: T;
}

export interface IEselon {
  id: string;
  nama: string;
}

export interface IAsn {
  asn_id: string;
  asn_nama: string;
}
