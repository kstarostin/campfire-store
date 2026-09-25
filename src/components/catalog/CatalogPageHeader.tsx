import type { ReactNode } from 'react'
import { LocaleLink } from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n'

export interface CatalogBreadcrumbItem {
  label: string
  to?: string
}

interface CatalogBreadcrumbProps {
  items: CatalogBreadcrumbItem[]
}

export function CatalogBreadcrumb({ items }: CatalogBreadcrumbProps) {
  const { t } = useTranslation()

  if (items.length === 0) return null

  return (
    <ol className="catalog-breadcrumb">
      <li>
        <LocaleLink to="/">{t('pages.home')}</LocaleLink>
      </li>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <li key={`${item.label}-${index}`}>
            <span className="catalog-breadcrumb__sep" aria-hidden>
              ›
            </span>
            {isLast || !item.to ? (
              <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
            ) : (
              <LocaleLink to={item.to}>{item.label}</LocaleLink>
            )}
          </li>
        )
      })}
    </ol>
  )
}

interface CatalogPageHeaderProps {
  breadcrumb?: ReactNode
  title: ReactNode
  subtitle?: string
  /** Control shown on the title's line, at the right edge. */
  action?: ReactNode
}

export function CatalogPageHeader({
  breadcrumb,
  title,
  subtitle,
  action,
}: CatalogPageHeaderProps) {
  return (
    <header className="catalog-page-header">
      {breadcrumb}
      {/* Same .section-head as the home page sections, so the title, the
          paragraph under it and the control beside it are one shared rule
          rather than two sets of values kept in step by hand. */}
      <div className="section-head">
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {action}
      </div>
    </header>
  )
}
