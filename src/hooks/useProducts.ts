import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import { parseProductList } from '@/api/normalizers'
import type { PaginationParams } from '@/api/types'
import { useLocale } from '@/hooks/useLocale'

export interface UseProductsOptions extends PaginationParams {
  enabled?: boolean
}

export function useProducts(options: UseProductsOptions = {}) {
  const { language, currency } = useLocale()
  const { enabled = true, page, limit, sort } = options

  return useQuery({
    queryKey: ['products', language, currency, page, limit, sort],
    queryFn: () => endpoints.products(language, currency, { page, limit, sort }),
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
