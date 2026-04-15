/**
 * types.ts - All TypeScript type definitions for the Redline platform.
 *
 * Organised into sections: Scenario (templates + injects), Session (live exercise
 * state), Report (AI-generated analysis), App state (navigation + settings), and
 * BroadcastChannel message types (facilitator ↔ present screen communication).
 */

// ─── Scenario ────────────────────────────────────────────────────────────────

export type ScenarioType =
  | "RANSOMWARE"
  | "DATA_BREACH"
  | "INSIDER_THREAT"
  | "SUPPLY_CHAIN"
  | "DDOS"
  | "REGULATORY_INVESTIGATION"
  | "SOCIAL_MEDIA_CRISIS"
  | "INFRASTRUCTURE_OUTAGE"
  | "DEEPFAKE"
  | "CUSTOM";

export type Difficulty = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/**
 * Exercise audience tier - determines which level of the organisation
 * should lead discussion on this inject.
 *
 * STRATEGIC - Executive / C-suite: board governance, pay decisions, regulatory
 *             filings, market disclosures, insurance, reputational calls.
 *             Typical roles: CEO, CFO, CLO, CCO, Board Representative.
 *
 * TACTICAL  - Management / coordination layer: containment strategy, partner
 *             engagement, internal comms, cross-functional coordination.
 *             Typical roles: CISO, COO, CTO, HR Lead, Head of Comms.
 */
export type CommandTier = "STRATEGIC" | "TACTICAL";

export type ExecRole =
  | "CEO" | "CFO" | "CISO" | "CLO" | "CCO"
  | "COO" | "CTO" | "BOARD_REP" | "HR_LEAD" | "CUSTOM";

export interface DecisionOption {
  key: string;        // "A", "B", "C"
  label: string;      // shown to participants
  consequence?: string; // facilitator-only note
  /**
   * Optional best-to-worst rank, 1 = best. Used by the facilitator-facing
   * voting panel to hint at the designer's intended "right answer" after
   * reveal. Omit or set equal ranks for opinion-based options where there
   * is no single correct call.
   */
  rank?: number;
  /**
   * Optional short prose fragment used when compiling the "your arc" recap
   * that is prepended to ending injects. e.g. "a measured holding statement"
   * or "the NCSC-led route". Should read naturally after the parent inject's
   * `recapLine` template.
   */
  recapFragment?: string;
}

/**
 * One branch from a decision. If optionKey is chosen (in vote mode) or the
 * compound rank score falls within scoreMax (in score mode), jump to
 * nextInjectId.
 */
export interface InjectBranch {
  optionKey: string;
  nextInjectId: string;
  /**
   * Upper-bound for compound rank score in score-routed injects (branchMode:
   * "score"). Branches are evaluated in ascending scoreMax order and the
   * first whose scoreMax >= the session's average rank is selected.
   * Ignored in vote mode.
   */
  scoreMax?: number;
}

// ─── Inject artifact ─────────────────────────────────────────────────────────

export type ArtifactType =
  | "ransomware_note"
  | "tweet"
  | "siem_alert"
  | "email"
  | "legal_letter"
  | "news_headline"
  | "dark_web_listing"
  | "stock_chart"
  | "slack_thread"
  | "tv_broadcast"
  | "voicemail"
  | "internal_memo"
  | "sms_thread"
  | "regulator_portal"
  | "negotiation_chat"
  | "linkedin_post"
  | "board_portal"
  | "default";

