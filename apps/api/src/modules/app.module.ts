import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { YandexAffiliateModule } from '../integrations/yandex-affiliate/yandex-affiliate.module';
import { RedirectController } from './redirect.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { PriceHistoryModule } from './price-history/price-history.module';
import { DealsModule } from './deals/deals.module';
import { FavoritesModule } from './favorites/favorites.module';
import { WatchRulesModule } from './watch-rules/watch-rules.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DataStore } from './common/data.store';
import { PrismaService } from './common/prisma.service';
import { HealthController } from './health.controller';
import { PriceCheckWorker } from '../workers/price-check.worker';
import { NotificationWorker } from '../workers/notification.worker';
import { PriceCheckScheduler } from '../workers/price-check.scheduler';

function resolveRedisConnection(redisUrl?: string) {
  if (!redisUrl) return { host: '127.0.0.1', port: 6379 };
  try {
    const parsed = new URL(redisUrl);
    return {
      host: parsed.hostname || '127.0.0.1',
      port: Number(parsed.port || 6379)
    };
  } catch {
    return { host: '127.0.0.1', port: 6379 };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: resolveRedisConnection(config.get<string>('REDIS_URL'))
      })
    }),
    BullModule.registerQueue({ name: 'partner-article', defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 1000 } } }),
    BullModule.registerQueue({ name: 'affiliate-orders-sync', defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 2000 } } }),
    BullModule.registerQueue({ name: 'price-check', defaultJobOptions: { attempts: 2, backoff: { type: 'fixed', delay: 5000 } } }),
    BullModule.registerQueue({ name: 'notification', defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 1000 } } }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    PriceHistoryModule,
    DealsModule,
    FavoritesModule,
    WatchRulesModule,
    NotificationsModule,
    YandexAffiliateModule
  ],
  controllers: [HealthController, RedirectController],
  providers: [DataStore, PrismaService, PriceCheckWorker, NotificationWorker, PriceCheckScheduler]
})
export class AppModule {}
