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

export interface ProductImageSize {
  url: string
  altText?: string
}

export interface ProductImage {
  small?: ProductImageSize
  medium?: ProductImageSize
  large?: ProductImageSize
  thumbnail?: ProductImageSize
}

export type BadgeStyle = 'primary' | 'forest' | 'neutral'

export interface ProductBadge {
  _id: string
  code: string
  name: string
  style: BadgeStyle
}

export interface ProductBadgeAssignment {
  priority: number
  badge: ProductBadge
}

export interface ProductHighlight {
  code: string
  valueI18n?: I18nString
}

export interface Product {
  _id: string
  name: string
  manufacturer?: string
  manufacturerUrl?: string
  taglineI18n?: I18nString
  highlights?: ProductHighlight[]
  descriptionI18n?: I18nString
  priceI18n?: I18nPrice
  images?: ProductImage[]
  category?: string | Category
  createdAt?: string
  isFeatured?: boolean
  featureOrder?: number
  badges?: ProductBadgeAssignment[]
}

export interface Category {
  _id: string
  code?: string
  name: string
  icon?: string
  parentCategory?: string | null
  subCategories?: Category[]
}

export interface UserImageSize {
  url: string
  altText?: string
  mimeType?: string
}

export interface UserPhoto {
  small?: UserImageSize
  thumbnail?: UserImageSize
}

export interface Address {
  _id?: string
  name: string
  phone?: string
  street: string
  house?: string
  postalCode: string
  town: string
  country: string
  title?: string
}

export interface User {
  _id: string
  name: string
  email: string
  photo?: UserPhoto
  deliveryAddresses?: Address[]
  billingAddresses?: Address[]
}

export interface AuthResponse {
  status?: string
  token: string
  data: {
    document: User
  }
}

export interface UserDocumentResponse {
  status?: string
  data: {
    document: User
  }
}

export interface CartEntry {
  _id: string
  product: string | Product
  quantity: number
  price: number
}

export interface Cart {
  _id: string
  currency: Currency
  total?: number
  vat?: number
  tax?: number
  entries?: CartEntry[]
}

export interface CartDocumentResponse {
  status?: string
  data: {
    document: Cart
  }
}

export interface CartEntryDocumentResponse {
  status?: string
  data: {
    document: CartEntry
  }
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
