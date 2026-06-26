import { useEffect, useState } from 'react'
import type { Product } from '@/api/types'
import { ProductMediaPlaceholder } from '@/components/product/ProductMediaPlaceholder'
import { productImageUrl } from '@/lib/imageUrl'

interface ProductCardMediaProps {
  product: Pick<Product, '_id' | 'name' | 'images'>
  size?: 'small' | 'medium'
}

export function ProductCardMedia({ product, size = 'small' }: ProductCardMediaProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageSrc = productImageUrl(product, size)

  useEffect(() => {
    setImageFailed(false)
  }, [product._id, imageSrc])

  if (!imageSrc || imageFailed) {
    return <ProductMediaPlaceholder />
  }

  return (
    <img
      src={imageSrc}
      alt=""
      loading="lazy"
      onError={() => setImageFailed(true)}
    />
  )
}
