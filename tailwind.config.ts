import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rtr: {
          base:     "#0f0e0e",
          sidebar:  "#111215",
          panel:    "#15171a",
          elevated: "#1c1f24",
          hover:    "#22262d",
          border:   "#1e2128",
          "border-light": "#2a2e3a",
          text:     "#e8eaf0",
          muted:    "#8b8fa8",
          dim:      "#4a4f65",
          cream:    "#f2ede8",
          green:    "#4afe91",
          red:      "#E82222",
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
