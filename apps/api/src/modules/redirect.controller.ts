import { Controller, Get, NotFoundException, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DataStore } from './common/data.store';
import { YandexAffiliateLinkService } from '../integrations/yandex-affiliate/yandex-affiliate-link.service';

@Controller()
export class RedirectController {
  constructor(private readonly ds: DataStore, private readonly linkService: YandexAffiliateLinkService) {}

  @Get('/r/:productId')
  async redirect(
    @Param('productId') productId: string,
    @Query('source') source = 'site',
    @Query('campaign') campaign?: string,
    @Query('userId') userId?: string,
    @Res() res?: Response
  ) {
    const product = this.ds.products.find((p) => p.id === productId);
    if (!product) throw new NotFoundException('Product not found');
    if (!product.marketUrl) throw new NotFoundException('Product marketUrl not found');

    let selectedUrl = product.marketUrl;
    const fresh = this.linkService.findFreshLink(productId, source, userId);
    if (fresh?.selectedUrl) selectedUrl = fresh.selectedUrl;
    else {
      const older = this.ds.affiliateLinks
        .filter((x) => x.productId === productId && x.status !== 'FAILED')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      if (older?.selectedUrl) selectedUrl = older.selectedUrl;
      const created = await this.linkService.createAffiliateLink({ productId, marketUrl: product.marketUrl, source, userId, campaign });
      if (created?.selectedUrl) selectedUrl = created.selectedUrl;
    }

    this.ds.clicks.push({
      id: `cl_${Date.now()}`,
      productId,
      userId: userId || 'guest',
      source,
      selectedUrl,
      campaign: campaign || null,
      createdAt: new Date()
    });

    return res!.redirect(selectedUrl || product.marketUrl);
  }
}
