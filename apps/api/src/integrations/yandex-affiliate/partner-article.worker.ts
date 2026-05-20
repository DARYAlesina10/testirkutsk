import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { YandexAffiliateArticleService } from './yandex-affiliate-article.service';

export interface CreatePartnerArticleJob {
  productId?: string;
  marketArticle?: string;
  marketUrl?: string;
  preserveOfferArticle?: boolean;
  source?: string;
  userId?: string;
}

@Processor('partner-article')
export class PartnerArticleWorker extends WorkerHost {
  constructor(private readonly articleService: YandexAffiliateArticleService) { super(); }
  async process(job: Job<CreatePartnerArticleJob>) {
    return this.articleService.createPartnerArticle(job.data);
  }
}
