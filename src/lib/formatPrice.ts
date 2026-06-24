import type { Currency, I18nPrice } from '@/api/types'

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
}

export function formatPrice(
  priceI18n: I18nPrice | undefined,
  currency: Currency,
  locale = 'en-US',
): string {
  const amount = priceI18n?.[currency]
  if (amount === undefined || amount === null) {
    return '—'
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    const symbol = currencySymbols[currency] ?? currency
    return `${symbol}${amount.toFixed(2)}`
  }
}
