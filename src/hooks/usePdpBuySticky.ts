import { useEffect, useState, type CSSProperties, type RefObject } from 'react'

const PDP_DESKTOP_MIN_WIDTH = 900

function readCssLength(element: HTMLElement, varName: string, fallbackPx: number): number {
  const raw = getComputedStyle(element).getPropertyValue(varName).trim()
  if (!raw) return fallbackPx

  if (raw.endsWith('rem')) {
    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    return Number.parseFloat(raw) * rootFontSize
  }

  if (raw.endsWith('px')) {
    return Number.parseFloat(raw)
  }

  const parsed = Number.parseFloat(raw)
  return Number.isNaN(parsed) ? fallbackPx : parsed
}

function rectsOverlapVertically(
  a: Pick<DOMRect, 'top' | 'bottom'>,
  b: Pick<DOMRect, 'top' | 'bottom'>,
): boolean {
  return a.top < b.bottom && a.bottom > b.top
}

export type PdpBelowSectionKey = 'fieldNotes' | 'description' | 'related'

export interface PdpBelowSectionRefs {
  fieldNotes: RefObject<HTMLElement | null>
  description: RefObject<HTMLElement | null>
  related: RefObject<HTMLElement | null>
}

const EMPTY_SQUEEZED: Record<PdpBelowSectionKey, boolean> = {
  fieldNotes: false,
  description: false,
  related: false,
}

export interface PdpBuyStickyState {
  isBuyPinned: boolean
  pinnedStyle?: CSSProperties
  placeholderHeight: number
  squeezedSections: Record<PdpBelowSectionKey, boolean>
}

/**
 * Pins the buy panel as soon as the page scrolls and indents below-hero sections
 * individually when they overlap the fixed buy column.
 */
export function usePdpBuySticky(
  containerRef: RefObject<HTMLElement | null>,
  buySlotRef: RefObject<HTMLElement | null>,
  buyRef: RefObject<HTMLElement | null>,
  productId: string,
  belowSectionRefs: PdpBelowSectionRefs,
): PdpBuyStickyState {
  const [state, setState] = useState<PdpBuyStickyState>({
    isBuyPinned: false,
    placeholderHeight: 0,
    squeezedSections: EMPTY_SQUEEZED,
  })

  useEffect(() => {
    const container = containerRef.current
    const buySlot = buySlotRef.current
    const buy = buyRef.current
    if (!container || !buySlot || !buy) return

    const update = () => {
      const placeholderHeight = buy.offsetHeight

      if (window.innerWidth < PDP_DESKTOP_MIN_WIDTH) {
        setState({
          isBuyPinned: false,
          placeholderHeight,
          squeezedSections: EMPTY_SQUEEZED,
        })
        return
      }

      const isBuyPinned = window.scrollY > 0

      if (!isBuyPinned) {
        setState({
          isBuyPinned: false,
          placeholderHeight,
          squeezedSections: EMPTY_SQUEEZED,
        })
        return
      }

      const headerHeight = readCssLength(
        document.documentElement,
        '--header-height',
        76,
      )
      const stickyTop = headerHeight + 16
      const buyHeight = buy.offsetHeight
      const slotRect = buySlot.getBoundingClientRect()
      // Follow the slot while the breadcrumb scrolls away, then lock under the header.
      const pinnedTop = Math.max(stickyTop, slotRect.top)
      const pinnedLeft = slotRect.left
      const pinnedWidth = slotRect.width
      const buyOverlapRect = { top: pinnedTop, bottom: pinnedTop + buyHeight }

      const squeezedSections = (Object.keys(belowSectionRefs) as PdpBelowSectionKey[]).reduce(
        (acc, key) => {
          const section = belowSectionRefs[key].current
          acc[key] = section
            ? rectsOverlapVertically(section.getBoundingClientRect(), buyOverlapRect)
            : false
          return acc
        },
        { ...EMPTY_SQUEEZED },
      )

      setState({
        isBuyPinned: true,
        placeholderHeight,
        squeezedSections,
        pinnedStyle: {
          position: 'fixed',
          top: `${pinnedTop}px`,
          left: `${pinnedLeft}px`,
          width: `${pinnedWidth}px`,
          zIndex: 20,
        },
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(container)
    resizeObserver.observe(buySlot)
    resizeObserver.observe(buy)
    for (const ref of Object.values(belowSectionRefs)) {
      if (ref.current) resizeObserver.observe(ref.current)
    }

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      resizeObserver.disconnect()
    }
  }, [containerRef, buySlotRef, buyRef, productId, belowSectionRefs])

  return state
}
