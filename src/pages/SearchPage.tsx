import { useSearchParams } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { ProductCatalogView } from '@/components/catalog/ProductCatalogView'
import { useTranslation } from '@/i18n'

export function SearchPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''

  if (!query) {
    return (
      <section className="catalog-page">
        <Container>
          <header className="catalog-page-header">
            <h1>{t('search.title')}</h1>
            <p>{t('search.emptyHint')}</p>
          </header>
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
