// Data schema for the whole app. Owned by Track A (A2) and FROZEN once merged —
// B/C/D/E read these types and must not change them. If a field is genuinely
// missing, flag it in the PR rather than editing here.

export type ProjectStatus = 'Live' | 'Prototype' | 'Internal'
export type Orientation = 'landscape' | 'portrait'
export type FrameTheme = 'light' | 'dark' // chrome of the preview frame

export interface Screenshot {
  src: string
  alt: string
  /** Short descriptive label shown beneath the frame (e.g. "Pipeline overview"). */
  caption?: string
  /** Natural width/height ratio; lets a landscape frame match the image (no crop). */
  aspect?: number
}

export interface ProjectLink {
  label: string
  href: string
}

// A single "by the numbers" stat: `value` is emphasised (accent), `label` reads muted.
export interface Metric {
  value: string
  label: string
}

// A stylized revenue-ramp chart (e.g. BSG). Only the endpoints are factual —
// the curve shape is illustrative (see RevenueRamp.tsx).
export interface RevenueRamp {
  endLabel: string // '$200K' — the real, factual endpoint
  spanLabel: string // 'first 30 days'
  peak?: number // numeric peak for curve scaling (default 100; e.g. 200)
  stats?: Metric[] // supporting real numbers (reuses the Metric type)
}

// A real conversion funnel (e.g. Peppin's ad cohort). Every step is a measured
// count from the product's own analytics — nothing is illustrative here.
export interface FunnelStep {
  label: string
  value: number
}

export interface Funnel {
  headValue: string // '521' — the headline number
  headLabel: string // 'messages exchanged'
  cohortLabel: string // 'ad cohort · sep 18–25'
  steps: FunnelStep[] // first step is the 100% bar
  stats?: Metric[] // supporting real numbers
  asOf?: string // 'as of sep 2026'
}

export interface ProjectBase {
  id: string // 'sailor'
  index: string // '01'
  name: string
  role: string // 'Founder' | 'VP, Partnerships' ...
  oneLiner: string
  status?: ProjectStatus
  stack: string[]
  link?: ProjectLink
  bullets?: string[] // optional highlight bullets shown under the one-liner
  metrics?: Metric[] // optional one-line "by the numbers" strip
  revenueRamp?: RevenueRamp // optional revenue-ramp chart (right-hand slot)
  funnel?: Funnel // optional measured funnel (right-hand slot)
  orientation: Orientation
  theme: FrameTheme
  contentComplete: boolean // false => copy is placeholder (TODO)
}

export interface Client {
  name: string
  logo?: string // when absent, the client renders as a text tag
}

export interface ProjectAssets {
  logo?: string
  /** Fit the rail logo with `contain` (whole logo visible) instead of `cover`. */
  logoContain?: boolean
  screenshots: Screenshot[]
  /** Optional "clients we've worked with" logos (e.g. for BSG). */
  clients?: Client[]
}

export interface Project extends ProjectBase, ProjectAssets {}

export interface SiteConfig {
  name: string
  role: string
  bio: string
  currentlyBuilding: string
  githubUser: string
  location: string
  coords: string
  links: ProjectLink[] // email, linkedin, github, resume
}
