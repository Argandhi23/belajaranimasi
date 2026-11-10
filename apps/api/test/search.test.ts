import { describe, expect, it } from 'vitest';
import { searchTokens } from '../src/search.js';
describe('Indonesian discovery tokens', () => {
  it('retains meaningful words from a natural question', () => {
    expect(
      searchTokens('bagaimana cara membuat elemen tetap saat scroll?'),
    ).toEqual(['elemen', 'tetap', 'scroll']);
  });
  it('treats an all-stopword query as an unfiltered search', () => {
    expect(searchTokens('yang dan di')).toEqual([]);
  });
  it('normalizes a conversational request and Indonesian possessives', () => {
    expect(
      searchTokens(
        'Saya mau objeknya diam di tengah saat scroll, lalu objek tersebut membesar dan berputar.',
      ),
    ).toEqual(['objek', 'diam', 'tengah', 'scroll', 'membesar', 'berputar']);
  });
});
