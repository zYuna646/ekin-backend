import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMisiDto } from './dto/create-misi.dto';
import { UpdateMisiDto } from './dto/update-misi.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IMisi } from './interface/misi.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { FiltersMisiDto } from './dto/filters-misi.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MisiService {
  private readonly logger = new Logger(MisiService.name);
  constructor(private prisma: PrismaService) {}

  async checkData(id: string) {
    try {
      const data = await this.prisma.misi.findUnique({
        where: { id },
        include: { visi: true },
      });
      if (!data) {
        this.logger.warn(`Misi with id ${id} not found`);
        throw new NotFoundException(`Misi with id ${id} not found`);
      }
      return data;
    } catch (error) {
      this.logger.error('Failed to retrieve misi', error);
      throw error;
    }
  }

  async create(
    createMisiDto: CreateMisiDto,
  ): Promise<IApiResponse<IMisi> | null> {
    try {
      const data = await this.prisma.misi.create({
        data: createMisiDto,
        include: { visi: true },
      });
      return {
        data,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'Misi created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create misi', error);
      throw error;
    }
  }

  async findAll(
    filters: FiltersMisiDto,
  ): Promise<IApiResponse<IMisi[]> | null> {
    try {
      const { search, visiId, page = 1, perPage = 10 } = filters;
      const offset = (page - 1) * perPage;
      const where = {
        ...(visiId && {
          visiId,
        }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { desc: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }),
      };
      const [totalItems, data] = await this.prisma.$transaction([
        this.prisma.misi.count({ where }),
        this.prisma.misi.findMany({
          where,
          include: { visi: true },
          skip: offset,
          take: perPage,
        }),
      ]);

      const totalPages = Math.ceil(totalItems / perPage);

      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Misi list retrieved successfully',
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve misi', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<IMisi> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Misi retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve misi', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateMisiDto: UpdateMisiDto,
  ): Promise<IApiResponse<IMisi> | null> {
    try {
      await this.checkData(id);
      const updatedData = await this.prisma.misi.update({
        where: { id },
        data: updateMisiDto,
        include: { visi: true },
      });
      return {
        data: updatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Misi updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update misi', error);
      throw error;
    }
  }

  async remove(id: string): Promise<IApiResponse<IMisi> | null> {
    try {
      const data = await this.checkData(id);
      await this.prisma.misi.delete({ where: { id } });
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Misi deleted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to delete misi', error);
      throw error;
    }
  }
}
