import {
  Backpack,
  Circle,
  Compass,
  Droplets,
  Feather,
  Layers,
  Mountain,
  Ruler,
  Shirt,
  Ship,
  Snowflake,
  Sun,
  Tag,
  TrendingUp,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { TranslationKey } from '@/i18n'

export const PRODUCT_HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  frame: Layers,
  wheel: Circle,
  use: Compass,
  volume: Backpack,
  fit: User,
  material: Shirt,
  capacity: Users,
  season: Sun,
  weight: Feather,
  terrain: Mountain,
  waterproof: Droplets,
  type: Ship,
  length: Ruler,
  waist: Snowflake,
  skill: TrendingUp,
}

export function productHighlightIcon(code: string): LucideIcon {
  return PRODUCT_HIGHLIGHT_ICONS[code] ?? Tag
}

export function productHighlightLabelKey(code: string): TranslationKey {
  return `product.highlights.${code}` as TranslationKey
}
