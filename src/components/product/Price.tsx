import { useFormatLocale } from '@/i18n'
import type { Currency, I18nPrice } from '@/api/types'
import { formatPrice } from '@/lib/formatPrice'

interface PriceProps {
  priceI18n?: I18nPrice
  currency: Currency
  className?: string
}

export function Price({ priceI18n, currency, className = '' }: PriceProps) {
  const formatLocale = useFormatLocale()

  return (
    <p className={`product-price m-0 ${className}`.trim()}>
      {formatPrice(priceI18n, currency, formatLocale)}
    </p>
  )
}
