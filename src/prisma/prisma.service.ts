import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');
    const adapter = new PrismaPg({
      connectionString,
    });
    super({
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect()
      .then(() => this.logger.log('Connected to the database successfully.'))
      .catch((error) => {
        this.logger.error('Failed to connect to the database:', error);
        process.exit(1);
      });
  }
}
