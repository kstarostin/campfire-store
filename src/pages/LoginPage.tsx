import { Navigate, useSearchParams } from 'react-router-dom'
import { AuthForm } from '@/components/auth/AuthForm'
import { useTranslation } from '@/i18n'
import { useIsAuthenticated } from '@/store/authStore'

export function LoginPage() {
  const { language } = useTranslation()
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')
  const initialRegisterMode = searchParams.get('register') === '1'
  const isAuthenticated = useIsAuthenticated()

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
