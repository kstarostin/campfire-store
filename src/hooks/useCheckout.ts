import { useMutation, useQueryClient } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import { parseOrderResponse } from '@/api/normalizers'
import type { Address, Order } from '@/api/types'
import { useLocale } from '@/hooks/useLocale'
import { toApiAddress } from '@/lib/address'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

interface PlaceOrderInput {
  cartId: string
  deliveryAddress: Address
  billingAddress: Address
  deliveryNote?: string
}

export function usePlaceOrder() {
  const queryClient = useQueryClient()
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const { language, currency } = useLocale()

  return useMutation({
    mutationFn: async ({
      cartId,
      deliveryAddress,
      billingAddress,
      deliveryNote,
    }: PlaceOrderInput): Promise<Order> => {
      if (!token || !user) {
        throw new Error('Authentication required')
      }

      const trimmedNote = deliveryNote?.trim() ?? ''

      await endpoints.updateCart(user._id, cartId, token, language, currency, {
        deliveryAddress: toApiAddress(deliveryAddress),
        billingAddress: toApiAddress(billingAddress),
        deliveryNote: trimmedNote,
      })

      const response = await endpoints.placeOrder(user._id, token, { cartId })
      return parseOrderResponse(response)
    },
    onSuccess: async () => {
      useCartStore.getState().clearCartId()
      await queryClient.invalidateQueries({ queryKey: ['cart', user?._id] })
      await queryClient.invalidateQueries({ queryKey: ['orders', user?._id] })
    },
  })
}
