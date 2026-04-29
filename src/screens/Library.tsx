/**
 * Library.tsx - Scenario browser and manager.
 *
 * Displays all scenarios (built-in templates + user-created) in a responsive grid.
 * Supports search by title/description, type filtering, and actions per card:
 * edit, duplicate, run (→ setup), delete. Templates cannot be edited directly
 * but can be duplicated into user-owned copies.
 */

import { useState } from "react";
import { useStore, getAllScenarios } from "@/store";
import { Plus, Pencil, PlayCircle, Trash2, Copy, Clock, Users, Search, X, GitBranch, Link2 } from "lucide-react";
import {
  SCENARIO_TYPE_LABELS, DIFFICULTY_COLOUR, DIFFICULTY_LABEL, formatDuration, makeId,
} from "@/lib/utils";
import type { Scenario } from "@/types";

/** Count injects that have multiple distinct branch targets (true story forks). */
function countTrueBranches(s: Scenario): number {
  return s.injects.filter(
    (inj) => inj.branches && new Set(inj.branches.map((b) => b.nextInjectId)).size > 1
  ).length;
}

// Exclude "CUSTOM" - it's a meta-type for user scenarios, not a meaningful crisis category filter
const ALL_TYPES = (Object.entries(SCENARIO_TYPE_LABELS) as [string, string][]).filter(
  ([type]) => type !== "CUSTOM"
);

