import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // All rtr-* colors reference CSS custom properties (defined in index.css).
        // Using the `rgb(var(--rtr-XXX) / <alpha-value>)` pattern allows Tailwind's
        // opacity modifiers (e.g. bg-rtr-panel/50, border-rtr-green/20) to work.
        // The CSS vars are toggled between dark (default) and light (html.light) values.
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
