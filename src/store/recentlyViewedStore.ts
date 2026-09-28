import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

/** Kept short: this is a way back to something you were just looking at, not
 *  a browsing history. Eight fills one rail without needing to scroll far. */
export const RECENTLY_VIEWED_LIMIT = 8

interface RecentlyViewedState {
  productIds: string[]
  recordView: (productId: string) => void
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      productIds: [],
      recordView: (productId) =>
        set((state) => {
          // Already the most recent? Leave the array alone so subscribers do
          // not re-render on every revisit of the same product.
          if (state.productIds[0] === productId) return state

          return {
            productIds: [
              productId,
              ...state.productIds.filter((id) => id !== productId),
            ].slice(0, RECENTLY_VIEWED_LIMIT),
          }
        }),
    }),
    {
      name: 'campfire-recently-viewed',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
