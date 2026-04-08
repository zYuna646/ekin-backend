import { Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { IdasnService } from '../idasn.service';
import { IJabatan, IJabatanService } from '../interface/jabatan.interface';
import { IIdasnResponse } from '../interface/idasn.interface';
import { IDASN_ENDPOINTS } from 'src/common/const/idasn.const';
import { UnorService } from './unor.service';
import { IUnor } from '../interface/unor.interface';

export class JabatanService extends IdasnService implements IJabatanService {
  private readonly logger = new Logger(JabatanService.name);

  constructor(
    private readonly unorService: UnorService,
    http: HttpService,
    configService: ConfigService,
    @Inject(REQUEST) request: Request,
  ) {
    super(http, configService, request);
  }

  async getJabatanByUnorId(unorId: string): Promise<IJabatan[]> {
    try {
      this.logger.log(`Fetching Jabatan for Unor ID: ${unorId}`);
      const unor: IUnor = await this.unorService.getUnorById(unorId);
      if (!unor) {
        throw new Error(`Unor with id ${unorId} not found`);
      }

      const res: IIdasnResponse<{ data: IJabatan[] }> = await this.get(
        IDASN_ENDPOINTS.JABATAN.GET_JABATAN_BY_UNOR_ID(unor.id_sapk),
      );

      return res.mapData.data;
    } catch (error) {
      this.logger.error(`Failed to fetch Jabatan for Unor ID ${unorId}`, error);
      throw error;
    }
  }
}
