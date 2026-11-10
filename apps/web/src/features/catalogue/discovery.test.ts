import { describe, expect, it } from 'vitest';
import { catalogueQuery, isDemoId } from './discovery';
describe('catalogue URL boundaries', () => {
  it('bounds pagination and removes irrelevant URL fields', () => {
    expect(
      catalogueQuery(
        new URLSearchParams('page=-2&admin=true&q=  diam di tengah  '),
      ),
    ).toBe('q=diam+di+tengah&page=1&limit=12');
  });
  it('accepts only real local demo identifiers', () => {
    expect(isDemoId('pin-scrub')).toBe(true);
    expect(isDemoId('__proto__')).toBe(false);
    expect(isDemoId('https://example.com/code.js')).toBe(false);
  });
});
