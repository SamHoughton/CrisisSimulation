import { useStore, getAllScenarios } from "@/store";
import { Plus, PlayCircle, FileText, BookOpen, ChevronRight, Clock, AlertTriangle } from "lucide-react";
import { SCENARIO_TYPE_LABELS, DIFFICULTY_COLOUR, DIFFICULTY_LABEL, formatDuration } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-rtr-text">Dashboard</h1>
          <p className="text-rtr-muted text-sm mt-0.5">
            Run tabletop crisis exercises with your executive team
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
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Stat icon={<BookOpen className="w-4 h-4 text-rtr-green" />}  label="Scenarios available" value={allScenarios.length} />
        <Stat icon={<FileText className="w-4 h-4 text-rtr-green" />}  label="Exercises run"        value={pastSessions.length} />
        <Stat icon={<Clock className="w-4 h-4 text-rtr-muted" />}    label="Hours simulated"      value={`${Math.round(pastSessions.length * 1.5)}h`} />
      </div>

      {/* Active session banner */}
      {session && session.status !== "ended" && (
        <div className="mb-6">
          <button
            onClick={() => setView("runner")}
            className="w-full flex items-center gap-4 bg-rtr-red/8 border border-rtr-red/30 rounded-xl p-4 hover:bg-rtr-red/12 transition-colors text-left"
          >
            <AlertTriangle className="w-5 h-5 text-rtr-red shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-rtr-text">{session.scenario.title}</p>
              <p className="text-xs text-rtr-muted mt-0.5">
                Session {session.status} · {session.liveInjects.length}/{session.scenario.injects.length} injects released
              </p>
            </div>
            <span className="text-xs font-semibold text-rtr-red bg-rtr-red/15 px-2 py-0.5 rounded-full font-mono">
              {session.status === "active" ? "LIVE" : session.status.toUpperCase()}
            </span>
            <ChevronRight className="w-4 h-4 text-rtr-dim" />
          </button>
        </div>
      )}

      {/* Quick start */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-rtr-dim uppercase tracking-wider">
            Quick Start — Scenario Templates
          </h2>
          <button onClick={() => setView("library")} className="text-xs text-rtr-green hover:underline">
            View all
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {allScenarios.filter((s) => s.isTemplate).slice(0, 4).map((s) => (
            <ScenarioCard key={s.id} scenario={s} onRun={() => {
              useStore.getState().setEditingScenario(s.id);
              setView("setup");
            }} />
          ))}
        </div>
      </section>

      {/* Recent sessions */}
      {recent.length > 0 && (
        <section>
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
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-rtr-elevated transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-rtr-text truncate">{s.scenario.title}</p>
                  <p className="text-xs text-rtr-muted mt-0.5">
                    {SCENARIO_TYPE_LABELS[s.scenario.type]} · {s.participants.length} participants ·{" "}
                    {formatDistanceToNow(new Date(s.startedAt), { addSuffix: true })}
                  </p>
                </div>
                {s.report ? (
                  <span className="text-xs font-semibold text-rtr-green bg-rtr-green/10 px-2 py-0.5 rounded-full">
                    Report ready · {s.report.overallScore}/100
                  </span>
                ) : (
                  <span className="text-xs text-rtr-dim bg-rtr-elevated px-2 py-0.5 rounded-full">
                    No report
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-rtr-dim" />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-rtr-panel border border-rtr-border rounded-xl p-5">
      <div className="mb-3">{icon}</div>
      <p className="text-2xl font-bold text-rtr-text font-mono">{value}</p>
      <p className="text-xs text-rtr-muted mt-0.5">{label}</p>
    </div>
  );
}

function ScenarioCard({ scenario, onRun }: { scenario: any; onRun: () => void }) {
  return (
    <div className="bg-rtr-panel border border-rtr-border rounded-xl p-4 hover:border-rtr-border-light transition-colors">
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
          onClick={onRun}
          className="flex items-center gap-1.5 text-xs text-white bg-rtr-red hover:bg-[#c0001f] px-3 py-1.5 rounded transition-colors"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          Run
        </button>
      </div>
    </div>
  );
}
