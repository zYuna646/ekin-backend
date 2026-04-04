import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUmpegDto } from './dto/create-umpeg.dto';
import { UpdateUmpegDto } from './dto/update-umpeg.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUmpeg, IUmpegService } from './interface/umpeg.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { FiltersUmpegDto } from './dto/filters-umpeg.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UmpegService implements IUmpegService {
  private readonly logger = new Logger(UmpegService.name);
  constructor(private prisma: PrismaService) {}

  async checkData(id: string): Promise<IUmpeg> {
    try {
      const data = await this.prisma.umpeg.findUnique({
        where: { id },
      });
      if (!data) {
        this.logger.warn(`Umpeg with id ${id} not found`);
        throw new NotFoundException(`Umpeg with id ${id} not found`);
      }
      return data;
    } catch (error) {
      this.logger.error('Failed to retrieve umpeg', error);
      throw error;
    }
  }

  async create(
    createUmpegDto: CreateUmpegDto,
  ): Promise<IApiResponse<IUmpeg> | null> {
    try {
      const data = await this.prisma.umpeg.create({
        data: createUmpegDto,
      });
      return {
        data,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'Umpeg created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create umpeg', error);
      throw error;
    }
  }

  async findAll(
    filters: FiltersUmpegDto,
  ): Promise<IApiResponse<IUmpeg[]> | null> {
    try {
      const { search, unitId, page = 1, perPage = 10 } = filters;
      const offset = (page - 1) * perPage;
      const where = {
        ...(unitId && { unitId }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }),
      };
      const [totalItems, data] = await this.prisma.$transaction([
        this.prisma.umpeg.count({ where }),
        this.prisma.umpeg.findMany({
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
        message: 'Umpeg list retrieved successfully',
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve umpeg list', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<IUmpeg> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Umpeg retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve umpeg', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateUmpegDto: UpdateUmpegDto,
  ): Promise<IApiResponse<IUmpeg> | null> {
    try {
      await this.checkData(id);
      const updatedData = await this.prisma.umpeg.update({
        where: { id },
        data: updateUmpegDto,
      });
      return {
        data: updatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Umpeg updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update umpeg', error);
      throw error;
    }
  }

  async remove(id: string): Promise<IApiResponse<IUmpeg> | null> {
    try {
      const data = await this.checkData(id);
      await this.prisma.umpeg.delete({ where: { id } });
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Umpeg deleted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to delete umpeg', error);
      throw error;
    }
  }
}
