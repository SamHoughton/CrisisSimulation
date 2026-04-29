/**
 * Layout.tsx - App shell with collapsible sidebar navigation.
 *
 * Renders the Crucible logo, nav buttons (Dashboard, Scenarios, Live Session, Report,
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

function CrucibleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 68" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 14 12 L 21 54 Q 21 58 25 58 L 39 58 Q 43 58 43 54 L 50 12 Z"
        stroke="#1db86a" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"
      />
      <line x1="9"  y1="13" x2="55" y2="13" stroke="#1db86a" strokeWidth="4" strokeLinecap="round"/>
      <line x1="5"  y1="8"  x2="13" y2="16" stroke="#1db86a" strokeWidth="4" strokeLinecap="round"/>
      <line x1="59" y1="8"  x2="51" y2="16" stroke="#1db86a" strokeWidth="4" strokeLinecap="round"/>
      <line x1="27" y1="47" x2="27" y2="55" stroke="#1db86a" strokeWidth="2.5" strokeLinecap="round" opacity={0.45}/>
      <line x1="32" y1="49" x2="32" y2="57" stroke="#1db86a" strokeWidth="2.5" strokeLinecap="round" opacity={0.7}/>
      <line x1="37" y1="47" x2="37" y2="55" stroke="#1db86a" strokeWidth="2.5" strokeLinecap="round" opacity={0.45}/>
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
    <div className="flex h-screen overflow-hidden bg-crux-base">
      {/* Sidebar */}
      <aside className="w-14 md:w-56 flex flex-col bg-crux-surface border-r border-crux-border shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-crux-border">
          <CrucibleMark className="w-7 h-7 shrink-0" />
          <div className="hidden md:flex flex-col leading-tight">
            <span className="brand-wordmark text-base">
              <span className="brand-accent">C</span>RUCIBLE
            </span>
            <span className="text-[8px] text-crux-dim tracking-[0.35em] uppercase">Crisis Simulation</span>
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
                    ? "bg-crux-green/8 text-crux-green font-medium"
                    : "text-crux-muted hover:bg-crux-elevated hover:text-crux-text"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">{label}</span>
                {hasLive && (
                  <span className="ml-auto flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-crux-red opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-crux-red" />
                  </span>
                )}
                {active && !hasLive && (
                  <span className="ml-auto w-1 h-3.5 rounded-full bg-crux-green/60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Session status pill */}
        {session && session.status !== "ended" && (
          <div className="px-2 md:px-4 py-3 border-t border-crux-border">
            <button onClick={() => setView("runner")} className="w-full text-left hidden md:block">
              <div className="flex items-center gap-2 mb-1">
                {session.status === "active" && (
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crux-red opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-crux-red" />
                  </span>
                )}
                <span className="text-xs font-medium text-crux-text truncate">
                  {session.scenario.title}
                </span>
              </div>
              <p className="text-xs text-crux-dim capitalize">
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
