import { CatalogBreadcrumb } from '@/components/catalog/CatalogPageHeader'
import { CartEmpty } from '@/components/cart/CartEmpty'
import { CartLineItem } from '@/components/cart/CartLineItem'
import { CartMobileBar } from '@/components/cart/CartMobileBar'
import { CartSummary } from '@/components/cart/CartSummary'
import { Container } from '@/components/layout/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import {
  useCart,
  useRemoveCartEntry,
  useUpdateCartEntryQuantity,
} from '@/hooks/useCart'
import { useTranslation } from '@/i18n'

export function CartView() {
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch } = useCart()
  const updateQuantity = useUpdateCartEntryQuantity()
  const removeEntry = useRemoveCartEntry()

  const isMutating = updateQuantity.isPending || removeEntry.isPending
  const hasItems = Boolean(data && data.lines.length > 0)

  return (
    <Container className={`cart-page${hasItems ? ' has-items' : ''}`}>
      <CatalogBreadcrumb items={[{ label: t('pages.cart') }]} />

      <header className="cart-header">
        <h1>{t('pages.cart')}</h1>
        {hasItems ? <p>{t('cart.subtitle')}</p> : null}
      </header>

      {isLoading ? (
        <div className="cart-page-loading">
          <LoadingState />
        </div>
      ) : isError ? (
        <div className="cart-page-error">
          <ErrorState message={t('cart.loadError')} onRetry={() => refetch()} />
        </div>
      ) : !hasItems ? (
        <CartEmpty />
      ) : (
        <>
          <div className="cart-shell">
            <div className="cart-items">
              {data!.lines.map((line) => (
                <CartLineItem
                  key={line.entry._id}
                  line={line}
                  currency={data!.cart.currency}
                  isUpdating={isMutating}
                  onQuantityChange={(entryId, quantity) =>
                    updateQuantity.mutate({ entryId, quantity })
                  }
                  onRemove={(entryId) => removeEntry.mutate(entryId)}
                />
              ))}
            </div>

            <CartSummary
              itemCount={data!.itemCount}
              subtotal={data!.subtotal}
              vat={data!.vat}
              total={data!.total}
              currency={data!.cart.currency}
            />
          </div>

          <CartMobileBar total={data!.total} currency={data!.cart.currency} />
        </>
      )}
    </Container>
  )
}
