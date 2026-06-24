import { LocaleLink } from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n'

export function SignupPage() {
  const { t } = useTranslation()

  return (
    <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm">
      <h1 className="font-display text-2xl tracking-tight">{t('auth.signUpTitle')}</h1>
      <p className="mt-2 text-sm text-text-muted">{t('auth.signUpHint')}</p>
      <p className="mt-6 text-sm">
        {t('auth.alreadyHaveAccount')}{' '}
        <LocaleLink to="/login" className="font-medium text-secondary hover:text-secondary-hover">
          {t('nav.signIn')}
        </LocaleLink>
      </p>
    </div>
  )
}
