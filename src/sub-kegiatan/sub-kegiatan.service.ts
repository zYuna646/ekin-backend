import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IApiResponse } from 'src/common/interface/api.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { Prisma } from '@prisma/client';
import {
  ISubKegiatan,
  ISubKegiatanService,
} from './interface/sub-kegiatan.interface';
import { CreateSubKegiatanDto } from './dto/create-sub-kegiatan.dto';
import { UpdateSubKegiatanDto } from './dto/update-sub-kegiatan.dto';
import { FiltersSubKegiatanDto } from './dto/filters-sub-kegiatan.dto';

@Injectable()
export class SubKegiatanService implements ISubKegiatanService {
  private readonly logger = new Logger(SubKegiatanService.name);
  constructor(private prisma: PrismaService) {}

  async checkData(id: string): Promise<ISubKegiatan> {
    try {
      const data = await this.prisma.subKegiatan.findUnique({
        where: { id },
        include: {
          kegiatan: true,
          subKegiatanIndicators: {
            include: { indicator: true },
          },
        },
      });
      if (!data) {
        this.logger.warn(`SubKegiatan with id ${id} not found`);
        throw new NotFoundException(`SubKegiatan with id ${id} not found`);
      }
      const { subKegiatanIndicators, ...subKegiatan } = data as any;
      const res: ISubKegiatan = {
        ...subKegiatan,
        indicators: subKegiatanIndicators?.map((si: any) => si.indicator) ?? [],
      };
      return res;
    } catch (error) {
      this.logger.error('Failed to retrieve sub-kegiatan', error);
      throw error;
    }
  }

  async create(
    createSubKegiatanDto: CreateSubKegiatanDto,
  ): Promise<IApiResponse<ISubKegiatan> | null> {
    try {
      const { indicators, ...subData } = createSubKegiatanDto;
      const subKegiatan = await this.prisma.subKegiatan.create({
        data: subData,
      });

      if (indicators?.length) {
        await this.prisma.$transaction(async (tx) => {
          const createdIndicators: string[] = [];
          for (const indicator of indicators) {
            const created = await tx.indicator.create({
              data: indicator,
            });
            createdIndicators.push(created.id);
          }
          if (createdIndicators.length) {
            await tx.subKegiatanIndicator.createMany({
              data: createdIndicators.map((indicatorId) => ({
                subKegiatanId: subKegiatan.id,
                indicatorId,
              })),
            });
          }
        });
      }

      const data = await this.prisma.subKegiatan.findUnique({
        where: { id: subKegiatan.id },
        include: {
          kegiatan: true,
          subKegiatanIndicators: {
            include: { indicator: true },
          },
        },
      });

      const { subKegiatanIndicators, ...rest } = data as any;
      const res: ISubKegiatan = {
        ...rest,
        indicators: subKegiatanIndicators?.map((si: any) => si.indicator) ?? [],
      };

      return {
        data: res,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'SubKegiatan created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create sub-kegiatan', error);
      throw error;
    }
  }

  async findAll(
    filters: FiltersSubKegiatanDto,
  ): Promise<IApiResponse<ISubKegiatan[]> | null> {
    try {
      const { search, unitId, kegiatanId, page = 1, perPage = 10 } = filters;
      const offset = (page - 1) * perPage;
      const where = {
        ...(unitId && { unitId }),
        ...(kegiatanId && { kegiatanId }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }),
      };
      const [totalItems, data] = await this.prisma.$transaction([
        this.prisma.subKegiatan.count({ where }),
        this.prisma.subKegiatan.findMany({
          where,
          include: {
            kegiatan: true,
            subKegiatanIndicators: {
              include: { indicator: true },
            },
          },
          skip: offset,
          take: perPage,
        }),
      ]);
      const totalPages = Math.ceil(totalItems / perPage);
      const res: ISubKegiatan[] = (data as any[]).map((item) => {
        const { subKegiatanIndicators, ...sub } = item;
        return {
          ...sub,
          indicators:
            subKegiatanIndicators?.map((si: any) => si.indicator) ?? [],
        };
      });
      return {
        data: res,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'SubKegiatan list retrieved successfully',
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve sub-kegiatan list', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<ISubKegiatan> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'SubKegiatan retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve sub-kegiatan', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateSubKegiatanDto: UpdateSubKegiatanDto,
  ): Promise<IApiResponse<ISubKegiatan> | null> {
    try {
      await this.checkData(id);
      const { indicators, ...updateData } = updateSubKegiatanDto;
      await this.prisma.subKegiatan.update({
        where: { id },
        data: updateData,
      });

      if (indicators) {
        await this.prisma.$transaction(async (tx) => {
          await tx.subKegiatanIndicator.deleteMany({
            where: { subKegiatanId: id },
          });
          if (indicators.length) {
            const createdIndicators: string[] = [];
            for (const indicator of indicators) {
              const created = await tx.indicator.create({
                data: indicator,
              });
              createdIndicators.push(created.id);
            }
            if (createdIndicators.length) {
              await tx.subKegiatanIndicator.createMany({
                data: createdIndicators.map((indicatorId) => ({
                  subKegiatanId: id,
                  indicatorId,
                })),
              });
            }
          }
        });
      }

      const data = await this.prisma.subKegiatan.findUnique({
        where: { id },
        include: {
          kegiatan: true,
          subKegiatanIndicators: {
            include: { indicator: true },
          },
        },
      });
      const { subKegiatanIndicators, ...rest } = data as any;
      const updatedData: ISubKegiatan = {
        ...rest,
        indicators: subKegiatanIndicators?.map((si: any) => si.indicator) ?? [],
      };
      return {
        data: updatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'SubKegiatan updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update sub-kegiatan', error);
      throw error;
    }
  }

  async remove(id: string): Promise<IApiResponse<ISubKegiatan> | null> {
    try {
      const data = await this.checkData(id);
      await this.prisma.subKegiatan.delete({ where: { id } });
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'SubKegiatan deleted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to delete sub-kegiatan', error);
      throw error;
    }
  }
}
