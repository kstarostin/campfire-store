import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { LocaleLink } from '@/components/ui/LocaleLink'

type ButtonVariant = 'primary' | 'secondary' | 'forest' | 'ghost'

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  forest: 'btn btn-forest',
  ghost: 'btn btn-ghost',
}

interface ButtonBaseProps {
  variant?: ButtonVariant
  children: ReactNode
  className?: string
}

type ButtonAsButton = ButtonBaseProps &
  ComponentPropsWithoutRef<'button'> & { to?: undefined }

type ButtonAsLink = ButtonBaseProps &
  ComponentPropsWithoutRef<typeof LocaleLink> & { to: string }

type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = `${variantClass[variant]} ${className}`.trim()

  if ('to' in props && props.to) {
    const { to, ...linkProps } = props
    return (
      <LocaleLink to={to} className={classes} {...linkProps}>
        {children}
      </LocaleLink>
    )
  }

  const { type = 'button', ...buttonProps } = props as ButtonAsButton
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
