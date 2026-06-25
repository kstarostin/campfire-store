import { Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Product } from '@/api/types'
import { useTranslation } from '@/i18n'
import { productImageUrl } from '@/lib/imageUrl'

interface ProductCardMediaProps {
  product: Pick<Product, '_id' | 'name' | 'images'>
  size?: 'small' | 'medium'
}

function ProductMediaPlaceholder() {
  const { t } = useTranslation()

  return (
    <div
      className="product-media-placeholder"
      role="img"
      aria-label={t('common.noImage')}
    >
      <Package strokeWidth={1.25} aria-hidden />
    </div>
  )
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
