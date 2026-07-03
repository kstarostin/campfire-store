import type { Category } from '@/api/types'
import { LocaleLink } from '@/components/ui/LocaleLink'
import { getCategoryIcon } from '@/lib/categoryIcons'
import { getCategoryImageAlt, getResolvedCategoryImageUrl } from '@/lib/categoryImage'
import { categoryPath } from '@/lib/categoryPath'

interface CategoryLeafTileProps {
  category: Category
}

export function CategoryLeafTile({ category }: CategoryLeafTileProps) {
  const Icon = getCategoryIcon(category.icon)
  const title = category.title ?? category.name
  const description = category.description
  const tileImageUrl = getResolvedCategoryImageUrl(category.image, 'small')

  return (
    <LocaleLink to={categoryPath(category)} className="category-leaf-tile text-inherit">
      {tileImageUrl ? (
        <div
          className="category-leaf-tile__photo"
          style={{ backgroundImage: `url(${tileImageUrl})` }}
          role="img"
          aria-label={getCategoryImageAlt(category.image, 'small', title)}
        />
      ) : (
        <div className="category-leaf-tile__canvas" aria-hidden />
      )}
      <div className="category-leaf-tile__scrim" aria-hidden />
      <div className="category-leaf-tile__body">
        <span className="category-leaf-tile__icon">
          <Icon size={14} aria-hidden />
        </span>
        <strong>{title}</strong>
        {description ? <span>{description}</span> : null}
      </div>
    </LocaleLink>
  )
}
