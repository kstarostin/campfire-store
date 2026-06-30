import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { isLanguage, localizedPath } from '@/lib/localePath'
import { useLocaleStore } from '@/store/localeStore'

export function LocaleRoute() {
  const { lang } = useParams<{ lang: string }>()
  const location = useLocation()
  const setLanguage = useLocaleStore((state) => state.setLanguage)
  const storedLanguage = useLocaleStore((state) => state.language)
  const isValid = !!lang && isLanguage(lang)

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
