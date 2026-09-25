import { ArrowRight } from 'lucide-react'
import type { Category } from '@/api/types'
import { LocaleLink } from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n'
import { getCategoryImageAlt, getResolvedCategoryImageUrl } from '@/lib/categoryImage'
import { categoryPath } from '@/lib/categoryPath'
import type { CategoryTone } from '@/lib/categoryTone'

interface CategoryCardProps {
  category: Category
  /** Assigned by the section, which sees the whole run and keeps neighbours apart. */
  tone: CategoryTone
  /** Shown instead of the category's own description — same size and spacing. */
  meta?: string
  /** Cards in the first row are above the fold; the rest can load lazily. */
  eager?: boolean
}

/**
 * Tall photographic card: the image fills it, a band of the category's accent
 * colour at the top seats the title and description, and the call to action
 * rises in on hover.
 *
 * The whole card is one link, so the call to action is a span rather than a
 * button — a nested interactive element would be invalid markup and would add a
 * second tab stop to the same destination.
 */
export function CategoryCard({ category, tone, meta, eager = false }: CategoryCardProps) {
  const { t } = useTranslation()
  const photo = getResolvedCategoryImageUrl(category.image, 'large')

  return (
    <LocaleLink
      to={categoryPath(category)}
      className="category-card"
      data-tone={tone}
    >
      {photo ? (
        <img
          src={photo}
          alt={getCategoryImageAlt(category.image, 'large', category.name)}
          className="category-card__photo"
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <span className="category-card__photo category-card__photo--empty" aria-hidden />
      )}

      <span className="category-card__body">
        <span className="category-card__title">{category.name}</span>
        {/* The non-breaking space holds the line's height while a count loads,
            so the card does not jump when it arrives. */}
        {meta !== undefined ? (
          <span className="category-card__text">{meta || '\u00a0'}</span>
        ) : category.description ? (
          <span className="category-card__text">{category.description}</span>
        ) : null}
      </span>

      <span className="category-card__cta">
        {t('catalog.browseAllCategory', { name: category.name })}
        <ArrowRight size={18} aria-hidden />
      </span>
    </LocaleLink>
  )
}
