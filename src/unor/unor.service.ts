import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IUnor, IUnorService } from './interface/unor.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { UnorService as IdasnUnorService } from 'src/idasn/services/unor.service';
import {
  IUnor as IIdasnUnor,
  IUnorDetails,
} from 'src/idasn/interface/unor.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { FilterUnorDto } from './dto/filter-unor.dto';
@Injectable()
export class UnorService implements IUnorService {
  private readonly logger = new Logger(UnorService.name);

  constructor(private readonly idasnUnorService: IdasnUnorService) {}

  async getUnorById(id: string): Promise<IApiResponse<IUnor>> {
    try {
      const res: IIdasnUnor = await this.idasnUnorService.getUnorById(id);
      const data: IUnor = {
        id: res.id_simpeg,
        name: res.nama_unor,
      };

      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Unor fetched successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch Unor with id ${id}`, error);
      throw error;
    }
  }
  async getUnor(filters: FilterUnorDto): Promise<IApiResponse<IUnor[]>> {
    try {
      const { search, page = 1, perPage = 10 } = filters;

      const res: IIdasnUnor[] = await this.idasnUnorService.getUnor();

      let data: IUnor[] = res.map((unor) => ({
        id: unor.id_simpeg,
        name: unor.nama_unor,
      }));

      if (search) {
        const keyword = search.toLowerCase();
        data = data.filter((item) => item.name.toLowerCase().includes(keyword));
      }

      const start = (page - 1) * perPage;
      const end = start + perPage;

      const paginatedData = data.slice(start, end);

      return {
        data: paginatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Unors fetched successfully',
        pagination: {
          totalItems: data.length,
          totalPages: Math.ceil(data.length / perPage),
          page,
          perPage,
        },
      };
    } catch (error) {
      this.logger.error('Failed to fetch Unors', error);
      throw error;
    }
  }
}
