import { Link } from 'react-router-dom'
import { API_BASE_URL } from '@/api/config'
import { Container } from '@/components/layout/Container'
import { staticCategories } from '@/data/staticCategories'

const shopLinks = [
  { label: 'All products', to: '/products' },
  ...staticCategories.slice(0, 3).map((category) => ({
    label: category.name,
    to: `/categories/${category.id}`,
  })),
]

const footerLinkClass = 'footer-link cursor-pointer text-[0.9375rem]'

export function Footer() {
  const swaggerUrl = API_BASE_URL.replace(/\/$/, '') + '/api-docs/'

  return (
    <footer className="mt-4 border-t border-border bg-footer-bg py-8">
      <Container>
        <div className="grid grid-cols-3 gap-x-6 gap-y-8 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-y-6">
          <div className="col-span-3 min-w-0 md:col-span-1">
            <img
              src="/img/campfire_logo_dark.png"
              alt="Campfire Store"
              className="h-7 w-auto"
            />
            <p className="mt-3 text-[0.9375rem] text-text-muted md:max-w-[20rem]">
              Gear up for the trail, water, and road — kayaks, bikes, camping
              essentials, and more for your next adventure.
            </p>
          </div>

          <div className="min-w-0">
            <h3 className="m-0 mb-3 font-display text-base">Shop</h3>
            <ul className="m-0 list-none p-0">
              {shopLinks.map((link) => (
                <li key={link.to} className="mt-2 first:mt-0">
                  <Link to={link.to} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="m-0 mb-3 font-display text-base">Account</h3>
            <ul className="m-0 list-none p-0">
              {[
                { label: 'Sign in', to: '/login' },
                { label: 'Cart', to: '/cart' },
                { label: 'Orders', to: '/orders' },
                { label: 'Profile', to: '/account' },
              ].map((link) => (
                <li key={link.to} className="mt-2 first:mt-0">
                  <Link to={link.to} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="m-0 mb-3 font-display text-base">API</h3>
            <ul className="m-0 list-none p-0">
              <li>
                <a
                  href={swaggerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={footerLinkClass}
                >
                  Swagger docs
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="https://github.com/kstarostin/campfire-store"
                  target="_blank"
                  rel="noreferrer"
                  className={footerLinkClass}
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-4 text-[0.8125rem] text-text-muted">
          <span>© {new Date().getFullYear()} Campfire Store</span>
        </div>
      </Container>
    </footer>
  )
}
