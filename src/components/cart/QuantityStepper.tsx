import { useTranslation } from '@/i18n'

interface QuantityStepperProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  disabled?: boolean
  'aria-label'?: string
}

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
}: QuantityStepperProps) {
  const { t } = useTranslation()
  const clamp = (next: number) => Math.min(max, Math.max(min, next))

  return (
    <div className="qty-stepper" aria-label={ariaLabel}>
      <button
        type="button"
        aria-label={t('product.decreaseQuantity')}
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        readOnly
        aria-label={t('product.quantity')}
      />
      <button
        type="button"
        aria-label={t('product.increaseQuantity')}
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1))}
      >
        +
      </button>
    </div>
  )
}
