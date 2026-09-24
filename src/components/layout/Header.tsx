import { ChevronDown, Heart, Menu, ShoppingCart, User } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LocaleLink } from '@/components/ui/LocaleLink'
import { Container } from '@/components/layout/Container'
import { LocalePill } from '@/components/layout/LocalePill'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { MobileNav } from '@/components/layout/MobileNav'
import { SearchField } from '@/components/layout/SearchField'
import { useCartItemCount } from '@/hooks/useCart'
import { useTranslation } from '@/i18n'
import { userPhotoUrl } from '@/lib/imageUrl'
import { stripLangPrefix } from '@/lib/localePath'
import { useAuthStore, useIsAuthenticated } from '@/store/authStore'

function HeaderAccountIcon() {
  const isAuthenticated = useIsAuthenticated()
  const user = useAuthStore((state) => state.user)

  if (!isAuthenticated) {
    return <User size={20} aria-hidden />
  }

  const photoSrc = user ? userPhotoUrl(user.photo, 'thumbnail') : ''
  const initials = user?.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (photoSrc) {
    return <img src={photoSrc} alt="" className="header-account-avatar" width={40} height={40} />
  }

  if (initials) {
    return (
      <span className="header-account-avatar header-account-avatar--initials" aria-hidden>
        {initials}
      </span>
    )
  }

  return <User size={20} aria-hidden />
}

export function Header() {
  const { t } = useTranslation()
  const megaMenuId = useId()
  const headerRef = useRef<HTMLElement>(null)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAuthenticated = useIsAuthenticated()
  const cartCount = useCartItemCount()
  const location = useLocation()

  // Pages with a full-height hero let the header overlay it transparently; the
  // solid bar only takes over once the hero has scrolled fully out of view.
  const overlaysHero = stripLangPrefix(location.pathname) === '/'
  const [revealed, setRevealed] = useState(!overlaysHero)

  useEffect(() => {
    if (!overlaysHero) {
      setRevealed(true)
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const hero = document.querySelector('.hero')
      // No hero rendered (loading/error state) — fall back to the solid bar.
      setRevealed(hero ? hero.getBoundingClientRect().bottom <= 0 : true)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [overlaysHero, location.pathname])

  useEffect(() => {
    if (!megaOpen) return

    const handleClick = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMegaOpen(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [megaOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header
        ref={headerRef}
        className={[
          'z-30 border-b text-header-text',
          overlaysHero
            ? revealed
              ? 'site-header--revealed fixed inset-x-0 top-0 bg-[rgb(10_50_72/96%)] backdrop-blur-[10px]'
              : 'site-header--overlay absolute inset-x-0 top-0 border-transparent bg-transparent'
            : 'sticky top-0 bg-[rgb(10_50_72/96%)] backdrop-blur-[10px]',
          megaOpen || (overlaysHero && !revealed) ? 'border-transparent' : 'border-header-border',
        ].join(' ')}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <Container wide>
          {/* Three groups on one row: the outer two flex-1 so the brand between
              them lands optically centred regardless of their differing widths. */}
          <div className="relative flex min-h-[var(--header-height)] items-center gap-2 md:gap-4">
            <nav
              className="hidden min-w-0 flex-1 items-center gap-5 text-[0.9375rem] font-medium md:flex"
              aria-label={t('nav.main')}
            >
              <button
                type="button"
                className={`inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-inherit font-semibold uppercase tracking-[0.06em] text-inherit hover:text-[#ff7a33] ${
                  megaOpen ? 'text-[#ff7a33]' : ''
                }`}
                aria-expanded={megaOpen}
                aria-controls={megaMenuId}
                onClick={(event) => {
                  event.stopPropagation()
                  setMegaOpen((value) => !value)
                }}
                onMouseEnter={() => setMegaOpen(true)}
              >
                {t('nav.explore')}
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-150 ${megaOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
            </nav>

            <LocaleLink
              to="/"
              className="flex shrink-0 leading-none md:absolute md:left-1/2 md:-translate-x-1/2"
              aria-label={t('common.homeAria')}
            >
              <img
                src="/img/campfire_logo_light.png"
                alt={t('common.storeName')}
                className="block h-9 w-auto -translate-y-[0.3rem] md:h-12 md:-translate-y-[0.4rem]"
              />
            </LocaleLink>

            <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 md:max-w-[calc(50%-7rem)]">
              <SearchField />
              <LocalePill />

              {isAuthenticated ? (
                <>
                  <LocaleLink
                    to="/account?panel=wishlist"
                    className="header-icon-btn hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full md:inline-flex"
                    aria-label={t('nav.wishlist')}
                  >
                    <Heart size={20} />
                  </LocaleLink>

                  <LocaleLink
                    to="/cart"
                    className="header-icon-btn relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                    aria-label={t('nav.cart')}
                  >
                    <ShoppingCart size={20} />
                    {cartCount > 0 ? (
                      <span className="absolute right-[0.2rem] top-[0.2rem] min-w-[1.125rem] rounded-full bg-primary px-1 text-center text-[0.6875rem] font-semibold leading-[1.125rem] text-white">
                        {cartCount}
                      </span>
                    ) : null}
                  </LocaleLink>
                </>
              ) : null}

              <LocaleLink
                to={isAuthenticated ? '/account' : '/login'}
                className="header-icon-btn hidden h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full p-0 md:inline-flex"
                aria-label={isAuthenticated ? t('nav.account') : t('nav.signIn')}
              >
                <HeaderAccountIcon />
              </LocaleLink>

              <button
                ref={mobileMenuButtonRef}
                type="button"
                className="header-icon-btn inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full md:hidden"
                aria-label={t('nav.menu')}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </Container>

        <MegaMenu open={megaOpen} id={megaMenuId} />
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        returnFocusRef={mobileMenuButtonRef}
      />
    </>
  )
}
