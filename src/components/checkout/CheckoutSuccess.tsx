import { CircleCheck } from 'lucide-react'
import type { Order } from '@/api/types'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'

interface CheckoutSuccessProps {
  order: Order
  customerName: string
}

export function CheckoutSuccess({ order, customerName }: CheckoutSuccessProps) {
  const { t } = useTranslation()

  return (
    <div className="checkout-success">
      <div className="checkout-success__icon" aria-hidden="true">
        <CircleCheck size={32} />
      </div>
      <h2>{t('checkout.successTitle')}</h2>
      <p>{t('checkout.successBody', { name: customerName })}</p>
      <p className="checkout-success__order">{t('checkout.orderNumber', { id: order._id })}</p>
      <div className="checkout-success__actions">
        <Button to={`/orders/${order._id}`}>{t('checkout.viewOrder')}</Button>
        <Button to="/products" variant="secondary">
          {t('checkout.continueShopping')}
        </Button>
      </div>
    </div>
  )
}
