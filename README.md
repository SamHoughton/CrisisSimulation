# REDLINE - Executive Crisis Training

A browser-based tabletop crisis simulation platform for executive teams. No server, no database, no accounts. Runs entirely in one browser with `localStorage` persistence and a second-screen projector view synced via the `BroadcastChannel` API.

Built for facilitators who need to run realistic, high-pressure crisis exercises without enterprise infrastructure.

## Features

**Scenario Engine**
- Five built-in 2-3 hour scenarios across ransomware, deepfake, supply chain, social media, and infrastructure outage
- Custom scenario builder with drag-and-drop inject ordering
- Decision points with majority-vote branching - choices lead to genuinely different paths
- Score-routed endings: compound scoring across all decisions determines which of four outcome branches plays out
- Per-inject countdown timers, facilitator notes, and expected keyword tracking

**Immersive Present Screen**
- Standalone projector view with REDLINE splash intro, live news ticker, and crisis escalation bar
- 16 styled artifact types: ransomware notes, SIEM alerts, tweets, emails, legal letters, dark web listings, stock charts, Slack threads, TV broadcasts, voicemails, internal memos, SMS threads, regulator portals, negotiation chats, LinkedIn posts, board portals
- Scenario briefing cards - fake encrypted file explorer (ransomware), blurred viral video (deepfake), vendor risk dashboard (supply chain)
- Real-time vote visualisation with animated reveal

**Remote Participant Devices**
- QR code join flow so participants can vote on their phones
- Netlify Function relay syncs inject state, votes, and reveals to mobile devices
- Works alongside the local BroadcastChannel - both screens update simultaneously

**AI-Powered Analysis**
- Claude suggests inject body text while building scenarios
- Claude generates structured post-exercise reports: gap analysis, role feedback, recommendations, overall score
- API calls route through a Netlify Function proxy by default (server-side key); users can optionally supply their own key in Settings

**Command Tier System (Gold / Silver / Bronze)**
- Every inject is tagged with an incident command tier to signal which level of the organisation should lead the discussion
- Gold Command - strategic C-suite decisions: board comms, regulatory filings, market disclosure, ransom payment, insurance
- Silver Command - tactical management decisions: containment strategy, partner engagement, internal comms, cross-functional coordination
- Bronze Command - operational/technical decisions: initial alert triage, forensic capture, network isolation, hands-on response
- Tier badge displayed prominently on the projector screen and in the facilitator's current-inject panel; a colour-coded dot appears in the inject queue for quick reference
- Configurable per inject in the scenario builder; omit for injects where tier is not relevant

**Facilitator Tools**
- Live session control panel with inject queue (with tier dots), voting panel, and observation notes
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
| Real-time | BroadcastChannel API (facilitator to present screen) |
| Remote voting | Netlify Blob storage via serverless function relay |
| Icons | Lucide React |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). No accounts needed.

