import { ChevronDown, Heart, Menu, ShoppingCart, User } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { LocaleLink } from '@/components/ui/LocaleLink'
import { Container } from '@/components/layout/Container'
import { LocalePill } from '@/components/layout/LocalePill'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { MobileNav } from '@/components/layout/MobileNav'
import { SearchField } from '@/components/layout/SearchField'
import { useTranslation } from '@/i18n'
import { userPhotoUrl } from '@/lib/imageUrl'
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
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAuthenticated = useIsAuthenticated()
  const cartCount = 0

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
        className={`sticky top-0 z-30 border-b bg-[rgb(28_25_23/96%)] text-header-text backdrop-blur-[10px] ${
          megaOpen ? 'border-transparent' : 'border-header-border'
        }`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <Container wide>
          <div className="flex min-h-[var(--header-height)] items-center gap-2 md:gap-4">
            <LocaleLink
              to="/"
              className="flex leading-none"
              aria-label={t('common.homeAria')}
            >
              <img
                src="/img/campfire_logo_light.png"
                alt={t('common.storeName')}
                className="block h-9 w-auto -translate-y-[0.3rem] md:h-12 md:-translate-y-[0.4rem]"
              />
            </LocaleLink>

            <nav
              className="ml-4 hidden items-center gap-5 text-[0.9375rem] font-medium md:flex"
              aria-label={t('nav.main')}
            >
              <button
                type="button"
                className={`inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-inherit font-medium text-inherit hover:text-[#fdba74] ${
                  megaOpen ? 'text-[#fdba74]' : ''
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

            <SearchField />

            <div className="ml-auto flex shrink-0 items-center gap-1">
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

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
