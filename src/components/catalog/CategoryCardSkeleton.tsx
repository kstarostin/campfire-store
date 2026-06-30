import { Skeleton } from '@/components/ui/Skeleton'

export function CategoryCardSkeleton() {
  return (
    <div className="category-card category-card--skeleton" aria-hidden>
      <Skeleton className="category-card-skeleton__icon" />
      <Skeleton className="category-card-skeleton__title" />
      <Skeleton className="category-card-skeleton__meta" />
    </div>
  )
}
