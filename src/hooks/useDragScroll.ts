import { useCallback, useEffect, useState } from 'react'

/**
 * Lets a horizontally scrollable element be dragged with the mouse.
 *
 * Returns a ref callback rather than taking a RefObject: the elements that want
 * this render conditionally — the related rail only appears once its query
 * resolves — so an effect reading `ref.current` ran while it was still null and
 * never bound anything. A callback ref fires when the node actually arrives.
 *
 * Touch and trackpads already scroll natively, so only the mouse is handled. A
 * drag past a few pixels swallows the click that follows, so dragging across a
 * product card does not also open it.
 */
export function useDragScroll<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null)
  const ref = useCallback((node: T | null) => setElement(node), [])

  useEffect(() => {
    if (!element) return

    let startX = 0
    let startScroll = 0
    let dragging = false
    let moved = false

    // Links and images start a native HTML drag as soon as the pointer moves,
    // which steals the gesture and leaves the scroller motionless.
    const onDragStart = (event: DragEvent) => event.preventDefault()

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || event.button !== 0) return

      dragging = true
      moved = false
      startX = event.clientX
      startScroll = element.scrollLeft
      element.classList.add('is-dragging')
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return

      const delta = event.clientX - startX
      if (Math.abs(delta) > 3) moved = true
      element.scrollLeft = startScroll - delta
      event.preventDefault()
    }

    const endDrag = () => {
      if (!dragging) return
      dragging = false
      element.classList.remove('is-dragging')
    }

    // Capture phase: swallow the click before it reaches a card or link.
    const onClick = (event: MouseEvent) => {
      if (!moved) return
      event.preventDefault()
      event.stopPropagation()
      moved = false
    }

    element.addEventListener('dragstart', onDragStart)
    element.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    element.addEventListener('click', onClick, true)

    return () => {
      element.removeEventListener('dragstart', onDragStart)
      element.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      element.removeEventListener('click', onClick, true)
    }
  }, [element])

  return ref
}
