/**
 * claude.ts - Anthropic Claude API integration.
 *
 * Two functions:
 * 1. suggestInjectText() - Uses Claude Haiku to generate realistic inject body text
 *    while building scenarios in the Builder screen. Fast and cheap (~$0.001/call).
 *
 * 2. generateReport() - Uses Claude Sonnet to analyse a completed session transcript
 *    and produce a structured gap analysis report with scores, role feedback, and
 *    recommendations. Takes 20–40 seconds; costs ~$0.05–0.15/report.
 *
 * Routing:
 * - If a user-provided API key is present, calls api.anthropic.com directly
 *   with the "anthropic-dangerous-direct-browser-access" header (BYO key mode).
 * - Otherwise, calls the Netlify Function proxy at /.netlify/functions/claude
 *   which injects a server-side ANTHROPIC_API_KEY env var. This keeps the
 *   key out of the bundle and lets us absorb costs for users.
 */

import type { Session, GeneratedReport } from "@/types";
import { ROLE_SHORT, SCENARIO_TYPE_LABELS, DIFFICULTY_LABEL } from "@/lib/utils";

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

const SYSTEM_PROMPT = `You are a senior crisis management adviser writing a post-exercise debrief for a board-level audience.

Analyse the transcript and produce a structured report. Assessment dimensions:
1. Speed of escalation — was escalation prompt and appropriate?
2. Communication clarity — clear, accurate, well-targeted messaging?
3. Legal and regulatory awareness — notification obligations, compliance, D&O risks?
4. Technical accuracy — grounded technical assessments?
5. Stakeholder management — internal and external stakeholders handled well?
6. Decision quality — decisions sound, proportionate, well-reasoned?

Scoring: 0–100 per dimension. Be direct. Executives need honest, specific feedback grounded in what actually happened, not general observations.

Executive summary: 2–3 sentences. Lead with the single most critical gap. Write as a direct verdict, not a summary of events. No hedging ("the exercise revealed…", "participants demonstrated…"). Start with the finding.

Role feedback: judge each role on their specific decisions and responses, not their job title. If a role said nothing, say so plainly.

Recommendations: concrete and immediately actionable. Each one should be something the organisation can do in the next 90 days.

Ground every observation in a specific transcript moment.

Return ONLY valid JSON matching this schema exactly:
{
  "overallScore": number,
  "executiveSummary": string,
  "gapAnalysis": [{ "dimension": string, "score": number, "observations": string[], "positives": string[] }],
  "roleFeedback": { "<ROLE>": { "summary": string, "strengths": string[], "gaps": string[], "score": number } },
  "recommendations": [{ "priority": "HIGH"|"MEDIUM"|"LOW", "title": string, "detail": string, "relatedRole": string|null }]
}`;

export async function generateReport(
  session: Session,
  apiKey?: string,
  opts?: { orgName?: string; facilitatorName?: string }
): Promise<GeneratedReport> {
  const duration = session.endedAt
    ? Math.round(
        (new Date(session.endedAt).getTime() -
          new Date(session.startedAt).getTime()) /
          60000
      )
    : session.scenario.durationMin;

  const transcript = session.liveInjects
    .map(
      (li, i) => `
### Inject ${i + 1}: ${li.injectTitle}
**Text:** ${li.injectBody}

**Responses received:**
${
  li.responses.length
    ? li.responses
        .map(
          (r) =>
            `- **${ROLE_SHORT[r.role] ?? r.role}${r.name ? ` (${r.name})` : ""}**: ${r.body}`
        )
        .join("\n")
    : "_No responses logged_"
}
${
  li.decisions.length
    ? `\n**Decisions:**\n${li.decisions
        .map(
          (d) =>
            `- **${ROLE_SHORT[d.role] ?? d.role}** chose Option ${d.optionKey}: ${d.optionLabel}`
        )
        .join("\n")}`
    : ""
}
${li.facilitatorNote ? `\n**Facilitator note:** ${li.facilitatorNote}` : ""}
`
    )
    .join("\n---\n");

  const userMessage = `Analyse this completed tabletop exercise.

**Scenario:** ${session.scenario.title} (${SCENARIO_TYPE_LABELS[session.scenario.type] ?? session.scenario.type})
**Difficulty:** ${DIFFICULTY_LABEL[session.scenario.difficulty] ?? session.scenario.difficulty}
**Duration:** ${duration} minutes
**Participants:** ${session.participants
    .map((p) => `${ROLE_SHORT[p.role] ?? p.role}${p.name ? ` - ${p.name}` : ""}`)
    .join(", ")}

## Transcript
${transcript}

${
  session.notes.length
    ? `## Facilitator Notes\n${session.notes.map((n) => `- ${n.text}`).join("\n")}`
    : ""
}

Return valid JSON only.`;

  const res = await callClaude(
    {
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    },
    apiKey
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text: string = data.content[0].text;
  const json = text
    .replace(/^```json\s*/m, "")
    .replace(/^```\s*/m, "")
    .replace(/```$/m, "")
    .trim();

  const result = JSON.parse(json) as Omit<GeneratedReport, "generatedAt">;
  return { ...result, generatedAt: new Date().toISOString() };
}
