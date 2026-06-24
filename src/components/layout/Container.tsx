import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  /** Slightly wider than body — use in header / mega-menu */
  wide?: boolean
}

export function Container({ children, className = '', wide = false }: ContainerProps) {
  const baseClass = wide ? 'site-container--header' : 'site-container'
  return <div className={`${baseClass} ${className}`.trim()}>{children}</div>
}
