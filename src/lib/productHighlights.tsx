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

export type ProductHighlightGroup = 'environment' | 'build' | 'fit'

const PRODUCT_HIGHLIGHT_GROUPS: Record<string, ProductHighlightGroup> = {
  use: 'environment',
  terrain: 'environment',
  season: 'environment',
  waterproof: 'environment',
  skill: 'environment',
  material: 'build',
  frame: 'build',
  wheel: 'build',
  type: 'build',
  weight: 'build',
  fit: 'fit',
  volume: 'fit',
  capacity: 'fit',
  waist: 'fit',
  length: 'fit',
}

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

export function productHighlightGroup(code: string): ProductHighlightGroup {
  return PRODUCT_HIGHLIGHT_GROUPS[code] ?? 'build'
}

export function productHighlightLabelKey(code: string): TranslationKey {
  return `product.highlights.${code}` as TranslationKey
}
