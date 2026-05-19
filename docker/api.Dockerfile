FROM node:20-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm i && pnpm --filter @cs/api build
CMD ["pnpm","--filter","@cs/api","start"]
