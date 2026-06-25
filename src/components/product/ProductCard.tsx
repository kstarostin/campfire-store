import { LocaleLink } from '@/components/ui/LocaleLink'
import type { Currency, Product } from '@/api/types'
import { ProductBadges } from '@/components/product/ProductBadges'
import { Price } from '@/components/product/Price'
import { useTranslation } from '@/i18n'
import { productImageUrl } from '@/lib/imageUrl'

interface ProductCardProps {
  product: Product
  currency: Currency
}

export function ProductCard({ product, currency }: ProductCardProps) {
  const { t } = useTranslation()
  const imageSrc = productImageUrl(product)

  return (
    <article className="product-card">
      <LocaleLink to={`/products/${product._id}`} className="block text-inherit">
        <div className="product-media">
          {imageSrc ? (
            <img src={imageSrc} alt={product.name} loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-text-muted">
              {t('common.noImage')}
            </div>
          )}
        </div>
        <div className="product-body">
          <div className="product-meta">
            <span>{product.manufacturer ?? '—'}</span>
            <ProductBadges badges={product.badges} />
          </div>
          <h3>{product.name}</h3>
          <Price priceI18n={product.priceI18n} currency={currency} />
        </div>
      </LocaleLink>
    </article>
  )
}
