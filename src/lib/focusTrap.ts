const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1,
  )
}

export function focusInitialElement(container: HTMLElement) {
  const focusable = getFocusableElements(container)
  const preferred = container.querySelector<HTMLElement>('[data-focus-initial]')
  if (preferred && container.contains(preferred)) {
    preferred.focus()
    return
  }
  focusable[0]?.focus()
}

export function createFocusTrap(container: HTMLElement) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return

    const focusable = getFocusableElements(container)
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
      return
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}
