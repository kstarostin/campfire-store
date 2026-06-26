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

  return (
    <section className="pdp-story" aria-labelledby="pdp-story-heading">
      <h2 id="pdp-story-heading">{t('product.onTheTrail')}</h2>
      <p>{description}</p>
    </section>
  )
}
