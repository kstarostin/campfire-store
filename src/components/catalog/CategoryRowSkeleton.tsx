import { CategoryCardSkeleton } from '@/components/catalog/CategoryCardSkeleton'

interface CategoryRowSkeletonProps {
  count?: number
}

export function CategoryRowSkeleton({ count = 5 }: CategoryRowSkeletonProps) {
  return (
    <div className="category-row" aria-busy="true" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  )
}
