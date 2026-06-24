import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { useTranslation } from '@/i18n'

export function WishlistPage() {
  const { t } = useTranslation()

  return (
    <PagePlaceholder
      title={t('pages.wishlist')}
      description={t('pages.wishlistHint')}
    />
  )
}
