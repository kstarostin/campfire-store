import { Heart, ShoppingCart } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import type { Product } from '@/api/types'
import { useAddToCart } from '@/hooks/useCart'
import { useLoginRedirect } from '@/hooks/useLoginRedirect'
import { useIsInWishlist, useToggleWishlist } from '@/hooks/useWishlist'
import { useTranslation } from '@/i18n'
import { useIsAuthenticated } from '@/store/authStore'

interface ProductCardQuickActionsProps {
  product: Product
}

export function ProductCardQuickActions({ product }: ProductCardQuickActionsProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const redirectToLogin = useLoginRedirect()
  const isAuthenticated = useIsAuthenticated()
  const addToCart = useAddToCart()
  const toggleWishlist = useToggleWishlist()
  const isInWishlist = useIsInWishlist(product._id)

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      redirectToLogin(location.pathname + location.search)
      return
    }

    addToCart.mutate({ productId: product._id, quantity: 1 })
  }

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      redirectToLogin(location.pathname + location.search)
      return
    }

    toggleWishlist.mutate(product._id)
  }

  return (
    <div className="product-card-quick-actions">
      <button
        type="button"
        className={`product-card-quick-actions__btn${isInWishlist ? ' is-active' : ''}`}
        aria-label={
          isInWishlist ? t('product.removeFromWishlist') : t('product.addToWishlist')
        }
        aria-pressed={isInWishlist}
        disabled={toggleWishlist.isPending}
        onClick={handleWishlistToggle}
      >
        <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} aria-hidden />
      </button>
      <button
        type="button"
        className="product-card-quick-actions__btn"
        aria-label={t('product.addToCart')}
        disabled={addToCart.isPending}
        onClick={handleAddToCart}
      >
        <ShoppingCart size={16} aria-hidden />
      </button>
    </div>
  )
}
