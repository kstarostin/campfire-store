import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import {
  parseProduct,
  parseWishlistEntryList,
  parseWishlistEntryResponse,
  parseWishlistList,
  parseWishlistResponse,
} from '@/api/normalizers'
import type { Currency, Product, Wishlist, WishlistEntry } from '@/api/types'
import { useLocale } from '@/hooks/useLocale'
import { useAuthStore } from '@/store/authStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { showToast } from '@/lib/toast'
import { translate } from '@/i18n'
import { useLocaleStore } from '@/store/localeStore'

export interface WishlistLine {
  entry: WishlistEntry
  product: Product
}

export interface WishlistViewModel {
  wishlist: Wishlist
  lines: WishlistLine[]
  itemCount: number
}

function wishlistQueryKey(
  userId: string | undefined,
  wishlistId: string | null,
  language: ReturnType<typeof useLocale>['language'],
  currency: Currency,
) {
  return ['wishlist', userId, wishlistId, language, currency] as const
}

async function fetchWishlistDocument(
  userId: string,
  token: string,
  wishlistId: string | null,
): Promise<Wishlist | null> {
  if (wishlistId) {
    try {
      const response = await endpoints.wishlist(userId, wishlistId, token)
      return parseWishlistResponse(response)
    } catch {
      useWishlistStore.getState().clearWishlistId()
    }
  }

  const listResponse = await endpoints.wishlists(userId, token)
  const wishlists = parseWishlistList(listResponse)
  const wishlist = wishlists[0] ?? null

  if (wishlist) {
    useWishlistStore.getState().setWishlistId(wishlist._id)
  }

  return wishlist
}

async function fetchWishlistEntries(
  userId: string,
  wishlistId: string,
  token: string,
  language: ReturnType<typeof useLocale>['language'],
  currency: Currency,
): Promise<WishlistEntry[]> {
  const response = await endpoints.wishlistEntries(
    userId,
    wishlistId,
    token,
    language,
    currency,
    { sort: '-createdAt', limit: 100 },
  )
  return parseWishlistEntryList(response)
}

async function loadWishlistWithProducts(
  userId: string,
  token: string,
  language: ReturnType<typeof useLocale>['language'],
  currency: Currency,
  wishlistId: string | null,
): Promise<WishlistViewModel | null> {
  const wishlist = await fetchWishlistDocument(userId, token, wishlistId)
  if (!wishlist) return null

  const entries = await fetchWishlistEntries(userId, wishlist._id, token, language, currency)
  if (entries.length === 0) {
    return {
      wishlist,
      lines: [],
      itemCount: 0,
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

  return {
    wishlist,
    lines,
    itemCount: lines.length,
  }
}

export async function ensureWishlist(userId: string, token: string): Promise<Wishlist> {
  const storedWishlistId = useWishlistStore.getState().wishlistId
  const existing = await fetchWishlistDocument(userId, token, storedWishlistId)
  if (existing) return existing

  const response = await endpoints.createWishlist(userId, token)
  const wishlist = parseWishlistResponse(response)
  useWishlistStore.getState().setWishlistId(wishlist._id)
  return wishlist
}

export function useWishlist() {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const wishlistId = useWishlistStore((state) => state.wishlistId)
  const { language, currency } = useLocale()

  return useQuery({
    queryKey: wishlistQueryKey(user?._id, wishlistId, language, currency),
    queryFn: () => loadWishlistWithProducts(user!._id, token!, language, currency, wishlistId),
    enabled: Boolean(token && user?._id),
  })
}

export function useWishlistItemCount() {
  const { data } = useWishlist()
  return data?.itemCount ?? 0
}

export function useIsInWishlist(productId: string) {
  const { data } = useWishlist()
  return data?.lines.some((line) => line.product._id === productId) ?? false
}

export function useRemoveWishlistEntry() {
  const queryClient = useQueryClient()
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const wishlistId = useWishlistStore((state) => state.wishlistId)
  const { language, currency } = useLocale()
  const queryKey = wishlistQueryKey(user?._id, wishlistId, language, currency)

  return useMutation({
    mutationFn: async (entryId: string) => {
      if (!token || !user || !wishlistId) return
      await endpoints.deleteWishlistEntry(
        user._id,
        wishlistId,
        entryId,
        token,
        language,
        currency,
      )
    },
    onMutate: async (entryId) => {
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData<WishlistViewModel | null>(queryKey)
      queryClient.setQueryData<WishlistViewModel | null>(queryKey, (current) => {
        if (!current) return current

        const lines = current.lines.filter((line) => line.entry._id !== entryId)
        return {
          ...current,
          lines,
          itemCount: lines.length,
        }
      })

      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['wishlist', user?._id] })
    },
    onSuccess: () => {
      showToast(translate(useLocaleStore.getState().language, 'toast.removedFromWishlist'))
    },
  })
}

export function useToggleWishlist() {
  const queryClient = useQueryClient()
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const wishlistId = useWishlistStore((state) => state.wishlistId)
  const { language, currency } = useLocale()
  const queryKey = wishlistQueryKey(user?._id, wishlistId, language, currency)

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!token || !user) {
        throw new Error('Authentication required')
      }

      const wishlist = await ensureWishlist(user._id, token)
      useWishlistStore.getState().setWishlistId(wishlist._id)

      const cached = queryClient.getQueryData<WishlistViewModel | null>(queryKey)
      const existing = cached?.lines.find((line) => line.product._id === productId)

      if (existing) {
        await endpoints.deleteWishlistEntry(
          user._id,
          wishlist._id,
          existing.entry._id,
          token,
          language,
          currency,
        )
        return { action: 'removed' as const, productId }
      }

      const response = await endpoints.addWishlistEntry(
        user._id,
        wishlist._id,
        token,
        language,
        currency,
        { product: productId },
      )
      parseWishlistEntryResponse(response)
      return { action: 'added' as const, productId }
    },
    onSuccess: (result) => {
      const language = useLocaleStore.getState().language
      showToast(
        translate(
          language,
          result.action === 'added' ? 'toast.addedToWishlist' : 'toast.removedFromWishlist',
        ),
      )
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['wishlist', user?._id] })
    },
  })
}
