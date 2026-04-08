import { useState } from "react";
import { useStore } from "@/store";
import {
  Download, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp,
  Minus, TrendingUp, AlertTriangle,
} from "lucide-react";
import {
  cn, ROLE_SHORT, ROLE_COLOUR, ROLE_LONG,
  SCENARIO_TYPE_LABELS, DIFFICULTY_LABEL, formatDuration,
} from "@/lib/utils";
import { generateReport } from "@/lib/claude";
import { format } from "date-fns";
import type { GapDimension } from "@/types";

type Tab = "summary" | "timeline" | "gaps" | "roles" | "recommendations";

export function Report() {
  const session  = useStore((s) => s.session);
  const settings = useStore((s) => s.settings);
  const setReport = useStore((s) => s.setReport);

  const [generating, setGenerating] = useState(false);
  const [genError, setGenError]     = useState("");
  const [activeTab, setActiveTab]   = useState<Tab>("summary");

  if (!session) {
    return (
      <div className="p-8 text-center text-slate-400">No session to report on.</div>
    );
  }

  const report = session.report;
  const duration = session.endedAt
    ? Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)
    : session.scenario.durationMin;

  const handleGenerate = async () => {
    if (!settings.claudeApiKey) {
      setGenError("Add your Anthropic API key in Settings first.");
      return;
    }
    setGenerating(true);
    setGenError("");
    try {
      const result = await generateReport(session, settings.claudeApiKey);
      setReport(result);
    } catch (e: any) {
      setGenError(e.message ?? "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ session, report }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session.scenario.title.replace(/\s+/g, "-")}-${format(new Date(session.startedAt), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const score = report?.overallScore ?? 0;
  const scoreColour = score >= 75 ? "text-emerald-600 bg-emerald-50" : score >= 50 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

  const TABS: { id: Tab; label: string }[] = [
    { id: "summary",         label: "Summary" },
    { id: "timeline",        label: "Timeline" },
    { id: "gaps",            label: "Gap Analysis" },
    { id: "roles",           label: "Role Feedback" },
    { id: "recommendations", label: "Recommendations" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-5 border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Post-Exercise Report</p>
            <h1 className="text-2xl font-semibold text-slate-900">{session.scenario.title}</h1>
            <p className="text-sm text-slate-400 mt-1">
              {SCENARIO_TYPE_LABELS[session.scenario.type]} ·{" "}
              {DIFFICULTY_LABEL[session.scenario.difficulty]} ·{" "}
              {formatDuration(duration)} ·{" "}
              {format(new Date(session.startedAt), "d MMM yyyy")} ·{" "}
              {session.participants.length} participants
            </p>
          </div>
          <div className="flex items-center gap-3">
            {report && (
              <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border text-2xl font-bold ${scoreColour}`}>
                {score}
                <span className="text-xs font-normal">/ 100</span>
              </div>
            )}
            {!report && !generating && (
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Generate AI Report
              </button>
            )}
            {generating && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analysing transcript…
              </div>
            )}
            {report && (
              <button
                onClick={handleGenerate}
                className="text-xs text-slate-400 hover:text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg"
              >
                Regenerate
              </button>
            )}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-sm border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" />Export
            </button>
          </div>
        </div>

        {genError && (
          <div className="max-w-5xl mx-auto mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />{genError}
          </div>
        )}

        {report && (
          <div className="max-w-5xl mx-auto mt-4 flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "px-4 py-2 text-sm rounded-lg transition-colors",
                  activeTab === t.id
                    ? "bg-blue-600 text-white font-medium"
                    : "text-slate-500 hover:bg-slate-100"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* No report yet */}
          {!report && !generating && (
            <NoReportState onGenerate={handleGenerate} hasApiKey={!!settings.claudeApiKey} />
          )}
          {generating && (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-slate-700 font-medium">Generating gap analysis…</p>
                <p className="text-slate-400 text-sm mt-1">Claude is reading the full transcript. Usually 20–40s.</p>
              </div>
            </div>
          )}

          {report && activeTab === "summary"         && <SummaryTab report={report} />}
          {report && activeTab === "timeline"        && <TimelineTab session={session} />}
          {report && activeTab === "gaps"            && <GapsTab gaps={report.gapAnalysis} />}
          {report && activeTab === "roles"           && <RolesTab feedback={report.roleFeedback} participants={session.participants} />}
          {report && activeTab === "recommendations" && <RecsTab recs={report.recommendations} />}
        </div>
      </div>
    </div>
  );
}

// ─── No-report state ──────────────────────────────────────────────────────────

function NoReportState({ onGenerate, hasApiKey }: { onGenerate: () => void; hasApiKey: boolean }) {
  const setView = useStore((s) => s.setView);
  const session = useStore((s) => s.session);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Transcript preview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">
          Session Summary
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <p className="text-2xl font-bold text-slate-900">{session?.liveInjects.length ?? 0}</p>
            <p className="text-xs text-slate-400">Injects released</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {session?.liveInjects.reduce((n, li) => n + li.responses.length, 0) ?? 0}
            </p>
            <p className="text-xs text-slate-400">Responses logged</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{session?.notes.length ?? 0}</p>
            <p className="text-xs text-slate-400">Facilitator notes</p>
          </div>
        </div>
      </div>

      {!hasApiKey ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
          <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-800 mb-1">API key required</p>
          <p className="text-xs text-slate-500 mb-3">
            Add your Anthropic API key in Settings to generate the AI gap analysis.
          </p>
          <button
            onClick={() => setView("settings")}
            className="text-sm text-blue-600 hover:underline"
          >
            Go to Settings →
          </button>
        </div>
      ) : (
        <button
          onClick={onGenerate}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          Generate AI Gap Analysis
        </button>
      )}
    </div>
  );
}

// ─── Summary tab ──────────────────────────────────────────────────────────────

function SummaryTab({ report }: { report: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Executive Summary</h2>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {report.executiveSummary}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {report.gapAnalysis.slice(0, 6).map((g: GapDimension) => (
          <ScoreCard key={g.dimension} gap={g} />
        ))}
      </div>
    </div>
  );
}

function ScoreCard({ gap }: { gap: GapDimension }) {
  const c = gap.score >= 75 ? "emerald" : gap.score >= 50 ? "amber" : "red";
  return (
    <div className={`bg-${c}-50 border border-${c}-200 rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-700">{gap.dimension}</span>
        <span className={`text-xl font-bold text-${c}-600`}>{gap.score}</span>
      </div>
      <div className="h-1.5 bg-white/60 rounded-full mb-2">
        <div className={`h-full bg-${c}-400 rounded-full`} style={{ width: `${gap.score}%` }} />
      </div>
      <p className="text-xs text-slate-600 line-clamp-2">{gap.observations[0]}</p>
    </div>
  );
}

// ─── Timeline tab ─────────────────────────────────────────────────────────────

function TimelineTab({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      {session.liveInjects.map((li: any, i: number) => (
        <div key={li.injectId} className="relative flex gap-4">
          {i < session.liveInjects.length - 1 && (
            <div className="absolute left-4 top-9 bottom-0 w-px bg-slate-200" />
          )}
          <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-600 z-10">
            {i + 1}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-slate-800">{li.injectTitle}</span>
              <span className="text-xs text-slate-400">
                {format(new Date(li.releasedAt), "HH:mm:ss")}
              </span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-3 text-sm text-slate-700 leading-relaxed">
              {li.injectBody}
            </div>
            {li.responses.map((r: any) => (
              <div key={r.role} className="flex gap-3 mb-2">
                <span className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded self-start ${ROLE_COLOUR[r.role]}`}>
                  {ROLE_SHORT[r.role]}
                </span>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1">
                  <p className="text-xs text-slate-700">{r.body}</p>
                </div>
              </div>
            ))}
            {li.decisions.map((d: any) => (
              <div key={d.role} className="flex items-center gap-2 text-xs text-amber-700 mt-1">
                <span className={`font-bold px-1.5 py-0.5 rounded ${ROLE_COLOUR[d.role]}`}>
                  {ROLE_SHORT[d.role]}
                </span>
                chose Option {d.optionKey}: {d.optionLabel}
              </div>
            ))}
            {li.facilitatorNote && (
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-2">
                📝 {li.facilitatorNote}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Gaps tab ─────────────────────────────────────────────────────────────────

function GapsTab({ gaps }: { gaps: GapDimension[] }) {
  return (
    <div className="space-y-4">
      {gaps.map((gap) => <GapCard key={gap.dimension} gap={gap} />)}
    </div>
  );
}

function GapCard({ gap }: { gap: GapDimension }) {
  const [open, setOpen] = useState(false);
  const c = gap.score >= 75 ? "emerald" : gap.score >= 50 ? "amber" : "red";

  return (
    <div className={`border border-${c}-200 bg-${c}-50/30 rounded-xl overflow-hidden`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4"
      >
        <div className={`w-12 h-12 rounded-lg bg-${c}-100 flex items-center justify-center shrink-0`}>
          <span className={`text-xl font-bold text-${c}-600`}>{gap.score}</span>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-slate-800">{gap.dimension}</p>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{gap.observations[0]}</p>
        </div>
        <div className="w-24 h-2 bg-white/60 rounded-full mr-4">
          <div className={`h-full bg-${c}-400 rounded-full`} style={{ width: `${gap.score}%` }} />
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-slate-200/50 pt-4 grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Observations</p>
            <ul className="space-y-1.5">
              {gap.observations.map((o, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-700">
                  <Minus className="w-3 h-3 shrink-0 mt-0.5 text-slate-400" />{o}
                </li>
              ))}
            </ul>
          </div>
          {gap.positives.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Positives</p>
              <ul className="space-y-1.5">
                {gap.positives.map((p, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-700">
                    <CheckCircle className="w-3 h-3 shrink-0 mt-0.5 text-emerald-500" />{p}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Roles tab ────────────────────────────────────────────────────────────────

function RolesTab({ feedback, participants }: { feedback: any; participants: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(feedback).map(([role, fb]: [string, any]) => (
        <div key={role} className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <span className={`text-xs font-bold px-2 py-1 rounded ${ROLE_COLOUR[role]}`}>
              {ROLE_SHORT[role]}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">{ROLE_LONG[role]}</p>
              {participants.find((p: any) => p.role === role)?.name && (
                <p className="text-xs text-slate-400">
                  {participants.find((p: any) => p.role === role).name}
                </p>
              )}
            </div>
            <span className={cn(
              "text-lg font-bold",
              fb.score >= 75 ? "text-emerald-600" : fb.score >= 50 ? "text-amber-600" : "text-red-600"
            )}>{fb.score}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">{fb.summary}</p>
          {fb.strengths.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Strengths</p>
              <ul className="space-y-1">
                {fb.strengths.map((s: string, i: number) => (
                  <li key={i} className="flex gap-1.5 text-xs text-slate-600">
                    <CheckCircle className="w-3 h-3 shrink-0 mt-0.5 text-emerald-500" />{s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {fb.gaps.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-700 mb-1">Gaps</p>
              <ul className="space-y-1">
                {fb.gaps.map((g: string, i: number) => (
                  <li key={i} className="flex gap-1.5 text-xs text-slate-600">
                    <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-red-400" />{g}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Recommendations tab ──────────────────────────────────────────────────────

function RecsTab({ recs }: { recs: any[] }) {
  const sorted = [...recs].sort((a, b) =>
    ["HIGH","MEDIUM","LOW"].indexOf(a.priority) - ["HIGH","MEDIUM","LOW"].indexOf(b.priority)
  );
  const badge = {
    HIGH:   "text-red-600 bg-red-50 border-red-200",
    MEDIUM: "text-amber-600 bg-amber-50 border-amber-200",
    LOW:    "text-slate-600 bg-slate-50 border-slate-200",
  } as Record<string, string>;

  return (
    <div className="space-y-4">
      {sorted.map((r, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded border self-start h-fit ${badge[r.priority]}`}>
            {r.priority}
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800 mb-1">{r.title}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{r.detail}</p>
            {r.relatedRole && (
              <span className={`inline-block mt-2 text-xs font-bold px-1.5 py-0.5 rounded ${ROLE_COLOUR[r.relatedRole]}`}>
                {ROLE_SHORT[r.relatedRole]}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
