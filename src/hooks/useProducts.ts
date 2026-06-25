import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import { parseProductList } from '@/api/normalizers'
import type { PaginationParams } from '@/api/types'
import { useLocale } from '@/hooks/useLocale'

export interface UseProductsOptions extends PaginationParams {
  enabled?: boolean
  filter?: Record<string, unknown> | string
}

export function useProducts(options: UseProductsOptions = {}) {
  const { language, currency } = useLocale()
  const { enabled = true, page, limit, sort, filter } = options

  return useQuery({
    queryKey: ['products', language, currency, page, limit, sort, filter],
    queryFn: () =>
      endpoints.products(language, currency, { page, limit, sort, filter }),
    enabled,
    select: (response) => parseProductList(response),
  })
}

export function useFeaturedProducts(options: Omit<UseProductsOptions, 'filter'> = {}) {
  const { language, currency } = useLocale()
  const { enabled = true, page, limit, sort } = options

  return useQuery({
    queryKey: ['products', 'featured', language, currency, page, limit, sort],
    queryFn: () =>
      endpoints.products(language, currency, {
        page,
        limit,
        sort,
        filter: { isFeatured: true },
      }),
    enabled,
    select: (response) => parseProductList(response),
  })
}

export function useProductCount() {
  const { language, currency } = useLocale()

  return useQuery({
    queryKey: ['products', 'count', language, currency],
    queryFn: () => endpoints.products(language, currency, { limit: 1 }),
    select: (response) => parseProductList(response).total,
  })
}
