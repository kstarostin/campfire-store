import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { LoadingState } from '@/components/ui/LoadingState'
import { useAuthHydration } from '@/hooks/useAuthHydration'
import { isLanguage } from '@/lib/localePath'
import { useLocaleStore } from '@/store/localeStore'
import { useIsAuthenticated } from '@/store/authStore'

export function ProtectedRoute() {
  const hydrated = useAuthHydration()
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()
  const { lang } = useParams<{ lang: string }>()
  const storedLanguage = useLocaleStore((state) => state.language)
  const language = isLanguage(lang ?? '') ? lang : storedLanguage

  if (!hydrated) {
    return (
      <div className="protected-route-loading">
        <LoadingState />
      </div>
    )
  }

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search)
    return (
      <Navigate
        to={`/${language}/login?returnUrl=${returnUrl}`}
        replace
      />
    )
  }

  return <Outlet />
}
