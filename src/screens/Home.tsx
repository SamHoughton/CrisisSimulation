/**
 * Home.tsx -Dashboard screen.
 *
 * Shows key stats (scenarios available, exercises run, hours simulated),
 * an active session banner if one is running, quick-start template cards,
 * and a list of recent completed exercises with report scores.
 */

import { useEffect, useRef, useState } from "react";
import { useStore, getAllScenarios } from "@/store";
import { Plus, PlayCircle, FileText, BookOpen, ChevronRight, Clock, AlertTriangle, Zap } from "lucide-react";
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
      const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
      setValue(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

export function Home() {
  const setView      = useStore((s) => s.setView);
  const session      = useStore((s) => s.session);
  const pastSessions = useStore((s) => s.pastSessions);
  const store        = useStore();
  const allScenarios = getAllScenarios(store);

  const recent = pastSessions.slice(0, 5);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 fade-in-up">
        <div>
          <h1 className="text-2xl font-semibold text-rtr-text">Dashboard</h1>
          <p className="text-rtr-muted text-sm mt-0.5">
            Prepare. Respond. Recover.
          </p>
        </div>
        <button
          onClick={() => { useStore.getState().setEditingScenario(null); setView("builder"); }}
          className="flex items-center gap-2 bg-rtr-red text-white px-4 py-2 rounded text-xs font-medium hover:bg-[#c0001f] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Scenario
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 stagger">
        <Stat icon={<BookOpen className="w-4 h-4 text-rtr-green" />} label="Scenarios available" value={allScenarios.length} />
        <Stat icon={<FileText className="w-4 h-4 text-rtr-green" />} label="Exercises run"       value={pastSessions.length} />
        <Stat icon={<Clock className="w-4 h-4 text-rtr-muted" />}   label="Hours simulated"     value={Math.round(pastSessions.reduce((sum, s) => sum + (s.endedAt ? (new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 3600000 : s.scenario.durationMin / 60), 0))} suffix="h" />
      </div>

      {/* Active session banner */}
      {session && session.status !== "ended" && (
        <div className="mb-6 fade-in-up">
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

      {/* Quick start */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3 fade-in-up">
          <h2 className="text-xs font-semibold text-rtr-dim uppercase tracking-wider">
            Quick Start -Scenario Templates
          </h2>
          <button onClick={() => setView("library")} className="text-xs text-rtr-green hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 stagger">
          {allScenarios.filter((s) => s.isTemplate).slice(0, 4).map((s) => (
            <ScenarioCard key={s.id} scenario={s} onRun={() => {
              useStore.getState().setEditingScenario(s.id);
              setView("setup");
            }} />
          ))}
        </div>
      </section>

      {/* Empty state */}
      {allScenarios.filter((s) => s.isTemplate).length === 0 && (
        <div className="text-center py-12 border border-dashed border-rtr-border rounded-xl mb-8 fade-in-up">
          <Zap className="w-8 h-8 text-rtr-dim mx-auto mb-3" />
          <p className="text-sm font-medium text-rtr-text mb-1">No scenarios yet</p>
          <p className="text-xs text-rtr-muted mb-4">Create your first crisis scenario to get started</p>
          <button
            onClick={() => { useStore.getState().setEditingScenario(null); setView("builder"); }}
            className="inline-flex items-center gap-2 bg-rtr-red text-white px-4 py-2 rounded text-xs font-medium hover:bg-[#c0001f] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Scenario
          </button>
        </div>
      )}

      {/* Recent sessions */}
      {recent.length > 0 && (
        <section className="fade-in-up">
          <h2 className="text-xs font-semibold text-rtr-dim uppercase tracking-wider mb-3">
            Recent Exercises
          </h2>
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

function Stat({
  icon, label, value, suffix = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
}) {
  const displayed = useCountUp(value);
  return (
    <div className="bg-rtr-panel border border-rtr-border rounded-xl p-5 stat-shimmer card-lift fade-in-up">
      <div className="mb-3">{icon}</div>
      <p className="text-2xl font-bold text-rtr-text font-mono">
        {displayed}{suffix}
      </p>
      <p className="text-xs text-rtr-muted mt-0.5">{label}</p>
    </div>
  );
}

function ScenarioCard({ scenario, onRun }: { scenario: any; onRun: () => void }) {
  const hasCover = scenario.imageUrl || scenario.coverGradient;
  return (
    <div className="bg-rtr-panel border border-rtr-border rounded-xl overflow-hidden card-lift group fade-in-up cursor-pointer"
      onClick={onRun}
    >
      {/* Cover */}
      {hasCover && (
        <div className="relative h-24 overflow-hidden"
          style={{ background: scenario.coverGradient ? `linear-gradient(${scenario.coverGradient})` : "#15171a" }}>
          {scenario.imageUrl && (
            <img src={scenario.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:opacity-60 transition-opacity" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-rtr-panel to-transparent" />
          {/* Quick-run overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <span className="flex items-center gap-1.5 text-xs text-white font-semibold bg-rtr-red/90 px-3 py-1.5 rounded-full">
              <PlayCircle className="w-3.5 h-3.5" /> Run scenario
            </span>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${DIFFICULTY_COLOUR[scenario.difficulty]}`}>
            {DIFFICULTY_LABEL[scenario.difficulty]}
          </span>
          <span className="text-xs text-rtr-dim bg-rtr-elevated px-2 py-0.5 rounded">
            {SCENARIO_TYPE_LABELS[scenario.type]}
          </span>
        </div>
        <p className="text-sm font-semibold text-rtr-text mb-1">{scenario.title}</p>
        <p className="text-xs text-rtr-muted mb-3 line-clamp-2">{scenario.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-rtr-dim">
            {scenario.injects.length} injects · {formatDuration(scenario.durationMin)}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onRun(); }}
            className="flex items-center gap-1.5 text-xs text-white bg-rtr-red hover:bg-[#c0001f] px-3 py-1.5 rounded transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Run
          </button>
        </div>
      </div>
    </div>
  );
}
