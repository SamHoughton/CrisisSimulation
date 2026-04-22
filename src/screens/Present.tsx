/**
 * Present.tsx - Standalone full-screen projector view.
 *
 * Opened as a separate browser window by Runner.tsx. Receives all data via
 * BroadcastChannel("crisis-present") - no direct access to the Zustand store.
 *
 * Phases: splash → waiting → briefing → inject (repeating) → ended
 *
 * Features:
 * - Redline splash intro (2.6s animated logo + loading bar)
 * - Scenario briefing with immersive artifacts (ransomware desktop, deepfake video)
 * - Inject display with typed artifacts (ransomware note, tweet, email, SIEM, etc.)
 * - Real-time vote visualisation with animated reveal and winner glow
 * - News ticker, crisis escalation bar, countdown timer, fullscreen toggle
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { ShieldAlert, GitBranch, CheckCircle2, Wifi, Maximize2, Minimize2 } from "lucide-react";
import { cn, ROLE_SHORT, ROLE_COLOUR, SCENARIO_TYPE_LABELS, DIFFICULTY_LABEL } from "@/lib/utils";
import type { ArcRecap, DecisionEntry, Inject, InjectArtifact, Scenario } from "@/types";
import { ScenarioDayStrip } from "@/components/ScenarioDayStrip";
import { useWorldSimulation } from "@/hooks/useWorldSimulation";

// ─── Background ticker headlines (always scrolling) ───────────────────────────
const BG_HEADLINES = [
  "NCSC issues guidance on heightened ransomware threat to critical infrastructure",
  "ICO enforcement action up 42% year-on-year as GDPR scrutiny intensifies",
  "Cyber insurance premiums rise sharply following wave of high-profile incidents",
  "Security researchers warn of new AI-generated phishing and deepfake campaigns",
  "Global ransomware payments exceeded $1.1 billion last year - record high",
  "FCA confirms increase in market surveillance and enforcement activity",
  "Supply chain attacks targeting financial services sector on the rise",
  "Major breach at third-party SaaS provider exposes millions of customer records",
];

// ─── Option colours ───────────────────────────────────────────────────────────
const OPT: Record<string, { bg: string; border: string; text: string; bar: string; winBg: string; winBorder: string }> = {
  A: { bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.35)",  text: "#93c5fd", bar: "#3b82f6",  winBg: "rgba(74,254,145,0.1)",  winBorder: "rgba(74,254,145,0.5)" },
  B: { bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.35)",  text: "#6ee7b7", bar: "#10b981",  winBg: "rgba(74,254,145,0.1)",  winBorder: "rgba(74,254,145,0.5)" },
  C: { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.35)",  text: "#fcd34d", bar: "#f59e0b",  winBg: "rgba(74,254,145,0.1)",  winBorder: "rgba(74,254,145,0.5)" },
  D: { bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.35)",  text: "#d8b4fe", bar: "#a855f7",  winBg: "rgba(74,254,145,0.1)",  winBorder: "rgba(74,254,145,0.5)" },
};
function opt(key: string) { return OPT[key] ?? OPT.A; }

// ─── State types ──────────────────────────────────────────────────────────────

interface VoteRecord { role: string; roleName: string; optionKey: string; }
interface VoteState  { votes: VoteRecord[]; revealed: boolean; winner: string | null; }

type PresentPhase =
  | { phase: "waiting";  scenario: Scenario | null }
  | { phase: "splash";   scenario: Scenario | null }
  | { phase: "briefing"; scenario: Scenario }
  | { phase: "inject";   inject: Inject; num: number }
  | { phase: "adhoc";    body: string }
  | { phase: "paused" }
  | { phase: "ended" };

// ─── Root ─────────────────────────────────────────────────────────────────────

export function Present() {
  const [phase, setPhase]       = useState<PresentPhase>({ phase: "splash", scenario: null });
  const [voteState, setVoteState] = useState<VoteState>({ votes: [], revealed: false, winner: null });
  const [crisisLevel, setCrisisLevel] = useState(0);   // 0–100
  const [headlines, setHeadlines]     = useState<string[]>(BG_HEADLINES);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  /** Persists the current scenario across phase transitions so the day strip stays rendered. */
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const injectCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Holds the scenario received during splash so we can transition correctly when splash ends. */
  const pendingScenarioRef = useRef<Scenario | null>(null);
  /** Queued inject that arrived while briefing was still showing. */
  const pendingInjectRef = useRef<{ inject: Inject; num: number; totalInjects: number } | null>(null);
  /** Story track of the most recently shown inject — used to detect track transitions. */
  const prevStoryTrackRef = useRef<string | undefined>(undefined);
  /** When set, a track-transition banner is shown full-width for 3 seconds. */
  const [trackBanner, setTrackBanner] = useState<string | null>(null);
  const trackBannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track fullscreen state changes (e.g. user presses Escape)
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // BroadcastChannel listener
  useEffect(() => {
    const bc = new BroadcastChannel("crisis-present");
    bc.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "inject") {
        injectCountRef.current += 1;
        const injectNum = injectCountRef.current;
        setCrisisLevel(Math.round((msg.injectNum / msg.totalInjects) * 100));
        if (msg.inject.tickerHeadline) {
          setHeadlines((h) => [msg.inject.tickerHeadline, ...h]);
        }
        // Fire a track-transition banner when the story track changes.
        const incomingTrack: string | undefined = msg.inject.storyTrack;
        if (incomingTrack && incomingTrack !== prevStoryTrackRef.current) {
          if (trackBannerTimerRef.current) clearTimeout(trackBannerTimerRef.current);
          setTrackBanner(incomingTrack);
          trackBannerTimerRef.current = setTimeout(() => setTrackBanner(null), 3000);
        }
        prevStoryTrackRef.current = incomingTrack;
        // If we're still in splash or briefing, queue the inject instead of
        // immediately overriding - let the splash/briefing finish first.
        setPhase((prev) => {
          if (prev.phase === "splash" || prev.phase === "briefing") {
            pendingInjectRef.current = { inject: msg.inject, num: injectNum, totalInjects: msg.totalInjects };
            return prev;
          }
          setVoteState({ votes: [], revealed: false, winner: null });
          return { phase: "inject", inject: msg.inject, num: injectNum };
        });
      } else if (msg.type === "adhoc") {
        setPhase({ phase: "adhoc", body: msg.body });
      } else if (msg.type === "status") {
        // Always stash the scenario so splash → briefing works
        if (msg.scenario) {
          pendingScenarioRef.current = msg.scenario;
          setActiveScenario(msg.scenario);
        }

        if ((msg.status === "active" || msg.status === "setup") && msg.scenario) {
          setPhase((prev) => {
            if (prev.phase === "inject" || prev.phase === "adhoc" || prev.phase === "splash") return prev;
            return msg.scenario.briefing
              ? { phase: "briefing", scenario: msg.scenario }
              : { phase: "waiting", scenario: msg.scenario };
          });
        } else if (msg.status === "paused") {
          setPhase({ phase: "paused" });
        } else if (msg.status === "ended") {
          setPhase({ phase: "ended" });
        } else if (msg.scenario) {
          setPhase({ phase: "waiting", scenario: msg.scenario });
        }
      } else if (msg.type === "vote") {
        setVoteState((prev) => ({
          ...prev,
          votes: [...prev.votes, { role: msg.role, roleName: msg.roleName, optionKey: msg.optionKey }],
        }));
      } else if (msg.type === "vote-reveal") {
        const decisions: DecisionEntry[] = msg.decisions;
        const counts: Record<string, number> = {};
        for (const d of decisions) counts[d.optionKey] = (counts[d.optionKey] ?? 0) + 1;
        const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
        setVoteState({
          votes: decisions.map((d) => ({ role: d.role, roleName: d.name || d.role, optionKey: d.optionKey })),
          revealed: true, winner,
        });
      } else if (msg.type === "timer") {
        if (msg.action === "start") {
          setTimerSeconds(msg.seconds);
          setTimerRunning(true);
        } else if (msg.action === "stop") {
          setTimerRunning(false);
        } else if (msg.action === "reset") {
          setTimerSeconds(msg.seconds);
          setTimerRunning(false);
        }
      }
    };
    // Ask Runner for the current state in case the initial broadcast was missed
    // (Present window mounts asynchronously after Runner calls window.open).
    bc.postMessage({ type: "request-state" });
    // Retry a few times in case Runner isn't listening yet on first mount.
    const retry1 = setTimeout(() => bc.postMessage({ type: "request-state" }), 300);
    const retry2 = setTimeout(() => bc.postMessage({ type: "request-state" }), 800);
    const retry3 = setTimeout(() => bc.postMessage({ type: "request-state" }), 1800);
    return () => {
      clearTimeout(retry1);
      clearTimeout(retry2);
      clearTimeout(retry3);
      bc.close();
    };
  }, []);

  // Timer tick on present screen
  useEffect(() => {
    if (!timerRunning) return;
    timerRef.current = setInterval(() => {
      setTimerSeconds((s) => {
        if (s === null || s <= 1) { setTimerRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  // Auto-advance from briefing to queued inject.
  // Shows briefing for at least 8 seconds, then advances once an inject is queued.
  // If inject arrives before 8s, we hold the briefing until the timer elapses.
  const briefingReadyRef = useRef(false);
  useEffect(() => {
    if (phase.phase !== "briefing") {
      briefingReadyRef.current = false;
      return;
    }

    // After minimum display time, check if an inject is already queued
    const minTimer = setTimeout(() => {
      briefingReadyRef.current = true;
      const pending = pendingInjectRef.current;
      if (pending) {
        pendingInjectRef.current = null;
        setVoteState({ votes: [], revealed: false, winner: null });
        setPhase({ phase: "inject", inject: pending.inject, num: pending.num });
      }
    }, 8000);

    // Also poll in case inject arrives after the min timer
    const poll = setInterval(() => {
      if (!briefingReadyRef.current) return;
      const pending = pendingInjectRef.current;
      if (pending) {
        pendingInjectRef.current = null;
        setVoteState({ votes: [], revealed: false, winner: null });
        setPhase({ phase: "inject", inject: pending.inject, num: pending.num });
        clearInterval(poll);
      }
    }, 500);

    return () => { clearTimeout(minTimer); clearInterval(poll); };
  }, [phase.phase]);

  const timerUrgent = timerSeconds !== null && timerSeconds <= 60 && timerSeconds > 0;
  const timerLabel  = timerSeconds !== null
    ? `${String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:${String(timerSeconds % 60).padStart(2, "0")}`
    : null;

  // Crisis bar colour
  const crisisBarColour = crisisLevel < 35 ? "#4afe91" : crisisLevel < 65 ? "#f59e0b" : "#E82222";

  return (
    <div className="min-h-screen flex flex-col select-none" style={{ background: "#0a0b0d", color: "#e8eaf0" }}>
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="shrink-0" style={{ borderTop: "2px solid #E82222" }}>
        {/* Crisis escalation bar */}
        <div className="h-1.5 w-full" style={{ background: "#111215" }}>
          <div className="h-full crisis-fill" style={{ width: `${crisisLevel}%`, background: crisisBarColour }} />
        </div>
        <div className="flex items-center justify-between px-8 py-3 border-b" style={{ borderColor: "#1e2128" }}>
          <div className="flex items-center gap-4">
            <span className="brand-glow text-lg">REDLINE</span>
            {crisisLevel > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-32 rounded-full" style={{ background: "#1c1f24" }}>
                  <div className="h-full rounded-full crisis-fill" style={{ width: `${crisisLevel}%`, background: crisisBarColour }} />
                </div>
                <span className="text-xs font-mono" style={{ color: crisisBarColour }}>
                  {crisisLevel < 35 ? "ESCALATING" : crisisLevel < 65 ? "CRITICAL" : "SEVERE"}
                </span>
              </div>
            )}
          </div>

          {/* Scenario day strip — centre of header, visible during inject phase */}
          {activeScenario && phase.phase === "inject" && (
            <ScenarioDayStrip
              scenario={activeScenario}
              currentDay={phase.inject.scenarioDay}
              currentTime={phase.inject.scenarioTime}
              size="md"
            />
          )}
          <div className="flex items-center gap-5">
            {timerLabel && (
              <div className="flex items-center gap-2">
                <Wifi className={cn("w-3.5 h-3.5", timerRunning ? "text-rtr-green" : "text-rtr-dim")} />
                <span className={cn("font-mono text-lg font-bold", timerUrgent ? "timer-urgent" : "text-rtr-text")}>
                  {timerLabel}
                </span>
              </div>
            )}
            <LiveClock />
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className="text-rtr-dim hover:text-rtr-muted transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {phase.phase === "waiting"  && <WaitingScreen scenario={phase.scenario} />}
        {phase.phase === "splash"   && <SplashScreen scenario={phase.scenario} onDone={() => {
          const sc = pendingScenarioRef.current;
          setPhase((prev) => {
            // Only transition if still in splash (an inject may have arrived)
            if (prev.phase !== "splash") return prev;
            if (sc?.briefing) return { phase: "briefing", scenario: sc };
            return { phase: "waiting", scenario: sc };
          });
        }} />}
        {phase.phase === "briefing" && <BriefingScreen scenario={phase.scenario} />}
        {phase.phase === "inject"   && (
          <InjectScreen
            inject={phase.inject}
            num={phase.num}
            voteState={voteState}
            timerSeconds={timerSeconds}
            timerRunning={timerRunning}
            timerUrgent={timerUrgent}
            timerLabel={timerLabel}
            onNewHeadline={(h) => setHeadlines((prev) => [h, ...prev])}
          />
        )}
        {phase.phase === "adhoc"    && <AdHocScreen body={phase.body} />}
        {phase.phase === "paused"   && <PausedScreen />}
        {phase.phase === "ended"    && <EndedScreen />}

        {/* ── Story-track transition banner ────────────────────────────────── */}
        {trackBanner && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 animate-fade-in">
            <div className="bg-black/80 border border-amber-500/30 rounded-xl px-10 py-6 text-center max-w-lg backdrop-blur-sm">
              <p className="text-[10px] font-mono font-semibold text-amber-500/60 uppercase tracking-[0.2em] mb-2">Story track</p>
              <p className="text-xl font-semibold text-amber-300 tracking-wide">{trackBanner}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── News ticker ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t py-2 overflow-hidden" style={{ borderColor: "#1e2128", background: "#0d0e10" }}>
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...headlines, ...headlines].map((h, i) => (
              <span key={i} className="inline-flex items-center gap-3 mr-12">
                <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: "#E82222" }}>
                  ■ LIVE
                </span>
                <span className="text-xs font-mono" style={{ color: "#8b8fa8" }}>{h}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Live clock ───────────────────────────────────────────────────────────────

function LiveClock() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="text-xs font-mono" style={{ color: "#4a4f65" }}>{time}</span>;
}

// ─── Splash screen ───────────────────────────────────────────────────────────

function SplashScreen({ scenario, onDone }: { scenario: Scenario | null; onDone: () => void }) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    // Empty deps: run once on mount only. Use ref so we always call the latest callback
    // without adding it as a dependency (which would reset the timer on every parent render).
    const t = setTimeout(() => onDoneRef.current(), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "#080a0d" }}>

      {/* Dot-grid texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(232,34,34,0.12) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
      }} />

      {/* ECG mark */}
      <div className="relative mb-8">
        <svg viewBox="0 0 120 48" className="w-40 h-16" fill="none">
          <line x1="0"   y1="36" x2="34"  y2="36" stroke="#E82222" strokeWidth="2.5" strokeLinecap="round" />
          <polyline points="34,36 52,6 70,36" stroke="#E82222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="70"  y1="36" x2="120" y2="36" stroke="#E82222" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="52" cy="6" r="4" fill="#E82222" />
        </svg>
        {/* Bloom beneath the ECG */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-6 rounded-full blur-xl pointer-events-none"
          style={{ background: "rgba(232,34,34,0.35)" }} />
      </div>

      {/* Wordmark */}
      <p className="brand-glow text-7xl mb-2 tracking-wider" style={{ textShadow: "0 0 60px rgba(232,34,34,0.2)" }}>
        REDLINE
      </p>
      <p className="text-[9px] tracking-[0.55em] uppercase mb-10"
        style={{ color: "rgba(255,255,255,0.22)", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", letterSpacing: "0.55em" }}>
        CRISIS SIMULATION PLATFORM
      </p>

      {/* Scenario name — plain, no pill box */}
      {scenario && (
        <p className="text-sm mb-10 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
          {scenario.title}
        </p>
      )}

      {/* Progress bar — pinned to screen bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "#111318" }}>
        <div className="h-full" style={{
          background: "linear-gradient(90deg, #991111, #E82222, #ff5c5c)",
          animation: "splash-fill 2.4s ease forwards",
        }} />
      </div>
    </div>
  );
}

// ─── Waiting screen ───────────────────────────────────────────────────────────

function WaitingScreen({ scenario }: { scenario: Scenario | null }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
        style={{ background: "rgba(232,34,34,0.1)", border: "1px solid rgba(232,34,34,0.25)" }}>
        <ShieldAlert className="w-10 h-10" style={{ color: "#E82222" }} />
      </div>
      <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.03em" }}>{scenario?.title ?? "REDLINE"}</h1>
      {scenario && (
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm" style={{ color: "#8b8fa8" }}>{SCENARIO_TYPE_LABELS[scenario.type]}</span>
          <span style={{ color: "#2a2e3a" }}>·</span>
          <span className="text-sm" style={{ color: "#8b8fa8" }}>{DIFFICULTY_LABEL[scenario.difficulty]}</span>
          <span style={{ color: "#2a2e3a" }}>·</span>
          <span className="text-sm" style={{ color: "#8b8fa8" }}>{scenario.injects.length} injects</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm" style={{ color: "#4a4f65" }}>
        <span className="animate-pulse">●</span> Waiting for facilitator to begin…
      </div>
    </div>
  );
}

// ─── Briefing screen ──────────────────────────────────────────────────────────

function BriefingScreen({ scenario }: { scenario: Scenario }) {
  const hasArtifact = (["RANSOMWARE", "SOCIAL_MEDIA_CRISIS", "SUPPLY_CHAIN", "INFRASTRUCTURE_OUTAGE"] as const).includes(scenario.type as any);

  return (
    <div className="h-full flex items-center justify-center px-10 py-8 overflow-auto">
      <div className={cn("w-full max-w-7xl flex gap-10 items-center", hasArtifact ? "flex-row" : "flex-col max-w-4xl")}>

        {/* ── Left: text ── */}
        <div className={cn("flex flex-col", hasArtifact ? "flex-1 min-w-0" : "items-center text-center w-full")}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3 font-mono" style={{ color: "#4afe91" }}>
            Scenario Briefing
          </p>
          <h1 className={cn("font-bold mb-6 leading-tight", hasArtifact ? "text-4xl" : "text-5xl")}
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.03em" }}>
            {scenario.title}
          </h1>
          <div className="rounded-2xl p-7 mb-6 w-full" style={{ background: "#15171a", border: "1px solid #1e2128" }}>
            <p className={cn("leading-relaxed", hasArtifact ? "text-base" : "text-xl text-center")} style={{ color: "#c5c8d8" }}>
              {scenario.briefing}
            </p>
          </div>
          {scenario.roles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {scenario.roles.map((r) => (
                <span key={r} className={`text-xs font-bold px-3 py-1.5 rounded-lg ${ROLE_COLOUR[r]}`}>
                  {ROLE_SHORT[r]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: scenario artifact ── */}
        {scenario.type === "RANSOMWARE"           && <RansomwareBriefingArtifact />}
        {scenario.type === "SOCIAL_MEDIA_CRISIS"  && <DeepfakeBriefingArtifact />}
        {scenario.type === "SUPPLY_CHAIN"         && <SupplyChainBriefingArtifact />}
        {scenario.type === "INFRASTRUCTURE_OUTAGE" && <InfraOutageBriefingArtifact />}
      </div>
    </div>
  );
}

// Ransomware briefing - fake encrypted file explorer
function RansomwareBriefingArtifact() {
  const files = [
    { name: "Q4_Financial_Report_2024.xlsx.locked",    size: "2.4 MB",  icon: "📊" },
    { name: "CustomerDatabase_Export.csv.locked",       size: "847 MB",  icon: "🗃️" },
    { name: "CEO_Strategy_Presentation.pptx.locked",    size: "18.2 MB", icon: "📑" },
    { name: "HR_Payroll_November.xlsx.locked",          size: "3.1 MB",  icon: "💰" },
    { name: "MFS_CustomerRecords_2023.db.locked",       size: "2.1 GB",  icon: "🔒" },
    { name: "AuditTrail_SOX_Compliance.pdf.locked",     size: "44 MB",   icon: "📋" },
    { name: "BackupArchive_Full_20241105.tar.locked",   size: "12.8 GB", icon: "🔒" },
    { name: "ITInfrastructure_Diagram.vsd.locked",      size: "6.7 MB",  icon: "🔒" },
  ];

  return (
    <div className="w-[480px] shrink-0 rounded-xl overflow-hidden font-mono text-xs shadow-2xl"
      style={{ border: "1px solid rgba(232,34,34,0.4)", boxShadow: "0 0 60px rgba(232,34,34,0.12)" }}>

      {/* Windows title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#1a0000", borderBottom: "1px solid #330000" }}>
        <span className="w-3 h-3 rounded-full bg-red-600" />
        <span className="w-3 h-3 rounded-full" style={{ background: "#333" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#333" }} />
        <span className="ml-3 text-xs" style={{ color: "#cc2200" }}>C:\Users\MFS_Admin\Documents - File Explorer</span>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2 flex items-center gap-4 text-xs" style={{ background: "#110000", borderBottom: "1px solid #220000", color: "#662200" }}>
        <span>File</span><span>Edit</span><span>View</span>
        <span className="ml-auto" style={{ color: "#441100" }}>Sort: Name ▼</span>
      </div>

      {/* File list */}
      <div style={{ background: "#0a0000" }}>
        {files.map((f, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5"
            style={{ borderBottom: "1px solid #150000", background: i % 2 === 0 ? "#0a0000" : "#0d0000" }}>
            <span className="text-base shrink-0">{f.icon}</span>
            <span className="flex-1 truncate" style={{ color: "#cc3300" }}>{f.name}</span>
            <span className="shrink-0 text-xs" style={{ color: "#441100" }}>{f.size}</span>
          </div>
        ))}
      </div>

      {/* Ransom popup overlay */}
      <div className="px-4 py-4" style={{ background: "#0d0000", borderTop: "2px solid #E82222" }}>
        <div className="rounded-lg p-4" style={{ background: "#150000", border: "1px solid rgba(232,34,34,0.5)" }}>
          <p className="text-sm font-bold text-center mb-2" style={{ color: "#ff2200" }}>
            ⚠ YOUR FILES HAVE BEEN ENCRYPTED ⚠
          </p>
          <p className="text-xs text-center leading-relaxed" style={{ color: "#882200" }}>
            All data on this device is encrypted with AES-256.<br />
            Contact: <span style={{ color: "#ff4400" }}>support@blackcat-recovery.onion</span><br />
            <span className="font-bold" style={{ color: "#ff2200" }}>Deadline: 72 hours · Demand: $4.8M BTC</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Deepfake briefing - blurred viral video frame
function DeepfakeBriefingArtifact() {
  return (
    <div className="w-[460px] shrink-0 rounded-xl overflow-hidden shadow-2xl"
      style={{ border: "1px solid rgba(139,92,246,0.4)", boxShadow: "0 0 60px rgba(139,92,246,0.12)" }}>

      {/* "X / Twitter" chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 text-xs font-mono"
        style={{ background: "#0a0a0f", borderBottom: "1px solid #1a1a2e" }}>
        <div className="flex items-center gap-2">
          <span className="font-bold" style={{ color: "#e8eaf0" }}>✕</span>
          <span style={{ color: "#6b7280" }}>@ApexLeaks · 47s video · trending</span>
        </div>
        <div className="flex items-center gap-3" style={{ color: "#6b7280" }}>
          <span>🔁 <span style={{ color: "#e8eaf0" }}>284K</span></span>
          <span>♥ <span style={{ color: "#E82222" }}>891K</span></span>
        </div>
      </div>

      {/* Video frame */}
      <div className="relative" style={{ background: "#080810", aspectRatio: "16/9" }}>
        {/* Blurred "video" using CSS gradients to simulate a blurred face/room */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 40% 55% at 48% 42%, #3a2a5a 0%, #1a1035 40%, #0d0820 100%)",
          filter: "blur(18px)",
        }} />
        {/* Conference room suggestion */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(8,8,16,0.4) 100%)",
        }} />
        {/* Face silhouette */}
        <div className="absolute" style={{ top: "15%", left: "50%", transform: "translateX(-50%)", filter: "blur(14px)", opacity: 0.7 }}>
          <div className="w-20 h-20 rounded-full" style={{ background: "#5a3a7a" }} />
          <div className="w-28 h-16 rounded-t-full mx-auto mt-1" style={{ background: "#4a2a6a", marginLeft: "-16px" }} />
        </div>
        {/* APEX DYNAMICS watermark */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold font-mono"
          style={{ background: "rgba(0,0,0,0.6)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)" }}>
          APEX DYNAMICS - ALL STAFF
        </div>
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.65)", border: "2px solid rgba(255,255,255,0.3)" }}>
            <div className="ml-1" style={{ width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: "20px solid rgba(255,255,255,0.9)" }} />
          </div>
        </div>
        {/* Authenticity warning banner */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3"
          style={{ background: "linear-gradient(transparent, rgba(220,38,38,0.85))" }}>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-xs font-mono">⚠ AUTHENTICITY UNVERIFIED</span>
            <span className="ml-auto text-xs font-mono" style={{ color: "rgba(255,255,255,0.7)" }}>06:04 AM</span>
          </div>
        </div>
      </div>

      {/* Tweet body */}
      <div className="px-4 py-4" style={{ background: "#0a0a0f" }}>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "#e8eaf0" }}>
          "I have decided to terminate 50% of our workforce immediately. These people are a liability. This company needs to be cleansed."
        </p>
        <p className="text-xs" style={{ color: "#6b7280" }}>
          Posted via web · <span style={{ color: "#8b5cf6" }}>⚡ Trending: #ApexCEO #AIDeepfake #ApexDynamics</span>
        </p>
      </div>
    </div>
  );
}

// Supply chain briefing - vendor integration dashboard
function SupplyChainBriefingArtifact() {
  const vendors = [
    { name: "PeopleCore",         status: "CRITICAL",  tenants: 140, records: "620K", risk: "Unaudited" },
    { name: "CloudVault Backup",  status: "OK",        tenants: 1,   records: "-",    risk: "Audited" },
    { name: "SecurePay Gateway",  status: "OK",        tenants: 1,   records: "-",    risk: "Audited" },
    { name: "DataSync Analytics", status: "OK",        tenants: 1,   records: "-",    risk: "Pending" },
  ];

  return (
    <div className="w-[480px] shrink-0 rounded-xl overflow-hidden font-mono text-xs shadow-2xl"
      style={{ border: "1px solid rgba(232,34,34,0.4)", boxShadow: "0 0 60px rgba(232,34,34,0.12)" }}>

      {/* Dashboard title bar */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: "#0a0f0a", borderBottom: "1px solid #1a2e1a" }}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span style={{ color: "#4afe91" }}>Vendor Risk Dashboard</span>
        </div>
        <span style={{ color: "#4a5a4a" }}>07:22 UTC</span>
      </div>

      {/* Alert banner */}
      <div className="px-4 py-3" style={{ background: "#1a0000", borderBottom: "1px solid #330000" }}>
        <div className="flex items-center gap-2">
          <span style={{ color: "#ff4444" }}>⚠</span>
          <span style={{ color: "#ff6644" }}>VENDOR BREACH NOTIFICATION RECEIVED - TLP:AMBER</span>
        </div>
      </div>

      {/* Vendor list */}
      <div style={{ background: "#080a08" }}>
        <div className="flex items-center gap-3 px-4 py-2" style={{ borderBottom: "1px solid #1a2e1a", color: "#3a5a3a" }}>
          <span className="flex-1">Sub-Processor</span>
          <span className="w-16 text-center">Status</span>
          <span className="w-14 text-right">Records</span>
          <span className="w-20 text-right">Audit</span>
        </div>
        {vendors.map((v, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3"
            style={{
              borderBottom: "1px solid #0f1a0f",
              background: v.status === "CRITICAL" ? "rgba(232,34,34,0.06)" : "transparent",
            }}>
            <span className="flex-1" style={{ color: v.status === "CRITICAL" ? "#ff4444" : "#8ba88b" }}>
              {v.name}
            </span>
            <span className="w-16 text-center text-xs font-bold px-1.5 py-0.5 rounded"
              style={{
                color: v.status === "CRITICAL" ? "#ff2222" : "#4afe91",
                background: v.status === "CRITICAL" ? "rgba(232,34,34,0.15)" : "rgba(74,254,145,0.08)",
              }}>
              {v.status}
            </span>
            <span className="w-14 text-right" style={{ color: v.status === "CRITICAL" ? "#ff6644" : "#4a5a4a" }}>
              {v.records}
            </span>
            <span className="w-20 text-right" style={{
              color: v.risk === "Unaudited" ? "#ff4444" : v.risk === "Pending" ? "#f59e0b" : "#4afe91",
            }}>
              {v.risk}
            </span>
          </div>
        ))}
      </div>

      {/* DPIA warning */}
      <div className="px-4 py-3" style={{ background: "#0d0000", borderTop: "2px solid #E82222" }}>
        <div className="rounded-lg p-3" style={{ background: "#150000", border: "1px solid rgba(232,34,34,0.5)" }}>
          <p className="text-xs text-center" style={{ color: "#cc4422" }}>
            ⚠ DPIA INCOMPLETE - PeopleCore sub-processor audit never conducted
          </p>
          <p className="text-xs text-center mt-1" style={{ color: "#663322" }}>
            140 client tenants · 620,000 records · incl. NHS trust data
          </p>
        </div>
      </div>
    </div>
  );
}

// Infrastructure outage briefing - NexCore CORE-DB-CLUSTER-01 monitoring console
function InfraOutageBriefingArtifact() {
  const nodes = [
    { id: "CORE-DB-01", role: "PRIMARY",   dc: "LON-DC1", cpu: "98%", mem: "99%", status: "CRITICAL" },
    { id: "CORE-DB-02", role: "REPLICA-A", dc: "LON-DC1", cpu: "97%", mem: "98%", status: "CRITICAL" },
    { id: "CORE-DB-03", role: "REPLICA-B", dc: "LON-DC2", cpu: "96%", mem: "99%", status: "CRITICAL" },
  ];
  const services = [
    { name: "Salary Batch Processor",  affected: 47, status: "BLOCKED" },
    { name: "Direct Debit Gateway",    affected: 12, status: "DEGRADED" },
    { name: "CHAPS Settlement Feed",    affected:  8, status: "DEGRADED" },
    { name: "Real-Time Payments API",  affected: 31, status: "BLOCKED" },
  ];

  return (
    <div className="w-[480px] shrink-0 rounded-xl overflow-hidden font-mono text-xs shadow-2xl"
      style={{ border: "1px solid rgba(232,34,34,0.35)", boxShadow: "0 0 60px rgba(232,34,34,0.1)" }}>

      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: "#080c08", borderBottom: "1px solid #1a2a1a" }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span style={{ color: "#4afe91" }}>NexCore Infrastructure Monitor</span>
        </div>
        <span style={{ color: "#3a5a3a" }}>09:00:12 UTC</span>
      </div>

      {/* Cluster alert */}
      <div className="px-4 py-2.5 flex items-center gap-2"
        style={{ background: "#1a0000", borderBottom: "1px solid #330000" }}>
        <span style={{ color: "#ff4444" }}>⚠</span>
        <span style={{ color: "#ff5544" }}>CORE-DB-CLUSTER-01 - ALL NODES CRITICAL</span>
      </div>

      {/* Node table */}
      <div style={{ background: "#06090a" }}>
        <div className="grid grid-cols-5 gap-2 px-4 py-1.5"
          style={{ borderBottom: "1px solid #151e15", color: "#2a4a2a" }}>
          <span className="col-span-2">Node</span><span>DC</span><span>CPU</span><span>Mem</span>
        </div>
        {nodes.map((n) => (
          <div key={n.id} className="grid grid-cols-5 gap-2 px-4 py-2.5 items-center"
            style={{ borderBottom: "1px solid #0d140d", background: "rgba(232,34,34,0.05)" }}>
            <div className="col-span-2">
              <p style={{ color: "#ff4444" }}>{n.id}</p>
              <p style={{ color: "#3a5a3a" }}>{n.role}</p>
            </div>
            <span style={{ color: "#4a6a4a" }}>{n.dc}</span>
            <span style={{ color: "#ff6644" }}>{n.cpu}</span>
            <span style={{ color: "#ff6644" }}>{n.mem}</span>
          </div>
        ))}
      </div>

      {/* Dependent services */}
      <div className="px-4 py-2.5" style={{ background: "#050908", borderTop: "1px solid #1a2a1a" }}>
        <p className="mb-2" style={{ color: "#2a4a2a" }}>Dependent Services</p>
        {services.map((s) => (
          <div key={s.name} className="flex items-center justify-between py-1.5"
            style={{ borderBottom: "1px solid #0d150d" }}>
            <span style={{ color: s.status === "BLOCKED" ? "#ff4444" : "#cc8833" }}>{s.name}</span>
            <div className="flex items-center gap-2">
              <span style={{ color: "#4a6a4a" }}>{s.affected} svc</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                style={{
                  color:       s.status === "BLOCKED" ? "#ff2222" : "#cc8833",
                  background:  s.status === "BLOCKED" ? "rgba(232,34,34,0.15)" : "rgba(204,136,51,0.12)",
                  border:      `1px solid ${s.status === "BLOCKED" ? "rgba(232,34,34,0.3)" : "rgba(204,136,51,0.25)"}`,
                }}>
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom alert */}
      <div className="px-4 py-3" style={{ background: "#0d0000", borderTop: "2px solid #E82222" }}>
        <div className="rounded-lg p-3" style={{ background: "#150000", border: "1px solid rgba(232,34,34,0.5)" }}>
          <p className="text-center" style={{ color: "#cc4422" }}>
            ⚠ SALARY BATCH DUE 09:00 - 47 SERVICES BLOCKED
          </p>
          <p className="text-center mt-1" style={{ color: "#663322" }}>
            1.2M employee payments · £4.8B settlement value · SLA breach in 00:00
          </p>
        </div>
      </div>
    </div>
  );
}

// Artifact types where inject.body is scene-setting narration that should appear
// ABOVE the artifact frame rather than inside it.
const DASHBOARD_ARTIFACT_TYPES = ["stock_chart", "tv_broadcast", "slack_thread", "regulator_portal", "board_portal", "siem_alert", "news_headline"] as const;
type DashboardArtifactType = typeof DASHBOARD_ARTIFACT_TYPES[number];
// Allow includes() to accept any ArtifactType without a TS error.
const dashboardIncludes = (type: string): type is DashboardArtifactType =>
  (DASHBOARD_ARTIFACT_TYPES as readonly string[]).includes(type);

// ─── Inject screen ────────────────────────────────────────────────────────────

function InjectScreen({ inject, num, voteState, timerSeconds, timerRunning, timerUrgent, timerLabel, onNewHeadline }: {
  inject: Inject; num: number;
  voteState: VoteState;
  timerSeconds: number | null; timerRunning: boolean; timerUrgent: boolean; timerLabel: string | null;
  onNewHeadline?: (h: string) => void;
}) {
  const showVoting = inject.isDecisionPoint && inject.decisionOptions.length > 0;

  // Whether to show the large timer: running, or paused with time remaining
  const showTimer = timerLabel !== null && (timerRunning || (timerSeconds !== null && timerSeconds > 0));

  // ─── Live world simulation state ─────────────────────────────────────────
  const [liveStockDelta, setLiveStockDelta] = useState(0);
  const [liveSlackMessages, setLiveSlackMessages] = useState<Array<{ author: string; time: string; text: string }>>([]);

  // Reset live state when inject changes
  useEffect(() => {
    setLiveStockDelta(0);
    setLiveSlackMessages([]);
  }, [inject.id]);

  const handleStockTick = useCallback((delta: number) => {
    setLiveStockDelta((prev) => prev + delta);
  }, []);

  const handleSlackMessage = useCallback((content: string, author?: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setLiveSlackMessages((prev) => [...prev, { author: author ?? "System", time: timeStr, text: content }]);
  }, []);

  const handleTickerHeadline = useCallback((content: string) => {
    onNewHeadline?.(content);
  }, [onNewHeadline]);

  useWorldSimulation(inject.id, inject.worldEvents, {
    onStockTick: handleStockTick,
    onSlackMessage: handleSlackMessage,
    onTickerHeadline: handleTickerHeadline,
  });

  return (
    <div className="flex flex-col px-10 py-8 max-w-7xl mx-auto w-full inject-arrive overflow-y-auto" style={{ minHeight: "100%" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#E82222" }} />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: "#E82222" }} />
            </span>
            {inject.scenarioTime ? (
              <span className="font-mono" style={{ color: "#E82222" }}>
                <span className="text-lg font-black tracking-tight">{inject.scenarioTime}</span>
                {inject.scenarioDay !== undefined && (
                  <span className="text-sm font-normal ml-1.5 opacity-70">Day {inject.scenarioDay}</span>
                )}
              </span>
            ) : (
              <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: "#E82222" }}>
                Inject {num}
              </span>
            )}
            {inject.storyTrack && (
              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ color: "#fbbf24", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
                {inject.storyTrack}
              </span>
            )}
          </div>
        </div>

        {/* Large countdown timer: visible to participants on the projector */}
        {showTimer && (
          <div className="flex flex-col items-center gap-0.5">
            <span
              className={cn(
                "font-mono font-black leading-none tabular-nums",
                /* Urgent (≤60 s): pulsing red. Paused: dimmed. Normal: green. */
                timerUrgent
                  ? "timer-urgent text-5xl"
                  : timerRunning
                    ? "text-rtr-green text-5xl"
                    : "text-5xl"
              )}
              style={!timerUrgent && !timerRunning ? { color: "#4a4f65" } : undefined}
            >
              {timerLabel}
            </span>
            {/* Paused indicator: shown only when timer has time remaining but is not running */}
            {!timerRunning && (
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: "#4a4f65" }}>
                paused
              </span>
            )}
          </div>
        )}

        <span className="text-xs font-semibold px-3 py-1 rounded-full font-mono"
          style={{ color: "#8b8fa8", background: "#1c1f24", border: "1px solid #2a2e3a" }}>
          Inject {num}
        </span>
      </div>

      {/* Body layout */}
      <div className={cn("flex gap-8", showVoting ? "items-start" : "flex-col")}>
        {/* Left / main: artifact */}
        <div className={cn("flex flex-col gap-5", showVoting ? "flex-1 min-w-0" : "w-full")}>
          <h2 className="text-4xl font-bold shrink-0 leading-tight" style={{ color: "#e8eaf0", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>{inject.title}</h2>
          {inject.arcRecap && <ArcRecapCard data={inject.arcRecap} />}
          {/* inject.body is scene-setting narration — show above the artifact for all types
              except: ransomware_note (body IS the note text), internal_memo (body IS the memo
              content in existing scenarios), news_headline (body is rendered inside the card),
              and email without an explicit emailBody (body is the email text rendered inside the card). */}
          {inject.artifact &&
            inject.artifact.type !== "ransomware_note" &&
            inject.artifact.type !== "internal_memo" &&
            inject.artifact.type !== "news_headline" &&
            !(inject.artifact.type === "email" && !inject.artifact.emailBody) && (
            <p className="text-xl leading-relaxed shrink-0" style={{ color: "#c5c8d8" }}>{inject.body}</p>
          )}
          <ArtifactDisplay inject={inject} liveStockDelta={liveStockDelta} liveSlackMessages={liveSlackMessages} />
          {inject.targetRoles.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono" style={{ color: "#4a4f65" }}>Directed at:</span>
              {inject.targetRoles.map((r) => (
                <span key={r} className={`text-xs font-bold px-2 py-0.5 rounded ${ROLE_COLOUR[r]}`}>
                  {ROLE_SHORT[r]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: voting */}
        {showVoting && (
          <VotingDisplay inject={inject} voteState={voteState} />
        )}
      </div>
    </div>
  );
}

// ─── Arc recap card ───────────────────────────────────────────────────────────

function ArcRecapCard({ data }: { data: ArcRecap }) {
  const { entries, score } = data;
  if (entries.length === 0) return null;

  const rankColour = (rank?: number) => {
    if (rank === 1) return "#22c55e";
    if (rank === 2) return "#f59e0b";
    if (rank === 3) return "#f97316";
    if (rank === 4) return "#E82222";
    return "#4a4f65"; // unranked
  };

  const scoreTheme = (s: number) => {
    if (s <= 1.5) return { label: "EXEMPLARY",  colour: "#22c55e", bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.25)"   };
    if (s <= 2.5) return { label: "COMPETENT",  colour: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)"  };
    if (s <= 3.5) return { label: "MARGINAL",   colour: "#f97316", bg: "rgba(249,115,22,0.08)",  border: "rgba(249,115,22,0.25)"  };
    return           { label: "INADEQUATE", colour: "#E82222",  bg: "rgba(232,34,34,0.08)",    border: "rgba(232,34,34,0.25)"   };
  };

  const theme = score !== null ? scoreTheme(score) : null;

  return (
    <div className="rounded-xl overflow-hidden shrink-0"
      style={{ background: "#080a0e", border: "1px solid #1a1e28" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3"
        style={{ borderBottom: "1px solid #1a1e28", background: "#0a0c12" }}>
        <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#E82222" }}>
          Your Arc
        </span>
        {theme && score !== null && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono" style={{ color: "#3a3f55" }}>COMPOUND SCORE</span>
            <span className="text-sm font-mono font-bold tabular-nums" style={{ color: theme.colour }}>
              {score.toFixed(2)}<span className="text-xs font-normal" style={{ color: "#3a3f55" }}>/4.0</span>
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold tracking-widest uppercase"
              style={{ background: theme.bg, border: `1px solid ${theme.border}`, color: theme.colour }}>
              {theme.label}
            </span>
          </div>
        )}
      </div>

      {/* Decision entries */}
      <div className="px-6 py-4 grid gap-3">
        {entries.map((entry, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="font-mono text-xs shrink-0 w-4 text-right mt-0.5"
              style={{ color: "#2e3348" }}>{i + 1}</span>
            <span className="w-2 h-2 rounded-full shrink-0 mt-1.5"
              style={{ background: rankColour(entry.rank) }} />
            <p className="text-sm leading-snug">
              <span style={{ color: "#555d7a" }}>{entry.label} </span>
              <span className="font-semibold" style={{ color: "#c5c8d8" }}>{entry.fragment}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Artifact display ─────────────────────────────────────────────────────────

function ArtifactDisplay({
  inject,
  liveStockDelta = 0,
  liveSlackMessages = [],
}: {
  inject: Inject;
  liveStockDelta?: number;
  liveSlackMessages?: Array<{ author: string; time: string; text: string }>;
}) {
  const art = inject.artifact;

  if (!art || art.type === "default") {
    return (
      <div className="rounded-2xl p-8" style={{ background: "#15171a", border: "1px solid #1e2128" }}>
        {inject.imageUrl && (
          <img src={inject.imageUrl} alt="" className="w-full h-40 object-cover rounded-xl mb-5 opacity-70" />
        )}
        <p className="text-xl leading-relaxed" style={{ color: "#c5c8d8" }}>{inject.body}</p>
      </div>
    );
  }

  if (art.type === "ransomware_note")  return <RansomwareNote   inject={inject} artifact={art} />;
  if (art.type === "siem_alert")      return <SiemAlert         inject={inject} artifact={art} />;
  if (art.type === "tweet")           return <TweetCard          inject={inject} artifact={art} />;
  if (art.type === "email")           return <EmailCard          inject={inject} artifact={art} />;
  if (art.type === "legal_letter")    return <LegalLetter        inject={inject} artifact={art} />;
  if (art.type === "news_headline")   return <NewsHeadline       inject={inject} />;
  if (art.type === "dark_web_listing") return <DarkWebListing   inject={inject} artifact={art} />;
  if (art.type === "stock_chart")     return <StockChart         inject={inject} artifact={art} liveStockDelta={liveStockDelta} />;
  if (art.type === "slack_thread")    return <SlackThread        inject={inject} artifact={art} liveMessages={liveSlackMessages} />;
  if (art.type === "tv_broadcast")    return <TvBroadcast        inject={inject} artifact={art} />;
  if (art.type === "voicemail")       return <Voicemail          inject={inject} artifact={art} />;
  if (art.type === "internal_memo")   return <InternalMemo       inject={inject} artifact={art} />;
  if (art.type === "sms_thread")      return <SmsThread          inject={inject} artifact={art} />;
  if (art.type === "regulator_portal") return <RegulatorPortal  inject={inject} artifact={art} />;
  if (art.type === "negotiation_chat") return <NegotiationChat  inject={inject} artifact={art} />;
  if (art.type === "linkedin_post")   return <LinkedInPost       inject={inject} artifact={art} />;
  if (art.type === "board_portal")    return <BoardPortal        inject={inject} artifact={art} />;

  return (
    <div className="rounded-2xl p-8" style={{ background: "#15171a", border: "1px solid #1e2128" }}>
      <p className="text-xl leading-relaxed" style={{ color: "#c5c8d8" }}>{inject.body}</p>
    </div>
  );
}

// ── Ransomware note ────────────────────────────────────────────────────────────

function RansomwareNote({ inject, artifact: art }: { inject: Inject; artifact: InjectArtifact }) {
  return (
    <div className="rounded-xl overflow-hidden font-mono"
      style={{ background: "#050505", border: "1px solid #E82222", boxShadow: "0 0 30px rgba(232,34,34,0.15)" }}>
      {/* Title bar */}
      <div className="px-4 py-2 flex items-center gap-2" style={{ background: "#0f0000", borderBottom: "1px solid #E82222" }}>
        <span className="w-3 h-3 rounded-full bg-red-600" />
        <span className="w-3 h-3 rounded-full bg-yellow-600" />
        <span className="w-3 h-3 rounded-full bg-green-900" />
        <span className="text-xs ml-2" style={{ color: "#E82222" }}>README_DECRYPT.txt</span>
      </div>
      <div className="p-7">
        <p className="text-2xl font-bold mb-6 text-center" style={{ color: "#E82222" }}>
          !!! YOUR FILES HAVE BEEN ENCRYPTED !!!
        </p>
        <div className="text-sm leading-relaxed space-y-3 mb-8" style={{ color: "#cc3333" }}>
          <p>{inject.body}</p>
        </div>
        <div className="rounded-lg p-4 mb-5 space-y-2" style={{ background: "#0a0a0a", border: "1px solid #330000" }}>
          {art.ransomAmount && (
            <div className="flex justify-between">
              <span style={{ color: "#E82222" }}>DEMAND:</span>
              <span style={{ color: "#ff4444" }}>{art.ransomAmount} Bitcoin</span>
            </div>
          )}
          {art.ransomDeadlineHours && (
            <div className="flex justify-between">
              <span style={{ color: "#E82222" }}>DEADLINE:</span>
              <span style={{ color: "#ff4444" }}>{art.ransomDeadlineHours} HOURS</span>
            </div>
          )}
          {art.ransomWalletAddress && (
            <div>
              <span style={{ color: "#E82222" }}>WALLET:</span>
              <p className="text-xs mt-1 break-all" style={{ color: "#ff6666" }}>{art.ransomWalletAddress}</p>
            </div>
          )}
        </div>
        <p className="text-xs text-center" style={{ color: "#660000" }}>
          After the deadline, all data will be published. Do not contact law enforcement.
        </p>
      </div>
    </div>
  );
}

// ── SIEM alert ─────────────────────────────────────────────────────────────────

function SiemAlert({ inject, artifact: art }: { inject: Inject; artifact: InjectArtifact }) {
  const sevColour = art.siemSeverity === "CRITICAL" ? "#E82222" : art.siemSeverity === "HIGH" ? "#f59e0b" : "#4afe91";
  return (
    <div className="rounded-xl font-mono overflow-hidden"
      style={{ background: "#060809", border: `1px solid ${sevColour}40`, boxShadow: `0 0 20px ${sevColour}15` }}>
      {/* Header bar */}
      <div className="px-5 py-3 flex items-center justify-between"
        style={{ background: `${sevColour}12`, borderBottom: `1px solid ${sevColour}40` }}>
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: sevColour }} />
            <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: sevColour }} />
          </span>
          <span className="text-sm font-bold" style={{ color: sevColour }}>
            {art.siemSeverity ?? "CRITICAL"} SECURITY ALERT
          </span>
        </div>
        <span className="text-xs" style={{ color: "#4a4f65" }}>{new Date().toLocaleTimeString()} UTC</span>
      </div>
      <div className="p-6 space-y-4">
        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mb-4">
          {art.siemAlertId && (
            <><span style={{ color: "#4a4f65" }}>Alert ID</span><span style={{ color: "#e8eaf0" }}>{art.siemAlertId}</span></>
          )}
          {art.siemEventType && (
            <><span style={{ color: "#4a4f65" }}>Event Type</span><span style={{ color: sevColour }}>{art.siemEventType}</span></>
          )}
          {art.siemSourceIp && (
            <><span style={{ color: "#4a4f65" }}>Source IP</span><span style={{ color: "#e8eaf0" }}>{art.siemSourceIp}</span></>
          )}
          <><span style={{ color: "#4a4f65" }}>Severity</span>
          <span className="font-bold" style={{ color: sevColour }}>{art.siemSeverity ?? "CRITICAL"}</span></>
        </div>
        {/* Status line */}
        <div className="rounded-lg px-4 py-3 text-xs font-mono flex items-center gap-3" style={{ background: "#0d0e10", border: "1px solid #1e2128" }}>
          <span style={{ color: sevColour }}>●</span>
          <span style={{ color: "#4a4f65" }}>ALERT ACTIVE</span>
          <span className="ml-auto" style={{ color: "#4a4f65" }}>Awaiting analyst response</span>
        </div>
        {/* Footer */}
        <div className="flex items-center gap-2 text-xs" style={{ color: "#4a4f65" }}>
          <span className="px-2 py-0.5 rounded" style={{ background: `${sevColour}20`, color: sevColour }}>
            AUTOMATED RESPONSE TRIGGERED
          </span>
          <span>Network isolation protocols engaged</span>
        </div>
      </div>
    </div>
  );
}

// ── Tweet card ─────────────────────────────────────────────────────────────────

function TweetCard({ inject, artifact: art }: { inject: Inject; artifact: InjectArtifact }) {
  const [likes, setLikes] = useState(art.tweetLikes ?? 18_400);
  const [rts,   setRts]   = useState(art.tweetRetweets ?? 7_200);
  const [showMore, setShowMore] = useState(false);

  // Slowly increment engagement for drama
  useEffect(() => {
    const id = setInterval(() => {
      setLikes((l) => l + Math.floor(Math.random() * 120) + 30);
      setRts((r)   => r + Math.floor(Math.random() * 50)  + 10);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const handle = art.tweetHandle ?? "@Breaking_Alert";
  const name   = art.tweetDisplayName ?? handle.replace("@", "");
  const initials = name.slice(0, 2).toUpperCase();

  function fmtNum(n: number) {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#16181c", border: "1px solid #2f3336" }}>
      <div className="p-6">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "#1d9bf0", color: "#fff" }}>
            {initials}
          </div>
          <div>
            <p className="font-bold" style={{ color: "#e8eaf0" }}>{name}</p>
            <p className="text-sm" style={{ color: "#8b8fa8" }}>{handle}</p>
          </div>
          {/* X logo */}
          <div className="ml-auto">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#e8eaf0">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </div>
        {/* Tweet body */}
        {(() => {
          const LIMIT = 280;
          const text = inject.body;
          const truncated = text.length > LIMIT && !showMore;
          return (
            <>
              <p className="text-xl leading-relaxed mb-2" style={{ color: "#e8eaf0" }}>
                {truncated ? text.slice(0, LIMIT) + "…" : text}
              </p>
              {text.length > LIMIT && (
                <button
                  onClick={() => setShowMore((v) => !v)}
                  className="text-sm mb-3 hover:underline"
                  style={{ color: "#1d9bf0" }}
                >
                  {showMore ? "Show less" : `Show more (${text.length - LIMIT} more chars)`}
                </button>
              )}
            </>
          );
        })()}
        {/* Timestamp */}
        <p className="text-sm mb-4" style={{ color: "#8b8fa8" }}>
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {new Date().toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })}
        </p>
        {/* Engagement bar */}
        <div className="flex items-center gap-6 pt-4" style={{ borderTop: "1px solid #2f3336" }}>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#8b8fa8" strokeWidth="2">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span className="text-sm font-bold vote-count" style={{ color: "#e8eaf0" }}>{fmtNum(rts)}</span>
            <span className="text-sm" style={{ color: "#8b8fa8" }}>Reposts</span>
          </div>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#E82222">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm font-bold vote-count" style={{ color: "#e8eaf0" }}>{fmtNum(likes)}</span>
            <span className="text-sm" style={{ color: "#8b8fa8" }}>Likes</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: "rgba(232,34,34,0.15)", color: "#E82222" }}>
            <span className="animate-pulse">●</span> TRENDING
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Email card ─────────────────────────────────────────────────────────────────

function EmailCard({ inject, artifact: art }: { inject: Inject; artifact: InjectArtifact }) {
  const bodyText = art.emailBody ?? inject.body;
  const paragraphs = bodyText.split(/\n\n+/).filter(Boolean);
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#15171a", border: "1px solid #2a2e3a" }}>
      {/* Email header */}
      <div className="px-5 py-3 border-b" style={{ borderColor: "#2a2e3a", background: "#1c1f24" }}>
        {art.emailOrgName && (
          <div className="mb-2 pb-2 border-b" style={{ borderColor: "#2a2e3a" }}>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#4a4f65" }}>{art.emailOrgName}</span>
          </div>
        )}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs w-10 text-right shrink-0" style={{ color: "#4a4f65" }}>From</span>
          <span className="text-sm font-medium" style={{ color: "#e8eaf0" }}>{art.emailFrom ?? "unknown@sender.com"}</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs w-10 text-right shrink-0" style={{ color: "#4a4f65" }}>To</span>
          <span className="text-sm" style={{ color: "#8b8fa8" }}>{art.emailTo ?? "leadership@company.com"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs w-10 text-right shrink-0" style={{ color: "#4a4f65" }}>Subj</span>
          <span className="text-sm font-semibold" style={{ color: "#e8eaf0" }}>{art.emailSubject ?? inject.title}</span>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {art.emailSalutation && (
          <p className="text-base" style={{ color: "#c5c8d8" }}>{art.emailSalutation}</p>
        )}
        {paragraphs.map((p, i) => (
          <p key={i} className="text-base leading-relaxed" style={{ color: "#c5c8d8" }}>{p}</p>
        ))}
        {art.emailSignOff && (
          <p className="text-base pt-2 whitespace-pre-line" style={{ color: "#8b8fa8" }}>{art.emailSignOff}</p>
        )}
      </div>
    </div>
  );
}

// ── Legal letter ───────────────────────────────────────────────────────────────

function LegalLetter({ inject, artifact: art }: { inject: Inject; artifact: InjectArtifact }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#fafaf5", color: "#1a1a1a" }}>
      {/* Letterhead */}
      <div className="px-8 py-5 flex items-start justify-between" style={{ borderBottom: "3px solid #1a1a1a" }}>
        <div>
          <p className="text-lg font-bold tracking-wide uppercase" style={{ fontFamily: "Georgia, serif" }}>
            {art.legalAuthority ?? "Legal Notice"}
          </p>
          {art.legalCaseRef && (
            <p className="text-sm mt-1" style={{ color: "#555" }}>Case Ref: {art.legalCaseRef}</p>
          )}
        </div>
        <div className="text-right text-sm" style={{ color: "#555" }}>
          <p>OFFICIAL</p>
          <p>{new Date().toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>
      {/* Body */}
      <div className="px-8 py-6">
        <p className="text-base leading-relaxed" style={{ fontFamily: "Georgia, serif", color: "#222" }}>
          {inject.body}
        </p>
      </div>
      {/* Footer */}
      <div className="px-8 py-4" style={{ borderTop: "1px solid #ccc", background: "#f0ede6" }}>
        <p className="text-xs" style={{ color: "#777" }}>
          This is an official communication. Please retain this notice and seek independent legal advice immediately.
        </p>
      </div>
    </div>
  );
}

// ── News headline ──────────────────────────────────────────────────────────────

function NewsHeadline({ inject }: { inject: Inject }) {
  const paragraphs = inject.body.split(/\n\n+/).filter(Boolean);
  return (
    <div className="rounded-xl overflow-hidden">
      {/* Breaking news banner */}
      <div className="px-6 py-3 flex items-center gap-4" style={{ background: "#E82222" }}>
        <span className="text-white font-black text-sm uppercase tracking-widest">Breaking News</span>
        <span className="flex items-center gap-1.5 text-white/80 text-xs">
          <span className="animate-pulse">●</span> LIVE
        </span>
      </div>
      <div className="p-7" style={{ background: "#15171a", border: "1px solid rgba(232,34,34,0.3)" }}>
        <h3 className="text-2xl font-bold leading-tight mb-4" style={{ color: "#e8eaf0" }}>{inject.title}</h3>
        <div className="space-y-3 mb-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed" style={{ color: "#c5c8d8" }}>{p}</p>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: "#4a4f65" }}>
          <span>CrisisNews Desk</span>
          <span>·</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Dark Web Listing ────────────────────────────────────────────────────────

function DarkWebListing({ inject, artifact }: { inject: Inject; artifact: InjectArtifact }) {
  const siteName    = artifact.darkWebSiteName    ?? "ALPHV Data Market";
  const onionUrl    = artifact.darkWebOnionUrl    ?? "http://alphvmmm27o3abo3r2mlmjrpdmzle3rykajqc5xwn4bd3j4lujhpack3ad.onion";
  const title       = artifact.darkWebTitle       ?? inject.title;
  const price       = artifact.darkWebPrice       ?? "18 XMR";
  const recordCount = artifact.darkWebRecordCount ?? "-";
  const rows        = artifact.darkWebSampleRows  ?? [];

  return (
    <div className="w-full max-w-3xl rounded-xl overflow-hidden font-mono text-sm"
      style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", boxShadow: "0 0 40px rgba(0,255,0,0.04)" }}>

      {/* TOR browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#111", borderBottom: "1px solid #1e1e1e" }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#2a2a2a" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#2a2a2a" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#2a2a2a" }} />
        </div>
        <div className="flex-1 rounded px-3 py-1 text-xs truncate" style={{ background: "#0d0d0d", color: "#3a7d3a", border: "1px solid #1e3a1e" }}>
          <span style={{ color: "#2a5a2a" }}>🔒 </span>{onionUrl}
        </div>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#1a1a0a", color: "#6a6a20", border: "1px solid #2a2a10" }}>Tor</span>
      </div>

      {/* Site header */}
      <div className="px-6 py-4" style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center text-lg font-bold" style={{ background: "#1a0000", color: "#ff3333", border: "1px solid #330000" }}>⚠</div>
            <div>
              <p className="text-sm font-bold tracking-widest uppercase" style={{ color: "#cc2200" }}>{siteName}</p>
              <p className="text-xs" style={{ color: "#666" }}>Verified leak marketplace · No logs · No KYC</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "#4a7a4a" }}>Active users: <span style={{ color: "#4afe91" }}>1,247</span></p>
            <p className="text-xs mt-0.5" style={{ color: "#4a7a4a" }}>Listings today: <span style={{ color: "#4afe91" }}>38</span></p>
          </div>
        </div>
      </div>

      {/* Listing */}
      <div className="p-6">
        {/* Listing title */}
        <div className="mb-5 pb-5" style={{ borderBottom: "1px solid #1a1a1a" }}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <span className="text-xs px-2 py-0.5 rounded uppercase tracking-wider font-bold" style={{ background: "#2a0000", color: "#ff4444", border: "1px solid #440000" }}>NEW LISTING</span>
              <h3 className="text-lg font-bold mt-2 leading-tight" style={{ color: "#e0e0e0" }}>{title}</h3>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold" style={{ color: "#ffcc00" }}>{price}</p>
              <p className="text-xs" style={{ color: "#4a4a4a" }}>Monero only</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: "#111", border: "1px solid #1e1e1e", color: "#666" }}>
              📁 <span style={{ color: "#aaa" }}>{recordCount}</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: "#111", border: "1px solid #1e1e1e", color: "#666" }}>
              📅 <span style={{ color: "#aaa" }}>Posted {new Date().toLocaleDateString("en-GB")}</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: "#111", border: "1px solid #1e1e1e", color: "#666" }}>
              ✓ <span style={{ color: "#4afe91" }}>Verified by admin</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: "#111", border: "1px solid #1e1e1e", color: "#666" }}>
              ⏳ <span style={{ color: "#ff8800" }}>Auction closes 72h</span>
            </span>
          </div>
        </div>

        {/* Data preview */}
        {rows.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wider font-bold mb-3" style={{ color: "#444" }}>Sample Data Preview (5 of {recordCount})</p>
            <div className="rounded overflow-hidden text-xs" style={{ border: "1px solid #1e1e1e" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#111", borderBottom: "1px solid #1e1e1e" }}>
                    {["Full Name", "Account No.", "Sort Code", "Email"].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold" style={{ color: "#555" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#0a0a0a" : "#0d0d0d", borderBottom: "1px solid #141414" }}>
                      <td className="px-3 py-2" style={{ color: "#cc4444" }}>{row.name}</td>
                      <td className="px-3 py-2" style={{ color: "#888" }}>{row.account}</td>
                      <td className="px-3 py-2" style={{ color: "#888" }}>{row.sortCode}</td>
                      <td className="px-3 py-2" style={{ color: "#666" }}>{row.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2" style={{ color: "#333" }}>* Full dataset includes names, addresses, account numbers, sort codes, transaction history (24 months), and correspondence.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 flex items-center justify-between text-xs" style={{ background: "#080808", borderTop: "1px solid #141414", color: "#2a2a2a" }}>
        <span>Use escrow. Never direct transfer.</span>
        <span>PGP key available on profile</span>
      </div>
    </div>
  );
}

// ─── Stock chart (animated share price) ──────────────────────────────────────

function StockChart({ inject, artifact: art, liveStockDelta = 0 }: { inject: Inject; artifact: InjectArtifact; liveStockDelta?: number }) {
  const ticker    = art.stockTicker        ?? "APEX.L";
  const company   = art.stockCompanyName   ?? "Apex Dynamics plc";
  const open      = art.stockOpenPrice     ?? 482.4;
  const baseCurrent = art.stockCurrentPrice  ?? 447.7;
  const current   = baseCurrent + liveStockDelta;
  const changePct = open > 0 ? ((current - open) / open) * 100 : (art.stockChangePercent ?? -7.2);
  const volume    = art.stockVolume        ?? "14.2M";
  const isDown    = current < open;

  // Generate a jagged downward-trending SVG path to animate the price line.
  // 24 points across a 600-wide viewBox. Start high, drift down with noise.
  const points = Array.from({ length: 24 }, (_, i) => {
    const x = (i / 23) * 600;
    const trend = 40 + (i / 23) * 90;      // drifts from 40 to 130
    const noise = Math.sin(i * 1.9) * 8 + Math.cos(i * 0.7) * 5;
    return `${x.toFixed(1)},${(trend + noise).toFixed(1)}`;
  });
  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L 600,180 L 0,180 Z`;
  const lineColour = isDown ? "#ef4444" : "#4afe91";
  const fillColour = isDown ? "rgba(239,68,68,0.15)" : "rgba(74,254,145,0.15)";

  return (
    <div className="w-full max-w-3xl rounded-xl overflow-hidden font-mono"
      style={{ background: "#0b0e14", border: "1px solid #1a1f2e", boxShadow: "0 0 30px rgba(0,0,0,0.5)" }}>
      {/* Terminal header */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#070a0f", borderBottom: "1px solid #1a1f2e" }}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded" style={{ background: "#1a0f2e", color: "#f59e0b", border: "1px solid #3a2f1e" }}>
            LSE LIVE
          </span>
          <span className="text-xs" style={{ color: "#6b7280" }}>Bloomberg Terminal - Market Data</span>
        </div>
        <span className="text-xs" style={{ color: "#4a4f65" }}>{new Date().toLocaleTimeString("en-GB")}</span>
      </div>

      {/* Price header */}
      <div className="px-6 py-5 flex items-start justify-between gap-6" style={{ background: "#0d1117" }}>
        <div>
          <p className="text-2xl font-bold tracking-tight" style={{ color: "#e8eaf0" }}>{ticker}</p>
          <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{company}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            {liveStockDelta !== 0 && (
              <span className="text-xs font-mono px-1.5 py-0.5 rounded animate-pulse"
                style={{ background: liveStockDelta > 0 ? "rgba(74,254,145,0.15)" : "rgba(239,68,68,0.15)", color: liveStockDelta > 0 ? "#4afe91" : "#ef4444" }}>
                LIVE
              </span>
            )}
            <p className="text-4xl font-bold tabular-nums" style={{ color: lineColour }}>{current.toFixed(2)}<span className="text-base ml-1" style={{ color: "#6b7280" }}>GBX</span></p>
          </div>
          <p className="text-sm font-bold tabular-nums mt-0.5" style={{ color: lineColour }}>
            {isDown ? "▼" : "▲"} {Math.abs(current - open).toFixed(2)} ({Math.abs(changePct).toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="px-6 py-4" style={{ background: "#0b0e14" }}>
        <svg viewBox="0 0 600 180" className="w-full h-48">
          {/* Gridlines */}
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="0" y1={i * 45 + 15} x2="600" y2={i * 45 + 15} stroke="#1a1f2e" strokeWidth="0.5" strokeDasharray="2,4" />
          ))}
          {/* Open price line */}
          <line x1="0" y1="40" x2="600" y2="40" stroke="#4a4f65" strokeWidth="0.8" strokeDasharray="4,3" />
          <text x="598" y="36" fill="#6b7280" fontSize="9" textAnchor="end" fontFamily="monospace">OPEN {open.toFixed(2)}</text>
          {/* Area fill */}
          <path d={areaPath} fill={fillColour} className="chart-draw" />
          {/* Line */}
          <path d={linePath} fill="none" stroke={lineColour} strokeWidth="2" strokeLinejoin="round" className="chart-draw" />
          {/* End dot */}
          <circle cx="600" cy={points[points.length - 1].split(",")[1]} r="4" fill={lineColour}>
            <animate attributeName="opacity" from="1" to="0.3" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-px" style={{ background: "#1a1f2e", borderTop: "1px solid #1a1f2e" }}>
        {[
          { label: "OPEN", value: open.toFixed(2) },
          { label: "LOW", value: (Math.min(open, current) * 0.994).toFixed(2) },
          { label: "CHG %", value: `${changePct.toFixed(2)}%`, colour: lineColour },
          { label: "VOL", value: volume },
        ].map((s) => (
          <div key={s.label} className="px-4 py-2.5" style={{ background: "#0b0e14" }}>
            <p className="text-xs" style={{ color: "#4a4f65" }}>{s.label}</p>
            <p className="text-sm font-bold tabular-nums mt-0.5" style={{ color: s.colour ?? "#e8eaf0" }}>{s.value}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

// ─── Slack thread (internal staff panic) ─────────────────────────────────────

function SlackThread({
  inject, artifact: art, liveMessages = [],
}: { inject: Inject; artifact: InjectArtifact; liveMessages?: Array<{ author: string; time: string; text: string }> }) {
  const channel  = art.slackChannel ?? "#all-hands";
  const baseMessages = art.slackMessages ?? [];
  // Merge base messages with live-appended messages
  const messages = [
    ...baseMessages,
    ...liveMessages.map((m) => ({ author: m.author, time: m.time, text: m.text })),
  ];
  const colours  = ["#e11d48", "#f59e0b", "#8b5cf6", "#06b6d4", "#10b981", "#ec4899"];
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="w-full max-w-3xl rounded-xl overflow-hidden"
      style={{ background: "#1a1d21", border: "1px solid #2c2f33", boxShadow: "0 0 30px rgba(0,0,0,0.5)" }}>
      {/* Slack top bar */}
      <div className="px-5 py-3 flex items-center gap-3" style={{ background: "#19171d", borderBottom: "1px solid #2c2f33" }}>
        <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ background: "#611f69", color: "#fff" }}>A</div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: "#e8eaf0" }}>{channel}</p>
          <p className="text-xs" style={{ color: "#9aa0a6" }}>{messages.length} messages - {new Set(messages.map((m) => m.author)).size} participants</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded flex items-center gap-1.5" style={{ background: "#2a0f0f", color: "#f87171", border: "1px solid #4a1f1f" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#f87171" }} /> ACTIVE
        </span>
      </div>

      {/* Messages */}
      <div className="px-5 py-4 space-y-4 max-h-[500px] overflow-y-auto" style={{ background: "#1a1d21" }}>
        {messages.length === 0 ? (
          <p className="text-sm italic" style={{ color: "#6b7280" }}>No messages yet.</p>
        ) : messages.map((m, i) => {
          const isLive = i >= (art.slackMessages?.length ?? 0);
          const colour = colours[i % colours.length];
          const initials = m.author.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div key={i} className={cn("flex gap-3", isLive && "inject-arrive")}>
              <div className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold shrink-0" style={{ background: colour, color: "#fff" }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-sm font-bold" style={{ color: "#e8eaf0" }}>{m.author}</span>
                  {"role" in m && (m as any).role && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#2a2d33", color: "#9aa0a6" }}>{String((m as any).role)}</span>}
                  {isLive && <span className="text-[10px] font-mono px-1 py-0.5 rounded" style={{ background: "rgba(74,254,145,0.1)", color: "#4afe91" }}>LIVE</span>}
                  <span className="text-xs" style={{ color: "#6b7280" }}>{m.time}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#d1d5db" }}>{m.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Typing indicator */}
      <div className="px-5 py-3 flex items-center gap-2 text-xs" style={{ background: "#19171d", borderTop: "1px solid #2c2f33", color: "#6b7280" }}>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#6b7280" }} />
          <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#6b7280", animationDelay: "0.15s" }} />
          <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#6b7280", animationDelay: "0.3s" }} />
        </span>
        <span>several people are typing…</span>
      </div>

    </div>
  );
}

// ─── TV broadcast (breaking news lower-third) ────────────────────────────────

function TvBroadcast({ inject, artifact: art }: { inject: Inject; artifact: InjectArtifact }) {
  const network  = art.tvNetwork  ?? "BBC NEWS";
  const headline = art.tvHeadline ?? inject.title.toUpperCase();
  const ticker   = art.tvTicker   ?? inject.tickerHeadline ?? "BREAKING NEWS";
  const reporter = art.tvReporter ?? "LIVE - LONDON";

  return (
    <div className="w-full max-w-4xl rounded-xl overflow-hidden"
      style={{ background: "#000", border: "1px solid #1a1a1a", boxShadow: "0 0 40px rgba(232,34,34,0.15)" }}>
      {/* Fake studio frame */}
      <div className="relative aspect-video" style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a1a 40%, #2a0a0a 100%)" }}>
        {/* Blurred studio silhouette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(80,80,120,0.3) 0%, transparent 60%)", filter: "blur(20px)" }} />
        <div className="absolute" style={{ left: "30%", top: "25%", width: "40%", height: "55%", background: "linear-gradient(180deg, rgba(100,100,130,0.5) 0%, rgba(20,20,30,0.8) 100%)", borderRadius: "50% 50% 20% 20%", filter: "blur(8px)" }} />

        {/* LIVE indicator top-right */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded" style={{ background: "rgba(232,34,34,0.9)" }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#fff" }} />
          <span className="text-xs font-bold text-white tracking-widest">LIVE</span>
        </div>

        {/* Network logo top-left */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded" style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(232,34,34,0.5)" }}>
          <span className="text-sm font-bold tracking-wider" style={{ color: "#E82222" }}>{network}</span>
        </div>

        {/* Time / location top-right (below LIVE) */}
        <div className="absolute top-14 right-4 text-xs font-mono" style={{ color: "#aaa" }}>
          {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} GMT
        </div>

        {/* Lower-third chyron */}
        <div className="absolute bottom-10 left-0 right-0">
          {/* Red BREAKING NEWS strip */}
          <div className="px-5 py-2 flex items-center gap-3" style={{ background: "#E82222" }}>
            <span className="text-xs font-bold tracking-[0.2em] text-white">▶ BREAKING NEWS</span>
            <span className="text-xs text-white/80">{reporter}</span>
          </div>
          {/* Headline strip */}
          <div className="px-5 py-3" style={{ background: "rgba(0,0,0,0.9)", borderTop: "1px solid #E82222" }}>
            <p className="text-lg font-bold leading-tight text-white">{headline}</p>
          </div>
        </div>

        {/* Bottom ticker bar */}
        <div className="absolute bottom-0 left-0 right-0 py-2 overflow-hidden" style={{ background: "#0a0a0a", borderTop: "1px solid #2a2a2a" }}>
          <div className="flex items-center gap-3 whitespace-nowrap px-4">
            <span className="text-xs font-bold tracking-widest shrink-0" style={{ color: "#E82222" }}>■ LIVE</span>
            <span className="text-xs font-mono text-white/70 truncate">{ticker}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Voicemail ────────────────────────────────────────────────────────────────

function Voicemail({ inject, artifact: art }: { inject: Inject; artifact: InjectArtifact }) {
  const caller       = art.voicemailCaller       ?? "Unknown Caller";
  const callerNumber = art.voicemailCallerNumber ?? "+44 000 000 0000";
  const duration     = art.voicemailDuration     ?? "0:00";
  const transcript   = art.voicemailTranscript   ?? inject.body;
  const time         = art.voicemailTime         ?? new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="rounded-xl overflow-hidden font-mono"
      style={{ background: "#0d0d12", border: "1px solid #2a2a3a", boxShadow: "0 0 30px rgba(232,34,34,0.1)" }}>
      {/* Top bar */}
      <div className="px-5 py-3 flex items-center gap-3" style={{ background: "#12121a", borderBottom: "1px solid #2a2a3a" }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="#E82222" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.08 9.72a19.79 19.79 0 01-3.07-8.57A2 2 0 012 .13h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
        </svg>
        <span className="text-sm font-bold tracking-widest" style={{ color: "#E82222" }}>MISSED CALL</span>
        <span className="ml-auto text-xs" style={{ color: "#4a4f65" }}>{time}</span>
      </div>

      {/* Caller info */}
      <div className="px-6 py-5 flex items-center gap-4" style={{ borderBottom: "1px solid #1e1e2a" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "#1e1e2a", border: "1px solid #3a3a4a" }}>
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="#6b7280" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold" style={{ color: "#e8eaf0" }}>{caller}</p>
          <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>{callerNumber}</p>
        </div>
        <div className="px-3 py-1.5 rounded-full text-sm font-bold"
          style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.3)" }}>
          {duration}
        </div>
      </div>

      {/* Transcript */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold tracking-widest px-2 py-0.5 rounded"
            style={{ background: "#1e2a1e", color: "#4ade80", border: "1px solid #2a3a2a" }}>TRANSCRIBED</span>
        </div>
        <p className="text-lg leading-relaxed" style={{ color: "#a0a4b8", fontFamily: "monospace" }}>
          &ldquo;{transcript}&rdquo;
        </p>
      </div>
    </div>
  );
}

// ─── Internal memo ────────────────────────────────────────────────────────────

function InternalMemo({ inject, artifact: art }: { inject: Inject; artifact: InjectArtifact }) {
  const title          = art.memoTitle          ?? inject.title;
  const classification = art.memoClassification ?? "CONFIDENTIAL";
  const to             = art.memoTo             ?? "Senior Leadership Team";
  const from           = art.memoFrom           ?? "Chief Information Security Officer";
  const date           = art.memoDate           ?? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const ref            = art.memoRef            ?? `REF-${new Date().getFullYear()}-0001`;

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#fafaf8", color: "#1a1a1a" }}>
      {/* Classification stamp */}
      <div className="px-8 pt-5 pb-2 text-center">
        <span className="text-base font-black tracking-[0.3em] uppercase px-4 py-1 border-2"
          style={{ color: "#cc0000", borderColor: "#cc0000" }}>
          {classification}
        </span>
      </div>

      {/* Letterhead */}
      <div className="px-8 py-4 flex items-start justify-between" style={{ borderBottom: "2px solid #1a1a1a" }}>
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 text-center" style={{ border: "2px solid #1a1a1a" }}>
            <p className="text-xs font-bold tracking-wider uppercase" style={{ fontFamily: "Georgia, serif" }}>INTERNAL</p>
          </div>
          <div>
            <p className="text-lg font-bold tracking-wide uppercase" style={{ fontFamily: "Georgia, serif" }}>{title}</p>
          </div>
        </div>
        <div className="text-right text-xs" style={{ color: "#555", fontFamily: "Georgia, serif" }}>
          <p className="font-bold">{ref}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="px-8 py-4" style={{ borderBottom: "1px solid #ccc" }}>
        {[
          ["TO", to],
          ["FROM", from],
          ["DATE", date],
          ["RE", title],
        ].map(([label, value]) => (
          <div key={label} className="flex gap-4 mb-2">
            <span className="text-sm font-bold w-12 shrink-0" style={{ fontFamily: "Georgia, serif", color: "#333" }}>{label}:</span>
            <span className="text-sm" style={{ fontFamily: "Georgia, serif", color: "#1a1a1a" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="px-8 py-6 space-y-4">
        {inject.body.split(/\n\n+/).filter(Boolean).map((para, i) => (
          <p key={i} className="text-base leading-relaxed" style={{ fontFamily: "Georgia, serif", color: "#222" }}>
            {para}
          </p>
        ))}
      </div>

      {/* Footer */}
      <div className="px-8 py-3" style={{ borderTop: "1px solid #ccc", background: "#f0ede6" }}>
        <p className="text-xs text-center" style={{ color: "#777" }}>
          {classification} - FOR AUTHORISED RECIPIENTS ONLY - DO NOT DISTRIBUTE
        </p>
      </div>
    </div>
  );
}

// ─── SMS thread ───────────────────────────────────────────────────────────────

function SmsThread({ inject, artifact: art }: { inject: Inject; artifact: InjectArtifact }) {
  const participants = art.smsParticipants ?? ["Unknown", "You"];
  const messages: Array<{ sender: string; text: string; time: string }> =
    art.smsMessages ?? [{ sender: "left", text: inject.body, time: "Now" }];

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#1c1c1e", border: "1px solid #2a2a2e" }}>
      {/* Top bar */}
      <div className="px-5 py-3 flex items-center justify-center gap-2" style={{ background: "#2c2c2e", borderBottom: "1px solid #3a3a3e" }}>
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#8b8fa8" strokeWidth="2">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        <span className="text-sm font-semibold" style={{ color: "#e8eaf0" }}>
          {participants.slice(0, 2).join(" · ")}
        </span>
      </div>

      {/* Messages */}
      <div className="px-4 py-4 space-y-3 overflow-y-auto" style={{ maxHeight: "420px" }}>
        {messages.map((msg, i) => {
          const isRight = msg.sender !== participants[0];
          return (
            <div key={i} className={`flex flex-col ${isRight ? "items-end" : "items-start"}`}>
              <div className="px-4 py-2.5 rounded-2xl max-w-[75%]"
                style={isRight
                  ? { background: "#007aff", color: "#fff" }
                  : { background: "#3a3a3c", color: "#e8eaf0" }}>
                <p className="text-lg leading-snug">{msg.text}</p>
              </div>
              <span className="text-xs mt-1 px-1" style={{ color: "#6b7280" }}>{msg.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Regulator portal ─────────────────────────────────────────────────────────

function RegulatorPortal({ inject, artifact: art }: { inject: Inject; artifact: InjectArtifact }) {
  const regulatorName      = art.regulatorName        ?? "Information Commissioner's Office";
  const portalUrl          = art.regulatorPortalUrl   ?? "ico.org.uk/report";
  const caseRef            = art.regulatorCaseRef     ?? "ICO-2024-000000";
  const status             = (art.regulatorStatus     ?? "SUBMITTED").toUpperCase();
  const submittedAt        = art.regulatorSubmittedAt ?? new Date().toLocaleDateString("en-GB");
  const deadline           = art.regulatorDeadline    ?? "72 hours from notification";
  const officerName        = art.regulatorOfficerName ?? "Unassigned";

  const statusColour: Record<string, { bg: string; text: string; border: string }> = {
    SUBMITTED:      { bg: "rgba(245,158,11,0.15)",  text: "#fcd34d", border: "rgba(245,158,11,0.4)"  },
    ACKNOWLEDGED:   { bg: "rgba(59,130,246,0.15)",  text: "#93c5fd", border: "rgba(59,130,246,0.4)"  },
    UNDER_REVIEW:   { bg: "rgba(249,115,22,0.15)",  text: "#fdba74", border: "rgba(249,115,22,0.4)"  },
    ESCALATED:      { bg: "rgba(232,34,34,0.15)",   text: "#f87171", border: "rgba(232,34,34,0.4)"   },
    CLOSED:         { bg: "rgba(16,185,129,0.15)",  text: "#6ee7b7", border: "rgba(16,185,129,0.4)"  },
  };
  const sc = statusColour[status] ?? statusColour.SUBMITTED;

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#f3f4f6", border: "1px solid #d1d5db" }}>
      {/* Gov portal header */}
      <div className="px-6 py-3 flex items-center justify-between" style={{ background: "#1d3557", borderBottom: "4px solid #e8b400" }}>
        <div className="flex items-center gap-3">
          <span className="text-xl">👑</span>
          <div>
            <p className="text-xs font-bold tracking-widest text-white/60 uppercase">GOV.UK</p>
            <p className="text-sm font-bold text-white">{regulatorName}</p>
          </div>
        </div>
        <div className="text-xs font-mono" style={{ color: "#93c5fd" }}>{portalUrl}</div>
      </div>

      {/* Case banner */}
      <div className="px-6 py-3 flex items-center justify-between" style={{ background: "#e8edf4", borderBottom: "1px solid #d1d5db" }}>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6b7280" }}>Case Reference</span>
          <p className="text-base font-bold font-mono" style={{ color: "#1d3557" }}>{caseRef}</p>
        </div>
        <div className="px-3 py-1.5 rounded text-sm font-bold"
          style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
          {status.replace("_", " ")}
        </div>
      </div>

      {/* Fields table */}
      <div className="px-6 py-4" style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        {[
          ["Submitted", submittedAt],
          ["Response Deadline", deadline],
          ["Case Officer", officerName],
        ].map(([label, value]) => (
          <div key={label} className="flex gap-4 py-2" style={{ borderBottom: "1px solid #f3f4f6" }}>
            <span className="text-sm font-semibold w-44 shrink-0" style={{ color: "#374151" }}>{label}</span>
            <span className="text-sm" style={{ color: "#1f2937" }}>{value}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

// ─── Negotiation chat ─────────────────────────────────────────────────────────

function NegotiationChat({ inject, artifact: art }: { inject: Inject; artifact: InjectArtifact }) {
  const threatAlias = art.negotiationThreatAlias ?? "THREAT ACTOR";
  const messages: Array<{ side: string; text: string; time: string }> =
    art.negotiationMessages ?? [{ side: "threat", text: inject.body, time: "00:00" }];

  return (
    <div className="rounded-xl overflow-hidden font-mono" style={{ background: "#050508", border: "1px solid #1a1a2a" }}>
      {/* Header panes */}
      <div className="grid grid-cols-2" style={{ borderBottom: "1px solid #1a1a2a" }}>
        <div className="px-5 py-2.5 flex items-center gap-2" style={{ borderRight: "1px solid #1a1a2a", background: "#0a0a10" }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
          <span className="text-xs font-bold tracking-widest" style={{ color: "#22c55e" }}>NEGOTIATOR</span>
        </div>
        <div className="px-5 py-2.5 flex items-center gap-2" style={{ background: "#0a0a10" }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#E82222" }} />
          <span className="text-xs font-bold tracking-widest" style={{ color: "#E82222" }}>{threatAlias}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: "400px" }}>
        {messages.map((msg, i) => {
          const isNegotiator = msg.side === "negotiator";
          return (
            <div key={i} className={`flex flex-col ${isNegotiator ? "items-start" : "items-end"}`}>
              <div className="px-4 py-2 rounded max-w-[80%]"
                style={isNegotiator
                  ? { background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#86efac" }
                  : { background: "rgba(232,34,34,0.08)", border: "1px solid rgba(232,34,34,0.2)", color: "#fca5a5" }}>
                <p className="text-base leading-snug">{msg.text}</p>
              </div>
              <span className="text-xs mt-1 px-1" style={{ color: "#4a4a5a" }}>{msg.time}</span>
            </div>
          );
        })}
      </div>

      {/* Input bar (decorative) */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ borderTop: "1px solid #1a1a2a", background: "#0a0a10" }}>
        <div className="flex-1 px-3 py-1.5 rounded text-sm" style={{ background: "#12121c", border: "1px solid #2a2a3a", color: "#4a4a6a" }}>
          Type message…
        </div>
        <div className="px-3 py-1.5 rounded text-xs font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
          SEND
        </div>
      </div>
    </div>
  );
}

// ─── LinkedIn post ────────────────────────────────────────────────────────────

function LinkedInPost({ inject, artifact: art }: { inject: Inject; artifact: InjectArtifact }) {
  const author   = art.linkedinAuthor      ?? "Executive";
  const title    = art.linkedinAuthorTitle ?? "Chief Executive Officer";
  const text     = art.linkedinText        ?? inject.body;
  const likes    = art.linkedinLikes       ?? 0;
  const comments = art.linkedinComments    ?? 0;
  const shares   = art.linkedinShares      ?? 0;

  const initials = author
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #e0e0e0" }}>
      {/* LinkedIn brand bar */}
      <div className="px-5 py-2.5 flex items-center gap-2" style={{ background: "#0a66c2", borderBottom: "1px solid #0855a4" }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#fff">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        <span className="text-sm font-bold text-white tracking-wide">LinkedIn</span>
      </div>

      {/* Author */}
      <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #f3f3f3" }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-base"
          style={{ background: "#0a66c2" }}>
          {initials}
        </div>
        <div>
          <p className="font-bold text-base" style={{ color: "#1a1a1a" }}>{author}</p>
          <p className="text-sm" style={{ color: "#6b7280" }}>{title}</p>
        </div>
        <div className="ml-auto px-3 py-1 rounded-full text-sm font-semibold"
          style={{ border: "1px solid #0a66c2", color: "#0a66c2" }}>
          + Follow
        </div>
      </div>

      {/* Post text */}
      <div className="px-5 py-4" style={{ borderBottom: "1px solid #f3f3f3" }}>
        <p className="text-lg leading-relaxed" style={{ color: "#1a1a1a" }}>{text}</p>
      </div>

      {/* Reactions bar */}
      <div className="px-5 py-3 flex items-center gap-6">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">👍</span>
          <span className="text-sm font-semibold" style={{ color: "#6b7280" }}>{likes.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">💬</span>
          <span className="text-sm font-semibold" style={{ color: "#6b7280" }}>{comments.toLocaleString()} comments</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">↗</span>
          <span className="text-sm font-semibold" style={{ color: "#6b7280" }}>{shares.toLocaleString()} shares</span>
        </div>
      </div>
    </div>
  );
}

// ─── Board portal ─────────────────────────────────────────────────────────────

function BoardPortal({ inject, artifact: art }: { inject: Inject; artifact: InjectArtifact }) {
  const orgName    = art.boardPortalOrgName   ?? "Organisation";
  const members: Array<{ name: string; role: string; loggedInAt?: string; isOnline?: boolean }> =
    art.boardPortalMembers ?? [];
  const alertCount = art.boardPortalAlertCount ?? 0;
  const alertTitle = art.boardPortalAlertTitle ?? inject.title;

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#0a0e1a", border: "1px solid #1a2030" }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: "#0d1120", borderBottom: "1px solid #1a2030" }}>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: "#4a5568" }}>Board Portal</p>
          <p className="text-xl font-bold" style={{ color: "#e8eaf0" }}>{orgName}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)" }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#3b82f6" }} />
          <span className="text-xs font-bold" style={{ color: "#93c5fd" }}>SECURE SESSION</span>
        </div>
      </div>

      {/* Alert banner */}
      {alertCount > 0 && (
        <div className="px-6 py-3 flex items-center gap-3"
          style={{ background: "rgba(245,158,11,0.12)", borderBottom: "1px solid rgba(245,158,11,0.3)" }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="#f59e0b" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>
          </svg>
          <span className="text-sm font-bold" style={{ color: "#fcd34d" }}>
            {alertCount} URGENT ALERT{alertCount > 1 ? "S" : ""} - {alertTitle}
          </span>
        </div>
      )}

      {/* Members list */}
      {members.length > 0 && (
        <div style={{ borderBottom: "1px solid #1a2030" }}>
          <div className="px-6 py-2" style={{ background: "#0d1120" }}>
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#4a5568" }}>Board Members</span>
          </div>
          {members.map((m, i) => (
            <div key={i} className="px-6 py-3 flex items-center gap-3"
              style={{ borderTop: "1px solid #1a2030" }}>
              <span className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: m.isOnline ? "#22c55e" : "#4a5568" }} />
              <div className="flex-1">
                <p className="text-base font-semibold" style={{ color: "#e8eaf0" }}>{m.name}</p>
                <p className="text-sm" style={{ color: "#6b7280" }}>{m.role}</p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: m.isOnline ? "#22c55e" : "#4a5568" }}>
                  {m.isOnline ? "Online" : "Offline"}
                </p>
                {m.loggedInAt && (
                  <p className="text-xs" style={{ color: "#4a5568" }}>Last: {m.loggedInAt}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// ─── Voting display ───────────────────────────────────────────────────────────

function VotingDisplay({ inject, voteState }: { inject: Inject; voteState: VoteState }) {
  const { votes, revealed, winner } = voteState;
  const counts: Record<string, number> = {};
  for (const v of votes) counts[v.optionKey] = (counts[v.optionKey] ?? 0) + 1;
  const maxCount = Math.max(1, ...Object.values(counts));

  return (
    <div className="w-80 shrink-0 flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <GitBranch className="w-4 h-4" style={{ color: "#fbbf24" }} />
        <span className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: "#fcd34d" }}>
          Decision Required
        </span>
        <span className="ml-auto text-xs font-mono" style={{ color: "#4a4f65" }}>
          {votes.length} vote{votes.length !== 1 ? "s" : ""}
        </span>
      </div>

      {inject.decisionOptions.map((option) => {
        const c       = opt(option.key);
        const count   = counts[option.key] ?? 0;
        const pct     = votes.length === 0 ? 0 : Math.round((count / votes.length) * 100);
        const barW    = votes.length === 0 ? 0 : (count / maxCount) * 100;
        const isWin   = revealed && winner === option.key;
        const voters  = votes.filter((v) => v.optionKey === option.key);

        return (
          <div key={option.key}
            className={cn("rounded-xl p-4 transition-all duration-500", isWin && "winner-glow")}
            style={{ background: isWin ? c.winBg : c.bg, border: `1px solid ${isWin ? c.winBorder : c.border}` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0"
                style={{ background: isWin ? "rgba(74,254,145,0.2)" : c.bg, color: isWin ? "#4afe91" : c.text, border: `1px solid ${isWin ? c.winBorder : c.border}` }}>
                {option.key}
              </span>
              <span className="text-sm font-medium flex-1" style={{ color: isWin ? "#4afe91" : "#e8eaf0" }}>
                {option.label}
              </span>
              {revealed && (
                <span className="text-sm font-bold font-mono vote-count" style={{ color: isWin ? "#4afe91" : c.text }}>
                  {pct}%
                </span>
              )}
              {isWin && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#4afe91" }} />}
            </div>
            {revealed && (
              <div className="w-full h-1.5 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${barW}%`, background: isWin ? "#4afe91" : c.bar }} />
              </div>
            )}
            {voters.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {voters.map((v, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full vote-arrive"
                    style={{ background: "rgba(255,255,255,0.06)", color: "#8b8fa8" }}>
                    {v.roleName}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {revealed && winner && (() => {
        const winnerOption = inject.decisionOptions.find((o) => o.key === winner);
        return (
          <div className="rounded-xl p-4" style={{ background: "rgba(74,254,145,0.08)", border: "1px solid rgba(74,254,145,0.25)" }}>
            <p className="text-xs font-bold uppercase tracking-widest font-mono mb-1" style={{ color: "#4afe91" }}>
              Majority: Option {winner}
            </p>
            {winnerOption?.consequence && (
              <p className="text-xs leading-relaxed mt-1.5" style={{ color: "rgba(197,200,216,0.8)" }}>
                {winnerOption.consequence}
              </p>
            )}
          </div>
        );
      })()}
      {!revealed && votes.length === 0 && (
        <p className="text-xs font-mono text-center mt-2" style={{ color: "#4a4f65" }}>Waiting for votes…</p>
      )}
    </div>
  );
}

// ─── Ad-hoc ───────────────────────────────────────────────────────────────────

function AdHocScreen({ body }: { body: string }) {
  return (
    <div className="h-full flex flex-col px-16 py-12 max-w-5xl mx-auto w-full inject-arrive">
      <div className="flex items-center gap-3 mb-8">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: "#fbbf24" }}>
          Facilitator Update
        </span>
      </div>
      <div className="rounded-2xl p-8 flex-1" style={{ background: "#15171a", border: "1px solid #1e2128" }}>
        <p className="text-2xl leading-relaxed" style={{ color: "#c5c8d8" }}>{body}</p>
      </div>
    </div>
  );
}

// ─── Paused ───────────────────────────────────────────────────────────────────

function PausedScreen() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ border: "3px solid rgba(245,158,11,0.3)" }}>
          <div className="flex gap-2">
            <div className="w-2.5 h-7 rounded-full bg-amber-400" />
            <div className="w-2.5 h-7 rounded-full bg-amber-400" />
          </div>
        </div>
        <p className="text-2xl font-semibold" style={{ color: "#fbbf24" }}>Session Paused</p>
        <p className="text-sm mt-2" style={{ color: "#4a4f65" }}>The facilitator will resume shortly</p>
      </div>
    </div>
  );
}

// ─── Ended ────────────────────────────────────────────────────────────────────

function EndedScreen() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center w-24 h-24 rounded-2xl mx-auto mb-6"
          style={{ background: "rgba(74,254,145,0.08)", border: "1px solid rgba(74,254,145,0.2)" }}>
          <ShieldAlert className="w-12 h-12" style={{ color: "#4afe91" }} />
        </div>
        <p className="text-4xl font-bold mb-3">Exercise Complete</p>
        <p style={{ color: "#8b8fa8" }}>Thank you for participating. Debrief to follow.</p>
      </div>
    </div>
  );
}
