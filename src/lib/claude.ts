/**
 * claude.ts - Anthropic Claude API integration.
 *
 * suggestInjectText() uses Claude Haiku to generate realistic inject body text
 * while building scenarios in the Builder screen. Routed through the Netlify
 * Function proxy at /.netlify/functions/claude so no personal API key is needed.
 */

import { SCENARIO_TYPE_LABELS, DIFFICULTY_LABEL } from "@/lib/utils";

const PROXY_ENDPOINT = "/.netlify/functions/claude";

/**
 * Call the Anthropic Messages API. Routes through the Netlify Function
 * proxy unless a user-supplied apiKey is provided (BYO key fallback).
 */
async function callClaude(
  payload: Record<string, unknown>,
  apiKey?: string
): Promise<Response> {
  if (apiKey && apiKey.trim()) {
    return fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(payload),
    });
  }
  return fetch(PROXY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/** Generate a realistic inject body using Claude Haiku. */
export async function suggestInjectText(
  opts: {
    scenarioType: string;
    scenarioTitle: string;
    difficulty: string;
    injectIndex: number;
    totalInjects: number;
    injectTitle: string;
    targetRoles: string[];
    previousInjects: Array<{ title: string; body: string }>;
  },
  apiKey?: string
): Promise<string> {
  const roleNames = opts.targetRoles.join(", ") || "all participants";
  const prev = opts.previousInjects.length
    ? opts.previousInjects
        .map((p, i) => `Inject ${i + 1}: ${p.title} - ${p.body.slice(0, 120)}`)
        .join("\n")
    : "None yet (this is the first inject)";

  const prompt = `You are writing inject text for a crisis tabletop exercise.

Scenario: ${opts.scenarioTitle || opts.scenarioType} (${SCENARIO_TYPE_LABELS[opts.scenarioType] ?? opts.scenarioType}, ${DIFFICULTY_LABEL[opts.difficulty] ?? opts.difficulty} difficulty)
This is inject ${opts.injectIndex + 1} of approximately ${opts.totalInjects}.
Primarily directed at: ${roleNames}
Inject title: "${opts.injectTitle}"

Previous injects:
${prev}

Write the inject body text shown on screen to participants. Requirements:
- 2–4 sentences, written as an urgent operational update
- Escalate appropriately given this is inject ${opts.injectIndex + 1} in the sequence
- Include specific realistic details (system names, timestamps, quantities, names)
- End with a pressure point that demands a decision or response

Return ONLY the inject text, no preamble or explanation.`;

  const res = await callClaude(
    {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    },
    apiKey
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return (data.content[0].text as string).trim();
}

