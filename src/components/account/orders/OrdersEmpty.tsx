import { Package } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTranslation } from '@/i18n'

export function OrdersEmpty() {
  const { t } = useTranslation()

  return (
    <EmptyState
      className="orders-empty"
      icon={Package}
      title={t('account.orders.emptyTitle')}
      description={t('account.orders.emptyBody')}
      action={{ label: t('account.orders.browseProducts'), to: '/products' }}
    />
  )
}
