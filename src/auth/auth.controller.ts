import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { IApiResponse } from 'src/common/interface/api.interface';
import type {
  AuthenticatedRequest,
  IAuthResponse,
  IIdasnVerifyResponse,
} from './interface/auth.interface';
import { JwtGuard } from './guard/jwt.guard';
import { StatusApi } from 'src/common/enum/status.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<IApiResponse<IAuthResponse>> {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtGuard)
  @Get('verify')
  async verify(
    @Request() req: AuthenticatedRequest,
  ): Promise<IApiResponse<IIdasnVerifyResponse>> {
    return {
      data: req.user,
      code: 200,
      status: StatusApi.SUCCESS,
      message: 'Token verified successfully',
    };
  }
}
