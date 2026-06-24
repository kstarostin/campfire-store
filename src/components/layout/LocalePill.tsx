import { Globe } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Currency, Language } from '@/api/types'
import { useTranslation, type TranslationKey } from '@/i18n'
import { localizedPath, stripLangPrefix } from '@/lib/localePath'
import {
  formatLocaleLabel,
  useLocaleStore,
} from '@/store/localeStore'

export function LocalePill() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { language, currency, setCurrency } = useLocaleStore()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const languages: { value: Language; labelKey: TranslationKey }[] = [
    { value: 'en', labelKey: 'nav.english' },
    { value: 'de', labelKey: 'nav.german' },
  ]

  const currencies: { value: Currency; labelKey: TranslationKey }[] = [
    { value: 'USD', labelKey: 'nav.usd' },
    { value: 'EUR', labelKey: 'nav.eur' },
  ]

  const switchLanguage = (newLanguage: Language) => {
    const path = stripLangPrefix(location.pathname)
    const target = localizedPath(newLanguage, path)
    navigate(`${target}${location.search}${location.hash}`)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return

    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [open])

  return (
    <div ref={rootRef} className="relative hidden md:block">
      <button
        type="button"
        className="header-locale-pill inline-flex cursor-pointer items-center gap-1.5 rounded-full border bg-[#292524] px-3 py-1.5 text-[0.8125rem] font-medium"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        <Globe size={16} aria-hidden />
        {formatLocaleLabel(language, currency)}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label={t('nav.languageCurrency')}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[14rem] rounded-lg border border-border bg-surface p-4 text-text shadow-md"
        >
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              {t('nav.language')}
            </legend>
            <div className="flex flex-col gap-1">
              {languages.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`cursor-pointer rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                    language === item.value
                      ? 'bg-primary-subtle font-semibold text-primary-hover'
                      : 'hover:bg-surface-muted hover:text-primary-hover'
                  }`}
                  onClick={() => switchLanguage(item.value)}
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="m-0 mt-4 border-0 border-t border-border p-0 pt-4">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              {t('nav.currency')}
            </legend>
            <div className="flex flex-col gap-1">
              {currencies.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`cursor-pointer rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                    currency === item.value
                      ? 'bg-primary-subtle font-semibold text-primary-hover'
                      : 'hover:bg-surface-muted hover:text-primary-hover'
                  }`}
                  onClick={() => setCurrency(item.value)}
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      ) : null}
    </div>
  )
}
