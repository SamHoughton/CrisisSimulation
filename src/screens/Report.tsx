/**
 * Report.tsx — Post-exercise analysis and AI report dashboard.
 *
 * Tabs:
 * - Decision Log: timestamped record of all injects, responses, and decisions
 * - Dashboard: summary stats (reputation chart, inject breakdown)
 * - Summary, Timeline, Gap Analysis, Role Feedback, Recommendations: AI-generated
 *   (require Claude API key and report generation)
 *
 * Report generation calls generateReport() from claude.ts (Claude Sonnet).
 * Results are stored in session.report and persisted to localStorage.
 * Print-optimised via @media print CSS rules.
 */

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store";
import {
  Download, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp,
  Minus, TrendingUp, AlertTriangle, Printer, ClipboardList, BarChart2,
} from "lucide-react";
import {
  cn, ROLE_SHORT, ROLE_COLOUR, ROLE_LONG,
  SCENARIO_TYPE_LABELS, DIFFICULTY_LABEL, formatDuration,
} from "@/lib/utils";
import { generateReport } from "@/lib/claude";
import { format } from "date-fns";
import type { GapDimension, Session } from "@/types";

type Tab = "summary" | "timeline" | "gaps" | "roles" | "recommendations" | "log" | "dashboard";

/** Counts up from 0 to target over `duration` ms */
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (target === prev.current) return;
    prev.current = target;
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

