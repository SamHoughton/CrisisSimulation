/**
 * netlify/functions/claude.ts - Anthropic API proxy.
 *
 * Forwards browser POSTs to api.anthropic.com using a server-side API key
 * stored in the ANTHROPIC_API_KEY env var. Keeps the key out of the
 * shipped JS bundle and lets us absorb costs on behalf of users.
 *
 * Protections:
 * - Model allow-list (only Haiku 4.5 and Sonnet 4.6)
 * - max_tokens hard cap
 * - Body size cap
 * - Per-IP in-memory rate limit (best-effort; resets on cold start)
 *
 * Endpoint: /.netlify/functions/claude
 */

import type { Context } from "@netlify/functions";

const ALLOWED_MODELS = new Set([
  "claude-haiku-4-5-20251001",
  "claude-sonnet-4-6",
]);

const MAX_TOKENS_CAP = 4096;
const MAX_BODY_BYTES = 100_000; // 100 KB
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 30; // 30 requests per IP per hour

// Per-instance in-memory rate limiter. Imperfect across cold starts but
// catches obvious abuse and costs nothing. Swap for Netlify Blobs later
// if abuse becomes real.
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (req: Request, _context: Context): Promise<Response> => {
  if (req.method !== "POST") {
    return jsonError(405, "Method not allowed");
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonError(
      500,
      "Server is not configured. Set ANTHROPIC_API_KEY in Netlify environment variables."
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-nf-client-connection-ip") ||
    "unknown";

  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return jsonError(429, "Rate limit exceeded. Try again later.");
  }

  let body: Record<string, unknown>;
  try {
    const rawText = await req.text();
    if (rawText.length > MAX_BODY_BYTES) {
      return jsonError(413, "Request body too large");
    }
    body = JSON.parse(rawText);
  } catch {
    return jsonError(400, "Invalid JSON body");
  }

  const model = typeof body.model === "string" ? body.model : "";
  if (!ALLOWED_MODELS.has(model)) {
    return jsonError(
      400,
      `Model not allowed. Allowed: ${[...ALLOWED_MODELS].join(", ")}`
    );
  }

  if (typeof body.max_tokens === "number" && body.max_tokens > MAX_TOKENS_CAP) {
    body.max_tokens = MAX_TOKENS_CAP;
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const upstreamText = await upstream.text();
    return new Response(upstreamText, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") ?? "application/json",
        "X-RateLimit-Remaining": String(rl.remaining),
      },
    });
  } catch (err) {
    return jsonError(502, `Upstream request failed: ${String(err)}`);
  }
};
