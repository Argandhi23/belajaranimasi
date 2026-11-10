import { QueryClient } from '@tanstack/react-query';
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
      staleTime: 60000,
      refetchOnWindowFocus: false,
      retry: (count, error) =>
        count < 1 && (!(error instanceof ApiError) || error.status >= 500),
      retryDelay: 1500,
    },
  },
});
