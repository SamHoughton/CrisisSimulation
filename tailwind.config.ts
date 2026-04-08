import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: "#0f172a",
        "sidebar-hover": "#1e293b",
        surface: "#1e293b",
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
