import type { Scenario } from "@/types";

export const RANSOMWARE_SCENARIO: Scenario =
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
  };
