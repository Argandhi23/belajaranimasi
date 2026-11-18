import { demoIds, type DemoId } from '@belajar/animation-demos';

export function isDemoId(value: string): value is DemoId {
  return demoIds.some((id) => id === value);
}
export function catalogueQuery(params: URLSearchParams) {
  const query = new URLSearchParams();
  for (const key of ['q', 'category', 'difficulty']) {
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
export function catalogueRangeLabel(
  total: number | undefined,
  isPending = false,
) {
  if (total === undefined) return isPending ? '...' : '';
  if (total <= 0) return '00';
  return `01—${String(total).padStart(2, '0')}`;
}
