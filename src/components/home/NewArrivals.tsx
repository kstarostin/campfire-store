import { Container } from '@/components/layout/Container'
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton'
import { ProductRail } from '@/components/product/ProductRail'
import { ErrorState } from '@/components/ui/ErrorState'
import { LocaleLink } from '@/components/ui/LocaleLink'
import { SectionHead } from '@/components/ui/SectionHead'
import { useBadgeId } from '@/hooks/useBadges'
import { useLocale } from '@/hooks/useLocale'
import { useProducts } from '@/hooks/useProducts'
import { useTranslation } from '@/i18n'

const NEW_ARRIVALS_LIMIT = 8
const NEW_BADGE_CODE = 'new'

export function NewArrivals() {
  const { t } = useTranslation()
  const { currency } = useLocale()
  // Products reference a badge by id, and the id differs per environment, so
  // the code is resolved through /badges rather than written down here.
  const newBadgeId = useBadgeId(NEW_BADGE_CODE)
  const query = useProducts({
    limit: NEW_ARRIVALS_LIMIT,
    sort: '-createdAt',
    filter: newBadgeId ? { 'badges.badge': newBadgeId } : undefined,
    enabled: Boolean(newBadgeId),
  })
  const products = query.data?.products ?? []

  // Nothing is tagged as new at the moment: better no section than an empty
  // rail under a heading promising fresh stock.
  if (query.isSuccess && products.length === 0) return null

  return (
    <section className="section section--products" id="new-arrivals">
      <Container>
        <SectionHead
          title={t('home.newArrivals')}
          description={t('home.newArrivalsDescription')}
        >
          <LocaleLink className="category-toggle" to="/products?sort=newest">
            {t('home.newArrivalsAll')}
          </LocaleLink>
        </SectionHead>

        {query.isLoading ? (
          <div
            className="product-rail"
            aria-busy="true"
            aria-label={t('common.loading')}
          >
            {Array.from({ length: 4 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {query.isError ? (
          <ErrorState
            message={t('home.productsError')}
            onRetry={() => query.refetch()}
          />
        ) : null}

        {products.length > 0 ? (
          <ProductRail
            products={products}
            currency={currency}
            label={t('home.newArrivals')}
          />
        ) : null}
      </Container>
    </section>
  )
}
