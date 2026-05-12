import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { YandexAffiliateClient } from './yandex-affiliate.client';
import { YandexAffiliateHealthService } from './yandex-affiliate-health.service';
import { YandexAffiliateLinkService } from './yandex-affiliate-link.service';
import { YandexAffiliateArticleService } from './yandex-affiliate-article.service';
import { YandexAffiliateOrdersService } from './yandex-affiliate-orders.service';
import { YandexAffiliateController } from './yandex-affiliate.controller';
import { AffiliateRepository } from './affiliate.repository';
import { YandexAffiliateOrdersWorker } from './yandex-affiliate-orders.worker';

@Module({
  imports: [BullModule.registerQueue({ name: 'affiliate-orders-sync' })],
  providers: [YandexAffiliateClient, YandexAffiliateHealthService, YandexAffiliateLinkService, YandexAffiliateArticleService, YandexAffiliateOrdersService, AffiliateRepository, YandexAffiliateOrdersWorker],
  controllers: [YandexAffiliateController],
  exports: [YandexAffiliateLinkService, YandexAffiliateArticleService, YandexAffiliateOrdersService]
})
export class YandexAffiliateModule {}
