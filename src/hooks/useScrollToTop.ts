import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Resets scroll when the route changes.
 *
 * React Router keeps the window where it was, so following a link from the
 * foot of a long page dropped you into the middle — or the bottom — of the next
 * one. Most visible on mobile, where pages are tallest.
 *
 * Three things it deliberately does not do:
 *  - POP (back/forward) is left alone, so the browser's own scroll restoration
 *    still returns you to where you were.
 *  - A URL with a hash is left to `useHashScroll`, which scrolls to the target.
 *  - Search-string changes are ignored. Catalog filters and sort rewrite the
 *    query constantly; resetting on those would yank the page from under
 *    someone using the filter bar half way down.
 *
 * That last one is why the previous path is tracked in a ref rather than left
 * to the effect's dependencies: a filter rewrite flips `navigationType` to
 * REPLACE, which re-ran the effect on its own and scrolled to the top with the
 * path unchanged.
 */
export function useScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (pathname === previousPathname.current) return

    previousPathname.current = pathname

    if (navigationType === 'POP' || hash) return

    window.scrollTo(0, 0)
  }, [pathname, hash, navigationType])
}
