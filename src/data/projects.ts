// Base project content in relevance order (OVERVIEW §7). Real copy is used verbatim;
// projects with `contentComplete: false` carry clearly-marked TODO(content) placeholders.
// No metrics or claims are invented — placeholders stay placeholders until Skyler provides copy.

import type { ProjectBase, SiteConfig } from './types'

export const projectsBase: ProjectBase[] = [
  {
    id: 'peppin',
    index: '01',
    name: 'Peppin',
    role: 'Co-Founder',
    oneLiner:
      'A habit companion you text in iMessage — log by message or photo, and a penguin grows as you keep your streak',
    status: 'Live',
    stack: ['Bun', 'Postgres', 'iMessage', 'Stripe'],
    link: { label: 'peppin.ai', href: 'https://peppin.ai' },
    bullets: [
      'Live at peppin.ai with real users, Stripe billing and meal-photo macros',
      'Deterministic pre-classifier and safety canaries gate every LLM call',
      '650 commits, 88 migrations and 200+ test files in 6 weeks',
    ],
    // Measured in the admin console (Sep 2026). The funnel is the Sep 18–25 paid-ads
    // cohort; the headline is the all-time replay corpus.
    funnel: {
      headValue: '521',
      headLabel: 'real conversations logged',
      cohortLabel: 'ad cohort · sep 18–25',
      steps: [
        { label: 'first message', value: 37 },
        { label: 'replied again', value: 30 },
        { label: 'set a habit', value: 24 },
        { label: 'back on day 2', value: 13 },
      ],
      stats: [
        { value: '44', label: 'people' },
        { value: '9', label: 'paying' },
        { value: '2', label: 'founders' },
      ],
      asOf: 'as of sep 2026',
    },
    orientation: 'portrait',
    theme: 'light',
    contentComplete: true,
  },
  {
    id: 'sailor',
    index: '02',
    name: 'Sailor',
    role: 'Founder',
    oneLiner:
      'An AI WhatsApp CRM for real estate agents — it sorts leads and runs follow-up around the agent instead of replacing them',
    status: 'Live',
    stack: ['Next.js', 'WhatsApp API', 'Webhooks'],
    link: { label: 'meetsailor.com', href: 'https://meetsailor.com' },
    bullets: [
      'Designed, built, and shipped the entire product end to end',
      'In Review on the app store, live in production at meetsailor.com',
    ],
    // By-the-numbers (measured across the 4 Sailor repos: app · server · webhook · site).
    metrics: [
      { value: '400+', label: 'commits' },
      { value: '84K+', label: 'lines of code' },
      { value: '4', label: 'services' },
      { value: '3 weeks', label: 'solo' },
    ],
    orientation: 'portrait',
    theme: 'dark',
    contentComplete: true,
  },
  {
    id: 'bsg',
    index: '03',
    name: 'Berkeley Strategy Group',
    role: 'Co-Founder and COO',
    oneLiner:
      'Strategy consultancy specializing in AI strategy and voice of the customer',
    bullets: [
      'Owned 50+ client relationships end to end',
      'Personally led 100+ client intros with F500 VPs and C-Suite',
      'Coded custom CRM to manage pipeline',
    ],
    revenueRamp: {
      endLabel: '$200K+',
      spanLabel: 'first 60 days',
      peak: 200,
      stats: [
        { value: '5+', label: 'enterprise deals' },
        { value: '300+', label: 'exec 1:1s' },
        { value: '7', label: 'team' },
      ],
    },
    stack: ['GTM', 'Accounts'],
    orientation: 'landscape',
    theme: 'light',
    contentComplete: true,
  },
  {
    id: 'boi',
    index: '04',
    name: 'Boi',
    role: 'Founder',
    oneLiner:
      'An AI assistant inside iMessage that reads the room — a Mac app reads your message history so Boi knows who is waiting on you',
    status: 'Prototype',
    stack: ['Swift', 'TypeScript', 'Railway'],
    bullets: [
      'Texts you who is waiting on a reply, with two drafts in your voice',
      'Notarized Mac app reads iMessage read-only; uploads summaries, never messages',
      '14-tool agent loop on Fastify and Postgres; closed beta with real testers',
    ],
    metrics: [
      { value: '487', label: 'commits · 20 days' },
      { value: '85K+', label: 'lines of code' },
      { value: '1,700', label: 'tests' },
      { value: '3', label: 'languages' },
    ],
    orientation: 'portrait',
    theme: 'dark',
    contentComplete: true,
  },
  {
    id: 'sunflower',
    index: '05',
    name: 'Sunflower',
    role: 'Founder',
    oneLiner:
      'A private, audio-first journal for iPhone — speak for a minute, and it brings your own words back over days, weeks and months',
    status: 'Live',
    stack: ['Expo', 'React Native', 'Hono'],
    link: { label: 'sunflowervoice.com', href: 'https://sunflowervoice.com' },
    bullets: [
      'Every quote is an exact span of your transcript; the model selects, never writes',
      'On-device transcription, Face ID lock, and an API that never logs journal text',
      'Built in 3 days; live at sunflowervoice.com, App Store submission in progress',
    ],
    metrics: [
      { value: '3 days', label: 'build' },
      { value: '15K+', label: 'lines of code' },
      { value: '43', label: 'screens' },
      { value: '29', label: 'unit tests' },
    ],
    orientation: 'portrait',
    theme: 'light',
    contentComplete: true,
  },
  {
    id: 'brainforge',
    index: '06',
    name: 'BrainForge',
    role: 'Builder',
    oneLiner:
      'A daily reasoning workout that diagnoses the skills behind consulting judgment and trains the weakest first',
    status: 'Internal',
    stack: ['Next.js', 'Postgres', 'Drizzle'],
    bullets: [
      'Tracks 20 skills with uncertainty-weighted mastery estimates',
      'Adaptive 30–45 minute workouts from 185 items and 90 flashcards',
      'Runs fully without AI; hand-written auth with Google OAuth',
    ],
    metrics: [
      { value: '10 days', label: 'build' },
      { value: '19K+', label: 'lines of code' },
      { value: '20', label: 'skills tracked' },
      { value: '48', label: 'unit tests' },
    ],
    orientation: 'landscape',
    theme: 'dark',
    contentComplete: true,
  },
  {
    id: 'skyler-website',
    index: '07',
    name: 'Personal Site',
    role: 'Builder',
    oneLiner: 'Interactive personal candlelit desk',
    bullets: [
      'A cinematic 2.5D personal site, designed and built from scratch',
      'Interaction design, motion, and creative front-end treated as craft',
    ],
    status: 'Live',
    stack: ['Design', 'Interactive', '3D'],
    link: {
      label: 'skyler-website.vercel.app',
      href: 'https://skyler-website.vercel.app/',
    },
    orientation: 'landscape',
    theme: 'dark',
    contentComplete: true,
  },
  {
    id: 'uber-wrapped',
    index: '08',
    name: 'Uber Wrapped',
    role: 'Builder',
    oneLiner: 'Turns a year of your Uber rides into a story told back to you',
    bullets: [
      'Took raw ride history and turned it into a shareable, animated year in review',
      'Design, data viz, and front-end, shipped live at uber-wrapped.vercel.app',
    ],
    status: 'Live',
    stack: ['React', 'Data viz'],
    link: {
      label: 'uber-wrapped.vercel.app',
      href: 'https://uber-wrapped.vercel.app',
    },
    orientation: 'landscape',
    theme: 'dark',
    contentComplete: true,
  },
  {
    id: 'karpathy-brain',
    index: '09',
    name: 'Karpathy Brain',
    role: 'Builder',
    oneLiner: 'A private, local LLM second brain over my own notes and writing',
    bullets: [
      'Built a retrieval pipeline over my personal knowledge base, running models locally with LM Studio',
      'AI engineering end to end: retrieval, local model deployment, and prompt design, fully offline',
    ],
    metrics: [
      { value: '300+', label: 'documents' },
      { value: '30+', label: 'hours saved' },
    ],
    stack: ['LLM', 'Local'],
    orientation: 'landscape',
    theme: 'dark',
    contentComplete: true,
  },
  {
    id: 'anthology',
    index: '10',
    name: 'Anthology',
    role: 'Venture',
    oneLiner: 'Venture studio founded in 2026 for Dubai x SF',
    bullets: ['Created bespoke company website'],
    stack: ['Brand', 'Studio'],
    link: { label: 'anthologyvm.com', href: 'https://anthologyvm.com' },
    orientation: 'landscape',
    theme: 'light',
    contentComplete: true,
  },
  {
    id: 'team_board',
    index: '11',
    name: 'IBM Team Board',
    role: 'Builder',
    oneLiner:
      'An interactive team board built as a website design challenge — brief to live site in 60 minutes',
    status: 'Live',
    stack: ['Design', 'Interactive'],
    link: { label: 'teamjay.vercel.app', href: 'https://teamjay.vercel.app' },
    orientation: 'landscape',
    theme: 'light',
    contentComplete: true,
  },
]

export const siteConfig: SiteConfig = {
  name: 'Skyler Luk',
  role: 'Builder · Operator · Strategist',
  bio: 'I build products people use, close deals that move companies, and get obsessive about the problems I solve',
  currentlyBuilding: 'Peppin',
  githubUser: 'skylerluk',
  location: 'Berkeley, CA · San Francisco, CA · New York, NY · Hong Kong, SAR',
  coords: '37.87, −122.27',
  links: [
    { label: 'Email', href: 'mailto:skylerluk@berkeley.edu' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/skylerluk/' },
    { label: 'GitHub', href: 'https://github.com/skylerluk' },
  ],
}
