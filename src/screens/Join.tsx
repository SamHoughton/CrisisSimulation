/**
 * Join.tsx - Mobile entry point for QR-voting participants.
 *
 * Reached via /#join/CODE. Fetches the live session, presents available
 * roles, takes the participant's name, and posts a join request. On
 * success, stores credentials in localStorage and redirects to the
 * Participant screen at /#participant/CODE.
 *
 * Designed for phones - large touch targets, no sidebar, no chrome.
 */

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, ShieldAlert, ArrowRight } from "lucide-react";
import {
  getRemoteSession,
  joinRemoteSession,
} from "@/lib/remoteSession";
import type { RemoteSessionState, ExecRole } from "@/types";
import { ROLE_LONG, ROLE_SHORT } from "@/lib/utils";

const STORAGE_KEY_PREFIX = "vigil-participant:";

function storeCredentials(code: string, participantId: string, name: string, role: ExecRole) {
  localStorage.setItem(
    STORAGE_KEY_PREFIX + code,
    JSON.stringify({ participantId, name, role })
  );
}

export function Join({ code }: { code: string }) {
  const [session, setSession] = useState<RemoteSessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState<ExecRole | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await getRemoteSession(code);
        if (!cancelled) setSession(s);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Failed to load session");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [code]);

  // If we already joined this session before, jump straight to the participant view
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + code);
    if (stored) {
      window.location.hash = `#participant/${code}`;
    }
  }, [code]);

  const handleJoin = async () => {
    if (!name.trim() || !role) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const { participant } = await joinRemoteSession(code, {
        name: name.trim(),
        role: role as ExecRole,
      });
      storeCredentials(code, participant.id, participant.name, participant.role);
      window.location.hash = `#participant/${code}`;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not join");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rtr-base flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rtr-green animate-spin" />
      </div>
    );
  }

  if (loadError || !session) {
    return (
      <div className="min-h-screen bg-rtr-base flex items-center justify-center p-6">
        <div className="bg-rtr-panel border border-rtr-border rounded-2xl p-6 max-w-sm w-full text-center">
          <ShieldAlert className="w-10 h-10 text-rtr-red mx-auto mb-3" />
          <h1 className="text-lg font-semibold text-rtr-text mb-1">Can't join session</h1>
          <p className="text-sm text-rtr-muted mb-4">
            {loadError || "This session no longer exists."}
          </p>
          <p className="text-xs text-rtr-dim font-mono">Code: {code}</p>
        </div>
      </div>
    );
  }

  if (session.status === "ended") {
    return (
      <div className="min-h-screen bg-rtr-base flex items-center justify-center p-6">
        <div className="bg-rtr-panel border border-rtr-border rounded-2xl p-6 max-w-sm w-full text-center">
          <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h1 className="text-lg font-semibold text-rtr-text mb-1">Session ended</h1>
          <p className="text-sm text-rtr-muted">This exercise has finished.</p>
        </div>
      </div>
    );
  }

  // Roles that haven't been claimed yet
  const claimedRoles = new Set(session.participants.map((p) => p.role));
  const offerRoles: ExecRole[] = (
    session.availableRoles.length ? session.availableRoles : (Object.keys(ROLE_LONG) as ExecRole[])
  ).filter((r) => r !== "CUSTOM");

  return (
    <div className="min-h-screen bg-rtr-base text-rtr-text">
      <div className="max-w-md mx-auto p-6 pt-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-rtr-red animate-pulse" />
            <span className="text-xs font-semibold text-rtr-red uppercase tracking-widest">Crucible Live</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{session.scenarioTitle}</h1>
          <p className="text-sm text-rtr-muted">
            Session code <span className="font-mono text-rtr-text">{session.code}</span>
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-rtr-dim uppercase tracking-wider block mb-2">
              Your name
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Chen"
              className="w-full text-base bg-rtr-panel border border-rtr-border rounded-xl px-4 py-3 focus:outline-none focus:border-rtr-green placeholder:text-rtr-dim"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-rtr-dim uppercase tracking-wider block mb-2">
              Your role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {offerRoles.map((r) => {
                const claimed = claimedRoles.has(r);
                const selected = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => !claimed && setRole(r)}
                    disabled={claimed}
                    className={`px-3 py-3 rounded-xl border text-sm font-medium transition-colors text-left ${
                      selected
                        ? "border-rtr-green bg-rtr-green/10 text-rtr-text"
                        : claimed
                        ? "border-rtr-border bg-rtr-panel/50 text-rtr-dim cursor-not-allowed"
                        : "border-rtr-border bg-rtr-panel text-rtr-text hover:border-rtr-green/50"
                    }`}
                  >
                    <div className="font-semibold">{ROLE_SHORT[r]}</div>
                    <div className="text-[10px] text-rtr-dim leading-tight mt-0.5">
                      {claimed ? "Taken" : ROLE_LONG[r]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {submitError && (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <button
            onClick={handleJoin}
            disabled={!name.trim() || !role || submitting}
            className="w-full flex items-center justify-center gap-2 bg-rtr-red text-white py-4 rounded-xl text-base font-semibold hover:bg-[#c0001f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Join exercise
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-[11px] text-rtr-dim text-center leading-relaxed">
            By joining, your name and votes will be visible to the facilitator
            and other participants for this session only.
          </p>
        </div>
      </div>
    </div>
  );
}
