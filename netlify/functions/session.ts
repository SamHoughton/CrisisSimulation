/**
 * netlify/functions/session.ts - QR-voting session relay.
 *
 * Stores live session state in Netlify Blobs so the facilitator's Runner
 * screen and remote participant phones can see each other's state without
 * a real database or WebSocket server.
 *
 * Source of truth is still the facilitator's local Zustand session - this
 * blob is a publish target. The facilitator pushes the current inject and
 * reveal state via "update". Participants pull state via "get" and submit
 * votes via "vote". The facilitator polls "get" for incoming votes.
 *
 * Endpoints (all on /.netlify/functions/session):
 *   POST ?action=create              - Mint a new session, returns code + state
 *   GET  ?code=ABC123                - Fetch current session state (poll target)
 *   POST ?action=join&code=ABC123    - Participant joins, returns participantId
 *   POST ?action=vote&code=ABC123    - Participant submits a vote
 *   POST ?action=update&code=ABC123  - Facilitator pushes new inject / reveal state
 *   POST ?action=end&code=ABC123     - Facilitator marks session ended
 *
 * Protections:
 * - Body size cap (50KB)
 * - Per-IP rate limits per action (in-memory, best-effort across cold starts)
 * - 24-hour blob TTL
 */

import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

import type {
  RemoteSessionState,
  RemoteParticipant,
  RemoteInject,
  ExecRole,
} from "../../src/types";

const MAX_BODY_BYTES = 50_000;
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // exclude 0/O/1/I/L
const CODE_LENGTH = 6;
const MAX_PARTICIPANTS_PER_SESSION = 30;

// Per-action, per-IP in-memory rate limits. Best-effort across cold starts.
const RATE_LIMITS: Record<string, { windowMs: number; max: number }> = {
  create: { windowMs: 60 * 60 * 1000, max: 5 }, // 5 sessions/hour/IP
  join: { windowMs: 5 * 60 * 1000, max: 20 },   // 20 joins/5min/IP
  vote: { windowMs: 60 * 1000, max: 10 },        // 10 votes/min/IP
  update: { windowMs: 60 * 1000, max: 60 },      // 60 facilitator pushes/min/IP
  get: { windowMs: 60 * 1000, max: 200 },        // 200 polls/min/IP (1.5s polling = ~40/min)
  end: { windowMs: 60 * 1000, max: 5 },
};

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRate(action: string, ip: string): boolean {
  const cfg = RATE_LIMITS[action];
  if (!cfg) return true;
  const key = `${action}:${ip}`;
  const now = Date.now();
  const entry = rateBuckets.get(key);
  if (!entry || entry.resetAt < now) {
    rateBuckets.set(key, { count: 1, resetAt: now + cfg.windowMs });
    return true;
  }
  if (entry.count >= cfg.max) return false;
  entry.count++;
  return true;
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      // CORS - same-origin in prod, helpful for local dev too
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function jsonError(status: number, message: string): Response {
  return jsonResponse(status, { error: message });
}

function generateCode(): string {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}

function generateId(): string {
  // Simple UUID-ish identifier - good enough for participant tagging
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10)
  );
}

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-nf-client-connection-ip") ||
    "unknown"
  );
}

function sessionStore() {
  return getStore({ name: "vigil-sessions", consistency: "strong" });
}

async function loadSession(code: string): Promise<RemoteSessionState | null> {
  const store = sessionStore();
  const data = await store.get(code, { type: "json" });
  if (!data) return null;
  const session = data as RemoteSessionState;
  // Hard expiry guard - if blob outlived its expiresAt, treat as gone
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await store.delete(code).catch(() => undefined);
    return null;
  }
  return session;
}

async function saveSession(session: RemoteSessionState): Promise<void> {
  const store = sessionStore();
  await store.setJSON(session.code, session);
}

async function readJsonBody(req: Request): Promise<Record<string, unknown>> {
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) {
    throw new Error("Request body too large");
  }
  if (!text) return {};
  return JSON.parse(text);
}

