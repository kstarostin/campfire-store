import { Trash2 } from 'lucide-react'
import type { Currency } from '@/api/types'
import { Price } from '@/components/product/Price'
import { Button } from '@/components/ui/Button'
import { LocaleLink } from '@/components/ui/LocaleLink'
import { useAddToCart } from '@/hooks/useCart'
import type { WishlistLine } from '@/hooks/useWishlist'
import { useTranslation } from '@/i18n'
import { productImageUrl } from '@/lib/imageUrl'

interface WishlistLineItemProps {
  line: WishlistLine
  currency: Currency
  onRemove: (entryId: string) => void
  isUpdating?: boolean
}

export function WishlistLineItem({
  line,
  currency,
  onRemove,
  isUpdating = false,
}: WishlistLineItemProps) {
  const { t } = useTranslation()
  const addToCart = useAddToCart()
  const { entry, product } = line
  const imageSrc = productImageUrl(product, 'small')

  const handleAddToCart = () => {
    addToCart.mutate({ productId: product._id, quantity: 1 })
  }

  return (
    <article className="wishlist-line">
      <LocaleLink
        to={`/products/${product._id}`}
        className="wishlist-line__media"
        aria-hidden
        tabIndex={-1}
      >
        {imageSrc ? (
          <img src={imageSrc} alt="" width={104} height={104} />
        ) : (
          <span className="wishlist-line__media-placeholder" aria-hidden />
        )}
      </LocaleLink>

      <div className="wishlist-line__body">
        <div className="wishlist-line__top">
          <div>
            {product.manufacturer ? (
              <p className="wishlist-line__meta">{product.manufacturer}</p>
            ) : null}
            <h2 className="wishlist-line__title">
              <LocaleLink to={`/products/${product._id}`}>{product.name}</LocaleLink>
            </h2>
          </div>
          <button
            type="button"
            className="wishlist-line__remove"
            aria-label={t('wishlist.removeItem', { name: product.name })}
            disabled={isUpdating}
            onClick={() => onRemove(entry._id)}
          >
            <Trash2 size={18} aria-hidden />
          </button>
        </div>

        <div className="wishlist-line__footer">
          <Price priceI18n={product.priceI18n} currency={currency} className="wishlist-line__price" />
          <Button
            type="button"
            variant="secondary"
            disabled={isUpdating || addToCart.isPending}
            onClick={handleAddToCart}
          >
            {t('wishlist.addToCart')}
          </Button>
        </div>
      </div>
    </article>
  )
}
