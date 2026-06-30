import { Navigate, useLocation } from 'react-router-dom'
import { localizedPath } from '@/lib/localePath'
import { useLocaleStore } from '@/store/localeStore'

export function UnlocalizedPathRedirect() {
  const location = useLocation()
  const language = useLocaleStore((state) => state.language)

  const target = `${localizedPath(language, location.pathname)}${location.search}${location.hash}`

  return <Navigate to={target} replace />
}
