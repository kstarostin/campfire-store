import { Container } from '@/components/layout/Container'
import { ProductRail } from '@/components/product/ProductRail'
import { SectionHead } from '@/components/ui/SectionHead'
import { useLocale } from '@/hooks/useLocale'
import { useRecentlyViewedProducts } from '@/hooks/useRecentlyViewed'
import { useTranslation } from '@/i18n'

export function RecentlyViewed() {
  const { t } = useTranslation()
  const { currency } = useLocale()
  const { products } = useRecentlyViewedProducts()

  // Nothing to come back to yet, and no skeleton either: on a first visit this
  // section should not exist rather than promise content that never arrives.
  if (products.length === 0) return null

  return (
    <section className="section section--products" id="recently-viewed">
      <Container>
        <SectionHead
          title={t('home.recentlyViewed')}
          description={t('home.recentlyViewedDescription')}
        />

        <ProductRail
          products={products}
          currency={currency}
          label={t('home.recentlyViewed')}
        />
      </Container>
    </section>
  )
}
