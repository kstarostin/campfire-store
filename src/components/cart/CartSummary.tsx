import type { Currency } from '@/api/types'
import { Button } from '@/components/ui/Button'
import { useFormatLocale, useTranslation } from '@/i18n'
import { formatAmount } from '@/lib/cart'

interface CartSummaryProps {
  itemCount: number
  subtotal: number
  vat: number
  total: number
  currency: Currency
}

export function CartSummary({
  itemCount,
  subtotal,
  vat,
  total,
  currency,
}: CartSummaryProps) {
  const { t } = useTranslation()
  const formatLocale = useFormatLocale()

  return (
    <aside className="cart-summary" aria-labelledby="cart-summary-heading">
      <h2 id="cart-summary-heading">{t('cart.orderSummary')}</h2>
      <div className="cart-summary__rows">
        <div className="cart-summary__row">
          <span>{t('cart.itemsCount', { count: itemCount })}</span>
        </div>
        <div className="cart-summary__row">
          <span>{t('cart.subtotal')}</span>
          <span>{formatAmount(subtotal, currency, formatLocale)}</span>
        </div>
        <div className="cart-summary__row">
          <span>{t('cart.vat')}</span>
          <span>{formatAmount(vat, currency, formatLocale)}</span>
        </div>
        <div className="cart-summary__row cart-summary__row--total">
          <span>{t('cart.total')}</span>
          <span>{formatAmount(total, currency, formatLocale)}</span>
        </div>
      </div>
      <div className="cart-summary__actions">
        <Button to="/checkout" className="cart-summary__checkout">
          {t('cart.proceedToCheckout')}
        </Button>
        <Button to="/products" variant="secondary" className="cart-summary__continue">
          {t('cart.continueShopping')}
        </Button>
      </div>
    </aside>
  )
}
