import type { Cart, CartEntry, Currency, Product } from '@/api/types'

export interface CartLine {
  entry: CartEntry
  product: Product
}

export function getEntryProductId(product: string | Product): string {
  return typeof product === 'string' ? product : product._id
}

export function cartItemCount(entries: CartEntry[] | undefined): number {
  return (entries ?? []).reduce((total, entry) => total + entry.quantity, 0)
}

export function unitPrice(
  product: Product,
  currency: Currency,
  entry?: CartEntry,
): number {
  const fromProduct = product.priceI18n?.[currency]
  if (fromProduct != null) return fromProduct

  if (entry && entry.quantity > 0) {
    return entry.price / entry.quantity
  }

  return entry?.price ?? 0
}

export function lineTotal(
  entry: CartEntry,
  product: Product,
  currency: Currency,
): number {
  return unitPrice(product, currency, entry) * entry.quantity
}

export function cartLinesSubtotal(lines: CartLine[], currency: Currency): number {
  return lines.reduce((total, line) => total + lineTotal(line.entry, line.product, currency), 0)
}

export function cartVat(cart: Pick<Cart, 'vat' | 'tax'>): number {
  return cart.vat ?? cart.tax ?? 0
}

export function cartOrderTotal(subtotal: number, vat: number): number {
  return subtotal + vat
}

export function formatAmount(
  amount: number,
  currency: Currency,
  locale = 'en-US',
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}
