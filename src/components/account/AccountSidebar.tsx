import type { ReactNode } from 'react'
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  UserRound,
} from 'lucide-react'
import { useAccountUser } from '@/hooks/useAccount'
import { useTranslation } from '@/i18n'
import type { AccountPanel } from '@/lib/accountPanel'
import { userPhotoUrl } from '@/lib/imageUrl'

interface AccountSidebarProps {
  activePanel: AccountPanel
  onPanelChange: (panel: AccountPanel) => void
  onSignOutRequest: () => void
}

export function AccountSidebar({
  activePanel,
  onPanelChange,
  onSignOutRequest,
}: AccountSidebarProps) {
  const { t } = useTranslation()
  const { data: user } = useAccountUser()

  if (!user) {
    return null
  }

  const photoSrc = userPhotoUrl(user.photo, 'thumbnail')
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleSignOut = () => onSignOutRequest()

  const panelButton = (panel: AccountPanel, label: string, icon: ReactNode | null) => (
    <button
      type="button"
      role="tab"
      className={activePanel === panel ? 'is-active' : undefined}
      aria-selected={activePanel === panel}
      aria-controls={`panel-${panel}`}
      onClick={() => onPanelChange(panel)}
    >
      {icon}
      {label}
    </button>
  )

  const shortcutButton = (panel: AccountPanel, label: string, icon: ReactNode) => (
    <button
      type="button"
      className={activePanel === panel ? 'is-active' : undefined}
      aria-current={activePanel === panel ? 'page' : undefined}
      onClick={() => onPanelChange(panel)}
    >
      {icon}
      {label}
    </button>
  )

  return (
    <aside className="account-sidebar" aria-label={t('account.sidebarLabel')}>
      <div className="account-user-card">
        {photoSrc ? (
          <img src={photoSrc} alt="" width={44} height={44} />
        ) : (
          <span className="account-user-card__initials" aria-hidden>
            {initials}
          </span>
        )}
        <div>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
      </div>

      <ul className="account-nav" role="tablist" aria-label={t('account.sectionTabs')}>
        <li>{panelButton('profile', t('account.profile'), <UserRound size={18} aria-hidden />)}</li>
        <li>
          {panelButton('addresses', t('account.addresses'), <MapPin size={18} aria-hidden />)}
        </li>
      </ul>

      <ul className="account-shortcuts" aria-label={t('account.shortcutsLabel')}>
        <li>
          {shortcutButton('orders', t('pages.orders'), <Package size={18} aria-hidden />)}
        </li>
        <li>
          {shortcutButton('wishlist', t('nav.wishlist'), <Heart size={18} aria-hidden />)}
        </li>
      </ul>

      <button type="button" className="account-sign-out" onClick={handleSignOut}>
        <LogOut size={18} aria-hidden />
        {t('account.signOut')}
      </button>
    </aside>
  )
}
