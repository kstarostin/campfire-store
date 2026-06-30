import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import { parseOrderList, parseOrderResponse, parseProduct } from '@/api/normalizers'
import type { CartEntry, Currency, Order, Product } from '@/api/types'
import { useLocale } from '@/hooks/useLocale'
import { ORDERS_PAGE_SIZE } from '@/lib/order'
import { useAuthStore } from '@/store/authStore'

export interface OrderLine {
  entry: CartEntry
  product: Product
}

export interface OrderDetailViewModel {
  order: Order
  lines: OrderLine[]
}

function ordersListQueryKey(
  userId: string | undefined,
  page: number,
  language: ReturnType<typeof useLocale>['language'],
  currency: Currency,
) {
  return ['orders', userId, page, language, currency] as const
}

function orderDetailQueryKey(
  userId: string | undefined,
  orderId: string | null,
  language: ReturnType<typeof useLocale>['language'],
  currency: Currency,
) {
  return ['order', userId, orderId, language, currency] as const
}

async function loadOrderWithProducts(
  userId: string,
  orderId: string,
  token: string,
  language: ReturnType<typeof useLocale>['language'],
  currency: Currency,
): Promise<OrderDetailViewModel> {
  const response = await endpoints.order(userId, orderId, token)
  const order = parseOrderResponse(response)
  const entries = order.entries ?? []

  if (entries.length === 0) {
    return { order, lines: [] }
  }

  const productIds = [...new Set(entries.map((entry) =>
    typeof entry.product === 'string' ? entry.product : entry.product._id,
  ))]

  const products = await Promise.all(
    productIds.map(async (productId) => {
      const productResponse = await endpoints.product(productId, language, currency)
      return parseProduct(productResponse, language)
    }),
  )

  const productMap = new Map(products.map((product) => [product._id, product]))
  const lines = entries.flatMap((entry) => {
    const productId = typeof entry.product === 'string' ? entry.product : entry.product._id
    const product = productMap.get(productId)
    return product ? [{ entry, product }] : []
  })

  return { order, lines }
}

export function useOrdersList(page: number) {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const { language, currency } = useLocale()

  return useQuery({
    queryKey: ordersListQueryKey(user?._id, page, language, currency),
    queryFn: async () => {
      const response = await endpoints.orders(user!._id, token!, {
        page,
        limit: ORDERS_PAGE_SIZE,
        sort: '-createdAt',
      })
      return parseOrderList(response)
    },
    enabled: Boolean(token && user?._id),
  })
}

export function useOrderDetail(orderId: string | null) {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const { language, currency } = useLocale()

  return useQuery({
    queryKey: orderDetailQueryKey(user?._id, orderId, language, currency),
    queryFn: () => loadOrderWithProducts(user!._id, orderId!, token!, language, currency),
    enabled: Boolean(token && user?._id && orderId),
  })
}
