import { LocaleLink } from '@/components/ui/LocaleLink'
import type { Currency, Product } from '@/api/types'
import { ProductBadges } from '@/components/product/ProductBadges'
import { ProductCardMedia } from '@/components/product/ProductCardMedia'
import { ProductCardQuickActions } from '@/components/product/ProductCardQuickActions'
import { Price } from '@/components/product/Price'

interface ProductCardProps {
  product: Product
  currency: Currency
  /**
   * Quick actions are dropped where the card is a way back to a product
   * rather than a place to buy it, as in the recently viewed rail.
   */
  showActions?: boolean
}

export function ProductCard({
  product,
  currency,
  showActions = true,
}: ProductCardProps) {
  const productPath = `/products/${product._id}`

  return (
    <article className="product-card">
      <LocaleLink to={productPath} className="product-card__link text-inherit">
        <div className="product-media">
          <ProductCardMedia product={product} />
        </div>
        <div className="product-body">
          <div className="product-meta">
            <span>{product.manufacturer ?? '—'}</span>
            <ProductBadges badges={product.badges} />
          </div>
          <h3 className="product-card__title">{product.name}</h3>
        </div>
      </LocaleLink>
      <div className="product-card__footer">
        <Price
          priceI18n={product.priceI18n}
          currency={currency}
          className="product-card__price"
        />
        {showActions ? <ProductCardQuickActions product={product} /> : null}
      </div>
    </article>
  )
}
