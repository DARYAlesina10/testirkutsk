import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DataStore {
  users = [{ id: '1', email: 'admin@example.com', role: 'ADMIN' }, { id: '2', email: 'user@example.com', role: 'USER' }];
  categories = [
    { id: 'c1', name: 'Смартфоны', slug: 'smartfony' },
    { id: 'c2', name: 'Телевизоры', slug: 'tv' },
    { id: 'c3', name: 'Дом', slug: 'home' }
  ];
  products = [
    { id: 'p1', title: 'Телефон X', slug: 'telefon-x', categoryId: 'c1', currentPrice: 10000, oldPrice: 12000, marketUrl: 'https://market.yandex.ru/product--telefon-x/1', marketArticle: null as string | null, partnerArticle: null as string | null, dealScore: 0, active: true },
    { id: 'p2', title: 'TV 4K', slug: 'tv-4k', categoryId: 'c2', currentPrice: 35000, oldPrice: 42000, marketUrl: 'https://market.yandex.ru/product--tv-4k/2', marketArticle: null as string | null, partnerArticle: null as string | null, dealScore: 0, active: true },
    { id: 'p3', title: 'Robot Vac', slug: 'robot-vac', categoryId: 'c3', currentPrice: 15000, oldPrice: 15500, marketUrl: 'https://market.yandex.ru/product--robot-vac/3', marketArticle: null as string | null, partnerArticle: null as string | null, dealScore: 0, active: true }
  ];
  priceHistory = [
    { id: 'ph1', productId: 'p1', price: 12000, createdAt: new Date(Date.now() - 86400000 * 10) },
    { id: 'ph2', productId: 'p1', price: 10000, createdAt: new Date() },
    { id: 'ph3', productId: 'p2', price: 42000, createdAt: new Date(Date.now() - 86400000 * 12) },
    { id: 'ph4', productId: 'p2', price: 35000, createdAt: new Date() },
    { id: 'ph5', productId: 'p3', price: 15500, createdAt: new Date(Date.now() - 86400000 * 8) },
    { id: 'ph6', productId: 'p3', price: 15000, createdAt: new Date() }
  ];
  favorites: { id: string; userId: string; productId: string }[] = [];
  watchRules: any[] = [];
  notifications: any[] = [];
  affiliateLinks: any[] = [];
  partnerArticles: any[] = [];
  clicks: any[] = [];
  affiliateOrders: any[] = [];
  affiliateOrderItems: any[] = [];
  affiliateOrderSyncLogs: any[] = [];
  analytics = { revenue: 0, orders: 0 };
  rateLimitPausedUntil: Date | null = null;

  productById(id: string) { const p=this.products.find(x=>x.id===id); if(!p) throw new NotFoundException('Product not found'); return p; }
}
