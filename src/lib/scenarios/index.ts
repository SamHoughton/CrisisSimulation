/**
 * scenarios/index.ts — Built-in scenario registry.
 *
 * Each scenario lives in its own file so large decision trees remain
 * maintainable. Add new scenarios here and they'll appear in the library
 * automatically.
 *
 * Scenario naming convention:
 *   INCIDENT_TIER  e.g. RANSOMWARE_STRATEGIC, DEEPFAKE_TACTICAL
 *
 * Tier definitions:
 *   STRATEGIC - Executive / C-suite audience (CEO, CFO, CLO, CCO, Board)
 *   TACTICAL  - Management / coordination layer (CISO, COO, CTO, HR, Comms)
 */
import type { Scenario } from "@/types";
import { RANSOMWARE_EXECUTIVE_SCENARIO } from "./ransomware-executive";
import { RANSOMWARE_TECHNICAL_SCENARIO } from "./ransomware-technical";
import { DEEPFAKE_SCENARIO } from "./deepfake";

export const BUILT_IN_TEMPLATES: Scenario[] = [
  RANSOMWARE_EXECUTIVE_SCENARIO,
  RANSOMWARE_TECHNICAL_SCENARIO,
  DEEPFAKE_SCENARIO,
];
