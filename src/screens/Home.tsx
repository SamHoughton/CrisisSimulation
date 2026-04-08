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
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Run tabletop crisis exercises with your executive team
          </p>
        </div>
        <button
          onClick={() => { useStore.getState().setEditingScenario(null); setView("builder"); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Scenario
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Stat icon={<BookOpen className="w-5 h-5 text-blue-500" />}  label="Scenarios available" value={allScenarios.length} />
        <Stat icon={<FileText className="w-5 h-5 text-emerald-500" />} label="Exercises run" value={pastSessions.length} />
        <Stat icon={<Clock className="w-5 h-5 text-purple-500" />}   label="Hours simulated" value={`${Math.round(pastSessions.length * 1.5)}h`} />
      </div>

      {/* Active session banner */}
      {session && session.status !== "ended" && (
        <div className="mb-6">
          <button
            onClick={() => setView("runner")}
            className="w-full flex items-center gap-4 bg-red-50 border border-red-200 rounded-xl p-4 hover:bg-red-100/70 transition-colors text-left"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {session.scenario.title}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Session {session.status} ·{" "}
                {session.liveInjects.length}/{session.scenario.injects.length} injects released
              </p>
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
              {session.status === "active" ? "LIVE" : session.status.toUpperCase()}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}

      {/* Quick start */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Quick Start — Scenario Templates
          </h2>
          <button
            onClick={() => setView("library")}
            className="text-xs text-blue-600 hover:underline"
          >
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
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Recent Exercises
          </h2>
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
            {recent.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  useStore.getState().setViewingSession(s.id);
                  // load session into active state so Report can read it
                  useStore.setState({ session: s });
                  setView("report");
                }}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {s.scenario.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {SCENARIO_TYPE_LABELS[s.scenario.type]} ·{" "}
                    {s.participants.length} participants ·{" "}
                    {formatDistanceToNow(new Date(s.startedAt), { addSuffix: true })}
                  </p>
                </div>
                {s.report ? (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Report ready · {s.report.overallScore}/100
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    No report
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-300" />
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
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="mb-3">{icon}</div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

function ScenarioCard({ scenario, onRun }: { scenario: any; onRun: () => void }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
      <div className="flex items-start gap-2 mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${DIFFICULTY_COLOUR[scenario.difficulty]}`}>
          {DIFFICULTY_LABEL[scenario.difficulty]}
        </span>
        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
          {SCENARIO_TYPE_LABELS[scenario.type]}
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-900 mb-1">{scenario.title}</p>
      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{scenario.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {scenario.injects.length} injects · {formatDuration(scenario.durationMin)}
        </span>
        <button
          onClick={onRun}
          className="flex items-center gap-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          Run
        </button>
      </div>
    </div>
  );
}
