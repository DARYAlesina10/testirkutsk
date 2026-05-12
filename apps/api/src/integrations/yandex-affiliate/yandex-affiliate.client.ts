import axios, { AxiosInstance } from 'axios';

const RATE_HEADERS = ['x-ratelimit-global-limit','x-ratelimit-global-remaining','x-ratelimit-global-until','x-ratelimit-daily-limit','x-ratelimit-daily-remaining','x-ratelimit-daily-until','x-ratelimit-method-limit','x-ratelimit-method-remaining','x-ratelimit-method-until'];

export class YandexAffiliateClient {
  private client: AxiosInstance;
  constructor() { this.client = axios.create({ baseURL: 'https://api.content.market.yandex.ru/v3/affiliate', timeout: 10000 }); }
  get mockMode() { return !(process.env.YANDEX_CONTENT_API_KEY && process.env.YANDEX_CLID); }
  private pickHeaders(headers: Record<string, any>) { return RATE_HEADERS.reduce((a,k)=>({ ...a, [k]: headers?.[k] }), {}); }
  async get(path: string, params: Record<string, unknown>) {
    if (this.mockMode) return { data: { mock: true, path, params }, headers: {} };
    const resp = await this.client.get(path, { params, headers: { Authorization: process.env.YANDEX_CONTENT_API_KEY! } });
    return { ...resp, headers: this.pickHeaders(resp.headers as Record<string, any>) };
  }
  async post(path: string, params: Record<string, unknown>, body: Record<string, unknown>) {
    if (this.mockMode) return { data: { mock: true, path, params, body }, headers: {} };
    const resp = await this.client.post(path, body, { params, headers: { Authorization: process.env.YANDEX_CONTENT_API_KEY! } });
    return { ...resp, headers: this.pickHeaders(resp.headers as Record<string, any>) };
  }
}
