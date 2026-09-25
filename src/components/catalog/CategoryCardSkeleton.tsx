import { Skeleton } from '@/components/ui/Skeleton'

export function CategoryCardSkeleton() {
  return (
    <div className="category-card category-card--skeleton" aria-hidden>
      <span className="category-card__body">
        <Skeleton className="category-card-skeleton__title" />
        <Skeleton className="category-card-skeleton__text" />
        <Skeleton className="category-card-skeleton__text category-card-skeleton__text--short" />
      </span>
    </div>
  )
}
