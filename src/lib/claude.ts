import type { Session, GeneratedReport } from "@/types";
import { ROLE_SHORT, SCENARIO_TYPE_LABELS, DIFFICULTY_LABEL } from "@/lib/utils";

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
  apiKey: string
): Promise<string> {
  const roleNames = opts.targetRoles.join(", ") || "all participants";
  const prev = opts.previousInjects.length
    ? opts.previousInjects
        .map((p, i) => `Inject ${i + 1}: ${p.title} — ${p.body.slice(0, 120)}`)
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

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return (data.content[0].text as string).trim();
}

const SYSTEM_PROMPT = `You are an expert crisis management consultant evaluating a completed tabletop exercise.

Analyse the transcript and produce a structured post-exercise report. Assessment dimensions:
1. Speed of escalation — was escalation prompt and appropriate?
2. Communication clarity — clear, accurate, well-targeted messaging?
3. Legal & regulatory awareness — notification obligations, compliance, D&O risks?
4. Technical accuracy — grounded technical assessments?
5. Stakeholder management — internal/external stakeholders handled well?
6. Decision quality — decisions sound, proportionate, well-reasoned?

Scoring: 0–100 per dimension. Be direct. Executives benefit from honest, specific feedback.
Ground all feedback in actual transcript moments.
Recommendations must be concrete and immediately actionable.

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
  apiKey: string
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
    .map((p) => `${ROLE_SHORT[p.role] ?? p.role}${p.name ? ` — ${p.name}` : ""}`)
    .join(", ")}

## Transcript
${transcript}

${
  session.notes.length
    ? `## Facilitator Notes\n${session.notes.map((n) => `- ${n.text}`).join("\n")}`
    : ""
}

Return valid JSON only.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

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
