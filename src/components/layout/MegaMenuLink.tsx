import type { ComponentProps } from 'react'
import { Flame } from 'lucide-react'
import { LocaleLink } from '@/components/ui/LocaleLink'

type MegaMenuLinkProps = ComponentProps<typeof LocaleLink> & {
  showFire?: boolean
}

export function MegaMenuLink({
  className = '',
  children,
  showFire = true,
  ...props
}: MegaMenuLinkProps) {
  return (
    <LocaleLink className={`mega-menu-link ${className}`.trim()} {...props}>
      {showFire ? (
        <Flame className="mega-menu-link__fire" aria-hidden strokeWidth={2.25} />
      ) : null}
      <span className="mega-menu-link__label">{children}</span>
    </LocaleLink>
  )
}
