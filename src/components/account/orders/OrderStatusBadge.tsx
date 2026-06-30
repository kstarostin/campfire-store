import type { OrderStatus } from '@/lib/order'
import { orderStatusClassName, orderStatusIcon } from '@/lib/order'
import { useTranslation } from '@/i18n'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { t } = useTranslation()
  const Icon = orderStatusIcon(status)

  return (
    <span className={`order-status ${orderStatusClassName(status)}`}>
      <Icon size={12} strokeWidth={2.25} aria-hidden />
      {t(`account.orders.status.${status}`)}
    </span>
  )
}
