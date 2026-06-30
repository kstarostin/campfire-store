import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { ProductCatalogView } from '@/components/catalog/ProductCatalogView'
import { EmptyState } from '@/components/ui/EmptyState'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTranslation } from '@/i18n'

export function SearchPage() {
  const { t } = useTranslation()
  usePageTitle('documentTitle.search')
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''

  if (!query) {
    return (
      <section className="catalog-page">
        <Container>
          <EmptyState
            className="search-empty-page"
            icon={Search}
            title={t('search.emptyTitle')}
            description={t('search.emptyBody')}
            secondaryAction={{ label: t('catalog.browseAllProducts'), to: '/products' }}
          />
        </Container>
      </section>
    )
  }

  const activeSummary = t('catalog.searchActiveSummary', { query })

  return (
    <ProductCatalogView
      variant="search"
      query={query}
      title={
        <>
          {t('search.resultsFor')}{' '}
          <span className="catalog-query-term">“{query}”</span>
        </>
      }
      activeSummary={activeSummary}
    />
  )
}
