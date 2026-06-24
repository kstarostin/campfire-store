import { ChevronDown, Heart, Menu, ShoppingCart, User } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { LocalePill } from '@/components/layout/LocalePill'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { MobileNav } from '@/components/layout/MobileNav'
import { SearchField } from '@/components/layout/SearchField'
import { useIsAuthenticated } from '@/store/authStore'

export function Header() {
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
        <Container>
          <div className="flex min-h-[var(--header-height)] items-center gap-2 md:gap-4">
            <Link
              to="/"
              className="flex leading-none"
              aria-label="Campfire Store home"
            >
              <img
                src="/img/campfire_logo_light.png"
                alt="Campfire Store"
                className="block h-12 w-auto -translate-y-[0.4rem]"
              />
            </Link>

            <nav className="ml-4 hidden items-center gap-5 text-[0.9375rem] font-medium md:flex" aria-label="Main">
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
                Categories
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

              <Link
                to="/wishlist"
                className="header-icon-btn hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full md:inline-flex"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              <Link
                to="/cart"
                className="header-icon-btn relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 ? (
                  <span className="absolute right-[0.2rem] top-[0.2rem] min-w-[1.125rem] rounded-full bg-primary px-1 text-center text-[0.6875rem] font-semibold leading-[1.125rem] text-white">
                    {cartCount}
                  </span>
                ) : null}
              </Link>

              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="header-icon-btn hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full md:inline-flex"
                aria-label={isAuthenticated ? 'Account' : 'Sign in'}
              >
                <User size={20} />
              </Link>

              <button
                type="button"
                className="header-icon-btn inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full md:hidden"
                aria-label="Menu"
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
