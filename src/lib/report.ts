/**
 * report.ts - Deterministic post-exercise debrief report engine.
 *
 * Computes a full GeneratedReport from session data without any external API
 * call. Scores are derived from the decision-rank data embedded in scenario
 * option definitions. Observations and recommendations are drawn from
 * structured template banks keyed by score band and dimension.
 *
 * Called from the store's endSession() action so the report is instantly
 * available when the facilitator navigates to the Report screen.
 */

import type {
  Session, GeneratedReport, GapDimension, RoleFeedback,
  Recommendation, Inject, DecisionEntry,
} from "@/types";
import { ROLE_LONG, ROLE_SHORT, SCENARIO_TYPE_LABELS } from "@/lib/utils";

// ─── Internal types ───────────────────────────────────────────────────────────

interface ScoredDecision {
  inject: Inject;
  decision: DecisionEntry;
  rank: number;
  consequence?: string;
}

// ─── Data collection ──────────────────────────────────────────────────────────

function findInject(session: Session, id: string): Inject | undefined {
  return session.scenario.injects.find((i) => i.id === id);
}

function collectRankedDecisions(session: Session): ScoredDecision[] {
  const out: ScoredDecision[] = [];
  for (const li of session.liveInjects) {
    if (li.skipped) continue;
    const inject = findInject(session, li.injectId);
    if (!inject) continue;
    for (const dec of li.decisions) {
      const opt = inject.decisionOptions.find((o) => o.key === dec.optionKey);
      if (opt?.rank != null) {
        out.push({ inject, decision: dec, rank: opt.rank, consequence: opt.consequence });
      }
    }
  }
  return out;
}

function avgRankToScore(decisions: ScoredDecision[]): number | null {
  if (!decisions.length) return null;
  const avg = decisions.reduce((s, d) => s + d.rank, 0) / decisions.length;
  // rank 1 → 100, rank 2 → 67, rank 3 → 33, rank 4 → 0
  return Math.max(0, Math.min(100, Math.round(((4 - avg) / 3) * 100)));
}

// ─── Score band helpers ───────────────────────────────────────────────────────

type Band = "high" | "mid" | "low";

function band(score: number): Band {
  return score >= 70 ? "high" : score >= 45 ? "mid" : "low";
}

function pick<T>(pools: { high: T[]; mid: T[]; low: T[] }, score: number, n: number): T[] {
  return pools[band(score)].slice(0, n);
}

/** Build the observation list for a dimension.
 *  Uses score-band templates, then appends one grounded observation from the
 *  worst poor decision (rank ≥ 3) if it has consequence text. */
function buildObservations(
  score: number,
  pools: { high: string[]; mid: string[]; low: string[] },
  poorDecisions: ScoredDecision[],
): string[] {
  const base = pick(pools, score, 2);

  const worst = [...poorDecisions]
    .filter((d) => d.rank >= 3)
    .sort((a, b) => b.rank - a.rank)[0];

  if (worst?.consequence) {
    const excerpt = worst.consequence.split(". ").slice(0, 2).join(". ").trimEnd();
    const grounded = `${worst.inject.title}: ${excerpt}.`;
    if (!base.some((o) => o.includes(worst.inject.title))) {
      base.push(grounded);
    }
  }

  return base;
}

// ─── Six gap dimensions ───────────────────────────────────────────────────────

