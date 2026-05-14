/**
 * Report.tsx - Post-exercise debrief dashboard.
 *
 * Report is computed deterministically from session data by computeReport()
 * (stored on the Session when endSession() fires — no button, no API key needed).
 *
 * Tabs: Decision Log · Dashboard · Summary · Timeline · Gap Analysis ·
 *       Role Feedback · Recommendations · Real Outcome (if defined)
 *
 * Print-optimised via @media print CSS rules.
 */

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store";
import {
  Download, CheckCircle, ChevronDown, ChevronUp,
  Minus, AlertTriangle, Printer, ClipboardList, BarChart2,
} from "lucide-react";
import {
  cn, ROLE_SHORT, ROLE_COLOUR, ROLE_LONG,
  SCENARIO_TYPE_LABELS, DIFFICULTY_LABEL, formatDuration,
} from "@/lib/utils";
import { format } from "date-fns";
import type { GapDimension, Session } from "@/types";

type Tab = "summary" | "timeline" | "gaps" | "roles" | "recommendations" | "log" | "dashboard" | "outcome";

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
  const session      = useStore((s) => s.session);
  const pastSessions = useStore((s) => s.pastSessions);

  const [activeTab, setActiveTab] = useState<Tab>("summary");

  if (!session) {
    return <div className="p-8 text-center text-crux-muted">No session selected.</div>;
  }

  const report   = session.report;
  const duration = session.endedAt
    ? Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)
    : session.scenario.durationMin;

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
    ? "text-crux-green bg-crux-green/10 border-crux-green/30"
    : score >= 50
    ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
    : "text-red-400 bg-red-500/10 border-red-500/30";

  const TABS: { id: Tab; label: string }[] = [
    { id: "summary",         label: "Summary"         },
    { id: "gaps",            label: "Gap Analysis"    },
    { id: "roles",           label: "Role Feedback"   },
    { id: "recommendations", label: "Recommendations" },
    { id: "timeline",        label: "Timeline"        },
    { id: "log",             label: "Decision Log"    },
    { id: "dashboard",       label: "Dashboard"       },
    ...(session.scenario.realOutcome ? [{ id: "outcome" as Tab, label: "Real Outcome" }] : []),
  ];

  return (
    <div className="flex flex-col h-full bg-crux-base">
      {/* Header */}
      <div className="px-8 py-5 border-b border-crux-border bg-crux-panel sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-xs text-crux-dim uppercase tracking-wider mb-1 font-mono">Post-Exercise Report</p>
            <h1 className="text-2xl font-semibold text-crux-text">{session.scenario.title}</h1>
            <p className="text-sm text-crux-muted mt-1">
              {SCENARIO_TYPE_LABELS[session.scenario.type]} ·{" "}
              {DIFFICULTY_LABEL[session.scenario.difficulty]} ·{" "}
              {formatDuration(duration)} ·{" "}
              {format(new Date(session.startedAt), "d MMM yyyy")} ·{" "}
              {session.participants.length} participant{session.participants.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            {report && <AnimatedScoreBadge score={score} scoreColour={scoreColour} />}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-sm border border-crux-border px-3 py-2 rounded hover:bg-crux-elevated transition-colors text-crux-muted"
              title="Print / Save as PDF"
            >
              <Printer className="w-4 h-4" />Print
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-sm border border-crux-border px-3 py-2 rounded hover:bg-crux-elevated transition-colors text-crux-muted"
            >
              <Download className="w-4 h-4" />Export
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-4 flex gap-1 flex-wrap print:hidden">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "px-4 py-2 text-xs rounded transition-colors",
                activeTab === t.id
                  ? "bg-crux-green text-white font-medium"
                  : "text-crux-muted hover:bg-crux-elevated"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="print:hidden">
            {activeTab === "summary"         && report && <SummaryTab report={report} />}
            {activeTab === "gaps"            && report && <GapsTab gaps={report.gapAnalysis} />}
            {activeTab === "roles"           && report && <RolesTab feedback={report.roleFeedback} participants={session.participants} />}
            {activeTab === "recommendations" && report && <RecsTab recs={report.recommendations} />}
            {activeTab === "timeline"        && <TimelineTab session={session} />}
            {activeTab === "log"             && <DecisionLogTab session={session} />}
            {activeTab === "dashboard"       && <DashboardTab session={session} pastSessions={pastSessions} />}
            {activeTab === "outcome" && session.scenario.realOutcome && (
              <RealOutcomeTab realOutcome={session.scenario.realOutcome} />
            )}
          </div>

          {/* Print: all sections at once */}
          <div className="hidden print:block space-y-8">
            {report && <>
              <div><h2 className="text-lg font-bold mb-4 print-section-title">Executive Summary</h2><SummaryTab report={report} /></div>
              <div><h2 className="text-lg font-bold mb-4 print-section-title">Decision Log</h2><DecisionLogTab session={session} /></div>
              <div><h2 className="text-lg font-bold mb-4 print-section-title">Timeline</h2><TimelineTab session={session} /></div>
              <div><h2 className="text-lg font-bold mb-4 print-section-title">Gap Analysis</h2><GapsTab gaps={report.gapAnalysis} /></div>
              <div><h2 className="text-lg font-bold mb-4 print-section-title">Role Feedback</h2><RolesTab feedback={report.roleFeedback} participants={session.participants} /></div>
              <div><h2 className="text-lg font-bold mb-4 print-section-title">Recommendations</h2><RecsTab recs={report.recommendations} /></div>
            </>}
            {session.scenario.realOutcome && (
              <div>
                <h2 className="text-lg font-bold mb-4 print-section-title">Real Outcome</h2>
                <RealOutcomeTab realOutcome={session.scenario.realOutcome} />
              </div>
            )}
          </div>
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

function RealOutcomeTab({ realOutcome }: { realOutcome: string }) {
  return (
    <div className="max-w-2xl mx-auto fade-in-up">
      <div className="bg-crux-panel border border-crux-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-crux-green" />
          <p className="text-xs font-semibold text-crux-dim uppercase tracking-wider">
            What actually happened
          </p>
        </div>
        <p className="text-sm text-crux-text leading-relaxed">{realOutcome}</p>
        <p className="text-xs text-crux-dim mt-4 border-t border-crux-border pt-3">
          Based on real incidents. We have changed names and details.
        </p>
      </div>
    </div>
  );
}


function SummaryTab({ report }: { report: any }) {
  return (
    <div className="space-y-6 fade-in-up">
      <div className="bg-crux-panel border border-crux-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-crux-text mb-3">Executive Summary</h2>
        <p className="text-sm text-crux-muted leading-relaxed whitespace-pre-wrap">
          {report.executiveSummary}
        </p>
      </div>
      {/* Radar-style score overview */}
      <div>
        <h3 className="text-xs font-semibold text-crux-dim uppercase tracking-wider mb-3">Performance Overview</h3>
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
    card:  "bg-crux-green/8 border-crux-green/25",
    text:  "text-crux-green",
    track: "bg-crux-green/20",
    bar:   "bg-crux-green",
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
        <span className="text-xs font-semibold text-crux-text">{gap.dimension}</span>
        <span className={`text-xl font-bold font-mono ${s.text}`}>{gap.score}</span>
      </div>
      <div className={`h-1.5 rounded-full mb-2 ${s.track}`}>
        <div className={`h-full rounded-full bar-animate ${s.bar}`} style={{ width: `${width}%` }} />
      </div>
      <p className="text-xs text-crux-muted line-clamp-2">{gap.observations[0]}</p>
    </div>
  );
}

function TimelineTab({ session }: { session: any }) {
  return (
    <div className="space-y-6 fade-in-up">
      {session.liveInjects.map((li: any, i: number) => (
        <div key={li.injectId} className="relative flex gap-4">
          {i < session.liveInjects.length - 1 && (
            <div className="absolute left-4 top-9 bottom-0 w-px bg-crux-border" />
          )}
          <div className="shrink-0 w-8 h-8 rounded-full bg-crux-red/15 border border-crux-red/30 flex items-center justify-center text-xs font-bold text-crux-red z-10 font-mono">
            {i + 1}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-crux-text">{li.injectTitle}</span>
              <span className="text-xs text-crux-dim font-mono">
                {format(new Date(li.releasedAt), "HH:mm:ss")}
              </span>
            </div>
            <div className="bg-crux-panel border border-crux-border rounded-xl p-4 mb-3 text-sm text-crux-muted leading-relaxed">
              {li.injectBody}
            </div>
            {li.responses.map((r: any) => (
              <div key={r.role} className="flex gap-3 mb-2">
                <span className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded self-start ${ROLE_COLOUR[r.role]}`}>
                  {ROLE_SHORT[r.role]}
                </span>
                <div className="bg-crux-elevated border border-crux-border rounded-lg px-3 py-2 flex-1">
                  <p className="text-xs text-crux-muted">{r.body}</p>
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
          <p className="text-sm font-semibold text-crux-text">{gap.dimension}</p>
          <p className="text-xs text-crux-muted mt-0.5 line-clamp-1">{gap.observations[0]}</p>
        </div>
        <div className={`w-24 h-2 rounded-full mr-4 ${s.track}`}>
          <div className={`h-full rounded-full bar-animate ${s.bar}`} style={{ width: `${width}%` }} />
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-crux-dim" /> : <ChevronDown className="w-4 h-4 text-crux-dim group-hover:translate-y-0.5 transition-transform" />}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-crux-border pt-4 grid grid-cols-2 gap-6 fade-in-up">
          <div>
            <p className="text-xs font-semibold text-crux-dim uppercase tracking-wider mb-2">Observations</p>
            <ul className="space-y-1.5">
              {gap.observations.map((o, i) => (
                <li key={i} className="flex gap-2 text-xs text-crux-muted">
                  <Minus className="w-3 h-3 shrink-0 mt-0.5 text-crux-dim" />{o}
                </li>
              ))}
            </ul>
          </div>
          {gap.positives.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-crux-dim uppercase tracking-wider mb-2">Positives</p>
              <ul className="space-y-1.5">
                {gap.positives.map((p, i) => (
                  <li key={i} className="flex gap-2 text-xs text-crux-muted">
                    <CheckCircle className="w-3 h-3 shrink-0 mt-0.5 text-crux-green" />{p}
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
  const scoreColor = fb.score >= 75 ? "text-crux-green" : fb.score >= 50 ? "text-amber-400" : "text-red-400";
  const barColor   = fb.score >= 75 ? "bg-crux-green"  : fb.score >= 50 ? "bg-amber-400"    : "bg-red-400";
  const trackColor = fb.score >= 75 ? "bg-crux-green/20" : fb.score >= 50 ? "bg-amber-500/20" : "bg-red-500/20";

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(fb.score), 150);
    return () => clearTimeout(t);
  }, [fb.score]);

  return (
    <div className="bg-crux-panel border border-crux-border rounded-xl p-5 fade-in-up">
      <div className="flex items-center gap-2.5 mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded ${ROLE_COLOUR[role]}`}>
          {ROLE_SHORT[role]}
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-crux-text">{ROLE_LONG[role]}</p>
          {participants.find((p: any) => p.role === role)?.name && (
            <p className="text-xs text-crux-dim">
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
      <p className="text-xs text-crux-muted leading-relaxed mb-3">{fb.summary}</p>
      {fb.strengths.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-semibold text-crux-green mb-1">Strengths</p>
          <ul className="space-y-1">
            {fb.strengths.map((str: string, i: number) => (
              <li key={i} className="flex gap-1.5 text-xs text-crux-muted">
                <CheckCircle className="w-3 h-3 shrink-0 mt-0.5 text-crux-green" />{str}
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
              <li key={i} className="flex gap-1.5 text-xs text-crux-muted">
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
        <ClipboardList className="w-10 h-10 text-crux-dim mx-auto mb-3" />
        <p className="text-sm text-crux-muted">No decisions recorded in this session.</p>
        <p className="text-xs text-crux-dim mt-1">Decisions are recorded when participants vote during the exercise.</p>
      </div>
    );
  }

  return (
    <div className="fade-in-up space-y-4">
      <p className="text-xs text-crux-dim">{allDecisions.length} decision{allDecisions.length !== 1 ? "s" : ""} recorded across {session.liveInjects.filter((li) => li.decisions.length > 0).length} inject{session.liveInjects.filter((li) => li.decisions.length > 0).length !== 1 ? "s" : ""}</p>
      <div className="bg-crux-panel border border-crux-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-crux-border text-xs text-crux-dim uppercase tracking-wider">
              <th className="px-4 py-3 text-left font-semibold">Time</th>
              <th className="px-4 py-3 text-left font-semibold">Inject</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Decision</th>
            </tr>
          </thead>
          <tbody>
            {allDecisions.map((d, i) => (
              <tr key={i} className={cn("border-b border-crux-border last:border-0", i % 2 === 0 ? "" : "bg-crux-elevated/30")}>
                <td className="px-4 py-3 text-xs text-crux-dim font-mono whitespace-nowrap">
                  {format(new Date(d.releasedAt), "HH:mm:ss")}
                </td>
                <td className="px-4 py-3 text-xs text-crux-muted max-w-[180px] truncate">{d.injectTitle}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${ROLE_COLOUR[d.role]}`}>
                    {ROLE_SHORT[d.role] ?? d.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-crux-muted">{d.name || "-"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center font-mono">{d.optionKey}</span>
                    <span className="text-xs text-crux-text">{d.optionLabel}</span>
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

// ── Dashboard tab ─────────────────────────────────────────────────────────────

function DashboardTab({ session, pastSessions }: { session: Session; pastSessions: Session[] }) {
  const totalResponses  = session.liveInjects.reduce((n, li) => n + li.responses.length, 0);
  const totalDecisions  = session.liveInjects.reduce((n, li) => n + li.decisions.length, 0);
  const decisionPoints  = session.liveInjects.filter((li) => li.decisions.length > 0).length;

  // Build ranked decision rows: one row per decision that has an option with a known rank.
  type QualityRow = {
    injectTitle: string;
    injectNum: number;
    role: string;
    name: string;
    optionKey: string;
    optionLabel: string;
    rank: number | undefined;
    maxRank: number;
  };

  const qualityRows: QualityRow[] = [];
  session.liveInjects.forEach((li, liIdx) => {
    const scenInject = session.scenario.injects.find((i) => i.id === li.injectId);
    if (!scenInject?.isDecisionPoint) return;
    const maxRank = Math.max(
      0,
      ...scenInject.decisionOptions.map((o) => o.rank ?? 0)
    );
    for (const dec of li.decisions) {
      const opt = scenInject.decisionOptions?.find((o) => o.key === dec.optionKey);
      qualityRows.push({
        injectTitle: li.injectTitle,
        injectNum: liIdx + 1,
        role: dec.role,
        name: dec.name,
        optionKey: dec.optionKey,
        optionLabel: dec.optionLabel,
        rank: opt?.rank,
        maxRank,
      });
    }
  });

  // Average rank across ranked decisions only
  const rankedRows = qualityRows.filter((r) => r.rank !== undefined);
  const avgRank = rankedRows.length > 0
    ? rankedRows.reduce((sum, r) => sum + r.rank!, 0) / rankedRows.length
    : null;
  const qualityLabel = avgRank === null ? null
    : avgRank <= 1.5 ? { label: "Strong", colour: "text-crux-green" }
    : avgRank <= 2.5 ? { label: "Mixed",  colour: "text-amber-400" }
    : { label: "Needs work", colour: "text-red-400" };

  if (session.liveInjects.length === 0) {
    return (
      <div className="text-center py-16 fade-in-up">
        <BarChart2 className="w-10 h-10 text-crux-dim mx-auto mb-3" />
        <p className="text-sm text-crux-muted">No injects released yet. The dashboard will fill in as the session runs.</p>
      </div>
    );
  }

  return (
    <div className="fade-in-up space-y-6">
      {/* Summary stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-crux-panel border border-crux-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold font-mono text-crux-text">{totalResponses}</p>
          <p className="text-xs text-crux-muted mt-1">Responses logged</p>
        </div>
        <div className="bg-crux-panel border border-crux-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold font-mono text-amber-400">{totalDecisions}</p>
          <p className="text-xs text-crux-muted mt-1">Decisions cast</p>
        </div>
        <div className="bg-crux-panel border border-crux-border rounded-xl p-4 text-center">
          {qualityLabel ? (
            <>
              <p className={`text-2xl font-bold font-mono ${qualityLabel.colour}`}>{avgRank!.toFixed(1)}</p>
              <p className={`text-xs mt-1 ${qualityLabel.colour}`}>{qualityLabel.label} avg rank</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold font-mono text-crux-dim">{decisionPoints}</p>
              <p className="text-xs text-crux-muted mt-1">Decision points</p>
            </>
          )}
        </div>
      </div>

      {/* Decision quality table */}
      {qualityRows.length > 0 ? (
        <div className="bg-crux-panel border border-crux-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-crux-border flex items-center justify-between">
            <p className="text-xs font-semibold text-crux-dim uppercase tracking-wider">Decision Quality</p>
            <p className="text-xs text-crux-dim">Rank 1 = best option · lower is better</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-crux-border text-xs text-crux-dim uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Inject</th>
                <th className="px-4 py-3 text-left font-semibold">Role</th>
                <th className="px-4 py-3 text-left font-semibold">Option chosen</th>
                <th className="px-4 py-3 text-center font-semibold">Quality</th>
              </tr>
            </thead>
            <tbody>
              {qualityRows.map((row, i) => {
                const rankColour = row.rank === undefined ? "text-crux-dim"
                  : row.rank === 1 ? "text-crux-green"
                  : row.rank === 2 ? "text-amber-400"
                  : row.rank === 3 ? "text-orange-400"
                  : "text-red-400";
                const rankBg = row.rank === undefined ? ""
                  : row.rank === 1 ? "bg-crux-green/10 border-crux-green/30"
                  : row.rank === 2 ? "bg-amber-500/10 border-amber-500/30"
                  : row.rank === 3 ? "bg-orange-500/10 border-orange-500/30"
                  : "bg-red-500/10 border-red-500/30";
                return (
                  <tr key={i} className={cn("border-b border-crux-border last:border-0", i % 2 === 0 ? "" : "bg-crux-elevated/30")}>
                    <td className="px-4 py-3 text-xs text-crux-dim font-mono">{row.injectNum}</td>
                    <td className="px-4 py-3 text-xs text-crux-muted max-w-[160px] truncate">{row.injectTitle}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${ROLE_COLOUR[row.role] ?? "bg-crux-elevated text-crux-muted"}`}>
                        {ROLE_SHORT[row.role] ?? row.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center font-mono">{row.optionKey}</span>
                        <span className="text-xs text-crux-text truncate max-w-[200px]">{row.optionLabel}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.rank !== undefined ? (
                        <span className={`inline-flex items-center justify-center text-xs font-bold font-mono px-2 py-0.5 rounded border ${rankColour} ${rankBg}`}>
                          #{row.rank}/{row.maxRank}
                        </span>
                      ) : (
                        <span className="text-xs text-crux-dim">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-crux-panel border border-crux-border rounded-xl p-6 text-center">
          <p className="text-xs text-crux-dim">No ranked decisions recorded. Decision quality analysis requires ranked options in the scenario design.</p>
        </div>
      )}

      {/* Per-inject breakdown */}
      <div className="bg-crux-panel border border-crux-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-crux-border">
          <p className="text-xs font-semibold text-crux-dim uppercase tracking-wider">Inject Breakdown</p>
        </div>
        <div className="divide-y divide-crux-border">
          {session.liveInjects.map((li, i) => (
            <div key={li.injectId} className="flex items-center gap-4 px-4 py-3">
              <span className="w-6 h-6 rounded-full bg-crux-red/15 text-crux-red text-xs font-bold flex items-center justify-center font-mono shrink-0">{i + 1}</span>
              <span className="flex-1 text-xs text-crux-text truncate">{li.injectTitle}</span>
              <span className="text-xs text-crux-muted">{li.responses.length} resp · {li.decisions.length} dec</span>
              {li.skipped && (
                <span className="text-xs text-crux-dim border border-crux-border px-1.5 py-0.5 rounded font-mono">skipped</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <ScenarioComparisonCard session={session} pastSessions={pastSessions} />
    </div>
  );
}

// ── Scenario comparison card ──────────────────────────────────────────────────

function ScenarioComparisonCard({ session, pastSessions }: { session: Session; pastSessions: Session[] }) {
  // Prior runs of this scenario, excluding the current session.
  const priorRuns = pastSessions.filter(
    (s) => s.id !== session.id && s.scenario.id === session.scenario.id && s.report?.overallScore != null
  );

  if (priorRuns.length === 0) return null;

  const avgScore = Math.round(priorRuns.reduce((sum, s) => sum + (s.report!.overallScore), 0) / priorRuns.length);
  const thisScore = session.report?.overallScore ?? null;
  const diff = thisScore != null ? thisScore - avgScore : null;

  const diffColour = diff == null ? "" : diff > 0 ? "text-crux-green" : diff < 0 ? "text-red-400" : "text-crux-muted";
  const diffLabel  = diff == null ? null : diff > 0 ? `+${diff} above average` : diff < 0 ? `${diff} below average` : "On average";

  return (
    <div className="bg-crux-panel border border-crux-border rounded-xl p-5 fade-in-up">
      <p className="text-xs font-semibold text-crux-dim uppercase tracking-wider mb-4">
        Previous Runs of This Scenario
      </p>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold font-mono text-crux-text">{priorRuns.length}</p>
          <p className="text-xs text-crux-muted mt-1">
            Prior run{priorRuns.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold font-mono text-crux-text">{avgScore}</p>
          <p className="text-xs text-crux-muted mt-1">Average score</p>
        </div>
        <div>
          {diff != null ? (
            <>
              <p className={`text-2xl font-bold font-mono ${diffColour}`}>
                {thisScore}
              </p>
              <p className={`text-xs mt-1 ${diffColour}`}>{diffLabel}</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold font-mono text-crux-dim">--</p>
              <p className="text-xs text-crux-muted mt-1">This run (no report yet)</p>
            </>
          )}
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
    LOW:    "text-crux-muted bg-crux-elevated border-crux-border",
  } as Record<string, string>;

  return (
    <div className="space-y-4 stagger fade-in-up">
      {sorted.map((r, i) => (
        <div key={i} className="bg-crux-panel border border-crux-border rounded-xl p-5 flex gap-4 fade-in-up card-lift">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded border self-start h-fit font-mono ${badge[r.priority]}`}>
            {r.priority}
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-crux-text mb-1">{r.title}</p>
            <p className="text-xs text-crux-muted leading-relaxed">{r.detail}</p>
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
