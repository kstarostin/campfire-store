import { LocaleLink } from '@/components/ui/LocaleLink'
import type { Category } from '@/api/types'
import { getCategoryIcon } from '@/lib/categoryIcons'
import { categoryPath } from '@/lib/categoryPath'
import { useTranslation } from '@/i18n'

interface CategorySubcategoryStripProps {
  subcategories: Category[]
}

export function CategorySubcategoryStrip({
  subcategories,
}: CategorySubcategoryStripProps) {
  const { t } = useTranslation()

  if (subcategories.length === 0) return null

  return (
    <section className="catalog-subcategory-strip" aria-label={t('catalog.browseSubcategories')}>
      <h2>{t('catalog.browseSubcategories')}</h2>
      <div className="catalog-subcategory-strip__grid">
        {subcategories.map((subcategory) => {
          const Icon = getCategoryIcon(subcategory.icon)

          return (
            <LocaleLink
              key={subcategory._id}
              to={categoryPath(subcategory)}
              className="category-card category-card--compact text-inherit"
            >
              <span className="category-icon category-icon--forest">
                <Icon size={18} aria-hidden />
              </span>
              <strong>{subcategory.name}</strong>
              <span>{t('common.shopNow')}</span>
            </LocaleLink>
          )
        })}
      </div>
    </section>
  )
}