function dimDecisionQuality(all: ScoredDecision[]): GapDimension {
  const score = avgRankToScore(all) ?? 60;
  return {
    dimension: "Decision Quality",
    score,
    observations: buildObservations(score, {
      high: [
        "The majority of decisions matched or approached the recommended option, demonstrating sound judgement under pressure.",
        "Options chosen reflected appropriate prioritisation of people, regulatory obligation, and reputational impact.",
      ],
      mid: [
        "Decision quality was uneven — several strong early calls were undermined by weaker choices in the middle phase.",
        "Some decisions optimised for short-term certainty over longer-term consequence, a common pattern under time pressure.",
        "Good instincts on the most visible decisions, but lower-profile choices carrying significant downstream risk were handled less well.",
      ],
      low: [
        "Multiple poor decisions compounded the incident's severity. Preferred options were consistently passed over in favour of simpler but riskier alternatives.",
        "Decisions showed a tendency to delay, avoid, or minimise rather than confront the hardest calls early — a pattern that typically makes incidents significantly more damaging.",
        "The team systematically underestimated second-order consequences, particularly around staff impact and regulatory exposure.",
      ],
    }, all.filter((d) => d.rank >= 3)),
    positives: pick({
      high: [
        "Strong awareness of second-order consequences across most decision points.",
        "Good calibration between risk appetite and urgency throughout the scenario.",
      ],
      mid: [
        "Genuine engagement with the hardest choices, even where the selected option was not optimal.",
      ],
      low: [],
    }, score, 2),
  };
}

function dimEscalation(session: Session, all: ScoredDecision[]): GapDimension {
  // Identify early-phase injects: first third of the scenario by inject order
  const orders = session.scenario.injects.map((i) => i.order).sort((a, b) => a - b);
  const cutoff = orders[Math.floor(orders.length / 3)] ?? 999;
  const early = all.filter((d) => d.inject.order <= cutoff);
  const score = avgRankToScore(early) ?? (avgRankToScore(all) ?? 60);

  return {
    dimension: "Governance & Escalation",
    score,
    observations: buildObservations(score, {
      high: [
        "Escalation to senior leadership happened quickly and at the right level without unnecessary hesitation.",
        "The group understood when a decision exceeded their authority and escalated rather than defaulting to the easiest available option.",
      ],
      mid: [
        "Escalation was broadly appropriate but some decisions were taken at the wrong level — either too high (creating bottlenecks) or too low (creating accountability gaps).",
        "Board notification timing was a weak point. The right information did not reach the right people quickly enough in the early phase.",
      ],
      low: [
        "Critical decisions were made without appropriate governance in the early phase. Key decision-makers were not in the room when it mattered most.",
        "The group showed a tendency to manage upward reporting conservatively, delaying the board's ability to exercise proper oversight.",
        "Escalation structures need to be pre-agreed before an incident. The exercise revealed uncertainty about who has authority for which decisions.",
      ],
    }, early.filter((d) => d.rank >= 3)),
    positives: pick({
      high: [
        "Clear escalation hierarchy maintained throughout.",
        "Decision-makers were engaged at the right level and with the right information.",
      ],
      mid: [
        "The team correctly identified that some decisions required board-level authority.",
      ],
      low: [],
    }, score, 2),
  };
}

function dimLegal(all: ScoredDecision[]): GapDimension {
  const legal = all.filter((d) => d.inject.targetRoles.includes("CLO"));
  const score = avgRankToScore(legal) ?? (avgRankToScore(all) ?? 60);

  return {
    dimension: "Legal & Regulatory Awareness",
    score,
    observations: buildObservations(score, {
      high: [
        "Legal and regulatory obligations were woven into decision-making from the outset rather than treated as a secondary concern.",
        "Notification obligations under NIS Regulations, GDPR, and relevant sector frameworks were considered at the right decision points.",
      ],
      mid: [
        "Regulatory awareness was present but inconsistent. Some obligations received appropriate attention; others were noted but not followed through.",
        "The group understood the broad regulatory framework but showed uncertainty about specific notification timelines and triggers.",
      ],
      low: [
        "Regulatory notification obligations were deprioritised in favour of technical and operational concerns — a common but costly mistake.",
        "The CLO function was under-utilised during the session. Legal counsel needs to be in the room from the first hour, not brought in to manage consequences.",
        "Several decisions created material regulatory exposure. Organisations that underperform on notification obligations face compounded enforcement action.",
      ],
    }, legal.filter((d) => d.rank >= 3)),
    positives: pick({
      high: [
        "Proactive approach to legal privilege documentation and CLO briefing.",
        "Regulatory notifications handled in the right sequence with appropriate urgency.",
      ],
      mid: [
        "The team showed awareness of the regulatory dimension, even if execution was incomplete.",
      ],
      low: [],
    }, score, 2),
  };
}

