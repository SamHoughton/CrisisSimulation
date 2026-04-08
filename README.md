# CrisisTabletop

Browser-only tabletop crisis exercise platform. No server, no database, no accounts.
Runs entirely in the browser with localStorage persistence.

## Stack

| | |
|---|---|
| Framework | Vite + React + TypeScript |
| State | Zustand (persisted to localStorage) |
| Styling | Tailwind CSS |
| AI | Anthropic Claude API (called directly from browser) |
| Real-time | BroadcastChannel API (present window sync) |

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — no setup, no env vars, no accounts.

To enable the AI gap analysis, add your Anthropic API key in **Settings**.

## How it works

- **No backend.** All state lives in `localStorage`.
- **Single laptop.** One person runs the session; participants watch a shared screen.
- **Present window.** When you start a session, a second browser tab opens automatically. Put that tab full-screen on your projector. Injects are pushed to it instantly via the `BroadcastChannel` API.
- **AI report.** After the session ends, Claude analyses the full transcript (responses you logged, decisions, notes) and produces a structured gap analysis with scores, role feedback, and recommendations.

## Workflow

1. **Pick or build a scenario** — 4 templates included (Ransomware, Third-Party Breach, Dawn Raid, Social Media Crisis). Fully editable.
2. **Set up the session** — enter participant names (optional) per role.
3. **Launch** — a present window opens automatically. Put it on the projector.
4. **Run the session** — release injects one by one. Log what each participant says. Mark decision choices.
5. **End session** → **Generate report** — Claude analyses the transcript and produces the gap analysis.
6. **Export** — download as JSON for record keeping.

## Project structure

```
src/
├── screens/
│   ├── Home.tsx          Dashboard
│   ├── Library.tsx       Scenario library
│   ├── Builder.tsx       Scenario editor
│   ├── Setup.tsx         Session participant setup
│   ├── Runner.tsx        Live facilitator control panel
│   ├── Present.tsx       Standalone present window (projector view)
│   ├── Report.tsx        Post-exercise report + AI analysis
│   └── Settings.tsx      API key + profile
├── store/
│   └── index.ts          Zustand store with localStorage persistence
├── lib/
│   ├── claude.ts         Claude API call + system prompt
│   ├── templates.ts      4 built-in scenario templates
│   └── utils.ts          Labels, colours, formatters
└── types.ts              All TypeScript types
```
