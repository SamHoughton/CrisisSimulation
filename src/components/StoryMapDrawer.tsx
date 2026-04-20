/**
 * StoryMapDrawer.tsx
 *
 * A fixed right-side drawer that shows the full scenario branch structure
 * during a live session. Injects are laid out in swimlane columns — one per
 * unique story track — so the facilitator can see at a glance which narrative
 * path the room is on, what they've passed through, and what alternatives
 * were available.
 *
 * Layout:
 *   - "Main" column (no storyTrack): the central spine.
 *   - One column per named storyTrack, ordered by first appearance.
 *   - Within each column, injects are stacked in ascending order.
 *   - Status colours: green=done, red=current, amber=next, white=on-path, dim=off-path.
 *   - Branch fork icons appear on decision injects with branches pointing to other lanes.
 *   - The score-routing inject shows the predicted ending based on current avg rank.
 */

import { X, GitBranch, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSessionAverageRank } from "@/store";
import type { Inject, Session } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeStatus = "done" | "current" | "next" | "on-path" | "off-path";

interface LaneNode {
  inject: Inject;
  status: NodeStatus;
  /** Option key chosen when this inject was voted on (if released + decision point). */
  chosenKey?: string;
  /** Rank of the chosen option (1 = best). */
  chosenRank?: number;
}

