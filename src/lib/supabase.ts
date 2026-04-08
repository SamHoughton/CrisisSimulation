import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (used for Realtime subscriptions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Realtime channel helpers ─────────────────────────────────────────────────

// Channel name conventions:
//   exercise:{exerciseId}          — all events for a live session
//   exercise:{exerciseId}:inject   — new inject released
//   exercise:{exerciseId}:response — participant response submitted
//   exercise:{exerciseId}:decision — decision point choice submitted
//   exercise:{exerciseId}:status   — session paused / resumed / ended

export function exerciseChannel(exerciseId: string) {
  return supabase.channel(`exercise:${exerciseId}`);
}

export type RealtimeInjectPayload = {
  liveInjectId: string;
  templateId: string;
  body: string;
  isDecisionPoint: boolean;
  decisionOptions?: { key: string; label: string }[];
  releasedAt: string;
};

export type RealtimeResponsePayload = {
  liveInjectId: string;
  participantId: string;
  role: string;
  participantName: string | null;
  body: string;
  submittedAt: string;
};

export type RealtimeDecisionPayload = {
  liveInjectId: string;
  participantId: string;
  role: string;
  decisionKey: string;
  decisionLabel: string;
  lockedAt: string;
};

export type RealtimeStatusPayload = {
  status: "PAUSED" | "ACTIVE" | "COMPLETED";
  timestamp: string;
};
