import { CategoryCardGrid } from '@/components/catalog/CategoryCardGrid'
import { CategoryCardSkeleton } from '@/components/catalog/CategoryCardSkeleton'
import { CategoryToggle } from '@/components/catalog/CategoryToggle'
import { Container } from '@/components/layout/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { SectionHead } from '@/components/ui/SectionHead'
import { useCategories } from '@/hooks/useCategories'
import { useCollapsibleCategories } from '@/hooks/useCollapsibleCategories'
import { useTranslation } from '@/i18n'

/**
 * The categories landing page was folded into the home page; this is that
 * section. `id="categories"` is the anchor the header menu and hero link to,
 * and the /categories route redirects here.
 */
export function CategoryShowcase() {
  const { t } = useTranslation()
  const categories = useCategories()
  const list = useCollapsibleCategories(categories.data ?? [])

  return (
    <section className="section section--categories" id="categories">
      <Container>
        <SectionHead
          title={t('home.shopByCategory')}
          description={t('home.shopByCategoryDescription')}
        >
          <CategoryToggle list={list} />
        </SectionHead>

        {categories.isError ? (
          <ErrorState
            message={t('home.categoriesError')}
            onRetry={() => categories.refetch()}
          />
        ) : categories.data ? (
          <CategoryCardGrid list={list} />
        ) : (
          <div className="category-grid">
            {Array.from({ length: 3 }, (_, index) => (
              <CategoryCardSkeleton key={index} />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
