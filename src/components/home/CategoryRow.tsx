import { LocaleLink } from '@/components/ui/LocaleLink'
import { Container } from '@/components/layout/Container'
import { SectionHead } from '@/components/ui/SectionHead'
import { CategoryRowSkeleton } from '@/components/catalog/CategoryRowSkeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { useTranslation } from '@/i18n'
import { useCategories } from '@/hooks/useCategories'
import { getCategoryIcon } from '@/lib/categoryIcons'
import { categoryPath } from '@/lib/categoryPath'

export function CategoryRow() {
  const { t } = useTranslation()
  const categories = useCategories()

  return (
    <section className="section section--categories">
      <Container>
        <SectionHead
          title={t('home.shopByCategory')}
          description={t('home.shopByCategoryDescription')}
          action={{ label: t('home.viewAll'), to: '/categories', className: 'link-view-all' }}
        />

        {categories.isLoading ? <CategoryRowSkeleton /> : null}

        {categories.isError ? (
          <ErrorState
            message={t('home.categoriesError')}
            onRetry={() => categories.refetch()}
          />
        ) : null}

        {categories.data ? (
          <div className="category-row">
            {categories.data.map((category) => {
              const Icon = getCategoryIcon(category.icon)
              const subCount = category.subCategories?.length ?? 0
              const meta =
                subCount > 0
                  ? subCount === 1
                    ? t('home.oneSubcategory')
                    : t('home.nSubcategories', { count: subCount })
                  : t('common.shopNow')

              return (
                <LocaleLink
                  key={category._id}
                  to={categoryPath(category)}
                  className="category-card text-inherit"
                >
                  <span className="category-icon category-icon--forest">
                    <Icon size={18} aria-hidden />
                  </span>
                  <strong>{category.name}</strong>
                  <span>{meta}</span>
                </LocaleLink>
              )
            })}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
