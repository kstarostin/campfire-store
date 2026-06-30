import type { Currency } from '@/api/types'
import type { CartLine } from '@/lib/cart'
import { useFormatLocale, useTranslation } from '@/i18n'
import { formatAmount, lineTotal } from '@/lib/cart'
import { productImageUrl } from '@/lib/imageUrl'

interface CheckoutOrderReviewProps {
  lines: CartLine[]
  currency: Currency
}

export function CheckoutOrderReview({ lines, currency }: CheckoutOrderReviewProps) {
  const { t } = useTranslation()
  const formatLocale = useFormatLocale()

  return (
    <div className="checkout-items">
      {lines.map((line) => {
        const imageSrc = productImageUrl(line.product, 'small')
        const total = lineTotal(line.entry, line.product, currency)

        return (
          <article key={line.entry._id} className="checkout-item">
            <div className="checkout-item__media">
              {imageSrc ? (
                <img src={imageSrc} alt="" width={56} height={56} />
              ) : (
                <span className="checkout-item__media-placeholder" aria-hidden />
              )}
            </div>
            <div>
              {line.product.manufacturer ? (
                <p className="checkout-item__meta">{line.product.manufacturer}</p>
              ) : null}
              <p className="checkout-item__title">{line.product.name}</p>
              <p className="checkout-item__qty">
                {t('checkout.quantity', { count: line.entry.quantity })}
              </p>
            </div>
            <p className="checkout-item__price">
              {formatAmount(total, currency, formatLocale)}
            </p>
          </article>
        )
      })}
    </div>
  )
}
