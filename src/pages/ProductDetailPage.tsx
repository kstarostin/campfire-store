import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ProductDetailView } from '@/components/product/detail/ProductDetailView'
import { Container } from '@/components/layout/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useCategoryAncestors } from '@/hooks/useCategory'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useProduct, useRelatedProducts } from '@/hooks/useProduct'
import { useTranslation } from '@/i18n'

export function ProductDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const product = useProduct(id)

  usePageTitle('documentTitle.product', {
    name: product.data?.name ?? t('pages.productDetail'),
  })

  const categoryCode = useMemo(() => {
    const category = product.data?.category
    if (!category || typeof category === 'string') return undefined
    return category.code
  }, [product.data?.category])

  const ancestors = useCategoryAncestors(categoryCode)
  const related = useRelatedProducts(id, categoryCode)

  if (product.isLoading) {
    return (
      <Container className="py-10">
        <LoadingState label={t('product.loading')} />
      </Container>
    )
  }

  if (product.isError || !product.data) {
    return (
      <Container className="py-10">
        <ErrorState message={t('product.error')} onRetry={() => product.refetch()} />
      </Container>
    )
  }

  return (
    <ProductDetailView
      product={product.data}
      relatedProducts={related.data ?? []}
      relatedIsLoading={related.isLoading}
      relatedIsError={related.isError}
      onRelatedRetry={() => related.refetch()}
      ancestors={ancestors}
    />
  )
}
