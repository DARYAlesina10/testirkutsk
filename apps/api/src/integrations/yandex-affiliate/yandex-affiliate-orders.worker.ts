import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { YandexAffiliateOrdersService } from './yandex-affiliate-orders.service';

@Processor('affiliate-orders-sync')
export class YandexAffiliateOrdersWorker extends WorkerHost {
  constructor(private readonly ordersService: YandexAffiliateOrdersService) { super(); }
  async process(_job: Job): Promise<void> {
    await this.ordersService.syncOrders();
  }
}
