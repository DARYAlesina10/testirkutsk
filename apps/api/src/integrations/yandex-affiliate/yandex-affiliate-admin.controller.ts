import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../modules/common/auth.guard';
import { RolesGuard } from '../../modules/common/roles.guard';
import { Roles } from '../../modules/common/roles.decorator';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('admin/yandex-affiliate')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class YandexAffiliateAdminController {
  constructor(@InjectQueue('affiliate-orders-sync') private readonly queue: Queue) {}

  @Post('sync-orders')
  async syncOrders() {
    await this.queue.add('syncOrders', {});
    return { queued: true };
  }

  @Post('orders/:orderId/sync')
  async syncOrder(@Param('orderId') orderId: string) {
    await this.queue.add('syncSingleOrder', { orderId });
    return { queued: true, orderId };
  }
}
