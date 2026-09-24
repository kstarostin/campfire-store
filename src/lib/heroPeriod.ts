import { imageUrl } from '@/lib/imageUrl'

export type HeroPeriod = 'morning' | 'day' | 'night'

/**
 * Which hero photograph to show, by local clock time:
 *   morning 05:00–11:00  sunrise ridgeline
 *   day     11:00–18:00  campfire by the river
 *   night   18:00–05:00  camp under the stars
 */
export function heroPeriodFor(date: Date = new Date()): HeroPeriod {
  const hour = date.getHours()
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 18) return 'day'
  return 'night'
}

/** Milliseconds until the next period boundary, for scheduling a re-check. */
export function msUntilNextPeriod(date: Date = new Date()): number {
  const boundaries = [5, 11, 18]
  const hour = date.getHours()
  const nextHour = boundaries.find((b) => b > hour) ?? boundaries[0] + 24

  const next = new Date(date)
  next.setHours(nextHour, 0, 0, 0)
  return next.getTime() - date.getTime()
}

/**
 * The hero photographs live in the API's `public/img/hero/`, served the same
 * way as product and category images, so their URLs depend on `API_ORIGIN` and
 * can only be built at runtime. Each period has three widths; `Hero.tsx` hands
 * all three to CSS as custom properties and the stylesheet's media queries pick
 * one, which keeps the breakpoint choice in CSS where it belongs.
 */
const HERO_FILE: Record<HeroPeriod, string> = {
  morning: 'hero-1',
  day: 'hero-2',
  night: 'hero-3',
}

export interface HeroImageSources {
  '--hero-image-lg': string
  '--hero-image-md': string
  '--hero-image-sm': string
}

export function heroImageSources(period: HeroPeriod): HeroImageSources {
  const base = HERO_FILE[period]
  const url = (suffix: string) => `url("${imageUrl(`img/hero/${base}${suffix}.webp`)}")`

  return {
    '--hero-image-lg': url(''),
    '--hero-image-md': url('-1440'),
    '--hero-image-sm': url('-900'),
  }
}
