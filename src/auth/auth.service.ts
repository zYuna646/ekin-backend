import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IIdasnAuthResponse,
  IAuthService,
  IAuthResponse,
} from './interface/auth.interface';
import { LoginDto } from './dto/login.dto';
import { IDASN_ENDPOINTS } from 'src/common/const/idasn.const';
import { firstValueFrom } from 'rxjs';
import { IIdasnResponse } from 'src/idasn/interface/idasn.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { IApiResponse } from 'src/common/interface/api.interface';

@Injectable()
export class AuthService implements IAuthService {
  protected readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async login(dto: LoginDto): Promise<IApiResponse<IAuthResponse>> {
    try {
      const res: IIdasnResponse<IIdasnAuthResponse> = await firstValueFrom(
        this.http.post<IIdasnAuthResponse>(this.getAuthUrl(), {
          username: dto.username,
          password: dto.password,
        }),
      );
      const data = {
        token: this.extractAccessToken(res.data.mapData.redirect_uri),
      };
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Login successful',
      };
    } catch (error) {
      this.logger.error(
        `Login failed for user ${dto.username}: ${error.message}`,
      );
      throw error;
    }
  }
  async verifyToken(token: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  getAuthUrl(): string {
    return `${IDASN_ENDPOINTS.AUTH.LOGIN}?client_id=${this.configService.get<string>('IDASN_CLIENT_ID')}&response_type=${this.configService.get<string>('IDASN_RESPONSE_TYPE')}`;
  }

  extractAccessToken(redirectUri: string): string | null {
    const match = redirectUri.match(/access_token=([^&]*)/);
    return match ? match[1] : null;
  }
}
