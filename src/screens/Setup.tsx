import { useState } from "react";
import { useStore, getAllScenarios } from "@/store";
import { ChevronLeft, PlayCircle, Users } from "lucide-react";
import { ROLE_LONG, ROLE_SHORT, ROLE_COLOUR } from "@/lib/utils";
import type { Participant, ExecRole } from "@/types";

export function Setup() {
  const setView     = useStore((s) => s.setView);
  const startSession = useStore((s) => s.startSession);
  const editingId   = useStore((s) => s.editingScenarioId);
  const store       = useStore();

  const scenario = editingId
    ? getAllScenarios(store).find((s) => s.id === editingId)
    : null;

  const [participants, setParticipants] = useState<Participant[]>(
    scenario?.roles.map((r) => ({ role: r as ExecRole, name: "" })) ?? []
  );

  if (!scenario) {
    return (
      <div className="p-8 text-center text-slate-500">
        No scenario selected.{" "}
        <button onClick={() => setView("library")} className="text-blue-600 underline">
          Go to library
        </button>
      </div>
    );
  }

  const update = (role: ExecRole, name: string) =>
    setParticipants((p) =>
      p.map((x) => (x.role === role ? { ...x, name } : x))
    );

  const handleStart = () => {
    startSession(scenario, participants);
    setView("runner");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        onClick={() => setView("library")}
        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />Back
      </button>

      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Set Up Exercise</h1>
      <p className="text-slate-500 text-sm mb-8">
        {scenario.title} · {scenario.injects.length} injects
      </p>

      {/* Briefing preview */}
      {scenario.briefing && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1.5">
            Pre-Session Briefing
          </p>
          <p className="text-sm text-blue-900 leading-relaxed">{scenario.briefing}</p>
          <p className="text-xs text-blue-400 mt-2">
            This will be shown on the present screen before the first inject.
          </p>
        </div>
      )}

      {/* Participants */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">Participants</h2>
          <span className="text-xs text-slate-400 ml-1">
            (names are optional — used in the report)
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {participants.map((p) => (
            <div key={p.role} className="flex items-center gap-4 px-5 py-3.5">
              <span className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${ROLE_COLOUR[p.role]}`}>
                {ROLE_SHORT[p.role]}
              </span>
              <span className="text-sm text-slate-600 w-52 shrink-0">
                {ROLE_LONG[p.role]}
              </span>
              <input
                value={p.name}
                onChange={(e) => update(p.role, e.target.value)}
                placeholder="Name (optional)"
                className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Present window tip */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-sm text-slate-600">
        <p className="font-medium text-slate-800 mb-1">How the shared screen works</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          When you launch, a <strong>Present window</strong> will open in a new browser tab.
          Put that tab full-screen on your shared display or projector.
          Keep this window on your laptop for controls — it will never be visible to participants.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleStart}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <PlayCircle className="w-4 h-4" />
          Launch Exercise
        </button>
      </div>
    </div>
  );
}
