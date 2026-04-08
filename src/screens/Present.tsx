import { useState, useEffect } from "react";
import { ShieldAlert, GitBranch, Clock } from "lucide-react";
import { cn, ROLE_SHORT, ROLE_COLOUR, SCENARIO_TYPE_LABELS, DIFFICULTY_LABEL } from "@/lib/utils";
import type { Inject, Scenario } from "@/types";

type PresentState =
  | { phase: "waiting"; scenario: Scenario | null }
  | { phase: "briefing"; scenario: Scenario }
  | { phase: "inject"; inject: Inject; num: number }
  | { phase: "adhoc"; body: string }
  | { phase: "paused" }
  | { phase: "ended" };

export function Present() {
  const [state, setState] = useState<PresentState>({ phase: "waiting", scenario: null });
  const [injectCount, setInjectCount] = useState(0);

  useEffect(() => {
    const bc = new BroadcastChannel("crisis-present");

    bc.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "inject") {
        setInjectCount((n) => n + 1);
        setState({ phase: "inject", inject: msg.inject, num: injectCount + 1 });
      } else if (msg.type === "adhoc") {
        setState({ phase: "adhoc", body: msg.body });
      } else if (msg.type === "status") {
        if (msg.status === "active" && msg.scenario) {
          // First launch — show briefing if present
          if (msg.scenario.briefing) {
            setState({ phase: "briefing", scenario: msg.scenario });
          } else {
            setState({ phase: "waiting", scenario: msg.scenario });
          }
        } else if (msg.status === "paused") {
          setState({ phase: "paused" });
        } else if (msg.status === "ended") {
          setState({ phase: "ended" });
        } else if (msg.scenario) {
          setState({ phase: "waiting", scenario: msg.scenario });
        }
      }
    };

    return () => bc.close();
  }, [injectCount]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {state.phase === "waiting"  && <WaitingScreen scenario={state.scenario} />}
      {state.phase === "briefing" && <BriefingScreen scenario={state.scenario} />}
      {state.phase === "inject"   && <InjectScreen inject={state.inject} num={state.num} />}
      {state.phase === "adhoc"    && <AdHocScreen body={state.body} />}
      {state.phase === "paused"   && <PausedScreen />}
      {state.phase === "ended"    && <EndedScreen />}
    </div>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function WaitingScreen({ scenario }: { scenario: Scenario | null }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-8">
        <ShieldAlert className="w-10 h-10 text-blue-400" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">
        {scenario?.title ?? "CrisisTabletop"}
      </h1>
      {scenario && (
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-slate-400">
            {SCENARIO_TYPE_LABELS[scenario.type]}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-sm text-slate-400">
            {DIFFICULTY_LABEL[scenario.difficulty]}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-sm text-slate-400">
            {scenario.injects.length} injects
          </span>
        </div>
      )}
      <div className="flex items-center gap-2 text-slate-600 text-sm">
        <Clock className="w-4 h-4 animate-pulse" />
        Waiting for facilitator to begin…
      </div>
    </div>
  );
}

function BriefingScreen({ scenario }: { scenario: Scenario }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-16 max-w-4xl mx-auto w-full">
      <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
        Scenario Briefing
      </p>
      <h1 className="text-4xl font-bold text-white mb-8 text-center leading-tight">
        {scenario.title}
      </h1>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full">
        <p className="text-lg text-slate-300 leading-relaxed text-center">
          {scenario.briefing}
        </p>
      </div>
      {scenario.roles.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-8 justify-center">
          {scenario.roles.map((r) => (
            <span
              key={r}
              className={`text-sm font-bold px-4 py-2 rounded-xl ${ROLE_COLOUR[r]}`}
            >
              {ROLE_SHORT[r]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function InjectScreen({ inject, num }: { inject: Inject; num: number }) {
  return (
    <div className="flex-1 flex flex-col px-16 py-12 max-w-5xl mx-auto w-full inject-arrive">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
            New Development
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600">
            {new Date().toLocaleTimeString()}
          </span>
          <span className="text-xs font-semibold text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
            Inject {num}
          </span>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-6">{inject.title}</h2>

      {/* Body */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8 flex-1">
        <p className="text-xl text-slate-200 leading-relaxed">{inject.body}</p>
      </div>

      {/* Decision point indicator */}
      {inject.isDecisionPoint && (
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              Decision Required
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {inject.decisionOptions.map((opt) => (
              <div
                key={opt.key}
                className="bg-slate-900/60 border border-amber-700/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-amber-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {opt.key}
                  </span>
                  <span className="text-white font-medium">{opt.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Target roles */}
      {inject.targetRoles.length > 0 && (
        <div className="flex items-center gap-2 mt-5">
          <span className="text-xs text-slate-600">Directed at:</span>
          {inject.targetRoles.map((r) => (
            <span key={r} className={`text-xs font-bold px-2 py-0.5 rounded ${ROLE_COLOUR[r]}`}>
              {ROLE_SHORT[r]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function AdHocScreen({ body }: { body: string }) {
  return (
    <div className="flex-1 flex flex-col px-16 py-12 max-w-5xl mx-auto w-full inject-arrive">
      <div className="flex items-center gap-3 mb-8">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
        </span>
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          New Development
        </span>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex-1">
        <p className="text-xl text-slate-200 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function PausedScreen() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-4 border-amber-500/30 flex items-center justify-center mx-auto mb-4">
          <div className="flex gap-1.5">
            <div className="w-2 h-6 bg-amber-400 rounded-full" />
            <div className="w-2 h-6 bg-amber-400 rounded-full" />
          </div>
        </div>
        <p className="text-xl font-semibold text-amber-400">Session Paused</p>
        <p className="text-slate-600 text-sm mt-2">The facilitator will resume shortly</p>
      </div>
    </div>
  );
}

function EndedScreen() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-emerald-400" />
        </div>
        <p className="text-3xl font-bold text-white mb-2">Exercise Complete</p>
        <p className="text-slate-500">Thank you for participating.</p>
      </div>
    </div>
  );
}
