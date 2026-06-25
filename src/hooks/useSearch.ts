import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import { parseProductList } from '@/api/normalizers'
import type { PaginationParams } from '@/api/types'
import { useLocale } from '@/hooks/useLocale'

export interface UseSearchOptions extends PaginationParams {
  enabled?: boolean
  filter?: Record<string, unknown> | string
}

export function useSearch(query: string, options: UseSearchOptions = {}) {
  const { language, currency } = useLocale()
  const trimmed = query.trim()
  const { enabled = true, page, limit, sort, filter } = options

  return useQuery({
    queryKey: ['search', trimmed, language, currency, page, limit, sort, filter],
    queryFn: () =>
      endpoints.search(trimmed, language, currency, {
        page,
        limit,
        sort,
        filter,
      }),
    enabled: enabled && trimmed.length > 0,
    select: (response) => parseProductList(response, language),
  })
}
