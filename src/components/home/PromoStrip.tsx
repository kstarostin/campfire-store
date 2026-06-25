import { ArrowRight, Bike, Sailboat, Tent } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'

const DEMO_USER_EMAIL = 'alex.chen@explorernet.net'
const DEMO_USER_PASSWORD = 'test1234'

const promoPoints = [
  { key: 'home.promoPointWater' as const, icon: Sailboat },
  { key: 'home.promoPointBikes' as const, icon: Bike },
  { key: 'home.promoPointCamp' as const, icon: Tent },
] as const

export function PromoStrip() {
  const { t } = useTranslation()

  return (
    <section className="pb-8 pt-2">
      <Container>
        <div className="promo">
          <div className="promo-main">
            <p className="promo-eyebrow">{t('home.promoEyebrow')}</p>
            <h2>{t('home.promoTitle')}</h2>
            <p className="promo-lead">{t('home.promoLead')}</p>

            <ul className="promo-points">
              {promoPoints.map(({ key, icon: Icon }) => (
                <li key={key} className="promo-point">
                  <Icon size={18} className="promo-point-icon" aria-hidden />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>

            <div className="promo-actions">
              <Button to="/products" variant="primary">
                {t('home.promoBrowseGear')}
                <ArrowRight size={18} aria-hidden />
              </Button>
              <Button to="/categories" variant="secondary" className="promo-btn-secondary">
                {t('home.promoExploreCategories')}
              </Button>
            </div>
          </div>

          <aside className="promo-aside" aria-label={t('home.promoDemoLabel')}>
            <p className="promo-aside-label">{t('home.promoDemoLabel')}</p>
            <p className="promo-aside-hint">{t('home.promoDemoHint')}</p>

            <dl className="promo-credentials">
              <div>
                <dt>{t('home.promoDemoEmail')}</dt>
                <dd>{DEMO_USER_EMAIL}</dd>
              </div>
              <div>
                <dt>{t('home.promoDemoPassword')}</dt>
                <dd>{DEMO_USER_PASSWORD}</dd>
              </div>
            </dl>

            <Button to="/login" variant="secondary" className="promo-btn-secondary promo-aside-cta">
              {t('home.promoSignIn')}
            </Button>
          </aside>
        </div>
      </Container>
    </section>
  )
}
