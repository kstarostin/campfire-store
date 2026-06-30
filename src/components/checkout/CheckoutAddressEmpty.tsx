import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'

export function CheckoutAddressEmpty() {
  const { t } = useTranslation()

  return (
    <div className="address-empty">
      <strong>{t('checkout.noAddressTitle')}</strong>
      {t('checkout.noAddressBody')}
      <p className="checkout-address-empty__action">
        <Button to="/account?panel=addresses">{t('checkout.addAddress')}</Button>
      </p>
    </div>
  )
}
