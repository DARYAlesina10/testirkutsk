# Honest Discount / Честная Скидка

Монорепозиторий сервиса мониторинга реальных скидок на Яндекс Маркете.

## Структура
- `apps/api` — NestJS API + интеграции + BullMQ workers
- `apps/web` — Next.js сайт + ЛК + админка
- `apps/bot` — Telegram бот на Telegraf
- `packages/config`, `packages/shared`, `packages/database`
- `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/migrations/*`
- `docker-compose.yml`, `docker/*.Dockerfile`

## Требования
- Node.js 20+
- pnpm 9+
- Docker + Docker Compose

## .env
Скопируйте пример:
```bash
cp .env.example .env
```

> ⚠️ Не коммитьте реальные токены в git (`.env` должен оставаться локальным/секретным).

Ключевые переменные:
- `DATABASE_URL`
- `REDIS_URL`
- `API_PORT`, `WEB_PORT`
- `PRISMA_CONNECT_RETRIES`, `PRISMA_CONNECT_DELAY_MS` (optional, startup retry for DB)
- `TELEGRAM_BOT_TOKEN`
- `YANDEX_CONTENT_API_KEY` (optional)
- `YANDEX_AFFILIATE_*` (clid/base/retry/timeouts)

## Установка и локальный запуск
```bash
corepack enable
pnpm i
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Дополнительно перед коммитом рекомендуется проверить проект:
```bash
pnpm lint
pnpm test
```

## Запуск Telegram бота
```bash
pnpm --filter @cs/bot dev
```

Для Docker:
```bash
docker compose up --build bot
```

## Docker запуск
```bash
docker compose up --build
```
Сервисы:
- `postgres`
- `redis`
- `api`
- `web`
- `bot`

## Prisma
- Schema содержит связи, enum, Decimal и Json поля.
- Миграции: `prisma/migrations`.
- Seed: `pnpm db:seed`.

## API (основные)
- health: `/api/health`
- auth: `/api/auth/*`
- products: `/api/products/*`
- categories: `/api/categories/*`
- deals: `/api/deals/*`
- favorites: `/api/favorites/*`
- watch-rules: `/api/watch-rules/*`
- notifications: `/api/notifications/*`
- redirect: `/api/r/:productId`
- affiliate: `/api/partner/*`, `/api/orders`, `/api/order`, `/api/orders/sync`
- admin sync: `/api/admin/yandex-affiliate/*`

## Telegram bot
Команды:
- `/start`, `/help`, `/deals`, `/search`, `/watch`, `/favorites`, `/categories`, `/settings`, `/premium`

Все purchase-ссылки ведут через backend redirect `/r/:productId?source=telegram&campaign=...`.

## Yandex API и mock mode
Если `YANDEX_CONTENT_API_KEY` или нужные CLID не заданы, интеграции работают в mock-режиме.
Это позволяет запускать проект без реальных ключей.

### Быстро подставить реальные токены (локально на сервере)
```bash
cd /home/deploy/apps/honest-discount
cp -n .env.example .env
sed -i 's#^YANDEX_CONTENT_API_KEY=.*#YANDEX_CONTENT_API_KEY=TiabQw5zFz5GLDRtojQyzO7xbgRZZD#' .env
sed -i 's#^TELEGRAM_BOT_TOKEN=.*#TELEGRAM_BOT_TOKEN=8996736501:AAGz2pbJoqB9OJtpwJknlHDn6EXiv0WZRTY#' .env
```

Проверка (без печати токена в консоль):
```bash
grep -E '^(YANDEX_CONTENT_API_KEY|TELEGRAM_BOT_TOKEN)=' .env | sed 's/=.*$/=***hidden***/'
```

## Как включить реальные данные
1. Заполните `.env` реальными значениями:
   - `DATABASE_URL` (PostgreSQL),
   - `REDIS_URL`,
   - `YANDEX_CONTENT_API_KEY`,
   - `YANDEX_AFFILIATE_CLID`, `YANDEX_AFFILIATE_CLIENT_ID`, `YANDEX_AFFILIATE_BASE_URL`.
2. Выполните миграции и генерацию клиента:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```
3. Замените in-memory `DataStore` на Prisma repositories для модулей `products/categories/deals/favorites/watch-rules/notifications`.
4. Проверьте, что API отвечает:
   - `GET /api/health`
   - `GET /api/products`
   - `GET /api/deals`
5. После этого отключите mock seed-пути для production и используйте реальные данные из БД и интеграций.

## Безопасность
- API-ключи используются только на backend.
- Authorization header не логируется.
- Admin endpoints защищены guards (`AuthGuard` + `RolesGuard`).
- Favorites/WatchRules ограничены текущим пользователем.

## Production notes
- Текущая реализация использует `DataStore` (in-memory) как scaffold для части модулей.
- Для production заменить mock-репозитории на Prisma repositories.
- Добавить полноценный JWT auth, e2e тесты, CI/CD и observability.
