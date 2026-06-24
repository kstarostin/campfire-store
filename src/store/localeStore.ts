import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency, Language } from '@/api/types'

interface LocaleState {
  language: Language
  currency: Currency
  setLanguage: (language: Language) => void
  setCurrency: (currency: Currency) => void
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      language: 'en',
      currency: 'USD',
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
    }),
    { name: 'campfire-locale' },
  ),
)

export function formatLocaleLabel(language: Language, currency: Currency): string {
  return `${language.toUpperCase()} · ${currency}`
}
