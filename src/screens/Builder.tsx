import { useState, useCallback } from "react";
import { useStore, getAllScenarios } from "@/store";
import {
  ChevronLeft, Save, Plus, Trash2, ChevronDown, ChevronUp,
  GitBranch, AlertCircle, GripVertical,
} from "lucide-react";
import {
  cn, makeId, SCENARIO_TYPE_LABELS, DIFFICULTY_LABEL,
  ROLE_SHORT, ALL_ROLES, ALL_SCENARIO_TYPES,
} from "@/lib/utils";
import type { Scenario, Inject, DecisionOption, ScenarioType, Difficulty, ExecRole } from "@/types";

const DIFFICULTIES: Difficulty[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function emptyInject(order: number): Inject {
  return {
    id: makeId(),
    order,
    title: `Inject ${order + 1}`,
    body: "",
    facilitatorNotes: "",
    delayMinutes: 5,
    isDecisionPoint: false,
    decisionOptions: [],
    targetRoles: [],
    expectedKeywords: [],
  };
}

function emptyScenario(): Scenario {
  return {
    id: makeId(),
    title: "",
    description: "",
    type: "RANSOMWARE",
    difficulty: "MEDIUM",
    durationMin: 90,
    briefing: "",
    roles: ["CEO", "CISO", "CLO"],
    injects: [],
    isTemplate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function Builder() {
  const setView        = useStore((s) => s.setView);
  const saveScenario   = useStore((s) => s.saveScenario);
  const editingId      = useStore((s) => s.editingScenarioId);
  const store          = useStore();

  const existing = editingId
    ? getAllScenarios(store).find((s) => s.id === editingId)
    : null;

  const [scenario, setScenario] = useState<Scenario>(existing ?? emptyScenario());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");

  const update = (patch: Partial<Scenario>) =>
    setScenario((s) => ({ ...s, ...patch }));

  const toggleRole = (r: ExecRole) =>
    update({
      roles: scenario.roles.includes(r)
        ? scenario.roles.filter((x) => x !== r)
        : [...scenario.roles, r],
    });

  const addInject = () => {
    const inj = emptyInject(scenario.injects.length);
    update({ injects: [...scenario.injects, inj] });
    setExpanded(inj.id);
  };

  const updateInject = (id: string, patch: Partial<Inject>) =>
    update({
      injects: scenario.injects.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });

  const removeInject = (id: string) =>
    update({ injects: scenario.injects.filter((i) => i.id !== id) });

  const moveInject = (id: string, dir: "up" | "down") => {
    const idx = scenario.injects.findIndex((i) => i.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === scenario.injects.length - 1) return;
    const next = [...scenario.injects];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    update({ injects: next.map((inj, i) => ({ ...inj, order: i })) });
  };

  const addOption = (injectId: string) => {
    const inj = scenario.injects.find((i) => i.id === injectId)!;
    const key = String.fromCharCode(65 + inj.decisionOptions.length);
    updateInject(injectId, {
      decisionOptions: [
        ...inj.decisionOptions,
        { key, label: "", consequence: "" },
      ],
    });
  };

  const updateOption = (injectId: string, key: string, patch: Partial<DecisionOption>) => {
    const inj = scenario.injects.find((i) => i.id === injectId)!;
    updateInject(injectId, {
      decisionOptions: inj.decisionOptions.map((o) => (o.key === key ? { ...o, ...patch } : o)),
    });
  };

  const handleSave = () => {
    if (!scenario.title.trim()) { setSaveError("Title required"); return; }
    if (scenario.roles.length === 0) { setSaveError("Select at least one role"); return; }
    setSaveError("");
    saveScenario({ ...scenario, updatedAt: new Date().toISOString() });
    setView("library");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <button onClick={() => setView("library")} className="text-slate-400 hover:text-slate-700">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <input
          value={scenario.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Scenario title…"
          className="flex-1 text-lg font-semibold bg-transparent border-none outline-none placeholder:text-slate-300"
        />
        {saveError && (
          <span className="flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="w-3.5 h-3.5" />{saveError}
          </span>
        )}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          {existing ? "Save Changes" : "Create Scenario"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings panel */}
        <div className="w-68 shrink-0 border-r border-slate-200 overflow-y-auto px-5 py-6 space-y-6 bg-white" style={{ width: 272 }}>
          <Field label="Scenario Type">
            <select
              value={scenario.type}
              onChange={(e) => update({ type: e.target.value as ScenarioType })}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
            >
              {ALL_SCENARIO_TYPES.map((t) => (
                <option key={t} value={t}>{SCENARIO_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </Field>

          <Field label="Difficulty">
            <div className="flex gap-1">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => update({ difficulty: d })}
                  className={cn(
                    "flex-1 text-xs py-1.5 rounded-md border transition-colors",
                    scenario.difficulty === d
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-slate-200 text-slate-500 hover:border-blue-300"
                  )}
                >
                  {DIFFICULTY_LABEL[d]}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Estimated Duration (min)">
            <input
              type="number" min={15} max={480}
              value={scenario.durationMin}
              onChange={(e) => update({ durationMin: +e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={scenario.description ?? ""}
              onChange={(e) => update({ description: e.target.value })}
              rows={3}
              placeholder="Brief overview…"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none"
            />
          </Field>

          <Field label="Participant Roles">
            <p className="text-xs text-slate-400 mb-2">
              Roles to include in this exercise
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleRole(r)}
                  className={cn(
                    "text-xs px-2 py-1 rounded-md border transition-colors",
                    scenario.roles.includes(r)
                      ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                      : "border-slate-200 text-slate-500 hover:border-blue-200"
                  )}
                >
                  {ROLE_SHORT[r]}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Pre-Session Briefing">
            <textarea
              value={scenario.briefing ?? ""}
              onChange={(e) => update({ briefing: e.target.value })}
              rows={5}
              placeholder="Context shown on the present screen before the first inject…"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none"
            />
          </Field>
        </div>

        {/* Inject timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50">
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-slate-700">
                Inject Timeline
                <span className="ml-2 text-xs font-normal text-slate-400">
                  ({scenario.injects.length} injects)
                </span>
              </h2>
              <button
                onClick={addInject}
                className="flex items-center gap-1.5 text-xs text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />Add Inject
              </button>
            </div>

            {scenario.injects.length === 0 && (
              <div className="text-center py-16 text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white">
                No injects yet. Add the first inject to build the timeline.
              </div>
            )}

            <div className="space-y-3">
              {[...scenario.injects]
                .sort((a, b) => a.order - b.order)
                .map((inj, idx) => (
                  <InjectCard
                    key={inj.id}
                    inject={inj}
                    index={idx}
                    total={scenario.injects.length}
                    expanded={expanded === inj.id}
                    roles={scenario.roles as ExecRole[]}
                    onToggle={() => setExpanded((p) => (p === inj.id ? null : inj.id))}
                    onUpdate={(p) => updateInject(inj.id, p)}
                    onRemove={() => removeInject(inj.id)}
                    onMoveUp={() => moveInject(inj.id, "up")}
                    onMoveDown={() => moveInject(inj.id, "down")}
                    onAddOption={() => addOption(inj.id)}
                    onUpdateOption={(k, p) => updateOption(inj.id, k, p)}
                    onRemoveOption={(k) =>
                      updateInject(inj.id, {
                        decisionOptions: inj.decisionOptions.filter((o) => o.key !== k),
                      })
                    }
                  />
                ))}
            </div>

            {scenario.injects.length > 0 && (
              <button
                onClick={addInject}
                className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-slate-400 border border-dashed border-slate-200 hover:border-blue-300 hover:text-blue-500 py-4 rounded-xl transition-colors bg-white"
              >
                <Plus className="w-4 h-4" />Add inject
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      {children}
    </div>
  );
}

type InjectCardProps = {
  inject: Inject; index: number; total: number;
  expanded: boolean; roles: ExecRole[];
  onToggle: () => void; onUpdate: (p: Partial<Inject>) => void;
  onRemove: () => void; onMoveUp: () => void; onMoveDown: () => void;
  onAddOption: () => void;
  onUpdateOption: (k: string, p: Partial<DecisionOption>) => void;
  onRemoveOption: (k: string) => void;
};

function InjectCard({
  inject, index, total, expanded, roles,
  onToggle, onUpdate, onRemove, onMoveUp, onMoveDown,
  onAddOption, onUpdateOption, onRemoveOption,
}: InjectCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-blue-600">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggle}>
          <p className="text-sm font-medium text-slate-800 truncate">
            {inject.title || `Inject ${index + 1}`}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400">T+{inject.delayMinutes}min</span>
            {inject.isDecisionPoint && (
              <span className="flex items-center gap-0.5 text-xs text-amber-600">
                <GitBranch className="w-3 h-3" />Decision
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onMoveUp} disabled={index === 0} className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button onClick={onMoveDown} disabled={index === total - 1} className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30">
            <ChevronDown className="w-4 h-4" />
          </button>
          <button onClick={onRemove} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={onToggle} className="p-1 text-slate-400">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-slate-500 block mb-1">Title</label>
              <input
                value={inject.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                placeholder="e.g. Initial SOC Alert"
              />
            </div>
            <div className="w-28">
              <label className="text-xs font-medium text-slate-500 block mb-1">Delay (mins)</label>
              <input
                type="number" min={0}
                value={inject.delayMinutes}
                onChange={(e) => onUpdate({ delayMinutes: +e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">
              Inject Text <span className="font-normal">(shown on screen)</span>
            </label>
            <textarea
              value={inject.body}
              onChange={(e) => onUpdate({ body: e.target.value })}
              rows={4} placeholder="You receive an alert from your SOC…"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">
              Facilitator Notes <span className="font-normal">(private — never shown)</span>
            </label>
            <textarea
              value={inject.facilitatorNotes ?? ""}
              onChange={(e) => onUpdate({ facilitatorNotes: e.target.value })}
              rows={2} placeholder="What's really happening behind the scenes…"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none bg-amber-50/40"
            />
          </div>

          {/* Target roles */}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">Primarily directed at</label>
            <div className="flex flex-wrap gap-1.5">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    const curr = inject.targetRoles;
                    onUpdate({
                      targetRoles: curr.includes(r) ? curr.filter((x) => x !== r) : [...curr, r],
                    });
                  }}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded border transition-colors",
                    inject.targetRoles.includes(r)
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "border-slate-200 text-slate-400"
                  )}
                >
                  {ROLE_SHORT[r]}
                </button>
              ))}
            </div>
          </div>

          {/* Decision point toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onUpdate({
                  isDecisionPoint: !inject.isDecisionPoint,
                  decisionOptions: inject.isDecisionPoint ? [] : inject.decisionOptions,
                })
              }
              className={cn(
                "w-9 h-5 rounded-full transition-colors relative shrink-0",
                inject.isDecisionPoint ? "bg-blue-600" : "bg-slate-200"
              )}
            >
              <span className={cn(
                "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                inject.isDecisionPoint ? "translate-x-4" : "translate-x-0.5"
              )} />
            </button>
            <span className="text-xs font-medium text-slate-700">Decision Point</span>
          </div>

          {inject.isDecisionPoint && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-800">Decision Options</span>
                {inject.decisionOptions.length < 4 && (
                  <button
                    onClick={onAddOption}
                    className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />Add
                  </button>
                )}
              </div>
              {inject.decisionOptions.map((opt) => (
                <div key={opt.key} className="bg-white border border-amber-100 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0">
                      {opt.key}
                    </span>
                    <input
                      value={opt.label}
                      onChange={(e) => onUpdateOption(opt.key, { label: e.target.value })}
                      className="flex-1 text-sm border border-slate-200 rounded px-2 py-1"
                      placeholder="Option label shown to participants"
                    />
                    <button onClick={() => onRemoveOption(opt.key)} className="text-slate-300 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    value={opt.consequence ?? ""}
                    onChange={(e) => onUpdateOption(opt.key, { consequence: e.target.value })}
                    className="w-full text-xs border border-amber-100 rounded px-2 py-1 bg-amber-50"
                    placeholder="Facilitator note: what does this choice trigger?"
                  />
                </div>
              ))}
              {inject.decisionOptions.length === 0 && (
                <p className="text-xs text-amber-600 text-center py-1">Add at least 2 options</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
