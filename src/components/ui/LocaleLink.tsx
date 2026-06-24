import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { useLocalePath } from '@/hooks/useLocalePath'

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, 'to'> & {
  to: ComponentProps<typeof Link>['to']
}

function resolveTo(
  to: LocaleLinkProps['to'],
  localePath: (path: string) => string,
): LocaleLinkProps['to'] {
  if (typeof to === 'string') {
    return localePath(to)
  }

  if (typeof to === 'object' && to !== null && 'pathname' in to && to.pathname) {
    return { ...to, pathname: localePath(to.pathname) }
  }

  return to
}

export function LocaleLink({ to, ...props }: LocaleLinkProps) {
  const localePath = useLocalePath()
  return <Link to={resolveTo(to, localePath)} {...props} />
}