**For AI features in local dev:** the Vite dev server does not run Netlify Functions. Either:
- Run `netlify dev` instead of `npm run dev` (requires `npm i -g netlify-cli`) to get the proxy locally, with `ANTHROPIC_API_KEY` set in a `.env` file, **or**
- Paste your own [Anthropic API key](https://console.anthropic.com/) into **Settings** to call the API directly from the browser.

In production (deployed to Netlify), the proxy is always available, so the in-app key field stays optional.

## How It Works

1. **Pick or build a scenario** - five full templates included. Fully editable, duplicatable.
2. **Set up the session** - assign participants to executive roles (CEO, CISO, CLO, etc.). Role titles are customisable.
3. **Launch** - a present window opens automatically. Put it on the projector or share screen. Fullscreen button included.
4. **Run** - release injects one by one from the facilitator panel. Participants discuss and decide. Log responses, cast votes, take facilitator notes.
5. **Decide** - at decision points, each role votes. Majority wins. The scenario branches accordingly.
6. **End and report** - Claude analyses the full transcript and produces a structured gap analysis with scores, strengths, and recommendations.
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
│   ├── claude.ts           Claude API: inject suggestions + report generation
│   ├── remoteSession.ts    Netlify Blob relay: create, update, poll remote sessions
│   ├── scenarios/          Built-in scenario files (one per scenario)
│   │   ├── index.ts        Re-exports BUILT_IN_TEMPLATES array
│   │   ├── ransomware.ts   Ransomware: The Quiet Beacon (27 injects)
│   │   ├── deepfake.ts     The Deepfake CEO (25 injects)
│   │   ├── supply-chain.ts The Trusted Vendor (22 injects)
│   │   ├── social-media-crisis.ts  Social Media: The Post (18 injects)
│   │   └── infrastructure-outage.ts Infrastructure: The Window (21 injects)
│   └── utils.ts            Formatters, role/scenario label maps, colour constants
│
├── components/
│   ├── Layout.tsx          Sidebar navigation + REDLINE logo
│   └── ScenarioDayStrip.tsx  Fictional day/time indicator shown during injects
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

**Almost no backend** - The app is a static SPA. All session state, scenarios, and reports persist in `localStorage` under key `crisis-tabletop`. The only server-side code is a pair of Netlify Functions (`netlify/functions/claude.ts` and `netlify/functions/session.ts`) that proxy Anthropic API calls and relay inject state to mobile devices. Users can optionally bypass the Claude proxy by supplying their own API key, in which case the browser calls Anthropic directly with the `anthropic-dangerous-direct-browser-access` header.

**BroadcastChannel for sync** - The facilitator's Runner screen and the Present screen communicate via `BroadcastChannel("crisis-present")`. Messages include inject releases, vote broadcasts, timer sync, and session status changes. Works across browser tabs on the same origin - no WebSocket server needed.

**Branching decision trees** - Each inject can define `branches: InjectBranch[]` mapping decision option keys to `nextInjectId`. When votes are revealed, the store follows the majority vote's branch. The inject queue dims off-path injects and highlights reachable ones. Endings can use `branchMode: "score"` to route by the compound average rank of all decisions taken in the session.

**Artifact system** - Injects carry typed artifacts that render as styled components on the present screen with no images required, pure CSS and HTML. Supported types: `ransomware_note`, `siem_alert`, `tweet`, `email`, `legal_letter`, `news_headline`, `dark_web_listing`, `stock_chart`, `slack_thread`, `tv_broadcast`, `voicemail`, `internal_memo`, `sms_thread`, `regulator_portal`, `negotiation_chat`, `linkedin_post`, `board_portal`.

**Command tier system** - Each inject carries an optional `commandTier` field (`"GOLD"`, `"SILVER"`, or `"BRONZE"`). Gold = strategic C-suite decisions. Silver = tactical management. Bronze = hands-on technical response. The tier badge is shown on the projector in amber/slate/orange respectively, directing the room's attention to the right audience for each inject. All 113 built-in injects are pre-classified; the Builder lets scenario authors set tiers on custom injects.

**Remote voting** - A Netlify Blob acts as a lightweight shared state store. The Runner writes the current inject and vote state on every change; participant phones poll it via the `/session` function. This enables QR-based join without a WebSocket server or database.

## Built-in Scenarios

### Ransomware: The Quiet Beacon
- **Company:** Veridian Power (energy retailer, OES under NIS Regs 2018)
- **Duration:** ~180 minutes
- **Injects:** 27 across a 5-day arc with 9 decision points and 4 score-routed endings
- **Artifacts:** SIEM alert, voicemail, ransomware note, email, negotiation chat, TV broadcast, stock chart, dark web listing, internal memo
- **Key decisions:** Containment strategy, regulatory notification (NCSC vs Ofgem), ransom negotiation, PSR outreach, board escalation, insurance coupling, RNS obligations

### The Deepfake CEO
- **Company:** Apex Dynamics (FTSE 250, financial services)
- **Duration:** ~180 minutes
- **Injects:** 25 across a 3-day arc with 7 decision points and 4 score-routed endings
- **Artifacts:** Tweet, board portal, voicemail, SMS thread, LinkedIn post, TV broadcast, regulator portal, legal letter
- **Key decisions:** Public response strategy, identity verification, FCA MAR engagement, employee welfare, forensics, insider threat response

### The Trusted Vendor
- **Company:** Clearpoint HR (cloud payroll processor, simultaneous victim and processor)
- **Duration:** ~180 minutes
- **Injects:** 22 across a multi-day arc with 13 decision points and 4 score-routed endings
- **Artifacts:** Regulator portal, email, legal letter, internal memo, stock chart, TV broadcast, dark web listing
- **Key decisions:** Vendor relationship management, GDPR dual-role obligations, regulatory triage, 140-client notification cascade, commercial negotiation under duress

### Social Media: The Post
- **Company:** Hartley and Webb (financial advisory, FCA-regulated)
- **Duration:** ~150 minutes
- **Injects:** 18 across a 48-hour arc with 11 decision points
- **Artifacts:** Tweet, voicemail, legal letter, email, LinkedIn post, regulator portal
- **Key decisions:** Corporate communications, FCA MAR obligations, employment law, board governance, reputational calculus

### Infrastructure: The Window
- **Company:** Clearpoint Bank (retail bank, PRA-regulated, 60,000 salary payments due)
- **Duration:** ~180 minutes
- **Injects:** 21 across a multi-day arc with 13 decision points and 4 score-routed endings
- **Artifacts:** SIEM alert, email, internal memo, SMS thread, TV broadcast, regulator portal, stock chart
- **Key decisions:** Operational resilience obligations, PRA notification timing, vendor management, branch cash access, customer remediation

## Deployment

Built for Netlify. Both the static SPA and the serverless functions deploy from the same repo:

```bash
npm run build    # outputs to dist/
```

**Required Netlify environment variable** (Site settings - Environment variables):

| Key | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (used by `netlify/functions/claude.ts`) |

The function endpoint is `/.netlify/functions/claude`. If `ANTHROPIC_API_KEY` is unset, the proxy returns a 500 and the app falls back to the user-supplied key from Settings (if any).

The app also runs on Vercel, Cloudflare Pages, or any static host, but you will need to port the proxy functions to that host's serverless format (or rely on user-supplied keys only). The remote voting feature specifically requires Netlify Blob storage.

## Licence

Private project. Not currently open-source.
