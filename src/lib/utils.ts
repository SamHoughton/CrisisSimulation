/**
 * utils.ts - Shared utility functions and lookup tables.
 *
 * Contains:
 * - cn(): Tailwind class merging (clsx + tailwind-merge)
 * - makeId(): Random ID generation for scenarios/sessions
 * - formatElapsed/formatDuration: Time formatting helpers
 * - Label maps: scenario types, difficulties, roles → display names and colours
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution (e.g. "p-2" + "p-4" → "p-4"). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function formatElapsed(startedAt: string): string {
  const s = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function formatDuration(min: number) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export const SCENARIO_TYPE_LABELS: Record<string, string> = {
  RANSOMWARE: "Ransomware",
  DATA_BREACH: "Data Breach",
  INSIDER_THREAT: "Insider Threat",
  SUPPLY_CHAIN: "Supply Chain Attack",
  DDOS: "DDoS",
  REGULATORY_INVESTIGATION: "Regulatory Investigation",
  SOCIAL_MEDIA_CRISIS: "Social Media Crisis",
  INFRASTRUCTURE_OUTAGE: "Infrastructure Outage",
  CUSTOM: "Custom",
};

export const DIFFICULTY_LABEL: Record<string, string> = {
  LOW: "Low", MEDIUM: "Medium", HIGH: "High", CRITICAL: "Critical",
};

export const DIFFICULTY_COLOUR: Record<string, string> = {
  LOW:      "text-emerald-400 bg-emerald-500/15",
  MEDIUM:   "text-amber-400 bg-amber-500/15",
  HIGH:     "text-orange-400 bg-orange-500/15",
  CRITICAL: "text-red-400 bg-red-500/15",
};

export const ROLE_SHORT: Record<string, string> = {
  CEO: "CEO", CFO: "CFO", CISO: "CISO", CLO: "CLO",
  CCO: "CCO", COO: "COO", CTO: "CTO", BOARD_REP: "Board",
  HR_LEAD: "HR", CUSTOM: "Custom",
};

export const ROLE_LONG: Record<string, string> = {
  CEO: "Chief Executive Officer",
  CFO: "Chief Financial Officer",
  CISO: "Chief Information Security Officer",
  CLO: "Chief Legal Officer",
  CCO: "Chief Communications Officer",
  COO: "Chief Operating Officer",
  CTO: "Chief Technology Officer",
  BOARD_REP: "Board Representative",
  HR_LEAD: "HR Lead",
  CUSTOM: "Custom",
};

export const ROLE_COLOUR: Record<string, string> = {
  CEO:      "bg-purple-500/25 text-purple-600",
  CFO:      "bg-blue-500/25 text-blue-600",
  CISO:     "bg-red-500/25 text-red-600",
  CLO:      "bg-slate-500/25 text-slate-600",
  CCO:      "bg-pink-500/25 text-pink-600",
  COO:      "bg-indigo-500/25 text-indigo-600",
  CTO:      "bg-cyan-500/25 text-cyan-700",
  BOARD_REP:"bg-amber-500/25 text-amber-700",
  HR_LEAD:  "bg-green-500/25 text-green-700",
  CUSTOM:   "bg-zinc-500/25 text-zinc-600",
};

export const ALL_ROLES = [
  "CEO","CFO","CISO","CLO","CCO","COO","CTO","BOARD_REP","HR_LEAD",
] as const;

// ─── Exercise tier ────────────────────────────────────────────────────────────

export const TIER_LABEL: Record<string, string> = {
  STRATEGIC: "Strategic",
  TACTICAL:  "Tactical",
};

/** Short subtitle shown beneath the tier badge on the present screen */
export const TIER_SUBTITLE: Record<string, string> = {
  STRATEGIC: "Executive Level",
  TACTICAL:  "Management Level",
};

/**
 * Tailwind colour classes for tier badges.
 * bg: badge background  |  text: badge text  |  border: badge border
 */
export const TIER_COLOUR: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  STRATEGIC: { bg: "bg-amber-500/20", text: "text-amber-700", border: "border-amber-600/50", dot: "bg-amber-500" },
  TACTICAL:  { bg: "bg-sky-500/20",   text: "text-sky-700",   border: "border-sky-600/50",   dot: "bg-sky-500"   },
};

export const ALL_SCENARIO_TYPES = [
  "RANSOMWARE","DATA_BREACH","INSIDER_THREAT","SUPPLY_CHAIN",
  "DDOS","REGULATORY_INVESTIGATION","SOCIAL_MEDIA_CRISIS",
  "INFRASTRUCTURE_OUTAGE","CUSTOM",
] as const;
