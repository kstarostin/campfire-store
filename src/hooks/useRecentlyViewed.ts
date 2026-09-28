import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import { parseProductList } from '@/api/normalizers'
import { useLocale } from '@/hooks/useLocale'
import {
  RECENTLY_VIEWED_LIMIT,
  useRecentlyViewedStore,
} from '@/store/recentlyViewedStore'

/** Records a product as the most recently viewed. Call it from the PDP. */
export function useRecordProductView(productId: string | undefined) {
  const recordView = useRecentlyViewedStore((state) => state.recordView)

  useEffect(() => {
    if (productId) recordView(productId)
  }, [productId, recordView])
}

/**
 * The stored ids, hydrated into products. One request for the whole set rather
 * than one per id, and re-sorted afterwards because the API answers in its own
 * order while the point of the rail is that the newest comes first.
 */
export function useRecentlyViewedProducts() {
  const { language, currency } = useLocale()
  const productIds = useRecentlyViewedStore((state) => state.productIds)

  const query = useQuery({
    queryKey: ['products', 'recently-viewed', language, currency, productIds],
    queryFn: () =>
      endpoints.products(language, currency, {
        limit: RECENTLY_VIEWED_LIMIT,
        filter: { _id: { $in: productIds } },
      }),
    enabled: productIds.length > 0,
    select: (response) => parseProductList(response, language).products,
  })

  const products = useMemo(() => {
    const byId = new Map((query.data ?? []).map((product) => [product._id, product]))
    // Ids outside the response are dropped: a product can be deleted between
    // the visit that stored it and the visit that renders the rail.
    return productIds
      .map((id) => byId.get(id))
      .filter((product) => product !== undefined)
  }, [query.data, productIds])

  return { ...query, products }
}
