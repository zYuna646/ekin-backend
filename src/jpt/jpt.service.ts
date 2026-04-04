import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IJpt, IJptService } from './interface/jpt.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { CreateJptDto } from './dto/create-jpt.dto';
import { UpdateJptDto } from './dto/update-jpt.dto';
import { FiltersJptDto } from './dto/filters-jpt.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class JptService implements IJptService {
  private readonly logger = new Logger(JptService.name);
  constructor(private prisma: PrismaService) {}

  async checkData(id: string): Promise<IJpt> {
    try {
      const data = await this.prisma.jpt.findUnique({
        where: { id },
      });
      if (!data) {
        this.logger.warn(`Jpt with id ${id} not found`);
        throw new NotFoundException(`Jpt with id ${id} not found`);
      }
      return data;
    } catch (error) {
      this.logger.error('Failed to retrieve jpt', error);
      throw error;
    }
  }

  async create(createJptDto: CreateJptDto): Promise<IApiResponse<IJpt> | null> {
    try {
      const data = await this.prisma.jpt.create({
        data: createJptDto,
      });
      return {
        data,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'Jpt created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create jpt', error);
      throw error;
    }
  }

  async findAll(filters: FiltersJptDto): Promise<IApiResponse<IJpt[]> | null> {
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
        this.prisma.jpt.count({ where }),
        this.prisma.jpt.findMany({
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
        message: 'Jpt list retrieved successfully',
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve jpt list', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<IJpt> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Jpt retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve jpt', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateJptDto: UpdateJptDto,
  ): Promise<IApiResponse<IJpt> | null> {
    try {
      await this.checkData(id);
      const updatedData = await this.prisma.jpt.update({
        where: { id },
        data: updateJptDto,
      });
      return {
        data: updatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Jpt updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update jpt', error);
      throw error;
    }
  }

  async remove(id: string): Promise<IApiResponse<IJpt> | null> {
    try {
      const data = await this.checkData(id);
      await this.prisma.jpt.delete({ where: { id } });
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Jpt deleted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to delete jpt', error);
      throw error;
    }
  }
}
