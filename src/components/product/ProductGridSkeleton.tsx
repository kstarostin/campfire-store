import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton'
import { ProductGrid } from '@/components/product/ProductGrid'

interface ProductGridSkeletonProps {
  count?: number
  label?: string
}

export function ProductGridSkeleton({ count = 8, label }: ProductGridSkeletonProps) {
  return (
    <ProductGrid aria-busy="true" aria-label={label}>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </ProductGrid>
  )
}
