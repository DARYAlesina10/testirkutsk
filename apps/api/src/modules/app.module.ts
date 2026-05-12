import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({ connection: { host: 'redis', port: 6379 } }),
    AuthModule, UsersModule, ProductsModule, CategoriesModule, PriceHistoryModule, DealsModule, FavoritesModule, WatchRulesModule, NotificationsModule,
    YandexAffiliateModule
  ],
  controllers: [RedirectController],
  providers: [DataStore]
})
export class AppModule {}
