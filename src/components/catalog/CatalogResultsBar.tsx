import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CatalogVariant } from '@/lib/catalogUrlState'
import { useTranslation } from '@/i18n'

interface CatalogResultsBarProps {
  page: number
  limit: number
  total: number
  variant: CatalogVariant
}

export function CatalogResultsBar({ page, limit, total, variant }: CatalogResultsBarProps) {
  const { t } = useTranslation()

  if (total === 0) {
    return (
      <p className="catalog-results-bar">
        {variant === 'search' ? t('catalog.noSearchResults') : t('catalog.noProducts')}
      </p>
    )
  }

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <p className="catalog-results-bar">
      {variant === 'search'
        ? t('catalog.showingSearchResults', { start, end, total })
        : t('catalog.showingProducts', { start, end, total })}
    </p>
  )
}

interface PaginationProps {
  page: number
  pages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pages, onPageChange }: PaginationProps) {
  const { t } = useTranslation()

  if (pages <= 1) return null

  const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1).filter(
    (pageNumber) =>
      pageNumber === 1 ||
      pageNumber === pages ||
      Math.abs(pageNumber - page) <= 1,
  )

  return (
    <nav className="catalog-pagination" aria-label={t('catalog.pagination')}>
      <button
        type="button"
        className={page <= 1 ? 'is-disabled' : ''}
        disabled={page <= 1}
        aria-label={t('catalog.previousPage')}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={16} aria-hidden />
      </button>

      {pageNumbers.map((pageNumber, index) => {
        const previous = pageNumbers[index - 1]
        const showEllipsis = previous !== undefined && pageNumber - previous > 1

        return (
          <span key={pageNumber} className="catalog-pagination__item">
            {showEllipsis ? <span className="catalog-pagination__ellipsis">…</span> : null}
            <button
              type="button"
              className={pageNumber === page ? 'is-active' : ''}
              aria-current={pageNumber === page ? 'page' : undefined}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </span>
        )
      })}

      <button
        type="button"
        className={page >= pages ? 'is-disabled' : ''}
        disabled={page >= pages}
        aria-label={t('catalog.nextPage')}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={16} aria-hidden />
      </button>
    </nav>
  )
}
