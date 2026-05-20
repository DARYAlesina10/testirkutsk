import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class PriceCheckScheduler implements OnModuleInit {
  constructor(@InjectQueue('price-check') private readonly queue: Queue) {}
  onModuleInit() {
    this.queue.add('price-check-pro', { tariff: 'PRO' }, { repeat: { every: 60 * 60 * 1000 } }).catch(() => null);
    this.queue.add('price-check-premium', { tariff: 'PREMIUM' }, { repeat: { every: 3 * 60 * 60 * 1000 } }).catch(() => null);
    this.queue.add('price-check-free', { tariff: 'FREE' }, { repeat: { every: 24 * 60 * 60 * 1000 } }).catch(() => null);
  }
}
