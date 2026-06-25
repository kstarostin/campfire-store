import { LocaleLink } from '@/components/ui/LocaleLink'
import type { Currency, Product } from '@/api/types'
import { ProductBadges } from '@/components/product/ProductBadges'
import { ProductCardMedia } from '@/components/product/ProductCardMedia'
import { Price } from '@/components/product/Price'

interface ProductCardProps {
  product: Product
  currency: Currency
}

export function ProductCard({ product, currency }: ProductCardProps) {
  return (
    <article className="product-card">
      <LocaleLink to={`/products/${product._id}`} className="block text-inherit">
        <div className="product-media">
          <ProductCardMedia product={product} />
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
