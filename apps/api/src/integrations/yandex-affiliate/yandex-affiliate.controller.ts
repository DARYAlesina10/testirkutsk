import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { YandexAffiliateLinkService } from './yandex-affiliate-link.service';
import { YandexAffiliateArticleService } from './yandex-affiliate-article.service';
import { YandexAffiliateOrdersService } from './yandex-affiliate-orders.service';
import { CreateAffiliateLinkDto, CreatePartnerArticleDto } from '../../modules/dto';
import { AdminGuard } from '../../modules/admin.guard';

@Controller()
export class YandexAffiliateController {
  constructor(private readonly linkService: YandexAffiliateLinkService, private readonly articleService: YandexAffiliateArticleService, private readonly ordersService: YandexAffiliateOrdersService) {}

  @Get('/partner/link/create')
  link(@Query() query: CreateAffiliateLinkDto) { return this.linkService.createAffiliateLink({ productId: query.vid ?? "unknown", marketUrl: query.url, source: "api", userId: "admin", campaign: query.erid }); }

  @Post('/partner/article/create')
  article(@Body() body: CreatePartnerArticleDto) { return this.articleService.createArticle(body, body.preserveOfferArticle === 'true', body.vid); }

  @UseGuards(AdminGuard)
  @Get('/orders')
  orders() { return this.ordersService.getOrders({}); }

  @UseGuards(AdminGuard)
  @Get('/order')
  order(@Query('orderId') orderId: string) { return this.ordersService.getOrder({ orderId }); }

  @UseGuards(AdminGuard)
  @Post('/orders/sync')
  sync() { return this.ordersService.syncOrders({}); }
}
