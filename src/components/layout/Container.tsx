import { forwardRef, type ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  /** Slightly wider than body — use in header / mega-menu */
  wide?: boolean
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { children, className = '', wide = false },
  ref,
) {
  const baseClass = wide ? 'site-container--header' : 'site-container'
  return (
    <div ref={ref} className={`${baseClass} ${className}`.trim()}>
      {children}
    </div>
  )
})