export function Library() {
  const store          = useStore();
  const setView        = useStore((s) => s.setView);
  const saveScenario   = useStore((s) => s.saveScenario);
  const deleteScenario = useStore((s) => s.deleteScenario);
  const allScenarios   = getAllScenarios(store);

  const [query,      setQuery]      = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const templates = allScenarios.filter((s) => s.isTemplate);
  const mine      = allScenarios.filter((s) => !s.isTemplate);

  function applyFilters(list: Scenario[]) {
    return list.filter((s) => {
      const matchesQuery =
        !query ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        (s.description ?? "").toLowerCase().includes(query.toLowerCase());
      const matchesType = typeFilter === "all" || s.type === typeFilter;
      return matchesQuery && matchesType;
    });
  }

  function edit(id: string) {
    useStore.getState().setEditingScenario(id);
    setView("builder");
  }

  function duplicate(s: Scenario) {
    const copy: Scenario = {
      ...s,
      id: makeId(),
      title: `${s.title} (copy)`,
      isTemplate: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveScenario(copy);
  }

  function runSetup(id: string) {
    useStore.getState().setEditingScenario(id);
    setView("setup");
  }

  const filteredMine      = applyFilters(mine);
  const filteredTemplates = applyFilters(templates);
  const hasResults        = filteredMine.length > 0 || filteredTemplates.length > 0;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 fade-in-up">
        <div>
          <h1 className="text-2xl font-semibold text-crux-text">Scenario Library</h1>
          <p className="text-crux-muted text-sm mt-0.5">Build, manage, and reuse crisis scenarios</p>
        </div>
        <button
          onClick={() => { useStore.getState().setEditingScenario(null); setView("builder"); }}
          className="flex items-center gap-2 bg-crux-green text-white px-4 py-2 rounded text-xs font-medium hover:brightness-110 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Scenario
        </button>
      </div>

      {/* Search + filter bar */}
      <div className="mb-6 fade-in-up space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-crux-dim pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scenarios…"
            className="w-full text-sm bg-crux-elevated border border-crux-border-light text-crux-text rounded-lg pl-8 pr-8 py-2 focus:outline-none focus:border-crux-green placeholder:text-crux-dim transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-crux-dim hover:text-crux-muted"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Type filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <FilterPill label="All" active={typeFilter === "all"} onClick={() => setTypeFilter("all")} />
          {ALL_TYPES.map(([type, label]) => (
            <FilterPill key={type} label={label} active={typeFilter === type} onClick={() => setTypeFilter(type)} />
          ))}
        </div>
      </div>

      {/* Results */}
      {!hasResults && (
        <div className="text-center py-16 text-crux-muted fade-in-up">
          <Search className="w-8 h-8 mx-auto mb-3 text-crux-dim" />
          <p className="text-sm font-medium text-crux-text mb-1">No scenarios match</p>
          <p className="text-xs text-crux-dim">Try a different search term or filter</p>
          <button onClick={() => { setQuery(""); setTypeFilter("all"); }} className="mt-3 text-xs text-crux-green hover:underline">
            Clear filters
          </button>
        </div>
      )}

      {filteredMine.length > 0 && (
        <Section title={`My Scenarios (${filteredMine.length})`}>
          <Grid scenarios={filteredMine} onEdit={edit} onDuplicate={duplicate} onRun={runSetup} onDelete={deleteScenario} owned allScenarios={allScenarios} />
        </Section>
      )}

      {filteredTemplates.length > 0 && (
        <Section title={`Templates (${filteredTemplates.length})`}>
          <Grid scenarios={filteredTemplates} onDuplicate={duplicate} onRun={runSetup} allScenarios={allScenarios} />
        </Section>
      )}
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-crux-green text-white border-crux-green"
          : "text-crux-muted border-crux-border hover:border-crux-border-light hover:text-crux-text"
      }`}
    >
      {label}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xs font-semibold text-crux-dim uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ scenarios, onEdit, onDuplicate, onRun, onDelete, owned, allScenarios }: {
  scenarios: Scenario[];
  onEdit?: (id: string) => void;
  onDuplicate?: (s: Scenario) => void;
  onRun?: (id: string) => void;
  onDelete?: (id: string) => void;
  owned?: boolean;
  allScenarios?: Scenario[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
      {scenarios.map((s) => {
        const forks = countTrueBranches(s);
        const paired = allScenarios?.find((other) => other.id === s.pairedScenarioId);
        return (
        <div key={s.id} className="bg-crux-panel border border-crux-border rounded-xl overflow-hidden card-lift group fade-in-up">
          {/* Cover */}
          {(s.imageUrl || s.coverGradient) && (
            <div className="relative h-28 overflow-hidden"
              style={{ background: s.coverGradient ? `linear-gradient(${s.coverGradient})` : "#15171a" }}>
              {s.imageUrl && (
                <img src={s.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:opacity-65 transition-opacity" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-crux-panel to-transparent" />
            </div>
          )}
          <div className="p-5">
            <div className="flex items-start gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${DIFFICULTY_COLOUR[s.difficulty]}`}>
                {DIFFICULTY_LABEL[s.difficulty]}
              </span>
              <span className="text-xs text-crux-dim bg-crux-elevated px-2 py-0.5 rounded">
                {SCENARIO_TYPE_LABELS[s.type]}
              </span>
              {s.isTemplate && (
                <span className="text-xs text-crux-green bg-crux-green/10 px-2 py-0.5 rounded">Template</span>
              )}
              {paired && (
                <span
                  title={`Paired with: ${paired.title}`}
                  className="flex items-center gap-1 text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded"
                >
                  <Link2 className="w-3 h-3" />Paired
                </span>
              )}
            </div>
            <h3 className="font-semibold text-crux-text text-sm mb-1">{s.title}</h3>
            {s.audienceLabel && (
              <p className="text-xs text-amber-400/80 mb-1.5 line-clamp-2">{s.audienceLabel}</p>
            )}
            {s.description && (
              <p className="text-xs text-crux-muted mb-3 line-clamp-2">{s.description}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-crux-dim mb-4 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />{formatDuration(s.durationMin)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />{s.roles.length} roles
              </span>
              <span>{s.injects.length} injects</span>
              {forks > 0 && (
                <span className="flex items-center gap-1 text-amber-400/80">
                  <GitBranch className="w-3 h-3" />{forks} fork{forks !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            {s.regulatoryFrameworks && s.regulatoryFrameworks.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {s.regulatoryFrameworks.map((fw) => (
                  <span key={fw} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                    {fw}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              {owned && onEdit && (
                <button
                  onClick={() => onEdit(s.id)}
                  className="flex items-center gap-1.5 text-xs text-crux-text bg-crux-elevated border border-crux-border-light hover:bg-crux-hover px-3 py-1.5 rounded transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />Edit
                </button>
              )}
              {onDuplicate && (
                <button
                  onClick={() => onDuplicate(s)}
                  className="flex items-center gap-1.5 text-xs text-crux-text bg-crux-elevated border border-crux-border-light hover:bg-crux-hover px-3 py-1.5 rounded transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />Copy
                </button>
              )}
              {onRun && (
                <button
                  onClick={() => onRun(s.id)}
                  className="flex items-center gap-1.5 text-xs text-white bg-crux-green hover:brightness-110 px-3 py-1.5 rounded transition-colors"
                >
                  <PlayCircle className="w-3.5 h-3.5" />Run
                </button>
              )}
              {owned && onDelete && (
                <button
                  onClick={() => { if (confirm(`Delete "${s.title}"?`)) onDelete(s.id); }}
                  className="ml-auto flex items-center gap-1 text-xs text-crux-dim hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}
