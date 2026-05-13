import { Injectable } from '@nestjs/common';
import { YandexAffiliateClient } from './yandex-affiliate.client';
import { DataStore } from '../../modules/common/data.store';

interface OrdersInput { dateStart?: string; dateEnd?: string; updateStart?: string; updateEnd?: string; vid?: string; status?: 'NEW'|'ON_HOLD'|'APPROVED'|'CANCELLED'; total?: boolean; page?: number; count?: number; }

@Injectable()
export class YandexAffiliateOrdersService {
  constructor(private readonly client: YandexAffiliateClient, private readonly ds: DataStore) {}

  async getOrders(input: OrdersInput = {}) {
    const clid = process.env.YANDEX_AFFILIATE_ORDERS_CLID;
    const mock = !(process.env.YANDEX_CONTENT_API_KEY && clid);
    return this.client.get('/orders', { clid: clid ?? 'mock-orders-clid', total: input.total ?? false, page: input.page ?? 1, count: input.count ?? Number(process.env.YANDEX_AFFILIATE_ORDERS_DEFAULT_COUNT ?? 100), ...input }, mock);
  }

  async getOrder(input: { orderId: string; total?: boolean }) {
    const clid = process.env.YANDEX_AFFILIATE_ORDERS_CLID;
    const mock = !(process.env.YANDEX_CONTENT_API_KEY && clid);
    return this.client.get('/order', { clid: clid ?? 'mock-orders-clid', orderId: input.orderId, total: input.total ?? false }, mock);
  }

  private upsertOrder(order: any, rawResponse: any) {
    const existing = this.ds.affiliateOrders.find((o) => o.orderId === order.orderId);
    const mapped = {
      orderId: order.orderId,
      clid: order.clid ?? process.env.YANDEX_AFFILIATE_ORDERS_CLID ?? 'mock-orders-clid',
      vid: order.vid ?? null,
      promocode: order.promocode ?? null,
      dateCreated: order.dateCreated ? new Date(order.dateCreated) : null,
      dateUpdated: order.dateUpdated ? new Date(order.dateUpdated) : null,
      status: order.status ?? 'NEW',
      additionalInfo: order.status === 'CANCELLED' ? (order.additionalInfo ?? {}) : (order.additionalInfo ?? null),
      cart: order.cart ?? null,
      payment: order.payment ?? null,
      tariff: order.tariff ?? null,
      rawResponse
    };
    if (existing) Object.assign(existing, mapped); else this.ds.affiliateOrders.push(mapped);

    this.ds.affiliateOrderItems = this.ds.affiliateOrderItems.filter((i) => i.orderId !== order.orderId);
    for (const item of order.items ?? []) {
      this.ds.affiliateOrderItems.push({ orderId: order.orderId, sku: item.sku ?? null, name: item.name ?? null, quantity: item.quantity ?? 1, price: item.price ?? null });
    }

    const linkedClick = this.ds.clicks.find((c) => c.vid && c.vid === mapped.vid);
    if (linkedClick) mapped['clickId'] = linkedClick.id;
  }

  private recalcRevenue() {
    const approved = this.ds.affiliateOrders.filter((o) => o.status === 'APPROVED');
    const revenue = approved.reduce((sum, o) => sum + Number(o.payment?.amount ?? o.cart?.total ?? 0), 0);
    this.ds.analytics = { revenue, orders: approved.length };
  }

  async syncSingleOrder(orderId: string) {
    const resp = await this.getOrder({ orderId, total: false });
    const order = resp.data?.order ?? resp.data ?? { orderId, status: 'NEW', items: [] };
    this.upsertOrder(order, resp.data);
    this.recalcRevenue();
    return { synced: 1, orderId };
  }

  async syncOrders(input: OrdersInput = {}) {
    const lastSuccess = [...this.ds.affiliateOrderSyncLogs].reverse().find((x) => x.status === 'SUCCESS');
    const lookbackDays = Number(process.env.YANDEX_AFFILIATE_ORDERS_LOOKBACK_DAYS ?? 30);
    const updateStart = input.updateStart ?? (lastSuccess?.finishedAt ? new Date(lastSuccess.finishedAt).toISOString() : new Date(Date.now() - lookbackDays * 86400000).toISOString());
    const updateEnd = input.updateEnd ?? new Date().toISOString();

    const log = { id: `sync_${Date.now()}`, status: 'RUNNING', startedAt: new Date(), finishedAt: null as Date | null, error: null as string | null, updateStart, updateEnd, synced: 0 };
    this.ds.affiliateOrderSyncLogs.push(log);

    try {
      let page = 1; let synced = 0; const count = input.count ?? Number(process.env.YANDEX_AFFILIATE_ORDERS_DEFAULT_COUNT ?? 100);
      while (true) {
        const resp = await this.getOrders({ ...input, updateStart, updateEnd, page, count, total: false });
        const orders = resp.data?.orders ?? (resp.data?.mock ? [{ orderId: `MOCK-${page}`, status: 'APPROVED', items: [{ sku: 'sku', quantity: 1, price: 100 }], payment: { amount: 100 }, cart: { total: 100 } }] : []);
        for (const order of orders) { this.upsertOrder(order, resp.data); synced += 1; }
        if (!orders.length || orders.length < count) break;
        page += 1;
      }
      this.recalcRevenue();
      log.status = 'SUCCESS'; log.synced = synced; log.finishedAt = new Date();
      return { synced, updateStart, updateEnd };
    } catch (e: any) {
      log.status = 'FAILED'; log.error = e?.message ?? 'sync failed'; log.finishedAt = new Date();
      return { synced: 0, error: log.error };
    }
  }
}
