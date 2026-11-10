import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import { configuration } from './environment.js';
@Injectable()
export class Database extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super({
      adapter: new PrismaPg({
        connectionString: configuration().databaseUrl,
        max: 5,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 10000,
        query_timeout: 10000,
      }),
    });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
