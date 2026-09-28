// Track C — C1 scroll engine. The signature interaction: scrolling anywhere
// over the single-screen app steps through projects and swaps the preview.
// Encapsulated here so we never touch App.tsx — listeners attach to window/
// document from within the hook. Owns src/components/rail/* only.

import { useEffect, useRef, type RefObject } from 'react'
import { usePortfolio } from '../../app/PortfolioProvider'

// Fluid pacing (reference: bguillaume.info). Scroll distance maps directly to
// steps with momentum carried over — no post-step lock, so a continuous wheel /
// trackpad gesture flows smoothly through projects instead of stopping on each.
const STEP = 90 // wheel delta that advances one project (~one mouse notch)
const CARRY_CAP = STEP // clamp leftover so momentum can't run away unbounded

interface UseRailScrollArgs {
  listRef: RefObject<HTMLUListElement | null>
  tileRefs: RefObject<(HTMLButtonElement | null)[]>
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// True when the event originates inside a text field — don't hijack those.
// Guards against a non-Element target (e.g. window/document) having no
// .closest before we call it.
function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest('input, textarea, select, [contenteditable="true"]') !== null
  )
}

export function useRailScroll({ listRef, tileRefs }: UseRailScrollArgs) {
  const { activeIndex, projects, next, prev, setActiveIndex } = usePortfolio()
  const count = projects.length

  // Latest values read inside the (once-registered) listeners without
  // re-binding them every render.
  const stateRef = useRef({ activeIndex, count, next, prev, setActiveIndex })
  stateRef.current = { activeIndex, count, next, prev, setActiveIndex }

  // Center the active tile whenever the index changes (smooth, or instant
  // under reduced-motion).
  useEffect(() => {
    const tile = tileRefs.current?.[activeIndex]
    if (!tile) return
    const reduce = prefersReducedMotion()
    tile.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'center',
      inline: 'center',
    })
  }, [activeIndex, tileRefs])

  // Wheel + keyboard engine — registered once.
  useEffect(() => {
    let accum = 0

    const atFirst = () => stateRef.current.activeIndex <= 0
    const atLast = () =>
      stateRef.current.activeIndex >= stateRef.current.count - 1

    const onWheel = (e: WheelEvent) => {
      // Don't hijack while typing in a field (defensive — no inputs today).
      if (isEditableTarget(e.target)) return

      const down = e.deltaY > 0

      // Edge release: let the page scroll normally at the ends.
      if ((down && atLast()) || (!down && atFirst())) {
        accum = 0
        return
      }

      // Consume the gesture to drive the rail. Accumulated scroll distance maps
      // directly to steps (remainder carried), so a continuous wheel/trackpad
      // gesture flows through projects with momentum — no per-step lock.
      e.preventDefault()
      accum += e.deltaY

      while (accum >= STEP && !atLast()) {
        stateRef.current.next()
        accum -= STEP
      }
      while (accum <= -STEP && !atFirst()) {
        stateRef.current.prev()
        accum += STEP
      }

      // Clamp leftover so momentum can't build up unbounded between steps.
      if (accum > CARRY_CAP) accum = CARRY_CAP
      else if (accum < -CARRY_CAP) accum = -CARRY_CAP
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault()
          stateRef.current.next()
          break
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault()
          stateRef.current.prev()
          break
        case 'Home':
          e.preventDefault()
          stateRef.current.setActiveIndex(0)
          break
        case 'End':
          e.preventDefault()
          stateRef.current.setActiveIndex(stateRef.current.count - 1)
          break
        default:
          break
      }
    }

    // { passive: false } so preventDefault actually blocks page scroll.
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // listRef is reserved for C2 (overflow container tuning); referenced so the
  // arg stays part of the stable hook signature.
  void listRef
}
