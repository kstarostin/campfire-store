import { Filter, Search, Tent } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTranslation } from '@/i18n'

interface CatalogProductsEmptyProps {
  variant: 'category' | 'search' | 'all'
  hasActiveFilters: boolean
  query?: string
  onClearFilters?: () => void
}

export function CatalogProductsEmpty({
  variant,
  hasActiveFilters,
  query,
  onClearFilters,
}: CatalogProductsEmptyProps) {
  const { t } = useTranslation()

  if (hasActiveFilters) {
    return (
      <EmptyState
        className="catalog-products-empty"
        icon={Filter}
        title={t('catalog.filtersEmptyTitle')}
        description={t('catalog.filtersEmptyBody')}
        action={
          onClearFilters
            ? { label: t('catalog.clearAll'), onClick: onClearFilters }
            : undefined
        }
        secondaryAction={{ label: t('catalog.browseAllProducts'), to: '/products' }}
      />
    )
  }

  if (variant === 'search' && query) {
    return (
      <EmptyState
        className="catalog-products-empty"
        icon={Search}
        title={t('catalog.searchNoResultsTitle', { query })}
        description={t('catalog.searchNoResultsBody')}
        action={{ label: t('catalog.browseAllProducts'), to: '/products' }}
        secondaryAction={{ label: t('nav.categories'), to: '/categories' }}
      />
    )
  }

  return (
    <EmptyState
      className="catalog-products-empty"
      icon={Tent}
      title={t('catalog.categoryEmptyTitle')}
      description={t('catalog.categoryEmptyBody')}
      action={{ label: t('catalog.browseAllProducts'), to: '/products' }}
      secondaryAction={{ label: t('nav.categories'), to: '/categories' }}
    />
  )
}
