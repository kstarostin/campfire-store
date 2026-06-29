import { useSearchParams } from 'react-router-dom'
import { AccountAddressesPanel } from '@/components/account/AccountAddressesPanel'
import { AccountOrdersPanel } from '@/components/account/AccountOrdersPanel'
import { AccountProfilePanel } from '@/components/account/AccountProfilePanel'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { AccountWishlistPanel } from '@/components/account/AccountWishlistPanel'
import { CatalogBreadcrumb } from '@/components/catalog/CatalogPageHeader'
import { Container } from '@/components/layout/Container'
import { useAccountUser } from '@/hooks/useAccount'
import { useTranslation } from '@/i18n'
import { parseAccountPanel, type AccountPanel } from '@/lib/accountPanel'

function AccountPanelContent({ panel }: { panel: AccountPanel }) {
  switch (panel) {
    case 'addresses':
      return <AccountAddressesPanel />
    case 'orders':
      return <AccountOrdersPanel />
    case 'wishlist':
      return <AccountWishlistPanel />
    default:
      return <AccountProfilePanel />
  }
}

export function AccountView() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: user, isLoading, isError } = useAccountUser()
  const activePanel = parseAccountPanel(searchParams.get('panel'))

  const setActivePanel = (panel: AccountPanel) => {
    if (panel === 'profile') {
      setSearchParams({}, { replace: true })
      return
    }
    setSearchParams({ panel }, { replace: true })
  }

  if (isLoading && !user) {
    return (
      <Container className="account-page">
        <p className="account-page-loading">{t('account.loading')}</p>
      </Container>
    )
  }

  if (isError || !user) {
    return (
      <Container className="account-page">
        <p className="account-page-error">{t('account.loadError')}</p>
      </Container>
    )
  }

  return (
    <Container className="account-page">
      <CatalogBreadcrumb items={[{ label: t('pages.account') }]} />

      <header className="account-header">
        <h1>{t('pages.account')}</h1>
        <p>{t('account.pageDescription')}</p>
      </header>

      <div className="account-shell">
        <AccountSidebar activePanel={activePanel} onPanelChange={setActivePanel} />

        <div className="account-main">
          <AccountPanelContent panel={activePanel} />
        </div>
      </div>
    </Container>
  )
}
