import type { PriceQuickFilter } from '@/api/normalizers'
import type { Currency } from '@/api/types'
import { Chip } from '@/components/ui/Chip'
import { MultiSelectMenu } from '@/components/ui/MultiSelectMenu'
import { SortMenu, type SortMenuOption } from '@/components/ui/SortMenu'
import { useFormatLocale, useTranslation } from '@/i18n'
import { formatPrice } from '@/lib/formatPrice'
import {
  formatCatalogPriceInput,
  parseCatalogPriceInput,
} from '@/lib/productCatalogFilters'

/** Controls a host can switch on; `sort` always renders last, at the right. */
export type ProductFilterKey = 'manufacturer' | 'price' | 'priceQuick' | 'sort'

const ALL_FILTERS: ProductFilterKey[] = ['manufacturer', 'price', 'priceQuick', 'sort']

/**
 * Above this many manufacturers the facet collapses into a multi-select menu;
 * at or below it, they stay as toggles you can see all of at once.
 */
export const MANUFACTURER_CHIP_LIMIT = 5

interface ProductFilterBarProps<TSort extends string> {
  /** Which controls to render. Omit for all of them. */
  show?: ProductFilterKey[]

  manufacturers?: string[]
  selectedManufacturers?: string[]
  onManufacturersChange?: (next: string[]) => void

  priceMin?: number | null
  priceMax?: number | null
  onPriceChange?: (min: number | null, max: number | null) => void

  priceQuickFilters?: PriceQuickFilter[]
  priceQuickMax?: number | null
  onPriceQuickChange?: (max: number | null) => void
  currency?: Currency

  sort: TSort
  sortOptions: SortMenuOption<TSort>[]
  onSortChange: (next: TSort) => void
  sortLabel: string

  /** Context line, e.g. the query a search is refining. */
  activeSummary?: string
  activeCount?: number
  onClear?: () => void
}

/**
 * One filter bar for the whole shop: the home page's featured products and
 * every catalog page render this, differing only in which controls they switch
 * on and how they store the state — the home page keeps it locally and filters
 * in memory, the catalog pages keep it in the URL and filter server-side.
 *
 * Everything sits on one wrapping line with sort pushed to the right edge.
 */
export function ProductFilterBar<TSort extends string>({
  show = ALL_FILTERS,
  manufacturers = [],
  selectedManufacturers = [],
  onManufacturersChange,
  priceMin = null,
  priceMax = null,
  onPriceChange,
  priceQuickFilters = [],
  priceQuickMax = null,
  onPriceQuickChange,
  currency = 'USD',
  sort,
  sortOptions,
  onSortChange,
  sortLabel,
  activeSummary,
  activeCount = 0,
  onClear,
}: ProductFilterBarProps<TSort>) {
  const { t } = useTranslation()
  const formatLocale = useFormatLocale()

  const visible = (key: ProductFilterKey) => show.includes(key)
  const showManufacturer = visible('manufacturer') && manufacturers.length > 0
  const asChips = manufacturers.length <= MANUFACTURER_CHIP_LIMIT

  const toggleManufacturer = (name: string) => {
    if (!onManufacturersChange) return
    onManufacturersChange(
      selectedManufacturers.includes(name)
        ? selectedManufacturers.filter((item) => item !== name)
        : [...selectedManufacturers, name],
    )
  }

  return (
    <div className="product-filter-bar">
      {showManufacturer ? (
        asChips ? (
          <div className="product-filter-bar__chips">
            <Chip
              active={selectedManufacturers.length === 0}
              onClick={() => onManufacturersChange?.([])}
            >
              {t('common.all')}
            </Chip>
            {manufacturers.map((name) => (
              <Chip
                key={name}
                active={selectedManufacturers.includes(name)}
                onClick={() => toggleManufacturer(name)}
              >
                {name}
              </Chip>
            ))}
          </div>
        ) : (
          <MultiSelectMenu
            label={t('catalog.manufacturer')}
            options={manufacturers}
            selected={selectedManufacturers}
            onChange={(next) => onManufacturersChange?.(next)}
            allLabel={t('catalog.allManufacturers')}
          />
        )
      ) : null}

      {visible('price') && onPriceChange ? (
        <div className="product-filter-bar__price">
          <label>
            <span className="sr-only">{t('catalog.priceMin')}</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              pattern="[0-9]*"
              placeholder={t('catalog.priceMin')}
              aria-label={t('catalog.priceMin')}
              value={formatCatalogPriceInput(priceMin)}
              disabled={priceQuickMax != null}
              onChange={(event) =>
                onPriceChange(parseCatalogPriceInput(event.target.value), priceMax)
              }
            />
          </label>
          <span aria-hidden>–</span>
          <label>
            <span className="sr-only">{t('catalog.priceMax')}</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              pattern="[0-9]*"
              placeholder={t('catalog.priceMax')}
              aria-label={t('catalog.priceMax')}
              value={formatCatalogPriceInput(priceMax)}
              disabled={priceQuickMax != null}
              onChange={(event) =>
                onPriceChange(priceMin, parseCatalogPriceInput(event.target.value))
              }
            />
          </label>
        </div>
      ) : null}

      {visible('priceQuick') && priceQuickFilters.length > 0 ? (
        <div className="product-filter-bar__chips">
          {priceQuickFilters.map((quickFilter) => (
            <Chip
              key={quickFilter.max}
              forest
              active={priceQuickMax === quickFilter.max}
              onClick={() =>
                onPriceQuickChange?.(priceQuickMax === quickFilter.max ? null : quickFilter.max)
              }
            >
              {t('catalog.underPrice', {
                price: formatPrice({ [currency]: quickFilter.max }, currency, formatLocale),
              })}
            </Chip>
          ))}
        </div>
      ) : null}

      {activeSummary ? (
        <span className="product-filter-bar__summary">{activeSummary}</span>
      ) : null}

      {activeCount > 0 && onClear ? (
        <button type="button" className="catalog-text-link" onClick={onClear}>
          {t('catalog.clearAll')}
        </button>
      ) : null}

      {visible('sort') ? (
        <SortMenu
          className="product-filter-bar__sort"
          label={sortLabel}
          value={sort}
          options={sortOptions}
          onChange={onSortChange}
        />
      ) : null}
    </div>
  )
}
