import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');
const value = process.env.TEST_DATABASE_URL;
if (!value) throw new Error('TEST_DATABASE_URL is required');
const url = new URL(value);
if (
  !['localhost', '127.0.0.1'].includes(url.hostname) ||
  url.pathname !== '/belajar_animasi_test' ||
  url.port !== '5434'
)
  throw new Error('Only disposable local database on port 5434 is permitted');
const result = spawnSync(
  process.execPath,
  [resolve('apps/api/node_modules/prisma/build/index.js'), 'migrate', 'deploy'],
  {
    cwd: resolve('apps/api'),
    env: { ...process.env, DATABASE_URL: value, DIRECT_DATABASE_URL: value },
    stdio: 'inherit',
  },
);
process.exitCode = result.status ?? 1;
