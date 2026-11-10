import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
export function loadLocalEnvironment() {
  const file = [resolve('.env'), resolve('../../.env')].find(existsSync);
  if (file) process.loadEnvFile(file);
}
export function configuration() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || !/^postgres(?:ql)?:\/\//.test(databaseUrl))
    throw new Error('DATABASE_URL must be a PostgreSQL connection URL');
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('PORT must be a valid TCP port');
  const origins = (
    process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://127.0.0.1:5173'
  )
    .split(',')
    .map((origin) => origin.trim());
  for (const origin of origins) {
    const url = new URL(origin);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin)
      throw new Error('CORS_ORIGINS must contain exact HTTP origins');
  }
  return { databaseUrl, port, origins };
}
