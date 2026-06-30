import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { CatalogBreadcrumb } from '@/components/catalog/CatalogPageHeader'
import { ProductCatalogView } from '@/components/catalog/ProductCatalogView'
import { Container } from '@/components/layout/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useCategory, useCategoryAncestors } from '@/hooks/useCategory'
import { useLocaleNavigate } from '@/hooks/useLocaleNavigate'
import { formatPageTitle, usePageMeta, usePageTitle } from '@/hooks/usePageTitle'
import { useTranslation } from '@/i18n'
import { categoryPath } from '@/lib/categoryPath'
import { truncateMetaDescription } from '@/lib/pageMeta'

export function CategoryDetailPage() {
  const { t, language } = useTranslation()
  const { categoryCode } = useParams()
  const location = useLocation()
  const navigate = useLocaleNavigate()
  const category = useCategory(categoryCode)
  const ancestors = useCategoryAncestors(categoryCode)

  const categoryName = category.data?.name ?? t('pages.category')

  usePageTitle('documentTitle.category', {
    name: categoryName,
  })

  usePageMeta(
    category.data
      ? {
          title: formatPageTitle(language, category.data.name),
          description: truncateMetaDescription(
            t('meta.categoryDescription', { name: category.data.name }),
          ),
        }
      : undefined,
  )

  useEffect(() => {
    if (!category.data?.code || !categoryCode) return
    if (categoryCode === category.data.code) return

    navigate(`${categoryPath(category.data)}${location.search}`, { replace: true })
  }, [category.data, categoryCode, location.search, navigate])

  if (category.isLoading) {
    return (
      <Container className="py-10">
        <LoadingState label={t('catalog.categoryLoading')} />
      </Container>
    )
  }

  if (category.isError || !category.data) {
    return (
      <Container className="py-10">
        <ErrorState
          message={t('catalog.categoryError')}
          onRetry={() => category.refetch()}
        />
      </Container>
    )
  }

  const breadcrumbItems = [
    ...ancestors.map((ancestor) => ({
      label: ancestor.name,
      to: categoryPath(ancestor),
    })),
    { label: category.data.name },
  ]

  return (
    <ProductCatalogView
      variant="category"
      categoryCode={category.data.code ?? categoryCode!}
      title={category.data.name}
      breadcrumb={<CatalogBreadcrumb items={breadcrumbItems} />}
      subcategories={category.data.subCategories}
    />
  )
}
