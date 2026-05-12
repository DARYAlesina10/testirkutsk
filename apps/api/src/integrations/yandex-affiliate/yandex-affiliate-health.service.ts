import { Injectable } from '@nestjs/common';

@Injectable()
export class YandexAffiliateHealthService {
  getStatus() {
    return { mockMode: !(process.env.YANDEX_CONTENT_API_KEY && process.env.YANDEX_CLID), ready: true };
  }
}
