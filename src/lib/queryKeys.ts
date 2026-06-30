const LOCALE_SENSITIVE_ROOTS = new Set([
  'account-user',
  'cart',
  'wishlist',
  'orders',
  'product',
  'products',
  'category',
  'category-products',
  'categories',
  'search',
  'related-products',
])

export function isLocaleSensitiveQueryKey(queryKey: readonly unknown[]): boolean {
  return typeof queryKey[0] === 'string' && LOCALE_SENSITIVE_ROOTS.has(queryKey[0])
}
