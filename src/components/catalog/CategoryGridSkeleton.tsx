import { CategoryCardSkeleton } from '@/components/catalog/CategoryCardSkeleton'

interface CategoryGridSkeletonProps {
  count?: number
}

export function CategoryGridSkeleton({ count = 6 }: CategoryGridSkeletonProps) {
  return (
    <div className="catalog-category-grid" aria-busy="true" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  )
}
