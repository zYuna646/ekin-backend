import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkpDto } from './dto/create-skp.dto';
import { UpdateSkpDto } from './dto/update-skp.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ISkp, ISkpService } from './interface/skp.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { FiltersSkpDto } from './dto/filters-skp.dto';
import { Prisma } from '@prisma/client';
import {
  SKP_STATUS,
  SKP_CASCADING,
  SKP_LAMPIRAN_DEFAULT,
} from 'src/common/const/skp.const';
import { UnorService } from 'src/idasn/services/unor.service';

@Injectable()
export class SkpService implements ISkpService {
  private readonly logger = new Logger(SkpService.name);
  constructor(
    private prisma: PrismaService,
    private unorService: UnorService,
  ) {}

  private async validateUnitIds(unitIds: string[]): Promise<void> {
    if (!unitIds || unitIds.length === 0) return;

    try {
      for (const unitId of unitIds) {
        await this.unorService.getUnorById(unitId);
      }
    } catch (error) {
      this.logger.warn(`Invalid unitId in array`);
      throw new BadRequestException(`Invalid unitId: one or more unitIds are invalid`);
    }
  }

  async checkData(id: string): Promise<ISkp> {
    try {
      const data = await this.prisma.skp.findUnique({
        where: { id },
        include: {
          renstra: true,
          childSkps: {
            include: { child: true },
          },
          parentSkps: {
            include: { parent: true },
          },
        },
      });
      if (!data) {
        this.logger.warn(`Skp with id ${id} not found`);
        throw new NotFoundException(`Skp with id ${id} not found`);
      }

      const res: ISkp = {
        ...(data as any),
        childSkps: data.childSkps?.map((rel: any) => rel.child) ?? [],
        parentSkps: data.parentSkps?.map((rel: any) => rel.parent) ?? [],
      };
      return res;
    } catch (error) {
      this.logger.error('Failed to retrieve skp', error);
      throw error;
    }
  }

  async create(createSkpDto: CreateSkpDto): Promise<IApiResponse<ISkp> | null> {
    try {
      const skpData: any = {
        nip: createSkpDto.nip,
        startDate: createSkpDto.startDate,
        endDate: createSkpDto.endDate,
        pendekatan: createSkpDto.pendekatan,
        renstraId: createSkpDto.renstraId,
      };

      const skp = await this.prisma.$transaction(async (tx) => {
        const newSkp = await tx.skp.create({
          data: skpData,
        });

        // Create default lampiran records with empty arrays
        const lampiranDefaults = Object.values(SKP_LAMPIRAN_DEFAULT);
        if (lampiranDefaults.length > 0) {
          await tx.skpLampiran.createMany({
            data: lampiranDefaults.map((name) => ({
              name,
              value: [],
              skpId: newSkp.id,
            })),
          });
        }

        return newSkp;
      });

      const result = await this.checkData(skp.id);
      return {
        data: result,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'Skp created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create skp', error);
      throw error;
    }
  }

  async findAll(filters: FiltersSkpDto): Promise<IApiResponse<ISkp[]> | null> {
    try {
      const { search, page = 1, perPage = 10, renstraId, unitId } = filters;
      const offset = (page - 1) * perPage;

      const where: any = {
        ...(renstraId && { renstraId }),
        ...(unitId && { unitId: { has: unitId } }),
        ...(search && {
          OR: [
            { nip: { contains: search, mode: Prisma.QueryMode.insensitive } },
            {
              status: { contains: search, mode: Prisma.QueryMode.insensitive },
            },
          ],
        }),
      };

      const [totalItems, data] = await this.prisma.$transaction([
        this.prisma.skp.count({ where }),
        this.prisma.skp.findMany({
          where,
          skip: offset,
          take: perPage,
          include: {
            renstra: true,
            childSkps: { include: { child: true } },
            parentSkps: { include: { parent: true } },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalItems / perPage);

      const result = data.map((skp: any) => ({
        ...skp,
        childSkps: skp.childSkps?.map((rel: any) => rel.child) ?? [],
        parentSkps: skp.parentSkps?.map((rel: any) => rel.parent) ?? [],
      }));

      return {
        data: result,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Skp list retrieved successfully',
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve skp list', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<ISkp> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Skp retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve skp', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateSkpDto: UpdateSkpDto,
  ): Promise<IApiResponse<ISkp> | null> {
    try {
      await this.checkData(id);
      const { childSkpIds, ...skpData } = updateSkpDto;

      // Validate unitIds if being updated
      if (skpData.unitId && skpData.unitId.length > 0) {
        await this.validateUnitIds(skpData.unitId);
      }

      // Update SKP data
      await this.prisma.skp.update({
        where: { id },
        data: skpData as any,
      });

      // If childSkpIds provided, update relationships
      if (childSkpIds !== undefined) {
        // Delete all existing child relationships
        await this.prisma.skpRelation.deleteMany({
          where: { parentId: id },
        });

        // Create new relationships
        if (childSkpIds.length > 0) {
          await this.prisma.$transaction(async (tx) => {
            for (const childSkpId of childSkpIds) {
              await tx.skpRelation.create({
                data: {
                  parentId: id,
                  childId: childSkpId,
                },
              });
            }
          });
        }
      }

      const result = await this.checkData(id);
      return {
        data: result,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Skp updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update skp', error);
      throw error;
    }
  }

  async remove(id: string): Promise<IApiResponse<ISkp> | null> {
    try {
      const data = await this.checkData(id);

      // Delete all relationships (parent and child)
      await this.prisma.skpRelation.deleteMany({
        where: {
          OR: [{ parentId: id }, { childId: id }],
        },
      });

      await this.prisma.skp.delete({ where: { id } });
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Skp deleted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to delete skp', error);
      throw error;
    }
  }
}
