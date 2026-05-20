import { PrismaClient, Prisma, Tariff, UserRole, ClickSource, AffiliateLinkStatus, PartnerArticleStatus, AffiliateOrderStatus, SyncStatus } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();
const d = (v: number) => new Prisma.Decimal(v.toFixed(2));
const hash = (s: string) => createHash('sha256').update(s).digest('hex');

async function main() {
  await prisma.$transaction([
    prisma.affiliateOrderItem.deleteMany(), prisma.affiliateOrder.deleteMany(), prisma.partnerArticle.deleteMany(), prisma.affiliateLink.deleteMany(),
    prisma.click.deleteMany(), prisma.notification.deleteMany(), prisma.watchRule.deleteMany(), prisma.favorite.deleteMany(), prisma.priceHistory.deleteMany(),
    prisma.product.deleteMany(), prisma.category.deleteMany(), prisma.subscription.deleteMany(), prisma.subscriptionPlan.deleteMany(), prisma.searchRequest.deleteMany(), prisma.user.deleteMany(),
    prisma.affiliateOrderSyncLog.deleteMany()
  ]);

  const categories = await Promise.all(Array.from({ length: 10 }).map((_, i) =>
    prisma.category.create({ data: { name: `Категория ${i + 1}`, slug: `cat-${i + 1}` } })
  ));

  const products = [] as { id: string; currentPrice: Prisma.Decimal }[];
  for (let i = 0; i < 30; i++) {
    const base = 1000 + i * 500;
    const p = await prisma.product.create({ data: { title: `Товар ${i + 1}`, slug: `product-${i + 1}`, categoryId: categories[i % categories.length].id, currentPrice: d(base * 0.9), oldPrice: d(base), marketUrl: `https://market.yandex.ru/product--${i + 1}/${i + 1000}` } });
    products.push({ id: p.id, currentPrice: p.currentPrice });
  }

  const now = new Date();
  for (const p of products) {
    for (let day = 0; day < 30; day++) {
      const dt = new Date(now); dt.setDate(dt.getDate() - day);
      await prisma.priceHistory.create({ data: { productId: p.id, price: d(Number(p.currentPrice) + day * 10), createdAt: dt } });
    }
  }

  const admin = await prisma.user.create({ data: { email: 'admin@example.com', passwordHash: hash('admin123'), role: UserRole.ADMIN } });
  const user = await prisma.user.create({ data: { email: 'user@example.com', passwordHash: hash('user123'), role: UserRole.USER } });

  const free = await prisma.subscriptionPlan.create({ data: { tariff: Tariff.FREE, name: 'Free', price: d(0), features: ['basic'] } });
  const premium = await prisma.subscriptionPlan.create({ data: { tariff: Tariff.PREMIUM, name: 'Premium', price: d(299), features: ['alerts', 'favorites'] } });
  const pro = await prisma.subscriptionPlan.create({ data: { tariff: Tariff.PRO, name: 'Pro', price: d(699), features: ['all', 'analytics'] } });
  await prisma.subscription.create({ data: { userId: user.id, planId: free.id } });

  await prisma.click.createMany({ data: products.slice(0, 10).map((p, i) => ({ userId: user.id, productId: p.id, source: i % 2 ? ClickSource.WEB : ClickSource.BOT, selectedUrl: `/r/${p.id}`, vid: 'mock-vid' })) });
  await prisma.affiliateLink.createMany({ data: products.slice(0, 10).map((p) => ({ status: AffiliateLinkStatus.CREATED, originalUrl: `https://market.yandex.ru/product/${p.id}`, selectedUrl: `/r/${p.id}`, clid: 'mock-clid', vid: 'mock-vid', rawResponse: { mock: true } })) });
  await prisma.partnerArticle.createMany({ data: products.slice(0, 10).map((_, i) => ({ status: PartnerArticleStatus.CREATED, partnerArticle: `PA-${i + 1}`, originalMarketArticle: `${10000 + i}`, resolvedMarketArticle: `${10000 + i}`, clid: 'mock-clid', vid: 'mock-vid', rawResponse: { mock: true } })) });

  for (let i = 0; i < 8; i++) {
    await prisma.affiliateOrder.create({
      data: {
        orderId: `ORDER-${i + 1}`,
        status: [AffiliateOrderStatus.NEW, AffiliateOrderStatus.PAID, AffiliateOrderStatus.SHIPPED][i % 3],
        clid: 'mock-clid', vid: 'mock-vid', promocode: i % 2 ? 'PROMO10' : null,
        dateCreated: new Date(now.getTime() - i * 86400000),
        dateUpdated: new Date(now.getTime() - i * 43200000),
        additionalInfo: { mock: true }, cart: { total: 1000 + i * 100 }, payment: { method: 'card' }, tariff: { code: i % 2 ? premium.id : pro.id },
        items: { create: [{ sku: `SKU-${i + 1}`, name: `Item ${i + 1}`, quantity: 1 + (i % 2), price: d(1000 + i * 100) }] }
      }
    });
  }

  await prisma.affiliateOrderSyncLog.create({ data: { status: SyncStatus.SUCCESS, error: null } });
  console.log({ admin: 'admin@example.com', note: 'dev password admin123 hashed', categories: categories.length, products: products.length });
}

main().finally(async () => prisma.$disconnect());
