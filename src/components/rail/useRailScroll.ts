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
const STEP_MS = 240 // cadence between queued steps — one preview transition
const MAX_QUEUE = 5 // a big flick can bank up to this many steps

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
    // Wheel distance banks into `queue` (signed steps). A drain timer plays
    // them one at a time at STEP_MS so a single flick glides through several
    // projects, each with a full transition, instead of stopping at the next
    // one or jumping several at once.
    let accum = 0
    let queue = 0
    let timer: number | null = null
    let lastStepAt = -Infinity

    const atFirst = () => stateRef.current.activeIndex <= 0
    const atLast = () =>
      stateRef.current.activeIndex >= stateRef.current.count - 1

    const drain = () => {
      timer = null
      if (queue > 0 && !atLast()) {
        stateRef.current.next()
        queue -= 1
      } else if (queue < 0 && !atFirst()) {
        stateRef.current.prev()
        queue += 1
      } else {
        queue = 0
      }
      lastStepAt = performance.now()
      if (queue !== 0) timer = window.setTimeout(drain, STEP_MS)
    }

    // Next step lands STEP_MS after the previous one, whether it was queued
    // or came from a fresh wheel event.
    const schedule = () => {
      if (timer !== null) return
      const wait = Math.max(0, STEP_MS - (performance.now() - lastStepAt))
      timer = window.setTimeout(drain, wait)
    }

    const onWheel = (e: WheelEvent) => {
      // Don't hijack while typing in a field (defensive — no inputs today).
      if (isEditableTarget(e.target)) return

      const down = e.deltaY > 0

      // Edge release: let the page scroll normally at the ends (with nothing
      // queued in that direction).
      if (
        (down && atLast() && queue <= 0) ||
        (!down && atFirst() && queue >= 0)
      ) {
        accum = 0
        queue = 0
        return
      }

      e.preventDefault()

      // A reversal drops whatever was banked the other way.
      if (accum > 0 !== down) accum = 0
      if ((queue > 0 && !down) || (queue < 0 && down)) queue = 0

      accum += e.deltaY
      const steps = Math.trunc(accum / STEP)
      if (steps !== 0) {
        accum -= steps * STEP
        queue = Math.max(-MAX_QUEUE, Math.min(MAX_QUEUE, queue + steps))
        schedule()
      }
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
      if (timer !== null) window.clearTimeout(timer)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // listRef is reserved for C2 (overflow container tuning); referenced so the
  // arg stays part of the stable hook signature.
  void listRef
}
