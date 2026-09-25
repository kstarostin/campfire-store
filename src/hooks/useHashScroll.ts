import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router ignores the URL hash, so an in-app link to `/#categories` would
 * otherwise land at the top of the page. Scrolling waits a frame for the target
 * to be in the DOM; the header offset comes from `scroll-margin-top` in CSS
 * rather than arithmetic here.
 */
export function useHashScroll() {
  const { hash, key } = useLocation()

  useEffect(() => {
    if (!hash) return

    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    })

    return () => cancelAnimationFrame(frame)
  }, [hash, key])
}
