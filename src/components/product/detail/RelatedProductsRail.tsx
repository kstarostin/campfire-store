import type { Currency, Product } from '@/api/types'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { useTranslation } from '@/i18n'

interface RelatedProductsRailProps {
  products: Product[]
  currency: Currency
  categoryName?: string
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function RelatedProductsRail({
  products,
  currency,
  categoryName,
  isLoading = false,
  isError = false,
  onRetry,
}: RelatedProductsRailProps) {
  const { t } = useTranslation()

  if (!isLoading && !isError && products.length === 0) return null

  const heading = categoryName
    ? t('product.moreCategory', { category: categoryName.toLowerCase() })
    : t('product.alsoOnTheTrail')

  return (
    <section className="pdp-related-rail" aria-labelledby="pdp-related-heading">
      <h2 id="pdp-related-heading">{heading}</h2>

      {isLoading ? (
        <div className="pdp-related-scroll" aria-busy="true" aria-label={t('common.loading')}>
          {Array.from({ length: 4 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {isError ? (
        <ErrorState message={t('product.relatedError')} onRetry={onRetry} />
      ) : null}

      {!isLoading && !isError && products.length > 0 ? (
        <div className="pdp-related-scroll">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} currency={currency} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
