import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { useTranslation } from '@/i18n'

export function CartPage() {
  const { t } = useTranslation()

  return (
    <PagePlaceholder
      title={t('pages.cart')}
      description={t('pages.cartHint')}
    />
  )
}
