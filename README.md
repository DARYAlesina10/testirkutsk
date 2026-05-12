# Honest Discount / «Честная Скидка»

Production-ready scaffold монорепозитория для сервиса мониторинга реальных скидок на Яндекс Маркете.

## Структура
- `apps/web` — Next.js (сайт, ЛК, админка)
- `apps/api` — NestJS API
- `apps/bot` — Telegram bot на Telegraf
- `packages/database` — Prisma scripts
- `packages/shared` — общие типы
- `packages/config` — конфиги
- `prisma/schema.prisma` + `prisma/seed.ts`
- `docker/*.Dockerfile`
- `docker-compose.yml`

## Технологии
TypeScript, Next.js, NestJS, Telegraf, PostgreSQL, Prisma, Redis, BullMQ, Tailwind CSS, Docker Compose.

## Быстрый старт (Docker)
```bash
cp .env.example .env
docker compose up --build
```

Сервисы:
- Web: http://localhost:3000
- API: http://localhost:3001
- Postgres: localhost:5432
- Redis: localhost:6379

## Быстрый старт (локально)
```bash
corepack enable
pnpm i
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Принципы
- Проект стартует без реальных ключей Яндекса (mock-mode).
- Все сервисы модульные и расширяемые.
- Telegram и web используют redirect `/r/:productId` для покупки.

## Минимальные API для проверки
- `GET /products`
- `GET /products/:id`
- `GET /r/:productId`
- `GET /partner/link/create?url=https://market.yandex.ru/...`
- `POST /partner/article/create`
