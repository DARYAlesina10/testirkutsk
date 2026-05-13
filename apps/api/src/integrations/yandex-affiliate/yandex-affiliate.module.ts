import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { YandexAffiliateClient } from './yandex-affiliate.client';
import { YandexAffiliateHealthService } from './yandex-affiliate-health.service';
import { YandexAffiliateLinkService } from './yandex-affiliate-link.service';
import { YandexAffiliateArticleService } from './yandex-affiliate-article.service';
import { YandexAffiliateOrdersService } from './yandex-affiliate-orders.service';
import { DataStore } from '../../modules/common/data.store';
import { PartnerArticleWorker } from './partner-article.worker';
import { AffiliateOrdersSyncWorker } from './affiliate-orders-sync.worker';
import { YandexAffiliateAdminController } from './yandex-affiliate-admin.controller';

@Module({
  imports: [BullModule.registerQueue({ name: 'partner-article' }), BullModule.registerQueue({ name: 'affiliate-orders-sync' })],
  providers: [DataStore, YandexAffiliateClient, YandexAffiliateHealthService, YandexAffiliateLinkService, YandexAffiliateArticleService, YandexAffiliateOrdersService, PartnerArticleWorker, AffiliateOrdersSyncWorker],
  controllers: [YandexAffiliateAdminController],
  exports: [YandexAffiliateHealthService, YandexAffiliateLinkService, YandexAffiliateArticleService, YandexAffiliateOrdersService]
})
export class YandexAffiliateModule {}
