import type { Currency } from '@/api/types'
import { Button } from '@/components/ui/Button'
import { useFormatLocale, useTranslation } from '@/i18n'
import { formatAmount } from '@/lib/cart'

interface CartMobileBarProps {
  total: number
  currency: Currency
}

export function CartMobileBar({ total, currency }: CartMobileBarProps) {
  const { t } = useTranslation()
  const formatLocale = useFormatLocale()

  return (
    <div className="cart-mobile-bar">
      <span className="cart-mobile-bar__total">
        {formatAmount(total, currency, formatLocale)}
      </span>
      <Button to="/checkout" className="cart-mobile-bar__checkout">
        {t('cart.checkout')}
      </Button>
    </div>
  )
}
