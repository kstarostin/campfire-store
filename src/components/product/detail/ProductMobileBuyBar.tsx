import { useLocation } from 'react-router-dom'
import type { Currency, Product } from '@/api/types'
import { Price } from '@/components/product/Price'
import { Button } from '@/components/ui/Button'
import { useAddToCart } from '@/hooks/useCart'
import { useLocaleNavigate } from '@/hooks/useLocaleNavigate'
import { useTranslation } from '@/i18n'
import { useIsAuthenticated } from '@/store/authStore'

interface ProductMobileBuyBarProps {
  product: Product
  currency: Currency
}

export function ProductMobileBuyBar({ product, currency }: ProductMobileBuyBarProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useLocaleNavigate()
  const isAuthenticated = useIsAuthenticated()
  const addToCart = useAddToCart()

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    addToCart.mutate(
      { productId: product._id, quantity: 1 },
      { onSuccess: () => navigate('/cart') },
    )
  }

  return (
    <div className="pdp-mobile-buy-bar" aria-label={t('product.quickPurchase')}>
      <Price priceI18n={product.priceI18n} currency={currency} />
      <Button type="button" disabled={addToCart.isPending} onClick={handleAddToCart}>
        {t('product.addToCart')}
      </Button>
    </div>
  )
}
