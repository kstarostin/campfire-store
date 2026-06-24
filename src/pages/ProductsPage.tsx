import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { useTranslation } from '@/i18n'

export function ProductsPage() {
  const { t } = useTranslation()

  return (
    <PagePlaceholder
      title={t('pages.allProducts')}
      description={t('pages.allProductsHint')}
    />
  )
}
