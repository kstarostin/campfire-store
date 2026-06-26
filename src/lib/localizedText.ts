import type { I18nString, Language } from '@/api/types'

export function localizedText(
  value: I18nString | string | undefined,
  language: Language,
): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  return value[language] ?? value.en
}
