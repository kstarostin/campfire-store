import {
  Backpack,
  Bike,
  Mountain,
  Sailboat,
  Shirt,
  Tent,
  type LucideIcon,
} from 'lucide-react'

/**
 * Map icons from stable API category codes (language-independent).
 * Display names are localized and must not be used for matching.
 */
export function getCategoryIcon(code?: string): LucideIcon {
  const slug = (code ?? '').toLowerCase()

  if (slug.includes('kayak')) return Sailboat
  if (slug.includes('bike') || slug.includes('bicy')) return Bike
  if (slug.includes('camp') || slug.includes('tent')) return Tent
  if (slug.includes('backpack') || slug === 'accessories') return Backpack
  if (slug.includes('cloth') || slug.includes('pant')) return Shirt
  if (slug.includes('ski') || slug.includes('mountain')) return Mountain

  return Backpack
}
