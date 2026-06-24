import { useMemo, useState } from 'react'
import { Container } from '@/components/layout/Container'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Chip } from '@/components/ui/Chip'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { SectionHead } from '@/components/ui/SectionHead'
import type { Currency } from '@/api/types'
import { useTranslation, type TranslationKey } from '@/i18n'
import { getManufacturerFilterValues } from '@/api/normalizers'
import { useLocale } from '@/hooks/useLocale'
import { useProducts } from '@/hooks/useProducts'

function priceForCurrency(
  priceI18n: { USD?: number; EUR?: number } | undefined,
  currency: Currency,
): number | undefined {
  return priceI18n?.[currency]
}

export function FeaturedProducts() {
  const { t } = useTranslation()
  const { currency } = useLocale()
  const [manufacturer, setManufacturer] = useState<string | null>(null)
  const [underBudget, setUnderBudget] = useState(false)
  const [sort, setSort] = useState('-createdAt')

  const sortField = sort.includes('priceI18n')
    ? sort.replace('priceI18n.USD', `priceI18n.${currency}`)
    : sort

  const sortOptions: { labelKey: TranslationKey; value: string }[] = [
    { labelKey: 'home.sortNewest', value: '-createdAt' },
    { labelKey: 'home.sortPriceAsc', value: 'priceI18n.USD' },
    { labelKey: 'home.sortPriceDesc', value: '-priceI18n.USD' },
  ]

  const underBudgetLabel =
    currency === 'EUR' ? t('home.underBudgetEur') : t('home.underBudgetUsd')

  const productsQuery = useProducts({
    limit: 24,
    sort: sortField,
  })

  const manufacturers = useMemo(() => {
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

    if (manufacturer) {
      items = items.filter((product) => product.manufacturer === manufacturer)
    }

    if (underBudget) {
      items = items.filter((product) => {
        const price = priceForCurrency(product.priceI18n, currency)
        return price !== undefined && price < 500
      })
    }

    return items.slice(0, 8)
  }, [productsQuery.data?.products, manufacturer, underBudget, currency])

  return (
    <section className="section section--band section--products">
      <Container>
        <SectionHead
          title={t('home.featuredProducts')}
          description={t('home.featuredDescription')}
        />

        <div className="toolbar">
          <div className="chip-row">
            <Chip
              active={manufacturer === null && !underBudget}
              onClick={() => {
                setManufacturer(null)
                setUnderBudget(false)
              }}
            >
              {t('common.all')}
            </Chip>
            {manufacturers.slice(0, 4).map((name) => (
              <Chip
                key={name}
                active={manufacturer === name}
                onClick={() => {
                  setManufacturer(name)
                  setUnderBudget(false)
                }}
              >
                {name}
              </Chip>
            ))}
            <Chip
              forest
              active={underBudget}
              onClick={() => {
                setUnderBudget((value) => !value)
                setManufacturer(null)
              }}
            >
              {underBudgetLabel}
            </Chip>
          </div>

          <select
            className="sort-select"
            aria-label={t('home.sortAria')}
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </select>
        </div>

        {productsQuery.isLoading ? (
          <LoadingState label={t('home.productsLoading')} />
        ) : null}

        {productsQuery.isError ? (
          <ErrorState
            message={t('home.productsError')}
            onRetry={() => productsQuery.refetch()}
          />
        ) : null}

        {productsQuery.data && filteredProducts.length === 0 ? (
          <p className="text-[0.9375rem] text-text-muted">{t('home.noFilterMatch')}</p>
        ) : null}

        {filteredProducts.length > 0 ? (
          <ProductGrid>
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                currency={currency}
                badge={index === 0 ? t('common.bestseller') : undefined}
              />
            ))}
          </ProductGrid>
        ) : null}
      </Container>
    </section>
  )
}
