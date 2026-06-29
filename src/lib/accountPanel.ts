export type AccountPanel = 'profile' | 'addresses' | 'orders' | 'wishlist'

const ACCOUNT_PANELS = new Set<AccountPanel>(['profile', 'addresses', 'orders', 'wishlist'])

export function isAccountPanel(value: string | null | undefined): value is AccountPanel {
  return Boolean(value && ACCOUNT_PANELS.has(value as AccountPanel))
}

export function parseAccountPanel(value: string | null): AccountPanel {
  return isAccountPanel(value) ? value : 'profile'
}

export function accountPanelPath(panel: AccountPanel): string {
  return panel === 'profile' ? '/account' : `/account?panel=${panel}`
}
