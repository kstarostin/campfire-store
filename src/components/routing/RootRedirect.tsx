import { Navigate } from 'react-router-dom'
import { useLocaleStore } from '@/store/localeStore'

export function RootRedirect() {
  const language = useLocaleStore((state) => state.language)
  return <Navigate to={`/${language}`} replace />
}
