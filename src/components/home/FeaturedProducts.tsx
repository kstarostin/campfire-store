import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { ProductFilterBar } from '@/components/catalog/ProductFilterBar'
import { Container } from '@/components/layout/Container'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductGridSkeleton } from '@/components/product/ProductGridSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SectionHead } from '@/components/ui/SectionHead'
import type { Currency } from '@/api/types'
import { useTranslation, type TranslationKey } from '@/i18n'
import { getManufacturerFilterValues } from '@/api/normalizers'
import { useLocale } from '@/hooks/useLocale'
import { useFeaturedProducts } from '@/hooks/useProducts'

/** The one budget cut this section offers, mirroring the catalog's facets. */
const UNDER_BUDGET = 500
const UNDER_BUDGET_FILTERS = [{ max: UNDER_BUDGET, count: 0 }]

function priceForCurrency(
  priceI18n: { USD?: number; EUR?: number } | undefined,
  currency: Currency,
): number | undefined {
  return priceI18n?.[currency]
}

export function FeaturedProducts() {
  const { t } = useTranslation()
  const { currency } = useLocale()
  const [manufacturers, setManufacturers] = useState<string[]>([])
  const [underBudget, setUnderBudget] = useState(false)
  const [sort, setSort] = useState('featureOrder')

  const sortField = sort.includes('priceI18n')
    ? sort.replace('priceI18n.USD', `priceI18n.${currency}`)
    : sort

  const sortOptions: { labelKey: TranslationKey; value: string }[] = [
    { labelKey: 'home.sortFeatured', value: 'featureOrder' },
    { labelKey: 'home.sortPriceAsc', value: 'priceI18n.USD' },
    { labelKey: 'home.sortPriceDesc', value: '-priceI18n.USD' },
  ]

  const productsQuery = useFeaturedProducts({
    limit: 24,
    sort: sortField,
  })

  const manufacturerOptions = useMemo(() => {
    const fromFilters = getManufacturerFilterValues(productsQuery.data?.filters ?? [])
    if (fromFilters.length > 0) {
      return [...fromFilters].sort((a, b) => a.localeCompare(b))
    }

    const names = new Set<string>()
    for (const product of productsQuery.data?.products ?? []) {
      if (product.manufacturer) names.add(product.manufacturer)
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b))
  }, [productsQuery.data?.filters, productsQuery.data?.products])

  const filteredProducts = useMemo(() => {
    let items = productsQuery.data?.products ?? []

    if (manufacturers.length > 0) {
      items = items.filter(
        (product) => product.manufacturer && manufacturers.includes(product.manufacturer),
      )
    }

    if (underBudget) {
      items = items.filter((product) => {
        const price = priceForCurrency(product.priceI18n, currency)
        return price !== undefined && price < UNDER_BUDGET
      })
    }

    return items.slice(0, 8)
  }, [productsQuery.data?.products, manufacturers, underBudget, currency])

  return (
    <section className="section section--band section--products" id="products">
      <Container>
        <SectionHead
          title={t('home.featuredProducts')}
          description={t('home.featuredDescription')}
        />

        {/* Same bar as the catalog pages, with price range and clear switched
            off — this section filters in memory over a fixed set of featured
            products rather than through the URL. */}
        <ProductFilterBar
          show={['manufacturer', 'priceQuick', 'sort']}
          manufacturers={manufacturerOptions}
          selectedManufacturers={manufacturers}
          onManufacturersChange={setManufacturers}
          priceQuickFilters={UNDER_BUDGET_FILTERS}
          priceQuickMax={underBudget ? UNDER_BUDGET : null}
          onPriceQuickChange={(max) => setUnderBudget(max != null)}
          currency={currency}
          sort={sort}
          sortOptions={sortOptions.map((option) => ({
            value: option.value,
            label: t(option.labelKey),
          }))}
          sortLabel={t('home.sortAria')}
          onSortChange={setSort}
        />

        {productsQuery.isLoading ? (
          <ProductGridSkeleton count={8} label={t('home.productsLoading')} />
        ) : null}

        {productsQuery.isError ? (
          <ErrorState
            message={t('home.productsError')}
            onRetry={() => productsQuery.refetch()}
          />
        ) : null}

        {productsQuery.data && filteredProducts.length === 0 ? (
          <EmptyState
            className="featured-products-empty"
            icon={SlidersHorizontal}
            title={t('home.featuredEmptyTitle')}
            description={t('home.featuredEmptyBody')}
            action={{
              label: t('common.all'),
              onClick: () => {
                setManufacturers([])
                setUnderBudget(false)
              },
            }}
            secondaryAction={{ label: t('catalog.browseAllProducts'), to: '/products' }}
          />
        ) : null}

        {filteredProducts.length > 0 ? (
          <ProductGrid>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                currency={currency}
              />
            ))}
          </ProductGrid>
        ) : null}
      </Container>
    </section>
  )
}
