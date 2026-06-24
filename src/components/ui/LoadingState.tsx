import { useTranslation } from '@/i18n'

interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label }: LoadingStateProps) {
  const { t } = useTranslation()

  return (
    <p className="text-[0.9375rem] text-text-muted" role="status">
      {label ?? t('common.loading')}
    </p>
  )
}
