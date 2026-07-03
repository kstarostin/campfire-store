import { CategoryBand } from '@/components/catalog/CategoryBand'
import { CategoryBandsSkeleton } from '@/components/catalog/CategoryBandsSkeleton'
import { Container } from '@/components/layout/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTranslation } from '@/i18n'
import { useCategories } from '@/hooks/useCategories'

export function CategoriesPage() {
  const { t } = useTranslation()
  usePageTitle('documentTitle.categories')
  const categories = useCategories()

  return (
    <section className="catalog-page section--categories">
      <Container>
        <header className="catalog-page-header categories-intro">
          <h1>{t('pages.categoriesTitle')}</h1>
          <p>{t('pages.categoriesLead')}</p>
        </header>

        {categories.isLoading ? <CategoryBandsSkeleton count={3} /> : null}

        {categories.isError ? (
          <ErrorState
            message={t('home.categoriesError')}
            onRetry={() => categories.refetch()}
          />
        ) : null}

        {categories.data ? (
          <div className="category-bands-stack">
            {categories.data.map((category, index) => (
              <CategoryBand key={category._id} category={category} flip={index % 2 === 1} />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
