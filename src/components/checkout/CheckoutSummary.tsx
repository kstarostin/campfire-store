import type { Currency } from '@/api/types'
import { Button } from '@/components/ui/Button'
import { useFormatLocale, useTranslation } from '@/i18n'
import { formatAmount } from '@/lib/cart'

interface CheckoutSummaryProps {
  itemCount: number
  subtotal: number
  vat: number
  total: number
  currency: Currency
  canPlaceOrder: boolean
  isPlacingOrder: boolean
  onPlaceOrder: () => void
}

export function CheckoutSummary({
  itemCount,
  subtotal,
  vat,
  total,
  currency,
  canPlaceOrder,
  isPlacingOrder,
  onPlaceOrder,
}: CheckoutSummaryProps) {
  const { t } = useTranslation()
  const formatLocale = useFormatLocale()

  return (
    <aside className="checkout-summary" aria-labelledby="checkout-summary-heading">
      <h2 id="checkout-summary-heading">{t('checkout.orderSummary')}</h2>
      <div className="checkout-summary__rows">
        <div className="checkout-summary__row">
          <span>{t('cart.itemsCount', { count: itemCount })}</span>
        </div>
        <div className="checkout-summary__row">
          <span>{t('cart.subtotal')}</span>
          <span>{formatAmount(subtotal, currency, formatLocale)}</span>
        </div>
        <div className="checkout-summary__row">
          <span>{t('cart.vat')}</span>
          <span>{formatAmount(vat, currency, formatLocale)}</span>
        </div>
        <div className="checkout-summary__row checkout-summary__row--total">
          <span>{t('cart.total')}</span>
          <span>{formatAmount(total, currency, formatLocale)}</span>
        </div>
      </div>
      <div className="checkout-summary__actions">
        <Button
          type="button"
          className="checkout-summary__place"
          disabled={!canPlaceOrder || isPlacingOrder}
          onClick={onPlaceOrder}
        >
          {isPlacingOrder ? t('checkout.placingOrder') : t('checkout.placeOrder')}
        </Button>
        <Button to="/cart" variant="secondary" className="checkout-summary__back">
          {t('checkout.backToCart')}
        </Button>
      </div>
    </aside>
  )
}
