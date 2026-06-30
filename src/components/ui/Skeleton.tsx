import type { CSSProperties } from 'react'

interface SkeletonProps {
  className?: string
  style?: CSSProperties
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return <span className={`skeleton skeleton--pulse ${className}`.trim()} style={style} aria-hidden />
}
