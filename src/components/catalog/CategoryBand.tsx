import type { Category } from '@/api/types'
import { CategoryLeafTile } from '@/components/catalog/CategoryLeafTile'
import { LocaleLink } from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n'
import { getCategoryIcon } from '@/lib/categoryIcons'
import { getCategoryImageAlt, getResolvedCategoryImageUrl } from '@/lib/categoryImage'
import { categoryPath } from '@/lib/categoryPath'
import { ArrowRight } from 'lucide-react'

interface CategoryBandProps {
  category: Category
  flip?: boolean
}

export function CategoryBand({ category, flip = false }: CategoryBandProps) {
  const { t } = useTranslation()
  const subcategories = category.subCategories ?? []

  if (subcategories.length === 0) {
    return null
  }

  const Icon = getCategoryIcon(category.icon)
  const title = category.title ?? category.name
  const description = category.description
  const heroImageUrl = getResolvedCategoryImageUrl(category.image, 'large')
  const leafGridClass =
    subcategories.length >= 5 ? 'category-leaf-grid category-leaf-grid--5' : 'category-leaf-grid'

  return (
    <section
      className={`category-band${flip ? ' category-band--flip' : ''}`}
      aria-labelledby={`category-band-${category._id}`}
    >
      {heroImageUrl ? (
        <div
          className="category-band__photo"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
          role="img"
          aria-label={getCategoryImageAlt(category.image, 'large', title)}
        />
      ) : (
        <div className="category-band__canvas" aria-hidden />
      )}
      <div className="category-band__scrim" aria-hidden />
      <div className="category-band__inner">
        <div className="category-band__copy">
          <span className="category-band__eyebrow">
            <Icon size={14} aria-hidden />
            {category.name}
          </span>
          <h2 id={`category-band-${category._id}`} className="category-band__title">
            {title}
          </h2>
          {description ? <p className="category-band__description">{description}</p> : null}
          <LocaleLink to={categoryPath(category)} className="category-band__browse">
            {t('catalog.browseAllCategory', { name: category.name })}
            <ArrowRight size={18} aria-hidden />
          </LocaleLink>
        </div>
        <div className={leafGridClass}>
          {subcategories.map((subcategory) => (
            <CategoryLeafTile key={subcategory._id} category={subcategory} />
          ))}
        </div>
      </div>
    </section>
  )
}
