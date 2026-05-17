import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ProductsAutofillService {
  constructor(private readonly prisma: PrismaService) {}

  private slugify(input: string) {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-zа-я0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }

  async importFromQueries(input: { categorySlug?: string; queries: string[] }) {
    const category = input.categorySlug
      ? await this.prisma.category.findUnique({ where: { slug: input.categorySlug } })
      : await this.prisma.category.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!category) return { imported: 0, reason: 'No category found' };

    let imported = 0;
    for (const query of input.queries || []) {
      const q = (query || '').trim();
      if (!q) continue;
      const slugBase = this.slugify(q) || `product-${Date.now()}`;
      const slug = `${slugBase}-${Date.now().toString().slice(-6)}`;
      const marketUrl = `https://market.yandex.ru/search?text=${encodeURIComponent(q)}`;

      await this.prisma.product.create({
        data: {
          title: q,
          slug,
          categoryId: category.id,
          currentPrice: 0,
          oldPrice: 0,
          marketUrl,
          imageUrl: null,
          partnerArticle: null
        }
      });
      imported += 1;
    }

    return { imported, category: category.slug };
  }
}
