/**
 * scenarios/index.ts — Built-in scenario registry.
 *
 * Each scenario lives in its own file so large decision trees remain
 * maintainable. Add new scenarios here and they'll appear in the library
 * automatically.
 */
import type { Scenario } from "@/types";
import { RANSOMWARE_SCENARIO } from "./ransomware";
import { DEEPFAKE_SCENARIO } from "./deepfake";
import { SUPPLY_CHAIN_SCENARIO } from "./supply-chain";
import { SOCIAL_MEDIA_CRISIS_SCENARIO } from "./social-media-crisis";
import { INFRASTRUCTURE_OUTAGE_SCENARIO } from "./infrastructure-outage";

export const BUILT_IN_TEMPLATES: Scenario[] = [
  RANSOMWARE_SCENARIO,
  DEEPFAKE_SCENARIO,
  SUPPLY_CHAIN_SCENARIO,
  SOCIAL_MEDIA_CRISIS_SCENARIO,
  INFRASTRUCTURE_OUTAGE_SCENARIO,
];
