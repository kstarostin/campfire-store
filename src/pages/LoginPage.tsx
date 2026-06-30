import { Navigate, useSearchParams } from 'react-router-dom'
import { AuthForm } from '@/components/auth/AuthForm'
import { useAuthHydration } from '@/hooks/useAuthHydration'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTranslation } from '@/i18n'
import { useIsAuthenticated } from '@/store/authStore'
import { LoadingState } from '@/components/ui/LoadingState'

export function LoginPage() {
  const { language } = useTranslation()
  usePageTitle('documentTitle.login')
  const hydrated = useAuthHydration()
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')
  const initialRegisterMode = searchParams.get('register') === '1'
  const isAuthenticated = useIsAuthenticated()

  if (!hydrated) {
    return (
      <div className="auth-page">
        <LoadingState />
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={returnUrl ? decodeURIComponent(returnUrl) : `/${language}/account`}
        replace
      />
    )
  }

  return (
    <div className="auth-page">
      <AuthForm initialRegisterMode={initialRegisterMode} returnUrl={returnUrl} />
    </div>
  )
}
