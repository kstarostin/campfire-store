import { Skeleton } from '@/components/ui/Skeleton'

export function ProductCardSkeleton() {
  return (
    <article className="product-card product-card--skeleton" aria-hidden>
      <Skeleton className="product-card-skeleton__media" />
      <div className="product-body">
        <Skeleton className="product-card-skeleton__meta" />
        <Skeleton className="product-card-skeleton__title" />
        <Skeleton className="product-card-skeleton__title product-card-skeleton__title--second" />
      </div>
      <div className="product-card__footer">
        <Skeleton className="product-card-skeleton__price" />
        <div className="product-card-skeleton__actions">
          <Skeleton className="product-card-skeleton__action" />
          <Skeleton className="product-card-skeleton__action" />
        </div>
      </div>
    </article>
  )
}
