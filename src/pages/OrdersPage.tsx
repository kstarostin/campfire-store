import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { useTranslation } from '@/i18n'

export function OrdersPage() {
  const { t } = useTranslation()

  return (
    <PagePlaceholder
      title={t('pages.orders')}
      description={t('pages.ordersHint')}
    />
  )
}
