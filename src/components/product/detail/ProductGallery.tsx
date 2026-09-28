import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Product } from '@/api/types'
import { ProductMediaPlaceholder } from '@/components/product/ProductMediaPlaceholder'
import { useDragScroll } from '@/hooks/useDragScroll'
import { useTranslation } from '@/i18n'
import { imageUrl } from '@/lib/imageUrl'
import { buildProductGallerySlides } from '@/lib/productGallery'

interface ProductGalleryProps {
  product: Pick<Product, 'name' | 'images'>
}

/**
 * Square stage holding one slide per image, scrolled horizontally by drag or
 * touch and snapped into place. The dots sit over the foot of the image and
 * jump to a slide; the active one is derived from scroll position, so it stays
 * correct however the slide was reached.
 */
export function ProductGallery({ product }: ProductGalleryProps) {
  const { t } = useTranslation()
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useDragScroll<HTMLDivElement>()
  const slides = useMemo(
    () => buildProductGallerySlides(product.images, product.name),
    [product.images, product.name],
  )
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 })
    setActiveIndex(0)
  }, [product.name, slides.length])

  const handleScroll = useCallback(() => {
    const track = trackRef.current
    if (!track || !slides.length) return

    const index = Math.round(track.scrollLeft / track.clientWidth)
    setActiveIndex(Math.min(slides.length - 1, Math.max(0, index)))
  }, [slides.length])

  const goToSlide = (index: number) => {
    const track = trackRef.current
    if (!track) return

    track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' })
  }

  if (!slides.length) {
    return (
      <div className="pdp-media-col">
        <div className="pdp-stage">
          <ProductMediaPlaceholder />
        </div>
      </div>
    )
  }

  return (
    <div className="pdp-media-col">
      <div className="pdp-stage">
        <div
          ref={(node) => {
            trackRef.current = node
            dragRef(node)
          }}
          className="pdp-stage__track"
          onScroll={handleScroll}
          role="group"
          aria-label={t('product.galleryLabel')}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="pdp-stage__slide">
              <img src={imageUrl(slide.url)} alt={slide.alt} draggable={false} />
            </div>
          ))}
        </div>

        {slides.length > 1 ? (
          <div
            className="pdp-stage__dots"
            role="tablist"
            aria-label={t('product.galleryLabel')}
          >
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={t('product.goToImage', { index: index + 1 })}
                className={`pdp-stage__dot${index === activeIndex ? ' is-active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
