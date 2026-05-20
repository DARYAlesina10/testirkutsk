import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    const retries = Number(process.env.PRISMA_CONNECT_RETRIES ?? 20);
    const delayMs = Number(process.env.PRISMA_CONNECT_DELAY_MS ?? 1500);

    for (let i = 1; i <= retries; i += 1) {
      try {
        await this.$connect();
        this.logger.log('Prisma connected');
        return;
      } catch (error) {
        const isLast = i === retries;
        this.logger.warn(`Prisma connect attempt ${i}/${retries} failed${isLast ? '; continuing in degraded mode' : ''}`);
        if (isLast) return;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
