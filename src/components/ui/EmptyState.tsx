import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface EmptyStateAction {
  label: string
  to?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  children?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  children,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`empty-state ${className}`.trim()}>
      <div className="empty-state__icon" aria-hidden>
        <Icon size={28} />
      </div>
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__description">{description}</p>
      {children}
      {action || secondaryAction ? (
        <div className="empty-state__actions">
          {action ? (
            action.to ? (
              <Button to={action.to} variant={action.variant ?? 'primary'}>
                {action.label}
              </Button>
            ) : (
              <Button type="button" variant={action.variant ?? 'primary'} onClick={action.onClick}>
                {action.label}
              </Button>
            )
          ) : null}
          {secondaryAction ? (
            secondaryAction.to ? (
              <Button to={secondaryAction.to} variant={secondaryAction.variant ?? 'secondary'}>
                {secondaryAction.label}
              </Button>
            ) : (
              <Button
                type="button"
                variant={secondaryAction.variant ?? 'secondary'}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
