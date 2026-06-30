import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/i18n'
import { logoutSession } from '@/lib/authSession'

export function useAccountSignOut() {
  const { language } = useTranslation()
  const navigate = useNavigate()

  return async () => {
    await logoutSession()
    navigate(`/${language}`, { replace: true })
  }
}