export interface InjectArtifact {
  type: ArtifactType;
  // tweet
  tweetHandle?: string;
  tweetDisplayName?: string;
  tweetLikes?: number;
  tweetRetweets?: number;
  // email
  emailFrom?: string;
  emailTo?: string;
  emailSubject?: string;
  // legal
  legalCaseRef?: string;
  legalAuthority?: string;
  // siem
  siemAlertId?: string;
  siemSeverity?: "CRITICAL" | "HIGH" | "MEDIUM";
  siemSourceIp?: string;
  siemEventType?: string;
  // ransomware
  ransomAmount?: string;
  ransomDeadlineHours?: number;
  ransomWalletAddress?: string;
  // dark web listing
  darkWebSiteName?: string;      // e.g. "ALPHV Data Market"
  darkWebOnionUrl?: string;      // fake .onion address
  darkWebTitle?: string;         // headline for the listing
  darkWebPrice?: string;         // e.g. "12 XMR"
  darkWebRecordCount?: string;   // e.g. "220,000 records"
  darkWebSampleRows?: Array<{ name: string; account: string; sortCode: string; email: string }>; // fake sample data
  // stock chart (animated price ticker)
  stockTicker?: string;          // e.g. "APEX.L"
  stockCompanyName?: string;     // e.g. "Apex Dynamics plc"
  stockOpenPrice?: number;       // opening price in pence/cents
  stockCurrentPrice?: number;    // current/low price
  stockChangePercent?: number;   // e.g. -7.2
  stockVolume?: string;          // e.g. "14.2M"
  // slack thread (internal chat panic)
  slackChannel?: string;         // e.g. "#all-hands"
  slackMessages?: Array<{ author: string; role?: string; time: string; text: string; avatar?: string }>;
  // tv broadcast (breaking news lower-third + headline)
  tvNetwork?: string;            // e.g. "BBC NEWS"
  tvHeadline?: string;           // main chyron headline
  tvTicker?: string;             // scrolling bottom ticker
  tvReporter?: string;           // reporter name / location
  // voicemail
  voicemailCaller?: string;      // e.g. "James Whitfield, CFO"
  voicemailCallerNumber?: string; // e.g. "+44 7700 900142"
  voicemailDuration?: string;    // e.g. "0:47"
  voicemailTranscript?: string;  // transcribed text of the message
  voicemailTime?: string;        // when it was left, e.g. "03:31"
  // internal memo / board paper
  memoTitle?: string;
  memoClassification?: string;   // e.g. "STRICTLY CONFIDENTIAL — LEGAL PRIVILEGE"
  memoTo?: string;
  memoFrom?: string;
  memoDate?: string;
  memoRef?: string;
  // sms thread (two-person mobile exchange)
  smsParticipants?: [string, string]; // [left-name, right-name]
  smsMessages?: Array<{ sender: string; text: string; time: string }>;
  // regulator portal (ICO / FCA submission receipt)
  regulatorName?: string;        // e.g. "Information Commissioner's Office"
  regulatorPortalUrl?: string;   // e.g. "report.ico.org.uk"
  regulatorCaseRef?: string;     // e.g. "IC-247831-X9K2"
  regulatorStatus?: "SUBMITTED" | "ACKNOWLEDGED" | "UNDER_REVIEW" | "ESCALATED" | "CLOSED";
  regulatorSubmittedAt?: string;
  regulatorDeadline?: string;    // e.g. "72 hours from discovery"
  regulatorOfficerName?: string; // assigned case officer
  // negotiation chat (threat actor portal)
  negotiationThreatAlias?: string; // e.g. "ALPHV SUPPORT"
  negotiationMessages?: Array<{ side: "negotiator" | "threat"; text: string; time: string }>;
  // linkedin post
  linkedinAuthor?: string;
  linkedinAuthorTitle?: string;  // e.g. "Head of People, Apex Dynamics"
  linkedinText?: string;
  linkedinLikes?: number;
  linkedinComments?: number;
  linkedinShares?: number;
  // board portal
  boardPortalOrgName?: string;
  boardPortalMembers?: Array<{ name: string; role: string; loggedInAt?: string; isOnline?: boolean }>;
  boardPortalAlertCount?: number;
  boardPortalAlertTitle?: string; // e.g. "Unscheduled board meeting request"
}

export interface ArcRecapEntry {
  /** Text before {{recapFragment}} in the recapLine, e.g. "made the first call to" */
  label: string;
  /** The chosen option's recapFragment, e.g. "NCSC under NIS Regs" */
  fragment: string;
  /** Quality rank of the chosen option (1 = best, 4 = worst). Undefined if unranked. */
  rank?: number;
  /** Option key that won the vote: "A", "B", "C", or "D" */
  optionKey: string;
}

