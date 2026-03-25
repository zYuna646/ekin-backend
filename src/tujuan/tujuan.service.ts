import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ITujuan, ITujuanService } from './interface/tujuan.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { CreateTujuanDto } from './dto/create-tujuan.dto';
import { UpdateTujuanDto } from './dto/update-tujuan.dto';
import { FiltersTujuanDto } from './dto/filters-tujuan.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TujuanService implements ITujuanService {
  private readonly logger = new Logger(TujuanService.name);
  constructor(private prisma: PrismaService) {}

  async checkData(id: string): Promise<ITujuan> {
    try {
      const data = await this.prisma.tujuan.findUnique({
        where: { id },
        include: {
          renstra: true,
          tujuanIndicators: {
            include: {
              indicator: true,
            },
          },
        },
      });
      if (!data) {
        this.logger.warn(`Tujuan with id ${id} not found`);
        throw new NotFoundException(`Tujuan with id ${id} not found`);
      }
      const { tujuanIndicators, ...tujuan } = data as any;
      const res: ITujuan = {
        ...tujuan,
        indicators: tujuanIndicators?.map((ti: any) => ti.indicator) ?? [],
      };
      return res;
    } catch (error) {
      this.logger.error('Failed to retrieve tujuan', error);
      throw error;
    }
  }

  async create(
    createTujuanDto: CreateTujuanDto,
  ): Promise<IApiResponse<ITujuan> | null> {
    try {
      const { indicators, ...tujuanData } = createTujuanDto;
      const tujuan = await this.prisma.tujuan.create({
        data: tujuanData,
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
            await tx.tujuanIndicator.createMany({
              data: createdIndicators.map((indicatorId) => ({
                tujuanId: tujuan.id,
                indicatorId,
              })),
            });
          }
        });
      }

      const data = await this.prisma.tujuan.findUnique({
        where: { id: tujuan.id },
        include: {
          renstra: true,
          tujuanIndicators: {
            include: { indicator: true },
          },
        },
      });

      const { tujuanIndicators, ...rest } = data as any;
      const res: ITujuan = {
        ...rest,
        indicators: tujuanIndicators?.map((ti: any) => ti.indicator) ?? [],
      };

      return {
        data: res,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'Tujuan created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create tujuan', error);
      throw error;
    }
  }

  async findAll(
    filters: FiltersTujuanDto,
  ): Promise<IApiResponse<ITujuan[]> | null> {
    try {
      const { search, unitId, renstraId, page = 1, perPage = 10 } = filters;
      const offset = (page - 1) * perPage;
      const where = {
        ...(unitId && { unitId }),
        ...(renstraId && { renstraId }),
        ...(search && {
          name: { contains: search, mode: Prisma.QueryMode.insensitive },
        }),
      };
      const [totalItems, data] = await this.prisma.$transaction([
        this.prisma.tujuan.count({ where }),
        this.prisma.tujuan.findMany({
          where,
          include: {
            renstra: true,
            tujuanIndicators: {
              include: { indicator: true },
            },
          },
          skip: offset,
          take: perPage,
        }),
      ]);
      const totalPages = Math.ceil(totalItems / perPage);
      const res: ITujuan[] = (data as any[]).map((item) => {
        const { tujuanIndicators, ...tujuan } = item;
        return {
          ...tujuan,
          indicators: tujuanIndicators?.map((ti: any) => ti.indicator) ?? [],
        };
      });
      return {
        data: res,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Tujuan list retrieved successfully',
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve tujuan list', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<ITujuan> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Tujuan retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve tujuan', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateTujuanDto: UpdateTujuanDto,
  ): Promise<IApiResponse<ITujuan> | null> {
    try {
      await this.checkData(id);
      const { indicators, ...updateData } = updateTujuanDto;
      await this.prisma.tujuan.update({
        where: { id },
        data: updateData,
      });

      if (indicators) {
        await this.prisma.$transaction(async (tx) => {
          await tx.tujuanIndicator.deleteMany({
            where: { tujuanId: id },
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
              await tx.tujuanIndicator.createMany({
                data: createdIndicators.map((indicatorId) => ({
                  tujuanId: id,
                  indicatorId,
                })),
              });
            }
          }
        });
      }

      const data = await this.prisma.tujuan.findUnique({
        where: { id },
        include: {
          renstra: true,
          tujuanIndicators: {
            include: { indicator: true },
          },
        },
      });
      const { tujuanIndicators, ...rest } = data as any;
      const updatedData: ITujuan = {
        ...rest,
        indicators: tujuanIndicators?.map((ti: any) => ti.indicator) ?? [],
      };
      return {
        data: updatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Tujuan updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update tujuan', error);
      throw error;
    }
  }

  async remove(id: string): Promise<IApiResponse<ITujuan> | null> {
    try {
      const data = await this.checkData(id);
      await this.prisma.tujuan.delete({ where: { id } });
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Tujuan deleted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to delete tujuan', error);
      throw error;
    }
  }
}
