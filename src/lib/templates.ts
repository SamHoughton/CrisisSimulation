/**
 * templates.ts - Built-in scenario templates.
 *
 * Two full 3-hour scenarios with deep branching decision trees and 4 score-routed endings each:
 *
 * 1. Ransomware: The Quiet Beacon (tpl-ransomware-001)
 *    - Fake company: Veridian Power plc (FTSE 250 UK energy retailer, 3.2M domestic supply contracts)
 *    - 19 injects, 7 decision points, hard convergence at the ransom chat window
 *    - Unique stake: the Priority Services Register (PSR) of 84,000 vulnerable customers
 *    - Regulators: NCSC + Ofgem under NIS Regulations 2018 (OES)
 *    - Artifacts: SIEM alerts, ransomware notes, slack thread, TV broadcast, legal letters
 *
 * 2. The Deepfake CEO (tpl-deepfake-001)
 *    - Fake company: Apex Dynamics (FTSE 250, 8,000 employees)
 *    - 20 injects, 7 decision points, 4 score-routed endings
 *    - Artifacts: viral tweets, news headlines, TV broadcasts, stock charts, legal letters
 *
 * Both scenarios share the same architecture: rank-scored options, recapLine/recapFragment
 * threading for the "your arc" prelude on ending injects, and interactive reflection votes
 * on the endings themselves. Template IDs are stable strings (not random) so they persist
 * correctly across app restarts and don't duplicate in the library.
 */

import type { Scenario } from "@/types";
import { makeId } from "@/lib/utils";

