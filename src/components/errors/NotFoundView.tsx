import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { FlameMark } from '@/components/ui/FlameMark'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTranslation } from '@/i18n'

export function NotFoundView() {
  const { t } = useTranslation()
  usePageTitle('documentTitle.notFound')

  return (
    <section className="not-found-page" aria-labelledby="not-found-heading">
      <Container>
        <div className="empty-page__inner">
          <p className="empty-page__eyebrow">{t('notFound.eyebrow')}</p>

          <h1
            id="not-found-heading"
            className="not-found-page__code"
            aria-hidden="true"
          >
            404
          </h1>

          <FlameMark />

          <p className="empty-page__message">{t('notFound.message')}</p>

          <div className="empty-page__actions">
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
