/**
 * Home.tsx - Dashboard screen.
 *
 * Shows a branded hero with the ECG mark, key stats, an active session banner,
 * quick-start template cards, a "how it works" section, and recent exercises.
 */

import { useEffect, useRef, useState } from "react";
import { useStore, getAllScenarios } from "@/store";
import {
  Plus, PlayCircle, FileText, BookOpen, ChevronRight, Clock,
  AlertTriangle, Zap, Target, BarChart3, Users, Download, Upload, Github,
} from "lucide-react";

const GITHUB_URL = "https://github.com/SamHoughton/CrisisSimulation";
import { SCENARIO_TYPE_LABELS, DIFFICULTY_COLOUR, DIFFICULTY_LABEL, formatDuration } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

/** Counts up from 0 to `target` over `duration` ms */
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (target === prev.current) return;
    prev.current = target;
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

export function Home() {
  const setView         = useStore((s) => s.setView);
  const session         = useStore((s) => s.session);
  const pastSessions    = useStore((s) => s.pastSessions);
  const importSessions  = useStore((s) => s.importSessions);
  const store           = useStore();
  const allScenarios    = getAllScenarios(store);

  const recent = pastSessions.slice(0, 5);

  return (
    <div className="min-h-full">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-rtr-border">
        {/* Background vessel watermark */}
        <svg className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.045] pointer-events-none" width="160" height="170" viewBox="0 0 64 68" fill="none">
          <path d="M 14 12 L 21 54 Q 21 58 25 58 L 39 58 Q 43 58 43 54 L 50 12 Z" stroke="#1db86a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
          <line x1="9"  y1="13" x2="55" y2="13" stroke="#1db86a" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="5"  y1="8"  x2="13" y2="16" stroke="#1db86a" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="59" y1="8"  x2="51" y2="16" stroke="#1db86a" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="27" y1="47" x2="27" y2="55" stroke="#1db86a" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
          <line x1="32" y1="49" x2="32" y2="57" stroke="#1db86a" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <line x1="37" y1="47" x2="37" y2="55" stroke="#1db86a" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
        </svg>
        {/* Top accent line */}
        <div className="h-[2px] bg-gradient-to-r from-rtr-green via-rtr-green/60 to-transparent" />

        <div className="px-8 py-10 max-w-5xl mx-auto relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(29,184,106,0.1)", border: "1px solid rgba(29,184,106,0.2)" }}>
                  <svg viewBox="0 0 64 68" className="w-5 h-5" fill="none">
                    <path d="M 14 12 L 21 54 Q 21 58 25 58 L 39 58 Q 43 58 43 54 L 50 12 Z" stroke="#1db86a" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round"/>
                    <line x1="9"  y1="13" x2="55" y2="13" stroke="#1db86a" strokeWidth="5" strokeLinecap="round"/>
                    <line x1="5"  y1="8"  x2="13" y2="16" stroke="#1db86a" strokeWidth="5" strokeLinecap="round"/>
                    <line x1="59" y1="8"  x2="51" y2="16" stroke="#1db86a" strokeWidth="5" strokeLinecap="round"/>
                    <line x1="27" y1="47" x2="27" y2="55" stroke="#1db86a" strokeWidth="3" strokeLinecap="round" opacity="0.45"/>
                    <line x1="32" y1="49" x2="32" y2="57" stroke="#1db86a" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
                    <line x1="37" y1="47" x2="37" y2="55" stroke="#1db86a" strokeWidth="3" strokeLinecap="round" opacity="0.45"/>
                  </svg>
                </div>
                <span className="text-[10px] text-rtr-dim tracking-[0.35em] uppercase font-medium">Crisis Simulation Platform</span>
              </div>
              <h1 className="text-3xl font-bold text-rtr-text mb-2">
                Prepare your team for the
                <span className="text-rtr-red ml-2">worst day</span>
              </h1>
              <p className="text-sm text-rtr-muted max-w-lg leading-relaxed">
                Run branching crisis tabletop exercises with your executive team. Score decisions in real time, reveal consequences under pressure, and finish knowing exactly where the team held firm and where the gaps are.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={() => {
                    const tpl = allScenarios.find((s) => s.isTemplate);
                    if (tpl) { useStore.getState().setEditingScenario(tpl.id); setView("setup"); }
                    else setView("library");
                  }}
                  className="flex items-center gap-2 bg-rtr-green text-white px-4 py-2.5 rounded-lg text-xs font-semibold hover:brightness-110 transition"
                >
                  <PlayCircle className="w-4 h-4" />
                  Run a Scenario
                </button>
                <button
                  onClick={() => { useStore.getState().setEditingScenario(null); setView("builder"); }}
                  className="flex items-center gap-2 bg-rtr-elevated text-rtr-muted px-4 py-2.5 rounded-lg text-xs font-medium border border-rtr-border hover:text-rtr-text hover:border-rtr-border-light transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Build Custom
                </button>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-rtr-dim hover:text-rtr-muted transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  Open source
                </a>
              </div>
            </div>

            {/* Stats cluster */}
            <div className="hidden lg:flex items-center gap-3">
              <StatCard icon={<BookOpen className="w-4 h-4" />} label="Scenarios" value={allScenarios.length} />
              <StatCard icon={<FileText className="w-4 h-4" />} label="Exercises" value={pastSessions.length} />
              <StatCard
                icon={<Clock className="w-4 h-4" />}
                label="Hours"
                value={Math.round(pastSessions.reduce(
                  (sum, s) => sum + (s.endedAt
                    ? (new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 3600000
                    : s.scenario.durationMin / 60
                  ), 0))}
                suffix="h"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 max-w-5xl mx-auto py-8">

        {/* ── Active session banner ───────────────────────────────────────── */}
        {session && session.status !== "ended" && (
          <div className="mb-8 fade-in-up">
            <button
              onClick={() => setView("runner")}
              className="w-full flex items-center gap-4 bg-rtr-red/8 border border-rtr-red/30 rounded-xl p-4 hover:bg-rtr-red/12 transition-colors text-left group"
            >
              <div className="relative shrink-0">
                <AlertTriangle className="w-5 h-5 text-rtr-red" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rtr-red animate-ping" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-rtr-text">{session.scenario.title}</p>
                <p className="text-xs text-rtr-muted mt-0.5">
                  Session {session.status} · {session.liveInjects.length}/{session.scenario.injects.length} injects released
                </p>
              </div>
              <span className="text-xs font-semibold text-rtr-red bg-rtr-red/15 px-2 py-0.5 rounded-full font-mono pulse-dot">
                {session.status === "active" ? "LIVE" : session.status.toUpperCase()}
              </span>
              <ChevronRight className="w-4 h-4 text-rtr-dim group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        {/* ── Scenario Templates ──────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-rtr-dim uppercase tracking-wider">
              Scenario Templates
            </h2>
            <button onClick={() => setView("library")} className="text-xs text-rtr-green hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
            {allScenarios.filter((s) => s.isTemplate).slice(0, 6).map((s) => (
              <ScenarioCard key={s.id} scenario={s} onRun={() => {
                useStore.getState().setEditingScenario(s.id);
                setView("setup");
              }} />
            ))}
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold text-rtr-dim uppercase tracking-wider mb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StepCard
              step={1}
              icon={<Target className="w-5 h-5" />}
              title="Select a scenario"
              description="Choose from branching templates or build your own. Assign roles, set the briefing, and configure decision points."
            />
            <StepCard
              step={2}
              icon={<Users className="w-5 h-5" />}
              title="Run the exercise"
              description="Release injects in real time. Your team votes on decisions under pressure. The projector view keeps the room immersed."
            />
            <StepCard
              step={3}
              icon={<BarChart3 className="w-5 h-5" />}
              title="Review the report"
              description="Every decision gets scored. You see where the team held, where it didn't, and what to work on before the next exercise."
            />
          </div>
        </section>

        {/* ── Empty state ─────────────────────────────────────────────────── */}
        {allScenarios.filter((s) => s.isTemplate).length === 0 && (
          <div className="text-center py-12 border border-dashed border-rtr-border rounded-xl mb-8 fade-in-up">
            <Zap className="w-8 h-8 text-rtr-dim mx-auto mb-3" />
            <p className="text-sm font-medium text-rtr-text mb-1">No scenarios yet</p>
            <p className="text-xs text-rtr-muted mb-4">Create your first crisis scenario to get started</p>
            <button
              onClick={() => { useStore.getState().setEditingScenario(null); setView("builder"); }}
              className="inline-flex items-center gap-2 bg-rtr-red text-white px-4 py-2 rounded text-xs font-medium hover:brightness-110 transition"
            >
              <Plus className="w-3.5 h-3.5" /> New Scenario
            </button>
          </div>
        )}

        {/* Import button when no past sessions exist */}
        {pastSessions.length === 0 && (
          <section className="mb-8 fade-in-up">
            <p className="text-xs text-rtr-dim text-center mb-2">Returning from a previous session?</p>
            <label className="flex items-center justify-center gap-1.5 text-xs text-rtr-muted hover:text-rtr-text border border-dashed border-rtr-border px-3 py-2.5 rounded-lg transition-colors cursor-pointer mx-auto w-fit">
              <Upload className="w-3.5 h-3.5" />Import session archive
              <input type="file" accept=".json" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const data = JSON.parse(reader.result as string);
                    const sessions = Array.isArray(data) ? data : data.pastSessions ?? [data.session].filter(Boolean);
                    if (sessions.length > 0) importSessions(sessions);
                  } catch { /* ignore invalid JSON */ }
                };
                reader.readAsText(file);
                e.target.value = "";
              }} />
            </label>
          </section>
        )}

        {/* ── Recent sessions ─────────────────────────────────────────────── */}
        {recent.length > 0 && (
          <section className="fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-rtr-dim uppercase tracking-wider">
                Recent Exercises
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(pastSessions, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `crucible-sessions-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-1.5 text-xs text-rtr-muted hover:text-rtr-text border border-rtr-border px-2.5 py-1.5 rounded transition-colors"
                  title="Export all sessions as JSON"
                >
                  <Download className="w-3 h-3" />Export
                </button>
                <label className="flex items-center gap-1.5 text-xs text-rtr-muted hover:text-rtr-text border border-rtr-border px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                  title="Import sessions from JSON"
                >
                  <Upload className="w-3 h-3" />Import
                  <input type="file" accept=".json" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      try {
                        const data = JSON.parse(reader.result as string);
                        const sessions = Array.isArray(data) ? data : data.pastSessions ?? [data.session].filter(Boolean);
                        if (sessions.length > 0) importSessions(sessions);
                      } catch { /* ignore invalid JSON */ }
                    };
                    reader.readAsText(file);
                    e.target.value = "";
                  }} />
                </label>
              </div>
            </div>
            <div className="border border-rtr-border rounded-xl divide-y divide-rtr-border overflow-hidden bg-rtr-panel">
              {recent.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    useStore.getState().setViewingSession(s.id);
                    useStore.setState({ session: s });
                    setView("report");
                  }}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-rtr-elevated transition-colors text-left group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-rtr-text truncate">{s.scenario.title}</p>
                    <p className="text-xs text-rtr-muted mt-0.5">
                      {SCENARIO_TYPE_LABELS[s.scenario.type]} · {s.participants.length} participants ·{" "}
                      {formatDistanceToNow(new Date(s.startedAt), { addSuffix: true })}
                    </p>
                  </div>
                  {s.report ? (
                    <ScorePill score={s.report.overallScore} />
                  ) : (
                    <span className="text-xs text-rtr-dim bg-rtr-elevated px-2 py-0.5 rounded-full">
                      No report
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-rtr-dim group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Open source footer ──────────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-rtr-border flex items-center justify-between">
          <p className="text-[11px] text-rtr-dim leading-relaxed max-w-md">
            Built for practitioners, not vendors. No accounts, no data collection, no cost. Everything runs in your browser.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-rtr-dim hover:text-rtr-muted border border-rtr-border hover:border-rtr-border-light px-3 py-2 rounded-lg transition-colors shrink-0 ml-8"
          >
            <Github className="w-3.5 h-3.5" />
            View on GitHub
          </a>
        </div>

      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────────── */

function StatCard({
  icon, label, value, suffix = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
}) {
  const displayed = useCountUp(value);
  return (
    <div className="bg-rtr-panel/60 border border-rtr-border rounded-xl px-5 py-4 min-w-[100px] text-center backdrop-blur-sm">
      <div className="flex justify-center mb-2 text-rtr-dim">{icon}</div>
      <p className="text-xl font-bold text-rtr-text font-mono">{displayed}{suffix}</p>
      <p className="text-[10px] text-rtr-dim uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function StepCard({
  step, icon, title, description,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-rtr-panel border border-rtr-border rounded-xl p-5 group hover:border-rtr-border-light transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-rtr-green"
          style={{ background: "rgba(29,184,106,0.08)", border: "1px solid rgba(29,184,106,0.15)" }}>
          {icon}
        </div>
        <span className="text-[10px] font-bold text-rtr-dim tracking-wider uppercase">Step {step}</span>
      </div>
      <p className="text-sm font-semibold text-rtr-text mb-1.5">{title}</p>
      <p className="text-xs text-rtr-muted leading-relaxed">{description}</p>
    </div>
  );
}

function ScorePill({ score }: { score: number }) {
  const colour =
    score >= 75 ? "text-rtr-green bg-rtr-green/10 border border-rtr-green/20" :
    score >= 50 ? "text-amber-400 bg-amber-500/10 border border-amber-500/20" :
                  "text-red-400 bg-red-500/10 border border-red-500/20";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full font-mono ${colour}`}>
      {score}/100
    </span>
  );
}

