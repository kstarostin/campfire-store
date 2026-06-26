import type { Currency, Product } from '@/api/types'
import { ProductCard } from '@/components/product/ProductCard'
import { useTranslation } from '@/i18n'

interface RelatedProductsRailProps {
  products: Product[]
  currency: Currency
  categoryName?: string
}

export function RelatedProductsRail({
  products,
  currency,
  categoryName,
}: RelatedProductsRailProps) {
  const { t } = useTranslation()

  if (!products.length) return null

  const heading = categoryName
    ? t('product.moreCategory', { category: categoryName.toLowerCase() })
    : t('product.alsoOnTheTrail')

  return (
    <section className="pdp-related-rail" aria-labelledby="pdp-related-heading">
      <h2 id="pdp-related-heading">{heading}</h2>
      <div className="pdp-related-scroll">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} currency={currency} />
        ))}
      </div>
    </section>
  )
}
