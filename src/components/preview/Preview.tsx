// Track D — Preview. Reads the active project from usePortfolio() and renders it
// on the seamless --paper surface: a shadow-lifted frame group (landscape or
// portrait, 1–3 shots) plus the caption. A quiet crossfade plays on change; the
// pane always stays --paper. Reduced-motion swaps instantly. Owns preview/* only.

import type { ReactNode } from 'react'
import { usePortfolio } from '../../app/PortfolioProvider'
import { ShotGroup } from './ShotGroup'
import { RevenueRamp } from './RevenueRamp'
import { Funnel } from './Funnel'
import { useHashSync, useNeighborPreload } from './usePreviewSync'
import type { ProjectLink } from '../../data/types'
import styles from './Preview.module.css'

// Render a bullet, turning the project link's label (e.g. "meetsailor.com")
// into an accent link where it appears in the text.
function renderBullet(text: string, link?: ProjectLink): ReactNode {
  if (!link || !text.includes(link.label)) return text
  const parts = text.split(link.label)
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && (
        <a
          className={styles.bulletLink}
          href={link.href}
          target="_blank"
          rel="noreferrer"
        >
          {link.label}
        </a>
      )}
    </span>
  ))
}

export function Preview() {
  const { projects, activeIndex, setActiveIndex } = usePortfolio()

  // Deep-linking (#sailor …) and neighbour preloading — preview-owned effects.
  useHashSync({ projects, activeIndex, setActiveIndex })
  useNeighborPreload({ projects, activeIndex })

  const project = projects[activeIndex]
  if (!project) return null

  // Clients render in the caption normally, but move under the revenue ramp when
  // one is present (keeps the left column for text + bullets).
  const clientsBlock =
    project.clients && project.clients.length > 0 ? (
      <div className={styles.clients}>
        <span className={styles.clientsLabel}>
          Clients we&rsquo;ve worked with
        </span>
        <div className={styles.clientRow}>
          {project.clients.map((c) =>
            c.logo ? (
              <img
                key={c.name}
                className={styles.clientLogo}
                src={c.logo}
                alt={c.name}
                title={c.name}
              />
            ) : (
              <span key={c.name} className={styles.clientTag}>
                {c.name}
              </span>
            ),
          )}
        </div>
      </div>
    ) : null

  return (
    <section
      className={styles.preview}
      role="region"
      aria-label="Selected project"
    >
      {/* key={project.id} restarts the enter animation on every change; a
          consistent flex layout keeps height stable so there's no jump. */}
      <div className={styles.fade} key={project.id}>
        {(() => {
          const shots = (
            <ShotGroup
              orientation={project.orientation}
              theme={project.theme}
              screenshots={project.screenshots}
              label={project.name}
            />
          )
          return project.link ? (
            <a
              className={styles.stage}
              href={project.link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.name}`}
            >
              {shots}
            </a>
          ) : (
            <div className={styles.stage}>{shots}</div>
          )
        })()}

        <div
          className={`${styles.captionRow} ${
            project.revenueRamp || project.funnel ? styles.captionRowTop : ''
          }`}
        >
          <div className={styles.caption}>
            <div className={styles.metaRow}>
              <span className={styles.index}>{project.index}</span>
              <span className={styles.name} aria-live="polite">
                {project.link ? (
                  <a
                    className={styles.nameLink}
                    href={project.link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {project.name}
                    <span className={styles.nameArrow} aria-hidden="true">
                      {' '}
                      ↗
                    </span>
                  </a>
                ) : (
                  project.name
                )}
              </span>
              <span className={styles.role}>{project.role}</span>
              {project.status && (
                <span className={styles.status}>{project.status}</span>
              )}
            </div>

            <p
              className={`${styles.oneLiner} ${
                project.contentComplete ? '' : styles.pending
              }`}
            >
              {project.contentComplete
                ? project.oneLiner
                : 'Details coming soon.'}
            </p>

            {project.bullets && project.bullets.length > 0 && (
              <ul className={styles.bullets}>
                {project.bullets.map((b) => (
                  <li key={b} className={styles.bullet}>
                    {renderBullet(b, project.link)}
                  </li>
                ))}
              </ul>
            )}

            {!project.revenueRamp && clientsBlock}
          </div>

          {/* Right-hand slot: a project has one of a revenue ramp (BSG), a
              measured funnel (Peppin) or the "by the numbers" ledger
              (Sailor-style), never several. Clients move under the ramp. */}
          {project.revenueRamp ? (
            <RevenueRamp {...project.revenueRamp}>{clientsBlock}</RevenueRamp>
          ) : project.funnel ? (
            <Funnel {...project.funnel} />
          ) : (
            project.metrics &&
            project.metrics.length > 0 && (
              <aside className={styles.ledger} aria-label="By the numbers">
                {project.metrics.map((m) => (
                  <div key={m.label} className={styles.ledgerRow}>
                    <span className={styles.ledgerValue}>{m.value}</span>
                    <span className={styles.ledgerLabel}>{m.label}</span>
                  </div>
                ))}
              </aside>
            )
          )}
        </div>
      </div>
    </section>
  )
}
