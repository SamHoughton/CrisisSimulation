/**
 * store/index.ts - Central Zustand store with localStorage persistence.
 *
 * Manages all application state: settings, scenarios, sessions, navigation.
 * Broadcasts inject/vote/timer events to the Present screen via BroadcastChannel.
 * Persists settings, scenarios, past sessions, and the active session to localStorage
 * under the key "crisis-tabletop".
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Scenario, Session, Settings, View,
  Participant, LiveInject, ResponseEntry, DecisionEntry,
  GeneratedReport, FacilitatorNote, PresentMessage,
  ArcRecap, ArcRecapEntry, CommandTier, Inject,
} from "@/types";
import { BUILT_IN_TEMPLATES } from "@/lib/templates";

// ─── Broadcast channel ────────────────────────────────────────────────────────

/**
 * Send a typed message to the Present screen via BroadcastChannel.
 * Opens a new channel, posts the message, and closes immediately.
 * The Present screen has a persistent listener on the same channel name.
 */
function broadcast(msg: PresentMessage) {
  const bc = new BroadcastChannel("crisis-present");
  bc.postMessage(msg);
  bc.close();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Returns true if an inject should be run in the current session.
 * An inject is in-scope when:
 *  - selectedTiers is empty/undefined (all tiers active), OR
 *  - the inject has no commandTier set, OR
 *  - the inject's commandTier is included in selectedTiers.
 */
export function isInScope(inj: Inject, selectedTiers?: CommandTier[]): boolean {
  if (!selectedTiers || selectedTiers.length === 0) return true;
  if (!inj.commandTier) return true;
  return selectedTiers.includes(inj.commandTier);
}

/** Tally decisions and return the winning option key (most votes wins). */
function getMajorityOption(decisions: DecisionEntry[]): string {
  if (decisions.length === 0) return "A";
  const counts: Record<string, number> = {};
  for (const d of decisions) counts[d.optionKey] = (counts[d.optionKey] ?? 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

// ─── Store ───────────────────────────────────────────────────────────────────

interface AppStore {
  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;

  scenarios: Scenario[];
  saveScenario: (s: Scenario) => void;
  deleteScenario: (id: string) => void;

  pastSessions: Session[];

  session: Session | null;
  startSession: (scenario: Scenario, participants: Participant[], selectedTiers?: CommandTier[]) => void;
  launchSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  releaseInject: (injectId: string) => void;
  addResponse: (injectId: string, response: ResponseEntry) => void;
  addDecision: (injectId: string, decision: DecisionEntry) => void;
  /** Replace an existing decision from the same role, or add if new. Used for remote revotes. */
  upsertDecision: (injectId: string, decision: DecisionEntry) => void;
  revealVotes: (injectId: string) => void;
  updateInjectNote: (injectId: string, note: string) => void;
  addNote: (text: string) => void;
  setReport: (report: GeneratedReport) => void;

  /**
   * Skip a lower-tier inject without releasing it to the Present screen.
   * Records the inject as skipped in the session log (excluded from recap and
   * decision analysis). If the inject is a decision point with branches, the
   * provided optionKey (or the rank-1 option) is recorded so that branch
   * routing continues correctly.
   */
  skipInject: (injectId: string, chosenOptionKey?: string) => void;

  importSessions: (sessions: Session[]) => void;

  view: View;
  setView: (v: View) => void;
  editingScenarioId: string | null;
  setEditingScenario: (id: string | null) => void;
  /** @deprecated Unused - kept for localStorage compat. */
  viewingSessionId: string | null;
  setViewingSession: (id: string | null) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── Settings ──────────────────────────────────────────────────────────
      settings: { claudeApiKey: "", orgName: "", facilitatorName: "", theme: "dark" },
      updateSettings: (s) =>
        set((st) => ({ settings: { ...st.settings, ...s } })),

      // ── Scenarios ─────────────────────────────────────────────────────────
      scenarios: [],
      saveScenario: (s) =>
        set((st) => {
          const idx = st.scenarios.findIndex((x) => x.id === s.id);
          if (idx >= 0) {
            const next = [...st.scenarios];
            next[idx] = s;
            return { scenarios: next };
          }
          return { scenarios: [s, ...st.scenarios] };
        }),
      deleteScenario: (id) =>
        set((st) => ({ scenarios: st.scenarios.filter((s) => s.id !== id) })),

      // ── Past sessions ─────────────────────────────────────────────────────
      pastSessions: [],

      // ── Active session ────────────────────────────────────────────────────
      session: null,

      startSession: (scenario, participants, selectedTiers) => {
        const session: Session = {
          id: makeId(),
          scenario,
          participants,
          startedAt: new Date().toISOString(),
          status: "setup",
          liveInjects: [],
          notes: [],
          // Only store selectedTiers if it's a partial selection (not all tiers active)
          selectedTiers: selectedTiers && selectedTiers.length < 2 ? selectedTiers : undefined,
        };
        set({ session, view: "runner" });
      },

      launchSession: () =>
        set((st) => ({
          session: st.session ? { ...st.session, status: "active" } : st.session,
        })),

      pauseSession: () =>
        set((st) => ({
          session: st.session ? { ...st.session, status: "paused" } : st.session,
        })),

      resumeSession: () =>
        set((st) => ({
          session: st.session ? { ...st.session, status: "active" } : st.session,
        })),

      endSession: () => {
        const { session, pastSessions } = get();
        if (!session) return;
        const ended: Session = {
          ...session,
          status: "ended",
          endedAt: new Date().toISOString(),
        };
        broadcast({ type: "status", status: "ended" });
        set({ session: ended, pastSessions: [ended, ...pastSessions], view: "report" });
      },

      /**
       * Release an inject: add it to liveInjects, broadcast to Present screen,
       * and auto-launch the session if this is the first inject (status "setup").
       * The broadcast fires BEFORE launchSession so the Present screen receives
       * the inject message first - the status broadcast follows via Runner's useEffect.
       */
      releaseInject: (injectId) => {
        const { session } = get();
        if (!session) return;
        const inj = session.scenario.injects.find((i) => i.id === injectId);
        if (!inj) return;

        // For ending injects build structured arc recap for Present screen.
        const arcRecap = inj.isEnding ? buildScenarioRecap(session) : null;

        // Also build a plain-text version for QR phones / Runner panel.
        let arcText = "";
        if (arcRecap && arcRecap.entries.length > 0) {
          const sentences = arcRecap.entries.map((e) => `${e.label} ${e.fragment}`);
          const scorePart = arcRecap.score !== null
            ? ` Compound decision score: ${arcRecap.score.toFixed(2)} (lower is better; 1.00 = perfect).`
            : "";
          arcText = `Your arc: ${sentences.join("; ")}.${scorePart}\n\n`;
        }

        // Present gets the clean body + structured arcRecap (no text prefix).
        const renderedInject = arcRecap ? { ...inj, arcRecap } : inj;

        // Collect tierSkipSummary from any filtered injects between the last
        // released inject and this one (in linear order). These are shown as a
        // "Story so far..." briefing strip on the Present screen so the room
        // retains narrative coherence even when tiers are filtered out.
        const sortedAll = [...session.scenario.injects].sort((a, b) => a.order - b.order);
        const lastLive = session.liveInjects[session.liveInjects.length - 1];
        const lastOrder = lastLive
          ? (session.scenario.injects.find((i) => i.id === lastLive.injectId)?.order ?? -1)
          : -1;
        const contextSummaries = session.selectedTiers
          ? sortedAll
              .filter(
                (i) =>
                  i.order > lastOrder &&
                  i.order < inj.order &&
                  !isInScope(i, session.selectedTiers) &&
                  i.tierSkipSummary
              )
              .map((i) => ({ title: i.title, summary: i.tierSkipSummary! }))
          : undefined;

        // LiveInject keeps the text-prefixed body so QR phones/Runner still work.
        const liveInject: LiveInject = {
          injectId,
          injectTitle: inj.title,
          injectBody: arcText + inj.body,
          releasedAt: new Date().toISOString(),
          responses: [],
          decisions: [],
        };
        const injectNum = session.liveInjects.length + 1;
        const totalInjects = session.scenario.injects.length;
        set((st) => ({
          session: st.session
            ? { ...st.session, liveInjects: [...st.session.liveInjects, liveInject] }
            : st.session,
        }));
        broadcast({
          type: "inject",
          inject: renderedInject,
          injectNum,
          totalInjects,
          ...(contextSummaries && contextSummaries.length > 0 ? { contextSummaries } : {}),
        });
        if (session.status === "setup") get().launchSession();
      },

      addResponse: (injectId, response) =>
        set((st) => ({
          session: st.session
            ? {
                ...st.session,
                liveInjects: st.session.liveInjects.map((li) =>
                  li.injectId === injectId
                    ? { ...li, responses: [...li.responses, response] }
                    : li
                ),
              }
            : st.session,
        })),

      addDecision: (injectId, decision) => {
        set((st) => ({
          session: st.session
            ? {
                ...st.session,
                liveInjects: st.session.liveInjects.map((li) =>
                  li.injectId === injectId
                    ? { ...li, decisions: [...li.decisions, decision] }
                    : li
                ),
              }
            : st.session,
        }));
        // Broadcast individual vote to present screen
        broadcast({
          type: "vote",
          role: decision.role,
          roleName: decision.name || decision.role,
          optionKey: decision.optionKey,
        });
      },

      upsertDecision: (injectId, decision) => {
        set((st) => ({
          session: st.session
            ? {
                ...st.session,
                liveInjects: st.session.liveInjects.map((li) =>
                  li.injectId === injectId
                    ? {
                        ...li,
                        // Replace existing vote from the same role, or append if first vote
                        decisions: [
                          ...li.decisions.filter((d) => d.role !== decision.role),
                          decision,
                        ],
                      }
                    : li
                ),
              }
            : st.session,
        }));
        // Broadcast updated vote to present screen
        broadcast({
          type: "vote",
          role: decision.role,
          roleName: decision.name || decision.role,
          optionKey: decision.optionKey,
        });
      },

      revealVotes: (injectId) => {
        const { session } = get();
        const live = session?.liveInjects.find((li) => li.injectId === injectId);
        broadcast({ type: "vote-reveal", decisions: live?.decisions ?? [] });
      },

      updateInjectNote: (injectId, note) =>
        set((st) => ({
          session: st.session
            ? {
                ...st.session,
                liveInjects: st.session.liveInjects.map((li) =>
                  li.injectId === injectId ? { ...li, facilitatorNote: note } : li
                ),
              }
            : st.session,
        })),

      skipInject: (injectId, chosenOptionKey) => {
        const { session } = get();
        if (!session) return;
        const inj = session.scenario.injects.find((i) => i.id === injectId);
        if (!inj) return;
        // Determine which branch to follow: use the supplied key, or fall back
        // to whichever option has rank 1 (best), or the first option if unranked.
        let effectiveKey = chosenOptionKey;
        if (!effectiveKey && inj.decisionOptions.length > 0) {
          const rank1 = inj.decisionOptions.find((o) => o.rank === 1);
          effectiveKey = rank1?.key ?? inj.decisionOptions[0].key;
        }
        const chosenOption = inj.decisionOptions.find((o) => o.key === effectiveKey);
        const liveInject: LiveInject = {
          injectId,
          injectTitle: inj.title,
          injectBody: inj.tierSkipSummary ?? inj.body,
          releasedAt: new Date().toISOString(),
          responses: [],
          // Record the effective decision so branching and recap work correctly
          decisions: chosenOption
            ? [
                {
                  role: "CUSTOM" as const,
                  name: "Facilitator (skipped)",
                  optionKey: chosenOption.key,
                  optionLabel: chosenOption.label,
                },
              ]
            : [],
          skipped: true,
        };
        set((st) => ({
          session: st.session
            ? { ...st.session, liveInjects: [...st.session.liveInjects, liveInject] }
            : st.session,
        }));
        if (session.status === "setup") get().launchSession();
      },

      addNote: (text) =>
        set((st) => ({
          session: st.session
            ? {
                ...st.session,
                notes: [...st.session.notes, { text, timestamp: new Date().toISOString() }],
              }
            : st.session,
        })),

      setReport: (report) =>
        set((st) => {
          if (!st.session) return {};
          const updated = { ...st.session, report };
          return {
            session: updated,
            pastSessions: st.pastSessions.map((s) => (s.id === updated.id ? updated : s)),
          };
        }),

      // ── Session archive import ───────────────────────────────────────────
      importSessions: (sessions) =>
        set((st) => {
          const existingIds = new Set(st.pastSessions.map((s) => s.id));
          const fresh = sessions.filter((s) => !existingIds.has(s.id));
          return { pastSessions: [...fresh, ...st.pastSessions] };
        }),

      // ── Navigation ────────────────────────────────────────────────────────
      view: "home",
      setView: (view) => set({ view }),
      editingScenarioId: null,
      setEditingScenario: (id) => set({ editingScenarioId: id }),
      viewingSessionId: null,
      setViewingSession: (id) => set({ viewingSessionId: id }),
    }),
    {
      name: "crisis-tabletop",
      version: 2,
      /**
       * Migrate persisted state across breaking schema changes.
       * v0/v1 → v2: renamed tiers GOLD→STRATEGIC, SILVER/BRONZE→TACTICAL;
       *             added settings.theme field.
       */
      migrate: (raw: unknown, fromVersion: number) => {
        const state = raw as Record<string, unknown>;
        if (fromVersion < 2) {
          const OLD: Record<string, string> = {
            GOLD: "STRATEGIC", SILVER: "TACTICAL", BRONZE: "TACTICAL",
          };
          const migrateTiers = (tiers?: unknown) =>
            Array.isArray(tiers)
              ? [...new Set((tiers as string[]).map((t) => OLD[t] ?? t))]
              : tiers;

          // Migrate active session selectedTiers
          const session = state.session as Record<string, unknown> | null;
          if (session) session.selectedTiers = migrateTiers(session.selectedTiers);

          // Migrate past sessions
          if (Array.isArray(state.pastSessions)) {
            state.pastSessions = (state.pastSessions as Array<Record<string, unknown>>).map(
              (s) => ({ ...s, selectedTiers: migrateTiers(s.selectedTiers) })
            );
          }

          // Ensure settings.theme exists
          const settings = state.settings as Record<string, unknown> | undefined;
          if (settings && !settings.theme) settings.theme = "dark";
        }
        return state;
      },
      partialize: (st) => ({
        settings: st.settings,
        scenarios: st.scenarios,
        pastSessions: st.pastSessions,
        session: st.session,
      }),
    }
  )
);

