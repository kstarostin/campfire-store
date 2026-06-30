import { FlameKindling } from 'lucide-react'
import { useId } from 'react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'

export function NotFoundView() {
  const { t } = useTranslation()
  const gradientId = `not-found-flame-${useId().replace(/:/g, '')}`

  return (
    <section className="not-found-page" aria-labelledby="not-found-heading">
      <Container>
        <div className="not-found-page__inner">
          <p className="not-found-page__eyebrow">{t('notFound.eyebrow')}</p>

          <h1 id="not-found-heading" className="not-found-page__code" aria-hidden="true">
            404
          </h1>

          <div className="not-found-page__flame" aria-hidden>
            <svg width="0" height="0" className="not-found-page__flame-defs">
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="12"
                  y1="22"
                  x2="12"
                  y2="2"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="42%" stopColor="#f97316" />
                  <stop offset="72%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
            <FlameKindling
              className="not-found-page__flame-icon"
              stroke={`url(#${gradientId})`}
              strokeWidth={1.35}
            />
          </div>

          <p className="not-found-page__message">{t('notFound.message')}</p>

          <div className="not-found-page__actions">
            <Button to="/">{t('notFound.backHome')}</Button>
            <Button to="/products" variant="secondary">
              {t('notFound.browseProducts')}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
