import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AccountAddressesPanel } from '@/components/account/AccountAddressesPanel'
import { AccountMobileBar } from '@/components/account/AccountMobileBar'
import { AccountOrdersPanel } from '@/components/account/AccountOrdersPanel'
import { AccountProfilePanel } from '@/components/account/AccountProfilePanel'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { AccountWishlistPanel } from '@/components/account/AccountWishlistPanel'
import { CatalogBreadcrumb } from '@/components/catalog/CatalogPageHeader'
import { Container } from '@/components/layout/Container'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useAccountUser } from '@/hooks/useAccount'
import { useAccountSignOut } from '@/hooks/useAccountSignOut'
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
  const { data: user, isLoading, isError, refetch } = useAccountUser()
  const signOut = useAccountSignOut()
  const [signOutOpen, setSignOutOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const activePanel = parseAccountPanel(searchParams.get('panel'))

  const setActivePanel = (panel: AccountPanel) => {
    if (panel === 'profile') {
      setSearchParams({}, { replace: true })
      return
    }
    setSearchParams({ panel }, { replace: true })
  }

  const handleConfirmSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      setSignOutOpen(false)
    } finally {
      setIsSigningOut(false)
    }
  }

  if (isLoading && !user) {
    return (
      <Container className="account-page">
        <div className="account-page-loading">
          <LoadingState label={t('account.loading')} />
        </div>
      </Container>
    )
  }

  if (isError || !user) {
    return (
      <Container className="account-page">
        <div className="account-page-error">
          <ErrorState message={t('account.loadError')} onRetry={() => refetch()} />
        </div>
      </Container>
    )
  }

  return (
    <>
      <Container className="account-page has-mobile-nav">
        <CatalogBreadcrumb items={[{ label: t('pages.account') }]} />

        <header className="account-header">
          <h1>{t('pages.account')}</h1>
          <p>{t('account.pageDescription')}</p>
        </header>

        <div className="account-shell">
          <AccountSidebar
            activePanel={activePanel}
            onPanelChange={setActivePanel}
            onSignOutRequest={() => setSignOutOpen(true)}
          />

          <div className="account-main">
            <AccountPanelContent panel={activePanel} />
          </div>
        </div>
      </Container>

      <AccountMobileBar
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        onSignOutRequest={() => setSignOutOpen(true)}
      />

      <ConfirmDialog
        open={signOutOpen}
        title={t('account.signOutConfirmTitle')}
        description={t('account.signOutConfirmBody')}
        confirmLabel={t('account.signOut')}
        onConfirm={handleConfirmSignOut}
        onCancel={() => setSignOutOpen(false)}
        isPending={isSigningOut}
        variant="danger"
      />
    </>
  )
}
