import { Injectable } from '@nestjs/common';
import { YandexAffiliateClient } from './yandex-affiliate.client';
import { AffiliateRepository } from './affiliate.repository';

@Injectable()
export class YandexAffiliateArticleService {
  constructor(private readonly client: YandexAffiliateClient, private readonly repo: AffiliateRepository) {}
  async createArticle(body: { marketArticle?: string; marketUrl?: string }, preserveOfferArticle = false, vid?: string) {
    const response = await this.client.post('/partner/article/create', { clid: process.env.YANDEX_CLID ?? 'mock-clid', vid, preserveOfferArticle, format: 'json' }, body);
    return this.repo.saveArticle({ partnerArticle: response.data?.partnerArticle ?? 'mock-pa', originalMarketArticle: body.marketArticle, resolvedMarketArticle: response.data?.marketArticle ?? body.marketArticle, clid: process.env.YANDEX_CLID ?? 'mock-clid', vid, preserveOfferArticle, requestId: crypto.randomUUID(), rawResponse: response.data, rateLimit: response.headers });
  }
}
