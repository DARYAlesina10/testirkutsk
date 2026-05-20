import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DataStore } from '../modules/common/data.store';

@Processor('notification')
export class NotificationWorker extends WorkerHost {
  constructor(private readonly ds: DataStore) { super(); }
  async process(_job: Job) {
    if (this.ds.rateLimitPausedUntil && this.ds.rateLimitPausedUntil > new Date()) return { paused: true };
    let sent = 0, failed = 0;
    for (const n of this.ds.notifications.filter((x:any)=>x.status==='PENDING')) {
      try { n.status = 'SENT'; n.sentAt = new Date(); sent += 1; }
      catch { n.status = 'FAILED'; n.error='telegram failed'; failed += 1; }
    }
    return { sent, failed };
  }
}
