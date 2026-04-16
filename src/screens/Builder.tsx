/**
 * Builder.tsx - Scenario editor.
 *
 * Two-panel layout: left panel for scenario metadata (type, difficulty, duration,
 * description, cover image, roles, briefing) and right panel for the inject
 * timeline. Each inject card expands to edit title, body, facilitator notes,
 * target roles, decision options, branch routing, timer, and artifacts.
 *
 * AI Suggest button (requires API key) calls Claude Haiku to generate inject body text.
 */

import { useState } from "react";
import { useStore, getAllScenarios } from "@/store";
import {
  ChevronLeft, Save, Plus, Trash2, ChevronDown, ChevronUp,
  GitBranch, AlertCircle, GripVertical, Image, ArrowRight, Wand2,
} from "lucide-react";
import { suggestInjectText } from "@/lib/claude";
import {
  cn, makeId, SCENARIO_TYPE_LABELS, DIFFICULTY_LABEL,
  ROLE_SHORT, ALL_ROLES, ALL_SCENARIO_TYPES, TIER_LABEL, TIER_COLOUR,
} from "@/lib/utils";
import type {
  Scenario, Inject, DecisionOption, InjectBranch,
  ScenarioType, Difficulty, ExecRole, CommandTier,
} from "@/types";

const ALL_TIERS: CommandTier[] = ["STRATEGIC", "TACTICAL"];

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
    branches: [],
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
  const setView      = useStore((s) => s.setView);
  const saveScenario = useStore((s) => s.saveScenario);
  const editingId    = useStore((s) => s.editingScenarioId);
  const store        = useStore();

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
    update({ injects: scenario.injects.map((i) => (i.id === id ? { ...i, ...patch } : i)) });

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
      decisionOptions: [...inj.decisionOptions, { key, label: "", consequence: "" }],
    });
  };

  const updateOption = (injectId: string, key: string, patch: Partial<DecisionOption>) => {
    const inj = scenario.injects.find((i) => i.id === injectId)!;
    updateInject(injectId, {
      decisionOptions: inj.decisionOptions.map((o) => (o.key === key ? { ...o, ...patch } : o)),
    });
  };

  const updateBranch = (injectId: string, optionKey: string, nextInjectId: string) => {
    const inj = scenario.injects.find((i) => i.id === injectId)!;
    const branches = inj.branches?.filter((b) => b.optionKey !== optionKey) ?? [];
    if (nextInjectId) branches.push({ optionKey, nextInjectId });
    updateInject(injectId, { branches });
  };

  const handleSave = () => {
    if (!scenario.title.trim()) { setSaveError("Title required"); return; }
    if (scenario.roles.length === 0) { setSaveError("Select at least one role"); return; }
    setSaveError("");
    saveScenario({ ...scenario, updatedAt: new Date().toISOString() });
    setView("library");
  };

  const inputCls = "w-full text-sm bg-rtr-elevated border border-rtr-border-light text-rtr-text rounded px-3 py-2 focus:outline-none focus:border-rtr-green placeholder:text-rtr-dim transition-colors";
  const textareaCls = `${inputCls} resize-none`;

  return (
    <div className="flex h-full flex-col bg-rtr-base">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-rtr-border bg-rtr-panel sticky top-0 z-10">
        <button onClick={() => setView("library")} className="text-rtr-dim hover:text-rtr-text transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <input
          value={scenario.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Scenario title…"
          className="flex-1 text-lg font-semibold bg-transparent border-none outline-none text-rtr-text placeholder:text-rtr-dim"
        />
        {saveError && (
          <span className="flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />{saveError}
          </span>
        )}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-rtr-red text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#c0001f] transition-colors"
        >
          <Save className="w-4 h-4" />
          {existing ? "Save Changes" : "Create Scenario"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings panel */}
        <div className="shrink-0 border-r border-rtr-border overflow-y-auto px-5 py-6 space-y-6 bg-rtr-panel" style={{ width: 272 }}>
          <Field label="Scenario Type">
            <select
              value={scenario.type}
              onChange={(e) => update({ type: e.target.value as ScenarioType })}
              className={inputCls}
              style={{ backgroundColor: "rgb(var(--rtr-elevated))" }}
            >
              {ALL_SCENARIO_TYPES.map((t) => (
                <option key={t} value={t} style={{ background: "rgb(var(--rtr-elevated))" }}>{SCENARIO_TYPE_LABELS[t]}</option>
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
                    "flex-1 text-xs py-1.5 rounded border transition-colors",
                    scenario.difficulty === d
                      ? "bg-rtr-red text-white border-rtr-red"
                      : "border-rtr-border-light text-rtr-muted hover:border-rtr-muted"
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
              className={inputCls}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={scenario.description ?? ""}
              onChange={(e) => update({ description: e.target.value })}
              rows={3} placeholder="Brief overview…"
              className={textareaCls}
            />
          </Field>

          <Field label="Cover Image URL">
            <input
              value={scenario.imageUrl ?? ""}
              onChange={(e) => update({ imageUrl: e.target.value })}
              placeholder="https://…"
              className={inputCls}
            />
            {scenario.imageUrl && (
              <img
                src={scenario.imageUrl}
                alt="cover preview"
                className="mt-2 w-full h-20 object-cover rounded border border-rtr-border"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            )}
          </Field>

          <Field label="Participant Roles">
            <p className="text-xs text-rtr-dim mb-2">Roles to include in this exercise</p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleRole(r)}
                  className={cn(
                    "text-xs px-2 py-1 rounded border transition-colors",
                    scenario.roles.includes(r)
                      ? "bg-rtr-green/15 border-rtr-green/40 text-rtr-green font-medium"
                      : "border-rtr-border-light text-rtr-dim hover:border-rtr-muted"
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
              className={textareaCls}
            />
          </Field>
        </div>

        {/* Inject timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-rtr-base">
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-rtr-text">
                  Inject Timeline
                  <span className="ml-2 text-xs font-normal text-rtr-muted">
                    ({scenario.injects.length} injects)
                  </span>
                </h2>
                {scenario.injects.some((i) => i.branches?.length) && (
                  <p className="text-xs text-amber-400 mt-0.5 flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />This scenario has branching paths
                  </p>
                )}
              </div>
              <button
                onClick={addInject}
                className="flex items-center gap-1.5 text-xs text-rtr-green border border-rtr-green/30 hover:bg-rtr-green/8 px-3 py-1.5 rounded transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />Add Inject
              </button>
            </div>

            {scenario.injects.length === 0 && (
              <div className="text-center py-16 text-sm text-rtr-dim border border-dashed border-rtr-border rounded-xl bg-rtr-panel">
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
                    allInjects={scenario.injects}
                    scenarioType={scenario.type}
                    scenarioTitle={scenario.title}
                    difficulty={scenario.difficulty}
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
                        branches: (inj.branches ?? []).filter((b) => b.optionKey !== k),
                      })
                    }
                    onUpdateBranch={(optionKey, nextInjectId) =>
                      updateBranch(inj.id, optionKey, nextInjectId)
                    }
                  />
                ))}
            </div>

            {scenario.injects.length > 0 && (
              <button
                onClick={addInject}
                className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-rtr-dim border border-dashed border-rtr-border hover:border-rtr-green/40 hover:text-rtr-green py-4 rounded-xl transition-colors bg-rtr-panel"
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
      <p className="text-xs font-semibold text-rtr-dim uppercase tracking-wider mb-2">{label}</p>
      {children}
    </div>
  );
}

type InjectCardProps = {
  inject: Inject; index: number; total: number;
  expanded: boolean; roles: ExecRole[];
  allInjects: Inject[];
  scenarioType: string; scenarioTitle: string; difficulty: string;
  onToggle: () => void; onUpdate: (p: Partial<Inject>) => void;
  onRemove: () => void; onMoveUp: () => void; onMoveDown: () => void;
  onAddOption: () => void;
  onUpdateOption: (k: string, p: Partial<DecisionOption>) => void;
  onRemoveOption: (k: string) => void;
  onUpdateBranch: (optionKey: string, nextInjectId: string) => void;
};

function InjectCard({
  inject, index, total, expanded, roles, allInjects,
  scenarioType, scenarioTitle, difficulty,
  onToggle, onUpdate, onRemove, onMoveUp, onMoveDown,
  onAddOption, onUpdateOption, onRemoveOption, onUpdateBranch,
}: InjectCardProps) {
  const apiKey = useStore((s) => s.settings.claudeApiKey);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState("");

  const handleSuggest = async () => {
    setSuggesting(true);
    setSuggestError("");
    try {
      const sorted = [...allInjects].sort((a, b) => a.order - b.order);
      const previousInjects = sorted
        .filter((i) => i.order < inject.order)
        .map((i) => ({ title: i.title, body: i.body }));
      const text = await suggestInjectText(
        {
          scenarioType,
          scenarioTitle,
          difficulty,
          injectIndex: index,
          totalInjects: total,
          injectTitle: inject.title,
          targetRoles: inject.targetRoles,
          previousInjects,
        },
        apiKey || undefined
      );
      onUpdate({ body: text });
    } catch (e) {
      setSuggestError(e instanceof Error ? e.message : "Suggestion failed");
    } finally {
      setSuggesting(false);
    }
  };

  const inputCls = "w-full text-sm bg-rtr-base border border-rtr-border text-rtr-text rounded px-3 py-2 focus:outline-none focus:border-rtr-green placeholder:text-rtr-dim transition-colors";
  const hasBranches = inject.branches && inject.branches.length > 0;

  // Other injects available as branch targets (exclude self)
  const otherInjects = allInjects.filter((i) => i.id !== inject.id).sort((a, b) => a.order - b.order);

  return (
    <div className={cn(
      "border rounded-xl overflow-hidden transition-colors",
      hasBranches ? "bg-rtr-panel border-amber-500/25" : "bg-rtr-panel border-rtr-border"
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical className="w-4 h-4 text-rtr-dim cursor-grab" />
        <div className="w-6 h-6 rounded-full bg-rtr-red/15 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-rtr-red font-mono">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggle}>
          <p className="text-sm font-medium text-rtr-text truncate">
            {inject.title || `Inject ${index + 1}`}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-rtr-dim font-mono">T+{inject.delayMinutes}min</span>
            {inject.isDecisionPoint && (
              <span className="flex items-center gap-0.5 text-xs text-amber-400">
                <GitBranch className="w-3 h-3" />{hasBranches ? "Branching" : "Decision"}
              </span>
            )}
            {inject.imageUrl && (
              <span className="flex items-center gap-0.5 text-xs text-rtr-dim">
                <Image className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onMoveUp} disabled={index === 0} className="p-1 text-rtr-dim hover:text-rtr-text disabled:opacity-30">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button onClick={onMoveDown} disabled={index === total - 1} className="p-1 text-rtr-dim hover:text-rtr-text disabled:opacity-30">
            <ChevronDown className="w-4 h-4" />
          </button>
          <button onClick={onRemove} className="p-1 text-rtr-dim hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={onToggle} className="p-1 text-rtr-dim">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-rtr-border px-4 py-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-rtr-dim block mb-1">Title</label>
              <input
                value={inject.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className={inputCls}
                placeholder="e.g. Initial SOC Alert"
              />
            </div>
            <div className="w-28">
              <label className="text-xs font-medium text-rtr-dim block mb-1">Delay (mins)</label>
              <input
                type="number" min={0}
                value={inject.delayMinutes}
                onChange={(e) => onUpdate({ delayMinutes: +e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-rtr-dim">
                Inject Text <span className="font-normal">(shown on screen)</span>
              </label>
              <button
                onClick={handleSuggest}
                disabled={suggesting}
                className="flex items-center gap-1 text-xs text-rtr-green hover:text-rtr-green/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={apiKey ? "Generate inject text with your API key" : "Generate inject text via hosted proxy"}
              >
                <Wand2 className={`w-3 h-3 ${suggesting ? "animate-pulse" : ""}`} />
                {suggesting ? "Generating…" : "AI Suggest"}
              </button>
            </div>
            {suggestError && (
              <p className="text-xs text-red-400 mb-1">{suggestError}</p>
            )}
            <textarea
              value={inject.body}
              onChange={(e) => onUpdate({ body: e.target.value })}
              rows={4} placeholder="You receive an alert from your SOC…"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-rtr-dim block mb-1">
                Inject Image URL <span className="font-normal">(shown on projector)</span>
              </label>
              <input
                value={inject.imageUrl ?? ""}
                onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                className={inputCls}
                placeholder="https://… (optional)"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-rtr-dim block mb-1">Command Tier</label>
              <div className="flex gap-1.5">
                {ALL_TIERS.map((tier) => {
                  const tc = TIER_COLOUR[tier];
                  const active = inject.commandTier === tier;
                  return (
                    <button
                      key={tier}
                      onClick={() => onUpdate({ commandTier: active ? undefined : tier })}
                      className={cn(
                        "flex-1 text-xs font-bold px-2 py-1 rounded border transition-colors",
                        active ? `${tc.bg} ${tc.border} ${tc.text}` : "border-rtr-border text-rtr-dim bg-rtr-base hover:border-rtr-border-light"
                      )}
                    >
                      {tier}
                    </button>
                  );
                })}
              </div>
              {inject.commandTier && (
                <p className="text-[10px] text-rtr-dim mt-1">
                  {inject.commandTier === "STRATEGIC" && "Strategic decisions - Executive leadership"}
                  {inject.commandTier === "TACTICAL" && "Tactical decisions - Management / coordination leads"}
                </p>
              )}
            </div>
            <div className="w-28">
              <label className="text-xs font-medium text-rtr-dim block mb-1">Timer (mins)</label>
              <input
                type="number" min={1} max={60}
                value={inject.timerMinutes ?? ""}
                onChange={(e) => onUpdate({ timerMinutes: e.target.value ? +e.target.value : undefined })}
                className={inputCls}
                placeholder="10"
              />
            </div>
          </div>

          {/* Ticker headline */}
          <div>
            <label className="text-xs font-medium text-rtr-dim block mb-1">
              News Ticker Headline <span className="font-normal">(scrolls on present screen)</span>
            </label>
            <input
              value={inject.tickerHeadline ?? ""}
              onChange={(e) => onUpdate({ tickerHeadline: e.target.value })}
              className={inputCls}
              placeholder="BREAKING: … (optional)"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-rtr-dim block mb-1">
              Facilitator Notes <span className="font-normal">(private - never shown)</span>
            </label>
            <textarea
              value={inject.facilitatorNotes ?? ""}
              onChange={(e) => onUpdate({ facilitatorNotes: e.target.value })}
              rows={2} placeholder="What's really happening behind the scenes…"
              className={`${inputCls} resize-none bg-amber-500/5 border-amber-500/20`}
            />
          </div>

          {/* Artifact type */}
          <div>
            <label className="text-xs font-medium text-rtr-dim block mb-1">Present Screen Artifact</label>
            <select
              value={inject.artifact?.type ?? "default"}
              onChange={(e) => {
                const t = e.target.value;
                if (t === "default") { onUpdate({ artifact: undefined }); return; }
                onUpdate({ artifact: { ...inject.artifact, type: t as any } });
              }}
              className={inputCls}
              style={{ backgroundColor: "rgb(var(--rtr-base))" }}
            >
              <option value="default" style={{ background: "rgb(var(--rtr-base))" }}>Default (plain text)</option>
              <option value="ransomware_note" style={{ background: "rgb(var(--rtr-base))" }}>Ransomware Note</option>
              <option value="siem_alert" style={{ background: "rgb(var(--rtr-base))" }}>SIEM Alert</option>
              <option value="tweet" style={{ background: "rgb(var(--rtr-base))" }}>Tweet / X Post</option>
              <option value="email" style={{ background: "rgb(var(--rtr-base))" }}>Email</option>
              <option value="legal_letter" style={{ background: "rgb(var(--rtr-base))" }}>Legal Letter</option>
              <option value="news_headline" style={{ background: "rgb(var(--rtr-base))" }}>News Headline</option>
              <option value="dark_web_listing" style={{ background: "rgb(var(--rtr-base))" }}>Dark Web Listing</option>
              <option value="stock_chart" style={{ background: "rgb(var(--rtr-base))" }}>Stock Chart (Bloomberg)</option>
              <option value="slack_thread" style={{ background: "rgb(var(--rtr-base))" }}>Slack Thread</option>
              <option value="tv_broadcast" style={{ background: "rgb(var(--rtr-base))" }}>TV Broadcast (Breaking News)</option>
            </select>

            {/* Conditional artifact fields */}
            {inject.artifact?.type === "tweet" && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input value={inject.artifact.tweetHandle ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, tweetHandle: e.target.value } })} className={inputCls} placeholder="@handle" />
                <input value={inject.artifact.tweetDisplayName ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, tweetDisplayName: e.target.value } })} className={inputCls} placeholder="Display name" />
              </div>
            )}
            {inject.artifact?.type === "email" && (
              <div className="mt-2 space-y-2">
                <input value={inject.artifact.emailOrgName ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, emailOrgName: e.target.value } })} className={inputCls} placeholder="Org letterhead – e.g. The Times, NCSC (leave blank for plain)" />
                <input value={inject.artifact.emailFrom ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, emailFrom: e.target.value } })} className={inputCls} placeholder="From: reporter@thetimes.co.uk" />
                <input value={inject.artifact.emailTo ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, emailTo: e.target.value } })} className={inputCls} placeholder="To: press@company.com" />
                <input value={inject.artifact.emailCc ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, emailCc: e.target.value } })} className={inputCls} placeholder="Cc: (optional)" />
                <input value={inject.artifact.emailDate ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, emailDate: e.target.value } })} className={inputCls} placeholder="Date: e.g. 16 April 2026 (leave blank for today)" />
                <input value={inject.artifact.emailSubject ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, emailSubject: e.target.value } })} className={inputCls} placeholder="Subject / Re:" />
                <input value={inject.artifact.emailSalutation ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, emailSalutation: e.target.value } })} className={inputCls} placeholder="Salutation – e.g. Dear Press Office," />
                <textarea value={inject.artifact.emailBody ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, emailBody: e.target.value } })} className={inputCls} rows={5} placeholder="Letter body (leave blank to show inject body text as scene context only)" style={{ resize: "vertical" }} />
                <textarea value={inject.artifact.emailSignOff ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, emailSignOff: e.target.value } })} className={inputCls} rows={3} placeholder={"Sign-off – e.g.\nYours sincerely,\n\nJames Whitfield\nNews Editor, The Times"} style={{ resize: "vertical" }} />
              </div>
            )}
            {inject.artifact?.type === "siem_alert" && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input value={inject.artifact.siemAlertId ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, siemAlertId: e.target.value } })} className={inputCls} placeholder="Alert ID (SOC-2024-001)" />
                <select value={inject.artifact.siemSeverity ?? "HIGH"} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, siemSeverity: e.target.value as any } })} className={inputCls} style={{ backgroundColor: "rgb(var(--rtr-base))" }}>
                  <option value="CRITICAL" style={{ background: "rgb(var(--rtr-base))" }}>Critical</option>
                  <option value="HIGH" style={{ background: "rgb(var(--rtr-base))" }}>High</option>
                  <option value="MEDIUM" style={{ background: "rgb(var(--rtr-base))" }}>Medium</option>
                </select>
                <input value={inject.artifact.siemSourceIp ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, siemSourceIp: e.target.value } })} className={inputCls} placeholder="Source IP" />
                <input value={inject.artifact.siemEventType ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, siemEventType: e.target.value } })} className={inputCls} placeholder="Event type" />
              </div>
            )}
            {inject.artifact?.type === "ransomware_note" && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input value={inject.artifact.ransomAmount ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, ransomAmount: e.target.value } })} className={inputCls} placeholder="Demand ($4.8M)" />
                <input type="number" value={inject.artifact.ransomDeadlineHours ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, ransomDeadlineHours: e.target.value ? +e.target.value : undefined } })} className={inputCls} placeholder="Deadline (hours)" />
                <input value={inject.artifact.ransomWalletAddress ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, ransomWalletAddress: e.target.value } })} className={`${inputCls} col-span-2`} placeholder="BTC wallet address" />
              </div>
            )}
            {inject.artifact?.type === "legal_letter" && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input value={inject.artifact.legalCaseRef ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, legalCaseRef: e.target.value } })} className={inputCls} placeholder="Case reference" />
                <input value={inject.artifact.legalAuthority ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, legalAuthority: e.target.value } })} className={inputCls} placeholder="Authority (e.g. ICO)" />
              </div>
            )}
            {inject.artifact?.type === "dark_web_listing" && (
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input value={inject.artifact.darkWebSiteName ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, darkWebSiteName: e.target.value } })} className={inputCls} placeholder="Site name (ALPHV Market)" />
                  <input value={inject.artifact.darkWebPrice ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, darkWebPrice: e.target.value } })} className={inputCls} placeholder="Price (18 XMR)" />
                </div>
                <input value={inject.artifact.darkWebTitle ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, darkWebTitle: e.target.value } })} className={inputCls} placeholder="Listing title" />
                <input value={inject.artifact.darkWebRecordCount ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, darkWebRecordCount: e.target.value } })} className={inputCls} placeholder="Record count (220,000 records)" />
              </div>
            )}
            {inject.artifact?.type === "stock_chart" && (
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input value={inject.artifact.stockTicker ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, stockTicker: e.target.value } })} className={inputCls} placeholder="Ticker (MRDN)" />
                  <input value={inject.artifact.stockCompanyName ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, stockCompanyName: e.target.value } })} className={inputCls} placeholder="Company name" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" step="0.01" value={inject.artifact.stockOpenPrice ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, stockOpenPrice: e.target.value ? +e.target.value : undefined } })} className={inputCls} placeholder="Open price (24.18)" />
                  <input type="number" step="0.01" value={inject.artifact.stockCurrentPrice ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, stockCurrentPrice: e.target.value ? +e.target.value : undefined } })} className={inputCls} placeholder="Current price (22.76)" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" step="0.01" value={inject.artifact.stockChangePercent ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, stockChangePercent: e.target.value ? +e.target.value : undefined } })} className={inputCls} placeholder="Change % (-5.89)" />
                  <input value={inject.artifact.stockVolume ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, stockVolume: e.target.value } })} className={inputCls} placeholder="Volume (18.4M)" />
                </div>
              </div>
            )}
            {inject.artifact?.type === "slack_thread" && (
              <div className="mt-2 space-y-2">
                <input value={inject.artifact.slackChannel ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, slackChannel: e.target.value } })} className={inputCls} placeholder="Channel (#incident-response)" />
                <textarea
                  value={inject.artifact.slackMessages ? JSON.stringify(inject.artifact.slackMessages, null, 2) : ""}
                  onChange={(e) => {
                    try {
                      const parsed = e.target.value.trim() ? JSON.parse(e.target.value) : undefined;
                      onUpdate({ artifact: { ...inject.artifact!, slackMessages: parsed } });
                    } catch {
                      // Invalid JSON, swallow
                    }
                  }}
                  rows={6}
                  className={`${inputCls} font-mono text-[11px]`}
                  placeholder='[{"author":"Priya","role":"Eng Lead","time":"06:42","text":"Did anyone else see this?"}]'
                />
                <p className="text-[10px] text-rtr-dim">Messages as JSON array. Fields: author, role, time, text, avatar.</p>
              </div>
            )}
            {inject.artifact?.type === "tv_broadcast" && (
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input value={inject.artifact.tvNetwork ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, tvNetwork: e.target.value } })} className={inputCls} placeholder="Network (SKY NEWS)" />
                  <input value={inject.artifact.tvReporter ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, tvReporter: e.target.value } })} className={inputCls} placeholder="Reporter name" />
                </div>
                <input value={inject.artifact.tvHeadline ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, tvHeadline: e.target.value } })} className={inputCls} placeholder="Headline (lower-third)" />
                <input value={inject.artifact.tvTicker ?? ""} onChange={(e) => onUpdate({ artifact: { ...inject.artifact!, tvTicker: e.target.value } })} className={inputCls} placeholder="Ticker text (rolling bottom)" />
              </div>
            )}
          </div>

          {/* Target roles */}
          <div>
            <label className="text-xs font-medium text-rtr-dim block mb-1.5">Primarily directed at</label>
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
                      ? "bg-rtr-green/15 border-rtr-green/40 text-rtr-green"
                      : "border-rtr-border text-rtr-dim hover:border-rtr-muted"
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
                  branches: inject.isDecisionPoint ? [] : inject.branches,
                })
              }
              className={cn(
                "w-9 h-5 rounded-full transition-colors relative shrink-0",
                inject.isDecisionPoint ? "bg-amber-500" : "bg-rtr-border-light"
              )}
            >
              <span className={cn(
                "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                inject.isDecisionPoint ? "translate-x-4" : "translate-x-0.5"
              )} />
            </button>
            <span className="text-xs font-medium text-rtr-text">Decision Point</span>
          </div>

          {inject.isDecisionPoint && (
            <>
              {/* Decision options */}
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400">Decision Options</span>
                  {inject.decisionOptions.length < 4 && (
                    <button
                      onClick={onAddOption}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />Add
                    </button>
                  )}
                </div>
                {inject.decisionOptions.map((opt) => (
                  <div key={opt.key} className="bg-rtr-elevated border border-rtr-border rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 font-mono">
                        {opt.key}
                      </span>
                      <input
                        value={opt.label}
                        onChange={(e) => onUpdateOption(opt.key, { label: e.target.value })}
                        className="flex-1 text-sm bg-rtr-base border border-rtr-border text-rtr-text rounded px-2 py-1 focus:outline-none focus:border-rtr-green placeholder:text-rtr-dim"
                        placeholder="Option label shown to participants"
                      />
                      <button onClick={() => onRemoveOption(opt.key)} className="text-rtr-dim hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      value={opt.consequence ?? ""}
                      onChange={(e) => onUpdateOption(opt.key, { consequence: e.target.value })}
                      className="w-full text-xs bg-amber-500/5 border border-amber-500/15 text-rtr-muted rounded px-2 py-1 focus:outline-none focus:border-amber-500/40 placeholder:text-rtr-dim"
                      placeholder="Facilitator note: what does this choice trigger?"
                    />
                  </div>
                ))}
                {inject.decisionOptions.length === 0 && (
                  <p className="text-xs text-amber-400/60 text-center py-1">Add at least 2 options</p>
                )}
              </div>

              {/* Branch editor - only show if there are options and other injects */}
              {inject.decisionOptions.length > 0 && otherInjects.length > 0 && (
                <div className="bg-rtr-elevated border border-rtr-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-3.5 h-3.5 text-rtr-green" />
                    <span className="text-xs font-semibold text-rtr-text">Branching Paths</span>
                    <span className="text-xs text-rtr-dim">(optional - override which inject follows each option)</span>
                  </div>
                  <div className="space-y-2">
                    {inject.decisionOptions.map((opt) => {
                      const branch = inject.branches?.find((b) => b.optionKey === opt.key);
                      return (
                        <div key={opt.key} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 font-mono">
                            {opt.key}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-rtr-dim shrink-0" />
                          <select
                            value={branch?.nextInjectId ?? ""}
                            onChange={(e) => onUpdateBranch(opt.key, e.target.value)}
                            className="flex-1 text-xs bg-rtr-base border border-rtr-border text-rtr-text rounded px-2 py-1.5 focus:outline-none focus:border-rtr-green"
                            style={{ backgroundColor: "rgb(var(--rtr-base))" }}
                          >
                            <option value="" style={{ background: "rgb(var(--rtr-base))" }}>Follow linear order</option>
                            {otherInjects.map((i) => (
                              <option key={i.id} value={i.id} style={{ background: "rgb(var(--rtr-base))" }}>
                                {i.order + 1}. {i.title || `Inject ${i.order + 1}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
