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
      // Determine unorId and unitId based on user roles if not provided
      let resolvedUnorId = unorId;
      let resolvedUnitId = unitId;

      // If unitId not provided, determine based on role
      if (!resolvedUnitId) {
        if (userRoles.includes(ROLES.JPT)) {
          // JPT: Check if current unorId is in their assigned JPT units
          if (!resolvedUnorId) {
            throw new BadRequestException('unorId is required for JPT users');
          }

          // Verify the unorId is in their assigned JPT units
          const jptUnitIds = userJpt?.map((u) => u.toString()) || [];
          if (!jptUnitIds.includes(resolvedUnorId)) {
            this.logger.warn(
              `JPT user attempted to access unorId ${resolvedUnorId} not in their assignments`,
            );
            throw new ForbiddenException(
              'You do not have access to this organization unit',
            );
          }

          // Get the unor details to find the highest unit
          const unorDetails = await this.idasnUnorService.getUnorDetails(resolvedUnorId);
          if (!unorDetails) {
            throw new NotFoundException(
              `Unor details not found for ID ${resolvedUnorId}`,
            );
          }

          // Use the highest unit from the hierarchy (unorDetails is already the root)
          resolvedUnitId = unorDetails.id;
        } else {
          // For all other roles (including ASN, UMPEG if no override provided):
          // use the current user's unit from jabatan
          const userJabatan: IJabatan = await this.jabatanService.getPosJab(
            userNip,
          );
          if (!userJabatan || !userJabatan.unor.id) {
            throw new NotFoundException('Could not determine user unit from jabatan');
          }
          resolvedUnitId = userJabatan.unor.id;
        }
      }

      // If unorId not provided, get it from the unitId's parent unit
      if (!resolvedUnorId) {
        const userJabatan: IJabatan = await this.jabatanService.getPosJab(
          userNip,
        );
        if (!userJabatan || !userJabatan.unor.induk?.id) {
          throw new NotFoundException(
            'Could not determine organization unit from jabatan',
          );
        }
        resolvedUnorId = userJabatan.unor.induk.id;
      }

      // Check authorization
      if (!userRoles.includes(ROLES.ADMIN)) {
        const allowedUnits = [
          ...(userUmpeg?.map((u) => u.toString()) || []),
          ...(userJpt?.map((u) => u.toString()) || []),
        ];

        if (!allowedUnits.includes(resolvedUnitId?.toString())) {
          this.logger.warn(
            `User attempted to access unauthorized Jabatan with unitId ${resolvedUnitId}`,
          );
          throw new ForbiddenException('You do not have access to this unit');
        }
      }

      const { search, page = 1, perPage = 10 } = filters || {};

      // Ensure resolvedUnitId is defined
      if (!resolvedUnitId) {
        throw new BadRequestException('Unable to determine unit ID');
      }

      const res: IJabatan[] =
        await this.jabatanService.getJabatanByUnorIdWithBawahan(
          resolvedUnorId,
          resolvedUnitId,
        );

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
        message: 'Jabatan by Unor with Bawahan fetched successfully',
        pagination: {
          totalItems: data.length,
          totalPages: Math.ceil(data.length / perPage),
          page,
          perPage,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch Jabatan by Unor with Bawahan`,
        error,
      );
      throw error;
    }
  }
}
