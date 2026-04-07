export const IDASN_ENDPOINTS = {
  AUTH: {
    LOGIN: '/authorize',
    VERIFY: '/openid/certs',
  },
  UNOR: {
    GET_UNORS: '/unor/all',
    GET_UNOR_DETAILS: (id: string) => `/unor/${id}`,
  },

  JABATAN: {
    GET_JABATAN_BY_UNOR_ID: (unorId: string) => `/posjab/unor/${unorId}`,
  },
};
