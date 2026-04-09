/**
 * Setup.tsx — Pre-session configuration screen.
 *
 * Shows scenario metadata (inject count, duration, difficulty), a timeline preview
 * with colour-coded dots for decision points, the pre-session briefing, and a
 * participant grid where facilitators assign names and optionally customise role
 * titles (e.g. "General Counsel" instead of "Chief Legal Officer").
 */

import { useState } from "react";
import { useStore, getAllScenarios } from "@/store";
import { ChevronLeft, PlayCircle, Users, Clock, Layers, ShieldAlert } from "lucide-react";
import { cn, ROLE_LONG, ROLE_SHORT, ROLE_COLOUR, DIFFICULTY_LABEL, DIFFICULTY_COLOUR, formatDuration } from "@/lib/utils";
import type { Participant, ExecRole } from "@/types";

export function Setup() {
  const setView      = useStore((s) => s.setView);
  const startSession = useStore((s) => s.startSession);
  const editingId    = useStore((s) => s.editingScenarioId);
  const store        = useStore();

  const scenario = editingId
    ? getAllScenarios(store).find((s) => s.id === editingId)
    : null;

  const [participants, setParticipants] = useState<Participant[]>(
    scenario?.roles.map((r) => ({ role: r as ExecRole, name: "" })) ?? []
  );

  if (!scenario) {
    return (
      <div className="p-8 text-center text-rtr-muted">
        No scenario selected.{" "}
        <button onClick={() => setView("library")} className="text-rtr-green underline">
          Go to library
        </button>
      </div>
    );
  }

  const update = (role: ExecRole, field: "name" | "customTitle", value: string) =>
    setParticipants((p) => p.map((x) => (x.role === role ? { ...x, [field]: value } : x)));

  const handleStart = () => {
    startSession(scenario, participants);
    setView("runner");
  };

  const namedCount = participants.filter((p) => p.name.trim()).length;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        onClick={() => setView("library")}
        className="flex items-center gap-1.5 text-sm text-rtr-muted hover:text-rtr-text mb-6 transition-colors fade-in-up"
      >
        <ChevronLeft className="w-4 h-4" />Back
      </button>

      <div className="fade-in-up">
        <h1 className="text-2xl font-semibold text-rtr-text mb-1">Set Up Exercise</h1>
        <p className="text-rtr-muted text-sm mb-6">{scenario.title}</p>
      </div>

      {/* Scenario overview strip */}
      <div className="grid grid-cols-3 gap-3 mb-6 stagger">
        <MetaStat icon={<Layers className="w-4 h-4 text-rtr-green" />} label="Injects" value={String(scenario.injects.length)} />
        <MetaStat icon={<Clock className="w-4 h-4 text-rtr-muted" />}  label="Duration" value={formatDuration(scenario.durationMin)} />
        <MetaStat
          icon={<ShieldAlert className="w-4 h-4" style={{ color: difficultyColor(scenario.difficulty) }} />}
          label="Difficulty"
          value={DIFFICULTY_LABEL[scenario.difficulty]}
          valueClass={DIFFICULTY_COLOUR[scenario.difficulty]}
        />
      </div>

      {/* Inject progress dots */}
      <div className="bg-rtr-panel border border-rtr-border rounded-xl p-4 mb-6 fade-in-up">
        <p className="text-xs font-semibold text-rtr-dim uppercase tracking-wider mb-3">Inject Timeline Preview</p>
        <div className="flex flex-wrap gap-1.5">
          {[...scenario.injects].sort((a: any, b: any) => a.order - b.order).map((inj: any, i: number) => (
            <div
              key={inj.id}
              title={`${inj.title}${inj.isDecisionPoint ? " (decision point)" : ""}`}
              className={cn(
                "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold font-mono border transition-colors cursor-default",
                inj.isDecisionPoint
                  ? "border-amber-500/50 bg-amber-500/15 text-amber-400"
                  : "border-rtr-border text-rtr-dim hover:border-rtr-green/40 hover:text-rtr-green"
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded border border-rtr-border bg-transparent" />
            <span className="text-xs text-rtr-dim">Inject</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded border border-amber-500/50 bg-amber-500/15" />
            <span className="text-xs text-amber-400/80">Decision point</span>
          </div>
        </div>
        {scenario.injects.filter((inj: any) => inj.isDecisionPoint).length > 0 && (
          <p className="text-xs text-rtr-muted mt-1.5">
            <span className="text-amber-400 font-medium">
              {scenario.injects.filter((inj: any) => inj.isDecisionPoint).length} decision point{scenario.injects.filter((inj: any) => inj.isDecisionPoint).length !== 1 ? "s" : ""}
            </span>{" "}
            will require participant votes
          </p>
        )}
      </div>

      {/* Briefing preview */}
      {scenario.briefing && (
        <div className="bg-rtr-green/8 border border-rtr-green/20 rounded-xl p-4 mb-6 fade-in-up">
          <p className="text-xs font-semibold text-rtr-green uppercase tracking-wider mb-1.5">
            Pre-Session Briefing
          </p>
          <p className="text-sm text-rtr-text leading-relaxed">{scenario.briefing}</p>
          <p className="text-xs text-rtr-dim mt-2">
            This will be shown on the present screen before the first inject.
          </p>
        </div>
      )}

      {/* Participants */}
      <div className="bg-rtr-panel border border-rtr-border rounded-xl overflow-hidden mb-6 fade-in-up">
        <div className="px-5 py-3 bg-rtr-elevated border-b border-rtr-border flex items-center gap-2">
          <Users className="w-4 h-4 text-rtr-muted" />
          <h2 className="text-sm font-semibold text-rtr-text">Participants</h2>
          <span className="text-xs text-rtr-dim ml-1">(role titles and names optional — click a title to rename)</span>
          {namedCount > 0 && (
            <span className="ml-auto text-xs text-rtr-green font-medium">
              {namedCount}/{participants.length} named
            </span>
          )}
        </div>
        <div className="divide-y divide-rtr-border stagger">
          {participants.map((p) => (
            <div key={p.role} className="flex items-center gap-3 px-5 py-3 fade-in-up group">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 font-mono ${ROLE_COLOUR[p.role]}`}>
                {ROLE_SHORT[p.role]}
              </div>
              <input
                value={p.customTitle ?? ROLE_LONG[p.role]}
                onChange={(e) => update(p.role, "customTitle", e.target.value)}
                title="Role title (editable)"
                className="w-52 shrink-0 text-sm bg-transparent border border-transparent text-rtr-muted rounded px-2 py-1.5 focus:outline-none focus:border-rtr-border focus:bg-rtr-elevated placeholder:text-rtr-dim transition-colors hover:border-rtr-border cursor-text"
              />
              <input
                value={p.name}
                onChange={(e) => update(p.role, "name", e.target.value)}
                placeholder="Participant name (optional)"
                className="flex-1 text-sm bg-rtr-elevated border border-rtr-border-light text-rtr-text rounded px-3 py-1.5 focus:outline-none focus:border-rtr-green placeholder:text-rtr-dim transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Present window tip */}
      <div className="bg-rtr-elevated border border-rtr-border rounded-xl p-4 mb-6 text-sm text-rtr-muted fade-in-up">
        <p className="font-medium text-rtr-text mb-1">How the shared screen works</p>
        <p className="text-xs text-rtr-muted leading-relaxed">
          When you launch, a <strong className="text-rtr-text">Present window</strong> will open in a new browser tab.
          Put that tab full-screen on your shared display or projector.
          Keep this window on your laptop for controls — it will never be visible to participants.
        </p>
      </div>

      <div className="flex justify-end fade-in-up">
        <button
          onClick={handleStart}
          className="flex items-center gap-2 bg-rtr-red text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-[#c0001f] transition-colors hover:shadow-lg hover:shadow-rtr-red/20"
        >
          <PlayCircle className="w-4 h-4" />
          Launch Exercise
        </button>
      </div>
    </div>
  );
}

function MetaStat({
  icon, label, value, valueClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-rtr-panel border border-rtr-border rounded-xl p-4 fade-in-up">
      <div className="flex items-center gap-2 mb-2 text-rtr-muted">
        {icon}
        <span className="text-xs uppercase tracking-wider font-semibold text-rtr-dim">{label}</span>
      </div>
      {valueClass ? (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold font-mono ${valueClass}`}>{value}</span>
      ) : (
        <p className="text-base font-bold font-mono text-rtr-text">{value}</p>
      )}
    </div>
  );
}

function difficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    low:      "#4afe91",
    medium:   "#f59e0b",
    high:     "#f97316",
    critical: "#e8002d",
  };
  return map[difficulty] ?? "#8b8fa8";
}
