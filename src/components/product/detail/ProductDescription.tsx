import type { Product } from '@/api/types'
import { useTranslation } from '@/i18n'
import { localizedText } from '@/lib/localizedText'

interface ProductDescriptionProps {
  product: Product
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  const { t, language } = useTranslation()
  const description = localizedText(product.descriptionI18n, language)

  if (!description) return null

  // Descriptions carry blank-line paragraph breaks; rendering the whole string
  // in one <p> would collapse them into a single run-on block.
  const paragraphs = description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <section className="pdp-story" aria-labelledby="pdp-story-heading">
      <h2 id="pdp-story-heading">{t('product.onTheTrail')}</h2>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>
          {index === 0 ? (
            <>
              <span className="pdp-story__dropcap">{paragraph[0]}</span>
              {paragraph.slice(1)}
            </>
          ) : (
            paragraph
          )}
        </p>
      ))}
    </section>
  )
}
