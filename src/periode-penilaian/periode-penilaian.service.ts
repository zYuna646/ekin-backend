import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePeriodePenilaianDto } from './dto/create-periode-penilaian.dto';
import { UpdatePeriodePenilaianDto } from './dto/update-periode-penilaian.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IPeriodePenilaian, IPeriodePenilaianService } from './interface/periode-penilaian.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { FiltersPeriodePenilaianDto } from './dto/filters-periode-penilaian.dto';
import { Prisma } from '@prisma/client';
import { UnorService } from 'src/idasn/services/unor.service';

@Injectable()
export class PeriodePenilaianService implements IPeriodePenilaianService {
  private readonly logger = new Logger(PeriodePenilaianService.name);
  constructor(
    private prisma: PrismaService,
    private unorService: UnorService,
  ) {}

  private async validateUnitId(unitId: string): Promise<void> {
    try {
      await this.unorService.getUnorById(unitId);
    } catch (error) {
      this.logger.warn(`Invalid unitId: ${unitId}`);
      throw new BadRequestException(`Invalid unitId: ${unitId}`);
    }
  }

  async checkData(id: string): Promise<IPeriodePenilaian> {
    try {
      const data = await this.prisma.periodePenilaian.findUnique({
        where: { id },
      });
      if (!data) {
        this.logger.warn(`Periode Penilaian with id ${id} not found`);
        throw new NotFoundException(`Periode Penilaian with id ${id} not found`);
      }
      return data;
    } catch (error) {
      this.logger.error('Failed to retrieve periode penilaian', error);
      throw error;
    }
  }

  async create(
    createPeriodePenilaianDto: CreatePeriodePenilaianDto,
  ): Promise<IApiResponse<IPeriodePenilaian> | null> {
    try {
      // Validate unitId
      if (createPeriodePenilaianDto.unitId) {
        await this.validateUnitId(createPeriodePenilaianDto.unitId);
      }

      const data = await this.prisma.periodePenilaian.create({
        data: {
          startDate: createPeriodePenilaianDto.startDate,
          endDate: createPeriodePenilaianDto.endDate,
          unitId: createPeriodePenilaianDto.unitId,
        },
      });

      return {
        data,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'Periode Penilaian created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create periode penilaian', error);
      throw error;
    }
  }

  async findAll(
    filters: FiltersPeriodePenilaianDto,
  ): Promise<IApiResponse<IPeriodePenilaian[]> | null> {
    try {
      const { search, unitIds, page = 1, perPage = 10 } = filters;
      const offset = (page - 1) * perPage;
      const where = {
        ...(unitIds && unitIds.length > 0 && { unitId: { in: unitIds } }),
        ...(search && {
          unitId: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };

      const [totalItems, data] = await this.prisma.$transaction([
        this.prisma.periodePenilaian.count({ where }),
        this.prisma.periodePenilaian.findMany({
          where,
          skip: offset,
          take: perPage,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Periode Penilaian list retrieved successfully',
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages: Math.ceil(totalItems / perPage),
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve periode penilaian list', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<IPeriodePenilaian> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Periode Penilaian retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve periode penilaian with id ${id}`, error);
      throw error;
    }
  }

  async update(
    id: string,
    updatePeriodePenilaianDto: UpdatePeriodePenilaianDto,
  ): Promise<IApiResponse<IPeriodePenilaian> | null> {
    try {
      await this.checkData(id);

      // Validate unitId if being updated
      if (updatePeriodePenilaianDto.unitId) {
        await this.validateUnitId(updatePeriodePenilaianDto.unitId);
      }

      const data = await this.prisma.periodePenilaian.update({
        where: { id },
        data: {
          ...(updatePeriodePenilaianDto.startDate && {
            startDate: updatePeriodePenilaianDto.startDate,
          }),
          ...(updatePeriodePenilaianDto.endDate && {
            endDate: updatePeriodePenilaianDto.endDate,
          }),
          ...(updatePeriodePenilaianDto.unitId && {
            unitId: updatePeriodePenilaianDto.unitId,
          }),
        },
      });

      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Periode Penilaian updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update periode penilaian', error);
      throw error;
    }
  }

  async remove(id: string): Promise<IApiResponse<IPeriodePenilaian> | null> {
    try {
      const data = await this.checkData(id);
      await this.prisma.periodePenilaian.delete({ where: { id } });
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Periode Penilaian removed successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to remove periode penilaian with id ${id}`, error);
      throw error;
    }
  }
}
