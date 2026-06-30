import { Check } from 'lucide-react'
import type { Address } from '@/api/types'
import { useLocale } from '@/hooks/useLocale'
import { useTranslation } from '@/i18n'
import {
  formatAddressLine,
  formatRecipientName,
  getAddressDisplayLabel,
  isSameAddress,
} from '@/lib/address'

interface CheckoutAddressOptionsProps {
  addresses: Address[]
  selectedAddress: Address | null
  onSelect: (address: Address) => void
}

export function CheckoutAddressOptions({
  addresses,
  selectedAddress,
  onSelect,
}: CheckoutAddressOptionsProps) {
  const { t } = useTranslation()
  const { language } = useLocale()

  return (
    <div className="address-options">
      {addresses.map((address, index) => {
        const isSelected = selectedAddress ? isSameAddress(address, selectedAddress) : false
        const label = getAddressDisplayLabel(
          address,
          t('account.addressFallback', { index: index + 1 }),
        )

        return (
          <label key={address._id ?? `${address.street}-${index}`} className="address-option">
            <input
              type="radio"
              name="delivery-address"
              checked={isSelected}
              onChange={() => onSelect(address)}
            />
            <span className="address-option__card">
              <span className="address-option__check" aria-hidden="true">
                <Check size={10} />
              </span>
              <span className="address-option__body">
                <span className="address-option__label">{label}</span>
                <span className="address-name">{formatRecipientName(address, language)}</span>
                <span className="address-sep" aria-hidden="true">
                  ·
                </span>
                <span className="address-line">{formatAddressLine(address)}</span>
                {address.phone ? (
                  <>
                    <span className="address-sep" aria-hidden="true">
                      ·
                    </span>
                    <span className="address-phone">{address.phone}</span>
                  </>
                ) : null}
              </span>
            </span>
          </label>
        )
      })}
    </div>
  )
}
