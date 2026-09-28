import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { isLanguage, localizedPath } from '@/lib/localePath'
import { useLocaleStore } from '@/store/localeStore'

export function LocaleRoute() {
  const { lang } = useParams<{ lang: string }>()
  const location = useLocation()
  const setLanguage = useLocaleStore((state) => state.setLanguage)
  const storedLanguage = useLocaleStore((state) => state.language)
  const isValid = !!lang && isLanguage(lang)

  // Here rather than in the layouts: AppLayout and AuthLayout unmount when you
  // move between them, which reset the hook's memory of the previous path and
  // left it unable to tell that the route had changed at all.
  useScrollToTop()

  useEffect(() => {
    if (isValid) {
      setLanguage(lang)
    }
  }, [isValid, lang, setLanguage])

  if (!isValid) {
    const target = `${localizedPath(storedLanguage, location.pathname)}${location.search}${location.hash}`
    return <Navigate to={target} replace />
  }

  return <Outlet />
}
