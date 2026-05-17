import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    const retries = Number(process.env.PRISMA_CONNECT_RETRIES ?? 20);
    const delayMs = Number(process.env.PRISMA_CONNECT_DELAY_MS ?? 1500);

    let lastError: unknown;
    for (let i = 1; i <= retries; i += 1) {
      try {
        await this.$connect();
        return;
      } catch (error) {
        lastError = error;
        if (i === retries) break;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw lastError;
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
