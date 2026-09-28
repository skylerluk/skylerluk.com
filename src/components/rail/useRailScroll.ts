// Track C — C1 scroll engine. The signature interaction: scrolling anywhere
// over the single-screen app moves through projects and swaps the preview.
// Encapsulated here so we never touch App.tsx — listeners attach to window/
// document from within the hook. Owns src/components/rail/* only.
//
// Model: a continuous position `pos` (in project units) that tracks wheel
// distance one-to-one, so the rail moves exactly as much as you scroll and
// stops the moment you do — no banked momentum, no overshoot. The active
// project is whichever tile is nearest the centre; when input goes quiet the
// rail settles onto it with a short ease (a scroll-snap feel).

import { useEffect, useRef, type RefObject } from 'react'
import { usePortfolio } from '../../app/PortfolioProvider'

const PX_PER_PROJECT = 110 // wheel distance that moves one project
const IDLE_MS = 90 // quiet this long → settle onto the nearest project
const SETTLE_MS = 220 // ease duration for the settle

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

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function useRailScroll({ listRef, tileRefs }: UseRailScrollArgs) {
  const { activeIndex, projects, setActiveIndex } = usePortfolio()
  const count = projects.length

  const stateRef = useRef({ activeIndex, count, setActiveIndex })
  stateRef.current = { activeIndex, count, setActiveIndex }

  // Continuous rail position in project units, and whether the wheel owns it
  // right now (so an external index change — click, key, hash — can take over).
  const posRef = useRef(activeIndex)
  const wheelingRef = useRef(false)

  // Centre of tile `i` measured within the list's scroll content.
  const tileCenter = (i: number) => {
    const list = listRef.current
    const tile = tileRefs.current?.[i]
    if (!list || !tile) return 0
    const lr = list.getBoundingClientRect()
    const tr = tile.getBoundingClientRect()
    return list.scrollTop + (tr.top - lr.top) + tr.height / 2
  }
  const tileCenterX = (i: number) => {
    const list = listRef.current
    const tile = tileRefs.current?.[i]
    if (!list || !tile) return 0
    const lr = list.getBoundingClientRect()
    const tr = tile.getBoundingClientRect()
    return list.scrollLeft + (tr.left - lr.left) + tr.width / 2
  }

  // Put the rail at fractional position `p` (interpolating between tiles).
  const applyPos = (p: number) => {
    const list = listRef.current
    if (!list) return
    const lo = Math.floor(p)
    const hi = Math.min(stateRef.current.count - 1, lo + 1)
    const f = p - lo
    const horizontal = list.scrollWidth > list.clientWidth + 1
    if (horizontal) {
      const c = tileCenterX(lo) + (tileCenterX(hi) - tileCenterX(lo)) * f
      list.scrollLeft = c - list.clientWidth / 2
    } else {
      const c = tileCenter(lo) + (tileCenter(hi) - tileCenter(lo)) * f
      list.scrollTop = c - list.clientHeight / 2
    }
  }

  // External index changes (click, keyboard, hash): glide the rail there.
  useEffect(() => {
    if (wheelingRef.current) return
    const from = posRef.current
    const to = activeIndex
    if (prefersReducedMotion() || Math.abs(to - from) < 0.001) {
      posRef.current = to
      applyPos(to)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 320)
      posRef.current = from + (to - from) * easeOut(t)
      applyPos(posRef.current)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  // Wheel + keyboard engine — registered once.
  useEffect(() => {
    let idleTimer: number | null = null
    let settleRaf = 0

    const clamp = (p: number) =>
      Math.max(0, Math.min(stateRef.current.count - 1, p))

    const cancelSettle = () => {
      if (settleRaf) cancelAnimationFrame(settleRaf)
      settleRaf = 0
    }

    // Ease from the current fractional position onto the nearest tile.
    const settle = () => {
      idleTimer = null
      const from = posRef.current
      const to = Math.round(from)
      if (prefersReducedMotion() || Math.abs(to - from) < 0.002) {
        posRef.current = to
        applyPos(to)
        wheelingRef.current = false
        return
      }
      const t0 = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / SETTLE_MS)
        posRef.current = from + (to - from) * easeOut(t)
        applyPos(posRef.current)
        if (t < 1) settleRaf = requestAnimationFrame(tick)
        else {
          settleRaf = 0
          wheelingRef.current = false
        }
      }
      settleRaf = requestAnimationFrame(tick)
    }

    const onWheel = (e: WheelEvent) => {
      if (isEditableTarget(e.target)) return

      const down = e.deltaY > 0
      const p = posRef.current
      // Edge release: at either end, let the page scroll normally.
      if ((down && p >= stateRef.current.count - 1) || (!down && p <= 0)) {
        return
      }
      e.preventDefault()

      cancelSettle()
      wheelingRef.current = true

      // Track the wheel one-to-one.
      posRef.current = clamp(p + e.deltaY / PX_PER_PROJECT)
      applyPos(posRef.current)

      // Nearest tile is the active project; the preview follows as you pass
      // each midpoint.
      const nearest = Math.round(posRef.current)
      if (nearest !== stateRef.current.activeIndex) {
        stateRef.current.setActiveIndex(nearest)
      }

      if (idleTimer !== null) window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(settle, IDLE_MS)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return
      const { activeIndex, count, setActiveIndex } = stateRef.current
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault()
          setActiveIndex(Math.min(count - 1, activeIndex + 1))
          break
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault()
          setActiveIndex(Math.max(0, activeIndex - 1))
          break
        case 'Home':
          e.preventDefault()
          setActiveIndex(0)
          break
        case 'End':
          e.preventDefault()
          setActiveIndex(count - 1)
          break
        default:
          break
      }
    }

    // { passive: false } so preventDefault actually blocks page scroll.
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      if (idleTimer !== null) window.clearTimeout(idleTimer)
      cancelSettle()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
