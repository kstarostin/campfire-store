import {
  Backpack,
  Bike,
  Mountain,
  Package,
  Sailboat,
  Shirt,
  SportShoe,
  Tent,
  type LucideIcon,
} from 'lucide-react'

/**
 * Maps API `category.icon` keys to Lucide components.
 * Keep in sync with campfire-store-api/utils/categoryIconUtils.js
 */
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  sailboat: Sailboat,
  bike: Bike,
  tent: Tent,
  backpack: Backpack,
  shirt: Shirt,
  mountain: Mountain,
  package: Package,
  'sport-shoe': SportShoe,
}

const FALLBACK_ICON = Package

/**
 * Resolve a category icon key from the API to a Lucide component.
 */
export function getCategoryIcon(icon?: string | null): LucideIcon {
  if (!icon) return FALLBACK_ICON
  return CATEGORY_ICON_MAP[icon.toLowerCase()] ?? FALLBACK_ICON
}
