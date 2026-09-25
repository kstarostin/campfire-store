import type { ReactNode } from 'react'

interface SectionHeadProps {
  title: string
  description?: string
  /** Optional control shown on the title's line, at the right edge. */
  children?: ReactNode
}

export function SectionHead({ title, description, children }: SectionHeadProps) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </div>
  )
}
