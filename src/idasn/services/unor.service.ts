import { Logger } from '@nestjs/common';
import { IdasnService } from '../idasn.service';
import { IUnor, IUnorDetails, IUnorService } from '../interface/unor.interface';
import { IIdasnResponse } from '../interface/idasn.interface';
import { IDASN_ENDPOINTS } from 'src/common/const/idasn.const';

export class UnorService extends IdasnService implements IUnorService {
  private readonly logger = new Logger(UnorService.name);

  async getUnorById(id: string): Promise<IUnor> {
    try {
      const res: IIdasnResponse<IUnor[]> = await this.get(
        IDASN_ENDPOINTS.UNOR.GET_UNORS,
      );
      const data = res.mapData.find((unor) => unor.id_simpeg === id);
      if (!data) {
        throw new Error(`Unor with id ${id} not found`);
      }
      return data;
    } catch (error) {
      this.logger.error(`Failed to fetch Unor with id ${id}`, error);
      throw error;
    }
  }
  async getUnor(): Promise<IUnor[]> {
    try {
      const res: IIdasnResponse<IUnor[]> = await this.get(
        IDASN_ENDPOINTS.UNOR.GET_UNORS,
      );
      return res.mapData;
    } catch (error) {
      this.logger.error('Failed to fetch Unors', error);
      throw error;
    }
  }

  async getUnorDetails(id: string): Promise<IUnorDetails> {
    try {
      const unor = await this.getUnorById(id);
      if (!unor) {
        throw new Error(`Unor with id ${id} not found`);
      }

      const res: IIdasnResponse<IUnorDetails[]> = await this.get(
        IDASN_ENDPOINTS.UNOR.GET_UNOR_DETAILS(unor.id_sapk),
      );
      return res.mapData[0];
    } catch (error) {
      this.logger.error(`Failed to fetch Unor details with id ${id}`, error);
      throw error;
    }
  }
}