interface Lane {
  track: string;       // storyTrack value, or "Main" for the trunk
  nodes: LaneNode[];
  isActive: boolean;   // true if any node in this lane is done/current/next
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMajority(decisions: { optionKey: string }[]): string | null {
  if (!decisions.length) return null;
  const counts: Record<string, number> = {};
  for (const d of decisions) counts[d.optionKey] = (counts[d.optionKey] ?? 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function buildLanes(
  session: Session,
  released: Set<string>,
  reachable: Set<string>,
  currentId: string | undefined,
  nextId: string | undefined,
  scoreRoutedTargets: Set<string>,
): Lane[] {
  const injects = [...session.scenario.injects].sort((a, b) => a.order - b.order);

  // Determine status of each inject.
  function statusOf(inj: Inject): NodeStatus {
    if (released.has(inj.id)) {
      if (inj.id === currentId) return "current";
      return "done";
    }
    if (inj.id === nextId) return "next";
    if (reachable.has(inj.id)) return "on-path";
    return "off-path";
  }

  // Look up decision outcome for a released inject.
  function choiceFor(inj: Inject): { key: string; rank?: number } | null {
    const live = session.liveInjects.find((l) => l.injectId === inj.id);
    if (!live || live.decisions.length === 0) return null;
    const key = getMajority(live.decisions);
    if (!key) return null;
    const opt = inj.decisionOptions.find((o) => o.key === key);
    return { key, rank: opt?.rank };
  }

  // Collect unique track names in order of first appearance.
  const trackOrder: string[] = ["Main"];
  for (const inj of injects) {
    const t = inj.storyTrack ?? "Main";
    if (!trackOrder.includes(t)) trackOrder.push(t);
  }

  // Build a map of track → nodes.
  const laneMap = new Map<string, LaneNode[]>();
  for (const t of trackOrder) laneMap.set(t, []);

  for (const inj of injects) {
    // Score-routed endings are shown in a special section, not as regular lane nodes.
    if (scoreRoutedTargets.has(inj.id)) continue;

    const track = inj.storyTrack ?? "Main";
    const status = statusOf(inj);
    const choice = inj.isDecisionPoint && released.has(inj.id) ? choiceFor(inj) : null;

    laneMap.get(track)!.push({
      inject: inj,
      status,
      chosenKey: choice?.key,
      chosenRank: choice?.rank,
    });
  }

  // Assemble final lanes, marking active ones.
  return trackOrder
    .filter((t) => (laneMap.get(t)?.length ?? 0) > 0)
    .map((t) => {
      const nodes = laneMap.get(t)!;
      const isActive = nodes.some((n) => n.status === "done" || n.status === "current" || n.status === "next");
      return { track: t, nodes, isActive };
    });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const STATUS_DOT: Record<NodeStatus, string> = {
  done:     "text-rtr-green",
  current:  "text-rtr-red",
  next:     "text-amber-400",
  "on-path":  "text-rtr-dim",
  "off-path": "text-rtr-dim/40",
};

const STATUS_BORDER: Record<NodeStatus, string> = {
  done:     "border-rtr-green/30 bg-rtr-green/5",
  current:  "border-rtr-red/50 bg-rtr-red/8",
  next:     "border-amber-500/40 bg-amber-500/5",
  "on-path":  "border-rtr-border bg-rtr-elevated",
  "off-path": "border-rtr-border/30 bg-rtr-base opacity-40",
};

const RANK_COLOUR: Record<number, string> = {
  1: "text-rtr-green",
  2: "text-amber-400",
  3: "text-orange-400",
  4: "text-red-400",
};

function NodeCard({ node, hasBranches, scoreRoutingTarget }: {
  node: LaneNode;
  hasBranches: boolean;
  scoreRoutingTarget?: string; // title of the predicted ending
}) {
  const { inject: inj, status, chosenKey, chosenRank } = node;

  return (
    <div className={cn(
      "rounded border px-2.5 py-2 text-[10px] leading-tight",
      STATUS_BORDER[status]
    )}>
      <div className="flex items-start gap-1.5">
        {status === "done"
          ? <CheckCircle2 className={cn("w-3 h-3 shrink-0 mt-0.5", STATUS_DOT[status])} />
          : <Circle className={cn("w-3 h-3 shrink-0 mt-0.5", STATUS_DOT[status])} />
        }
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-medium truncate",
            status === "current" ? "text-rtr-red"
            : status === "done" ? "text-rtr-green"
            : status === "next" ? "text-amber-300"
            : status === "on-path" ? "text-rtr-text"
            : "text-rtr-dim"
          )}>
            {inj.title}
          </p>

          {/* Decision outcome */}
          {chosenKey && (
            <p className={cn("text-[9px] mt-0.5 font-mono", chosenRank !== undefined ? RANK_COLOUR[chosenRank] ?? "text-rtr-muted" : "text-rtr-muted")}>
              Chose {chosenKey}{chosenRank !== undefined ? ` · rank ${chosenRank}` : ""}
            </p>
          )}

          {/* Branch indicator */}
          {hasBranches && !inj.branchMode && (
            <p className="text-[9px] mt-0.5 text-amber-400/70 flex items-center gap-0.5">
              <GitBranch className="w-2.5 h-2.5" />Fork
            </p>
          )}

          {/* Score-routing prediction */}
          {inj.branchMode === "score" && scoreRoutingTarget && (
            <p className="text-[9px] mt-0.5 text-amber-400 flex items-center gap-0.5">
              <ChevronRight className="w-2.5 h-2.5" />Auto → {scoreRoutingTarget}
            </p>
          )}
          {inj.branchMode === "score" && !scoreRoutingTarget && (
            <p className="text-[9px] mt-0.5 text-rtr-dim flex items-center gap-0.5">
              <ChevronRight className="w-2.5 h-2.5" />Auto (score pending)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main drawer ─────────────────────────────────────────────────────────────

export function StoryMapDrawer({
  session,
  released,
  reachable,
  currentId,
  nextId,
  scoreRoutedTargets,
  onClose,
}: {
  session: Session;
  released: Set<string>;
  reachable: Set<string>;
  currentId: string | undefined;
  nextId: string | undefined;
  scoreRoutedTargets: Set<string>;
  onClose: () => void;
}) {
  const lanes = buildLanes(session, released, reachable, currentId, nextId, scoreRoutedTargets);

  // Score-routing: find the routing inject and its predicted ending.
  const routingInject = session.scenario.injects.find((i) => i.branchMode === "score");
  const avgRank = getSessionAverageRank(session);
  let predictedEnding: Inject | null = null;
  if (routingInject?.branches && avgRank !== null) {
    const ranked = [...routingInject.branches]
      .filter((b) => typeof b.scoreMax === "number")
      .sort((a, b) => (a.scoreMax ?? Infinity) - (b.scoreMax ?? Infinity));
    const winner = ranked.find((b) => avgRank <= (b.scoreMax ?? Infinity));
    if (winner) {
      predictedEnding = session.scenario.injects.find((i) => i.id === winner.nextInjectId) ?? null;
    }
  }

  // Score-routed endings for display in their own section.
  const endings = session.scenario.injects
    .filter((i) => scoreRoutedTargets.has(i.id))
    .sort((a, b) => (a.id < b.id ? -1 : 1));

  const activeTrack = lanes.find((l) => l.nodes.some((n) => n.status === "current"))?.track
    ?? lanes.find((l) => l.nodes.some((n) => n.status === "next"))?.track
    ?? "Main";

  return (
    <div className="fixed inset-y-0 right-0 w-[520px] max-w-[90vw] bg-rtr-base border-l border-rtr-border flex flex-col z-40 shadow-2xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-rtr-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold text-rtr-text">Story Map</span>
          {activeTrack !== "Main" && (
            <span className="text-[10px] font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded px-1.5 py-0.5">
              {activeTrack}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-rtr-dim hover:text-rtr-text transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Score strip */}
      {avgRank !== null && (
        <div className="px-4 py-2 border-b border-rtr-border bg-rtr-panel shrink-0 flex items-center gap-3">
          <span className="text-[10px] text-rtr-dim uppercase tracking-wider font-semibold">Avg rank</span>
          <span className={cn("text-sm font-bold font-mono",
            avgRank <= 1.6 ? "text-rtr-green"
            : avgRank <= 2.3 ? "text-amber-400"
            : avgRank <= 3.0 ? "text-orange-400"
            : "text-red-400"
          )}>
            {avgRank.toFixed(2)}
          </span>
          {predictedEnding && (
            <>
              <span className="text-rtr-border">·</span>
              <span className="text-[10px] text-rtr-dim">On track for</span>
              <span className="text-[10px] text-amber-400 font-medium truncate">{predictedEnding.title}</span>
            </>
          )}
        </div>
      )}

      {/* Swimlanes */}
      <div className="flex-1 overflow-auto p-3">
        {lanes.length <= 1 ? (
          /* Single column — no branching yet or linear scenario */
          <div className="space-y-1.5">
            {lanes[0]?.nodes.map((node) => (
              <NodeCard
                key={node.inject.id}
                node={node}
                hasBranches={!!(node.inject.branches?.length)}
                scoreRoutingTarget={
                  node.inject.branchMode === "score" && predictedEnding
                    ? predictedEnding.title
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          /* Multi-column swimlane layout */
          <div className={cn(
            "grid gap-2",
            lanes.length === 2 ? "grid-cols-2"
            : lanes.length === 3 ? "grid-cols-3"
            : "grid-cols-2 xl:grid-cols-3"
          )}>
            {lanes.map((lane) => (
              <div key={lane.track}>
                {/* Lane header */}
                <div className={cn(
                  "text-[9px] font-mono font-semibold uppercase tracking-wider px-1 pb-1.5 mb-1.5 border-b",
                  lane.isActive
                    ? lane.track === activeTrack
                      ? "text-amber-400 border-amber-500/30"
                      : "text-rtr-green border-rtr-green/20"
                    : "text-rtr-dim/50 border-rtr-border/30"
                )}>
                  {lane.track === "Main" ? "Main path" : lane.track}
                </div>
                {/* Lane nodes */}
                <div className="space-y-1">
                  {lane.nodes.map((node) => (
                    <NodeCard
                      key={node.inject.id}
                      node={node}
                      hasBranches={!!(node.inject.branches?.length)}
                      scoreRoutingTarget={
                        node.inject.branchMode === "score" && predictedEnding
                          ? predictedEnding.title
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Score-routed endings */}
        {endings.length > 0 && (
          <div className="mt-4 pt-3 border-t border-rtr-border/40">
            <p className="text-[9px] font-mono font-semibold text-rtr-dim uppercase tracking-wider mb-2 px-1">
              Possible endings (auto-selected by score)
            </p>
            <div className="grid grid-cols-2 gap-1">
              {endings.map((inj) => {
                const isPredicted = predictedEnding?.id === inj.id;
                const isReleased = released.has(inj.id);
                return (
                  <div key={inj.id} className={cn(
                    "rounded border px-2 py-1.5 text-[10px]",
                    isReleased ? "border-rtr-green/30 bg-rtr-green/5"
                    : isPredicted ? "border-amber-500/40 bg-amber-500/5"
                    : "border-rtr-border/30 bg-rtr-base opacity-40"
                  )}>
                    <div className="flex items-center gap-1 mb-0.5">
                      {isReleased
                        ? <CheckCircle2 className="w-2.5 h-2.5 text-rtr-green shrink-0" />
                        : isPredicted
                        ? <ChevronRight className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                        : <Circle className="w-2.5 h-2.5 text-rtr-dim/40 shrink-0" />
                      }
                      <span className={cn(
                        "font-medium truncate",
                        isReleased ? "text-rtr-green"
                        : isPredicted ? "text-amber-300"
                        : "text-rtr-dim"
                      )}>
                        {inj.title}
                      </span>
                    </div>
                    {routingInject?.branches && (
                      <p className="text-[9px] text-rtr-dim/60 pl-3.5">
                        ≤ {routingInject.branches.find((b) => b.nextInjectId === inj.id)?.scoreMax} avg rank
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer legend */}
      <div className="px-4 py-2.5 border-t border-rtr-border shrink-0 flex items-center gap-4 flex-wrap">
        <LegendItem colour="text-rtr-green" label="Done" />
        <LegendItem colour="text-rtr-red" label="Current" />
        <LegendItem colour="text-amber-400" label="Next" />
        <LegendItem colour="text-rtr-dim" label="Queued" />
        <LegendItem colour="text-rtr-dim/30" label="Off-path" />
      </div>
    </div>
  );
}

function LegendItem({ colour, label }: { colour: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <Circle className={cn("w-2.5 h-2.5", colour)} />
      <span className="text-[10px] text-rtr-dim">{label}</span>
    </div>
  );
}
