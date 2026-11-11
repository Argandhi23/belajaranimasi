export const implementedIds = [
  'pin-scrub',
  'depth-parallax',
  'scroll-cube',
  'svg-draw',
] as const;
export function isDemoId(
  value: string,
): value is (typeof implementedIds)[number] {
  return implementedIds.some((id) => id === value);
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
  query.set('limit', '12');
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
