import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface CartState {
  cartId: string | null
  setCartId: (cartId: string | null) => void
  clearCartId: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartId: null,
      setCartId: (cartId) => set({ cartId }),
      clearCartId: () => set({ cartId: null }),
    }),
    {
      name: 'campfire-cart',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
