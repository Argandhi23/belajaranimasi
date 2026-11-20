import type { AnimationPage } from '@belajar/shared';
import { demoIds, type DemoId } from '@belajar/animation-demos';

export function isDemoId(value: string): value is DemoId {
  return demoIds.some((id) => id === value);
}
export function catalogueQuery(params: URLSearchParams) {
  const query = new URLSearchParams();
  const q = params
    .get('q')
    ?.trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('id');
  if (q) query.set('q', q.slice(0, 200));
  for (const key of ['category', 'difficulty']) {
    const value = params.get(key)?.trim();
    if (value) query.set(key, value.slice(0, 200));
  }
  const page = Number(params.get('page') || 1);
  query.set(
    'page',
    String(Number.isInteger(page) && page > 0 && page <= 10000 ? page : 1),
  );
  query.set('limit', '18');
  return query.toString();
}
export function filterCatalogueLocally(
  source: AnimationPage,
  params: URLSearchParams,
): AnimationPage | null {
  if (params.get('q')?.trim()) return null;
  if (source.total > source.items.length) return null;
  const page = Number(params.get('page') || 1);
  if (Number.isInteger(page) && page > 1) return null;
  const category = params.get('category')?.trim();
  const difficulty = params.get('difficulty')?.trim();
  const items = source.items.filter(
    (item) =>
      (!category || item.category.slug === category) &&
      (!difficulty || item.difficulty === difficulty),
  );
  return {
    items,
    total: items.length,
    page: 1,
    limit: source.limit,
  };
}
export function shouldFetchFilteredCatalogue({
  query,
  baseQuery,
  hasTextSearch,
  hasLocalFilter,
  baseSucceeded,
}: {
  query: string;
  baseQuery: string;
  hasTextSearch: boolean;
  hasLocalFilter: boolean;
  baseSucceeded: boolean;
}) {
  if (query === baseQuery || hasLocalFilter) return false;
  return hasTextSearch || baseSucceeded;
}
export function catalogueRangeLabel(
  total: number | undefined,
  isPending = false,
) {
  if (total === undefined) return isPending ? '...' : '';
  if (total <= 0) return '00';
  return `01—${String(total).padStart(2, '0')}`;
}
