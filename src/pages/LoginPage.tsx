import { useSearchParams } from 'react-router-dom'
import { LocaleLink } from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n'

export function LoginPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')

  return (
    <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm">
      <h1 className="font-display text-2xl tracking-tight">{t('auth.signInTitle')}</h1>
      <p className="mt-2 text-sm text-text-muted">{t('auth.signInHint')}</p>
      {returnUrl ? (
        <p className="mt-3 text-sm text-text-muted">
          {t('auth.returnAfterSignIn', {
            url: decodeURIComponent(returnUrl),
          })}
        </p>
      ) : null}
      <p className="mt-6 text-sm">
        <LocaleLink to="/signup" className="font-medium text-secondary hover:text-secondary-hover">
          {t('auth.createAccount')}
        </LocaleLink>
      </p>
    </div>
  )
}
