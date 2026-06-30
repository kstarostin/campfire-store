import { useState } from 'react'
import { CircleCheck, Link2, Mail, Package } from 'lucide-react'
import type { Order } from '@/api/types'
import { Button } from '@/components/ui/Button'
import { useLocalePath } from '@/hooks/useLocalePath'
import { useTranslation } from '@/i18n'

interface CheckoutSuccessProps {
  order: Order
  customerName: string
}

export function CheckoutSuccess({ order, customerName }: CheckoutSuccessProps) {
  const { t } = useTranslation()
  const localePath = useLocalePath()
  const [copied, setCopied] = useState(false)

  const orderPath = localePath(`/account?panel=orders&order=${order._id}`)
  const orderUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${orderPath}` : orderPath

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(orderUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="checkout-success">
      <div className="checkout-success__icon" aria-hidden="true">
        <CircleCheck size={32} />
      </div>
      <h2>{t('checkout.successTitle')}</h2>
      <p>{t('checkout.successBody', { name: customerName })}</p>
      <p className="checkout-success__email">
        <Mail size={16} aria-hidden />
        {t('checkout.successEmailNote')}
      </p>
      <p className="checkout-success__order">{t('checkout.orderNumber', { id: order._id })}</p>

      <section className="checkout-success__steps" aria-labelledby="checkout-success-steps">
        <h3 id="checkout-success-steps">{t('checkout.successNextSteps')}</h3>
        <ul>
          <li>
            <Mail size={16} aria-hidden />
            <span>{t('checkout.successStepEmail')}</span>
          </li>
          <li>
            <Package size={16} aria-hidden />
            <span>{t('checkout.successStepTrack')}</span>
          </li>
        </ul>
      </section>

      <div className="checkout-success__share">
        <p>{t('checkout.successShareHint')}</p>
        <button type="button" className="checkout-success__copy" onClick={handleCopyLink}>
          <Link2 size={16} aria-hidden />
          {copied ? t('checkout.linkCopied') : t('checkout.copyOrderLink')}
        </button>
      </div>

      <div className="checkout-success__actions">
        <Button to={orderPath}>{t('checkout.viewOrder')}</Button>
        <Button to="/products" variant="secondary">
          {t('checkout.continueShopping')}
        </Button>
      </div>
    </div>
  )
}
