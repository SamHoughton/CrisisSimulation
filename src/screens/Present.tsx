import { useState, useEffect, useRef } from "react";
import { ShieldAlert, GitBranch, Clock, CheckCircle2 } from "lucide-react";
import { cn, ROLE_SHORT, ROLE_COLOUR, SCENARIO_TYPE_LABELS, DIFFICULTY_LABEL } from "@/lib/utils";
import type { DecisionEntry, Inject, Scenario } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VoteRecord {
  role: string;
  roleName: string;
  optionKey: string;
}

interface VoteState {
  votes: VoteRecord[];
  revealed: boolean;
  winner: string | null;
}

type PresentState =
  | { phase: "waiting"; scenario: Scenario | null }
  | { phase: "briefing"; scenario: Scenario }
  | { phase: "inject"; inject: Inject; num: number }
  | { phase: "adhoc"; body: string }
  | { phase: "paused" }
  | { phase: "ended" };

// ─── Option colours (A/B/C/D) ─────────────────────────────────────────────────
const OPT_COLOURS: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  A: { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.4)",  text: "#93c5fd", bar: "#3b82f6" },
  B: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.4)",  text: "#6ee7b7", bar: "#10b981" },
  C: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.4)",  text: "#fcd34d", bar: "#f59e0b" },
  D: { bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.4)",  text: "#d8b4fe", bar: "#a855f7" },
};
function optColour(key: string) {
  return OPT_COLOURS[key] ?? OPT_COLOURS.A;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function Present() {
  const [state, setState]       = useState<PresentState>({ phase: "waiting", scenario: null });
  const [voteState, setVoteState] = useState<VoteState>({ votes: [], revealed: false, winner: null });
  const injectCountRef          = useRef(0);

  useEffect(() => {
    const bc = new BroadcastChannel("crisis-present");

    bc.onmessage = (e) => {
      const msg = e.data;

      if (msg.type === "inject") {
        injectCountRef.current += 1;
        setState({ phase: "inject", inject: msg.inject, num: injectCountRef.current });
        setVoteState({ votes: [], revealed: false, winner: null });

      } else if (msg.type === "adhoc") {
        setState({ phase: "adhoc", body: msg.body });

      } else if (msg.type === "status") {
        if (msg.status === "active" && msg.scenario) {
          setState(msg.scenario.briefing
            ? { phase: "briefing", scenario: msg.scenario }
            : { phase: "waiting", scenario: msg.scenario });
        } else if (msg.status === "paused") {
          setState({ phase: "paused" });
        } else if (msg.status === "ended") {
          setState({ phase: "ended" });
        } else if (msg.scenario) {
          setState({ phase: "waiting", scenario: msg.scenario });
        }

      } else if (msg.type === "vote") {
        setVoteState((prev) => ({
          ...prev,
          votes: [...prev.votes, { role: msg.role, roleName: msg.roleName, optionKey: msg.optionKey }],
        }));

      } else if (msg.type === "vote-reveal") {
        const decisions: DecisionEntry[] = msg.decisions;
        // Tally
        const counts: Record<string, number> = {};
        for (const d of decisions) counts[d.optionKey] = (counts[d.optionKey] ?? 0) + 1;
        const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
        setVoteState({ votes: decisions.map((d) => ({ role: d.role, roleName: d.name || d.role, optionKey: d.optionKey })), revealed: true, winner });
      }
    };

    return () => bc.close();
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0a0b0d", color: "#e8eaf0" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-3 border-b"
        style={{ borderColor: "#1e2128", borderTop: "2px solid #e8002d" }}>
        <span className="brand-glow text-sm">CrisisTabletop</span>
        <LiveClock />
      </div>

      {state.phase === "waiting"  && <WaitingScreen scenario={state.scenario} />}
      {state.phase === "briefing" && <BriefingScreen scenario={state.scenario} />}
      {state.phase === "inject"   && (
        <InjectScreen inject={state.inject} num={state.num} voteState={voteState} />
      )}
      {state.phase === "adhoc"    && <AdHocScreen body={state.body} />}
      {state.phase === "paused"   && <PausedScreen />}
      {state.phase === "ended"    && <EndedScreen />}
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

// ─── Waiting ──────────────────────────────────────────────────────────────────

function WaitingScreen({ scenario }: { scenario: Scenario | null }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
        style={{ background: "rgba(232,0,45,0.1)", border: "1px solid rgba(232,0,45,0.25)" }}>
        <ShieldAlert className="w-10 h-10" style={{ color: "#e8002d" }} />
      </div>
      <h1 className="text-4xl font-bold mb-3">{scenario?.title ?? "CrisisTabletop"}</h1>
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

// ─── Briefing ─────────────────────────────────────────────────────────────────

function BriefingScreen({ scenario }: { scenario: Scenario }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-16 max-w-5xl mx-auto w-full">
      {scenario.imageUrl && (
        <div className="w-full h-40 rounded-2xl overflow-hidden mb-8"
          style={{ background: scenario.coverGradient ? `linear-gradient(${scenario.coverGradient})` : "#15171a" }}>
          <img src={scenario.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />
        </div>
      )}
      <p className="text-xs font-semibold uppercase tracking-widest mb-4 font-mono" style={{ color: "#4afe91" }}>
        Scenario Briefing
      </p>
      <h1 className="text-5xl font-bold mb-10 text-center leading-tight">{scenario.title}</h1>
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

// ─── Inject ───────────────────────────────────────────────────────────────────

function InjectScreen({ inject, num, voteState }: {
  inject: Inject;
  num: number;
  voteState: VoteState;
}) {
  const showVoting = inject.isDecisionPoint && inject.decisionOptions.length > 0;
  const totalVotes = voteState.votes.length;

  return (
    <div className="flex-1 flex flex-col px-10 py-10 max-w-6xl mx-auto w-full inject-arrive">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
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

      <div className={cn("flex gap-8", showVoting ? "items-start" : "flex-col")}>
        {/* Left: inject body */}
        <div className={cn("flex flex-col", showVoting ? "flex-1" : "w-full")}>
          {inject.imageUrl && (
            <div className="w-full h-36 rounded-xl overflow-hidden mb-5">
              <img src={inject.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <h2 className="text-3xl font-bold mb-5" style={{ color: "#e8eaf0" }}>{inject.title}</h2>
          <div className="rounded-2xl p-7" style={{ background: "#15171a", border: "1px solid #1e2128" }}>
            <p className="text-xl leading-relaxed" style={{ color: "#c5c8d8" }}>{inject.body}</p>
          </div>
          {inject.targetRoles.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs font-mono" style={{ color: "#4a4f65" }}>Directed at:</span>
              {inject.targetRoles.map((r) => (
                <span key={r} className={`text-xs font-bold px-2 py-0.5 rounded ${ROLE_COLOUR[r]}`}>
                  {ROLE_SHORT[r]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: voting panel */}
        {showVoting && (
          <VotingDisplay inject={inject} voteState={voteState} totalVotes={totalVotes} />
        )}
      </div>
    </div>
  );
}

// ─── Voting display ───────────────────────────────────────────────────────────

function VotingDisplay({ inject, voteState, totalVotes }: {
  inject: Inject;
  voteState: VoteState;
  totalVotes: number;
}) {
  const { votes, revealed, winner } = voteState;

  // Count per option
  const counts: Record<string, number> = {};
  for (const v of votes) counts[v.optionKey] = (counts[v.optionKey] ?? 0) + 1;
  const maxCount = Math.max(1, ...Object.values(counts));

  return (
    <div className="w-80 shrink-0 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <GitBranch className="w-4 h-4" style={{ color: "#fbbf24" }} />
        <span className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: "#fcd34d" }}>
          Decision Required
        </span>
        <span className="ml-auto text-xs font-mono" style={{ color: "#4a4f65" }}>
          {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Options */}
      {inject.decisionOptions.map((opt) => {
        const c        = optColour(opt.key);
        const count    = counts[opt.key] ?? 0;
        const pct      = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
        const barWidth = totalVotes === 0 ? 0 : (count / maxCount) * 100;
        const isWinner = revealed && winner === opt.key;
        const voters   = votes.filter((v) => v.optionKey === opt.key);

        return (
          <div key={opt.key}
            className={cn("rounded-xl p-4 transition-all duration-500", isWinner && "winner-glow")}
            style={{
              background: isWinner ? "rgba(74,254,145,0.1)" : c.bg,
              border: `1px solid ${isWinner ? "rgba(74,254,145,0.5)" : c.border}`,
            }}>
            {/* Option header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0"
                style={{ background: isWinner ? "rgba(74,254,145,0.2)" : c.bg, color: isWinner ? "#4afe91" : c.text, border: `1px solid ${isWinner ? "rgba(74,254,145,0.5)" : c.border}` }}>
                {opt.key}
              </span>
              <span className="text-sm font-medium flex-1" style={{ color: isWinner ? "#4afe91" : "#e8eaf0" }}>
                {opt.label}
              </span>
              {revealed && (
                <span className="text-sm font-bold font-mono vote-count" style={{ color: isWinner ? "#4afe91" : c.text }}>
                  {pct}%
                </span>
              )}
              {isWinner && (
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#4afe91" }} />
              )}
            </div>

            {/* Bar */}
            {revealed && (
              <div className="w-full h-1.5 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${barWidth}%`, background: isWinner ? "#4afe91" : c.bar }} />
              </div>
            )}

            {/* Voter names — show before reveal too */}
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

      {/* Winner banner */}
      {revealed && winner && (
        <div className="rounded-xl p-3 text-center" style={{ background: "rgba(74,254,145,0.08)", border: "1px solid rgba(74,254,145,0.25)" }}>
          <p className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: "#4afe91" }}>
            Majority: Option {winner}
          </p>
        </div>
      )}

      {/* Waiting indicator */}
      {!revealed && totalVotes === 0 && (
        <div className="text-center mt-2">
          <p className="text-xs font-mono" style={{ color: "#4a4f65" }}>Waiting for votes…</p>
        </div>
      )}
    </div>
  );
}

// ─── Ad-hoc ───────────────────────────────────────────────────────────────────

function AdHocScreen({ body }: { body: string }) {
  return (
    <div className="flex-1 flex flex-col px-16 py-12 max-w-5xl mx-auto w-full inject-arrive">
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
    <div className="flex-1 flex items-center justify-center">
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
    <div className="flex-1 flex items-center justify-center">
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
