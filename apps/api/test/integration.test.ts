import 'reflect-metadata';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalEnvironment } from '../src/environment.js';
import { createApplication } from '../src/app.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { seed } from '../prisma/seed.js';
loadLocalEnvironment();
const url = process.env.TEST_DATABASE_URL;
if (
  !url ||
  new URL(url).pathname !== '/belajar_animasi_test' ||
  !['127.0.0.1', 'localhost'].includes(new URL(url).hostname)
)
  throw new Error(
    'Integration requires local disposable belajar_animasi_test database',
  );
process.env.DATABASE_URL = url;
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url }),
});
let app: Awaited<ReturnType<typeof createApplication>>;
let base: string;
before(async () => {
  await seed(prisma);
  await prisma.animation.upsert({
    where: { slug: 'private-draft' },
    create: {
      slug: 'private-draft',
      technicalName: 'Draft',
      indonesianName: 'Draft',
      shortDescription: 'Private',
      explanation: 'Private',
      difficulty: 'BEGINNER',
      categoryId: 'pinning',
      keywords: [],
      libraries: [],
      demoId: 'private',
      codeExampleId: 'private',
      aiPrompt: 'private',
      published: false,
    },
    update: {},
  });
  app = await createApplication();
  await app.listen(0, '127.0.0.1');
  base = await app.getUrl();
});
after(async () => {
  await app?.close();
  await prisma.$disconnect();
});
test('published list, pagination, detail and taxonomy', async () => {
  const page = await fetch(base + '/api/animations?limit=2').then((r) =>
    r.json(),
  );
  assert.equal(page.total, 5);
  assert.equal(page.items.length, 2);
  const next = await fetch(base + '/api/animations?limit=2&page=2').then((r) =>
    r.json(),
  );
  assert.equal(next.items.length, 2);
  const detail = await fetch(base + '/api/animations/pin-scrub').then((r) =>
    r.json(),
  );
  assert.equal(detail.demoId, 'pin-scrub');
  assert.ok(detail.tags.length);
  assert.equal(detail.category.slug, 'pinning');
  const svgDetail = await fetch(base + '/api/animations/svg-draw').then((r) =>
    r.json(),
  );
  assert.equal(svgDetail.demoId, 'svg-draw');
  assert.equal(svgDetail.category.slug, 'svg-morph');
  const morphDetail = await fetch(base + '/api/animations/svg-morph').then(
    (r) => r.json(),
  );
  assert.equal(morphDetail.demoId, 'svg-morph');
  assert.equal(morphDetail.category.slug, 'svg-morph');
  assert.equal(
    (await fetch(base + '/api/animations/private-draft')).status,
    404,
  );
  assert.equal(
    (await fetch(base + '/api/categories').then((r) => r.json())).length,
    12,
  );
});
test('natural language synonyms and combined filters', async () => {
  for (const q of [
    'elemen tetap saat scroll',
    'latar bergerak beda kecepatan',
    'kubus berputar',
    'menggambar garis mengikuti scroll',
    'bentuk berubah mengikuti scroll',
    'Saya mau objeknya diam di tengah saat scroll, lalu objek tersebut membesar dan berputar.',
  ]) {
    const body = await fetch(
      base + '/api/animations?q=' + encodeURIComponent(q),
    ).then((r) => r.json());
    assert.equal(body.total, 1, q);
  }
  const stop = await fetch(base + '/api/animations?q=yang%20dan%20di').then(
    (r) => r.json(),
  );
  assert.equal(stop.total, 5);
  const filtered = await fetch(
    base + '/api/animations?category=pinning&difficulty=INTERMEDIATE',
  ).then((r) => r.json());
  assert.equal(filtered.total, 1);
  const injection = await fetch(
    base +
      '/api/animations?q=' +
      encodeURIComponent("'; DROP TABLE Animation; --"),
  ).then((r) => r.json());
  assert.equal(injection.total, 0);
});
test('rejects invalid and unexpected inputs; exposes no write routes', async () => {
  assert.equal(
    (await fetch(base + '/api/animations/INVALID_slug')).status,
    400,
  );
  for (const query of [
    'limit=101',
    'page=0',
    'difficulty=easy',
    'published=false',
    'q=' + 'x'.repeat(201),
  ])
    assert.equal(
      (await fetch(base + '/api/animations?' + query)).status,
      400,
      query,
    );
  assert.equal(
    (
      await fetch(base + '/api/animations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
    ).status,
    404,
  );
  assert.equal((await fetch(base + '/health')).status, 200);
});

test('indexed search is backfilled and follows metadata changes', async () => {
  const library = await fetch(base + '/api/animations?q=fiber').then((r) =>
    r.json(),
  );
  assert.equal(library.total, 1);
  assert.equal(library.items[0].slug, 'scroll-cube');
  const original = await prisma.animation.findUniqueOrThrow({
    where: { slug: 'pin-scrub' },
  });
  try {
    await prisma.animation.update({
      where: { id: original.id },
      data: { keywords: [...original.keywords, 'ujipembaruanindeks'] },
    });
    const updated = await fetch(
      base + '/api/animations?q=ujipembaruanindeks',
    ).then((r) => r.json());
    assert.equal(updated.total, 1);
    assert.equal(updated.items[0].slug, original.slug);
  } finally {
    await prisma.animation.update({
      where: { id: original.id },
      data: { keywords: original.keywords },
    });
  }
  const indexes = await prisma.$queryRaw<
    { indexdef: string }[]
  >`SELECT indexdef FROM pg_indexes WHERE tablename = 'Animation' AND indexname = 'Animation_searchVector_idx'`;
  assert.equal(indexes.length, 1);
  assert.match(indexes[0].indexdef, /USING gin/);
});
