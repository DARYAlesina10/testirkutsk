import { Injectable } from '@nestjs/common';
import { YandexAffiliateClient } from './yandex-affiliate.client';
import { DataStore } from '../../modules/common/data.store';

@Injectable()
export class YandexAffiliateArticleService {
  constructor(private readonly client: YandexAffiliateClient, private readonly ds: DataStore) {}

  private sanitize(value: string) { return value.replace(/[^a-zA-Z0-9]/g, ''); }
  private createVid(source: string, productId: string, userId?: string) {
    return `${this.sanitize(source).slice(0,10)||'site'}${this.sanitize(productId).slice(0,20)||'product'}${this.sanitize(userId||'admin').slice(0,20)}${Date.now()}`.slice(0,150);
  }


  async createArticle(body: { marketArticle?: string; marketUrl?: string }, _preserveOfferArticle = false, vid?: string) {
    return this.createPartnerArticle({ ...body, preserveOfferArticle: _preserveOfferArticle, source: "api", userId: vid });
  }

  async createPartnerArticle(input: {
    productId?: string;
    marketArticle?: string;
    marketUrl?: string;
    preserveOfferArticle?: boolean;
    source?: string;
    userId?: string;
  }) {
    const clid = process.env.YANDEX_AFFILIATE_ARTICLE_CLID;
    const mock = !(process.env.YANDEX_CONTENT_API_KEY && clid);
    const vid = this.createVid(input.source ?? 'admin', input.productId ?? 'product', input.userId);
    const body = input.marketArticle ? { marketArticle: input.marketArticle } : { marketUrl: input.marketUrl };

    try {
      const resp = await this.client.post('partner/article/create', {
        clid: clid ?? 'mock-article-clid',
        vid,
        preserveOfferArticle: Boolean(input.preserveOfferArticle)
      }, body, mock);

      const partnerArticle = resp.data?.partnerArticle ?? `mock-pa-${Date.now()}`;
      const resolvedMarketArticle = resp.data?.resolvedMarketArticle ?? resp.data?.marketArticle ?? input.marketArticle ?? null;

      const saved = {
        id: `pa_${Date.now()}`,
        status: 'CREATED',
        productId: input.productId ?? null,
        partnerArticle,
        originalMarketArticle: input.marketArticle ?? null,
        resolvedMarketArticle,
        clid: clid ?? 'mock-article-clid',
        vid,
        preserveOfferArticle: Boolean(input.preserveOfferArticle),
        rawResponse: resp.data,
        createdAt: new Date()
      };
      this.ds.partnerArticles.push(saved);

      if (input.productId) {
        const product = this.ds.products.find((p) => p.id === input.productId);
        if (product) {
          product.partnerArticle = partnerArticle;
          if (resolvedMarketArticle) product.marketArticle = resolvedMarketArticle;
        }
      }
      return saved;
    } catch (e: any) {
      const errorEntity = {
        id: `pa_${Date.now()}`,
        status: 'ERROR',
        productId: input.productId ?? null,
        partnerArticle: null,
        originalMarketArticle: input.marketArticle ?? null,
        resolvedMarketArticle: null,
        clid: clid ?? 'mock-article-clid',
        vid,
        preserveOfferArticle: Boolean(input.preserveOfferArticle),
        rawResponse: { error: e?.message ?? 'unknown' },
        createdAt: new Date()
      };
      this.ds.partnerArticles.push(errorEntity);
      return errorEntity;
    }
  }
}
