import pg from 'pg';
import { loadLocalEnvironment } from '../src/environment.js';
import { validateReaderDestination } from './reader-destination.js';
loadLocalEnvironment();
const owner = process.env.DIRECT_DATABASE_URL;
const runtime = process.env.DATABASE_URL;
if (!owner || !runtime)
  throw new Error('DIRECT_DATABASE_URL and DATABASE_URL are required');
const url = new URL(runtime);
validateReaderDestination(owner, runtime);
const client = new pg.Client({ connectionString: owner });
await client.connect();
try {
  const existing = await client.query(
    'SELECT 1 FROM pg_roles WHERE rolname=$1',
    ['belajar_reader'],
  );
  if (!existing.rowCount)
    await client.query(
      'CREATE ROLE belajar_reader LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT',
    );
  const statement = await client.query<{ sql: string }>(
    "SELECT format('ALTER ROLE belajar_reader PASSWORD %L', $1::text) AS sql",
    [decodeURIComponent(url.password)],
  );
  await client.query(statement.rows[0].sql);
  await client.query(
    'GRANT CONNECT ON DATABASE belajar_animasi TO belajar_reader',
  );
  await client.query('GRANT USAGE ON SCHEMA public TO belajar_reader');
  await client.query(
    'GRANT SELECT ON ALL TABLES IN SCHEMA public TO belajar_reader',
  );
  await client.query(
    'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO belajar_reader',
  );
  await client.query(
    'ALTER ROLE belajar_reader SET default_transaction_read_only = on',
  );
} finally {
  await client.end();
}
