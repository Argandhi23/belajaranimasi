import { writeFile } from 'node:fs/promises';
import { format } from 'prettier';
import { createApplication, document } from '../src/app.js';
process.env.DATABASE_URL ??= 'postgresql://unused:unused@localhost:5433/unused';
const app = await createApplication();
await writeFile(
  '../../packages/shared/openapi.json',
  await format(JSON.stringify(document(app)), { parser: 'json' }),
);
await app.close();
