import { QueryClient } from '@tanstack/react-query'

export const CATALOG_STALE_TIME_MS = 5 * 60_000
export const SESSION_STALE_TIME_MS = 30_000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CATALOG_STALE_TIME_MS,
      gcTime: 10 * 60_000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 2,
    },
  },
})
