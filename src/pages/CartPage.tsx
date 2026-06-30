import { CartView } from '@/components/cart/CartView'
import { usePageTitle } from '@/hooks/usePageTitle'

export function CartPage() {
  usePageTitle('documentTitle.cart')
  return <CartView />
}
