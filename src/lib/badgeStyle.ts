import type { BadgeStyle } from '@/api/types'

const badgeStyleClass: Record<BadgeStyle, string> = {
  primary: 'badge',
  forest: 'badge badge--forest',
  neutral: 'badge badge--neutral',
}

export function badgeStyleClassName(style: BadgeStyle): string {
  return badgeStyleClass[style]
}
