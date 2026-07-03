# Pulse — Employee Dashboard (RPS Studio Take-Home)

Take-home for Junior Frontend role at Rock Paper Scissors Studio (a design studio —
they judge visual craft brutally). Scoring: React fundamentals 25%, code quality 20%,
UI/UX 20%, AI feature 15%, state mgmt 10%, docs 5%, creativity 5%.

## Design system — mimic rockpaperscissors.studio. NEVER deviate.
- Dark-first. Canvas #0A0A0A, surface #141414, elevated surface #1C1C1C,
  borders rgba(255,255,255,0.08). Light mode exists via toggle, dark is default.
- ONE accent: burnt orange #FF5C00 with amber gradient partner #FFB800.
  No blue, no purple, no teal — anywhere. Status colors (desaturated green/red/amber)
  allowed ONLY inside badges and charts.
- Typography: "Archivo" 700/900 for headings — UPPERCASE, tracking-tight, big.
  "Space Grotesk" 400/500/700 for body & UI. Google Fonts.
- Cards: rounded-2xl, surface bg, 1px subtle border, optional orange icon tile
  (rounded-xl, orange bg, white lucide icon) top-left — like RPS testimonial cards.
- Motion (Framer Motion): staggered fade-up entrances (60ms stagger, 250ms, easeOut),
  hover = y:-2 + border warms toward orange/40, animated number count-ups.
  Subtle and premium. Never bouncy or cartoonish.
- Focus-visible rings in orange. Full keyboard navigability.

## Stack (already installed)
Vite 8, React 18, TypeScript strict, Tailwind v4 via @tailwindcss/vite plugin
(tokens via @theme in src/index.css, dark mode via custom variant — NO tailwind.config.js),
framer-motion, recharts, zustand, react-router-dom, lucide-react.

## Architecture
- src/components/ui — reusable primitives: Card, Button, Badge, Input, Select,
  Textarea, Skeleton, Modal, Toast, EmptyState, StatCard
- src/components/layout — Sidebar, Topbar, PageHeader, AppShell
- src/features/{attendance,leave,team,announcements,profile,ai} — components + hooks per feature
- src/services/api.ts — mock API: typed async fns reading src/data/*.json with
  400–800ms random delay. All data flows through this layer, never import JSON in components.
- src/store — zustand slices: theme, leaveStore, toastStore
- src/types/index.ts — all shared interfaces
- src/lib — utils (cn, date formatting DD MMM YYYY, workingDays calc)

## Code rules
- TS strict, zero `any`, typed props, components <150 lines, logic in custom hooks.
- Every async view: skeleton → data | empty state | error state. No exceptions.
- Forms: controlled, inline validation errors, disabled submit while invalid/pending.
- Mock data: Indian company context — Indian names across regions, INR where relevant,
  Indian holidays (Independence Day etc.) in attendance, IST times.
- Conventional commits. Never commit .env. Never expose API keys client-side.