import { useLocaleStore } from '@/store/localeStore'

export function useLocale() {
  const language = useLocaleStore((state) => state.language)
  const currency = useLocaleStore((state) => state.currency)
  return { language, currency }
}
