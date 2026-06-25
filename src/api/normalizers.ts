import type {
  BadgeStyle,
  Category,
  Language,
  Product,
  ProductBadge,
  ProductBadgeAssignment,
} from '@/api/types'

export interface ApiListEnvelope<TDocument> {
  status?: string
  resultsFound?: number
  resultsTotal?: number
  resultsPerPage?: number
  currentPage?: number
  pages?: number
  results?: number
  data?:
    | TDocument[]
    | {
        documents?: TDocument[]
        filters?: ProductListFilter[]
      }
}

export interface ProductListFilter {
  name: string
  type: string
  values?: string[]
  min?: number
  max?: number
  quickFilters?: PriceQuickFilter[]
}

export interface PriceQuickFilter {
  max: number
  count: number
}

interface ApiCategoryDocument {
  _id: string
  code?: string
  icon?: string
  name?: string
  nameI18n?: Partial<Record<Language, string>>
  parentCategory?: string | null
  root?: boolean
  subCategories?: ApiCategoryDocument[]
}

interface ApiBadgeDocument {
  _id: string
  code: string
  nameI18n?: Partial<Record<Language, string>>
  style?: BadgeStyle
}

interface ApiProductBadgeAssignment {
  priority: number
  badge: ApiBadgeDocument
}

interface ApiProductDocument extends Omit<Product, 'badges'> {
  badges?: ApiProductBadgeAssignment[]
}

export interface ParsedProductList {
  products: Product[]
  filters: ProductListFilter[]
  total: number
  page: number
  limit: number
  pages: number
  query?: string
}

function localizedName(
  nameI18n: Partial<Record<Language, string>> | undefined,
  language: Language,
  fallback?: string,
): string {
  return nameI18n?.[language] ?? nameI18n?.en ?? fallback ?? 'Untitled'
}

export function normalizeCategory(
  document: ApiCategoryDocument,
  language: Language,
): Category {
  return {
    _id: document._id,
    code: document.code,
    icon: document.icon,
    name: localizedName(document.nameI18n, language, document.name),
    parentCategory: document.parentCategory ?? null,
    subCategories: document.subCategories?.map((subcategory) =>
      normalizeCategory(subcategory, language),
    ),
  }
}

export function parseCategoryList(
  response: ApiListEnvelope<ApiCategoryDocument>,
  language: Language,
): Category[] {
  const payload = response.data
  const documents = Array.isArray(payload) ? payload : (payload?.documents ?? [])
  return documents.map((document) => normalizeCategory(document, language))
}

function normalizeBadge(
  document: ApiBadgeDocument,
  language: Language,
): ProductBadge {
  return {
    _id: document._id,
    code: document.code,
    name: localizedName(document.nameI18n, language),
    style: document.style ?? 'primary',
  }
}

function normalizeProductBadges(
  assignments: ApiProductBadgeAssignment[] | undefined,
  language: Language,
): ProductBadgeAssignment[] {
  if (!assignments?.length) return []

  return assignments
    .filter((assignment) => assignment.badge)
    .map((assignment) => ({
      priority: assignment.priority,
      badge: normalizeBadge(assignment.badge, language),
    }))
    .sort((left, right) => left.priority - right.priority)
}

function normalizeProduct(document: ApiProductDocument, language: Language): Product {
  const { badges, ...product } = document
  return {
    ...product,
    badges: normalizeProductBadges(badges, language),
  }
}

export function parseProductList(
  response: ApiListEnvelope<ApiProductDocument> & {
    currentPage?: number
    resultsPerPage?: number
    pages?: number
    query?: string
  },
  language: Language,
): ParsedProductList {
  const payload = response.data
  const documents = Array.isArray(payload) ? payload : (payload?.documents ?? [])
  const filters = Array.isArray(payload) ? [] : (payload?.filters ?? [])

  return {
    products: documents.map((document) => normalizeProduct(document, language)),
    filters,
    total:
      response.resultsTotal ??
      response.results ??
      response.resultsFound ??
      documents.length,
    page: response.currentPage ?? 1,
    limit: response.resultsPerPage ?? documents.length,
    pages: response.pages ?? 1,
    query: response.query,
  }
}

export function getManufacturerFilterValues(filters: ProductListFilter[]): string[] {
  const manufacturerFilter = filters.find((filter) => filter.name === 'manufacturer')
  return manufacturerFilter?.values ?? []
}

export function getPriceQuickFilters(filters: ProductListFilter[]): PriceQuickFilter[] {
  const priceFilter = filters.find((filter) => filter.name === 'priceI18n')
  return priceFilter?.quickFilters ?? []
}
