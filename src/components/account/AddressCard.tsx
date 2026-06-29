import { Home, Pencil, Plus, Trash2 } from 'lucide-react'
import type { Address } from '@/api/types'
import { useTranslation } from '@/i18n'

interface AddressCardProps {
  address: Address
  label: string
  isPrimary?: boolean
  onEdit: () => void
  onDelete: () => void
}

export function AddressCard({
  address,
  label,
  isPrimary = false,
  onEdit,
  onDelete,
}: AddressCardProps) {
  const { t } = useTranslation()

  const streetLine = [address.street, address.house].filter(Boolean).join(' ')
  const cityLine = [address.postalCode, address.town].filter(Boolean).join(' ')

  return (
    <article className="address-card">
      <div className="address-card__top">
        <span className="address-card__label">
          {isPrimary ? <Home size={12} aria-hidden /> : null}
          {label}
        </span>
        <div className="address-card__actions">
          <button type="button" onClick={onEdit} aria-label={t('account.editAddress')}>
            <Pencil size={16} aria-hidden />
          </button>
          <button type="button" onClick={onDelete} aria-label={t('account.deleteAddress')}>
            <Trash2 size={16} aria-hidden />
          </button>
        </div>
      </div>

      <div className="address-card__body">
        <div className="address-card__section">
          <p className="address-name">{address.name}</p>
        </div>

        <div className="address-card__section">
          {streetLine ? <p>{streetLine}</p> : null}
          {cityLine ? <p>{cityLine}</p> : null}
          {address.country ? <p>{address.country}</p> : null}
        </div>

        <div className="address-card__section address-card__section--phone">
          {address.phone ? (
            <p className="address-phone">{address.phone}</p>
          ) : (
            <p className="address-phone address-phone--empty" aria-hidden>
              &nbsp;
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

interface AddressAddCardProps {
  label: string
  onClick: () => void
}

export function AddressAddCard({ label, onClick }: AddressAddCardProps) {
  return (
    <button type="button" className="address-card address-card--add" onClick={onClick}>
      <span>
        <Plus size={18} aria-hidden />
        {label}
      </span>
    </button>
  )
}
