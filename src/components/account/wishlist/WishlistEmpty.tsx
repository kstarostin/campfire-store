import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'

export function WishlistEmpty() {
  const { t } = useTranslation()

  return (
    <div className="wishlist-empty">
      <div className="wishlist-empty__icon" aria-hidden>
        <Heart size={28} />
      </div>
      <h2>{t('wishlist.emptyTitle')}</h2>
      <p>{t('wishlist.emptyDescription')}</p>
      <Button to="/products">{t('wishlist.browseProducts')}</Button>
    </div>
  )
}
