import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { CatalogFilters } from '@/components/catalog/CatalogFilters'
import {
  CatalogResultsBar,
  Pagination,
} from '@/components/catalog/CatalogResultsBar'
import { CatalogPageHeader } from '@/components/catalog/CatalogPageHeader'
import { CategorySubcategoryStrip } from '@/components/catalog/CategorySubcategoryStrip'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductGridSkeleton } from '@/components/product/ProductGridSkeleton'
import { CatalogProductsEmpty } from '@/components/catalog/CatalogProductsEmpty'
import { ErrorState } from '@/components/ui/ErrorState'
import { getManufacturerFilterValues, getPriceQuickFilters } from '@/api/normalizers'
import { useCategoryProducts } from '@/hooks/useCategoryProducts'
import { useProducts } from '@/hooks/useProducts'
import { useSearch } from '@/hooks/useSearch'
import { useTranslation } from '@/i18n'
import { useLocale } from '@/hooks/useLocale'
import {
  buildCatalogSearchParams,
  defaultCatalogSort,
  hasCatalogUrlState,
  parseCatalogUrlState,
} from '@/lib/catalogUrlState'
import {
  buildApiFilter,
  catalogSortToApi,
  CATALOG_PAGE_SIZE,
  DEFAULT_CATALOG_FILTERS,
  countActiveCatalogFilters,
  type CatalogFilterState,
  type CatalogSort,
} from '@/lib/productCatalogFilters'
import type { Category } from '@/api/types'

interface ProductCatalogViewBaseProps {
  title: ReactNode
  subtitle?: string
  breadcrumb?: ReactNode
  activeSummary?: string
  subcategories?: Category[]
}

type ProductCatalogViewProps = ProductCatalogViewBaseProps &
  (
    | { variant: 'category'; categoryCode: string }
    | { variant: 'search'; query: string }
    | { variant: 'all' }
  )

