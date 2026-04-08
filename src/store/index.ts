import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Scenario, Session, Settings, View,
  Participant, LiveInject, ResponseEntry, DecisionEntry,
  GeneratedReport, FacilitatorNote, PresentMessage,
} from "@/types";
import { BUILT_IN_TEMPLATES } from "@/lib/templates";

// ─── Broadcast channel ────────────────────────────────────────────────────────
function broadcast(msg: PresentMessage) {
  const bc = new BroadcastChannel("crisis-present");
  bc.postMessage(msg);
  bc.close();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

/** Tally decisions and return the winning option key */
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
  startSession: (scenario: Scenario, participants: Participant[]) => void;
  launchSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  releaseInject: (injectId: string) => void;
  addResponse: (injectId: string, response: ResponseEntry) => void;
  addDecision: (injectId: string, decision: DecisionEntry) => void;
  revealVotes: (injectId: string) => void;
  updateInjectNote: (injectId: string, note: string) => void;
  addNote: (text: string) => void;
  setReport: (report: GeneratedReport) => void;

  view: View;
  setView: (v: View) => void;
  editingScenarioId: string | null;
  setEditingScenario: (id: string | null) => void;
  viewingSessionId: string | null;
  setViewingSession: (id: string | null) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── Settings ──────────────────────────────────────────────────────────
      settings: { claudeApiKey: "", orgName: "", facilitatorName: "" },
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

      startSession: (scenario, participants) => {
        const session: Session = {
          id: makeId(),
          scenario,
          participants,
          startedAt: new Date().toISOString(),
          status: "setup",
          liveInjects: [],
          notes: [],
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

      releaseInject: (injectId) => {
        const { session } = get();
        if (!session) return;
        const inj = session.scenario.injects.find((i) => i.id === injectId);
        if (!inj) return;
        const liveInject: LiveInject = {
          injectId,
          injectTitle: inj.title,
          injectBody: inj.body,
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
        broadcast({ type: "inject", inject: inj, injectNum, totalInjects });
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

export function getAllScenarios(store: AppStore): Scenario[] {
  return [...BUILT_IN_TEMPLATES, ...store.scenarios];
}

export function getCurrentLiveInject(session: Session | null): LiveInject | null {
  if (!session || session.liveInjects.length === 0) return null;
  return session.liveInjects[session.liveInjects.length - 1];
}

/**
 * Returns the next inject to release.
 * Respects branching: if the current inject has branches and a decision has been made,
 * follows the winning option's branch. Falls back to linear order.
 */
export function getNextInject(session: Session | null) {
  if (!session) return null;

  const released = new Set(session.liveInjects.map((li) => li.injectId));
  const sorted   = [...session.scenario.injects].sort((a, b) => a.order - b.order);

  if (session.liveInjects.length === 0) {
    return sorted.find((i) => !released.has(i.id)) ?? null;
  }

  const currentLive = getCurrentLiveInject(session);
  if (!currentLive) return null;

  const currentInject = session.scenario.injects.find((i) => i.id === currentLive.injectId);
  if (!currentInject) return null;

  // Branch resolution: if current inject has defined branches and a decision was made
  if (currentInject.branches?.length && currentLive.decisions.length > 0) {
    const winning = getMajorityOption(currentLive.decisions);
    const branch  = currentInject.branches.find((b) => b.optionKey === winning);
    if (branch) {
      const next = session.scenario.injects.find(
        (i) => i.id === branch.nextInjectId && !released.has(i.id)
      );
      if (next) return next;
    }
  }

  // If it's a decision point with no decision yet, hold — don't auto-advance
  if (currentInject.isDecisionPoint && currentLive.decisions.length === 0) {
    return null;
  }

  // Linear fallback: next in order after current
  return sorted.find((i) => !released.has(i.id) && i.order > currentInject.order) ?? null;
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
