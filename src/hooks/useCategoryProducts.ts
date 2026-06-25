import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import { parseProductList } from '@/api/normalizers'
import type { PaginationParams } from '@/api/types'
import { useLocale } from '@/hooks/useLocale'

export interface UseCategoryProductsOptions extends PaginationParams {
  enabled?: boolean
  filter?: Record<string, unknown> | string
}

export function useCategoryProducts(
  categoryCode: string | undefined,
  options: UseCategoryProductsOptions = {},
) {
  const { language, currency } = useLocale()
  const { enabled = true, page, limit, sort, filter } = options

  return useQuery({
    queryKey: ['category-products', categoryCode, language, currency, page, limit, sort, filter],
    queryFn: () =>
      endpoints.categoryProducts(categoryCode!, language, currency, {
        page,
        limit,
        sort,
        filter,
      }),
    enabled: enabled && Boolean(categoryCode),
    select: (response) => parseProductList(response, language),
  })
}
