export const appConfig = {
  apiPort: Number(process.env.API_PORT ?? 3001),
  webPort: Number(process.env.WEB_PORT ?? 3000),
  redisUrl: process.env.REDIS_URL ?? 'redis://redis:6379',
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@postgres:5432/chestnaya_skidka'
};
