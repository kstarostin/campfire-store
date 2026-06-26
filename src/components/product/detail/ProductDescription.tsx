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

  const trimmed = description.trimStart()
  const firstCharacter = trimmed[0]
  const remainingText = trimmed.slice(1)

  return (
    <section className="pdp-story" aria-labelledby="pdp-story-heading">
      <h2 id="pdp-story-heading">{t('product.onTheTrail')}</h2>
      <p>
        <span className="pdp-story__dropcap">{firstCharacter}</span>
        {remainingText}
      </p>
    </section>
  )
}
