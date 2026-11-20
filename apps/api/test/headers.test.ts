import 'reflect-metadata';
import { NotFoundException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule, configureApplication } from '../src/application.js';
import { Catalogue } from '../src/catalogue.js';
import { Database } from '../src/database.js';

describe('API HTTP caching, CORS, and read-only efficiency contract', () => {
  let baseUrl = '';
  let closeApp: (() => Promise<void>) | undefined;
  const previousDbUrl = process.env.DATABASE_URL;
  const previousOrigins = process.env.CORS_ORIGINS;

  beforeAll(async () => {
    process.env.DATABASE_URL = 'postgresql://unused:unused@127.0.0.1:5433/test';
    process.env.CORS_ORIGINS = 'http://localhost:5173';
    const app = await NestFactory.create(AppModule, {
      logger: false,
      bodyParser: false,
    });
    const catalogue = app.get(Catalogue);
    catalogue.list = async (query) => ({
      items: [],
      total: 0,
      page: query.page,
      limit: query.limit,
    });
    catalogue.detail = async (slug) => {
      if (slug === 'missing') throw new NotFoundException();
      return {
        id: '1',
        slug,
        technicalName: 'Demo',
        indonesianName: 'Demo',
        shortDescription: 'Desc',
        explanation: 'Exp',
        difficulty: 'BEGINNER',
        category: { slug: 'pinning', name: 'Pin & scrub' },
        tags: ['scroll'],
        keywords: ['scroll'],
        libraries: ['GSAP'],
        demoId: slug,
        codeExampleId: slug,
        aiPrompt: 'prompt',
        published: true,
        createdAt: '2026-11-10T00:00:00.000Z',
        updatedAt: '2026-11-10T00:00:00.000Z',
      };
    };
    catalogue.categories = (async () => [
      { slug: 'pinning', name: 'Pin & scrub' },
    ]) as unknown as Catalogue['categories'];
    const db = app.get(Database);
    db.$queryRaw = (async () => [
      { '?column?': 1 },
    ]) as unknown as Database['$queryRaw'];
    db.$disconnect = async () => {};

    configureApplication(app);
    await app.listen(0, '127.0.0.1');
    baseUrl = await app.getUrl();
    closeApp = () => app.close();
  });

  afterAll(async () => {
    await closeApp?.();
    if (previousDbUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDbUrl;
    if (previousOrigins === undefined) delete process.env.CORS_ORIGINS;
    else process.env.CORS_ORIGINS = previousOrigins;
  });

  it.each(['/api/animations', '/api/animations/pin-scrub', '/api/categories'])(
    'emits browser and Vercel Edge CDN caching headers on %s',
    async (path) => {
      const response = await fetch(`${baseUrl}${path}`);
      expect(response.status).toBe(200);
      expect(response.headers.get('cache-control')).toBe(
        'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
      );
      expect(response.headers.get('cdn-cache-control')).toBe(
        'public, s-maxage=3600, stale-while-revalidate=86400',
      );
      expect(response.headers.get('vercel-cdn-cache-control')).toBe(
        'public, s-maxage=3600, stale-while-revalidate=86400',
      );
    },
  );

  it('prevents caching on health and error responses across all CDN layers', async () => {
    for (const [path, expectedStatus] of [
      ['/health', 200],
      ['/api/animations/missing', 404],
      ['/api/animations/INVALID_slug', 400],
    ] as const) {
      const response = await fetch(`${baseUrl}${path}`);
      expect(response.status).toBe(expectedStatus);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(response.headers.get('cdn-cache-control')).toBe('no-store');
      expect(response.headers.get('vercel-cdn-cache-control')).toBe('no-store');
    }
  });

  it('rejects write methods and caches CORS preflight for 24 hours', async () => {
    const post = await fetch(`${baseUrl}/api/animations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    expect(post.status).toBe(404);

    const preflight = await fetch(`${baseUrl}/api/animations`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET',
      },
    });
    expect(preflight.headers.get('access-control-allow-origin')).toBe(
      'http://localhost:5173',
    );
    expect(preflight.headers.get('access-control-max-age')).toBe('86400');

    const getAllowed = await fetch(`${baseUrl}/api/animations`, {
      headers: { Origin: 'http://localhost:5173' },
    });
    expect(getAllowed.headers.get('access-control-allow-origin')).toBe(
      'http://localhost:5173',
    );

    const getBlocked = await fetch(`${baseUrl}/api/animations`, {
      headers: { Origin: 'https://untrusted.example' },
    });
    expect(getBlocked.headers.get('access-control-allow-origin')).toBeNull();
  });
});
