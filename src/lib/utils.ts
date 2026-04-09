import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  CEO:      "bg-purple-500/20 text-purple-300",
  CFO:      "bg-blue-500/20 text-blue-300",
  CISO:     "bg-red-500/20 text-red-300",
  CLO:      "bg-slate-500/20 text-slate-300",
  CCO:      "bg-pink-500/20 text-pink-300",
  COO:      "bg-indigo-500/20 text-indigo-300",
  CTO:      "bg-cyan-500/20 text-cyan-300",
  BOARD_REP:"bg-amber-500/20 text-amber-300",
  HR_LEAD:  "bg-green-500/20 text-green-300",
  CUSTOM:   "bg-zinc-500/20 text-zinc-300",
};

export const ALL_ROLES = [
  "CEO","CFO","CISO","CLO","CCO","COO","CTO","BOARD_REP","HR_LEAD",
] as const;

export const ALL_SCENARIO_TYPES = [
  "RANSOMWARE","DATA_BREACH","INSIDER_THREAT","SUPPLY_CHAIN",
  "DDOS","REGULATORY_INVESTIGATION","SOCIAL_MEDIA_CRISIS",
  "INFRASTRUCTURE_OUTAGE","CUSTOM",
] as const;