// ─── Derived helpers ──────────────────────────────────────────────────────────
// These are pure functions (not store actions) that derive state from the session.
// They're exported separately so components can call them without subscribing to
// the full store - just pass in the current session object.

/** Merge built-in templates with user-created scenarios. */
export function getAllScenarios(store: AppStore): Scenario[] {
  return [...BUILT_IN_TEMPLATES, ...store.scenarios];
}

/** Get the most recently released inject (the one currently "live"). */
export function getCurrentLiveInject(session: Session | null): LiveInject | null {
  if (!session || session.liveInjects.length === 0) return null;
  return session.liveInjects[session.liveInjects.length - 1];
}

/**
 * Compute the average rank of all ranked decisions taken across the session.
 * Used by score-routed finales. Unranked decisions are skipped. Returns null
 * if no ranked decisions exist yet.
 */
export function getSessionAverageRank(session: Session): number | null {
  let total = 0;
  let count = 0;
  for (const live of session.liveInjects) {
    // Skipped injects are excluded from scoring
    if (live.skipped) continue;
    if (live.decisions.length === 0) continue;
    const inj = session.scenario.injects.find((i) => i.id === live.injectId);
    if (!inj) continue;
    const winningKey = getMajorityOption(live.decisions);
    const chosen = inj.decisionOptions.find((o) => o.key === winningKey);
    if (chosen && typeof chosen.rank === "number") {
      total += chosen.rank;
      count += 1;
    }
  }
  return count === 0 ? null : total / count;
}

