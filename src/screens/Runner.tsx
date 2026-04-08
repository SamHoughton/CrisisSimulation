import { useState, useEffect } from "react";
import { useStore, getCurrentLiveInject, getNextInject } from "@/store";
import {
  Send, Pause, Play, Square, Plus, ChevronDown, ChevronUp,
  GitBranch, Clock, Monitor, Pencil, Check, X,
} from "lucide-react";
import {
  cn, ROLE_SHORT, ROLE_COLOUR, ROLE_LONG, formatElapsed,
} from "@/lib/utils";
import type { ExecRole, ResponseEntry, DecisionEntry } from "@/types";

export function Runner() {
  const session          = useStore((s) => s.session);
  const launchSession    = useStore((s) => s.launchSession);
  const pauseSession     = useStore((s) => s.pauseSession);
  const resumeSession    = useStore((s) => s.resumeSession);
  const endSession       = useStore((s) => s.endSession);
  const releaseInject    = useStore((s) => s.releaseInject);
  const addResponse      = useStore((s) => s.addResponse);
  const addDecision      = useStore((s) => s.addDecision);
  const updateInjectNote = useStore((s) => s.updateInjectNote);
  const addNote          = useStore((s) => s.addNote);
  const setView          = useStore((s) => s.setView);

  const [elapsed, setElapsed]             = useState("00:00");
  const [noteText, setNoteText]           = useState("");
  const [adHocText, setAdHocText]         = useState("");
  const [showAdHoc, setShowAdHoc]         = useState(false);
  const [presentWindow, setPresentWindow] = useState<Window | null>(null);

  const currentLive = getCurrentLiveInject(session);
  const nextInject  = getNextInject(session);
  const allReleased = session ? new Set(session.liveInjects.map((l) => l.injectId)) : new Set();

  useEffect(() => {
    if (session?.status !== "active") return;
    const tick = () => setElapsed(formatElapsed(session.startedAt));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session?.status, session?.startedAt]);

  useEffect(() => {
    if (!session) return;
    const w = window.open(`${window.location.href.split("?")[0]}#present`, "crisis-present",
      "width=1280,height=720,menubar=no,toolbar=no,location=no"
    );
    if (w) setPresentWindow(w);
    return () => w?.close();
  }, []);

  useEffect(() => {
    if (!currentLive || !session) return;
    const inj = session.scenario.injects.find((i) => i.id === currentLive.injectId);
    if (inj) {
      const bc = new BroadcastChannel("crisis-present");
      bc.postMessage({ type: "inject", inject: inj });
      bc.close();
    }
  }, [currentLive?.injectId]);

  useEffect(() => {
    if (!session) return;
    const bc = new BroadcastChannel("crisis-present");
    bc.postMessage({ type: "status", status: session.status, scenario: session.scenario });
    bc.close();
  }, [session?.status]);

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

  const handleRelease = (injectId: string, adHoc = false) => {
    releaseInject(injectId);
    if (adHoc) { setAdHocText(""); setShowAdHoc(false); }
    if (session.status === "setup") launchSession();
  };

  const handleEnd = () => {
    if (!confirm("End the session and go to the report?")) return;
    const bc = new BroadcastChannel("crisis-present");
    bc.postMessage({ type: "status", status: "ended" });
    bc.close();
    endSession();
  };

  const handleNote = () => {
    if (!noteText.trim()) return;
    addNote(noteText);
    setNoteText("");
  };

  const openPresent = () => {
    const w = window.open(`${window.location.href.split("?")[0]}#present`, "crisis-present",
      "width=1280,height=720,menubar=no,toolbar=no,location=no"
    );
    if (w) setPresentWindow(w);
  };

  const orderedInjects = [...session.scenario.injects].sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-full flex-col bg-rtr-base">
      {/* Control bar */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-rtr-border bg-rtr-panel sticky top-0 z-20">
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-rtr-text truncate">{session.scenario.title}</h1>
          <p className="text-xs text-rtr-dim">
            {session.liveInjects.length}/{orderedInjects.length} injects · {session.participants.length} participants
          </p>
        </div>

        {/* Timer */}
        <div className={cn(
          "font-mono text-sm font-medium flex items-center gap-1.5",
          session.status === "active" ? "text-rtr-text" : "text-rtr-dim"
        )}>
          <Clock className="w-4 h-4" />{elapsed}
        </div>

        {/* Status */}
        <div className={cn(
          "text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 font-mono",
          session.status === "active"  && "bg-rtr-red/15 text-rtr-red",
          session.status === "paused"  && "bg-amber-500/15 text-amber-400",
          session.status === "setup"   && "bg-rtr-elevated text-rtr-muted",
          session.status === "ended"   && "bg-rtr-green/15 text-rtr-green",
        )}>
          {session.status === "active" && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rtr-red opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rtr-red" />
            </span>
          )}
          {session.status.toUpperCase()}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={openPresent}
            className="flex items-center gap-1.5 text-xs border border-rtr-border-light px-3 py-1.5 rounded hover:bg-rtr-elevated transition-colors text-rtr-muted"
          >
            <Monitor className="w-3.5 h-3.5" />Present
          </button>
          {session.status === "active" && (
            <button
              onClick={pauseSession}
              className="flex items-center gap-1.5 text-xs border border-rtr-border-light px-3 py-1.5 rounded hover:bg-rtr-elevated text-rtr-muted transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />Pause
            </button>
          )}
          {session.status === "paused" && (
            <button
              onClick={resumeSession}
              className="flex items-center gap-1.5 text-xs border border-rtr-border-light px-3 py-1.5 rounded hover:bg-rtr-elevated text-rtr-muted transition-colors"
            >
              <Play className="w-3.5 h-3.5" />Resume
            </button>
          )}
          <button
            onClick={handleEnd}
            className="flex items-center gap-1.5 text-xs border border-rtr-red/30 text-red-400 px-3 py-1.5 rounded hover:bg-rtr-red/10 transition-colors"
          >
            <Square className="w-3.5 h-3.5" />End
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: inject queue */}
        <div className="w-64 border-r border-rtr-border flex flex-col overflow-hidden shrink-0 bg-rtr-panel">
          <div className="px-4 py-2.5 border-b border-rtr-border">
            <p className="text-xs font-semibold text-rtr-dim uppercase tracking-wider">Inject Queue</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {orderedInjects.map((inj, idx) => {
              const released = allReleased.has(inj.id);
              const isNext   = inj.id === nextInject?.id;
              const live     = session.liveInjects.find((l) => l.injectId === inj.id);
              return (
                <div
                  key={inj.id}
                  className={cn(
                    "rounded border p-3 text-xs transition-colors",
                    released ? "border-rtr-green/20 bg-rtr-green/5 opacity-60"
                    : isNext  ? "border-rtr-red/30 bg-rtr-red/8"
                    :           "border-rtr-border bg-rtr-elevated"
                  )}
                >
                  <div className="flex items-start gap-2 mb-1.5">
                    <span className="font-bold text-rtr-dim font-mono">{idx + 1}</span>
                    <span className={cn(
                      "font-medium flex-1 truncate",
                      released ? "text-rtr-green line-through" : isNext ? "text-rtr-text" : "text-rtr-muted"
                    )}>
                      {inj.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    {released ? (
                      <span className="text-rtr-green">
                        ✓ {live?.responses.length ?? 0} response{live?.responses.length !== 1 ? "s" : ""}
                      </span>
                    ) : isNext ? (
                      <button
                        onClick={() => handleRelease(inj.id)}
                        className="flex items-center gap-1 text-rtr-red font-semibold hover:underline"
                      >
                        <Send className="w-3 h-3" />Release
                      </button>
                    ) : (
                      <span className="text-rtr-dim">Queued</span>
                    )}
                    {inj.isDecisionPoint && (
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <GitBranch className="w-3 h-3" />
                      </span>
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
                      setAdHocText("");
                      setShowAdHoc(false);
                    }}
                    className="flex-1 text-xs bg-amber-500 text-white py-1.5 rounded hover:bg-amber-600"
                  >
                    Send
                  </button>
                  <button onClick={() => setShowAdHoc(false)} className="text-xs border border-rtr-border px-2 rounded text-rtr-muted hover:text-rtr-text">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAdHoc(true)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-rtr-dim border border-dashed border-rtr-border py-2 rounded hover:border-amber-500/40 hover:text-amber-400 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />Ad-hoc inject
              </button>
            )}
          </div>
        </div>

        {/* Centre: current inject + response logging */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentLive ? (
            <>
              {/* Current inject */}
              <div className="px-6 py-5 border-b border-rtr-border bg-rtr-panel">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs font-semibold text-rtr-dim uppercase tracking-wider">
                    Current Inject
                  </p>
                  <p className="text-xs text-rtr-dim font-mono">
                    {new Date(currentLive.releasedAt).toLocaleTimeString()}
                  </p>
                </div>
                <h2 className="text-base font-semibold text-rtr-text mb-2">
                  {currentLive.injectTitle}
                </h2>
                <p className="text-sm text-rtr-muted leading-relaxed mb-3">
                  {currentLive.injectBody}
                </p>
                {(() => {
                  const inj = session.scenario.injects.find((i) => i.id === currentLive.injectId);
                  return inj?.facilitatorNotes ? (
                    <div className="bg-amber-500/8 border border-amber-500/20 rounded px-3 py-2 text-xs text-amber-300">
                      <span className="font-semibold">Note: </span>{inj.facilitatorNotes}
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Response logging */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold text-rtr-dim uppercase tracking-wider">
                    Log Responses
                  </h3>
                  <span className="text-xs text-rtr-dim font-mono">
                    {currentLive.responses.length} / {session.participants.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {session.participants.map((p) => (
                    <ResponseRow
                      key={p.role}
                      participant={p}
                      response={currentLive.responses.find((r) => r.role === p.role)}
                      onSubmit={(body) =>
                        addResponse(currentLive.injectId, {
                          role: p.role, name: p.name, body,
                          timestamp: new Date().toISOString(),
                        })
                      }
                    />
                  ))}
                </div>

                {/* Decision point */}
                {(() => {
                  const inj = session.scenario.injects.find((i) => i.id === currentLive.injectId);
                  if (!inj?.isDecisionPoint) return null;
                  return (
                    <DecisionPanel
                      inject={inj}
                      decisions={currentLive.decisions}
                      participants={session.participants}
                      onDecide={(role, name, optionKey, optionLabel) =>
                        addDecision(currentLive.injectId, { role, name, optionKey, optionLabel })
                      }
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

        {/* Right: notes */}
        <div className="w-56 border-l border-rtr-border flex flex-col overflow-hidden shrink-0 bg-rtr-panel">
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
              <button
                onClick={handleNote}
                className="bg-rtr-red text-white rounded px-2 hover:bg-[#c0001f]"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResponseRow({
  participant, response, onSubmit,
}: {
  participant: { role: ExecRole; name: string };
  response?: ResponseEntry;
  onSubmit: (body: string) => void;
}) {
  const [text, setText]       = useState("");
  const [editing, setEditing] = useState(!response);

  if (response && !editing) {
    return (
      <div className="flex gap-3 items-start inject-arrive">
        <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded ${ROLE_COLOUR[participant.role]}`}>
          {ROLE_SHORT[participant.role]}
        </span>
        <div className="flex-1 bg-rtr-elevated border border-rtr-border rounded-xl px-3 py-2">
          <p className="text-sm text-rtr-text">{response.body}</p>
          <p className="text-xs text-rtr-dim mt-1 font-mono">
            {participant.name || ROLE_LONG[participant.role]} · {new Date(response.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded ${ROLE_COLOUR[participant.role]}`}>
        {ROLE_SHORT[participant.role]}
      </span>
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`What did the ${participant.name || ROLE_SHORT[participant.role]} say?`}
          rows={2}
          className="w-full text-sm bg-rtr-elevated border border-rtr-border text-rtr-text rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-rtr-green placeholder:text-rtr-dim"
        />
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => { if (text.trim()) { onSubmit(text); setText(""); setEditing(false); } }}
            disabled={!text.trim()}
            className="flex items-center gap-1 text-xs text-white bg-rtr-red hover:bg-[#c0001f] px-2.5 py-1 rounded disabled:opacity-40 transition-colors"
          >
            <Check className="w-3 h-3" />Log
          </button>
          {response && (
            <button onClick={() => setEditing(false)} className="text-xs text-rtr-dim hover:text-rtr-muted">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DecisionPanel({
  inject, decisions, participants, onDecide,
}: {
  inject: any;
  decisions: DecisionEntry[];
  participants: { role: ExecRole; name: string }[];
  onDecide: (role: ExecRole, name: string, key: string, label: string) => void;
}) {
  return (
    <div className="mt-4 border border-amber-500/25 bg-amber-500/5 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <GitBranch className="w-4 h-4 text-amber-400" />
        <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
          Decision Point — {decisions.length}/{participants.length} decided
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {inject.decisionOptions.map((opt: any) => {
          const count  = decisions.filter((d) => d.optionKey === opt.key).length;
          const voters = decisions.filter((d) => d.optionKey === opt.key).map((d) => ROLE_SHORT[d.role]);
          return (
            <div key={opt.key} className="bg-rtr-elevated border border-rtr-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full flex items-center justify-center font-mono">
                  {opt.key}
                </span>
                <span className="text-xs font-medium text-rtr-text flex-1 truncate">{opt.label}</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{count}</span>
              </div>
              {voters.length > 0 && (
                <p className="text-xs text-rtr-dim">{voters.join(", ")}</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="space-y-2">
        {participants.map((p) => {
          const existing = decisions.find((d) => d.role === p.role);
          if (existing) return null;
          return (
            <div key={p.role} className="flex items-center gap-2">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${ROLE_COLOUR[p.role]}`}>
                {ROLE_SHORT[p.role]}
              </span>
              <span className="text-xs text-rtr-dim flex-1">chose:</span>
              <div className="flex gap-1">
                {inject.decisionOptions.map((opt: any) => (
                  <button
                    key={opt.key}
                    onClick={() => onDecide(p.role, p.name, opt.key, opt.label)}
                    className="text-xs bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 px-2 py-1 rounded font-semibold transition-colors font-mono"
                  >
                    {opt.key}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InjectNoteEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);

  if (!editing) {
    return (
      <button
        onClick={() => { setDraft(value); setEditing(true); }}
        className="mt-4 w-full flex items-center gap-2 text-xs text-rtr-dim border border-dashed border-rtr-border py-2.5 px-3 rounded hover:border-rtr-border-light hover:text-rtr-muted transition-colors text-left"
      >
        <Pencil className="w-3.5 h-3.5 shrink-0" />
        {value || "Add facilitator note for this inject…"}
      </button>
    );
  }

  return (
    <div className="mt-4">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        autoFocus
        className="w-full text-xs bg-rtr-elevated border border-rtr-border-light text-rtr-text rounded px-3 py-2 resize-none focus:outline-none focus:border-rtr-green placeholder:text-rtr-dim"
        placeholder="Facilitator note for this inject…"
      />
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => { onChange(draft); setEditing(false); }}
          className="text-xs text-white bg-rtr-red hover:bg-[#c0001f] px-3 py-1 rounded"
        >Save</button>
        <button onClick={() => setEditing(false)} className="text-xs text-rtr-muted hover:text-rtr-text">
          Cancel
        </button>
      </div>
    </div>
  );
}
