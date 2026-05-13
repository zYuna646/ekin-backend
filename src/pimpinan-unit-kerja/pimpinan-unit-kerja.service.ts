import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  IPimpinanUnitKerja,
  IPimpinanUnitKerjaService,
} from './interface/pimpinan-unit-kerja.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { CreatePimpinanUnitKerjaDto } from './dto/create-pimpinan-unit-kerja.dto';
import { UpdatePimpinanUnitKerjaDto } from './dto/update-pimpinan-unit-kerja.dto';
import { FiltersPimpinanUnitKerjaDto } from './dto/filters-pimpinan-unit-kerja.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PimpinanUnitKerjaService implements IPimpinanUnitKerjaService {
  private readonly logger = new Logger(PimpinanUnitKerjaService.name);
  constructor(private prisma: PrismaService) {}

  async checkData(id: string): Promise<IPimpinanUnitKerja> {
    try {
      const data = await this.prisma.pimpinanUnitKerja.findUnique({
        where: { id },
      });
      if (!data) {
        this.logger.warn(
          `PimpinanUnitKerja with id ${id} not found`,
        );
        throw new NotFoundException(
          `PimpinanUnitKerja with id ${id} not found`,
        );
      }
      return data;
    } catch (error) {
      this.logger.error('Failed to retrieve pimpinanUnitKerja', error);
      throw error;
    }
  }

  async create(
    createPimpinanUnitKerjaDto: CreatePimpinanUnitKerjaDto,
  ): Promise<IApiResponse<IPimpinanUnitKerja> | null> {
    try {
      // Check if record with same unitKerjaId already exists
      const existingRecord =
        await this.prisma.pimpinanUnitKerja.findFirst({
          where: { unitKerjaId: createPimpinanUnitKerjaDto.unitKerjaId },
        });

      if (existingRecord) {
        // Merge and deduplicate NIPs
        const mergedNips = [
          ...new Set([...existingRecord.nip, ...createPimpinanUnitKerjaDto.nip]),
        ];

        // Update existing record with merged NIPs
        const data = await this.prisma.pimpinanUnitKerja.update({
          where: { id: existingRecord.id },
          data: { nip: mergedNips },
        });

        this.logger.log(
          `Updated existing PimpinanUnitKerja for unitKerjaId ${createPimpinanUnitKerjaDto.unitKerjaId} with merged NIPs`,
        );

        return {
          data,
          code: HttpStatus.OK,
          status: StatusApi.SUCCESS,
          message: 'PimpinanUnitKerja updated with new NIPs',
        };
      }

      // Create new record if doesn't exist
      const data = await this.prisma.pimpinanUnitKerja.create({
        data: createPimpinanUnitKerjaDto,
      });
      return {
        data,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'PimpinanUnitKerja created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create pimpinanUnitKerja', error);
      throw error;
    }
  }

  async findAll(
    filters: FiltersPimpinanUnitKerjaDto,
  ): Promise<IApiResponse<IPimpinanUnitKerja[]> | null> {
    try {
      const { search, unitId, unitKerjaId, page = 1, perPage = 10 } = filters;
      const offset = (page - 1) * perPage;
      const where = {
        ...(unitId && { unitId }),
        ...(unitKerjaId && { unitKerjaId }),
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }),
      };
      const [totalItems, data] = await this.prisma.$transaction([
        this.prisma.pimpinanUnitKerja.count({ where }),
        this.prisma.pimpinanUnitKerja.findMany({
          where,
          skip: offset,
          take: perPage,
        }),
      ]);

      const totalPages = Math.ceil(totalItems / perPage);

      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'PimpinanUnitKerja list retrieved successfully',
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve pimpinanUnitKerja list', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<IPimpinanUnitKerja> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'PimpinanUnitKerja retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve pimpinanUnitKerja', error);
      throw error;
    }
  }

  async findByUnitId(
    unitId: string,
  ): Promise<IApiResponse<IPimpinanUnitKerja[]> | null> {
    try {
      const data = await this.prisma.pimpinanUnitKerja.findMany({
        where: { unitId },
      });

      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'PimpinanUnitKerja list retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve pimpinanUnitKerja by unitId', error);
      throw error;
    }
  }

  async update(
    id: string,
    updatePimpinanUnitKerjaDto: UpdatePimpinanUnitKerjaDto,
  ): Promise<IApiResponse<IPimpinanUnitKerja> | null> {
    try {
      await this.checkData(id);
      const updatedData = await this.prisma.pimpinanUnitKerja.update({
        where: { id },
        data: updatePimpinanUnitKerjaDto,
      });
      return {
        data: updatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'PimpinanUnitKerja updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update pimpinanUnitKerja', error);
      throw error;
    }
  }

  async remove(id: string): Promise<IApiResponse<IPimpinanUnitKerja> | null> {
    try {
      const data = await this.checkData(id);
      await this.prisma.pimpinanUnitKerja.delete({ where: { id } });
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'PimpinanUnitKerja deleted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to delete pimpinanUnitKerja', error);
      throw error;
    }
  }
}
