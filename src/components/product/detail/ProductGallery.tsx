import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Package } from 'lucide-react'
import type { Product } from '@/api/types'
import { useTranslation } from '@/i18n'
import { imageUrl } from '@/lib/imageUrl'
import { buildProductGallerySlides } from '@/lib/productGallery'

const SWIPE_THRESHOLD = 48

interface ProductGalleryProps {
  product: Pick<Product, 'name' | 'images'>
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const { t } = useTranslation()
  const stageRef = useRef<HTMLDivElement>(null)
  const slides = useMemo(
    () => buildProductGallerySlides(product.images, product.name),
    [product.images, product.name],
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const dragStartX = useRef<number | null>(null)

  useEffect(() => {
    setActiveIndex(0)
  }, [product.name, slides.length])

  const activeSlide = slides[activeIndex]

  const goToSlide = useCallback(
    (index: number) => {
      if (!slides.length) return
      const normalized = ((index % slides.length) + slides.length) % slides.length
      setActiveIndex(normalized)
    },
    [slides.length],
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (slides.length < 2) return
    dragStartX.current = event.clientX
    stageRef.current?.setPointerCapture(event.pointerId)
    stageRef.current?.classList.add('is-dragging')
  }

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return

    const deltaX = event.clientX - dragStartX.current
    dragStartX.current = null
    stageRef.current?.classList.remove('is-dragging')

    if (stageRef.current?.hasPointerCapture(event.pointerId)) {
      stageRef.current.releasePointerCapture(event.pointerId)
    }

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return
    goToSlide(activeIndex + (deltaX < 0 ? 1 : -1))
  }

  return (
    <div className="pdp-media-col">
      <div
        ref={stageRef}
        className="pdp-hero-stage"
        onPointerDown={handlePointerDown}
        onPointerUp={finishDrag}
        onPointerCancel={(event) => {
          dragStartX.current = null
          stageRef.current?.classList.remove('is-dragging')
          if (stageRef.current?.hasPointerCapture(event.pointerId)) {
            stageRef.current.releasePointerCapture(event.pointerId)
          }
        }}
      >
        {activeSlide ? (
          <img
            src={imageUrl(activeSlide.url)}
            alt={activeSlide.alt}
            draggable={false}
          />
        ) : (
          <div className="product-media-placeholder" role="img" aria-label={t('common.noImage')}>
            <Package strokeWidth={1.25} aria-hidden />
          </div>
        )}
      </div>

      {slides.length > 1 ? (
        <div className="pdp-filmstrip" role="tablist" aria-label={t('product.galleryLabel')}>
          {slides.map((slide, index) => {
            const isActive = index === activeIndex

            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={isActive ? 'is-active' : undefined}
                onClick={() => goToSlide(index)}
              >
                <img src={imageUrl(slide.thumbUrl)} alt="" />
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
