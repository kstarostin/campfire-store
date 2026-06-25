import { Container } from '@/components/layout/Container'
import { LocaleLink } from '@/components/ui/LocaleLink'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useTranslation } from '@/i18n'
import { useCategories } from '@/hooks/useCategories'
import { getCategoryIcon } from '@/lib/categoryIcons'
import { categoryPath } from '@/lib/categoryPath'

export function CategoriesPage() {
  const { t } = useTranslation()
  const categories = useCategories()

  return (
    <section className="catalog-page section--categories">
      <Container>
        <header className="catalog-page-header">
          <h1>{t('pages.allCategories')}</h1>
          <p>{t('catalog.allCategoriesDescription')}</p>
        </header>

        {categories.isLoading ? (
          <LoadingState label={t('home.categoriesLoading')} />
        ) : null}

        {categories.isError ? (
          <ErrorState
            message={t('home.categoriesError')}
            onRetry={() => categories.refetch()}
          />
        ) : null}

        {categories.data ? (
          <div className="catalog-categories">
            {categories.data.map((category) => {
              const subcategories = category.subCategories ?? []

              if (subcategories.length === 0) return null

              return (
                <section key={category._id} className="catalog-category-group">
                  <div className="catalog-category-group__head">
                    <h2>
                      <LocaleLink to={categoryPath(category)}>{category.name}</LocaleLink>
                    </h2>
                    <p>
                      {subcategories.length === 1
                        ? t('home.oneSubcategory')
                        : t('home.nSubcategories', { count: subcategories.length })}
                    </p>
                  </div>

                  <div className="catalog-category-grid">
                    {subcategories.map((subcategory) => {
                      const SubIcon = getCategoryIcon(subcategory.icon)

                      return (
                        <LocaleLink
                          key={subcategory._id}
                          to={categoryPath(subcategory)}
                          className="category-card text-inherit"
                        >
                          <span className="category-icon category-icon--forest">
                            <SubIcon size={18} aria-hidden />
                          </span>
                          <strong>{subcategory.name}</strong>
                          <span>{t('common.shopNow')}</span>
                        </LocaleLink>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
