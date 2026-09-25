import { CategoryCard } from '@/components/catalog/CategoryCard'
import { COLLAPSED_COUNT, type CollapsibleCategories } from '@/hooks/useCollapsibleCategories'
import { categoryTones } from '@/lib/categoryTone'

interface CategoryCardGridProps {
  list: CollapsibleCategories
  /** Replaces each card's own description, keyed by category id. */
  meta?: Record<string, string | undefined>
}

/**
 * The photographic category cards, three to a row. Shared by the home page
 * section and the subcategory grid on a category page so the two cannot drift.
 * The expand/collapse control is rendered separately by whichever section head
 * the caller uses — see `CategoryToggle`.
 */
export function CategoryCardGrid({ list, meta }: CategoryCardGridProps) {
  // Tones come from the full list: assigning them to the truncated one would
  // recolour the first row the moment the grid expands.
  const tones = categoryTones(list.all.map((category) => category.code ?? category._id))

  return (
    <div className="category-grid" id={list.gridId}>
      {list.visible.map((category, index) => (
        <CategoryCard
          key={category._id}
          category={category}
          tone={tones[index]}
          meta={meta?.[category._id]}
          eager={index < COLLAPSED_COUNT}
        />
      ))}
    </div>
  )
}
