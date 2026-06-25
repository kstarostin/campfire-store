import { api, listQueryParams, localeQueryParams } from './client'
import type { ApiListEnvelope } from './normalizers'
import type {
  AuthResponse,
  Cart,
  CartEntry,
  Category,
  Currency,
  Language,
  Order,
  PaginatedResponse,
  PaginationParams,
  Product,
  User,
  WishlistItem,
} from './types'

const withLocale = (language: Language, currency: Currency) =>
  localeQueryParams({ language, currency })

export const endpoints = {
  languages: () => api.get<{ data: { code: string; name: string }[] }>('/languages'),

  currencies: () => api.get<{ data: { code: string; name: string }[] }>('/currencies'),

  categories: (language: Language, currency: Currency) =>
    api.get<ApiListEnvelope<Category>>('/categories', {
      params: withLocale(language, currency),
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
    api.get<{ data: Product }>(`/products/${id}`, {
      params: withLocale(language, currency),
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

  user: (id: string, token: string) =>
    api.get<{ data: User }>(`/users/${id}`, { token }),

  updateUser: (id: string, token: string, body: Partial<User>) =>
    api.patch<{ data: User }>(`/users/${id}`, body, { token }),

  carts: (userId: string, token: string) =>
    api.get<{ data: Cart[] }>(`/users/${userId}/carts`, { token }),

  createCart: (userId: string, token: string, body: { currency: Currency }) =>
    api.post<{ data: Cart }>(`/users/${userId}/carts`, body, { token }),

  cart: (userId: string, cartId: string, token: string) =>
    api.get<{ data: Cart }>(`/users/${userId}/carts/${cartId}`, { token }),

  updateCart: (
    userId: string,
    cartId: string,
    token: string,
    body: Partial<Cart>,
  ) =>
    api.patch<{ data: Cart }>(`/users/${userId}/carts/${cartId}`, body, {
      token,
    }),

  deleteCart: (userId: string, cartId: string, token: string) =>
    api.delete<void>(`/users/${userId}/carts/${cartId}`, { token }),

  cartEntries: (userId: string, cartId: string, token: string) =>
    api.get<{ data: CartEntry[] }>(
      `/users/${userId}/carts/${cartId}/entries`,
      { token },
    ),

  addCartEntry: (
    userId: string,
    cartId: string,
    token: string,
    body: { product: string; quantity: number },
  ) =>
    api.post<{ data: CartEntry }>(
      `/users/${userId}/carts/${cartId}/entries`,
      body,
      { token },
    ),

  updateCartEntry: (
    userId: string,
    cartId: string,
    entryId: string,
    token: string,
    body: { quantity: number },
  ) =>
    api.patch<{ data: CartEntry }>(
      `/users/${userId}/carts/${cartId}/entries/${entryId}`,
      body,
      { token },
    ),

  deleteCartEntry: (
    userId: string,
    cartId: string,
    entryId: string,
    token: string,
  ) =>
    api.delete<void>(
      `/users/${userId}/carts/${cartId}/entries/${entryId}`,
      { token },
    ),

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
    api.post<{ data: Order }>(`/users/${userId}/orders`, body, { token }),

  wishlist: (userId: string, token: string) =>
    api.get<{ data: WishlistItem[] }>(`/users/${userId}/wishlist`, { token }),

  addToWishlist: (userId: string, token: string, body: { product: string }) =>
    api.post<{ data: WishlistItem }>(`/users/${userId}/wishlist`, body, {
      token,
    }),

  removeFromWishlist: (userId: string, productId: string, token: string) =>
    api.delete<void>(`/users/${userId}/wishlist/${productId}`, { token }),
}
