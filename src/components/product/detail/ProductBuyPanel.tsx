import { ExternalLink, Flame, Heart, Minus, Plus } from 'lucide-react'
import { forwardRef, type CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import type { Currency, Product } from '@/api/types'
import { ProductBadges } from '@/components/product/ProductBadges'
import { Price } from '@/components/product/Price'
import { Button } from '@/components/ui/Button'
import { useAddToCart } from '@/hooks/useCart'
import { useLoginRedirect } from '@/hooks/useLoginRedirect'
import { useIsInWishlist, useToggleWishlist } from '@/hooks/useWishlist'
import { useLocaleNavigate } from '@/hooks/useLocaleNavigate'
import { useTranslation } from '@/i18n'
import { localizedText } from '@/lib/localizedText'
import { productHighlightIcon, productHighlightLabelKey } from '@/lib/productHighlights'
import { clampQuantity } from '@/lib/quantity'
import { useIsAuthenticated } from '@/store/authStore'

interface ProductBuyPanelProps {
  product: Product
  currency: Currency
  quantity: number
  onQuantityChange: (quantity: number) => void
  className?: string
  style?: CSSProperties
}

export const ProductBuyPanel = forwardRef<HTMLElement, ProductBuyPanelProps>(
  function ProductBuyPanel(
    { product, currency, quantity, onQuantityChange, className = '', style },
    ref,
  ) {
    const { t, language } = useTranslation()
    const location = useLocation()
    const navigate = useLocaleNavigate()
    const redirectToLogin = useLoginRedirect()
    const isAuthenticated = useIsAuthenticated()
    const addToCart = useAddToCart()
    const toggleWishlist = useToggleWishlist()
    const isInWishlist = useIsInWishlist(product._id)
    const tagline = localizedText(product.taglineI18n, language)

    const handleWishlistToggle = () => {
      if (!isAuthenticated) {
        redirectToLogin(location.pathname + location.search)
        return
      }

      toggleWishlist.mutate(product._id)
    }

    const handleAddToCart = () => {
      if (!isAuthenticated) {
        redirectToLogin(location.pathname + location.search)
        return
      }

      addToCart.mutate(
        { productId: product._id, quantity },
        { onSuccess: () => navigate('/cart') },
      )
    }

    const highlights = (product.highlights ?? []).filter((highlight) =>
      Boolean(localizedText(highlight.valueI18n, language)),
    )

    return (
      <aside ref={ref} className={`pdp-buy ${className}`.trim()} style={style}>
        <div className="pdp-buy__content">
          {product.manufacturer ? (
            <p className="pdp-product-eyebrow">{product.manufacturer}</p>
          ) : null}
          <h1 className="pdp-product-title">{product.name}</h1>
          {tagline ? <p className="pdp-product-tagline">{tagline}</p> : null}
          {product.badges?.length ? (
            <div className="pdp-product-badges">
              <ProductBadges badges={product.badges} />
            </div>
          ) : null}
          {highlights.length || product.isFeatured ? (
            <div className="pdp-keys">
              {highlights.map((highlight) => {
                const Icon = productHighlightIcon(highlight.code)

                return (
                  <div key={highlight.code} className="pdp-key">
                    <div className="pdp-key__title">
                      <Icon className="pdp-key__icon" aria-hidden />
                      <span>{t(productHighlightLabelKey(highlight.code))}</span>
                    </div>
                    <p className="pdp-key__value">
                      {localizedText(highlight.valueI18n, language)}
                    </p>
                  </div>
                )
              })}

              {product.isFeatured ? (
                <div className="pdp-key">
                  <div className="pdp-key__title">
                    <Flame className="pdp-key__icon" aria-hidden />
                    <span>{t('product.featured')}</span>
                  </div>
                  <p className="pdp-key__value">{t('product.campfirePick')}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          <Price
            priceI18n={product.priceI18n}
            currency={currency}
            className="pdp-product-price"
          />

          <div className="pdp-buy-actions">
            <div className="pdp-buy-actions__row">
              <div className="pdp-qty-stepper" aria-label={t('product.quantity')}>
                <button
                  type="button"
                  aria-label={t('product.decreaseQuantity')}
                  onClick={() => onQuantityChange(clampQuantity(quantity - 1))}
                >
                  <Minus size={16} aria-hidden />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={quantity}
                  readOnly
                  aria-label={t('product.quantity')}
                />
                <button
                  type="button"
                  aria-label={t('product.increaseQuantity')}
                  onClick={() => onQuantityChange(clampQuantity(quantity + 1))}
                >
                  <Plus size={16} aria-hidden />
                </button>
              </div>

              <button
                type="button"
                className={`pdp-wishlist-btn${isInWishlist ? ' is-active' : ''}`}
                aria-label={
                  isInWishlist
                    ? t('product.removeFromWishlist')
                    : t('product.addToWishlist')
                }
                aria-pressed={isInWishlist}
                disabled={toggleWishlist.isPending}
                onClick={handleWishlistToggle}
              >
                <Heart
                  size={20}
                  fill={isInWishlist ? 'currentColor' : 'none'}
                  aria-hidden
                />
              </button>
            </div>

            <Button
              type="button"
              className="pdp-buy-actions__cart"
              disabled={addToCart.isPending}
              onClick={handleAddToCart}
            >
              {t('product.addToCart')}
            </Button>
          </div>

          {product.manufacturerUrl ? (
            <a
              className="pdp-manufacturer-link"
              href={product.manufacturerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('product.viewOnManufacturer', {
                manufacturer: product.manufacturer ?? '',
              })}
              <ExternalLink size={14} aria-hidden />
            </a>
          ) : null}
        </div>
      </aside>
    )
  },
)
