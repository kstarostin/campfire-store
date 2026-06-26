import type { Product, ProductImage } from '@/api/types'

export interface ProductGallerySlide {
  id: string
  url: string
  thumbUrl: string
  alt: string
}

function pickImageUrl(
  container: ProductImage,
  preference: Array<keyof ProductImage>,
): string | undefined {
  for (const size of preference) {
    const url = container[size]?.url
    if (url) return url
  }
  return undefined
}

export function buildProductGallerySlides(
  images: Product['images'],
  productName: string,
): ProductGallerySlide[] {
  if (!images?.length) return []

  const slides: ProductGallerySlide[] = []
  const seen = new Set<string>()

  images.forEach((container, index) => {
    const url = pickImageUrl(container, ['large', 'medium', 'small', 'thumbnail'])
    if (!url || seen.has(url)) return

    seen.add(url)
    const thumbUrl =
      pickImageUrl(container, ['thumbnail', 'small', 'medium', 'large']) ?? url

    const altSource =
      container.large ??
      container.medium ??
      container.small ??
      container.thumbnail

    slides.push({
      id: `${index}-${url}`,
      url,
      thumbUrl,
      alt: altSource?.altText?.trim() || productName,
    })
  })

  return slides
}
