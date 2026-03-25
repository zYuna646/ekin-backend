import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateVisiDto } from './dto/create-visi.dto';
import { UpdateVisiDto } from './dto/update-visi.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IVisi, IVisiService } from './interface/visi.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { FiltersVisiDto } from './dto/filters-visi.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class VisiService implements IVisiService {
  private readonly logger = new Logger(VisiService.name);
  constructor(private prisma: PrismaService) {}

  async checkData(id: string): Promise<IVisi> {
    try {
      const data = await this.prisma.visi.findUnique({
        where: { id },
        include: { misi: true },
      });
      if (!data) {
        this.logger.warn(`Visi with id ${id} not found`);
        throw new NotFoundException(`Visi with id ${id} not found`);
      }
      return data;
    } catch (error) {
      this.logger.error('Failed to retrieve visi', error);
      throw error;
    }
  }

  async create(
    createVisiDto: CreateVisiDto,
  ): Promise<IApiResponse<IVisi> | null> {
    try {
      const data = await this.prisma.visi.create({
        data: createVisiDto,
        include: { misi: true },
      });
      return {
        data,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'Visi created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create visi', error);
      throw error;
    }
  }

  async findAll(
    filters: FiltersVisiDto,
  ): Promise<IApiResponse<IVisi[]> | null> {
    try {
      const { search, page = 1, perPage = 10 } = filters;
      const offset = (page - 1) * perPage;
      const where = search
        ? {
            name: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {};

      const [totalItems, data] = await this.prisma.$transaction([
        this.prisma.visi.count({ where }),
        this.prisma.visi.findMany({
          where,
          include: { misi: true },
          skip: offset,
          take: perPage,
        }),
      ]);

      const totalPages = Math.ceil(totalItems / perPage);

      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Visi list retrieved successfully',
        pagination: {
          totalItems,
          page,
          perPage,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve visi list', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<IVisi> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Visi retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve visi with id ${id}`, error);
      throw error;
    }
  }

  async update(
    id: string,
    updateVisiDto: UpdateVisiDto,
  ): Promise<IApiResponse<IVisi> | null> {
    try {
      await this.checkData(id);
      const updatedData = await this.prisma.visi.update({
        where: { id },
        data: updateVisiDto,
        include: { misi: true },
      });
      return {
        data: updatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Visi updated successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to update visi with id ${id}`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<IApiResponse<IVisi> | null> {
    try {
      const data = await this.checkData(id);
      await this.prisma.visi.delete({ where: { id } });
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Visi removed successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to remove visi with id ${id}`, error);
      throw error;
    }
  }
}
