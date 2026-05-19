import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ProductRepository } from './product.repository';

@Controller('/products')
export class ProductsController {
  constructor(private readonly products: ProductRepository) {}

  @Get()
  list() { return this.products.findAll(); }

  @Get(':id')
  one(@Param('id') id: string) {
    const item = this.products.findById(id);
    if (!item) throw new NotFoundException('Product not found');
    return item;
  }
}
