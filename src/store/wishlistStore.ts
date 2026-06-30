import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface WishlistState {
  wishlistId: string | null
  setWishlistId: (wishlistId: string | null) => void
  clearWishlistId: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      wishlistId: null,
      setWishlistId: (wishlistId) => set({ wishlistId }),
      clearWishlistId: () => set({ wishlistId: null }),
    }),
    {
      name: 'campfire-wishlist',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
