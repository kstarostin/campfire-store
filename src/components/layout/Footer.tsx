import { LocaleLink } from '@/components/ui/LocaleLink'
import { API_BASE_URL } from '@/api/config'
import { Container } from '@/components/layout/Container'
import { LoadingState } from '@/components/ui/LoadingState'
import { useTranslation } from '@/i18n'
import { useCategories } from '@/hooks/useCategories'
import { categoryPath } from '@/lib/categoryPath'

const footerLinkClass = 'footer-link cursor-pointer text-[0.9375rem]'

export function Footer() {
  const { t } = useTranslation()
  const categories = useCategories()
  const swaggerUrl = API_BASE_URL.replace(/\/$/, '') + '/api-docs/'

  const shopLinks = [
    { label: t('footer.allProducts'), to: '/products' },
    ...(categories.data?.slice(0, 3).map((category) => ({
      label: category.name,
      to: categoryPath(category),
    })) ?? []),
  ]

  return (
    <footer className="mt-4 border-t border-border bg-footer-bg py-8">
      <Container>
        <div className="grid grid-cols-3 gap-x-6 gap-y-8 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-y-6">
          <div className="col-span-3 min-w-0 md:col-span-1">
            <img
              src="/img/campfire_logo_dark.png"
              alt={t('common.storeName')}
              className="h-7 w-auto"
            />
            <p className="mt-3 text-[0.9375rem] text-text-muted md:max-w-[20rem]">
              {t('footer.blurb')}
            </p>
          </div>

          <div className="min-w-0">
            <h3 className="m-0 mb-3 font-display text-base">{t('footer.shop')}</h3>
            {categories.isLoading ? (
              <LoadingState label={t('home.categoriesLoading')} />
            ) : (
              <ul className="m-0 list-none p-0">
                {shopLinks.map((link) => (
                  <li key={link.to} className="mt-2 first:mt-0">
                    <LocaleLink to={link.to} className={footerLinkClass}>
                      {link.label}
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="m-0 mb-3 font-display text-base">{t('footer.account')}</h3>
            <ul className="m-0 list-none p-0">
              {[
                { label: t('nav.signIn'), to: '/login' },
                { label: t('footer.cart'), to: '/cart' },
                { label: t('footer.orders'), to: '/orders' },
                { label: t('footer.profile'), to: '/account' },
              ].map((link) => (
                <li key={link.to} className="mt-2 first:mt-0">
                  <LocaleLink to={link.to} className={footerLinkClass}>
                    {link.label}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="m-0 mb-3 font-display text-base">{t('footer.api')}</h3>
            <ul className="m-0 list-none p-0">
              <li>
                <a
                  href={swaggerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={footerLinkClass}
                >
                  {t('footer.swagger')}
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="https://github.com/kstarostin/campfire-store"
                  target="_blank"
                  rel="noreferrer"
                  className={footerLinkClass}
                >
                  {t('footer.github')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-4 text-[0.8125rem] text-text-muted">
          <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
        </div>
      </Container>
    </footer>
  )
}
