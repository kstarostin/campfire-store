import type { Language } from '@/api/types'

export const SUPPORTED_LANGUAGES: readonly Language[] = ['en', 'de'] as const
export const DEFAULT_LANGUAGE: Language = 'en'

export function isLanguage(value: string): value is Language {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}

export function stripLangPrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && isLanguage(segments[0])) {
    const rest = segments.slice(1).join('/')
    return rest ? `/${rest}` : '/'
  }
  return pathname || '/'
}

export function localizedPath(language: Language, path: string): string {
  const hashIndex = path.indexOf('#')
  const hash = hashIndex === -1 ? '' : path.slice(hashIndex)
  const withoutHash = hashIndex === -1 ? path : path.slice(0, hashIndex)

  const queryIndex = withoutHash.indexOf('?')
  const pathname = queryIndex === -1 ? withoutHash : withoutHash.slice(0, queryIndex)
  const search = queryIndex === -1 ? '' : withoutHash.slice(queryIndex)

  const stripped = stripLangPrefix(pathname.startsWith('/') ? pathname : `/${pathname}`)
  const localized = stripped === '/' ? `/${language}` : `/${language}${stripped}`

  return `${localized}${search}${hash}`
}
