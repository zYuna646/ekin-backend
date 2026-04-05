import { IApiResponse } from 'src/common/interface/api.interface';
import { LoginDto } from '../dto/login.dto';

export interface IAuthService {
  login(dto: LoginDto): Promise<IApiResponse<IAuthResponse>>;
  verifyToken(token: string): Promise<IApiResponse<IIdasnVerifyResponse>>;
}

export interface IAuthResponse {
  token: string | null;
}

export interface IIdasnAuthResponse {
  redirect_uri: string;
}

export interface IIdasnVerifyResponse {
  idASN: string;
  nipBaru: string;
  nama: string;
  nik: string;
  status_asn: string;
  unor: {
    id: string;
    nama: string;
  };
  foto: string;
  roles: string[];
  umpeg?: string[];
  jpt?: string[];
}

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  [key: string]: any;
}

export interface AuthenticatedRequest extends Request {
  user: IIdasnVerifyResponse & { userId: string };
}
