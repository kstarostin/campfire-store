import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ProductDetailView } from '@/components/product/detail/ProductDetailView'
import { Container } from '@/components/layout/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useCategoryAncestors } from '@/hooks/useCategory'
import { formatPageTitle, usePageMeta, usePageTitle } from '@/hooks/usePageTitle'
import { useProduct, useRelatedProducts } from '@/hooks/useProduct'
import { useTranslation } from '@/i18n'
import { productImageUrl } from '@/lib/imageUrl'
import { localizedText } from '@/lib/localizedText'
import { truncateMetaDescription } from '@/lib/pageMeta'

export function ProductDetailPage() {
  const { t, language } = useTranslation()
  const { id } = useParams()
  const product = useProduct(id)

  const productName = product.data?.name ?? t('pages.productDetail')

  usePageTitle('documentTitle.product', { name: productName })

  const pageMeta = useMemo(() => {
    if (!product.data) return undefined

    const description =
      localizedText(product.data.descriptionI18n, language) ??
      localizedText(product.data.taglineI18n, language) ??
      t('meta.productFallbackDescription', { name: product.data.name })

    const image = productImageUrl(product.data, 'medium')

    return {
      title: formatPageTitle(language, product.data.name),
      description: truncateMetaDescription(description),
      image: image || undefined,
      type: 'product' as const,
    }
  }, [language, product.data, t])

  usePageMeta(pageMeta)

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
