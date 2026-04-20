import type { Scenario } from "../../types";

export const RANSOMWARE_TECHNICAL_SCENARIO: Scenario = {
  id: "tpl-ransomware-silver",
  title: "Ransomware: The Quiet Beacon - Technical Response",
  description:
    "03:14. A single low-confidence DNS beacon from a Treasury workstation. By 04:11 the next morning, 217 servers are encrypted and the Priority Services Register is in the attacker's hands. This is the technical team's version: detection, forensics, containment, ransom negotiation, PSR operations, and the handover brief that ends your shift. 23-inject arc built for CISO, COO, CLO and CFO. Decisions are yours. The executives are watching.",
  type: "RANSOMWARE",
  difficulty: "CRITICAL",
  durationMin: 180,
  isTemplate: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2026-04-16T00:00:00Z",
  coverGradient: "135deg, #050508 0%, #0a1a05 40%, #1a4a10 100%",
  audienceLabel: "For your CISO and technical incident response team. Tests containment decisions, negotiation posture, and operational recovery under pressure.",
  regulatoryFrameworks: [
    "Network security regulations",
    "72-hour data breach notification",
    "NCSC Cyber Assessment Framework",
    "Cyber Essentials Plus",
    "UK financial sanctions obligations",
  ],
  roles: ["CISO", "COO", "CLO", "CFO"],
  briefing:
    "You are the technical and operational leadership of Veridian Power plc: a FTSE 250 UK energy retailer with 3.2 million domestic supply contracts and one of the companies the government classifies as providing an essential service to the country. Your infrastructure runs the day-ahead wholesale trading desk and the Priority Services Register - 84,000 vulnerable customers who depend on power for oxygen concentrators, dialysis, and insulin refrigeration.\n\nIt is 03:14 on a Monday. You are the team in the room. The executives will be briefed by you. The decisions in the next five days - technical, legal, and operational - will determine what they have to defend. Start well.\n\nNote: your exercise ends with a handover brief to the executive leadership team. How you performed shapes what they face.",
  injects: [
    {
      id: "rws-i1",
      commandTier: "TACTICAL",
      tierSkipSummary:
        "At 03:14, SOC detected a suspicious DNS beacon from a Treasury workstation - periodic, machine-driven. The team initiated quiet forensic investigation, preserving the intelligence advantage.",
      order: 0,
      scenarioDay: 1,
      scenarioTime: "03:14",
      title: "Defender Alert: Outbound Beacon, Treasury Workstation",
      body: "03:14. Microsoft Defender for Endpoint fires a low-confidence alert. A single workstation in the Treasury team - TREASURY-LDN-019 - is making periodic outbound DNS lookups to a domain registered three days ago. The lookups are 3 minutes apart. Precise. Not human.\n\nThe workstation belongs to a senior treasury analyst who is asleep at home. SOC has 2 analysts on duty. The night shift lead asks the question that will define the next five days: do we wake people up, or do we open a ticket?\n\nContext: 7 similar low-confidence alerts this month. All false positives. This one has one additional signal: the periodicity is 180 seconds exactly. No human produces that rhythm.",
      facilitatorNotes:
        "This IS the first sign of an ALPHV intrusion. The attacker planted a foothold via a phished VPN credential five days ago and is currently mapping the OT/IT boundary.\n\nOption A (quiet forensic capture) is the rewarded answer - it preserves intelligence without tipping the attacker off. The image will later show the PHANTOMCOIL-STAGE directory with 11 host profiles and a partial PSR export.\n\nOption D is the catastrophic call. Stress this: the easy call at 03:14 becomes the impossible call at 04:11 tomorrow night. Run the asymmetry question hard - what's the cost of being wrong in each direction?\n\nCoach the CISO: what do you actually do in the next 10 minutes? Who do you call? What do you NOT do yet?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "Energy regulator Ofgem reviewing cyber resilience standards for retail suppliers - week ahead",
      artifact: {
        type: "siem_alert",
        siemAlertId: "DEFENDER-2026-44912",
        siemSeverity: "MEDIUM",
        siemSourceIp: "10.42.18.71 (TREASURY-LDN-019)",
        siemEventType:
          "Periodic Outbound DNS - Low-Reputation Domain - Single Host - 180s Interval",
      },
      isDecisionPoint: true,
      targetRoles: ["CISO", "COO"],
      expectedKeywords: [
        "forensic",
        "image",
        "beacon",
        "periodic",
        "Mandiant",
        "false positive",
        "DNS",
      ],
      recapLine: "opened with {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Quiet forensic image: pull a memory and disk image of TREASURY-LDN-019, leave the network connection live to keep watching the attacker",
          consequence:
            "The image captures the PHANTOMCOIL-STAGE directory - a complete lateral movement map - before the attacker notices anything. By 06:00 you know exactly which credentials are compromised, which segments are touched, and what data has been staged. You have time.",
          rank: 1,
          recapFragment: "a quiet forensic capture",
        },
        {
          key: "B",
          label:
            "Hard segment: kill the workstation, sweep all adjacent endpoints, lock down the Treasury VLAN immediately",
          consequence:
            "The attacker sees the lights go out and accelerates. They trigger encryption on three pre-staged file servers within 6 minutes. You stopped one host but lost the chance to map the full intrusion quietly. And the fire is spreading.",
          rank: 2,
          recapFragment: "a hard segment of the Treasury VLAN",
        },
        {
          key: "C",
          label:
            "Wake the CISO and escalate to Mandiant on retainer - pay the after-hours callout fee, treat this as real",
          consequence:
            "Mandiant are on the phone in 18 minutes and on-site by 06:30. They confirm the beacon is real, find two more compromised endpoints by sunrise, and call it an active intrusion. The clock is preserved. The after-hours fee is £4,200.",
          rank: 2,
          recapFragment: "an immediate Mandiant escalation",
        },
        {
          key: "D",
          label:
            "Log it as a low-priority ticket, mark the alert as probable false positive, and leave it for the morning shift",
          consequence:
            "By 07:30 the morning shift has 14 alerts and this one is buried. By 04:11 tomorrow morning you will be reading a ransom note. This is the opening line of every catastrophic ransomware after-action report ever written.",
          rank: 4,
          recapFragment: "treating it as a probable false positive",
        },
      ],
      branches: [
        {
          optionKey: "A",
          nextInjectId: "rws-path-a-staging",
          trackLabel: "Path A: Quiet forensic image. You can see everything they did.",
        },
        {
          optionKey: "B",
          nextInjectId: "rws-path-b-spread",
          trackLabel: "Path B: Hard segment. The attacker noticed.",
        },
        {
          optionKey: "C",
          nextInjectId: "rws-path-c-onsite",
          trackLabel: "Path C: Mandiant on-site. You called in the experts.",
        },
        {
          optionKey: "D",
          nextInjectId: "rws-path-d-morning",
          trackLabel: "Path D: The ticket sat in a queue for four hours.",
        },
      ],
    },
    {
      id: "rws-i2a",
      commandTier: "TACTICAL",
      tierSkipSummary:
        "Forensic imaging confirmed ALPHV intrusion via phished VPN credential. 11 hosts compromised, jump box on IT/OT boundary touched. Mandiant called as courtesy - ETA 06:30. Encryption not yet started.",
      order: 10,
      scenarioDay: 1,
      scenarioTime: "05:30",
      title: "Path A: The Staging Directory",
      body: "05:30. The forensic image is giving you things most IR teams never see. Your second-line analyst has found a directory on TREASURY-LDN-019 labelled PHANTOMCOIL-STAGE. Inside: 11 host profiles compiled over 5 days of quiet reconnaissance, 3 credential dumps including a domain admin hash, and a file called PSR_REPLICA_PARTIAL.7z - compressed and staged for exfiltration.\n\nThe attacker used a phished VPN credential belonging to a treasury contractor to plant the foothold five days ago. They have touched one jump box on the IT/OT boundary. They have not yet reached the customer billing tier or the PSR master database. They do not know they have been seen.\n\nMandiant are en route - called as a courtesy, not a panic. ETA 06:30. You have the one thing most victims never get: time and intelligence.",
      facilitatorNotes:
        "Best path. The team has the full picture before Mandiant even arrive. Key coaching questions:\n\n1. That PSR_REPLICA_PARTIAL.7z file - do you open it to understand the scope, or do you preserve it as forensic evidence? (Answer: preserve, document the hash, let Mandiant handle the analysis.)\n2. Do you brief the CEO now at 05:30 with incomplete information, or wait for Mandiant at 07:00 with a complete picture? (Coach: the governance clock started at 03:14. Every hour of delay is a fact in the ICO file.)\n3. What is the single most important thing you don't do right now? (Answer: don't touch the attacker's active sessions - don't tip them that you're watching.)",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Wholesale power markets open calmly - day-ahead gas contracts steady",
      artifact: {
        type: "voicemail",
        voicemailCaller: "Abena Osei - SOC Night Lead",
        voicemailCallerNumber: "+44 7700 900271",
        voicemailDuration: "1:22",
        voicemailTime: "05:28",
        voicemailTranscript:
          "Sarah. It's Abena. Time is 05:28. Call me as soon as you hear this, please. We've got the staging directory from the image. There's a folder called PHANTOMCOIL-STAGE and inside it there's eleven host profiles, three credential dumps including what looks like a domain admin hash, and a compressed archive labelled PSR underscore REPLICA underscore PARTIAL. I don't know what's in the archive. I haven't touched it. Marcus says to preserve everything. I'm writing down the hash right now. The attacker doesn't know we're looking. That's the good news. But I need you to know about that PSR file before you brief anyone. Don't email this.",
      },
      isDecisionPoint: false,
      targetRoles: ["CISO", "COO"],
      expectedKeywords: [
        "PSR",
        "staging",
        "credential",
        "domain admin",
        "forensic",
        "Mandiant",
      ],
      decisionOptions: [],
    },
    {
      id: "rws-i2b",
      commandTier: "TACTICAL",
      tierSkipSummary:
        "Hard segment of Treasury VLAN tipped the attacker. They accelerated, triggering encryption on pre-staged file servers in the billing tier. Mandiant called - ETA 90 minutes. Intelligence advantage lost.",
      order: 10,
      scenarioDay: 1,
      scenarioTime: "04:02",
      title: "Path B: The Segment Sweep",
      body: "04:02. The Treasury VLAN is dark. Your sweep has found two more endpoints with the same beacon - both on the wholesale trading floor back-office. At 04:09, Defender fires from a different segment entirely: BILLING-FILE-04, a file server in the customer billing tier. The attacker noticed. They are accelerating.\n\nYou stopped one host. You can hear the fire spreading through the walls.\n\nMandiant have been called and are 90 minutes out. The attacker now knows they have been seen. They have nothing to lose from moving fast.",
      facilitatorNotes:
        "Consequence of the hard segment. The intelligence advantage - knowing exactly which hosts were compromised - is gone. The team is now in a reactive race.\n\nKey coaching: loud containment has costs that don't appear in the playbook. The textbook says 'isolate' but the textbook was written for a different attacker. A staged ALPHV intrusion has tripwires. When the Treasury VLAN went dark, those tripwires fired.\n\nDon't let the team dwell - push them forward. They need to think about what they DO have: they know the billing tier is in scope now. What does that mean for the PSR? What do they tell Mandiant when they arrive?",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Wholesale power markets open calmly - day-ahead gas contracts steady",
      artifact: {
        type: "siem_alert",
        siemAlertId: "DEFENDER-2026-44919",
        siemSeverity: "HIGH",
        siemSourceIp: "10.51.2.118 (BILLING-FILE-04)",
        siemEventType:
          "Suspicious File Activity - Encryption Pattern Detected - Adjacent Segment to Contained Host",
      },
      isDecisionPoint: false,
      targetRoles: ["CISO", "COO"],
      expectedKeywords: ["billing", "spread", "encryption", "Mandiant", "PSR", "race"],
      decisionOptions: [],
    },
    {
      id: "rws-i2c",
      commandTier: "TACTICAL",
      tierSkipSummary:
        "Mandiant arrived 06:30 following the CISO's escalation. First call: 'You caught this early. Two more endpoints found on the trading back-office. No sign of PSR compromise - yet.' Attacker unaware. Clock preserved.",
      order: 10,
      scenarioDay: 1,
      scenarioTime: "06:30",
      title: "Path C: Mandiant On-Site",
      body: "06:30. Mandiant arrived 12 minutes ago. Their lead assessor's first statement: 'You did the right thing. This is real, it's active, and you caught it before encryption.'\n\nTheir second call, 18 minutes later: two more compromised endpoints found on the trading floor back-office - the RECON-TOOL-02 service account has been abused as a pivot point. No sign of compromise in the customer billing tier or the PSR database yet. The attacker still does not know they have been seen.\n\nMandiant's retainer reference is MAN-VRD-2026-0441. The after-hours callout fee is £4,200. The CFO will want to know the daily IR rate is £22,000. You bought something with that fee: a partner who has done this 400 times, and time.",
      facilitatorNotes:
        "Reward for Option C. Slightly less intelligence advantage than Path A (Mandiant moves at Mandiant's pace, not yours) but an external partner is already engaged and OFSI-aware.\n\nKey coaching: the CFO watching the retainer clock is a good discussion point. The £22,000/day Mandiant rate will quickly become the least expensive number in this incident. Ask the team: what is the cost of NOT calling Mandiant at 03:14?\n\nAlso: Mandiant's 'no sign of PSR compromise yet' needs to be stressed. 'Yet' is doing a lot of work. What is the team doing right now to confirm the PSR database's integrity?",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Wholesale power markets open calmly - day-ahead gas contracts steady",
      artifact: {
        type: "email",
        emailFrom: "incident@mandiant.com",
        emailTo: "s.khatun@veridianpower.co.uk",
        emailSubject:
          "Veridian Power - IR Engagement Confirmed - MAN-VRD-2026-0441 - On-site 06:30",
      },
      isDecisionPoint: false,
      targetRoles: ["CISO", "COO"],
      expectedKeywords: [
        "Mandiant",
        "engaged",
        "RECON-TOOL",
        "PSR",
        "billing",
        "retainer",
      ],
      decisionOptions: [],
    },
    {
      id: "rws-i2d",
      commandTier: "TACTICAL",
      tierSkipSummary:
        "25 hours later, 04:11 Tuesday. The ticket sat in the queue. Encryption hit 18 endpoints across 3 segments simultaneously. A ransom note was found. Mandiant are being called. The morning markets open in 2 hours.",
      order: 10,
      scenarioDay: 2,
      scenarioTime: "04:11",
      title: "Path D: 04:11 - The Note",
      body: "Tuesday, 04:11. 25 hours after the first beacon.\n\nThe morning shift's SOC handover yesterday marked the ticket as 'probable false positive' and moved on. Defender is now firing simultaneously across 18 endpoints on three segments. A junior analyst has called the CISO at home: 'It's bad. There's a note on one of them.'\n\nThe note opens: 'Veridian Power. We have been inside your network for six days. We have a full replica of the Priority Services Register. We have your wholesale trading book. You have 72 hours. The clock started when you found this note. Not when you decided to act.'\n\nMandiant are being called. The CEO is being called. The morning markets open in 102 minutes. The attacker has had one additional day of uncontested access to every system in your estate.",
      facilitatorNotes:
        "This is the brutal consequence of Option D. Let it land.\n\nKey point: 'The clock started when you found this note. Not when you decided to act.' That line is real - ALPHV use it deliberately. The 72-hour negotiation window was designed by professionals who know how victim organisations behave.\n\nDon't rush away from this. The team should feel the compounding effect of one bad call made in the dark. Ask: what is different about this moment compared to 03:14 yesterday? (Answer: the attacker holds all the cards. The intelligence advantage is gone, the forensic baseline is gone, and the timeline is gone.)\n\nThen push them forward - they have 102 minutes before the markets open.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Trading desks open - gas/power forwards quiet - FTSE pre-market: no sector alerts",
      artifact: {
        type: "ransomware_note",
        ransomAmount: "$9.4M",
        ransomDeadlineHours: 72,
        ransomWalletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      },
      isDecisionPoint: false,
      targetRoles: ["CISO", "COO", "CLO"],
      expectedKeywords: ["72 hours", "PSR", "trading book", "missed", "note", "clock"],
      decisionOptions: [],
    },
    {
      id: "rws-i2v",
      commandTier: "TACTICAL",
      tierSkipSummary:
        "First regulatory call made to NCSC under our network security obligations 2018. Notification clock formally started. NCSC assigned incident handler within 40 minutes.",
      order: 20,
      scenarioDay: 1,
      scenarioTime: "06:00",
      title: "The First Regulatory Call",
      body: "Whichever path you took to get here, you now know this is real and active. The CISO has confirmed the intrusion. The attacker has touched the IT/OT boundary.\n\nThe CLO is on the line with a single question: 'Who do we call first, and why? We have 72 hours from becoming aware of a significant incident to notify the national cyber security authority. Our awareness time is now. That clock is running. Separately, data protection law gives us 72 hours from becoming aware of a personal data breach to notify the ICO. We are not yet certain data has left the building - but that determination matters. Who goes first?'\n\nThis is the technical team's version of this question: not who the CEO calls, but who the CISO calls, and what you say.",
      facilitatorNotes:
        "Under our network security obligations 2018 (OES), the first call is to NCSC. This is the team that owns the technical response - the CLO should be driving this, with the CISO providing the technical grounds for the notification.\n\nThe GDPR/ICO question is a separate clock. Stress this: NIS notification to NCSC != GDPR notification to ICO. Many teams conflate them.\n\nOption A is correct: NCSC first establishes the cooperative posture and starts the formal NIS clock. Ofgem (Option D) will eventually hear, but they politely tell you to go to NCSC first when you jump the chain.\n\nPush the CLO: what exactly do you say in the NIS notification? What information do you have vs what do you not yet know? The ICO's own guidance says file with what you have, amend later.",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "Energy retailers face 'cyber resilience year' as Ofgem raises NIS reporting bar",
      artifact: {
        type: "email",
        emailFrom: "ciab@ncsc.gov.uk",
        emailTo: "s.khatun@veridianpower.co.uk",
        emailSubject:
          "NCSC CiAB: Cyber Incident - Automatic Acknowledgement - Reference NCSC-INC-2026-8841",
      },
      isDecisionPoint: true,
      targetRoles: ["CISO", "CLO"],
      expectedKeywords: ["NCSC", "NIS", "72 hours", "OES", "GDPR", "ICO", "Ofgem"],
      recapLine: "made the first regulatory call to {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Notify the national cyber security authority first. file with what we know now, CISO and CLO on the call, update as we learn more.",
          consequence:
            "NCSC respond within 40 minutes with a named incident handler. The notification clock is formally started. Ofgem will later note the cooperative posture as evidence of good NIS culture.",
          rank: 1,
          recapFragment: "notifying the national cyber security authority first",
        },
        {
          key: "B",
          label:
            "Internal first - complete Mandiant's initial assessment before any regulatory call so we know what we're reporting",
          consequence:
            "Mandiant's initial assessment arrives at 08:15. The notification goes in at hour 5. NCSC note the delay. The 72-hour clock was always running - waiting for a better story doesn't stop it.",
          rank: 3,
          recapFragment: "an internal Mandiant assessment before any regulatory call",
        },
        {
          key: "C",
          label:
            "Notify the data protection regulator first. the personal data staging file suggests a breach and the 72-hour clock is running.",
          consequence:
            "ICO acknowledge. But NCSC are the correct correct first call for a company of your designation. The CLO has inverted the priority order. NCSC note that the NIS notification came after the ICO filing.",
          rank: 2,
          recapFragment: "the ICO ahead of NCSC",
        },
        {
          key: "D",
          label:
            "Notify the energy regulator first. they need to hear this from us before the press gets there.",
          consequence:
            "Ofgem appreciate the call and politely tell you that under the correct first call is to the national cyber security authority. You have spent 25 minutes confirming what the CLO already knew. Ofgem note the sequence.",
          rank: 4,
          recapFragment: "Ofgem ahead of NCSC",
        },
      ],
    },
    {
      id: "rws-i2x",
      commandTier: "STRATEGIC",
      tierSkipSummary:
        "ICO holding notification filed at 06:11 - hour 3 of discovery. ALPHV posted proof-of-access on their leak site. No customer PII visible yet - directory listing only.",
      order: 25,
      scenarioDay: 1,
      scenarioTime: "05:47",
      title: "05:47 - ICO Notification and the First Dark Web Post",
      body: "05:47. Two things land in the same minute.\n\nFirst: the ALPHV leak site has updated. A new post titled 'VERIDIAN POWER PLC - PROOF OF ACCESS - PAYMENT WINDOW OPEN'. No customer records yet - just a directory listing showing: PSR_MASTER_LIVE (84,247 rows), BILLING_DB (3.2M accounts), TRADING_BOOK Q1 2026. This is their opening move. The ransom note hasn't arrived yet but the pressure campaign has started.\n\nSecond: the DPO has just joined the war room call. The 72-hour data protection regulator notification clock started when the SOC became aware of the anomaly - arguably at 03:14, definitely by 04:11 when encryption confirmed data compromise. We are already 2 hours 36 minutes into that window.\n\nThe DPO's question: 'Do we file a holding notification to the ICO now, or wait until we have full scope?'",
      facilitatorNotes:
        "Two parallel decisions here - ICO notification timing and the ALPHV proof-of-access post.\n\nOn the ICO: Option A is the ICO's own preferred posture. Their guidance explicitly says file early with what you have and amend later. They penalise firms that wait for the complete picture because 'waiting for full scope' is the most common reason for blown notification windows.\n\nOn the ALPHV post: key coaching is that this is standard ALPHV operating procedure. They post proof-of-access early to start the psychological clock before the ransom note even arrives. The CISO should brief the team on this pattern - it's not a new threat, it's a practised routine.\n\nThe CLO needs to understand that the GDPR ICO notification and the NIS NCSC notification are entirely separate obligations. Many teams think they're the same.",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "ICO publishes updated guidance on personal data breach notification timelines",
      artifact: {
        type: "dark_web_listing",
        darkWebSiteName: "ALPHV-BLACKCAT Expose",
        darkWebOnionUrl: "alphvblkz9mnfxt6.onion/veridian-access-proof",
        darkWebTitle: "VERIDIAN POWER PLC - PROOF OF ACCESS - PAYMENT WINDOW OPEN",
        darkWebPrice: "PENDING - $9.4M ransom window active",
        darkWebRecordCount: "Proof of access only - full dataset held pending payment",
        darkWebSampleRows: [
          {
            name: "[DIRECTORY LISTING ONLY]",
            account: "PSR_MASTER_LIVE - 84,247 rows",
            sortCode: "BILLING_DB - 3.2M accounts",
            email: "TRADING_BOOK - Day-ahead Q1 2026",
          },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CLO", "CISO"],
      expectedKeywords: [
        "ICO",
        "72 hours",
        "the notification obligation",
        "GDPR",
        "DPO",
        "holding",
        "phased",
      ],
      recapLine: "took the ICO notification posture of {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "File a holding notification to the data protection regulator now. they prefer early with gaps over late with the full picture.",
          consequence:
            "ICO acknowledge within 2 hours and assign a case officer. The notification is on-time. When scope is confirmed it is filed as an amendment, not a new late notification. The ICO's final report notes 'prompt and transparent engagement'.",
          rank: 1,
          recapFragment: "a prompt phased ICO notification",
        },
        {
          key: "B",
          label:
            "Wait for Mandiant to confirm scope before filing - a premature notification prejudices the investigation",
          consequence:
            "Scope is not fully confirmed until Day 3. The ICO notification is filed at hour 62. Technically within 72 hours, but the ICO asks why it took so long and notes the delay in their enforcement assessment.",
          rank: 3,
          recapFragment: "a delayed notification pending Mandiant's scope confirmation",
        },
        {
          key: "C",
          label:
            "Get external legal counsel's view on when the 72-hour notification clock started before filing anything.",
          consequence:
            "Counsel respond in 4 hours. Their opinion: notification clock triggered at 04:11 at the latest. Notification filed at hour 7. Legally defensible, timeliness slightly compromised. The ICO note the legal opinion delay.",
          rank: 2,
          recapFragment: "seeking legal counsel before filing",
        },
        {
          key: "D",
          label:
            "Notify the energy regulator under our network security obligations and ask them to coordinate with the data protection regulator on our behalf.",
          consequence:
            "Ofgem inform you that the network security regulations and data protection rules are separate regimes with separate notification obligations. You file to ICO at hour 8. The ICO note the confusion in their file.",
          rank: 4,
          recapFragment: "routing the ICO notification through Ofgem",
        },
      ],
    },
    {
      id: "rws-i3",
      commandTier: "TACTICAL",
      tierSkipSummary:
        "04:11: bulk encryption hit 217 servers. Confirmed encrypted: customer billing, trading book reconciliation, payroll, and a PSR replica. Master PSR database intact. Encryption triggered containment decision.",
      order: 30,
      scenarioDay: 1,
      scenarioTime: "04:11",
      title: "04:11 - The Encryption Event",
      body: "04:11. Coordinated encryption across 217 servers. Your SIEM is lighting up like a board game.\n\nConfirmed encrypted:\n- Customer billing tier - all transaction processing offline\n- Wholesale trading book reconciliation system - manual fallback only\n- Payroll - next run is Friday\n- PSR read-replica - last synced at 01:00 this morning\n\nMandiant's immediate assessment: the master PSR database appears intact. The replica - 84,000 records - was almost certainly exfiltrated before encryption. The attacker had it before they pulled the trigger.\n\nSupply is unaffected. Customers still have power. But the team running it is now flying blind.\n\nThe COO has one question: 'Do we shut everything down, or do we try to keep the trading desk running?'",
      facilitatorNotes:
        "This is the containment decision under fire. The key tension: aggressive containment stops the spread but kills the trading desk; selective containment keeps trading but gives the attacker a second bite.\n\nThe 'lights are still on' line is critical. This is not yet a power supply incident - it is a data and systems incident. That distinction matters to regulators and to the public.\n\nAsk: what is the cost of the manual trading fallback? (£1.8M in suboptimal hedging - the CFO should know this number.) What is the cost of letting the attacker re-encrypt a second tranche? (Potentially the entire customer billing database - unrecoverable from production.)\n\nPush the CISO: what is the specific command you are issuing to your team right now?",
      delayMinutes: 0,
      timerMinutes: 12,
      tickerHeadline:
        "BREAKING: Major UK energy retailer reportedly hit by overnight cyber incident - supply unaffected",
      artifact: {
        type: "ransomware_note",
        ransomAmount: "$9.4M",
        ransomDeadlineHours: 72,
        ransomWalletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      },
      isDecisionPoint: true,
      targetRoles: ["CISO", "COO", "CFO"],
      expectedKeywords: [
        "PSR",
        "containment",
        "manual trading",
        "billing",
        "shutdown",
        "encrypt",
      ],
      recapLine: "answered the encryption event by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Aggressive containment: shut all back-office systems, run wholesale trading on the manual fallback book",
          consequence:
            "Spread halted. The attacker is locked out. Trading goes manual - phone-and-spreadsheet for the day, estimated £1.8M in suboptimal hedging. Expensive but clean. PSR replica preserved as forensic evidence.",
          rank: 1,
          recapFragment: "aggressive containment with manual trading fallback",
        },
        {
          key: "B",
          label:
            "Selective containment: protect billing and the vulnerable customers database, let trading run on the affected systems. halt the spread where it hurts most.",
          consequence:
            "Trading desk continues. At 06:30 the attacker re-encrypts a second tranche of trading reconciliation files - systems they'd already staged but not yet hit. The selective approach bought 2 hours of trading and gave the attacker a second bite.",
          rank: 3,
          recapFragment: "selective containment that kept trading live",
        },
        {
          key: "C",
          label:
            "Full system-wide shutdown including customer-facing portal until Mandiant gives the all-clear",
          consequence:
            "Customer self-service goes dark. 740,000 customers get an error page. Trading goes manual. Spread halted. The dark portal becomes the news story by 07:00. Operationally clean, reputationally expensive.",
          rank: 2,
          recapFragment: "a full system-wide shutdown",
        },
        {
          key: "D",
          label:
            "Hold and observe - let Mandiant complete their forensic loop before any large containment move",
          consequence:
            "Encryption continues spreading for another 90 minutes. By 05:45 the trading book reconciliation is unrecoverable from production. Mandiant arrive to find a worse picture than they were briefed on.",
          rank: 4,
          recapFragment: "holding while the encryption spread",
        },
      ],
    },
    {
      id: "rws-i3b",
      commandTier: "STRATEGIC",
      tierSkipSummary:
        "Staff Slack filled with panic and speculation from 08:31. Call centre at 6x volume. Trading desk manual. CRM down. Staff finding out from BBC before leadership communicated internally.",
      order: 35,
      scenarioDay: 1,
      scenarioTime: "08:47",
      title: "08:47 - The Warroom Slack",
      body: "08:47. Your ir-warroom Slack is filling up. Mandiant, your SOC lead, and the IT director are all on the thread. The picture is coming together - and it is not good.\n\nSeparately, the head of customer operations has forwarded a message: '#all-company Slack is on fire. Staff are finding out from the BBC. Call centre is at 6x volume. CRM is down. We have 47 call centre agents handling 4,000 calls per hour on notepads. I have agents in tears.'\n\nThe trading desk is running manual. The day-ahead gas position is unhedged by approximately £2.3M. Bank counterparties are asking questions.\n\nThe CISO has a decision to make: when does the technical team brief the executives, and with what?",
      facilitatorNotes:
        "No vote on this inject - it is a warroom temperature check. Let it breathe.\n\nThe purpose is to show the human cost of the technical incident before the executive decisions have caught up. Forty-seven agents in tears. Customers being handled with notepads.\n\nKey coaching: the CISO's job at this point is to produce a clean technical picture for the executive briefing. Ask: what do you know right now that the CEO needs to know? What do you NOT know yet? What are the three most important things in your briefing note?\n\nAlso prompt: that £2.3M unhedged gas position is the CFO's problem, but the CISO has created it. What is the relationship between the technical decision (manual trading fallback) and the financial exposure?",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Veridian Power staff report widespread system outages - company silent",
      artifact: {
        type: "slack_thread",
        slackChannel: "#ir-warroom",
        slackMessages: [
          {
            author: "Mandiant Lead",
            role: "External IR",
            time: "08:31",
            text: "Encryption scope confirmed: 217 servers, 3 segments. PSR replica is in scope. Master database clean. Trading rec system unrecoverable from production. We are 78% through the containment sweep.",
          },
          {
            author: "Sarah K.",
            role: "CISO",
            time: "08:33",
            text: "What's the attacker's current posture? Are they still active in any live session?",
          },
          {
            author: "Mandiant Lead",
            role: "External IR",
            time: "08:35",
            text: "No active sessions detected since 04:11. They triggered and walked. Standard ALPHV pattern - encrypt, wait, negotiate. The next move is theirs.",
          },
          {
            author: "Dave C.",
            role: "IT Director",
            time: "08:39",
            text: "Trading desk confirmed manual at 06:00. Day-ahead gas position unhedged approximately £2.3M. Bank counterparties asking if we're okay.",
          },
          {
            author: "Sarah K.",
            role: "CISO",
            time: "08:41",
            text: "I need to brief the exec team. Mandiant - give me a 3-bullet summary I can walk in with. What do we know, what don't we know, what's the most dangerous unknown right now.",
          },
          {
            author: "Mandiant Lead",
            role: "External IR",
            time: "08:43",
            text: "Known: ALPHV, 217 servers encrypted, PSR replica exfiltrated, master intact. Unknown: full exfiltration scope, whether PSR replica was compressed/packaged for sale. Most dangerous unknown: did they exfiltrate the trading book too? If so the counterparties will know your positions.",
          },
        ],
      },
      isDecisionPoint: false,
      targetRoles: ["CISO", "COO", "CFO"],
      expectedKeywords: [
        "Mandiant",
        "PSR",
        "exfiltration",
        "trading",
        "manual",
        "brief",
      ],
      decisionOptions: [],
    },
    {
      id: "rws-insurance",
      commandTier: "STRATEGIC",
      tierSkipSummary:
        "Beazley cyber claims queried whether the VPN credential compromise stemmed from a known unpatched MFA vulnerability - deferred on the last pen test as 'medium'. The CFO and CLO face a potential $4M coverage exclusion.",
      order: 32,
      scenarioDay: 1,
      scenarioTime: "07:45",
      title: "07:45 - The Beazley Clock",
      body: "07:45. The CFO has forwarded an urgent message from Beazley, Veridian Power's cyber insurer.\n\nBeazley's claims division are asking a specific question: was the initial access vector a known, unpatched vulnerability? Their concern: the last penetration test, 14 months ago, flagged a vulnerability in the third-party MFA appliance used for VPN authentication as 'MEDIUM - deferred pending vendor patch'. That vulnerability was not patched before today's incident.\n\nIf the exclusion bites - 'known unpatched vulnerability at time of loss' - $4M of applicable cyber coverage evaporates. The CISO is the person who signed off the deferred status. The CFO is the person who approved the risk deferral.\n\nBeazley need a response within 24 hours.",
      facilitatorNotes:
        "This is the technical team's version of the insurance question - and it lands harder here than in the Gold room because the CISO signed the deferred pen test finding.\n\nOption A (notify immediately, full disclosure) is the right answer and mirrors the approach the Gold team should take with Ofgem. The same governance document - the pen test report - will appear in the Beazley response, the ICO investigation, and the Ofgem inquiry. The CLO needs to understand that you cannot have three different stories for three different audiences.\n\nKey coaching: did the CISO brief the board about the deferred MFA risk? If there's a paper trail showing board awareness and acceptance of the risk, that helps Beazley but potentially complicates Ofgem. If there isn't, the reverse applies. Neither is clean. That's the lesson.\n\nAsk: who made the decision to defer the MFA patch? What was the reasoning? Was it documented?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "Cyber insurance exclusions rising - industry report warns of 'known vulnerability' clause disputes",
      artifact: {
        type: "internal_memo",
        memoTitle: "URGENT: Beazley Cyber Claim - MFA Exclusion Risk Assessment",
        memoClassification: "STRICTLY CONFIDENTIAL - LEGAL PRIVILEGE",
        memoTo: "CISO, CFO, CLO",
        memoFrom: "Risk & Compliance",
        memoDate: "Monday 14 April 2026 - 07:45",
        memoRef: "VRD-RISK-INS-2026-0044",
      },
      isDecisionPoint: true,
      targetRoles: ["CFO", "CLO", "CISO"],
      expectedKeywords: [
        "Beazley",
        "MFA",
        "exclusion",
        "pen test",
        "deferred",
        "coverage",
        "patch",
      ],
      recapLine: "handled the Beazley insurance question by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Notify Beazley immediately with full disclosure - the pen test finding, the deferral decision, and the evidence of mitigation controls that were in place",
          consequence:
            "Beazley acknowledge the disclosure and shift the conversation from exclusion to mitigation. Coverage counsel engaged. The single honest answer saves an estimated 200 hours of legal work later.",
          rank: 1,
          recapFragment: "immediate full disclosure to Beazley",
        },
        {
          key: "B",
          label:
            "Respond to Beazley's question narrowly - answer only what they asked, don't volunteer the pen test finding",
          consequence:
            "Beazley discover the pen test report in the claims evidence package 3 weeks later. Coverage counsel note the incomplete initial response. The relationship is damaged and the exclusion conversation restarts from a weaker position.",
          rank: 3,
          recapFragment: "a narrow response that didn't volunteer the pen test",
        },
        {
          key: "C",
          label:
            "Instruct external insurance counsel before responding to Beazley - don't give them anything without legal sign-off",
          consequence:
            "Counsel are engaged by 10:00. Their advice is to disclose proactively. Response goes to Beazley at hour 16. The 24-hour window is met, legal defensibility is preserved, and the response is stronger for the preparation.",
          rank: 2,
          recapFragment: "taking insurance counsel before responding",
        },
        {
          key: "D",
          label:
            "Dispute the exclusion preemptively - the VPN credential phish, not the MFA vulnerability, was the primary attack vector",
          consequence:
            "Beazley's loss adjusters spend 3 weeks reviewing the technical evidence. The MFA vulnerability is assessed as a contributing factor. Coverage is partially denied. The dispute is settled at $2.1M - half of the applicable limit.",
          rank: 4,
          recapFragment: "disputing the MFA exclusion preemptively",
        },
      ],
    },
    {
      id: "rws-i4",
      commandTier: "STRATEGIC",
      tierSkipSummary:
        "14:30: full ransom note delivered. ALPHV, $9.4M, 48 hours. PSR sample attached - 200 rows including Margaret Thornton, 77, Carlisle, home oxygen concentrator. Mandiant confirmed sample authentic.",
      order: 50,
      scenarioDay: 1,
      scenarioTime: "14:30",
      title: "14:30 - The Full Ransom Note",
      body: "14:30. The full ransom note has been delivered through the encrypted-files window on a recovered workstation. The threat actor is ALPHV. They want $9.4M in Bitcoin within 48 hours.\n\nAttached to the note: a 200-row sample from the Priority Services Register. Row 47: Margaret Elaine Thornton, 77, Carlisle, CA1 3NP. Home oxygen concentrator. NHS medical dependency code. Emergency contact: daughter Sandra Thornton.\n\nMandiant have authenticated the sample. It is real.\n\nThe technical team now faces the same question the executive team will face - but from a different angle. The executives will decide whether to pay. Before they can decide that, the technical team needs to tell them: what is the realistic recovery timeline without payment? What do we actually know about ALPHV's track record on deletion commitments? What is the OFSI risk?\n\nThis is your analysis. They will make the call based on what you give them.",
      facilitatorNotes:
        "The ransom note lands in both scenarios. In Silver, the framing is different: this team does NOT make the strategic payment decision - that is Gold's call. But they need to provide the technical analysis that informs it.\n\nKey questions for the CISO:\n- What is the realistic restoration timeline without decryption keys? (Mandiant estimate 5-9 days for what was affected)\n- What is ALPHV's historical track record on deletion commitments? (Mandiant data: 40-60% publish data even after payment)\n- Is ALPHV currently on the OFSI SDN list? (Not at this moment, but reviewed weekly - CFO needs to know this)\n- What percentage of files could be recovered without the keys? (Approximately 30% from backup - explain why)\n\nThe Margaret Thornton detail is here in both scenarios for a reason. In Silver, the question is operational: how do we stand up the PSR outreach programme? In Gold, it is strategic and accountability-focused. Push the CISO: who is going to call Margaret Thornton before she reads about herself in The Times?",
      delayMinutes: 0,
      timerMinutes: 14,
      tickerHeadline:
        "Veridian Power confirms cyber incident - 'investigation ongoing, supply unaffected, customer data may be impacted'",
      artifact: {
        type: "ransomware_note",
        ransomAmount: "$9.4M",
        ransomDeadlineHours: 48,
        ransomWalletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      },
      isDecisionPoint: true,
      targetRoles: ["CISO", "COO", "CLO", "CFO"],
      expectedKeywords: [
        "ALPHV",
        "PSR",
        "ransom",
        "Beazley",
        "OFSI",
        "recovery",
        "restoration",
        "Margaret",
      ],
      recapLine: "gave the executive team the technical posture of {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Recommend refuse-and-restore to the executive team: restoration is viable in 5-9 days and ALPHV's deletion promise is not credible",
          consequence:
            "Clean technical recommendation. The executives receive a clear, defensible position backed by Mandiant's track record data. Restoration timeline is set and managed from this point.",
          rank: 1,
          recapFragment: "a refuse-and-restore recommendation",
        },
        {
          key: "B",
          label:
            "Recommend a stall position: open a chat to buy 24 hours of forensic progress, no commitment either way",
          consequence:
            "ALPHV respond in 11 minutes. They are experienced and will give exactly 24 hours. The technical team gets the forensic time but burns it against a hard deadline. Mandiant rate this as a credible posture if the restoration track is genuinely moving.",
          rank: 2,
          recapFragment: "a 24-hour technical stall",
        },
        {
          key: "C",
          label:
            "Recommend professional negotiation: bring in specialist ransomware negotiators, the 84,000 vulnerable customer records are too large a risk to wait out a 5-9 day restoration.",
          consequence:
            "Specialist ransomware negotiators engaged. Negotiation begins. ALPHV accept at $7.8M. The UK sanctions risk is being assessed in parallel. The technical team's restoration work continues as a parallel track.",
          rank: 3,
          recapFragment: "bringing in specialist negotiators as a parallel track",
        },
        {
          key: "D",
          label:
            "Recommend immediate payment to end the extortion clock and protect the 84,000 people on the vulnerable customers list.",
          consequence:
            "Beazley decline to authorise payment until sanctions clearance. Decryption keys will work on approximately 60% of files. The PSR will be published on four mirrors within the hour - ALPHV already mirrored it before the ransom note arrived.",
          rank: 4,
          recapFragment: "immediate payment to protect the PSR",
        },
      ],
    },
    {
      id: "rws-i4a",
      commandTier: "STRATEGIC",
      tierSkipSummary:
        "15:19: ALPHV posted the full PSR listing on their leak site with 5 PII sample rows visible. Margaret Thornton's medical dependency data publicly visible. Listing priced at 18 Monero. Mandiant confirmed authentic.",
      order: 55,
      scenarioDay: 1,
      scenarioTime: "15:19",
      title: "15:19 - The Listing Goes Live",
      body: "15:19. ALPHV have moved from proof of access to proof of possession.\n\nThe leak site now shows: 'VERIDIAN POWER PLC - PRIORITY SERVICES REGISTER - FULL DATASET - 84,247 RECORDS'. Price: 18 Monero (approximately £120,000) - or included in the $9.4M settlement.\n\nSample rows visible without payment:\n\nRow 1: Margaret Elaine Thornton, 77, Carlisle CA1 3NP - Home oxygen concentrator, NHS Dependency HO3. Emergency contact: daughter Sandra Thornton 07700 900441.\nRow 2: Robert James Mensah, 64, Leeds LS7 2BT - Dialysis patient, home unit.\nRow 3: Patricia Anne Holloway, 58, Derby DE1 1GA - Powered wheelchair, stair lift.\n\nMandiant confirm: this is real data.\n\nIn Carlisle, Margaret Thornton does not yet know her medical condition is for sale.",
      facilitatorNotes:
        "This is a horror reveal. No vote. Let it sit.\n\nPause for 30 seconds before asking any questions. The room should absorb what they are reading.\n\nThen ask the operational question: how many calls can the customer operations team make per hour? (2,000.) How long to reach all 4,218 Category 1 customers? (2 hours.) How long to reach all 84,247? (42 hours at full stretch with agency support.)\n\nAsk the CISO: what is the first thing you want to do? (Most will say 'call the DNOs' or 'start the outreach programme' - both correct. Push them to the next inject.)\n\nThe facilitator should not say 'that's terrible' and move on. Sit with it.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "ALPHV post samples of Veridian Power Priority Services Register - medical data of vulnerable customers visible",
      artifact: {
        type: "dark_web_listing",
        darkWebSiteName: "ALPHV-BLACKCAT Data Market",
        darkWebOnionUrl: "alphvblkz9mnfxt6.onion/veridian-psr-full",
        darkWebTitle:
          "Veridian Power plc - Priority Services Register - FULL DATASET - 84,247 Records",
        darkWebPrice: "18 Monero (~£120,000) or included in $9.4M settlement",
        darkWebRecordCount: "84,247 verified records",
        darkWebSampleRows: [
          {
            name: "Margaret Elaine Thornton",
            account: "VRD-8841-2203",
            sortCode: "CA1 3NP",
            email: "m.thornton1947@hotmail.co.uk",
          },
          {
            name: "Robert James Mensah",
            account: "VRD-2217-8840",
            sortCode: "LS7 2BT",
            email: "r.mensah.dialysis@nhs.uk",
          },
          {
            name: "Patricia Anne Holloway",
            account: "VRD-5521-0047",
            sortCode: "DE1 1GA",
            email: "pholloway_derby@gmail.com",
          },
          {
            name: "David Michael Kaczmarek",
            account: "VRD-9903-6612",
            sortCode: "NG1 5DT",
            email: "dkaczmarek74@outlook.com",
          },
          {
            name: "Sian Mwangi-Hughes",
            account: "VRD-1178-4430",
            sortCode: "CF10 1EP",
            email: "s.mwangihughes@yahoo.co.uk",
          },
        ],
      },
      isDecisionPoint: false,
      targetRoles: ["CISO", "COO", "CFO", "CLO"],
      expectedKeywords: [
        "PSR",
        "Margaret",
        "vulnerable",
        "Category 1",
        "oxygen",
        "listing",
        "outreach",
      ],
      decisionOptions: [],
    },
    {
      id: "rws-i4x",
      commandTier: "STRATEGIC",
      tierSkipSummary:
        "PSR outreach: 84,247 customers confirmed in scope. 4,218 Category 1 medically dependent. Decision made to start Cat 1 outreach immediately regardless of media risk. DNOs briefed in parallel.",
      order: 57,
      scenarioDay: 1,
      scenarioTime: "15:24",
      title: "15:24 - The 84,247 Question",
      body: "15:24. The PSR listing is live. The operational decision cannot wait.\n\nHead of Customer Operations, Tom Osei, is on the line:\n\n'84,247 customers in the PSR. 4,218 are Category 1 - medically dependent on powered equipment: home oxygen, dialysis, insulin refrigeration, powered wheelchairs. The rest are Category 2: welfare and social vulnerability.\n\nWe have full contact details for all of them. Normal outbound call capacity: 2,000 per hour. Time to reach all Category 1 customers: 2 hours. All 84,247: 42 hours at full stretch with agency support.\n\nMandy from the Carlisle depot called Margaret Thornton personally 20 minutes ago - she knew her from a service visit. That is one. The other 84,246 are waiting.'\n\nMandiant raise a caution: large-scale outbound calling will tip the media to the full PSR angle before the executive comms strategy is locked.",
      facilitatorNotes:
        "This decision appears in both scenarios. In Silver, it is operational: who calls first, how do we do it, what do the call centre agents say?\n\nKey tensions:\n- Mandiant's media caution is real but manageable. No reasonable journalist will write critically about a company that proactively called oxygen-dependent customers.\n- The Cat 1/Cat 2 split matters. 4,218 Cat 1 customers in 2 hours is achievable. The Cat 2 cohort needs a parallel programme.\n- DNO briefing before outreach: if a Cat 1 customer panics and cuts their power, the DNO needs to be ready to deploy a field engineer.\n\nAsk the COO: what is the script for the call centre agents? What do they say when a Cat 1 customer asks 'is my data safe?' (It isn't - be honest but measured.)\n\nAsk the CISO: what do you put in the briefing note to the executive team about PSR outreach status?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "Veridian Power: 84,247 Priority Services Register customers 'may have been accessed'",
      artifact: {
        type: "email",
        emailFrom: "t.osei@veridianpower.co.uk",
        emailTo: "crisis-team@veridianpower.co.uk",
        emailSubject: "URGENT: PSR outreach - 84,247 customers - operational plan needed NOW",
      },
      isDecisionPoint: true,
      targetRoles: ["COO", "CLO", "CISO"],
      expectedKeywords: [
        "Category 1",
        "oxygen",
        "dialysis",
        "DNO",
        "outreach",
        "call",
        "script",
        "Mandiant",
      ],
      recapLine: "approached the PSR outreach by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Start Category 1 outreach immediately. brief the local electricity network operators in parallel, begin calls now regardless of the media risk.",
          consequence:
            "4,218 calls completed by 18:00. 31 customers require urgent follow-up including a welfare check in Sheffield. The Times runs the PSR angle but leads with 'Veridian calls vulnerable customers personally'. The media risk is manageable.",
          rank: 1,
          recapFragment:
            "starting Category 1 outreach with local network operators briefed in parallel",
        },
        {
          key: "B",
          label:
            "Brief the local network operators first so engineers are on standby. then begin calls once the support infrastructure is in place.",
          consequence:
            "Local network operators briefed by 16:00. Fourteen engineers put on standby across five regions. When outreach begins at 17:30 there is field support in place. Three customers needed a welfare visit. This is the measured answer.",
          rank: 2,
          recapFragment: "briefing local network operators before beginning customer outreach",
        },
        {
          key: "C",
          label:
            "Issue a direct message to all 84,247 affected customers tonight. scale over individual phone calls.",
          consequence:
            "SMS sent at 22:00 to all 84,247 numbers. 14,000 calls to the emergency line before midnight. Three major newspapers lead with PSR on front pages. The outreach is seen as reactive but comprehensive.",
          rank: 2,
          recapFragment: "mass SMS to all 84,247 PSR customers overnight",
        },
        {
          key: "D",
          label:
            "Wait 24 hours - restoration may deliver decryption keys, allowing us to offer a resolution alongside the notification",
          consequence:
            "24 hours later, Margaret Thornton reads about herself in The Times. Her daughter calls in distress. A welfare check finds she hasn't slept. The Ombudsman receives a formal complaint before we reach her.",
          rank: 4,
          recapFragment: "delaying PSR outreach by 24 hours",
        },
      ],
    },
    {
      id: "rws-i4v",
      commandTier: "STRATEGIC",
      tierSkipSummary:
        "15:42: the ALPHV negotiation chat window opened. Mandiant took the keyboard. ALPHV confirmed professional, engaged formally. Countdown: 24 hours on the PSR drop.",
      order: 60,
      scenarioDay: 1,
      scenarioTime: "15:42",
      title: "15:42 - The Chat Window",
      body: "15:42. Whatever the executive team's ransom posture, the chat window is open. ALPHV have a live operator on the other end. They are professional. They have done this 200 times.\n\nThis is what the technical team sees - the actual negotiation in real time:\n\nThey know the identity of the negotiator within 3 messages. They are already shaping the conversation. The PSR countdown clock is ticking.\n\nWho runs this negotiation? That decision was passed to the executive team - but the CISO owns the technical oversight. You are watching this conversation happen. If something goes wrong on the keyboard, the technical team carries it.",
      facilitatorNotes:
        "The chat window appears in both scenarios. In Silver, the decision is operational: the CISO is watching, not driving. But they need to understand what's happening and be able to intervene if the keyboard operator makes a technical error.\n\nKey coaching: the first message sets the entire negotiation tone. Ask the CISO: what does a good opening message look like? What does a bad one look like? (Good: acknowledges receipt without conceding intent. Bad: mentions the PSR by name - gives ALPHV confirmation of your emotional pressure points.)\n\nThe CISO should also be tracking: has ALPHV been added to the OFSI SDN list since this morning? The list is reviewed weekly. A payment after SDN listing is a criminal offence regardless of when the negotiation started.",
      delayMinutes: 0,
      timerMinutes: 12,
      tickerHeadline:
        "ALPHV leak site posts countdown: 'Veridian Power - PSR drop in 24 hours unless payment received'",
      artifact: {
        type: "negotiation_chat",
        negotiationThreatAlias: "ALPHV-SUPPORT",
        negotiationMessages: [
          {
            side: "threat",
            text: "Hello Veridian Power. We see your team is now online. You have reviewed our terms. What is your position?",
            time: "15:43",
          },
          {
            side: "negotiator",
            text: "We acknowledge receipt of your communication. We are reviewing the matter internally.",
            time: "15:47",
          },
          {
            side: "threat",
            text: "We respect that answer. We are patient professionals. The clock is clear. 22 hours 13 minutes remaining. We hold 84,247 records. Your customers in Carlisle will read about themselves in The Times tomorrow morning if we do not receive confirmation of intent.",
            time: "15:49",
          },
          {
            side: "threat",
            text: "We have completed this process 200 times. Companies that engage promptly receive the best outcomes. Companies that stall beyond 6 hours find us less accommodating. We recommend a position statement before 22:00 tonight.",
            time: "15:51",
          },
          {
            side: "threat",
            text: "One additional point. We are aware that you have Mandiant on-site. We have worked with Mandiant many times. We have great respect for them. This does not change the clock.",
            time: "15:54",
          },
        ],
      },
      isDecisionPoint: false,
      targetRoles: ["CISO", "CLO", "CFO"],
      expectedKeywords: [
        "Mandiant",
        "OFSI",
        "SDN",
        "keyboard",
        "negotiation",
        "PSR",
        "22:00",
      ],
      decisionOptions: [],
    },
    {
      id: "rws-i5",
      commandTier: "STRATEGIC",
      tierSkipSummary:
        "Day 3, 11:00: ALPHV countered at $6.2M, 12-hour fuse. Mandiant rated the deletion commitment as low credibility. The executive team's counter-instruction needed. Technical recommendation: lowball at $2.4M with verification conditions.",
      order: 70,
      scenarioDay: 3,
      scenarioTime: "11:00",
      title: "Day 3, 11:00 - The Counter",
      body: "Day 3, 11:00. The negotiation has been running for 19 hours. ALPHV have countered: $6.2M. 12-hour fuse. A written commitment - in the chat window - that the PSR will be deleted from all mirrors and no public leak will occur.\n\nMandiant's private assessment, for technical eyes only:\n\n'ALPHV deletion commitments: in our experience across 200+ ALPHV engagements, 40-60% publish data regardless of payment. The deletion commitment in the chat is standard text. It is not enforceable. We have never successfully verified ALPHV deletion of data post-payment. We recommend the executive team understand this before authorising any counter.'\n\nBeazley have agreed to cover up to $4M conditional on sanctions clearance. Restoration is 60% complete. The PSR master is intact. The replica has been viewed 14,000 times on dark web forums.\n\nThe executive team needs a technical recommendation from this room.",
      facilitatorNotes:
        "In Silver, the team is providing the technical analysis for the executive decision. They are not making the payment decision - but they ARE making the negotiating posture recommendation.\n\nMandiant's 40-60% publication rate is the key fact. Ask the CISO: how do you communicate this to the executive team? In what format? With what level of certainty?\n\nKey coaching: the technical recommendation should include:\n1. Restoration status and timeline (60% complete, 5-9 days to full restoration)\n2. ALPHV deletion track record (low credibility, 40-60% publish regardless)\n3. OFSI status as of today (not on SDN list - but checked when?)\n4. Beazley coverage position ($4M available subject to sanctions clearance)\n5. Technical recommendation (lowball with verification conditions is the strongest negotiating position that doesn't close the door)",
      delayMinutes: 0,
      timerMinutes: 14,
      tickerHeadline:
        "Reuters: 'Veridian Power in active ransom negotiation - sources put demand near $9M'",
      artifact: {
        type: "negotiation_chat",
        negotiationThreatAlias: "ALPHV-SUPPORT",
        negotiationMessages: [
          {
            side: "threat",
            text: "We have reviewed the situation. We are prepared to reduce our demand to $6.2M USD. This is our final position. You have 12 hours from this message. Upon payment confirmation we will provide working decryption keys and permanently delete all copies of the Priority Services Register from our infrastructure and mirrors.",
            time: "10:47",
          },
          {
            side: "threat",
            text: "We understand you have a legal obligation to notify your regulators. We have no objection to this. We are professionals. We ask only that any public statement does not characterise us in terms that would damage our reputation in this market.",
            time: "10:51",
          },
          {
            side: "negotiator",
            text: "We have received your counter. We are consulting internally. We will respond within the hour.",
            time: "11:03",
          },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CISO", "CLO", "CFO"],
      expectedKeywords: [
        "deletion",
        "credibility",
        "40-60%",
        "Beazley",
        "OFSI",
        "restoration",
        "recommendation",
      ],
      recapLine:
        "gave the executive team the negotiation recommendation of {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Recommend lowball: counter at $2.4M with independent third-party deletion verification as a condition",
          consequence:
            "ALPHV respond with 'lol' and counter at $5.4M. The negotiation continues. The negotiation team rate the position as 'aggressive but respected'. The 12-hour fuse extends informally to 18 hours. The verification condition was never going to be accepted but it establishes a principle.",
          rank: 1,
          recapFragment: "a $2.4M lowball counter with verification conditions",
        },
        {
          key: "B",
          label:
            "Recommend a 6-hour stall: claim board approval is needed, use the time to push restoration forward",
          consequence:
            "The fuse contracts to 6 hours. Mandiant get another 12% of restoration complete. ALPHV post a fresh PSR sample to a fourth forum. The Carlisle customer's name appears on Reddit.",
          rank: 2,
          recapFragment: "a 6-hour board-approval stall",
        },
        {
          key: "C",
          label:
            "Recommend paying the counter - Mandiant's deletion track record is irrelevant if we have no better option",
          consequence:
            "The executive team authorise $4M from Beazley and $2.2M from corporate cash. Decryption keys work on 60% of files. The PSR is mirrored to a fifth site before the wire clears. The deletion commitment is broken before the funds land.",
          rank: 4,
          recapFragment: "paying the $6.2M counter",
        },
        {
          key: "D",
          label:
            "Recommend closing the chat: the deletion commitment has no credibility, restoration is the only defensible path",
          consequence:
            "The window closes. The countdown continues. Mandiant shift resources to restoration. The PSR publishes in 12 hours on schedule. Restoration is complete in 7 days. 27,000 PSR records are scraped before takedown.",
          rank: 1,
          recapFragment: "closing the chat and accepting publication risk",
        },
      ],
    },
    {
      id: "rws-i5a",
      commandTier: "STRATEGIC",
      tierSkipSummary:
        "Day 3, 09:00: Beazley queried MFA exclusion. Secretary of State made public statement. Ofgem issued formal NIS request. All three linked by the same governance document - the deferred pen test.",
      order: 75,
      scenarioDay: 3,
      scenarioTime: "09:00",
      title: "Day 3, 09:00 - The Secretary of State",
      body: "Day 3, 09:00. Three things arrive in 15 minutes.\n\n08:52: Beazley's formal query arrives - with a formal case reference. The MFA exclusion question. You have 5 business days to respond.\n\n09:03: A statement from the Secretary of State for Energy Security, live on Sky News: 'I am deeply concerned about the situation at Veridian Power. The Priority Services Register exists to protect our most vulnerable citizens. I have asked NCSC and Ofgem for an urgent briefing. Parliamentary questions have been tabled for Thursday.'\n\n09:07: An email from Ofgem - formal written request for a full incident report within 14 days, with note that an enforcement notice is 'under active consideration'.\n\nAll three are linked by the same governance gap: the deferred MFA pen test finding. The technical team holds the key document.",
      facilitatorNotes:
        "No vote - this is a scene-setter for the rw-i6a decision in the Gold scenario. In Silver, the relevant point is: the technical team needs to prepare the pen test documentation clearly for the Gold team's use.\n\nKey coaching: the pen test report is the document that will appear in the Beazley response, the Ofgem inquiry, and the ICO investigation. All three are going to ask the same question: why was the MFA vulnerability deferred?\n\nAsk the CISO: who wrote the risk acceptance on the MFA deferral? Is that decision documented? Was it escalated to the board? The answers to those questions will define the Gold team's Ofgem/Beazley position.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Energy Secretary: 'deeply concerned' - parliamentary questions tabled - Ofgem signals NIS enforcement",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "SKY NEWS",
        tvHeadline:
          "ENERGY SECRETARY: 'DEEPLY CONCERNED' ABOUT VERIDIAN POWER PSR BREACH",
        tvTicker:
          "Parliamentary questions tabled for Thursday - Ofgem confirms NIS enforcement under consideration - Beazley queries cyber policy exclusion",
        tvReporter: "WESTMINSTER",
      },
      isDecisionPoint: false,
      targetRoles: ["CISO", "CLO", "CFO"],
      expectedKeywords: [
        "Secretary of State",
        "Ofgem",
        "Beazley",
        "pen test",
        "MFA",
        "parliamentary",
      ],
      decisionOptions: [],
    },
    {
      id: "rws-restoration",
      commandTier: "TACTICAL",
      tierSkipSummary:
        "Day 4: restoration at 78% following Mandiant's controlled recovery programme. CISO patch validation completed before any payments ran. Trading desk back on primary book.",
      order: 85,
      scenarioDay: 4,
      scenarioTime: "08:00",
      title: "Day 4, 08:00 - Restoration Progress and the Patch Decision",
      body: "Day 4, 08:00. Mandiant's restoration programme is at 78%. The wholesale trading desk is back on the primary book. Customer billing is recovering - 62% of account records accessible.\n\nAt 15:48 yesterday, the initial recovery point was reached. At that moment, Mandiant flagged a decision that sits with the CISO:\n\n'The decryption keys - obtained through whatever route the executive team chose - or the backup restoration path - requires us to apply a vendor-supplied patch to the database cluster before payment processing resumes. We have not seen the patch notes. We have not reviewed the code. We are being asked to run 60,000 financial transactions on a restored system patched by people we've never audited. My recommendation is 45 minutes of CISO validation before any payments run.'\n\nThe payments team says every minute costs £40,000 in delayed settlement float. The CISO is on the clock.",
      facilitatorNotes:
        "The restoration validation decision - a pure technical call that belongs entirely to the CISO.\n\nOption B (wait 45 minutes for CISO validation) is correct. Option A (immediate processing) is the operational pressure choice. The coaching question: what are you actually validating for in 45 minutes? If the patch has a second vulnerability, what is the worst case? (Answer: corrupted payment data - which is worse than the original outage.)\n\nThis decision also appears in the infrastructure-outage scenario in a banking context. The principle is the same: the person responsible for security must validate before financial transactions run on a restored system. The payments team's £40,000/minute figure is real pressure - but it's the wrong number to optimise against.",
      delayMinutes: 0,
      timerMinutes: 12,
      tickerHeadline:
        "Veridian Power restoration underway | trading desk operational | payment processing status unknown",
      artifact: {
        type: "slack_thread",
        slackChannel: "#ir-warroom",
        slackMessages: [
          {
            author: "Mandiant Lead",
            role: "External IR",
            time: "07:52",
            text: "Restoration at 78%. Trading desk primary book confirmed operational since 06:00. Customer billing 62% accessible. One decision pending before payment processing resumes.",
          },
          {
            author: "Sarah K.",
            role: "CISO",
            time: "07:54",
            text: "What's the pending decision?",
          },
          {
            author: "Mandiant Lead",
            role: "External IR",
            time: "07:56",
            text: "Vendor patch on the database cluster. We haven't reviewed the code. 45 minutes of CISO validation before we run payment settlement. I'm not putting 60,000 transactions through a system restored by a patch we haven't seen.",
          },
          {
            author: "Helen M.",
            role: "Head of Payments Operations",
            time: "07:58",
            text: "Every minute of delay is £40k in settlement float. We need to run NOW.",
          },
          {
            author: "Mandiant Lead",
            role: "External IR",
            time: "08:00",
            text: "Understood. CISO call.",
          },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CISO", "COO"],
      expectedKeywords: [
        "patch",
        "validate",
        "45 minutes",
        "payment",
        "settlement",
        "code review",
      ],
      recapLine: "made the restoration decision by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Begin payment processing immediately - the customer cost of further delay outweighs the patch risk",
          consequence:
            "Payments begin. No data integrity issues are found. The CISO documents their objection formally. In the post-incident review this decision is noted as a risk accepted under time pressure, not a best-practice model.",
          rank: 3,
          recapFragment: "beginning payment processing without patch validation",
        },
        {
          key: "B",
          label:
            "Wait 45 minutes for CISO patch validation - 60,000 transactions do not run on an unreviewed system",
          consequence:
            "Validation is complete by 08:45. The patch is clean. Payments begin at 08:47. The validation log becomes a key document in the vendor review and the ICO investigation file.",
          rank: 1,
          recapFragment: "waiting for the CISO's 45-minute patch validation",
        },
        {
          key: "C",
          label:
            "Run payments but publish a notice that CISO validation is running concurrently",
          consequence:
            "Payments begin at 08:05. Validation completes at 08:50 - patch is clean. The concurrent notice generates press attention: 'Veridian resumes payments before security check complete'. Accurate but unkind framing.",
          rank: 2,
          recapFragment: "running payments concurrently with CISO validation",
        },
        {
          key: "D",
          label:
            "Commission an emergency Mandiant code review of the vendor patch - 4 hours minimum",
          consequence:
            "Mandiant confirm the patch is clean at 12:30. Payments begin at 12:35. The security assurance is the strongest available. The additional 4-hour delay at £40,000/minute is extremely difficult to defend to anyone except the CISO.",
          rank: 4,
          recapFragment: "commissioning an emergency Mandiant code review",
        },
      ],
    },
    {
      id: "rws-handover-prep",
      commandTier: "STRATEGIC",
      tierSkipSummary:
        "Day 4: technical team produced executive handover brief - incident timeline, regulatory status, PSR outreach progress, restoration percentage, and recommendation on Beazley/Ofgem coupling.",
      order: 92,
      scenarioDay: 4,
      scenarioTime: "16:00",
      title: "Day 4, 16:00 - The Handover Brief",
      body: "Day 4, 16:00. Restoration is at 88%. The executive team is preparing for the Day 5 board session. They need one document from the technical team: the handover brief.\n\nThis is your last significant act in this scenario. The brief you produce will go to the CEO, CFO, CLO, CCO and the board. It will be read by the Ofgem inspector. It may eventually be read by the ICO.\n\nThe CLO has asked for it to cover: (1) a clean incident timeline, (2) regulatory notification status, (3) PSR outreach numbers, (4) restoration percentage and ETA, (5) Beazley/Ofgem - the MFA governance question - one paragraph.\n\nYou have 45 minutes. The document should be technically accurate, unambiguous, and brief enough to be read in 4 minutes.",
      facilitatorNotes:
        "The handover brief is the mechanism that connects the two scenarios. In a real run, this document would be pre-seeded into the Gold scenario as the opening artifact.\n\nThis inject has no vote - it is a reflective act. Ask the CISO:\n1. What is the single most important thing you need the CEO to understand that they may not already?\n2. What is the one thing the legal team needs to know that they might not have been told?\n3. Is there anything in the technical findings that changes the Gold team's Ofgem/Beazley position?\n\nAlso: what do you NOT put in the brief? The CISO should understand that some technical detail (specific vulnerability identifiers, exact CVE numbers) may be harmful to put in a document that will appear in regulatory files.\n\nThis is also the moment where the team can see the through-line: every decision they made from 03:14 onwards is now being summarised in 4 minutes. Did they make decisions they're proud to put in writing?",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "Veridian Power Day 4 update due - board session Thursday - markets watching",
      artifact: {
        type: "internal_memo",
        memoTitle:
          "INCIDENT HANDOVER BRIEF - VERIDIAN POWER PLC - TECHNICAL TO EXECUTIVE",
        memoClassification:
          "STRICTLY CONFIDENTIAL - LEGAL PRIVILEGE - BOARD EYES ONLY",
        memoTo: "CEO, CFO, CLO, CCO - Executive Leadership Team",
        memoFrom: "S. Khatun, Chief Information Security Officer",
        memoDate: "Day 4 - 16:00",
        memoRef: "VRD-CISO-HANDOVER-2026-0001",
      },
      isDecisionPoint: false,
      targetRoles: ["CISO", "COO", "CLO", "CFO"],
      expectedKeywords: [
        "handover",
        "timeline",
        "ICO",
        "Ofgem",
        "PSR",
        "restoration",
        "Beazley",
      ],
      decisionOptions: [],
    },
    {
      id: "rws-i7",
      commandTier: "STRATEGIC",
      order: 100,
      scenarioDay: 5,
      scenarioTime: "16:00",
      title: "Day 5 - How Did the Technical Team Do?",
      body: "Day 5. The technical incident is closing.\n\nRestoration: 91% and climbing. Trading desk operational. Customer billing fully restored. Payroll systems recovered in time for Friday's run.\n\nPSR outreach: 79,000 of 84,247 customers reached. 84 welfare checks completed by local engineers. Margaret Thornton visited in person by the local field team.\n\nNegotiation: concluded. The PSR replica has been on three mirrors for 36 hours. 27,000 records were scraped before takedown - those are in the wild.\n\nMandiant's final report will land in 48 hours. The ICO investigation is live. Ofgem have the incident report. Beazley have a coverage position.\n\nYour handover brief is in the executive team's hands. Whatever they face tomorrow - the Ofgem session, the board, the media - was shaped by what this team did from 03:14 on Monday morning.\n\nEvery choice you made is about to have a name attached to it.",
      facilitatorNotes:
        "Score-routed finale. The compound average rank of all ranked decisions across this scenario determines the ending.\n\nThresholds:\n<=1.6 => rws-end1 (TRIUMPH)\n<=2.3 => rws-end2 (RECOVERY)\n<=3.0 => rws-end3 (DIMINISHED)\n>3.0 => rws-end4 (CATASTROPHIC)\n\nNote: the endings for the Silver scenario are framed from a technical team perspective - how the CISO and team are remembered, what the debrief says about their decisions, how the incident review characterises their work.",
      delayMinutes: 0,
      timerMinutes: 6,
      tickerHeadline:
        "Veridian Power Day 5 update - board session today - Ofgem and ICO engaged",
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
      targetRoles: ["CISO", "COO", "CLO", "CFO"],
      expectedKeywords: ["restoration", "PSR", "Mandiant", "handover", "outcome"],
      decisionOptions: [],
      branchMode: "score",
      branches: [
        { optionKey: "_", nextInjectId: "rws-end1", scoreMax: 1.6 },
        { optionKey: "_", nextInjectId: "rws-end2", scoreMax: 2.3 },
        { optionKey: "_", nextInjectId: "rws-end3", scoreMax: 3.0 },
        { optionKey: "_", nextInjectId: "rws-end4", scoreMax: 99 },
      ],
    },
    {
      id: "rws-end1",
      commandTier: "STRATEGIC",
      order: 110,
      scenarioDay: 30,
      title: "Day 30 - The Forensics Review",
      body: "Thirty days on.\n\nThe NCSC post-incident review has been completed. The lead assessor's closing line: 'The Veridian Power technical team set the tempo from the first alert and held it for five days. We have seen incidents begin the same way and end very differently. The difference is almost always the first 90 minutes.'\n\nThe ICO acknowledged the phased notification as 'exemplary practice under time pressure'. The MFA deferred finding featured in Beazley's evidence but the proactive disclosure meant coverage counsel negotiated from strength, not weakness.\n\nMandiant have asked the CISO to contribute to a sector briefing note on ALPHV tactics, techniques and procedures. The CISO's name will appear on it.\n\nOne last vote. Looking back across the whole exercise - which decision from this team did the most to earn this outcome?",
      facilitatorNotes:
        "Triumph ending for the technical team. The reflection vote is unranked - it asks them to identify the specific decision that mattered most. The most common answers are the 03:14 forensic capture choice and the CISO patch validation decision. Both reveal something useful about how the team thinks about the relationship between technical judgment and consequence.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "NCSC commends Veridian Power technical response - 'tempo held from first alert'",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "BBC NEWS",
        tvHeadline: "VERIDIAN POWER: NCSC COMMENDS TECHNICAL RESPONSE TO ALPHV ATTACK",
        tvTicker:
          "NCSC review: 'technical team set tempo from first alert' - ICO acknowledges phased notification as best practice - CISO to brief sector on ALPHV TTPs",
        tvReporter: "WESTMINSTER",
      },
      isDecisionPoint: true,
      isEnding: true,
      targetRoles: ["CISO", "COO", "CLO", "CFO"],
      expectedKeywords: ["reflection"],
      decisionOptions: [
        {
          key: "A",
          label:
            "The 03:14 forensic capture decision - keeping the connection live to watch the attacker",
        },
        {
          key: "B",
          label:
            "Notifying the right people in the right order. and filing early even with incomplete information.",
        },
        {
          key: "C",
          label:
            "Starting calls to medically-dependent customers before the media risk was resolved. and what that decision meant for Margaret Thornton.",
        },
        {
          key: "D",
          label:
            "The CISO patch validation - refusing to run 60,000 transactions on an unreviewed system",
        },
      ],
    },
    {
      id: "rws-end2",
      commandTier: "STRATEGIC",
      order: 110,
      scenarioDay: 30,
      title: "Day 30 - A Good Fight With Some Gaps",
      body: "Thirty days on.\n\nThe NCSC review is complete. Their assessment: 'The technical response was competent and ultimately effective. Detection and containment were strong. Regulatory notification timing and PSR outreach sequencing showed some hesitation that is noted in the post-incident record.'\n\nBeazley settled at 70% of the applicable limit. The MFA exclusion partially held but the proactive disclosure preserved the relationship. Net recovery: $2.8M.\n\nThe ICO has closed the initial file with a note: 'Notification was received within the 72-hour window. A fuller phased notification earlier in the incident would have been preferable.'\n\nMandiant's closing assessment: 'Strong work on detection. Some unnecessary risk taken at the restoration decision point.'\n\nOne last vote. What would you do differently if the beacon fires again next Monday?",
      facilitatorNotes:
        "Recovery ending. Good fight, real gaps. The reflection question is deliberately forward-looking - 'what would you do differently?' - because this team will face another incident. The most honest debrief conversations happen here.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Veridian Power: NCSC review complete - 'competent response with noted hesitations'",
      artifact: {
        type: "news_headline",
      },
      isDecisionPoint: true,
      isEnding: true,
      targetRoles: ["CISO", "COO", "CLO", "CFO"],
      expectedKeywords: ["reflection"],
      decisionOptions: [
        {
          key: "A",
          label:
            "The first call at 03:14, I'd pull the forensic image faster and escalate 30 minutes earlier.",
        },
        {
          key: "B",
          label: "The data protection notification. I'd file the holding note at hour 2, not hour 5.",
        },
        {
          key: "C",
          label:
            "The vulnerable customer outreach. I'd brief the local network operators before starting the call programme, not in parallel.",
        },
        {
          key: "D",
          label:
            "The restoration - I'd make the patch validation mandatory from the start, not negotiable",
        },
      ],
    },
    {
      id: "rws-end3",
      commandTier: "STRATEGIC",
      order: 110,
      scenarioDay: 30,
      title: "Day 30 - The Long After-Action",
      body: "Thirty days on.\n\nThe NCSC post-incident review was uncomfortable. The lead assessor: 'The technical team made some strong early calls that were subsequently undermined by hesitation at key decision points. The compound effect of these hesitations is visible in the regulatory and commercial outcomes.'\n\nBeazley denied 40% of the applicable claim. The MFA exclusion bit hard because the proactive disclosure was not made until coverage counsel were already in dispute mode.\n\nThe ICO noted: 'The 72-hour notification window was met by a narrow margin. The ICO is concerned about the evidential trail regarding when awareness was established.'\n\nThe CISO has been asked to appear before the board's Risk Committee to explain the timeline. The CLO will be there.\n\nOne last vote. Which call set this outcome in motion?",
      facilitatorNotes:
        "Diminished ending. Multiple small missteps compounding. The reflection vote asks 'which call set this in motion?' - useful because this team may point to the 03:14 decision, but the real answer is often the ICO notification delay or the restoration decision. The debrief should trace the cascade.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Veridian Power NCSC review: 'hesitation at key decision points' - ICO file still open",
      artifact: {
        type: "news_headline",
      },
      isDecisionPoint: true,
      isEnding: true,
      targetRoles: ["CISO", "COO", "CLO", "CFO"],
      expectedKeywords: ["reflection"],
      decisionOptions: [
        {
          key: "A",
          label: "The 03:14 decision - the wrong first call set everything else up wrong",
        },
        {
          key: "B",
          label:
            "The data protection notification. we waited too long and the regulator never fully trusted us after that.",
        },
        {
          key: "C",
          label:
            "The outreach to vulnerable customers. we hesitated and Margaret Thornton read about herself in the Times.",
        },
        {
          key: "D",
          label:
            "The restoration - running payments on an unvalidated system was the moment that lost the board",
        },
      ],
    },
    {
      id: "rws-end4",
      commandTier: "STRATEGIC",
      order: 110,
      scenarioDay: 30,
      title: "Day 30 - The Ticket That Sat In A Queue",
      body: "Thirty days on.\n\nThe NCSC post-incident review has been submitted to the board. Page 1, paragraph 3: 'The incident's trajectory was set at 03:14 on the morning of 14 April. A duty analyst made a call that is made in every major ransomware incident: the call to treat a low-confidence alert as a low-confidence alert. In this case, that call gave the threat actor a further 25 hours of uncontested access to the estate.'\n\nBeazley denied the claim in full. The MFA exclusion combined with the incident timeline - which shows 25 hours of attacker dwell time following the initial alert - was assessed as 'gross negligence in detection and response obligations under the policy'.\n\nThe CISO has resigned. The board's Risk Committee opened an independent review of the Security Operations function.\n\nThe ICO has issued a formal notice of intent to enforce, citing the delayed notification and the absence of a contemporaneous decision log for the initial triage call.\n\nThe ticket that sat in a queue for 25 hours cost more than any other decision in this exercise.\n\nOne last vote. If you could give the 03:14 duty analyst one piece of advice, what would it be?",
      facilitatorNotes:
        "Catastrophic ending. The team made the catastrophic first call and could not recover from it. The reflection vote is deliberately compassionate - it addresses the analyst, not the CISO - because often the most useful debrief is about the culture that made Option D feel like the safe choice, not about the individual who made it.\n\nAsk: what made the duty analyst feel like opening a ticket was acceptable? Was it training? Was it the previous 7 false positives this month? Was it the absence of a clear escalation path? Those are process answers. The systems question is more useful than the blame question.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Veridian Power CISO resigns - NCSC review: '03:14 call set the incident trajectory' - ICO enforcement notice issued",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "BBC NEWS",
        tvHeadline:
          "VERIDIAN POWER CISO RESIGNS - NCSC REVIEW CITES 'CATASTROPHIC INITIAL TRIAGE'",
        tvTicker:
          "ICO enforcement notice issued - Beazley claim denied in full - board risk committee review launched - ALPHV still active",
        tvReporter: "CITY OF LONDON",
      },
      isDecisionPoint: true,
      isEnding: true,
      targetRoles: ["CISO", "COO", "CLO", "CFO"],
      expectedKeywords: ["reflection"],
      decisionOptions: [
        {
          key: "A",
          label:
            "Trust the anomaly - periodic DNS at exactly 180 seconds is not human, and humans don't produce false positives that precise",
        },
        {
          key: "B",
          label:
            "Wake someone up. the cost of escalating a false alarm is always less than the cost of not escalating the real thing.",
        },
        {
          key: "C",
          label:
            "The 7 false positives this month don't tell you this one is false - they just tell you most are",
        },
        {
          key: "D",
          label:
            "The decision to open a ticket is a decision - it just doesn't feel like one",
        },
      ],
    },
    {
      id: "rws-path-a-staging",
      commandTier: "TACTICAL",
      storyTrack: "Path A: Early detection",
      order: 5,
      scenarioDay: 1,
      scenarioTime: "05:30",
      title: "05:30, You Can See Everything They Did",
      body: `05:30. The forensic image is back. Your second-line analyst has been working through it for ninety minutes.

There is a directory on the workstation labelled PHANTOMCOIL-STAGE. What's inside it is the most valuable thing you will find all week.`,
      facilitatorNotes: `Path A is the best-case scenario for detection. The quiet forensic image preserved the attacker's full lateral movement map before they knew they'd been seen.

The PHANTOMCOIL-STAGE directory contains 11 host profiles, 3 credential dumps including a domain admin hash, and a file called PSR_REPLICA_PARTIAL.7z. the PSR data staged for exfiltration but not yet sent.

The critical insight: they know the attacker's entire plan, including what they haven't done yet. This is an extraordinary intelligence advantage. The question is what to do with it.

Key coaching: what would a world-class CISO do with this information in the next 90 minutes? They have the attacker's full playbook. They might be able to stop the encryption entirely. or at minimum, shrink the blast radius significantly.`,
      isDecisionPoint: true,
      recapLine: "used the forensic intelligence by {{recapFragment}}",
      timerMinutes: 10,
      targetRoles: ["CISO", "COO"],
      expectedKeywords: ["PHANTOMCOIL", "PSR", "staging", "exfiltration", "credential", "domain admin", "containment", "race"],
      artifact: {
        type: "siem_alert",
        siemSeverity: "CRITICAL",
        siemAlertId: "MDE-FORENSIC-PLY-001",
        siemEventType: "LATERAL MOVEMENT MAP: COMPLETE",
        siemSourceIp: "192.168.14.19 (TREASURY-LDN-019)",
      },
      decisionOptions: [
        {
          key: "A",
          label:
            "Use the map to surgically isolate every pre-staged host before they trigger. silent, precise, now.",
          consequence:
            "Six hosts isolated in 40 minutes without alerting the attacker. The PSR exfiltration file never leaves the network. Encryption triggers at 04:11, but only on 140 servers, not 217. The PSR master database is intact. The trading book reconciliation system survives. Mandiant call this 'the best-case outcome from a Category 1 ransomware intrusion.'",
          rank: 1,
          recapFragment: "using the lateral movement map to surgically isolate pre-staged hosts",
        },
        {
          key: "B",
          label:
            "Brief the CISO and the executive team first. this intelligence needs leadership sign-off before action.",
          consequence:
            "The briefing takes 55 minutes. The attacker's automated trigger fires at 04:11 while the briefing is still happening. All 217 servers encrypt. The forensic advantage is wasted. The map is still valuable for Mandiant's recovery work. but the race was lost in the briefing room.",
          rank: 3,
          recapFragment: "briefing leadership before acting on the forensic intelligence",
        },
        {
          key: "C",
          label:
            "Share the map with Mandiant immediately and let their team act on it. this is what the retainer is for.",
          consequence:
            "Mandiant respond in 22 minutes and begin isolation. They're faster than the internal team but the coordination delay costs 18 minutes. Encryption triggers on 180 servers. The PSR exfiltration file is intercepted. it did not leave the network. The blast radius is smaller than full encryption but larger than Option A.",
          rank: 2,
          recapFragment: "sharing the forensic map with Mandiant to act on",
        },
      ],
    },
    {
      id: "rws-path-a-race",
      commandTier: "TACTICAL",
      storyTrack: "Path A: Early detection",
      order: 8,
      scenarioDay: 1,
      scenarioTime: "03:45",
      title: "03:45, Can We Stop It Before 04:11?",
      body: `03:45. You have the map. You know 04:11 is when the trigger fires. the schedule is in the PHANTOMCOIL-STAGE directory.

You have twenty-six minutes.

Your SOC team is asking if they should try to kill the encryption trigger directly. they think they can find and disable the scheduled task on the primary staging server. It would take approximately eighteen minutes. If it works, the encryption does not fire at all.

If it fails, or if it triggers an early response from the attacker, all bets are off.`,
      facilitatorNotes: `This is the most technically dramatic inject in the scenario. The team has 26 minutes and a choice between a surgical high-risk operation and a conservative fallback.

Option A (kill the trigger) is the right call IF the analyst is confident. Option B (isolate hosts) is slower but safer. Option C (wake everyone up) wastes 15 minutes.

The tension: if they succeed, the encryption doesn't happen at all. If they fail, the attacker triggers everything early.

Coach the CISO: what is your actual assessment of your analyst's ability to find and disable that scheduled task in 18 minutes? That question should be answered by someone who knows their team, not by someone performing confidence.`,
      isDecisionPoint: true,
      recapLine: "decided to {{recapFragment}} with 26 minutes before the encryption trigger",
      timerMinutes: 8,
      targetRoles: ["CISO", "COO"],
      expectedKeywords: ["trigger", "04:11", "disable", "isolate", "risk", "analyst", "18 minutes"],
      artifact: {
        type: "sms_thread",
        smsParticipants: [
        ],
        smsMessages: [
          { sender: "A. Obi, Senior SOC Analyst", text: "Found it. There's a scheduled task on PHANTOMCOIL-PRIMARY called 'maintenance_sweep', execution time 04:11:00 exactly. This is the trigger.", time: "03:43" },
          { sender: "A. Obi, Senior SOC Analyst", text: "I can try to disable it remotely. It would mean authenticating to the primary staging server directly. which risks alerting them. But I think I can do it in 18 minutes.", time: "03:44" },
          { sender: "A. Obi, Senior SOC Analyst", text: "The alternative is we isolate all the known pre-staged hosts now and accept the encryption fires but on fewer systems. Your call.", time: "03:45" },
        ],
      },
      decisionOptions: [
        {
          key: "A",
          label:
            "Try to kill the trigger, 18 minutes, high risk, but if it works the encryption doesn't fire at all.",
          consequence:
            "Obi authenticates at 03:48. The task is found. Disabled at 04:07, four minutes before trigger time. The encryption does not fire. Mandiant, arriving at 06:30, call it the cleanest ransomware containment they have seen in 18 months of UK incidents. The blast radius: zero. The PSR data was staged but never exfiltrated.",
          rank: 1,
          recapFragment: "attempting to disable the encryption trigger directly. and succeeding",
        },
        {
          key: "B",
          label:
            "Isolate the known pre-staged hosts now. accept some encryption, but protect the most critical systems.",
          consequence:
            "Isolation begins at 03:48. By 04:11, 8 of the 11 known pre-staged hosts are isolated. Encryption fires on 89 servers. less than half the original blast radius. The PSR master database survives. The trading book reconciliation survives. The recovery timeline is 2-3 days, not 5-9.",
          rank: 2,
          recapFragment: "isolating pre-staged hosts and accepting a reduced blast radius",
        },
        {
          key: "C",
          label:
            "Wake the CISO and get full leadership authorisation before any action. this cannot be a SOC-level call.",
          consequence:
            "The CISO is on the phone at 03:52. The authorisation conversation takes 14 minutes. By the time isolation begins at 04:06, the trigger fires at 04:11 with 7 hosts still live. Encryption across 183 servers. The delay cost 94 additional servers.",
          rank: 3,
          recapFragment: "waking the CISO for authorisation before acting",
        },
      ],
    },
    {
      id: "rws-path-b-spread",
      commandTier: "TACTICAL",
      storyTrack: "Path B: Attacker accelerated",
      order: 5,
      scenarioDay: 1,
      scenarioTime: "04:02",
      title: "04:02, They Noticed",
      body: `04:02. Forty-eight minutes after you killed the workstation.

The Treasury VLAN is dark. But Defender has just fired on two more endpoints. both on the wholesale trading floor back-office.

At 04:09, it fires from a completely different segment: a file server in the customer billing tier. They had pre-staged more hosts than the beacon suggested. The segmentation bought minutes, not hours.

At 04:11, coordinated encryption fires across 247 servers. thirty more than the baseline scenario because the hard segment triggered an early response.`,
      facilitatorNotes: `Path B leads to the worst blast radius. The hard segment was not wrong as an instinct. aggressive containment is generally correct. But it was wrong in execution: the team didn't know what they didn't know about pre-staged hosts before they moved.

The lesson isn't 'don't segment.' It's 'don't segment until you know what you're segmenting.' The quiet forensic image would have shown the full lateral movement map. The hard segment was a decision made with 5% of the available intelligence.

This is the key coaching point for Path B teams: the cost of speed without intelligence. They did the right thing in the wrong order.`,
      isDecisionPoint: false,
      targetRoles: ["CISO", "COO"],
      expectedKeywords: ["247", "servers", "billing", "trading", "attacker", "pre-staged", "accelerated"],
      artifact: {
        type: "siem_alert",
        siemSeverity: "CRITICAL",
        siemAlertId: "MDE-MASS-ENC-247",
        siemEventType: "MASS ENCRYPTION EVENT: 247 HOSTS",
        siemSourceIp: "Multiple. coordinated",
      },
      decisionOptions: [],
      branches: [{ optionKey: "A", nextInjectId: "rws-path-b-triage" }],
    },
    {
      id: "rws-path-c-onsite",
      commandTier: "TACTICAL",
      storyTrack: "Path C: Mandiant engaged early",
      order: 5,
      scenarioDay: 1,
      scenarioTime: "06:30",
      title: "06:30, Mandiant's First Assessment",
      body: `06:30. Mandiant arrived 12 minutes ago. Their lead assessor has done an initial sweep.

She has two things to tell you.

First: 'You did the right thing calling us. This is real, it's active, and you caught it before they finished staging.'

Second: 'There is a partial PSR exfiltration file on one of the staging servers. It has not left your network yet. If we move in the next forty minutes, it stays that way.'`,
      facilitatorNotes: `Path C teams get the best regulated professional response. Mandiant arriving at 06:30 means they're on-site before the attacker has completed their work.

The critical decision here: Mandiant can prevent the PSR exfiltration entirely if given the authority to move now. This is a time-sensitive call that has to come from the CISO, not a committee.

Coach the CISO: what do you need to know before you give Mandiant that authority? The answer should be: not much. They're the experts, they're on-site, and they have a 40-minute window. The wrong answer is 'let me brief the executive team first.'`,
      isDecisionPoint: true,
      recapLine: "responded to Mandiant's assessment by {{recapFragment}}",
      timerMinutes: 5,
      targetRoles: ["CISO"],
      expectedKeywords: ["Mandiant", "PSR", "exfiltration", "authority", "isolate", "40 minutes"],
      artifact: {
        type: "voicemail",
        voicemailCaller: "Dr. Claire Hennessey. Mandiant Lead Assessor",
        voicemailCallerNumber: "+44 20 7645 8900",
        voicemailDuration: "1:12",
        voicemailTime: "06:28",
        voicemailTranscript: "It's Claire Hennessey, Mandiant. I'm standing in your server room. Here's what I need you to know in the next two minutes. The intrusion is real and active. ALPHV, consistent with about fifteen other incidents we've worked this year. They've been inside for six days. They have a partial PSR exfiltration file staged on one of your back-office servers. That file has not left your network. If you give me authority to isolate that server in the next forty minutes, it stays that way. After forty minutes I can't promise anything. I need your authority call now. Call me back.",
      },
      decisionOptions: [
        {
          key: "A",
          label:
            "Give Mandiant full authority to isolate immediately. they're the experts and the window is closing.",
          consequence:
            "Mandiant isolate the staging server at 06:44. The PSR exfiltration file never leaves the network. When encryption fires at 04:11, which Mandiant cannot fully prevent. the PSR data is intact and the exfiltration is stopped. The blast radius: 174 servers. The PSR master database survives. This is as good as it gets after a 6-day intrusion.",
          rank: 1,
          recapFragment: "giving Mandiant immediate authority to isolate the staging server",
        },
        {
          key: "B",
          label:
            "Brief the CISO and the COO first. Mandiant needs internal sign-off before they take action on our estate.",
          consequence:
            "CISO and COO briefed by 06:52. Mandiant given authority at 06:54. The staging server is isolated at 07:01, but the attacker's automated exfiltration ran at 06:47 and completed. The PSR partial file is now outside the network. The window Mandiant identified was real. It closed while the briefing happened.",
          rank: 3,
          recapFragment: "requiring internal sign-off before giving Mandiant authority to act",
        },
      ],
    },
    {
      id: "rws-path-d-morning",
      commandTier: "TACTICAL",
      storyTrack: "Path D: Alert missed",
      order: 5,
      scenarioDay: 1,
      scenarioTime: "07:30",
      title: "07:30, The Morning Shift Finds Everything",
      body: `07:30. The Monday morning shift starts at 07:15.

By 07:22 the first call comes in: 'My computer has a text file on it. It says something about encryption.'

By 07:25 it is 14 calls.

By 07:30 the SOC duty manager has pulled up the alert queue and found the ticket from 03:14. It was filed as probable false positive. It sat in the queue for four hours and sixteen minutes.

The encryption fired at 04:11. Every server on the estate is locked. The ransom note is on 217 workstations.

The CISO is being called at home.`,
      facilitatorNotes: `Path D is the scenario where the duty analyst made the call that gets made in every major ransomware incident: the call to treat a low-confidence alert as low-confidence.

The CISO now has to walk into a board call and explain what happened between 03:14 and 07:30. The answer is: nothing. An alert fired and nobody responded to it for four hours.

This is not the SOC analyst's failure alone. It is a detection and response capability failure. The question the board will ask. and the question Ofgem will ask. is: what is the CISO's accountability for the alerting and escalation protocol that allowed this to happen?

Path D teams will score lower across the scenario because the blast radius is maximum, the PSR data is fully exfiltrated, and the restoration timeline is the worst case. That is the consequence of the ticket decision. It should be felt.`,
      isDecisionPoint: false,
      targetRoles: ["CISO", "COO"],
      expectedKeywords: ["ticket", "03:14", "false positive", "four hours", "CISO", "accountability"],
      artifact: {
        type: "internal_memo",
        memoTitle: "Incident timeline: alert to discovery, 03:14 to 07:30",
        memoClassification: "RESTRICTED: CISO EYES ONLY",
        memoFrom: "L. Hassan. SOC Duty Manager",
        memoTo: "S. Khatun. CISO",
        memoDate: "14 April 2026, 07:31",
        memoRef: "SOC-INC-2026-041401",
      },
      decisionOptions: [],
      branches: [{ optionKey: "A", nextInjectId: "rws-path-d-scale" }],
    },
    {
      id: "rws-path-d-ciso-call",
      commandTier: "TACTICAL",
      storyTrack: "Path D: Alert missed",
      order: 8,
      scenarioDay: 1,
      scenarioTime: "08:15",
      title: "08:15, The CISO Has to Explain the Gap",
      body: `08:15. The CISO is in the car, on the phone to the CEO.

The CEO asks the question that was always coming: 'Sarah. the alert fired at 03:14. It's 08:15. What happened in those five hours?'

The room goes quiet.`,
      facilitatorNotes: `This is the hardest inject in the technical scenario. Path D teams have to answer this question: what happened in the five hours between the alert and discovery?

The CISO's answer options range from honest accountability to deflection. The facilitator should push hard here: the right answer is not 'the analyst made a mistake.' The right answer is a CISO taking ownership of a detection and escalation protocol that allowed a critical alert to sit unactioned.

Coach the group: what would a CISO who genuinely owns this say to the CEO? And what would a CISO who is already in self-protection mode say? The difference between those two answers will define the regulatory posture for the next three days.`,
      isDecisionPoint: true,
      branches: [
        { optionKey: "A", nextInjectId: "rws-path-d-board" },
        { optionKey: "B", nextInjectId: "rws-path-d-board" },
        { optionKey: "C", nextInjectId: "rws-path-d-board" },
      ],
      recapLine: "explained the detection gap to the CEO by {{recapFragment}}",
      timerMinutes: 8,
      targetRoles: ["CISO", "COO"],
      expectedKeywords: ["honest", "accountability", "protocol", "escalation", "own", "analyst", "explain"],
      artifact: {
        type: "voicemail",
        voicemailCaller: "R. Kaye. Chief Executive Officer",
        voicemailCallerNumber: "+44 7700 900001",
        voicemailDuration: "0:38",
        voicemailTime: "07:52",
        voicemailTranscript: "Sarah. It's Robert. I need to understand the timeline. The alert went off at 03:14, I've been told that by two different people this morning. The encryption happened at 04:11. We found out at 07:30. I need to know what happened in those five hours before I speak to anyone else. Call me as soon as you're in the car.",
      },
      decisionOptions: [
        {
          key: "A",
          label:
            "Full honest accountability, 'Our detection and escalation protocol failed. This is on me. I am fixing it today and I will tell you how.'",
          consequence:
            "The CEO is quiet for a moment. Then: 'Okay. I need that in writing before the board call.' The CISO's honest accountability. delivered before any regulator or board member has asked. becomes the tone-setting moment for every subsequent conversation. The board, the regulator, and eventually the inquiry all note 'proactive accountability from the technical leadership.'",
          rank: 1,
          recapFragment: "giving the CEO a full honest account of the detection protocol failure",
        },
        {
          key: "B",
          label:
            "Explain the alert context, 'There were 7 similar false positives this month. The analyst had a reasonable basis for their assessment.'",
          consequence:
            "The explanation is accurate and contextually fair. The CEO accepts it. But when the board asks the same question at 10:30, and when Ofgem ask it on Day 5, the explanation sounds increasingly like mitigation rather than accountability. The regulator's final report notes 'a pattern of contextualised explanation that appeared to diminish the organisation's ownership of the failure.'",
          rank: 2,
          recapFragment: "contextualising the alert history before addressing the accountability question",
        },
        {
          key: "C",
          label:
            "Focus on what we're doing now, 'Here's where we are, here's what Mandiant are doing, here's the plan. The timeline conversation can happen later.'",
          consequence:
            "The CEO pushes back: 'I'll ask you again at 10:30.' At 10:30, with the full board on the call, the question comes again. in a room where the answer carries much more weight. The deflection in the car becomes the context for a harder conversation at the worst possible moment.",
          rank: 3,
          recapFragment: "redirecting from the accountability question to the current response plan",
        },
      ],
    },

    {
      id: "rws-path-b-triage",
      commandTier: "TACTICAL",
      storyTrack: "Path B: Attacker accelerated",
      order: 7,
      scenarioDay: 1,
      scenarioTime: "04:30",
      title: "04:30: Triage in the Dark",
      isDecisionPoint: true,
      branches: [
        { optionKey: "A", nextInjectId: "rws-path-b-morning" },
        { optionKey: "B", nextInjectId: "rws-path-b-morning" },
        { optionKey: "C", nextInjectId: "rws-path-b-morning" },
      ],
      timerMinutes: 8,
      recapLine: "triaged the 14 at-risk endpoints by {{recapFragment}}",
      body: `04:30. Eighty-nine minutes since the beacon. Forty-eight minutes since you killed the workstation.

Mandiant are sixty minutes away. You have two analysts on shift, a VLAN that's dark, three newly-encrypted file servers, and an attacker who knows you can see them.

Your senior analyst has drawn a map on a whiteboard. Fourteen endpoints at risk. Six of them contain payroll, billing, or the trading book. You cannot protect all fourteen before Mandiant arrive.`,
      facilitatorNotes:
        `Path B teams made the aggressive call and paid for it with an accelerated attacker. Now they face a brutal triage: with two analysts and sixty minutes, which six systems do you protect?

This is the under-pressure version of the containment decision. There is no right answer, the CISO has to make a call with incomplete information and limited resource. The coaching question is not 'did you choose the right systems' , it's 'how did you make the decision?' Process under pressure is what this inject tests.

Ask: who made the call? Was it one person or a committee? How long did it take? What did you do with the time while you were deciding?`,
      targetRoles: ["CISO", "COO"],
      expectedKeywords: ["triage", "billing", "trading", "payroll", "PSR", "protect", "priority", "six"],
      delayMinutes: 0,
      artifact: {
        type: "siem_alert",
        siemSeverity: "CRITICAL",
        siemAlertId: "MDE-TRIAGE-B-002",
        siemEventType: "MULTI-HOST COMPROMISE, ACTIVE ENCRYPTION IMMINENT",
        siemSourceIp: "Multiple, 14 endpoints identified",
      },
      decisionOptions: [
        {
          key: "A",
          label:
            "Protect the six highest-value systems: billing, PSR master, trading book, payroll. Let the others go.",
          consequence:
            "The six priority systems survive. Eight endpoints encrypt. Mandiant arrive at 05:31 and immediately confirm the right call: 'You kept what matters.' The PSR master database is intact. The trading book survives. Restoration takes four days, not six, because the critical data is clean.",
          rank: 1,
          recapFragment: "prioritising the six highest-value systems and accepting encryption on the rest",
        },
        {
          key: "B",
          label:
            "Protect the systems closest to the original breach, cut the attacker off at the source.",
          consequence:
            "The Treasury-adjacent systems are isolated. But the attacker has already moved laterally. Three of the six priority systems, including PSR master, are not in the blast radius you've drawn. By 04:11, PSR master encrypts. The attacker's route was different from where you drew the wall.",
          rank: 2,
          recapFragment: "isolating systems closest to the original breach point",
        },
        {
          key: "C",
          label:
            "Wait for Mandiant, two analysts should not be making permanent isolation decisions without the experts.",
          consequence:
            "Mandiant arrive at 05:30. In the intervening 60 minutes, four of the six critical systems encrypt, including PSR master. Mandiant's lead assessor's first words on-site: 'I understand you waited for us. That was the wrong call.' The delay cost two extra days of restoration and the PSR exfiltration confirmation.",
          rank: 3,
          recapFragment: "waiting for Mandiant rather than making isolation decisions without them",
        },
      ],
    },
    {
      id: "rws-path-b-morning",
      commandTier: "TACTICAL",
      storyTrack: "Path B: Attacker accelerated",
      order: 28,
      scenarioDay: 1,
      scenarioTime: "08:00",
      title: "08:00: The CISO's Debrief",
      isDecisionPoint: false,
      body: `08:00. Mandiant have been on-site for ninety minutes.

Their lead assessor has pulled the CISO aside. She has a list in her hand.

'You made a defensible call at 03:14. The hard segment was a reasonable instinct. But I want to show you what would have been different with thirty minutes of forensic work first.' She holds up the list. It has eleven items on it.`,
      facilitatorNotes:
        `This is the learning beat for Path B. The CISO took an aggressive call, not a wrong call, and it had costs. Mandiant are not criticising them: they're showing them the counterfactual.

The eleven items on the list are everything the quiet forensic image would have shown. The CISO already knows the lesson. The question is whether they're willing to hear it clearly in a room with the COO.

Coach the group: what does professional accountability look like when your call was reasonable but the outcome was costly? The CISO who can say 'I made the right call with the wrong information, and here is what I am doing differently next time' is worth more to their organisation than the CISO who either defends the call or collapses under it.`,
      targetRoles: ["CISO", "COO"],
      expectedKeywords: ["Mandiant", "CISO", "defensive", "forensic", "counterfactual", "accountability", "learning"],
      delayMinutes: 0,
      artifact: {
        type: "internal_memo",
        memoTitle: "Path B: Initial Response Assessment. Mandiant",
        memoClassification: "CISO EYES ONLY",
        memoFrom: "Dr. Claire Hennessey. Mandiant Lead Assessor",
        memoTo: "S. Khatun. CISO",
        memoDate: "14 April 2026, 08:00",
        memoRef: "MAND-UK-2026-VRD-003",
      },
      decisionOptions: [],
      branches: [{ optionKey: "A", nextInjectId: "rws-i2v" }],
    },
    {
      id: "rws-path-d-scale",
      commandTier: "TACTICAL",
      storyTrack: "Path D: Alert missed",
      order: 9,
      scenarioDay: 1,
      scenarioTime: "09:00",
      title: "09:00: The Scale of It",
      isDecisionPoint: false,
      body: `09:00. The CISO has been on-site for forty-five minutes.

Mandiant's initial assessment is in. Compared to Path A or B, the numbers are different.

Because the ticket sat for four hours and sixteen minutes, the attacker completed their work uninterrupted. The PSR exfiltration finished at 03:47. The full trading book was copied at 04:02. The encryption fired at 04:11 across all 217 servers simultaneously, not the partial blast of a team that caught them early.

Mandiant's technical lead puts it plainly: 'They had everything they needed before anyone here was awake.'`,
      facilitatorNotes:
        `No vote. This is the full cost of Path D made concrete with numbers.

The comparison matters: Path A teams are looking at a partial exfiltration or none at all. Path D teams are looking at the full dataset, fully exfiltrated, 217 servers fully encrypted. This is what four hours of uncontested access looks like.

Do not rush past this. Let the room sit with it. Then ask: what does the CISO tell the board in two hours? What does the board need to understand about what happened between 03:14 and 07:30?`,
      targetRoles: ["CISO", "COO"],
      expectedKeywords: ["217", "full exfiltration", "four hours", "PSR", "trading book", "complete"],
      delayMinutes: 0,
      artifact: {
        type: "siem_alert",
        siemSeverity: "CRITICAL",
        siemAlertId: "MDE-FULL-ENC-217",
        siemEventType: "COMPLETE ESTATE ENCRYPTION, FULL EXFILTRATION CONFIRMED",
        siemSourceIp: "Multiple, coordinated across all segments",
      },
      decisionOptions: [],
      branches: [{ optionKey: "A", nextInjectId: "rws-path-d-ciso-call" }],
    },
    {
      id: "rws-path-d-board",
      commandTier: "TACTICAL",
      storyTrack: "Path D: Alert missed",
      order: 33,
      scenarioDay: 1,
      scenarioTime: "10:30",
      title: "10:30: The Board Is Asking",
      isDecisionPoint: false,
      body: `10:30. The CISO has been asked to join the executive board call.

Sir David Ashworth, the Chairman, has one question before the CEO speaks.

'I want to understand something clearly, CISO. We received an alert at 03:14. We are now at 10:30. The data was taken. The systems are encrypted. I want to know: at what point in those seven hours could we have stopped this?'

The call is silent. Fourteen people are waiting for the answer.`,
      facilitatorNotes:
        `This is the hardest inject in the technical scenario for Path D teams. The Chairman's question has a precise answer: 03:14 to approximately 04:09, the team had a window.

The CISO has three choices: give the precise honest answer, give a contextualised answer that doesn't directly address the window, or deflect entirely. The room will judge all three.

Coach the CISO: the Chairman is not trying to find someone to blame. He is trying to understand whether the governance of security operations is adequate. A CISO who answers 'we had a window from 03:14 to 04:09 and we didn't use it, and here is why and what we're changing' is doing their job. A CISO who contextualises is buying time. A CISO who deflects has ended their tenure in that chair.

This inject has no vote. It is a performance moment. Let whoever is playing the CISO answer the Chairman's question out loud. Then debrief the room on what they heard.`,
      targetRoles: ["CISO", "CEO"],
      expectedKeywords: ["Chairman", "window", "03:14", "honest", "accountability", "07:30", "governance"],
      delayMinutes: 0,
      decisionOptions: [],
      branches: [{ optionKey: "A", nextInjectId: "rws-i2v" }],
    },
  ],
};