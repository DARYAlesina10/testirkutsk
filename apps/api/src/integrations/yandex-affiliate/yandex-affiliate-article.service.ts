import { Injectable } from '@nestjs/common';
import { YandexAffiliateClient } from './yandex-affiliate.client';

@Injectable()
export class YandexAffiliateArticleService {
  constructor(private readonly client: YandexAffiliateClient) {}
  async createArticle(body: { marketArticle?: string; marketUrl?: string }, vid?: string) {
    const clid = process.env.YANDEX_AFFILIATE_ARTICLE_CLID;
    const mock = !(process.env.YANDEX_CONTENT_API_KEY && clid);
    return this.client.post('/partner/article/create', { clid: clid ?? 'mock-article-clid', vid }, body, mock);
  }
}
