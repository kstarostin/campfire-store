import { ShoppingCart } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTranslation } from '@/i18n'

export function CartEmpty() {
  const { t } = useTranslation()

  return (
    <EmptyState
      className="cart-empty"
      icon={ShoppingCart}
      title={t('cart.emptyTitle')}
      description={t('cart.emptyDescription')}
      action={{ label: t('cart.browseProducts'), to: '/products' }}
    />
  )
}
