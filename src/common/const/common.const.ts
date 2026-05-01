export const MODEL_LIST = {
  USER: 'User',
  UNIT: 'Unit',
  RENSTRA: 'Renstra',
  RKT: 'Rkt',
  RKT_SUB_KEGIATAN: 'RktSubKegiatan',
  INDICATOR: 'Indicator',
  SKP: 'Skp',
  SKP_INDICATOR: 'SkpIndicator',
  SKP_CASCADING: 'SkpCascading',
  SKP_APPROACH: 'SkpApproach',
  KEGIATAN: 'Kegiatan',
  SUB_KEGIATAN: 'SubKegiatan',
  TUJUAN: 'Tujuan',
  PROGRAM: 'Program',
  PERIODE_PENILAIAN: 'PeriodePenilaian',
} as const;

export const OWNER_FIELD_LIST = {
  SKP_OWNER: 'nip',
  RKT_OWNER: 'unitId',
  RENSTRA_OWNER: 'unitId',
  KEGIATAN_OWNER: 'unitId',
  SUB_KEGIATAN_OWNER: 'unitId',
  TUJUAN_OWNER: 'unitId',
  PROGRAM_OWNER: 'unitId',
  PERIODE_PENILAIAN_OWNER: 'unitId',
} as const;

export const COMPARISON_OPERATOR = {
  EQUAL: 'eq',
  NOT_EQUAL: 'ne',
  IN_ARRAY: 'in',
  NOT_IN_ARRAY: 'nin',
} as const;

export const COMPARISION_USER_FIELD_LIST = {
  NIP: 'nipBaru',
  NAMA: 'nama',
  NIK: 'nik',
  ROLES: 'roles',
  UMPEG: 'umpeg',
  JPT: 'jpt',
} as const;
