import { Heart } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTranslation } from '@/i18n'

export function WishlistEmpty() {
  const { t } = useTranslation()

  return (
    <EmptyState
      className="wishlist-empty"
      icon={Heart}
      title={t('wishlist.emptyTitle')}
      description={t('wishlist.emptyDescription')}
      action={{ label: t('wishlist.browseProducts'), to: '/products' }}
    />
  )
}
