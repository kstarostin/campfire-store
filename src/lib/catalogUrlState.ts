import {
  DEFAULT_CATALOG_FILTERS,
  type CatalogFilterState,
  type CatalogSort,
} from '@/lib/productCatalogFilters'

export type CatalogVariant = 'category' | 'search' | 'all'

export interface CatalogUrlState {
  filters: CatalogFilterState
  sort: CatalogSort
  page: number
}

const SORT_VALUES: CatalogSort[] = ['newest', 'priceAsc', 'priceDesc', 'relevance']

export function defaultCatalogSort(variant: CatalogVariant): CatalogSort {
  return variant === 'search' ? 'relevance' : 'newest'
}

function parsePositiveInt(value: string | null): number | null {
  if (!value) return null
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

function parseSort(value: string | null, variant: CatalogVariant): CatalogSort {
  if (value && SORT_VALUES.includes(value as CatalogSort)) {
    const sort = value as CatalogSort
    if (variant !== 'search' && sort === 'relevance') {
      return defaultCatalogSort(variant)
    }
    return sort
  }
  return defaultCatalogSort(variant)
}

export function parseCatalogUrlState(
  searchParams: URLSearchParams,
  variant: CatalogVariant,
): CatalogUrlState {
  const under = parsePositiveInt(searchParams.get('under'))
  const min = parsePositiveInt(searchParams.get('min'))
  const max = parsePositiveInt(searchParams.get('max'))
  const brand = searchParams.get('brand')?.trim() || null

  const filters: CatalogFilterState =
    under != null
      ? {
          ...DEFAULT_CATALOG_FILTERS,
          manufacturer: brand,
          priceQuickMax: under,
        }
      : {
          ...DEFAULT_CATALOG_FILTERS,
          manufacturer: brand,
          priceMin: min,
          priceMax: max,
        }

  return {
    filters,
    sort: parseSort(searchParams.get('sort'), variant),
    page: parsePositiveInt(searchParams.get('page')) ?? 1,
  }
}

export function buildCatalogSearchParams(
  current: URLSearchParams,
  state: CatalogUrlState,
  variant: CatalogVariant,
): URLSearchParams {
  const next = new URLSearchParams()
  const defaultSort = defaultCatalogSort(variant)

  if (variant === 'search') {
    const query = current.get('q')?.trim()
    if (query) next.set('q', query)
  }

  if (state.page > 1) {
    next.set('page', String(state.page))
  }

  if (state.sort !== defaultSort) {
    next.set('sort', state.sort)
  }

  if (state.filters.manufacturer) {
    next.set('brand', state.filters.manufacturer)
  }

  if (state.filters.priceQuickMax != null && state.filters.priceQuickMax > 0) {
    next.set('under', String(state.filters.priceQuickMax))
  } else {
    if (state.filters.priceMin != null && state.filters.priceMin > 0) {
      next.set('min', String(state.filters.priceMin))
    }
    if (state.filters.priceMax != null && state.filters.priceMax > 0) {
      next.set('max', String(state.filters.priceMax))
    }
  }

  return next
}

export function hasCatalogUrlState(searchParams: URLSearchParams): boolean {
  const keys = ['page', 'sort', 'brand', 'min', 'max', 'under']
  return keys.some((key) => searchParams.has(key))
}