function dimComms(all: ScoredDecision[]): GapDimension {
  const comms = all.filter((d) => d.inject.targetRoles.includes("CCO"));
  const score = avgRankToScore(comms) ?? (avgRankToScore(all) ?? 60);

  return {
    dimension: "Crisis Communications",
    score,
    observations: buildObservations(score, {
      high: [
        "Communications strategy was clear, proactive, and consistently applied across internal and external audiences.",
        "Messaging decisions reflected an appropriate balance between transparency and operational security.",
      ],
      mid: [
        "Communications were reactive in several key moments. The organisation was behind the news cycle rather than shaping it.",
        "Internal communications received less attention than external messaging — a gap that creates staff anxiety and rumour during a real incident.",
      ],
      low: [
        "Communications decisions significantly worsened the reputational position. Silence or poorly timed statements in the first 24 hours typically become the story in their own right.",
        "The group's instinct to say nothing until everything is known is understandable but counterproductive. Holding statements and controlled disclosure are more effective than silence.",
        "Social media and traditional media were not managed in a coordinated way. A single narrative, consistently applied across all channels, is essential.",
      ],
    }, comms.filter((d) => d.rank >= 3)),
    positives: pick({
      high: [
        "Proactive staff communications maintained trust during a difficult period.",
        "Consistent messaging across all channels prevented conflicting narratives from developing.",
      ],
      mid: [
        "The team correctly identified that communications required dedicated resource and attention.",
      ],
      low: [],
    }, score, 2),
  };
}

function dimStakeholder(all: ScoredDecision[]): GapDimension {
  const sh = all.filter(
    (d) => d.inject.targetRoles.includes("BOARD_REP") || d.inject.targetRoles.includes("CEO"),
  );
  const score = avgRankToScore(sh) ?? (avgRankToScore(all) ?? 60);

  return {
    dimension: "Stakeholder Management",
    score,
    observations: buildObservations(score, {
      high: [
        "The board and key external stakeholders were managed with appropriate transparency and frequency.",
        "The CEO maintained clear authority while ensuring the right people were engaged at the right time.",
      ],
      mid: [
        "Board engagement was adequate but occasionally reactive. The chair and NEDs would have benefited from more proactive narrative management.",
        "Some stakeholders received less attention than their importance warranted, particularly during the middle phase of the scenario.",
      ],
      low: [
        "Stakeholder management was a significant gap. The board was left without adequate information at critical moments, increasing governance risk.",
        "Investor and regulatory relationship management requires proactive engagement even when the news is bad. Silence creates a vacuum that speculation fills.",
        "The CEO's role in managing upward and outward was not clearly exercised at key moments.",
      ],
    }, sh.filter((d) => d.rank >= 3)),
    positives: pick({
      high: [
        "Clear ownership of stakeholder relationships at the executive level.",
        "Board briefings were timely and contained the right level of information for governance purposes.",
      ],
      mid: [
        "The team correctly identified the board as a stakeholder requiring management, not just information.",
      ],
      low: [],
    }, score, 2),
  };
}

