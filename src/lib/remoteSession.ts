/**
 * remoteSession.ts - Client-side wrapper around the QR voting Netlify Function.
 *
 * Used by both the facilitator's Runner screen (to publish inject state and
 * poll for incoming votes) and the participant's mobile screens (to join,
 * poll for the current inject, and submit votes).
 *
 * Source of truth is still the facilitator's local Zustand session - the
 * remote blob is a publish target. Polling cadence is 1.5s, which is fine
 * for tabletop exercises and trivial bandwidth.
 */

import type {
  RemoteSessionState,
  RemoteParticipant,
  RemoteInject,
  ExecRole,
  Inject,
} from "@/types";

const ENDPOINT = "/.netlify/functions/session";

async function call<T = unknown>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* swallow */
    }
    throw new Error(message);
  }
  return res.json();
}

/** Mint a new remote session. Called by Runner when facilitator enables participant devices. */
export async function createRemoteSession(opts: {
  scenarioTitle: string;
  availableRoles: ExecRole[];
}): Promise<RemoteSessionState> {
  return call<RemoteSessionState>(`${ENDPOINT}?action=create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });
}

/** Fetch current state. Used as a polling target by both facilitator and participants. */
export async function getRemoteSession(code: string): Promise<RemoteSessionState> {
  return call<RemoteSessionState>(`${ENDPOINT}?code=${encodeURIComponent(code)}`);
}

/** Participant joins a session. Returns their server-assigned id and the latest state. */
export async function joinRemoteSession(
  code: string,
  opts: { name: string; role: ExecRole; customTitle?: string }
): Promise<{ participant: RemoteParticipant; session: RemoteSessionState }> {
  return call(`${ENDPOINT}?action=join&code=${encodeURIComponent(code)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });
}

/** Participant submits a vote on the current decision-point inject. */
export async function submitRemoteVote(
  code: string,
  opts: { participantId: string; injectId: string; optionKey: string }
): Promise<{ ok: true; votes: RemoteSessionState["votes"] }> {
  return call(`${ENDPOINT}?action=vote&code=${encodeURIComponent(code)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });
}

/** Facilitator pushes inject state changes to the remote blob. */
export async function updateRemoteSession(
  code: string,
  opts: {
    currentInject?: RemoteInject | null;
    status?: "waiting" | "active" | "ended";
  }
): Promise<RemoteSessionState> {
  return call(`${ENDPOINT}?action=update&code=${encodeURIComponent(code)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });
}

/** Facilitator marks the session ended. */
export async function endRemoteSession(code: string): Promise<{ ok: true }> {
  return call(`${ENDPOINT}?action=end&code=${encodeURIComponent(code)}`, {
    method: "POST",
  });
}

/** Convert a local Inject (with full domain shape) into the trimmed RemoteInject the function accepts. */
export function toRemoteInject(inject: Inject, revealed = false): RemoteInject {
  return {
    injectId: inject.id,
    title: inject.title,
    body: inject.body,
    isDecisionPoint: inject.isDecisionPoint,
    options: inject.decisionOptions ?? [],
    releasedAt: new Date().toISOString(),
    revealed,
  };
}

/** Build the join URL participants scan. */
export function buildJoinUrl(code: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/#join/${code}`;
}
