import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // crux-* — Crucible design tokens. Two contexts: facilitator (warm cream)
        // and present (deep forest dark, activated via html.present class).
        // Using rgb(var(...) / <alpha-value>) pattern enables Tailwind opacity modifiers.
        crux: {
          base:           "rgb(var(--crux-base)           / <alpha-value>)",
          surface:        "rgb(var(--crux-surface)        / <alpha-value>)",
          panel:          "rgb(var(--crux-panel)          / <alpha-value>)",
          elevated:       "rgb(var(--crux-elevated)       / <alpha-value>)",
          hover:          "rgb(var(--crux-hover)          / <alpha-value>)",
          border:         "rgb(var(--crux-border)         / <alpha-value>)",
          "border-light": "rgb(var(--crux-border-light)   / <alpha-value>)",
          text:           "rgb(var(--crux-text)           / <alpha-value>)",
          muted:          "rgb(var(--crux-muted)          / <alpha-value>)",
          dim:            "rgb(var(--crux-dim)            / <alpha-value>)",
          green:          "rgb(var(--crux-green)          / <alpha-value>)",
          "green-light":  "rgb(var(--crux-green-light)    / <alpha-value>)",
          "green-dark":   "rgb(var(--crux-green-dark)     / <alpha-value>)",
          red:            "rgb(var(--crux-red)            / <alpha-value>)",
          cream:          "rgb(var(--crux-cream)          / <alpha-value>)",
        },
        // rtr-* — legacy aliases kept for non-breaking migration.
        // These map to the same CSS vars as crux-* via index.css.
        rtr: {
          base:           "rgb(var(--rtr-base)           / <alpha-value>)",
          sidebar:        "rgb(var(--rtr-sidebar)        / <alpha-value>)",
          panel:          "rgb(var(--rtr-panel)          / <alpha-value>)",
          elevated:       "rgb(var(--rtr-elevated)       / <alpha-value>)",
          hover:          "rgb(var(--rtr-hover)          / <alpha-value>)",
          border:         "rgb(var(--rtr-border)         / <alpha-value>)",
          "border-light": "rgb(var(--rtr-border-light)   / <alpha-value>)",
          text:           "rgb(var(--rtr-text)           / <alpha-value>)",
          muted:          "rgb(var(--rtr-muted)          / <alpha-value>)",
          dim:            "rgb(var(--rtr-dim)            / <alpha-value>)",
          cream:          "rgb(var(--rtr-cream)          / <alpha-value>)",
          green:          "rgb(var(--rtr-green)          / <alpha-value>)",
          red:            "rgb(var(--rtr-red)            / <alpha-value>)",
        },
      },
      fontFamily: {
        brand: ["'Bebas Neue'", "Impact", "'Arial Black'", "sans-serif"],
        mono: ["'Share Tech Mono'", "Cascadia Code", "monospace"],
      },
      keyframes: {
        "inject-in": {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        ping2: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%":       { transform: "scale(1.4)", opacity: "0.6" },
        },
      },
      animation: {
        "inject-in": "inject-in 0.25s ease-out",
        "ping2": "ping2 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
