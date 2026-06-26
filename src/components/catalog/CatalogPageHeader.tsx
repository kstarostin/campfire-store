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
}

export function CatalogPageHeader({ breadcrumb, title, subtitle }: CatalogPageHeaderProps) {
  return (
    <header className="catalog-page-header">
      {breadcrumb}
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </header>
  )
}
