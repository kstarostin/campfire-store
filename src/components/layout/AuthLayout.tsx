import { Link, Outlet } from 'react-router-dom'
import { Container } from '@/components/layout/Container'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <header className="border-b border-header-border bg-[rgb(28_25_23/96%)] text-header-text">
        <Container wide>
          <div className="flex min-h-[var(--header-height)] items-center">
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
          </div>
        </Container>
      </header>
      <main className="site-container flex flex-1 justify-center py-10">
        <Outlet />
      </main>
    </div>
  )
}