export const BUILT_IN_TEMPLATES: Scenario[] = [

  // ─── SCENARIO 1: RANSOMWARE - THE QUIET BEACON ───────────────────────────────
  //
  // Full 3-hour arc across 19 injects with 7 decision points. The graph has:
  //   - 4-way divergence at i1     (paths A/B/C/D each get their own narrative inject: i2a-i2d)
  //   - Re-convergence at i2v      (first external escalation call - 4 options)
  //   - Narrative convergence at i3 (bulk encryption + PSR exposure - 4 options)
  //   - Re-convergence at i3d      (brief order: staff/customers/counterparties/investors)
  //   - Re-convergence at i4       (opening posture for the negotiation - 4 options)
  //   - HARD CONVERGENCE at i4v    (the chat window - every path arrives here)
  //   - Re-convergence at i5       (the counter offer - 4 options)
  //   - Re-convergence at i6a      (two-fronts coupling decision - 4 options)
  //   - 2-way bridge to strong/weak narrative (i6-strong vs i6-weak)
  //   - Score-routed finale at i7  (4 endings keyed off compound rank average)
  //   - 4 distinct interactive endings (end1=triumph, end2=recovery, end3=diminished, end4=catastrophic)
  //
  // Every decision inject has exactly 4 options. Each option has an optional
  // rank field (1 = best) used by the score-routed finale and surfaced to the
  // facilitator after reveal. Endings are themselves decision points with
  // unranked reflection votes - one final introspective choice closes the arc.
  //
  // Setting: Veridian Power plc, a FTSE 250 UK energy retailer designated as
  // an Operator of Essential Services under the NIS Regulations 2018. The
  // unique data at stake is the Priority Services Register: a statutory list
  // of vulnerable customers who depend on uninterrupted power for medical
  // equipment, dialysis, and oxygen. The threat actor is ALPHV.
  {
    id: "tpl-ransomware-001",
    title: "Ransomware: The Quiet Beacon",
    description:
      "A single low-confidence outbound DNS beacon at 03:14 from a treasury workstation grows over five days into the worst week in Veridian Power's history. Branching 19-inject arc with 4 score-routed endings. Every path converges at the ransom chat window. Tests detection, escalation, ransom negotiation, regulator handling, and the protection of the Priority Services Register from the first quiet alert to long-term recovery.",
    type: "RANSOMWARE",
    difficulty: "CRITICAL",
    durationMin: 180,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-10T00:00:00Z",
    coverGradient: "135deg, #050508 0%, #1a0008 40%, #E82222 100%",
    roles: ["CEO", "CISO", "CFO", "CLO", "CCO", "COO"],
    briefing:
      "You are the executive leadership team of Veridian Power plc, a FTSE 250 UK energy retailer with 3.2 million domestic supply contracts and a designated Operator of Essential Services under the NIS Regulations 2018. Your back-office runs the day-ahead wholesale trading desk; your front-office holds the Priority Services Register - the statutory list of vulnerable customers who depend on uninterrupted power for medical equipment, dialysis, and oxygen. It is 03:14 on a Monday. The duty SOC analyst flags a single anomaly. Over the next five days you will discover what it really was. You will be judged on what you did at 03:14, and on every call after.",

    injects: [

      // ── ACT 1: THE QUIET BEACON ────────────────────────────────────────
      // Four-way opening branch. Each option leads to a narrative inject
      // that plays out the consequences before re-converging at rw-i2v.

      // ── INJECT 1: 03:14 - The first low-confidence alert ──────────────
      {
        id: "rw-i1",
        order: 0,
        title: "Defender Alert: Outbound Beacon, Treasury Workstation",
        body: "03:14. Microsoft Defender for Endpoint fires a low-confidence alert: a single workstation in the Treasury team is making periodic outbound DNS lookups to a domain that resolved earlier today and again 47 minutes ago. The lookups are 3 minutes apart, regular as a clock. The workstation belongs to a senior treasury analyst who is asleep at home. SOC has 2 analysts on duty. The night shift lead asks: do we wake people, or do we open a ticket?",
        facilitatorNotes:
          "This IS the first sign of an ALPHV intrusion via a phished VPN credential five days ago. The attacker is presently mapping the OT/IT boundary and staging exfiltration. Option A (quiet forensic capture) is the rewarded answer - it preserves intelligence without tipping the attacker. Option C is a strong second-best. Option B is loud and effective but burns the intelligence advantage. Option D is the catastrophic call - this is exactly how every major ransomware after-action report begins.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Energy regulator Ofgem reviewing cyber resilience standards for retail suppliers - week ahead",
        artifact: {
          type: "siem_alert",
          siemAlertId: "DEFENDER-2026-44912",
          siemSeverity: "MEDIUM",
          siemSourceIp: "10.42.18.71 (TREASURY-LDN-019)",
          siemEventType: "Periodic Outbound DNS - Low-Reputation Domain - Single Host",
        },
        isDecisionPoint: true,
        targetRoles: ["CISO", "COO"],
        expectedKeywords: ["forensic", "isolate", "image", "capture", "Mandiant", "false positive"],
        recapLine: "opened with {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Quiet investigate: pull a forensic image of the workstation, leave the network connection up to keep watching",
            consequence:
              "The image captures the staging directory before the attacker notices. By 06:00 you know exactly which credentials are compromised and which segments have been touched. You have controlled the tempo.",
            rank: 1,
            recapFragment: "a quiet forensic capture",
          },
          {
            key: "B",
            label: "Hard segment: kill the workstation, sweep all adjacent endpoints, lock down the treasury VLAN",
            consequence:
              "The attacker sees the lights go out and accelerates encryption on the adjacent file servers they had already staged. You stopped one host but burned the chance to learn the full picture quietly.",
            rank: 2,
            recapFragment: "a hard segment of the treasury VLAN",
          },
          {
            key: "C",
            label: "Escalate to Mandiant on retainer immediately - pay the after-hours fee, wake the CISO",
            consequence:
              "Mandiant are on the phone in 18 minutes and on-site by 06:30. They confirm the beacon is real and find two more compromised endpoints by sunrise. The clock is preserved.",
            rank: 2,
            recapFragment: "an immediate Mandiant escalation",
          },
          {
            key: "D",
            label: "Open a Sev-3 ticket, leave it for the morning shift, mark the alert as probable false positive",
            consequence:
              "By 07:30 the morning shift has 14 alerts and this one is buried. By 04:11 tomorrow morning, you will be reading a ransom note. This is how every catastrophic ransomware retrospective begins.",
            rank: 4,
            recapFragment: "treating it as a probable false positive",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "rw-i2a" },
          { optionKey: "B", nextInjectId: "rw-i2b" },
          { optionKey: "C", nextInjectId: "rw-i2c" },
          { optionKey: "D", nextInjectId: "rw-i2d" },
        ],
      },

      // ── INJECT 2a: Path A narrative - The Slow Trace ───────────────────
      {
        id: "rw-i2a",
        order: 10,
        title: "Path A: The Slow Trace",
        body: "05:30. The forensic image is yielding gold. Your second-line analyst has reconstructed the attacker's lateral movement: a phished VPN credential belonging to a treasury contractor was used five days ago to plant a foothold. The attacker has touched 11 hosts, including one jump box on the boundary between IT and the wholesale trading desk. They have not yet reached the customer billing systems or the Priority Services Register database. Mandiant are now en route, called as a courtesy not a panic. You have something most ransomware victims never get: time.",
        facilitatorNotes:
          "This is the rewarded outcome of Option A. The team has knowledge advantage. The pressure now is whether they can resist the temptation to act loudly and instead complete the picture before moving. The next inject (rw-i2v) tests their first external escalation call.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "Power trading volumes light overnight as wholesale market opens calmly",
        artifact: {
          type: "default",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "COO"],
        expectedKeywords: ["lateral movement", "VPN", "credential", "PSR", "trading"],
      },

      // ── INJECT 2b: Path B narrative - The Segment Sweep ────────────────
      {
        id: "rw-i2b",
        order: 10,
        title: "Path B: The Segment Sweep",
        body: "04:02. The treasury VLAN is dark. Your sweep has found two more endpoints with the same beacon, both on the wholesale trading floor's back-office. Defender lights up at 04:09 with a new alert from a different segment - a file server in the customer billing tier. The attacker noticed. They are accelerating. You have stopped one host but you can hear the fire spreading through the walls. Mandiant have been called and are 90 minutes out.",
        facilitatorNotes:
          "Consequence of Option B - fast and effective but it surrendered the intelligence advantage. The team has lost the chance to map the full intrusion quietly. They are now in a race. Drive home that loud containment has costs that don't appear in textbook playbooks.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "Power trading volumes light overnight as wholesale market opens calmly",
        artifact: {
          type: "siem_alert",
          siemAlertId: "DEFENDER-2026-44919",
          siemSeverity: "HIGH",
          siemSourceIp: "10.51.2.118 (BILLING-FILE-04)",
          siemEventType: "Suspicious File Activity - Encryption Pattern - Adjacent Segment",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "COO"],
        expectedKeywords: ["segment", "spread", "billing", "race", "Mandiant"],
      },

      // ── INJECT 2c: Path C narrative - The Clean Escalation ─────────────
      {
        id: "rw-i2c",
        order: 10,
        title: "Path C: The Clean Escalation",
        body: "06:30. Mandiant arrived 12 minutes ago. Their first call: 'You did the right thing. This is real, it is active, and you have caught it before encryption.' Their second call, 18 minutes later: two further compromised endpoints found, both on the trading floor back-office. No sign of compromise in the customer billing tier or the PSR database - yet. The attacker still does not know they have been seen. You bought the right thing with the after-hours fee: time, and a partner who has done this 400 times.",
        facilitatorNotes:
          "Reward for Option C. Slightly less intelligence advantage than Option A (Mandiant moves at Mandiant's pace) but with an external partner already engaged, which materially de-risks every later decision. The team has paid for this with the retainer call-out fee - which the CFO should be watching closely.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "Power trading volumes light overnight as wholesale market opens calmly",
        artifact: {
          type: "default",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "COO"],
        expectedKeywords: ["Mandiant", "engaged", "trading", "billing", "PSR"],
      },

      // ── INJECT 2d: Path D narrative - The Second Alert ─────────────────
      {
        id: "rw-i2d",
        order: 10,
        title: "Path D: The Second Alert",
        body: "Tuesday, 04:11. 25 hours after the first beacon. The morning shift's 14:00 SOC handover yesterday flagged the closed ticket as 'probable false positive' and moved on. Defender is now firing simultaneously across 18 endpoints on three segments. A junior analyst calls the CISO at home: 'It's bad. There's a note on one of them.' The note begins: 'Veridian Power. We've been inside for six days. We have the PSR database. We have your wholesale trading book. You have 72 hours.' Mandiant are being called, the CEO is being called, and the morning markets are opening in two hours.",
        facilitatorNotes:
          "Brutal consequence of Option D. The team is now 25 hours behind with no intelligence advantage, no forensic baseline, and the attacker holds all the cards including the PSR. This path exists to make the lesson visceral: the easy call at 03:14 becomes the impossible call at 04:11 the next day. The team should feel the weight as they advance into rw-i2v.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "Trading desks open: gas/power forwards quiet, no major news",
        artifact: {
          type: "ransomware_note",
          ransomAmount: "$9.4M",
          ransomDeadlineHours: 72,
          ransomWalletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "CEO", "COO"],
        expectedKeywords: ["note", "PSR", "trading book", "72 hours", "missed"],
      },

      // ── INJECT 2v: CONVERGENCE - The First External Call ───────────────
      {
        id: "rw-i2v",
        order: 20,
        title: "The First Call",
        body: "Whatever path you took to get here, you are now standing in the same room. The CISO has confirmed: this is real, it is active, and the attacker has at minimum touched the boundary between IT and the wholesale trading systems. The Priority Services Register database may or may not be in scope - you do not yet know. The CEO is on the line and has one question: 'Who do we call first?' This is not a procedural question. It is a tone-setting question for the next five days.",
        facilitatorNotes:
          "Under NIS Regs 2018, as a designated OES the company has a 72-hour notification obligation to NCSC for any incident with a significant impact on continuity of essential services. Ofgem is the sector regulator and will need to be told eventually but is not the first call. Calling NCSC first sets a cooperative tone that pays dividends across the rest of the exercise. Calling the board chair first is defensible but slower. Calling the CFO+CEO consortium first is internal-focused and arguably premature. Calling Ofgem first inverts the chain of command.",
        delayMinutes: 0,
        timerMinutes: 8,
        tickerHeadline: "Energy retailers face 'cyber resilience year' as Ofgem raises NIS reporting bar",
        artifact: {
          type: "default",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CISO", "CLO"],
        expectedKeywords: ["NCSC", "NIS", "Ofgem", "72 hours", "OES", "board"],
        recapLine: "made the first call to {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "NCSC first - file the NIS-mandated notification, ask for technical support, lock in the cooperative posture",
            consequence:
              "NCSC respond within 40 minutes with a named incident handler. The notification clock is honoured. Ofgem will later note the proactive escalation as evidence of good NIS culture.",
            rank: 1,
            recapFragment: "NCSC under NIS Regs",
          },
          {
            key: "B",
            label: "Board chair first - this is a governance moment and the chair must own the room from the start",
            consequence:
              "Defensible but slow. The chair is on holiday in Italy and is reachable in 90 minutes. Meanwhile the technical clock keeps running. Notification to NCSC happens at hour 4 instead of hour 1.",
            rank: 3,
            recapFragment: "the board chair",
          },
          {
            key: "C",
            label: "CFO and CEO consortium - lock down the financial and trading exposure before anything goes external",
            consequence:
              "A logical instinct under attack but it consumes 90 minutes of internal pre-meeting before any regulator is told. The notification clock is now stressed. Internal alignment is high; external posture is set late.",
            rank: 2,
            recapFragment: "the internal CFO/CEO consortium",
          },
          {
            key: "D",
            label: "Ofgem first - the sector regulator should hear it from you before NCSC routes it through the wires",
            consequence:
              "Ofgem appreciate the call but politely tell you that under NIS the first call is to NCSC. You have inverted the chain of command. Ofgem note this in their later assessment.",
            rank: 3,
            recapFragment: "Ofgem ahead of NCSC",
          },
        ],
      },

      // ── INJECT 3: Bulk encryption + PSR exposure ───────────────────────
      {
        id: "rw-i3",
        order: 30,
        title: "04:11 - Bulk Encryption Event",
        body: "Whatever you knew at 03:14, you now know this: at 04:11 a coordinated encryption event hit 217 servers across the back-office estate. Confirmed encrypted: customer billing, the wholesale trading book reconciliation system, payroll, and - this is the one that matters - a read-replica of the Priority Services Register. The PSR holds the names, addresses, medical conditions and emergency contacts of 84,000 vulnerable customers. The replica was last synced at 01:00. Mandiant assess that the master is intact but the replica was almost certainly exfiltrated before encryption. The lights are still on for customers. For now.",
        facilitatorNotes:
          "The PSR is the unique cruelty of an energy-sector breach. Unlike a financial breach, the data is not just sensitive - it is the data the company holds because the customers are vulnerable. The team must now make a containment vs continuity call with this in the back of their minds. The 'lights are still on' line is critical: this is not yet a power outage incident, it is a data and systems incident. That distinction is what stops the COBR call.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "BREAKING: Major UK energy retailer reportedly hit by overnight cyber incident - supply unaffected",
        artifact: {
          type: "ransomware_note",
          ransomAmount: "$9.4M",
          ransomDeadlineHours: 72,
          ransomWalletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        },
        isDecisionPoint: true,
        targetRoles: ["CISO", "COO", "CEO"],
        expectedKeywords: ["PSR", "vulnerable", "containment", "wholesale", "lights on", "ICO"],
        recapLine: "answered the encryption by {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Aggressive containment: shut down all back-office systems, run wholesale trading on the manual fallback book",
            consequence:
              "Spread halted. Trading desk reverts to phone-and-spreadsheet for the day. Estimated £1.8M in suboptimal hedging but the attacker is locked out cleanly. PSR replica is preserved as forensic evidence.",
            rank: 1,
            recapFragment: "aggressive containment with manual trading fallback",
          },
          {
            key: "B",
            label: "Selective containment: protect customer billing and the PSR master, let trading run on the affected systems",
            consequence:
              "Trading desk continues. The attacker re-encrypts a second tranche of trading reconciliation files at 06:30. The selective approach has bought 2 hours of trading at the cost of giving the attacker a second bite.",
            rank: 3,
            recapFragment: "selective containment that kept trading live",
          },
          {
            key: "C",
            label: "Full systems-wide shutdown - including customer-facing - until Mandiant gives the all-clear",
            consequence:
              "Customer self-service portal goes dark. 740,000 customers get an error page in the first hour. Trading desk goes manual. Spread halted. The reputational cost of the dark portal will arrive within 6 hours.",
            rank: 2,
            recapFragment: "a full systems-wide shutdown",
          },
          {
            key: "D",
            label: "Hold and observe - let Mandiant complete their forensic loop before any large containment move",
            consequence:
              "Encryption continues to spread for another 90 minutes. By 05:45 the trading book reconciliation is unrecoverable from production. Mandiant arrive to find a worse situation than they were briefed on.",
            rank: 4,
            recapFragment: "holding and observing while the encryption spread",
          },
        ],
      },

      // ── INJECT 3d: 09:00 - The Times Has The Story ─────────────────────
      {
        id: "rw-i3d",
        order: 40,
        title: "09:00 - The Times Has The Story",
        body: "09:00. A reporter from The Times has emailed the press office with three specific facts: the time of the encryption event, the dollar figure on the ransom note, and the phrase 'Priority Services Register'. They are filing in 90 minutes. Internally: 3,200 staff are arriving at offices across the country with no email; the trading desk is on phones; the customer call centre is at 4x normal volume on what they are hearing on social media. Three groups need a brief in the next hour: staff, customers, and the day-ahead wholesale market counterparties. You can only properly brief one of them first. Which?",
        facilitatorNotes:
          "Brief order is a values question. Staff-first is the morally instinctive answer and probably the right one - your people are scared and on the phones. Customers-first is the regulatory and reputational answer - the vulnerable cohort especially. Counterparties-first is the market-integrity answer - your trading book is exposed and they will find out from Reuters anyway. Investors-first is the cold-blooded option that some will defend on disclosure grounds. There is no 'right' answer here, only a values-revealing one. The point is they are forced to choose.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "The Times says it will publish: 'UK energy retailer faces ransomware demand or PSR leak'",
        artifact: {
          type: "email",
          emailFrom: "n.curtis@thetimes.co.uk",
          emailTo: "press@veridianpower.co.uk",
          emailSubject: "The Times: request for comment - cyber incident, ransom note, Priority Services Register exposure",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CCO", "CLO"],
        expectedKeywords: ["staff", "customers", "vulnerable", "counterparties", "Times", "holding statement"],
        recapLine: "briefed in the order of {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Staff first - all-hands at 09:30, before the Times story drops, with the unvarnished truth",
            consequence:
              "Staff trust is preserved. The story leaks slightly through Slack screenshots but the company has shown that its people come first. Customer call centre staff handle the inbound noise with dignity because they were told first.",
            rank: 1,
            recapFragment: "staff first",
          },
          {
            key: "B",
            label: "Customers first - statement on the website and an SMS to the PSR cohort confirming services are unaffected",
            consequence:
              "Defensible and noble - vulnerable customers are reassured. But staff find out via a Times push notification on their phones during the all-hands they thought was about something else. Internal trust takes a real hit.",
            rank: 2,
            recapFragment: "customers and the PSR cohort first",
          },
          {
            key: "C",
            label: "Counterparties first - call the wholesale market makers and the Bank of England before the FT clears its throat",
            consequence:
              "Market integrity is preserved. Two counterparties pull back from the day-ahead auction; the auction clears 4% wider than yesterday. Staff and customers find out from the news. The Treasury Select Committee notes the prioritisation.",
            rank: 3,
            recapFragment: "wholesale counterparties first",
          },
          {
            key: "D",
            label: "Investors first - call the top 5 institutional shareholders before any other group gets a brief",
            consequence:
              "Cold-blooded but disclosure-defensible. Two of the five leak the call to the FT within 20 minutes. Staff and customers find out fourth. The narrative becomes 'Veridian briefed the City before its own people'.",
            rank: 4,
            recapFragment: "the top institutional shareholders first",
          },
        ],
      },

      // ── INJECT 4: 14:30 - The Note Arrives ─────────────────────────────
      {
        id: "rw-i4",
        order: 50,
        title: "14:30 - The Note Arrives",
        body: "14:30. The full ransom note has been delivered through the encrypted-files window on a recovered workstation. The threat actor is ALPHV. They want $9.4M in Bitcoin within 48 hours. They have attached a 200-row sample of the Priority Services Register and a 14-row sample of the wholesale trading book. The PSR sample includes a name, address, medical condition (oxygen dependence) and emergency contact for a customer in Carlisle. Mandiant confirm the sample is authentic. Beazley, your cyber insurer, are on a Teams call asking what your opening posture is. The CFO has just confirmed that the company has the cash - just - to pay the demand without breaching its covenants.",
        facilitatorNotes:
          "The opening posture is not the same as the final decision. This is the question of how you walk into the negotiation room. Refuse-and-restore is the orthodox answer but it takes 5-9 days and the PSR is in play. Stall to investigate buys time but the clock is hard. Negotiate in good faith opens the door. Pay immediately is the catastrophic-instinct answer that some will defend if the PSR cohort is foregrounded. CRUCIAL: the convergence in rw-i4v is the same regardless of the choice here - the chat window WILL open.",
        delayMinutes: 0,
        timerMinutes: 14,
        tickerHeadline: "Veridian Power confirms cyber incident: 'investigation ongoing, supply unaffected, customer data may be impacted'",
        artifact: {
          type: "ransomware_note",
          ransomAmount: "$9.4M",
          ransomDeadlineHours: 48,
          ransomWalletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CFO", "CLO", "CISO"],
        expectedKeywords: ["ALPHV", "PSR", "ransom", "Beazley", "OFAC", "negotiate", "refuse"],
        recapLine: "took the opening posture of {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Refuse to engage - announce internally that we are not paying, focus 100% on restoration and notification",
            consequence:
              "Clean moral and legal posture. Restoration timeline 5-9 days. The PSR sample will be published; you will need to call the Carlisle customer in person before they read about themselves online. The CCO turns pale.",
            rank: 1,
            recapFragment: "refuse-to-engage",
          },
          {
            key: "B",
            label: "Stall - open a chat to buy 24 hours of investigation time, do not commit to anything",
            consequence:
              "ALPHV respond in 11 minutes. They are practised at this and will give you exactly 24 hours and not a minute more. The clock is now hard. Mandiant warn you that ALPHV's 'good faith' is a polished routine.",
            rank: 2,
            recapFragment: "a 24-hour stall",
          },
          {
            key: "C",
            label: "Negotiate in good faith - engage Coveware, target a 60% reduction, retain the right to walk",
            consequence:
              "Coveware engaged. The negotiation begins. ALPHV accept the engagement and counter at $7.8M. The conversation is now real. The OFAC sanctions risk is being assessed in parallel by external counsel.",
            rank: 3,
            recapFragment: "good-faith negotiation via Coveware",
          },
          {
            key: "D",
            label: "Pay the demand in full immediately to protect the PSR cohort and end the extortion clock",
            consequence:
              "Beazley refuse to authorise the payment under the policy until OFAC clearance. The CFO authorises a bridge from corporate cash. Decryption keys will work on 60% of files. The PSR will be published anyway - the actor has already mirrored it on three forums.",
            rank: 4,
            recapFragment: "immediate payment in full",
          },
        ],
      },

      // ── INJECT 4v: HARD CONVERGENCE - The Chat Window ──────────────────
      // This is the convergence inject - every path through the scenario
      // arrives here regardless of opening posture in rw-i4. The decision
      // is operational: who runs the negotiation.
      {
        id: "rw-i4v",
        order: 60,
        title: "15:42 - The Chat Window",
        body: "15:42. Whatever your opening posture, the chat window is now open. There is no path through this scenario that does not pass through this room. ALPHV have a live operator on the other end. They are professional. They have done this 200 times. They have your PSR sample mirrored to three forums and a 24-hour countdown clock posted on their leak site. The question now is not whether to talk - it is who runs the conversation. The wrong person on the keyboard can cost millions and lives.",
        facilitatorNotes:
          "Convergence inject - the room everyone ends up in regardless of their opening choice. Operational decision. Mandiant-only is the orthodox answer because they have done this hundreds of times and have OFAC-aware playbooks. CISO with Mandiant coaching is the second-best, useful if there is a relationship-management angle. Coveware specialise in negotiation and have the best price outcomes but worst forensic integration. Refuse the chat and walk is brave but means the PSR publishes in 24 hours guaranteed.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "ALPHV leak site posts countdown: 'Veridian Power - PSR drop in 24 hours unless payment received'",
        artifact: {
          type: "slack_thread",
          slackChannel: "#ir-warroom",
          slackMessages: [
            { author: "Mandiant Lead", role: "External IR", time: "15:38", text: "Chat window is live. They have your PSR sample staged on three mirrors. They will publish in 24h regardless of opening posture if we don't engage." },
            { author: "Sarah K.", role: "CISO", time: "15:40", text: "Who's on the keyboard? We can't have a panicked junior on this." },
            { author: "Mandiant Lead", role: "External IR", time: "15:41", text: "Three options on the table. We need an answer in 5 minutes. They're already typing." },
            { author: "James M.", role: "CFO", time: "15:42", text: "Whoever it is - they need to know the OFAC line. ALPHV are not on the SDN list yet but it's a daily risk." },
          ],
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CISO", "CLO", "CFO"],
        expectedKeywords: ["Mandiant", "Coveware", "OFAC", "negotiation", "keyboard", "PSR"],
        recapLine: "ran the negotiation by putting {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Mandiant-only on the keyboard - they have the OFAC playbook, the technical depth, and the script",
            consequence:
              "Mandiant take over. Their first message is calibrated: it acknowledges receipt without conceding intent. ALPHV recognise the cadence and respond formally. The conversation is now between professionals.",
            rank: 1,
            recapFragment: "Mandiant alone on the keyboard",
          },
          {
            key: "B",
            label: "CISO at the keyboard with Mandiant coaching live - keeps internal accountability",
            consequence:
              "The CISO writes, Mandiant proofread. The cadence is slower but the internal ownership is preserved. ALPHV note the pacing change but continue. This is workable but slower.",
            rank: 2,
            recapFragment: "the CISO under Mandiant coaching",
          },
          {
            key: "C",
            label: "Engage Coveware as third-party negotiators - they specialise in price reduction",
            consequence:
              "Coveware bring a stronger price record but a weaker forensic integration. Mandiant flag the handoff risk. ALPHV recognise Coveware and immediately tighten their position - they know Coveware's playbook too.",
            rank: 3,
            recapFragment: "Coveware specialist negotiators on the keys",
          },
          {
            key: "D",
            label: "Refuse to engage in the chat - close the window, focus on restoration and notification",
            consequence:
              "Brave. The window closes. ALPHV's countdown clock continues to tick. The PSR will publish in 24 hours unless something changes. Mandiant's tone shifts: 'We respect the call. Let's get the Carlisle customer on the phone now.'",
            rank: 4,
            recapFragment: "no one on the keys",
          },
        ],
      },

      // ── INJECT 5: Day 3 - The Counter ──────────────────────────────────
      {
        id: "rw-i5",
        order: 70,
        title: "Day 3, 11:00 - The Counter",
        body: "Day 3, 11:00. The negotiation has been running for 19 hours. Whoever is on the keyboard has now received ALPHV's counter: $6.2M, with a 12-hour fuse and a written commitment - in chat - that the PSR will be deleted from all mirrors and that no public leak will occur. Mandiant rate the deletion commitment at 'low credibility'. The OFAC team have cleared ALPHV as not currently on the SDN list, but warn that the list is reviewed weekly. Beazley have agreed to cover up to $4M of any payment, conditional on OFAC clearance and Coveware sign-off. Restoration is 60% complete. The PSR master is intact. The replica is in the attacker's hands.",
        facilitatorNotes:
          "The counter-offer is the moment the team has to make a real money call with real moral stakes. Lowball back is the strongest negotiating posture but it commits to engagement. Stall is the best 'do no harm' answer but burns the 12-hour fuse. Escalate to OFAC walks the line of public disclosure. Pay the counter is the path of least resistance and the worst rank.",
        delayMinutes: 0,
        timerMinutes: 14,
        tickerHeadline: "Reuters: 'Veridian Power in active ransom negotiation - sources put demand near $9M'",
        artifact: {
          type: "default",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CFO", "CLO", "CISO"],
        expectedKeywords: ["counter", "Beazley", "OFAC", "lowball", "stall", "PSR deletion"],
        recapLine: "answered the counter by {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Lowball back - $2.4M, conditional on independent third-party deletion verification",
            consequence:
              "ALPHV laugh in chat (literally - 'lol') and counter at $5.4M. The negotiation continues. Coveware rate the position as 'aggressive but respected'. The 12-hour fuse extends informally to 18 hours.",
            rank: 1,
            recapFragment: "a $2.4M lowball with verification conditions",
          },
          {
            key: "B",
            label: "Stall for 6 more hours, claim board approval is needed, use the time to push restoration",
            consequence:
              "The fuse contracts to 6 hours. Mandiant get an additional 12% of restoration done. ALPHV start to lose patience and post a fresh PSR sample to a fourth forum. The Carlisle customer's name appears on Reddit.",
            rank: 2,
            recapFragment: "a 6-hour board-approval stall",
          },
          {
            key: "C",
            label: "Escalate to OFAC and the FBI in writing - signal that any payment is under federal scrutiny",
            consequence:
              "OFAC acknowledge in writing. The FBI engage and ask for the chat transcript. ALPHV detect the increased noise around the negotiation and post the full PSR replica to their leak site at 16:20.",
            rank: 3,
            recapFragment: "OFAC and FBI escalation",
          },
          {
            key: "D",
            label: "Pay the $6.2M counter to end the clock and protect the PSR cohort",
            consequence:
              "Beazley cover $4M; Veridian bridge $2.2M from corporate cash. The decryption keys arrive and work on 60% of files. The PSR is mirrored to a fourth site within the hour. The deletion 'commitment' is broken before the wire clears.",
            rank: 4,
            recapFragment: "paying the $6.2M counter",
          },
        ],
      },

      // ── INJECT 6a: Day 3 - Two Fronts, One Hour ────────────────────────
      {
        id: "rw-i6a",
        order: 80,
        title: "Day 3, 16:30 - Two Fronts, One Hour",
        body: "16:30. Two letters arrive within ten minutes of each other. The first is from Beazley: their cyber claims division is querying whether the original VPN credential compromise stemmed from a known unpatched vulnerability in the third-party MFA appliance. It does. It was on the last pen test as 'medium, deferred'. If the exclusion bites, $4M of cover evaporates. The second is from Ofgem, formal under Schedule 4 of the NIS Regulations, requesting a full incident report within 14 days and signalling that an enforcement notice is 'under active consideration'. The CLO has a single hour to decide how to couple - or decouple - these two responses. They are linked by the same governance question: did the company know?",
        facilitatorNotes:
          "Strategic coupling decision. Couple them and disclose proactively to both is the strongest posture - it builds a coherent narrative. Decouple and fight Beazley on the exclusion is technically defensible but risky. Engage Ofgem fully and stall Beazley is the regulator-first instinct that some will defend. Try to settle Beazley quietly while building the Ofgem submission is the worst path - if Ofgem find out about the side-deal it becomes a separate breach of cooperative duties.",
        delayMinutes: 0,
        timerMinutes: 14,
        tickerHeadline: "Ofgem 'actively considering enforcement' against Veridian Power under NIS Regulations",
        artifact: {
          type: "legal_letter",
          legalCaseRef: "OFGEM-NIS-2026-0117 / BEZ-CY-2026-0844",
          legalAuthority: "Office of Gas and Electricity Markets / Beazley Cyber Claims",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CFO", "CISO"],
        expectedKeywords: ["Ofgem", "Beazley", "NIS", "MFA", "exclusion", "couple", "disclose"],
        recapLine: "handled the two fronts by {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Couple and disclose: full proactive disclosure to both Beazley and Ofgem with the same evidence pack",
            consequence:
              "Coverage counsel engaged. Beazley acknowledge the disclosure and shift the conversation from exclusion to mitigation. Ofgem note the proactive posture. The single evidence pack saves 200 hours of legal work later.",
            rank: 1,
            recapFragment: "coupled disclosure to both Beazley and Ofgem",
          },
          {
            key: "B",
            label: "Decouple - fight Beazley on the exclusion, engage Ofgem cooperatively in parallel",
            consequence:
              "Two streams of legal work. Beazley initiate a formal coverage dispute. Ofgem inquiry continues cleanly. Total legal spend triples but the insurance dispute is preserved as a clean fight.",
            rank: 2,
            recapFragment: "decoupling the two fronts",
          },
          {
            key: "C",
            label: "Engage Ofgem fully, stall Beazley - the regulator matters more than the insurance",
            consequence:
              "Ofgem cooperative. Beazley feel sandbagged when they later discover the parallel disclosure - they harden their position. The exclusion bites for $4M and the relationship is over.",
            rank: 3,
            recapFragment: "Ofgem first and Beazley stalled",
          },
          {
            key: "D",
            label: "Try to settle Beazley quietly with a side-letter while building the Ofgem submission",
            consequence:
              "A side-letter is drafted. Coverage counsel resign on conflict-of-interest grounds. The side-letter eventually surfaces in Ofgem's evidence-gathering. The regulator notes the lack of candour in their final report.",
            rank: 4,
            recapFragment: "a quiet Beazley side-letter",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "rw-i6-strong" },
          { optionKey: "B", nextInjectId: "rw-i6-strong" },
          { optionKey: "C", nextInjectId: "rw-i6-weak" },
          { optionKey: "D", nextInjectId: "rw-i6-weak" },
        ],
      },

      // ── INJECT 6-strong: Bridge narrative for strong play ──────────────
      {
        id: "rw-i6-strong",
        order: 90,
        title: "Day 4, 08:00 - Cooperation Footing",
        body: "Day 4, 08:00. Mandiant's intermediate report lands at 07:50 and is in Ofgem's hands by 08:00. The insurer's coverage counsel has accepted the proactive disclosure and is now negotiating mitigation rather than exclusion. The PSR cohort have been called individually - 84,000 calls split across the customer service estate and a hired-in agency, completed in 38 hours. The Carlisle customer has been visited in person. Restoration is at 78% and the wholesale trading desk is back on the primary book. You are not out of the woods. But you are walking, not bleeding.",
        facilitatorNotes:
          "Rewarded narrative for strong play through the back half. The team should feel the dividend of their earlier choices. The next inject is the score-routed finale where the compound average rank decides the ending.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "Veridian Power: 'ongoing investigation, supply secure, vulnerable customers contacted'",
        artifact: {
          type: "default",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CISO", "COO"],
        expectedKeywords: ["restoration", "PSR", "Mandiant", "cooperation", "vulnerable"],
      },

      // ── INJECT 6-weak: Bridge narrative for weak play ──────────────────
      {
        id: "rw-i6-weak",
        order: 90,
        title: "Day 4, 08:00 - The Defensive Crouch",
        body: "Day 4, 08:00. Beazley have formally placed the claim under coverage dispute. Mandiant's intermediate report has been delivered to Ofgem 26 hours late because of a legal review hold. The PSR cohort are being contacted but the call centre is at 6x capacity and the wait time is 47 minutes; one customer in Newcastle has filed a complaint with the Ombudsman before being reached. Restoration is at 64%. The Times are running a follow-up: 'Inside Veridian's bunker week'. The board chair has asked for a 1:1 with the CEO at 18:00.",
        facilitatorNotes:
          "Defensive narrative for weaker play through the back half. The team should feel the cost of the earlier decoupling. The next inject is the score-routed finale; the team's compound rank average will decide whether they recover or not.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "Veridian Power 'in bunker week' as Times runs day-four feature on cyber response",
        artifact: {
          type: "default",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CISO", "COO"],
        expectedKeywords: ["dispute", "delay", "PSR", "Ombudsman", "Times"],
      },

      // ── INJECT 7: Day 5 - How Does This End? (score-routed finale) ─────
      {
        id: "rw-i7",
        order: 100,
        title: "Day 5, 16:00 - How Does This End?",
        body: "Day 5, 16:00. The technical incident is closing. The PSR replica that was in the attackers' hands has been on three mirrors for 36 hours and counting; 27,000 of the 84,000 records have been scraped and reposted on a Telegram channel before takedown. Restoration is at 91%. The wholesale trading desk is back on the primary book and reconciliations are clean. Ofgem's enforcement team have a draft notice. Beazley have a final position on the claim. The CFO has a number. The board has a question. The CEO has a microphone. How does this end?",
        facilitatorNotes:
          "Score-routed finale. The compound average rank of all decisions taken across the session is the input. Thresholds: <=1.6 -> end1 (TRIUMPH), <=2.3 -> end2 (RECOVERY), <=3.0 -> end3 (DIMINISHED), Infinity -> end4 (CATASTROPHIC). The team should be told this is the moment their cumulative choices land. There is no decision to take here - it is a hand-off into the ending.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Veridian Power week-one update due 17:00 - markets watching",
        artifact: {
          type: "default",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        branchMode: "score",
        branches: [
          { optionKey: "_", nextInjectId: "rw-end1", scoreMax: 1.6 },
          { optionKey: "_", nextInjectId: "rw-end2", scoreMax: 2.3 },
          { optionKey: "_", nextInjectId: "rw-end3", scoreMax: 3.0 },
          { optionKey: "_", nextInjectId: "rw-end4", scoreMax: 99 },
        ],
        targetRoles: ["CEO", "CFO", "CLO", "CISO"],
        expectedKeywords: ["finale", "PSR", "Ofgem", "Beazley"],
      },

      // ── ENDING 1: TRIUMPH ──────────────────────────────────────────────
      {
        id: "rw-end1",
        order: 110,
        title: "Day 30 - The Sector Standard",
        body: "Thirty days on. Ofgem closed their enforcement file with no notice issued, citing 'proactive cooperation that materially shaped the outcome'. Beazley paid the claim in full. The Times ran a follow-up: 'How Veridian's quiet week became the energy sector's playbook'. The Carlisle customer accepted a personal apology and an upgraded PSR safeguard. Last week, the NCSC asked the CISO to speak at a closed sector roundtable. Tomorrow, Ofgem's Cyber Cooperation Award goes to Veridian Power.\n\nOne last vote. Looking back across the whole exercise - which call did the most to earn this ending?",
        facilitatorNotes:
          "Triumph ending. The team executed cleanly across the board. The reflection vote is unranked - it asks them to look back and identify the call that mattered most.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "Ofgem closes enforcement file: Veridian Power 'sector cyber standard'",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "BBC NEWS",
          tvHeadline: "VERIDIAN POWER NAMED OFGEM CYBER COOPERATION AWARD WINNER",
          tvTicker: "Energy retailer's response 'shaped sector playbook' - regulator closes enforcement file",
          tvReporter: "WESTMINSTER",
        },
        isDecisionPoint: true,
        isEnding: true,
        targetRoles: ["CEO", "CISO", "CFO", "CLO"],
        expectedKeywords: ["reflection"],
        decisionOptions: [
          { key: "A", label: "The 03:14 forensic capture instinct" },
          { key: "B", label: "The first call to NCSC under NIS" },
          { key: "C", label: "Refusing to engage the chat window" },
          { key: "D", label: "Coupling the Beazley and Ofgem disclosure" },
        ],
      },

      // ── ENDING 2: RECOVERY ─────────────────────────────────────────────
      {
        id: "rw-end2",
        order: 110,
        title: "Day 30 - Quiet Lights On",
        body: "Thirty days on. Beazley settled at 70% of the claim - the MFA exclusion bit, but the mitigation argument held. Ofgem issued a private letter of concern with no public notice. The PSR contact programme was completed in 11 days and the Ombudsman complaint was withdrawn. Restoration is 100%. The trading book reconciliations are clean. The CEO survives the AGM. The board room is quiet, the lights are on, and nobody on the street is talking about Veridian Power any more.\n\nOne last vote. Looking back across the whole exercise - what was the most important thing you got right?",
        facilitatorNotes:
          "Recovery ending. The team made good choices but had at least one significant misstep, most likely on the Beazley/Ofgem coupling. The reflection vote is unranked.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "Veridian Power: 'closing the chapter, focused on customer trust'",
        artifact: {
          type: "default",
        },
        isDecisionPoint: true,
        isEnding: true,
        targetRoles: ["CEO", "CISO", "CFO", "CLO"],
        expectedKeywords: ["reflection"],
        decisionOptions: [
          { key: "A", label: "Reaching the PSR cohort in person" },
          { key: "B", label: "Honest internal posture with staff" },
          { key: "C", label: "Holding the negotiation line" },
          { key: "D", label: "Cooperative tone with Ofgem from day one" },
        ],
      },

      // ── ENDING 3: DIMINISHED ───────────────────────────────────────────
      {
        id: "rw-end3",
        order: 110,
        title: "Day 30 - The Long Tail",
        body: "Thirty days on. Ofgem issued an enforcement notice citing NIS failures. Beazley denied the claim under the MFA exclusion - $9M of cover gone. A class action covering 47,000 PSR-listed customers was filed in the High Court last Friday. Customer churn is running at 2.2x the sector average. The CISO has resigned. The Times leader column on Sunday was titled 'Veridian's lesson for every retailer'. The CEO has 90 days to deliver a credible plan. The board has not yet decided whether to back her.\n\nOne last vote. Looking back across the whole exercise - which call would you most want to take again?",
        facilitatorNotes:
          "Diminished ending. The team made multiple wrong calls but no catastrophic ones. The reflection vote asks the most useful debrief question - what call do they wish they could redo. Unranked.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "Ofgem issues NIS enforcement notice against Veridian - class action filed",
        artifact: {
          type: "news_headline",
        },
        isDecisionPoint: true,
        isEnding: true,
        targetRoles: ["CEO", "CISO", "CFO", "CLO"],
        expectedKeywords: ["reflection"],
        decisionOptions: [
          { key: "A", label: "The 03:14 first call" },
          { key: "B", label: "The bulk-encryption containment posture" },
          { key: "C", label: "Who ran the ransom keyboard" },
          { key: "D", label: "How we coupled Beazley and Ofgem" },
        ],
      },

      // ── ENDING 4: CATASTROPHIC ─────────────────────────────────────────
      {
        id: "rw-end4",
        order: 110,
        title: "Day 30 - We Paid Twice",
        body: "Thirty days on. The full PSR replica - 84,000 vulnerable customers - was published in week two on five mirrors. ALPHV took the $9M and re-extorted in week three for the 'remaining' data; the company refused. OFAC have opened an inquiry into the original payment because ALPHV was added to the SDN list four days after the wire cleared. The CEO resigned on Monday. The CISO resigned on Tuesday. The CFO resigned on Wednesday. The interim chair confirmed in this morning's RNS that Veridian Power is exploring 'all strategic options'. The trading desk is profitable. Nothing else is.\n\nOne last vote. Looking back across the whole exercise - which call do you most regret?",
        facilitatorNotes:
          "Catastrophic ending. The team's compound average rank exceeded 3.0 - they made multiple poor calls. The reflection vote is unranked and asks the most painful debrief question. This is where the most learning happens.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "Veridian Power chair: 'exploring all strategic options' as CEO, CISO, CFO resign in single week",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "BBC NEWS",
          tvHeadline: "VERIDIAN POWER IN CRISIS: ENTIRE EXEC TEAM RESIGNS",
          tvTicker: "OFAC inquiry into ransom payment - PSR data of 84,000 vulnerable customers published in full",
          tvReporter: "CITY OF LONDON",
        },
        isDecisionPoint: true,
        isEnding: true,
        targetRoles: ["CEO", "CISO", "CFO", "CLO"],
        expectedKeywords: ["reflection"],
        decisionOptions: [
          { key: "A", label: "Treating the 03:14 alert as a false positive" },
          { key: "B", label: "Letting trading run during the encryption" },
          { key: "C", label: "Paying the counter under PSR pressure" },
          { key: "D", label: "The Beazley side-letter" },
        ],
      },
    ],
  },


  // ─── SCENARIO 2: THE DEEPFAKE CEO ────────────────────────────────────────────
  //
  // Full 3-hour arc across 20 injects with 7 decision points. The graph has:
  //   - 4-way divergence at i1     (paths A/B/C/D each get their own narrative inject: i2a-i2d)
  //   - Re-convergence at i2v      (forensic speed/confidence tactical decision - 4 options)
  //   - Narrative convergence at i3 (shared pressures regardless of opening path)
  //   - 2-way re-divergence at i3d (staff-led i4a vs market-led i4b)
  //   - Re-convergence at i4v      (BlackRock shareholder call decision - 4 options, opinion-based)
  //   - Narrative re-convergence at i4h (the personal cost - character test, no vote)
  //   - Re-convergence at i5       (forensic vindication, 4 options all routing to i6)
  //   - Narrative convergence at i6 (copycat + internal leak narrative)
  //   - Re-convergence at i6a      (two-fronts coupling decision - 4 options)
  //   - 4-way divergence at i7     (endgame play - each option leads to a distinct ending)
  //   - 4 distinct endings         (end1=triumph, end2=recovery, end3=diminished, end4=catastrophic)
  //
  // Every decision inject has exactly 4 options. Each option has an optional
  // rank field (1 = best) to surface the designer's intended "right answer"
  // during debrief. Opinion-based options share ranks where there is genuinely
  // no single correct call (e.g. i4v BlackRock call format).
  //
  // Content note: the in-universe video is a deepfake of the CEO making a
  // contemptuous, abusive tirade about staff, clients, and regulators. It is
  // deliberately non-racial - the test is about identity integrity, market
  // integrity, and crisis decision-making, not about handling a racism allegation.
  {
    id: "tpl-deepfake-001",
    title: "The Deepfake CEO",
    description:
      "A hyper-realistic AI-generated video of your CEO making contemptuous, inflammatory statements goes viral at 6am. Branching 17-inject arc with 4 possible endings. Tests crisis comms, legal, identity verification, market integrity, employee welfare, and board governance from first alert to long-term strategic recovery.",
    type: "SOCIAL_MEDIA_CRISIS",
    difficulty: "CRITICAL",
    durationMin: 180,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-10T00:00:00Z",
    coverGradient: "135deg, #1a0a2e 0%, #4a0080 50%, #E82222 100%",
    roles: ["CEO", "CCO", "CLO", "CISO", "CFO", "HR_LEAD"],
    briefing:
      "You are the senior leadership team of Apex Dynamics, a FTSE 250 technology and professional services company with 8,000 employees globally. It is 06:04 on a Monday morning. Your social media listening tool has just fired an automated alert. A 47-second video of your CEO, posted from an account called @ApexLeaks, is going viral on X. In it, the CEO appears to deliver a contemptuous, abusive tirade: threatening mass layoffs in humiliating terms, disparaging two named enterprise clients by name, boasting about 'burying' regulators, and making crude personal attacks on a rival chief executive. The footage is forensically convincing. Your CEO is asleep, their phone is off, and their EA is trying to reach them. You have minutes before this becomes uncontrollable.",

    injects: [

      // ── ACT 1: THE UNKNOWN ─────────────────────────────────────────────
      // Four-way opening branch. Each option leads to a narrative inject
      // that plays out the consequences of that specific choice before the
      // paths converge again at df-i3.

      // ── INJECT 1: T+0. Video goes viral. Four-way branch. ──────────────
      {
        id: "df-i1",
        order: 0,
        title: "The Video Goes Viral",
        body: "06:04. The video has 340,000 views in 22 minutes and is trending #1 on X under #ApexCEO. Media outlets are running 'developing story' banners. Three FTSE 100 investors have already emailed Investor Relations. Your CEO's personal inbox is being flooded. The footage is forensically convincing: off-the-shelf AI detectors return inconclusive results. Your CEO remains unreachable. The team must decide how to respond before markets open.",
        facilitatorNotes:
          "This IS a deepfake. The CEO has been impersonated as part of a coordinated corporate espionage and short-selling operation - the team does not know this yet. Option C (measured holding statement) is the correct instinct: it buys time without lying and is legally defensible. Option A risks being catastrophically wrong if the video were real. Option B creates a dangerous vacuum. Option D is an interesting curveball - a personal tone from the CEO's family channel that humanises but bypasses process. Key coaching question: what is the cost of being wrong in each direction?",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "VIRAL: 47-second video purportedly showing Apex Dynamics CEO in abusive tirade passes 340,000 views",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "SKY NEWS",
          tvHeadline: "APEX DYNAMICS CEO IN VIRAL SCANDAL - COMPANY YET TO RESPOND",
          tvTicker: "VIRAL: 340K views in 22 minutes. #ApexCEO trending #1. Markets open in 3h.",
          tvReporter: "LIVE - CITY OF LONDON",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CCO", "CLO"],
        expectedKeywords: ["deepfake", "verify", "statement", "legal", "forensic", "holding"],
        recapLine: "opened with {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Issue an immediate denial: 'This video is fabricated', before any forensic confirmation",
            consequence:
              "Statement out in 11 minutes. If the video were real, this would be catastrophic. The gamble pays off on authenticity grounds but the denial is aggressively questioned. A second deepfake of the CFO follows within the hour.",
            rank: 4,
            recapFragment: "an immediate denial",
          },
          {
            key: "B",
            label: "Full silence: hold all public statements until forensic verification is complete (2-3 hours)",
            consequence:
              "The vacuum is filled by speculation. Two clients call to suspend contracts. Share price opens down 9.7%. Staff are in visible distress. The legally-safe choice is reputationally expensive.",
            rank: 3,
            recapFragment: "silence until forensics returned",
          },
          {
            key: "C",
            label: "Issue a measured holding statement: 'We are aware and urgently investigating authenticity'",
            consequence:
              "Buys time. Media covers the uncertainty angle without declaring a verdict. Pressure builds but no major errors are made. Forensic firm engaged immediately. CEO reached at 07:20.",
            rank: 1,
            recapFragment: "a measured holding statement",
          },
          {
            key: "D",
            label: "Let the CEO's EA authorise a short personal statement from the CEO's family account",
            consequence:
              "An unusual, humanising move. It works emotionally but bypasses the comms playbook and exposes the EA and family members to scrutiny. Twitter sentiment warms slightly; legal counsel is furious.",
            rank: 2,
            recapFragment: "a personal statement from the family channel",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i2a" },
          { optionKey: "B", nextInjectId: "df-i2b" },
          { optionKey: "C", nextInjectId: "df-i2c" },
          { optionKey: "D", nextInjectId: "df-i2d" },
        ],
      },

      // ── INJECT 2a: Path A narrative. Denial under siege. ───────────────
      {
        id: "df-i2a",
        order: 10,
        title: "Path A: The Denial Is Questioned",
        body: "07:00. Your denial is being picked apart. A tech journalist has enhanced the audio and posted a thread saying it 'passes every AI-detection test I know of'. The @ApexLeaks account has vanished, but not before DMing the video to 22 journalists. An FT reporter is demanding a named spokesperson on the record before 07:30 or the paper will run a piece with the headline 'Denial first, evidence later: the Apex Dynamics playbook'. Sky News now has the story running on a loop.",
        facilitatorNotes:
          "The group has taken a bold position without evidence. Keep them thinking about what they would do if the denial were proven wrong. This inject is a narrative inject - no vote. The facilitator should pressure them on evidence and talking points. All paths converge at df-i3.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "BREAKING: Apex Dynamics denial questioned as tech journalist says video 'passes every detection test'",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "SKY NEWS",
          tvHeadline: "APEX DYNAMICS DENIES VIRAL VIDEO - TECH EXPERTS CHALLENGE CLAIM",
          tvTicker: "DEVELOPING: FT calls for spokesperson on record. Company has issued denial without forensic confirmation.",
          tvReporter: "LIVE - CANARY WHARF",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CCO", "CLO", "CEO"],
        expectedKeywords: ["denial", "FT", "evidence", "position", "forensic"],
      },

      // ── INJECT 2b: Path B narrative. The silence deafens. ──────────────
      {
        id: "df-i2b",
        order: 10,
        title: "Path B: The Silence Deafens",
        body: "07:45. Nearly two hours of silence is being read by the market as confirmation. 240 staff have emailed HR asking for an emergency all-hands. Three of your largest enterprise clients have put morning meetings on hold. The Sunday Times website now leads with 'Apex Dynamics refuses to comment as viral CEO video spreads'. An FT op-ed has just gone live calling for a board statement within the hour. Your CEO is awake, incandescent, and wants to record a personal video from their kitchen 'right now'.",
        facilitatorNotes:
          "Silence has given the market free rein to fill the vacuum. The CEO's raw impulse to go live unprompted is high risk - a single fatigued or defensive word becomes the clip of the day. Coach the group: you can break the silence with a single sentence (internal first, then external) and still honour the forensics process. This inject is a narrative inject - no vote. All paths converge at df-i3.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Apex Dynamics silent two hours as viral video spreads. Share price opens down 9.7%.",
        artifact: {
          type: "slack_thread",
          slackChannel: "#all-hands",
          slackMessages: [
            { author: "Priya Ramesh",    role: "Eng Lead",   time: "07:38", text: "Has anyone heard anything official? The video is everywhere and three of my team have messaged me asking if they should come in today." },
            { author: "Tom Whitfield",   role: "Acct Exec",  time: "07:40", text: "Two of my clients have emailed asking if the meetings this morning are still on. I don't know what to tell them." },
            { author: "Aisha Chowdhury", role: "People Ops", time: "07:42", text: "I am deeply upset by what I've seen. I need to know whether our leadership is taking this seriously. Silence is not a strategy." },
            { author: "Mark Harris",     role: "Senior PM",  time: "07:44", text: "The FT has just published an op-ed calling for the CEO to step aside pending investigation. Is comms planning to respond?" },
            { author: "Dani Bryant",     role: "Designer",   time: "07:45", text: "I love this company. Please, please say something. Anything. My mum saw the video and asked me why I still work here." },
          ],
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CCO", "HR_LEAD"],
        expectedKeywords: ["silence", "internal", "all-hands", "FT", "pressure"],
      },

      // ── INJECT 2c: Path C narrative. The measured path holds. ──────────
      {
        id: "df-i2c",
        order: 10,
        title: "Path C: The Window Holds, Forensics Race",
        body: "07:20. Your measured holding statement is working. Media are covering the uncertainty angle: 'Company investigates viral CEO video'. The CEO has been reached, is calm, and is cooperating. Your CISO has engaged DeepDetect AI, a specialist forensic firm. They have found early AI-generated audio artefacts. ETA for full confirmation: 75 minutes. But a campaigning journalist has now published a thread accusing the company of running a 'cover-up playbook'. 180 staff have emailed HR asking what to do today. A second deepfake - this one of your CFO announcing a fake £2.4B acquisition - has appeared on a financial forum.",
        facilitatorNotes:
          "Path C is the most defensible position, legally and reputationally. The group is doing well. The challenge now is internal comms (employees need something) and the CFO video complication. The journalist's 'cover-up' narrative is dangerous: the CCO needs a proactive strategy, not just reactive holding statements. This inject is a narrative inject - no vote. All paths converge at df-i3.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Apex Dynamics investigation underway as authenticity of viral video is disputed. CFO video now also circulating.",
        artifact: {
          type: "email",
          emailFrom: "forensics@deepdetect.ai",
          emailTo: "ciso@apexdynamics.com",
          emailSubject: "URGENT: Preliminary findings. AI-generated audio artefacts detected in CEO video.",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "CLO", "CCO", "HR_LEAD"],
        expectedKeywords: ["forensic", "employee comms", "CFO video", "internal communication", "cover-up narrative"],
      },

      // ── INJECT 2d: Path D narrative. The family statement gamble. ──────
      {
        id: "df-i2d",
        order: 10,
        title: "Path D: The Family Channel Lands",
        body: "07:15. The CEO's EA has posted a 180-character statement from the CEO's verified family account: 'I am aware of a video circulating that purports to show me. It is not me. I am safe, at home, with my family, and cooperating with my company and the authorities.' Reaction is split. Sympathetic journalists are leading with 'CEO breaks silence from family home'. Hostile ones are calling it 'a bizarre sidestep of corporate process'. The CLO is furious because the statement was never cleared with legal. The CCO is processing it in real-time. It has 840,000 views in 15 minutes.",
        facilitatorNotes:
          "This is an unorthodox but emotionally potent move. It humanises the CEO and breaks the vacuum with a low-stakes format. It also bypasses the playbook and exposes the CEO's family. The CLO's anger is real - this could have been a disaster if the statement had been one word different. Push the group: is this a one-off, or are they going to double down on the family-channel tone? How do they now fold the CLO back in? This inject is a narrative inject - no vote. All paths converge at df-i3.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Apex Dynamics CEO breaks silence via family social account: 'It is not me'",
        artifact: {
          type: "tweet",
          tweetHandle: "@CarolineMerrickHome",
          tweetDisplayName: "Caroline Merrick",
          tweetLikes: 42100,
          tweetRetweets: 18400,
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CCO", "CLO", "HR_LEAD"],
        expectedKeywords: ["family account", "personal", "process", "legal", "humanise"],
      },

      // ── INJECT 2v: Forensics early read. Tactical speed/confidence call.
      // All four Act 1 paths hit this before converging at df-i3.
      {
        id: "df-i2v",
        order: 15,
        title: "Forensics: Speed vs Confidence",
        body: "07:50. DeepDetect AI calls directly: 'We can give you a qualified preliminary read in five minutes at 84% confidence the video is AI-generated, or a final full-confidence report in ninety minutes at 99%+.' The difference matters. Markets open in 70 minutes. The BBC needs a response in 55 minutes. Your CLO warns that a preliminary finding publicly announced and later contradicted would be 'genuinely career-ending.' Your CCO says the current silence is now visibly shaping the narrative against the company. Your CISO recommends a middle path but defers to legal. What do you ask the forensics firm for, and what do you do with it?",
        facilitatorNotes:
          "Classic speed-vs-confidence tension. C (wait for full report, hold the line with measured language) is the textbook correct call: it preserves the option to respond definitively without risking a retraction. A (use preliminary internally only) is the strongest real-world compromise: it lets internal leaders move with confidence while keeping external messaging measured. B (release preliminary publicly) is the tempting but riskiest option — an 84% confidence claim made public cannot be walked back without severe credibility cost. D (demand a second independent pass) is a decent-sounding instinct that in practice burns the exact time you needed the first answer for. Push the group on the asymmetry: being late with certainty costs reputation in hours; being wrong with speed costs reputation in years.",
        delayMinutes: 0,
        timerMinutes: 8,
        tickerHeadline: "Apex Dynamics forensic investigation underway as markets prepare for open; company yet to issue definitive statement",
        artifact: {
          type: "email",
          emailFrom: "lead@deepdetect.ai",
          emailTo: "ciso@apexdynamics.com",
          emailSubject: "URGENT - Preliminary read available at 84% confidence. Final report ETA 90 minutes. Your call.",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CISO", "CLO", "CCO"],
        expectedKeywords: ["forensic", "preliminary", "confidence", "internal", "BBC", "retraction", "measured"],
        recapLine: "handled the forensics by {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Take the preliminary now. Use it to align internal comms only. Hold external line until the full report arrives.",
            consequence:
              "Internal leaders brief their teams with conviction. External messaging stays measured. When the final report lands at 09:20, the company moves confidently. Strong operational balance.",
            rank: 2,
            recapFragment: "taking the preliminary read internally only",
          },
          {
            key: "B",
            label: "Take the preliminary and release it publicly to get ahead of the BBC deadline",
            consequence:
              "The 84% figure goes out. The BBC runs with it. Within 40 minutes a rival forensics firm publicly questions the methodology and the Apex statement is reframed as 'partial'. The CLO's warning proves prescient.",
            rank: 4,
            recapFragment: "publishing the 84% preliminary read",
          },
          {
            key: "C",
            label: "Wait for the full report. Hold the public line with measured language and no specific claims.",
            consequence:
              "The 90-minute wait is painful but disciplined. When the 99%+ report lands, Apex can move definitively and once. The BBC runs with 'company declines to speculate pending full forensic report' - a defensible position.",
            rank: 1,
            recapFragment: "waiting for the full report",
          },
          {
            key: "D",
            label: "Ask for a second independent forensic pass before either report is used",
            consequence:
              "The second firm needs four hours. By the time both reports align, share price has opened down 9% and competitors are already shaping the narrative. A prudent instinct applied at the wrong tempo.",
            rank: 3,
            recapFragment: "demanding a second forensic pass",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i3" },
          { optionKey: "B", nextInjectId: "df-i3" },
          { optionKey: "C", nextInjectId: "df-i3" },
          { optionKey: "D", nextInjectId: "df-i3" },
        ],
      },

      // ── ACT 2: THE CONVERGENCE ─────────────────────────────────────────
      // All four Act 1 paths converge at df-i3 (a narrative inject, not a
      // vote). The group then faces df-i3d, a 4-option priority decision
      // that re-diverges the arc into two paths (staff-led vs market-led)
      // before converging again at df-i4h.

      // ── INJECT 3: All paths converge. CEO reached, staff crisis. ────────
      {
        id: "df-i3",
        order: 20,
        title: "Convergence: Market Open and the CEO Returns",
        body: "08:15. Whatever path you took, the same three pressures have landed simultaneously. Share price is down 7.2% at open on volume five times normal. Three institutional investors are demanding a call with the Chairman before midday. The BBC, Sky News, FT and Bloomberg all have the story leading their markets coverage. 340 staff have emailed HR asking for an all-hands. Your CEO is finally fully briefed and operational. Forensics ETA: 45 minutes. The group now has to choose what to do in the next ten minutes.",
        facilitatorNotes:
          "This is the convergence point. Whatever happened in Act 1, the group now faces the same set of simultaneous pressures. This inject is a narrative inject - the decision itself lives in df-i3d. Use the timer to create urgency. The CEO being 'finally operational' is important: the group is no longer waiting on the principal, and any failure to act is now on the room.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Apex Dynamics shares fall 7.2% at open as institutional investors demand chairman call",
        artifact: {
          type: "stock_chart",
          stockTicker: "APEX.L",
          stockCompanyName: "Apex Dynamics plc",
          stockOpenPrice: 482.40,
          stockCurrentPrice: 447.70,
          stockChangePercent: -7.20,
          stockVolume: "22.1M",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "HR_LEAD", "CFO", "CCO"],
        expectedKeywords: ["convergence", "market open", "BBC", "investors", "staff", "CEO"],
      },

      // ── INJECT 3d: Priority decision. 4 options, re-diverges. ──────────
      {
        id: "df-i3d",
        order: 22,
        title: "Priority Under Pressure",
        body: "08:20. The CEO turns to the room: 'We have ten minutes before the BBC piece drops. Who do we talk to first?' On the table: staff (all-hands from the CEO), the national broadcaster (direct interview or statement), institutional investors (via Chairman), or a full handover of the crisis response to your external PR firm. Every option has a cost. The CCO is watching the Twitter trend line. The HR lead is watching their inbox refresh every 30 seconds.",
        facilitatorNotes:
          "Staff-first (A) is almost always the right move in a reputational crisis: long-term trust compounds faster than short-term share price damage. Media-first (B) is defensible if the group genuinely has a message ready - but often they don't. Investors-first (C) is a classic financial-crisis answer that feels 'professional' but optically cold. External-PR handover (D) is a form of abdication and usually produces a generic, corporate, tin-eared response. Options A/B route to df-i4a (staff-led narrative); C/D route to df-i4b (market-led narrative).",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Apex Dynamics leadership team prioritises response as institutional investors press for contact",
        artifact: {
          type: "email",
          emailFrom: "newsdesk@bbc.co.uk",
          emailTo: "press@apexdynamics.com",
          emailSubject: "BBC Business: Deadline 08:45 for on-the-record response on Apex CEO video",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "HR_LEAD", "CCO", "CFO"],
        expectedKeywords: ["all-hands", "BBC", "investors", "chairman", "priority", "internal", "PR firm"],
        recapLine: "prioritised {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Staff first: CEO records a two-minute all-hands video and sends it company-wide",
            consequence:
              "Morale stabilises within the hour. Union reps hold off a public statement. Investor calls later in the morning land on firmer internal ground. The long game is being played well.",
            rank: 1,
            recapFragment: "staff first with a CEO all-hands",
          },
          {
            key: "B",
            label: "Media first: CEO gives a tight 90-second on-the-record statement to the BBC",
            consequence:
              "The BBC piece is balanced. The CEO comes across as composed. But 240 staff later say 'we heard it from the BBC before we heard it from our CEO' and the internal trust cost lingers.",
            rank: 2,
            recapFragment: "media first with the BBC",
          },
          {
            key: "C",
            label: "Investors first: Chairman-led call with the top three institutional holders",
            consequence:
              "Institutional panic is defused. Share price holds. But the BBC story runs without a company voice, and staff see the leadership team treating the share price as the priority over their wellbeing.",
            rank: 3,
            recapFragment: "investors first via the Chairman",
          },
          {
            key: "D",
            label: "Hand the whole response over to the external PR firm until forensics are back",
            consequence:
              "The PR firm issues a polished but generic statement. It holds the line but does not humanise. Staff read it as corporate and distant. The CCO later notes this was the moment the company 'outsourced its own voice'.",
            rank: 4,
            recapFragment: "handing it to the external PR firm",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i4a" },
          { optionKey: "B", nextInjectId: "df-i4a" },
          { optionKey: "C", nextInjectId: "df-i4b" },
          { optionKey: "D", nextInjectId: "df-i4b" },
        ],
      },

      // ── INJECT 4a: Staff-led path narrative ─────────────────────────────
      {
        id: "df-i4a",
        order: 30,
        title: "Path: Staff-Led Recovery",
        body: "08:45. The internal comms landed well. A two-minute video from the CEO has been watched by 6,200 of 8,000 staff within thirty minutes. The Slack mood has shifted from panic to cautious solidarity. External pressure is still intense: the BBC story is running, the FT has a long read in progress, and the CFO deepfake is now spreading on finance forums. But your people are holding together. A senior engineer has just posted a widely-shared thread defending the CEO's integrity. A client who had cancelled a meeting has rebooked.",
        facilitatorNotes:
          "Staff-led paths look slow on paper but they compound. This narrative inject is meant to show the group that the choice they made is paying off in ways they cannot always measure. Be careful not to overplay the victory - the CFO deepfake and the forensics question still loom. This is a breather, not a resolution.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Apex Dynamics staff rally behind CEO as internal video circulates; CFO video complication emerges",
        artifact: {
          type: "slack_thread",
          slackChannel: "#all-hands",
          slackMessages: [
            { author: "Priya Ramesh",    role: "Eng Lead",   time: "08:42", text: "Just watched the CEO video. That was a human response. I am not going anywhere. If any of my team need to talk today my door is open." },
            { author: "Tom Whitfield",   role: "Acct Exec",  time: "08:43", text: "Two of my three clients have just reconfirmed this morning's meetings. One said: 'we just wanted to see how you were going to handle it'." },
            { author: "Mark Harris",     role: "Senior PM",  time: "08:44", text: "Engineering and product are both holding together. If the forensics come back soon we'll be fine." },
          ],
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "HR_LEAD", "CCO"],
        expectedKeywords: ["internal", "CEO video", "staff", "momentum", "CFO video"],
      },

      // ── INJECT 4b: Market-led path narrative ────────────────────────────
      {
        id: "df-i4b",
        order: 30,
        title: "Path: Market-Led Recovery",
        body: "08:45. The institutional investor calls went well. Share price has ticked back up to -5.4% from the open low. The BBC ran the story with a brief company statement from your PR firm. Bloomberg picked up the line 'Apex Dynamics: fully investigating; no staff action in contemplation'. But your internal metrics are worrying: the Slack #all-hands channel has gone quiet in a bad way, 40 more staff have opened sick-day requests, and the union rep is drafting a statement that begins 'the leadership has prioritised the market over its people'. The CFO deepfake has just appeared on a finance forum.",
        facilitatorNotes:
          "Market-led paths look decisive in the moment but can corrode trust. This narrative inject is meant to show the group that share-price stabilisation has come at a cost. The union rep drafting a statement is the key detail: in the next few hours, the group will have to win back the internal room. Do not let the group conclude they made the wrong call - this is a trade-off, not a failure.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Apex Dynamics shares recover partially after chairman-led investor call; BBC runs PR firm statement",
        artifact: {
          type: "stock_chart",
          stockTicker: "APEX.L",
          stockCompanyName: "Apex Dynamics plc",
          stockOpenPrice: 482.40,
          stockCurrentPrice: 456.10,
          stockChangePercent: -5.45,
          stockVolume: "28.7M",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CFO", "CCO", "HR_LEAD"],
        expectedKeywords: ["investors", "chairman", "share price", "union", "internal silence", "CFO video"],
      },

      // ── INJECT 4v: BlackRock calls. Shareholder call format decision. ──
      // Both Act 2 paths (i4a and i4b) route through this before i4h.
      {
        id: "df-i4v",
        order: 33,
        title: "BlackRock Calls The Chairman Directly",
        body: "09:05. The Chairman has just been called on his mobile by the lead portfolio manager at BlackRock, your third-largest institutional shareholder (6.4% of the register). His message is short: 'I need 20 minutes with the top of the house at 09:30 to hear this directly. I can do it privately, or I can do it on a group call with Legal & General and Aviva - they've both asked me the same thing.' The Chairman has come back to the room. 'I can do one thing at 09:30, not two. Or we try to thread it. How do we handle this?' Share price is currently down 6.8% and the order book is thin. Investor relations are watching.",
        facilitatorNotes:
          "This is a genuine judgement call with defensible answers in every direction, which is why it matters for a vote. The 'correct-ish' answer is C (Chairman handles the group at 10:15; CEO does the BlackRock call individually at 09:30) because it lets the biggest holder feel personally handled while treating the other two fairly - but this is genuinely opinion-based and the group should be encouraged to argue for A, B or D. A prioritises the biggest but signals favouritism to the others. B is fair but loses the personal touch that shareholders reward in a crisis. D is cold and defensive. Push the group to articulate what each holder actually needs right now - not just what is procedurally clean.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Apex Dynamics institutional holders request urgent engagement as shares trade down 6.8%",
        artifact: {
          type: "email",
          emailFrom: "mark.holloway@blackrock.com",
          emailTo: "chairman@apexdynamics.com",
          emailSubject: "Urgent - request for 09:30 call. L&G and Aviva have asked the same. Your call on format.",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CFO", "CCO"],
        expectedKeywords: ["BlackRock", "chairman", "shareholder", "group call", "private", "priority"],
        recapLine: "handled the shareholders by {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Chairman takes BlackRock privately at 09:30. Individual follow-ups with L&G and Aviva through the morning.",
            consequence:
              "BlackRock feels handled. L&G takes the follow-up well. Aviva is polite but notes they were 'second in the queue' in a later analyst note. A clean but slightly hierarchical approach.",
            rank: 3,
            recapFragment: "sending the Chairman to BlackRock alone",
          },
          {
            key: "B",
            label: "Single group call at 10:15 with all three lead portfolio managers, Chairman chairing.",
            consequence:
              "Efficient and fair. But BlackRock's PM arrives 40 seconds late and the first two minutes are consumed by formalities. The personal tone everyone came for is missing. Competent but cold.",
            rank: 2,
            recapFragment: "running a single group call",
          },
          {
            key: "C",
            label: "CEO takes BlackRock at 09:30 alone. Chairman runs the group call at 10:15 with L&G and Aviva.",
            consequence:
              "The biggest holder gets the CEO individually. The other two get the Chairman in a format that respects their seniority. By 11:00 all three have issued private 'supportive but watching' notes internally. Best balance.",
            rank: 1,
            recapFragment: "splitting CEO and Chairman across the three",
          },
          {
            key: "D",
            label: "Written briefing pack sent to all three at 09:30; offer individual calls later in the day.",
            consequence:
              "Procedurally clean but emotionally wrong. BlackRock's PM takes it as a brush-off and calls a peer at a competitor firm to compare notes. The call that does eventually happen is tense.",
            rank: 4,
            recapFragment: "sending a written briefing pack",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i4h" },
          { optionKey: "B", nextInjectId: "df-i4h" },
          { optionKey: "C", nextInjectId: "df-i4h" },
          { optionKey: "D", nextInjectId: "df-i4h" },
        ],
      },

      // ── INJECT 4h: The personal cost. Character test. Both paths see this.
      {
        id: "df-i4h",
        order: 35,
        title: "The Personal Cost",
        body: "08:55. The CEO's EA steps in quietly and closes the door. The CEO's 14-year-old daughter has just been sent home from school after classmates played the video to her in the corridor and filmed her reaction. She is in tears in the car. The CEO's phone is ringing. At the same moment, the Head of HR reports that a colleague in Finance has asked to take the day off - she is 'not sure she wants to come back to an office where people might look at her and think of that video'. The CEO turns to the room and asks, quietly: 'what do I do?'",
        facilitatorNotes:
          "This inject is deliberately not a vote. It is a character test. The purpose is to surface the human dimensions that crisis playbooks almost always underweight. Well-run teams will pause and acknowledge this. Poorly-run teams will treat it as a distraction. Push the group: how does the CEO show up for their family AND the company in the next ten minutes? What does the HR Lead do for the colleague in Finance? This is where leadership either earns or loses long-term trust. Both Act 2 paths (staff-led and market-led) land here.",
        delayMinutes: 0,
        timerMinutes: 8,
        tickerHeadline: "Reports emerge of Apex Dynamics staff distress as deepfake video circulates on school social media",
        artifact: {
          type: "slack_thread",
          slackChannel: "dm: HR Lead to CEO",
          slackMessages: [
            { author: "HR Lead",  role: "direct message", time: "08:52", text: "Confidential. A colleague in Finance has just come to me in tears. She said: 'I know it's not real, but I don't know how to walk past people today who might think it is.' She's asked for the day off. I've said yes. I think we need to do something more." },
            { author: "HR Lead",  role: "direct message", time: "08:53", text: "Also: your EA has just told me about your daughter. I'm so sorry. Whatever you need from me, I'm here." },
            { author: "HR Lead",  role: "direct message", time: "08:54", text: "And one more thing: two members of my own team have been crying at their desks this morning. This crisis has a human weight you will feel more over the next 24 hours." },
          ],
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "HR_LEAD", "CCO"],
        expectedKeywords: ["empathy", "family", "staff welfare", "personal", "leadership"],
      },

      // ── ACT 3: VINDICATION AND ENDGAME ─────────────────────────────────
      // df-i5: forensic confirmation, 4-option decision, all branches
      // converge to df-i6 (a narrative inject combining the copycat attack
      // and the discovery of an internal leak). df-i7 is the endgame
      // decision: 4 options, 4 branches, each routing to a distinct ending
      // (df-end1 through df-end4). The endings are short narrative injects
      // that provide closure for debrief.

      // ── INJECT 5: Forensic vindication + short-selling intelligence ─────
      {
        id: "df-i5",
        order: 40,
        title: "Forensic Vindication: Both Videos Confirmed Deepfakes",
        body: "09:30. DeepDetect AI have just delivered the final report. Both the CEO and CFO videos are AI-generated. Voice synthesis fingerprints, facial mapping artefacts, identical infrastructure. The technical report is publishable. More significantly, your CISO has separately uncovered something explosive: 840,000 Apex Dynamics put options were quietly purchased through three nominee accounts in the 48 hours before the videos dropped. Notional value approximately £18M. The trading pattern points to a coordinated short-selling attack, possibly tied to a corporate intelligence firm operating out of an offshore cluster. You now hold the vindication. The question is how you spend it.",
        facilitatorNotes:
          "This is the vindication moment. The forensic report is unambiguously good news, but the short-selling angle is genuinely difficult: it is potentially criminal, it is incendiary if announced publicly, and going loud could compromise an FCA or SFO investigation. The four options offered are not equally strong. B (publish forensics + private FCA brief) is the textbook correct call: it maintains the narrative win, gives investigators what they need without tipping the attacker, and protects the company from accusations of selective disclosure. A is dramatic and tempting but risks the FCA telling you to stand down publicly. C is reckless. D is too cautious and wastes the moment. Push the group on the difference between what they know and what they can responsibly say. Whatever they choose, all four branches converge to df-i6, where they discover that the attacker had inside help.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "BREAKING: Forensic firm confirms Apex Dynamics CEO and CFO videos as AI-generated deepfakes",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "SKY NEWS",
          tvHeadline: "APEX DYNAMICS: FORENSIC FIRM CONFIRMS CEO AND CFO VIDEOS ARE AI DEEPFAKES",
          tvTicker: "SKY NEWS BUSINESS - APEX DYNAMICS DEEPFAKE - SHARES RECOVER 4% IN PRE-OPEN TRADING - FORENSIC REPORT TO BE PUBLISHED - FCA REPORTEDLY MONITORING UNUSUAL OPTIONS ACTIVITY - CEO TO MAKE STATEMENT",
          tvReporter: "Ian Whitfield, Sky News Business, City of London",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CCO", "CISO"],
        expectedKeywords: ["publish", "forensic", "short selling", "FCA", "law enforcement", "narrative"],
        recapLine: "played the vindication by {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Publish the forensics AND publicly accuse a coordinated short-selling attack at a press conference",
            consequence:
              "Maximum drama. The story flips overnight: 'Apex vindicated, attackers exposed'. But within two hours the FCA contacts the CLO formally, asking the company to cease all public speculation as it may compromise their investigation. The CEO has to walk back. A small but real credibility cost.",
            rank: 4,
            recapFragment: "publicly accusing the short-sellers",
          },
          {
            key: "B",
            label: "Publish the forensics in full; brief the FCA privately on the short-selling evidence and let them lead",
            consequence:
              "The FCA is grateful. The investigation accelerates. Media coverage is overwhelmingly positive: 'company vindicated by independent forensics'. The attacker still believes they are unobserved. Strongest possible position going into Day 2.",
            rank: 1,
            recapFragment: "publishing openly and briefing the FCA privately",
          },
          {
            key: "C",
            label: "Brief two trusted financial journalists off-record before publication to control the angle",
            consequence:
              "The FT and Bloomberg run favourable pieces within an hour. The narrative is yours. But by Day 2 the FCA is asking whether the off-record briefing constituted selective disclosure under MAR. A second-order legal headache.",
            rank: 3,
            recapFragment: "briefing the FT and Bloomberg off-record",
          },
          {
            key: "D",
            label: "Publish only the technical forensics; say nothing publicly about the short-selling angle at all",
            consequence:
              "Safe. Defensible. But journalists notice the absence and start asking 'who benefited from this attack?' independently. Within 24 hours half the financial press is speculating without your facts. You lose control of the most compelling part of the story.",
            rank: 2,
            recapFragment: "staying silent on the short-selling angle",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i6" },
          { optionKey: "B", nextInjectId: "df-i6" },
          { optionKey: "C", nextInjectId: "df-i6" },
          { optionKey: "D", nextInjectId: "df-i6" },
        ],
      },

      // ── INJECT 6: Copycat + internal leak (narrative convergence) ───────
      {
        id: "df-i6",
        order: 45,
        title: "The Picture Sharpens: A Rival Is Hit, And A Door Was Left Open",
        body: "11:45. Two things land in the same fifteen minutes. First, your CISO's contact at Helix Corp - a major rival - calls in confidence: a less-polished deepfake of their CEO has just begun circulating on Reddit. Same voice-cloning signature, same distribution vector, same offshore infrastructure. Helix's Head of Security is asking, off the record, whether you can share your forensic approach. Second, while reviewing access logs, your CISO's team has identified the source of the leaked investor day footage: a personal encrypted drive belonging to a senior communications manager who is currently in the building. The footage was copied 10 days ago. The two pieces snap together: the attacker had inside help, and they are now hunting other targets. The room goes very quiet.",
        facilitatorNotes:
          "This is the narrative pivot from 'we are the victim' to 'we are part of a wider attack with an internal dimension'. There is no decision point here on purpose - the group needs a beat to absorb both shocks before the endgame. Push them informally: how do they want to handle Helix? (The right answer is via NCSC, never directly.) How do they want to handle the comms manager? (Preserve evidence first, brief the police Economic Crime Unit, do NOT confront yet.) These are not voted on, but they should colour what the group chooses in df-i7. If the group rushes a confrontation here, flag it - that is the kind of mistake that ruins an otherwise strong endgame.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Second FTSE 250 firm reportedly hit by similar AI deepfake attack as common signature emerges",
        artifact: {
          type: "slack_thread",
          slackChannel: "dm: CISO to CEO + CLO",
          slackMessages: [
            { author: "CISO", role: "direct message", time: "11:42", text: "Helix Corp just called. Their CEO has a deepfake circulating on Reddit. Same voice-clone fingerprint as ours. Same TOR cluster. Their head of security wants our forensic approach off the record." },
            { author: "CISO", role: "direct message", time: "11:43", text: "Separately. We've found the leak source for the investor day footage. It came off a personal encrypted drive belonging to a senior comms manager. Copied 10 days ago. They are in the office today." },
            { author: "CISO", role: "direct message", time: "11:44", text: "I want to brief the NCSC on the Helix link and the police Economic Crime Unit on the internal leak. I do NOT want to confront the comms manager yet - we will lose the device evidence the moment they realise. Please advise." },
            { author: "CISO", role: "direct message", time: "11:45", text: "One more thing. If we coordinate properly with Helix and the NCSC, this stops being 'Apex got attacked'. It becomes 'Apex helped expose a market disinformation operation'. That is a different story." },
          ],
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "CLO", "HR_LEAD", "CEO"],
        expectedKeywords: ["NCSC", "Helix", "internal leak", "Economic Crime Unit", "preserve evidence", "coordinated attack"],
      },

      // ── INJECT 6a: Two Fronts. Tactical coupling decision. ─────────────
      // Helix outreach + comms manager handling, both in the same 30-minute window.
      {
        id: "df-i6a",
        order: 48,
        title: "Two Fronts, Thirty Minutes",
        body: "12:15. Two clocks are running. First: the Helix CISO is waiting on a response - Bloomberg is going to print a 'second FTSE 250 company may have been hit' piece at 13:30 whether you engage or not. Second: HR has just flagged that your comms manager booked a 16:00 train to Edinburgh at 11:58 for 'a personal matter.' Their laptop is still on their desk. Nobody has confronted them. The CLO, CISO and Head of HR are in the room with you and they need a decision in the next fifteen minutes. They keep looking at each other and then at you.",
        facilitatorNotes:
          "This is a coupling decision: both problems need handling in the same window and the way you handle one shapes the other. A (NCSC for Helix, police-led evidence preservation on the comms manager, no confrontation) is the textbook correct answer - it keeps both processes clean and gives the Economic Crime Unit time to move. C is a decent second-best that trades some evidential cleanliness for operational control (holding the manager in the office via a pretext). B is the 'emotionally satisfying, legally weak' option and will typically lose the device evidence. D is the fear-response option - declining the Helix outreach gives up a strategic advantage and suspending the manager without police in place forfeits the criminal case. Push the group: what do they want the headline of this day to be? 'Apex helped expose a market disinformation attack' or 'Apex suspended an employee'? The answer shapes the endgame.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "Bloomberg preparing second FTSE 250 deepfake story; Apex Dynamics internal investigation continues",
        artifact: {
          type: "slack_thread",
          slackChannel: "dm: CLO to CEO",
          slackMessages: [
            { author: "CLO", role: "direct message", time: "12:12", text: "Time pressure on two fronts. Need to know how to play both before 12:30." },
            { author: "CLO", role: "direct message", time: "12:13", text: "Helix: NCSC is the clean channel. Direct contact risks coordination accusation later. But Helix CISO is waiting right now and Bloomberg goes at 13:30 either way." },
            { author: "CLO", role: "direct message", time: "12:14", text: "Comms manager: if we suspend now, personal devices leave the building at 16:00. If we involve the ECU first, we may be able to preserve those devices remotely and interview with police present. Stronger case. But it takes 48-72 hours." },
            { author: "CLO", role: "direct message", time: "12:15", text: "Whatever we pick, we pick both at once. Cannot have a fast decision on one and a slow decision on the other - the two interact." },
          ],
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CISO", "HR_LEAD"],
        expectedKeywords: ["NCSC", "Economic Crime Unit", "preserve evidence", "Bloomberg", "Helix", "coupling"],
        recapLine: "worked the two-fronts squeeze by {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "NCSC formal channel for Helix. Police-led remote evidence preservation on the comms manager. No confrontation today.",
            consequence:
              "The NCSC opens a coordinated advisory within the hour. The Economic Crime Unit is briefed, the manager's devices are preserved remotely, a formal interview follows with police present on Day 4. Strongest legal and reputational position.",
            rank: 1,
            recapFragment: "routing Helix via NCSC and preserving evidence remotely",
          },
          {
            key: "B",
            label: "Direct informal call to Helix's CISO. Suspend the comms manager immediately, search their desk before 16:00.",
            consequence:
              "Helix moves fast but the informal contact is later flagged by the FCA during disclosure review. The comms manager's personal devices leave the building with them at 16:00. Police note the missed opportunity.",
            rank: 3,
            recapFragment: "calling Helix informally and suspending on the spot",
          },
          {
            key: "C",
            label: "NCSC for Helix. Hold the comms manager in the building by asking them to stay for an urgent client call while police move into position.",
            consequence:
              "Helix is cleanly handled. The comms manager is legally retained on plausible grounds. Police arrive at 14:30 and secure the personal devices. Operational win. Small legal risk if the 'client call' pretext is later framed as detention.",
            rank: 2,
            recapFragment: "routing Helix via NCSC and holding the manager in-building",
          },
          {
            key: "D",
            label: "Decline Helix outreach on legal advice. Suspend the comms manager immediately and call police after.",
            consequence:
              "Helix struggles without context. Industry later notes Apex's caution as 'unhelpful.' The manager's devices leave the building. Police interview on Day 4 without the personal devices. Weakest outcome on both fronts.",
            rank: 4,
            recapFragment: "declining Helix and suspending before police were in place",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i6-strong" },
          { optionKey: "B", nextInjectId: "df-i6-weak"   },
          { optionKey: "C", nextInjectId: "df-i6-strong" },
          { optionKey: "D", nextInjectId: "df-i6-weak"   },
        ],
      },

      // ── INJECT 6-strong: Day 2 morning, police-led track. ──────────────
      // Narrative bridge played when df-i6a was answered with A or C
      // (NCSC + police-led evidence preservation). The clean hand: comms
      // manager interviewed with police present, devices secured, FCA
      // cooperation case is the strongest it can be going into the endgame.
      {
        id: "df-i6-strong",
        order: 49,
        title: "The Clean Hand",
        body: "Day 2, 09:15. You walk into the boardroom with something you didn't have yesterday: a clean evidential trail. Overnight the Economic Crime Unit secured the comms manager's personal devices remotely - laptop, two phones, an old tablet still logged into a personal Gmail. The interview happened at 07:30 with two officers and your CLO present. The manager has not been charged but is cooperating, and they have already named the offshore PR firm that paid them. The CLO slides a single-page summary across to you: 'This is the version of this story we want the FCA to read first. We control the disclosure. We can go to them this morning before they come to us.' Sky News has the arrest as their 09:00 headline but - critically - the Apex name is not in it yet. You have a choice about how the next 24 hours play out, and for once you have the strong position.",
        facilitatorNotes:
          "Pure narrative bridge - no decision required. This inject only fires for groups that handled df-i6a well (options A or C). Reward the clean play: the participants should feel the difference between this Day 2 opening and the alternative one. Use this beat to ask the group what they want to do with the strong position - it primes the endgame decision (df-i7) without front-loading it. The 'name not in the headline yet' line is the key beat: their good decisions yesterday have bought them the option to lead the disclosure rather than react to it.",
        delayMinutes: 0,
        timerMinutes: 3,
        tickerHeadline: "Sky News: Economic Crime Unit makes arrest in alleged FTSE 250 disinformation case; named company yet to confirm",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "SKY NEWS",
          tvHeadline: "ARREST IN FTSE 250 DEEPFAKE PROBE - INSIDER LINK SUSPECTED",
          tvTicker: "SKY NEWS - ECONOMIC CRIME UNIT CONFIRMS OVERNIGHT ARREST - SUSPECT BELIEVED TO BE EMPLOYEE OF AFFECTED FTSE 250 FIRM - COMPANY NOT YET NAMED - INVESTIGATION ONGOING",
          tvReporter: "Tom Parmenter, Sky News Home Affairs",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CLO", "CCO", "CISO"],
        expectedKeywords: ["Economic Crime Unit", "cooperation", "FCA", "control the disclosure", "strong position"],
      },

      // ── INJECT 6-weak: Day 2 morning, HR-led track. ────────────────────
      // Narrative bridge played when df-i6a was answered with B or D
      // (suspend immediately, devices walked out the building). The mess:
      // comms manager has lawyered up overnight, personal devices gone,
      // police frustrated, FCA cooperation case is materially weaker
      // going into the endgame.
      {
        id: "df-i6-weak",
        order: 49,
        title: "The Mess You're In",
        body: "Day 2, 09:15. You walk into the boardroom and the CLO does not look up. They slide a single sheet across to you. 'We have a problem from yesterday. The comms manager left the building at 16:08 with their personal devices. They retained criminal counsel by 19:00. As of 06:00 their solicitor has informed us they will be making no statement and any further contact must go through the firm. The Economic Crime Unit are still working with us but they are - and I quote - frustrated. Without the personal devices the case is largely circumstantial. The FCA will see the same set of facts and they will see that we suspended an employee before involving police, which weakens our cooperation defence. The disclosure is going to be reactive, not proactive. We are still in the game but we are in it on the back foot.' Outside the window, your share price ticker shows a small bounce. It will not last.",
        facilitatorNotes:
          "Pure narrative bridge - no decision required. This inject only fires for groups that handled df-i6a poorly (options B or D, where they suspended the comms manager before police were in position). Do not soften it - the participants need to feel the cost of yesterday's call before they make today's. The CLO's frustration is the key beat: a competent senior team telling the room, in plain language, that they have been put in a worse position by an avoidable choice. This bridge primes the endgame (df-i7) by making clear that they are now playing for damage limitation, not for a leadership win.",
        delayMinutes: 0,
        timerMinutes: 3,
        tickerHeadline: "Apex Dynamics suspends senior communications manager amid internal investigation; police inquiries continuing",
        artifact: {
          type: "slack_thread",
          slackChannel: "dm: CLO to CEO",
          slackMessages: [
            { author: "CLO", role: "direct message", time: "08:42", text: "Reading you in before the 09:15. The personal devices are gone. Counsel was retained by 19:00 last night. We will not get a voluntary interview." },
            { author: "CLO", role: "direct message", time: "08:43", text: "ECU view: case is still live but circumstantial. They asked - politely - why we didn't loop them in before suspending. I don't have a good answer." },
            { author: "CLO", role: "direct message", time: "08:44", text: "FCA cooperation defence is weaker. We can still play it but we're now reacting to the disclosure cycle, not driving it. We need to plan for that in the room this morning." },
            { author: "CLO", role: "direct message", time: "08:45", text: "I'm not blaming anyone. I'm telling you so we go in with the same picture." },
          ],
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CLO", "HR_LEAD", "CISO"],
        expectedKeywords: ["lawyered up", "circumstantial", "FCA", "back foot", "damage limitation"],
      },

      // ── INJECT 7: Endgame decision. Score-routed finale. ───────────────
      // This decision is a tiebreaker, not the sole decider. The ending that
      // plays is selected by the compound average rank of ALL decisions taken
      // in the session so far (including this one), via branchMode: "score"
      // and scoreMax thresholds on the branches. A group that has picked
      // strong options throughout the scenario earns the triumph ending
      // regardless of a late wobble; a group that has picked poorly
      // throughout cannot buy their way out with one final good choice.
      {
        id: "df-i7",
        order: 50,
        title: "The Endgame: How Do You Want This Story To End?",
        body: "Day 2, 16:00. The first 36 hours are over. The forensics are public. The Helix link is being quietly worked through NCSC channels. The internal leak investigation is sealed with the police. Share price has clawed back to -3.1% from the worst point. The narrative is moving in your favour but it is not yet decided. Three things have just landed on your desk simultaneously. The government's AI Safety Institute has invited the CEO to chair a new working group on AI disinformation in financial markets. Your law firm has drafted a pre-emptive defamation lawsuit against the offshore intelligence firm believed to be behind the attack. And your PR firm has prepared a 'minimal disclosure, recovery posture' brief that they say will let the company quietly move on within six weeks. The CEO turns to the room and asks the question that has been hanging over every decision today: 'how do you want this story to end?'",
        facilitatorNotes:
          "This is the endgame, but note the scoring model: the ending you see is decided by the compound rank average across ALL decisions in the session - this one is a tiebreaker, not the sole decider. Groups that have played a strong overall game will earn the triumph ending even on a slightly weaker final call. Groups that have made consistently poor decisions cannot buy their way into a good ending with one late heroic choice. Thresholds: avg rank <= 1.6 = TRIUMPH, <= 2.3 = RECOVERY, <= 3.0 = DIMINISHED, > 3.0 = CATASTROPHIC. The four options here still matter because they contribute to the average and they shape the facilitator's debrief. A is still 'lead from the front', which is almost always the right long-game choice; D is still the vengeful lawsuit path, which is almost always wrong. Use debrief to trace the through-line: which earlier decisions did the most to earn the ending the group received?",
        delayMinutes: 0,
        timerMinutes: 15,
        tickerHeadline: "Apex Dynamics weighs response strategy as AI Safety Institute extends invitation; legal options under review",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "FT LIVE",
          tvHeadline: "APEX DYNAMICS: FROM TARGET TO TEST CASE - WHAT WILL THE BOARD DO NEXT?",
          tvTicker: "FT LIVE - APEX DYNAMICS RECOVERS TO -3.1% - GOVERNMENT AI SAFETY INSTITUTE EXTENDS INVITATION - HELIX CORP CONFIRMS SIMILAR ATTACK - LEGAL ACTION REPORTEDLY UNDER CONSIDERATION - INDUSTRY WATCHES",
          tvReporter: "Helena Marsh, Financial Times Live",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CCO", "CFO", "CISO"],
        expectedKeywords: ["AI Safety Institute", "transparency", "lawsuit", "recovery", "leadership", "long game"],
        recapLine: "and closed the endgame by {{recapFragment}}",
        branchMode: "score",
        decisionOptions: [
          {
            key: "A",
            label: "Lead from the front: accept the AI Safety Institute role, publish a full incident account, brief the industry",
            consequence:
              "The high-credibility path. Apex becomes the case study other companies reference. Long game won. Strongest contribution to the compound score.",
            rank: 1,
            recapFragment: "leading from the front",
          },
          {
            key: "B",
            label: "Quiet competence: focus on internal remediation, brief peers privately, let the story fade",
            consequence:
              "The safe path. Operationally sound but the company never owns the narrative. Respectable contribution to the compound score.",
            rank: 2,
            recapFragment: "choosing quiet competence",
          },
          {
            key: "C",
            label: "Defensive posture: minimal disclosure, no public engagement, follow the PR firm's recovery brief",
            consequence:
              "The fearful path. Short-term safe, long-term corrosive. Pulls the compound score down.",
            rank: 3,
            recapFragment: "adopting minimal disclosure",
          },
          {
            key: "D",
            label: "Counter-attack: file the pre-emptive defamation lawsuit, publicly name the intelligence firm",
            consequence:
              "The path of vengeance. Almost always wrong. Severe drag on the compound score and can flip a good ending into a bad one.",
            rank: 4,
            recapFragment: "filing the lawsuit",
          },
        ],
        // Score-routed: branches are selected by compound rank average, not
        // by the winning vote key. scoreMax is ascending.
        branches: [
          { optionKey: "A", nextInjectId: "df-end1", scoreMax: 1.6 }, // TRIUMPH
          { optionKey: "B", nextInjectId: "df-end2", scoreMax: 2.3 }, // RECOVERY
          { optionKey: "C", nextInjectId: "df-end3", scoreMax: 3.0 }, // DIMINISHED
          { optionKey: "D", nextInjectId: "df-end4", scoreMax: 4.0 }, // CATASTROPHIC
        ],
      },

      // ── ENDING 1: TRIUMPH (Path A) ──────────────────────────────────────
      // Endings are now interactive: a short body + the artifact carry the
      // narrative beat, then a single unranked reflection vote brings the
      // room back into the loop one last time as a structured debrief.
      {
        id: "df-end1",
        order: 60,
        title: "Ending: The Industry Test Case",
        body: "Six weeks later. Share price closed yesterday at +1.8% YTD, ahead of the FTSE 250. The CEO chairs the AI Safety Institute working group on financial-markets disinformation; the Helix CEO joined as deputy chair. The Apex incident report is being studied at three business schools. Last night the CEO was named an FT Person of the Year runner-up. The citation: 'integrity, when paired with disclosure, compounds.'\n\nOne last vote. Looking back over the whole exercise - which earlier call did the most to earn this ending?",
        facilitatorNotes:
          "Best possible ending. Reward the long-game choice but do not narrate the through-line yourself - the reflection vote below is designed to make the group find it. Most groups land on a combination of the early staff-first call (df-i3d), the disciplined forensics handling (df-i2v / df-i5), and the courage of the endgame. Use the vote split as your debrief opener.",
        delayMinutes: 0,
        timerMinutes: 8,
        tickerHeadline: "Apex Dynamics CEO named FT Person of the Year runner-up after landmark AI disinformation response",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "SKY NEWS",
          tvHeadline: "APEX DYNAMICS CEO NAMED FT PERSON OF THE YEAR RUNNER-UP - 'INTEGRITY WHEN PAIRED WITH DISCLOSURE COMPOUNDS'",
          tvTicker: "SKY NEWS - APEX DYNAMICS SHARES +1.8% YTD - AI SAFETY INSTITUTE WORKING GROUP CONVENES - COMMS MANAGER AWAITING TRIAL - JOINT UK-US ENFORCEMENT ACTION ANNOUNCED - GRADUATE HIRING AT FIVE-YEAR HIGH",
          tvReporter: "Ian Whitfield, Sky News Business",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CCO", "CISO", "HR_LEAD"],
        expectedKeywords: ["transparency", "leadership", "long game", "industry", "trust"],
        isEnding: true,
        decisionOptions: [
          {
            key: "A",
            label: "The early staff-first instinct",
            consequence: "Most common answer in groups that played the long game well. Validates the 'people before press' instinct.",
          },
          {
            key: "B",
            label: "The disciplined forensics handling",
            consequence: "Often picked by technical-minded teams. Use to discuss tempo as a strategic asset.",
          },
          {
            key: "C",
            label: "The clean police-led leak investigation",
            consequence: "The procedural answer. Use to discuss how legal hygiene buys the cover for bold public moves.",
          },
          {
            key: "D",
            label: "The endgame courage to lead from the front",
            consequence: "The dramatic answer. True but incomplete - the endgame courage was only available because earlier decisions earned it.",
          },
        ],
      },

      // ── ENDING 2: RECOVERY (Path B) ─────────────────────────────────────
      {
        id: "df-end2",
        order: 60,
        title: "Ending: Quiet Competence",
        body: "Six weeks later. Share price is back within 1.2% of pre-attack levels. Internal remediation is on track and the comms manager has been charged. The CEO declined the AI Safety Institute invitation; the chair was taken by a rival firm's CFO, now the public face of the issue. At the next board meeting, an independent director asks whether Apex 'might have done more with the moment'. There is a long silence.\n\nOne last vote. Was 'quiet competence' the right call for this company?",
        facilitatorNotes:
          "The 'good but not great' ending. Recovery achieved, but the closing image - the silent boardroom - is the point. The reflection vote below is a forced-choice debrief tool: B groups often defend their call, which is fine, but make them articulate the trade-off they accepted.",
        delayMinutes: 0,
        timerMinutes: 8,
        tickerHeadline: "Apex Dynamics shares recover to within 1.2% of pre-attack levels as company completes internal remediation",
        artifact: {
          type: "stock_chart",
          stockTicker: "APEX.L",
          stockCompanyName: "Apex Dynamics plc",
          stockOpenPrice: 482.40,
          stockCurrentPrice: 476.60,
          stockChangePercent: -1.20,
          stockVolume: "8.2M",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CFO", "CISO", "HR_LEAD"],
        expectedKeywords: ["recovery", "remediation", "missed opportunity", "quiet competence"],
        isEnding: true,
        decisionOptions: [
          {
            key: "A",
            label: "Yes - recovery is the win",
            consequence: "The pragmatic answer. Use to ask whether this team would defend the same call if the share price had recovered slower.",
          },
          {
            key: "B",
            label: "Yes for this team, but a sharper comms function would change the answer",
            consequence: "The capability answer. Use to discuss what investments in comms maturity would have unlocked the leadership ending.",
          },
          {
            key: "C",
            label: "No - we left credibility on the table",
            consequence: "The leadership answer. Use to discuss when 'safe' is actually the riskiest long-term play.",
          },
          {
            key: "D",
            label: "No - the silent boardroom is the real ending",
            consequence: "The cultural answer. Use to discuss how unspoken decisions accumulate into identity.",
          },
        ],
      },

      // ── ENDING 3: DIMINISHED (Path C) ───────────────────────────────────
      {
        id: "df-end3",
        order: 60,
        title: "Ending: The Long Shadow",
        body: "Six weeks later. Share price is still down 6.4% YTD, lagging the FTSE 250 by nine points. Two institutional investors have publicly downgraded, citing 'concerns about communications maturity'. Three senior executives have resigned in the last month, all citing some version of 'I'm no longer sure what we stand for'. At Davos last week, the Helix CEO referred to 'one peer in our sector that chose to look away'. Everyone in the room knew who he meant.\n\nOne last vote. Where did this story actually go wrong?",
        facilitatorNotes:
          "The 'fear ending' and it is meant to bite. The company is not destroyed but it is materially worse off, and the damage is invisible from the inside until too late. The reflection vote forces the group to locate the wound. Most groups land on (D) once they trace the cascade - which is the lesson.",
        delayMinutes: 0,
        timerMinutes: 8,
        tickerHeadline: "Sunday Times: 'The company that survived a deepfake attack and still lost' - Apex Dynamics analysis",
        artifact: {
          type: "news_headline",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CCO", "CFO"],
        expectedKeywords: ["minimal disclosure", "long shadow", "identity", "trust erosion", "missed opportunity"],
        isEnding: true,
        decisionOptions: [
          {
            key: "A",
            label: "The early under-communication to staff",
            consequence: "Locates the wound at df-i3d. Often the right answer for groups whose internal trust collapsed first.",
          },
          {
            key: "B",
            label: "The cautious forensics handling",
            consequence: "Locates the wound at df-i2v / df-i5. The 'tempo' answer.",
          },
          {
            key: "C",
            label: "The minimal-disclosure brief at the endgame",
            consequence: "Locates the wound at df-i7. The 'we knew the moment when we lost it' answer.",
          },
          {
            key: "D",
            label: "All of the above, compounding",
            consequence: "The systems answer and usually the most accurate one. Use to teach that 'minor' choices in early injects compound silently into the ending.",
          },
        ],
      },

      // ── ENDING 4: CATASTROPHIC (Path D) ─────────────────────────────────
      {
        id: "df-end4",
        order: 60,
        title: "Ending: The Counter-Attack That Backfired",
        body: "Six weeks later. The defamation lawsuit was counter-filed within 48 hours. Discovery forced internal Day-1 messages onto the FT front page, including executives speculating that the video might be 'closer to the truth than we're admitting'. The FCA has opened a parallel investigation into Apex's own conduct. Share price -22% YTD. Two NEDs have resigned. Last night, the CLO who had advised against the lawsuit said only one thing before leaving the room: 'I told you so.'\n\nOne last vote. If you could rewind 48 hours, where would you intervene?",
        facilitatorNotes:
          "Worst ending. Pre-emptive litigation in a reputational crisis is almost always wrong - it gives the attacker a free platform and forces evidence into discovery. The 'closer to the truth' detail is ambiguous on purpose: it doesn't mean the video was real, it means execs were privately worrying, and that worry leaks badly under disclosure. Don't shame the D-vote groups; use the reflection vote below to make them articulate the exact moment they would replay.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Apex Dynamics shares close -22% as FCA opens parallel investigation following lawsuit disclosure leak",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "BBC NEWS",
          tvHeadline: "APEX DYNAMICS LAWSUIT BACKFIRES - INTERNAL MESSAGES LEAKED - SHARES DOWN 22% - CHAIRMAN UNDER PRESSURE",
          tvTicker: "BBC NEWS BUSINESS - APEX DYNAMICS -22% YTD - FCA OPENS PARALLEL INVESTIGATION - TWO NEDS RESIGN - PROXY ADVISORS RECOMMEND AGAINST CEO CONTRACT RENEWAL - LAWSUIT COUNTER-FILED",
          tvReporter: "Marcus Reilly, BBC News, Westminster",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CFO", "CCO"],
        expectedKeywords: ["lawsuit", "backfire", "discovery", "FCA", "reputational collapse", "defensive"],
        isEnding: true,
        decisionOptions: [
          {
            key: "A",
            label: "Refuse the lawsuit, take the AI Safety Institute role instead",
            consequence: "Single-decision rewind. Use to ask whether the group would have had the standing to take the chair after the earlier choices that led here.",
          },
          {
            key: "B",
            label: "Refuse the lawsuit, take the quiet recovery posture",
            consequence: "The pragmatic rewind. Trades the worst ending for the recovery ending.",
          },
          {
            key: "C",
            label: "Lock down internal comms before any external action",
            consequence: "The discovery-aware answer. Names the actual mechanism that did the damage.",
          },
          {
            key: "D",
            label: "Different choices much earlier in the day",
            consequence: "The systems answer. Catches that the lawsuit was the symptom, not the cause - by Day 2 the room had already learned a defensive posture.",
          },
        ],
      },
    ],
  },
];
