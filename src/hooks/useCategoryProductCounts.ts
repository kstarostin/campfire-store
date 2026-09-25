import { useQueries } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import type { ApiListEnvelope } from '@/api/normalizers'
import type { Product } from '@/api/types'
import { useLocale } from '@/hooks/useLocale'

/**
 * Product totals per category, keyed by code.
 *
 * The categories endpoint does not carry a count, so this asks the catalog for
 * one product per category and keeps only `resultsTotal` — `fields=_id` trims
 * the payload to almost nothing. One request per card, run in parallel and
 * cached on the normal catalog stale time, so revisiting a category page costs
 * nothing.
 */
export function useCategoryProductCounts(codes: string[]) {
  const { language, currency } = useLocale()

  const results = useQueries({
    queries: codes.map((code) => ({
      queryKey: ['categoryProductCount', code, language, currency],
      queryFn: () =>
        endpoints.categoryProducts(code, language, currency, { limit: 1, fields: '_id' }),
      select: (response: ApiListEnvelope<Product>) => response.resultsTotal ?? 0,
    })),
  })

  const counts: Record<string, number> = {}
  results.forEach((result, index) => {
    if (typeof result.data === 'number') {
      counts[codes[index]] = result.data
    }
  })

  return counts
}
