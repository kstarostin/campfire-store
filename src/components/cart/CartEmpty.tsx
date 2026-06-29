import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'

export function CartEmpty() {
  const { t } = useTranslation()

  return (
    <div className="cart-empty">
      <div className="cart-empty__icon" aria-hidden>
        <ShoppingCart size={28} />
      </div>
      <h2>{t('cart.emptyTitle')}</h2>
      <p>{t('cart.emptyDescription')}</p>
      <Button to="/products">{t('cart.browseProducts')}</Button>
    </div>
  )
}
