import { Container } from '@/components/layout/Container'
import { useTranslation } from '@/i18n'

export function PromoStrip() {
  const { t } = useTranslation()

  return (
    <section className="pb-8 pt-2">
      <Container>
        <div className="promo">
          <h2>{t('home.promoTitle')}</h2>
          <p>
            {t('home.promoIntro')} <strong>alex.chen@explorernet.net</strong>{' '}
            {t('home.promoMiddle')} <strong>test1234</strong>
            {t('home.promoOutro')}
          </p>
        </div>
      </Container>
    </section>
  )
}
