import type { Address, Language } from '@/api/types'
import { localizedText } from '@/lib/localizedText'

export function getAddressTitleId(title: Address['title']): string | undefined {
  if (!title) return undefined
  return typeof title === 'string' ? title : title._id
}

export function formatAddressSalutation(
  title: Address['title'],
  language: Language,
): string {
  if (!title || typeof title === 'string') return ''
  return localizedText(title.nameI18n, language) ?? ''
}

export function formatRecipientName(address: Address, language: Language): string {
  const salutation = formatAddressSalutation(address.title, language)
  return [salutation, address.name].filter(Boolean).join(' ')
}

export function formatStreetLine(address: Address): string {
  return [address.street, address.house].filter(Boolean).join(' ')
}

export function formatAddressLine(address: Address): string {
  const street = formatStreetLine(address)
  const city = [address.postalCode, address.town].filter(Boolean).join(' ')
  return [street, city, address.country].filter(Boolean).join(', ')
}

export function getAddressDisplayLabel(address: Address, fallback: string): string {
  return address.label?.trim() || fallback
}

export function toApiAddress(address: Address): Address {
  const titleId = getAddressTitleId(address.title)

  return {
    _id: address._id,
    label: address.label?.trim() || undefined,
    title: titleId,
    name: address.name,
    phone: address.phone,
    street: address.street,
    house: address.house,
    postalCode: address.postalCode,
    town: address.town,
    country: address.country,
  }
}

export function toApiAddresses(addresses: Address[]): Address[] {
  return addresses.map(toApiAddress)
}

export function isSameAddress(left: Address, right: Address): boolean {
  if (left._id && right._id) return left._id === right._id

  return (
    left.name === right.name &&
    left.street === right.street &&
    left.house === right.house &&
    left.postalCode === right.postalCode &&
    left.town === right.town &&
    left.country === right.country
  )
}
