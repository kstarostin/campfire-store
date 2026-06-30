import { Heart, LogOut, MapPin, Package, UserRound } from 'lucide-react'
import type { AccountPanel } from '@/lib/accountPanel'
import { useTranslation } from '@/i18n'

interface AccountMobileBarProps {
  activePanel: AccountPanel
  onPanelChange: (panel: AccountPanel) => void
  onSignOutRequest: () => void
}

const NAV_ITEMS: {
  panel: AccountPanel
  icon: typeof UserRound
  labelKey: 'account.profile' | 'account.addresses' | 'pages.orders' | 'nav.wishlist'
}[] = [
  { panel: 'profile', icon: UserRound, labelKey: 'account.profile' },
  { panel: 'addresses', icon: MapPin, labelKey: 'account.addresses' },
  { panel: 'orders', icon: Package, labelKey: 'pages.orders' },
  { panel: 'wishlist', icon: Heart, labelKey: 'nav.wishlist' },
]

export function AccountMobileBar({
  activePanel,
  onPanelChange,
  onSignOutRequest,
}: AccountMobileBarProps) {
  const { t } = useTranslation()

  return (
    <nav className="account-mobile-bar" aria-label={t('account.mobileNavLabel')}>
      {NAV_ITEMS.map(({ panel, icon: Icon, labelKey }) => {
        const label = t(labelKey)
        const isActive = activePanel === panel

        return (
          <button
            key={panel}
            type="button"
            className={isActive ? 'is-active' : undefined}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onPanelChange(panel)}
          >
            <Icon size={22} aria-hidden />
          </button>
        )
      })}

      <button
        type="button"
        className="account-mobile-bar__sign-out"
        aria-label={t('account.signOut')}
        onClick={onSignOutRequest}
      >
        <LogOut size={22} aria-hidden />
      </button>
    </nav>
  )
}