function dimContinuity(all: ScoredDecision[]): GapDimension {
  const cont = all.filter(
    (d) => d.inject.targetRoles.includes("CFO") || d.inject.targetRoles.includes("COO"),
  );
  const score = avgRankToScore(cont) ?? (avgRankToScore(all) ?? 60);

  return {
    dimension: "Operational Continuity",
    score,
    observations: buildObservations(score, {
      high: [
        "Operational continuity decisions appropriately balanced staff welfare, financial exposure, and business resilience.",
        "The CFO and COO functions were well-integrated into the response, with clear ownership of financial and operational decisions.",
      ],
      mid: [
        "Continuity decisions were broadly appropriate but several choices created unnecessary operational disruption or financial exposure.",
        "Staff impact was considered but not consistently prioritised. Decisions that look clean on paper can fail operationally if they underestimate staff anxiety.",
      ],
      low: [
        "Operational continuity was the area of greatest weakness. Decisions made would have significantly worsened the real-world impact on staff and customers.",
        "The financial implications of continuity decisions were not adequately modelled before options were chosen.",
        "Business continuity planning appears to be a gap. The team's responses suggested limited pre-agreed protocols for common failure scenarios.",
      ],
    }, cont.filter((d) => d.rank >= 3)),
    positives: pick({
      high: [
        "Strong integration between financial, operational, and HR considerations in continuity decisions.",
        "Clear prioritisation of staff welfare alongside technical recovery.",
      ],
      mid: [
        "The team showed awareness of the operational dimension beyond technical recovery.",
      ],
      low: [],
    }, score, 2),
  };
}

// ─── Executive summary ────────────────────────────────────────────────────────

function buildExecutiveSummary(
  session: Session,
  score: number,
  gaps: GapDimension[],
): string {
  const scenarioType = SCENARIO_TYPE_LABELS[session.scenario.type] ?? "crisis";
  const sorted = [...gaps].sort((a, b) => a.score - b.score);
  const worstGap = sorted[0];
  const bestGap  = sorted[sorted.length - 1];
  const n = session.participants.length;
  const decisionCount = session.liveInjects.reduce((sum, li) => sum + li.decisions.length, 0);

  if (score >= 75) {
    return `The team handled this ${scenarioType} exercise with sound judgement and appropriate urgency across most decision points. ${bestGap.dimension} was a particular strength — the right choices were made at the moments that mattered most. The primary development area is ${worstGap.dimension.toLowerCase()}: the gap analysis below identifies specific decisions where the preferred option was within reach but not taken. With ${n} participant${n !== 1 ? "s" : ""} and ${decisionCount} decision${decisionCount !== 1 ? "s" : ""} logged, this session provides a strong baseline for targeted improvement.`;
  }

  if (score >= 50) {
    return `This ${scenarioType} exercise produced a mixed performance: several strong instincts were undermined by weaker choices at key moments. The most significant gap was ${worstGap.dimension.toLowerCase()} — decisions in this area created the greatest risk of compounding the incident's severity. ${bestGap.dimension} showed more confidence, suggesting uneven preparation rather than a systemic failure. The debrief should focus on the specific decisions where the group diverged from best practice and why.`;
  }

  return `This ${scenarioType} exercise identified serious gaps that need to be addressed before the next real incident. The decision pattern across the session — particularly in ${worstGap.dimension.toLowerCase()} — suggests the organisation would struggle to contain the reputational, legal, and operational consequences of a real attack. The gap analysis below identifies the highest-priority areas for investment. A focused follow-up exercise within 90 days is strongly recommended.`;
}

// ─── Role feedback ────────────────────────────────────────────────────────────

