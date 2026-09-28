// OWNED BY TRACK E. Other tracks: read-only.
//
// Fill in logos + screenshots here, keyed by project id, as their files land under
// public/assets/<id>/. Keep this object referencing ONLY files that exist — an entry
// pointing at a missing image renders a broken image; omitting a project just shows the
// placeholder. See public/assets/README.md for the drop → optimize → wire flow.
//
// Template (copy per project, point `src` at the optimized .webp, write real alt text):
//
//   sailor: {
//     logo: '/assets/sailor/logo.svg',
//     screenshots: [
//       { src: '/assets/sailor/01.webp', alt: 'Sailor — leads inbox with AI triage' },
//       { src: '/assets/sailor/02.webp', alt: 'Sailor — WhatsApp follow-up thread' },
//     ],
//   },
//   bsg: {
//     logo: '/assets/bsg/logo.svg',
//     screenshots: [
//       { src: '/assets/bsg/01.webp', alt: 'Berkeley Strategy Group — landing page' },
//     ],
//   },
//
// Paths are web paths served from public/ (so public/assets/sailor/01.webp → /assets/sailor/01.webp).

import type { ProjectAssets } from './types'

export const projectAssets: Record<string, ProjectAssets> = {
  // Peppin — real iMessage threads (photo logging) + the penguin mark.
  peppin: {
    logo: '/assets/peppin/logo.png',
    screenshots: [
      {
        src: '/assets/peppin/01.webp',
        alt: 'Peppin in iMessage — a run gets logged, then an acai bowl photo comes back as ~7g protein · ~8g fiber · ~530 cal',
        caption: 'Photo logging',
      },
      {
        src: '/assets/peppin/02.webp',
        alt: 'Peppin in iMessage — a workout logged as 30 minutes, then a chicken caesar wrap photo estimated at ~39g protein',
        caption: 'Daily check-in',
      },
    ],
  },

  // Boi — "your year in messages" share cards (synthetic names) + gray wordmark.
  boi: {
    logo: '/assets/boi/logo.png',
    screenshots: [
      {
        src: '/assets/boi/01.webp',
        alt: 'Boi — “your year in messages” share card: 38% of your 16 closest friendships went quiet this year',
        caption: 'Year in messages',
      },
    ],
  },

  // Sunflower — captured from the dev build on the iOS 26 simulator (fixture entries).
  sunflower: {
    logo: '/assets/sunflower/logo.png',
    screenshots: [
      {
        src: '/assets/sunflower/01.webp',
        alt: 'Sunflower — September calendar with waveform and photo tiles, “57 days remembered”',
        caption: 'Calendar',
      },
      {
        src: '/assets/sunflower/02.webp',
        alt: 'Sunflower — the recorder with a live waveform',
        caption: 'Record',
      },
      {
        src: '/assets/sunflower/03.webp',
        alt: 'Sunflower — “In Your Words”, exact quotes from your own transcripts by day, week and month',
        caption: 'In Your Words',
      },
    ],
  },

  // BrainForge — captured from a local run (Today).
  brainforge: {
    logo: '/assets/brainforge/logo.png',
    screenshots: [
      {
        src: '/assets/brainforge/01.webp',
        alt: 'BrainForge — Today: where to focus, the diagnostic, and the daily workout',
        aspect: 1440 / 900,
      },
    ],
  },

  // E1 — Sailor (real assets, optimized from Skyler's app screens).
  sailor: {
    logo: '/assets/sailor/logo.png',
    screenshots: [
      {
        src: '/assets/sailor/01.webp',
        alt: 'Sailor app — Inbox with AI-suggested next actions for each lead',
        caption: 'Lead inbox',
      },
      {
        src: '/assets/sailor/02.webp',
        alt: 'Sailor app — Today dashboard showing pipeline commission and lead activity',
        caption: 'Pipeline overview',
      },
      {
        src: '/assets/sailor/03.webp',
        alt: 'Sailor marketing site — “Your WhatsApp, Organized,” the first CRM built for mobile',
        caption: 'Product website',
      },
    ],
  },

  // E2 — IBM Team Board.
  team_board: {
    logo: '/assets/team_board/logo.png',
    screenshots: [
      {
        src: '/assets/team_board/01.webp',
        alt: 'IBM Team Board — a “most wanted” style interactive team board for Jay Smith’s team',
        aspect: 1248 / 797,
      },
    ],
  },

  // E2 — Personal site (interactive 3D desk).
  'skyler-website': {
    logo: '/assets/skyler-website/logo.png',
    screenshots: [
      {
        src: '/assets/skyler-website/01.webp',
        alt: 'Skyler Luk personal site — an interactive 3D desk scene to explore',
        aspect: 1800 / 973,
        caption: 'Click to open',
      },
    ],
  },

  // Berkeley Strategy Group — CRM pipeline screenshot + client logos.
  bsg: {
    logo: '/assets/bsg/bsg_logo_square.png', // wordmark centered on a white square
    screenshots: [
      {
        src: '/assets/bsg/01.webp',
        alt: 'BSG CRM — sales pipeline board (account names blurred)',
        aspect: 1600 / 870,
      },
    ],
    clients: [
      { name: 'Amazon' },
      { name: 'Tesla' },
      { name: 'Uber' },
      { name: 'Rackspace' },
    ],
  },

  // Uber Wrapped — three "wrapped" screens, framed as uniform squares.
  'uber-wrapped': {
    logo: '/assets/uber-wrapped/uber_logo_square.jpg',
    screenshots: [
      {
        src: '/assets/uber-wrapped/01.webp',
        alt: 'Uber Wrapped — “Breakfast Sandwich, your most-ordered item, 74 times”',
        aspect: 1,
      },
      {
        src: '/assets/uber-wrapped/02.webp',
        alt: 'Uber Wrapped — “Your rides timeline,” yearly spend bar chart',
        aspect: 1,
      },
      {
        src: '/assets/uber-wrapped/03.webp',
        alt: 'Uber Wrapped — all-time summary dashboard ($26,609 across 810 rides + orders)',
        aspect: 1,
      },
    ],
  },

  // Karpathy Brain — knowledge-graph view.
  'karpathy-brain': {
    logo: '/assets/karpathy-brain/karpathy_logo_square.png',
    screenshots: [
      {
        src: '/assets/karpathy-brain/01.webp',
        alt: 'Karpathy Brain — interlinked knowledge graph of notes',
        aspect: 1400 / 1395,
      },
    ],
  },

  // Anthology — venture studio site (SF × Dubai).
  anthology: {
    logo: '/assets/anthology/logo.png',
    screenshots: [
      {
        src: '/assets/anthology/01.webp',
        alt: 'Anthology — venture studio landing page (Golden Gate Bridge × Burj Khalifa)',
        aspect: 1800 / 978,
        caption: 'Click to open',
      },
    ],
  },
}
