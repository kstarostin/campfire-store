import type { CategoryImage, CategoryImageSize } from '@/api/types'
import { imageUrl } from '@/lib/imageUrl'

export type CategoryImageVariant = 'large' | 'small'

export function getCategoryImageVariant(
  image: CategoryImage | undefined,
  variant: CategoryImageVariant,
): CategoryImageSize | undefined {
  if (!image) return undefined
  return image[variant] ?? (variant === 'small' ? image.large : undefined)
}

export function getCategoryImageUrl(
  image: CategoryImage | undefined,
  variant: CategoryImageVariant,
): string | undefined {
  return getCategoryImageVariant(image, variant)?.url
}

export function getResolvedCategoryImageUrl(
  image: CategoryImage | undefined,
  variant: CategoryImageVariant,
): string {
  return imageUrl(getCategoryImageUrl(image, variant))
}

export function getCategoryImageAlt(
  image: CategoryImage | undefined,
  variant: CategoryImageVariant,
  fallback: string,
): string {
  return getCategoryImageVariant(image, variant)?.altText ?? fallback
}
