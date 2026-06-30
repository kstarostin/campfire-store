import { useTranslation } from '@/i18n'

const MAX_LENGTH = 512

interface CheckoutDeliveryNoteProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function CheckoutDeliveryNote({
  value,
  onChange,
  disabled = false,
}: CheckoutDeliveryNoteProps) {
  const { t } = useTranslation()

  return (
    <div className="field checkout-delivery-note">
      <label htmlFor="checkout-delivery-note">{t('checkout.deliveryNoteLabel')}</label>
      <textarea
        id="checkout-delivery-note"
        name="deliveryNote"
        rows={3}
        maxLength={MAX_LENGTH}
        value={value}
        disabled={disabled}
        placeholder={t('checkout.deliveryNotePlaceholder')}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="field-hint">{t('checkout.deliveryNoteHint')}</p>
    </div>
  )
}
