import type { Currency } from '@/api/types'

export type CatalogSort = 'newest' | 'priceAsc' | 'priceDesc' | 'relevance'

export interface CatalogFilterState {
  manufacturer: string | null
  priceMin: number | null
  priceMax: number | null
  priceQuickMax: number | null
}

export const DEFAULT_CATALOG_FILTERS: CatalogFilterState = {
  manufacturer: null,
  priceMin: null,
  priceMax: null,
  priceQuickMax: null,
}

export const CATALOG_PAGE_SIZE = 8

export function catalogSortToApi(
  sort: CatalogSort,
  currency: Currency,
): string | undefined {
  switch (sort) {
    case 'priceAsc':
      return `priceI18n.${currency}`
    case 'priceDesc':
      return `-priceI18n.${currency}`
    case 'newest':
      return '-createdAt'
    case 'relevance':
      return undefined
    default:
      return undefined
  }
}

export function buildApiFilter(
  state: CatalogFilterState,
  currency: Currency,
): Record<string, unknown> | undefined {
  const parts: Record<string, unknown>[] = []

  if (state.manufacturer) {
    parts.push({ manufacturer: state.manufacturer })
  }

  const priceKey = `priceI18n.${currency}`

  if (state.priceQuickMax != null && state.priceQuickMax > 0) {
    parts.push({ [priceKey]: { $lt: state.priceQuickMax } })
  } else {
    const priceCondition: Record<string, number> = {}

    if (state.priceMin != null && state.priceMin > 0) {
      priceCondition.$gte = state.priceMin
    }

    if (state.priceMax != null && state.priceMax > 0) {
      priceCondition.$lte = state.priceMax
    }

    if (Object.keys(priceCondition).length > 0) {
      parts.push({ [priceKey]: priceCondition })
    }
  }

  if (parts.length === 0) return undefined
  if (parts.length === 1) return parts[0]
  return { $and: parts }
}

export function countActiveCatalogFilters(state: CatalogFilterState): number {
  let count = 0
  if (state.manufacturer) count += 1
  if (state.priceQuickMax != null && state.priceQuickMax > 0) count += 1
  if (state.priceQuickMax == null && state.priceMin != null && state.priceMin > 0) count += 1
  if (state.priceQuickMax == null && state.priceMax != null && state.priceMax > 0) count += 1
  return count
}

/** Whole-number catalog price input — digits only, no decimals or text. */
export function parseCatalogPriceInput(raw: string): number | null {
  const digits = raw.replace(/\D/g, '')
  if (digits === '') return null
  return Number(digits)
}

export function formatCatalogPriceInput(value: number | null): string {
  return value == null ? '' : String(value)
}