// ─── Action handlers ────────────────────────────────────────────────────────

async function handleCreate(req: Request): Promise<Response> {
  const body = await readJsonBody(req).catch(() => null);
  if (!body) return jsonError(400, "Invalid JSON body");

  const scenarioTitle = typeof body.scenarioTitle === "string" ? body.scenarioTitle : "Untitled scenario";
  const availableRoles = Array.isArray(body.availableRoles)
    ? (body.availableRoles as ExecRole[]).slice(0, 12)
    : [];

  // Try a few codes to avoid collision
  const store = sessionStore();
  let code = "";
  for (let i = 0; i < 5; i++) {
    const candidate = generateCode();
    const existing = await store.get(candidate);
    if (!existing) {
      code = candidate;
      break;
    }
  }
  if (!code) return jsonError(500, "Could not allocate session code, try again");

  const now = Date.now();
  const session: RemoteSessionState = {
    code,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
    scenarioTitle,
    availableRoles,
    participants: [],
    currentInject: null,
    votes: [],
    status: "waiting",
  };
  await saveSession(session);
  return jsonResponse(200, session);
}

async function handleGet(code: string): Promise<Response> {
  const session = await loadSession(code);
  if (!session) return jsonError(404, "Session not found or expired");
  return jsonResponse(200, session);
}

async function handleJoin(req: Request, code: string): Promise<Response> {
  const body = await readJsonBody(req).catch(() => null);
  if (!body) return jsonError(400, "Invalid JSON body");

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 60) : "";
  const role = typeof body.role === "string" ? body.role : "";
  const customTitle = typeof body.customTitle === "string" ? body.customTitle.trim().slice(0, 60) : undefined;

  if (!name) return jsonError(400, "Name is required");
  if (!role) return jsonError(400, "Role is required");

  const session = await loadSession(code);
  if (!session) return jsonError(404, "Session not found or expired");
  if (session.status === "ended") return jsonError(403, "Session has ended");

  if (session.participants.length >= MAX_PARTICIPANTS_PER_SESSION) {
    return jsonError(403, "Session is full");
  }

  // Reject obviously invalid roles
  if (session.availableRoles.length && !session.availableRoles.includes(role as ExecRole)) {
    return jsonError(400, "Role not available in this session");
  }

  const participant: RemoteParticipant = {
    id: generateId(),
    name,
    role: role as ExecRole,
    customTitle,
    joinedAt: new Date().toISOString(),
  };
  session.participants.push(participant);
  await saveSession(session);
  return jsonResponse(200, { participant, session });
}

async function handleVote(req: Request, code: string): Promise<Response> {
  const body = await readJsonBody(req).catch(() => null);
  if (!body) return jsonError(400, "Invalid JSON body");

  const participantId = typeof body.participantId === "string" ? body.participantId : "";
  const optionKey = typeof body.optionKey === "string" ? body.optionKey : "";
  const injectId = typeof body.injectId === "string" ? body.injectId : "";

  if (!participantId || !optionKey || !injectId) {
    return jsonError(400, "participantId, optionKey, and injectId are required");
  }

  const session = await loadSession(code);
  if (!session) return jsonError(404, "Session not found or expired");

  const participant = session.participants.find((p) => p.id === participantId);
  if (!participant) return jsonError(403, "Participant not found");

  if (!session.currentInject) return jsonError(409, "No active inject");
  if (session.currentInject.injectId !== injectId) {
    return jsonError(409, "Vote is for an inject that is no longer active");
  }
  if (session.currentInject.revealed) {
    return jsonError(409, "Voting is closed for this inject");
  }
  if (!session.currentInject.isDecisionPoint) {
    return jsonError(409, "Current inject is not a decision point");
  }
  if (!session.currentInject.options.find((o) => o.key === optionKey)) {
    return jsonError(400, "Invalid option key");
  }

  // Replace any existing vote from this participant
  session.votes = session.votes.filter((v) => v.participantId !== participantId);
  session.votes.push({
    participantId,
    optionKey,
    castAt: new Date().toISOString(),
  });
  await saveSession(session);
  return jsonResponse(200, { ok: true, votes: session.votes });
}

