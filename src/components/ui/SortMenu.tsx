import { ChevronDown } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export interface SortMenuOption<T extends string> {
  value: T
  label: string
}

interface SortMenuProps<T extends string> {
  value: T
  options: SortMenuOption<T>[]
  onChange: (value: T) => void
  /** Accessible name for the control. */
  label: string
  className?: string
}

/**
 * Listbox replacement for a native <select>, styled like the header's
 * language/currency panel but on a light ground.
 *
 * A native select carries its keyboard behaviour for free; a div does not, so
 * this implements the listbox pattern explicitly — arrows and Home/End move
 * through the options, Enter or Space picks one, Escape closes and hands focus
 * back to the trigger.
 */
export function SortMenu<T extends string>({
  value,
  options,
  onChange,
  label,
  className = '',
}: SortMenuProps<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const selected = options[selectedIndex]

  /*
   * The panel hangs from the trigger's right edge, which is what keeps it
   * inside the page while the control sits at the end of the filter bar. Once
   * the bar wraps, though, the trigger is at the bar's left and the panel — a
   * good deal wider than it — runs off the left of the screen.
   *
   * Nudging it back in beats flipping it to left-aligned, which is the fix the
   * manufacturer menu can afford only because it always sits at the left: on a
   * right-hand trigger the same flip trades the overflow for one off the other
   * edge. This reads the rendered position, so it needs no breakpoint and no
   * guess at where the bar happens to wrap.
   */
  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!open || !panel) return

    // Written straight to the node rather than held in state: this is a
    // measurement correcting the layout it just measured, and a state round
    // trip would only re-render the panel to the same place.
    panel.style.transform = ''
    const rect = panel.getBoundingClientRect()
    const margin = 8
    const shift =
      rect.left < margin
        ? margin - rect.left
        : Math.min(0, window.innerWidth - margin - rect.right)

    if (shift) panel.style.transform = `translateX(${shift}px)`
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [open])

  // Move focus onto the current option when the panel opens, so the keyboard
  // lands where the native select would have.
  useEffect(() => {
    if (open) {
      optionRefs.current[selectedIndex]?.focus()
    }
  }, [open, selectedIndex])

  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }

  const pick = (next: T) => {
    onChange(next)
    close()
  }

  const handleOptionKeys = (event: React.KeyboardEvent, index: number) => {
    const last = options.length - 1
    const focusAt = (target: number) => {
      event.preventDefault()
      optionRefs.current[target]?.focus()
    }

    if (event.key === 'ArrowDown') focusAt(index === last ? 0 : index + 1)
    else if (event.key === 'ArrowUp') focusAt(index === 0 ? last : index - 1)
    else if (event.key === 'Home') focusAt(0)
    else if (event.key === 'End') focusAt(last)
    else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className={`sort-menu ${className}`.trim()}>
      <button
        ref={triggerRef}
        type="button"
        className="sort-menu__trigger"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
        <span>{selected?.label}</span>
        <ChevronDown
          size={16}
          aria-hidden
          className={`sort-menu__chevron${open ? ' is-open' : ''}`}
        />
      </button>

      {open ? (
        <div
          ref={panelRef}
          className="sort-menu__panel"
          role="listbox"
          aria-label={label}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element
              }}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`sort-menu__option${option.value === value ? ' is-active' : ''}`}
              onClick={() => pick(option.value)}
              onKeyDown={(event) => handleOptionKeys(event, index)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
