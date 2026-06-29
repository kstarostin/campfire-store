import { AccountSectionPlaceholder } from '@/components/account/AccountSectionPlaceholder'
import { useTranslation } from '@/i18n'

export function AccountWishlistPanel() {
  const { t } = useTranslation()

  return (
    <AccountSectionPlaceholder
      id="panel-wishlist"
      headingId="account-wishlist-heading"
      title={t('account.wishlistTitle')}
      description={t('account.wishlistDescription')}
    />
  )
}
