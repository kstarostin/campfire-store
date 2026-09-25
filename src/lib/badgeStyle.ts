/**
 * How a badge looks is a storefront decision, so the mapping lives here rather
 * than in the API — a badge arrives as a `code` and a localized name, nothing
 * more. Fill and lettering stay separate axes so a saturated fill can carry
 * light text without inventing a combined name for every pairing.
 *
 * A code with no entry falls back to the neutral pill, so a badge added to the
 * catalogue still renders sensibly before anyone styles it here.
 */
type BadgeFill = 'accent' | 'info' | 'neutral'
type BadgeText = 'light' | 'dark'

interface BadgeAppearance {
  fill: BadgeFill
  text: BadgeText
}

const BADGE_APPEARANCE: Record<string, BadgeAppearance> = {
  bestseller: { fill: 'accent', text: 'light' },
  new: { fill: 'info', text: 'dark' },
}

const FALLBACK_APPEARANCE: BadgeAppearance = { fill: 'neutral', text: 'dark' }

const fillClass: Record<BadgeFill, string> = {
  accent: 'badge--accent',
  info: 'badge--info',
  neutral: 'badge--neutral',
}

const textClass: Record<BadgeText, string> = {
  light: 'badge--text-light',
  dark: 'badge--text-dark',
}

export function badgeStyleClassName(code: string): string {
  const appearance = BADGE_APPEARANCE[code] ?? FALLBACK_APPEARANCE
  return `badge ${fillClass[appearance.fill]} ${textClass[appearance.text]}`
}
