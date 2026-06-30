import { WishlistEmpty } from '@/components/account/wishlist/WishlistEmpty'
import { WishlistLineItem } from '@/components/account/wishlist/WishlistLineItem'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useLocale } from '@/hooks/useLocale'
import { useRemoveWishlistEntry, useWishlist } from '@/hooks/useWishlist'
import { useTranslation } from '@/i18n'

export function AccountWishlistPanel() {
  const { t } = useTranslation()
  const { currency } = useLocale()
  const { data, isLoading, isError, refetch } = useWishlist()
  const removeEntry = useRemoveWishlistEntry()

  const hasItems = Boolean(data && data.lines.length > 0)

  return (
    <section
      className="account-panel is-active"
      id="panel-wishlist"
      aria-labelledby="account-wishlist-heading"
    >
      <header className="account-panel__head">
        <div>
          <h2 id="account-wishlist-heading">{t('account.wishlistTitle')}</h2>
          <p>
            {hasItems
              ? t('wishlist.savedCount', { count: data!.itemCount })
              : t('account.wishlistDescription')}
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="account-panel-loading">
          <LoadingState />
        </div>
      ) : isError ? (
        <ErrorState message={t('wishlist.loadError')} onRetry={() => void refetch()} />
      ) : !hasItems ? (
        <WishlistEmpty />
      ) : (
        <div className="wishlist-items">
          {data!.lines.map((line) => (
            <WishlistLineItem
              key={line.entry._id}
              line={line}
              currency={currency}
              isUpdating={removeEntry.isPending}
              onRemove={(entryId) => removeEntry.mutate(entryId)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
