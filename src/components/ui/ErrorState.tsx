import { useTranslation } from '@/i18n'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-lg border border-border bg-surface-muted p-4 text-sm text-text-muted">
      <p className="m-0">{message ?? t('common.errorDefault')}</p>
      {onRetry ? (
        <button
          type="button"
          className="mt-3 cursor-pointer font-semibold text-secondary hover:text-secondary-hover"
          onClick={onRetry}
        >
          {t('common.tryAgain')}
        </button>
      ) : null}
    </div>
  )
}
