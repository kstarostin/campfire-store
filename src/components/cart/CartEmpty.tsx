import { Button } from '@/components/ui/Button'
import { FlameMark } from '@/components/ui/FlameMark'
import { useTranslation } from '@/i18n'

export function CartEmpty() {
  const { t } = useTranslation()

  return (
    <div className="cart-empty">
      <div className="empty-page__inner">
        <p className="empty-page__eyebrow">{t('cart.emptyEyebrow')}</p>

        <FlameMark />

        <h2 className="empty-page__title">{t('cart.emptyTitle')}</h2>

        <p className="empty-page__message">{t('cart.emptyDescription')}</p>

        <div className="empty-page__actions">
          <Button to="/products">{t('cart.browseProducts')}</Button>
          <Button to="/" variant="secondary">
            {t('cart.backHome')}
          </Button>
        </div>
      </div>
    </div>
  )
}
