import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRenstraDto } from './dto/create-renstra.dto';
import { UpdateRenstraDto } from './dto/update-renstra.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IRenstra } from './interface/renstra.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { RenstraWithMisis } from './types/renstra.types';
import { FiltersRenstraDto } from './dto/filters-renstra.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RenstraService {
  private readonly logger = new Logger(RenstraService.name);
  constructor(private prisma: PrismaService) {}

  async checkData(id: string): Promise<IRenstra> {
    try {
      const data = await this.prisma.renstra.findUnique({
        where: { id },
        include: {
          renstraMisis: {
            include: {
              misi: true,
            },
          },
        },
      });
      if (!data) {
        this.logger.warn(`Renstra with id ${id} not found`);
        throw new NotFoundException(`Renstra with id ${id} not found`);
      }
      const { renstraMisis, ...renstra } = data;
      const res: IRenstra = {
        ...renstra,
        misis: renstraMisis?.map((rm) => rm.misi) ?? [],
      };
      return res;
    } catch (error) {
      this.logger.error('Failed to retrieve renstra', error);
      throw error;
    }
  }

  async create(
    createRenstraDto: CreateRenstraDto,
  ): Promise<IApiResponse<IRenstra> | null> {
    try {
      const data: RenstraWithMisis = await this.prisma.renstra.create({
        data: {
          ...createRenstraDto,
          renstraMisis: {
            createMany: {
              data:
                createRenstraDto.misiIds?.map((misiId) => ({
                  misiId,
                })) ?? [],
            },
          },
        },
        include: {
          renstraMisis: {
            include: {
              misi: true,
            },
          },
        },
      });

      const { renstraMisis, ...renstra } = data;
      const res: IRenstra = {
        ...renstra,
        misis: renstraMisis?.map((rm) => rm.misi) ?? [],
      };
      return {
        data: res,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'Renstra created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create renstra', error);
      throw error;
    }
  }

  async findAll(
    filters: FiltersRenstraDto,
  ): Promise<IApiResponse<IRenstra[]> | null> {
    try {
      const { search, unitId, misiId, page = 1, perPage = 10 } = filters;
      const offset = (page - 1) * perPage;
      const where = {
        ...(unitId && { unitId }),
        ...(search && {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(misiId && {
          renstraMisis: {
            some: {
              misiId,
            },
          },
        }),
      };

      const [totalItems, data] = await this.prisma.$transaction([
        this.prisma.renstra.count({ where }),
        this.prisma.renstra.findMany({
          where,
          include: {
            renstraMisis: {
              include: {
                misi: true,
              },
            },
          },
          skip: offset,
          take: perPage,
        }),
      ]);

      const res: IRenstra[] = data.map((item) => {
        const { renstraMisis, ...renstra } = item;
        return {
          ...renstra,
          misis: renstraMisis?.map((rm) => rm.misi) ?? [],
        };
      });

      return {
        data: res,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Renstra list retrieved successfully',
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages: Math.ceil(totalItems / perPage),
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve renstra list', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<IRenstra> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Renstra retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve renstra with id ${id}`, error);
      throw error;
    }
  }

  async update(
    id: string,
    updateRenstraDto: UpdateRenstraDto,
  ): Promise<IApiResponse<IRenstra> | null> {
    try {
      await this.checkData(id);
      const data: RenstraWithMisis = await this.prisma.renstra.update({
        where: { id },
        data: {
          ...updateRenstraDto,
          renstraMisis: updateRenstraDto.misiIds
            ? {
                deleteMany: {
                  renstraId: id,
                },
                createMany: {
                  data: updateRenstraDto.misiIds.map((misiId) => ({
                    misiId,
                  })),
                },
              }
            : undefined,
        },
        include: {
          renstraMisis: {
            include: {
              misi: true,
            },
          },
        },
      });

      const { renstraMisis, ...renstra } = data;
      const res: IRenstra = {
        ...renstra,
        misis: renstraMisis?.map((rm) => rm.misi) ?? [],
      };

      return {
        data: res,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Renstra updated successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to update renstra with id ${id}`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<IApiResponse<IRenstra> | null> {
    try {
      const data = await this.checkData(id);
      await this.prisma.renstra.delete({ where: { id } });
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Renstra removed successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to remove renstra with id ${id}`, error);
      throw error;
    }
  }
}
