import { useParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { useTranslation } from '@/i18n'

export function ProductDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()

  return (
    <PagePlaceholder
      title={t('pages.productDetail')}
      description={t('pages.productDetailHint', { id: id ?? 'unknown' })}
    />
  )
}
