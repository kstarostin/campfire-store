import { MapPin } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTranslation } from '@/i18n'

export function CheckoutAddressEmpty() {
  const { t } = useTranslation()

  return (
    <EmptyState
      className="checkout-address-empty"
      icon={MapPin}
      title={t('checkout.noAddressTitle')}
      description={t('checkout.noAddressBody')}
      action={{ label: t('checkout.addAddress'), to: '/account?panel=addresses' }}
      secondaryAction={{ label: t('checkout.backToCart'), to: '/cart', variant: 'secondary' }}
    />
  )
}
