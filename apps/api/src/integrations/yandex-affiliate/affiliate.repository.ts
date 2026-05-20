import { Injectable } from '@nestjs/common';

@Injectable()
export class AffiliateRepository {
  links: any[] = [];
  articles: any[] = [];
  orders: any[] = [{ orderId: 'MOCK-ORDER-1', status: 'PAID', items: [{ sku: 'sku-1', quantity: 1 }] }];
  rateLimit: Record<string, string | number> = {};

  saveLink(payload: any) { this.links.push(payload); return payload; }
  saveArticle(payload: any) { this.articles.push(payload); return payload; }
  saveOrders(payload: any[]) { this.orders = payload; return payload; }
}
