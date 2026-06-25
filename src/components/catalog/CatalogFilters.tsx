import { SlidersHorizontal } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { Chip } from '@/components/ui/Chip'
import { useTranslation, useFormatLocale } from '@/i18n'
import type { Currency } from '@/api/types'
import type { PriceQuickFilter } from '@/api/normalizers'
import { formatPrice } from '@/lib/formatPrice'
import type { CatalogFilterState, CatalogSort } from '@/lib/productCatalogFilters'
import {
  countActiveCatalogFilters,
  formatCatalogPriceInput,
  parseCatalogPriceInput,
} from '@/lib/productCatalogFilters'

interface CatalogFiltersProps {
  manufacturers: string[]
  priceQuickFilters: PriceQuickFilter[]
  filters: CatalogFilterState
  sort: CatalogSort
  currency: Currency
  variant: 'category' | 'search'
  activeSummary?: string
  defaultOpen?: boolean
  onFiltersChange: (filters: CatalogFilterState) => void
  onSortChange: (sort: CatalogSort) => void
  onClear: () => void
}

export function CatalogFilters({
  manufacturers,
  priceQuickFilters,
  filters,
  sort,
  currency,
  variant,
  activeSummary,
  defaultOpen = false,
  onFiltersChange,
  onSortChange,
  onClear,
}: CatalogFiltersProps) {
  const { t } = useTranslation()
  const formatLocale = useFormatLocale()
  const panelId = useId()
  const [open, setOpen] = useState(defaultOpen)
  const activeCount = countActiveCatalogFilters(filters)

  useEffect(() => {
    setOpen(defaultOpen)
  }, [defaultOpen])

  const sortOptions: { value: CatalogSort; label: string }[] =
    variant === 'search'
      ? [
          { value: 'relevance', label: t('catalog.sortRelevance') },
          { value: 'newest', label: t('catalog.sortNewest') },
          { value: 'priceAsc', label: t('catalog.sortPriceAsc') },
          { value: 'priceDesc', label: t('catalog.sortPriceDesc') },
        ]
      : [
          { value: 'newest', label: t('catalog.sortNewest') },
          { value: 'priceAsc', label: t('catalog.sortPriceAsc') },
          { value: 'priceDesc', label: t('catalog.sortPriceDesc') },
        ]

  return (
    <>
      <button
        type="button"
        className={`catalog-filters-toggle ${open ? 'is-open' : ''}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <SlidersHorizontal size={16} aria-hidden />
        {open ? t('catalog.hideFilters') : t('catalog.showFilters')}
        {activeCount > 0 ? <span className="catalog-filter-count">{activeCount}</span> : null}
      </button>

      <section
        id={panelId}
        className={`catalog-filters ${open ? 'is-open' : ''}`}
        aria-label={variant === 'search' ? t('catalog.refineResults') : t('catalog.filters')}
      >
        <div className="catalog-filters__head">
          <h2>
            <SlidersHorizontal size={18} aria-hidden />
            {variant === 'search' ? t('catalog.refineResults') : t('catalog.filters')}
            {activeCount > 0 ? (
              <span className="catalog-filter-count">{activeCount}</span>
            ) : null}
          </h2>
          {activeCount > 0 ? (
            <button type="button" className="catalog-text-link" onClick={onClear}>
              {t('catalog.clearAll')}
            </button>
          ) : null}
        </div>

        <div className="catalog-filters__body">
          <fieldset className="catalog-filter-group">
            <legend>{t('catalog.manufacturer')}</legend>
            <div className="chip-row">
              <Chip
                active={filters.manufacturer === null}
                onClick={() =>
                  onFiltersChange({ ...filters, manufacturer: null })
                }
              >
                {t('common.all')}
              </Chip>
              {manufacturers.map((name) => (
                <Chip
                  key={name}
                  active={filters.manufacturer === name}
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      manufacturer: filters.manufacturer === name ? null : name,
                    })
                  }
                >
                  {name}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset className="catalog-filter-group">
            <legend>{t('catalog.price')}</legend>
            <div className="catalog-price-range">
              <label>
                {t('catalog.priceMin')}
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  pattern="[0-9]*"
                  value={formatCatalogPriceInput(filters.priceMin)}
                  disabled={filters.priceQuickMax != null}
                  onChange={(event) => {
                    onFiltersChange({
                      ...filters,
                      priceQuickMax: null,
                      priceMin: parseCatalogPriceInput(event.target.value),
                    })
                  }}
                />
              </label>
              <span aria-hidden>–</span>
              <label>
                {t('catalog.priceMax')}
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  pattern="[0-9]*"
                  value={formatCatalogPriceInput(filters.priceMax)}
                  disabled={filters.priceQuickMax != null}
                  onChange={(event) => {
                    onFiltersChange({
                      ...filters,
                      priceQuickMax: null,
                      priceMax: parseCatalogPriceInput(event.target.value),
                    })
                  }}
                />
              </label>
            </div>
            {priceQuickFilters.length > 0 ? (
              <div className="chip-row catalog-price-quick-filters">
                {priceQuickFilters.map((quickFilter) => {
                  const label = t('catalog.underPrice', {
                    price: formatPrice({ [currency]: quickFilter.max }, currency, formatLocale),
                  })

                  return (
                    <Chip
                      key={quickFilter.max}
                      forest
                      active={filters.priceQuickMax === quickFilter.max}
                      onClick={() =>
                        onFiltersChange({
                          ...filters,
                          priceQuickMax:
                            filters.priceQuickMax === quickFilter.max
                              ? null
                              : quickFilter.max,
                          priceMin: null,
                          priceMax: null,
                        })
                      }
                    >
                      {label}
                    </Chip>
                  )
                })}
              </div>
            ) : null}
          </fieldset>

          <div className="catalog-filter-row">
            {activeSummary ? (
              <span className="catalog-active-summary">{activeSummary}</span>
            ) : null}
            <select
              className="sort-select"
              aria-label={t('catalog.sortAria')}
              value={sort}
              onChange={(event) => onSortChange(event.target.value as CatalogSort)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>
    </>
  )
}
