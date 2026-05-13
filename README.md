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

Ключевые переменные:
- `DATABASE_URL`
- `REDIS_URL`
- `API_PORT`, `WEB_PORT`
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
- auth: `/auth/*`
- products: `/products/*`
- categories: `/categories/*`
- deals: `/deals/*`
- favorites: `/favorites/*`
- watch-rules: `/watch-rules/*`
- notifications: `/notifications/*`
- redirect: `/r/:productId`
- affiliate: `/partner/*`, `/orders`, `/order`, `/orders/sync`
- admin sync: `/admin/yandex-affiliate/*`

## Telegram bot
Команды:
- `/start`, `/help`, `/deals`, `/search`, `/watch`, `/favorites`, `/categories`, `/settings`, `/premium`

Все purchase-ссылки ведут через backend redirect `/r/:productId?source=telegram&campaign=...`.

## Yandex API и mock mode
Если `YANDEX_CONTENT_API_KEY` или нужные CLID не заданы, интеграции работают в mock-режиме.
Это позволяет запускать проект без реальных ключей.

## Безопасность
- API-ключи используются только на backend.
- Authorization header не логируется.
- Admin endpoints защищены guards (`AuthGuard` + `RolesGuard`).
- Favorites/WatchRules ограничены текущим пользователем.

## Production notes
- Текущая реализация использует `DataStore` (in-memory) как scaffold для части модулей.
- Для production заменить mock-репозитории на Prisma repositories.
- Добавить полноценный JWT auth, e2e тесты, CI/CD и observability.
