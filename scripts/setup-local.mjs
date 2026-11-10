import { randomBytes } from 'node:crypto';
import { existsSync, writeFileSync } from 'node:fs';
if (existsSync('.env')) {
  console.log('Existing .env preserved.');
} else {
  const owner = randomBytes(24).toString('hex');
  const reader = randomBytes(24).toString('hex');
  const test = randomBytes(24).toString('hex');
  writeFileSync(
    '.env',
    [
      `POSTGRES_PASSWORD=${owner}`,
      `TEST_POSTGRES_PASSWORD=${test}`,
      `DATABASE_URL=postgresql://belajar_reader:${reader}@127.0.0.1:5433/belajar_animasi`,
      `DIRECT_DATABASE_URL=postgresql://postgres:${owner}@127.0.0.1:5433/belajar_animasi`,
      `TEST_DATABASE_URL=postgresql://postgres:${test}@127.0.0.1:5434/belajar_animasi_test`,
      'PORT=3000',
      'CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173',
      '',
    ].join('\n'),
    { flag: 'wx' },
  );
  console.log('Created ignored local .env with random database credentials.');
}
