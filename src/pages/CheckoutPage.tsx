import { CheckoutView } from '@/components/checkout/CheckoutView'
import { usePageTitle } from '@/hooks/usePageTitle'

export function CheckoutPage() {
  usePageTitle('documentTitle.checkout')
  return <CheckoutView />
}
