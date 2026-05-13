import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { YandexAffiliateOrdersService } from './yandex-affiliate-orders.service';

@Processor('affiliate-orders-sync')
export class AffiliateOrdersSyncWorker extends WorkerHost {
  constructor(private readonly orders: YandexAffiliateOrdersService) { super(); }
  async process(job: Job<{ orderId?: string }>) {
    if (job.data?.orderId) return this.orders.syncSingleOrder(job.data.orderId);
    return this.orders.syncOrders({});
  }
}
