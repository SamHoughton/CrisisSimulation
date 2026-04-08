import { useState, useEffect, useRef } from "react";
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
  const session         = useStore((s) => s.session);
  const launchSession   = useStore((s) => s.launchSession);
  const pauseSession    = useStore((s) => s.pauseSession);
  const resumeSession   = useStore((s) => s.resumeSession);
  const endSession      = useStore((s) => s.endSession);
  const releaseInject   = useStore((s) => s.releaseInject);
  const addResponse     = useStore((s) => s.addResponse);
  const addDecision     = useStore((s) => s.addDecision);
  const updateInjectNote = useStore((s) => s.updateInjectNote);
  const addNote         = useStore((s) => s.addNote);
  const setView         = useStore((s) => s.setView);

  const [elapsed, setElapsed]         = useState("00:00");
  const [noteText, setNoteText]       = useState("");
  const [adHocText, setAdHocText]     = useState("");
  const [showAdHoc, setShowAdHoc]     = useState(false);
  const [presentWindow, setPresentWindow] = useState<Window | null>(null);

  const currentLive  = getCurrentLiveInject(session);
  const nextInject   = getNextInject(session);
  const allReleased  = session ? new Set(session.liveInjects.map((l) => l.injectId)) : new Set();

  // Timer
  useEffect(() => {
    if (session?.status !== "active") return;
    const tick = () => setElapsed(formatElapsed(session.startedAt));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session?.status, session?.startedAt]);

  // Open present window on mount (if session is active or setup)
  useEffect(() => {
    if (!session) return;
    const w = window.open(`${window.location.href.split("?")[0]}#present`, "crisis-present",
      "width=1280,height=720,menubar=no,toolbar=no,location=no"
    );
    if (w) setPresentWindow(w);
    return () => w?.close();
  }, []);

  // Broadcast current inject whenever it changes
  useEffect(() => {
    if (!currentLive || !session) return;
    const inj = session.scenario.injects.find((i) => i.id === currentLive.injectId);
    if (inj) {
      const bc = new BroadcastChannel("crisis-present");
      bc.postMessage({ type: "inject", inject: inj });
      bc.close();
    }
  }, [currentLive?.injectId]);

  // Broadcast session status changes
  useEffect(() => {
    if (!session) return;
    const bc = new BroadcastChannel("crisis-present");
    bc.postMessage({ type: "status", status: session.status, scenario: session.scenario });
    bc.close();
  }, [session?.status]);

  if (!session) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active session.{" "}
        <button onClick={() => setView("library")} className="text-blue-600 underline">
          Pick a scenario
        </button>
      </div>
    );
  }

  const handleRelease = (injectId: string, adHoc = false) => {
    releaseInject(injectId);
    if (adHoc) {
      setAdHocText("");
      setShowAdHoc(false);
    }
    if (session.status === "setup") launchSession();
  };

  const handleEnd = () => {
    if (!confirm("End the session and go to the report?")) return;
    // Broadcast end
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
    <div className="flex h-full flex-col bg-white">
      {/* Control bar */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-slate-900 truncate">{session.scenario.title}</h1>
          <p className="text-xs text-slate-400">
            {session.liveInjects.length}/{orderedInjects.length} injects ·{" "}
            {session.participants.length} participants
          </p>
        </div>

        {/* Timer */}
        <div className={cn(
          "font-mono text-sm font-medium flex items-center gap-1.5",
          session.status === "active" ? "text-slate-800" : "text-slate-400"
        )}>
          <Clock className="w-4 h-4" />{elapsed}
        </div>

        {/* Status */}
        <div className={cn(
          "text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5",
          session.status === "active"  && "bg-red-50 text-red-600",
          session.status === "paused"  && "bg-amber-50 text-amber-600",
          session.status === "setup"   && "bg-slate-100 text-slate-500",
          session.status === "ended"   && "bg-emerald-50 text-emerald-600",
        )}>
          {session.status === "active" && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
          )}
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={openPresent}
            className="flex items-center gap-1.5 text-xs border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
          >
            <Monitor className="w-3.5 h-3.5" />Present
          </button>
          {session.status === "active" && (
            <button
              onClick={pauseSession}
              className="flex items-center gap-1.5 text-xs border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />Pause
            </button>
          )}
          {session.status === "paused" && (
            <button
              onClick={resumeSession}
              className="flex items-center gap-1.5 text-xs border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />Resume
            </button>
          )}
          <button
            onClick={handleEnd}
            className="flex items-center gap-1.5 text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Square className="w-3.5 h-3.5" />End
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: inject queue */}
        <div className="w-64 border-r border-slate-200 flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-2.5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inject Queue</p>
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
                    "rounded-lg border p-3 text-xs transition-colors",
                    released ? "border-emerald-100 bg-emerald-50/40 opacity-60"
                    : isNext  ? "border-blue-200 bg-blue-50"
                    :           "border-slate-200 bg-white"
                  )}
                >
                  <div className="flex items-start gap-2 mb-1.5">
                    <span className="font-bold text-slate-400">{idx + 1}</span>
                    <span className={cn(
                      "font-medium flex-1 truncate",
                      released ? "text-emerald-600 line-through" : "text-slate-700"
                    )}>
                      {inj.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    {released ? (
                      <span className="text-emerald-600">
                        ✓ {live?.responses.length ?? 0} response{live?.responses.length !== 1 ? "s" : ""}
                      </span>
                    ) : isNext ? (
                      <button
                        onClick={() => handleRelease(inj.id)}
                        className="flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                      >
                        <Send className="w-3 h-3" />Release
                      </button>
                    ) : (
                      <span className="text-slate-400">Queued</span>
                    )}
                    {inj.isDecisionPoint && (
                      <span className="flex items-center gap-0.5 text-amber-500">
                        <GitBranch className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ad-hoc inject */}
          <div className="p-3 border-t border-slate-100">
            {showAdHoc ? (
              <div className="space-y-2">
                <textarea
                  value={adHocText}
                  onChange={(e) => setAdHocText(e.target.value)}
                  placeholder="Unplanned development…"
                  rows={3}
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!adHocText.trim()) return;
                      // For ad-hoc, we broadcast directly without a template inject
                      const bc = new BroadcastChannel("crisis-present");
                      bc.postMessage({ type: "adhoc", body: adHocText });
                      bc.close();
                      setAdHocText("");
                      setShowAdHoc(false);
                    }}
                    className="flex-1 text-xs bg-amber-500 text-white py-1.5 rounded-lg hover:bg-amber-600"
                  >
                    Send
                  </button>
                  <button onClick={() => setShowAdHoc(false)} className="text-xs border border-slate-200 px-2 rounded-lg text-slate-500">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAdHoc(true)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 border border-dashed border-slate-200 py-2 rounded-lg hover:border-amber-300 hover:text-amber-500 transition-colors"
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
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Current Inject
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(currentLive.releasedAt).toLocaleTimeString()}
                  </p>
                </div>
                <h2 className="text-base font-semibold text-slate-900 mb-2">
                  {currentLive.injectTitle}
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  {currentLive.injectBody}
                </p>
                {/* Facilitator notes */}
                {(() => {
                  const inj = session.scenario.injects.find((i) => i.id === currentLive.injectId);
                  return inj?.facilitatorNotes ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
                      <span className="font-semibold">Note: </span>{inj.facilitatorNotes}
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Response logging */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Log Responses
                  </h3>
                  <span className="text-xs text-slate-400">
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
                          role: p.role,
                          name: p.name,
                          body,
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

                {/* Inject note */}
                <InjectNoteEditor
                  value={currentLive.facilitatorNote ?? ""}
                  onChange={(note) => updateInjectNote(currentLive.injectId, note)}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
              {session.status === "setup"
                ? "Release the first inject from the queue to begin"
                : "No inject released yet"}
            </div>
          )}
        </div>

        {/* Right: notes */}
        <div className="w-56 border-l border-slate-200 flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-2.5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Session Notes
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {session.notes.map((n, i) => (
              <div key={i} className="bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-2">
                <p className="text-xs text-slate-700">{n.text}</p>
                <p className="text-xs text-amber-500 mt-1">
                  {new Date(n.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
            {session.notes.length === 0 && (
              <p className="text-xs text-slate-300 text-center pt-4">No notes yet</p>
            )}
          </div>
          <div className="p-3 border-t border-slate-100">
            <div className="flex gap-1.5">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleNote(); }}}
                placeholder="Observation…"
                className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-300"
              />
              <button
                onClick={handleNote}
                className="bg-blue-600 text-white rounded-lg px-2 hover:bg-blue-700"
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

// ─── Response row ─────────────────────────────────────────────────────────────

function ResponseRow({
  participant, response, onSubmit,
}: {
  participant: { role: ExecRole; name: string };
  response?: ResponseEntry;
  onSubmit: (body: string) => void;
}) {
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(!response);

  if (response && !editing) {
    return (
      <div className="flex gap-3 items-start inject-arrive">
        <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded ${ROLE_COLOUR[participant.role]}`}>
          {ROLE_SHORT[participant.role]}
        </span>
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <p className="text-sm text-slate-700">{response.body}</p>
          <p className="text-xs text-slate-400 mt-1">
            {participant.name || ROLE_LONG[participant.role]} ·{" "}
            {new Date(response.timestamp).toLocaleTimeString()}
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
          className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-blue-300"
        />
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => { if (text.trim()) { onSubmit(text); setText(""); setEditing(false); } }}
            disabled={!text.trim()}
            className="flex items-center gap-1 text-xs text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1 rounded-lg disabled:opacity-40 transition-colors"
          >
            <Check className="w-3 h-3" />Log
          </button>
          {response && (
            <button onClick={() => setEditing(false)} className="text-xs text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Decision panel ───────────────────────────────────────────────────────────

function DecisionPanel({
  inject, decisions, participants, onDecide,
}: {
  inject: any;
  decisions: DecisionEntry[];
  participants: { role: ExecRole; name: string }[];
  onDecide: (role: ExecRole, name: string, key: string, label: string) => void;
}) {
  return (
    <div className="mt-4 border border-amber-200 bg-amber-50/40 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <GitBranch className="w-4 h-4 text-amber-600" />
        <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
          Decision Point — {decisions.length}/{participants.length} decided
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {inject.decisionOptions.map((opt: any) => {
          const count = decisions.filter((d) => d.optionKey === opt.key).length;
          const voters = decisions
            .filter((d) => d.optionKey === opt.key)
            .map((d) => ROLE_SHORT[d.role]);
          return (
            <div key={opt.key} className="bg-white border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center justify-center">
                  {opt.key}
                </span>
                <span className="text-xs font-medium text-slate-700 flex-1 truncate">{opt.label}</span>
                <span className="text-sm font-bold text-amber-700">{count}</span>
              </div>
              {voters.length > 0 && (
                <p className="text-xs text-slate-400">{voters.join(", ")}</p>
              )}
            </div>
          );
        })}
      </div>
      {/* Log individual decisions */}
      <div className="space-y-2">
        {participants.map((p) => {
          const existing = decisions.find((d) => d.role === p.role);
          if (existing) return null;
          return (
            <div key={p.role} className="flex items-center gap-2">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${ROLE_COLOUR[p.role]}`}>
                {ROLE_SHORT[p.role]}
              </span>
              <span className="text-xs text-slate-500 flex-1">chose:</span>
              <div className="flex gap-1">
                {inject.decisionOptions.map((opt: any) => (
                  <button
                    key={opt.key}
                    onClick={() => onDecide(p.role, p.name, opt.key, opt.label)}
                    className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded font-semibold transition-colors"
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

// ─── Inject note editor ───────────────────────────────────────────────────────

function InjectNoteEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!editing) {
    return (
      <button
        onClick={() => { setDraft(value); setEditing(true); }}
        className="mt-4 w-full flex items-center gap-2 text-xs text-slate-400 border border-dashed border-slate-200 py-2.5 px-3 rounded-lg hover:border-slate-300 hover:text-slate-600 transition-colors text-left"
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
        className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-blue-300"
        placeholder="Facilitator note for this inject…"
      />
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => { onChange(draft); setEditing(false); }}
          className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg"
        >Save</button>
        <button
          onClick={() => setEditing(false)}
          className="text-xs text-slate-500 hover:text-slate-700"
        >Cancel</button>
      </div>
    </div>
  );
}
