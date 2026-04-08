import { useStore } from "@/store";
import {
  LayoutDashboard, BookOpen, PlayCircle, FileText,
  Settings, ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { View } from "@/types";

const NAV: { view: View; label: string; icon: React.ElementType }[] = [
  { view: "home",     label: "Dashboard",   icon: LayoutDashboard },
  { view: "library",  label: "Scenarios",   icon: BookOpen },
  { view: "runner",   label: "Live Session", icon: PlayCircle },
  { view: "report",   label: "Report",      icon: FileText },
  { view: "settings", label: "Settings",    icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const view    = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const session = useStore((s) => s.session);

  return (
    <div className="flex h-screen overflow-hidden bg-rtr-base">
      {/* Sidebar */}
      <aside className="w-56 flex flex-col bg-rtr-sidebar border-r border-rtr-border shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-rtr-border" style={{ borderTop: "1px solid rgba(74,254,145,0.2)" }}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rtr-red/15">
            <ShieldAlert className="w-4 h-4 text-rtr-red" />
          </div>
          <span className="brand-glow text-sm tracking-wide">CrisisTabletop</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ view: v, label, icon: Icon }) => {
            const active  = view === v;
            const hasLive = v === "runner" && session?.status === "active";
            return (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition-colors text-left",
                  active
                    ? "bg-rtr-green/8 text-rtr-green font-medium"
                    : "text-rtr-muted hover:bg-rtr-elevated hover:text-rtr-text"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {hasLive && (
                  <span className="ml-auto flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-rtr-red opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rtr-red" />
                  </span>
                )}
                {active && !hasLive && (
                  <span className="ml-auto w-1 h-3.5 rounded-full bg-rtr-green/60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Session status pill */}
        {session && session.status !== "ended" && (
          <div className="px-4 py-3 border-t border-rtr-border">
            <button onClick={() => setView("runner")} className="w-full text-left">
              <div className="flex items-center gap-2 mb-1">
                {session.status === "active" && (
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rtr-red opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rtr-red" />
                  </span>
                )}
                <span className="text-xs font-medium text-rtr-text truncate">
                  {session.scenario.title}
                </span>
              </div>
              <p className="text-xs text-rtr-dim capitalize">
                {session.status} · {session.liveInjects.length}/{session.scenario.injects.length} injects
              </p>
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
