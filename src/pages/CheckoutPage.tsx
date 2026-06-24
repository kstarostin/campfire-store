import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { useTranslation } from '@/i18n'

export function CheckoutPage() {
  const { t } = useTranslation()

  return (
    <PagePlaceholder
      title={t('pages.checkout')}
      description={t('pages.checkoutHint')}
    />
  )
}
