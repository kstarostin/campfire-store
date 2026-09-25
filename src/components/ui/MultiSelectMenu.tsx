import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface MultiSelectMenuProps {
  /** Name of the facet, shown on the trigger. */
  label: string
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  /** Label for the row that clears the selection. */
  allLabel: string
}

/**
 * Multi-select listbox, styled like `SortMenu` but with checkable rows.
 *
 * Unlike a single-select menu this stays open while you tick options — the
 * common case is choosing two or three — and closes on Escape, Tab or an
 * outside click.
 */
export function MultiSelectMenu({
  label,
  options,
  selected,
  onChange,
  allLabel,
}: MultiSelectMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

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

  useEffect(() => {
    if (open) optionRefs.current[0]?.focus()
  }, [open])

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  const toggle = (name: string) => {
    onChange(
      selected.includes(name)
        ? selected.filter((item) => item !== name)
        : [...selected, name],
    )
  }

  const handleKeys = (event: React.KeyboardEvent, index: number) => {
    const last = options.length
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
    <div ref={rootRef} className="sort-menu multi-menu">
      <button
        ref={triggerRef}
        type="button"
        className="sort-menu__trigger"
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
        <span>{label}</span>
        {selected.length > 0 ? (
          <span className="multi-menu__count">{selected.length}</span>
        ) : null}
        <ChevronDown
          size={16}
          aria-hidden
          className={`sort-menu__chevron${open ? ' is-open' : ''}`}
        />
      </button>

      {open ? (
        <div
          className="sort-menu__panel multi-menu__panel"
          role="listbox"
          aria-multiselectable
          aria-label={label}
        >
          <button
            ref={(element) => {
              optionRefs.current[0] = element
            }}
            type="button"
            role="option"
            aria-selected={selected.length === 0}
            className={`sort-menu__option multi-menu__option${selected.length === 0 ? ' is-active' : ''}`}
            onClick={() => onChange([])}
            onKeyDown={(event) => handleKeys(event, 0)}
          >
            <span className="multi-menu__tick" aria-hidden>
              {selected.length === 0 ? <Check size={14} /> : null}
            </span>
            {allLabel}
          </button>

          {options.map((name, index) => {
            const isSelected = selected.includes(name)

            return (
              <button
                key={name}
                ref={(element) => {
                  optionRefs.current[index + 1] = element
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`sort-menu__option multi-menu__option${isSelected ? ' is-active' : ''}`}
                onClick={() => toggle(name)}
                onKeyDown={(event) => handleKeys(event, index + 1)}
              >
                <span className="multi-menu__tick" aria-hidden>
                  {isSelected ? <Check size={14} /> : null}
                </span>
                {name}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
