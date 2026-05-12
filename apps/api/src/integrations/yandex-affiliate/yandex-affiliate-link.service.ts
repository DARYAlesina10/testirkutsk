import { Injectable } from '@nestjs/common';
import { YandexAffiliateClient } from './yandex-affiliate.client';
import { AffiliateRepository } from './affiliate.repository';

@Injectable()
export class YandexAffiliateLinkService {
  constructor(private readonly client: YandexAffiliateClient, private readonly repo: AffiliateRepository) {}
  async createLink(url: string, vid?: string, erid?: string) {
    const response = await this.client.get('/partner/link/create', { url, clid: process.env.YANDEX_CLID ?? 'mock-clid', vid, format: 'json', erid });
    return this.repo.saveLink({ originalUrl: url, affiliateUrl: response.data?.url ?? null, selectedUrl: response.data?.url ?? url, clid: process.env.YANDEX_CLID ?? 'mock-clid', vid, erid, requestId: crypto.randomUUID(), rawResponse: response.data, rateLimit: response.headers });
  }
}
