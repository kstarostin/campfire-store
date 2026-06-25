import type { Category } from '@/api/types'

type CategoryPathSource = Pick<Category, 'code'> | string

/** Public storefront path for a category (uses stable `code`, not MongoDB id). */
export function categoryPath(category: CategoryPathSource): string {
  const code = typeof category === 'string' ? category : category.code
  if (!code) {
    throw new Error('Category path requires a code.')
  }
  return `/categories/${encodeURIComponent(code)}`
}
