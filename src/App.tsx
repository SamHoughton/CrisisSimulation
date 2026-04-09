/**
 * App.tsx — Root component and view router.
 *
 * If the URL hash is #present, renders the standalone Present screen (projector view).
 * Otherwise wraps the current view in the Layout sidebar shell.
 * View state is managed by Zustand — no React Router needed.
 */

import { useEffect } from "react";
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

export function App() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);

  // If the URL hash is #present, render the standalone present window
  useEffect(() => {
    if (window.location.hash === "#present") {
      setView("present");
    }
  }, []);

  if (view === "present") return <Present />;

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
