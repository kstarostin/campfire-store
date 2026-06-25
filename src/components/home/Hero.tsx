import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="hero">
      <Container>
        <div className="hero-inner">
          <p className="hero-eyebrow">{t('hero.eyebrow')}</p>
          <h1>{t('hero.title')}</h1>
          <p className="hero-lead">{t('hero.description')}</p>
          <div className="hero-actions">
            <Button to="/products" variant="primary">
              {t('hero.shopBestsellers')}
              <ArrowRight size={18} aria-hidden />
            </Button>
            <Button to="/categories" variant="secondary">
              {t('hero.browseCategories')}
            </Button>
          </div>
          <p className="hero-highlights">{t('hero.highlights')}</p>
        </div>
      </Container>
    </section>
  )
}
