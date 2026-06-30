import type { Order } from '@/api/types'
import { OrderStatusBadge } from '@/components/account/orders/OrderStatusBadge'
import { useFormatLocale, useTranslation } from '@/i18n'
import { formatAmount } from '@/lib/cart'
import {
  formatOrderDate,
  normalizeOrderStatus,
  orderItemCount,
} from '@/lib/order'

interface OrderRowProps {
  order: Order
  isSelected: boolean
  onSelect: () => void
}

export function OrderRow({ order, isSelected, onSelect }: OrderRowProps) {
  const { t } = useTranslation()
  const formatLocale = useFormatLocale()
  const status = normalizeOrderStatus(order.status)
  const currency = order.currency ?? 'USD'
  const itemCount = orderItemCount(order.entries)

  return (
    <button
      type="button"
      className={`order-row${isSelected ? ' is-selected' : ''}`}
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
    >
      <div className="order-row__top">
        <p className="order-row__id">{order._id}</p>
        {status ? <OrderStatusBadge status={status} /> : null}
      </div>

      <p className="order-row__date">{formatOrderDate(order, formatLocale)}</p>

      <div className="order-row__bottom">
        <p className="order-row__items">{t('account.orders.itemCount', { count: itemCount })}</p>
        <p className="order-row__total">{formatAmount(order.total ?? 0, currency, formatLocale)}</p>
      </div>
    </button>
  )
}
