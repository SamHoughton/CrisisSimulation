/**
 * LoadScreen.tsx — Crucible animated splash screen.
 *
 * Shown on first app load and optionally when launching a session.
 * Unmounts itself after `duration` ms by calling `onComplete`.
 *
 * Usage:
 *   <LoadScreen onComplete={() => setView("home")} />
 *   <LoadScreen onComplete={() => setReady(true)} duration={3800} />
 */

import { useEffect, useState } from "react";

interface LoadScreenProps {
  onComplete: () => void;
  /** Total duration in ms before onComplete fires. Default 3800. */
  duration?: number;
  /** Optional override for the tagline. */
  tagline?: string;
}

const LETTERS = ["C", "r", "u", "c", "i", "b", "l", "e"];

// Stagger delay in ms for each letter, relative to vessel-draw completing
const LETTER_DELAYS = [0, 60, 120, 180, 240, 300, 360, 420];

export function LoadScreen({
  onComplete,
  duration = 3800,
  tagline = "Crisis simulation platform",
}: LoadScreenProps) {
  const [phase, setPhase] = useState<"idle" | "drawing" | "letters" | "bar" | "done">("idle");

  useEffect(() => {
    // Kick off the animation sequence
    setPhase("drawing");

    const t1 = setTimeout(() => setPhase("letters"), 1300);
    const t2 = setTimeout(() => setPhase("bar"),     2100);
    // t3 triggers the fade-out; t4 unmounts after the transition completes (0.5s ease 0.2s = ~700ms)
    const t3 = setTimeout(() => setPhase("done"), duration);
    const t4 = setTimeout(onComplete, duration + 750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawing     = phase !== "idle";
  const showLetters = phase === "letters" || phase === "bar" || phase === "done";
  const showBar     = phase === "bar" || phase === "done";
  const fadeOut     = phase === "done";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#0a0f0b",
        transition: fadeOut ? "opacity 0.5s ease 0.2s" : undefined,
        opacity: fadeOut ? 0 : 1,
      }}
    >
      {/* Scanline sweep */}
      {drawing && <ScanLine />}

      {/* Corner brackets */}
      {drawing && <CornerBrackets />}

      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(29,184,106,0.055) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Core content */}
      <div className="relative flex flex-col items-center z-10">
        {/* Vessel mark */}
        <div
          style={{
            marginBottom: 28,
            opacity: drawing ? 1 : 0,
            transform: drawing ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
          }}
        >
          <VesselMark drawing={drawing} />
        </div>

        {/* Wordmark letters */}
        <div
          className="flex overflow-hidden"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "#f7f5f0",
            marginBottom: 10,
            lineHeight: 1,
          }}
        >
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: showLetters ? 1 : 0,
                transform: showLetters ? "translateY(0)" : "translateY(18px)",
                transition: showLetters
                  ? `opacity 0.4s cubic-bezier(0.34,1.4,0.64,1) ${LETTER_DELAYS[i]}ms,
                     transform 0.4s cubic-bezier(0.34,1.4,0.64,1) ${LETTER_DELAYS[i]}ms`
                  : "none",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(29,184,106,0.55)",
            marginBottom: 36,
            opacity: showLetters ? 1 : 0,
            transition: "opacity 0.6s ease 420ms",
          }}
        >
          {tagline}
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: 180,
            height: 1,
            background: "rgba(247,245,240,0.06)",
            borderRadius: 1,
            overflow: "hidden",
            opacity: showBar ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "#1db86a",
              borderRadius: 1,
              width: showBar ? "100%" : "0%",
              transition: showBar
                ? "width 1.4s cubic-bezier(0.4,0,0.2,1)"
                : "none",
            }}
          />
        </div>
      </div>

      {/* Status line */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          fontFamily: "monospace",
          fontSize: 9,
          letterSpacing: "0.12em",
          color: "rgba(247,245,240,0.12)",
          textTransform: "uppercase",
          opacity: showBar ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        Initialising session environment
      </div>
    </div>
  );
}

/* ─── Vessel SVG mark ─────────────────────────────────────────────────────── */

