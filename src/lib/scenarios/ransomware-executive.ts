import type { Scenario } from "../../types";

export const RANSOMWARE_EXECUTIVE_SCENARIO: Scenario = {
  id: "tpl-ransomware-gold-001",
  title: "Ransomware: The Quiet Beacon - Executive Response",
  description:
    "05:30. Your CISO has confirmed it. The trading systems are encrypted, the PSR replica is in the attacker's hands, and the markets open in three hours. Every decision you make today will be in front of Parliament, regulators, and the press. Focused executive arc for CEO, CFO, CLO, CCO, COO. Tests governance, regulatory posture, market disclosure, ransom authority, PSR accountability, insurance coupling, and the decisions that define careers.",
  type: "RANSOMWARE",
  difficulty: "CRITICAL",
  durationMin: 150,
  isTemplate: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2026-04-14T00:00:00Z",
  coverGradient: "135deg, #050508 0%, #1a0008 40%, #E82222 100%",
  regulatoryFrameworks: [
    "NIS Regulations 2018 (OES)",
    "UK GDPR Art. 33",
    "FCA MAR / DTR",
    "NIS Regulation 2018 s.8 (72hr notification)",
  ],
  roles: ["CEO", "CFO", "CLO", "CCO", "COO"],
  briefing:
    "You are the executive leadership team of Veridian Power plc - a FTSE 250 UK energy retailer and designated Operator of Essential Services. Your trading desk runs £2.1B of day-ahead wholesale positions. Your front-office holds the Priority Services Register: 84,000 vulnerable customers who depend on uninterrupted power for medical equipment, dialysis, and oxygen.\n\nYour CISO called you at 05:30. The incident is confirmed: ALPHV have been inside your systems for six days. Bulk encryption fired overnight. A read-replica of the PSR has almost certainly been exfiltrated.\n\nThe technical team is working the problem. Your job is everything else: who you call, what you tell them, how you move in the markets, what authority you give the negotiators, and whether the decisions you make in the next 48 hours hold up in front of Ofgem, the ICO, and the Treasury Select Committee.\n\nThe markets open in three hours and twenty-two minutes.",
  injects: [
    {
      id: "rwg-i1",
      commandTier: "STRATEGIC",
      order: 0,
      scenarioDay: 1,
      scenarioTime: "05:30",
      title: "05:30 - The CISO's Call",
      tierSkipSummary:
        "At 05:30 the CISO confirmed an active ALPHV ransomware incident. Bulk encryption had hit 217 servers. A PSR read-replica was confirmed exfiltrated. The Gold team convened for their first decision: who gets called first.",
      body: "05:30. Your phone has not stopped ringing.\n\nThe CISO has given you the picture in 90 seconds: confirmed ALPHV intrusion, active since six days ago via a phished VPN credential. Bulk encryption at 04:11 across 217 servers. Confirmed encrypted: customer billing, wholesale trading book reconciliation, payroll. A read-replica of the Priority Services Register - 84,000 vulnerable customers - was almost certainly exfiltrated before encryption. The master database is intact. The lights are still on for customers.\n\nMandiant are on-site. The trading desk is on manual. The markets open at 08:00.\n\nThe CISO needs to know one thing from you before they can take the next step: who do you call first?\n\nThis is not a procedural question. It is a tone-setting question for the next five days.",
      facilitatorNotes:
        "Under NIS Regs 2018, as a designated OES the company has a 72-hour notification obligation to NCSC for any incident with significant impact on continuity of essential services. The notification clock starts at 05:30.\n\nNCsc first (A) is the textbook answer: honours the statutory obligation, sets a cooperative tone, NCSC can provide technical assistance. Board chair first (B) is defensible governance but slow. CFO/CEO consortium (C) burns regulatory goodwill. Ofgem first (D) inverts the chain of command.\n\nKey coaching: the 72-hour NIS notification clock is now running from 05:30. Every decision today should be tracked against that clock.",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "Energy retailers face 'cyber resilience year' as Ofgem raises NIS reporting bar",
      artifact: {
        type: "voicemail",
        voicemailCaller: "Sarah Khatun - CISO, Veridian Power",
        voicemailCallerNumber: "+44 7700 900112",
        voicemailDuration: "1:48",
        voicemailTime: "05:30",
        voicemailTranscript:
          "It's Sarah. I need 90 seconds. Confirmed ALPHV, confirmed intrusion, confirmed active since six days ago via a phished VPN credential. Bulk encryption fired at 04:11 across 217 servers. Billing, trading reconciliation, payroll - all encrypted. The PSR read-replica was almost certainly exfiltrated before the encryption trigger - I cannot confirm 100% yet but Mandiant assess it at high confidence. Master database is intact. Lights are on for customers. Mandiant are on-site. Trading desk is going manual right now. Markets open at 08:00. I need to know who you are calling first so I can brief NCSC or wait. I also need the ICO question answered in the next two hours. Call me back.",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "COO"],
      expectedKeywords: [
        "NCSC",
        "NIS",
        "72 hours",
        "Ofgem",
        "board",
        "OES",
        "notification clock",
      ],
      recapLine: "made the first call to {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "NCSC first - honour the NIS statutory obligation, file the notification, ask for technical support, lock in the cooperative posture",
          consequence:
            "NCSC respond within 40 minutes with a named incident handler. The notification clock is on record. Ofgem later note the proactive NCSC escalation as evidence of good NIS culture.",
          rank: 1,
          recapFragment: "NCSC under NIS Regs",
        },
        {
          key: "B",
          label:
            "Board chair first - this is a material risk event and the chair must be in the room from the start",
          consequence:
            "The chair is on holiday in Italy and reachable in 90 minutes. NCSC notification happens at hour 4 instead of hour 1. Defensible governance, slower regulatory posture.",
          rank: 3,
          recapFragment: "the board chair before any external notification",
        },
        {
          key: "C",
          label:
            "CFO and CEO - lock down the trading and financial exposure before anything goes external",
          consequence:
            "Ninety minutes of internal pre-meeting before any regulator is told. Notification clock stressed. Internal alignment high. External posture set late.",
          rank: 2,
          recapFragment: "the internal CFO/CEO consortium",
        },
        {
          key: "D",
          label:
            "Ofgem first - the sector regulator should hear it from you before NCSC routes it",
          consequence:
            "Ofgem appreciate the call but explain that under NIS the first call is to NCSC. You have inverted the chain of command. Ofgem note this in their later assessment.",
          rank: 4,
          recapFragment: "Ofgem ahead of NCSC",
        },
      ],
    },
    {
      id: "rwg-ico",
      commandTier: "STRATEGIC",
      order: 15,
      scenarioDay: 1,
      scenarioTime: "05:47",
      title: "05:47 - The ICO Clock",
      body: "05:47. The DPO has walked into the war room with a single question.\n\n'Under UK GDPR Article 33, we have 72 hours to notify the ICO from the moment we become aware of a personal data breach. The clock started at 05:30 at the latest. We are 17 minutes into a 72-hour window.\n\nThe ICO can treat late notification as an aggravating factor in enforcement decisions. Their own guidance says: file promptly, even if incomplete, and amend as you learn more.\n\nWhat is our posture?'\n\nThe DPO is looking at the CLO. The CLO is looking at the CEO.",
      facilitatorNotes:
        "The ICO's own guidance explicitly supports phased notification. File promptly with what you know, amend as scope becomes clearer.\n\nOption A is the ICO's preferred approach. Option D (route through Ofgem) is the most common confusion - GDPR and NIS are separate regimes with separate clocks and separate regulators.\n\nAsk the CLO: can you cite the specific ICO guidance on phased notifications?",
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
      targetRoles: ["CLO", "CEO"],
      expectedKeywords: [
        "ICO",
        "72 hours",
        "Article 33",
        "GDPR",
        "phased",
        "DPO",
        "holding notification",
      ],
      recapLine: "took the ICO notification posture of {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "File a holding notification to the ICO now - we have enough to trigger Art. 33 and the ICO prefers phased notifications",
          consequence:
            "ICO acknowledge within 2 hours and assign a case officer. The notification is on-time. The ICO final report notes 'prompt and transparent engagement'.",
          rank: 1,
          recapFragment: "a prompt phased notification to the ICO",
        },
        {
          key: "B",
          label:
            "Wait until scope is confirmed - filing a premature notification risks errors that will need correcting",
          consequence:
            "Scope confirmed at Day 3. ICO notification filed at hour 62. Technically within 72 hours. The ICO asks why it took so long. The delay features in their enforcement assessment.",
          rank: 3,
          recapFragment: "delaying ICO notification pending scope confirmation",
        },
        {
          key: "C",
          label:
            "Take external legal counsel opinion on when the 72-hour clock started before filing anything",
          consequence:
            "Counsel respond in 4 hours. Opinion: clock started at 05:30. Notification filed at hour 5. Defensible but the DPO's advice was correct and immediately available.",
          rank: 2,
          recapFragment: "seeking external counsel before filing",
        },
        {
          key: "D",
          label:
            "Notify Ofgem under NIS Regs and ask them to coordinate with the ICO - one notification, two regulators",
          consequence:
            "Ofgem explain patiently that NIS and GDPR are separate regimes. The ICO clock is now at 1h30m. The confusion is noted.",
          rank: 4,
          recapFragment: "routing the ICO notification through Ofgem",
        },
      ],
    },
    {
      id: "rwg-i3",
      commandTier: "STRATEGIC",
      order: 30,
      scenarioDay: 1,
      scenarioTime: "06:15",
      title: "06:15 - Authority to Contain",
      body: "06:15. The CISO is on the phone. They need your authority call in the next five minutes.\n\nThe encryption has hit 217 servers. The trading desk has gone manual. The CISO has outlined four containment options. Each has a different cost.\n\nThe lights are still on for customers. Wholesale supply is unaffected. This is a data and systems crisis, not a power outage. The COBR threshold is not crossed.\n\nBut the next decision determines how much worse it gets.",
      facilitatorNotes:
        "The CEO, CFO, and COO own this decision. The CISO is presenting options, not making the call.\n\nAggressive containment (A) accepts a known cost (est. £1.8M trading suboptimality) in exchange for certainty. Selective containment (B) preserves trading efficiency but gives the attacker another bite.\n\nAsk the CFO: have you modelled the cost of a manual trading day? Ask the CEO: what does 'lights still on' protect you from in a COBR/NIS context?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "BREAKING: Major UK energy retailer reportedly hit by overnight cyber incident - supply unaffected",
      artifact: {
        type: "email",
        emailFrom: "s.khatun@veridianpower.co.uk",
        emailTo: "crisis-team@veridianpower.co.uk",
        emailSubject:
          "AUTHORITY NEEDED - Containment options - 5-minute decision window - your call",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CFO", "COO"],
      expectedKeywords: [
        "containment",
        "manual trading",
        "PSR",
        "lights on",
        "cost",
        "authority",
        "COBR",
      ],
      recapLine: "authorised {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Aggressive containment: all back-office systems down, trading on the manual fallback book - seal the estate",
          consequence:
            "Spread halted. Trading desk runs manual. Estimated £1.8M in suboptimal hedging. The attacker is locked out cleanly. The CISO calls it 'the right call at the right moment'.",
          rank: 1,
          recapFragment: "aggressive containment with manual trading fallback",
        },
        {
          key: "B",
          label:
            "Selective containment: protect PSR master and billing, let trading run on affected infrastructure",
          consequence:
            "Trading continues. The attacker re-encrypts the trading reconciliation systems at 06:30. You preserved £1.8M in trading efficiency and gave up another segment.",
          rank: 3,
          recapFragment: "selective containment keeping trading live",
        },
        {
          key: "C",
          label:
            "Full shutdown including customer-facing systems - until Mandiant gives all-clear",
          consequence:
            "740,000 customers get an error page. Spread halted. The customer portal going dark becomes a separate reputational crisis within 6 hours.",
          rank: 2,
          recapFragment: "full systems-wide shutdown including customer-facing",
        },
        {
          key: "D",
          label:
            "Hold and observe - let Mandiant complete their loop before you make a containment call that cannot be reversed",
          consequence:
            "Encryption spreads for another 90 minutes. By 05:45 the trading book reconciliation is unrecoverable from production. Mandiant arrive to a worse situation than briefed.",
          rank: 4,
          recapFragment: "holding for Mandiant before any containment",
        },
      ],
    },
    {
      id: "rwg-stock",
      commandTier: "STRATEGIC",
      order: 35,
      scenarioDay: 1,
      scenarioTime: "09:12",
      title: "09:12 - VRD.L Is Moving",
      body: "09:12. Veridian Power opened at 1,612 pence. Down 12.7% on yesterday's close. 14.8 million shares traded - the 30-day average daily volume is 2.1 million.\n\nSomeone in the market knew last night.\n\nThe FCA has called the company secretary asking whether a regulatory news announcement is being prepared. Your NOMAD is on the line to the CFO. A Morgan Stanley analyst has issued an intraday note placing their Buy rating Under Review.\n\nMAR Article 17 requires listed companies to disclose inside information as soon as possible. The CFO has 20 minutes before the FCA's patience ends.",
      facilitatorNotes:
        "A ransomware attack on a FTSE 250 OES company is almost certainly inside information under MAR Art. 7. Option A (RNS + voluntary suspension) is the cleanest regulatory posture. Option D is most dangerous: the FCA will ask why the stock was allowed to trade on information asymmetry.\n\nAsk the CFO: have you spoken to the NOMAD? What does your securities counsel say the MAR threshold is?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "VRD.L down 12.7% - volumes 7x average - markets await Veridian Power statement",
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
      expectedKeywords: [
        "RNS",
        "FCA",
        "MAR",
        "NOMAD",
        "suspension",
        "inside information",
        "disclosure",
      ],
      recapLine: "handled the market disclosure by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Issue RNS immediately with known facts and request voluntary trading suspension while preparing a fuller statement",
          consequence:
            "Trading suspended at 09:24. RNS issued at 09:31. The FCA acknowledge the proactive posture. VRD.L finds a floor at 1,590p and stabilises.",
          rank: 1,
          recapFragment: "an immediate RNS and voluntary trading suspension",
        },
        {
          key: "B",
          label:
            "Issue RNS immediately, no suspension - let the market price the risk transparently",
          consequence:
            "RNS out at 09:22. VRD.L drops another 4.1% in the hour after the statement. No regulatory concern raised. Stock finds a floor by midday.",
          rank: 1,
          recapFragment: "an immediate RNS without requesting suspension",
        },
        {
          key: "C",
          label:
            "Request voluntary suspension while preparing a fuller announcement - no RNS until we have a clearer picture",
          consequence:
            "Suspension granted at 09:21. Fuller RNS at 11:00. Some investors frustrated by the 2-hour blackout. The FCA note the suspension was appropriate.",
          rank: 2,
          recapFragment: "suspending trading while preparing a fuller disclosure",
        },
        {
          key: "D",
          label:
            "Hold the RNS - premature disclosure will crystallise panic before we understand the full picture",
          consequence:
            "VRD.L falls 19.3% by close. The FCA issue a formal query at 11:00. Two institutional shareholders file complaints.",
          rank: 4,
          recapFragment: "holding the RNS while the stock fell",
        },
      ],
    },
    {
      id: "rwg-i3d",
      commandTier: "STRATEGIC",
      order: 40,
      scenarioDay: 1,
      scenarioTime: "09:00",
      title: "09:00 - The Times Has The Story",
      body: "09:00. A reporter from The Times has emailed the press office with three specific facts: the time of the encryption event, the dollar figure on the ransom note, and the phrase 'Priority Services Register'. Filing in 90 minutes.\n\nInternally: 3,200 staff are arriving at offices with no email. The call centre is at 4x normal volume.\n\nThree groups need a substantive brief in the next hour: staff, customers, and the day-ahead wholesale market counterparties.\n\nYou can properly brief only one of them first. Which?",
      facilitatorNotes:
        "Brief order is a values question. There is no single right answer - only a values-revealing one. Push the CCO: if you pick staff first, what does the briefing actually say? Can you give 3,200 people enough to handle customer calls without creating a new information asymmetry problem?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "The Times says it will publish: 'UK energy retailer faces ransomware demand or PSR leak'",
      artifact: {
        type: "sms_thread",
        smsParticipants: ["N. Curtis - The Times", "CEO"],
        smsMessages: [
          {
            sender: "N. Curtis - The Times",
            text: "Morning. Nick Curtis, The Times. Filing at 10:30. I have the time of the encryption event, the dollar figure, and the phrase Priority Services Register. Is the CEO available to respond on record?",
            time: "08:53",
          },
          {
            sender: "N. Curtis - The Times",
            text: "One question before I file: the PSR holds the names of medically vulnerable customers. Were they warned before I began asking questions? That's the line I need answered before 10:30.",
            time: "09:07",
          },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CCO", "CLO"],
      expectedKeywords: [
        "staff",
        "customers",
        "PSR",
        "counterparties",
        "Times",
        "holding statement",
        "brief order",
      ],
      recapLine: "briefed in the order of {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Staff first - all-hands at 09:30, before the Times story drops, with the unvarnished truth",
          consequence:
            "Staff trust is preserved. Call centre agents handle the inbound noise with dignity because they were told first.",
          rank: 1,
          recapFragment: "staff first",
        },
        {
          key: "B",
          label:
            "Customers first - statement on the website and an SMS to the PSR cohort confirming services are unaffected",
          consequence:
            "Vulnerable customers are reassured. But staff find out via a Times push notification. Internal trust takes a real hit.",
          rank: 2,
          recapFragment: "customers and the PSR cohort first",
        },
        {
          key: "C",
          label:
            "Counterparties first - call the wholesale market makers and the Bank of England before the FT clears its throat",
          consequence:
            "Market integrity preserved. Two counterparties pull back from the day-ahead auction. Staff and customers find out from the news.",
          rank: 3,
          recapFragment: "wholesale counterparties first",
        },
        {
          key: "D",
          label:
            "Investors first - call the top 5 institutional shareholders before any other group gets a brief",
          consequence:
            "Two of the five leak the call to the FT within 20 minutes. The narrative becomes 'Veridian briefed the City before its own people'.",
          rank: 4,
          recapFragment: "the top institutional shareholders first",
        },
      ],
    },
    {
      id: "rwg-i4a",
      commandTier: "STRATEGIC",
      order: 55,
      scenarioDay: 1,
      scenarioTime: "15:19",
      title: "15:19 - The Listing Goes Live",
      body: "15:19. ALPHV have moved from threat to exhibition.\n\nThe leak site now shows a dedicated listing for Veridian Power. Visible without payment:\n\nRow 1: Margaret Elaine Thornton, 77, Carlisle, CA1 3NP - Home oxygen concentrator. NHS Dependency Code: HO3. Emergency contact: daughter Sandra Thornton, 07700 900441.\n\nRow 2: Robert James Mensah, 64, Leeds, LS7 2BT - Dialysis patient, home unit.\n\nRow 3: Patricia Anne Holloway, 58, Derby, DE1 1GA - Powered wheelchair, stair lift.\n\nMandiant confirm: real PSR data. The replica.\n\nIn Carlisle, Margaret Thornton does not yet know her medical condition is for sale.",
      facilitatorNotes:
        "No vote. A horror reveal. Let it sit.\n\nRead the listing aloud, slowly. This is the moment the abstract regulatory question becomes a human crisis. Ask: what does the room feel right now? What is the first thing the CEO wants to do?\n\nThe next inject forces the authority decision on outreach. This one exists to make that decision feel like a moral obligation, not a comms calculation.",
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
        darkWebPrice: "18 XMR (~£120,000) or included in $9.4M settlement",
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
      targetRoles: ["CEO", "CCO", "COO"],
      expectedKeywords: [
        "PSR",
        "Margaret",
        "Carlisle",
        "medical",
        "oxygen",
        "moral",
        "outreach",
      ],
      decisionOptions: [],
    },
    {
      id: "rwg-i4x",
      commandTier: "STRATEGIC",
      order: 57,
      scenarioDay: 1,
      scenarioTime: "15:24",
      title: "15:24 - The Authority to Call",
      body: "15:24. The head of customer operations has the operational plan ready. The technical team will execute whatever you authorise. But the decision of what to authorise - and when - is yours.\n\n84,247 PSR customers. 4,218 are Category 1: medically dependent on powered equipment. Home oxygen, dialysis, insulin refrigeration, powered wheelchairs.\n\nMandiant have raised a practical concern: a large-scale outbound calling programme will confirm the PSR breach publicly before the comms strategy is locked.\n\nYour COO has one more data point: the depot manager in Carlisle has already called Margaret Thornton personally - she knew her from a service visit. That is one. The other 84,246 are waiting.\n\nWhat do you authorise?",
      facilitatorNotes:
        "The Gold team authorises; the technical team executes.\n\nOption A (immediate Cat 1) is the morally and reputationally right answer. No reasonable journalist writes critically about a company proactively calling oxygen-dependent patients. The Mandiant concern about media timing is secondary.\n\nOption D (delay 24 hours) looks safe in the room and is the most regrettable in retrospect.\n\nAsk the CEO: if you wait 24 hours and Margaret Thornton reads it in the paper, what do you say to her daughter on the phone?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "Veridian Power: 84,247 Priority Services Register customers' data 'may have been accessed'",
      artifact: {
        type: "email",
        emailFrom: "t.osei@veridianpower.co.uk",
        emailTo: "crisis-team@veridianpower.co.uk",
        emailSubject:
          "AUTHORITY NEEDED - PSR outreach - 84,247 customers - 4,218 Cat 1 - operational plan ready - awaiting instruction",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "COO", "CCO"],
      expectedKeywords: [
        "Cat 1",
        "oxygen",
        "dialysis",
        "outreach",
        "authorise",
        "media risk",
        "24 hours",
      ],
      recapLine: "authorised the PSR outreach approach of {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Authorise immediate Cat 1 outreach - all 4,218 medically-dependent customers today, media risk accepted",
          consequence:
            "4,218 calls completed by 18:00. The Times runs the PSR angle but leads with 'Veridian calls vulnerable customers personally'. The narrative shifts from breach to response.",
          rank: 1,
          recapFragment: "immediate Cat 1 outreach regardless of media risk",
        },
        {
          key: "B",
          label:
            "Authorise DNO briefing first so engineers are on standby before we call any customers",
          consequence:
            "DNO coordinators briefed by 16:00. Engineers on standby across five regions. Outreach begins at 17:30 with support infrastructure in place. Three customers needed a welfare visit.",
          rank: 2,
          recapFragment: "DNO briefing before customer outreach",
        },
        {
          key: "C",
          label:
            "Authorise mass SMS to all 84,247 PSR customers tonight alongside a press statement - full transparency at scale",
          consequence:
            "SMS sent at 22:00. 14,000 calls to the emergency line before midnight. Three major newspapers lead with PSR. Outreach seen as reactive but comprehensive.",
          rank: 2,
          recapFragment: "mass SMS to all 84,247 PSR customers overnight",
        },
        {
          key: "D",
          label:
            "Hold 24 hours - restoration may deliver decryption keys, early outreach locks in the breach narrative",
          consequence:
            "Margaret Thornton reads about herself in The Times. Her daughter calls the company in distress. The Ombudsman receives a formal complaint before she has been contacted.",
          rank: 4,
          recapFragment: "delaying PSR outreach by 24 hours",
        },
      ],
    },
    {
      id: "rwg-i4",
      commandTier: "STRATEGIC",
      order: 60,
      scenarioDay: 1,
      scenarioTime: "14:30",
      title: "14:30 - The Ransom Note and the Authority Decision",
      body: "14:30. The full ransom note has been delivered through the encrypted-files window on a recovered workstation.\n\nALPHV. $9.4M in Bitcoin. 48 hours.\n\nAttached: a 200-row PSR sample including Margaret Thornton, and a 14-row wholesale trading book sample. Mandiant have confirmed both as authentic.\n\nBeazley, your cyber insurer, are on a Teams call. They want your opening posture before they tell you what they will cover.\n\nYour CISO has given you the technical brief: restoration is possible in 5-9 days without paying. ALPHV deletion commitments are credible in 40-60% of cases at most. Decryption keys typically work on 60-80% of files.\n\nThe CFO has confirmed: the company has the cash - just - to pay without breaching covenants.\n\nThis is an authority decision. It is yours.",
      facilitatorNotes:
        "This is the executive authority decision on ransom posture. The CISO has given them the technical brief. The CLO needs to be thinking about OFAC. The CFO about Beazley's policy terms.\n\nKey coaching: Option D should prompt the CLO to raise OFAC. ALPHV's sanctions status is reviewed weekly. Paying a group on the SDN list carries criminal liability.\n\nAsk the CEO: if you pay and ALPHV publishes the PSR anyway - Mandiant says they do in 40-60% of cases - what do you tell Margaret Thornton?",
      delayMinutes: 0,
      timerMinutes: 14,
      tickerHeadline:
        "Veridian Power confirms cyber incident: 'investigation ongoing, supply unaffected, customer data may be impacted'",
      artifact: {
        type: "ransomware_note",
        ransomAmount: "$9.4M",
        ransomDeadlineHours: 48,
        ransomWalletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CFO", "CLO", "COO"],
      expectedKeywords: [
        "ALPHV",
        "PSR",
        "Beazley",
        "OFAC",
        "refuse",
        "stall",
        "negotiate",
        "SDN",
        "authority",
      ],
      recapLine: "took the opening posture of {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Refuse to engage - announce internally we are not paying, focus 100% on restoration and notification",
          consequence:
            "Clean moral and legal posture. Restoration timeline 5-9 days. The PSR sample will publish. You will need to call Margaret Thornton before she reads about herself. The CCO turns pale.",
          rank: 1,
          recapFragment: "refuse-to-engage",
        },
        {
          key: "B",
          label:
            "Stall - open a chat to buy 24 hours of investigation time, commit to nothing",
          consequence:
            "ALPHV respond in 11 minutes. They give exactly 24 hours. Mandiant warn that ALPHV's 'good faith' is a polished negotiating routine.",
          rank: 2,
          recapFragment: "a 24-hour stall",
        },
        {
          key: "C",
          label:
            "Negotiate in good faith - engage Coveware, target a 60% reduction, retain the right to walk",
          consequence:
            "Coveware engaged. ALPHV accept engagement and counter at $7.8M. The OFAC sanctions risk is being assessed in parallel by external counsel.",
          rank: 3,
          recapFragment: "good-faith negotiation via Coveware",
        },
        {
          key: "D",
          label:
            "Pay in full immediately - end the extortion clock and protect the PSR cohort",
          consequence:
            "Beazley refuse to authorise without OFAC clearance. The CFO bridges from corporate cash. Keys work on 62% of files. The PSR mirrors to a fourth site within the hour.",
          rank: 4,
          recapFragment: "immediate payment in full",
        },
      ],
    },
    {
      id: "rwg-i4v",
      commandTier: "STRATEGIC",
      order: 65,
      scenarioDay: 1,
      scenarioTime: "15:42",
      title: "15:42 - The Mandate",
      body: "15:42. The chat window is open. ALPHV have a live operator on the other end.\n\nThe technical team have recommended Mandiant on the keyboard. The executives need to authorise the mandate.\n\nBefore the window opened, the CISO sent one message: 'The first message to ALPHV will set the tone for everything that follows. I need you to tell me: what is the mandate? What can we offer? What is the hard limit? What happens if they threaten to release the PSR today?'\n\nThe room goes quiet. You have five minutes.",
      facilitatorNotes:
        "The technical team makes the operational keyboard decision. The Gold team's decision is the mandate - the parameters within which the negotiation is authorised to proceed.\n\nThis is a values and governance decision disguised as an operational one. Ask each executive: what is your hard limit? What happens if ALPHV threaten to release Margaret Thornton's data in the next 24 hours unless they receive $1M by tonight?\n\nThe most useful debrief moment is when the team realises they have to answer that question out loud.",
      delayMinutes: 0,
      timerMinutes: 10,
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
            text: "We acknowledge receipt of your communication. We are reviewing the matter with our advisers.",
            time: "15:47",
          },
          {
            side: "threat",
            text: "We respect that answer. We are patient professionals. The clock is clear: 22 hours 13 minutes remaining. We hold 84,247 records. Your customers in Carlisle will read about themselves in The Times tomorrow morning if we do not receive confirmation of your intent.",
            time: "15:49",
          },
          {
            side: "threat",
            text: "We have completed this process 200 times. Companies that engage quickly receive the best outcomes. This does not change the clock.",
            time: "15:54",
          },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "CFO"],
      expectedKeywords: [
        "mandate",
        "hard limit",
        "OFAC",
        "PSR",
        "Mandiant",
        "parameters",
        "authority",
      ],
      recapLine: "set the negotiation mandate as {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Full mandate to Mandiant: engage professionally, explore scope reduction, hard ceiling at Beazley's $4M coverage limit - no payment above without board sign-off",
          consequence:
            "Mandiant have clear parameters. ALPHV recognise the professional cadence. The ceiling creates a natural negotiating floor.",
          rank: 1,
          recapFragment: "a full professional mandate with a hard Beazley ceiling",
        },
        {
          key: "B",
          label:
            "Narrow mandate: Mandiant may stall and gather information only - no financial engagement at this stage",
          consequence:
            "Mandiant buy time. ALPHV's patience contracts. At 20:00 they post a fresh PSR sample to a third forum. The Carlisle customer's name is now on a Telegram channel.",
          rank: 2,
          recapFragment: "a stall-only mandate with no financial engagement",
        },
        {
          key: "C",
          label:
            "Open mandate: Mandiant may negotiate on price freely up to $6.2M - we want this resolved",
          consequence:
            "Mandiant flag the OFAC risk on any payment without weekly SDN list clearance. An open mandate without parameters creates liability. The CLO is visibly uncomfortable.",
          rank: 3,
          recapFragment: "an open mandate up to $6.2M",
        },
        {
          key: "D",
          label:
            "No mandate - close the window, accept the PSR publishes, focus 100% on restoration",
          consequence:
            "Brave. The window closes. The PSR will publish in 24 hours. Mandiant's tone shifts: 'We need the Carlisle customer on the phone this afternoon.'",
          rank: 4,
          recapFragment: "refusing the chat - no mandate to negotiate",
        },
      ],
    },
    {
      id: "rwg-i5",
      commandTier: "STRATEGIC",
      order: 70,
      scenarioDay: 3,
      scenarioTime: "11:00",
      title: "Day 3 - The Counter and the Authority Call",
      body: "Day 3, 11:00. Nineteen hours of negotiation.\n\nALPHV's counter: $6.2M. 12-hour fuse. A written commitment in the chat window that the PSR will be deleted from all mirrors and no public leak will occur.\n\nMandiant's assessment of the deletion commitment: 'Low credibility. ALPHV publish data in approximately 40-60% of cases even after payment. The commitment is not enforceable.'\n\nOFAC team: ALPHV not currently on the SDN list. Next weekly review is Wednesday.\n\nBeazley: agreed to cover up to $4M conditional on OFAC clearance and Coveware sign-off.\n\nRestoration: 60% complete.\n\nThis is the authority decision on the counter. What do you instruct?",
      facilitatorNotes:
        "The Mandiant credibility assessment on the deletion commitment is the pivotal piece of evidence: paying $6.2M does not guarantee the PSR is protected.\n\nThe CLO should be tracking the OFAC SDN list review date. The CFO should be tracking the Beazley coverage limit. The CEO should be asking: if we pay and ALPHV publish anyway, what do we tell the Ombudsman?\n\nGood moment to let both teams interact if running in parallel - Silver team are managing the negotiation, Gold team are authorising the position.",
      delayMinutes: 0,
      timerMinutes: 14,
      tickerHeadline:
        "Reuters: 'Veridian Power in active ransom negotiation - sources put demand near $9M'",
      artifact: {
        type: "email",
        emailFrom: "mandiant.lead@mandiant.com",
        emailTo: "crisis-team@veridianpower.co.uk",
        emailSubject:
          "ALPHV counter received - $6.2M - 12hr fuse - deletion commitment assessed LOW credibility - authority needed",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CFO", "CLO", "COO"],
      expectedKeywords: [
        "counter",
        "Beazley",
        "OFAC",
        "deletion",
        "40-60%",
        "credibility",
        "lowball",
        "authority",
      ],
      recapLine: "instructed {{recapFragment}} on the counter",
      decisionOptions: [
        {
          key: "A",
          label:
            "Instruct Mandiant to lowball back at $2.4M with independent deletion verification - we have negotiating room we have not used",
          consequence:
            "ALPHV laugh in chat and counter at $5.4M. The negotiation continues. The 12-hour fuse extends informally to 18 hours.",
          rank: 1,
          recapFragment: "a $2.4M lowball with verification conditions",
        },
        {
          key: "B",
          label:
            "Instruct a 6-hour stall - board approval is needed, use the time to push restoration to 75%",
          consequence:
            "The fuse contracts to 6 hours. Mandiant push restoration to 72%. ALPHV post a fresh PSR sample to a fourth forum. The Carlisle customer's name appears on Reddit.",
          rank: 2,
          recapFragment: "a 6-hour board-approval stall",
        },
        {
          key: "C",
          label:
            "Escalate to OFAC and the NCA in writing - signal that any payment is under law enforcement scrutiny",
          consequence:
            "OFAC acknowledge. The NCA engage. ALPHV detect the increased noise and post the full PSR replica to their leak site at 16:20.",
          rank: 3,
          recapFragment: "OFAC and NCA escalation in writing",
        },
        {
          key: "D",
          label:
            "Accept the $6.2M counter - Beazley covers $4M, we bridge the rest, end the clock",
          consequence:
            "Beazley cover $4M. We bridge $2.2M. Keys arrive and work on 62% of files. The PSR mirrors to a fourth site within the hour. The deletion commitment is broken before the wire clears.",
          rank: 4,
          recapFragment: "accepting the $6.2M counter",
        },
      ],
    },
    {
      id: "rwg-i5a",
      commandTier: "STRATEGIC",
      order: 75,
      scenarioDay: 3,
      scenarioTime: "09:00",
      title: "Day 3 - Three Things Arrive Before 09:10",
      body: "Day 3, 09:00. Three things in the first ten minutes.\n\nAt 08:52: Beazley's cyber claims division query. The third-party MFA appliance was flagged as a 'medium, deferred' vulnerability on Veridian's last penetration test 14 months ago. If the deferred vulnerability is the access vector - and Mandiant's forensic assessment is that it is - Policy Exclusion 7(b) may apply. $4M of cover under active review.\n\nAt 09:03: The Secretary of State for Energy Security, live on Sky News: 'I am deeply concerned. The Priority Services Register exists to protect our most vulnerable citizens. Parliamentary questions have been tabled for Thursday.'\n\nAt 09:07: Ofgem. Formal request under Schedule 4 of the NIS Regulations for a full incident report within 14 days. Enforcement notice 'under active consideration'.\n\nThe CLO has all three on her desk. The MFA vulnerability connects all of them.",
      facilitatorNotes:
        "No vote. Scene-setter for the rwg-i6a coupling decision.\n\nThe three items are linked by the same governance thread: the pen test finding, the deferral, and who knew. The only question is whether the company controls the narrative or reacts to each separately.\n\nLet the CLO sweat. Ask: is there a board paper trail on the MFA deferral? If yes, it helps Ofgem and hurts Beazley. If no, it hurts both.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Energy secretary: 'deeply concerned' - parliamentary questions tabled - Ofgem signals NIS enforcement",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "SKY NEWS",
        tvHeadline:
          "ENERGY SECRETARY: 'DEEPLY CONCERNED' ABOUT VERIDIAN POWER PSR BREACH",
        tvTicker:
          "Parliamentary questions tabled for Thursday - Ofgem confirms NIS enforcement under consideration - Beazley queries cyber policy MFA exclusion",
        tvReporter: "WESTMINSTER",
      },
      isDecisionPoint: false,
      targetRoles: ["CEO", "CLO", "CFO"],
      expectedKeywords: [
        "Beazley",
        "Ofgem",
        "NIS",
        "MFA",
        "pen test",
        "parliamentary",
        "exclusion",
        "knew",
      ],
      decisionOptions: [],
    },
    {
      id: "rwg-board",
      commandTier: "STRATEGIC",
      order: 77,
      scenarioDay: 3,
      scenarioTime: "10:30",
      title: "Day 3 - The Board Logs In",
      body: "Day 3, 10:30. Every non-executive director is now online.\n\nThe Audit Committee chair, Caroline Wu, has posted a message in the board discussion thread before the formal meeting begins:\n\n'I need three things answered before this call starts. One: did the executive team know about the MFA vulnerability and if so when? Two: is there a paper trail on the deferral decision? Three: who in this room has read the actual pen test report from 14 months ago?\n\nI ask because Ofgem will ask. The Secretary of State will ask. And if any of these answers are wrong in this room today, they will be worse when they are wrong in front of a Select Committee.'\n\nThe CEO is the last person to log in.",
      facilitatorNotes:
        "No vote - atmosphere beat.\n\nCaroline Wu is asking exactly the questions the NIS enforcement team will ask. Ask the CEO: what do you say when you log in? Do you answer Wu's questions immediately or open the formal session? What does the board chair need to hear from you in the next 30 seconds?",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Veridian Power emergency board session underway - NEDs request answers on MFA vulnerability knowledge",
      artifact: {
        type: "board_portal",
        boardPortalOrgName: "Veridian Power plc - Board Portal",
        boardPortalAlertCount: 3,
        boardPortalAlertTitle:
          "EMERGENCY BOARD SESSION - Day 3 Incident Review - MFA Disclosure Question - Ofgem Enforcement Risk",
        boardPortalMembers: [
          {
            name: "Sir David Ashworth",
            role: "Non-Executive Chairman",
            loggedInAt: "10:22",
            isOnline: true,
          },
          {
            name: "Caroline Wu",
            role: "NED - Audit Committee Chair",
            loggedInAt: "10:18",
            isOnline: true,
          },
          {
            name: "James Okafor",
            role: "NED - Remuneration Committee",
            loggedInAt: "10:24",
            isOnline: true,
          },
          {
            name: "Priya Mehta",
            role: "NED - Risk Committee Chair",
            loggedInAt: "10:21",
            isOnline: true,
          },
          {
            name: "Robert Kaye",
            role: "CEO",
            loggedInAt: "10:29",
            isOnline: true,
          },
          {
            name: "Helen Park",
            role: "CFO",
            loggedInAt: "10:23",
            isOnline: true,
          },
          {
            name: "Sarah Khatun",
            role: "CISO",
            loggedInAt: "10:20",
            isOnline: true,
          },
        ],
      },
      isDecisionPoint: false,
      targetRoles: ["CEO", "CLO", "CFO"],
      expectedKeywords: [
        "board",
        "Caroline Wu",
        "pen test",
        "knew",
        "paper trail",
        "select committee",
        "MFA",
      ],
      decisionOptions: [],
    },
    {
      id: "rwg-i6a",
      commandTier: "STRATEGIC",
      order: 80,
      scenarioDay: 3,
      scenarioTime: "16:30",
      title: "Day 3 - Two Fronts, One Hour",
      body: "16:30. Two formal letters require a decision within the hour.\n\nBeazley are querying whether the deferred MFA vulnerability constitutes a policy exclusion. $4M of cover at risk. If you disclose proactively you may argue mitigation. If you fight through litigation you preserve optionality but burn the relationship.\n\nOfgem, formal under Schedule 4 of the NIS Regulations, requesting a full incident report within 14 days and signalling that an enforcement notice is under active consideration.\n\nThe CLO has one hour to decide how to couple - or decouple - these two processes. They are linked by the same evidence: the pen test report showing the MFA issue was classified 'medium, deferred'. That document will appear in both processes.",
      facilitatorNotes:
        "Strategic coupling decision - the Gold team's most consequential call.\n\nThe pen test report will appear in both the Beazley and Ofgem processes regardless. The only question is whether the company controls the disclosure or reacts to it. Option A (coupled proactive disclosure) saves 200+ hours of legal work and builds goodwill with both parties simultaneously.\n\nOption D (side-letter) is the trap that looks like a solution - it will surface in Ofgem's evidence-gathering and the regulator will note 'lack of candour'.\n\nAsk the CLO: what is the legal privilege position on the pen test report? Does it matter who commissioned it?",
      delayMinutes: 0,
      timerMinutes: 14,
      tickerHeadline:
        "Ofgem 'actively considering enforcement' against Veridian Power under NIS Regulations",
      artifact: {
        type: "legal_letter",
        legalCaseRef: "OFGEM-NIS-2026-0117 / BEZ-CY-2026-0844",
        legalAuthority:
          "Office of Gas and Electricity Markets / Beazley Cyber Claims Division",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "CFO"],
      expectedKeywords: [
        "Ofgem",
        "Beazley",
        "NIS",
        "MFA",
        "couple",
        "decouple",
        "disclose",
        "pen test",
      ],
      recapLine: "handled the two fronts by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Coupled proactive disclosure - full transparency to both Beazley and Ofgem with the same evidence pack including the pen test and the deferral",
          consequence:
            "Coverage counsel shift from exclusion to mitigation. Ofgem note the proactive posture. The single evidence pack saves 200 hours of legal work. The narrative is coherent.",
          rank: 1,
          recapFragment: "coupled disclosure to both Beazley and Ofgem",
        },
        {
          key: "B",
          label:
            "Decouple - fight Beazley on the exclusion clause, engage Ofgem cooperatively in a separate track",
          consequence:
            "Two legal workstreams at significant cost. Beazley initiate a formal coverage dispute. Ofgem inquiry continues cleanly. Total legal spend triples.",
          rank: 2,
          recapFragment: "decoupling the Beazley and Ofgem processes",
        },
        {
          key: "C",
          label:
            "Ofgem first, stall Beazley - the regulator matters more right now than the insurer",
          consequence:
            "Ofgem cooperative. Beazley feel sandbagged when they discover the parallel disclosure. They harden. The exclusion bites for $4M.",
          rank: 3,
          recapFragment: "Ofgem first and Beazley stalled",
        },
        {
          key: "D",
          label:
            "Try to settle Beazley quietly with a side-letter before the Ofgem submission is filed",
          consequence:
            "Coverage counsel resign on conflict-of-interest grounds. The side-letter surfaces in Ofgem's evidence-gathering six weeks later. The regulator notes 'lack of candour'.",
          rank: 4,
          recapFragment: "a quiet Beazley side-letter before the Ofgem filing",
        },
      ],
      branches: [
        { optionKey: "A", nextInjectId: "rwg-i6-strong" },
        { optionKey: "B", nextInjectId: "rwg-i6-strong" },
        { optionKey: "C", nextInjectId: "rwg-i6-weak" },
        { optionKey: "D", nextInjectId: "rwg-i6-weak" },
      ],
    },
    {
      id: "rwg-i6-strong",
      commandTier: "STRATEGIC",
      order: 90,
      scenarioDay: 4,
      scenarioTime: "08:00",
      title: "Day 4 - Cooperation Footing",
      body: "Day 4, 08:00. Mandiant's intermediate report is in Ofgem's hands.\n\nCoverage counsel have accepted the proactive disclosure. Beazley are now negotiating mitigation, not exclusion.\n\nPSR outreach: 79,000 of 84,247 customers reached. 84 welfare checks completed. The Carlisle customer has been visited in person. Her daughter has called to thank the company.\n\nRestoration: 78%. The wholesale trading desk is back on the primary book. Two counterparties have resumed normal positions.\n\nThe parliamentary questions are still live for Thursday. The Secretary of State's office has asked for a 1:1 briefing before the chamber session.\n\nYou are not out of the woods. But you are walking, not bleeding.",
      facilitatorNotes:
        "Rewarded narrative for strong Gold team play. Let the specific details land - Margaret Thornton's daughter calling, Beazley shifting from exclusion to mitigation.\n\nThe score-routed finale (rwg-i7) follows.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Veridian Power: 'ongoing investigation, supply secure, 79,000 vulnerable customers contacted'",
      artifact: {
        type: "regulator_portal",
        regulatorName: "Information Commissioner's Office",
        regulatorPortalUrl: "report.ico.org.uk",
        regulatorCaseRef: "IC-247831-X9K2",
        regulatorStatus: "ACKNOWLEDGED",
        regulatorSubmittedAt: "Monday 14 April 2026 at 06:11 UTC",
        regulatorDeadline:
          "72 hours from discovery - expires Wednesday 16 April 2026 at 05:30 UTC",
        regulatorOfficerName: "J. Whitmore, Senior Case Officer - Data Breach Team",
      },
      isDecisionPoint: false,
      targetRoles: ["CEO", "CLO", "CFO"],
      expectedKeywords: [
        "Beazley",
        "mitigation",
        "PSR",
        "cooperation",
        "restoration",
        "parliamentary",
        "Margaret",
      ],
      decisionOptions: [],
    },
    {
      id: "rwg-i6-weak",
      commandTier: "STRATEGIC",
      order: 90,
      scenarioDay: 4,
      scenarioTime: "08:00",
      title: "Day 4 - The Defensive Crouch",
      body: "Day 4, 08:00. Beazley have formally placed the claim under coverage dispute. The pen test deferral is now in two evidence files.\n\nMandiant's intermediate report was delivered to Ofgem 26 hours late because of an internal legal review hold.\n\nPSR outreach: 41,000 of 84,247 customers reached. One Ombudsman complaint received and not yet resolved. Call centre wait time: 47 minutes.\n\nRestoration: 64%. Two trading counterparties have reduced their credit limit.\n\nThe Times are running: 'Inside Veridian's bunker week'. The board chair has asked for a 1:1 with the CEO at 18:00.\n\nCaroline Wu has sent a message to the company secretary: 'I will need the pen test report and the deferral sign-off before Thursday. Please confirm it is available.'",
      facilitatorNotes:
        "Punishing narrative for weaker Gold team play. Let the Caroline Wu message land last - the board is now doing their own discovery.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Veridian Power 'in bunker week' as Times runs day-four feature on executive response failures",
      artifact: {
        type: "news_headline",
      },
      isDecisionPoint: false,
      targetRoles: ["CEO", "CLO", "CFO"],
      expectedKeywords: [
        "Beazley",
        "dispute",
        "Ombudsman",
        "Times",
        "pen test",
        "Caroline Wu",
        "deferral",
      ],
      decisionOptions: [],
    },
    {
      id: "rwg-i7",
      commandTier: "STRATEGIC",
      order: 100,
      scenarioDay: 5,
      scenarioTime: "16:00",
      title: "Day 5 - How Does This End?",
      body: "Day 5, 16:00. The technical incident is closing.\n\n27,000 of the 84,247 PSR records have been scraped and reposted on a Telegram channel before takedown. Restoration: 91%. The trading desk is back on the primary book. Ofgem's enforcement team have a draft notice. Beazley have a final position on the claim. The CFO has a number. The board has a question. The CEO has a microphone.\n\nThe week-one update is due at 17:00. The markets are watching.\n\nEvery choice this leadership team made across five days is about to have a price attached to it.",
      facilitatorNotes:
        "Score-routed finale. Compound average rank of all ranked decisions. Thresholds: <=1.6 => rwg-end1 (TRIUMPH), <=2.3 => rwg-end2 (RECOVERY), <=3.0 => rwg-end3 (DIMINISHED), >3.0 => rwg-end4 (CATASTROPHIC).\n\nDo not announce the threshold or the score. Let the ending reveal it.",
      delayMinutes: 0,
      timerMinutes: 6,
      tickerHeadline:
        "Veridian Power week-one update due 17:00 - Ofgem and ICO watching",
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
      targetRoles: ["CEO", "CFO", "CLO", "CCO"],
      expectedKeywords: ["Ofgem", "Beazley", "PSR", "ending", "week-one"],
      decisionOptions: [],
      branchMode: "score",
      branches: [
        { optionKey: "_", nextInjectId: "rwg-end1", scoreMax: 1.6 },
        { optionKey: "_", nextInjectId: "rwg-end2", scoreMax: 2.3 },
        { optionKey: "_", nextInjectId: "rwg-end3", scoreMax: 3.0 },
        { optionKey: "_", nextInjectId: "rwg-end4", scoreMax: 99 },
      ],
    },
    {
      id: "rwg-end1",
      commandTier: "STRATEGIC",
      order: 110,
      scenarioDay: 30,
      isEnding: true,
      title: "Day 30 - The Sector Standard",
      body: "Thirty days on.\n\nOfgem closed the enforcement file with no notice issued, citing 'proactive cooperation that materially shaped the outcome and exceeded the obligations of the NIS Regulations'. Beazley paid in full - the coupled disclosure posture held.\n\nThe PSR outreach was completed: 84,247 customers contacted, 47 welfare checks completed by DNO field engineers. Margaret Thornton received a personal apology from the CEO by letter and a guaranteed upgrade to Priority Services Register tier.\n\nThe Times ran a follow-up: 'How Veridian's worst week became the energy sector's playbook.' The NCSC has asked the CEO to speak at a closed sector roundtable. Ofgem's Cyber Cooperation Award goes to Veridian Power tomorrow.\n\nOne last vote. Which single call did the most to earn this ending?",
      facilitatorNotes:
        "Triumph ending. The reflection vote is unranked - let the team find the thread. Most Gold teams land on the NCSC first-call decision or the Beazley/Ofgem coupling.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Ofgem closes enforcement file: Veridian Power named sector cyber standard",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "BBC NEWS",
        tvHeadline: "VERIDIAN POWER NAMED OFGEM CYBER COOPERATION AWARD WINNER",
        tvTicker:
          "Enforcement file closed - Beazley paid in full - 84,247 PSR customers contacted - CEO to speak at NCSC roundtable - sector playbook adopted",
        tvReporter: "WESTMINSTER",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "CFO", "CCO"],
      expectedKeywords: ["reflection"],
      decisionOptions: [
        {
          key: "A",
          label:
            "Calling NCSC first - and the tone that set for every regulator conversation that followed",
        },
        {
          key: "B",
          label:
            "Filing the ICO notification promptly - and amending rather than waiting",
        },
        {
          key: "C",
          label:
            "Authorising the Cat 1 PSR outreach immediately, regardless of media risk",
        },
        {
          key: "D",
          label:
            "The coupled Beazley and Ofgem disclosure - the decision that saved $4M and a regulatory relationship",
        },
      ],
    },
    {
      id: "rwg-end2",
      commandTier: "STRATEGIC",
      order: 110,
      scenarioDay: 30,
      isEnding: true,
      title: "Day 30 - Quiet Lights On",
      body: "Thirty days on.\n\nBeazley settled at 70% of the claim - the MFA exclusion partially held, but the mitigation case avoided full denial. Net recovery: $2.8M against a $4M policy.\n\nOfgem issued a private letter of concern with no public enforcement notice. The letter cited 'adequate but not exemplary cooperation'.\n\nThe PSR contact programme completed in 11 days. One Ombudsman complaint received and subsequently withdrawn. No welfare emergencies missed.\n\nRestoration: 100%. The CEO survived the AGM with 71% support - a 14-point drop on last year.\n\nThe boardroom is quiet. The lights are on. Nobody on the street is talking about Veridian Power any more.\n\nOne last vote. What was the most important thing you got right?",
      facilitatorNotes:
        "Recovery ending. Good choices overall but at least one material misstep - likely the ICO notification timing, the brief order, or the Beazley/Ofgem coupling. Reflection vote asks the positive question.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Veridian Power: 'closing the chapter - focused on customer trust and resilience investment'",
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
      targetRoles: ["CEO", "CLO", "CFO", "CCO"],
      expectedKeywords: ["reflection"],
      decisionOptions: [
        {
          key: "A",
          label: "Reaching the PSR cohort before they read about themselves in the press",
        },
        {
          key: "B",
          label: "Honest internal posture - briefing staff before the Times story dropped",
        },
        { key: "C", label: "Holding the negotiation line on the counter" },
        { key: "D", label: "Cooperative tone with Ofgem from the first call" },
      ],
    },
    {
      id: "rwg-end3",
      commandTier: "STRATEGIC",
      order: 110,
      scenarioDay: 30,
      isEnding: true,
      title: "Day 30 - The Long Tail",
      body: "Thirty days on.\n\nOfgem issued a public enforcement notice - a first for an energy retailer. The notice cites failures in notification timing, the delayed PSR outreach, and the Beazley/Ofgem decoupling approach. Penalty: £8.7M.\n\nBeazley denied the claim in full. The side-letter - or the decoupled approach - left the company exposed.\n\nA class action covering 47,000 PSR-listed customers was filed in the High Court last Friday. The CFO has a number. The CEO has 90 days to deliver a credible plan. The board has not yet decided whether to back her.\n\nOne last vote. Which call would you most want to take again?",
      facilitatorNotes:
        "Diminished ending. Multiple weak calls, no single catastrophic one. Reflection vote asks the specific 'which decision' question - always the most useful debrief prompt.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Ofgem issues NIS enforcement notice and £8.7M penalty against Veridian Power - class action filed",
      artifact: {
        type: "news_headline",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "CFO", "CCO"],
      expectedKeywords: ["reflection"],
      decisionOptions: [
        {
          key: "A",
          label: "The ICO notification timing - we should have filed earlier and amended",
        },
        { key: "B", label: "The brief order - counterparties and investors before staff" },
        { key: "C", label: "The ransom posture - we kept payment too live for too long" },
        {
          key: "D",
          label: "The Beazley and Ofgem handling - the coupling decision",
        },
      ],
    },
    {
      id: "rwg-end4",
      commandTier: "STRATEGIC",
      order: 110,
      scenarioDay: 30,
      isEnding: true,
      title: "Day 30 - We Paid Twice",
      body: "Thirty days on.\n\nALPHV took the payment and re-extorted in week three for 'remaining' data. The company refused. The documents published.\n\nOFAC have opened an inquiry into the original payment because ALPHV was added to the SDN list four days after the wire cleared.\n\nThe full PSR dataset - all 84,247 records - was published on five mirrors in week two. 27,000 records have been indexed by data brokers.\n\nThe CEO resigned on Monday. The CLO resigned on Tuesday. The CFO resigned on Wednesday.\n\nThe interim board chair confirmed in this morning's RNS: Veridian Power is exploring 'all strategic options including merger and potential sale'.\n\nThe trading desk is profitable. Nothing else is.\n\nOne last vote. Looking back - which call do you most regret?",
      facilitatorNotes:
        "Catastrophic ending. Compound average rank exceeded 3.0. The reflection vote produces the most useful debrief material.\n\nCommon answers: the NCSC notification delay, paying the counter under PSR pressure, the Beazley side-letter. Each tells you something different about where the team's default instincts sat.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Veridian Power chair: 'exploring all strategic options' - CEO, CLO, CFO resign - OFAC inquiry active",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "BBC NEWS",
        tvHeadline:
          "VERIDIAN POWER IN CRISIS: EXEC TEAM RESIGNS - OFAC INQUIRY - ENTIRE PSR PUBLISHED",
        tvTicker:
          "OFAC investigating ransom payment - 84,247 vulnerable customers' data on dark web - CEO, CLO, CFO resign - strategic review launched - shares suspended",
        tvReporter: "CITY OF LONDON",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "CFO", "CCO"],
      expectedKeywords: ["reflection", "regret"],
      decisionOptions: [
        {
          key: "A",
          label: "Calling Ofgem before NCSC - and the regulatory tone that set",
        },
        { key: "B", label: "Holding the RNS while the stock fell" },
        { key: "C", label: "Accepting the $6.2M counter under PSR pressure" },
        { key: "D", label: "The Beazley side-letter" },
      ],
    },
  ],
};
