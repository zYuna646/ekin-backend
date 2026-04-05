import { Logger } from '@nestjs/common';
import { IdasnService } from '../idasn.service';
import { IJabatan, IJabatanService } from '../interface/jabatan.interface';
import { IIdasnResponse } from '../interface/idasn.interface';
import { IDASN_ENDPOINTS } from 'src/common/const/idasn.const';

export class JabatanService extends IdasnService implements IJabatanService {
  private readonly logger = new Logger(JabatanService.name);

  async getJabatanByUnorId(unorId: string): Promise<IJabatan[]> {
    try {
      const res: IIdasnResponse<{ data: IJabatan[] }> = await this.get(
        IDASN_ENDPOINTS.JABATAN.GET_JABATAN_BY_UNOR_ID(unorId),
      );

      return res.mapData.data;
    } catch (error) {
      this.logger.error(`Failed to fetch Jabatan for Unor ID ${unorId}`, error);
      throw error;
    }
  }
}
