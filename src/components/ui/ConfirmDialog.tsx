import { useEffect, useId, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useTranslation } from '@/i18n'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  onCancel: () => void
  isPending?: boolean
  variant?: 'danger' | 'default'
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isPending = false,
  variant = 'default',
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useFocusTrap(open, panelRef)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="confirm-dialog">
      <button
        type="button"
        className="confirm-dialog__backdrop"
        aria-label={cancelLabel ?? t('common.cancel')}
        onClick={onCancel}
      />

      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="confirm-dialog__panel"
      >
        <h2 id={titleId} className="confirm-dialog__title">
          {title}
        </h2>
        <p id={descriptionId} className="confirm-dialog__description">
          {description}
        </p>

        <div className="confirm-dialog__actions">
          <Button type="button" variant="secondary" disabled={isPending} onClick={onCancel}>
            {cancelLabel ?? t('common.cancel')}
          </Button>
          <Button
            type="button"
            className={variant === 'danger' ? 'confirm-dialog__confirm--danger' : undefined}
            data-focus-initial
            disabled={isPending}
            onClick={() => void onConfirm()}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
