import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IUnor, IUnorAsn, IUnorService } from './interface/unor.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UnorService as IdasnUnorService } from 'src/idasn/services/unor.service';
import {
  IUnor as IIdasnUnor,
  IUnorDetails,
} from 'src/idasn/interface/unor.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { FilterUnorDto } from './dto/filter-unor.dto';
import { JabatanService } from 'src/idasn/services/jabatan.service';
import { IJabatan, IJenisJabatan } from 'src/idasn/interface/jabatan.interface';
import { ROLES } from 'src/common/const/role.const';

@Injectable()
export class UnorService implements IUnorService {
  private readonly logger = new Logger(UnorService.name);

  constructor(
    private readonly idasnUnorService: IdasnUnorService,
    private readonly jabatanService: JabatanService,
    private readonly prisma: PrismaService,
  ) {}

  async getUnorById(
    id: string,
    userRoles: string[] = [],
    userUmpeg: any[] = [],
    userJpt: any[] = [],
  ): Promise<IApiResponse<IUnor>> {
    try {
      // Check authorization for non-admin users
      if (!userRoles.includes(ROLES.ADMIN)) {
        const allowedUnits = [
          ...(userUmpeg?.map((u) => u.toString()) || []),
          ...(userJpt?.map((u) => u.toString()) || []),
        ];

        if (!allowedUnits.includes(id?.toString())) {
          this.logger.warn(
            `User attempted to access unauthorized UNOR with id ${id}`,
          );
          throw new ForbiddenException('You do not have access to this UNOR');
        }
      }

      const res: IIdasnUnor = await this.idasnUnorService.getUnorById(id);
      const data: IUnor = {
        id: res.id_simpeg,
        name: res.nama_unor,
      };

      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Unor fetched successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch Unor with id ${id}`, error);
      throw error;
    }
  }

  async getUnorDetails(
    id: string,
    userRoles: string[] = [],
    userUmpeg: any[] = [],
    userJpt: any[] = [],
  ): Promise<IApiResponse<IUnorDetails>> {
    try {
      // Check authorization for non-admin users
      if (!userRoles.includes(ROLES.ADMIN)) {
        const allowedUnits = [
          ...(userUmpeg?.map((u) => u.toString()) || []),
          ...(userJpt?.map((u) => u.toString()) || []),
        ];

        if (!allowedUnits.includes(id?.toString())) {
          this.logger.warn(
            `User attempted to access unauthorized UNOR details with id ${id}`,
          );
          throw new ForbiddenException('You do not have access to this UNOR');
        }
      }

      const data: IUnorDetails = await this.idasnUnorService.getUnorDetails(id);

      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Unor details fetched successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch Unor details with id ${id}`, error);
      throw error;
    }
  }

  async getUnor(
    filters: FilterUnorDto,
    userRoles: string[] = [],
    userUmpeg: any[] = [],
    userJpt: any[] = [],
  ): Promise<IApiResponse<IUnor[]>> {
    try {
      const { search, page = 1, perPage = 10 } = filters;

      const res: IIdasnUnor[] = await this.idasnUnorService.getUnor();

      let data: IUnor[] = res.map((unor) => ({
        id: unor.id_simpeg,
        name: unor.nama_unor,
      }));

      // Filter by user roles and units
      if (!userRoles.includes(ROLES.ADMIN)) {
        const allowedUnits = [
          ...(userUmpeg?.map((u) => u.toString()) || []),
          ...(userJpt?.map((u) => u.toString()) || []),
        ];

        data = data.filter((item) =>
          allowedUnits.includes(item.id?.toString()),
        );
      }

      if (search) {
        const keyword = search.toLowerCase();
        data = data.filter((item) => item.name.toLowerCase().includes(keyword));
      }

      const start = (page - 1) * perPage;
      const end = start + perPage;

      const paginatedData = data.slice(start, end);

      return {
        data: paginatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Unors fetched successfully',
        pagination: {
          totalItems: data.length,
          totalPages: Math.ceil(data.length / perPage),
          page,
          perPage,
        },
      };
    } catch (error) {
      this.logger.error('Failed to fetch Unors', error);
      throw error;
    }
  }

  async getUnorAsn(
    id: string,
    filters: FilterUnorDto,
    userRoles: string[] = [],
    userUmpeg: any[] = [],
    userJpt: any[] = [],
  ): Promise<IApiResponse<IUnorAsn[]>> {
    try {
      // Check authorization for non-admin users
      if (!userRoles.includes(ROLES.ADMIN)) {
        const allowedUnits = [
          ...(userUmpeg?.map((u) => u.toString()) || []),
          ...(userJpt?.map((u) => u.toString()) || []),
        ];

        if (!allowedUnits.includes(id?.toString())) {
          this.logger.warn(
            `User attempted to access unauthorized UNOR ASN with id ${id}`,
          );
          throw new ForbiddenException('You do not have access to this UNOR');
        }
      }

      const { search, page = 1, perPage = 10 } = filters;
      const res: IJabatan[] = await this.jabatanService.getJabatanByUnorId(id);

      let data: IUnorAsn[] = res.map((jabatan) => ({
        unor: {
          id: jabatan.unor.induk?.id_simpeg ?? '',
          name: jabatan.unor.induk?.nama ?? '',
        },
        unitKerja: {
          id: jabatan.unor.id,
          name: jabatan.unor.nama,
        },
        nip: jabatan.nip_asn,
        name: jabatan.nama_asn,
        jabatan: jabatan.nama_jabatan,
      }));

      if (search) {
        const keyword = search.toLowerCase();
        data = data.filter((item) => item.name.toLowerCase().includes(keyword));
      }

      const start = (page - 1) * perPage;
      const end = start + perPage;

      const paginatedData = data.slice(start, end);

      return {
        data: paginatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Unor ASN fetched successfully',
        pagination: {
          totalItems: data.length,
          totalPages: Math.ceil(data.length / perPage),
          page,
          perPage,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch Unor ASN with id ${id}`, error);
      throw error;
    }
  }

  async getJabatanByUnorWithBawahan(
    unorId: string,
    unitId: string | undefined,
    filters: FilterUnorDto,
    userRoles: string[] = [],
    userUmpeg: any[] = [],
    userJpt: any[] = [],
    userNip: string = '',
  ): Promise<IApiResponse<IUnorAsn[]>> {
    try {
      const { search, page = 1, perPage = 10 } = filters || {};
      let data: IUnorAsn[] = [];

      // Handle JPT role - fetch all bawahan of the hierarchy with NIPs from pimpinan-unit-kerja
      if (userRoles.includes(ROLES.JPT)) {
        // Verify the unorId is in their assigned JPT units
        const jptUnitIds = userJpt?.map((u) => u.toString()) || [];
        if (!jptUnitIds.includes(unorId?.toString())) {
          this.logger.warn(
            `JPT user attempted to access unorId ${unorId} not in their assignments`,
          );
          throw new ForbiddenException(
            'You do not have access to this organization unit',
          );
        }

        // Get all pimpinan-unit-kerja records for this unit
        const pimpinanRecords = await this.prisma.pimpinanUnitKerja.findMany({
          where: { unitId: unorId },
        });

        if (pimpinanRecords.length === 0) {
          this.logger.warn(
            `No pimpinan-unit-kerja records found for unitId ${unorId}`,
          );
          return {
            data: [],
            code: HttpStatus.OK,
            status: StatusApi.SUCCESS,
            message: 'Jabatan by Unor with Bawahan fetched successfully',
            pagination: {
              totalItems: 0,
              totalPages: 0,
              page,
              perPage,
            },
          };
        }

        // Collect all NIPs from pimpinan records
        const allNips = new Set<string>();
        pimpinanRecords.forEach((record) => {
          record.nip.forEach((nip: string) => allNips.add(nip));
        });

        // Fetch jabatan for all collected NIPs
        const jabatanList: IJabatan[] = [];
        for (const nip of allNips) {
          try {
            const jabatan = await this.jabatanService.getPosJab(nip);
            if (jabatan) {
              jabatanList.push(jabatan);
            }
          } catch (error) {
            this.logger.warn(`Failed to fetch jabatan for NIP ${nip}`, error);
            // Continue with next NIP
          }
        }

        data = jabatanList.map((jabatan) => ({
          unor: {
            id: jabatan.unor.induk?.id_simpeg ?? '',
            name: jabatan.unor.induk?.nama ?? '',
          },
          unitKerja: {
            id: jabatan.unor.id,
            name: jabatan.unor.nama,
          },
          nip: jabatan.nip_asn,
          name: jabatan.nama_asn,
          jabatan: jabatan.nama_jabatan,
        }));
      }
      // Handle PIMPINAN role - fetch all bawahan of the unit from pimpinan-unit-kerja
      else if (userRoles.includes(ROLES.PIMPINAN)) {
        // Get pimpinan record for current user
        const userPimpinanRecords =
          await this.prisma.pimpinanUnitKerja.findMany({
            where: {
              nip: {
                has: userNip,
              },
            },
          });

        if (userPimpinanRecords.length === 0) {
          this.logger.warn(
            `No pimpinan-unit-kerja records found for user NIP ${userNip}`,
          );
          throw new ForbiddenException('User is not assigned as pimpinan');
        }

        // Build response from pimpinan records using hierarchy nama jabatan
        for (const pimpinanRecord of userPimpinanRecords) {
          for (const nip of pimpinanRecord.nip) {
            try {
              // Get ASN details (name) from IDASN using NIP
              const asnDetails = await this.jabatanService.getPosJab(nip);

              if (asnDetails) {
                data.push({
                  unor: {
                    id: asnDetails.unor.induk?.id_simpeg ?? '',
                    name: asnDetails.unor.induk?.nama ?? '',
                  },
                  unitKerja: {
                    id: asnDetails.unor.id,
                    name: asnDetails.unor.nama,
                  },
                  nip: asnDetails.nip_asn,
                  name: asnDetails.nama_asn,
                  jabatan: pimpinanRecord.name, // Use pimpinan hierarchy name as jabatan
                });
              }
            } catch (error) {
              this.logger.warn(
                `Failed to fetch ASN details for NIP ${nip}`,
                error,
              );
              // Continue with next NIP
            }
          }
        }
      }
      // Default behavior for other roles (ADMIN, etc.)
      else {
        const res: IJabatan[] =
          await this.jabatanService.getJabatanByUnorIdWithBawahan(
            unorId,
            unitId || unorId,
          );

        data = res.map((jabatan) => ({
          unor: {
            id: jabatan.unor.induk?.id_simpeg ?? '',
            name: jabatan.unor.induk?.nama ?? '',
          },
          unitKerja: {
            id: jabatan.unor.id,
            name: jabatan.unor.nama,
          },
          nip: jabatan.nip_asn,
          name: jabatan.nama_asn,
          jabatan: jabatan.nama_jabatan,
        }));
      }

      if (search) {
        const keyword = search.toLowerCase();
        data = data.filter((item) => item.name.toLowerCase().includes(keyword));
      }

      const start = (page - 1) * perPage;
      const end = start + perPage;

      const paginatedData = data.slice(start, end);

      return {
        data: paginatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Jabatan by Unor with Bawahan fetched successfully',
        pagination: {
          totalItems: data.length,
          totalPages: Math.ceil(data.length / perPage),
          page,
          perPage,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch Jabatan by Unor with Bawahan`, error);
      throw error;
    }
  }
}
