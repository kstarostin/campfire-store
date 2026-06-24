/** Shared API response shapes — extend as endpoints are integrated. */

export type Language = 'en' | 'de'
export type Currency = 'USD' | 'EUR'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages?: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination?: PaginationMeta
  results?: number
}

export interface I18nString {
  en?: string
  de?: string
}

export interface I18nPrice {
  USD?: number
  EUR?: number
}

export interface ProductImage {
  small?: { url: string }
  medium?: { url: string }
  large?: { url: string }
}

export interface Product {
  _id: string
  name: string
  manufacturer?: string
  descriptionI18n?: I18nString
  priceI18n?: I18nPrice
  images?: ProductImage[]
  category?: string | Category
  createdAt?: string
}

export interface Category {
  _id: string
  code?: string
  name: string
  parentCategory?: string | null
  subCategories?: Category[]
}

export interface User {
  _id: string
  name: string
  email: string
  photo?: string
  role?: string
}

export interface AuthResponse {
  token: string
  data: {
    user: User
  }
}

export interface CartEntry {
  _id: string
  product: string | Product
  quantity: number
  price?: number
}

export interface Cart {
  _id: string
  currency: Currency
  entries?: CartEntry[]
}

export interface Order {
  _id: string
  status?: string
  total?: number
  currency?: Currency
  createdAt?: string
  entries?: CartEntry[]
}

export interface WishlistItem {
  _id: string
  product: string | Product
  createdAt?: string
}

export interface ApiErrorBody {
  status?: string
  message?: string
}
