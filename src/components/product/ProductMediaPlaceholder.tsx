import { FlameKindling } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from '@/i18n'

export function ProductMediaPlaceholder() {
  const { t } = useTranslation()
  const gradientId = `campfire-flame-${useId().replace(/:/g, '')}`

  return (
    <div
      className="product-media-placeholder"
      role="img"
      aria-label={t('common.noImage')}
    >
      <svg width="0" height="0" aria-hidden className="product-media-placeholder__defs">
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
        className="product-media-placeholder__icon"
        stroke={`url(#${gradientId})`}
        strokeWidth={1.5}
        aria-hidden
      />
    </div>
  )
}
