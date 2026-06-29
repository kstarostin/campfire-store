import { AccountSectionPlaceholder } from '@/components/account/AccountSectionPlaceholder'
import { useTranslation } from '@/i18n'

export function AccountOrdersPanel() {
  const { t } = useTranslation()

  return (
    <AccountSectionPlaceholder
      id="panel-orders"
      headingId="account-orders-heading"
      title={t('account.ordersTitle')}
      description={t('account.ordersDescription')}
    />
  )
}
