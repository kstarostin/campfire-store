import type { ReactNode } from 'react'

interface ChipProps {
  active?: boolean
  forest?: boolean
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function Chip({
  active = false,
  forest = false,
  children,
  onClick,
  className = '',
}: ChipProps) {
  return (
    <button
      type="button"
      className={`chip ${active ? 'is-active' : ''} ${forest ? 'is-forest' : ''} ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
