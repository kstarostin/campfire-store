import { useParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { useTranslation } from '@/i18n'

export function OrderDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()

  return (
    <PagePlaceholder
      title={t('pages.orderDetail')}
      description={t('pages.orderDetailHint', { id: id ?? 'unknown' })}
    />
  )
}
