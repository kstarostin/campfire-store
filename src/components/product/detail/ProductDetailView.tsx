import { useMemo, useRef, useState } from 'react'
import type { Category, Product } from '@/api/types'
import { CatalogBreadcrumb, type CatalogBreadcrumbItem } from '@/components/catalog/CatalogPageHeader'
import { ProductBuyPanel } from '@/components/product/detail/ProductBuyPanel'
import { ProductDescription } from '@/components/product/detail/ProductDescription'
import { ProductFieldNotes } from '@/components/product/detail/ProductFieldNotes'
import { ProductGallery } from '@/components/product/detail/ProductGallery'
import { ProductMobileBuyBar } from '@/components/product/detail/ProductMobileBuyBar'
import { RelatedProductsRail } from '@/components/product/detail/RelatedProductsRail'
import { Container } from '@/components/layout/Container'
import { useLocale } from '@/hooks/useLocale'
import { usePdpBuySticky } from '@/hooks/usePdpBuySticky'
import { categoryPath } from '@/lib/categoryPath'

interface ProductDetailViewProps {
  product: Product
  relatedProducts: Product[]
  relatedIsLoading?: boolean
  relatedIsError?: boolean
  onRelatedRetry?: () => void
  ancestors: Category[]
}

export function ProductDetailView({
  product,
  relatedProducts,
  relatedIsLoading = false,
  relatedIsError = false,
  onRelatedRetry,
  ancestors,
}: ProductDetailViewProps) {
  const { currency } = useLocale()
  const [quantity, setQuantity] = useState(1)
  const pageRef = useRef<HTMLDivElement>(null)
  const buySlotRef = useRef<HTMLDivElement>(null)
  const buyRef = useRef<HTMLElement>(null)
  const fieldNotesRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const relatedRef = useRef<HTMLDivElement>(null)
  const belowSectionRefs = useMemo(
    () => ({
      fieldNotes: fieldNotesRef,
      description: descriptionRef,
      related: relatedRef,
    }),
    [],
  )
  const { isBuyPinned, pinnedStyle, placeholderHeight, squeezedSections } =
    usePdpBuySticky(pageRef, buySlotRef, buyRef, product._id, belowSectionRefs)

  const category =
    product.category && typeof product.category === 'object' ? product.category : undefined

  const breadcrumbItems = useMemo((): CatalogBreadcrumbItem[] => {
    const items: CatalogBreadcrumbItem[] = ancestors.map((ancestor) => ({
      label: ancestor.name,
      to: categoryPath(ancestor),
    }))

    if (category) {
      items.push({
        label: category.name,
        to: categoryPath(category),
      })
    }

    items.push({ label: product.name })
    return items
  }, [ancestors, category, product.name])

  return (
    <>
      <Container ref={pageRef} className="pdp-page section--products">
        <CatalogBreadcrumb items={breadcrumbItems} />

        <div className="pdp-hero">
          <ProductGallery product={product} />
          <div className="pdp-buy-slot" ref={buySlotRef}>
            <div
              className="pdp-buy-placeholder"
              style={{ height: isBuyPinned ? placeholderHeight : 0 }}
              aria-hidden
            />
            <ProductBuyPanel
              ref={buyRef}
              product={product}
              currency={currency}
              quantity={quantity}
              onQuantityChange={setQuantity}
              className={isBuyPinned ? 'is-pinned' : ''}
              style={pinnedStyle}
            />
          </div>
        </div>

        <div className="pdp-below-hero">
          <div
            ref={fieldNotesRef}
            className={`pdp-below-section${squeezedSections.fieldNotes ? ' is-squeezed' : ''}`}
          >
            <ProductFieldNotes product={product} />
          </div>
          <div
            ref={descriptionRef}
            className={`pdp-below-section${squeezedSections.description ? ' is-squeezed' : ''}`}
          >
            <ProductDescription product={product} />
          </div>
          <div
            ref={relatedRef}
            className={`pdp-below-section${squeezedSections.related ? ' is-squeezed' : ''}`}
          >
            <RelatedProductsRail
              products={relatedProducts}
              currency={currency}
              categoryName={category?.name}
              isLoading={relatedIsLoading}
              isError={relatedIsError}
              onRetry={onRelatedRetry}
            />
          </div>
        </div>
      </Container>

      <ProductMobileBuyBar product={product} currency={currency} />
    </>
  )
}
