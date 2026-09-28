// A measured conversion funnel for the right-hand slot (Peppin). Unlike the
// revenue ramp, every bar here is a real count from the product's own admin
// console — the first step is the 100% bar and each later step is drawn as a
// share of it. Inline SVG-free: plain divs, tokens only, no deps.

import type { Funnel as FunnelData } from '../../data/types'
import styles from './Funnel.module.css'

export function Funnel({
  headValue,
  headLabel,
  cohortLabel,
  steps,
  stats,
  asOf,
}: FunnelData) {
  const base = steps[0]?.value ?? 1

  return (
    <aside
      className={styles.funnel}
      aria-label={`${headValue} ${headLabel}; ${cohortLabel} funnel`}
    >
      <div className={styles.head}>
        <span className={styles.value}>{headValue}</span>
        <span className={styles.span}>{headLabel}</span>
      </div>

      <div className={styles.cohort}>{cohortLabel}</div>

      <ol className={styles.steps}>
        {steps.map((s, i) => {
          const pct = Math.max(0, Math.min(100, (s.value / base) * 100))
          return (
            <li
              key={s.label}
              className={styles.step}
              style={{ animationDelay: `${80 + i * 90}ms` }}
            >
              <span className={styles.stepLabel}>{s.label}</span>
              <span className={styles.track} aria-hidden="true">
                <span className={styles.bar} style={{ width: `${pct}%` }} />
              </span>
              <span className={styles.stepValue}>
                {s.value}
                {i > 0 && (
                  <span className={styles.stepPct}> {Math.round(pct)}%</span>
                )}
              </span>
            </li>
          )
        })}
      </ol>

      {stats && stats.length > 0 && (
        <div className={styles.stats}>
          {stats.map((s, i) => (
            <span key={s.label} className={styles.stat}>
              {i > 0 && <span className={styles.statSep}>·</span>}
              <span className={styles.statValue}>{s.value}</span>{' '}
              <span className={styles.statLabel}>{s.label}</span>
            </span>
          ))}
        </div>
      )}

      {asOf && <div className={styles.asOf}>{asOf}</div>}
    </aside>
  )
}
