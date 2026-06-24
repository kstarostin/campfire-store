import type { ReactNode } from 'react'

interface ProductGridProps {
  children: ReactNode
}

export function ProductGrid({ children }: ProductGridProps) {
  return <div className="product-grid">{children}</div>
}
