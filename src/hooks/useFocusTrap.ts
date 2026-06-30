import { useEffect, useRef, type RefObject } from 'react'
import { createFocusTrap, focusInitialElement } from '@/lib/focusTrap'

export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  returnFocusRef?: RefObject<HTMLElement | null>,
) {
  const returnFocusElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    returnFocusElementRef.current =
      returnFocusRef?.current ?? (document.activeElement as HTMLElement | null)

    const container = containerRef.current
    focusInitialElement(container)
    const releaseTrap = createFocusTrap(container)

    return () => {
      releaseTrap()
      returnFocusElementRef.current?.focus()
    }
  }, [active, containerRef, returnFocusRef])
}
