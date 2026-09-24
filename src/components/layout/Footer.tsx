import { useState, type FormEvent } from 'react'
import { API_BASE_URL } from '@/api/config'
import { Container } from '@/components/layout/Container'
import { useTranslation } from '@/i18n'

/**
 * Demo forms: this storefront has no contact or newsletter backend, so both
 * submits simply clear their fields. Deliberately not faking a success message,
 * which would imply something had actually been sent.
 */
function useResettingForm<T extends Record<string, string>>(empty: T) {
  const [values, setValues] = useState<T>(empty)

  const set = (key: keyof T) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [key]: event.target.value }))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setValues(empty)
  }

  return { values, set, handleSubmit }
}

/**
 * lucide-react dropped brand logos at v1, so these are simple geometric marks
 * drawn to match its 24px / currentColor / stroke style. Placeholders for a
 * demo store rather than the real trademarked logos.
 */
const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

function InstagramMark() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookMark() {
  return (
    <svg {...iconProps}>
      <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5H17.6V4.4A20 20 0 0 0 15.3 4c-2.3 0-3.8 1.4-3.8 3.9v2.6H9v3h2.5V21" />
    </svg>
  )
}

function YoutubeMark() {
  return (
    <svg {...iconProps}>
      <rect x="2.5" y="6" width="19" height="12" rx="4" />
      <path d="M10.5 9.8 15 12l-4.5 2.2z" />
    </svg>
  )
}

const socialLinks = [
  { key: 'instagram', Icon: InstagramMark, href: 'https://instagram.com' },
  { key: 'facebook', Icon: FacebookMark, href: 'https://facebook.com' },
  { key: 'youtube', Icon: YoutubeMark, href: 'https://youtube.com' },
] as const

export function Footer() {
  const { t } = useTranslation()
  const swaggerUrl = API_BASE_URL.replace(/\/$/, '') + '/api-docs/'

  const contact = useResettingForm({ name: '', email: '', message: '' })
  const newsletter = useResettingForm({ email: '' })

  return (
    <footer className="site-footer">
      <Container wide className="footer-container">
        <div className="footer-top">
          <div className="footer-intro">
            <h2 className="footer-fill-title footer-fill-title--contact">
              {t('footer.contactTitle')}
            </h2>
            <p>{t('footer.contactBlurb')}</p>
          </div>

          <form className="footer-form" onSubmit={contact.handleSubmit}>
            <div className="footer-form__row">
              <input
                className="footer-field"
                type="text"
                name="name"
                aria-label={t('footer.name')}
                placeholder={t('footer.name')}
                value={contact.values.name}
                onChange={contact.set('name')}
              />
              <input
                className="footer-field"
                type="email"
                name="email"
                aria-label={t('footer.email')}
                placeholder={t('footer.email')}
                value={contact.values.email}
                onChange={contact.set('email')}
              />
            </div>
            <input
              className="footer-field"
              type="text"
              name="message"
              aria-label={t('footer.message')}
              placeholder={t('footer.message')}
              value={contact.values.message}
              onChange={contact.set('message')}
            />
            <button type="submit" className="footer-submit">
              {t('footer.send')}
            </button>
          </form>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-news">
            <h2 className="footer-fill-title footer-fill-title--news">
              {t('footer.newsletterTitle')}
            </h2>
            <p>{t('footer.newsletterBlurb')}</p>
            <form className="footer-news__form" onSubmit={newsletter.handleSubmit}>
              <input
                className="footer-field"
                type="email"
                name="newsletter-email"
                aria-label={t('footer.newsletterEmail')}
                placeholder={t('footer.newsletterEmail')}
                value={newsletter.values.email}
                onChange={newsletter.set('email')}
              />
              <button type="submit" className="footer-submit">
                {t('footer.subscribe')}
              </button>
            </form>
          </div>

          <div className="footer-meta">
            <div className="footer-links">
              <h3>{t('footer.api')}</h3>
              <ul>
                <li>
                  <a href={swaggerUrl} target="_blank" rel="noreferrer" className="footer-link">
                    {t('footer.swagger')}
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/kstarostin/campfire-store"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-link"
                  >
                    {t('footer.github')}
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-social">
              <h3>{t('footer.followUs')}</h3>
              <ul>
                {socialLinks.map(({ key, Icon, href }) => (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="footer-social__icon"
                      aria-label={t(`footer.${key}` as 'footer.instagram')}
                    >
                      <Icon />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <img
            src="/img/campfire_logo_light.png"
            alt=""
            aria-hidden
            className="footer-wordmark"
          />
        </div>

        <div className="footer-copyright">
          <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
          <span>{t('footer.createdBy')}</span>
        </div>
      </Container>
    </footer>
  )
}
