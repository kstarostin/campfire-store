import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { useTranslation } from '@/i18n'

export function CategoriesPage() {
  const { t } = useTranslation()

  return (
    <PagePlaceholder
      title={t('pages.allCategories')}
      description={t('pages.allCategoriesHint')}
    />
  )
}
