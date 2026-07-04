# PULSE — Employee Dashboard

A dark-first employee dashboard: attendance, leave management, a team directory, and AI-summarised announcements. Built with React, TypeScript, and Tailwind v4, with a Vercel serverless function proxying Google Gemini for the AI features.

![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Functions-000000?logo=vercel&logoColor=white)

**[Live demo : pulse-dashboard-sandy.vercel.app](https://pulse-dashboard-sandy.vercel.app/)**
<!-- Replace LIVE_DEMO_URL with the deployed Vercel URL. -->

## Screenshot

![Pulse dashboard](https://github.com/user-attachments/assets/54f4c9da-0409-4f97-9b16-37901a90a650)
<!-- Replace docs/screenshot.png with a hero screenshot of the dashboard. -->

## Features

### Core

- **Attendance dashboard** — time-aware greeting, animated stat cards, a Recharts working-hours chart, and a custom-built month attendance calendar with per-day status tints and tooltips.
- **Leave management** — balance rings, a fully validated request form (date rules, balance checks, overlap detection, inline errors), and optimistic updates: a new request appears and decrements the balance instantly, rolling back on failure.
- **Team directory** — searchable, filterable member grid with a 300 ms debounced search, department filter chips with live counts, and animated list transitions.
- **Announcements** — pinned and recent feed with category badges, expandable cards, and per-card AI summaries.

### AI

- **Per-announcement summariser** — condenses a single announcement into two sentences.
- **Today's Digest** — summarises all announcements into a short daily briefing with a staggered line reveal.
- **Dual-key fallback** — the serverless proxy retries a second Gemini key on failure and degrades gracefully if both are unavailable (see [Architecture](#architecture)).

### Extras

- Dark / light theme toggle (dark by default), persisted to `localStorage`.
- Command palette (`Ctrl`/`Cmd` + `K`) for navigation and quick actions.
- In-app notification feed with unread state.
- Subtle page transitions between routes.
- Responsive down to 375 px; keyboard-navigable with focus-visible rings, `aria-label`s on icon buttons, and live regions for toasts and AI output.

## Getting started

**Prerequisites:** Node 18+ (developed on Node 22).

```bash
git clone <repo-url>
cd pulse-dashboard
npm install
```

### Environment (only needed for the AI features)

```bash
cp .env.example .env.local
```

Then fill in `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | yes | Primary Gemini key. |
| `GEMINI_API_KEY_2` | yes | Fallback key, used automatically if the primary fails. |
| `GEMINI_MODEL` | no | Overrides the model (default `gemini-2.5-flash`). |

Create keys at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). `.env.local` is gitignored — never commit real keys.

### Run

```bash
npm run dev       # UI only (Vite). /api is absent, so AI actions show a graceful error state.
npm run dev:api   # Full stack via `vercel dev` (Vite + serverless functions) to exercise the live AI.
```

Other scripts: `npm run build` (type-check + production build), `npm run lint`, `npm run preview`.

## Architecture

```
.
├── api/
│   └── summarize.ts          # Vercel serverless function — Gemini proxy with dual-key fallback
├── src/
│   ├── components/
│   │   ├── layout/           # AppShell, Sidebar, Topbar, CommandPalette, NotificationBell, PageHeader
│   │   └── ui/               # Primitives: Card, Button, Badge, Input, Select, Skeleton, Toast, …
│   ├── features/             # One folder per domain (components + hooks)
│   │   ├── attendance/       # Greeting, hours chart, calendar, upcoming rail
│   │   ├── leave/            # Balance rings, request form + validation hook, history table
│   │   ├── team/             # Member cards, filter chips, useTeamFilter
│   │   ├── announcements/    # Cards, AI summary block, Today's Digest, useSummarize
│   │   └── profile/          # Header, details, attendance mini-chart, recent requests
│   ├── pages/                # Route entry points, one per screen
│   ├── store/                # Zustand slices: theme, toast, leave, ai, notification, command
│   ├── services/api.ts       # Mock API — typed async fns over src/data/*.json
│   ├── data/                 # Seed JSON (employees, attendance, leave, announcements, holidays)
│   ├── lib/                  # Pure utils + hooks (dates, working-days, useAsync, useDebounce, …)
│   ├── types/index.ts        # Shared interfaces
│   └── index.css             # Tailwind v4 @theme tokens + light/dark variables
├── .env.example              # Gemini key placeholders
└── …config                   # Vite, TypeScript, ESLint
```

### Mock API layer

All data flows through `src/services/api.ts` — typed async functions that read seed JSON from `src/data/` and resolve after a random 400–800 ms delay. The artificial latency is deliberate: it forces every screen through the real async lifecycle (skeleton → data | empty | error), so loading and error states are designed first-class rather than bolted on, and it mimics a network round-trip the UI can't shortcut. Components never import JSON directly.

### State management

Global state is Zustand, reserved for concerns more than one route genuinely shares: `leaveStore` (the single source of truth for balances and requests, consumed by both the Leave page and the Dashboard, with optimistic add and rollback), `toastStore`, `aiStore` (the summary cache), `notificationStore`, `commandStore`, and `themeStore`. Page-scoped UI state that no other screen cares about — the team search and filters, form field values, popover open/close — stays in local component state or a feature hook. The rule: reach for a store only when a second route needs the data.

### Serverless AI proxy

The summariser runs as a Vercel Node function at `api/summarize.ts`, never in the browser. The client only `POST`s `{ text, mode }` to `/api/summarize`; the Gemini API keys live solely in server-side environment variables and never enter the client bundle.

The function validates input (`405` for non-POST, `400` for empty text, `413` over ~6000 characters), then calls Gemini with `GEMINI_API_KEY` under an 8-second `AbortController` timeout. On any non-2xx response, network error, or timeout, it retries once with `GEMINI_API_KEY_2`. If both keys fail it returns a generic `502 { error: "AI temporarily unavailable" }` — provider errors and key material are never forwarded to the client. The model is `gemini-2.5-flash` by default, overridable via `GEMINI_MODEL`, and runs with `thinkingBudget: 0` to keep responses fast.

## AI tools used

- **Claude (chat)** — up-front architecture planning, feature specs, and design direction, distilled into the `CLAUDE.md` spec file that pins the design system, stack, and code rules.
- **Claude Code** — the implementation agent, building each feature against those specs.
- **Human review** — every change was reviewed before commit.

The application's own AI feature (announcement summaries and the digest) is powered by **Google Gemini 2.5 Flash**, not Claude.

## Assumptions & trade-offs

- **No authentication.** A single hardcoded current user (Mohit Jeswani); auth and multi-user sessions are out of scope for this exercise.
- **In-memory data.** Mock stores reset on refresh by design — there is no persistence layer. Submitted leave requests live for the session only.
- **Free-tier Gemini quota.** The dual-key fallback and graceful degradation exist precisely because free-tier keys rate-limit; the UI never crashes when the AI is unavailable.
- **Model choice.** `gemini-2.0-flash` turned out to have zero free-tier quota (`429`, `limit: 0`), so the default was switched to `gemini-2.5-flash` — kept configurable via `GEMINI_MODEL`.
- **Testing.** The serverless fallback logic and UI flows were exercised with throwaway harnesses during development, but no permanent test runner is committed (there is no Vitest/Jest in the toolchain yet).

## What I'd do with more time

- A real backend and authentication, replacing the mock API and hardcoded user.
- A leave approval workflow with a manager role (approve/reject, not just submit).
- Committed tests with CI (Vitest + Testing Library, run on every pull request).
- Internationalisation — the copy and date/number formatting are India-context today.
- Streaming AI responses, rendering the digest token-by-token instead of awaiting the full result.
