import { ChevronDown } from 'lucide-react'
import type { CollapsibleCategories } from '@/hooks/useCollapsibleCategories'
import { useTranslation } from '@/i18n'

interface CategoryToggleProps {
  list: CollapsibleCategories
}

/** Expand/collapse control for a category card grid; lives in the section head. */
export function CategoryToggle({ list }: CategoryToggleProps) {
  const { t } = useTranslation()

  if (!list.canExpand) return null

  return (
    <button
      type="button"
      className="category-toggle"
      aria-expanded={list.expanded}
      aria-controls={list.gridId}
      onClick={list.toggle}
    >
      {list.expanded
        ? t('home.collapseCategories')
        : t('home.expandCategories', { count: list.all.length })}
      <ChevronDown
        size={18}
        aria-hidden
        className={`category-toggle__chevron${list.expanded ? ' is-open' : ''}`}
      />
    </button>
  )
}
