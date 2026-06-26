import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import { parseProduct, parseProductList } from '@/api/normalizers'
import { useLocale } from '@/hooks/useLocale'

export function useProduct(productId: string | undefined) {
  const { language, currency } = useLocale()

  return useQuery({
    queryKey: ['product', productId, language, currency],
    queryFn: () => endpoints.product(productId!, language, currency),
    enabled: Boolean(productId),
    select: (response) => parseProduct(response, language),
  })
}

export function useRelatedProducts(
  productId: string | undefined,
  categoryCode: string | undefined,
  limit = 8,
) {
  const { language, currency } = useLocale()

  return useQuery({
    queryKey: ['related-products', productId, categoryCode, language, currency, limit],
    enabled: Boolean(productId),
    queryFn: async () => {
      try {
        const response = await endpoints.relatedProducts(
          productId!,
          language,
          currency,
          limit,
        )
        return parseProductList(response, language).products
      } catch {
        if (!categoryCode) return []

        const response = await endpoints.categoryProducts(categoryCode, language, currency, {
          limit: limit + 1,
          sort: '-isFeatured',
        })

        return parseProductList(response, language)
          .products.filter((product) => product._id !== productId)
          .slice(0, limit)
      }
    },
  })
}
