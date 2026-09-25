import { useId, useState } from 'react'
import type { Category } from '@/api/types'

/** Collapsed height is exactly one row of cards. */
export const COLLAPSED_COUNT = 3

export interface CollapsibleCategories {
  /** The full list — tones are positional and must be assigned across all of it. */
  all: Category[]
  visible: Category[]
  expanded: boolean
  canExpand: boolean
  gridId: string
  toggle: () => void
}

/**
 * Collapse state for a category card grid, held outside the grid so the
 * expand/collapse control can live in a section head that is rendered
 * elsewhere — the catalog page header, for instance.
 */
export function useCollapsibleCategories(categories: Category[]): CollapsibleCategories {
  const [expanded, setExpanded] = useState(false)
  const gridId = useId()

  const canExpand = categories.length > COLLAPSED_COUNT
  const visible = expanded || !canExpand ? categories : categories.slice(0, COLLAPSED_COUNT)

  return {
    all: categories,
    visible,
    expanded,
    canExpand,
    gridId,
    toggle: () => setExpanded((current) => !current),
  }
}
