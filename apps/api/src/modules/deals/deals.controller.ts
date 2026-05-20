import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { DealScoreService } from './deal-score.service';

@Controller('deals')
export class DealsController {
  constructor(private prisma: PrismaService, private sc: DealScoreService) {}

  @Get()
  async all() {
    const products = await this.prisma.product.findMany({ include: { priceHistory: true } });
    return products.map((p) => ({
      ...p,
      deal: this.sc.calc(
        Number(p.currentPrice),
        p.oldPrice ? Number(p.oldPrice) : undefined,
        p.priceHistory.map((h) => Number(h.price))
      )
    }));
  }

  @Get('top')
  async top() {
    return (await this.all()).sort((a, b) => b.deal.score - a.deal.score).slice(0, 10);
  }

  @Get('daily')
  async daily() {
    return this.top();
  }

  @Get('category/:slug')
  async byCategory(@Param('slug') slug: string) {
    const c = await this.prisma.category.findUnique({ where: { slug } });
    return (await this.all()).filter((p) => p.categoryId === c?.id);
  }
}
