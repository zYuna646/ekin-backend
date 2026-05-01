import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import jwksClient, { SigningKey } from 'jwks-rsa';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IDASN_ENDPOINTS } from 'src/common/const/idasn.const';
import { JwtPayload } from '../interface/auth.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ROLES } from 'src/common/const/role.const';
import { IUnorDetails } from 'src/idasn/interface/unor.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);
  private client: ReturnType<typeof jwksClient>;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'dummy', // Dummy secret, actual verification in authenticate
    });

    const idasnUrl =
      this.configService.get<string>('IDASN_AUTH_URL') ??
      'http://localhost:3000/api';
    const jwksUri = `${idasnUrl}${IDASN_ENDPOINTS.AUTH.VERIFY}`;

    this.logger.debug(`Initializing JWKS client with URI: ${jwksUri}`);

    this.client = jwksClient({
      jwksUri,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 10 * 60 * 1000, // 10 mins
    });
  }

  // Get signing key function to be used with jwt.verify
  private getKey = (header: any, callback: any) => {
    this.client.getSigningKey(
      header.kid,
      (err: Error | null, key?: SigningKey) => {
        if (err) {
          this.logger.error(`Error getting signing key: ${err.message}`);
          return callback(err);
        }

        if (!key) {
          this.logger.error('No signing key found');
          return callback(new Error('Invalid token'), null);
        }

        const signingKey = key.getPublicKey();
        callback(null, signingKey);
      },
    );
  };

  async authenticate(req: any) {
    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

      if (!token) {
        return this.fail('No token provided', 401);
      }

      // Verify the JWT token using callback approach with jwt.verify
      const payload = await new Promise<JwtPayload>((resolve, reject) => {
        jwt.verify(
          token,
          this.getKey,
          { algorithms: ['RS256'] },
          (err, decoded) => {
            if (err) {
              this.logger.error(`Token verification error: ${err.message}`);
              return reject(err);
            }
            resolve(decoded as JwtPayload);
          },
        );
      });

      this.logger.debug(`Token verified successfully for user: ${payload.sub}`);

      const validated = await this.validate(payload, token);
      this.success(validated);
    } catch (error) {
      this.logger.error(
        `Authentication failed: ${error instanceof Error ? error.message : error}`,
      );
      this.fail(error instanceof Error ? error.message : 'Unauthorized', 401);
    }
  }

  private jabatanExistsInHierarchy(
    jabatanName: string,
    unorDetails: IUnorDetails,
  ): boolean {
    if (!unorDetails) {
      return false;
    }

    // Normalize jabatan names for comparison (case-insensitive, trim)
    const searchName = jabatanName.trim().toUpperCase();
    const currentName = unorDetails.namaJabatan?.trim().toUpperCase() || '';


    // Check if current unit's jabatan matches
    if (currentName === searchName) {
      return true;
    }

    // Recursively check in bawahan
    if (unorDetails.bawahan && Array.isArray(unorDetails.bawahan)) {
      for (const bawahan of unorDetails.bawahan) {
        if (this.jabatanExistsInHierarchy(jabatanName, bawahan)) {
          return true;
        }
      }
    }

    return false;
  }

  async validate(payload: JwtPayload, token: string): Promise<any> {
    const user = {
      userId: payload.sub,
      ...payload.mapData,
    };

    // Check JPT, UMPEG, ADMIN, and PIMPINAN roles
    if (user.nipBaru) {
      try {
        const roles = user.roles || [];
        const jptUnitIds: string[] = [];
        const umpegUnitIds: string[] = [];

        // Always add ASN as default role
        if (!roles.includes(ROLES.ASN)) {
          roles.push(ROLES.ASN);
        }

        // Check ADMIN - fetch from Settings table
        const adminSettings = await this.prisma.settings.findFirst({
          where: { key: 'ADMIN_ID' },
        });

        if (adminSettings) {
          try {
            const adminIds = JSON.parse(adminSettings.value) as string[];
            if (
              adminIds.includes(user.nipBaru) &&
              !roles.includes(ROLES.ADMIN)
            ) {
              roles.push(ROLES.ADMIN);
              this.logger.debug(
                `User ${user.nipBaru} identified as ADMIN from Settings`,
              );
            }
          } catch (parseError) {
            this.logger.error(
              `Error parsing ADMIN_ID from Settings: ${parseError}`,
            );
          }
        }

        // Check JPT - find all records where nip array contains user.nipBaru
        const jptRecords = await this.prisma.jpt.findMany({
          where: {
            nip: {
              has: user.nipBaru,
            },
          },
        });

        if (jptRecords.length > 0) {
          if (!roles.includes(ROLES.JPT)) {
            roles.push(ROLES.JPT);
          }
          jptUnitIds.push(...jptRecords.map((record) => record.unitId));
        }

        // Check UMPEG - find all records where nip array contains user.nipBaru
        const umpegRecords = await this.prisma.umpeg.findMany({
          where: {
            nip: {
              has: user.nipBaru,
            },
          },
        });

        if (umpegRecords.length > 0) {
          if (!roles.includes(ROLES.UMPEG)) {
            roles.push(ROLES.UMPEG);
          }
          umpegUnitIds.push(...umpegRecords.map((record) => record.unitId));
        }

        // Check PIMPINAN - check if user's jabatan name exists in the unor hierarchy
        try {
          const idasnApiUrl =
            this.configService.get<string>('IDASN_API_URL') ??
            'http://localhost:3000/api';

          // Create request config with timeout and authorization header
          const config = {
            timeout: 15000, // 15 seconds timeout for PIMPINAN check
            headers: {
              authorization: `Bearer ${token}`,
            },
          };

          // Fetch user's current jabatan
          const jabatanRes = await firstValueFrom(
            this.httpService.get(
              `${idasnApiUrl}${IDASN_ENDPOINTS.JABATAN.GET_POS_JAB(user.nipBaru)}`,
              config,
            ),
          );

          const jabatanData = jabatanRes.data?.mapData?.data[0];
          if (jabatanData && jabatanData.nama_jabatan && jabatanData.unor?.id) {
            // Fetch organization hierarchy
            const unorRes = await firstValueFrom(
              this.httpService.get(
                `${idasnApiUrl}${IDASN_ENDPOINTS.UNOR.GET_UNOR_DETAILS(jabatanData.unor.induk.id)}`,
                config,
              ),
            );

            // Handle mapData - it can be an array, get first element
            let unorHierarchy = unorRes.data?.mapData;
            if (Array.isArray(unorHierarchy)) {
              unorHierarchy = unorHierarchy[0];
            }

            this.logger.debug(
              `Fetched unor details for PIMPINAN check: ${JSON.stringify(unorHierarchy)}`,
            );
            if (
              unorHierarchy &&
              this.jabatanExistsInHierarchy(
                jabatanData.nama_jabatan,
                unorHierarchy,
              )
            ) {
              if (!roles.includes(ROLES.PIMPINAN)) {
                roles.push(ROLES.PIMPINAN);
                this.logger.debug(
                  `User ${user.nipBaru} identified as PIMPINAN - jabatan '${jabatanData.nama_jabatan}' found in unor hierarchy`,
                );
              }
            }
          }
        } catch (pimpinanError) {
          this.logger.warn(
            `Failed to check PIMPINAN role for user ${user.nipBaru}: ${pimpinanError instanceof Error ? pimpinanError.message : pimpinanError}`,
          );
          // Don't throw, just log warning - PIMPINAN check is optional
        }

        user.roles = roles;
        if (jptUnitIds.length > 0) {
          user.jpt = jptUnitIds;
        }
        if (umpegUnitIds.length > 0) {
          user.umpeg = umpegUnitIds;
        }
      } catch (error) {
        this.logger.error(
          `Error checking roles: ${error instanceof Error ? error.message : error}`,
        );
      }
    } else {
      // Add ASN role as default
      if (!user.roles || user.roles.length === 0) {
        user.roles = [ROLES.ASN];
      } else if (!user.roles.includes(ROLES.ASN)) {
        user.roles.push(ROLES.ASN);
      }
    }

    return user;
  }
}
