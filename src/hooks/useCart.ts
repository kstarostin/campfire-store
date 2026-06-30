import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import {
  parseCartEntryResponse,
  parseCartList,
  parseCartResponse,
  parseProduct,
} from '@/api/normalizers'
import type { Cart, Currency } from '@/api/types'
import { useLocale } from '@/hooks/useLocale'
import { cartItemCount, cartLinesSubtotal, cartOrderTotal, cartVat, type CartLine } from '@/lib/cart'
import { showToast } from '@/lib/toast'
import { translate } from '@/i18n'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useLocaleStore } from '@/store/localeStore'

function cartQueryKey(
  userId: string | undefined,
  cartId: string | null,
  language: ReturnType<typeof useLocale>['language'],
  currency: Currency,
) {
  return ['cart', userId, cartId, language, currency] as const
}

function patchCartViewModel(
  current: CartViewModel | null | undefined,
  patch: (lines: CartLine[]) => CartLine[],
): CartViewModel | null | undefined {
  if (!current) return current

  const lines = patch(current.lines)
  const entries = lines.map((line) => line.entry)
  const subtotal = cartLinesSubtotal(lines, current.cart.currency)
  const vat = cartVat(current.cart)
  const total = cartOrderTotal(subtotal, vat)

  return {
    ...current,
    lines,
    itemCount: cartItemCount(entries),
    subtotal,
    vat,
    total,
    cart: {
      ...current.cart,
      entries,
      total,
    },
  }
}

export interface CartViewModel {
  cart: Cart
  lines: CartLine[]
  itemCount: number
  subtotal: number
  vat: number
  total: number
}

async function fetchCartDocument(
  userId: string,
  token: string,
  language: ReturnType<typeof useLocale>['language'],
  currency: Currency,
  cartId: string | null,
): Promise<Cart | null> {
  if (cartId) {
    try {
      const response = await endpoints.cart(userId, cartId, token, language, currency)
      return parseCartResponse(response)
    } catch {
      useCartStore.getState().clearCartId()
    }
  }

  const listResponse = await endpoints.carts(userId, token, language, currency)
  const carts = parseCartList(listResponse)
  const cart = carts[0] ?? null

  if (cart) {
    useCartStore.getState().setCartId(cart._id)
  }

  return cart
}

async function loadCartWithProducts(
  userId: string,
  token: string,
  language: ReturnType<typeof useLocale>['language'],
  currency: Currency,
  cartId: string | null,
): Promise<CartViewModel | null> {
  const cart = await fetchCartDocument(userId, token, language, currency, cartId)
  if (!cart) return null

  const entries = cart.entries ?? []
  if (entries.length === 0) {
    return {
      cart,
      lines: [],
      itemCount: 0,
      subtotal: 0,
      vat: 0,
      total: 0,
    }
  }

  const productIds = [...new Set(entries.map((entry) =>
    typeof entry.product === 'string' ? entry.product : entry.product._id,
  ))]

  const products = await Promise.all(
    productIds.map(async (productId) => {
      const response = await endpoints.product(productId, language, currency)
      return parseProduct(response, language)
    }),
  )

  const productMap = new Map(products.map((product) => [product._id, product]))
  const lines = entries.flatMap((entry) => {
    const productId = typeof entry.product === 'string' ? entry.product : entry.product._id
    const product = productMap.get(productId)
    return product ? [{ entry, product }] : []
  })

  const subtotal = cartLinesSubtotal(lines, cart.currency)
  const vat = cartVat(cart)
  const total = cartOrderTotal(subtotal, vat)

  return {
    cart,
    lines,
    itemCount: cartItemCount(entries),
    subtotal,
    vat,
    total,
  }
}

export async function ensureCart(
  userId: string,
  token: string,
  language: ReturnType<typeof useLocale>['language'],
  currency: Currency,
): Promise<Cart> {
  const storedCartId = useCartStore.getState().cartId
  const existing = await fetchCartDocument(userId, token, language, currency, storedCartId)
  if (existing) return existing

  const response = await endpoints.createCart(userId, token, language, currency, {
    currency,
  })
  const cart = parseCartResponse(response)
  useCartStore.getState().setCartId(cart._id)
  return cart
}

export function useCart() {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const cartId = useCartStore((state) => state.cartId)
  const { language, currency } = useLocale()

  return useQuery({
    queryKey: cartQueryKey(user?._id, cartId, language, currency),
    queryFn: () => loadCartWithProducts(user!._id, token!, language, currency, cartId),
    enabled: Boolean(token && user?._id),
  })
}

export function useCartItemCount() {
  const { data } = useCart()
  return data?.itemCount ?? 0
}

export function useUpdateCartEntryQuantity() {
  const queryClient = useQueryClient()
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const cartId = useCartStore((state) => state.cartId)
  const { language, currency } = useLocale()
  const queryKey = cartQueryKey(user?._id, cartId, language, currency)

  return useMutation({
    mutationFn: async ({ entryId, quantity }: { entryId: string; quantity: number }) => {
      if (!token || !user || !cartId) return

      const response = await endpoints.updateCartEntry(
        user._id,
        cartId,
        entryId,
        token,
        language,
        currency,
        { quantity },
      )

      return parseCartEntryResponse(response)
    },
    onMutate: async ({ entryId, quantity }) => {
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData<CartViewModel | null>(queryKey)
      queryClient.setQueryData<CartViewModel | null>(queryKey, (current) =>
        patchCartViewModel(current, (lines) =>
          lines.map((line) =>
            line.entry._id === entryId
              ? { ...line, entry: { ...line.entry, quantity } }
              : line,
          ),
        ),
      )

      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cart', user?._id] })
    },
  })
}

export function useRemoveCartEntry() {
  const queryClient = useQueryClient()
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const cartId = useCartStore((state) => state.cartId)
  const { language, currency } = useLocale()
  const queryKey = cartQueryKey(user?._id, cartId, language, currency)

  return useMutation({
    mutationFn: async (entryId: string) => {
      if (!token || !user || !cartId) return
      await endpoints.deleteCartEntry(user._id, cartId, entryId, token, language, currency)
    },
    onMutate: async (entryId) => {
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData<CartViewModel | null>(queryKey)
      queryClient.setQueryData<CartViewModel | null>(queryKey, (current) =>
        patchCartViewModel(current, (lines) =>
          lines.filter((line) => line.entry._id !== entryId),
        ),
      )

      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cart', user?._id] })
    },
  })
}

export function useAddToCart() {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const { language, currency } = useLocale()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string
      quantity: number
    }) => {
      if (!token || !user) {
        throw new Error('Authentication required')
      }

      const cart = await ensureCart(user._id, token, language, currency)
      useCartStore.getState().setCartId(cart._id)

      const existing = cart.entries?.find((entry) => {
        const id = typeof entry.product === 'string' ? entry.product : entry.product._id
        return id === productId
      })

      if (existing) {
        await endpoints.updateCartEntry(
          user._id,
          cart._id,
          existing._id,
          token,
          language,
          currency,
          { quantity: existing.quantity + quantity },
        )
        return
      }

      const response = await endpoints.addCartEntry(
        user._id,
        cart._id,
        token,
        language,
        currency,
        { product: productId, quantity },
      )
      parseCartEntryResponse(response)
    },
    onSuccess: async () => {
      showToast(translate(useLocaleStore.getState().language, 'toast.addedToCart'))
      await queryClient.invalidateQueries({ queryKey: ['cart', user?._id] })
    },
  })
}
