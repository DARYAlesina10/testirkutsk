import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export type RateLimitHeaders = Partial<Record<
  | 'x-ratelimit-global-limit'
  | 'x-ratelimit-global-remaining'
  | 'x-ratelimit-global-until'
  | 'x-ratelimit-daily-limit'
  | 'x-ratelimit-daily-remaining'
  | 'x-ratelimit-daily-until'
  | 'x-ratelimit-method-limit'
  | 'x-ratelimit-method-remaining'
  | 'x-ratelimit-method-until',
  string
>>;

const RATE_HEADERS = [
  'x-ratelimit-global-limit','x-ratelimit-global-remaining','x-ratelimit-global-until',
  'x-ratelimit-daily-limit','x-ratelimit-daily-remaining','x-ratelimit-daily-until',
  'x-ratelimit-method-limit','x-ratelimit-method-remaining','x-ratelimit-method-until'
] as const;

export class YandexAffiliateClient {
  private readonly client: AxiosInstance;
  private readonly retryCount = Number(process.env.YANDEX_AFFILIATE_RETRY_COUNT ?? 2);
  private readonly timeout = Number(process.env.YANDEX_AFFILIATE_HTTP_TIMEOUT_MS ?? 10000);

  constructor() {
    this.client = axios.create({
      baseURL: process.env.YANDEX_AFFILIATE_BASE_URL ?? 'https://api.content.market.yandex.ru/v3/affiliate',
      timeout: this.timeout
    });
  }

  private get apiKey() { return process.env.YANDEX_CONTENT_API_KEY; }

  private headers(extra?: Record<string, string>): Record<string, string> {
    const base: Record<string, string> = { ...(extra ?? {}) };
    if (this.apiKey) base.Authorization = this.apiKey;
    return base;
  }

  private pickRateLimit(headers: Record<string, any>): RateLimitHeaders {
    return RATE_HEADERS.reduce((acc, key) => ({ ...acc, [key]: headers?.[key] }), {} as RateLimitHeaders);
  }

  private async requestWithRetry<T>(fn: () => Promise<T>, retries = this.retryCount): Promise<T> {
    let attempt = 0;
    while (true) {
      try { return await fn(); }
      catch (e) {
        const err = e as AxiosError;
        const status = err.response?.status;
        if (status === 401) throw new Error('YANDEX_AUTHORIZATION_FAILED');
        if (status === 403) throw new Error('YANDEX_RATE_LIMITED');
        if (attempt >= retries) throw e;
        attempt += 1;
      }
    }
  }

  async get(path: string, params: Record<string, unknown>, mock = false) {
    const fullParams = { format: process.env.YANDEX_AFFILIATE_DEFAULT_FORMAT ?? 'json', ...params };
    if (mock || !this.apiKey) return { data: { mock: true, path, params: fullParams }, rateLimit: {} };
    const response = await this.requestWithRetry(() => this.client.get(path, { params: fullParams, headers: this.headers() }));
    return { data: response.data, rateLimit: this.pickRateLimit(response.headers as Record<string, any>) };
  }

  async post(path: string, params: Record<string, unknown>, body: Record<string, unknown>, mock = false) {
    const fullParams = { format: process.env.YANDEX_AFFILIATE_DEFAULT_FORMAT ?? 'json', ...params };
    if (mock || !this.apiKey) return { data: { mock: true, path, params: fullParams, body }, rateLimit: {} };
    const config: AxiosRequestConfig = { params: fullParams, headers: this.headers({ 'Content-Type': 'application/json' }) };
    const response = await this.requestWithRetry(() => this.client.post(path, body, config));
    return { data: response.data, rateLimit: this.pickRateLimit(response.headers as Record<string, any>) };
  }
}
