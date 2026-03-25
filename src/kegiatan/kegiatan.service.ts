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
import { IKegiatan, IKegiatanService } from './interface/kegiatan.interface';
import { CreateKegiatanDto } from './dto/create-kegiatan.dto';
import { UpdateKegiatanDto } from './dto/update-kegiatan.dto';
import { FiltersKegiatanDto } from './dto/filters-kegiatan.dto';

@Injectable()
export class KegiatanService implements IKegiatanService {
  private readonly logger = new Logger(KegiatanService.name);
  constructor(private prisma: PrismaService) {}

  async checkData(id: string): Promise<IKegiatan> {
    try {
      const data = await this.prisma.kegiatan.findUnique({
        where: { id },
        include: {
          program: true,
          kegiatanIndicators: {
            include: { indicator: true },
          },
        },
      });
      if (!data) {
        this.logger.warn(`Kegiatan with id ${id} not found`);
        throw new NotFoundException(`Kegiatan with id ${id} not found`);
      }
      const { kegiatanIndicators, ...kegiatan } = data as any;
      const res: IKegiatan = {
        ...kegiatan,
        indicators: kegiatanIndicators?.map((ki: any) => ki.indicator) ?? [],
      };
      return res;
    } catch (error) {
      this.logger.error('Failed to retrieve kegiatan', error);
      throw error;
    }
  }

  async create(
    createKegiatanDto: CreateKegiatanDto,
  ): Promise<IApiResponse<IKegiatan> | null> {
    try {
      const { indicators, ...kegiatanData } = createKegiatanDto;
      const kegiatan = await this.prisma.kegiatan.create({
        data: kegiatanData,
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
            await tx.kegiatanIndicator.createMany({
              data: createdIndicators.map((indicatorId) => ({
                kegiatanId: kegiatan.id,
                indicatorId,
              })),
            });
          }
        });
      }

      const data = await this.prisma.kegiatan.findUnique({
        where: { id: kegiatan.id },
        include: {
          program: true,
          kegiatanIndicators: {
            include: { indicator: true },
          },
        },
      });

      const { kegiatanIndicators, ...rest } = data as any;
      const res: IKegiatan = {
        ...rest,
        indicators: kegiatanIndicators?.map((ki: any) => ki.indicator) ?? [],
      };

      return {
        data: res,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'Kegiatan created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create kegiatan', error);
      throw error;
    }
  }

  async findAll(
    filters: FiltersKegiatanDto,
  ): Promise<IApiResponse<IKegiatan[]> | null> {
    try {
      const { search, unitId, programId, page = 1, perPage = 10 } = filters;
      const offset = (page - 1) * perPage;
      const where = {
        ...(unitId && { unitId }),
        ...(programId && { programId }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }),
      };
      const [totalItems, data] = await this.prisma.$transaction([
        this.prisma.kegiatan.count({ where }),
        this.prisma.kegiatan.findMany({
          where,
          include: {
            program: true,
            kegiatanIndicators: {
              include: { indicator: true },
            },
          },
          skip: offset,
          take: perPage,
        }),
      ]);
      const totalPages = Math.ceil(totalItems / perPage);
      const res: IKegiatan[] = (data as any[]).map((item) => {
        const { kegiatanIndicators, ...kegiatan } = item;
        return {
          ...kegiatan,
          indicators: kegiatanIndicators?.map((ki: any) => ki.indicator) ?? [],
        };
      });
      return {
        data: res,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Kegiatan list retrieved successfully',
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve kegiatan list', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<IKegiatan> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Kegiatan retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve kegiatan', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateKegiatanDto: UpdateKegiatanDto,
  ): Promise<IApiResponse<IKegiatan> | null> {
    try {
      await this.checkData(id);
      const { indicators, ...updateData } = updateKegiatanDto;
      await this.prisma.kegiatan.update({
        where: { id },
        data: updateData,
      });

      if (indicators) {
        await this.prisma.$transaction(async (tx) => {
          await tx.kegiatanIndicator.deleteMany({
            where: { kegiatanId: id },
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
              await tx.kegiatanIndicator.createMany({
                data: createdIndicators.map((indicatorId) => ({
                  kegiatanId: id,
                  indicatorId,
                })),
              });
            }
          }
        });
      }

      const data = await this.prisma.kegiatan.findUnique({
        where: { id },
        include: {
          program: true,
          kegiatanIndicators: {
            include: { indicator: true },
          },
        },
      });
      const { kegiatanIndicators, ...rest } = data as any;
      const updatedData: IKegiatan = {
        ...rest,
        indicators: kegiatanIndicators?.map((ki: any) => ki.indicator) ?? [],
      };
      return {
        data: updatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Kegiatan updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update kegiatan', error);
      throw error;
    }
  }

  async remove(id: string): Promise<IApiResponse<IKegiatan> | null> {
    try {
      const data = await this.checkData(id);
      await this.prisma.kegiatan.delete({ where: { id } });
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Kegiatan deleted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to delete kegiatan', error);
      throw error;
    }
  }
}
