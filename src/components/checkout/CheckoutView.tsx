import { MapPin, Package } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CatalogBreadcrumb } from '@/components/catalog/CatalogPageHeader'
import { CheckoutAddressEmpty } from '@/components/checkout/CheckoutAddressEmpty'
import { CheckoutAddressOptions } from '@/components/checkout/CheckoutAddressOptions'
import { CheckoutDeliveryNote } from '@/components/checkout/CheckoutDeliveryNote'
import { CheckoutMobileBar } from '@/components/checkout/CheckoutMobileBar'
import { CheckoutOrderReview } from '@/components/checkout/CheckoutOrderReview'
import { CheckoutSuccess } from '@/components/checkout/CheckoutSuccess'
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary'
import { Container } from '@/components/layout/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { LocaleLink } from '@/components/ui/LocaleLink'
import { LoadingState } from '@/components/ui/LoadingState'
import type { Address, Order } from '@/api/types'
import { useAccountUser } from '@/hooks/useAccount'
import { useCart } from '@/hooks/useCart'
import { usePlaceOrder } from '@/hooks/useCheckout'
import { useLocaleNavigate } from '@/hooks/useLocaleNavigate'
import { useTranslation } from '@/i18n'
import { isSameAddress } from '@/lib/address'

function resolveBillingAddress(
  deliveryAddress: Address,
  billingAddresses: Address[] | undefined,
): Address {
  return billingAddresses?.[0] ?? deliveryAddress
}

export function CheckoutView() {
  const { t } = useTranslation()
  const navigate = useLocaleNavigate()
  const { data: cartData, isLoading: isCartLoading, isError: isCartError, refetch } = useCart()
  const { data: user, isLoading: isUserLoading } = useAccountUser()
  const placeOrder = usePlaceOrder()

  const deliveryAddresses = useMemo(() => user?.deliveryAddresses ?? [], [user?.deliveryAddresses])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [deliveryNote, setDeliveryNote] = useState('')
  const [deliveryNoteInitialized, setDeliveryNoteInitialized] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)
  const [placeOrderError, setPlaceOrderError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedAddress && deliveryAddresses.length > 0) {
      const cartDelivery = cartData?.cart.deliveryAddress
      const initial =
        cartDelivery &&
        deliveryAddresses.find((address) => isSameAddress(address, cartDelivery))
      setSelectedAddress(initial ?? deliveryAddresses[0])
    }
  }, [cartData?.cart.deliveryAddress, deliveryAddresses, selectedAddress])

  useEffect(() => {
    if (!deliveryNoteInitialized && cartData) {
      setDeliveryNote(cartData.cart.deliveryNote ?? '')
      setDeliveryNoteInitialized(true)
    }
  }, [cartData, deliveryNoteInitialized])

  const hasItems = Boolean(cartData && cartData.lines.length > 0)
  const isLoading = isCartLoading || isUserLoading

  useEffect(() => {
    if (!isCartLoading && cartData && cartData.lines.length === 0 && !placedOrder) {
      navigate('/cart', { replace: true })
    }
  }, [cartData, isCartLoading, navigate, placedOrder])

  const canPlaceOrder = Boolean(selectedAddress && hasItems && !placeOrder.isPending)
  const showSuccess = Boolean(placedOrder)

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !cartData || !user) return

    setPlaceOrderError(null)

    try {
      const order = await placeOrder.mutateAsync({
        cartId: cartData.cart._id,
        deliveryAddress: selectedAddress,
        billingAddress: resolveBillingAddress(selectedAddress, user.billingAddresses),
        deliveryNote,
      })
      setPlacedOrder(order)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setPlaceOrderError(t('checkout.placeOrderError'))
    }
  }

  return (
    <Container className={`checkout-page${hasItems && !showSuccess ? ' has-mobile-bar' : ''}`}>
      <CatalogBreadcrumb
        items={[
          { label: t('pages.cart'), to: '/cart' },
          { label: t('pages.checkout') },
        ]}
      />

      {!showSuccess ? (
        <header className="checkout-header">
          <h1>{t('pages.checkout')}</h1>
          <p>
            {deliveryAddresses.length === 0
              ? t('checkout.noAddressSubtitle')
              : t('checkout.subtitle')}
          </p>
        </header>
      ) : null}

      {isLoading ? (
        <div className="checkout-page-loading">
          <LoadingState />
        </div>
      ) : isCartError ? (
        <div className="checkout-page-error">
          <ErrorState message={t('checkout.loadError')} onRetry={() => refetch()} />
        </div>
      ) : showSuccess && placedOrder ? (
        <CheckoutSuccess order={placedOrder} customerName={user?.name ?? ''} />
      ) : cartData ? (
        <>
          <div className="checkout-shell">
            <div className="checkout-main">
              <section className="checkout-panel" aria-labelledby="delivery-heading">
                <div className="checkout-panel__head">
                  <h2 id="delivery-heading">
                    <MapPin size={18} aria-hidden />
                    {t('checkout.deliveryAddress')}
                  </h2>
                  <LocaleLink className="checkout-text-link" to="/account?panel=addresses">
                    {t('checkout.manageAddresses')}
                  </LocaleLink>
                </div>

                {deliveryAddresses.length === 0 ? (
                  <CheckoutAddressEmpty />
                ) : (
                  <>
                    <CheckoutAddressOptions
                      addresses={deliveryAddresses}
                      selectedAddress={selectedAddress}
                      onSelect={setSelectedAddress}
                    />
                    <CheckoutDeliveryNote
                      value={deliveryNote}
                      onChange={setDeliveryNote}
                      disabled={placeOrder.isPending}
                    />
                  </>
                )}
              </section>

              <section className="checkout-panel" aria-labelledby="review-heading">
                <h2 id="review-heading">
                  <Package size={18} aria-hidden />
                  {t('checkout.orderReview')}
                </h2>
                <CheckoutOrderReview lines={cartData.lines} currency={cartData.cart.currency} />
              </section>
            </div>

            <CheckoutSummary
              itemCount={cartData.itemCount}
              subtotal={cartData.subtotal}
              vat={cartData.vat}
              total={cartData.total}
              currency={cartData.cart.currency}
              canPlaceOrder={canPlaceOrder}
              isPlacingOrder={placeOrder.isPending}
              onPlaceOrder={() => void handlePlaceOrder()}
            />
          </div>

          {placeOrderError ? (
            <p className="checkout-form-message checkout-form-message--error" role="alert">
              {placeOrderError}
            </p>
          ) : null}

          <CheckoutMobileBar
            total={cartData.total}
            currency={cartData.cart.currency}
            canPlaceOrder={canPlaceOrder}
            isPlacingOrder={placeOrder.isPending}
            onPlaceOrder={() => void handlePlaceOrder()}
          />
        </>
      ) : null}
    </Container>
  )
}
