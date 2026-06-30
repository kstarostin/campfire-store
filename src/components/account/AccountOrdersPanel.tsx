import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { OrderDetailView } from '@/components/account/orders/OrderDetailView'
import { OrderRow } from '@/components/account/orders/OrderRow'
import { OrdersEmpty } from '@/components/account/orders/OrdersEmpty'
import { Pagination } from '@/components/catalog/CatalogResultsBar'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useOrderDetail, useOrdersList } from '@/hooks/useOrders'
import { useTranslation } from '@/i18n'
import { ORDERS_PAGE_SIZE } from '@/lib/order'

function parsePage(value: string | null): number {
  const page = Number(value)
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1
}

export function AccountOrdersPanel() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const detailRef = useRef<HTMLDivElement>(null)

  const page = parsePage(searchParams.get('page'))
  const selectedOrderId = searchParams.get('order')

  const { data, isLoading, isError, refetch } = useOrdersList(page)
  const orderDetail = useOrderDetail(selectedOrderId)

  const orders = data?.orders ?? []
  const total = data?.total ?? 0
  const pages = data?.pages ?? 1
  const hasOrders = total > 0

  const updateOrdersParams = (nextPage: number, nextOrderId: string | null) => {
    const params: Record<string, string> = { panel: 'orders' }
    if (nextPage > 1) params.page = String(nextPage)
    if (nextOrderId) params.order = nextOrderId
    setSearchParams(params, { replace: true })
  }

  const handleSelectOrder = (orderId: string) => {
    updateOrdersParams(page, orderId)

    if (window.matchMedia('(max-width: 899px)').matches) {
      window.requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  const handlePageChange = (nextPage: number) => {
    const nextOrderId = orders[0]?._id ?? null
    updateOrdersParams(nextPage, nextOrderId)
  }

  useEffect(() => {
    if (!data || orders.length === 0 || selectedOrderId) return
    updateOrdersParams(page, orders[0]._id)
  }, [data, orders, page, selectedOrderId])

  const start = hasOrders ? (page - 1) * ORDERS_PAGE_SIZE + 1 : 0
  const end = hasOrders ? Math.min(page * ORDERS_PAGE_SIZE, total) : 0

  return (
    <section
      className="account-panel is-active"
      id="panel-orders"
      aria-labelledby="account-orders-heading"
    >
      <header className="account-panel__head">
        <div>
          <h2 id="account-orders-heading">{t('account.ordersTitle')}</h2>
          <p>{t('account.ordersDescription')}</p>
        </div>
      </header>

      {isLoading ? (
        <div className="account-panel-loading">
          <LoadingState />
        </div>
      ) : isError ? (
        <ErrorState message={t('account.orders.loadError')} onRetry={() => void refetch()} />
      ) : !hasOrders ? (
        <OrdersEmpty />
      ) : (
        <div className="orders-layout">
          <div className="orders-list-pane">
            <p className="orders-results-bar">
              {t('account.orders.showing', { start, end, total })}
            </p>

            <Pagination page={page} pages={pages} onPageChange={handlePageChange} />

            <div className="orders-list" role="listbox" aria-label={t('account.orders.listLabel')}>
              {orders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  isSelected={order._id === selectedOrderId}
                  onSelect={() => handleSelectOrder(order._id)}
                />
              ))}
            </div>
          </div>

          <div ref={detailRef}>
            {selectedOrderId ? (
              <OrderDetailView
                orderId={selectedOrderId}
                data={orderDetail.data}
                isLoading={orderDetail.isLoading}
                isError={orderDetail.isError}
                onRetry={() => void orderDetail.refetch()}
              />
            ) : null}
          </div>
        </div>
      )}
    </section>
  )
}
