import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { YandexAffiliateClient } from './yandex-affiliate.client';
import { YandexAffiliateHealthService } from './yandex-affiliate-health.service';
import { YandexAffiliateLinkService } from './yandex-affiliate-link.service';
import { YandexAffiliateArticleService } from './yandex-affiliate-article.service';
import { YandexAffiliateOrdersService } from './yandex-affiliate-orders.service';
import { DataStore } from '../../modules/common/data.store';
import { PartnerArticleWorker } from './partner-article.worker';

@Module({
  imports: [BullModule.registerQueue({ name: 'partner-article' })],
  providers: [DataStore, YandexAffiliateClient, YandexAffiliateHealthService, YandexAffiliateLinkService, YandexAffiliateArticleService, YandexAffiliateOrdersService, PartnerArticleWorker],
  exports: [YandexAffiliateHealthService, YandexAffiliateLinkService, YandexAffiliateArticleService, YandexAffiliateOrdersService]
})
export class YandexAffiliateModule {}
