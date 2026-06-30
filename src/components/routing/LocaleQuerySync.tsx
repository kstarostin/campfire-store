import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { isLocaleSensitiveQueryKey } from '@/lib/queryKeys'
import { useLocaleStore } from '@/store/localeStore'

export function LocaleQuerySync() {
  const queryClient = useQueryClient()
  const language = useLocaleStore((state) => state.language)
  const currency = useLocaleStore((state) => state.currency)
  const previous = useRef({ language, currency })

  useEffect(() => {
    const prev = previous.current
    if (prev.language === language && prev.currency === currency) return

    previous.current = { language, currency }

    void queryClient.invalidateQueries({
      predicate: (query) => isLocaleSensitiveQueryKey(query.queryKey),
    })
  }, [currency, language, queryClient])

  return null
}
