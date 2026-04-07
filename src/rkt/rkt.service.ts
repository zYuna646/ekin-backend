import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRktDto } from './dto/create-rkt.dto';
import { UpdateRktDto } from './dto/update-rkt.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IRkt, IRktService } from './interface/rkt.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { FiltersRktDto } from './dto/filters-rkt.dto';
import { Prisma } from '@prisma/client';
import { RKT_LABELS } from 'src/common/const/rkt.const';
import { UnorService } from 'src/idasn/services/unor.service';

@Injectable()
export class RktService implements IRktService {
  private readonly logger = new Logger(RktService.name);
  constructor(
    private prisma: PrismaService,
    private unorService: UnorService,
  ) {}

  private validateBudgetRule(
    totalAnggaran: number,
    label?: string | null,
  ): void {
    if (label === RKT_LABELS.KINERJA_BERBASIS_ANGGARAN && totalAnggaran <= 0) {
      throw new BadRequestException(
        'totalAnggaran must be greater than 0 for Kinerja Berbasis Anggaran',
      );
    }

    if (
      label === RKT_LABELS.KINERJA_BERBASIS_NON_ANGGARAN &&
      totalAnggaran < 0
    ) {
      throw new BadRequestException(
        'totalAnggaran cannot be less than 0 for Kinerja Berbasis Non-Anggaran',
      );
    }
  }

  private async validateUnitId(unitId: string): Promise<void> {
    try {
      await this.unorService.getUnorById(unitId);
    } catch (error) {
      this.logger.warn(`Invalid unitId: ${unitId}`);
      throw new BadRequestException(`Invalid unitId: ${unitId}`);
    }
  }

  async checkData(id: string): Promise<IRkt> {
    try {
      const data = await this.prisma.rkt.findUnique({
        where: { id },
        include: {
          renstra: true,
          rktSubKegiatans: { include: { subKegiatan: true } },
          rktInputIndicators: { include: { indicator: true } },
          rktOutputIndicators: { include: { indicator: true } },
          rktOutcomeIndicators: { include: { indicator: true } },
        },
      });
      if (!data) {
        this.logger.warn(`Rkt with id ${id} not found`);
        throw new NotFoundException(`Rkt with id ${id} not found`);
      }
      const {
        rktSubKegiatans,
        rktInputIndicators,
        rktOutputIndicators,
        rktOutcomeIndicators,
        ...rkt
      } = data as any;
      const res: IRkt = {
        ...rkt,
        subKegiatan: rktSubKegiatans?.map((rsk: any) => rsk.subKegiatan) ?? [],
        input: rktInputIndicators?.map((ri: any) => ri.indicator) ?? [],
        output: rktOutputIndicators?.map((ro: any) => ro.indicator) ?? [],
        outcome: rktOutcomeIndicators?.map((roc: any) => roc.indicator) ?? [],
      };
      return res;
    } catch (error) {
      this.logger.error('Failed to retrieve rkt', error);
      throw error;
    }
  }

  async create(createRktDto: CreateRktDto): Promise<IApiResponse<IRkt> | null> {
    try {
      const { subKegiatan, input, output, outcome, ...rktData } = createRktDto;

      // Validate unitId
      if (rktData.unitId) {
        await this.validateUnitId(rktData.unitId);
      }

      this.validateBudgetRule(rktData.totalAnggaran, rktData.label);

      const rkt = await this.prisma.rkt.create({
        data: rktData,
      });

      await this.prisma.$transaction(async (tx) => {
        // Link sub-kegiatans
        if (subKegiatan?.length) {
          await tx.rktSubKegiatan.createMany({
            data: subKegiatan.map((subKegiatanId) => ({
              subKegiatanId,
              rktId: rkt.id,
            })),
          });
        }

        // Create input indicators
        if (input?.length) {
          const createdIndicators: string[] = [];
          for (const indicator of input) {
            const created = await tx.indicator.create({
              data: indicator,
            });
            createdIndicators.push(created.id);
          }
          if (createdIndicators.length) {
            await tx.rktInputIndicator.createMany({
              data: createdIndicators.map((indicatorId) => ({
                rktId: rkt.id,
                indicatorId,
              })),
            });
          }
        }

        // Create output indicators
        if (output?.length) {
          const createdIndicators: string[] = [];
          for (const indicator of output) {
            const created = await tx.indicator.create({
              data: indicator,
            });
            createdIndicators.push(created.id);
          }
          if (createdIndicators.length) {
            await tx.rktOutputIndicator.createMany({
              data: createdIndicators.map((indicatorId) => ({
                rktId: rkt.id,
                indicatorId,
              })),
            });
          }
        }

        // Create outcome indicators
        if (outcome?.length) {
          const createdIndicators: string[] = [];
          for (const indicator of outcome) {
            const created = await tx.indicator.create({
              data: indicator,
            });
            createdIndicators.push(created.id);
          }
          if (createdIndicators.length) {
            await tx.rktOutcomeIndicator.createMany({
              data: createdIndicators.map((indicatorId) => ({
                rktId: rkt.id,
                indicatorId,
              })),
            });
          }
        }
      });

      const data = await this.checkData(rkt.id);

      return {
        data,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'Rkt created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create rkt', error);
      throw error;
    }
  }