export function ProductCatalogView(props: ProductCatalogViewProps) {
  const { variant, title, subtitle, breadcrumb, activeSummary, subcategories } = props
  const { t } = useTranslation()
  const { currency } = useLocale()
  const [searchParams, setSearchParams] = useSearchParams()

  const sourceKey =
    variant === 'category' ? props.categoryCode : variant === 'search' ? props.query : 'all'
  const previousSourceKey = useRef(sourceKey)

  const { filters, sort, page } = useMemo(
    () => parseCatalogUrlState(searchParams, variant),
    [searchParams, variant],
  )

  const filtersOpenByDefault = useMemo(
    () =>
      hasCatalogUrlState(searchParams) ||
      countActiveCatalogFilters(filters) > 0 ||
      sort !== defaultCatalogSort(variant) ||
      page > 1,
    [searchParams, variant, filters, sort, page],
  )

  const updateCatalogUrl = useCallback(
    (patch: Partial<{ filters: CatalogFilterState; sort: CatalogSort; page: number }>) => {
      setSearchParams(
        (current) =>
          buildCatalogSearchParams(
            current,
            {
              filters: patch.filters ?? filters,
              sort: patch.sort ?? sort,
              page: patch.page ?? page,
            },
            variant,
          ),
        { replace: true },
      )
    },
    [filters, sort, page, variant, setSearchParams],
  )

  const setFilters = useCallback(
    (next: CatalogFilterState) => {
      updateCatalogUrl({ filters: next, page: 1 })
    },
    [updateCatalogUrl],
  )

  const setSort = useCallback(
    (next: CatalogSort) => {
      updateCatalogUrl({ sort: next, page: 1 })
    },
    [updateCatalogUrl],
  )

  const setPage = useCallback(
    (next: number) => {
      updateCatalogUrl({ page: next })
    },
    [updateCatalogUrl],
  )

  const clearFilters = useCallback(() => {
    updateCatalogUrl({ filters: DEFAULT_CATALOG_FILTERS, page: 1 })
  }, [updateCatalogUrl])

  useEffect(() => {
    if (previousSourceKey.current === sourceKey) return

    previousSourceKey.current = sourceKey

    setSearchParams(
      (current) => {
        const next = new URLSearchParams()
        if (variant === 'search') {
          const query = current.get('q')?.trim()
          if (query) next.set('q', query)
        }
        return next
      },
      { replace: true },
    )
  }, [sourceKey, variant, setSearchParams])

  const apiFilter = useMemo(() => buildApiFilter(filters, currency), [filters, currency])
  const apiSort = catalogSortToApi(sort, currency)

  const queryParams = {
    page,
    limit: CATALOG_PAGE_SIZE,
    sort: apiSort,
    filter: apiFilter,
  }

  const categoryProductsQuery = useCategoryProducts(
    variant === 'category' ? props.categoryCode : undefined,
    {
      ...queryParams,
      enabled: variant === 'category',
    },
  )

  const searchQuery = useSearch(searchParams.get('q')?.trim() ?? '', {
    ...queryParams,
    enabled: variant === 'search',
  })

  const allProductsQuery = useProducts({
    ...queryParams,
    enabled: variant === 'all',
  })

  const productsQuery =
    variant === 'category'
      ? categoryProductsQuery
      : variant === 'search'
        ? searchQuery
        : allProductsQuery

  const resolvedSubtitle =
    subtitle ??
    (productsQuery.data
      ? variant === 'search'
        ? t('catalog.searchMatches', { count: productsQuery.data.total })
        : t('catalog.productCount', { count: productsQuery.data.total })
      : undefined)

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

  const priceQuickFilters = useMemo(
    () => getPriceQuickFilters(productsQuery.data?.filters ?? []),
    [productsQuery.data?.filters],
  )

  const catalogData = productsQuery.data
  const hasActiveFilters = countActiveCatalogFilters(filters) > 0
  const showFilters =
    Boolean(catalogData) && ((catalogData?.total ?? 0) > 0 || hasActiveFilters)
  const isEmptyCatalog = Boolean(catalogData && catalogData.products.length === 0)

  return (
    <section className="catalog-page section--products">
      <Container>
        <CatalogPageHeader
          breadcrumb={breadcrumb}
          title={title}
          subtitle={resolvedSubtitle}
        />

        {subcategories && subcategories.length > 0 ? (
          <CategorySubcategoryStrip subcategories={subcategories} />
        ) : null}

        {showFilters ? (
          <CatalogFilters
            manufacturers={manufacturers}
            priceQuickFilters={priceQuickFilters}
            filters={filters}
            sort={sort}
            currency={currency}
            variant={variant}
            activeSummary={activeSummary}
            defaultOpen={filtersOpenByDefault}
            onFiltersChange={setFilters}
            onSortChange={setSort}
            onClear={clearFilters}
          />
        ) : null}

        {productsQuery.isLoading ? (
          <ProductGridSkeleton label={t('catalog.productsLoading')} />
        ) : null}

        {productsQuery.isError ? (
          <ErrorState
            message={t('catalog.productsError')}
            onRetry={() => productsQuery.refetch()}
          />
        ) : null}

        {productsQuery.data ? (
          <>
            {!isEmptyCatalog ? (
              <CatalogResultsBar
                page={productsQuery.data.page}
                limit={productsQuery.data.limit}
                total={productsQuery.data.total}
                variant={variant}
              />
            ) : null}

            {isEmptyCatalog ? (
              <CatalogProductsEmpty
                variant={variant}
                hasActiveFilters={hasActiveFilters}
                query={variant === 'search' ? props.query : undefined}
                onClearFilters={hasActiveFilters ? clearFilters : undefined}
              />
            ) : (
              <ProductGrid>
                {productsQuery.data.products.map((product) => (
                  <ProductCard key={product._id} product={product} currency={currency} />
                ))}
              </ProductGrid>
            )}

            {!isEmptyCatalog ? (
              <Pagination
                page={productsQuery.data.page}
                pages={productsQuery.data.pages}
                onPageChange={setPage}
              />
            ) : null}
          </>
        ) : null}
      </Container>
    </section>
  )
}
