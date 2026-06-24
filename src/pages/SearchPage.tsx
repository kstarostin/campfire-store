import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { useTranslation } from '@/i18n'

export function SearchPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''

  return (
    <PagePlaceholder
      title={query ? t('search.titleWithQuery', { query }) : t('search.title')}
      description={query ? t('search.unavailable') : t('search.emptyHint')}
    >
      <div className="flex max-w-lg items-start gap-3 rounded-lg border border-border bg-surface-muted p-4 text-sm text-text-muted">
        <Search size={18} className="mt-0.5 shrink-0 text-secondary" aria-hidden />
        <p className="m-0">{t('search.deferred')}</p>
      </div>
    </PagePlaceholder>
  )
}
