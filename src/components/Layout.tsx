/**
 * Layout.tsx - App shell with collapsible sidebar navigation.
 *
 * Renders the Redline logo, nav buttons (Dashboard, Scenarios, Live Session, Report,
 * Settings), a pulsing red indicator for active sessions, and a session status pill.
 * On mobile (< md), the sidebar collapses to icon-only width (w-14).
 */

import { useStore } from "@/store";
import {
  LayoutDashboard, BookOpen, PlayCircle, FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { View } from "@/types";

function RedlineMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="rgb(var(--rtr-base))" />
      <line x1="3" y1="23" x2="10" y2="23" stroke="#E82222" strokeWidth="2.5" strokeLinecap="round" />
      <polyline points="10,23 15,8 20,23" stroke="#E82222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="20" y1="23" x2="29" y2="23" stroke="#E82222" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="15" cy="8" r="2.5" fill="#E82222" />
    </svg>
  );
}

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
      <aside className="w-14 md:w-56 flex flex-col bg-rtr-sidebar border-r border-rtr-border shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-rtr-border">
          <RedlineMark className="w-7 h-7 shrink-0" />
          <div className="hidden md:flex flex-col leading-tight">
            <span className="brand-glow text-base">REDLINE</span>
            <span className="text-[8px] text-rtr-dim tracking-[0.35em] uppercase">Crisis Simulation</span>
          </div>
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
                <span className="hidden md:inline">{label}</span>
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
          <div className="px-2 md:px-4 py-3 border-t border-rtr-border">
            <button onClick={() => setView("runner")} className="w-full text-left hidden md:block">
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
