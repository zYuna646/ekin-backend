import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ISettings, ISettingsService } from './interface/settings.interface';
import { IApiResponse } from 'src/common/interface/api.interface';
import { StatusApi } from 'src/common/enum/status.enum';
import { FiltersSettingsDto } from './dto/filters-settings.dto';
import { Prisma } from '@prisma/client';
import {
  SETTINGS_KEY,
  SETTINGS_KEY_TYPE,
} from 'src/common/const/settings.const';

@Injectable()
export class SettingsService implements ISettingsService {
  private readonly logger = new Logger(SettingsService.name);
  constructor(private prisma: PrismaService) {}

  async checkData(id: string): Promise<ISettings> {
    try {
      const data = await this.prisma.settings.findUnique({
        where: { id },
      });
      if (!data) {
        this.logger.warn(`Settings with id ${id} not found`);
        throw new NotFoundException(`Settings with id ${id} not found`);
      }
      return data;
    } catch (error) {
      this.logger.error('Failed to retrieve settings', error);
      throw error;
    }
  }

  async findAll(
    filters: FiltersSettingsDto,
  ): Promise<IApiResponse<ISettings[]> | null> {
    try {
      const { search, page = 1, perPage = 10 } = filters;
      const offset = (page - 1) * perPage;
      const where = {
        ...(search && {
          OR: [
            { key: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { value: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }),
      };
      const [totalItems, data] = await this.prisma.$transaction([
        this.prisma.settings.count({ where }),
        this.prisma.settings.findMany({
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
        message: 'Settings list retrieved successfully',
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Failed to retrieve settings list', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<IApiResponse<ISettings> | null> {
    try {
      const data = await this.checkData(id);
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Settings retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve settings', error);
      throw error;
    }
  }

  async findByKey(key: string): Promise<IApiResponse<ISettings> | null> {
    try {
      const data = await this.prisma.settings.findFirst({
        where: { key },
      });
      if (!data) {
        this.logger.warn(`Settings with key ${key} not found`);
        throw new NotFoundException(`Settings with key ${key} not found`);
      }
      return {
        data,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Settings retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve settings by key', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<IApiResponse<ISettings> | null> {
    try {
      const existingRecord = await this.checkData(id);

      // Validate key is in allowed settings
      if (
        updateSettingsDto.key &&
        !Object.values(SETTINGS_KEY).includes(updateSettingsDto.key)
      ) {
        throw new BadRequestException(
          `Invalid settings key. Allowed keys: ${Object.values(SETTINGS_KEY).join(', ')}`,
        );
      }

      // If key is provided, validate value type matches the key's expected type
      const keyToCheck = updateSettingsDto.key || existingRecord.key;
      const expectedType = SETTINGS_KEY_TYPE[keyToCheck];

      if (updateSettingsDto.value !== undefined && expectedType) {
        const valueType = Array.isArray(updateSettingsDto.value)
          ? 'array'
          : typeof updateSettingsDto.value;
        const expectedTypeString =
          expectedType === Array
            ? 'array'
            : expectedType === String
              ? 'string'
              : expectedType === Number
                ? 'number'
                : 'unknown';

        if (
          (expectedType === Array && !Array.isArray(updateSettingsDto.value)) ||
          (expectedType === String &&
            typeof updateSettingsDto.value !== 'string') ||
          (expectedType === Number &&
            typeof updateSettingsDto.value !== 'number')
        ) {
          throw new BadRequestException(
            `Invalid value type for key "${keyToCheck}". Expected: ${expectedTypeString}, Got: ${valueType}`,
          );
        }
      }

      // Convert value to string for storage (Prisma expects string field)
      const valueToStore = Array.isArray(updateSettingsDto.value)
        ? JSON.stringify(updateSettingsDto.value)
        : typeof updateSettingsDto.value === 'number'
          ? updateSettingsDto.value.toString()
          : updateSettingsDto.value;

      const dataToUpdate: any = { value: valueToStore };
      if (updateSettingsDto.key) {
        dataToUpdate.key = updateSettingsDto.key;
      }

      const updatedData = await this.prisma.settings.update({
        where: { id },
        data: dataToUpdate,
      });
      return {
        data: updatedData,
        code: HttpStatus.OK,
        status: StatusApi.SUCCESS,
        message: 'Settings updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update settings', error);
      throw error;
    }
  }
}
