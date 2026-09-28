import { Heart, Minus, Plus } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import type { Currency, Product } from '@/api/types'
import { Price } from '@/components/product/Price'
import { Button } from '@/components/ui/Button'
import { useAddToCart } from '@/hooks/useCart'
import { useLoginRedirect } from '@/hooks/useLoginRedirect'
import { useLocaleNavigate } from '@/hooks/useLocaleNavigate'
import { useIsInWishlist, useToggleWishlist } from '@/hooks/useWishlist'
import { useTranslation } from '@/i18n'
import { clampQuantity } from '@/lib/quantity'
import { useIsAuthenticated } from '@/store/authStore'

interface ProductMobileBuyBarProps {
  product: Product
  currency: Currency
  quantity: number
  onQuantityChange: (quantity: number) => void
}

export function ProductMobileBuyBar({
  product,
  currency,
  quantity,
  onQuantityChange,
}: ProductMobileBuyBarProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useLocaleNavigate()
  const redirectToLogin = useLoginRedirect()
  const isAuthenticated = useIsAuthenticated()
  const addToCart = useAddToCart()
  const toggleWishlist = useToggleWishlist()
  const isInWishlist = useIsInWishlist(product._id)

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

  return (
    <div className="pdp-mobile-buy-bar" aria-label={t('product.quickPurchase')}>
      <Price priceI18n={product.priceI18n} currency={currency} />

      <div className="pdp-mobile-buy-bar__controls">
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
            isInWishlist ? t('product.removeFromWishlist') : t('product.addToWishlist')
          }
          aria-pressed={isInWishlist}
          disabled={toggleWishlist.isPending}
          onClick={handleWishlistToggle}
        >
          <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} aria-hidden />
        </button>
      </div>

      <Button type="button" disabled={addToCart.isPending} onClick={handleAddToCart}>
        {t('product.addToCart')}
      </Button>
    </div>
  )
}
