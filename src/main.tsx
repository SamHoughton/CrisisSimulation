import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";

// Apply stored theme before first render to prevent flash of wrong theme.
try {
  const raw = localStorage.getItem("crisis-tabletop");
  if (raw) {
    const stored = JSON.parse(raw) as { state?: { settings?: { theme?: string } } };
    if (stored?.state?.settings?.theme === "light") {
      document.documentElement.classList.add("light");
    }
  }
} catch {
  // ignore parse errors
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