/**
 * Build a structured arc recap of the session's key choices for ending injects.
 * Each entry captures the decision label, the chosen fragment, its rank, and
 * the winning option key. The compound score is the average rank across all
 * ranked decisions (lower is better; 1.0 = perfect).
 */
export function buildScenarioRecap(session: Session): ArcRecap {
  const entries: ArcRecapEntry[] = [];
  for (const live of session.liveInjects) {
    // Skipped injects don't contribute to the recap narrative
    if (live.skipped) continue;
    if (live.decisions.length === 0) continue;
    const inj = session.scenario.injects.find((i) => i.id === live.injectId);
    if (!inj?.recapLine) continue;
    const winningKey = getMajorityOption(live.decisions);
    const chosen = inj.decisionOptions.find((o) => o.key === winningKey);
    if (!chosen?.recapFragment) continue;
    // Split label from fragment at the {{recapFragment}} placeholder.
    const label = inj.recapLine.split("{{recapFragment}}")[0].trimEnd();
    entries.push({ label, fragment: chosen.recapFragment, rank: chosen.rank, optionKey: winningKey });
  }
  return { entries, score: getSessionAverageRank(session) };
}

/**
 * Determine the next inject to release, respecting the decision tree.
 *
 * Logic:
 * 1. If the current inject has branchMode "score" and any decisions were taken,
 *    compute the session's average rank and pick the branch whose scoreMax is
 *    the smallest value that is still >= avgRank.
 * 2. Otherwise, if the current inject has branches AND votes have been cast,
 *    follow the majority vote's branch to the specified nextInjectId.
 * 3. If it's a decision point but no votes yet, return null (hold - don't auto-advance).
 * 4. Otherwise fall back to linear order (next unreleased inject with higher order).
 */
