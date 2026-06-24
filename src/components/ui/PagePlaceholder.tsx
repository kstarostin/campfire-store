import type { ReactNode } from 'react'
import { Container } from '@/components/layout/Container'

interface PagePlaceholderProps {
  title: string
  description?: string
  children?: ReactNode
}

export function PagePlaceholder({ title, description, children }: PagePlaceholderProps) {
  return (
    <Container className="py-10 md:py-14">
      <h1 className="font-display text-[clamp(1.75rem,4vw,2.25rem)] tracking-tight">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-prose text-[0.9375rem] text-text-muted">{description}</p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </Container>
  )
}
