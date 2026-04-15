/**
 * App.tsx - Root component and view router.
 *
 * URL hash routing (no React Router):
 * - #present       -> standalone projector screen
 * - #join/CODE     -> participant join flow (mobile entry point for QR voting)
 * - anything else  -> facilitator app (Layout sidebar shell + active view)
 */

import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { Layout } from "@/components/Layout";
import { Home } from "@/screens/Home";
import { Library } from "@/screens/Library";
import { Builder } from "@/screens/Builder";
import { Setup } from "@/screens/Setup";
import { Runner } from "@/screens/Runner";
import { Report } from "@/screens/Report";
import { Settings } from "@/screens/Settings";
import { Present } from "@/screens/Present";
import { Join } from "@/screens/Join";
import { Participant } from "@/screens/Participant";

type HashRoute =
  | { kind: "present" }
  | { kind: "join"; code: string }
  | { kind: "participant"; code: string }
  | { kind: "app" };

function parseHash(): HashRoute {
  const hash = window.location.hash;
  if (hash === "#present") return { kind: "present" };
  const joinMatch = hash.match(/^#join\/([A-Z0-9]+)$/i);
  if (joinMatch) return { kind: "join", code: joinMatch[1].toUpperCase() };
  const partMatch = hash.match(/^#participant\/([A-Z0-9]+)$/i);
  if (partMatch) return { kind: "participant", code: partMatch[1].toUpperCase() };
  return { kind: "app" };
}

export function App() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const theme = useStore((s) => s.settings.theme);

  const [route, setRoute] = useState<HashRoute>(() => parseHash());

  // Sync light/dark class on <html> whenever theme setting changes.
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    // Also re-evaluate once on mount
    onHash();
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Sync the present view into Zustand for the existing flow
  useEffect(() => {
    if (route.kind === "present") setView("present");
  }, [route.kind, setView]);

  if (route.kind === "present" || view === "present") return <Present />;
  if (route.kind === "join") return <Join code={route.code} />;
  if (route.kind === "participant") return <Participant code={route.code} />;

  return (
    <Layout>
      {view === "home"     && <Home />}
      {view === "library"  && <Library />}
      {view === "builder"  && <Builder />}
      {view === "setup"    && <Setup />}
      {view === "runner"   && <Runner />}
      {view === "report"   && <Report />}
      {view === "settings" && <Settings />}
    </Layout>
  );
}
