import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DataStore } from './common/data.store';

@Controller()
export class RedirectController {
  constructor(private readonly ds: DataStore) {}

  @Get('/r/:productId')
  redirect(@Param('productId') productId: string, @Res() res: Response) {
    const product = this.ds.products.find((p) => p.id === productId);
    if (!product) throw new NotFoundException('Product not found');
    return res.redirect(`https://market.yandex.ru/product/${productId}`);
  }
}
