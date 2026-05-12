import { Injectable } from '@nestjs/common';
import { YandexAffiliateClient } from './yandex-affiliate.client';

@Injectable()
export class YandexAffiliateLinkService {
  constructor(private readonly client: YandexAffiliateClient) {}
  async createLink(url: string, vid?: string) {
    const clid = process.env.YANDEX_AFFILIATE_LINK_CLID;
    const mock = !(process.env.YANDEX_CONTENT_API_KEY && clid);
    return this.client.get('/partner/link/create', {
      url,
      clid: clid ?? 'mock-link-clid',
      vid,
      erid: process.env.YANDEX_AFFILIATE_ERID,
      useShortUrl: process.env.YANDEX_AFFILIATE_USE_SHORT_URL ?? 'true'
    }, mock);
  }
}
