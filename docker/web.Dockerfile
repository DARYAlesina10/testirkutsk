FROM node:20-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm i && pnpm --filter @cs/web build
CMD ["pnpm","--filter","@cs/web","start"]
