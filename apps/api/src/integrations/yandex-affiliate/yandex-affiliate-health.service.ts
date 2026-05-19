import { Injectable } from '@nestjs/common';

@Injectable()
export class YandexAffiliateHealthService {
  status() {
    return {
      configured: Boolean(process.env.YANDEX_CONTENT_API_KEY),
      mockMode: !process.env.YANDEX_CONTENT_API_KEY,
      baseUrl: process.env.YANDEX_AFFILIATE_BASE_URL ?? 'https://api.content.market.yandex.ru/v3/affiliate'
    };
  }
}
