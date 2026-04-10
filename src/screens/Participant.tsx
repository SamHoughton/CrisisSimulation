/**
 * Participant.tsx - Mobile screen for joined participants.
 *
 * Reached via /#participant/CODE after joining. Polls the remote session
 * every 1.5 seconds and renders one of three states:
 *
 * - Waiting:    no current inject - "waiting for facilitator" pulse
 * - Briefing:   non-decision-point inject - shows the body text only
 * - Voting:     decision-point inject - shows options + tap-to-vote
 * - Revealed:   the facilitator has revealed the result - shows winner
 *
 * Credentials live in localStorage under "vigil-participant:CODE" so a
 * page refresh keeps the participant signed in.
 */

import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, ShieldAlert, Clock, Vote } from "lucide-react";
import {
  getRemoteSession,
  submitRemoteVote,
} from "@/lib/remoteSession";
import type { RemoteSessionState, ExecRole } from "@/types";
import { ROLE_LONG } from "@/lib/utils";

const STORAGE_KEY_PREFIX = "vigil-participant:";
const POLL_INTERVAL_MS = 1500;

interface StoredCredentials {
  participantId: string;
  name: string;
  role: ExecRole;
}

function loadCredentials(code: string): StoredCredentials | null {
  const raw = localStorage.getItem(STORAGE_KEY_PREFIX + code);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function Participant({ code }: { code: string }) {
  const [creds] = useState<StoredCredentials | null>(() => loadCredentials(code));
  const [session, setSession] = useState<RemoteSessionState | null>(null);
  const [error, setError] = useState("");
  const [voting, setVoting] = useState(false);
  const [myVote, setMyVote] = useState<{ injectId: string; optionKey: string } | null>(null);

  // Track which inject we last cleared myVote for, so a new inject resets it
  const lastInjectIdRef = useRef<string | null>(null);

  // Redirect to join if no creds
  useEffect(() => {
    if (!creds) {
      window.location.hash = `#join/${code}`;
    }
  }, [creds, code]);

  // Polling loop
  useEffect(() => {
    if (!creds) return;
    let cancelled = false;

    const tick = async () => {
      try {
        const s = await getRemoteSession(code);
        if (cancelled) return;
        setSession(s);
        setError("");

        // If the active inject changed, clear local vote
        const activeId = s.currentInject?.injectId ?? null;
        if (activeId !== lastInjectIdRef.current) {
          lastInjectIdRef.current = activeId;
          setMyVote(null);
        }

        // If our vote is in the server state, mirror it locally
        if (s.currentInject) {
          const mine = s.votes.find((v) => v.participantId === creds.participantId);
          if (mine) {
            setMyVote({ injectId: s.currentInject.injectId, optionKey: mine.optionKey });
          }
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Connection lost");
      }
    };

    tick();
    const id = window.setInterval(tick, POLL_INTERVAL_MS);
    return () => { cancelled = true; window.clearInterval(id); };
  }, [code, creds]);

  const handleVote = async (optionKey: string) => {
    if (!creds || !session?.currentInject) return;
    setVoting(true);
    setError("");
    try {
      await submitRemoteVote(code, {
        participantId: creds.participantId,
        injectId: session.currentInject.injectId,
        optionKey,
      });
      setMyVote({ injectId: session.currentInject.injectId, optionKey });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vote failed");
    } finally {
      setVoting(false);
    }
  };

  if (!creds) return null; // redirect in flight

  if (!session) {
    return (
      <div className="min-h-screen bg-rtr-base flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rtr-green animate-spin" />
      </div>
    );
  }

  if (session.status === "ended") {
    return (
      <ParticipantShell creds={creds}>
        <div className="bg-rtr-panel border border-rtr-border rounded-2xl p-6 text-center">
          <CheckCircle2 className="w-10 h-10 text-rtr-green mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-1">Exercise complete</h2>
          <p className="text-sm text-rtr-muted">
            Thanks for taking part. The facilitator has ended this session.
          </p>
        </div>
      </ParticipantShell>
    );
  }

  const inject = session.currentInject;
  const decisionPoint = inject?.isDecisionPoint && (inject.options?.length ?? 0) > 0;

  return (
    <ParticipantShell creds={creds}>
      {error && (
        <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}

      {!inject && (
        <div className="bg-rtr-panel border border-rtr-border rounded-2xl p-8 text-center">
          <div className="relative mx-auto w-12 h-12 mb-4">
            <Clock className="w-12 h-12 text-rtr-dim" />
            <div className="absolute inset-0 rounded-full bg-rtr-green/20 animate-ping" />
          </div>
          <h2 className="text-lg font-semibold mb-1">Waiting for facilitator</h2>
          <p className="text-sm text-rtr-muted">
            The exercise will start shortly. Keep this screen open.
          </p>
        </div>
      )}

      {inject && (
        <div className="bg-rtr-panel border border-rtr-border rounded-2xl p-5 mb-4">
          <div className="text-[10px] font-semibold text-rtr-red uppercase tracking-widest mb-2">
            Live Inject
          </div>
          <h2 className="text-lg font-semibold mb-3">{inject.title}</h2>
          <p className="text-sm text-rtr-muted leading-relaxed whitespace-pre-wrap">
            {inject.body}
          </p>
        </div>
      )}

      {inject && decisionPoint && !inject.revealed && (
        <div className="bg-rtr-panel border border-amber-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Vote className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
              Decision required
            </span>
          </div>
          <div className="space-y-2">
            {inject.options.map((opt) => {
              const selected = myVote?.optionKey === opt.key && myVote?.injectId === inject.injectId;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleVote(opt.key)}
                  disabled={voting}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    selected
                      ? "border-rtr-green bg-rtr-green/10"
                      : "border-rtr-border bg-rtr-base hover:border-rtr-green/40"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${
                      selected ? "bg-rtr-green text-rtr-base" : "bg-rtr-elevated text-rtr-muted"
                    }`}>
                      {opt.key}
                    </span>
                    <span className="text-sm leading-snug">{opt.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {myVote?.injectId === inject.injectId && (
            <div className="mt-4 flex items-center gap-2 text-xs text-rtr-green">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Your vote is in. You can change it until the facilitator reveals.
            </div>
          )}
        </div>
      )}

      {inject && decisionPoint && inject.revealed && (
        <div className="bg-rtr-panel border border-rtr-green/30 rounded-2xl p-5">
          <div className="text-xs font-semibold text-rtr-green uppercase tracking-widest mb-3">
            Result
          </div>
          {inject.winningOptionKey ? (
            <div>
              <p className="text-sm text-rtr-muted mb-2">Winning option</p>
              <p className="text-base font-semibold text-rtr-text">
                {inject.options.find((o) => o.key === inject.winningOptionKey)?.label ?? inject.winningOptionKey}
              </p>
            </div>
          ) : (
            <p className="text-sm text-rtr-muted">Waiting for facilitator to advance.</p>
          )}
        </div>
      )}
    </ParticipantShell>
  );
}

function ParticipantShell({
  creds,
  children,
}: {
  creds: StoredCredentials;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-rtr-base text-rtr-text">
      <div className="max-w-md mx-auto p-5 pt-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-rtr-border">
          <div>
            <p className="text-xs text-rtr-dim uppercase tracking-wider">Logged in as</p>
            <p className="text-sm font-semibold">{creds.name}</p>
            <p className="text-[11px] text-rtr-muted">{ROLE_LONG[creds.role] ?? creds.role}</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-rtr-red animate-pulse" />
              <span className="text-[10px] font-semibold text-rtr-red uppercase tracking-widest">Live</span>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
