import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';
import { Catalogue } from '../src/catalogue.js';
import type { Database } from '../src/database.js';
import { AnimationQuery, Difficulty } from '../src/dto.js';

function createQuery(overrides: Partial<AnimationQuery> = {}): AnimationQuery {
  return Object.assign(new AnimationQuery(), overrides);
}

describe('Catalogue service query efficiency', () => {
  it('skips findMany entirely when CTE returns zero matching IDs', async () => {
    const queryRaw = vi.fn().mockResolvedValue([{ total: 0, ids: [] }]);
    const findMany = vi.fn();
    const db = {
      $queryRaw: queryRaw,
      animation: { findMany },
    } as unknown as Database;

    const service = new Catalogue(db);
    const result = await service.list(createQuery({ q: 'tidakada' }));

    expect(result).toEqual({ items: [], total: 0, page: 1, limit: 12 });
    expect(queryRaw).toHaveBeenCalledTimes(1);
    expect(findMany).not.toHaveBeenCalled();
  });

  it('skips findMany when offset exceeds total while preserving exact total count', async () => {
    const queryRaw = vi.fn().mockResolvedValue([{ total: 14, ids: [] }]);
    const findMany = vi.fn();
    const db = {
      $queryRaw: queryRaw,
      animation: { findMany },
    } as unknown as Database;

    const service = new Catalogue(db);
    const result = await service.list(createQuery({ page: 5, limit: 12 }));

    expect(result).toEqual({ items: [], total: 14, page: 5, limit: 12 });
    expect(queryRaw).toHaveBeenCalledTimes(1);
    expect(findMany).not.toHaveBeenCalled();
  });

  it('preserves CTE ordering and strips internal foreign keys', async () => {
    const createdAt = new Date('2026-11-10T00:00:00.000Z');
    const updatedAt = new Date('2026-11-11T00:00:00.000Z');
    const queryRaw = vi.fn().mockResolvedValue([
      {
        total: 2,
        ids: ['id-second', 'id-first'],
      },
    ]);
    const findMany = vi.fn().mockResolvedValue([
      {
        id: 'id-first',
        slug: 'pin-scrub',
        technicalName: 'ScrollTrigger Pin & Scrub',
        indonesianName: 'Elemen tetap',
        shortDescription: 'Desc 1',
        explanation: 'Exp 1',
        difficulty: Difficulty.INTERMEDIATE,
        categoryId: 'pinning',
        category: { slug: 'pinning', name: 'Pin & scrub' },
        tags: [{ tag: { name: 'scroll' } }],
        keywords: ['pin'],
        libraries: ['GSAP'],
        demoId: 'pin-scrub',
        codeExampleId: 'pin-scrub',
        aiPrompt: 'prompt',
        published: true,
        createdAt,
        updatedAt,
      },
      {
        id: 'id-second',
        slug: 'depth-parallax',
        technicalName: 'Depth Parallax',
        indonesianName: 'Lapisan bergerak',
        shortDescription: 'Desc 2',
        explanation: 'Exp 2',
        difficulty: Difficulty.INTERMEDIATE,
        categoryId: 'parallax',
        category: { slug: 'parallax', name: 'Depth parallax' },
        tags: [{ tag: { name: 'parallax' } }, { tag: { name: 'depth' } }],
        keywords: ['parallax'],
        libraries: ['GSAP'],
        demoId: 'depth-parallax',
        codeExampleId: 'depth-parallax',
        aiPrompt: 'prompt',
        published: true,
        createdAt,
        updatedAt,
      },
    ]);
    const db = {
      $queryRaw: queryRaw,
      animation: { findMany },
    } as unknown as Database;

    const service = new Catalogue(db);
    const result = await service.list(createQuery({ limit: 2 }));

    expect(result.total).toBe(2);
    expect(result.items.map((item) => item.slug)).toEqual([
      'depth-parallax',
      'pin-scrub',
    ]);
    expect(result.items[0]?.tags).toEqual(['parallax', 'depth']);
    expect(result.items[0]?.createdAt).toBe(createdAt.toISOString());
    expect('categoryId' in (result.items[0] ?? {})).toBe(false);
  });

  it('omits category join on default queries and parameterizes all filter inputs', async () => {
    const queryRaw = vi.fn().mockResolvedValue([{ total: 0, ids: [] }]);
    const db = {
      $queryRaw: queryRaw,
      animation: { findMany: vi.fn() },
    } as unknown as Database;

    const service = new Catalogue(db);
    await service.list(createQuery({ page: 1, limit: 18 }));

    const defaultSql = queryRaw.mock.calls[0]?.[0] as {
      sql: string;
      values: unknown[];
    };
    expect(defaultSql.sql).not.toContain('AnimationCategory');
    expect(defaultSql.sql).toContain('ORDER BY "createdAt", slug');
    expect(defaultSql.values).toEqual([18, 0]);

    await service.list(
      createQuery({
        q: "'; DROP TABLE Animation; --",
        category: 'pinning',
        difficulty: Difficulty.INTERMEDIATE,
        page: 2,
        limit: 12,
      }),
    );

    const filteredSql = queryRaw.mock.calls[1]?.[0] as {
      sql: string;
      values: unknown[];
    };
    expect(filteredSql.sql).toContain('JOIN "AnimationCategory"');
    expect(filteredSql.sql).not.toContain('DROP TABLE');
    expect(filteredSql.sql).not.toContain('pinning');
    expect(filteredSql.values).toContain('pinning');
    expect(filteredSql.values).toContain('INTERMEDIATE');
    expect(filteredSql.values.slice(-2)).toEqual([12, 12]);
  });
});
