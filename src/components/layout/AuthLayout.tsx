import { Outlet } from 'react-router-dom'
import { LocaleLink } from '@/components/ui/LocaleLink'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { ToastStack } from '@/components/ui/ToastStack'
import { useTranslation } from '@/i18n'

export function AuthLayout() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <header className="border-b border-header-border bg-[rgb(28_25_23/96%)] text-header-text">
        <Container wide>
          <div className="flex min-h-[var(--header-height)] items-center">
            <LocaleLink
              to="/"
              className="flex leading-none"
              aria-label={t('common.homeAria')}
            >
              <img
                src="/img/campfire_logo_light.png"
                alt={t('common.storeName')}
                className="block h-12 w-auto -translate-y-[0.4rem]"
              />
            </LocaleLink>
          </div>
        </Container>
      </header>
      <main className="site-container flex flex-1 justify-center py-10">
        <Outlet />
      </main>
      <Footer />
      <ToastStack />
    </div>
  )
}
