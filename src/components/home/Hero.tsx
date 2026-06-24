import { ArrowRight, Flame } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useTranslation } from '@/i18n'
import { useProductCount } from '@/hooks/useProducts'
import { formatLocaleLabel, useLocaleStore } from '@/store/localeStore'

export function Hero() {
  const { t } = useTranslation()
  const { language, currency } = useLocaleStore()
  const productCount = useProductCount()

  const productTotal =
    productCount.isLoading ? '…' : `${productCount.data ?? 0}+`

  return (
    <section className="hero">
      <Container>
        <div className="hero-card">
          <div>
            <span className="eyebrow">
              <Flame size={14} aria-hidden />
              {t('hero.eyebrow')}
            </span>
            <h1>{t('hero.title')}</h1>
            <p>{t('hero.description')}</p>
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

          <div className="hero-stats">
            <div className="stat stat--warm">
              <strong>{productTotal}</strong>
              <span>{t('hero.productsInCatalog')}</span>
            </div>
            <div className="stat stat--flame">
              <strong>EN / DE</strong>
              <span>{t('hero.localizedCatalog')}</span>
            </div>
            <div className="stat stat--neutral">
              <strong>{formatLocaleLabel(language, currency)}</strong>
              <span>{t('hero.yourLocale')}</span>
            </div>
          </div>
        </div>

        {productCount.isError ? (
          <div className="mt-3">
            <ErrorState
              message={t('hero.statsError')}
              onRetry={() => productCount.refetch()}
            />
          </div>
        ) : null}
        {productCount.isLoading ? (
          <div className="sr-only">
            <LoadingState label={t('hero.statsLoading')} />
          </div>
        ) : null}
      </Container>
    </section>
  )
}
