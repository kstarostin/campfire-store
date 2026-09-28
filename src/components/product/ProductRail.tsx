import type { Currency, Product } from '@/api/types'
import { ProductCard } from '@/components/product/ProductCard'
import { useDragScroll } from '@/hooks/useDragScroll'

interface ProductRailProps {
  products: Product[]
  currency: Currency
  /** Falls on the scroller, which is the element that actually scrolls. */
  label?: string
  /** Passed through to every card in the rail. */
  showActions?: boolean
}

/** A horizontally scrolled row of product cards, draggable with the mouse. */
export function ProductRail({
  products,
  currency,
  label,
  showActions = true,
}: ProductRailProps) {
  const scrollRef = useDragScroll<HTMLDivElement>()

  return (
    <div ref={scrollRef} className="product-rail" aria-label={label}>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          currency={currency}
          showActions={showActions}
        />
      ))}
    </div>
  )
}
