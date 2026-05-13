# Crucible — Executive Crisis Training

A browser-based tabletop crisis simulation platform for executive teams. No server, no database, no accounts. Runs entirely in one browser with `localStorage` persistence and a second-screen projector view synced via the `BroadcastChannel` API.

Built for facilitators who need to run realistic, high-pressure crisis exercises without enterprise infrastructure.

## Features

**Scenario Engine**
- Three built-in 2–3 hour scenarios across ransomware and deepfake crises, with a technical response variant
- Custom scenario builder with inject ordering, decision trees, and branching logic
- Decision points with majority-vote branching — choices lead to genuinely different paths
- Score-routed endings: compound scoring across all decisions determines which of four outcome branches plays out
- Per-inject countdown timers, facilitator notes, and expected keyword tracking

**Immersive Present Screen**
- Standalone projector view with Crucible splash intro, live news ticker, and crisis escalation bar
- 16 styled artifact types rendered in pure CSS: ransomware notes, SIEM alerts, tweets, emails, legal letters, dark web listings, stock charts, Slack threads, TV broadcasts, voicemails, internal memos, SMS threads, regulator portals, negotiation chats, LinkedIn posts, board portals
- Scenario briefing cards — fake encrypted file explorer (ransomware), blurred viral video (deepfake)
- Real-time vote visualisation with animated reveal

**Remote Participant Devices**
- QR code join flow so participants can vote on their phones
- Netlify Function relay syncs inject state, votes, and reveals to mobile devices
- Works alongside the local BroadcastChannel — both screens update simultaneously

**AI-Powered Analysis**
- Claude suggests inject body text while building scenarios
- Claude generates structured post-exercise reports: gap analysis, role feedback, recommendations, overall score
- API calls route through a Netlify Function proxy by default (server-side key); users can optionally supply their own key in Settings

**Command Tier System (Strategic / Tactical)**
- Every inject is tagged with an incident command tier to signal which level of the organisation should lead discussion
- Strategic — C-suite decisions: board comms, regulatory filings, market disclosure, ransom payment, insurance
- Tactical — management decisions: containment strategy, partner engagement, internal comms, cross-functional coordination
- Tier badge displayed prominently on the projector screen and in the facilitator's inject panel; a colour-coded dot appears in the inject queue for quick reference
- Configurable per inject in the scenario builder; omit for injects where tier is not relevant
- Tier filtering in the Runner: run a Strategic-only session and Tactical injects are automatically narrated as "story so far" summaries

**Facilitator Tools**
- Live session control panel with inject queue (with tier dots and branch indicators), voting panel, and observation notes
- Pause/resume, ad-hoc injects, per-inject countdown timer with present-screen sync
- Story map drawer for visualising the full branching decision tree mid-session
- Decision log, reputation dashboard, and exportable JSON transcript
- Print-optimised report view for PDF export

## Stack

| Layer | Technology |
|---|---|
| Framework | Vite + React 19 + TypeScript |
| State | Zustand with `localStorage` persistence |
| Styling | Tailwind CSS (custom `crux-*` design tokens, light and dark themes) |
| AI | Anthropic Claude API (Haiku for suggestions, Sonnet for reports) |
| Real-time | BroadcastChannel API (facilitator → present screen) |
| Remote voting | Netlify Blob storage via serverless function relay |
| Icons | Lucide React |

## How It Works

1. **Pick or build a scenario** — three full templates included. Fully editable and duplicatable.
2. **Set up the session** — assign participants to executive roles (CEO, CISO, CLO, etc.). Role titles are customisable.
3. **Launch** — a present window opens automatically. Put it on the projector or share screen. Fullscreen button included.
4. **Run** — release injects one by one from the facilitator panel. Participants discuss and decide. Log responses, cast votes, take facilitator notes.
5. **Decide** — at decision points, each role votes. Majority wins. The scenario branches accordingly.
6. **End and report** — Claude analyses the full transcript and produces a structured gap analysis with scores, strengths, and recommendations.
7. **Export** — download as JSON or print to PDF.

## Architecture

```
src/
├── App.tsx                   Root — view routing, #present and #join/:code hash detection
├── main.tsx                  Entry point
├── types.ts                  All TypeScript interfaces and type definitions
├── index.css                 Tailwind base + crux-* design tokens + animations + print styles
│
├── store/
│   └── index.ts              Zustand store: state, actions, branching logic,
│                             BroadcastChannel dispatch, localStorage persistence
│
├── lib/
│   ├── claude.ts             Claude API: inject suggestions + report generation
│   ├── remoteSession.ts      Netlify Blob relay: create, update, poll remote sessions
│   ├── utils.ts              Formatters, role/scenario label maps, colour constants
│   └── scenarios/            Built-in scenario files (one per scenario)
│       ├── index.ts          Exports BUILT_IN_TEMPLATES array
│       ├── ransomware-executive.ts   Ransomware: The Quiet Beacon — executive audience
│       ├── ransomware-technical.ts   Ransomware: The Quiet Beacon — technical audience
│       └── deepfake.ts               The Deepfake CEO
│
├── components/
│   ├── Layout.tsx            Sidebar navigation + Crucible logo + session status pill
│   ├── LoadScreen.tsx        Animated Crucible splash shown on first app load
│   ├── ScenarioDayStrip.tsx  Fictional day/time indicator shown during injects
│   └── StoryMapDrawer.tsx    Slide-out branching decision tree visualiser
│
├── hooks/
│   └── useWorldSimulation.ts Live world event scheduler (stock ticks, Slack messages, tweets)
│
└── screens/
    ├── Home.tsx              Dashboard: stats, active session banner, quick-start scenario cards
    ├── Library.tsx           Scenario browser: search, filter, duplicate, run, delete
    ├── Builder.tsx           Scenario editor: metadata, inject timeline, decision trees, AI suggest
    ├── Setup.tsx             Pre-session: participant names, role titles, timeline preview
    ├── Runner.tsx            Facilitator control panel: inject queue, voting, timer, notes
    ├── Present.tsx           Projector screen: splash, briefing, artifacts, voting, ticker
    ├── Report.tsx            Post-exercise: AI report, decision log, dashboard, PDF export
    ├── Settings.tsx          API key, facilitator profile, data management
    ├── Join.tsx              Mobile QR entry: role selection, name, session join
    └── Participant.tsx       Mobile voting screen: polls remote session, shows inject, casts vote
```

