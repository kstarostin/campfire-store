import { useCallback } from 'react'
import type { Language } from '@/api/types'
import { de } from '@/i18n/messages/de'
import { en, type Messages } from '@/i18n/messages/en'
import { useLocaleStore } from '@/store/localeStore'

type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`
    }[keyof T & string]
  : never

export type TranslationKey = NestedKeyOf<Messages>

const catalogs: Record<Language, Messages> = { en, de }

function getMessage(messages: Messages, key: string): string | undefined {
  return key.split('.').reduce<unknown>((value, part) => {
    if (value && typeof value === 'object' && part in value) {
      return (value as Record<string, unknown>)[part]
    }
    return undefined
  }, messages) as string | undefined
}

export function interpolate(
  template: string,
  values?: Record<string, string | number>,
): string {
  if (!values) return template

  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  )
}

export function translate(
  language: Language,
  key: TranslationKey,
  values?: Record<string, string | number>,
): string {
  const message = getMessage(catalogs[language], key) ?? getMessage(catalogs.en, key) ?? key
  return interpolate(message, values)
}

export function useTranslation() {
  const language = useLocaleStore((state) => state.language)

  const t = useCallback(
    (key: TranslationKey, values?: Record<string, string | number>) =>
      translate(language, key, values),
    [language],
  )

  return { t, language }
}

export function useFormatLocale(): string {
  const language = useLocaleStore((state) => state.language)
  return language === 'de' ? 'de-DE' : 'en-US'
}
