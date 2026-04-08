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
  | "CUSTOM";

export type Difficulty = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ExecRole =
  | "CEO" | "CFO" | "CISO" | "CLO" | "CCO"
  | "COO" | "CTO" | "BOARD_REP" | "HR_LEAD" | "CUSTOM";

export interface DecisionOption {
  key: string;       // "A", "B", "C"
  label: string;     // shown to participants
  consequence?: string; // facilitator-only note
}

export interface Inject {
  id: string;
  order: number;
  title: string;
  body: string;                  // what appears on screen
  facilitatorNotes?: string;     // private — never shown to participants
  delayMinutes: number;
  isDecisionPoint: boolean;
  decisionOptions: DecisionOption[];
  targetRoles: ExecRole[];
  expectedKeywords?: string[];
}

export interface Scenario {
  id: string;
  title: string;
  description?: string;
  type: ScenarioType;
  difficulty: Difficulty;
  durationMin: number;
  briefing?: string;             // shown before session starts
  roles: ExecRole[];
  injects: Inject[];
  isTemplate?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Session ─────────────────────────────────────────────────────────────────

export interface Participant {
  role: ExecRole;
  name: string;  // can be empty — just shown as role label
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
  scenario: Scenario;            // full snapshot so report works even if scenario is edited
  participants: Participant[];
  startedAt: string;
  endedAt?: string;
  status: SessionStatus;
  liveInjects: LiveInject[];     // ordered by release time
  notes: FacilitatorNote[];
  report?: GeneratedReport;
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
  | "present";   // fullscreen present window (opened separately)

export interface Settings {
  claudeApiKey: string;
  orgName: string;
  facilitatorName: string;
}
