import { CategoryCardGrid } from '@/components/catalog/CategoryCardGrid'
import { useCategoryProductCounts } from '@/hooks/useCategoryProductCounts'
import type { CollapsibleCategories } from '@/hooks/useCollapsibleCategories'
import { useTranslation } from '@/i18n'

interface CategorySubcategoryGridProps {
  list: CollapsibleCategories
}

/**
 * Second-level categories on a category page, using the same cards as the home
 * page. The description gives way to a product total, which is what a shopper
 * already inside a category is choosing between.
 *
 * Counts cost one request each and the API allows 100 an hour per IP, so only
 * the cards actually on screen are counted; the rest follow when the grid
 * expands.
 */
export function CategorySubcategoryGrid({ list }: CategorySubcategoryGridProps) {
  const { t } = useTranslation()

  const counts = useCategoryProductCounts(
    list.visible
      .map((subcategory) => subcategory.code)
      .filter((code): code is string => !!code),
  )

  const meta: Record<string, string | undefined> = {}
  for (const subcategory of list.all) {
    const count = subcategory.code ? counts[subcategory.code] : undefined
    // Empty string rather than undefined: the card keeps the line's height
    // while the count is in flight, so nothing jumps when it lands.
    meta[subcategory._id] =
      count === undefined
        ? ''
        : count === 1
          ? t('catalog.oneProduct')
          : t('catalog.productCount', { count })
  }

  return <CategoryCardGrid list={list} meta={meta} />
}
