import { useState, useEffect, useRef } from "react";
import { useStore, getCurrentLiveInject, getNextInject, getReachableInjectIds } from "@/store";
import {
  Send, Pause, Play, Square, Plus, GitBranch,
  Clock, Monitor, Pencil, Check, Eye, Timer, RotateCcw,
} from "lucide-react";
import {
  cn, ROLE_SHORT, ROLE_COLOUR, formatElapsed,
} from "@/lib/utils";
import type { ExecRole, DecisionEntry } from "@/types";

const OPTION_COLOURS = [
  "text-blue-400 bg-blue-500/15 border-blue-500/30",
  "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  "text-amber-400 bg-amber-500/15 border-amber-500/30",
  "text-purple-400 bg-purple-500/15 border-purple-500/30",
];
const OPTION_TEXT = ["text-blue-400", "text-emerald-400", "text-amber-400", "text-purple-400"];
const OPTION_BAR  = ["bg-blue-400", "bg-emerald-400", "bg-amber-400", "bg-purple-400"];

export function Runner() {
  const session          = useStore((s) => s.session);
  const launchSession    = useStore((s) => s.launchSession);
  const pauseSession     = useStore((s) => s.pauseSession);
  const resumeSession    = useStore((s) => s.resumeSession);
  const endSession       = useStore((s) => s.endSession);
  const releaseInject    = useStore((s) => s.releaseInject);
  const addDecision      = useStore((s) => s.addDecision);
  const revealVotes      = useStore((s) => s.revealVotes);
  const updateInjectNote = useStore((s) => s.updateInjectNote);
  const addNote          = useStore((s) => s.addNote);
  const setView          = useStore((s) => s.setView);

  const [elapsed, setElapsed]       = useState("00:00");
  const [noteText, setNoteText]     = useState("");
  const [adHocText, setAdHocText]   = useState("");
  const [showAdHoc, setShowAdHoc]   = useState(false);
  const [voteRevealed, setVoteRevealed] = useState<Record<string, boolean>>({});

  // Per-inject countdown timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentLive  = getCurrentLiveInject(session);
  const nextInject   = getNextInject(session);
  const allReleased  = session ? new Set(session.liveInjects.map((l) => l.injectId)) : new Set();
  const reachable    = getReachableInjectIds(session);

  // Session elapsed clock
  useEffect(() => {
    if (session?.status !== "active") return;
    const tick = () => setElapsed(formatElapsed(session.startedAt));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session?.status, session?.startedAt]);

  // Open present window on mount
  useEffect(() => {
    if (!session) return;
    window.open(
      `${window.location.href.split("?")[0]}#present`, "crisis-present",
      "width=1280,height=720,menubar=no,toolbar=no,location=no"
    );
  }, []);

  // Broadcast session status changes
  useEffect(() => {
    if (!session) return;
    const bc = new BroadcastChannel("crisis-present");
    bc.postMessage({ type: "status", status: session.status, scenario: session.scenario });
    bc.close();
  }, [session?.status]);

  // Reset timer when inject changes
  useEffect(() => {
    stopTimer();
    const inj = session?.scenario.injects.find((i) => i.id === currentLive?.injectId);
    if (inj?.timerMinutes) {
      setTimerSeconds(inj.timerMinutes * 60);
    } else {
      setTimerSeconds(10 * 60); // default 10 min
    }
  }, [currentLive?.injectId]);

  // Timer countdown tick
  useEffect(() => {
    if (!timerRunning) return;
    timerRef.current = setInterval(() => {
      setTimerSeconds((s) => {
        if (s <= 1) { stopTimer(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  function stopTimer() {
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function broadcastTimer(action: "start" | "stop" | "reset", seconds: number) {
    const bc = new BroadcastChannel("crisis-present");
    bc.postMessage({ type: "timer", action, seconds });
    bc.close();
  }

  function handleStartTimer() {
    setTimerRunning(true);
    broadcastTimer("start", timerSeconds);
  }

  function handleStopTimer() {
    stopTimer();
    broadcastTimer("stop", timerSeconds);
  }

  function handleResetTimer() {
    stopTimer();
    const inj = session?.scenario.injects.find((i) => i.id === currentLive?.injectId);
    const secs = (inj?.timerMinutes ?? 10) * 60;
    setTimerSeconds(secs);
    broadcastTimer("reset", secs);
  }

  if (!session) {
    return (
      <div className="p-8 text-center text-rtr-muted">
        No active session.{" "}
        <button onClick={() => setView("library")} className="text-rtr-green underline">
          Pick a scenario
        </button>
      </div>
    );
  }

  const handleRelease = (injectId: string) => {
    releaseInject(injectId);
    if (session.status === "setup") launchSession();
  };

  const handleEnd = () => {
    if (!confirm("End the session and go to the report?")) return;
    endSession();
  };

  const handleNote = () => {
    if (!noteText.trim()) return;
    addNote(noteText);
    setNoteText("");
  };

  const handleReveal = (injectId: string) => {
    revealVotes(injectId);
    setVoteRevealed((v) => ({ ...v, [injectId]: true }));
  };

  const openPresent = () => {
    window.open(
      `${window.location.href.split("?")[0]}#present`, "crisis-present",
      "width=1280,height=720,menubar=no,toolbar=no,location=no"
    );
  };

  const orderedInjects = [...session.scenario.injects].sort((a, b) => a.order - b.order);
  const crisisPct = orderedInjects.length > 0
    ? Math.round((session.liveInjects.length / orderedInjects.length) * 100)
    : 0;

  const timerUrgent = timerSeconds > 0 && timerSeconds <= 60;
  const timerMins   = Math.floor(timerSeconds / 60);
  const timerSecs   = timerSeconds % 60;
  const timerLabel  = `${String(timerMins).padStart(2, "0")}:${String(timerSecs).padStart(2, "0")}`;

  return (
    <div className="flex h-full flex-col bg-rtr-base">
      {/* ── Control bar ─────────────────────────────────────────────────────── */}
      <div
        className="flex flex-col bg-rtr-panel sticky top-0 z-20"
        style={{
          borderBottom: `1px solid ${crisisPct < 40 ? "#1e2128" : crisisPct < 70 ? "rgba(245,158,11,0.35)" : "rgba(232,0,45,0.45)"}`,
          boxShadow: crisisPct >= 70
            ? "0 2px 24px rgba(232,0,45,0.1)"
            : crisisPct >= 40
            ? "0 2px 16px rgba(245,158,11,0.06)"
            : "none",
          transition: "border-color 0.8s ease, box-shadow 0.8s ease",
        }}
      >
        {/* Crisis escalation bar */}
        <div className="h-1 w-full bg-rtr-elevated overflow-hidden">
          <div
            className="h-full crisis-fill"
            style={{
              width: `${crisisPct}%`,
              background: crisisPct < 40
                ? "#4afe91"
                : crisisPct < 70
                ? "#f59e0b"
                : "#e8002d",
            }}
          />
        </div>
        <div className="flex items-center gap-4 px-5 py-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-rtr-text truncate">{session.scenario.title}</h1>
            <p className="text-xs text-rtr-dim font-mono">
              {session.liveInjects.length}/{orderedInjects.length} injects · {session.participants.length} participants
            </p>
          </div>

          {/* Inject timer */}
          {currentLive && (
            <div className="flex items-center gap-1.5 border border-rtr-border rounded-lg px-3 py-1.5 bg-rtr-elevated">
              <Timer className="w-3.5 h-3.5 text-rtr-dim shrink-0" />
              <span className={cn("font-mono text-sm font-semibold w-14 text-center",
                timerUrgent ? "timer-urgent" : "text-rtr-text")}>
                {timerLabel}
              </span>
              {!timerRunning ? (
                <button onClick={handleStartTimer}
                  className="text-rtr-green hover:opacity-80 transition-opacity">
                  <Play className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button onClick={handleStopTimer}
                  className="text-amber-400 hover:opacity-80 transition-opacity">
                  <Pause className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={handleResetTimer}
                className="text-rtr-dim hover:text-rtr-muted transition-colors">
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className={cn("font-mono text-sm font-medium flex items-center gap-1.5",
            session.status === "active" ? "text-rtr-text" : "text-rtr-dim")}>
            <Clock className="w-4 h-4" />{elapsed}
          </div>
          <div className={cn("text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 font-mono",
            session.status === "active" && "bg-rtr-red/15 text-rtr-red",
            session.status === "paused" && "bg-amber-500/15 text-amber-400",
            session.status === "setup"  && "bg-rtr-elevated text-rtr-muted",
            session.status === "ended"  && "bg-rtr-green/15 text-rtr-green",
          )}>
            {session.status === "active" && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rtr-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rtr-red" />
              </span>
            )}
            {session.status.toUpperCase()}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openPresent}
              className="flex items-center gap-1.5 text-xs border border-rtr-border-light px-3 py-1.5 rounded hover:bg-rtr-elevated transition-colors text-rtr-muted">
              <Monitor className="w-3.5 h-3.5" />Present
            </button>
            {session.status === "active" && (
              <button onClick={pauseSession}
                className="flex items-center gap-1.5 text-xs border border-rtr-border-light px-3 py-1.5 rounded hover:bg-rtr-elevated text-rtr-muted transition-colors">
                <Pause className="w-3.5 h-3.5" />Pause
              </button>
            )}
            {session.status === "paused" && (
              <button onClick={resumeSession}
                className="flex items-center gap-1.5 text-xs border border-rtr-border-light px-3 py-1.5 rounded hover:bg-rtr-elevated text-rtr-muted transition-colors">
                <Play className="w-3.5 h-3.5" />Resume
              </button>
            )}
            <button onClick={handleEnd}
              className="flex items-center gap-1.5 text-xs border border-rtr-red/30 text-red-400 px-3 py-1.5 rounded hover:bg-rtr-red/10 transition-colors">
              <Square className="w-3.5 h-3.5" />End
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: inject queue ───────────────────────────────────────────── */}
        <div className="w-48 md:w-56 lg:w-64 border-r border-rtr-border flex flex-col overflow-hidden shrink-0 bg-rtr-panel">
          <div className="px-4 py-2.5 border-b border-rtr-border">
            <p className="text-xs font-semibold text-rtr-dim uppercase tracking-wider">Inject Queue</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {orderedInjects.map((inj, idx) => {
              const released  = allReleased.has(inj.id);
              const isNext    = inj.id === nextInject?.id;
              const isLive    = currentLive?.injectId === inj.id;
              const onPath    = reachable.has(inj.id);
              const hasBranch = inj.branches && inj.branches.length > 0;

              return (
                <div key={inj.id} className={cn(
                  "rounded border p-3 text-xs transition-colors",
                  released && !isLive ? "border-rtr-green/20 bg-rtr-green/5 opacity-60"
                  : isLive  ? "border-rtr-red/40 bg-rtr-red/8"
                  : isNext  ? "border-rtr-red/30 bg-rtr-red/5"
                  : !onPath ? "border-rtr-border/40 bg-rtr-base opacity-35"
                  :           "border-rtr-border bg-rtr-elevated"
                )}>
                  <div className="flex items-start gap-2 mb-1.5">
                    <span className="font-bold text-rtr-dim font-mono shrink-0">{idx + 1}</span>
                    <span className={cn("font-medium flex-1 truncate",
                      released && !isLive ? "text-rtr-green line-through"
                      : isLive ? "text-rtr-red" : isNext ? "text-rtr-text" : "text-rtr-muted"
                    )}>
                      {inj.title}
                    </span>
                    {hasBranch && <GitBranch className="w-3 h-3 text-amber-400 shrink-0" />}
                  </div>
                  <div className="flex items-center justify-between">
                    {released && !isLive ? (
                      <span className="text-rtr-green">✓ Done</span>
                    ) : isNext || (!released && !isLive && orderedInjects[0]?.id === inj.id && session.liveInjects.length === 0) ? (
                      <button onClick={() => handleRelease(inj.id)}
                        className="flex items-center gap-1 text-rtr-red font-semibold hover:underline">
                        <Send className="w-3 h-3" />Release
                      </button>
                    ) : isLive ? (
                      <span className="text-rtr-red font-mono">LIVE</span>
                    ) : (
                      <span className="text-rtr-dim">{onPath ? "Queued" : "Off-path"}</span>
                    )}
                    {inj.timerMinutes && (
                      <span className="text-rtr-dim font-mono text-xs">{inj.timerMinutes}m</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ad-hoc inject */}
          <div className="p-3 border-t border-rtr-border">
            {showAdHoc ? (
              <div className="space-y-2">
                <textarea
                  value={adHocText}
                  onChange={(e) => setAdHocText(e.target.value)}
                  placeholder="Unplanned development…"
                  rows={3}
                  className="w-full text-xs bg-rtr-base border border-rtr-border-light text-rtr-text rounded px-2.5 py-2 resize-none focus:outline-none focus:border-rtr-green placeholder:text-rtr-dim"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!adHocText.trim()) return;
                      const bc = new BroadcastChannel("crisis-present");
                      bc.postMessage({ type: "adhoc", body: adHocText });
                      bc.close();
                      setAdHocText(""); setShowAdHoc(false);
                    }}
                    className="flex-1 text-xs bg-amber-500 text-white py-1.5 rounded hover:bg-amber-600"
                  >Send</button>
                  <button onClick={() => setShowAdHoc(false)}
                    className="text-xs border border-rtr-border px-2 rounded text-rtr-muted hover:text-rtr-text">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAdHoc(true)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-rtr-dim border border-dashed border-rtr-border py-2 rounded hover:border-amber-500/40 hover:text-amber-400 transition-colors">
                <Plus className="w-3.5 h-3.5" />Ad-hoc inject
              </button>
            )}
          </div>
        </div>

        {/* ── Centre: current inject ───────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentLive ? (
            <>
              <div className="px-6 py-5 border-b border-rtr-border bg-rtr-panel">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs font-semibold text-rtr-dim uppercase tracking-wider">Current Inject</p>
                  <p className="text-xs text-rtr-dim font-mono">
                    {new Date(currentLive.releasedAt).toLocaleTimeString()}
                  </p>
                </div>
                <h2 className="text-base font-semibold text-rtr-text mb-2">{currentLive.injectTitle}</h2>
                <p className="text-sm text-rtr-muted leading-relaxed mb-3">{currentLive.injectBody}</p>
                {(() => {
                  const inj = session.scenario.injects.find((i) => i.id === currentLive.injectId);
                  return inj?.facilitatorNotes ? (
                    <div className="bg-amber-500/8 border border-amber-500/20 rounded px-3 py-2 text-xs text-amber-300">
                      <span className="font-semibold">Facilitator: </span>{inj.facilitatorNotes}
                    </div>
                  ) : null;
                })()}
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* Voting panel for decision points */}
                {(() => {
                  const inj = session.scenario.injects.find((i) => i.id === currentLive.injectId);
                  if (!inj?.isDecisionPoint) return null;
                  const revealed = !!voteRevealed[currentLive.injectId];
                  return (
                    <VotingPanel
                      inject={inj}
                      decisions={currentLive.decisions}
                      participants={session.participants}
                      revealed={revealed}
                      onDecide={(role, name, optionKey, optionLabel) =>
                        addDecision(currentLive.injectId, { role, name, optionKey, optionLabel })
                      }
                      onReveal={() => handleReveal(currentLive.injectId)}
                    />
                  );
                })()}

                <InjectNoteEditor
                  value={currentLive.facilitatorNote ?? ""}
                  onChange={(note) => updateInjectNote(currentLive.injectId, note)}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-rtr-dim">
              {session.status === "setup"
                ? "Release the first inject from the queue to begin"
                : "No inject released yet"}
            </div>
          )}
        </div>

        {/* ── Right: session notes ─────────────────────────────────────────── */}
        <div className="hidden md:flex md:w-48 lg:w-56 border-l border-rtr-border flex-col overflow-hidden shrink-0 bg-rtr-panel">
          <div className="px-4 py-2.5 border-b border-rtr-border">
            <p className="text-xs font-semibold text-rtr-dim uppercase tracking-wider">Session Notes</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {session.notes.map((n, i) => (
              <div key={i} className="bg-amber-500/8 border border-amber-500/20 rounded px-2.5 py-2">
                <p className="text-xs text-rtr-text">{n.text}</p>
                <p className="text-xs text-amber-400/60 mt-1 font-mono">
                  {new Date(n.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
            {session.notes.length === 0 && (
              <p className="text-xs text-rtr-dim text-center pt-4">No notes yet</p>
            )}
          </div>
          <div className="p-3 border-t border-rtr-border">
            <div className="flex gap-1.5">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleNote(); }}}
                placeholder="Observation…"
                className="flex-1 text-xs bg-rtr-base border border-rtr-border text-rtr-text rounded px-2.5 py-2 focus:outline-none focus:border-rtr-green placeholder:text-rtr-dim"
              />
              <button onClick={handleNote} className="bg-rtr-red text-white rounded px-2 hover:bg-[#c0001f]">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Voting panel ─────────────────────────────────────────────────────────────

function VotingPanel({
  inject, decisions, participants, revealed, onDecide, onReveal,
}: {
  inject: any;
  decisions: DecisionEntry[];
  participants: { role: ExecRole; name: string }[];
  revealed: boolean;
  onDecide: (role: ExecRole, name: string, key: string, label: string) => void;
  onReveal: () => void;
}) {
  const allVoted = decisions.length >= participants.length;
  const counts: Record<string, number> = {};
  for (const d of decisions) counts[d.optionKey] = (counts[d.optionKey] ?? 0) + 1;
  const majority = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="border border-amber-500/25 bg-amber-500/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-amber-400" />
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Vote — {decisions.length}/{participants.length} cast
          </p>
        </div>
        {!revealed && (
          <button
            onClick={onReveal}
            className={cn(
              "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded transition-colors",
              allVoted
                ? "bg-amber-500 text-white hover:bg-amber-600 vote-pulse"
                : "border border-rtr-border text-rtr-dim hover:text-rtr-text"
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            {allVoted ? "Reveal Results!" : "Reveal early"}
          </button>
        )}
      </div>

      {/* Option tally */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {inject.decisionOptions.map((opt: any, i: number) => {
          const count    = counts[opt.key] ?? 0;
          const voters   = decisions.filter((d: DecisionEntry) => d.optionKey === opt.key);
          const isWinner = revealed && opt.key === majority;
          return (
            <div key={opt.key}
              className={cn("border rounded-lg p-3 transition-all", OPTION_COLOURS[i] ?? OPTION_COLOURS[0],
                isWinner && "ring-2 ring-amber-400/50 scale-[1.02]"
              )}>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono bg-white/10",
                  OPTION_TEXT[i] ?? OPTION_TEXT[0])}>
                  {opt.key}
                </span>
                <span className="text-xs font-medium text-rtr-text flex-1 line-clamp-1">{opt.label}</span>
                <span className={cn("text-xl font-bold font-mono vote-count", OPTION_TEXT[i] ?? OPTION_TEXT[0])}>
                  {count}
                </span>
              </div>
              <div className="h-1 bg-white/10 rounded-full mb-1.5">
                <div className={cn("h-full rounded-full transition-all duration-500", OPTION_BAR[i] ?? OPTION_BAR[0])}
                  style={{ width: participants.length > 0 ? `${(count / participants.length) * 100}%` : "0%" }} />
              </div>
              {voters.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {voters.map((v: DecisionEntry) => (
                    <span key={v.role} className={`text-xs font-bold px-1.5 py-0.5 rounded ${ROLE_COLOUR[v.role]}`}>
                      {ROLE_SHORT[v.role]}
                    </span>
                  ))}
                </div>
              )}
              {isWinner && <div className="mt-1 text-xs font-semibold text-amber-400 font-mono">▲ MAJORITY</div>}
            </div>
          );
        })}
      </div>

      {/* Cast votes */}
      <div className="space-y-2 border-t border-rtr-border pt-3">
        <p className="text-xs text-rtr-dim mb-2">Cast votes:</p>
        {participants.map((p) => {
          const existing = decisions.find((d) => d.role === p.role);
          if (existing) return null;
          return (
            <div key={p.role} className="flex items-center gap-2">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${ROLE_COLOUR[p.role]}`}>
                {ROLE_SHORT[p.role]}
              </span>
              <div className="flex gap-1">
                {inject.decisionOptions.map((opt: any, i: number) => (
                  <button key={opt.key}
                    onClick={() => onDecide(p.role, p.name, opt.key, opt.label)}
                    className={cn("text-xs px-2.5 py-1 rounded font-semibold transition-colors font-mono border",
                      OPTION_COLOURS[i] ?? OPTION_COLOURS[0],
                      "hover:opacity-80"
                    )}>
                    {opt.key}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {decisions.length === participants.length && (
          <p className="text-xs text-rtr-green flex items-center gap-1 font-mono">
            <Check className="w-3 h-3" />All votes cast
            {inject.branches?.length > 0 && !revealed && " — reveal to advance"}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Inject note editor ───────────────────────────────────────────────────────

function InjectNoteEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);

  if (!editing) {
    return (
      <button
        onClick={() => { setDraft(value); setEditing(true); }}
        className="w-full flex items-center gap-2 text-xs text-rtr-dim border border-dashed border-rtr-border py-2.5 px-3 rounded hover:border-rtr-border-light hover:text-rtr-muted transition-colors text-left"
      >
        <Pencil className="w-3.5 h-3.5 shrink-0" />
        {value || "Add facilitator note for this inject…"}
      </button>
    );
  }

  return (
    <div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        autoFocus
        className="w-full text-xs bg-rtr-elevated border border-rtr-border-light text-rtr-text rounded px-3 py-2 resize-none focus:outline-none focus:border-rtr-green placeholder:text-rtr-dim"
        placeholder="Facilitator note for this inject…"
      />
      <div className="flex gap-2 mt-1">
        <button onClick={() => { onChange(draft); setEditing(false); }}
          className="text-xs text-white bg-rtr-red hover:bg-[#c0001f] px-3 py-1 rounded">
          Save
        </button>
        <button onClick={() => setEditing(false)} className="text-xs text-rtr-muted hover:text-rtr-text">
          Cancel
        </button>
      </div>
    </div>
  );
}
