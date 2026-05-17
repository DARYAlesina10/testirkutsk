import { Injectable } from '@nestjs/common';

export interface ProductView { id: string; title: string; currentPrice: number; oldPrice?: number; imageUrl?: string; }

@Injectable()
export class ProductRepository {
  private readonly items: ProductView[] = [
    { id: 'demo-product', title: 'Смартфон X', currentPrice: 49990, oldPrice: 59990, imageUrl: '' }
  ];

  findAll(): ProductView[] { return this.items; }
  findById(id: string): ProductView | undefined { return this.items.find((x) => x.id === id); }
}
