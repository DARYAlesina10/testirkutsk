import { Injectable } from '@nestjs/common';
import { YandexAffiliateClient } from './yandex-affiliate.client';

@Injectable()
export class YandexAffiliateOrdersService {
  constructor(private readonly client: YandexAffiliateClient) {}
  async getOrders(count?: number) {
    const clid = process.env.YANDEX_AFFILIATE_ORDERS_CLID;
    const mock = !(process.env.YANDEX_CONTENT_API_KEY && clid);
    return this.client.get('/orders', {
      clid: clid ?? 'mock-orders-clid',
      count: count ?? Number(process.env.YANDEX_AFFILIATE_ORDERS_DEFAULT_COUNT ?? 100),
      lookbackDays: Number(process.env.YANDEX_AFFILIATE_ORDERS_LOOKBACK_DAYS ?? 30)
    }, mock);
  }
  async getOrder(orderId: string) {
    const clid = process.env.YANDEX_AFFILIATE_ORDERS_CLID;
    const mock = !(process.env.YANDEX_CONTENT_API_KEY && clid);
    return this.client.get('/order', { clid: clid ?? 'mock-orders-clid', orderId }, mock);
  }
}
