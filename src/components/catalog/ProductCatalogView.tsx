import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { ProductFilterBar } from '@/components/catalog/ProductFilterBar'
import {
  CatalogResultsBar,
  Pagination,
} from '@/components/catalog/CatalogResultsBar'
import { CatalogPageHeader } from '@/components/catalog/CatalogPageHeader'
import { CategorySubcategoryGrid } from '@/components/catalog/CategorySubcategoryGrid'
import { CategoryToggle } from '@/components/catalog/CategoryToggle'
import { useCollapsibleCategories } from '@/hooks/useCollapsibleCategories'
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
import { buildCatalogSearchParams, parseCatalogUrlState } from '@/lib/catalogUrlState'
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
  const hasSubcategories = !!subcategories && subcategories.length > 0
  // Held here rather than inside the grid so the toggle can sit in the page
  // header alongside the title and its paragraph.
  const subcategoryList = useCollapsibleCategories(subcategories ?? [])
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

  /*
   * A facet must not be narrowed by its own filter. The API recomputes facets
   * against whatever filter it is given, so once one manufacturer is picked the
   * manufacturer facet comes back containing only that one — you could never
   * add a second. This asks for the facets again with every other filter still
   * applied but the manufacturer one removed.
   *
   * It runs unconditionally rather than only while a brand is selected. Its key
   * does not contain the manufacturer filter, so picking a brand cannot put it
   * into a loading state — which previously collapsed the option list for a
   * moment, flipped the control from menu to chips and unmounted the open
   * panel mid-click. On page one with no brand chosen its key matches the main
   * query exactly and React Query serves both from one request.
   */
  const facetFilter = useMemo(
    () => buildApiFilter({ ...filters, manufacturers: [] }, currency),
    [filters, currency],
  )
  const apiSort = catalogSortToApi(sort, currency)

  const queryParams = {
    page,
    limit: CATALOG_PAGE_SIZE,
    sort: apiSort,
    filter: apiFilter,
  }

  const facetParams = { ...queryParams, page: 1, filter: facetFilter }

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

  const categoryFacetsQuery = useCategoryProducts(
    variant === 'category' ? props.categoryCode : undefined,
    { ...facetParams, enabled: variant === 'category' },
  )
  const searchFacetsQuery = useSearch(searchParams.get('q')?.trim() ?? '', {
    ...facetParams,
    enabled: variant === 'search',
  })
  const allFacetsQuery = useProducts({ ...facetParams, enabled: variant === 'all' })

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

  const facetsQuery =
    variant === 'category'
      ? categoryFacetsQuery
      : variant === 'search'
        ? searchFacetsQuery
        : allFacetsQuery

  const facetSource = facetsQuery.data ?? productsQuery.data

  const manufacturers = useMemo(() => {
    const fromFilters = getManufacturerFilterValues(facetSource?.filters ?? [])
    if (fromFilters.length > 0) {
      return [...fromFilters].sort((a, b) => a.localeCompare(b))
    }

    const names = new Set<string>()
    for (const product of facetSource?.products ?? []) {
      if (product.manufacturer) names.add(product.manufacturer)
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b))
  }, [facetSource])

  const priceQuickFilters = useMemo(
    () => getPriceQuickFilters(facetSource?.filters ?? []),
    [facetSource],
  )

  // Relevance only means anything against a query.
  const sortOptions: { value: CatalogSort; label: string }[] =
    variant === 'search'
      ? [
          { value: 'relevance', label: t('catalog.sortRelevance') },
          { value: 'newest', label: t('catalog.sortNewest') },
          { value: 'priceAsc', label: t('catalog.sortPriceAsc') },
          { value: 'priceDesc', label: t('catalog.sortPriceDesc') },
        ]
      : [
          { value: 'newest', label: t('catalog.sortNewest') },
          { value: 'priceAsc', label: t('catalog.sortPriceAsc') },
          { value: 'priceDesc', label: t('catalog.sortPriceDesc') },
        ]

  const catalogData = productsQuery.data
  const hasActiveFilters = countActiveCatalogFilters(filters) > 0
  // Not gated on catalogData: that goes undefined while the next query loads,
  // which unmounted the whole bar on every change — closing an open menu
  // mid-selection, so a second brand could never be ticked.
  const showFilters = hasActiveFilters || (catalogData ? catalogData.total > 0 : false)
  const isEmptyCatalog = Boolean(catalogData && catalogData.products.length === 0)

  return (
    <section className="catalog-page section--products">
      <Container>
        <CatalogPageHeader
          breadcrumb={breadcrumb}
          title={title}
          subtitle={resolvedSubtitle}
          action={hasSubcategories ? <CategoryToggle list={subcategoryList} /> : null}
        />

        {hasSubcategories ? (
          <div className="catalog-subcategory-grid">
            <CategorySubcategoryGrid list={subcategoryList} />
          </div>
        ) : null}

        {showFilters ? (
          <ProductFilterBar
            manufacturers={manufacturers}
            selectedManufacturers={filters.manufacturers}
            onManufacturersChange={(next) => setFilters({ ...filters, manufacturers: next })}
            priceMin={filters.priceMin}
            priceMax={filters.priceMax}
            onPriceChange={(min, max) =>
              setFilters({ ...filters, priceQuickMax: null, priceMin: min, priceMax: max })
            }
            priceQuickFilters={priceQuickFilters}
            priceQuickMax={filters.priceQuickMax}
            onPriceQuickChange={(max) =>
              setFilters({ ...filters, priceQuickMax: max, priceMin: null, priceMax: null })
            }
            currency={currency}
            sort={sort}
            sortOptions={sortOptions}
            sortLabel={t('catalog.sortAria')}
            activeSummary={activeSummary}
            activeCount={countActiveCatalogFilters(filters)}
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
