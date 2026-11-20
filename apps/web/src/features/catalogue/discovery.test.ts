import { describe, expect, it } from 'vitest';
import type { AnimationPage } from '@belajar/shared';
import {
  catalogueQuery,
  catalogueRangeLabel,
  filterCatalogueLocally,
  isDemoId,
  shouldFetchFilteredCatalogue,
} from './discovery';

const samplePage: AnimationPage = {
  total: 2,
  page: 1,
  limit: 18,
  items: [
    {
      id: '1',
      slug: 'pin-scrub',
      technicalName: 'ScrollTrigger Pin & Scrub',
      indonesianName: 'Elemen tetap',
      shortDescription: 'Desc',
      explanation: 'Exp',
      difficulty: 'INTERMEDIATE',
      category: { slug: 'pinning', name: 'Pin & scrub' },
      tags: ['scroll'],
      keywords: ['pin'],
      libraries: ['GSAP'],
      demoId: 'pin-scrub',
      codeExampleId: 'pin-scrub',
      aiPrompt: 'prompt',
      published: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      slug: 'svg-draw',
      technicalName: 'Scroll-linked SVG Stroke Draw',
      indonesianName: 'Garis SVG',
      shortDescription: 'Desc',
      explanation: 'Exp',
      difficulty: 'BEGINNER',
      category: { slug: 'svg-morph', name: 'SVG morph & draw' },
      tags: ['svg'],
      keywords: ['svg'],
      libraries: ['GSAP'],
      demoId: 'svg-draw',
      codeExampleId: 'svg-draw',
      aiPrompt: 'prompt',
      published: true,
      createdAt: '2026-01-02T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    },
  ],
};

describe('catalogue URL boundaries', () => {
  it('bounds pagination, normalizes search cache keys, and removes irrelevant URL fields', () => {
    expect(
      catalogueQuery(
        new URLSearchParams('page=-2&admin=true&q=  Diam   di   Tengah  '),
      ),
    ).toBe('q=diam+di+tengah&page=1&limit=18');
  });
  it('accepts only real local demo identifiers', () => {
    expect(isDemoId('pin-scrub')).toBe(true);
    expect(isDemoId('svg-draw')).toBe(true);
    expect(isDemoId('svg-morph')).toBe(true);
    expect(isDemoId('__proto__')).toBe(false);
    expect(isDemoId('https://example.com/code.js')).toBe(false);
  });
  it('formats catalogue range label for loading, empty, and populated totals', () => {
    expect(catalogueRangeLabel(undefined, true)).toBe('...');
    expect(catalogueRangeLabel(undefined, false)).toBe('');
    expect(catalogueRangeLabel(0, false)).toBe('00');
    expect(catalogueRangeLabel(4, false)).toBe('01—04');
    expect(catalogueRangeLabel(12, false)).toBe('01—12');
  });
  it('filters category and difficulty locally when full catalogue is loaded', () => {
    const byCategory = filterCatalogueLocally(
      samplePage,
      new URLSearchParams('category=pinning'),
    );
    expect(byCategory?.total).toBe(1);
    expect(byCategory?.items[0]?.slug).toBe('pin-scrub');

    const byDifficulty = filterCatalogueLocally(
      samplePage,
      new URLSearchParams('difficulty=BEGINNER'),
    );
    expect(byDifficulty?.total).toBe(1);
    expect(byDifficulty?.items[0]?.slug).toBe('svg-draw');

    const combinedEmpty = filterCatalogueLocally(
      samplePage,
      new URLSearchParams('category=pinning&difficulty=BEGINNER'),
    );
    expect(combinedEmpty?.total).toBe(0);
    expect(combinedEmpty?.items).toEqual([]);
  });
  it('defers to server when text search, pagination, or partial catalogue applies', () => {
    expect(
      filterCatalogueLocally(samplePage, new URLSearchParams('q=kubus')),
    ).toBeNull();
    expect(
      filterCatalogueLocally(samplePage, new URLSearchParams('page=2')),
    ).toBeNull();
    expect(
      filterCatalogueLocally(
        { ...samplePage, total: 25 },
        new URLSearchParams('category=pinning'),
      ),
    ).toBeNull();
  });
  it('avoids firing a second API request on category/difficulty routes while base load is pending or failed', () => {
    expect(
      shouldFetchFilteredCatalogue({
        query: 'category=pinning&page=1&limit=18',
        baseQuery: 'page=1&limit=18',
        hasTextSearch: false,
        hasLocalFilter: false,
        baseSucceeded: false,
      }),
    ).toBe(false);
    expect(
      shouldFetchFilteredCatalogue({
        query: 'category=pinning&page=1&limit=18',
        baseQuery: 'page=1&limit=18',
        hasTextSearch: false,
        hasLocalFilter: false,
        baseSucceeded: true,
      }),
    ).toBe(true);
    expect(
      shouldFetchFilteredCatalogue({
        query: 'q=kubus&page=1&limit=18',
        baseQuery: 'page=1&limit=18',
        hasTextSearch: true,
        hasLocalFilter: false,
        baseSucceeded: false,
      }),
    ).toBe(true);
  });
});
