import { Module } from '@nestjs/common';
import { YandexAffiliateClient } from './yandex-affiliate.client';
import { YandexAffiliateHealthService } from './yandex-affiliate-health.service';
import { YandexAffiliateLinkService } from './yandex-affiliate-link.service';
import { YandexAffiliateArticleService } from './yandex-affiliate-article.service';
import { YandexAffiliateOrdersService } from './yandex-affiliate-orders.service';
import { DataStore } from '../../modules/common/data.store';

@Module({
  providers: [DataStore, YandexAffiliateClient, YandexAffiliateHealthService, YandexAffiliateLinkService, YandexAffiliateArticleService, YandexAffiliateOrdersService],
  exports: [YandexAffiliateHealthService, YandexAffiliateLinkService, YandexAffiliateArticleService, YandexAffiliateOrdersService]
})
export class YandexAffiliateModule {}
