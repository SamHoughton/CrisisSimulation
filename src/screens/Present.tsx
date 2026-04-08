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
  const [state, setState]         = useState<PresentState>({ phase: "waiting", scenario: null });
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
    <div className="min-h-screen flex flex-col" style={{ background: "#0a0b0d", color: "#e8eaf0" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-3 border-b" style={{ borderColor: "#1e2128", borderTop: "1px solid rgba(232,0,45,0.25)" }}>
        <span className="brand-glow text-sm">CrisisTabletop</span>
        <span className="text-xs font-mono" style={{ color: "#4a4f65" }}>
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      {state.phase === "waiting"  && <WaitingScreen scenario={state.scenario} />}
      {state.phase === "briefing" && <BriefingScreen scenario={state.scenario} />}
      {state.phase === "inject"   && <InjectScreen inject={state.inject} num={state.num} />}
      {state.phase === "adhoc"    && <AdHocScreen body={state.body} />}
      {state.phase === "paused"   && <PausedScreen />}
      {state.phase === "ended"    && <EndedScreen />}
    </div>
  );
}

function WaitingScreen({ scenario }: { scenario: Scenario | null }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
        style={{ background: "rgba(232,0,45,0.1)", border: "1px solid rgba(232,0,45,0.25)" }}>
        <ShieldAlert className="w-10 h-10" style={{ color: "#e8002d" }} />
      </div>
      <h1 className="text-4xl font-bold mb-3" style={{ color: "#e8eaf0" }}>
        {scenario?.title ?? "CrisisTabletop"}
      </h1>
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
        <Clock className="w-4 h-4 animate-pulse" />
        Waiting for facilitator to begin…
      </div>
    </div>
  );
}

function BriefingScreen({ scenario }: { scenario: Scenario }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-16 max-w-4xl mx-auto w-full">
      <p className="text-xs font-semibold uppercase tracking-widest mb-4 font-mono" style={{ color: "#4afe91" }}>
        Scenario Briefing
      </p>
      <h1 className="text-5xl font-bold mb-10 text-center leading-tight" style={{ color: "#e8eaf0" }}>
        {scenario.title}
      </h1>
      <div className="w-full rounded-2xl p-8" style={{ background: "#15171a", border: "1px solid #1e2128" }}>
        <p className="text-xl leading-relaxed text-center" style={{ color: "#c5c8d8" }}>
          {scenario.briefing}
        </p>
      </div>
      {scenario.roles.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-8 justify-center">
          {scenario.roles.map((r) => (
            <span key={r} className={`text-sm font-bold px-4 py-2 rounded-xl ${ROLE_COLOUR[r]}`}>
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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#e8002d" }} />
            <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: "#e8002d" }} />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: "#e8002d" }}>
            New Development
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono" style={{ color: "#4a4f65" }}>
            {new Date().toLocaleTimeString()}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full font-mono"
            style={{ color: "#8b8fa8", background: "#1c1f24", border: "1px solid #2a2e3a" }}>
            Inject {num}
          </span>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-6" style={{ color: "#e8eaf0" }}>{inject.title}</h2>

      {/* Body */}
      <div className="rounded-2xl p-8 mb-8 flex-1" style={{ background: "#15171a", border: "1px solid #1e2128" }}>
        <p className="text-xl leading-relaxed" style={{ color: "#c5c8d8" }}>{inject.body}</p>
      </div>

      {/* Decision point */}
      {inject.isDecisionPoint && (
        <div className="rounded-xl p-5" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-5 h-5" style={{ color: "#fbbf24" }} />
            <span className="text-sm font-bold uppercase tracking-wider font-mono" style={{ color: "#fcd34d" }}>
              Decision Required
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {inject.decisionOptions.map((opt) => (
              <div key={opt.key} className="rounded-xl p-4"
                style={{ background: "#15171a", border: "1px solid rgba(245,158,11,0.2)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold font-mono"
                    style={{ background: "rgba(245,158,11,0.2)", color: "#fcd34d" }}>
                    {opt.key}
                  </span>
                  <span className="font-medium" style={{ color: "#e8eaf0" }}>{opt.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Target roles */}
      {inject.targetRoles.length > 0 && (
        <div className="flex items-center gap-2 mt-5">
          <span className="text-xs font-mono" style={{ color: "#4a4f65" }}>Directed at:</span>
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
        <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: "#fbbf24" }}>
          New Development
        </span>
      </div>
      <div className="rounded-2xl p-8 flex-1" style={{ background: "#15171a", border: "1px solid #1e2128" }}>
        <p className="text-xl leading-relaxed" style={{ color: "#c5c8d8" }}>{body}</p>
      </div>
    </div>
  );
}

function PausedScreen() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ border: "3px solid rgba(245,158,11,0.3)" }}>
          <div className="flex gap-1.5">
            <div className="w-2 h-6 rounded-full bg-amber-400" />
            <div className="w-2 h-6 rounded-full bg-amber-400" />
          </div>
        </div>
        <p className="text-xl font-semibold" style={{ color: "#fbbf24" }}>Session Paused</p>
        <p className="text-sm mt-2" style={{ color: "#4a4f65" }}>The facilitator will resume shortly</p>
      </div>
    </div>
  );
}

function EndedScreen() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl mx-auto mb-6"
          style={{ background: "rgba(74,254,145,0.08)", border: "1px solid rgba(74,254,145,0.2)" }}>
          <ShieldAlert className="w-10 h-10" style={{ color: "#4afe91" }} />
        </div>
        <p className="text-4xl font-bold mb-2" style={{ color: "#e8eaf0" }}>Exercise Complete</p>
        <p style={{ color: "#8b8fa8" }}>Thank you for participating.</p>
      </div>
    </div>
  );
}
