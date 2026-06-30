import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { translate, useTranslation, type TranslationKey } from '@/i18n'
import { applyPageMeta, type PageMetaInput } from '@/lib/pageMeta'

export function formatPageTitle(
  language: ReturnType<typeof useTranslation>['language'],
  pageTitle: string,
) {
  const brand = translate(language, 'common.storeBrand')
  return `${brand} | ${pageTitle}`
}

export function usePageTitle(titleKey: TranslationKey, values?: Record<string, string | number>) {
  const { t, language } = useTranslation()
  const valuesKey = useMemo(() => JSON.stringify(values ?? null), [values])

  useEffect(() => {
    const parsedValues = valuesKey === 'null' ? undefined : JSON.parse(valuesKey)
    const title = formatPageTitle(language, t(titleKey, parsedValues))
    applyPageMeta({
      title,
      description: translate(language, 'meta.defaultDescription'),
    })
  }, [t, language, titleKey, valuesKey])
}

export function usePageMeta(meta: PageMetaInput | undefined) {
  const location = useLocation()

  const title = meta?.title
  const description = meta?.description
  const image = meta?.image
  const type = meta?.type
  const url = meta?.url

  useEffect(() => {
    if (!title && !description) return

    applyPageMeta({
      title,
      description,
      image,
      type,
      url: url ?? `${window.location.origin}${location.pathname}${location.search}`,
    })
  }, [description, image, location.pathname, location.search, title, type, url])
}