async function handleUpdate(req: Request, code: string): Promise<Response> {
  const body = await readJsonBody(req).catch(() => null);
  if (!body) return jsonError(400, "Invalid JSON body");

  const session = await loadSession(code);
  if (!session) return jsonError(404, "Session not found or expired");

  // Optional: a new current inject. If supplied, this resets the votes array.
  if ("currentInject" in body) {
    const incoming = body.currentInject as RemoteInject | null;
    if (incoming === null) {
      session.currentInject = null;
      session.votes = [];
    } else if (typeof incoming === "object" && incoming.injectId) {
      // Sanitise: only keep known fields
      const safe: RemoteInject = {
        injectId: String(incoming.injectId),
        title: String(incoming.title ?? ""),
        body: String(incoming.body ?? ""),
        isDecisionPoint: Boolean(incoming.isDecisionPoint),
        options: Array.isArray(incoming.options)
          ? incoming.options
              .filter((o: any) => o && typeof o.key === "string")
              .slice(0, 8)
              .map((o: any) => ({
                key: String(o.key),
                label: String(o.label ?? o.key),
                consequence: o.consequence ? String(o.consequence) : undefined,
              }))
          : [],
        releasedAt: String(incoming.releasedAt ?? new Date().toISOString()),
        revealed: Boolean(incoming.revealed),
        winningOptionKey: incoming.winningOptionKey
          ? String(incoming.winningOptionKey)
          : undefined,
      };
      // If this is a different inject than before, reset votes
      if (
        !session.currentInject ||
        session.currentInject.injectId !== safe.injectId
      ) {
        session.votes = [];
      }
      session.currentInject = safe;
    }
  }

  if (typeof body.status === "string") {
    if (body.status === "waiting" || body.status === "active" || body.status === "ended") {
      session.status = body.status;
    }
  }

  await saveSession(session);
  return jsonResponse(200, session);
}

async function handleEnd(code: string): Promise<Response> {
  const session = await loadSession(code);
  if (!session) return jsonError(404, "Session not found or expired");
  session.status = "ended";
  await saveSession(session);
  return jsonResponse(200, { ok: true });
}

// ─── Entry point ────────────────────────────────────────────────────────────

export default async (req: Request, _context: Context): Promise<Response> => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action") ?? (req.method === "GET" ? "get" : "");
  const code = url.searchParams.get("code")?.toUpperCase() ?? "";

  const ip = getClientIp(req);
  if (!checkRate(action, ip)) {
    return jsonError(429, "Rate limit exceeded");
  }

  try {
    switch (action) {
      case "create":
        if (req.method !== "POST") return jsonError(405, "Method not allowed");
        return await handleCreate(req);
      case "get":
        if (req.method !== "GET") return jsonError(405, "Method not allowed");
        if (!code) return jsonError(400, "code query param required");
        return await handleGet(code);
      case "join":
        if (req.method !== "POST") return jsonError(405, "Method not allowed");
        if (!code) return jsonError(400, "code query param required");
        return await handleJoin(req, code);
      case "vote":
        if (req.method !== "POST") return jsonError(405, "Method not allowed");
        if (!code) return jsonError(400, "code query param required");
        return await handleVote(req, code);
      case "update":
        if (req.method !== "POST") return jsonError(405, "Method not allowed");
        if (!code) return jsonError(400, "code query param required");
        return await handleUpdate(req, code);
      case "end":
        if (req.method !== "POST") return jsonError(405, "Method not allowed");
        if (!code) return jsonError(400, "code query param required");
        return await handleEnd(code);
      default:
        return jsonError(400, "Unknown action");
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonError(500, message);
  }
};
