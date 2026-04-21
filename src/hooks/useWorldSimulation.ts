/**
 * useWorldSimulation.ts
 *
 * Drives the "live world" layer on the Present screen. When an inject with
 * worldEvents is released, this hook fires each event after its delaySeconds
 * using one-shot setTimeout calls.
 *
 * Consumers register typed callbacks; the hook dispatches to the matching one
 * when an event fires. All timers are cleared when the injectId changes (i.e.
 * a new inject is released) or the component unmounts.
 */

import { useEffect, useRef } from "react";
import type { WorldEvent } from "@/types";

export interface WorldCallbacks {
  onStockTick?: (delta: number) => void;
  onSocialPost?: (content: string, author?: string) => void;
  onSlackMessage?: (content: string, author?: string) => void;
  onChatPressure?: (content: string) => void;
  onTickerHeadline?: (content: string) => void;
}

/**
 * @param injectId   The ID of the currently live inject. When it changes, all
 *                   pending timers from the previous inject are cancelled.
 * @param events     worldEvents array from the current inject (may be undefined).
 * @param callbacks  Object of typed event handlers. Stable references preferred
 *                   (wrap in useCallback or define outside the component) but the
 *                   hook always calls the latest version via a ref so stale
 *                   closures are not a concern.
 */
export function useWorldSimulation(
  injectId: string | undefined,
  events: WorldEvent[] | undefined,
  callbacks: WorldCallbacks,
) {
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;

  useEffect(() => {
    if (!injectId || !events || events.length === 0) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (const ev of events) {
      const t = setTimeout(() => {
        const cb = cbRef.current;
        switch (ev.type) {
          case "stock_tick":
            if (ev.stockDelta !== undefined) cb.onStockTick?.(ev.stockDelta);
            break;
          case "social_post":
            if (ev.content) cb.onSocialPost?.(ev.content, ev.author);
            break;
          case "slack_message":
            if (ev.content) cb.onSlackMessage?.(ev.content, ev.author);
            break;
          case "chat_pressure":
            if (ev.content) cb.onChatPressure?.(ev.content);
            break;
          case "ticker_headline":
            if (ev.content) cb.onTickerHeadline?.(ev.content);
            break;
        }
      }, ev.delaySeconds * 1000);

      timers.push(t);
    }

    return () => {
      for (const t of timers) clearTimeout(t);
    };
  // Re-run only when the inject changes. Events/callbacks are stable for a given inject.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injectId]);
}
