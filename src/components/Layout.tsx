import { useStore } from "@/store";
import {
  LayoutDashboard, BookOpen, PlayCircle, FileText,
  Settings, ShieldAlert, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { View } from "@/types";

const NAV: { view: View; label: string; icon: React.ElementType }[] = [
  { view: "home",     label: "Dashboard",       icon: LayoutDashboard },
  { view: "library",  label: "Scenarios",        icon: BookOpen },
  { view: "runner",   label: "Live Session",     icon: PlayCircle },
  { view: "report",   label: "Report",           icon: FileText },
  { view: "settings", label: "Settings",         icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const view    = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const session = useStore((s) => s.session);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 flex flex-col bg-sidebar shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20">
            <ShieldAlert className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">
            CrisisTabletop
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ view: v, label, icon: Icon }) => {
            const active = view === v;
            // Show a live dot on the session link when a session is active
            const hasLive = v === "runner" && session?.status === "active";
            return (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                  active
                    ? "bg-white/10 text-white font-medium"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {hasLive && (
                  <span className="ml-auto flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                )}
                {active && !hasLive && (
                  <ChevronRight className="ml-auto w-3.5 h-3.5 opacity-40" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Session status pill */}
        {session && session.status !== "ended" && (
          <div className="px-4 py-3 border-t border-white/5">
            <button
              onClick={() => setView("runner")}
              className="w-full text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                {session.status === "active" && (
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                )}
                <span className="text-xs font-medium text-white truncate">
                  {session.scenario.title}
                </span>
              </div>
              <p className="text-xs text-slate-500 capitalize">
                {session.status} ·{" "}
                {session.liveInjects.length}/{session.scenario.injects.length} injects
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