export interface ArcRecap {
  entries: ArcRecapEntry[];
  /** Compound average rank across all ranked decisions. null if no ranked decisions. */
  score: number | null;
}

export interface Inject {
  id: string;
  order: number;
  title: string;
  body: string;                   // what appears on screen
  facilitatorNotes?: string;      // private - never shown to participants
  imageUrl?: string;              // optional image shown on present screen
  delayMinutes: number;
  isDecisionPoint: boolean;
  decisionOptions: DecisionOption[];
  branches?: InjectBranch[];      // tree branching: per-option next inject overrides
  /**
   * How branches are resolved:
   * - "vote" (default): follow the branch whose optionKey matches the
   *   majority vote of this inject's decisions.
   * - "score": ignore the current vote and route by the average rank of
   *   all ranked decisions taken in the whole session so far (including
   *   this one). Select the branch with the smallest scoreMax such that
   *   avgRank <= scoreMax. Used for compound-scored finales.
   */
  branchMode?: "vote" | "score";
  targetRoles: ExecRole[];
  expectedKeywords?: string[];
  artifact?: InjectArtifact;      // styled display type for present screen
  commandTier?: CommandTier;      // GOLD/SILVER/BRONZE incident command tier
  /**
   * Short (1-3 sentence) narrator summary shown when this inject is filtered out
   * due to tier selection (e.g. Bronze inject skipped in a Gold-only session).
   * Displayed as a "Story so far..." briefing strip on the Present screen before
   * the next in-scope inject, so the room retains narrative coherence.
   */
  tierSkipSummary?: string;
  timerMinutes?: number;          // per-inject countdown (facilitator controlled)
  tickerHeadline?: string;        // added to news ticker when inject is released
  /**
   * Optional template used when compiling a session recap. The placeholder
   * {{recapFragment}} is replaced with the chosen option's recapFragment.
   * e.g. "opened with {{recapFragment}}".
   */
  recapLine?: string;
  /**
   * Mark this inject as a scenario ending. When true, the store attaches
   * a structured arcRecap to the rendered inject broadcast to Present so the
   * arc card can be displayed visually. QR phones receive a plain-text
   * fallback via liveInject.injectBody.
   */
  isEnding?: boolean;
  /**
   * Structured arc recap populated at release time for ending injects only.
   * Never present on scenario definition objects - only on rendered injects
   * broadcast to the Present screen.
   */
  arcRecap?: ArcRecap;
  /**
   * Fictional day number within the scenario (1 = Day 1, 2 = Day 2, etc.).
   * Used to power the scenario day strip on Runner and Present screens.
   * Omit for injects that don't have a clear in-story day (e.g. pure endings).
   */
  scenarioDay?: number;
  /**
   * Fictional time of day within the scenario, e.g. "03:14" or "09:00".
   * Shown alongside the day strip to orient participants in the story timeline.
   */
  scenarioTime?: string;
}

export interface Scenario {
  id: string;
  title: string;
  description?: string;
  type: ScenarioType;
  difficulty: Difficulty;
  durationMin: number;
  briefing?: string;
  roles: ExecRole[];
  injects: Inject[];
  isTemplate?: boolean;
  imageUrl?: string;              // cover image for library/cards
  coverGradient?: string;         // CSS gradient fallback (e.g. "135deg, #1a1a2e, #e8002d")
  createdAt: string;
  updatedAt: string;
  /**
   * Regulatory / compliance frameworks this scenario covers.
   * Displayed in the library and debrief report.
   * e.g. ["NIS2", "NIST CSF 2.0", "ISO 27001", "DORA"]
   */
  regulatoryFrameworks?: string[];
  /**
   * What actually happened in the real-world incident this scenario is based on.
   * Shown in the debrief report as a "what really happened" reveal.
   * Omit for fictional scenarios.
   */
  realOutcome?: string;
}

// ─── Session ─────────────────────────────────────────────────────────────────

export interface Participant {
  role: ExecRole;
  name: string;
  customTitle?: string; // overrides ROLE_LONG display name e.g. "General Counsel" instead of "Chief Legal Officer"
}

