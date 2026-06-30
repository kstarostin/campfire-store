import type { Order } from '@/api/types'
import type { OrderLine } from '@/hooks/useOrders'
import { useFormatLocale, useTranslation } from '@/i18n'
import { formatAddressLine, formatRecipientName } from '@/lib/address'
import { formatAmount, lineTotal } from '@/lib/cart'
import { useLocale } from '@/hooks/useLocale'
import {
  formatOrderDate,
  normalizeOrderStatus,
  orderStatusClassName,
} from '@/lib/order'
import { productImageUrl } from '@/lib/imageUrl'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'

interface OrderDetailViewProps {
  orderId: string
  data: { order: Order; lines: OrderLine[] } | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

export function OrderDetailView({
  orderId,
  data,
  isLoading,
  isError,
  onRetry,
}: OrderDetailViewProps) {
  const { t } = useTranslation()
  const formatLocale = useFormatLocale()
  const { language } = useLocale()

  if (isLoading) {
    return (
      <div className="orders-detail-pane">
        <div className="orders-detail-loading">
          <LoadingState />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="orders-detail-pane">
        <ErrorState message={t('account.orders.detailError')} onRetry={onRetry} />
      </div>
    )
  }

  const { order, lines } = data
  const currency = order.currency ?? 'USD'
  const status = normalizeOrderStatus(order.status)
  const subtotal = lines.reduce(
    (total, line) => total + lineTotal(line.entry, line.product, currency),
    0,
  )
  const orderTotal = order.total ?? subtotal
  const vat = Math.max(0, orderTotal - subtotal)
  const deliveryAddress = order.deliveryAddress

  return (
    <div className="orders-detail-pane">
      <article className="orders-detail" aria-live="polite">
        <header className="orders-detail__head">
          <div>
            <h3>{t('account.orders.orderNumber', { id: order._id })}</h3>
          </div>
          {status ? (
            <span className={`order-status ${orderStatusClassName(status)}`}>
              {t(`account.orders.status.${status}`)}
            </span>
          ) : null}
        </header>

        <p className="orders-detail__placed">
          {t('account.orders.placedOn', { date: formatOrderDate(order, formatLocale) })}
        </p>

        <section className="orders-detail__section" aria-labelledby={`order-items-${orderId}`}>
          <h4 id={`order-items-${orderId}`}>{t('account.orders.itemsHeading')}</h4>
          <div className="orders-detail__items">
            {lines.map((line) => {
              const imageSrc = productImageUrl(line.product, 'small')
              const total = lineTotal(line.entry, line.product, currency)

              return (
                <article key={line.entry._id} className="orders-detail-item">
                  <div className="orders-detail-item__media">
                    {imageSrc ? (
                      <img src={imageSrc} alt="" width={56} height={56} />
                    ) : (
                      <span className="orders-detail-item__media-placeholder" aria-hidden />
                    )}
                  </div>
                  <div>
                    {line.product.manufacturer ? (
                      <p className="orders-detail-item__meta">{line.product.manufacturer}</p>
                    ) : null}
                    <p className="orders-detail-item__title">{line.product.name}</p>
                    <p className="orders-detail-item__qty">
                      {t('checkout.quantity', { count: line.entry.quantity })}
                    </p>
                  </div>
                  <p className="orders-detail-item__price">
                    {formatAmount(total, currency, formatLocale)}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        {deliveryAddress ? (
          <section className="orders-detail__section" aria-labelledby={`order-delivery-${orderId}`}>
            <h4 id={`order-delivery-${orderId}`}>{t('account.orders.deliveryHeading')}</h4>
            <p className="orders-detail__address">
              <strong>{formatRecipientName(deliveryAddress, language)}</strong>
              <br />
              {formatAddressLine(deliveryAddress)}
              {deliveryAddress.phone ? (
                <>
                  <br />
                  {deliveryAddress.phone}
                </>
              ) : null}
            </p>
            {order.deliveryNote?.trim() ? (
              <p className="orders-detail__note">{order.deliveryNote.trim()}</p>
            ) : null}
          </section>
        ) : null}

        <section className="orders-detail__section" aria-labelledby={`order-totals-${orderId}`}>
          <h4 id={`order-totals-${orderId}`}>{t('account.orders.summaryHeading')}</h4>
          <div className="orders-detail__rows">
            <div className="orders-detail__row">
              <span>{t('cart.subtotal')}</span>
              <span>{formatAmount(subtotal, currency, formatLocale)}</span>
            </div>
            <div className="orders-detail__row">
              <span>{t('cart.vat')}</span>
              <span>{formatAmount(vat, currency, formatLocale)}</span>
            </div>
            <div className="orders-detail__row orders-detail__row--total">
              <span>{t('cart.total')}</span>
              <span>{formatAmount(orderTotal, currency, formatLocale)}</span>
            </div>
          </div>
        </section>
      </article>
    </div>
  )
}
