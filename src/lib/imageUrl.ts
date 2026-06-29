import { API_ORIGIN } from '@/api/config'

/**
 * Resolve a product or user image path from the API to a full URL.
 * Paths in JSON are relative (e.g. `img/products/small/product-….jpg`).
 */
export function imageUrl(path: string | undefined | null): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${API_ORIGIN}/${normalized}`
}

export function productImageUrl(
  product: { images?: { small?: { url: string }; medium?: { url: string } }[] },
  size: 'small' | 'medium' = 'small',
): string {
  const image = product.images?.[0]?.[size]?.url
  return imageUrl(image)
}

export function userPhotoUrl(
  photo: { small?: { url: string }; thumbnail?: { url: string } } | undefined,
  size: 'thumbnail' | 'small' = 'thumbnail',
): string {
  return imageUrl(photo?.[size]?.url)
}
