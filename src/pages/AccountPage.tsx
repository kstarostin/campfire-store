import { AccountView } from '@/components/account/AccountView'
import { usePageTitle } from '@/hooks/usePageTitle'

export function AccountPage() {
  usePageTitle('documentTitle.account')
  return <AccountView />
}
