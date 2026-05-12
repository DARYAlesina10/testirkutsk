import { Injectable, Logger } from '@nestjs/common';
import { YandexAffiliateClient } from './yandex-affiliate.client';
import { AffiliateRepository } from './affiliate.repository';

@Injectable()
export class YandexAffiliateOrdersService {
  private readonly logger = new Logger(YandexAffiliateOrdersService.name);
  private paused = false;
  constructor(private readonly client: YandexAffiliateClient, private readonly repo: AffiliateRepository) {}
  async getOrders() { return this.client.get('/orders', { clid: process.env.YANDEX_CLID ?? 'mock-clid', format: 'json' }); }
  async getOrder(orderId: string) { return this.client.get('/order', { clid: process.env.YANDEX_CLID ?? 'mock-clid', orderId, format: 'json' }); }
  async syncOrders() {
    if (this.paused) return { paused: true };
    try {
      const resp = await this.getOrders();
      const orders = Array.isArray(resp.data?.orders) ? resp.data.orders : this.repo.orders;
      this.repo.saveOrders(orders);
      return { synced: orders.length, rateLimit: resp.headers };
    } catch (e: any) {
      if (e?.response?.status === 403) { this.paused = true; this.logger.error('Rate limited, pausing jobs'); return { paused: true, reason: '403 rate limit' }; }
      throw e;
    }
  }
}