function ScenarioCard({ scenario, onRun }: { scenario: any; onRun: () => void }) {
  const frameworks: string[] = scenario.regulatoryFrameworks ?? [];
  const visibleFw = frameworks.slice(0, 2);
  const extraFw   = frameworks.length - visibleFw.length;

  const NOISE = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer fade-in-up"
      style={{
        height: 268,
        background: scenario.coverGradient
          ? `linear-gradient(${scenario.coverGradient})`
          : "#0d0f12",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.07)",
        transition: "transform 0.35s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 0 0 1px rgba(29,184,106,0.5), 0 20px 60px rgba(0,0,0,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.07)";
      }}
      onClick={onRun}
    >
      {/* Film-grain noise texture */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: NOISE }} />

      {/* Gradient vignette — heavy at base so text is always legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/30 to-transparent pointer-events-none" />

      {/* Hover: green underglow bloom */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 110%, rgba(29,184,106,0.10) 0%, transparent 65%)",
          transition: "opacity 0.5s ease",
        }}
      />

      {/* ── Top row: badges ─────────────────────────────────────── */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 z-10">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${DIFFICULTY_COLOUR[scenario.difficulty]}`}>
          {DIFFICULTY_LABEL[scenario.difficulty]}
        </span>
        <span className="text-[10px] text-white/55 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10 font-medium">
          {SCENARIO_TYPE_LABELS[scenario.type]}
        </span>
      </div>

      {/* Top-right: inject/duration chip — appears on hover */}
      <div
        className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100"
        style={{ transition: "opacity 0.2s ease" }}
      >
        <span className="text-[10px] font-mono text-white/45 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
          {scenario.injects.length} injects · {formatDuration(scenario.durationMin)}
        </span>
      </div>

      {/* ── Bottom content ───────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-12 z-10">

        {/* Description — slides up on hover */}
        <p className="text-xs text-white/55 leading-relaxed line-clamp-2 mb-3 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {scenario.description}
        </p>

        {/* Title — always visible */}
        <h3
          className="text-[28px] leading-[1.05] text-white mb-0.5"
          style={{ fontFamily: "'Bebas Neue', 'Arial Black', sans-serif", letterSpacing: "0.04em" }}
        >
          {scenario.title}
        </h3>

        {/* Audience label */}
        {scenario.audienceLabel && (
          <p className="text-[11px] text-white/40 mb-3 leading-snug">{scenario.audienceLabel}</p>
        )}

        {/* Framework badges */}
        {visibleFw.length > 0 && (
          <div className="flex items-center gap-1 mb-0">
            {visibleFw.map((fw: string) => (
              <span key={fw} className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300/65 border border-blue-400/20 font-medium backdrop-blur-sm">
                {fw}
              </span>
            ))}
            {extraFw > 0 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/30 text-white/30 border border-white/10">
                +{extraFw}
              </span>
            )}
          </div>
        )}

        {/* Run button — slides up on hover via max-h transition */}
        <div className="overflow-hidden max-h-0 group-hover:max-h-12 group-hover:mt-3 transition-all duration-300 ease-out">
          <button
            onClick={(e) => { e.stopPropagation(); onRun(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white hover:brightness-110 transition-all duration-200"
            style={{ background: "rgba(29,184,106,0.88)", backdropFilter: "blur(8px)" }}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Run scenario
          </button>
        </div>
      </div>
    </div>
  );
}