  async findAll(filters: FiltersRktDto): Promise<IApiResponse<IRkt[]> | null> {
    try {
      const { search, renstraId, unitIds, page = 1, perPage = 10 } = filters;
      const offset = (page - 1) * perPage;
      const where = {
        ...(renstraId && {
          renstraId,
        }),
        ...(unitIds &&
          unitIds.length > 0 && {
            unitId: { in: unitIds },
          }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }),
      };
      const [totalItems, data] = await this.prisma.$transaction([
        this.prisma.rkt.count({ where }),
        this.prisma.rkt.findMany({
          where,
          include: {
            renstra: true,
            rktSubKegiatans: { include: { subKegiatan: true } },
            rktInputIndicators: { include: { indicator: true } },
            rktOutputIndicators: { include: { indicator: true } },
            rktOutcomeIndicators: { include: { indicator: true } },
          },
          skip: offset,
          take: perPage,
        }),
      ]);

      const totalPages = Math.ceil(totalItems / perPage);
      const res: IRkt[] = (data as any[]).map((item) => {
        const {
          rktSubKegiatans,
          rktInputIndicators,
          rktOutputIndicators,
          rktOutcomeIndicators,
          ...rkt
        } = item;
        return {
          ...rkt,
          subKegiatan:
            rktSubKegiatans?.map((rsk: any) => rsk.subKegiatan) ?? [],
          input: rktInputIndicators?.map((ri: any) => ri.indicator) ?? [],
          output: rktOutputIndicators?.map((ro: any) => ro.indicator) ?? [],
          outcome: rktOutcomeIndicators?.map((roc: any) => roc.indicator) ?? [],
        };
      });

      return {
        data: res,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Rkt list retrieved successfully',
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve rkt', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<IRkt> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Rkt retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve rkt', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateRktDto: UpdateRktDto,
  ): Promise<IApiResponse<IRkt> | null> {
    try {
      const existingRkt = await this.checkData(id);
      const { subKegiatan, input, output, outcome, ...updateData } =
        updateRktDto;

      // Validate unitId if being updated
      if (updateData.unitId) {
        await this.validateUnitId(updateData.unitId);
      }

      this.validateBudgetRule(
        updateData.totalAnggaran ?? existingRkt.totalAnggaran,
        updateData.label ?? existingRkt.label,
      );

      await this.prisma.rkt.update({
        where: { id },
        data: updateData,
      });

      await this.prisma.$transaction(async (tx) => {
        // Handle sub-kegiatans
        if (subKegiatan !== undefined) {
          await tx.rktSubKegiatan.deleteMany({
            where: { rktId: id },
          });
          if (subKegiatan.length) {
            await tx.rktSubKegiatan.createMany({
              data: subKegiatan.map((subKegiatanId) => ({
                subKegiatanId,
                rktId: id,
              })),
            });
          }
        }

        // Handle input indicators
        if (input !== undefined) {
          await tx.rktInputIndicator.deleteMany({
            where: { rktId: id },
          });
          if (input.length) {
            const createdIndicators: string[] = [];
            for (const indicator of input) {
              const created = await tx.indicator.create({
                data: indicator,
              });
              createdIndicators.push(created.id);
            }
            if (createdIndicators.length) {
              await tx.rktInputIndicator.createMany({
                data: createdIndicators.map((indicatorId) => ({
                  rktId: id,
                  indicatorId,
                })),
              });
            }
          }
        }

        // Handle output indicators
        if (output !== undefined) {
          await tx.rktOutputIndicator.deleteMany({
            where: { rktId: id },
          });
          if (output.length) {
            const createdIndicators: string[] = [];
            for (const indicator of output) {
              const created = await tx.indicator.create({
                data: indicator,
              });
              createdIndicators.push(created.id);
            }
            if (createdIndicators.length) {
              await tx.rktOutputIndicator.createMany({
                data: createdIndicators.map((indicatorId) => ({
                  rktId: id,
                  indicatorId,
                })),
              });
            }
          }
        }

        // Handle outcome indicators
        if (outcome !== undefined) {
          await tx.rktOutcomeIndicator.deleteMany({
            where: { rktId: id },
          });
          if (outcome.length) {
            const createdIndicators: string[] = [];
            for (const indicator of outcome) {
              const created = await tx.indicator.create({
                data: indicator,
              });
              createdIndicators.push(created.id);
            }
            if (createdIndicators.length) {
              await tx.rktOutcomeIndicator.createMany({
                data: createdIndicators.map((indicatorId) => ({
                  rktId: id,
                  indicatorId,
                })),
              });
            }
          }
        }
      });

      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Rkt updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update rkt', error);
      throw error;
    }
  }

  async remove(id: string): Promise<IApiResponse<IRkt> | null> {
    try {
      const data = await this.checkData(id);
      await this.prisma.rkt.delete({ where: { id } });
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Rkt deleted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to delete rkt', error);
      throw error;
    }
  }
}
