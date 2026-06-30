import { CircleAlert, CircleCheck } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { useToastStore } from '@/store/toastStore'
import type { ToastTone } from '@/store/toastStore'

function ToastIcon({ tone }: { tone: ToastTone }) {
  const Icon = tone === 'success' ? CircleCheck : CircleAlert

  return (
    <span className="toast__icon" aria-hidden>
      <Icon size={18} strokeWidth={2} />
    </span>
  )
}

export function ToastStack() {
  const { t } = useTranslation()
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  if (toasts.length === 0) return null

  return (
    <div className="toast-stack" aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`toast toast--${toast.tone}`}
        >
          <ToastIcon tone={toast.tone} />
          <p>{toast.message}</p>
          <button
            type="button"
            className="toast__dismiss"
            aria-label={t('common.dismiss')}
            onClick={() => dismiss(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
