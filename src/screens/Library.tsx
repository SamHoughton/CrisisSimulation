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
import { Plus, Pencil, PlayCircle, Trash2, Copy, Clock, Users, Search, X } from "lucide-react";
import {
  SCENARIO_TYPE_LABELS, DIFFICULTY_COLOUR, DIFFICULTY_LABEL, formatDuration, makeId,
} from "@/lib/utils";
import type { Scenario } from "@/types";

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
          <h1 className="text-2xl font-semibold text-rtr-text">Scenario Library</h1>
          <p className="text-rtr-muted text-sm mt-0.5">Build, manage, and reuse crisis scenarios</p>
        </div>
        <button
          onClick={() => { useStore.getState().setEditingScenario(null); setView("builder"); }}
          className="flex items-center gap-2 bg-rtr-red text-white px-4 py-2 rounded text-xs font-medium hover:bg-[#c0001f] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Scenario
        </button>
      </div>

      {/* Search + filter bar */}
      <div className="mb-6 fade-in-up space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-rtr-dim pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scenarios…"
            className="w-full text-sm bg-rtr-elevated border border-rtr-border-light text-rtr-text rounded-lg pl-8 pr-8 py-2 focus:outline-none focus:border-rtr-green placeholder:text-rtr-dim transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-rtr-dim hover:text-rtr-muted"
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
        <div className="text-center py-16 text-rtr-muted fade-in-up">
          <Search className="w-8 h-8 mx-auto mb-3 text-rtr-dim" />
          <p className="text-sm font-medium text-rtr-text mb-1">No scenarios match</p>
          <p className="text-xs text-rtr-dim">Try a different search term or filter</p>
          <button onClick={() => { setQuery(""); setTypeFilter("all"); }} className="mt-3 text-xs text-rtr-green hover:underline">
            Clear filters
          </button>
        </div>
      )}

      {filteredMine.length > 0 && (
        <Section title={`My Scenarios (${filteredMine.length})`}>
          <Grid scenarios={filteredMine} onEdit={edit} onDuplicate={duplicate} onRun={runSetup} onDelete={deleteScenario} owned />
        </Section>
      )}

      {filteredTemplates.length > 0 && (
        <Section title={`Templates (${filteredTemplates.length})`}>
          <Grid scenarios={filteredTemplates} onDuplicate={duplicate} onRun={runSetup} />
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
          ? "bg-rtr-red text-white border-rtr-red"
          : "text-rtr-muted border-rtr-border hover:border-rtr-border-light hover:text-rtr-text"
      }`}
    >
      {label}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xs font-semibold text-rtr-dim uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ scenarios, onEdit, onDuplicate, onRun, onDelete, owned }: {
  scenarios: Scenario[];
  onEdit?: (id: string) => void;
  onDuplicate?: (s: Scenario) => void;
  onRun?: (id: string) => void;
  onDelete?: (id: string) => void;
  owned?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
      {scenarios.map((s) => (
        <div key={s.id} className="bg-rtr-panel border border-rtr-border rounded-xl overflow-hidden card-lift group fade-in-up">
          {/* Cover */}
          {(s.imageUrl || s.coverGradient) && (
            <div className="relative h-28 overflow-hidden"
              style={{ background: s.coverGradient ? `linear-gradient(${s.coverGradient})` : "#15171a" }}>
              {s.imageUrl && (
                <img src={s.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:opacity-65 transition-opacity" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-rtr-panel to-transparent" />
            </div>
          )}
          <div className="p-5">
            <div className="flex items-start gap-2 mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${DIFFICULTY_COLOUR[s.difficulty]}`}>
                {DIFFICULTY_LABEL[s.difficulty]}
              </span>
              <span className="text-xs text-rtr-dim bg-rtr-elevated px-2 py-0.5 rounded">
                {SCENARIO_TYPE_LABELS[s.type]}
              </span>
              {s.isTemplate && (
                <span className="text-xs text-rtr-green bg-rtr-green/10 px-2 py-0.5 rounded">Template</span>
              )}
            </div>
            <h3 className="font-semibold text-rtr-text text-sm mb-1">{s.title}</h3>
            {s.audienceLabel && (
              <p className="text-xs text-amber-400/80 mb-1.5 line-clamp-2">{s.audienceLabel}</p>
            )}
            {s.description && (
              <p className="text-xs text-rtr-muted mb-3 line-clamp-2">{s.description}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-rtr-dim mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />{formatDuration(s.durationMin)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />{s.roles.length} roles
              </span>
              <span>{s.injects.length} injects</span>
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
                  className="flex items-center gap-1.5 text-xs text-rtr-text bg-rtr-elevated border border-rtr-border-light hover:bg-rtr-hover px-3 py-1.5 rounded transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />Edit
                </button>
              )}
              {onDuplicate && (
                <button
                  onClick={() => onDuplicate(s)}
                  className="flex items-center gap-1.5 text-xs text-rtr-text bg-rtr-elevated border border-rtr-border-light hover:bg-rtr-hover px-3 py-1.5 rounded transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />Copy
                </button>
              )}
              {onRun && (
                <button
                  onClick={() => onRun(s.id)}
                  className="flex items-center gap-1.5 text-xs text-white bg-rtr-red hover:bg-[#c0001f] px-3 py-1.5 rounded transition-colors"
                >
                  <PlayCircle className="w-3.5 h-3.5" />Run
                </button>
              )}
              {owned && onDelete && (
                <button
                  onClick={() => { if (confirm(`Delete "${s.title}"?`)) onDelete(s.id); }}
                  className="ml-auto flex items-center gap-1 text-xs text-rtr-dim hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
