import { Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { IdasnService } from '../idasn.service';
import { IJabatan, IJabatanService } from '../interface/jabatan.interface';
import { IIdasnResponse } from '../interface/idasn.interface';
import { IDASN_ENDPOINTS } from 'src/common/const/idasn.const';
import { UnorService } from './unor.service';
import { IUnor, IUnorDetails } from '../interface/unor.interface';

export class JabatanService extends IdasnService implements IJabatanService {
  private readonly logger = new Logger(JabatanService.name);

  constructor(
    private readonly unorService: UnorService,
    http: HttpService,
    configService: ConfigService,
    @Inject(REQUEST) request: Request,
  ) {
    super(http, configService, request);
  }

  async getJabatanByUnorId(unorId: string): Promise<IJabatan[]> {
    try {
      this.logger.log(`Fetching Jabatan for Unor ID: ${unorId}`);
      const unor: IUnor = await this.unorService.getUnorById(unorId);
      if (!unor) {
        throw new Error(`Unor with id ${unorId} not found`);
      }

      const res: IIdasnResponse<{ data: IJabatan[] }> = await this.get(
        IDASN_ENDPOINTS.JABATAN.GET_JABATAN_BY_UNOR_ID(unor.id_sapk),
      );

      return res.mapData.data;
    } catch (error) {
      this.logger.error(`Failed to fetch Jabatan for Unor ID ${unorId}`, error);
      throw error;
    }
  }

  async getPosJab(nip: string): Promise<IJabatan> {
    try {
      const res: IIdasnResponse<{ data: IJabatan[] }> = await this.get(
        IDASN_ENDPOINTS.JABATAN.GET_POS_JAB(nip),
      );

      return res.mapData.data[0];
    } catch (error) {
      this.logger.error(`Failed to fetch Pos Jab for NIP ${nip}`, error);
      throw error;
    }
  }

  async getJabatanByUnorIdWithBawahan(
    unorId: string,
    unitId: string,
  ): Promise<IJabatan[]> {
    try {
      this.logger.log(
        `Fetching Jabatan for Unor ID: ${unorId}, Unit ID: ${unitId}`,
      );

      const unor = await this.unorService.getUnorById(unorId);
      if (!unor) {
        throw new Error(`Unor with id ${unorId} not found`);
      }

      // Get the unit details with full hierarchy
      const unorDetails = await this.unorService.getUnorDetails(unor.id_simpeg);
      if (!unorDetails) {
        throw new Error(`Unor details with id ${unorId} not found`);
      }

      // Find the specific unit node in the hierarchy by unitId
      const targetUnit = this.findUnorInHierarchy(unorDetails, unitId);
      if (!targetUnit) {
        throw new Error(`Unit ID ${unitId} not found in hierarchy`);
      }

      this.logger.log(`Found target unit: ${targetUnit.namaUnor}`);

      // Get unit hierarchy info: target unit and its bawahan with their namaJabatan
      const unitHierarchyMap = this.buildUnitHierarchyMap(targetUnit);
      this.logger.log(
        `Built hierarchy map with ${unitHierarchyMap.size} units`,
      );

      // Fetch ALL jabatan for the entire unor
      const res: IIdasnResponse<{ data: IJabatan[] }> = await this.get(
        IDASN_ENDPOINTS.JABATAN.GET_JABATAN_BY_UNOR_ID(unor.id_sapk),
      );

      // Filter jabatan based on unit type
      const filteredJabatan = res.mapData.data.filter((jabatan) => {
        const unitInfo = unitHierarchyMap.get(jabatan.unor.id);
        if (!unitInfo) {
          return false; // Unit not in hierarchy
        }

        // For target unit: include all jabatan
        if (unitInfo.isTarget) {
          return true;
        }

        // For bawahan units: only include pimpinan (match nama_jabatan with namaJabatan from hierarchy)
        return jabatan.nama_jabatan === unitInfo.namaJabatan;
      });

      this.logger.log(
        `Filtered to ${filteredJabatan.length} jabatan from ${res.mapData.data.length} total`,
      );

      return filteredJabatan;
    } catch (error) {
      this.logger.error(
        `Failed to fetch Jabatan for Unor ID ${unorId}, Unit ID ${unitId}`,
        error,
      );
      throw error;
    }
  }

  private buildUnitHierarchyMap(
    unorDetails: IUnorDetails,
    isTarget: boolean = true,
  ): Map<string, { namaJabatan: string; isTarget: boolean }> {
    const map = new Map<string, { namaJabatan: string; isTarget: boolean }>();

    // Add current unit
    map.set(unorDetails.id, {
      namaJabatan: unorDetails.namaJabatan,
      isTarget,
    });

    // Recursively add bawahan (they are not target)
    if (unorDetails.bawahan && Array.isArray(unorDetails.bawahan)) {
      for (const bawahan of unorDetails.bawahan) {
        const bawahanMap = this.buildUnitHierarchyMap(bawahan, false);
        bawahanMap.forEach((value, key) => {
          map.set(key, value);
        });
      }
    }

    return map;
  }

  private findUnorInHierarchy(
    unorDetails: IUnorDetails,
    unitId: string,
  ): IUnorDetails | null {
    // Check if current node matches
    if (unorDetails.id === unitId) {
      return unorDetails;
    }

    // Recursively search in bawahan
    if (unorDetails.bawahan && Array.isArray(unorDetails.bawahan)) {
      for (const bawahan of unorDetails.bawahan) {
        const found = this.findUnorInHierarchy(bawahan, unitId);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }
}