export function getNextInject(session: Session | null) {
  if (!session) return null;

  const released = new Set(session.liveInjects.map((li) => li.injectId));
  const sorted   = [...session.scenario.injects].sort((a, b) => a.order - b.order);

  if (session.liveInjects.length === 0) {
    return sorted.find((i) => !released.has(i.id) && isInScope(i, session.selectedTiers)) ?? null;
  }

  const currentLive = getCurrentLiveInject(session);
  if (!currentLive) return null;

  const currentInject = session.scenario.injects.find((i) => i.id === currentLive.injectId);
  if (!currentInject) return null;

  // Score-routed branch resolution: compound rank average selects the ending
  if (
    currentInject.branchMode === "score" &&
    currentInject.branches?.length &&
    currentLive.decisions.length > 0
  ) {
    const avgRank = getSessionAverageRank(session);
    if (avgRank !== null) {
      const ranked = [...currentInject.branches]
        .filter((b) => typeof b.scoreMax === "number")
        .sort((a, b) => (a.scoreMax ?? Infinity) - (b.scoreMax ?? Infinity));
      const winning = ranked.find((b) => avgRank <= (b.scoreMax ?? Infinity));
      if (winning) {
        const next = session.scenario.injects.find(
          (i) => i.id === winning.nextInjectId && !released.has(i.id) && isInScope(i, session.selectedTiers)
        );
        if (next) return next;
      }
    }
  }

  // Vote-routed branch resolution: majority of this inject's decisions wins
  if (currentInject.branches?.length && currentLive.decisions.length > 0) {
    const winning = getMajorityOption(currentLive.decisions);
    const branch  = currentInject.branches.find((b) => b.optionKey === winning);
    if (branch) {
      const next = session.scenario.injects.find(
        (i) => i.id === branch.nextInjectId && !released.has(i.id) && isInScope(i, session.selectedTiers)
      );
      if (next) return next;
    }
  }

  // If it's a decision point with no decision yet, hold - don't auto-advance
  if (currentInject.isDecisionPoint && currentLive.decisions.length === 0) {
    return null;
  }

  // Linear fallback: next in order after current, skipping out-of-scope injects
  return (
    sorted.find(
      (i) =>
        !released.has(i.id) &&
        i.order > currentInject.order &&
        isInScope(i, session.selectedTiers)
    ) ?? null
  );
}

/** Returns all injects reachable from the current position (for queue highlighting) */
export function getReachableInjectIds(session: Session | null): Set<string> {
  if (!session) return new Set();

  const released = new Set(session.liveInjects.map((li) => li.injectId));
  const sorted   = [...session.scenario.injects].sort((a, b) => a.order - b.order);
  const reachable = new Set<string>(released);

  // Walk forward from current position
  let cursor = getNextInject(session);
  const visited = new Set<string>();
  while (cursor && !visited.has(cursor.id)) {
    reachable.add(cursor.id);
    visited.add(cursor.id);
    // Add all branches as potentially reachable
    if (cursor.branches) {
      for (const b of cursor.branches) {
        const target = session.scenario.injects.find((i) => i.id === b.nextInjectId);
        if (target && !reachable.has(target.id)) reachable.add(target.id);
      }
    }
    // Linear next
    const nextLinear = sorted.find(
      (i) => !reachable.has(i.id) && i.order > cursor!.order
    );
    cursor = nextLinear ?? null;
  }

  return reachable;
}
