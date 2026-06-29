import type { Address } from '@/api/types'
import { useTranslation } from '@/i18n'

export const emptyAddress = (): Address => ({
  name: '',
  phone: '',
  street: '',
  house: '',
  postalCode: '',
  town: '',
  country: '',
})

interface AddressFormProps {
  value: Address
  onChange: (value: Address) => void
  onSubmit: () => void
  onCancel: () => void
  isSubmitting?: boolean
  submitLabel: string
}

export function AddressForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel,
}: AddressFormProps) {
  const { t } = useTranslation()

  const updateField = (field: keyof Address, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue })
  }

  return (
    <form
      className="address-form"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className="address-form__grid">
        <div className="field">
          <label htmlFor="address-name">{t('account.addressFields.name')}</label>
          <input
            id="address-name"
            value={value.name}
            onChange={(event) => updateField('name', event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="address-phone">{t('account.addressFields.phone')}</label>
          <input
            id="address-phone"
            type="tel"
            autoComplete="tel"
            value={value.phone ?? ''}
            onChange={(event) => updateField('phone', event.target.value)}
          />
        </div>
        <div className="field address-form__field--wide">
          <label htmlFor="address-street">{t('account.addressFields.street')}</label>
          <input
            id="address-street"
            autoComplete="address-line1"
            value={value.street}
            onChange={(event) => updateField('street', event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="address-house">{t('account.addressFields.house')}</label>
          <input
            id="address-house"
            value={value.house ?? ''}
            onChange={(event) => updateField('house', event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="address-postal">{t('account.addressFields.postalCode')}</label>
          <input
            id="address-postal"
            autoComplete="postal-code"
            value={value.postalCode}
            onChange={(event) => updateField('postalCode', event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="address-town">{t('account.addressFields.town')}</label>
          <input
            id="address-town"
            autoComplete="address-level2"
            value={value.town}
            onChange={(event) => updateField('town', event.target.value)}
            required
          />
        </div>
        <div className="field address-form__field--wide">
          <label htmlFor="address-country">{t('account.addressFields.country')}</label>
          <input
            id="address-country"
            autoComplete="country-name"
            value={value.country}
            onChange={(event) => updateField('country', event.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <ButtonRow onCancel={onCancel} onSubmitLabel={submitLabel} isSubmitting={isSubmitting} />
      </div>
    </form>
  )
}

function ButtonRow({
  onCancel,
  onSubmitLabel,
  isSubmitting,
}: {
  onCancel: () => void
  onSubmitLabel: string
  isSubmitting: boolean
}) {
  const { t } = useTranslation()

  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
        {t('common.cancel')}
      </button>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {onSubmitLabel}
      </button>
    </>
  )
}
