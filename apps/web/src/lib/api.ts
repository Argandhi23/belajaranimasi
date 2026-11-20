import { QueryClient } from '@tanstack/react-query';
import type { Animation, AnimationPage } from '@belajar/shared';
export class ApiError extends Error {
  constructor(public status: number) {
    super(`API request failed (${status})`);
  }
}
const base = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
);
export async function getJson<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${base}${path}`, {
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(60000)])
      : AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new ApiError(response.status);
  return response.json() as Promise<T>;
}
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: (count, error) =>
        count < 1 && (!(error instanceof ApiError) || error.status >= 500),
      retryDelay: 1500,
    },
  },
});
export function findCachedAnimation(
  slug: string,
): { data: Animation; updatedAt: number } | undefined {
  let freshest: { data: Animation; updatedAt: number } | undefined;
  for (const [queryKey, page] of queryClient.getQueriesData<AnimationPage>({
    queryKey: ['animations'],
  })) {
    const match = page?.items.find((item) => item.slug === slug);
    if (!match) continue;
    const updatedAt = queryClient.getQueryState(queryKey)?.dataUpdatedAt ?? 0;
    if (!freshest || updatedAt > freshest.updatedAt) {
      freshest = { data: match, updatedAt };
    }
  }
  return freshest;
}
