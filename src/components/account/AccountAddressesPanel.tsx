import { useMemo, useState } from 'react'
import { AddressAddCard, AddressCard } from '@/components/account/AddressCard'
import { AddressForm, emptyAddress } from '@/components/account/AddressForm'
import type { Address } from '@/api/types'
import { useAccountUser, useUpdateAddresses } from '@/hooks/useAccount'
import { useTranslation } from '@/i18n'

type AddressKind = 'delivery' | 'billing'

export function AccountAddressesPanel() {
  const { t } = useTranslation()
  const { data: user } = useAccountUser()
  const updateAddresses = useUpdateAddresses()
  const [activeKind, setActiveKind] = useState<AddressKind>('delivery')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formValue, setFormValue] = useState<Address>(emptyAddress())
  const [error, setError] = useState<string | null>(null)

  const deliveryAddresses = useMemo(
    () => user?.deliveryAddresses ?? [],
    [user?.deliveryAddresses],
  )
  const billingAddresses = useMemo(
    () => user?.billingAddresses ?? [],
    [user?.billingAddresses],
  )

  if (!user) {
    return <p className="account-panel-loading">{t('common.loading')}</p>
  }

  const addresses = activeKind === 'delivery' ? deliveryAddresses : billingAddresses

  const addressLabel = (index: number) =>
    index === 0 ? t('account.addressPrimary') : t('account.addressSecondary', { index: index + 1 })

  const resetForm = () => {
    setEditingIndex(null)
    setIsAdding(false)
    setFormValue(emptyAddress())
    setError(null)
  }

  const switchKind = (kind: AddressKind) => {
    setActiveKind(kind)
    resetForm()
  }

  const persistAddresses = async (nextAddresses: Address[]) => {
    setError(null)

    try {
      if (activeKind === 'delivery') {
        await updateAddresses.mutateAsync({ deliveryAddresses: nextAddresses })
      } else {
        await updateAddresses.mutateAsync({ billingAddresses: nextAddresses })
      }
      resetForm()
    } catch {
      setError(t('account.addressSaveError'))
    }
  }

  const handleSaveForm = async () => {
    const next = [...addresses]

    if (editingIndex !== null) {
      next[editingIndex] = { ...formValue, _id: addresses[editingIndex]?._id }
    } else {
      next.push(formValue)
    }

    await persistAddresses(next)
  }

  const handleDelete = async (index: number) => {
    if (!window.confirm(t('account.deleteAddressConfirm'))) return
    const next = addresses.filter((_, itemIndex) => itemIndex !== index)
    await persistAddresses(next)
  }

  const startEdit = (index: number) => {
    setIsAdding(false)
    setEditingIndex(index)
    setFormValue({ ...addresses[index] })
    setError(null)
  }

  const startAdd = () => {
    setEditingIndex(null)
    setIsAdding(true)
    setFormValue(emptyAddress())
    setError(null)
  }

  const showForm = isAdding || editingIndex !== null

  const renderAddressList = (kind: AddressKind, list: Address[]) => {
    const addLabel =
      kind === 'delivery' ? t('account.addDeliveryAddress') : t('account.addBillingAddress')

    if (showForm && activeKind === kind) {
      return (
        <div className="address-form-panel">
          <h3>
            {editingIndex !== null ? t('account.editAddressTitle') : t('account.addAddressTitle')}
          </h3>
          <AddressForm
            value={formValue}
            onChange={setFormValue}
            onSubmit={() => void handleSaveForm()}
            onCancel={resetForm}
            isSubmitting={updateAddresses.isPending}
            submitLabel={
              editingIndex !== null ? t('account.saveAddress') : t('account.addAddress')
            }
          />
        </div>
      )
    }

    return (
      <div className="address-list">
        {list.map((address, index) => (
          <AddressCard
            key={address._id ?? `${address.street}-${index}`}
            address={address}
            label={addressLabel(index)}
            isPrimary={index === 0}
            onEdit={() => startEdit(index)}
            onDelete={() => void handleDelete(index)}
          />
        ))}
        <AddressAddCard label={addLabel} onClick={startAdd} />
      </div>
    )
  }

  return (
    <section
      className="account-panel is-active"
      id="panel-addresses"
      aria-labelledby="account-addresses-heading"
    >
      <header className="account-panel__head">
        <div>
          <h2 id="account-addresses-heading">{t('account.addressesTitle')}</h2>
          <p>{t('account.addressesDescription')}</p>
        </div>

        <div className="address-tabs" role="tablist" aria-label={t('account.addressKindTabs')}>
          <button
            type="button"
            role="tab"
            className={activeKind === 'delivery' ? 'is-active' : undefined}
            aria-selected={activeKind === 'delivery'}
            onClick={() => switchKind('delivery')}
          >
            {t('account.deliveryAddresses')}
          </button>
          <button
            type="button"
            role="tab"
            className={activeKind === 'billing' ? 'is-active' : undefined}
            aria-selected={activeKind === 'billing'}
            onClick={() => switchKind('billing')}
          >
            {t('account.billingAddresses')}
          </button>
        </div>
      </header>

      {activeKind === 'delivery'
        ? renderAddressList('delivery', deliveryAddresses)
        : renderAddressList('billing', billingAddresses)}

      {error ? (
        <p className="account-form-message account-form-message--error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  )
}
