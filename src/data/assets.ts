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

  // BrainForge — captured from a local run (Today, skill map, diagnostic).
  brainforge: {
    logo: '/assets/brainforge/logo.png',
    screenshots: [
      {
        src: '/assets/brainforge/01.webp',
        alt: 'BrainForge — Today: where to focus, the diagnostic, and the daily workout',
        aspect: 1440 / 900,
        caption: 'Today',
      },
      {
        src: '/assets/brainforge/02.webp',
        alt: 'BrainForge — skill map with mastery and confidence per skill',
        aspect: 1440 / 900,
        caption: 'Skill map',
      },
      {
        src: '/assets/brainforge/03.webp',
        alt: 'BrainForge — the adaptive mini-diagnostic: four sections, adaptive difficulty',
        aspect: 1440 / 900,
        caption: 'Diagnostic',
      },
    ],
  },
}