function VesselMark({ drawing }: { drawing: boolean }) {
  const GREEN = "#1db86a";
  const SW = 2.8;   // stroke-width

  return (
    <svg width={90} height={96} viewBox="0 0 64 68" fill="none">
      {/* Body — draws in over ~1s */}
      <path
        d="M 14 12 L 21 54 Q 21 58 25 58 L 39 58 Q 43 58 43 54 L 50 12 Z"
        stroke={GREEN}
        strokeWidth={SW}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{
          strokeDasharray: 400,
          strokeDashoffset: drawing ? 0 : 400,
          transition: drawing ? "stroke-dashoffset 1.0s cubic-bezier(0.4,0,0.2,1) 0.2s" : "none",
        }}
      />
      {/* Rim */}
      <line
        x1="9" y1="13" x2="55" y2="13"
        stroke={GREEN} strokeWidth={SW} strokeLinecap="round"
        style={{
          strokeDasharray: 80,
          strokeDashoffset: drawing ? 0 : 80,
          transition: drawing ? "stroke-dashoffset 0.5s ease 0.9s" : "none",
        }}
      />
      {/* Left handle */}
      <line
        x1="5" y1="8" x2="13" y2="16"
        stroke={GREEN} strokeWidth={SW} strokeLinecap="round"
        style={{
          strokeDasharray: 30,
          strokeDashoffset: drawing ? 0 : 30,
          transition: drawing ? "stroke-dashoffset 0.3s ease 1.2s" : "none",
        }}
      />
      {/* Right handle */}
      <line
        x1="59" y1="8" x2="51" y2="16"
        stroke={GREEN} strokeWidth={SW} strokeLinecap="round"
        style={{
          strokeDasharray: 30,
          strokeDashoffset: drawing ? 0 : 30,
          transition: drawing ? "stroke-dashoffset 0.3s ease 1.35s" : "none",
        }}
      />
      {/* Heat lines */}
      {[
        { x1: 27, y1: 47, x2: 27, y2: 55, delay: 1.5, opacity: 0.45 },
        { x1: 32, y1: 49, x2: 32, y2: 57, delay: 1.6, opacity: 0.7  },
        { x1: 37, y1: 47, x2: 37, y2: 55, delay: 1.5, opacity: 0.45 },
      ].map((h, i) => (
        <line
          key={i}
          x1={h.x1} y1={h.y1} x2={h.x2} y2={h.y2}
          stroke={GREEN}
          strokeWidth={2}
          strokeLinecap="round"
          style={{
            opacity: drawing ? h.opacity : 0,
            transform: drawing ? "translateY(0)" : "translateY(4px)",
            transition: drawing
              ? `opacity 0.3s ease ${h.delay}s, transform 0.3s ease ${h.delay}s`
              : "none",
          }}
        />
      ))}
    </svg>
  );
}

/* ─── Scanline sweep ──────────────────────────────────────────────────────── */

function ScanLine() {
  return (
    <div
      className="absolute left-0 right-0 pointer-events-none z-20"
      style={{
        top: -1,
        height: 1,
        background: "linear-gradient(90deg, transparent 0%, rgba(29,184,106,0.09) 50%, transparent 100%)",
        animation: "crucible-scan 3.2s ease-in-out 0.4s infinite",
      }}
    />
  );
}

/* ─── Corner brackets ─────────────────────────────────────────────────────── */

function CornerBrackets() {
  const style = (pos: Record<string, string | number>) => ({
    position: "absolute" as const,
    width: 16,
    height: 16,
    opacity: 0,
    animation: "crucible-fade-in 0.5s ease 0.7s both",
    ...pos,
  });

  const borderColor = "rgba(29,184,106,0.28)";

  return (
    <>
      <div style={{ ...style({ top: 20, left: 20 }), borderTop: `1px solid ${borderColor}`, borderLeft: `1px solid ${borderColor}` }} />
      <div style={{ ...style({ top: 20, right: 20 }), borderTop: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }} />
      <div style={{ ...style({ bottom: 20, left: 20 }), borderBottom: `1px solid ${borderColor}`, borderLeft: `1px solid ${borderColor}` }} />
      <div style={{ ...style({ bottom: 20, right: 20 }), borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }} />
    </>
  );
}
