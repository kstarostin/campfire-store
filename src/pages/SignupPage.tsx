import { Navigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from '@/i18n'

export function SignupPage() {
  const { language } = useTranslation()
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')
  const params = new URLSearchParams({ register: '1' })

  if (returnUrl) {
    params.set('returnUrl', returnUrl)
  }

  return <Navigate to={`/${language}/login?${params.toString()}`} replace />
}
