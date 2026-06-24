import { useParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { useTranslation } from '@/i18n'

export function CategoryDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()

  return (
    <PagePlaceholder
      title={t('pages.category')}
      description={t('pages.categoryHint', { id: id ?? 'unknown' })}
    />
  )
}
