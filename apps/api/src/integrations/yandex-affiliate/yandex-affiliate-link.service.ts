import { Injectable } from '@nestjs/common';
import { YandexAffiliateClient } from './yandex-affiliate.client';
import { DataStore } from '../../modules/common/data.store';

@Injectable()
export class YandexAffiliateLinkService {
  constructor(private readonly client: YandexAffiliateClient, private readonly ds: DataStore) {}

  private sanitize(value: string) { return value.replace(/[^a-zA-Z0-9]/g, ''); }

  createVid(source: string, productId: string, userId?: string) {
    const src = this.sanitize(source || 'site').slice(0, 10) || 'site';
    const p = this.sanitize(productId).slice(0, 20) || 'product';
    const u = this.sanitize(userId || 'guest').slice(0, 20) || 'guest';
    const vid = `${src}${p}${u}${Date.now()}`;
    return vid.slice(0, 150);
  }

  private ttlMs() { return Number(process.env.AFFILIATE_LINK_TTL_HOURS ?? 24) * 60 * 60 * 1000; }

  findFreshLink(productId: string, source: string, userId?: string) {
    const now = Date.now();
    return this.ds.affiliateLinks.find((l) => l.productId === productId && l.source === source && l.userId === (userId || 'guest') && now - l.createdAt.getTime() < this.ttlMs());
  }

  async createAffiliateLink(input: { productId: string; marketUrl: string; source: string; userId?: string; campaign?: string }) {
    const clid = process.env.YANDEX_AFFILIATE_LINK_CLID;
    const encodedUrl = encodeURI(input.marketUrl);
    const vid = this.createVid(input.source, input.productId, input.userId);
    const mock = !(process.env.YANDEX_CONTENT_API_KEY && clid);

    try {
      const resp = await this.client.get('/partner/link/create', {
        url: encodedUrl,
        clid: clid ?? 'mock-link-clid',
        vid,
        erid: process.env.YANDEX_AFFILIATE_ERID,
        campaign: input.campaign
      }, mock);

      const linkUrl = resp.data?.link?.url ?? resp.data?.url ?? encodedUrl;
      const shortUrl = resp.data?.shortUrl ?? resp.data?.link?.shortUrl ?? null;
      const selectedUrl = String(process.env.YANDEX_AFFILIATE_USE_SHORT_URL ?? 'true') === 'true' ? shortUrl || linkUrl : linkUrl;
      const saved = {
        id: `al_${Date.now()}`,
        productId: input.productId,
        source: input.source,
        userId: input.userId || 'guest',
        originalUrl: encodedUrl,
        affiliateUrl: linkUrl,
        shortUrl,
        selectedUrl,
        vid,
        clid: clid ?? 'mock-link-clid',
        rawResponse: resp.data,
        rateLimit: resp.rateLimit,
        status: 'CREATED',
        createdAt: new Date()
      };
      this.ds.affiliateLinks.push(saved);
      return saved;
    } catch {
      const fallback = {
        id: `al_${Date.now()}`,
        productId: input.productId,
        source: input.source,
        userId: input.userId || 'guest',
        originalUrl: encodedUrl,
        affiliateUrl: encodedUrl,
        shortUrl: null,
        selectedUrl: encodedUrl,
        vid,
        clid: clid ?? 'mock-link-clid',
        rawResponse: { fallback: true },
        status: 'FALLBACK',
        createdAt: new Date()
      };
      this.ds.affiliateLinks.push(fallback);
      return fallback;
    }
  }
}
