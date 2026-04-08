import { useStore, getAllScenarios } from "@/store";
import { Plus, Pencil, PlayCircle, Trash2, Copy, Clock, Users } from "lucide-react";
import {
  SCENARIO_TYPE_LABELS, DIFFICULTY_COLOUR, DIFFICULTY_LABEL, formatDuration, makeId,
} from "@/lib/utils";
import type { Scenario } from "@/types";

export function Library() {
  const store        = useStore();
  const setView      = useStore((s) => s.setView);
  const saveScenario = useStore((s) => s.saveScenario);
  const deleteScenario = useStore((s) => s.deleteScenario);
  const allScenarios = getAllScenarios(store);

  const templates = allScenarios.filter((s) => s.isTemplate);
  const mine      = allScenarios.filter((s) => !s.isTemplate);

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

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Scenario Library</h1>
          <p className="text-slate-500 text-sm mt-0.5">Build, manage, and reuse crisis scenarios</p>
        </div>
        <button
          onClick={() => { useStore.getState().setEditingScenario(null); setView("builder"); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Scenario
        </button>
      </div>

      {mine.length > 0 && (
        <Section title={`My Scenarios (${mine.length})`}>
          <Grid scenarios={mine} onEdit={edit} onDuplicate={duplicate} onRun={runSetup} onDelete={deleteScenario} owned />
        </Section>
      )}

      <Section title={`Templates (${templates.length})`}>
        <Grid scenarios={templates} onDuplicate={duplicate} onRun={runSetup} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">{title}</h2>
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
    <div className="grid grid-cols-2 gap-4">
      {scenarios.map((s) => (
        <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-200 transition-colors">
          <div className="flex items-start gap-2 mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${DIFFICULTY_COLOUR[s.difficulty]}`}>
              {DIFFICULTY_LABEL[s.difficulty]}
            </span>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
              {SCENARIO_TYPE_LABELS[s.type]}
            </span>
            {s.isTemplate && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Template</span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 text-sm mb-1">{s.title}</h3>
          {s.description && (
            <p className="text-xs text-slate-400 mb-3 line-clamp-2">{s.description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />{formatDuration(s.durationMin)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />{s.roles.length} roles
            </span>
            <span>{s.injects.length} injects</span>
          </div>
          <div className="flex items-center gap-2">
            {owned && onEdit && (
              <button
                onClick={() => onEdit(s.id)}
                className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />Edit
              </button>
            )}
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(s)}
                className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />Copy
              </button>
            )}
            {onRun && (
              <button
                onClick={() => onRun(s.id)}
                className="flex items-center gap-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5" />Run
              </button>
            )}
            {owned && onDelete && (
              <button
                onClick={() => { if (confirm(`Delete "${s.title}"?`)) onDelete(s.id); }}
                className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
