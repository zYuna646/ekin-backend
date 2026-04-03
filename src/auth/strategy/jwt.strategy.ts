import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import jwksClient, { SigningKey } from 'jwks-rsa';
import { IDASN_ENDPOINTS } from 'src/common/const/idasn.const';
import { JwtPayload } from '../interface/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);
  private client: ReturnType<typeof jwksClient>;

  constructor(private configService: ConfigService) {
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

      const validated = await this.validate(payload);
      this.success(validated);
    } catch (error) {
      this.logger.error(
        `Authentication failed: ${error instanceof Error ? error.message : error}`,
      );
      this.fail(error instanceof Error ? error.message : 'Unauthorized', 401);
    }
  }

  async validate(payload: JwtPayload): Promise<any> {
    return {
      userId: payload.sub,
      ...payload.mapData,
    };
  }
}
