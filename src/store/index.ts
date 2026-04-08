import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Scenario, Session, Settings, View,
  Participant, LiveInject, ResponseEntry, DecisionEntry,
  GeneratedReport, FacilitatorNote,
} from "@/types";
import { BUILT_IN_TEMPLATES } from "@/lib/templates";

// ─── Broadcast channel — syncs current inject to the present window ───────────
let bc: BroadcastChannel | null = null;
function getChannel() {
  if (!bc) bc = new BroadcastChannel("crisis-present");
  return bc;
}

// ─── Store ───────────────────────────────────────────────────────────────────

interface AppStore {
  // Settings (persisted)
  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;

  // Scenarios (persisted)
  scenarios: Scenario[];
  saveScenario: (s: Scenario) => void;
  deleteScenario: (id: string) => void;

  // Past sessions (persisted, for report access)
  pastSessions: Session[];

  // Active session (persisted so a browser refresh doesn't kill it)
  session: Session | null;
  startSession: (scenario: Scenario, participants: Participant[]) => void;
  launchSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  releaseInject: (injectId: string) => void;
  addResponse: (injectId: string, response: ResponseEntry) => void;
  addDecision: (injectId: string, decision: DecisionEntry) => void;
  updateInjectNote: (injectId: string, note: string) => void;
  addNote: (text: string) => void;
  setReport: (report: GeneratedReport) => void;

  // Navigation (NOT persisted)
  view: View;
  setView: (v: View) => void;
  editingScenarioId: string | null;
  setEditingScenario: (id: string | null) => void;
  viewingSessionId: string | null;
  setViewingSession: (id: string | null) => void;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
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
          session: st.session
            ? { ...st.session, status: "active" }
            : st.session,
        })),

      pauseSession: () =>
        set((st) => ({
          session: st.session
            ? { ...st.session, status: "paused" }
            : st.session,
        })),

      resumeSession: () =>
        set((st) => ({
          session: st.session
            ? { ...st.session, status: "active" }
            : st.session,
        })),

      endSession: () => {
        const { session, pastSessions } = get();
        if (!session) return;
        const ended: Session = {
          ...session,
          status: "ended",
          endedAt: new Date().toISOString(),
        };
        set({
          session: ended,
          pastSessions: [ended, ...pastSessions],
          view: "report",
        });
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
        set((st) => ({
          session: st.session
            ? { ...st.session, liveInjects: [...st.session.liveInjects, liveInject] }
            : st.session,
        }));
        // Broadcast to present window
        getChannel().postMessage({ type: "inject", inject: inj });
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

      addDecision: (injectId, decision) =>
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
        })),

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
                notes: [
                  ...st.session.notes,
                  { text, timestamp: new Date().toISOString() },
                ],
              }
            : st.session,
        })),

      setReport: (report) => {
        set((st) => {
          if (!st.session) return {};
          const updated = { ...st.session, report };
          return {
            session: updated,
            pastSessions: st.pastSessions.map((s) =>
              s.id === updated.id ? updated : s
            ),
          };
        });
      },

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
      // Don't persist navigation state
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

export function getNextInject(session: Session | null) {
  if (!session) return null;
  const released = new Set(session.liveInjects.map((li) => li.injectId));
  return session.scenario.injects
    .sort((a, b) => a.order - b.order)
    .find((i) => !released.has(i.id)) ?? null;
}
