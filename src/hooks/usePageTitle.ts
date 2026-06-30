import { useEffect, useMemo } from 'react'
import { translate, useTranslation, type TranslationKey } from '@/i18n'

function formatPageTitle(language: ReturnType<typeof useTranslation>['language'], pageTitle: string) {
  const brand = translate(language, 'common.storeBrand')
  return `${brand} | ${pageTitle}`
}

export function usePageTitle(titleKey: TranslationKey, values?: Record<string, string | number>) {
  const { t, language } = useTranslation()
  const valuesKey = useMemo(() => JSON.stringify(values ?? null), [values])

  useEffect(() => {
    const parsedValues = valuesKey === 'null' ? undefined : JSON.parse(valuesKey)
    document.title = formatPageTitle(language, t(titleKey, parsedValues))
  }, [t, language, titleKey, valuesKey])
}

export function usePageTitleText(pageTitle: string | undefined) {
  const { language } = useTranslation()

  useEffect(() => {
    if (!pageTitle) return
    document.title = formatPageTitle(language, pageTitle)
  }, [language, pageTitle])
}
