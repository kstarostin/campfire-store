import { Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'

export function OrdersEmpty() {
  const { t } = useTranslation()

  return (
    <div className="orders-empty">
      <div className="orders-empty__icon" aria-hidden="true">
        <Package size={28} />
      </div>
      <h3>{t('account.orders.emptyTitle')}</h3>
      <p>{t('account.orders.emptyBody')}</p>
      <Button to="/products">{t('account.orders.browseProducts')}</Button>
    </div>
  )
}
