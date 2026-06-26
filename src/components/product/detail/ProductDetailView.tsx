import { useMemo, useState } from 'react'
import type { Category, Product } from '@/api/types'
import { CatalogBreadcrumb } from '@/components/catalog/CatalogPageHeader'
import { ProductBuyPanel } from '@/components/product/detail/ProductBuyPanel'
import { ProductDescription } from '@/components/product/detail/ProductDescription'
import { ProductFieldNotes } from '@/components/product/detail/ProductFieldNotes'
import { ProductGallery } from '@/components/product/detail/ProductGallery'
import { ProductMobileBuyBar } from '@/components/product/detail/ProductMobileBuyBar'
import { RelatedProductsRail } from '@/components/product/detail/RelatedProductsRail'
import { Container } from '@/components/layout/Container'
import { useLocale } from '@/hooks/useLocale'
import { categoryPath } from '@/lib/categoryPath'

interface ProductDetailViewProps {
  product: Product
  relatedProducts: Product[]
  ancestors: Category[]
}

export function ProductDetailView({
  product,
  relatedProducts,
  ancestors,
}: ProductDetailViewProps) {
  const { currency } = useLocale()
  const [quantity, setQuantity] = useState(1)

  const category =
    product.category && typeof product.category === 'object' ? product.category : undefined

  const breadcrumbItems = useMemo(() => {
    const items = ancestors.map((ancestor) => ({
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
      <Container className="pdp-page section--products">
        <CatalogBreadcrumb items={breadcrumbItems} />

        <div className="pdp-hero">
          <ProductGallery product={product} />
          <ProductBuyPanel
            product={product}
            currency={currency}
            quantity={quantity}
            onQuantityChange={setQuantity}
          />
        </div>

        <ProductFieldNotes product={product} />
        <ProductDescription product={product} />
        <RelatedProductsRail
          products={relatedProducts}
          currency={currency}
          categoryName={category?.name}
        />
      </Container>

      <ProductMobileBuyBar product={product} currency={currency} />
    </>
  )
}
