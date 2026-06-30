import type { CartEntry, Order } from '@/api/types'

export const ORDERS_PAGE_SIZE = 10

export type OrderStatus = 'open' | 'progress' | 'delivered'

export function orderDate(order: Pick<Order, '_id' | 'createdAt'>): Date | null {
  if (order.createdAt) {
    const parsed = new Date(order.createdAt)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }

  if (!/^[0-9a-fA-F]{24}$/.test(order._id)) return null
  return new Date(parseInt(order._id.substring(0, 8), 16) * 1000)
}

export function formatOrderDate(
  order: Pick<Order, '_id' | 'createdAt'>,
  locale: string,
): string {
  const date = orderDate(order)
  if (!date) return '—'

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function orderItemCount(entries: CartEntry[] | undefined): number {
  return (entries ?? []).reduce((total, entry) => total + entry.quantity, 0)
}

export function normalizeOrderStatus(status: string | undefined): OrderStatus | null {
  if (status === 'open' || status === 'progress' || status === 'delivered') {
    return status
  }
  return null
}

export function orderStatusClassName(status: OrderStatus): string {
  switch (status) {
    case 'open':
      return 'order-status--open'
    case 'progress':
      return 'order-status--progress'
    case 'delivered':
      return 'order-status--delivered'
  }
}
