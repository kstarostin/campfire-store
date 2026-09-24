import { ArrowRight } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'
import { heroImageSources, heroPeriodFor, msUntilNextPeriod } from '@/lib/heroPeriod'

export function Hero() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState(heroPeriodFor)

  // Re-check exactly on the next boundary so a long-open tab doesn't keep a
  // stale photograph, then settle into hourly checks.
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    const timeout = setTimeout(() => {
      setPeriod(heroPeriodFor())
      interval = setInterval(() => setPeriod(heroPeriodFor()), 60 * 60 * 1000)
    }, msUntilNextPeriod())

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [period])

  return (
    // The photographs are served by the API alongside product and category
    // images, so their URLs carry API_ORIGIN and have to reach CSS from here.
    // All three widths go in; index.css picks one per breakpoint.
    <section
      className="hero"
      data-period={period}
      style={heroImageSources(period) as CSSProperties}
    >
      <Container className="hero-container">
        {/* Content is spread rather than stacked: eyebrow top-left, the display
            heading through the upper half, and a supporting row pinned to the
            foot — lead on the left, calls to action on the right. */}
        <div className="hero-inner">
          <p className="hero-eyebrow">{t('hero.eyebrow')}</p>
          <h1>{t('hero.title')}</h1>

          <div className="hero-foot">
            <div className="hero-foot__lead">
              <p className="hero-lead">{t('hero.description')}</p>
              <p className="hero-highlights">{t('hero.highlights')}</p>
            </div>

            <div className="hero-actions">
              <Button to="/products" variant="primary">
                {t('hero.shopBestsellers')}
                <ArrowRight size={18} aria-hidden />
              </Button>
              <Button to="/categories" variant="secondary">
                {t('hero.browseCategories')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
