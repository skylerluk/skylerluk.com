// Track C — C1 scroll engine. The signature interaction: scrolling anywhere
// over the single-screen app steps through projects and swaps the preview.
// Encapsulated here so we never touch App.tsx — listeners attach to window/
// document from within the hook. Owns src/components/rail/* only.
//
// Pacing: one step per gesture. Wheel deltas accumulate until they cross STEP,
// then the engine steps once and locks briefly so a trackpad flick (dozens of
// small events plus inertia) reads as a single deliberate step instead of
// racing through several projects. A mouse notch (~100) still steps at once.
// Stepping brings the page back to the top so each preview starts in view.

import { useEffect, useRef, type RefObject } from 'react'
import { usePortfolio } from '../../app/PortfolioProvider'

const STEP = 60 // accumulated wheel delta that advances one project
const LOCK_MS = 420 // ignore further deltas this long after a step
const IDLE_RESET_MS = 160 // a pause this long starts a fresh gesture

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

  // Center the active tile within the rail whenever the index changes. Scroll
  // the list itself (not scrollIntoView, which would also drag the window),
  // and bring the page back to the top so the new preview starts in view.
  useEffect(() => {
    const list = listRef.current
    const tile = tileRefs.current?.[activeIndex]
    if (!list || !tile) return
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'
    const lr = list.getBoundingClientRect()
    const tr = tile.getBoundingClientRect()
    const horizontal = list.scrollWidth > list.clientWidth + 1
    if (horizontal) {
      list.scrollTo({
        left:
          list.scrollLeft + (tr.left - lr.left) - lr.width / 2 + tr.width / 2,
        behavior,
      })
    } else if (list.scrollHeight > list.clientHeight + 1) {
      list.scrollTo({
        top: list.scrollTop + (tr.top - lr.top) - lr.height / 2 + tr.height / 2,
        behavior,
      })
    }
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior })
  }, [activeIndex, listRef, tileRefs])

  // Wheel + keyboard engine — registered once.
  useEffect(() => {
    let accum = 0
    let lockedUntil = 0
    let lastAt = 0

    const atFirst = () => stateRef.current.activeIndex <= 0
    const atLast = () =>
      stateRef.current.activeIndex >= stateRef.current.count - 1

    const onWheel = (e: WheelEvent) => {
      if (isEditableTarget(e.target)) return

      const down = e.deltaY > 0
      const now = performance.now()

      // Edge release: let the browser handle overscroll at the ends.
      if ((down && atLast()) || (!down && atFirst())) {
        accum = 0
        return
      }

      e.preventDefault()

      // During the post-step lock, swallow the gesture's tail (inertia).
      if (now < lockedUntil) return

      // A pause, or a change of direction, starts a fresh gesture.
      if (now - lastAt > IDLE_RESET_MS || accum > 0 !== down) accum = 0
      lastAt = now
      accum += e.deltaY

      if (accum >= STEP) {
        stateRef.current.next()
        accum = 0
        lockedUntil = now + LOCK_MS
      } else if (accum <= -STEP) {
        stateRef.current.prev()
        accum = 0
        lockedUntil = now + LOCK_MS
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
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])
}