function buildRoleFeedback(
  session: Session,
  all: ScoredDecision[],
): Record<string, RoleFeedback> {
  const out: Record<string, RoleFeedback> = {};

  for (const participant of session.participants) {
    const { role } = participant;
    const displayName = participant.name || ROLE_SHORT[role] || role;

    // Decisions made by this role vs decisions on injects this role was targeted for
    const made     = all.filter((d) => d.decision.role === role);
    const targeted = all.filter((d) => d.inject.targetRoles.includes(role));
    const score    = avgRankToScore(made.length ? made : targeted) ?? 60;

    const goodDecisions = made.filter((d) => d.rank <= 2);
    const poorDecisions = made.filter((d) => d.rank >= 3);

    const strengths: string[] = [];
    const gaps: string[] = [];

    if (made.length === 0) {
      gaps.push(
        targeted.length > 0
          ? `No decisions were formally cast for ${ROLE_LONG[role] ?? role} during the session. Encourage this role to engage with the formal decision process.`
          : `This role had limited direct involvement in the scenario's decision points. Consider whether the scenario design adequately targets ${ROLE_LONG[role] ?? role} responsibilities.`,
      );
    } else {
      if (goodDecisions.length > 0) {
        strengths.push(
          `Made the stronger choice on ${goodDecisions.length} of ${made.length} decision${made.length !== 1 ? "s" : ""} cast during the session.`,
        );
        const best = goodDecisions[0];
        strengths.push(
          `Sound judgement on "${best.inject.title}" — the preferred option was selected at a moment when other choices were more immediately appealing.`,
        );
      }
      if (poorDecisions.length > 0) {
        const worst = [...poorDecisions].sort((a, b) => b.rank - a.rank)[0];
        gaps.push(
          `The decision on "${worst.inject.title}" selected a lower-ranked option. Review the consequence and recommended approach in the debrief.`,
        );
        if (worst.consequence) {
          const excerpt = worst.consequence.split(". ").slice(0, 2).join(". ").trimEnd() + ".";
          gaps.push(excerpt);
        }
      }
    }

    let summary: string;
    if (made.length === 0) {
      summary = `${displayName} participated in the exercise but no formal decisions were recorded — this may reflect the scenario's focus rather than level of engagement.`;
    } else if (score >= 70) {
      summary = `${displayName} performed well across the decision points, generally selecting options that appropriately balanced urgency, risk, and consequence.`;
    } else if (score >= 45) {
      summary = `${displayName} showed a mixed performance — some sound decisions alongside choices that created avoidable risk. The debrief items below identify the specific moments for review.`;
    } else {
      summary = `${displayName}'s decisions contributed to the most significant risk moments in the session. These are the highest-priority items for individual development.`;
    }

    out[role] = { summary, strengths, gaps, score };
  }

  return out;
}

// ─── Recommendations ──────────────────────────────────────────────────────────

const DIM_RECS: Record<string, Recommendation> = {
  "Decision Quality": {
    priority: "HIGH",
    title: "Run a decision-framing debrief on this scenario",
    detail:
      "Replay the three lowest-ranked decisions with the team. For each: discuss what information was available, what options felt safest, and what the recommended approach was. Build muscle memory for the harder calls before the next exercise.",
  },
  "Governance & Escalation": {
    priority: "HIGH",
    title: "Pre-agree escalation thresholds in writing",
    detail:
      "Define and document: at what point does a cyber incident require CEO notification? Board notification? Regulator notification? Agree these thresholds before the next exercise and test them. Most organisations do not have these written down.",
    relatedRole: "CLO",
  },
  "Legal & Regulatory Awareness": {
    priority: "HIGH",
    title: "Map your notification obligations with the CLO",
    detail:
      "Spend two hours with the CLO mapping your specific notification obligations under NIS Regulations, UK GDPR, and sector-specific requirements. Agree who notifies whom, in what order, and within what timeframe. Translate this into a one-page crisis reference card.",
    relatedRole: "CLO",
  },
  "Crisis Communications": {
    priority: "MEDIUM",
    title: "Pre-approve holding statements for your highest-risk scenarios",
    detail:
      "Approve three holding statements in advance: one for ransomware / data encryption, one for data breach, one for service disruption. Pre-approval removes the bottleneck of legal sign-off under time pressure. Review annually.",
    relatedRole: "CCO",
  },
  "Stakeholder Management": {
    priority: "MEDIUM",
    title: "Brief key stakeholders on your incident response process now",
    detail:
      "Identify the five to ten stakeholders who will need to be notified in the first 24 hours of an incident. Brief them now on how the organisation handles major incidents, what to expect, and who their primary contact will be.",
    relatedRole: "CEO",
  },
  "Operational Continuity": {
    priority: "MEDIUM",
    title: "Document and exercise your business continuity protocols",
    detail:
      "Commission a one-page business continuity reference card for each of your highest-risk scenarios. Each card should pre-answer the three most time-critical decisions. Test these in a lightweight tabletop within 90 days.",
    relatedRole: "COO",
  },
};

