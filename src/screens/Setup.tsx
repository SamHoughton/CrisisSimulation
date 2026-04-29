/**
 * Setup.tsx - Pre-session configuration screen.
 *
 * Shows scenario metadata (inject count, duration, difficulty), a timeline preview
 * with colour-coded dots for decision points, the pre-session briefing, and a
 * participant grid where facilitators assign names and optionally customise role
 * titles (e.g. "General Counsel" instead of "Chief Legal Officer").
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useStore, getAllScenarios } from "@/store";
import { ChevronLeft, PlayCircle, Users, Clock, Layers, ShieldAlert, Plus, X } from "lucide-react";
import { cn, ROLE_LONG, ROLE_SHORT, ROLE_COLOUR, DIFFICULTY_LABEL, DIFFICULTY_COLOUR, formatDuration, TIER_COLOUR, TIER_LABEL } from "@/lib/utils";
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
  const [showAddRole, setShowAddRole] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const addBtnRef  = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ALL_ROLES: ExecRole[] = ["CEO", "CFO", "CISO", "CLO", "CCO", "COO", "CTO", "BOARD_REP", "HR_LEAD"];

  const openDropdown = useCallback(() => {
    if (!addBtnRef.current) return;
    const rect = addBtnRef.current.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 6, left: rect.left });
    setShowAddRole(true);
  }, []);

  useEffect(() => {
    if (!showAddRole) return;
    function handleClose(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        addBtnRef.current  && !addBtnRef.current.contains(e.target as Node)
      ) {
        setShowAddRole(false);
      }
    }
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, [showAddRole]);

  if (!scenario) {
    return (
      <div className="p-8 text-center text-crux-muted">
        No scenario selected.{" "}
        <button onClick={() => setView("library")} className="text-crux-green underline">
          Go to library
        </button>
      </div>
    );
  }

  const update = (role: ExecRole, field: "name" | "customTitle", value: string) =>
    setParticipants((p) => p.map((x) => (x.role === role ? { ...x, [field]: value } : x)));

  const removeRole = (role: ExecRole) =>
    setParticipants((p) => p.filter((x) => x.role !== role));

  const addRole = (role: ExecRole) => {
    setParticipants((p) => [...p, { role, name: "" }]);
    setShowAddRole(false);
  };

  const activeRoles = new Set(participants.map((p) => p.role));
  const availableRoles = ALL_ROLES.filter((r) => !activeRoles.has(r));

  const handleStart = () => {
    startSession(scenario, participants);
    setView("runner");
  };

  const namedCount = participants.filter((p) => p.name.trim()).length;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        onClick={() => setView("library")}
        className="flex items-center gap-1.5 text-sm text-crux-muted hover:text-crux-text mb-6 transition-colors fade-in-up"
      >
        <ChevronLeft className="w-4 h-4" />Back
      </button>

      <div className="fade-in-up">
        <h1 className="text-2xl font-semibold text-crux-text mb-1">Set Up Exercise</h1>
        <p className="text-crux-muted text-sm mb-6">{scenario.title}</p>
      </div>

      {/* Scenario overview strip */}
      <div className="grid grid-cols-3 gap-3 mb-6 stagger">
        <MetaStat icon={<Layers className="w-4 h-4 text-crux-green" />} label="Injects" value={String(scenario.injects.length)} />
        <MetaStat icon={<Clock className="w-4 h-4 text-crux-muted" />}  label="Duration" value={formatDuration(scenario.durationMin)} />
        <MetaStat
          icon={<ShieldAlert className="w-4 h-4" style={{ color: difficultyColor(scenario.difficulty) }} />}
          label="Difficulty"
          value={DIFFICULTY_LABEL[scenario.difficulty]}
          valueClass={DIFFICULTY_COLOUR[scenario.difficulty]}
        />
      </div>

      {/* Inject progress dots */}
      <div className="bg-crux-panel border border-crux-border rounded-xl p-4 mb-6 fade-in-up">
        <p className="text-xs font-semibold text-crux-dim uppercase tracking-wider mb-3">Inject Timeline Preview</p>
        <div className="flex flex-wrap gap-1.5">
          {[...scenario.injects].sort((a: any, b: any) => a.order - b.order).map((inj: any, i: number) => {
            const tc = inj.commandTier ? TIER_COLOUR[inj.commandTier] : null;
            return (
              <div
                key={inj.id}
                title={`${inj.title}${inj.isDecisionPoint ? " · decision point" : ""}${inj.commandTier ? ` · ${TIER_LABEL[inj.commandTier]}` : ""}`}
                className={cn(
                  "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold font-mono border transition-colors cursor-default",
                  inj.isDecisionPoint
                    ? tc
                      ? `${tc.border} ${tc.bg} ${tc.text} ring-1 ring-white/40`
                      : "border-amber-500/50 bg-amber-500/15 text-amber-400"
                    : tc
                    ? `${tc.border} ${tc.bg} ${tc.text} opacity-70`
                    : "border-crux-border text-crux-dim"
                )}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded border border-crux-border bg-transparent" />
            <span className="text-xs text-crux-dim">Inject</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded border border-amber-500/50 bg-amber-500/15 ring-1 ring-white/40" />
            <span className="text-xs text-amber-400/80">Decision point</span>
          </div>
          {Object.keys(TIER_COLOUR).some((t) => scenario.injects.some((i: any) => i.commandTier === t)) && (
            <>
              {(["STRATEGIC", "TACTICAL"] as const).filter((t) => scenario.injects.some((i: any) => i.commandTier === t)).map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded border ${TIER_COLOUR[t].border} ${TIER_COLOUR[t].bg}`} />
                  <span className={`text-xs ${TIER_COLOUR[t].text} opacity-80`}>{TIER_LABEL[t]}</span>
                </div>
              ))}
            </>
          )}
        </div>
        {scenario.injects.filter((inj: any) => inj.isDecisionPoint).length > 0 && (
          <p className="text-xs text-crux-muted mt-1.5">
            <span className="text-amber-400 font-medium">
              {scenario.injects.filter((inj: any) => inj.isDecisionPoint).length} decision point{scenario.injects.filter((inj: any) => inj.isDecisionPoint).length !== 1 ? "s" : ""}
            </span>{" "}
            will require participant votes
          </p>
        )}
      </div>

      {/* Briefing preview */}
      {scenario.briefing && (
        <div className="bg-crux-green/8 border border-crux-green/20 rounded-xl p-4 mb-6 fade-in-up">
          <p className="text-xs font-semibold text-crux-green uppercase tracking-wider mb-1.5">
            Pre-Session Briefing
          </p>
          <p className="text-sm text-crux-text leading-relaxed">{scenario.briefing}</p>
          <p className="text-xs text-crux-dim mt-2">
            This will be shown on the present screen before the first inject.
          </p>
        </div>
      )}

      {/* Participants */}
      <div className="bg-crux-panel border border-crux-border rounded-xl mb-6 fade-in-up">
        <div className="px-5 py-3 bg-crux-elevated border-b border-crux-border flex items-center gap-2 rounded-t-xl">
          <Users className="w-4 h-4 text-crux-muted" />
          <h2 className="text-sm font-semibold text-crux-text">Participants</h2>
          <span className="text-xs text-crux-dim ml-1">(role titles and names optional - click a title to rename)</span>
          <span className="ml-auto text-xs text-crux-muted font-medium">
            {participants.length} role{participants.length !== 1 ? "s" : ""} active
            {namedCount > 0 && (
              <span className="text-crux-green"> · {namedCount}/{participants.length} named</span>
            )}
          </span>
        </div>
        <div className="divide-y divide-crux-border stagger">
          {participants.map((p) => (
            <div key={p.role} className="flex items-center gap-3 px-5 py-3 fade-in-up group">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 font-mono ${ROLE_COLOUR[p.role]}`}>
                {ROLE_SHORT[p.role]}
              </div>
              <input
                value={p.customTitle ?? ROLE_LONG[p.role]}
                onChange={(e) => update(p.role, "customTitle", e.target.value)}
                title="Role title (editable)"
                className="w-52 shrink-0 text-sm bg-transparent border border-transparent text-crux-muted rounded px-2 py-1.5 focus:outline-none focus:border-crux-border focus:bg-crux-elevated placeholder:text-crux-dim transition-colors hover:border-crux-border cursor-text"
              />
              <input
                value={p.name}
                onChange={(e) => update(p.role, "name", e.target.value)}
                placeholder="Participant name (optional)"
                className="flex-1 text-sm bg-crux-elevated border border-crux-border-light text-crux-text rounded px-3 py-1.5 focus:outline-none focus:border-crux-green placeholder:text-crux-dim transition-colors"
              />
              <button
                onClick={() => removeRole(p.role)}
                title="Remove role"
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded text-crux-dim opacity-0 group-hover:opacity-100 hover:!text-red-400 hover:bg-red-500/10 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add role row */}
        <div className="px-5 py-3 border-t border-crux-border bg-crux-elevated/50 rounded-b-xl">
          <button
            ref={addBtnRef}
            onClick={openDropdown}
            disabled={availableRoles.length === 0}
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border transition-colors",
              availableRoles.length === 0
                ? "border-crux-border text-crux-dim cursor-not-allowed opacity-50"
                : "border-crux-border text-crux-muted hover:text-crux-text hover:border-crux-green/50 hover:bg-crux-elevated"
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            Add role
          </button>
        </div>

        {/* Portal dropdown — renders into document.body to escape stacking contexts */}
        {showAddRole && availableRoles.length > 0 && dropdownPos && createPortal(
          <div
            ref={dropdownRef}
            style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999 }}
            className="min-w-[200px] bg-crux-elevated border border-crux-border rounded-lg shadow-2xl overflow-hidden"
          >
            <p className="px-3 py-2 text-[10px] font-semibold text-crux-dim uppercase tracking-wider border-b border-crux-border">
              Available roles
            </p>
            <div className="py-1">
              {availableRoles.map((r) => (
                <button
                  key={r}
                  onClick={() => addRole(r)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-crux-panel transition-colors"
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${ROLE_COLOUR[r]}`}>
                    {ROLE_SHORT[r]}
                  </div>
                  <span className="text-sm text-crux-text">{ROLE_LONG[r]}</span>
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* Present window tip */}
      <div className="bg-crux-elevated border border-crux-border rounded-xl p-4 mb-6 text-sm text-crux-muted fade-in-up">
        <p className="font-medium text-crux-text mb-1">How the shared screen works</p>
        <p className="text-xs text-crux-muted leading-relaxed">
          When you launch, a <strong className="text-crux-text">Present window</strong> will open in a new browser tab.
          Put that tab full-screen on your shared display or projector.
          Keep this window on your laptop. Participants will not see it.
        </p>
      </div>

      <div className="flex justify-end fade-in-up">
        <button
          onClick={handleStart}
          className="flex items-center gap-2 bg-crux-green text-white px-6 py-2.5 rounded text-sm font-medium hover:brightness-110 transition-colors hover:shadow-lg hover:shadow-crux-green/20 disabled:opacity-40 disabled:cursor-not-allowed"
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
    <div className="bg-crux-panel border border-crux-border rounded-xl p-4 fade-in-up">
      <div className="flex items-center gap-2 mb-2 text-crux-muted">
        {icon}
        <span className="text-xs uppercase tracking-wider font-semibold text-crux-dim">{label}</span>
      </div>
      {valueClass ? (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold font-mono ${valueClass}`}>{value}</span>
      ) : (
        <p className="text-base font-bold font-mono text-crux-text">{value}</p>
      )}
    </div>
  );
}

function difficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    low:      "#1db86a",
    medium:   "#f59e0b",
    high:     "#f97316",
    critical: "#E82222",
  };
  return map[difficulty] ?? "#8b8fa8";
}
