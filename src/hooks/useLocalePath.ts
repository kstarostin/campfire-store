import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import type { Language } from '@/api/types'
import { isLanguage, localizedPath } from '@/lib/localePath'
import { useLocaleStore } from '@/store/localeStore'

export function useLocalePath() {
  const { lang } = useParams<{ lang: string }>()
  const storeLanguage = useLocaleStore((state) => state.language)
  const language: Language = lang && isLanguage(lang) ? lang : storeLanguage

  return useCallback((path: string) => localizedPath(language, path), [language])
}
