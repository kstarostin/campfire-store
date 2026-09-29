import { useLocation } from 'react-router-dom'
import { stripLangPrefix } from '@/lib/localePath'

/** True on the locale-prefixed home page (`/en`, `/de`) — the only place the
 *  home section anchors have anything to point at. */
export function useIsHomePage() {
  const { pathname } = useLocation()
  return stripLangPrefix(pathname) === '/'
}
