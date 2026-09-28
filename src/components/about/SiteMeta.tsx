// Track B (B2). Bottom meta strip — quiet mono micro-labels in the corners:
// location + coords (left), a live clock (center), "Updated MM.YYYY" (right).
// Lives in components/about/*; the only external touch is a one-line mount in App.tsx.

import { useEffect, useState } from 'react'
import { siteConfig } from '../../data'
import styles from './SiteMeta.module.css'

// Update on releases. Not derived from a fabricated future date.
const UPDATED = '09.2026'

// TODO(decision): visitor count source — omitted for v1 (a fake count is worse than none).

function formatClock(d: Date): string {
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

// Short local time-zone label (e.g. "PT", "GMT+2"); falls back gracefully.
function zoneLabel(): string {
  try {
    const parts = new Intl.DateTimeFormat(undefined, {
      timeZoneName: 'short',
    }).formatToParts(new Date())
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
  } catch {
    return ''
  }
}

export function SiteMeta() {
  const [now, setNow] = useState(() => new Date())
  const [zone] = useState(zoneLabel)

  useEffect(() => {
    // The clock is information, not decoration — it ticks even under
    // prefers-reduced-motion (no animation involved).
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.meta}>
      <span className={styles.item}>{siteConfig.location}</span>
      <span className={styles.item}>
        <time aria-label="Local time">{formatClock(now)}</time>
        {zone ? ` ${zone}` : ''}
      </span>
      <span className={styles.item}>Updated {UPDATED}</span>
    </div>
  )
}
