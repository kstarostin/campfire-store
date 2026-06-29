import { Trash2 } from 'lucide-react'
import type { Currency } from '@/api/types'
import { QuantityStepper } from '@/components/cart/QuantityStepper'
import { LocaleLink } from '@/components/ui/LocaleLink'
import type { CartLine } from '@/lib/cart'
import { useFormatLocale, useTranslation } from '@/i18n'
import { formatAmount, lineTotal, unitPrice } from '@/lib/cart'
import { productImageUrl } from '@/lib/imageUrl'

interface CartLineItemProps {
  line: CartLine
  currency: Currency
  onQuantityChange: (entryId: string, quantity: number) => void
  onRemove: (entryId: string) => void
  isUpdating?: boolean
}

export function CartLineItem({
  line,
  currency,
  onQuantityChange,
  onRemove,
  isUpdating = false,
}: CartLineItemProps) {
  const { t } = useTranslation()
  const formatLocale = useFormatLocale()
  const { entry, product } = line
  const imageSrc = productImageUrl(product, 'small')

  return (
    <article className="cart-line">
      <LocaleLink
        to={`/products/${product._id}`}
        className="cart-line__media"
        aria-hidden
        tabIndex={-1}
      >
        {imageSrc ? (
          <img src={imageSrc} alt="" width={104} height={104} />
        ) : (
          <span className="cart-line__media-placeholder" aria-hidden />
        )}
      </LocaleLink>

      <div className="cart-line__body">
        <div className="cart-line__top">
          <div>
            {product.manufacturer ? (
              <p className="cart-line__meta">{product.manufacturer}</p>
            ) : null}
            <h2 className="cart-line__title">
              <LocaleLink to={`/products/${product._id}`}>{product.name}</LocaleLink>
            </h2>
          </div>
          <button
            type="button"
            className="cart-line__remove"
            aria-label={t('cart.removeItem', { name: product.name })}
            disabled={isUpdating}
            onClick={() => onRemove(entry._id)}
          >
            <Trash2 size={18} aria-hidden />
          </button>
        </div>

        <div className="cart-line__footer">
          <div>
            <p className="cart-line__unit-price">
              {t('cart.unitPriceEach', {
                price: formatAmount(unitPrice(product, currency, entry), currency, formatLocale),
              })}
            </p>
            <QuantityStepper
              value={entry.quantity}
              disabled={isUpdating}
              aria-label={t('cart.quantityFor', { name: product.name })}
              onChange={(quantity) => onQuantityChange(entry._id, quantity)}
            />
          </div>
          <p className="cart-line__line-total">
            {formatAmount(lineTotal(entry, product, currency), currency, formatLocale)}
          </p>
        </div>
      </div>
    </article>
  )
}