export function Report() {
  const session   = useStore((s) => s.session);
  const settings  = useStore((s) => s.settings);
  const setReport = useStore((s) => s.setReport);

  const [generating, setGenerating] = useState(false);
  const [genError, setGenError]     = useState("");
  const [activeTab, setActiveTab]   = useState<Tab>("log");

  if (!session) {
    return <div className="p-8 text-center text-rtr-muted">No session to report on.</div>;
  }

  const report   = session.report;
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
    const blob = new Blob([JSON.stringify({ session, report }, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${session.scenario.title.replace(/\s+/g, "-")}-${format(new Date(session.startedAt), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const score = report?.overallScore ?? 0;
  const scoreColour = score >= 75
    ? "text-rtr-green bg-rtr-green/10 border-rtr-green/30"
    : score >= 50
    ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
    : "text-red-400 bg-red-500/10 border-red-500/30";

  // Switch to summary when report first loads
  const prevReport = useRef(report);
  useEffect(() => {
    if (!prevReport.current && report) setActiveTab("summary");
    prevReport.current = report;
  }, [report]);

  const handlePrint = () => window.print();

  const TABS: { id: Tab; label: string; requiresReport: boolean }[] = [
    { id: "log",             label: "Decision Log",   requiresReport: false },
    { id: "dashboard",       label: "Dashboard",      requiresReport: false },
    { id: "summary",         label: "Summary",        requiresReport: true  },
    { id: "timeline",        label: "Timeline",       requiresReport: true  },
    { id: "gaps",            label: "Gap Analysis",   requiresReport: true  },
    { id: "roles",           label: "Role Feedback",  requiresReport: true  },
    { id: "recommendations", label: "Recommendations",requiresReport: true  },
  ];

  return (
    <div className="flex flex-col h-full bg-rtr-base">
      {/* Header */}
      <div className="px-8 py-5 border-b border-rtr-border bg-rtr-panel sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-xs text-rtr-dim uppercase tracking-wider mb-1 font-mono">Post-Exercise Report</p>
            <h1 className="text-2xl font-semibold text-rtr-text">{session.scenario.title}</h1>
            <p className="text-sm text-rtr-muted mt-1">
              {SCENARIO_TYPE_LABELS[session.scenario.type]} ·{" "}
              {DIFFICULTY_LABEL[session.scenario.difficulty]} ·{" "}
              {formatDuration(duration)} ·{" "}
              {format(new Date(session.startedAt), "d MMM yyyy")} ·{" "}
              {session.participants.length} participants
            </p>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            {report && <AnimatedScoreBadge score={score} scoreColour={scoreColour} />}
            {!report && !generating && (
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 bg-rtr-red text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#c0001f] transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Generate AI Report
              </button>
            )}
            {generating && (
              <div className="flex items-center gap-2 text-sm text-rtr-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analysing transcript…
              </div>
            )}
            {report && (
              <button
                onClick={handleGenerate}
                className="text-xs text-rtr-dim hover:text-rtr-muted border border-rtr-border px-3 py-1.5 rounded"
              >
                Regenerate
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-sm border border-rtr-border px-3 py-2 rounded hover:bg-rtr-elevated transition-colors text-rtr-muted"
              title="Print / Save as PDF"
            >
              <Printer className="w-4 h-4" />Print
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-sm border border-rtr-border px-3 py-2 rounded hover:bg-rtr-elevated transition-colors text-rtr-muted"
            >
              <Download className="w-4 h-4" />Export
            </button>
          </div>
        </div>

        {genError && (
          <div className="max-w-5xl mx-auto mt-3 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />{genError}
          </div>
        )}

        <div className="max-w-5xl mx-auto mt-4 flex gap-1 flex-wrap print:hidden">
          {TABS.map((t) => {
            const disabled = t.requiresReport && !report;
            return (
              <button
                key={t.id}
                onClick={() => !disabled && setActiveTab(t.id)}
                disabled={disabled}
                className={cn(
                  "px-4 py-2 text-xs rounded transition-colors",
                  activeTab === t.id
                    ? "bg-rtr-red text-white font-medium"
                    : disabled
                    ? "text-rtr-dim opacity-40 cursor-not-allowed"
                    : "text-rtr-muted hover:bg-rtr-elevated"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {!report && !generating && (
            <NoReportState onGenerate={handleGenerate} hasApiKey={!!settings.claudeApiKey} />
          )}
          {generating && (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-rtr-red mx-auto mb-4" />
                <p className="text-rtr-text font-medium">Generating gap analysis…</p>
                <p className="text-rtr-muted text-sm mt-1">Claude is reading the full transcript. Usually 20–40s.</p>
              </div>
            </div>
          )}

          {activeTab === "log"             && <DecisionLogTab session={session} />}
          {activeTab === "dashboard"       && <DashboardTab session={session} />}
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

/** Score badge that pops in and counts up */
function AnimatedScoreBadge({ score, scoreColour }: { score: number; scoreColour: string }) {
  const displayed = useCountUp(score);
  return (
    <div className={`score-reveal flex flex-col items-center justify-center w-16 h-16 rounded-xl border text-2xl font-bold font-mono ${scoreColour}`}>
      {displayed}
      <span className="text-xs font-normal">/ 100</span>
    </div>
  );
}

function NoReportState({ onGenerate, hasApiKey }: { onGenerate: () => void; hasApiKey: boolean }) {
  const setView = useStore((s) => s.setView);
  const session = useStore((s) => s.session);

  return (
    <div className="max-w-2xl mx-auto fade-in-up">
      <div className="bg-rtr-panel border border-rtr-border rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-rtr-text mb-4">Session Summary</h2>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <p className="text-2xl font-bold text-rtr-text font-mono">{session?.liveInjects.length ?? 0}</p>
            <p className="text-xs text-rtr-muted">Injects released</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-rtr-text font-mono">
              {session?.liveInjects.reduce((n, li) => n + li.responses.length, 0) ?? 0}
            </p>
            <p className="text-xs text-rtr-muted">Responses logged</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-rtr-text font-mono">{session?.notes.length ?? 0}</p>
            <p className="text-xs text-rtr-muted">Facilitator notes</p>
          </div>
        </div>
      </div>

      {!hasApiKey ? (
        <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-5 text-center">
          <AlertCircle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-rtr-text mb-1">API key required</p>
          <p className="text-xs text-rtr-muted mb-3">
            Add your Anthropic API key in Settings to generate the AI gap analysis.
          </p>
          <button onClick={() => setView("settings")} className="text-sm text-rtr-green hover:underline">
            Go to Settings →
          </button>
        </div>
      ) : (
        <button
          onClick={onGenerate}
          className="w-full flex items-center justify-center gap-2 bg-rtr-red text-white py-3 rounded-xl text-sm font-medium hover:bg-[#c0001f] transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          Generate AI Gap Analysis
        </button>
      )}
    </div>
  );
}

function SummaryTab({ report }: { report: any }) {
  return (
    <div className="space-y-6 fade-in-up">
      <div className="bg-rtr-panel border border-rtr-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-rtr-text mb-3">Executive Summary</h2>
        <p className="text-sm text-rtr-muted leading-relaxed whitespace-pre-wrap">
          {report.executiveSummary}
        </p>
      </div>
      {/* Radar-style score overview */}
      <div>
        <h3 className="text-xs font-semibold text-rtr-dim uppercase tracking-wider mb-3">Performance Overview</h3>
        <div className="grid grid-cols-3 gap-4 stagger">
          {report.gapAnalysis.slice(0, 6).map((g: GapDimension) => (
            <ScoreCard key={g.dimension} gap={g} />
          ))}
        </div>
      </div>
    </div>
  );
}

function scoreStyle(score: number) {
  if (score >= 75) return {
    card:  "bg-rtr-green/8 border-rtr-green/25",
    text:  "text-rtr-green",
    track: "bg-rtr-green/20",
    bar:   "bg-rtr-green",
  };
  if (score >= 50) return {
    card:  "bg-amber-500/8 border-amber-500/25",
    text:  "text-amber-400",
    track: "bg-amber-500/20",
    bar:   "bg-amber-400",
  };
  return {
    card:  "bg-red-500/8 border-red-500/25",
    text:  "text-red-400",
    track: "bg-red-500/20",
    bar:   "bg-red-400",
  };
}

function ScoreCard({ gap }: { gap: GapDimension }) {
  const s = scoreStyle(gap.score);
  const [width, setWidth] = useState(0);

  // Animate bar in on mount
  useEffect(() => {
    const t = setTimeout(() => setWidth(gap.score), 80);
    return () => clearTimeout(t);
  }, [gap.score]);

  return (
    <div className={`border rounded-xl p-4 fade-in-up ${s.card}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-rtr-text">{gap.dimension}</span>
        <span className={`text-xl font-bold font-mono ${s.text}`}>{gap.score}</span>
      </div>
      <div className={`h-1.5 rounded-full mb-2 ${s.track}`}>
        <div className={`h-full rounded-full bar-animate ${s.bar}`} style={{ width: `${width}%` }} />
      </div>
      <p className="text-xs text-rtr-muted line-clamp-2">{gap.observations[0]}</p>
    </div>
  );
}

function TimelineTab({ session }: { session: any }) {
  return (
    <div className="space-y-6 fade-in-up">
      {session.liveInjects.map((li: any, i: number) => (
        <div key={li.injectId} className="relative flex gap-4">
          {i < session.liveInjects.length - 1 && (
            <div className="absolute left-4 top-9 bottom-0 w-px bg-rtr-border" />
          )}
          <div className="shrink-0 w-8 h-8 rounded-full bg-rtr-red/15 border border-rtr-red/30 flex items-center justify-center text-xs font-bold text-rtr-red z-10 font-mono">
            {i + 1}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-rtr-text">{li.injectTitle}</span>
              <span className="text-xs text-rtr-dim font-mono">
                {format(new Date(li.releasedAt), "HH:mm:ss")}
              </span>
            </div>
            <div className="bg-rtr-panel border border-rtr-border rounded-xl p-4 mb-3 text-sm text-rtr-muted leading-relaxed">
              {li.injectBody}
            </div>
            {li.responses.map((r: any) => (
              <div key={r.role} className="flex gap-3 mb-2">
                <span className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded self-start ${ROLE_COLOUR[r.role]}`}>
                  {ROLE_SHORT[r.role]}
                </span>
                <div className="bg-rtr-elevated border border-rtr-border rounded-lg px-3 py-2 flex-1">
                  <p className="text-xs text-rtr-muted">{r.body}</p>
                </div>
              </div>
            ))}
            {li.decisions.map((d: any) => (
              <div key={d.role} className="flex items-center gap-2 text-xs text-amber-400 mt-1">
                <span className={`font-bold px-1.5 py-0.5 rounded ${ROLE_COLOUR[d.role]}`}>
                  {ROLE_SHORT[d.role]}
                </span>
                chose Option {d.optionKey}: {d.optionLabel}
              </div>
            ))}
            {li.facilitatorNote && (
              <p className="text-xs text-amber-300 bg-amber-500/8 rounded-lg px-3 py-2 mt-2">
                📝 {li.facilitatorNote}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function GapsTab({ gaps }: { gaps: GapDimension[] }) {
  return (
    <div className="space-y-4 fade-in-up">
      {gaps.map((gap) => <GapCard key={gap.dimension} gap={gap} />)}
    </div>
  );
}

function GapCard({ gap }: { gap: GapDimension }) {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const s = scoreStyle(gap.score);

  useEffect(() => {
    const t = setTimeout(() => setWidth(gap.score), 100);
    return () => clearTimeout(t);
  }, [gap.score]);

  return (
    <div className={`border rounded-xl overflow-hidden ${s.card}`}>
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-4 px-5 py-4 group">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${s.track}`}>
          <span className={`text-xl font-bold font-mono ${s.text}`}>{gap.score}</span>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-rtr-text">{gap.dimension}</p>
          <p className="text-xs text-rtr-muted mt-0.5 line-clamp-1">{gap.observations[0]}</p>
        </div>
        <div className={`w-24 h-2 rounded-full mr-4 ${s.track}`}>
          <div className={`h-full rounded-full bar-animate ${s.bar}`} style={{ width: `${width}%` }} />
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-rtr-dim" /> : <ChevronDown className="w-4 h-4 text-rtr-dim group-hover:translate-y-0.5 transition-transform" />}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-rtr-border pt-4 grid grid-cols-2 gap-6 fade-in-up">
          <div>
            <p className="text-xs font-semibold text-rtr-dim uppercase tracking-wider mb-2">Observations</p>
            <ul className="space-y-1.5">
              {gap.observations.map((o, i) => (
                <li key={i} className="flex gap-2 text-xs text-rtr-muted">
                  <Minus className="w-3 h-3 shrink-0 mt-0.5 text-rtr-dim" />{o}
                </li>
              ))}
            </ul>
          </div>
          {gap.positives.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-rtr-dim uppercase tracking-wider mb-2">Positives</p>
              <ul className="space-y-1.5">
                {gap.positives.map((p, i) => (
                  <li key={i} className="flex gap-2 text-xs text-rtr-muted">
                    <CheckCircle className="w-3 h-3 shrink-0 mt-0.5 text-rtr-green" />{p}
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

function RolesTab({ feedback, participants }: { feedback: any; participants: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 stagger fade-in-up">
      {Object.entries(feedback).map(([role, fb]: [string, any]) => (
        <RoleCard key={role} role={role} fb={fb} participants={participants} />
      ))}
    </div>
  );
}

function RoleCard({ role, fb, participants }: { role: string; fb: any; participants: any[] }) {
  const [barWidth, setBarWidth] = useState(0);
  const scoreColor = fb.score >= 75 ? "text-rtr-green" : fb.score >= 50 ? "text-amber-400" : "text-red-400";
  const barColor   = fb.score >= 75 ? "bg-rtr-green"  : fb.score >= 50 ? "bg-amber-400"    : "bg-red-400";
  const trackColor = fb.score >= 75 ? "bg-rtr-green/20" : fb.score >= 50 ? "bg-amber-500/20" : "bg-red-500/20";

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(fb.score), 150);
    return () => clearTimeout(t);
  }, [fb.score]);

  return (
    <div className="bg-rtr-panel border border-rtr-border rounded-xl p-5 fade-in-up">
      <div className="flex items-center gap-2.5 mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded ${ROLE_COLOUR[role]}`}>
          {ROLE_SHORT[role]}
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-rtr-text">{ROLE_LONG[role]}</p>
          {participants.find((p: any) => p.role === role)?.name && (
            <p className="text-xs text-rtr-dim">
              {participants.find((p: any) => p.role === role).name}
            </p>
          )}
        </div>
        <span className={cn("text-lg font-bold font-mono", scoreColor)}>{fb.score}</span>
      </div>
      {/* Score bar */}
      <div className={`h-1 rounded-full mb-3 ${trackColor}`}>
        <div className={`h-full rounded-full bar-animate ${barColor}`} style={{ width: `${barWidth}%` }} />
      </div>
      <p className="text-xs text-rtr-muted leading-relaxed mb-3">{fb.summary}</p>
      {fb.strengths.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-semibold text-rtr-green mb-1">Strengths</p>
          <ul className="space-y-1">
            {fb.strengths.map((str: string, i: number) => (
              <li key={i} className="flex gap-1.5 text-xs text-rtr-muted">
                <CheckCircle className="w-3 h-3 shrink-0 mt-0.5 text-rtr-green" />{str}
              </li>
            ))}
          </ul>
        </div>
      )}
      {fb.gaps.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-400 mb-1">Gaps</p>
          <ul className="space-y-1">
            {fb.gaps.map((g: string, i: number) => (
              <li key={i} className="flex gap-1.5 text-xs text-rtr-muted">
                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-red-400" />{g}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Decision log tab ─────────────────────────────────────────────────────────

function DecisionLogTab({ session }: { session: Session }) {
  const allDecisions = session.liveInjects.flatMap((li) =>
    li.decisions.map((d) => ({
      ...d,
      injectTitle: li.injectTitle,
      releasedAt:  li.releasedAt,
    }))
  );

  if (allDecisions.length === 0) {
    return (
      <div className="text-center py-16 fade-in-up">
        <ClipboardList className="w-10 h-10 text-rtr-dim mx-auto mb-3" />
        <p className="text-sm text-rtr-muted">No decisions recorded in this session.</p>
        <p className="text-xs text-rtr-dim mt-1">Decisions appear when participants vote at decision-point injects.</p>
      </div>
    );
  }

  return (
    <div className="fade-in-up space-y-4">
      <p className="text-xs text-rtr-dim">{allDecisions.length} decision{allDecisions.length !== 1 ? "s" : ""} recorded across {session.liveInjects.filter((li) => li.decisions.length > 0).length} inject{session.liveInjects.filter((li) => li.decisions.length > 0).length !== 1 ? "s" : ""}</p>
      <div className="bg-rtr-panel border border-rtr-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rtr-border text-xs text-rtr-dim uppercase tracking-wider">
              <th className="px-4 py-3 text-left font-semibold">Time</th>
              <th className="px-4 py-3 text-left font-semibold">Inject</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Decision</th>
            </tr>
          </thead>
          <tbody>
            {allDecisions.map((d, i) => (
              <tr key={i} className={cn("border-b border-rtr-border last:border-0", i % 2 === 0 ? "" : "bg-rtr-elevated/30")}>
                <td className="px-4 py-3 text-xs text-rtr-dim font-mono whitespace-nowrap">
                  {format(new Date(d.releasedAt), "HH:mm:ss")}
                </td>
                <td className="px-4 py-3 text-xs text-rtr-muted max-w-[180px] truncate">{d.injectTitle}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${ROLE_COLOUR[d.role]}`}>
                    {ROLE_SHORT[d.role] ?? d.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-rtr-muted">{d.name || "—"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center font-mono">{d.optionKey}</span>
                    <span className="text-xs text-rtr-text">{d.optionLabel}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Dashboard / reputation chart tab ─────────────────────────────────────────

function DashboardTab({ session }: { session: Session }) {
  // Rule-based reputation score: starts at 100, each inject chips it down;
  // responses and decisions partially offset the damage.
  const points = session.liveInjects.map((li, i) => {
    const baseDamage   = -8;
    const responseGain = Math.min(li.responses.length * 3, 12);
    const decisionGain = Math.min(li.decisions.length * 4, 8);
    const prev = i === 0 ? 100 : 0; // accumulation handled below
    return { label: li.injectTitle, delta: baseDamage + responseGain + decisionGain, responses: li.responses.length, decisions: li.decisions.length };
  });

  // Build cumulative score series
  let running = 100;
  const series: { label: string; score: number; responses: number; decisions: number }[] = [
    { label: "Start", score: 100, responses: 0, decisions: 0 },
  ];
  for (const p of points) {
    running = Math.max(0, Math.min(100, running + p.delta));
    series.push({ label: p.label, score: Math.round(running), responses: p.responses, decisions: p.decisions });
  }

  if (series.length < 2) {
    return (
      <div className="text-center py-16 fade-in-up">
        <BarChart2 className="w-10 h-10 text-rtr-dim mx-auto mb-3" />
        <p className="text-sm text-rtr-muted">No injects released yet — dashboard will populate as the session runs.</p>
      </div>
    );
  }

  // SVG chart dimensions
  const W = 680; const H = 240; const PAD = { top: 20, right: 20, bottom: 48, left: 44 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top  - PAD.bottom;
  const n = series.length;
  const xPos = (i: number) => PAD.left + (i / (n - 1)) * chartW;
  const yPos = (score: number) => PAD.top + (1 - score / 100) * chartH;

  // Build polyline points
  const linePoints = series.map((s, i) => `${xPos(i)},${yPos(s.score)}`).join(" ");

  // Colour of final score
  const finalScore = series[series.length - 1].score;
  const lineColor  = finalScore >= 70 ? "#4afe91" : finalScore >= 45 ? "#f59e0b" : "#e8002d";

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="fade-in-up space-y-6">
      {/* Score cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-rtr-panel border border-rtr-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold font-mono" style={{ color: lineColor }}>{finalScore}</p>
          <p className="text-xs text-rtr-muted mt-1">Reputation Score</p>
        </div>
        <div className="bg-rtr-panel border border-rtr-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold font-mono text-rtr-text">
            {session.liveInjects.reduce((n, li) => n + li.responses.length, 0)}
          </p>
          <p className="text-xs text-rtr-muted mt-1">Total Responses</p>
        </div>
        <div className="bg-rtr-panel border border-rtr-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold font-mono text-amber-400">
            {session.liveInjects.reduce((n, li) => n + li.decisions.length, 0)}
          </p>
          <p className="text-xs text-rtr-muted mt-1">Decisions Made</p>
        </div>
      </div>

      {/* Line chart */}
      <div className="bg-rtr-panel border border-rtr-border rounded-xl p-5">
        <h3 className="text-xs font-semibold text-rtr-dim uppercase tracking-wider mb-4">Reputation Over Session</h3>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 280 }}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line
                x1={PAD.left} y1={yPos(v)} x2={PAD.left + chartW} y2={yPos(v)}
                stroke="#1e2128" strokeWidth="1"
              />
              <text x={PAD.left - 6} y={yPos(v) + 4} textAnchor="end" fontSize="9" fill="#4a4f65">{v}</text>
            </g>
          ))}

          {/* Gradient fill under line */}
          <defs>
            <linearGradient id="rep-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={lineColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points={`${xPos(0)},${yPos(0)} ${linePoints} ${xPos(n - 1)},${PAD.top + chartH} ${xPos(0)},${PAD.top + chartH}`}
            fill="url(#rep-gradient)"
          />

          {/* Line */}
          <polyline points={linePoints} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" />

          {/* Data points + hover targets */}
          {series.map((s, i) => (
            <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <circle cx={xPos(i)} cy={yPos(s.score)} r={hovered === i ? 6 : 4} fill={lineColor} stroke="#0d0e10" strokeWidth="2" style={{ cursor: "pointer" }} />
              {hovered === i && (
                <g>
                  <rect
                    x={Math.min(xPos(i) - 48, W - 120)} y={yPos(s.score) - 54}
                    width="110" height="48" rx="4"
                    fill="#15171a" stroke="#2a2e3a"
                  />
                  <text x={Math.min(xPos(i) - 48, W - 120) + 8} y={yPos(s.score) - 36} fontSize="9" fill="#e8eaf0" fontWeight="bold">{s.score} rep</text>
                  <text x={Math.min(xPos(i) - 48, W - 120) + 8} y={yPos(s.score) - 24} fontSize="8" fill="#8b8fa8">{s.responses} responses</text>
                  <text x={Math.min(xPos(i) - 48, W - 120) + 8} y={yPos(s.score) - 13} fontSize="8" fill="#8b8fa8">{s.decisions} decisions</text>
                </g>
              )}
              {/* X-axis label */}
              <text
                x={xPos(i)} y={H - 8}
                textAnchor="middle" fontSize="8" fill="#4a4f65"
                style={{ maxWidth: chartW / n }}
              >
                {i === 0 ? "Start" : `#${i}`}
              </text>
            </g>
          ))}
        </svg>
        <p className="text-xs text-rtr-dim mt-2">Score: starts at 100, −8 per inject, +3 per response, +4 per decision. Hover points for detail.</p>
      </div>

      {/* Per-inject breakdown */}
      <div className="bg-rtr-panel border border-rtr-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-rtr-border">
          <p className="text-xs font-semibold text-rtr-dim uppercase tracking-wider">Inject Breakdown</p>
        </div>
        <div className="divide-y divide-rtr-border">
          {session.liveInjects.map((li, i) => {
            const s = series[i + 1];
            const delta = s.score - series[i].score;
            return (
              <div key={li.injectId} className="flex items-center gap-4 px-4 py-3">
                <span className="w-6 h-6 rounded-full bg-rtr-red/15 text-rtr-red text-xs font-bold flex items-center justify-center font-mono shrink-0">{i + 1}</span>
                <span className="flex-1 text-xs text-rtr-text truncate">{li.injectTitle}</span>
                <span className="text-xs text-rtr-muted">{li.responses.length} resp · {li.decisions.length} dec</span>
                <span className={cn("text-xs font-mono font-semibold w-12 text-right", delta >= 0 ? "text-rtr-green" : "text-red-400")}>
                  {delta >= 0 ? "+" : ""}{delta}
                </span>
                <span className="text-xs font-mono text-rtr-text w-8 text-right">{s.score}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RecsTab({ recs }: { recs: any[] }) {
  const sorted = [...recs].sort((a, b) =>
    ["HIGH","MEDIUM","LOW"].indexOf(a.priority) - ["HIGH","MEDIUM","LOW"].indexOf(b.priority)
  );
  const badge = {
    HIGH:   "text-red-400 bg-red-500/10 border-red-500/30",
    MEDIUM: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    LOW:    "text-rtr-muted bg-rtr-elevated border-rtr-border",
  } as Record<string, string>;

  return (
    <div className="space-y-4 stagger fade-in-up">
      {sorted.map((r, i) => (
        <div key={i} className="bg-rtr-panel border border-rtr-border rounded-xl p-5 flex gap-4 fade-in-up card-lift">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded border self-start h-fit font-mono ${badge[r.priority]}`}>
            {r.priority}
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-rtr-text mb-1">{r.title}</p>
            <p className="text-xs text-rtr-muted leading-relaxed">{r.detail}</p>
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
