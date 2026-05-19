import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DataStore } from '../modules/common/data.store';

@Processor('price-check')
export class PriceCheckWorker extends WorkerHost {
  constructor(private readonly ds: DataStore) { super(); }

  async process(job: Job<{ tariff?: 'FREE'|'PREMIUM'|'PRO' }>) {
    if (this.ds.rateLimitPausedUntil && this.ds.rateLimitPausedUntil > new Date()) return { paused: true };
    const updated: string[] = [];
    for (const p of this.ds.products.filter((x:any)=>x.active !== false)) {
      const last = this.ds.priceHistory.filter((h:any)=>h.productId===p.id).sort((a:any,b:any)=>b.createdAt.getTime()-a.createdAt.getTime())[0];
      const newPrice = Math.max(1, Math.round((last?.price ?? p.currentPrice) * (0.97 + Math.random()*0.06)));
      if (newPrice === p.currentPrice) continue; // idempotent
      const old = p.currentPrice;
      p.currentPrice = newPrice;
      this.ds.priceHistory.push({ id:`ph_${Date.now()}_${p.id}`, productId:p.id, price:newPrice, createdAt:new Date() });
      p.dealScore = Math.round(((old - newPrice) / old) * 100);
      const rules = this.ds.watchRules.filter((w:any)=>w.productId===p.id && w.active);
      for (const r of rules) {
        const key = `${r.id}:${newPrice}`;
        const dup = this.ds.notifications.find((n:any)=>n.dedupeKey===key);
        if (dup) continue;
        if (r.targetPrice && newPrice <= r.targetPrice) {
          this.ds.notifications.push({ id:`n_${Date.now()}_${r.id}`, userId:r.userId, message:`Цена упала для ${p.title}: ${old} -> ${newPrice}`, status:'PENDING', dedupeKey:key, createdAt:new Date() });
        }
      }
      updated.push(p.id);
    }
    return { updatedCount: updated.length, tariff: job.data?.tariff ?? 'FREE' };
  }
}
