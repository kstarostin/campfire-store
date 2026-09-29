import { FlameKindling } from 'lucide-react'
import { useId } from 'react'

/**
 * The gradient campfire flame used as the visual anchor on the pages that have
 * nothing else to show — the 404 and the empty cart. The gradient needs a
 * document-unique id, so it is minted per instance rather than hardcoded.
 */
export function FlameMark() {
  const gradientId = `flame-mark-${useId().replace(/:/g, '')}`

  return (
    <div className="empty-page__flame" aria-hidden>
      <svg width="0" height="0" className="empty-page__flame-defs">
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
        className="empty-page__flame-icon"
        stroke={`url(#${gradientId})`}
        strokeWidth={1.35}
      />
    </div>
  )
}
