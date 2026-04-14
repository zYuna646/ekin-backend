import {
  BadRequestException,
  ForbiddenException,
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
  SKP_APPROACH,
} from 'src/common/const/skp.const';
import { UnorService } from 'src/idasn/services/unor.service';
import { MODEL_LIST } from 'src/common/const/common.const';
import { ROLES } from 'src/common/const/role.const';
import { JabatanService } from 'src/idasn/services/jabatan.service';
import { IJabatan } from 'src/idasn/interface/jabatan.interface';

@Injectable()
export class SkpService implements ISkpService {
  private readonly logger = new Logger(SkpService.name);
  constructor(
    private prisma: PrismaService,
    private unorService: UnorService,
    private readonly jabatanService: JabatanService,
  ) {}

  private async validateUnitIds(unitIds: string[]): Promise<void> {
    if (!unitIds || unitIds.length === 0) return;

    try {
      for (const unitId of unitIds) {
        await this.unorService.getUnorById(unitId);
      }
    } catch (error) {
      this.logger.warn(`Invalid unitId in array`);
      throw new BadRequestException(
        `Invalid unitId: one or more unitIds are invalid`,
      );
    }
  }

  async checkData(id: string, includeStatuses: boolean = false): Promise<ISkp> {
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

      let statuses: any[] | undefined;
      if (includeStatuses) {
        statuses = await this.prisma.status.findMany({
          where: {
            model: MODEL_LIST.SKP,
            modelId: id,
          },
          orderBy: { createdAt: 'desc' },
        });
      }

      const res: ISkp = {
        ...(data as any),
        childSkps: data.childSkps?.map((rel: any) => rel.child) ?? [],
        parentSkps: data.parentSkps?.map((rel: any) => rel.parent) ?? [],
        ...(includeStatuses && { statuses }),
      };
      return res;
    } catch (error) {
      this.logger.error('Failed to retrieve skp', error);
      throw error;
    }
  }

  async create(
    createSkpDto: CreateSkpDto,
    userNip: string,
  ): Promise<IApiResponse<ISkp> | null> {
    try {
      const res: IJabatan = await this.jabatanService.getPosJab(userNip);
      if (!res) {
        throw new NotFoundException(`Jabatan for NIP ${userNip} not found`);
      }

      const skpData: any = {
        nip: userNip,
        startDate: createSkpDto.startDate,
        endDate: createSkpDto.endDate,
        renstraId: createSkpDto.renstraId,
        cascading: SKP_CASCADING.NOT_YET,
        pendekatan: SKP_APPROACH.KUALITATIF,
        jabatan: [res],
        unitId: [createSkpDto.unitId],
        status: SKP_STATUS.DRAFT,
      };

      const skp = await this.prisma.$transaction(async (tx) => {
        const newSkp = await tx.skp.create({
          data: skpData,
        });

        // Create initial status record
        await tx.status.create({
          data: {
            model: MODEL_LIST.SKP,
            modelId: newSkp.id,
            value: SKP_STATUS.DRAFT,
          },
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

      const result = await this.checkData(skp.id, true);
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

  async createBawahan(
    parentSkpId: string,
    createBawahanSkpDto: any,
  ): Promise<IApiResponse<ISkp> | null> {
    try {
      // Verify parent SKP exists
      const parentSkp = await this.checkData(parentSkpId);
      if (!parentSkp) {
        throw new NotFoundException(
          `Parent SKP with id ${parentSkpId} not found`,
        );
      }

      const bawahanNip = createBawahanSkpDto.bawahanNip;

      // Get jabatan for the bawahan user
      const res: IJabatan = await this.jabatanService.getPosJab(bawahanNip);
      if (!res) {
        throw new NotFoundException(`Jabatan for NIP ${bawahanNip} not found`);
      }

      // Convert date strings to Date objects
      const startDate = new Date(createBawahanSkpDto.startDate);
      const endDate = new Date(createBawahanSkpDto.endDate);

      const skpData: any = {
        nip: bawahanNip,
        startDate,
        endDate,
        renstraId: createBawahanSkpDto.renstraId,
        cascading: SKP_CASCADING.NOT_YET,
        pendekatan: SKP_APPROACH.KUALITATIF,
        jabatan: [res],
        unitId: [res.unor.induk?.id_simpeg.toString()],
        status: SKP_STATUS.DRAFT,
      };

      const skp = await this.prisma.$transaction(async (tx) => {
        // Create new SKP
        const newSkp = await tx.skp.create({
          data: skpData,
        });

        // Create initial status record
        await tx.status.create({
          data: {
            model: MODEL_LIST.SKP,
            modelId: newSkp.id,
            value: SKP_STATUS.DRAFT,
          },
        });

        // Create parent-child relationship
        await tx.skpRelation.create({
          data: {
            parentId: parentSkpId,
            childId: newSkp.id,
          },
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

      const result = await this.checkData(skp.id, true);
      return {
        data: result,
        code: HttpStatus.CREATED,
        status: StatusApi.SUCCESS,
        message: 'Bawahan SKP created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create bawahan skp', error);
      throw error;
    }
  }

  async findAll(
    filters: FiltersSkpDto,
    userNip?: string,
    userRoles?: string[],
  ): Promise<IApiResponse<ISkp[]> | null> {
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

      // If user is not ADMIN, filter to only their own SKPs
      if (userNip && userRoles && !userRoles.includes(ROLES.ADMIN)) {
        where.nip = userNip;
      }

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

      // Update SKP data and create status record if status changed
      await this.prisma.$transaction(async (tx) => {
        // Update SKP
        await tx.skp.update({
          where: { id },
          data: skpData as any,
        });

        // Create status record if status is updated
        if (skpData.status) {
          await tx.status.create({
            data: {
              model: MODEL_LIST.SKP,
              modelId: id,
              value: skpData.status,
            },
          });
        }

        // If childSkpIds provided, update relationships
        if (childSkpIds !== undefined) {
          // Delete all existing child relationships
          await tx.skpRelation.deleteMany({
            where: { parentId: id },
          });

          // Create new relationships
          if (childSkpIds.length > 0) {
            for (const childSkpId of childSkpIds) {
              await tx.skpRelation.create({
                data: {
                  parentId: id,
                  childId: childSkpId,
                },
              });
            }
          }
        }
      });

      const result = await this.checkData(id, true);
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

  async updateLampirans(
    id: string,
    updateSkpLampiranDto: any,
  ): Promise<IApiResponse<ISkp> | null> {
    try {
      const skp = await this.checkData(id);

      // Update lampirans
      await this.prisma.$transaction(async (tx) => {
        const lampiranUpdates = updateSkpLampiranDto.lampirans;

        // Update each lampiran
        for (const [lampiranName, values] of Object.entries(lampiranUpdates)) {
          // Find existing lampiran
          const existingLampiran = await tx.skpLampiran.findFirst({
            where: {
              skpId: id,
              name: lampiranName,
            },
          });

          if (existingLampiran) {
            // Update existing lampiran
            await tx.skpLampiran.update({
              where: {
                id: existingLampiran.id,
              },
              data: {
                value: values as string[],
              },
            });
          } else {
            // Create new lampiran if it doesn't exist
            await tx.skpLampiran.create({
              data: {
                skpId: id,
                name: lampiranName,
                value: values as string[],
              },
            });
          }
        }
      });

      const result = await this.checkData(id, true);
      return {
        data: result,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'SKP lampirans updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update skp lampirans', error);
      throw error;
    }
  }

  async remove(
    id: string,
    userNip?: string,
  ): Promise<IApiResponse<ISkp> | null> {
    try {
      const data = await this.checkData(id);

      // If userNip is provided, apply authorization and DRAFT status check
      if (userNip) {
        // Verify status is DRAFT
        if (data.status !== SKP_STATUS.DRAFT) {
          throw new BadRequestException(
            'SKP can only be deleted when in DRAFT status',
          );
        }

        // If current user owns the SKP (userNip matches skp.nip), they can delete directly
        const isOwner = data.nip === userNip;

        if (!isOwner) {
          // If not owner, check if current user is atasan
          const isAtasan =
            data.parentSkps &&
            data.parentSkps.length > 0 &&
            data.parentSkps.some((parent) => parent.nip === userNip);

          if (!isAtasan) {
            this.logger.warn(
              `User ${userNip} attempted to delete SKP without authorization (not owner or atasan)`,
            );
            throw new ForbiddenException(
              'Only the SKP owner or atasan can delete this SKP',
            );
          }
        }
      }

      // Delete in transaction to maintain referential integrity
      await this.prisma.$transaction(async (tx) => {
        // Delete lampirans first
        await tx.skpLampiran.deleteMany({
          where: { skpId: id },
        });

        // Delete all relationships (parent and child)
        await tx.skpRelation.deleteMany({
          where: {
            OR: [{ parentId: id }, { childId: id }],
          },
        });

        // Delete statuses
        await tx.status.deleteMany({
          where: {
            modelId: id,
            model: MODEL_LIST.SKP,
          },
        });

        // Delete SKP
        await tx.skp.delete({ where: { id } });
      });
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

  async submit(
    id: string,
    userNip: string,
  ): Promise<IApiResponse<ISkp> | null> {
    try {
      const skp = await this.checkData(id);

      // Verify current status is DRAFT
      if (skp.status !== SKP_STATUS.DRAFT) {
        throw new BadRequestException(
          `SKP can only be submitted from ${SKP_STATUS.DRAFT} status`,
        );
      }

      // Update status and create status record
      await this.prisma.$transaction(async (tx) => {
        await tx.skp.update({
          where: { id },
          data: { status: SKP_STATUS.SUBMITTED },
        });

        await tx.status.create({
          data: {
            model: MODEL_LIST.SKP,
            modelId: id,
            value: SKP_STATUS.SUBMITTED,
          },
        });
      });

      const result = await this.checkData(id, true);
      return {
        data: result,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Skp submitted successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to submit skp ${id}`, error);
      throw error;
    }
  }

  async approve(
    id: string,
    userNip: string,
    remarks?: string,
  ): Promise<IApiResponse<ISkp> | null> {
    try {
      const skp = await this.checkData(id);

      // Verify current status is SUBMITTED
      if (skp.status !== SKP_STATUS.SUBMITTED) {
        throw new BadRequestException(
          `SKP can only be approved from ${SKP_STATUS.SUBMITTED} status`,
        );
      }

      // Check if current user is atasan by checking if their NIP matches any parent SKP's NIP
      const isAtasan =
        skp.parentSkps &&
        skp.parentSkps.length > 0 &&
        skp.parentSkps.some((parent) => parent.nip === userNip);

      if (!isAtasan) {
        this.logger.warn(
          `User ${userNip} attempted to approve SKP without proper authorization`,
        );
        throw new ForbiddenException('Only the atasan can approve this SKP');
      }

      // Update status and create status record
      await this.prisma.$transaction(async (tx) => {
        await tx.skp.update({
          where: { id },
          data: { status: SKP_STATUS.APROVED },
        });

        await tx.status.create({
          data: {
            model: MODEL_LIST.SKP,
            modelId: id,
            value: SKP_STATUS.APROVED,
            ...(remarks && { remarks }),
          },
        });
      });

      const result = await this.checkData(id, true);
      return {
        data: result,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Skp approved successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to approve skp ${id}`, error);
      throw error;
    }
  }

  async reject(
    id: string,
    userNip: string,
    remarks?: string,
  ): Promise<IApiResponse<ISkp> | null> {
    try {
      const skp = await this.checkData(id);

      // Verify current status is SUBMITTED
      if (skp.status !== SKP_STATUS.SUBMITTED) {
        throw new BadRequestException(
          `SKP can only be rejected from ${SKP_STATUS.SUBMITTED} status`,
        );
      }

      // Check if current user is atasan by checking if their NIP matches any parent SKP's NIP
      const isAtasan =
        skp.parentSkps &&
        skp.parentSkps.length > 0 &&
        skp.parentSkps.some((parent) => parent.nip === userNip);

      if (!isAtasan) {
        this.logger.warn(
          `User ${userNip} attempted to reject SKP without proper authorization`,
        );
        throw new ForbiddenException('Only the atasan can reject this SKP');
      }

      // Update status and create status record
      await this.prisma.$transaction(async (tx) => {
        await tx.skp.update({
          where: { id },
          data: { status: SKP_STATUS.REJECTED },
        });

        await tx.status.create({
          data: {
            model: MODEL_LIST.SKP,
            modelId: id,
            value: SKP_STATUS.REJECTED,
            ...(remarks && { remarks }),
          },
        });
      });

      const result = await this.checkData(id, true);
      return {
        data: result,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Skp rejected successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to reject skp ${id}`, error);
      throw error;
    }
  }
}
