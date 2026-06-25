import type { ProductBadgeAssignment } from '@/api/types'
import { badgeStyleClassName } from '@/lib/badgeStyle'

interface ProductBadgesProps {
  badges?: ProductBadgeAssignment[]
  max?: number
}

export function ProductBadges({ badges, max = 2 }: ProductBadgesProps) {
  if (!badges?.length) return null

  const visible = badges.slice(0, max)

  return (
    <span className="product-badges">
      {visible.map(({ badge }) => (
        <span key={badge._id} className={badgeStyleClassName(badge.style)}>
          {badge.name}
        </span>
      ))}
    </span>
  )
}
