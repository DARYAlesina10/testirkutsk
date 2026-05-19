FROM node:20-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm i
CMD ["pnpm","--filter","@cs/bot","dev"]
