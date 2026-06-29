import { ExternalLink, Heart, Minus, Plus } from 'lucide-react'
import { forwardRef, type CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import type { Currency, Product } from '@/api/types'
import { ProductBadges } from '@/components/product/ProductBadges'
import { Price } from '@/components/product/Price'
import { Button } from '@/components/ui/Button'
import { useAddToCart } from '@/hooks/useCart'
import { useLocaleNavigate } from '@/hooks/useLocaleNavigate'
import { useTranslation } from '@/i18n'
import { localizedText } from '@/lib/localizedText'
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
  const isAuthenticated = useIsAuthenticated()
  const addToCart = useAddToCart()
  const tagline = localizedText(product.taglineI18n, language)

  const clampQuantity = (value: number) => Math.min(99, Math.max(1, value))

  const handleProtectedAction = (phase: 'cart' | 'wishlist') => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    if (phase === 'wishlist') {
      navigate('/account?panel=wishlist')
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    addToCart.mutate(
      { productId: product._id, quantity },
      { onSuccess: () => navigate('/cart') },
    )
  }

  return (
    <aside ref={ref} className={`pdp-buy ${className}`.trim()} style={style}>
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
      <Price priceI18n={product.priceI18n} currency={currency} className="pdp-product-price" />

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
            className="pdp-wishlist-btn"
            aria-label={t('product.addToWishlist')}
            onClick={() => handleProtectedAction('wishlist')}
          >
            <Heart size={20} aria-hidden />
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
          {t('product.viewOnManufacturer', { manufacturer: product.manufacturer ?? '' })}
          <ExternalLink size={14} aria-hidden />
        </a>
      ) : null}
    </aside>
  )
},
)
