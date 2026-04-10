# VIGIL - Executive Crisis Training

A browser-based tabletop crisis simulation platform for executive teams. No server, no database, no accounts. Runs entirely in one browser with `localStorage` persistence and a second-screen projector view synced via the `BroadcastChannel` API.

Built for facilitators who need to run realistic, high-pressure crisis exercises without enterprise infrastructure.

## Features

**Scenario Engine**
- Two built-in 2-hour scenarios (Ransomware + Deepfake CEO) with deep branching decision trees
- Custom scenario builder with drag-and-drop inject ordering
- Decision points with majority-vote branching - choices lead to genuinely different paths
- Per-inject countdown timers, facilitator notes, and expected keyword tracking

**Immersive Present Screen**
- Standalone projector view with VIGIL splash intro, live news ticker, and crisis escalation bar
- Styled artifacts: ransomware notes, SIEM alerts, tweets, emails, legal letters, dark web listings
- Scenario briefing cards - fake encrypted file explorer (ransomware) or blurred viral deepfake video
- Real-time vote visualisation with animated reveal

**AI-Powered Analysis**
- Claude Haiku suggests inject body text while building scenarios
- Claude Sonnet generates structured post-exercise reports: gap analysis, role feedback, recommendations, overall score
- Calls route through a Netlify Function proxy by default (server-side API key); users can optionally paste their own key in Settings to use their own Anthropic account

**Facilitator Tools**
- Live session control panel with inject queue, voting panel, and observation notes
- Pause/resume, ad-hoc injects, per-inject timer with present-screen sync
- Decision log, reputation dashboard, and exportable JSON transcript
- Print-optimised report view for PDF export

## Stack

| Layer | Technology |
|---|---|
| Framework | Vite + React 19 + TypeScript |
| State | Zustand with `localStorage` persistence |
| Styling | Tailwind CSS (custom dark theme) |
| AI | Anthropic Claude API (Haiku + Sonnet) |
| Real-time | BroadcastChannel API (facilitator ↔ present screen) |
| Icons | Lucide React |
| Dates | date-fns |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). No accounts needed.

**For AI features in local dev:** the Vite dev server doesn't run Netlify Functions. Either:
- Run `netlify dev` instead of `npm run dev` (requires `npm i -g netlify-cli`) to get the proxy locally, with `ANTHROPIC_API_KEY` set in a `.env` file, **or**
- Paste your own [Anthropic API key](https://console.anthropic.com/) into **Settings** to call the API directly from the browser.

In production (deployed to Netlify), the proxy is always available, so the in-app key field stays optional.

## How It Works

1. **Pick or build a scenario** - two full templates included. Fully editable, duplicatable.
2. **Set up the session** - assign participants to executive roles (CEO, CISO, CLO, etc.). Role titles are customisable.
3. **Launch** - a present window opens automatically. Put it on the projector or share screen. Fullscreen button included.
4. **Run** - release injects one by one from the facilitator panel. Participants discuss and decide. Log responses, cast votes, take facilitator notes.
5. **Decide** - at decision points, each role votes. Majority wins. The scenario branches accordingly.
6. **End → Report** - Claude analyses the full transcript and produces a structured gap analysis with scores, strengths, and recommendations.
7. **Export** - download as JSON or print to PDF.

## Architecture

```
src/
├── App.tsx                 Root - view routing, #present hash detection
├── main.tsx                Entry point
├── types.ts                All TypeScript interfaces and type definitions
├── index.css               Tailwind base + custom animations + print styles
│
├── store/
│   └── index.ts            Zustand store: state, actions, branching logic,
│                           BroadcastChannel dispatch, localStorage persistence
│
├── lib/
│   ├── claude.ts           Claude API: inject suggestions (Haiku) + report generation (Sonnet)
│   ├── templates.ts        Built-in scenarios: Ransomware (11 injects, 4 branches),
│   │                       Deepfake CEO (10 injects, 3 branches)
│   └── utils.ts            Formatters, role/scenario label maps, colour constants
│
├── components/
│   └── Layout.tsx          Sidebar navigation + VIGIL logo
│
└── screens/
    ├── Home.tsx            Dashboard: stats, active session banner, quick start cards
    ├── Library.tsx         Scenario browser: search, filter, duplicate, run
    ├── Builder.tsx         Scenario editor: metadata, inject timeline, decision trees
    ├── Setup.tsx           Pre-session: participant names, role titles, timeline preview
    ├── Runner.tsx          Facilitator control panel: inject queue, voting, timer, notes
    ├── Present.tsx         Projector screen: splash, briefing, artifacts, voting, ticker
    ├── Report.tsx          Post-exercise: AI report, decision log, dashboard, PDF export
    └── Settings.tsx        API key, facilitator profile, data management
```

## Key Design Decisions

**Almost no backend** - The app is a static SPA. All session state, scenarios, and reports persist in `localStorage` under key `crisis-tabletop`. The only server-side code is a single Netlify Function (`netlify/functions/claude.ts`, ~100 lines) that proxies Anthropic API calls so the API key stays on the server. Users can optionally bypass the proxy by supplying their own key, in which case the browser calls the Anthropic API directly with the `anthropic-dangerous-direct-browser-access` header.

**BroadcastChannel for sync** - The facilitator's Runner screen and the Present screen communicate via `BroadcastChannel("crisis-present")`. Messages include inject releases, vote broadcasts, timer sync, and session status changes. Works across browser tabs on the same origin - no WebSocket server needed.

**Branching decision trees** - Each inject can define `branches: InjectBranch[]` mapping decision option keys to `nextInjectId`. When votes are revealed, the store follows the majority vote's branch. The inject queue dims off-path injects and highlights reachable ones.

**Artifact system** - Injects can carry typed artifacts (`ransomware_note`, `tweet`, `siem_alert`, `email`, `legal_letter`, `dark_web_listing`, `news_headline`) that render as styled components on the present screen - no images required, pure CSS/HTML.

## Built-in Scenarios

### Ransomware with Data Exfiltration
- **Company:** Meridian Financial Services (3,200 employees, 1.4M customers, London)
- **Duration:** ~120 minutes
- **Injects:** 14 with 4 branching paths
- **Artifacts:** SIEM alerts, ransomware note, dark web data listing, emails, legal letters, news headlines
- **Key decisions:** Containment strategy, ransom negotiation, regulatory notification, board escalation

### The Deepfake CEO
- **Company:** Apex Dynamics (FTSE 250, 8,000 employees)
- **Duration:** ~120 minutes
- **Injects:** 10 with 3 branching paths
- **Artifacts:** Viral tweet, blurred video still, legal letters, news headlines
- **Key decisions:** Public response strategy, forensic investigation, FCA engagement, AI policy

## Deployment

Built for Netlify. Both the static SPA and the Claude proxy function deploy from the same repo:

```bash
npm run build    # outputs to dist/
```

**Required Netlify environment variable** (Site settings → Environment variables):

| Key | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (used by `netlify/functions/claude.ts`) |

The function endpoint is `/.netlify/functions/claude`. If `ANTHROPIC_API_KEY` is unset, the proxy returns a 500 and the app falls back to the user-supplied key from Settings (if any).

The app also runs on Vercel, Cloudflare Pages, or any static host, but you'll need to port the proxy function to that host's serverless format (or rely on user-supplied keys only).

## Licence

Private project. Not currently open-source.
