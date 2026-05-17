import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { YandexAffiliateOrdersService } from './yandex-affiliate-orders.service';
import { DataStore } from '../../modules/common/data.store';

@Processor('affiliate-orders-sync')
export class AffiliateOrdersSyncWorker extends WorkerHost {
  constructor(private readonly orders: YandexAffiliateOrdersService, private readonly ds: DataStore) { super(); }
  async process(job: Job<{ orderId?: string }>) {
    if (this.ds.rateLimitPausedUntil && this.ds.rateLimitPausedUntil > new Date()) return { paused: true };
    if (job.data?.orderId) return this.orders.syncSingleOrder(job.data.orderId);
    return this.orders.syncOrders({});
  }
}