## Key Design Decisions

**No backend** — The app is a static SPA. All session state, scenarios, and reports persist in `localStorage` under key `"crisis-tabletop"`. The only server-side code is a pair of Netlify Functions (`netlify/functions/claude.ts` and `netlify/functions/session.ts`) that proxy Anthropic API calls and relay inject state to mobile devices. Users can bypass the Claude proxy by supplying their own API key in Settings; the browser then calls Anthropic directly with the `anthropic-dangerous-direct-browser-access` header.

**BroadcastChannel for sync** — The facilitator's Runner screen and the Present screen communicate via `BroadcastChannel("crisis-present")`. Messages cover inject releases, vote broadcasts, timer sync, and session status changes. Works across browser tabs on the same origin — no WebSocket server needed.

**Branching decision trees** — Each inject can define `branches: InjectBranch[]` mapping decision option keys to `nextInjectId`. When votes are revealed, the store follows the majority vote's branch. The inject queue dims off-path injects and highlights the reachable path. Endings can use `branchMode: "score"` to route by the compound average rank of all decisions taken in the session.

**Artifact system** — Injects carry typed artifacts that render as styled components on the present screen with no images required — pure CSS and HTML. Supported types: `ransomware_note`, `siem_alert`, `tweet`, `email`, `legal_letter`, `news_headline`, `dark_web_listing`, `stock_chart`, `slack_thread`, `tv_broadcast`, `voicemail`, `internal_memo`, `sms_thread`, `regulator_portal`, `negotiation_chat`, `linkedin_post`, `board_portal`.

**Command tier system** — Each inject carries an optional `commandTier` field (`"STRATEGIC"` or `"TACTICAL"`). The tier badge is shown on the projector in amber/slate respectively, directing the room's attention to the right audience for each inject. The facilitator can run a tier-filtered session; filtered-out injects are automatically narrated as short "story so far" summaries so the room retains narrative coherence. Built-in injects are pre-classified; the Builder lets scenario authors set tiers on custom injects.

**World simulation** — Decision-point injects can carry `worldEvents`: timed events that fire during deliberation on the Present screen. Types include `stock_tick` (moves a live stock price), `social_post` (appends a tweet to the social feed artifact), `slack_message` (appends to a Slack thread), `chat_pressure` (adds messages to a negotiation chat), and `ticker_headline` (injects a breaking headline into the news ticker).

**Remote voting** — A Netlify Blob acts as a lightweight shared state store. The Runner writes the current inject and vote state on every change; participant phones poll it via the `/session` function. This enables QR-based join without a WebSocket server or database.

## Built-in Scenarios

### Ransomware: The Quiet Beacon — Executive Response
- **Company:** Veridian Power (FTSE 250 energy retailer, OES under NIS Regs 2018, 740,000 customers)
- **Audience:** CEO, CFO, CLO, CCO, COO
- **Duration:** ~180 minutes
- **Injects:** 27 across a 5-day arc with 9 decision points and 4 score-routed endings
- **Artifacts:** SIEM alert, voicemail, ransomware note, email, negotiation chat, TV broadcast, stock chart, dark web listing, internal memo
- **Key decisions:** Containment strategy, NCSC vs Ofgem notification, ransom negotiation, PSR outreach, board escalation, insurance coupling, RNS obligations

### Ransomware: The Quiet Beacon — Technical Response
- **Company:** Veridian Power (same incident, technical audience)
- **Audience:** CISO, CTO, COO, technical responders
- **Duration:** ~120 minutes
- **Paired with:** Executive Response scenario — run both audiences simultaneously for a full-organisation exercise

### The Deepfake CEO
- **Company:** Apex Dynamics (FTSE 250, financial services)
- **Audience:** Broad executive team
- **Duration:** ~180 minutes
- **Injects:** 25 across a 3-day arc with 7 decision points and 4 score-routed endings
- **Artifacts:** Tweet, board portal, voicemail, SMS thread, LinkedIn post, TV broadcast, regulator portal, legal letter
- **Key decisions:** Public response strategy, identity verification, FCA MAR engagement, employee welfare, forensics, insider threat response

## Deployment

Built for Netlify. Both the static SPA and the serverless functions deploy from the same repo:

```bash
npm run build    # outputs to dist/
```

**Required Netlify environment variable** (Site settings → Environment variables):

| Key | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (used by `netlify/functions/claude.ts`) |

The function endpoint is `/.netlify/functions/claude`. If `ANTHROPIC_API_KEY` is unset the proxy returns a 500 and the app falls back to the user-supplied key from Settings (if any).

The app also runs on Vercel, Cloudflare Pages, or any static host, but you will need to port the proxy functions to that host's serverless format (or rely on user-supplied keys only). The remote voting feature specifically requires Netlify Blob storage.

## Licence

Private project. Not currently open-source.
