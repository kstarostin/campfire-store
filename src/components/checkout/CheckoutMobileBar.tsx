import type { Currency } from '@/api/types'
import { Button } from '@/components/ui/Button'
import { useFormatLocale, useTranslation } from '@/i18n'
import { formatAmount } from '@/lib/cart'

interface CheckoutMobileBarProps {
  total: number
  currency: Currency
  canPlaceOrder: boolean
  isPlacingOrder: boolean
  onPlaceOrder: () => void
}

export function CheckoutMobileBar({
  total,
  currency,
  canPlaceOrder,
  isPlacingOrder,
  onPlaceOrder,
}: CheckoutMobileBarProps) {
  const { t } = useTranslation()
  const formatLocale = useFormatLocale()

  return (
    <div className="checkout-mobile-bar">
      <span className="checkout-mobile-bar__total">
        {formatAmount(total, currency, formatLocale)}
      </span>
      <Button
        type="button"
        disabled={!canPlaceOrder || isPlacingOrder}
        onClick={onPlaceOrder}
      >
        {isPlacingOrder ? t('checkout.placingOrder') : t('checkout.placeOrder')}
      </Button>
    </div>
  )
}
