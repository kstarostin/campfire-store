import type { TranslationKey } from '@/i18n'

/**
 * Home page sections worth a direct jump, shared by the header bar and the two
 * menus. Recently viewed is left out: it is empty on a first visit, so a link
 * to it would often go nowhere.
 */
export const HOME_SECTIONS: { to: string; labelKey: TranslationKey }[] = [
  { to: '/#categories', labelKey: 'nav.categories' },
  { to: '/#new-arrivals', labelKey: 'nav.arrivals' },
  { to: '/#products', labelKey: 'nav.featured' },
]
