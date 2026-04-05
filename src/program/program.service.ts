import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IApiResponse } from 'src/common/interface/api.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { Prisma } from '@prisma/client';
import { IProgram, IProgramService } from './interface/program.interface';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { FiltersProgramDto } from './dto/filters-program.dto';
import { UnorService } from 'src/idasn/services/unor.service';

@Injectable()
export class ProgramService implements IProgramService {
  private readonly logger = new Logger(ProgramService.name);
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

  async checkData(id: string): Promise<IProgram> {
    try {
      const data = await this.prisma.program.findUnique({
        where: { id },
        include: {
          tujuan: true,
          programIndicators: {
            include: { indicator: true },
          },
        },
      });
      if (!data) {
        this.logger.warn(`Program with id ${id} not found`);
        throw new NotFoundException(`Program with id ${id} not found`);
      }
      const { programIndicators, ...program } = data as any;
      const res: IProgram = {
        ...program,
        indicators: programIndicators?.map((pi: any) => pi.indicator) ?? [],
      };
      return res;
    } catch (error) {
      this.logger.error('Failed to retrieve program', error);
      throw error;
    }
  }

  async create(
    createProgramDto: CreateProgramDto,
  ): Promise<IApiResponse<IProgram> | null> {
    try {
      const { indicators, ...programData } = createProgramDto;

      // Validate unitId
      if (programData.unitId) {
        await this.validateUnitId(programData.unitId);
      }

      const program = await this.prisma.program.create({
        data: programData,
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
            await tx.programIndicator.createMany({
              data: createdIndicators.map((indicatorId) => ({
                programId: program.id,
                indicatorId,
              })),
            });
          }
        });
      }

      const data = await this.prisma.program.findUnique({
        where: { id: program.id },
        include: {
          tujuan: true,
          programIndicators: {
            include: { indicator: true },
          },
        },
      });

      const { programIndicators, ...rest } = data as any;
      const res: IProgram = {
        ...rest,
        indicators: programIndicators?.map((pi: any) => pi.indicator) ?? [],
      };

      return {
        data: res,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'Program created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create program', error);
      throw error;
    }
  }

  async findAll(
    filters: FiltersProgramDto,
  ): Promise<IApiResponse<IProgram[]> | null> {
    try {
      const { search, unitIds, tujuanId, page = 1, perPage = 10 } = filters;
      const offset = (page - 1) * perPage;
      const where = {
        ...(unitIds && unitIds.length > 0 && { unitId: { in: unitIds } }),
        ...(tujuanId && { tujuanId }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }),
      };
      const [totalItems, data] = await this.prisma.$transaction([
        this.prisma.program.count({ where }),
        this.prisma.program.findMany({
          where,
          include: {
            tujuan: true,
            programIndicators: {
              include: { indicator: true },
            },
          },
          skip: offset,
          take: perPage,
        }),
      ]);
      const totalPages = Math.ceil(totalItems / perPage);
      const res: IProgram[] = (data as any[]).map((item) => {
        const { programIndicators, ...program } = item;
        return {
          ...program,
          indicators: programIndicators?.map((pi: any) => pi.indicator) ?? [],
        };
      });
      return {
        data: res,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Program list retrieved successfully',
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve program list', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<IProgram> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Program retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve program', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateProgramDto: UpdateProgramDto,
  ): Promise<IApiResponse<IProgram> | null> {
    try {
      await this.checkData(id);
      const { indicators, ...updateData } = updateProgramDto;

      // Validate unitId if being updated
      if (updateData.unitId) {
        await this.validateUnitId(updateData.unitId);
      }

      await this.prisma.program.update({
        where: { id },
        data: updateData,
      });

      if (indicators) {
        await this.prisma.$transaction(async (tx) => {
          await tx.programIndicator.deleteMany({
            where: { programId: id },
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
              await tx.programIndicator.createMany({
                data: createdIndicators.map((indicatorId) => ({
                  programId: id,
                  indicatorId,
                })),
              });
            }
          }
        });
      }

      const data = await this.prisma.program.findUnique({
        where: { id },
        include: {
          tujuan: true,
          programIndicators: {
            include: { indicator: true },
          },
        },
      });
      const { programIndicators, ...rest } = data as any;
      const updatedData: IProgram = {
        ...rest,
        indicators: programIndicators?.map((pi: any) => pi.indicator) ?? [],
      };
      return {
        data: updatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Program updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update program', error);
      throw error;
    }
  }

  async remove(id: string): Promise<IApiResponse<IProgram> | null> {
    try {
      const data = await this.checkData(id);
      await this.prisma.program.delete({ where: { id } });
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Program deleted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to delete program', error);
      throw error;
    }
  }
}