const SCENARIO_RECS: Record<string, Recommendation> = {
  RANSOMWARE: {
    priority: "HIGH",
    title: "Establish a ransomware response playbook",
    detail:
      "Document pre-agreed positions on the three hardest ransomware decisions: (1) whether to engage with the threat actor at all, (2) under what conditions payment would be considered, (3) the notification sequence for regulators and law enforcement. Having pre-agreed positions removes the most time-consuming deliberation from the live incident.",
    relatedRole: "CLO",
  },
  DATA_BREACH: {
    priority: "HIGH",
    title: "Test your ICO 72-hour notification process",
    detail:
      "The 72-hour notification window under UK GDPR starts from the moment of awareness, not confirmation. Document who makes the notification decision, what information is required, and what the fallback is if the DPO is unavailable. Test this process within 60 days.",
    relatedRole: "CLO",
  },
  INSIDER_THREAT: {
    priority: "HIGH",
    title: "Define your insider threat investigation protocol",
    detail:
      "Insider threat incidents require careful sequencing of HR, legal, and security actions. A misstep — confronting a suspect before evidence is secured, or dismissing without following procedure — creates significant legal exposure. Document your protocol with HR and legal counsel.",
    relatedRole: "HR_LEAD",
  },
  SUPPLY_CHAIN: {
    priority: "MEDIUM",
    title: "Review third-party risk and incident notification requirements",
    detail:
      "Supply chain incidents require understanding obligations both upstream (to customers and regulators) and downstream (to suppliers). Map these dependencies and pre-agree how you will communicate in a live incident.",
    relatedRole: "CISO",
  },
};

function buildRecommendations(
  session: Session,
  all: ScoredDecision[],
  gaps: GapDimension[],
): Recommendation[] {
  const recs: Recommendation[] = [];

  // 1. Up to 3 specific recs from the worst decisions
  const poorDecisions = [...all]
    .filter((d) => d.rank >= 3)
    .sort((a, b) => b.rank - a.rank);

  for (const pd of poorDecisions.slice(0, 3)) {
    recs.push({
      priority: pd.rank === 4 ? "HIGH" : "MEDIUM",
      title: `Review decision protocol: ${pd.inject.title}`,
      detail: pd.consequence
        ? pd.consequence.split(". ").slice(0, 3).join(". ").trimEnd() + "."
        : `The option selected during "${pd.inject.title}" represented a lower-quality choice. Agree a pre-approved response protocol for this situation so the team has a clear default before time pressure applies.`,
      relatedRole: pd.decision.role,
    });
  }

  // 2. One structural rec per weak gap dimension
  const weakDims = [...gaps].sort((a, b) => a.score - b.score).slice(0, 3);
  for (const dim of weakDims) {
    const rec = DIM_RECS[dim.dimension];
    if (rec && !recs.some((r) => r.title === rec.title)) {
      recs.push({ ...rec });
    }
  }

  // 3. Scenario-type specific playbook rec
  const scenRec = SCENARIO_RECS[session.scenario.type];
  if (scenRec && !recs.some((r) => r.title === scenRec.title)) {
    recs.push({ ...scenRec });
  }

  return recs.slice(0, 7);
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function computeReport(session: Session): GeneratedReport {
  const all          = collectRankedDecisions(session);
  const overallScore = avgRankToScore(all) ?? 60;

  const gapAnalysis: GapDimension[] = [
    dimDecisionQuality(all),
    dimEscalation(session, all),
    dimLegal(all),
    dimComms(all),
    dimStakeholder(all),
    dimContinuity(all),
  ];

  return {
    generatedAt:    new Date().toISOString(),
    overallScore,
    executiveSummary: buildExecutiveSummary(session, overallScore, gapAnalysis),
    gapAnalysis,
    roleFeedback:   buildRoleFeedback(session, all),
    recommendations: buildRecommendations(session, all, gapAnalysis),
  };
}
