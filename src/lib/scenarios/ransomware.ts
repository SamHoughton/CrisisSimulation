import type { Scenario } from "@/types";

export const RANSOMWARE_SCENARIO: Scenario = {
  id: "tpl-ransomware-001",
  title: "Ransomware: The Quiet Beacon",
  description:
    "A single low-confidence outbound DNS beacon at 03:14 from a treasury workstation grows over five days into the worst week in Veridian Power's history. Rebuilt 25-inject arc with 9 decision points and 4 score-routed endings. Tests detection instinct, ICO notification timing, RNS obligations, ransom negotiation, PSR outreach, insurance coupling and parliamentary exposure, from the first quiet alert to long-term recovery.",
  type: "RANSOMWARE",
  difficulty: "CRITICAL",
  durationMin: 180,
  isTemplate: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2026-04-14T00:00:00Z",
  coverGradient: "135deg, #050508 0%, #1a0008 40%, #E82222 100%",
  regulatoryFrameworks: ["NIS Regs 2018", "UK GDPR / ICO", "OFAC Sanctions", "FCA MAR / RNS", "Cyber Essentials"],
  realOutcome:
    "Drawn from real UK ransomware incidents between 2022 and 2024, including operations attributed to ALPHV/BlackCat, Clop and LockBit against utilities and financial services firms.\n\nRoughly 65% of organisations that paid received working decryption keys. Very few recovered exfiltrated data. OFAC reviewed several UK payments to groups on the SDN list and opened sanctions enquiries. The ICO fined organisations that held back from notifying within 72 hours, citing deliberate delay as an aggravating factor in at least one case. Exposure of Priority Services Register data triggered parliamentary questions and direct Ofgem engagement in multiple incidents.\n\nEvery post-incident review found the same thing. What the team decided in the first 90 minutes set the regulatory and reputational picture for the next 18 months.",
  roles: ["CEO", "CISO", "CFO", "CLO", "CCO", "COO"],
  briefing:
    "You are the executive leadership team of Veridian Power plc, a FTSE 250 UK energy retailer with 3.2 million domestic supply contracts and a designated Operator of Essential Services under the NIS Regulations 2018. Your back-office runs the day-ahead wholesale trading desk. Your front-office holds the Priority Services Register, the statutory list of 84,000 vulnerable customers who depend on uninterrupted power for medical equipment, dialysis, and oxygen. It is 03:14 on a Monday. The duty SOC analyst flags a single anomaly. Over the next five days you will discover what it really was. You will be judged on what you did at 03:14, and on every decision after.",

  injects: [

    {
      id: "rw-i1",
      commandTier: "TACTICAL",
      tierSkipSummary: "At 03:14, the SOC detected a suspicious outbound DNS beacon from a Treasury workstation - precisely periodic, machine-driven, not human. The on-call analyst initiated a quiet forensic investigation rather than triggering a hard alert, preserving the intelligence advantage.",
      order: 0,
      scenarioDay: 1,
      scenarioTime: "03:14",
      title: "Defender Alert: Outbound Beacon, Treasury Workstation",
      body: "03:14. Microsoft Defender for Endpoint fires a low-confidence alert: a single workstation in the Treasury team is making periodic outbound DNS lookups to a domain that resolved earlier today and again 47 minutes ago. The lookups are 3 minutes apart, regular as a clock. The workstation belongs to a senior treasury analyst who is asleep at home. SOC has 2 analysts on duty. The night shift lead asks: do we wake people, or do we open a ticket?\n\nThe alert severity is MEDIUM. The domain is not on any known blocklist. There have been 7 similar low-confidence alerts this month, all false positives. This one has one additional signal: the DNS lookup pattern is precisely periodic, not human-driven.",
      facilitatorNotes:
        "This IS the first sign of an ALPHV intrusion via a phished VPN credential five days ago. The attacker is presently mapping the OT/IT boundary and staging exfiltration. Option A (quiet forensic capture) is the rewarded answer. It preserves intelligence without tipping the attacker. Option C is a strong second-best. Option B is loud and effective but burns the intelligence advantage. Option D is the catastrophic call. This is exactly how every major ransomware after-action report begins.\n\nKey coaching question: what is the asymmetry of being wrong in each direction? If you over-react to a false positive, you've wasted a night. If you under-react to a real incident, the cost is measured in months and millions.",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "Energy regulator Ofgem reviewing cyber resilience standards for retail suppliers | week ahead",
      artifact: {
        type: "siem_alert",
        siemAlertId: "DEFENDER-2026-44912",
        siemSeverity: "MEDIUM",
        siemSourceIp: "10.42.18.71 (TREASURY-LDN-019)",
        siemEventType: "Periodic Outbound DNS, Low-Reputation Domain, Single Host",
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
          label: "Escalate to Mandiant on retainer immediately: pay the after-hours fee, wake the CISO",
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

    {
      id: "rw-i2a",
      commandTier: "TACTICAL",
      tierSkipSummary: "By 05:30, forensic imaging had confirmed an ALPHV intrusion via a compromised VPN credential used five days earlier. The attacker had touched 11 hosts including a jump box on the IT/OT boundary. Mandiant were called as a courtesy - ETA 06:30. Encryption had not yet begun.",
      order: 10,
      scenarioDay: 1,
      scenarioTime: "05:30",
      title: "Path A: The Slow Trace",
      body: "05:30. The forensic image is yielding gold. Your second-line analyst has reconstructed the attacker's lateral movement: a phished VPN credential belonging to a treasury contractor was used five days ago to plant a foothold. The attacker has touched 11 hosts, including one jump box on the boundary between IT and the wholesale trading desk. They have not yet reached the customer billing systems or the Priority Services Register database.\n\nMandiant are now en route, called as a courtesy not a panic. Their ETA is 06:30. You have something most ransomware victims never get: time.\n\nThe CISO has a choice: brief the CEO now at 05:30, or wait for Mandiant to arrive and give leadership a complete picture at 07:00.",
      facilitatorNotes:
        "Rewarded outcome of Option A. The team has the intelligence advantage. The pressure now is whether they can resist the temptation to act loudly and instead complete the picture before moving.\n\nThe brief-now vs wait-for-Mandiant question is a good discussion point but not a formal vote. Nudge the team toward briefing the CEO now. The governance clock is already running regardless of intelligence completeness.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Power trading volumes light overnight as wholesale market opens calmly",
      artifact: {
        type: "voicemail",
        voicemailCaller: "Abena Osei, SOC Night Lead",
        voicemailCallerNumber: "+44 7700 900271",
        voicemailDuration: "1:14",
        voicemailTime: "05:28",
        voicemailTranscript:
          "Sarah, it's Abena at the SOC. Time is 05:28. I need you to see this before Mandiant arrive. We've got something on the forensic image. The attacker staged a directory on TREASURY-LDN-019 labelled PHANTOMCOIL-STAGE. Inside: eleven host profiles, three credential dumps, and what looks like a partial copy of a database export. The filename is PSR_REPLICA_PARTIAL. I don't want to say that over email. We still have time. They haven't encrypted anything. Call me back directly. Do not email this.",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CISO", "COO"],
      expectedKeywords: ["lateral movement", "VPN", "credential", "PSR", "trading"],
    },

    {
      id: "rw-i2b",
      commandTier: "TACTICAL",
      tierSkipSummary: "By 05:30, the team hard-segmented the Treasury VLAN - effective containment, but the move was visible to the attacker, who began accelerating. Mandiant were engaged. 11 hosts confirmed compromised; the encryption clock is now running faster.",
      order: 10,
      scenarioDay: 1,
      scenarioTime: "04:02",
      title: "Path B: The Segment Sweep",
      body: "04:02. The treasury VLAN is dark. Your sweep has found two more endpoints with the same beacon, both on the wholesale trading floor's back-office. Defender lights up at 04:09 with a new alert from a different segment. A file server in the customer billing tier. The attacker noticed. They are accelerating.\n\nYou have stopped one host but you can hear the fire spreading through the walls. Mandiant have been called and are 90 minutes out. The CISO is on the phone. The first question is: do you keep sweeping aggressively or hold until Mandiant arrive and you have a coordinated picture?",
      facilitatorNotes:
        "Consequence of Option B. Fast and effective but it surrendered the intelligence advantage. The team has lost the chance to map the full intrusion quietly. They are now in a race.\n\nDrive home: loud containment has costs that don't appear in the textbook. The attacker now knows they've been detected and has nothing to lose from accelerating. Every minute of delay in coordinated response from here is exponentially more expensive.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Power trading volumes light overnight as wholesale market opens calmly",
      artifact: {
        type: "siem_alert",
        siemAlertId: "DEFENDER-2026-44919",
        siemSeverity: "HIGH",
        siemSourceIp: "10.51.2.118 (BILLING-FILE-04)",
        siemEventType: "Suspicious File Activity, Encryption Pattern, Adjacent Segment",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CISO", "COO"],
      expectedKeywords: ["segment", "spread", "billing", "race", "Mandiant"],
    },

    {
      id: "rw-i2c",
      commandTier: "TACTICAL",
      tierSkipSummary: "Mandiant were engaged on retainer immediately and on-site by 06:30. They confirmed two additional compromised endpoints beyond the initial beacon host and provided a full scope picture before the first Gold-level decisions were needed.",
      order: 10,
      scenarioDay: 1,
      scenarioTime: "06:30",
      title: "Path C: The Clean Escalation",
      body: "06:30. Mandiant arrived 12 minutes ago. Their first call: 'You did the right thing. This is real, it is active, and you have caught it before encryption.' Their second call, 18 minutes later: two further compromised endpoints found, both on the trading floor back-office. No sign of compromise in the customer billing tier or the PSR database yet.\n\nThe attacker still does not know they have been seen. You bought the right thing with the after-hours fee: time, and a partner who has done this 400 times.\n\nMandiant's lead assessor says: 'You have a window. It won't stay open.'",
      facilitatorNotes:
        "Reward for Option C. Slightly less intelligence advantage than Option A (Mandiant moves at Mandiant's pace) but with an external partner already engaged, which materially de-risks every later decision.\n\nThe CFO should be watching the retainer clock. This is when IR costs start. Ask: at what point do you formally declare a P1 Incident? What governance obligations does that trigger?",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Power trading volumes light overnight as wholesale market opens calmly",
      artifact: {
        type: "email",
        emailFrom: "incident@mandiant.com",
        emailTo: "s.khatun@veridianpower.co.uk",
        emailSubject: "Veridian Power: IR Engagement Confirmed, Retainer Reference MAN-VRD-2026-0441",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CISO", "COO"],
      expectedKeywords: ["Mandiant", "engaged", "trading", "billing", "PSR"],
    },

    {
      id: "rw-i2d",
      commandTier: "TACTICAL",
      tierSkipSummary: "A second alert followed the first. By the time the morning shift arrived at 07:30, the situation had escalated significantly. Mandiant were engaged. 11 hosts are confirmed compromised.",
      order: 10,
      scenarioDay: 2,
      scenarioTime: "04:11",
      title: "Path D: The Second Alert",
      body: "Tuesday, 04:11. 25 hours after the first beacon.\n\nThe morning shift's 14:00 SOC handover yesterday flagged the closed ticket as 'probable false positive' and moved on. Defender is now firing simultaneously across 18 endpoints on three segments. A junior analyst calls the CISO at home: 'It's bad. There's a note on one of them.'\n\nThe note begins: 'Veridian Power. We have been inside for six days. We have the PSR database. We have your wholesale trading book. You have 72 hours.'\n\nMandiant are being called, the CEO is being called, and the morning markets are opening in two hours. The attacker has had a full additional day of uncontested access.",
      facilitatorNotes:
        "Brutal consequence of Option D. The team is now 25 hours behind with no intelligence advantage, no forensic baseline, and the attacker holds all the cards including the PSR.\n\nThis path exists to make the lesson visceral: the easy call at 03:14 becomes the impossible call at 04:11 the next day. Let the weight land before moving on. The team should feel the compounding effect of one bad call made in the dark.",
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

    {
      id: "rw-i2v",
      commandTier: "TACTICAL",
      tierSkipSummary: "The CISO, COO, and CLO convened for a first call at 05:30. Initial containment had been established and Mandiant were en route. The question of whether to brief the CEO immediately or wait for a complete picture was discussed - the governance clock was already running.",
      order: 20,
      scenarioDay: 1,
      scenarioTime: "06:00",
      title: "The First Call",
      body: "The CISO has confirmed: this is real, it is active, and the attacker has at minimum touched the boundary between IT and the wholesale trading systems. The Priority Services Register database may or may not be in scope. You do not yet know for certain.\n\nThe CEO is on the line and has one question: 'Who do we call first?'\n\nThis is not a procedural question. It is a tone-setting question for the next five days. The decision you make now will be referenced in every regulator letter, every board paper, and every press account of how Veridian Power responded.",
      facilitatorNotes:
        "Under NIS Regs 2018, as a designated OES the company has a 72-hour notification obligation to NCSC for any incident with significant impact on continuity of essential services. Ofgem is the sector regulator and will need to be told eventually but is not the first call. NCSC first sets a cooperative tone that pays dividends throughout. Calling Ofgem first inverts the statutory chain of command. Ofgem will politely correct you.\n\nNote that the 72-hour NIS clock runs separately from the GDPR Art. 33 ICO clock. Many teams conflate them. The CLO and CISO should be clear on both.",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline: "Energy retailers face 'cyber resilience year' as Ofgem raises NIS reporting bar",
      artifact: {
        type: "email",
        emailFrom: "ciab@ncsc.gov.uk",
        emailTo: "s.khatun@veridianpower.co.uk",
        emailSubject: "NCSC CiAB: Cyber Incident, Automatic Acknowledgement, Reference NCSC-INC-2026-8841",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CISO", "CLO"],
      expectedKeywords: ["NCSC", "NIS", "Ofgem", "72 hours", "OES", "board"],
      recapLine: "made the first call to {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "NCSC first: file the NIS-mandated notification, ask for technical support, lock in the cooperative posture",
          consequence:
            "NCSC respond within 40 minutes with a named incident handler. The notification clock is honoured. Ofgem will later note the proactive escalation as evidence of good NIS culture.",
          rank: 1,
          recapFragment: "NCSC under NIS Regs",
        },
        {
          key: "B",
          label: "Board chair first: this is a governance moment and the chair must own the room from the start",
          consequence:
            "Defensible but slow. The chair is on holiday in Italy and is reachable in 90 minutes. Notification to NCSC happens at hour 4 instead of hour 1.",
          rank: 3,
          recapFragment: "the board chair",
        },
        {
          key: "C",
          label: "CFO and CEO consortium: lock down the financial and trading exposure before anything goes external",
          consequence:
            "A logical instinct under attack but it consumes 90 minutes of internal pre-meeting before any regulator is told. Internal alignment is high; external posture is set late.",
          rank: 2,
          recapFragment: "the internal CFO/CEO consortium",
        },
        {
          key: "D",
          label: "Ofgem first: the sector regulator should hear it from you before NCSC routes it through the wires",
          consequence:
            "Ofgem appreciate the call but politely tell you that under NIS the first call is to NCSC. You have inverted the chain of command. Ofgem note this in their later assessment.",
          rank: 3,
          recapFragment: "Ofgem ahead of NCSC",
        },
      ],
    },

    {
      id: "rw-board",
      commandTier: "STRATEGIC",
      order: 22,
      scenarioDay: 1,
      scenarioTime: "05:30",
      title: "05:30 - The Chairman Is Asleep",
      body: "05:30. The Company Secretary has left you a voicemail. Sir David Hartley, the Board Chair, has been forwarded a screenshot of the Defender alert by one of the NEDs who has a contact in the SOC. The Chairman's PA says he is awake and asking what is happening. You have not yet confirmed whether this is a real incident. The ICO notification window is running. The board does not have an established incident notification protocol below the level of a confirmed material breach.\n\nDo you brief the Chairman now, or hold until you have something confirmed to say?",
      facilitatorNotes:
        "This is about governance under uncertainty. The trap: briefing the Chairman before you know what you're saying creates a second stakeholder to manage who now has incomplete information and may act on it. Not briefing him when he is already asking creates a governance failure and a trust problem. Option B is the strongest answer for most organisations. Option A creates a well-informed board but risks panic. Option C is defensible but requires the Company Secretary to carry an uncomfortable message. Option D is the trap. Regulatory guidance is clear that boards must be informed promptly of material cyber incidents.",
      delayMinutes: 15,
      timerMinutes: 0,
      tickerHeadline: "Energy retailers face 'cyber resilience year' as Ofgem raises NIS reporting bar",
      artifact: {
        type: "voicemail",
        voicemailCaller: "Margaret Osei",
        voicemailCallerNumber: "Company Secretary",
        voicemailDuration: "0:53",
        voicemailTime: "05:28",
        voicemailTranscript:
          "It's Margaret. Sir David has had a message from Peter Cranfield. I don't know how Peter found out, but the Chairman is awake and he wants to know what's happening. I've told him you're assessing. He said 'assessing what, exactly'. I need to know what to say to him. Call me back.",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "CCO"],
      decisionOptions: [
        {
          key: "A",
          label: "Brief the Chairman now: full picture as we know it",
          consequence:
            "Board is informed early but with incomplete information. Chairman may convene an emergency board call before you are ready.",
          rank: 2,
          recapFragment: "an early board briefing before scope was confirmed",
        },
        {
          key: "B",
          label: "Brief the Chairman at 08:00: commit to a structured update when we know more",
          consequence:
            "Buys two hours to confirm scope. Risk: if the incident escalates publicly before 08:00, the board finds out from the market.",
          rank: 1,
          recapFragment: "a structured hold until 08:00 to brief from a confirmed position",
        },
        {
          key: "C",
          label: "Ask the Company Secretary to hold the Chairman: 'nothing confirmed yet'",
          consequence:
            "Governance risk: the Chairman has already been told something is happening. A 'nothing to see here' message will not hold.",
          rank: 3,
          recapFragment: "a holding response through the Company Secretary",
        },
        {
          key: "D",
          label: "Wait: board notification is only required once a material incident is confirmed",
          consequence:
            "Technically defensible but practically dangerous. The Chairman is already awake and asking. Silence now reads as concealment.",
          rank: 4,
          recapFragment: "a decision to withhold until materiality was confirmed",
        },
      ],
    },

    {
      id: "rw-i2x",
      commandTier: "STRATEGIC",
      order: 25,
      scenarioDay: 1,
      scenarioTime: "05:47",
      title: "05:47 - ICO Notification Posture",
      body: "05:47. While you were managing the first external call, ALPHV posted what they call 'proof of access' on their dedicated leak site: a directory listing of the PSR folder structure, a 3-row header sample from the billing system, and a board paper dated six weeks ago. No actual customer records yet. This is the opening move of the extortion pressure campaign.\n\nThe DPO has just walked into the war room with a single question.\n\n'Under UK GDPR Article 33, we have 72 hours to notify the ICO from the moment we become aware of a personal data breach. The question is when that clock started. It is arguable from 03:14 when the SOC flagged anomalous access, and it definitely started at 04:11 when bulk encryption confirmed data was compromised. Either way, we are already between 90 minutes and 2 hours 36 minutes into the 72-hour window. The ICO can, and does, treat late notification as an aggravating factor in enforcement decisions. What is our posture?'",
      facilitatorNotes:
        "A decision point most teams haven't thought about before an incident, and one that the ICO consistently cites in enforcement notices.\n\nOption A (file now, amend later) is the ICO's own preferred approach. They would rather receive a provisional notification that is later updated than a complete one filed late. The ICO's own guidance says: 'It is acceptable to provide information in phases where it is not possible to provide all the information within 72 hours.'\n\nOption B is the most common real-world choice and the most commonly penalised. Option C is legally credible but burns time. Option D confuses the GDPR ICO obligation with the NIS Ofgem/NCSC obligation. They are separate regimes.\n\nAsk the CLO: can you cite the specific ICO guidance on phased notifications?",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline: "ICO publishes updated guidance on personal data breach notification timelines",
      artifact: {
        type: "dark_web_listing",
        darkWebSiteName: "ALPHV-BLACKCAT Expose",
        darkWebOnionUrl: "alphvblkz9mnfxt6.onion/veridian-access-proof",
        darkWebTitle: "VERIDIAN POWER PLC: PROOF OF ACCESS, PAYMENT WINDOW OPEN",
        darkWebPrice: "PENDING: $9.4M ransom window active",
        darkWebRecordCount: "Proof of access only, full dataset held pending payment",
        darkWebSampleRows: [
          {
            name: "[DIRECTORY LISTING ONLY]",
            account: "PSR_MASTER_LIVE: 84,247 rows",
            sortCode: "BILLING_DB: 3.2M accounts",
            email: "TRADING_BOOK: Day-ahead Q1 2026",
          },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CLO", "CISO", "CEO"],
      expectedKeywords: ["ICO", "72 hours", "Article 33", "GDPR", "DPO", "notification", "phased"],
      recapLine: "took the ICO notification posture of {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "File a holding notification to the ICO now: we have enough to trigger Art. 33 and the ICO prefers phased notifications",
          consequence:
            "ICO acknowledge within 2 hours and assign a case officer. The notification is marked on-time. When the scope is later confirmed it is filed as an amendment, not a fresh late notification. The ICO's final report notes 'prompt and transparent engagement'.",
          rank: 1,
          recapFragment: "a prompt phased notification to the ICO",
        },
        {
          key: "B",
          label: "Wait until scope is confirmed: filing a premature notification wastes the ICO's time and prejudices the investigation",
          consequence:
            "Scope is not fully confirmed until Day 3. The ICO notification is filed at hour 62, technically within 72 hours, but the ICO asks why it took so long. The delay features in their enforcement assessment.",
          rank: 3,
          recapFragment: "a delayed ICO notification pending scope confirmation",
        },
        {
          key: "C",
          label: "Take external legal counsel opinion on when the 72-hour clock started before filing anything",
          consequence:
            "Counsel respond in 4 hours with an opinion that Art. 33 was triggered at 04:11 at the latest. The notification is filed 5 hours after the war room started. Legal defensibility is preserved, timeliness is slightly compromised.",
          rank: 2,
          recapFragment: "seeking legal counsel before filing",
        },
        {
          key: "D",
          label: "Notify Ofgem first under NIS Regs and ask them to coordinate with the ICO on our behalf",
          consequence:
            "Ofgem inform you, politely, that NIS Regs and GDPR are separate regimes with separate notification obligations. The GDPR clock is to the ICO not Ofgem. You file to ICO at hour 8. The ICO note the confusion.",
          rank: 4,
          recapFragment: "routing the ICO notification through Ofgem",
        },
      ],
    },

    {
      id: "rw-i3",
      commandTier: "TACTICAL",
      tierSkipSummary: "At 04:11, a bulk encryption event began across the network. The technical team moved immediately to isolate affected segments, notify Mandiant, and escalate. The incident had crossed from investigation to active ransomware attack.",
      order: 30,
      scenarioDay: 1,
      scenarioTime: "04:11",
      title: "04:11 - Bulk Encryption Event",
      body: "04:11. A coordinated encryption event has hit 217 servers across the back-office estate.\n\nConfirmed encrypted: customer billing, the wholesale trading book reconciliation system, payroll, and, critically, a read-replica of the Priority Services Register. The PSR holds the names, addresses, medical conditions and emergency contacts of 84,000 vulnerable customers. The replica was last synced at 01:00. Mandiant assess that the master database is intact but the replica was almost certainly exfiltrated before encryption.\n\nThe lights are still on for customers. For now.\n\nEncrypted files: 1,247,891. Affected hosts: 34 confirmed, sweeping for more. The trading desk has gone manual.",
      facilitatorNotes:
        "The PSR is the unique cruelty of an energy-sector breach. Unlike a financial breach, the data is not just sensitive. It is the data the company holds because the customers are vulnerable.\n\nThe 'lights are still on' line is critical: this is not yet a power outage incident, it is a data and systems incident. That distinction is what stops the COBR call, but it also shapes the regulator's view of severity.\n\nAsk: what is the difference between 'data breach' and 'critical infrastructure incident'? Which reporting regime applies to each?",
      delayMinutes: 0,
      timerMinutes: 12,
      tickerHeadline: "BREAKING: Major UK energy retailer reportedly hit by overnight cyber incident | supply unaffected",
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
            "Spread halted. Trading desk reverts to phone-and-spreadsheet for the day. Estimated £1.8M in suboptimal hedging but the attacker is locked out cleanly. PSR replica preserved as forensic evidence.",
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
          label: "Full systems-wide shutdown, including customer-facing, until Mandiant gives the all-clear",
          consequence:
            "Customer self-service portal goes dark. 740,000 customers get an error page in the first hour. Trading desk goes manual. Spread halted. The reputational cost of the dark portal will arrive within 6 hours.",
          rank: 2,
          recapFragment: "a full systems-wide shutdown",
        },
        {
          key: "D",
          label: "Hold and observe: let Mandiant complete their forensic loop before any large containment move",
          consequence:
            "Encryption continues to spread for another 90 minutes. By 05:45 the trading book reconciliation is unrecoverable from production. Mandiant arrive to find a worse situation than they were briefed on.",
          rank: 4,
          recapFragment: "holding and observing while the encryption spread",
        },
      ],
    },

    {
      id: "rw-insurance",
      commandTier: "STRATEGIC",
      order: 32,
      scenarioDay: 1,
      scenarioTime: "07:45",
      title: "07:45 - The Beazley Clock Is Running",
      body: "07:45. Your General Counsel has just flagged the cyber insurance retainer. Veridian Power holds a £20m cyber policy with Beazley. The policy requires notification of a potential claim within 4 hours of discovery of an incident, and the incident retainer with Mandiant was activated at 04:30. That window closes at 08:30. The policy also specifies that Beazley's panel law firm (Weightmans) must be the primary legal adviser on any matter with regulatory or litigation exposure, which means your current instruction to external counsel may need to be restructured. Beazley's duty officer is available now.",
      facilitatorNotes:
        "Classic insurance coupling problem. The 4-hour notification requirement is real in most UK cyber policies and is frequently missed. Key tensions: (1) calling Beazley now means telling an insurer you have a live ransomware incident before you know the scope. That's fine legally but creates a paper trail and hands control partly to the insurer; (2) the panel counsel clause is significant. Most boards don't know this exists until they're in an incident; (3) Option C is the trap. Missing the notification window is a coverage risk. Option A is the right answer. Note for facilitators: this is often the moment in real incidents where organisations discover their insurance policy is 3 years old and has never been read by anyone in the room.",
      delayMinutes: 10,
      timerMinutes: 0,
      tickerHeadline: "Energy retailers face 'cyber resilience year' as Ofgem raises NIS reporting bar",
      artifact: {
        type: "internal_memo",
        memoTitle: "Cyber Insurance: Notification Obligations and Panel Counsel Instruction",
        memoClassification: "PRIVILEGED AND CONFIDENTIAL: LEGAL ADVICE",
        memoTo: "CEO, CFO, CISO",
        memoFrom: "General Counsel",
        memoDate: "07:43 Day 1",
        memoRef: "VPL/LEGAL/CI-001",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CFO", "CLO"],
      decisionOptions: [
        {
          key: "A",
          label: "Notify Beazley now: activate the retainer and engage panel counsel",
          consequence:
            "Coverage protected. Insurer's panel lawyers take a seat at the table. Mandiant instruction may need restructuring.",
          rank: 1,
          recapFragment: "early Beazley notification and panel counsel activation",
        },
        {
          key: "B",
          label: "Call Beazley but request 24 hours before formal notification: scope still unknown",
          consequence:
            "Beazley will not agree. The notification requirement is in the policy. This call will be logged and used if coverage is disputed.",
          rank: 3,
          recapFragment: "an attempt to negotiate the notification timeline with Beazley",
        },
        {
          key: "C",
          label: "Wait until scope is confirmed: notify Beazley once we know what we're claiming",
          consequence:
            "Coverage risk. The 4-hour window will close at 08:30. Missing it gives Beazley grounds to contest the claim.",
          rank: 4,
          recapFragment: "a decision to delay Beazley notification until scope was confirmed",
        },
        {
          key: "D",
          label: "Notify Beazley but retain existing external counsel: review panel clause later",
          consequence:
            "Notification is timely but the panel counsel clause creates a coverage dispute risk if litigation follows.",
          rank: 2,
          recapFragment: "timely Beazley notification while retaining existing counsel",
        },
      ],
    },

    {
      id: "rw-i3b",
      commandTier: "STRATEGIC",
      order: 35,
      scenarioDay: 1,
      scenarioTime: "08:47",
      title: "08:47 - All-Company Slack: The Lights Are On But Nobody's Working",
      body: "08:47. The morning shift has arrived at offices across the country to find their computers dark, their shared drives returning errors, and their email offline. No official word has come from above. The #all-company Slack channel has filled itself.\n\nThe head of customer operations emails the COO: 'Call centre is at 6x normal volume. CRM is down. Staff are handling 4,000 inbound calls per hour with notepads and pen. I have 47 agents in tears. BBC has called the press line three times. Please tell me something.'\n\nThe wholesale trading desk sends a separate message: 'Day-ahead position is unhedged by approximately £2.3M. Running on manual until the rec system comes back. Bank counterparties are asking questions.'",
      facilitatorNotes:
        "No vote on this inject. It is a human moment. Let it breathe.\n\nThe Slack thread shows the human cost before any external comms decision has been made. Prompt the CCO and COO: what is the internal comms strategy? Staff are finding out from the BBC rather than their own leadership. Every hour of silence costs internal trust.\n\nThis inject sets up rw-i3a (market comms) and rw-i3d (Times decision) by showing what is happening on the inside while leaders debate the outside.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Veridian Power staff report widespread system outages | company silent",
      artifact: {
        type: "slack_thread",
        slackChannel: "#all-company",
        slackMessages: [
          { author: "Dave Chen", role: "Head of IT Ops", time: "08:31", text: "Email is down, please be patient. IT are working on it. DO NOT restart your machine." },
          { author: "Rachel Okafor", role: "Finance Analyst", time: "08:34", text: "I can't open any of my files. The spreadsheets say 'file corrupted'. What's happening?" },
          { author: "Marcus Webb", role: "Customer Services", time: "08:36", text: "The call centre CRM is completely down. We have 800 customers on hold and no system to log them. Someone please tell us what to do." },
          { author: "Jess Tang", role: "Corporate Comms", time: "08:39", text: "BBC News are on the phone asking for comment. They know. @press-team, where is the holding line?" },
          { author: "Liam O'Sullivan", role: "Trading Analyst", time: "08:42", text: "Trading book rec system is not responding. Running manual. Day-ahead gas position unhedged. Counterparties are asking if we're okay." },
          { author: "IT Support", role: "IT Support", time: "08:45", text: "@channel. IMPORTANT: Do NOT attempt to open any files. Do NOT restart your computer. Do NOT connect to the VPN from home. Contact your line manager and wait for further instructions." },
          { author: "Rachel Okafor", role: "Finance Analyst", time: "08:46", text: "There's a .txt file on my desktop called PHANTOMCOIL_README.txt Should I open it??" },
          { author: "Marcus Webb", role: "Customer Services", time: "08:47", text: "Same file on mine. My son just texted me a link to the BBC. Is this a ransom attack? Are we on the news?" },
        ],
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CCO", "COO", "CEO"],
      expectedKeywords: ["staff", "internal comms", "CRM", "trading", "BBC", "silence"],
    },

    {
      id: "rw-i3a",
      commandTier: "STRATEGIC",
      order: 38,
      scenarioDay: 1,
      scenarioTime: "09:12",
      title: "09:12 - VRD.L Is Moving",
      body: "09:12. Veridian Power opened on the London Stock Exchange at 1,612 pence, down 12.7% on yesterday's close. By 09:12 the stock has passed 14.8 million shares traded. The 30-day average daily volume is 2.1 million. Someone in the market knew last night.\n\nThe FCA has called the company secretary asking whether a regulatory news announcement (RNS) is being prepared. Your NOMAD is on the line to the CFO. A sell-side analyst at Morgan Stanley has issued an intraday note: 'VRD: Significant Cyber Event Reported. We are placing our Buy rating Under Review. Supply unaffected but data and systems exposure material. Await company statement.'\n\nThere is currently an information asymmetry in the market: some institutional holders are trading on knowledge that others don't have. The CFO has 20 minutes before the FCA's patience ends.",
      facilitatorNotes:
        "This is a market integrity moment. The FCA's Market Abuse Regulation (MAR) requires listed companies to disclose inside information as soon as possible. A known ransomware attack on a FTSE 250 company is almost certainly inside information under MAR Art. 7.\n\nOption A (RNS + suspension request) is the cleanest regulatory posture. The London Stock Exchange will grant a voluntary suspension on request while the company prepares a fuller announcement. This is not unusual in a crisis.\n\nOption D is genuinely dangerous: if the CFO later defends it by saying 'we didn't know the full picture', regulators will ask why the stock was allowed to trade on rumour.\n\nAsk the CFO: have you spoken to the NOMAD? What does MAR require? What does the Market Abuse Regulation say about 'delay of disclosure'?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "VRD.L down 12.7% | volumes 7x average | markets await Veridian Power statement",
      artifact: {
        type: "stock_chart",
        stockTicker: "VRD.L",
        stockCompanyName: "Veridian Power plc",
        stockOpenPrice: 1847,
        stockCurrentPrice: 1612,
        stockChangePercent: -12.7,
        stockVolume: "14.8M",
      },
      isDecisionPoint: true,
      targetRoles: ["CFO", "CLO", "CEO"],
      expectedKeywords: ["RNS", "FCA", "MAR", "NOMAD", "suspension", "inside information", "disclosure"],
      recapLine: "handled the market disclosure by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Issue RNS immediately with known facts and request voluntary trading suspension from the FCA while we prepare a fuller statement",
          consequence:
            "Trading suspended at 09:24. RNS issued at 09:31. The FCA acknowledge the proactive posture. The suspension lasts 4 hours. When trading resumes on the fuller statement, VRD.L finds a floor at 1,590p and stabilises.",
          rank: 1,
          recapFragment: "a voluntary trading suspension and immediate RNS",
        },
        {
          key: "B",
          label: "Issue RNS immediately with known facts, no suspension: let the market price the risk transparently",
          consequence:
            "RNS issued at 09:22. VRD.L drops a further 4.1% in the hour after the statement as the market digests the PSR angle. No regulatory concern raised. The stock finds a floor by midday.",
          rank: 1,
          recapFragment: "an immediate RNS without requesting suspension",
        },
        {
          key: "C",
          label: "Request voluntary suspension while preparing a fuller announcement: no RNS until we have a clearer picture",
          consequence:
            "Suspension granted at 09:21. By 11:00 the picture is fuller and the RNS is stronger. Some investors are frustrated by the 2-hour information blackout. The FCA note the suspension was appropriate.",
          rank: 2,
          recapFragment: "suspending trading while preparing a fuller disclosure",
        },
        {
          key: "D",
          label: "Hold the RNS: premature disclosure crystallises panic. Market speculation is manageable until we have the full picture",
          consequence:
            "VRD.L falls 19.3% by close. The FCA issue a formal query at 11:00 asking whether Veridian had inside information that was not disclosed in a timely manner. Two institutional shareholders file complaints. The CFO spends two days responding.",
          rank: 4,
          recapFragment: "holding the RNS while the stock fell",
        },
      ],
    },

    {
      id: "rw-i3d",
      commandTier: "STRATEGIC",
      order: 40,
      scenarioDay: 1,
      scenarioTime: "09:00",
      title: "09:00 - The Times Has The Story",
      body: "09:00. A reporter from The Times has emailed the press office with three specific facts: the time of the encryption event, the dollar figure on the ransom note, and the phrase 'Priority Services Register'. They are filing in 90 minutes.\n\nInternally: 3,200 staff are arriving at offices across the country with no email. The trading desk is on phones. The customer call centre is at 4x normal volume based on what they are hearing on social media.\n\nThree groups need a substantive brief in the next hour: staff, customers, and the day-ahead wholesale market counterparties.\n\nYou can only properly brief one of them first. Which?",
      facilitatorNotes:
        "Brief order is a values question. Staff-first is the morally instinctive answer and probably the right one. Your people are scared and on the phones. Customers-first is the regulatory and reputational answer, especially for the PSR cohort. Counterparties-first is the market-integrity answer. Your trading book is exposed and they will find out from Reuters anyway.\n\nThere is no single right answer here, only a values-revealing one. The point is they are forced to choose and must defend it. The facilitator should push back on whichever choice is made.",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "The Times says it will publish: 'UK energy retailer faces ransomware demand or PSR leak'",
      artifact: {
        type: "email",
        emailFrom: "n.curtis@thetimes.co.uk",
        emailTo: "press@veridianpower.co.uk",
        emailSubject: "The Times: request for comment, cyber incident, ransom demand, Priority Services Register exposure, filing 10:30",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CCO", "CLO"],
      expectedKeywords: ["staff", "customers", "vulnerable", "counterparties", "Times", "holding statement"],
      recapLine: "briefed in the order of {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Staff first: all-hands at 09:30, before the Times story drops, with the unvarnished truth",
          consequence:
            "Staff trust is preserved. The story leaks slightly through Slack screenshots but the company has shown that its people come first. Customer call centre staff handle the inbound noise with dignity because they were told first.",
          rank: 1,
          recapFragment: "staff first",
        },
        {
          key: "B",
          label: "Customers first: statement on the website and an SMS to the PSR cohort confirming services are unaffected",
          consequence:
            "Defensible and noble. Vulnerable customers are reassured. But staff find out via a Times push notification on their phones during the all-hands they thought was about something else. Internal trust takes a real hit.",
          rank: 2,
          recapFragment: "customers and the PSR cohort first",
        },
        {
          key: "C",
          label: "Counterparties first: call the wholesale market makers and the Bank of England before the FT clears its throat",
          consequence:
            "Market integrity is preserved. Two counterparties pull back from the day-ahead auction; the auction clears 4% wider than yesterday. Staff and customers find out from the news. The Treasury Select Committee notes the prioritisation.",
          rank: 3,
          recapFragment: "wholesale counterparties first",
        },
        {
          key: "D",
          label: "Investors first: call the top 5 institutional shareholders before any other group gets a brief",
          consequence:
            "Cold-blooded but disclosure-defensible. Two of the five leak the call to the FT within 20 minutes. Staff and customers find out fourth. The narrative becomes 'Veridian briefed the City before its own people'.",
          rank: 4,
          recapFragment: "the top institutional shareholders first",
        },
      ],
    },

    {
      id: "rw-i4",
      commandTier: "STRATEGIC",
      order: 50,
      scenarioDay: 1,
      scenarioTime: "14:30",
      title: "14:30 - The Full Ransom Note",
      body: "14:30. The full ransom note has been delivered through the encrypted-files window on a recovered workstation. The threat actor is ALPHV. They want $9.4M in Bitcoin within 48 hours.\n\nAttached to the note: a 200-row sample of the Priority Services Register. And a 14-row sample of the wholesale trading book.\n\nThe PSR sample is clinical in its cruelty. Row 47: Margaret Elaine Thornton, 77, Carlisle, home oxygen concentrator, medically dependent. Full name, address, NHS dependency code, emergency contact. Real. Authenticated by Mandiant.\n\nBeazley, your cyber insurer, are on a Teams call asking what your opening posture is. The CFO has just confirmed: the company has the cash, just, to pay the demand without breaching its debt covenants.\n\nBut OFAC are relevant. ALPHV's sanctions status is reviewed weekly. Today they are not on the SDN list. By next Wednesday, they may be.",
      facilitatorNotes:
        "The opening posture is not the same as the final decision. This is the question of how you walk into the negotiation room.\n\nCrucial contextual coaching: the 'deletion commitment' offered by ALPHV is not credible. Mandiant's track record shows that ALPHV publish data in 40-60% of cases even after payment. The team should know this.\n\nThe convergence point in rw-i4v (the chat window) is the same regardless of the choice here. The negotiation WILL open. The question is the posture going in.\n\nAsk the CFO: have you spoken to Beazley about OFAC? Who needs to sign off on any payment? What is the exact policy wording on ransomware payments?",
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
          label: "Refuse to engage: announce internally that we are not paying, focus 100% on restoration and notification",
          consequence:
            "Clean moral and legal posture. Restoration timeline 5-9 days. The PSR sample will be published; you will need to call the Carlisle customer in person before they read about themselves online. The CCO turns pale.",
          rank: 1,
          recapFragment: "refuse-to-engage",
        },
        {
          key: "B",
          label: "Stall: open a chat to buy 24 hours of investigation time, do not commit to anything",
          consequence:
            "ALPHV respond in 11 minutes. They are practised at this and will give you exactly 24 hours and not a minute more. The clock is now hard. Mandiant warn you that ALPHV's 'good faith' is a polished routine.",
          rank: 2,
          recapFragment: "a 24-hour stall",
        },
        {
          key: "C",
          label: "Negotiate in good faith: engage Coveware, target a 60% reduction, retain the right to walk",
          consequence:
            "Coveware engaged. The negotiation begins. ALPHV accept the engagement and counter at $7.8M. The conversation is now real. The OFAC sanctions risk is being assessed in parallel by external counsel.",
          rank: 3,
          recapFragment: "good-faith negotiation via Coveware",
        },
        {
          key: "D",
          label: "Pay the demand in full immediately to protect the PSR cohort and end the extortion clock",
          consequence:
            "Beazley refuse to authorise payment until OFAC clearance. The CFO authorises a bridge from corporate cash. Decryption keys work on 60% of files. The PSR will be published anyway. ALPHV has already mirrored it on three forums.",
          rank: 4,
          recapFragment: "immediate payment in full",
        },
      ],
    },

    {
      id: "rw-i4a",
      commandTier: "STRATEGIC",
      order: 55,
      scenarioDay: 1,
      scenarioTime: "15:19",
      title: "15:19 - The Listing Goes Live",
      body: "15:19. ALPHV have moved from proof of access to proof of possession.\n\nThe leak site now shows a dedicated listing: 'VERIDIAN POWER PLC: PRIORITY SERVICES REGISTER, FULL DATASET'. Price: 18 XMR, approximately £1,400 per record for the complete set, or included in the $9.4M settlement.\n\nThe sample rows visible without payment:\n\nRow 1: Margaret Elaine Thornton, 77, Carlisle, CA1 3NP. Home oxygen concentrator. NHS Dependency Code: HO3. Emergency contact: daughter, Sandra Thornton, 07700 900441.\n\nRow 2: Robert James Mensah, 64, Leeds, LS7 2BT. Dialysis patient, home unit. Emergency contact: wife, Gloria Mensah.\n\nRow 3: Patricia Anne Holloway, 58, Derby, DE1 1GA. Powered wheelchair, stair lift. Emergency contact: carer agency, Derbyshire Home Care.\n\nMandiant confirm: this is real data. It is the PSR replica.\n\nIn Carlisle, Margaret Thornton does not yet know her medical condition is for sale.",
      facilitatorNotes:
        "This is a horror reveal. No vote. Let it sit.\n\nThe facilitator should pause and let the room absorb what they are reading. This is the moment the abstract data breach becomes a human crisis. Ask: what does the team feel? What is the first thing they want to do?\n\nThe next inject (rw-i4x) asks them to convert that feeling into a decision about PSR customer outreach. This inject exists to make that decision feel real and urgent rather than procedural.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "ALPHV post samples of Veridian Power Priority Services Register | medical data of vulnerable customers visible",
      artifact: {
        type: "dark_web_listing",
        darkWebSiteName: "ALPHV-BLACKCAT Data Market",
        darkWebOnionUrl: "alphvblkz9mnfxt6.onion/veridian-psr-full",
        darkWebTitle: "Veridian Power plc: Priority Services Register, FULL DATASET, 84,247 Records",
        darkWebPrice: "18 XMR (~£120,000) or included in $9.4M settlement",
        darkWebRecordCount: "84,247 verified records",
        darkWebSampleRows: [
          { name: "Margaret Elaine Thornton", account: "VRD-8841-2203", sortCode: "CA1 3NP", email: "m.thornton1947@hotmail.co.uk" },
          { name: "Robert James Mensah", account: "VRD-2217-8840", sortCode: "LS7 2BT", email: "r.mensah.dialysis@nhs.uk" },
          { name: "Patricia Anne Holloway", account: "VRD-5521-0047", sortCode: "DE1 1GA", email: "pholloway_derby@gmail.com" },
          { name: "David Michael Kaczmarek", account: "VRD-9903-6612", sortCode: "NG1 5DT", email: "dkaczmarek74@outlook.com" },
          { name: "Sian Mwangi-Hughes", account: "VRD-1178-4430", sortCode: "CF10 1EP", email: "s.mwangihughes@yahoo.co.uk" },
        ],
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CCO", "COO", "CISO"],
      expectedKeywords: ["PSR", "vulnerable", "Carlisle", "Margaret", "medical", "outreach"],
    },

    {
      id: "rw-i4x",
      commandTier: "STRATEGIC",
      order: 57,
      scenarioDay: 1,
      scenarioTime: "15:24",
      title: "15:24 - The 84,247 Question",
      body: "15:24. The PSR listing is live on the dark web. The war room has to make a decision about the 84,247 people whose names just appeared for sale.\n\nThe head of customer operations arrives with a note:\n\n'84,247 PSR customers on record. 4,218 are Category 1, medically dependent on powered equipment: home oxygen, dialysis, insulin refrigeration, powered wheelchairs. The rest are Category 2: welfare and social vulnerability.\n\nWe have full contact details for all of them. Normal outbound call capacity: 2,000 per hour. Time to reach all Category 1 customers: approximately 2 hours. Time to reach all 84,247: 42 hours at full stretch with agency support hired in.\n\nMandy from the Carlisle depot called Margaret Thornton personally 20 minutes ago. She knew her from a service visit. That is one. The other 84,246 are waiting.'\n\nMandiant raise a caution: a large-scale outbound calling programme will tip the media to the full PSR angle before the company has its comms strategy locked.",
      facilitatorNotes:
        "This is the most emotionally charged decision in the scenario. There is a genuine tension between: (a) the moral imperative to tell vulnerable people their data is compromised, and (b) the practical risk that early outreach at scale confirms the breach publicly before the company is ready.\n\nOption A is the morally and reputationally right answer. Start with the most vulnerable immediately. The media risk is real but manageable. No reasonable journalist will write critically about a company proactively calling oxygen-dependent customers.\n\nOption D is the most common instinct from a comms perspective and the most regrettable in retrospect.\n\nAsk the COO: what is the operational plan for 4,218 calls in 2 hours? Do you have scripts? Do the call centre agents know enough to answer questions?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "Veridian Power: 84,247 Priority Services Register customers' data 'may have been accessed'",
      artifact: {
        type: "email",
        emailFrom: "t.osei@veridianpower.co.uk",
        emailTo: "crisis-team@veridianpower.co.uk",
        emailSubject: "URGENT: PSR outreach, 84,247 customers, recommendation needed NOW",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "COO", "CCO", "CLO"],
      expectedKeywords: ["PSR", "Category 1", "oxygen", "dialysis", "outreach", "call", "vulnerable"],
      recapLine: "approached the PSR outreach by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Start Category 1 outreach immediately: all 4,218 medically-dependent customers by end of day, regardless of media risk",
          consequence:
            "4,218 calls completed by 18:00. 31 customers require urgent follow-up including a welfare check in Sheffield. The Times runs the PSR angle but leads with 'Veridian calls vulnerable customers personally'. The narrative shifts from breach to response.",
          rank: 1,
          recapFragment: "immediate Category 1 outreach regardless of media risk",
        },
        {
          key: "B",
          label: "Contact the local DNOs (distribution network operators) first so engineers are on standby before customers are alerted",
          consequence:
            "DNO coordinators briefed by 16:00. Fourteen engineers put on standby across five regions. When outreach begins at 17:30, there is infrastructure support in place for any customer who needs a welfare visit. Three needed one.",
          rank: 2,
          recapFragment: "briefing DNOs before beginning customer outreach",
        },
        {
          key: "C",
          label: "Issue a direct letter and SMS to all 84,247 PSR customers tonight alongside a press statement: full transparency at scale",
          consequence:
            "SMS sent at 22:00 to 84,247 numbers. 14,000 calls to the emergency line before midnight. Three major newspapers lead with PSR on front pages. The outreach is seen as reactive but comprehensive. The ICO note the scale.",
          rank: 2,
          recapFragment: "mass SMS to all 84,247 PSR customers overnight",
        },
        {
          key: "D",
          label: "Wait 24 hours: restoration is at 60%, we may have decryption keys soon. Early outreach locks in the breach narrative before we can offer resolution",
          consequence:
            "24 hours later, Margaret Thornton reads about herself in The Times. Her daughter calls the company in distress. A welfare check finds she has been without sleep worrying about what it means. The Ombudsman receives a formal complaint by end of day.",
          rank: 4,
          recapFragment: "delaying PSR outreach by 24 hours",
        },
      ],
    },

    {
      id: "rw-i4v",
      commandTier: "STRATEGIC",
      order: 60,
      scenarioDay: 1,
      scenarioTime: "15:42",
      title: "15:42 - The Chat Window",
      body: "15:42. The chat window is open. ALPHV have a live operator on the other end. They are professional. They have done this 200 times. They have your PSR sample mirrored to three forums and a 24-hour countdown clock posted on their leak site.\n\nThe question now is not whether to talk. It is who runs the conversation. The wrong person on the keyboard can cost millions. The right person has done this before, knows the OFAC line, and won't be baited by professional extortionists who are very good at making companies panic.",
      facilitatorNotes:
        "Convergence inject. The room everyone ends up in regardless of their opening choice. Operational decision.\n\nMandiant-only is the orthodox answer because they have done this hundreds of times and have OFAC-aware playbooks. CISO with Mandiant coaching is the second-best. Coveware specialise in negotiation and have the best price outcomes but worst forensic integration.\n\nAsk: what does the keyboard operator say in the first message? The first message sets the entire tone of the negotiation. Draft it aloud in the room before voting.",
      delayMinutes: 0,
      timerMinutes: 12,
      tickerHeadline: "ALPHV leak site posts countdown: 'Veridian Power | PSR drop in 24 hours unless payment received'",
      artifact: {
        type: "negotiation_chat",
        negotiationThreatAlias: "ALPHV-SUPPORT",
        negotiationMessages: [
          {
            side: "threat",
            text: "Hello Veridian Power. We see your team is now online. You have had time to review our terms. What is your position?",
            time: "15:43",
          },
          {
            side: "negotiator",
            text: "We acknowledge receipt of your communication. We are reviewing the matter internally.",
            time: "15:47",
          },
          {
            side: "threat",
            text: "We respect that answer. We are patient professionals. The clock is clear. You have 22 hours 13 minutes remaining. We hold 84,247 records. Your customers in Carlisle will read about themselves in The Times tomorrow morning if we do not receive confirmation of your intent.",
            time: "15:49",
          },
          {
            side: "threat",
            text: "We have completed this process 200 times. The companies that engage quickly receive the best outcomes. The companies that stall beyond 6 hours find that we become impatient. We recommend you make your position known before 22:00 tonight.",
            time: "15:51",
          },
          {
            side: "threat",
            text: "One further point. We are aware that you have Mandiant on site. We have worked with Mandiant before. We have enormous respect for them. This does not change the clock.",
            time: "15:54",
          },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CISO", "CLO", "CFO"],
      expectedKeywords: ["Mandiant", "Coveware", "OFAC", "negotiation", "keyboard", "PSR"],
      recapLine: "ran the negotiation by putting {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Mandiant-only on the keyboard: they have the OFAC playbook, the technical depth, and the script",
          consequence:
            "Mandiant take over. Their first message is calibrated: acknowledges receipt without conceding intent. ALPHV recognise the cadence and respond formally. The conversation is now between professionals.",
          rank: 1,
          recapFragment: "Mandiant alone on the keyboard",
        },
        {
          key: "B",
          label: "CISO at the keyboard with Mandiant coaching live: keeps internal accountability",
          consequence:
            "The CISO writes, Mandiant proofread. The cadence is slower but the internal ownership is preserved. ALPHV note the pacing change but continue. This is workable but slower.",
          rank: 2,
          recapFragment: "the CISO under Mandiant coaching",
        },
        {
          key: "C",
          label: "Engage Coveware as third-party negotiators: they specialise in price reduction",
          consequence:
            "Coveware bring a stronger price record but weaker forensic integration. Mandiant flag the handoff risk. ALPHV recognise Coveware and immediately tighten their position. They know their playbook too.",
          rank: 3,
          recapFragment: "Coveware specialist negotiators on the keys",
        },
        {
          key: "D",
          label: "Refuse to engage in the chat: close the window, focus on restoration and notification",
          consequence:
            "Brave. The window closes. ALPHV's countdown clock continues to tick. The PSR will publish in 24 hours unless something changes. Mandiant's tone shifts: 'We respect the call. Let's get the Carlisle customer on the phone now.'",
          rank: 4,
          recapFragment: "no one on the keys",
        },
      ],
    },

    {
      id: "rw-i5",
      commandTier: "STRATEGIC",
      order: 70,
      scenarioDay: 3,
      scenarioTime: "11:00",
      title: "Day 3, 11:00 - The Counter",
      body: "Day 3, 11:00. The negotiation has been running for 19 hours. Whoever is on the keyboard has now received ALPHV's counter: $6.2M. With a 12-hour fuse. And a written commitment, in the chat window, that the PSR will be deleted from all mirrors and no public leak will occur.\n\nMandiant rate the deletion commitment at 'low credibility'. In their experience, ALPHV publish data in approximately 40-60% of cases even after payment. The commitment is not enforceable and they know it.\n\nBeazley have agreed to cover up to $4M of any payment, conditional on OFAC clearance and Coveware sign-off. Restoration is 60% complete. The PSR master is intact. The replica is in the attacker's hands and has been viewed 14,000 times on the dark web forums.\n\nThe OFAC team have cleared ALPHV as not currently on the SDN list, but warn that the list is reviewed every Wednesday.",
      facilitatorNotes:
        "The counter-offer is the moment the team has to make a real money call with real moral stakes.\n\nLowball back is the strongest negotiating posture but it commits to engagement. Stall is the best 'do no harm' answer but burns the 12-hour fuse. OFAC+FBI escalation is dramatically correct but practically triggers publication. Pay the counter is the path of least resistance and the worst outcome.\n\nThe key coaching moment: the team should know that paying does not guarantee deletion. Mandiant have advised this explicitly. Any team choosing D should be asked: what happens when ALPHV publish anyway? Mandiant say they will in 40-60% of cases.",
      delayMinutes: 0,
      timerMinutes: 14,
      tickerHeadline: "Reuters: 'Veridian Power in active ransom negotiation | sources put demand near $9M'",
      artifact: {
        type: "negotiation_chat",
        negotiationThreatAlias: "ALPHV SUPPORT",
        negotiationMessages: [
          {
            side: "negotiator",
            text: "Good morning. We represent the organisation. We have reviewed your initial communication and are authorised to discuss a resolution. Before we can move forward we need to understand the scope of the data you hold. Can you confirm what you have and provide a verifiable sample?",
            time: "Day 2, 15:42",
          },
          {
            side: "threat",
            text: "Confirmed. We hold 847GB extracted from your production environment between 04 March and 07 March. This includes HR records, financial data, and what appears to be a protected-sector patient register. A sample of 500 records has been available on our forum since yesterday. You have seen it. We do not negotiate scope. We negotiate price.",
            time: "Day 2, 16:09",
          },
          {
            side: "negotiator",
            text: "Understood. We are working through internal approvals to discuss a figure. The data set is large and the verification process takes time on our side. We ask for patience. What is your current ask?",
            time: "Day 2, 17:31",
          },
          {
            side: "threat",
            text: "Our position is $9.1M USD in Monero. This covers full decryption, deletion from all storage and mirrors, and a signed commitment not to publish. The price is firm until 06:00 tomorrow. After that it increases by 15% per 12-hour period and we begin selective publication.",
            time: "Day 2, 17:55",
          },
          {
            side: "negotiator",
            text: "We cannot move at that figure. Our principals are not in a position to approve anything near that level. We are willing to engage seriously but you need to work with us on a number that reflects the organisation's actual capacity. Can we discuss?",
            time: "Day 2, 22:17",
          },
          {
            side: "threat",
            text: "We understand your position. We have done this before. We know what organisations say at this stage and we know what they pay. We are prepared to move. Our revised and final offer is $6.2M USD in Monero. This offer carries a 12-hour fuse from timestamp of this message. On acceptance: full decryption keys within 2 hours, deletion from all mirrors confirmed by our own log export, and no publication. The commitment will be made in this window in writing. We do not extend deadlines.",
            time: "Day 3, 10:44",
          },
          {
            side: "negotiator",
            text: "We have received your counter and are taking it to principals now. We need time to work through the approval process and confirm insurance coverage. We are not walking away. Please hold.",
            time: "Day 3, 11:03",
          },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CFO", "CLO", "CISO"],
      expectedKeywords: ["counter", "Beazley", "OFAC", "lowball", "stall", "PSR deletion"],
      recapLine: "answered the counter by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Lowball back: $2.4M, conditional on independent third-party deletion verification",
          consequence:
            "ALPHV laugh in chat (literally: 'lol') and counter at $5.4M. The negotiation continues. Coveware rate the position as 'aggressive but respected'. The 12-hour fuse extends informally to 18 hours.",
          rank: 1,
          recapFragment: "a $2.4M lowball with verification conditions",
        },
        {
          key: "B",
          label: "Stall for 6 more hours: claim board approval is needed, use the time to push restoration",
          consequence:
            "The fuse contracts to 6 hours. Mandiant get an additional 12% of restoration done. ALPHV start to lose patience and post a fresh PSR sample to a fourth forum. The Carlisle customer's name appears on Reddit.",
          rank: 2,
          recapFragment: "a 6-hour board-approval stall",
        },
        {
          key: "C",
          label: "Escalate to OFAC and the NCA in writing: signal that any payment is under law-enforcement scrutiny",
          consequence:
            "OFAC acknowledge in writing. The NCA engage and ask for the full chat transcript. ALPHV detect the increased noise around the negotiation and post the full PSR replica to their leak site at 16:20.",
          rank: 3,
          recapFragment: "OFAC and NCA escalation in writing",
        },
        {
          key: "D",
          label: "Pay the $6.2M counter to end the clock and protect the PSR cohort",
          consequence:
            "Beazley cover $4M; Veridian bridge $2.2M from corporate cash. Decryption keys arrive and work on 60% of files. The PSR is mirrored to a fourth site within the hour. The deletion commitment is broken before the wire clears.",
          rank: 4,
          recapFragment: "paying the $6.2M counter",
        },
      ],
    },

    {
      id: "rw-i5a",
      commandTier: "STRATEGIC",
      order: 75,
      scenarioDay: 3,
      scenarioTime: "09:00",
      title: "Day 3, 09:00 - Two Letters and a Television",
      body: "Day 3, 09:00. Three things arrive in the first fifteen minutes.\n\nAt 08:52: A formal letter from Beazley cyber claims, Reference BEZ-CY-2026-0844. The underwriter is querying whether the original access vector, a known vulnerability in a third-party MFA appliance flagged as 'medium, deferred' on Veridian's last penetration test 14 months ago, constitutes a 'known unpatched vulnerability' under Policy Exclusion 7(b). If the exclusion is upheld, $4M of applicable cyber coverage evaporates. The letter asks for a response within 5 business days.\n\nAt 09:03: A statement from the Secretary of State for Energy Security, broadcast live on Sky News: 'I am deeply concerned by the situation at Veridian Power. The Priority Services Register exists to protect our most vulnerable citizens. I have asked NCSC and Ofgem for an urgent briefing this afternoon. Parliamentary questions have been tabled for Thursday.'\n\nAt 09:07: An email from Ofgem: a formal request under Schedule 4 of the NIS Regulations 2018 for a full incident report within 14 days, with a note that an enforcement notice is 'under active consideration'.\n\nThe CLO has all three on her desk. They are linked by the same governance question: did the company know about the MFA vulnerability, and what did it do about it?",
      facilitatorNotes:
        "No vote on this inject. It is a scene-setting narrative for the rw-i6a decision which follows immediately.\n\nThe three items (Beazley, Secretary of State, Ofgem) are deliberately linked by the same governance thread. The MFA vulnerability was deferred. Why? Who made that call? Is it in the board papers?\n\nLet the CLO sweat. Ask: did the CISO brief the board on the deferred MFA risk? Is there a paper trail? If there is, it helps Ofgem but hurts Beazley. If there isn't, it hurts both.\n\nThis inject is the prologue to rw-i6a. The team needs to feel the weight of both fronts before they make the coupling decision.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Energy secretary: 'deeply concerned' | parliamentary questions tabled | Ofgem signals NIS enforcement",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "SKY NEWS",
        tvHeadline: "ENERGY SECRETARY: 'DEEPLY CONCERNED' ABOUT VERIDIAN POWER PSR BREACH",
        tvTicker: "Parliamentary questions tabled for Thursday | Ofgem confirms NIS enforcement under consideration | Beazley queries cyber policy exclusion",
        tvReporter: "WESTMINSTER",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CLO", "CFO", "CISO"],
      expectedKeywords: ["Beazley", "Ofgem", "NIS", "MFA", "exclusion", "parliamentary", "Secretary of State"],
    },

    {
      id: "rw-i6a",
      commandTier: "STRATEGIC",
      order: 80,
      scenarioDay: 3,
      scenarioTime: "16:30",
      title: "Day 3, 16:30 - Two Fronts, One Hour",
      body: "16:30. Two formal letters require a response within the hour.\n\nFirst: Beazley are querying whether the deferred MFA vulnerability constitutes a policy exclusion. If it does, $4M of cover is gone. If you disclose proactively, you may be able to argue mitigation. If you fight the exclusion through litigation, you preserve optionality but burn the relationship.\n\nSecond: Ofgem, formal under Schedule 4 of the NIS Regulations, requesting a full incident report within 14 days and signalling that an enforcement notice is 'under active consideration'. Their inquiry will likely include a question about the MFA vulnerability risk assessment.\n\nThe CLO has a single hour to decide how to couple, or decouple, these two responses. They are linked by the same governance evidence: the penetration test report showing the MFA issue was classified 'medium, deferred'. That document will appear in both processes. The question is whether to disclose it proactively and uniformly, or manage the two processes separately.",
      facilitatorNotes:
        "Strategic coupling decision. The key insight is that the same evidence, the pen test report, will be requested by both Beazley and Ofgem. The only question is whether the company controls the narrative (proactive coupled disclosure) or responds reactively to both.\n\nOption A (coupled disclosure) saves 200 hours of legal work and builds goodwill with both parties. Option D (side-letter) is the worst path. It is the kind of manoeuvre that surfaces in enforcement reports as 'lack of candour'.\n\nAsk the CLO: what is the legal privilege position on the pen test report? Does it matter who commissioned it? What does the board's cyber risk register say about the MFA gap?",
      delayMinutes: 0,
      timerMinutes: 14,
      tickerHeadline: "Ofgem 'actively considering enforcement' against Veridian Power under NIS Regulations",
      artifact: {
        type: "legal_letter",
        legalCaseRef: "OFGEM-NIS-2026-0117, BEZ-CY-2026-0844",
        legalAuthority: "Office of Gas and Electricity Markets, Beazley Cyber Claims Division",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "CFO", "CISO"],
      expectedKeywords: ["Ofgem", "Beazley", "NIS", "MFA", "exclusion", "couple", "disclose"],
      recapLine: "handled the two fronts by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Couple and disclose: full proactive disclosure to both Beazley and Ofgem with the same evidence pack including the pen test report",
          consequence:
            "Coverage counsel engaged. Beazley acknowledge the disclosure and shift the conversation from exclusion to mitigation. Ofgem note the proactive posture. The single evidence pack saves 200 hours of legal work later.",
          rank: 1,
          recapFragment: "coupled disclosure to both Beazley and Ofgem",
        },
        {
          key: "B",
          label: "Decouple: fight Beazley on the exclusion clause, engage Ofgem cooperatively in a separate parallel track",
          consequence:
            "Two streams of legal work at significant cost. Beazley initiate a formal coverage dispute. Ofgem inquiry continues cleanly. Total legal spend triples but the insurance dispute is preserved as a clean fight.",
          rank: 2,
          recapFragment: "decoupling the two fronts",
        },
        {
          key: "C",
          label: "Engage Ofgem fully, stall Beazley: the regulator matters more than the insurer right now",
          consequence:
            "Ofgem cooperative. Beazley feel sandbagged when they later discover the parallel Ofgem disclosure. They harden their position. The exclusion bites for $4M and the relationship is over.",
          rank: 3,
          recapFragment: "Ofgem first and Beazley stalled",
        },
        {
          key: "D",
          label: "Try to settle Beazley quietly with a side-letter before the Ofgem submission is filed",
          consequence:
            "A side-letter is drafted. Coverage counsel resign on conflict-of-interest grounds. The side-letter surfaces in Ofgem's evidence-gathering six weeks later. The regulator notes 'lack of candour' in their final enforcement report.",
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

    {
      id: "rw-i6-strong",
      commandTier: "TACTICAL",
      tierSkipSummary: "By Day 4, the team had established a cooperation footing with the NCSC - sharing indicators of compromise and receiving threat intelligence in return. Recovery was proceeding with external technical support.",
      order: 90,
      scenarioDay: 4,
      scenarioTime: "08:00",
      title: "Day 4, 08:00 - Cooperation Footing",
      body: "Day 4, 08:00. Mandiant's intermediate report lands at 07:50 and is in Ofgem's hands by 08:00. The insurer's coverage counsel has accepted the proactive disclosure and is now negotiating mitigation rather than exclusion.\n\nThe PSR cohort outreach is underway. 67,000 of 84,247 customers have been reached. 84 welfare checks have been requested; 19 have been completed by DNO field engineers. The Carlisle customer has been visited in person by the local depot manager.\n\nRestoration is at 78% and the wholesale trading desk is back on the primary book. Two counterparties have resumed normal positions.\n\nThe parliamentary questions for Thursday are still live. The Secretary of State's private office has called asking for a 1:1 briefing before the chamber session.\n\nYou are not out of the woods. But you are walking, not bleeding out.",
      facilitatorNotes:
        "Rewarded narrative for strong play through the back half. The team should feel the dividend of their earlier choices landing.\n\nKey point: 'walking, not bleeding out' is a deliberate framing. The crisis is not over. The parliamentary session, the ICO, and the Ofgem investigation are all live. But the company has agency over the next phase rather than being reactive.\n\nThe score-routed finale (rw-i7) follows. Prepare the team for the ending reveal.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Veridian Power: 'ongoing investigation, supply secure, 79,000 vulnerable customers contacted'",
      artifact: {
        type: "email",
        emailFrom: "incident@mandiant.com",
        emailTo: "crisis-team@veridianpower.co.uk",
        emailSubject: "Veridian Power IR: Day 4 Intermediate Report, Restoration 78%, Filed to Ofgem 08:00",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CISO", "COO"],
      expectedKeywords: ["restoration", "PSR", "Mandiant", "cooperation", "vulnerable", "parliamentary"],
    },

    {
      id: "rw-i6-weak",
      commandTier: "TACTICAL",
      tierSkipSummary: "By Day 4, the team was operating in a defensive posture with limited external engagement. Recovery was slower than hoped, with internal resources stretched and public confidence fragile.",
      order: 90,
      scenarioDay: 4,
      scenarioTime: "08:00",
      title: "Day 4, 08:00 - The Defensive Crouch",
      body: "Day 4, 08:00. Beazley have formally placed the claim under coverage dispute. Mandiant's intermediate report has been delivered to Ofgem 26 hours late because of an internal legal review hold.\n\nThe PSR outreach is behind schedule. 41,000 of 84,247 customers have been reached. The call centre wait time is 47 minutes. A customer in Newcastle filed an Ombudsman complaint before being reached. He saw his name in a Reddit thread.\n\nRestoration is at 64%. The trading book reconciliation is running clean but two counterparties have reduced their credit limit for Veridian.\n\nThe Times are running a day-four follow-up: 'Inside Veridian's bunker week'. The board chair has asked for a 1:1 with the CEO at 18:00.\n\nThe parliamentary session is Thursday. The Secretary of State's office has not returned calls.",
      facilitatorNotes:
        "Defensive narrative for weaker play through the back half. The team should feel the cost of earlier missteps without the crisis being unrecoverable yet.\n\nThe Times story, the Ombudsman complaint, and the counterparty credit reduction are all consequences of specific earlier decisions. If the team is asking 'how did we get here?', that is the right question.\n\nThe score-routed finale (rw-i7) follows.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Veridian Power 'in bunker week' as Times runs day-four feature on cyber response failures",
      artifact: {
        type: "news_headline",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CISO", "COO"],
      expectedKeywords: ["dispute", "delay", "PSR", "Ombudsman", "Times", "parliamentary"],
    },

    {
      id: "rw-i7",
      commandTier: "STRATEGIC",
      order: 100,
      scenarioDay: 5,
      scenarioTime: "16:00",
      title: "Day 5, 16:00 - How Does This End?",
      body: "Day 5, 16:00. The technical incident is closing.\n\nThe PSR replica that was in the attackers' hands has been on three mirrors for 36 hours. 27,000 of the 84,247 records have been scraped and reposted on a Telegram channel before takedown. Restoration is at 91%. The wholesale trading desk is back on the primary book and reconciliations are clean.\n\nOfgem's enforcement team have a draft notice. Beazley have a final position on the claim. The CFO has a number. The board has a question. The CEO has a microphone.\n\nEvery choice this team made across five days is about to have a price attached to it. The compound of those choices will determine which ending you are about to receive.\n\nHow does this end?",
      facilitatorNotes:
        "Score-routed finale. The compound average rank of all ranked decisions taken across the session is the input. Thresholds:\n\n<= 1.6 -> rw-end1 (TRIUMPH)\n<= 2.3 -> rw-end2 (RECOVERY)\n<= 3.0 -> rw-end3 (DIMINISHED)\n> 3.0 -> rw-end4 (CATASTROPHIC)\n\nThis is not a decision inject. The team's choices have already been made. This inject is the bridge: let the score land before revealing the ending. Do not tell the team their score in advance. Let the ending reveal it.",
      delayMinutes: 0,
      timerMinutes: 6,
      tickerHeadline: "Veridian Power week-one update due 17:00 | markets watching",
      artifact: {
        type: "stock_chart",
        stockTicker: "VRD.L",
        stockCompanyName: "Veridian Power plc",
        stockOpenPrice: 1847,
        stockCurrentPrice: 1631,
        stockChangePercent: -11.7,
        stockVolume: "22.4M",
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
      expectedKeywords: ["finale", "PSR", "Ofgem", "Beazley", "recovery", "ending"],
    },

    {
      id: "rw-end1",
      commandTier: "STRATEGIC",
      order: 110,
      scenarioDay: 30,
      title: "Day 30 - The Sector Standard",
      body: "Thirty days on.\n\nOfgem closed their enforcement file with no notice issued, citing 'proactive cooperation that materially shaped the outcome and exceeded the obligations of the NIS Regulations'. Beazley paid the claim in full. The MFA exclusion argument did not survive the coupled disclosure posture.\n\nThe PSR outreach was completed. 84,247 customers contacted. 47 welfare checks completed by DNO field engineers. The Carlisle customer, Margaret Thornton, received a personal apology from the CEO by letter and a guaranteed upgrade to the Priority Services Register tier. She has not complained.\n\nThe Times ran a follow-up: 'How Veridian's worst week became the energy sector's playbook.' Last week, the NCSC asked the CISO to speak at a closed sector roundtable on PSR data protection.\n\nTomorrow, Ofgem's Cyber Cooperation Award goes to Veridian Power.\n\nOne last vote. Looking back across the whole exercise, which single call did the most to earn this ending?",
      facilitatorNotes:
        "Triumph ending. The team executed cleanly across the board and the compound rank reflects it. The reflection vote is unranked. It asks them to identify, in retrospect, the call that mattered most. That conversation is usually more valuable than the exercise itself.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Ofgem closes enforcement file: Veridian Power named 'sector cyber standard'",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "BBC NEWS",
        tvHeadline: "VERIDIAN POWER NAMED OFGEM CYBER COOPERATION AWARD WINNER",
        tvTicker: "Energy retailer's response 'shaped sector playbook' | enforcement file closed | all PSR customers contacted",
        tvReporter: "WESTMINSTER",
      },
      isDecisionPoint: true,
      isEnding: true,
      targetRoles: ["CEO", "CISO", "CFO", "CLO"],
      expectedKeywords: ["reflection"],
      decisionOptions: [
        { key: "A", label: "The 03:14 forensic capture instinct" },
        { key: "B", label: "The first call to NCSC under NIS Regs" },
        { key: "C", label: "Filing the ICO notification early and amending it later" },
        { key: "D", label: "Coupling the Beazley and Ofgem disclosure" },
      ],
    },

    {
      id: "rw-end2",
      commandTier: "STRATEGIC",
      order: 110,
      scenarioDay: 30,
      title: "Day 30 - Quiet Lights On",
      body: "Thirty days on.\n\nBeazley settled at 70% of the claim. The MFA exclusion argument partially held, but the mitigation case was strong enough to avoid a full denial. Net recovery: $2.8M against a $4M policy.\n\nOfgem issued a private letter of concern with no public enforcement notice. The letter cited 'adequate but not exemplary cooperation'.\n\nThe PSR contact programme completed in 11 days. One Ombudsman complaint was received and withdrawn after contact was made. No welfare emergencies were missed.\n\nRestoration is 100%. The trading book reconciliations are clean. The CEO survived the AGM with 71% support, a 14-point drop on last year.\n\nThe boardroom is quiet. The lights are on. Nobody on the street is talking about Veridian Power any more.\n\nOne last vote. Looking back across the whole exercise, what was the most important thing you got right?",
      facilitatorNotes:
        "Recovery ending. The team made good choices overall but had at least one material misstep, most likely on the ICO notification timing or the Beazley/Ofgem coupling. The company has survived but it is diminished.\n\nThe reflection vote is unranked. The question 'what did we get right?' is usually more revealing than it sounds. The team will often cite a decision that they had the most internal disagreement about, which is the most useful debrief material.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Veridian Power: 'closing the chapter | focused on customer trust and resilience investment'",
      artifact: {
        type: "stock_chart",
        stockTicker: "VRD.L",
        stockCompanyName: "Veridian Power plc",
        stockOpenPrice: 1847,
        stockCurrentPrice: 1706,
        stockChangePercent: -7.6,
        stockVolume: "3.2M",
      },
      isDecisionPoint: true,
      isEnding: true,
      targetRoles: ["CEO", "CISO", "CFO", "CLO"],
      expectedKeywords: ["reflection"],
      decisionOptions: [
        { key: "A", label: "Reaching the PSR cohort before they read about it in the press" },
        { key: "B", label: "Honest internal posture with staff on day one" },
        { key: "C", label: "Holding the negotiation line on the counter" },
        { key: "D", label: "Cooperative tone with Ofgem from the first call" },
      ],
    },

    {
      id: "rw-end3",
      commandTier: "STRATEGIC",
      order: 110,
      scenarioDay: 30,
      title: "Day 30 - The Long Tail",
      body: "Thirty days on.\n\nOfgem issued a public enforcement notice under the NIS Regulations, a first for an energy retailer. The notice cites failures in detection, notification timing, and the delayed PSR outreach programme. It is accompanied by a financial penalty of £8.7M.\n\nBeazley denied the claim in full under the MFA exclusion. The coverage counsel resigned on conflict-of-interest grounds after the side-letter came to light in Ofgem's evidence-gathering.\n\nA class action covering 47,000 PSR-listed customers was filed in the High Court last Friday. The claim is led by a firm specialising in data rights. The CISO resigned on Wednesday. The CFO has announced he will not seek re-election at the AGM.\n\nCustomer churn is running at 2.2x the sector average. The Times leader column on Sunday was titled: 'Veridian's lesson for every retailer and every board.'\n\nThe CEO has 90 days to deliver a credible plan.\n\nOne last vote. Looking back across the whole exercise, which call would you most want to take again?",
      facilitatorNotes:
        "Diminished ending. Multiple wrong calls but no single catastrophic one. This is the 'death by a thousand decisions' ending. The reflection vote asks 'which call would you redo?' Usually the most productive debrief question because it forces specificity.\n\nCommon answers: the ICO notification delay, the Beazley side-letter, or the delayed PSR outreach. Each tells you something different about where the team's instincts sat.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Ofgem issues NIS enforcement notice and £8.7M penalty against Veridian Power | class action filed",
      artifact: {
        type: "news_headline",
      },
      isDecisionPoint: true,
      isEnding: true,
      targetRoles: ["CEO", "CISO", "CFO", "CLO"],
      expectedKeywords: ["reflection"],
      decisionOptions: [
        { key: "A", label: "The 03:14 first call, or what came after it" },
        { key: "B", label: "The ICO notification timing" },
        { key: "C", label: "Who ran the ransom keyboard" },
        { key: "D", label: "How we handled the Beazley and Ofgem coupling" },
      ],
    },

    {
      id: "rw-end4",
      commandTier: "STRATEGIC",
      order: 110,
      scenarioDay: 30,
      title: "Day 30 - We Paid Twice",
      body: "Thirty days on.\n\nALPHV took the $9.4M and re-extorted in week three for the 'remaining' data. A second demand of $3.1M for a tranche of board minutes and M&A documents that had not appeared in the original note. The company refused. The documents were published.\n\nOFAC have opened an inquiry into the original payment because ALPHV was added to the SDN list four days after the wire cleared. The inquiry is active. The CFO has been asked to provide a personal witness statement.\n\nThe full PSR dataset, all 84,247 records, was published on five mirrors in week two. 27,000 records have been indexed by data brokers. The welfare impact is being assessed by NHS England.\n\nThe CEO resigned on Monday. The CISO resigned on Tuesday. The CFO resigned on Wednesday. The interim board chair confirmed in this morning's RNS that Veridian Power is 'exploring all strategic options including merger and potential sale'.\n\nThe trading desk is profitable. Nothing else is.\n\nOne last vote. Looking back across the whole exercise, which call do you most regret?",
      facilitatorNotes:
        "Catastrophic ending. The compound average rank exceeded 3.0. The team made multiple poor calls that compounded into a systemic failure.\n\nThe reflection vote asks 'which call do you most regret?' The most painful debrief question and the most valuable. The answer tells you where the team's default instincts were wrong and what to train against.\n\nCommon answers: treating the 03:14 alert as a false positive, paying the full demand, the ICO delay. Often the team will cite a later decision, the Beazley side-letter, when the real answer is the very first one.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Veridian Power chair: 'exploring all strategic options' as CEO, CISO, CFO resign in single week | OFAC inquiry active",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "BBC NEWS",
        tvHeadline: "VERIDIAN POWER IN CRISIS: EXEC TEAM RESIGNS | OFAC INQUIRY | ENTIRE PSR PUBLISHED",
        tvTicker: "OFAC investigating ransom payment | 84,247 vulnerable customers' data now on dark web | strategic review launched | shares suspended",
        tvReporter: "CITY OF LONDON",
      },
      isDecisionPoint: true,
      isEnding: true,
      targetRoles: ["CEO", "CISO", "CFO", "CLO"],
      expectedKeywords: ["reflection"],
      decisionOptions: [
        { key: "A", label: "Treating the 03:14 alert as a probable false positive" },
        { key: "B", label: "Letting trading run during the bulk encryption event" },
        { key: "C", label: "Paying the full counter under PSR pressure" },
        { key: "D", label: "The Beazley side-letter" },
      ],
    },

  ],
};
