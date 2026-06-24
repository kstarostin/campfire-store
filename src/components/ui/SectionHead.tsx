import type { ReactNode } from 'react'
import { LocaleLink } from '@/components/ui/LocaleLink'

interface SectionHeadProps {
  title: string
  description?: string
  action?: { label: string; to: string; className?: string }
  children?: ReactNode
}

export function SectionHead({ title, description, action, children }: SectionHeadProps) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? (
        <LocaleLink to={action.to} className={action.className ?? 'link-view-all'}>
          {action.label}
        </LocaleLink>
      ) : null}
      {children}
    </div>
  )
}
