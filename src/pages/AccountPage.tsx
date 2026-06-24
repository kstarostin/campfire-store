import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { useTranslation } from '@/i18n'

export function AccountPage() {
  const { t } = useTranslation()

  return (
    <PagePlaceholder
      title={t('pages.account')}
      description={t('pages.accountHint')}
    />
  )
}
