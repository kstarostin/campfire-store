import { Flame } from 'lucide-react'
import type { Product } from '@/api/types'
import { useTranslation } from '@/i18n'
import { localizedText } from '@/lib/localizedText'
import {
  productHighlightIcon,
  productHighlightLabelKey,
} from '@/lib/productHighlights'

interface ProductFieldNotesProps {
  product: Product
}

export function ProductFieldNotes({ product }: ProductFieldNotesProps) {
  const { t, language } = useTranslation()
  const highlights = product.highlights ?? []
  const showFeatured = Boolean(product.isFeatured)

  if (!highlights.length && !showFeatured) return null

  return (
    <section className="pdp-field-notes" aria-labelledby="pdp-field-notes-heading">
      <h2 id="pdp-field-notes-heading">{t('product.fieldNotes')}</h2>
      <div className="pdp-field-notes__grid">
        {highlights.map((highlight) => {
          const Icon = productHighlightIcon(highlight.code)
          const label = t(productHighlightLabelKey(highlight.code))
          const value = localizedText(highlight.valueI18n, language)

          if (!value) return null

          return (
            <div key={highlight.code} className="pdp-field-note">
              <div className="pdp-field-note__icon" aria-hidden>
                <Icon size={18} />
              </div>
              <div>
                <strong>{label}</strong>
                <span>{value}</span>
              </div>
            </div>
          )
        })}

        {showFeatured ? (
          <div className="pdp-field-note">
            <div className="pdp-field-note__icon" aria-hidden>
              <Flame size={18} />
            </div>
            <div>
              <strong>{t('product.featured')}</strong>
              <span>{t('product.campfirePick')}</span>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