export interface ResponseEntry {
  role: ExecRole;
  name: string;
  body: string;
  timestamp: string;
}

export interface DecisionEntry {
  role: ExecRole;
  name: string;
  optionKey: string;
  optionLabel: string;
}

export interface LiveInject {
  injectId: string;
  injectTitle: string;
  injectBody: string;
  releasedAt: string;
  responses: ResponseEntry[];
  decisions: DecisionEntry[];
  facilitatorNote?: string;
}

export type SessionStatus = "setup" | "active" | "paused" | "ended";

export interface FacilitatorNote {
  text: string;
  timestamp: string;
}

export interface Session {
  id: string;
  scenario: Scenario;
  participants: Participant[];
  startedAt: string;
  endedAt?: string;
  status: SessionStatus;
  liveInjects: LiveInject[];
  notes: FacilitatorNote[];
  report?: GeneratedReport;
  /**
   * Which command tiers are active in this session. Injects whose commandTier
   * is NOT in this array are skipped during the exercise. Their tierSkipSummary
   * is shown as a "Story so far..." briefing before the next in-scope inject.
   * Defaults to all tiers when omitted.
   */
  selectedTiers?: CommandTier[];
}

// ─── Report ──────────────────────────────────────────────────────────────────

export interface GapDimension {
  dimension: string;
  score: number;
  observations: string[];
  positives: string[];
}

export interface RoleFeedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  score: number;
}

export interface Recommendation {
  priority: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  detail: string;
  relatedRole?: string;
}

export interface GeneratedReport {
  generatedAt: string;
  overallScore: number;
  executiveSummary: string;
  gapAnalysis: GapDimension[];
  roleFeedback: Record<string, RoleFeedback>;
  recommendations: Recommendation[];
}

// ─── App state ───────────────────────────────────────────────────────────────

export type View =
  | "home"
  | "library"
  | "builder"
  | "setup"
  | "runner"
  | "report"
  | "settings"
  | "present";

export interface Settings {
  claudeApiKey: string;
  orgName: string;
  facilitatorName: string;
  theme: "dark" | "light";
}

// ─── BroadcastChannel message types ─────────────────────────────────────────

export type PresentMessage =
  | { type: "inject"; inject: Inject; injectNum: number; totalInjects: number; contextSummaries?: Array<{ title: string; summary: string }> }
  | { type: "adhoc"; body: string }
  | { type: "status"; status: SessionStatus; scenario?: Scenario }
  | { type: "vote"; role: string; roleName: string; optionKey: string }
  | { type: "vote-reveal"; decisions: DecisionEntry[] }
  | { type: "timer"; action: "start" | "stop" | "reset"; seconds: number }
  | { type: "request-state" };

// ─── Remote (QR) participant session ─────────────────────────────────────────
//
// When the facilitator enables "participant devices" the Runner mints a short
// session code and publishes the current inject + collected votes to a
// Netlify Blob. Participants visit /#join/CODE on their phones, pick a role,
// and vote from there. Facilitator polls the blob for incoming votes.
//
// Source of truth is still the facilitator's local Zustand session - the
// remote blob is a publish target, not the canonical state.

export interface RemoteParticipant {
  id: string;          // server-assigned UUID
  name: string;
  role: ExecRole;
  customTitle?: string;
  joinedAt: string;
}

export interface RemoteVote {
  participantId: string;
  optionKey: string;
  castAt: string;
}

export interface RemoteInject {
  injectId: string;
  title: string;
  body: string;
  isDecisionPoint: boolean;
  options: DecisionOption[];
  releasedAt: string;
  revealed: boolean;
  winningOptionKey?: string;
}

export interface RemoteSessionState {
  code: string;                       // 6-char session code
  createdAt: string;
  expiresAt: string;                  // 24h from creation
  scenarioTitle: string;
  availableRoles: ExecRole[];         // roles the facilitator allows
  participants: RemoteParticipant[];
  currentInject: RemoteInject | null;
  votes: RemoteVote[];                // votes for the *current* inject only
  status: "waiting" | "active" | "ended";
}
