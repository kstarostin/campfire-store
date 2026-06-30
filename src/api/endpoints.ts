import { api, listQueryParams, localeQueryParams } from './client'
import type { ApiListEnvelope } from './normalizers'
import type {
  AuthResponse,
  Cart,
  CartDocumentResponse,
  CartEntryDocumentResponse,
  Category,
  Currency,
  Language,
  Order,
  OrderDocumentResponse,
  PaginatedResponse,
  PaginationParams,
  Product,
  User,
  UserDocumentResponse,
  WishlistItem,
} from './types'

const withLocale = (language: Language, currency: Currency) =>
  localeQueryParams({ language, currency })

export const endpoints = {
  languages: () => api.get<{ data: { code: string; name: string }[] }>('/languages'),

  currencies: () => api.get<{ data: { code: string; name: string }[] }>('/currencies'),

  categories: (language: Language, currency: Currency) =>
    api.get<ApiListEnvelope<Category>>('/categories', {
      params: { ...withLocale(language, currency), limit: 100 },
    }),

  category: (code: string, language: Language, currency: Currency) =>
    api.get<{ data: { document: Category } }>(`/categories/${encodeURIComponent(code)}`, {
      params: withLocale(language, currency),
    }),

  categoryProducts: (
    code: string,
    language: Language,
    currency: Currency,
    pagination?: PaginationParams & {
      filter?: Record<string, unknown> | string
      fields?: string
    },
  ) =>
    api.get<ApiListEnvelope<Product>>(`/categories/${encodeURIComponent(code)}/products`, {
      params: listQueryParams({ language, currency }, pagination),
    }),

  products: (
    language: Language,
    currency: Currency,
    pagination?: PaginationParams & { filter?: Record<string, unknown> | string; fields?: string },
  ) =>
    api.get<ApiListEnvelope<Product>>('/products', {
      params: listQueryParams({ language, currency }, pagination),
    }),

  product: (id: string, language: Language, currency: Currency) =>
    api.get<{ data: { document: Product } }>(`/products/${id}`, {
      params: withLocale(language, currency),
    }),

  relatedProducts: (
    id: string,
    language: Language,
    currency: Currency,
    limit = 8,
  ) =>
    api.get<ApiListEnvelope<Product>>(`/products/${id}/related`, {
      params: { ...withLocale(language, currency), limit },
    }),

  search: (
    q: string,
    language: Language,
    currency: Currency,
    pagination?: PaginationParams & {
      filter?: Record<string, unknown> | string
      fields?: string
    },
  ) =>
    api.get<ApiListEnvelope<Product> & { query?: string }>('/search', {
      params: {
        q,
        ...listQueryParams({ language, currency }, pagination),
      },
    }),

  signup: (body: {
    name: string
    email: string
    password: string
    passwordConfirm: string
  }) => api.post<AuthResponse>('/users/signup', body),

  login: (body: { email: string; password: string }) =>
    api.post<AuthResponse>('/users/login', body),

  logout: (token: string) =>
    api.get<void>('/users/logout', { token }),

  user: (id: string, token: string, language: Language, currency: Currency) =>
    api.get<UserDocumentResponse>(`/users/${id}`, {
      token,
      params: withLocale(language, currency),
    }),

  updateUser: (
    id: string,
    token: string,
    language: Language,
    currency: Currency,
    body: Partial<Pick<User, 'name' | 'deliveryAddresses' | 'billingAddresses'>>,
  ) =>
    api.patch<UserDocumentResponse>(`/users/${id}`, body, {
      token,
      params: withLocale(language, currency),
    }),

  uploadUserPhoto: (
    id: string,
    token: string,
    language: Language,
    currency: Currency,
    file: File,
  ) =>
    api.upload<UserDocumentResponse>(`/users/${id}`, file, {
      token,
      params: withLocale(language, currency),
    }),

  carts: (userId: string, token: string, language: Language, currency: Currency) =>
    api.get<ApiListEnvelope<Cart>>(`/users/${userId}/carts`, {
      token,
      params: withLocale(language, currency),
    }),

  createCart: (
    userId: string,
    token: string,
    language: Language,
    currency: Currency,
    body: { currency: Currency },
  ) =>
    api.post<CartDocumentResponse>(`/users/${userId}/carts`, body, {
      token,
      params: withLocale(language, currency),
    }),

  cart: (
    userId: string,
    cartId: string,
    token: string,
    language: Language,
    currency: Currency,
  ) =>
    api.get<CartDocumentResponse>(`/users/${userId}/carts/${cartId}`, {
      token,
      params: withLocale(language, currency),
    }),

  updateCart: (
    userId: string,
    cartId: string,
    token: string,
    language: Language,
    currency: Currency,
    body: Partial<Cart>,
  ) =>
    api.patch<CartDocumentResponse>(`/users/${userId}/carts/${cartId}`, body, {
      token,
      params: withLocale(language, currency),
    }),

  deleteCart: (
    userId: string,
    cartId: string,
    token: string,
    language: Language,
    currency: Currency,
  ) =>
    api.delete<void>(`/users/${userId}/carts/${cartId}`, {
      token,
      params: withLocale(language, currency),
    }),

  addCartEntry: (
    userId: string,
    cartId: string,
    token: string,
    language: Language,
    currency: Currency,
    body: { product: string; quantity: number },
  ) =>
    api.post<CartEntryDocumentResponse>(
      `/users/${userId}/carts/${cartId}/entries`,
      body,
      {
        token,
        params: withLocale(language, currency),
      },
    ),

  updateCartEntry: (
    userId: string,
    cartId: string,
    entryId: string,
    token: string,
    language: Language,
    currency: Currency,
    body: { quantity: number },
  ) =>
    api.patch<CartEntryDocumentResponse>(
      `/users/${userId}/carts/${cartId}/entries/${entryId}`,
      body,
      { token, params: withLocale(language, currency) },
    ),

  deleteCartEntry: (
    userId: string,
    cartId: string,
    entryId: string,
    token: string,
    language: Language,
    currency: Currency,
  ) =>
    api.delete<void>(`/users/${userId}/carts/${cartId}/entries/${entryId}`, {
      token,
      params: withLocale(language, currency),
    }),

  orders: (userId: string, token: string, pagination?: PaginationParams) =>
    api.get<PaginatedResponse<Order>>(`/users/${userId}/orders`, {
      token,
      params: {
        page: pagination?.page,
        limit: pagination?.limit,
        sort: pagination?.sort,
      },
    }),

  order: (userId: string, orderId: string, token: string) =>
    api.get<{ data: Order }>(`/users/${userId}/orders/${orderId}`, { token }),

  placeOrder: (userId: string, token: string, body: { cartId: string }) =>
    api.post<OrderDocumentResponse>(`/users/${userId}/orders`, body, { token }),

  wishlist: (userId: string, token: string) =>
    api.get<{ data: WishlistItem[] }>(`/users/${userId}/wishlist`, { token }),

  addToWishlist: (userId: string, token: string, body: { product: string }) =>
    api.post<{ data: WishlistItem }>(`/users/${userId}/wishlist`, body, {
      token,
    }),

  removeFromWishlist: (userId: string, productId: string, token: string) =>
    api.delete<void>(`/users/${userId}/wishlist/${productId}`, { token }),
}
