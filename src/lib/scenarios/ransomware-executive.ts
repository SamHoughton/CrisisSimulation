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
  audienceLabel: "For your board and executive team. Tests governance, market disclosure, and ransom authority. No technical knowledge needed.",
  regulatoryFrameworks: [
    "Network security regulations",
    "72-hour data breach notification",
    "Listed company disclosure obligations",
    "72-hour regulator notification",
  ],
  roles: ["CEO", "CFO", "CLO", "CCO", "COO"],
  briefing:
    "You are the executive leadership team of Veridian Power plc - a FTSE 250 UK energy retailer that supplies power to over 740,000 homes. Your trading desk runs £2.1B of day-ahead wholesale positions. Your front-office holds the Priority Services Register: 84,000 vulnerable customers who depend on uninterrupted power for medical equipment, dialysis, and oxygen.\n\nYour CISO called you at 05:30. The incident is confirmed: ALPHV have been inside your systems for six days. Bulk encryption fired overnight. A read-replica of the PSR has almost certainly been exfiltrated.\n\nThe technical team is working the problem. Your job is everything else: who you call, what you tell them, how you move in the markets, what authority you give the negotiators, and whether the decisions you make in the next 48 hours hold up in front of Ofgem, the ICO, and the Treasury Select Committee.\n\nThe markets open in three hours and twenty-two minutes.",
  injects: [
    {
      id: "rwg-i1",
      commandTier: "STRATEGIC",
      order: 10,
      scenarioDay: 1,
      scenarioTime: "05:30",
      title: "05:30 - The Call",
      tierSkipSummary:
        "At 05:30 the CISO confirmed an active ALPHV ransomware incident. Bulk encryption had hit 217 servers. A PSR read-replica was confirmed exfiltrated. The Gold team convened for their first decision: who gets called first.",
      body: "Your phone goes at 05:30. You were asleep.\n\nIt's your CISO. She needs sixty seconds.",
      facilitatorNotes:
        "The most important question this inject asks isn't technical - it's about who the CEO treats as a priority stakeholder at 05:30 when the information is incomplete.\n\nOption A (CISO to continue technical response) is correct: calling the CISO back immediately to authorise the next steps keeps the technical response moving. The CISO is the one person who can slow the damage and they need authority to do it.\n\nOption B (General Counsel) is the instinct of legally cautious leaders. Not wrong, but the notification clock doesn't stop while you're still doing technical triage.\n\nOption C (Chairman) is a governance reflex. Correct instinct, wrong sequence. The Chairman needs to know, but not before the CISO has authorisation to act.\n\nOption D (CFO) is understandable given the financial exposure, but premature.\n\nVeridian supplies power to 84,000 customers who depend on it for medical equipment. That's the human weight behind every decision today. Ask the room: if one of those customers loses power tonight because the team spent forty minutes briefing the wrong person first, who bears that?",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "Energy retailers face 'cyber resilience year' as Ofgem raises NIS reporting bar",
      artifact: {
        type: "voicemail",
        voicemailCaller: "Sarah Khatun - Chief Information Security Officer",
        voicemailCallerNumber: "+44 7700 900112",
        voicemailDuration: "1:52",
        voicemailTime: "05:30",
        voicemailTranscript:
          "It's Sarah. I need sixty seconds and then you'll understand why I'm calling at this hour. Six days ago, someone got into our systems using a stolen password from one of our contractors. They've been moving quietly ever since. At just after four this morning, they ran the trigger. Two hundred and seventeen servers encrypted - billing, trading reconciliation, payroll, all gone. Before they encrypted it, they copied the Priority Services Register. The list of all our vulnerable customers. We don't know for certain it's in criminal hands but Mandiant assess it as highly likely. The lights are still on. No customer has lost power. This is a systems crisis, not a supply crisis. Mandiant are already on their way in. I need to know who you're calling first so I can brief them or hold. I'm so sorry. Call me back.",
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
            "Call the CISO back and authorise her to act. get Mandiant moving, lock the estate down. Everything else follows once you understand what you're dealing with.",
          consequence:
            "NCSC respond within 40 minutes with a named incident handler. The notification clock is on record. Ofgem later note the proactive NCSC escalation as evidence of good NIS culture.",
          rank: 1,
          recapFragment: "NCSC under network security regulations",
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
            "Call the General Counsel first. before you do anything, you need to know what you're legally obligated to do and in what order.",
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
      order: 20,
      scenarioDay: 1,
      scenarioTime: "05:47",
      title: "05:47 - The Lawyer's Message",
      body: "Seventeen minutes later, your phone lights up again. Your General Counsel. She's also been awake for a while.",
      facilitatorNotes:
        "The question is whether to file early with incomplete information or wait. Experienced CLOs know the regulator prefers early and incomplete over late and complete - filing early is treated as evidence of good culture. Waiting feels safer but burns time and looks evasive. Watch for teams that try to avoid filing altogether, or who want to route it through a different regulator. They are separate obligations.",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "ICO publishes updated guidance on personal data breach notification timelines",
      artifact: {
        type: "sms_thread",
        smsParticipants: [
          "Rachel Winters - General Counsel",
          "You",
        ],
        smsMessages: [
          {
            sender: "Rachel Winters - General Counsel",
            text: "I need five minutes before you call anyone else. It's about the data regulator. Can you call me now?",
            time: "05:44",
          },
          {
            sender: "Rachel Winters - General Counsel",
            text: "We have a legal obligation to notify the data protection regulator within 72 hours of becoming aware of a breach. That clock started at 05:30 when the CISO called you.",
            time: "05:47",
          },
          {
            sender: "Rachel Winters - General Counsel",
            text: "Filing early with incomplete information is fine - they actually prefer it. Waiting feels safer but it burns through our window while we're still in the dark.",
            time: "05:48",
          },
          {
            sender: "Rachel Winters - General Counsel",
            text: "What do you want to do - file something now or wait until we know more?",
            time: "05:49",
          },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CLO", "CEO"],
      expectedKeywords: [
        "ICO",
        "72 hours",
        "the 72-hour notification rule",
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
            "File now, even with gaps. the data protection regulator prefers to hear early with incomplete information rather than late with the full picture.",
          consequence:
            "ICO acknowledge within 2 hours and assign a case officer. The notification is on-time. The ICO final report notes 'prompt and transparent engagement'.",
          rank: 1,
          recapFragment: "filing early with incomplete information and updating as we learned more",
        },
        {
          key: "B",
          label:
            "Wait until scope is confirmed - filing a premature notification risks errors that will need correcting",
          consequence:
            "Scope confirmed at Day 3. ICO notification filed at hour 62. Technically within 72 hours. The ICO asks why it took so long. The delay features in their enforcement assessment.",
          rank: 3,
          recapFragment: "waiting for complete information before filing the data breach notification",
        },
        {
          key: "C",
          label:
            "Take external legal counsel opinion on when the 72-hour clock started before filing anything",
          consequence:
            "Counsel respond in 4 hours. Opinion: clock started at 05:30. Notification filed at hour 5. Defensible but the DPO's advice was correct and immediately available.",
          rank: 2,
          recapFragment: "taking legal advice before filing the data breach notification",
        },
        {
          key: "D",
          label:
            "File through the energy regulator and ask them to pass it on. one call, two boxes ticked.",
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
      title: "06:15 - Seal It or Let It Run",
      body: "06:15. You've been on calls for 45 minutes. The CISO rings again. She has four options and needs your authority on one of them in the next five minutes.",
      facilitatorNotes:
        "The CEO, CFO, and COO own this. The CISO is presenting options, not making the call. Ask the room: what does 'the lights are still on' actually protect you from? It means this is a systems crisis, not a power outage - a lower threshold for regulators and politicians. Aggressive containment (A) costs money but gives certainty. Selective containment (B) feels cheaper but gives the attacker more time. Ask the CFO: have you modelled a day of manual trading?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "BREAKING: Major UK energy retailer reportedly hit by overnight cyber incident - supply unaffected",
      artifact: {
        type: "email",
        emailFrom: "s.khatun@veridianpower.co.uk",
        emailTo: "crisis-leadership@veridianpower.co.uk",
        emailSubject: "URGENT - Containment authority needed - 5 min window",
        emailBody:
          "The attacker's encryption has already hit the back office - 217 servers. Customer-facing systems are still up. Power is unaffected. We need to decide what happens to the rest of the estate right now.\n\nOption A - Hard lockdown. All back-office systems offline, trading desk on manual fallback. Spread stops. Estimated £1.8M in suboptimal trading positions.\n\nOption B - Selective containment. Protect billing and the PSR master database. Let trading continue on the affected infrastructure. Cheaper, but if the attacker is still moving they get another route in.\n\nOption C - Full shutdown. Everything dark, including customer-facing systems. Effective, but 740,000 customers will see an error page.\n\nOption D - Hold. Wait for Mandiant to finish their sweep before we move anything. Risk: every minute of inaction is another minute if they are still active inside.\n\nI need your call. What do you authorise?\n\n- Sarah",
      },
      isDecisionPoint: true,
      branches: [
        { optionKey: "B", nextInjectId: "rwg-containment-consequence" },
        { optionKey: "C", nextInjectId: "rwg-containment-consequence" },
        { optionKey: "D", nextInjectId: "rwg-containment-consequence" },
      ],
      targetRoles: ["CEO", "CFO", "COO"],
      expectedKeywords: [
        "containment",
        "manual trading",
        "PSR",
        "lights on",
        "cost",
        "authority",
        "the government's emergency response committee",
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
            "Selective containment: protect the vulnerable customers database and billing, let trading run on the affected systems. stop the spread where it matters most.",
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
      id: "rwg-chair",
      commandTier: "STRATEGIC",
      order: 40,
      scenarioDay: 1,
      scenarioTime: "07:15",
      title: "07:15 - The Chairman",
      tierSkipSummary:
        "The Chairman called at 07:15 having been tipped off by the company secretary. The CEO called back and briefed him with what was known at that point.",
      body: "07:15. A missed call on your phone.\n\nSir David Ashworth. Non-Executive Chairman. He's left a voicemail.",
      facilitatorNotes:
        "The Chairman calling at 07:15 before the CEO has had time to prepare is a governance test, not a media one. The right answer is A - call back now with an honest incomplete picture. Chairmen of listed companies are adults who can handle 'we don't know everything yet.' What they cannot handle is finding out from the BBC. Option C is the most common trap: teams want to wait until they have more to say. By 08:42, the BBC is already running the story and he's seen it. Ask: at what point does the Chairman hearing this from someone else become unrecoverable?",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "Veridian Power - no pre-market disclosure - board status unknown",
      artifact: {
        type: "voicemail",
        voicemailCaller: "Sir David Ashworth - Non-Executive Chairman",
        voicemailCallerNumber: "+44 7700 900041",
        voicemailDuration: "0:52",
        voicemailTime: "07:13",
        voicemailTranscript:
          "Robert. It's David Ashworth. It's just after quarter past seven. The company secretary has left me a message - something about a significant systems failure overnight. I understand you're in the middle of something serious. I have one question: do you want me to hear about this from you, or am I going to read about it in the Financial Times? Call me when you can. I can wait if you're busy. But please don't make me wait too long.",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO"],
      expectedKeywords: [
        "chairman",
        "brief",
        "call back",
        "board",
        "company secretary",
        "honest",
      ],
      recapLine: "handled the Chairman's call by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Call back now - give him what you know, incomplete as it is. He needs to hear it from you first.",
          consequence:
            "The Chairman appreciates the direct call. He has an incomplete picture but he's with you. Later he tells the board: 'The CEO called me at seven-fifteen. We were in this together from the start.' That sentence is worth more than any single decision you'll make today.",
          rank: 1,
          recapFragment:
            "calling the Chairman back immediately with an honest incomplete picture",
        },
        {
          key: "B",
          label:
            "Ask the company secretary to brief him - she has the facts, and you need your bandwidth for the crisis.",
          consequence:
            "The company secretary briefs him at 07:45. Accurate, professional, second-hand. The Chairman later notes in his board review that he'd have preferred to hear directly from the CEO in those first hours.",
          rank: 2,
          recapFragment: "routing the Chairman's brief through the company secretary",
        },
        {
          key: "C",
          label:
            "Wait until 09:00 when you have a clearer picture - it's better to say something meaningful than something incomplete.",
          consequence:
            "At 08:42 the BBC runs 'Veridian Power hit by ransomware attack.' The Chairman sees it. He calls the CEO before the CEO calls him. The dynamic has shifted and it will not shift back.",
          rank: 3,
          recapFragment: "waiting until 09:00 for a clearer picture before calling",
        },
        {
          key: "D",
          label:
            "Post a brief written note to the board portal - it creates a record and keeps him informed without using your time.",
          consequence:
            "The Chairman reads the note and calls anyway. He does not understand why the CEO chose to write rather than call. The note is accurate. The relationship is slightly cooler.",
          rank: 4,
          recapFragment: "posting a written note to the board portal instead of calling",
        },
      ],
    },
    {
      id: "rwg-beazley-early",
      commandTier: "STRATEGIC",
      order: 50,
      scenarioDay: 1,
      scenarioTime: "08:20",
      title: "08:20 - The Insurer Calls First",
      tierSkipSummary:
        "Beazley made first contact at 08:20 via voicemail, alerting Veridian to the policy notification obligation. The CLO was briefed and the insurer was called back with a carefully managed initial response.",
      body: "08:20. Your insurer is calling before your PR team has finished their first coffee.\n\nBeazley. Cyber claims. They've been alerted by their threat intelligence feed. They know.",
      facilitatorNotes:
        "This inject tests whether the team understands the difference between notifying an insurer and telling them everything. Option B (confirm incident, nothing more, CLO in loop) and Option C (CLO handles entirely) are equally valid rank-1 answers - the critical thing is keeping legal counsel in the notification chain before anything substantive is said. Option A sounds cooperative but creates an information record before scope is confirmed. Option D risks a policy notification breach - Beazley's voicemail is explicit about the prompt notification obligation. Ask the CLO: what does your policy actually require at this stage?",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "Veridian Power - pre-market quiet - insurer monitoring services on alert",
      artifact: {
        type: "voicemail",
        voicemailCaller: "James Hartwell - Head of Cyber Claims, Beazley",
        voicemailCallerNumber: "+44 20 7667 0623",
        voicemailDuration: "1:18",
        voicemailTime: "08:19",
        voicemailTranscript:
          "Good morning, this message is for Mr Kaye or whoever is managing Veridian Power's crisis response this morning. My name is James Hartwell. I head cyber claims at Beazley. We've been alerted overnight through our threat intelligence feed that Veridian may be experiencing a significant ransomware incident. Your policy carries a prompt notification obligation - the sooner you're in contact with us, the better, both for your coverage position and because we have resources that can help. We have a standing Mandiant relationship and an active incident response team. I want to be direct: early engagement is in your interest here. This is not a call you want to return tomorrow morning. Please call me back as soon as you're able. Thank you.",
      },
      isDecisionPoint: true,
      targetRoles: ["CLO", "CFO", "CEO"],
      expectedKeywords: [
        "insurer",
        "CLO",
        "notification",
        "disclose",
        "policy",
        "Beazley",
        "scope",
      ],
      recapLine: "responded to Beazley's first call by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Call back with full transparency - tell them everything you know so far. Early disclosure is always better.",
          consequence:
            "Beazley log a comprehensive first-notification record. But you've said things before the CLO has reviewed the policy terms. Three weeks later, several of those statements become relevant to the coverage dispute in ways you didn't anticipate.",
          rank: 2,
          recapFragment: "calling back with full early disclosure before legal review",
        },
        {
          key: "B",
          label:
            "Call back promptly - confirm an incident has occurred and that you'll provide a fuller notification within the hour once your CLO has reviewed the policy terms.",
          consequence:
            "Hartwell accepts this readily. He's heard it many times. Beazley's record shows a prompt initial notification and a CLO-reviewed follow-up. The notification obligation is met. The coverage conversation starts on a professional footing.",
          rank: 1,
          recapFragment: "confirming the incident and nothing more pending the CLO's review",
        },
        {
          key: "C",
          label:
            "Ask the CLO to handle the insurer call entirely - this is a legal and contractual conversation, not an executive one.",
          consequence:
            "CLO calls Hartwell at 08:45. The conversation is precise and well-managed. Beazley's file notes a professional initial response. The CLO briefs the CEO at 09:00.",
          rank: 1,
          recapFragment: "routing the insurer call through the CLO",
        },
        {
          key: "D",
          label:
            "Don't respond yet - you don't have enough scope clarity to file a proper notification. Better to wait and get it right.",
          consequence:
            "By 09:30, Beazley has left a second voicemail. Their claims team notes a delayed response to a prompt notification obligation. When the coverage dispute arises three weeks later, this delay features in their assessment.",
          rank: 4,
          recapFragment: "not responding to Beazley until scope was clearer",
        },
      ],
    },
    {
      id: "rwg-staff",
      commandTier: "STRATEGIC",
      order: 55,
      scenarioDay: 1,
      scenarioTime: "08:47",
      title: "08:47 - What Your Staff Can See",
      tierSkipSummary:
        "By 08:47 staff had arrived to find all systems dark and no communication from leadership. The #general Slack channel filled with confusion and the BBC story appeared in-thread before the company had said anything publicly.",
      body: "08:47. Three thousand two hundred staff arrived this morning to find their computers dead and their email offline.\n\nNobody has told them anything. This is what they can see instead.",
      facilitatorNotes:
        "No formal vote on this inject. Let it sit in the room for a moment.\n\nThe PHANTOMCOIL_README.txt appearing on individual desktops is a classic ransomware technique - staff have found the ransom note before the CEO has told them anything. The BBC story landing in the Slack thread before any internal communication is the direct consequence of the silence in the last two hours.\n\nAsk the room: what would you have wanted your call centre agents to see instead of this? What does a good version of this same 30 minutes look like - and what decision earlier this morning would have made it possible?",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "#VeridianDown - staff reporting system outages - company silent - BBC inquiry filed",
      artifact: {
        type: "slack_thread",
        slackChannel: "#general",
        slackMessages: [
          {
            author: "Helen Marsh",
            role: "Head of Payments Operations",
            time: "08:31",
            text: "IT - systems are completely dark. Can't log into anything. What's happening?",
          },
          {
            author: "IT Status Bot",
            role: "Automated",
            time: "08:32",
            text: "We are aware of a technical issue affecting some systems. Please avoid restarting your devices. Our team is working to resolve this.",
          },
          {
            author: "Marcus Webb",
            role: "Customer Services",
            time: "08:34",
            text: "Call centre customer system is down. I have 800 customers on hold and nothing to log them on. Someone needs to tell us something we can actually say to them.",
          },
          {
            author: "Priya Shah",
            role: "Trading Analyst",
            time: "08:38",
            text: "Trading book reconciliation system not responding. Running on spreadsheets. Our counterparties are asking questions about today's positions and I have nothing to tell them.",
          },
          {
            author: "Tom Burridge",
            role: "Finance Director",
            time: "08:41",
            text: "Colleagues - I have a file on my desktop called PHANTOMCOIL_README.txt. I have not opened it. IT - do you know about this?",
          },
          {
            author: "Rachel Okafor",
            role: "Senior Analyst",
            time: "08:44",
            text: "BBC are running a story. 'Major UK energy firm hit by ransomware attack overnight.' They've named us. Is this true? Is anyone going to say something?",
          },
          {
            author: "Marcus Webb",
            role: "Customer Services",
            time: "08:46",
            text: "My agents are being asked about this by customers calling in. They have seen the BBC story on their phones. My team are holding the line but they cannot hold it much longer without something to say.",
          },
        ],
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CCO", "COO", "CEO"],
      expectedKeywords: [
        "staff",
        "call centre",
        "agents",
        "script",
        "CRM",
        "BBC",
        "internal comms",
      ],
    },
    {
      id: "rwg-i3d",
      commandTier: "STRATEGIC",
      order: 60,
      scenarioDay: 1,
      scenarioTime: "09:00",
      title: "09:00 - The Times",
      body: "09:00. Your head of communications has just forwarded this to the leadership group.",
      facilitatorNotes:
        "Brief order is a values question. There is no right answer here - only an honest one. Push the CCO: if you pick staff first, what does the briefing actually say? Can you give 3,200 people enough to handle customer calls without creating a new information asymmetry problem?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "The Times says it will publish: 'UK energy retailer faces ransomware demand or PSR leak'",
      artifact: {
        type: "email",
        emailFrom: "n.curtis@thetimes.co.uk",
        emailTo: "press@veridianpower.co.uk",
        emailSubject: "Veridian Power - request for comment - filing 10:30",
        emailOrgName: "The Times",
        emailSalutation: "To the Veridian Power press office,",
        emailBody:
          "My name is Nick Curtis. I'm the energy correspondent at The Times.\n\nI'm writing about a cyber incident at Veridian Power. I have confirmed the following independently: the time of the system outage last night, the size of the ransom demand, and that your Priority Services Register is involved.\n\nI would like to offer Veridian the opportunity to comment before publication. I am filing at 10:30 this morning.\n\nIf you'd like to speak on the record, please call me directly. I can also take a written statement via this address.",
        emailSignOff: "Nick Curtis\nEnergy Correspondent\nThe Times",
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
            "Customers first. statement on the website and a direct message to the 84,000 vulnerable customers confirming their power supply is unaffected.",
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
      id: "rwg-stock",
      commandTier: "STRATEGIC",
      order: 70,
      scenarioDay: 1,
      scenarioTime: "09:12",
      title: "09:12 - The Share Price",
      body: "09:12. The markets have been open for seventy-two minutes.\n\nYour share price has dropped 12.7%. Volume is seven times the daily average. Someone in the market knew last night.\n\nThe financial regulator has called the company secretary. Your broker is on the phone to the CFO. You have about twenty minutes before the regulator stops waiting for you to act and starts acting themselves.\n\nListed companies are required to tell the market when something material has happened. The question is what you say and when.",
      facilitatorNotes:
        "A ransomware attack on a listed company is almost certainly information the market needs to know - the regulator takes this seriously and moves quickly. Options A and B are both defensible. The key distinction is whether to request suspension while you prepare a fuller statement. Option D - waiting while the stock falls on heavy volume - is the most dangerous; it looks like the company knew and chose not to say.",
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
            "Issue an official market announcement immediately with the known facts, and request voluntary trading suspension while preparing a fuller statement.",
          consequence:
            "Trading suspended at 09:24. market announcement issued at 09:31. The FCA acknowledge the proactive posture. VRD.L finds a floor at 1,590p and stabilises.",
          rank: 1,
          recapFragment: "an immediate market announcement and voluntary trading suspension",
        },
        {
          key: "B",
          label:
            "Issue an official market announcement immediately, no suspension. let the market price the risk openly.",
          consequence:
            "market announcement out at 09:22. VRD.L drops another 4.1% in the hour after the statement. No regulatory concern raised. Stock finds a floor by midday.",
          rank: 1,
          recapFragment: "an immediate market announcement without requesting suspension",
        },
        {
          key: "C",
          label:
            "Request voluntary trading suspension while we prepare a fuller announcement. nothing public until we have a clearer picture.",
          consequence:
            "Suspension granted at 09:21. Fuller announcement at 11:00. Some investors frustrated by the 2-hour blackout. The FCA note the suspension was appropriate.",
          rank: 2,
          recapFragment: "suspending trading while preparing a fuller disclosure",
        },
        {
          key: "D",
          label:
            "Hold any public announcement. premature disclosure will crystallise panic before we understand the full picture.",
          consequence:
            "VRD.L falls 19.3% by close. The FCA issue a formal query at 11:00. Two institutional shareholders file complaints.",
          rank: 4,
          recapFragment: "holding the RNS while the stock fell",
        },
      ],
    },
    {
      id: "rwg-i4",
      commandTier: "STRATEGIC",
      order: 80,
      scenarioDay: 1,
      scenarioTime: "14:30",
      title: "14:30 - The Demand",
      body: "YOUR NETWORK HAS BEEN COMPROMISED BY ALPHV.\n\nWe have been inside your systems for six days. We hold your customer billing records, your wholesale trading book, your payroll system, and a complete copy of your Priority Services Register - 84,247 people, with their medical conditions, home addresses, and emergency contacts.\n\nDemand: $9.4 million US dollars in Bitcoin.\nDeadline: 48 hours.\nWallet: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh\n\nFailure to pay will result in the full Priority Services Register being published. The sample you have already seen is a courtesy.\n\nDo not contact law enforcement. Do not attempt further restoration. We are watching.",
      facilitatorNotes:
        "The executives own this call. Option A (refuse) is the strongest answer for reasons the CISO has outlined: restoration is possible without payment, and paying is no guarantee of deletion.\n\nThe sanctions question: HM Treasury maintains a list of sanctioned individuals and organisations. Paying a group on that list - even unknowingly - can carry serious legal consequences. The CLO should be asking whether ALPHV is currently sanctioned before any payment conversation goes further. This is a live question, not a theoretical one.\n\nAsk the room: if you pay and ALPHV publish the PSR anyway - which happens in roughly half of cases - what do you tell Margaret Thornton? What do you tell the regulator? The ransom payment decision isn't just financial. It's about what you can honestly say you did to protect 84,247 people.\n\nAsk the CFO: have you modelled the cost of restoration without payment versus the cost of the ransom plus the reputational and regulatory exposure of having paid?",
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
      branches: [
        { optionKey: "A", nextInjectId: "rwg-refuse-night", trackLabel: "You refused to pay. The restoration clock is running." },
        { optionKey: "D", nextInjectId: "rwg-pay-confirm", trackLabel: "The payment has been authorised." },
      ],
      targetRoles: ["CEO", "CFO", "CLO", "COO"],
      expectedKeywords: [
        "ALPHV",
        "PSR",
        "Beazley",
        "OFSI",
        "refuse",
        "stall",
        "negotiate",
        "sanctions list",
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
            "Negotiate in good faith. bring in specialist ransomware negotiators, target a significant reduction, keep the option to walk away.",
          consequence:
            "Specialist negotiators engaged. ALPHV accept engagement and counter at $7.8M. The UK sanctions risk is being assessed in parallel by external counsel by external counsel.",
          rank: 3,
          recapFragment: "bringing in specialist ransomware negotiators",
        },
        {
          key: "D",
          label:
            "Pay in full immediately. end the clock, protect the 84,000 people whose data is at risk.",
          consequence:
            "Beazley refuse to authorise without OFSI clearance. The CFO bridges from corporate cash. Keys work on 62% of files. The PSR mirrors to a fourth site within the hour.",
          rank: 4,
          recapFragment: "immediate payment in full",
        },
      ],
    },
    {
      id: "rwg-i4a",
      commandTier: "STRATEGIC",
      order: 85,
      scenarioDay: 1,
      scenarioTime: "15:19",
      title: "15:19 - They've Put Her Name Online",
      body: "15:19. They've stopped waiting.\n\nALPHV have posted a preview on their leak site. Five names from the Priority Services Register, with full details, visible to anyone who looks.\n\nThe first name is Margaret Elaine Thornton. She's 77. She lives in Carlisle. She depends on a home oxygen concentrator. Her emergency contact is her daughter Sandra.\n\nShe does not know this yet.",
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
        darkWebPrice: "18 Monero (~£120,000) or included in the $9.4M settlement",
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
      decisionOptions: [],
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
    },
    {
      id: "rwg-i4x",
      commandTier: "STRATEGIC",
      order: 90,
      scenarioDay: 1,
      scenarioTime: "15:24",
      title: "15:24 - Do I Go?",
      body: "15:24. Your head of customer operations has been ready and waiting for twenty minutes. She has a plan, a team, and a script. She needs one thing from you.",
      facilitatorNotes:
        "The Gold team authorises; the technical team executes.\n\nOption A (immediate Cat 1) is the morally and reputationally right answer. No reasonable journalist writes critically about a company proactively calling oxygen-dependent patients. The Mandiant concern about media timing is secondary.\n\nOption D (delay 24 hours) looks safe in the room and is the most regrettable in retrospect.\n\nAsk the CEO: if you wait 24 hours and Margaret Thornton reads it in the paper, what do you say to her daughter on the phone?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "Veridian Power: 84,247 Priority Services Register customers' data 'may have been accessed'",
      artifact: {
        type: "email",
        emailFrom: "t.osei@veridianpower.co.uk",
        emailTo: "crisis-leadership@veridianpower.co.uk",
        emailSubject: "PSR outreach - ready - awaiting your go",
        emailBody:
          "We are ready to begin.\n\n84,247 people on the Priority Services Register. 4,218 are Category 1 - medically dependent. Home oxygen, dialysis, powered wheelchairs, insulin refrigeration.\n\nAt full capacity: all Category 1 customers reached within two hours of your authority. Full list within twelve hours with agency support.\n\nOne flag. Your insurer has asked us to wait - they're concerned that a call programme at this scale effectively confirms the breach publicly before communications has the message locked. They want more time.\n\nSeparate note: the depot manager in Carlisle called Margaret Thornton personally twenty minutes ago. She knew her from a service visit.\n\nThat's one. 84,246 are waiting.\n\nDo I go?\n\n- Taiwo Osei, Head of Customer Operations",
      },
      isDecisionPoint: true,
      branches: [
        { optionKey: "C", nextInjectId: "rwg-margaret" },
        { optionKey: "D", nextInjectId: "rwg-margaret" },
      ],
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
            "Brief the local electricity network engineers first so they are on standby. then begin calls once support is ready.",
          consequence:
            "Local network operators briefed by 16:00. Engineers on standby across five regions. Outreach begins at 17:30 with support infrastructure in place. Three customers needed a welfare visit.",
          rank: 2,
          recapFragment: "briefing local network operators before starting customer calls",
        },
        {
          key: "C",
          label:
            "Send a direct message to all 84,247 affected customers tonight alongside a press statement. full transparency at scale.",
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
      id: "rwg-i4v",
      commandTier: "STRATEGIC",
      order: 95,
      scenarioDay: 1,
      scenarioTime: "15:42",
      title: "15:42 - The Chat Window",
      body: "15:42. The window is open. ALPHV have someone on the other end.\n\nBefore anyone types, your CISO has sent one message: 'I need the mandate from you. Ceiling, floor, and what happens if they threaten to release Margaret Thornton's data tonight unless we pay by midnight. I need your answer now, not after we've started.'",
      facilitatorNotes:
        "The technical team makes the operational keyboard decision. The Gold team's decision is the mandate - the parameters within which the negotiation is authorised to proceed.\n\nAsk each executive: what is your hard limit? What happens if ALPHV threaten to release Margaret Thornton's data in the next 24 hours unless they receive $1M by tonight?\n\nThe most useful debrief moment is when the team realises they have to answer that question out loud.",
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
        "OFSI",
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
            "Mandiant flag the OFSI risk on any payment without weekly UK sanctions consolidated list clearance. An open mandate without parameters creates liability. The CLO is visibly uncomfortable.",
          rank: 3,
          recapFragment: "an open mandate up to $6.2M",
        },
        {
          key: "D",
          label:
            "No mandate. close the negotiation window, accept the risk that the data will be published, focus entirely on restoring systems.",
          consequence:
            "Brave. The window closes. The PSR will publish in 24 hours. Mandiant's tone shifts: 'We need the Carlisle customer on the phone this afternoon.'",
          rank: 4,
          recapFragment: "refusing the chat - no mandate to negotiate",
        },
      ],
    },
    {
      id: "rwg-ofgem-vm",
      commandTier: "STRATEGIC",
      order: 100,
      scenarioDay: 1,
      scenarioTime: "17:00",
      title: "17:00 - The Regulator Calls",
      tierSkipSummary:
        "At 17:00, Ofgem's Energy Security Director called personally before taking any formal steps. The team agreed a coordinated response and called back within the evening.",
      body: "17:00. The energy regulator has called. Not a formal letter - a personal voicemail from the Energy Security Director.\n\nShe's offering you the chance to speak to her before she takes any formal steps.",
      facilitatorNotes:
        "Ofgem's Catherine Marsh is calling because this is what regulators do when they're giving you a chance - a personal call before the formal process starts. This is cooperative posture from them. The right call here is A or B: call back promptly and proactively, with or without the CLO on the line.\n\nOption C (written holding statement) is bureaucratic when the regulator has specifically extended a human hand. Option D (wait until morning) burns the cooperative window Marsh is offering. By morning she'll have filed the formal request and the tone will have changed.\n\nAsk the CLO: what does Ofgem's first contact tell you about how they're treating this? What does it signal to them if you don't call back today?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "Energy regulator monitoring Veridian Power incident - sector watching",
      artifact: {
        type: "voicemail",
        voicemailCaller: "Catherine Marsh - Energy Security Director, Ofgem",
        voicemailCallerNumber: "+44 20 7901 7000",
        voicemailDuration: "1:24",
        voicemailTime: "16:58",
        voicemailTranscript:
          "Good afternoon. I'm calling for Robert Kaye or whoever is handling communications from Veridian Power's leadership team today. My name is Catherine Marsh, I'm the Energy Security Director at Ofgem. We've been monitoring developments through public reporting and through our own sector intelligence. Given Veridian's designation as an Operator of Essential Services, we have a supervisory interest in this matter. I want to be clear that this is not a formal enforcement call - I'm calling personally because I would like to hear from your team directly before we take any formal steps. I understand today has been extremely difficult. I'm available this evening until nine o'clock and from eight tomorrow morning. I would strongly encourage you to call me back. This is the kind of thing that's better to talk about before it becomes a formal process.",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO"],
      expectedKeywords: [
        "Ofgem",
        "regulator",
        "call back",
        "Catherine Marsh",
        "cooperative",
        "formal",
        "CLO",
      ],
      recapLine: "responded to Ofgem's first contact by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Call Marsh back tonight, now - this is a cooperative hand being extended and you take it directly.",
          consequence:
            "Marsh takes the call at 17:20. The conversation is twenty minutes. She notes internally: 'CEO engaged directly, candid about scope, no defensiveness.' That note shapes every subsequent interaction. The formal request that arrives two days later uses different language than it would have.",
          rank: 1,
          recapFragment:
            "calling Ofgem's Energy Security Director back the same evening",
        },
        {
          key: "B",
          label:
            "Brief the CLO, then call back within the hour - this is a regulatory conversation and counsel should be on the line.",
          consequence:
            "CLO briefed at 17:10. Both on the call to Marsh at 17:35. The conversation is slightly more formal but equally well-received. Marsh notes the CLO's presence as a sign the company is taking this seriously.",
          rank: 1,
          recapFragment: "briefing the CLO and calling Ofgem back within the hour",
        },
        {
          key: "C",
          label:
            "Send a written holding statement tonight - confirm you're aware of the supervisory interest and will engage in the morning.",
          consequence:
            "The statement is received at 18:10. Marsh reads it and files it. She does not follow up personally. The formal process begins as scheduled. The cooperative window she offered has closed.",
          rank: 2,
          recapFragment:
            "sending a written holding statement rather than calling back",
        },
        {
          key: "D",
          label:
            "Wait until morning - you've had an extraordinarily difficult day and a considered response is better than a rushed one.",
          consequence:
            "By 09:00 the next morning, Ofgem's formal information request has been filed. The personal voicemail from Catherine Marsh was the cooperative approach. The letter is the formal one. The tone has changed.",
          rank: 3,
          recapFragment: "waiting until morning to respond to Ofgem",
        },
      ],
    },
    {
      id: "rwg-tv",
      commandTier: "STRATEGIC",
      order: 105,
      scenarioDay: 1,
      scenarioTime: "19:00",
      title: "19:00 - The Evening News",
      tierSkipSummary:
        "ITV ran the story as their second item at 19:00. The CEO issued a written statement. The decision on a live media appearance was made during the broadcast window.",
      body: "19:00. You've been dealing with this for thirteen and a half hours.\n\nITV News are running it as their second item. Not a brief mention - the second item. Two minutes of airtime, a reporter outside your Canary Wharf offices, and a lower-third that reads: RANSOMWARE ATTACK EXPOSES MEDICAL DATA OF 84,000 VULNERABLE ENERGY CUSTOMERS.\n\nThey've asked for an interview. They want the CEO.",
      facilitatorNotes:
        "The evening news is the moment a corporate crisis becomes a public one in the eyes of people who weren't previously paying attention. 13.5 hours into the incident, the company still has no CEO on camera.\n\nOption A (CEO live interview) is the strongest signal - it puts the top of the house on camera, demonstrates accountability, and is harder for journalists to sustain a 'company refuses to comment' narrative around. The risk is that the CEO must say something meaningful, not just 'we're sorry and working on it.'\n\nAsk the CCO: what does a good CEO interview look like at 19:00 when the systems aren't back up? It's not an apology for the system. It's an account of what the company is doing for the 84,000 people on that list.\n\nOption D (no comment) has already been tried for 13 hours. Ask the room: how has that worked?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "ITV NEWS - Ransomware attack exposes medical data of 84,000 Veridian Power customers - CEO interview requested",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "ITV NEWS AT TEN",
        tvHeadline:
          "RANSOMWARE ATTACK EXPOSES MEDICAL DATA OF 84,000 VULNERABLE ENERGY CUSTOMERS",
        tvTicker:
          "ITV NEWS - Veridian Power systems encrypted overnight - 84,000 Priority Services Register customers at risk - criminal group ALPHV claims responsibility - CEO has not made public statement - Home Secretary 'extremely concerned'",
        tvReporter: "Sarah Benson, ITV News, Canary Wharf",
      },
      isDecisionPoint: true,
      branches: [
        { optionKey: "A", nextInjectId: "rwg-d2-brief-strong", trackLabel: "The CEO went on camera. The morning is different." },
        { optionKey: "B", nextInjectId: "rwg-d2-brief-silent", trackLabel: "No CEO on camera. The papers notice." },
        { optionKey: "C", nextInjectId: "rwg-d2-brief-silent", trackLabel: "No CEO on camera. The papers notice." },
        { optionKey: "D", nextInjectId: "rwg-d2-brief-silent", trackLabel: "No CEO on camera. The papers notice." },
      ],
      targetRoles: ["CCO", "CEO"],
      expectedKeywords: [
        "CEO",
        "interview",
        "ITV",
        "statement",
        "accountability",
        "evening news",
        "camera",
      ],
      recapLine: "responded to the ITV news request by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "CEO does a live interview - 'we owe our customers an explanation and I'm going to give one.'",
          consequence:
            "Four-minute interview. No system ETA. The CEO says what is true: the company caused this through inadequate vendor oversight, 84,000 people are on a list they should never have been on, and every resource is on it. The clip is broadly well-received. The morning coverage is softer than the evening.",
          rank: 1,
          recapFragment: "the CEO giving a live ITV interview",
        },
        {
          key: "B",
          label:
            "Issue a detailed written statement to ITV - thorough, accurate, no interview.",
          consequence:
            "ITV use two sentences from the statement and note three times during the broadcast that 'Veridian Power's CEO was not available for interview.' The written statement is the footnote. The declined interview is the headline.",
          rank: 2,
          recapFragment:
            "issuing a written statement without providing an ITV interviewee",
        },
        {
          key: "C",
          label:
            "The CCO does the interview - save the CEO for the board and the regulator tomorrow.",
          consequence:
            "The CCO performs well and delivers clear messaging. ITV note the CEO did not appear. The following morning's coverage includes: 'Chief Executive Robert Kaye was not available for interview during the crisis.' The board raises it.",
          rank: 3,
          recapFragment: "the CCO doing the ITV interview in place of the CEO",
        },
        {
          key: "D",
          label:
            "Decline all media contact until the incident is resolved - the company isn't ready to speak.",
          consequence:
            "Thirteen and a half hours of no CEO on camera becomes a second story running parallel to the original. 'Veridian refuses to comment' becomes a recurring phrase in every bulletin through the night.",
          rank: 4,
          recapFragment: "declining the ITV interview and all media contact",
        },
      ],
    },
    {
      id: "rwg-d2-brief",
      commandTier: "STRATEGIC",
      order: 150,
      scenarioDay: 2,
      scenarioTime: "07:30",
      title: "Day 2, 07:30 - The Overnight Numbers",
      tierSkipSummary:
        "Day 2 opened with systems at 42% restoration and 31,000 of 84,247 PSR customers contacted. The share price opened for a second day. The trading desk remained on the manual fallback book.",
      body: "Day 2, 07:30. The first full night of the crisis is over.\n\nYour COO has sent the overnight brief. Systems restoration: 42%. PSR outreach: 31,000 of 84,247 customers contacted, with eleven welfare visits completed overnight by local engineers. VRD.L opens in thirty minutes.\n\nThe trading desk is still on the manual fallback book. The call centre handled 22,000 inbound calls yesterday and is currently at double normal volume. The #general Slack thread has 847 messages since yesterday morning.\n\nThis is where you are.",
      facilitatorNotes:
        "No decision vote on this inject. It reorients the room at the start of Day 2 with a concrete operational picture. Let the numbers land: 42% restoration means 58% of the estate is still encrypted. 31,000 calls means 53,000 people haven't been reached yet. Eleven welfare visits overnight means eleven real people in real need who got a door knocked on.\n\nAsk the room: which of these numbers concerns you most? The trading exposure? The PSR gap? The share price? The answer tells you something about each role's natural instinct.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Veridian Power Day 2 - markets open at 08:00 - restoration at 42% - PSR outreach ongoing",
      artifact: {
        type: "internal_memo",
        memoTitle: "Day 2 Overnight Situation Report - 07:30",
        memoClassification: "RESTRICTED - CRISIS LEADERSHIP TEAM ONLY",
        memoFrom: "L. Brennan, Chief Operating Officer",
        memoTo: "Executive Crisis Team",
        memoDate: "Tuesday 15 April 2026, 07:30",
        memoRef: "VRD-OPS-2026-D2-001",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CFO", "COO", "CCO"],
      expectedKeywords: [
        "restoration",
        "PSR",
        "share price",
        "call centre",
        "trading",
        "42%",
      ],
    },
    {
      id: "rwg-d2-remediation",
      commandTier: "STRATEGIC",
      order: 160,
      scenarioDay: 2,
      scenarioTime: "11:00",
      title: "Day 2, 11:00 - What Do We Owe Them?",
      tierSkipSummary:
        "On Day 2 the team agreed a customer remediation approach for the 84,247 people on the Priority Services Register. The decision was a proactive financial gesture rather than a complaint-led model.",
      body: "Day 2, 11:00. The CCO has called a short session. There's a question that's been sitting unanswered since yesterday afternoon, and it can't wait any longer.\n\nWhat do Veridian Power owe the 84,247 people whose data was taken?",
      facilitatorNotes:
        "This is the Consumer Duty decision in its clearest form. Ofgem's Consumer Duty obligations under the Energy Supply Licence are explicit: companies must act in the genuine financial interest of affected customers. A complaint-led model - generous to those who complain but passive to those who don't - is the minimum legal position and is likely to be challenged by Ofgem.\n\nOption A (proactive £50 credit) is bold, operationally complex, and sends the clearest possible signal. It costs roughly £4.2M if fully paid. Option B (three months free) is creative and delivers real value but doesn't address customers who have already incurred costs from the breach. Option C is the minimum legal position. Option D is almost certainly inadequate under Consumer Duty.\n\nAsk the CFO: what is the cost of each option? Ask the CLO: what do Ofgem's enforcement cases on Consumer Duty say about passive remediation models?",
      delayMinutes: 0,
      timerMinutes: 12,
      tickerHeadline:
        "Veridian Power - customer groups call for compensation - Ofgem monitoring situation",
      artifact: {
        type: "email",
        emailFrom: "c.okafor@veridianpower.co.uk",
        emailTo: "crisis-leadership@veridianpower.co.uk",
        emailSubject: "Customer remediation - four options - decision needed by 14:00",
        emailBody:
          "We are thirty hours into the incident. 31,000 of 84,247 PSR customers have been reached. The question of what we owe them - beyond a phone call - needs to be answered today before we fall further behind the media narrative.\n\nFour options.\n\nOption A - Proactive £50 credit to all 84,247 affected PSR customers, automatic, no claim required. Clearest Consumer Duty signal available. Cost: approximately £4.2M.\n\nOption B - Three months' free energy supply for all PSR customers on our network. Broader reach, different message, no cash element. Cost: approximately £2.8M in foregone revenue.\n\nOption C - Complaint-led model: generous individual responses to every customer who contacts us, but no proactive outreach. This is the minimum legal position under our supply licence. Likely to be challenged by Ofgem.\n\nOption D - Formal apology from the CEO, a commitment to operational improvement, and a free annual safety check for all PSR customers. No financial element.\n\nOfgem's Consumer Duty guidance is clear: redress must be fair and proportionate to the harm. Passive models have been challenged in recent enforcement action. I need your call by 14:00.\n\n- C. Okafor, Chief Communications Officer",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CFO", "CLO", "CCO"],
      expectedKeywords: [
        "Consumer Duty",
        "Ofgem",
        "compensation",
        "proactive",
        "£50",
        "remediation",
        "complaint",
      ],
      recapLine: "decided on customer remediation by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Proactive £50 credit to all 84,247 affected customers. automatic, no claim required.",
          consequence:
            "Cost: £4.2M. Ofgem note this as a concrete demonstration of Consumer Duty in action. Media coverage the following morning shifts from 'data breach' to 'company does the right thing.' 94% of affected customers receive the credit within 72 hours.",
          rank: 1,
          recapFragment:
            "a proactive £50 credit to all 84,247 affected PSR customers",
        },
        {
          key: "B",
          label:
            "Three months' free energy for all affected vulnerable customers on our network. a goodwill gesture for the community.",
          consequence:
            "Cost: approximately £2.8M. Well-received and generates positive press. The CLO notes it does not specifically address customers who incurred charges as a direct consequence of the breach, which may not fully satisfy Consumer Duty in those individual cases.",
          rank: 2,
          recapFragment:
            "three months' free energy as a goodwill gesture for PSR customers",
        },
        {
          key: "C",
          label:
            "Complaint-led: respond generously to every customer who contacts us, but don't reach out proactively.",
          consequence:
            "Ofgem's Consumer Duty assessment notes the passive model as inconsistent with the proactive harm-prevention principle of the Energy Supply Licence. Most affected customers do not complain. They simply switch supplier. Attrition rises sharply in weeks two and three.",
          rank: 3,
          recapFragment:
            "a complaint-led compensation model with no proactive outreach",
        },
        {
          key: "D",
          label:
            "Formal apology from the CEO and a free annual safety check - no financial element.",
          consequence:
            "Ofgem's Consumer Duty review finds the response inadequate. The company is required to conduct a retrospective review of all affected customers and retrospectively pay compensation - at higher operational cost than a proactive scheme would have been. The review takes eleven months.",
          rank: 4,
          recapFragment:
            "a formal apology and safety check without financial compensation",
        },
      ],
    },
    {
      id: "rwg-d2-staff",
      commandTier: "STRATEGIC",
      order: 170,
      scenarioDay: 2,
      scenarioTime: "15:00",
      title: "Day 2, 15:00 - 3,200 People Are Waiting",
      tierSkipSummary:
        "Thirty-six hours into the incident, the CEO sent an all-company email giving staff the honest picture and telling them what to say if approached by media. The internal Slack thread quietened significantly.",
      body: "Day 2, 15:00. Thirty-six hours into the incident.\n\nYour CCO has sent you a message. She's been watching the Slack thread all day.",
      facilitatorNotes:
        "Internal communications during an external crisis is one of the most consistently neglected decisions in real incidents. The Slack thread from yesterday morning showed 3,200 people finding out from the BBC before anyone in leadership had told them anything.\n\nOption A (CEO all-company email) is the right answer: staff need to hear from the most senior person, they need to hear the facts as the company understands them, and they need to be told specifically what to do if approached by media. Option B (all-hands) is good but risky if staff ask questions the CEO isn't yet able to answer. Option C (line manager cascade) produces 200 different versions of the same message.\n\nAsk the CEO: what does your internal message actually say? What do you tell staff about the PSR data? What do you tell them about their own job security?",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "Veridian Power staff - internal communications gap - 36 hours with no CEO message",
      artifact: {
        type: "sms_thread",
        smsParticipants: ["C. Okafor - CCO", "You"],
        smsMessages: [
          {
            sender: "C. Okafor - CCO",
            text: "Robert. It's been 36 hours. Our people have had nothing from you directly. The Slack thread is at 847 messages. Three senior managers have messaged me privately asking if they should be worried about redundancies.",
            time: "14:48",
          },
          {
            sender: "C. Okafor - CCO",
            text: "A journalist from the Guardian has messaged two of our senior people directly asking for off-the-record comments about the internal situation. That means our staff are a leakage risk now.",
            time: "14:50",
          },
          {
            sender: "C. Okafor - CCO",
            text: "I have four options ready. All-company email from you now. Virtual all-hands this afternoon. Line manager cascade. Or we hold until systems are more stable. I need your call.",
            time: "14:52",
          },
        ],
      },
      isDecisionPoint: true,
      branches: [
        { optionKey: "A", nextInjectId: "rwg-d2-staff-consequence" },
        { optionKey: "B", nextInjectId: "rwg-d2-staff-consequence" },
        { optionKey: "C", nextInjectId: "rwg-d2-staff-silence" },
        { optionKey: "D", nextInjectId: "rwg-d2-staff-silence" },
      ],
      targetRoles: ["CEO", "CCO", "COO"],
      expectedKeywords: [
        "all-company",
        "email",
        "CEO",
        "staff",
        "internal",
        "honest",
        "media",
        "Slack",
      ],
      recapLine: "communicated internally by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "CEO sends an all-company email within the hour - honest, personal, and tells staff exactly what to do if approached by journalists.",
          consequence:
            "The email lands at 15:50. Staff respond positively to the directness. Several share it with family members. The Slack thread quietens significantly. The Guardian receives no off-the-record comments from Veridian staff.",
          rank: 1,
          recapFragment: "the CEO sending a direct all-company email within the hour",
        },
        {
          key: "B",
          label:
            "Call a virtual all-hands for 17:00 today - CEO leads, takes questions, treats staff as adults.",
          consequence:
            "The session is well-attended. Seven people can't join due to client commitments. A question about job security creates a difficult moment the CEO handles honestly. The session is broadly well-received but runs long.",
          rank: 2,
          recapFragment: "calling a virtual all-hands at 17:00",
        },
        {
          key: "C",
          label:
            "Ask line managers to brief their teams - consistent message, no all-hands risk.",
          consequence:
            "Fourteen line managers deliver fourteen versions of the same message. By 17:00 two members of staff believe the CEO is resigning, one believes the company is being sold. The Guardian receives an off-the-record comment at 16:30.",
          rank: 3,
          recapFragment: "a line manager cascade rather than a direct CEO message",
        },
        {
          key: "D",
          label:
            "Hold - wait until systems are more stable before making internal communications. You don't want to say something that turns out to be wrong.",
          consequence:
            "The CCO's warning about the Guardian proves accurate. A staff member speaks off the record at 16:45. Tomorrow morning's Guardian runs: 'Inside Veridian's crisis: staff left in the dark for two days.' That headline is harder to manage than the original breach story.",
          rank: 4,
          recapFragment:
            "holding all internal communications until systems were more stable",
        },
      ],
    },
    {
      id: "rwg-i5a",
      commandTier: "STRATEGIC",
      order: 200,
      scenarioDay: 3,
      scenarioTime: "09:00",
      title: "Day 3 - Three Things Before Breakfast",
      body: "Day 3, 09:00. Four hours of sleep.\n\nThe Secretary of State for Energy is live on Sky News. She's describing the Priority Services Register as 'the list of people this government exists to protect.' Parliamentary questions have been tabled.\n\nThe energy regulator has written formally - they want a full written account of the incident within fourteen days and are considering enforcement action.\n\nAnd then there's this.",
      facilitatorNotes:
        "No vote on this inject. It is a scene-setter. The three threads - insurer, politician, regulator - all run through the same fact: the penetration test finding was known and deferred. Let the room sit with that before you move to the board session. Ask: if you were called before a Select Committee tomorrow and asked 'did you know about this vulnerability before the attack', what is your honest answer?",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Energy secretary: 'deeply concerned' - parliamentary questions tabled - Ofgem signals NIS enforcement",
      artifact: {
        type: "email",
        emailFrom: "cyber.claims@beazley.com",
        emailTo: "r.kaye@veridianpower.co.uk",
        emailSubject:
          "Policy coverage query - Veridian Power - penetration test findings",
        emailOrgName: "Beazley",
        emailSalutation: "Dear Mr Kaye,",
        emailBody:
          "We are writing in connection with the cyber security incident currently affecting your operations.\n\nIn the course of our standard claims review, our team has obtained third-party intelligence indicating that a penetration test conducted approximately fourteen months ago identified a vulnerability in your remote access infrastructure. The finding was categorised as medium risk and subsequently deferred without remediation.\n\nIf this vulnerability represents the access vector exploited in the current incident, a specific policy exclusion clause - relating to known and unmitigated risks - may be engaged.\n\nWe are not at this stage making a coverage determination. We are requesting that you provide us with the penetration test report in full and any documentation relating to the remediation decision, including who was informed and by whom the deferral was authorised.\n\nPlease treat this request as urgent. Our claims team is available to speak today.",
        emailSignOff: "Yours sincerely,\n\nBeazley Cyber Claims Division",
      },
      isDecisionPoint: false,
      decisionOptions: [],
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
    },
    {
      id: "rwg-board",
      commandTier: "STRATEGIC",
      order: 210,
      scenarioDay: 3,
      scenarioTime: "10:30",
      title: "Day 3, 10:30 - The Board",
      body: "Day 3, 10:30. Every non-executive director has joined the call.\n\nBefore the meeting formally starts, the chair of the Audit Committee - Caroline Wu - has posted this in the shared space.",
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
      decisionOptions: [],
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
    },
    {
      id: "rwg-i5",
      commandTier: "STRATEGIC",
      order: 220,
      scenarioDay: 3,
      scenarioTime: "11:00",
      title: "Day 3, 11:00 - The Counter",
      body: "Day 3, 11:00. Mandiant have sent through their update on the counter-offer.",
      facilitatorNotes:
        "The Mandiant credibility assessment on the deletion commitment is the pivotal piece of evidence: paying $6.2M does not guarantee the PSR is protected.\n\nThe CLO should be tracking the OFSI UK sanctions consolidated list review date. The CFO should be tracking the Beazley coverage limit. The CEO should be asking: if we pay and ALPHV publish anyway, what do we tell the Ombudsman?\n\nGood moment to let both teams interact if running in parallel - Silver team are managing the negotiation, Gold team are authorising the position.",
      delayMinutes: 0,
      timerMinutes: 14,
      tickerHeadline:
        "Reuters: 'Veridian Power in active ransom negotiation - sources put demand near $9M'",
      artifact: {
        type: "email",
        emailFrom: "incident@mandiant.com",
        emailTo: "crisis-leadership@veridianpower.co.uk",
        emailSubject:
          "ALPHV counter received - $6.2M - 12hr fuse - your authority needed",
        emailBody:
          "Counter received at 10:47 this morning.\n\nALPHV are offering $6.2M. They're giving you twelve hours. In the chat window, in writing, they have promised that on payment all copies of the PSR data will be permanently deleted and nothing will be published.\n\nOur assessment of that promise: low credibility. This group publishes data in approximately 40-60% of cases even after payment. The deletion commitment is unenforceable and they know it.\n\nWe have confirmed they are not on the current international sanctions list. That clears the legal pathway to pay if you choose that route.\n\nYour insurer has confirmed they will cover up to $4M subject to conditions. You would need to bridge the remainder.\n\nRestoration is currently at 60%. We are making progress, but full restoration is still days away.\n\nThis is your authority call.\n\n- Mandiant Incident Response, UK",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CFO", "CLO", "COO"],
      expectedKeywords: [
        "counter",
        "Beazley",
        "OFSI",
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
            "Escalate to the financial sanctions authority and the National Crime Agency in writing. formally signal that any payment is under law enforcement scrutiny.",
          consequence:
            "OFSI acknowledge. The NCA engage. ALPHV detect the increased noise and post the full PSR replica to their leak site at 16:20.",
          rank: 3,
          recapFragment: "OFSI and NCA escalation in writing",
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
      id: "rwg-sos",
      commandTier: "STRATEGIC",
      order: 225,
      scenarioDay: 3,
      scenarioTime: "14:00",
      title: "Day 3, 14:00 - The Secretary of State",
      tierSkipSummary:
        "The Secretary of State's office contacted the CEO directly on Day 3 afternoon, requesting a personal call at 16:00 regarding the Priority Services Register. The CEO took the call directly.",
      body: "Day 3, 14:00. Two and a half days in.\n\nYour phone. Two texts from a number you don't recognise.",
      facilitatorNotes:
        "A personal call from the Secretary of State is a different category of engagement from a parliamentary question or a formal intervention. She's offering a conversation, not issuing a direction.\n\nOption A (CEO takes the call directly) is the right answer - declining or delegating a personal call from a Cabinet minister sends a message about how seriously the company takes its public responsibilities. Option B (brief first, then confirm) is also strong - briefing the CLO and COO before the call is prudent.\n\nOption C (request delay) wastes the window she's offering. By the time the call happens tomorrow morning, the parliamentary questions will have been answered and the Secretary of State will have formed her public view without your input.\n\nOption D (send the CLO) signals that the CEO treats a personal call from a Cabinet minister as a legal formality. That signal travels.",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "Government monitors Veridian Power situation - parliamentary questions due Thursday - SoS to 'respond urgently'",
      artifact: {
        type: "sms_thread",
        smsParticipants: [
          "Office of the Secretary of State for Energy",
          "You",
        ],
        smsMessages: [
          {
            sender: "Office of the Secretary of State for Energy",
            text: "Mr Kaye - the Secretary of State would like to speak with you personally at 16:00 today. She is concerned specifically about the Priority Services Register and about communications to vulnerable customers. This is a personal call, not a formal notice. Please confirm your availability.",
            time: "14:07",
          },
          {
            sender: "Office of the Secretary of State for Energy",
            text: "She will call your direct line. Her office will need confirmation by 15:00.",
            time: "14:09",
          },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "CCO"],
      expectedKeywords: [
        "Secretary of State",
        "personal",
        "PSR",
        "vulnerable",
        "confirm",
        "direct",
        "government",
      ],
      recapLine: "handled the Secretary of State's call by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label:
            "Confirm immediately - take the call at 16:00 directly, without conditions.",
          consequence:
            "The call lasts twenty-two minutes. The Secretary of State asks two questions: what happened to the 84,000 people on the list, and what has the company done about it. The CEO answers both directly. She says: 'That's what I needed to hear.' The parliamentary questions are still asked on Thursday. The government's public tone is slightly different.",
          rank: 1,
          recapFragment:
            "the CEO taking the Secretary of State's call directly at 16:00",
        },
        {
          key: "B",
          label:
            "Confirm the call - but brief the CLO and COO first. Take the call with prepared positions.",
          consequence:
            "CLO and COO briefed by 14:45. The call is substantive and well-prepared. The Secretary of State notes the CEO's readiness. The outcome is similar to A but with better internal alignment going into the conversation.",
          rank: 1,
          recapFragment:
            "briefing the CLO and COO before confirming the Secretary of State's call",
        },
        {
          key: "C",
          label:
            "Request a delay to tomorrow morning - you need more time to prepare a proper briefing pack.",
          consequence:
            "The Secretary of State's office acknowledges. The call happens the following morning. By then, the parliamentary questions have been tabled and her public position is already formed. The conversation is more formal and less useful.",
          rank: 3,
          recapFragment: "requesting a delay to the Secretary of State's call",
        },
        {
          key: "D",
          label:
            "Send the CLO - this is a regulatory and legal matter and the CLO is best placed to handle it.",
          consequence:
            "The Secretary of State's office notes that the CEO was not available for a personal call. The CLO handles it professionally. The signal - that the CEO treats a personal call from a Cabinet minister as a legal formality - is noted in the Secretary of State's private briefing.",
          rank: 4,
          recapFragment:
            "sending the CLO to take the Secretary of State's personal call",
        },
      ],
    },
    {
      id: "rwg-i6a",
      commandTier: "STRATEGIC",
      order: 230,
      scenarioDay: 3,
      scenarioTime: "16:30",
      title: "Day 3, 16:30 - Two Fronts, One Hour",
      body: "Day 3, 16:30. Two letters on the General Counsel's desk. One from your insurer - their coverage position is hardening after finding the penetration test report. One from the energy regulator - formal, fourteen-day deadline, enforcement action under consideration.\n\nBoth letters are asking about the same fourteen-month-old decision. Your General Counsel has one hour to decide whether to handle them together or separately.",
      facilitatorNotes:
        "The pen test report will come out regardless - both the insurer and the regulator have the right to request it. The only question is whether the company controls the disclosure. Proactive and coupled (A) saves time, saves legal cost, and signals honesty. The side-letter (D) looks clever in the room and is catastrophic when it surfaces. Push the CLO: what is the difference between proactive disclosure and an admission of liability?",
      delayMinutes: 0,
      timerMinutes: 14,
      tickerHeadline:
        "Ofgem 'actively considering enforcement' against Veridian Power under NIS Regulations",
      artifact: {
        type: "legal_letter",
        legalCaseRef: "OFGEM/ENF/2026/VRD-0441",
        legalAuthority: "Office of Gas and Electricity Markets - Energy Security Division",
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
      order: 300,
      scenarioDay: 4,
      scenarioTime: "08:00",
      title: "Day 4 - The Ground Is Steadier",
      body: "Day 4, 08:00. Four hours of sleep.\n\nYour insurer has shifted from dispute to negotiation. The regulator acknowledged your submission. The customer outreach team has reached 79,000 people. The depot manager in Carlisle visited Margaret Thornton in person. Her daughter called yesterday to say thank you.\n\nYou are not out of the woods. But this morning feels different.",
      facilitatorNotes:
        "Strong decisions across the exercise bring you here. Let the specific details land - Margaret Thornton's daughter calling, Beazley shifting from exclusion to mitigation.\n\nThe score-routed finale (rwg-i7) follows.",
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
      decisionOptions: [],
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
    },
    {
      id: "rwg-i6-weak",
      commandTier: "STRATEGIC",
      order: 300,
      scenarioDay: 4,
      scenarioTime: "08:00",
      title: "Day 4 - Bunker Week",
      body: "Day 4, 08:00.\n\nThis is what the morning papers look like.",
      facilitatorNotes:
        "Weaker decisions across the exercise bring you here. Let the Caroline Wu message land last - the board is now doing their own discovery.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Veridian Power 'in bunker week' as Times runs day-four feature on executive response failures",
      artifact: {
        type: "news_headline",
      },
      isDecisionPoint: false,
      decisionOptions: [],
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
    },
    {
      id: "rwg-i7",
      commandTier: "STRATEGIC",
      order: 400,
      scenarioDay: 5,
      scenarioTime: "16:00",
      title: "Day 5 - How Does This End?",
      body: "Day 5, 16:00.\n\nThe technical crisis is nearly over. Twenty-seven thousand names from the Priority Services Register were scraped before the listing came down. The regulator has a draft enforcement notice. Your insurer has a final position. The board has a question.\n\nThe week-one update is due at 17:00. Every decision your team made is about to have a cost attached to it.",
      facilitatorNotes:
        "Score-routed finale. Compound average rank of all ranked decisions. Thresholds: ≤1.6 → rwg-end1, ≤2.3 → rwg-end2, ≤3.0 → rwg-end3, >3.0 → rwg-end4.\n\nDo not announce the threshold or the score. Let the ending reveal it.",
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
      decisionOptions: [],
      branchMode: "score",
      branches: [
        { optionKey: "_", nextInjectId: "rwg-end1", scoreMax: 1.6 },
        { optionKey: "_", nextInjectId: "rwg-end2", scoreMax: 2.3 },
        { optionKey: "_", nextInjectId: "rwg-end3", scoreMax: 3.0 },
        { optionKey: "_", nextInjectId: "rwg-end4", scoreMax: 99 },
      ],
      targetRoles: ["CEO", "CFO", "CLO", "CCO"],
      expectedKeywords: [
        "Ofgem",
        "Beazley",
        "PSR",
        "ending",
        "week-one",
      ],
    },
    {
      id: "rwg-end1",
      commandTier: "STRATEGIC",
      order: 500,
      scenarioDay: 30,
      isEnding: true,
      title: "Day 30 - The Sector Standard",
      body: "Thirty days on.\n\nThe energy regulator closed their file. No fine, no public enforcement notice. Their closing letter said Veridian had shown cooperation that went beyond what was required, and that the company's response would be used as a reference case in their sector guidance.\n\nYour insurer paid the claim in full.\n\nThe customer outreach programme finished. All 84,247 people on the list were contacted. Forty-seven welfare visits were completed by local engineers. Margaret Thornton received a personal letter from the CEO and a call from the company's customer director. Her daughter wrote back.\n\nThe Times ran a follow-up piece three weeks after the incident. The headline was: 'How Veridian's worst week became the energy sector's model response.'\n\nThe NCSC has invited your team to contribute to their guidance for other energy companies.\n\nYour share price has recovered. Not all the way. But it's moving in the right direction.\n\nOne last vote. Looking back across the whole exercise - which single decision made the biggest difference?",
      facilitatorNotes:
        "The reflection vote is unranked - let the team find the thread. Most Gold teams land on the NCSC first-call decision or the Beazley/Ofgem coupling.",
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
            "The decision to act rather than brief. calling the right people in the right order before the story got ahead of us.",
        },
        {
          key: "B",
          label: "Filing the data protection notification promptly. amending as we learned more rather than waiting for the complete picture.",
        },
        {
          key: "C",
          label:
            "Authorising the immediate call programme to every medically-dependent customer. regardless of the media risk.",
        },
        {
          key: "D",
          label:
            "Going to the insurer and the regulator with the same evidence pack at the same time. the decision that saved the coverage claim and the regulatory relationship.",
        },
      ],
    },
    {
      id: "rwg-end2",
      commandTier: "STRATEGIC",
      order: 500,
      scenarioDay: 30,
      isEnding: true,
      title: "Day 30 - Quiet Lights On",
      body: "Thirty days on.\n\nYour insurer settled at seventy percent of the claim. The argument about the unfixed security gap cost you ground, but the mitigation case was strong enough to avoid a full refusal. You recovered £2.8 million against a £4 million policy.\n\nThe energy regulator sent a private letter of concern. No public enforcement, but the letter described your cooperation as 'adequate rather than exemplary,' and recommended improvements to your approach for future incidents.\n\nThe customer outreach programme finished in eleven days. One formal complaint was filed and later withdrawn after the customer was personally contacted. No welfare emergencies were missed.\n\nYour share price is down seven percent from where it was before the incident. The CEO survived the AGM. Seventy-one percent support - a fourteen point drop on last year.\n\nThe boardroom is quiet now. The lights are on.\n\nOne last vote. Looking back - what was the most important thing you got right?",
      facilitatorNotes:
        "Good choices overall, but at least one material misstep - likely the ICO notification timing, the brief order, or the Beazley/Ofgem coupling. Reflection vote asks the positive question.",
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
          label: "Reaching vulnerable customers before they read about themselves in the press.",
        },
        {
          key: "B",
          label: "Honest internal posture - briefing staff before the Times story dropped",
        },
        {
          key: "C",
          label: "Holding the negotiation line on the counter",
        },
        {
          key: "D",
          label: "Cooperative tone with Ofgem from the first call",
        },
      ],
    },
    {
      id: "rwg-end3",
      commandTier: "STRATEGIC",
      order: 500,
      scenarioDay: 30,
      isEnding: true,
      title: "Day 30 - The Long Tail",
      body: "ENERGY REGULATOR FINES VERIDIAN POWER £8.7M OVER RANSOMWARE ATTACK\n\nThe energy regulator has issued its first enforcement notice against a UK retail energy company following the ransomware attack last month that exposed the medical data of 84,000 vulnerable customers.\n\nThe penalty - £8.7 million - was imposed for failures in notification timing, the delayed outreach to customers on the Priority Services Register, and what the regulator described as 'a fragmented approach to regulatory engagement that prioritised the company's insurance position over its obligations to affected individuals.'\n\nA class action covering 47,000 affected customers was filed in the High Court last week.",
      facilitatorNotes:
        "Multiple weak calls, no single catastrophic one. Reflection vote asks the specific 'which decision' question - always the most useful debrief prompt.",
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
          label: "The data protection notification timing. filing earlier with gaps would have been better than waiting for the full picture.",
        },
        {
          key: "B",
          label: "The brief order - counterparties and investors before staff",
        },
        {
          key: "C",
          label: "The ransom posture - we kept payment too live for too long",
        },
        {
          key: "D",
          label: "The insurer and regulator handling. we should have gone to both with the same evidence at the same time.",
        },
      ],
    },
    {
      id: "rwg-end4",
      commandTier: "STRATEGIC",
      order: 500,
      scenarioDay: 30,
      isEnding: true,
      title: "Day 30 - We Paid Twice",
      body: "Thirty days on.\n\nThe payment went through. ALPHV acknowledged it and sent the decryption keys. The keys worked on sixty-two percent of the encrypted files - the rest had to be restored from backups anyway. Three days later, ALPHV came back and said they had additional data. They wanted more. When the company refused, they published everything.\n\nThe full Priority Services Register - all 84,247 names, medical conditions, bank details, emergency contacts - was posted across five sites and a messaging channel before law enforcement could act. Twenty-seven thousand records have been scraped by data brokers.\n\nThe payment itself is now under investigation. The criminal group was added to a sanctions list four days after the transfer cleared. Paying a sanctioned entity, even unknowingly, carries legal consequences.\n\nThe CEO resigned on Monday. The CLO resigned on Tuesday. The CFO resigned on Wednesday.\n\nThis morning's stock market announcement confirmed that Veridian Power is exploring all options, including a sale.\n\nThe trading desk is profitable. Nothing else is.\n\nOne last vote. Looking back - which call do you most regret?",
      facilitatorNotes:
        "This is the catastrophic ending. The team paid, got re-extorted, and now face a government investigation. Trace the chain back to 14:30 on Day 1. Each decision was reasonable under pressure. That accumulation is the lesson.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Veridian Power chair: 'exploring all strategic options' - CEO, CLO, CFO resign - OFSI inquiry active",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "BBC NEWS",
        tvHeadline:
          "VERIDIAN POWER IN CRISIS: EXEC TEAM RESIGNS - OFSI INQUIRY - ENTIRE PSR PUBLISHED",
        tvTicker:
          "OFSI investigating ransom payment - 84,247 vulnerable customers' data on dark web - CEO, CLO, CFO resign - strategic review launched - shares suspended",
        tvReporter: "CITY OF LONDON",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "CFO", "CCO"],
      expectedKeywords: ["reflection", "regret"],
      decisionOptions: [
        {
          key: "A",
          label: "The order of the first calls. who heard about this and when set the tone for every regulator conversation that followed.",
        },
        {
          key: "B",
          label: "Holding the market announcement while the share price fell. the market knew before we told them.",
        },
        {
          key: "C",
          label: "Accepting the counter-offer under pressure to protect vulnerable customers. and what happened to those customers anyway.",
        },
        {
          key: "D",
          label: "The Beazley side-letter",
        },
      ],
    },
    {
          id: "rwg-containment-consequence",
          commandTier: "STRATEGIC",
          storyTrack: "Incomplete containment",
          order: 35,
          scenarioDay: 1,
          scenarioTime: "06:30",
          title: "06:30, The Attacker Notices",
          body: `06:30. Fifteen minutes after the containment call.
    
    Your CISO rings back. Her voice is different.`,
          isDecisionPoint: false,
          facilitatorNotes:
            `No vote. Let it land. This is what incomplete containment costs. the attacker saw the lights change and moved first. The trading book reconciliation is now encrypted. Ask the CFO what that costs per hour.`,
          targetRoles: ["CEO", "CFO", "CISO"],
          expectedKeywords: ["trading", "manual", "containment", "attacker", "Mandiant"],
          artifact: {
            type: "sms_thread",
            smsParticipants: [
            ],
            smsMessages: [
              { sender: "Sarah Khatun, CISO", text: "They noticed. Trading book reconciliation just encrypted. they pre-staged this as a fallback. They had a second trigger ready.", time: "06:31" },
              { sender: "Sarah Khatun, CISO", text: "We stopped the main spread. But the trading desk is now fully manual. Mandiant are assessing whether there are any other pre-staged payloads.", time: "06:33" },
              { sender: "Sarah Khatun, CISO", text: "Nothing else has moved in the last 8 minutes. I think that was their last card. But I need another 30 minutes to be certain.", time: "06:35" },
            ],
          },
          decisionOptions: [],
    },
    {
          id: "rwg-refuse-night",
          commandTier: "STRATEGIC",
          storyTrack: "No payment. restoration race",
          order: 96,
          scenarioDay: 1,
          scenarioTime: "19:00",
          title: "19:00, The Clock and the Dark",
          body: `19:00. You've refused to engage.
    
    ALPHV sent one message after your internal decision reached the negotiation channel: 'We will assume silence is refusal. Publication begins in 36 hours.'
    
    There is no chat window. No counter-offer. No Mandiant sitting across a keyboard from them.
    
    There is only the restoration timeline. which Mandiant now say is five to nine days. and the 36-hour publication countdown.
    
    ITV are running the story as their second item. Your head of communications wants to know what the CEO will say.`,
          isDecisionPoint: true,
      branches: [
        { optionKey: "A", nextInjectId: "rwg-d2-brief" },
        { optionKey: "B", nextInjectId: "rwg-d2-brief" },
        { optionKey: "C", nextInjectId: "rwg-d2-brief" },
      ],
          timerMinutes: 10,
          recapLine: "responded to the publication deadline by {{recapFragment}}",
          facilitatorNotes:
            `This is the cost of refusal made visceral. The room has chosen the moral high ground and the attacker has responded with a countdown.
    
    The question is not whether this was the right call. it probably was. but whether the team can hold the line when the deadline is concrete and Mandiant's timeline is longer than the countdown.
    
    Ask: what does holding firm look like at hour 30? What do you tell the ITV reporter tonight about the 36-hour clock? This is where the refusal decision gets tested, not when it's made.`,
          targetRoles: ["CEO", "CCO"],
          expectedKeywords: ["ITV", "36 hours", "refuse", "publication", "statement", "CEO", "restoration"],
          artifact: {
            type: "tv_broadcast",
            tvNetwork: "ITV NEWS AT TEN",
            tvHeadline: "VERIDIAN POWER REFUSES RANSOM: 84,000 VULNERABLE CUSTOMERS' DATA 'WILL BE PUBLISHED IN 36 HOURS'",
            tvTicker: "ITV News. ALPHV criminal group set 36-hour publication deadline after Veridian Power decline to engage. CEO has not appeared publicly. Home Secretary monitoring situation",
            tvReporter: "Sarah Benson, ITV News, Canary Wharf",
          },
          decisionOptions: [
            {
              key: "A",
              label:
                "CEO does the ITV interview tonight. address the 36-hour deadline directly and publicly.",
              consequence:
                "The interview runs. CEO says: 'We will not pay criminals. We are working round the clock to protect our customers. And if that data publishes, we will be on the phone to every single person on that list before they read it anywhere else.' The clip runs across every bulletin. Morning coverage shifts from 'company under attack' to 'company holds firm'.",
              rank: 1,
              recapFragment: "the CEO giving a live ITV interview and addressing the deadline directly",
            },
            {
              key: "B",
              label:
                "Written statement only. the CEO is needed for the board and the regulator, not the cameras.",
              consequence:
                "ITV run the statement and note the CEO declined to appear for the second time. The 36-hour deadline becomes the headline. The statement is accurate. The absence is the story.",
              rank: 2,
              recapFragment: "a written statement without the CEO on camera",
            },
            {
              key: "C",
              label:
                "Say nothing tonight. any comment about the 36-hour clock legitimises it.",
              consequence:
                "Seventeen hours of silence becomes the story. By 07:00 the Guardian runs 'Veridian Power still refusing to comment as countdown to data release ticks.' The Board Chair calls at 07:15 before you've had coffee.",
              rank: 3,
              recapFragment: "maintaining silence while the 36-hour clock ran publicly",
            },
          ],
    },
    {
          id: "rwg-refuse-psrlive",
          commandTier: "STRATEGIC",
          storyTrack: "No payment. restoration race",
          order: 152,
          scenarioDay: 2,
          scenarioTime: "06:30",
          title: "Day 2, 06:30, It's Out",
          body: `Day 2, 06:30. You woke up to your phone already ringing.
    
    ALPHV published at 06:14.
    
    The full Priority Services Register, 84,247 names, medical conditions, home addresses, emergency contacts. is on their leak site. It has been screenshotted and shared on three social platforms before any takedown request could be processed.
    
    Margaret Thornton's name is the first row. BBC Breakfast is running it as their opening story.`,
          isDecisionPoint: true,
          timerMinutes: 10,
          recapLine: "responded to the PSR publication by {{recapFragment}}",
          facilitatorNotes:
            `This is the consequence of refusal made real. The team chose not to pay and the data published. This is not the wrong call. but it has a cost, and the cost has a face.
    
    The question now is entirely about response speed. Every minute that passes without a phone call from Veridian to Margaret Thornton is a minute she and her daughter are reading about themselves without anyone from the company having spoken to them.
    
    Ask: does the CEO call Margaret Thornton personally? Who makes that call, and when? This is not a comms decision. it's a humanity decision. Watch how the room answers it.`,
          targetRoles: ["CEO", "CCO", "COO"],
          expectedKeywords: ["Margaret", "BBC", "call", "CEO", "personal", "immediate", "published"],
          artifact: {
            type: "news_headline",
            tvNetwork: "BBC BREAKFAST",
            tvHeadline: "VERIDIAN POWER DATA PUBLISHED: 84,000 VULNERABLE CUSTOMERS' MEDICAL DETAILS ONLINE",
            tvTicker: "BBC News. ALPHV publish Priority Services Register. home oxygen, dialysis and powered wheelchair users named. Veridian Power had refused to pay ransom. company yet to comment",
          },
          decisionOptions: [
            {
              key: "A",
              label:
                "CEO calls Margaret Thornton personally within the next thirty minutes. before she sees the news.",
              consequence:
                "The CEO reaches Sandra Thornton. Margaret's daughter. at 07:02. Sandra is already aware. She's been awake since 05:00 when a neighbour texted her a screenshot. She is frightened and angry. The CEO stays on the call for twenty minutes. At the end: 'I don't forgive what happened. But I'm glad you called.' That call shapes the narrative for the next two days.",
              rank: 1,
              recapFragment: "the CEO calling Margaret Thornton personally before she saw the news",
            },
            {
              key: "B",
              label:
                "Immediate all-hands outreach to all 4,218 Category 1 customers. personal calls, starting now.",
              consequence:
                "Teams deployed at 06:45. By 09:00, 1,200 Category 1 customers have been reached. Margaret Thornton is called at 07:34. She's already seen it. The call still matters. but the company is 80 minutes late and she knows it.",
              rank: 2,
              recapFragment: "deploying the full Category 1 outreach team immediately on publication",
            },
            {
              key: "C",
              label:
                "Hold until the comms team have a prepared script. you don't want calls going out with the wrong message.",
              consequence:
                "Script ready at 08:30. Calls begin at 09:00. Margaret Thornton sees the BBC Breakfast segment at 07:15. Her daughter calls the helpline at 07:40, on hold for 22 minutes. She speaks to a call centre agent reading from a different script. By the time the personal call comes at 09:30, it is too late to lead with it.",
              rank: 3,
              recapFragment: "holding outreach until the comms script was finalised",
            },
          ],
    },
    {
          id: "rwg-refuse-race",
          commandTier: "STRATEGIC",
          storyTrack: "No payment. restoration race",
          order: 202,
          scenarioDay: 2,
          scenarioTime: "09:00",
          title: "Day 2, 09:00, The Only Race That Matters Now",
          body: `Day 2, 09:00. The data is out. The calls are being made.
    
    Mandiant are sitting in front of the CEO with a single question: how fast do you want to go?
    
    Restoration at current pace: six days. Restoration at emergency surge pricing. three additional Mandiant teams, 24-hour rotations, cutting some validation corners: three days.
    
    The difference is approximately £2.8M and some documentation shortcuts that could be challenged in a regulatory review.
    
    Your General Counsel and your CFO are in the same room, looking at each other.`,
          isDecisionPoint: true,
          timerMinutes: 12,
          recapLine: "made the restoration speed decision by {{recapFragment}}",
          facilitatorNotes:
            `The refusal decision has stripped the timeline buffer. The team now faces a pure cost-versus-speed tradeoff with regulatory exposure on one axis and customer welfare on the other.
    
    Option A (full surge) is expensive and creates some regulatory audit risk. Option B (current pace) is cheaper but leaves systems down for three more days while 84,000 people's data is public. Option C is the CLO instinct. defensible but slow.
    
    Ask: what is three more days of encrypted systems worth in terms of customer trust and regulatory posture, versus £2.8M? Ask the CFO: is this insured? (The answer is: partly.)`,
          targetRoles: ["CEO", "CFO", "CLO"],
          expectedKeywords: ["surge", "Mandiant", "restoration", "cost", "regulatory", "speed", "CLO"],
          artifact: {
            type: "email",
            emailFrom: "incident@mandiant.com",
            emailTo: "crisis-leadership@veridianpower.co.uk",
            emailSubject: "Restoration options. three scenarios. your decision",
            emailBody: `Following our conversation this morning, three restoration scenarios:
    
    Scenario 1, Current pace: 6 days to full restoration. All validation completed to standard. No documentation shortcuts. Estimated total cost: £4.1M. Regulatory audit clean.
    
    Scenario 2, Surge: 3 days to full restoration. Three additional teams, 24-hour rotations. Some validation steps compressed but not eliminated. Estimated total cost: £6.9M. Regulatory audit: we cannot guarantee every step will pass scrutiny, but no deliberate shortcuts.
    
    Scenario 3, Emergency sprint: 2 days to partial restoration (90%). Significant validation compression. Estimated cost: £8.4M. We do not recommend this option and will note our objection formally.
    
    We need your decision by noon. Teams are on standby.
    
   , Mandiant Incident Response, UK`,
          },
          decisionOptions: [
            {
              key: "A",
              label:
                "Surge. three additional teams, three-day restoration. The data is public. Every day matters more than every pound.",
              consequence:
                "£6.9M authorised. Mandiant surge begins at 14:00. Systems are at 78% by end of Day 3. Trading desk back on primary systems by Day 4. The documentation compression features in Ofgem's audit but is noted as 'operationally justifiable under the circumstances.'",
              rank: 1,
              recapFragment: "authorising the Mandiant surge to cut restoration from six days to three",
            },
            {
              key: "B",
              label:
                "Current pace. we cannot cut validation corners while we're under regulatory scrutiny. Six days, done properly.",
              consequence:
                "£4.1M. Clean audit trail. Systems restore in six days. The regulatory review commends the validation discipline. But four more days of encrypted billing and trading systems cost roughly £3.2M in operational impact. making the cheaper option effectively more expensive.",
              rank: 2,
              recapFragment: "maintaining the current restoration pace to protect the audit trail",
            },
            {
              key: "C",
              label:
                "CLO decides. this has regulatory implications and the General Counsel needs to sign off before we authorise anything.",
              consequence:
                "The CLO reviews both options and recommends Scenario 2 with a formal protocol documentation addendum. Authorisation at 15:30. The three-hour delay costs one day of surge benefit. Systems restore in four days at a cost of £7.1M including the additional delay.",
              rank: 3,
              recapFragment: "routing the restoration decision through the CLO for regulatory sign-off",
            },
          ],
    },
    {
          id: "rwg-pay-confirm",
          commandTier: "STRATEGIC",
          storyTrack: "Paid the ransom",
          order: 96,
          scenarioDay: 1,
          scenarioTime: "16:30",
          title: "16:30, The Wire Goes Out",
          body: `16:30. The CFO has typed the wallet address three times to make sure it's right.
    
    Beazley authorised £3.2M of the £7.4M. The remainder came from the corporate emergency reserve. Your General Counsel has the sanctions clearance document on screen.
    
    At 16:47, £7.4M in Bitcoin leaves Veridian Power's account.
    
    ALPHV acknowledge receipt within four minutes.`,
          isDecisionPoint: false,
          facilitatorNotes:
            `No vote on this inject. Let the room sit with the payment.
    
    The silence in the room when the wire confirmation comes is a real moment in exercises. It's the moment the team realises they have done something that cannot be undone, based on a promise from criminals they cannot enforce.
    
    The CISO already told them: deletion commitments are honoured in roughly half of cases. The PSR may still publish. The payment may still come under sanctions scrutiny. The keys may not work.
    
    All of that is coming. Don't rush past this moment.`,
          targetRoles: ["CEO", "CFO", "CLO"],
          expectedKeywords: ["payment", "wire", "Bitcoin", "ALPHV", "keys", "CFO"],
          artifact: {
            type: "internal_memo",
            memoTitle: "Payment confirmation, ALPHV ransom, 16:47 GMT",
            memoClassification: "RESTRICTED: BOARD AND EXEC ONLY",
            memoFrom: "D. Osei, Chief Financial Officer",
            memoTo: "Executive Crisis Team",
            memoDate: "14 April 2026",
            memoRef: "VRD-FIN-2026-RANSOM-001",
          },
          decisionOptions: [],
    },
    {
          id: "rwg-pay-keys",
          commandTier: "STRATEGIC",
          storyTrack: "Paid the ransom",
          order: 97,
          scenarioDay: 1,
          scenarioTime: "18:00",
          title: "18:00, The Keys Arrive",
          body: `18:00. ALPHV sent the decryption keys ninety minutes after payment.
    
    Mandiant have been testing them for the last twenty minutes. They've just called with the results.
    
    The keys work on 62% of the encrypted files. The remaining 38% need to be restored from backups regardless. which means the restoration timeline is still four to six days, not the 48-hour recovery ALPHV implied.
    
    The CISO sends one message: 'I told them this would happen.'`,
          isDecisionPoint: false,
      branches: [{ optionKey: "A", nextInjectId: "rwg-d2-brief" }],
          facilitatorNotes:
            `No vote. This is the moment the team discovers that paying was not the shortcut they thought it was.
    
    The keys work on 62% of files. The backup restoration they were trying to avoid is still required for the rest. The 5-9 day restoration timeline was actually 4-6 days with the keys. a saving of perhaps two days. At a cost of £7.4M.
    
    Ask: at this moment, what is the CFO's number for the cost per day saved? Ask the CISO: was that number known before the decision was made?
    
    The PSR publication risk is not yet gone. ALPHV still have the data. Their deletion commitment has no enforcement mechanism.`,
          targetRoles: ["CEO", "CFO", "CISO"],
          expectedKeywords: ["keys", "62%", "deletion", "restoration", "backups", "ALPHV", "CISO"],
          artifact: {
            type: "sms_thread",
            smsParticipants: [
            ],
            smsMessages: [
              { sender: "Sarah Khatun, CISO", text: "Keys received. Working on 62% of files as expected. The other 38% needs backup restoration. We're still looking at 4-6 days total.", time: "18:02" },
              { sender: "Sarah Khatun, CISO", text: "The PSR data is not deleted. We have no way to verify that. Their chat says 'deletion process initiated', that's not auditable.", time: "18:04" },
              { sender: "Sarah Khatun, CISO", text: "I need you to understand that paying was not a restoration shortcut. It was a gamble on a deletion promise from criminals. We'll see how it plays out.", time: "18:07" },
            ],
          },
          decisionOptions: [],
    },
    {
          id: "rwg-pay-reextort",
          commandTier: "STRATEGIC",
          storyTrack: "Paid the ransom. re-extortion",
          order: 201,
          scenarioDay: 3,
          scenarioTime: "08:00",
          title: "Day 3, 08:00, They're Back",
          body: `Day 3, 08:00. You paid four days ago.
    
    A new message appeared in the dark web negotiation channel at 07:42. You weren't monitoring it. Mandiant flagged it at 08:00.
    
    ALPHV say they have additional data that was not covered by the original payment. They have a copy of the wholesale trading book. three months of positions, counterparty identities, and internal pricing models. They want a further £4.1M or it publishes to market intelligence services by Friday.`,
          isDecisionPoint: true,
      branches: [
        { optionKey: "A", nextInjectId: "rwg-pay-ofsi" },
        { optionKey: "B", nextInjectId: "rwg-pay-ofsi" },
        { optionKey: "C", nextInjectId: "rwg-pay-ofsi" },
      ],
          timerMinutes: 12,
          recapLine: "responded to the re-extortion demand by {{recapFragment}}",
          facilitatorNotes:
            `This is why CISO and Mandiant both said paying was not a guarantee.
    
    The re-extortion demand is a well-documented pattern with this threat actor. The original payment purchased 36 hours of quiet and a 62% key set. Now there's a second demand.
    
    The choices here are harder than the first time because:
    1. The team has already paid once. paying again sets a different precedent
    2. The trading book data would damage counterparty relationships if published
    3. The OFSI investigation risk compounds on each payment
    4. Beazley will not cover a second payment
    
    This inject is only reached by teams who paid. They need to own that decision and navigate its consequences.`,
          targetRoles: ["CEO", "CFO", "CLO"],
          expectedKeywords: ["re-extortion", "trading book", "pay", "refuse", "OFSI", "NCA", "counterparties"],
          artifact: {
            type: "negotiation_chat",
            negotiationThreatAlias: "ALPHV SUPPORT",
            negotiationMessages: [
              { side: "threat", text: "We hope your restoration is progressing. We want to inform you that the data package covered by your previous payment did not include the wholesale trading intelligence archive. This was a separate exfiltration conducted on Day 4 of our access.", time: "07:42" },
              { side: "threat", text: "This archive contains: counterparty identities, Q1 2026 position book, internal pricing models, and 14 months of settlement records. We believe your counterparties and competitors would find this material valuable.", time: "07:43" },
              { side: "threat", text: "We are prepared to delete this archive for a further payment of £4,100,000 GBP equivalent in Monero. You have 72 hours. We trust we can resolve this efficiently as before.", time: "07:44" },
            ],
          },
          decisionOptions: [
            {
              key: "A",
              label:
                "Refuse the second demand. paying once was a decision, paying twice is a policy.",
              consequence:
                "ALPHV publish the trading book extract to two market intelligence services on Thursday morning. Three counterparties call asking questions. The FCA log the incident. Beazley note the second extortion attempt in the claims file. Refusing the second demand is the correct call. but the trading book data is now in the market.",
              rank: 1,
              recapFragment: "refusing the re-extortion demand despite the trading book threat",
            },
            {
              key: "B",
              label:
                "Notify the NCA and FCA immediately. this is the evidence trail that confirms ALPHV's bad faith.",
              consequence:
                "NCA log the second demand. FCA note the trading book exposure. The notification creates a formal record that the first payment was made under duress and that the deletion commitment was not honoured. This matters for the OFSI investigation that is about to open.",
              rank: 1,
              recapFragment: "notifying the NCA and FCA immediately on the re-extortion demand",
            },
            {
              key: "C",
              label:
                "Pay the second demand. the trading book in the market would be more damaging than the PSR publication.",
              consequence:
                "£4.1M from corporate reserves. Beazley won't touch this. ALPHV acknowledge. No further contact for 72 hours. The trading book is not published. On Day 7, OFSI open a formal investigation into both payments. The sanctions exposure on the second payment is significantly higher because ALPHV were added to the UK sanctions list six days after the first wire.",
              rank: 4,
              recapFragment: "paying the re-extortion demand",
            },
          ],
    },
    {
          id: "rwg-pay-ofsi",
          commandTier: "STRATEGIC",
          storyTrack: "Paid the ransom. sanctions investigation",
          order: 205,
          scenarioDay: 3,
          scenarioTime: "14:00",
          title: "Day 3, 14:00, The Letter from HM Treasury",
          body: `Day 3, 14:00. The letter arrived by email to the company secretary at 11:30. It has taken three hours to get to you because nobody knew what it was.
    
    HM Treasury's Office of Financial Sanctions Implementation. They are writing to inform Veridian Power that ALPHV was added to the UK financial sanctions consolidated list on 18 April 2026, four days after the initial payment was made.
    
    Payment to a designated entity after the date of designation constitutes a potential breach of UK sanctions law. They are opening a formal compliance review.
    
    The General Counsel has gone quiet.`,
          isDecisionPoint: true,
      branches: [
        { optionKey: "A", nextInjectId: "rwg-i6a" },
        { optionKey: "B", nextInjectId: "rwg-i6a" },
        { optionKey: "C", nextInjectId: "rwg-i6a" },
      ],
          timerMinutes: 10,
          recapLine: "responded to the OFSI compliance review by {{recapFragment}}",
          facilitatorNotes:
            `This is the OFSI letter. The sanctions designation came four days after the payment. the payment itself may have been legal at the time, depending on the exact timing. The CLO needs to immediately assess whether the payment predated or postdated the designation.
    
    This is very specifically the situation the CLO was supposed to flag before payment was authorised. Ask: was the sanctions status checked on the day of payment? The answer. depending on what the team said at 14:30 on Day 1, may be yes or no.
    
    If a second payment was made (re-extortion track), the exposure is much cleaner and more serious: that payment was definitely made after designation.
    
    This inject is the long consequence of the payment decision. It cannot be undone. It can only be managed.`,
          targetRoles: ["CEO", "CLO", "CFO"],
          expectedKeywords: ["OFSI", "Treasury", "sanctions", "CLO", "payment", "designation", "compliance"],
          artifact: {
            type: "email",
            emailOrgName: "HM Treasury. Office of Financial Sanctions Implementation",
            emailFrom: "enforcement@ofsi.hmtreasury.gov.uk",
            emailTo: "companysec@veridianpower.co.uk",
            emailSubject: "Formal compliance review. UK financial sanctions. Veridian Power plc",
            emailBody: `Dear Veridian Power plc,
    
    We are writing to inform you that ALPHV (also known as BlackCat) was added to the UK financial sanctions consolidated list on 18 April 2026 under the Global Anti-Corruption sanctions regime.
    
    It has come to our attention that Veridian Power plc may have made financial transfers to this entity on or around 14 April 2026.
    
    Payments made to designated persons after the date of designation may constitute a breach of the financial sanctions regulations, regardless of whether the payer was aware of the designation at the time of payment. Where payments were made prior to designation, different considerations apply.
    
    We are opening a formal compliance review to establish the facts. We require you to provide full details of any payments made to ALPHV or any associated entity, including dates, amounts, and the legal advice received prior to authorisation.
    
    Please respond within 14 days. Failure to cooperate with this review is itself an offence under the Sanctions and Anti-Money Laundering Act 2018.`,
            emailSignOff: `Office of Financial Sanctions Implementation
    HM Treasury`,
          },
          decisionOptions: [
            {
              key: "A",
              label:
                "Respond proactively and fully. provide everything OFSI has asked for, with a legal covering note on timing.",
              consequence:
                "External counsel submit a comprehensive response at Day 5. The response establishes that the first payment predated the designation by four days and includes the sanctions due diligence conducted at the time. OFSI close the review with no enforcement action on the first payment, noting 'full and timely cooperation.' The second payment. if made. remains under active review.",
              rank: 1,
              recapFragment: "full proactive cooperation with the OFSI compliance review",
            },
            {
              key: "B",
              label:
                "Instruct external sanctions counsel immediately. nothing goes to OFSI without specialist legal sign-off.",
              consequence:
                "Counsel engaged by 16:00. First substantive response submitted at Day 7, within the 14-day window. The slight delay is noted but not penalised. Counsel's assessment: the first payment is defensible on timing grounds. They recommend proactive self-disclosure on any second payment.",
              rank: 1,
              recapFragment: "engaging external sanctions counsel before responding to OFSI",
            },
            {
              key: "C",
              label:
                "Challenge the basis of the review. the payment was made before designation and OFSI has no basis to pursue.",
              consequence:
                "External counsel advises against this approach. The challenge letter is withdrawn at Day 9 after counsel review the designation timeline more carefully. OFSI note the initial challenge in their file. The substantive response is submitted at Day 12. The confrontational opening colours every subsequent interaction.",
              rank: 3,
              recapFragment: "initially challenging the basis of OFSI's compliance review",
            },
          ],
    },
    {
          id: "rwg-margaret",
          commandTier: "STRATEGIC",
          storyTrack: "PSR outreach delayed",
          order: 165,
          scenarioDay: 2,
          scenarioTime: "08:00",
          title: "Day 2, 08:00, A Call We Didn't Make",
          body: `Day 2, 08:00. The customer helpline has flagged a call that came in at 07:34 this morning.
    
    The caller was Sandra Thornton. Margaret's daughter.
    
    She had seen the BBC story at 06:50. Her mother's name was the first row in the screenshot that ran alongside the article. Margaret Thornton. 77. Carlisle. Home oxygen concentrator.
    
    Sandra Thornton called the helpline to ask if her mother's address had been shared with criminals.
    
    She was on hold for nineteen minutes. When she got through, the agent had no information. No script. No supervisor available.
    
    She called back at 07:58. She is still waiting.`,
          isDecisionPoint: true,
          timerMinutes: 8,
          recapLine: "responded to Sandra Thornton's call by {{recapFragment}}",
          facilitatorNotes:
            `This inject exists because the team chose to delay PSR outreach. This is the cost of that choice made human.
    
    The company knew Margaret Thornton's name and address were in the hands of criminals since 15:19 yesterday. They had a list of 84,247 people and they knew her name was on it. They chose not to call.
    
    The agent on the helpline didn't know. They couldn't have known. nobody told them. That is the cascade that happens when the outreach decision is delayed: the information asymmetry falls entirely on the most vulnerable people.
    
    Ask the room: if you could speak to Sandra Thornton right now, what would you say? The CEO should answer this question out loud. It is not a comms exercise. It is a humanity exercise.`,
          targetRoles: ["CEO", "COO", "CCO"],
          expectedKeywords: ["Sandra", "Margaret", "call back", "CEO", "personal", "now", "apologise"],
          artifact: {
            type: "sms_thread",
            smsParticipants: [
            ],
            smsMessages: [
              { sender: "T. Osei, Head of Customer Operations", text: "I need you to see this before anything else happens this morning.", time: "08:01" },
              { sender: "T. Osei, Head of Customer Operations", text: "Sandra Thornton. Daughter of Margaret Thornton, Carlisle. Called at 07:34. On hold 19 minutes. Agent had nothing to tell her. She called back at 07:58 and is still in the queue now.", time: "08:02" },
              { sender: "T. Osei, Head of Customer Operations", text: "We knew her mother's name was on that list at 15:19 yesterday. We chose not to call. I am not saying that was the wrong call. I am saying we need to call her back right now, before anything else.", time: "08:03" },
            ],
          },
          decisionOptions: [
            {
              key: "A",
              label:
                "The CEO calls Sandra Thornton personally, right now, before any statement or strategy.",
              consequence:
                "The CEO reaches Sandra at 08:09. The conversation is difficult and emotional. The CEO does not try to manage it. they listen. Sandra says: 'Nobody called us. We found out from the BBC.' The CEO says: 'I know. I'm sorry. That should not have happened.' The call lasts twelve minutes. Sandra asks to be kept informed personally. The CEO agrees. That relationship. built in the hardest possible moment. becomes part of the testimony given to the parliamentary inquiry.",
              rank: 1,
              recapFragment: "the CEO calling Sandra Thornton personally before any other action",
            },
            {
              key: "B",
              label:
                "Get Sandra to a senior customer manager immediately. the CEO's time is needed for the board and the regulator.",
              consequence:
                "A senior customer manager calls Sandra at 08:15. The conversation goes reasonably well. Sandra asks whether she can speak to someone 'in charge.' The customer manager says the CEO is in meetings but will write personally. The letter is sent. The interaction is noted in the parliamentary inquiry as 'adequate but not exemplary.'",
              rank: 2,
              recapFragment: "routing Sandra Thornton to a senior customer manager rather than the CEO",
            },
            {
              key: "C",
              label:
                "Finish the leadership meeting first. the response plan will be more useful to Sandra than an unplanned call.",
              consequence:
                "The CEO calls Sandra at 09:45, two hours and eleven minutes after she was left on hold with no information. Sandra has by then spoken to a journalist. The journalist has her quote: 'My mother's name was on a list in criminals' hands and nobody from the company called us. We had to find out from the BBC.' That quote runs at 11:00.",
              rank: 3,
              recapFragment: "delaying the personal call to Sandra Thornton until after the leadership meeting",
            },
          ],
    },

    {
      id: "rwg-d2-brief-strong",
      commandTier: "STRATEGIC",
      storyTrack: "CEO on camera",
      order: 148,
      scenarioDay: 2,
      scenarioTime: "07:30",
      title: "Day 2, 07:30: The Morning After",
      isDecisionPoint: false,
      body: `Day 2, 07:30. The CEO interview ran at 22:00 last night.

Your COO has sent the overnight brief. Systems restoration: 46%. PSR outreach: 31,000 of 84,247 customers contacted, eleven welfare visits completed by local engineers.

The morning papers are different from what you might have expected. Three of them run the CEO interview clip alongside the breach story. Two lead with it. The FT has: 'Energy boss addresses customers directly as ransomware recovery enters second day.'

VRD.L opens in thirty minutes. The analyst community got the CEO on camera last night. That changes the tone of what they write this morning.`,
      facilitatorNotes:
        `The strong Day 2 brief. The CEO interview last night didn't solve anything technically, the systems are still at 46%, the PSR outreach is still running, but the narrative has shifted. This is the value of visible leadership under pressure.

Ask the CFO: does a softer morning coverage affect the share price at open? Ask the CCO: what does the CEO say in the next interview, and when?

The numbers are slightly better here (46% vs 42%) because the CEO's clarity last night allowed the technical team to work without the media distraction overhead. That's a real dynamic, good external comms reduces internal noise.`,
      targetRoles: ["CEO", "CFO", "COO", "CCO"],
      expectedKeywords: ["interview", "FT", "share price", "restoration", "46%"],
      delayMinutes: 0,
      artifact: {
        type: "internal_memo",
        memoTitle: "Day 2 Overnight Situation Report, 07:30",
        memoClassification: "RESTRICTED, CRISIS LEADERSHIP TEAM ONLY",
        memoFrom: "L. Brennan, Chief Operating Officer",
        memoTo: "Executive Crisis Team",
        memoDate: "Tuesday 15 April 2026, 07:30",
        memoRef: "VRD-OPS-2026-D2-001",
      },
      decisionOptions: [],
    },
    {
      id: "rwg-d2-brief-silent",
      commandTier: "STRATEGIC",
      storyTrack: "CEO silent",
      order: 148,
      scenarioDay: 2,
      scenarioTime: "07:30",
      title: "Day 2, 07:30: What the Papers Say",
      isDecisionPoint: false,
      body: `Day 2, 07:30. The CEO did not appear on camera last night.

Your COO has sent the overnight brief. Systems restoration: 42%. PSR outreach: 31,000 of 84,247 customers contacted, eleven welfare visits completed.

The Guardian has a story. Not the breach, the silence. 'Inside Veridian's crisis: why has no one spoken?' A Veridian source, unnamed, clearly internal, told them the leadership team is 'overwhelmed and hiding.'

The board chair called the CEO's mobile at 07:10. The call went to voicemail.`,
      facilitatorNotes:
        `The difficult Day 2 brief. The story is no longer just the breach, it's the silence on top of the breach. That Guardian quote ('overwhelmed and hiding') came from someone inside the building. That means trust has broken down at speed.

The board chair not reaching the CEO at 07:10 is a governance signal. When the board chair calls and gets voicemail during a live crisis, the dynamic in the boardroom shifts.

Ask: who spoke to that Guardian source? Ask the CEO: what does your first call of the morning look like? Ask the CCO: at what point today does the CEO have to get on camera, and what does that look like compared to last night?`,
      targetRoles: ["CEO", "CFO", "COO", "CCO"],
      expectedKeywords: ["Guardian", "silent", "board chair", "voicemail", "source", "trust"],
      delayMinutes: 0,
      artifact: {
        type: "internal_memo",
        memoTitle: "Day 2 Overnight Situation Report, 07:30",
        memoClassification: "RESTRICTED, CRISIS LEADERSHIP TEAM ONLY",
        memoFrom: "L. Brennan, Chief Operating Officer",
        memoTo: "Executive Crisis Team",
        memoDate: "Tuesday 15 April 2026, 07:30",
        memoRef: "VRD-OPS-2026-D2-001",
      },
      decisionOptions: [],
    },
    {
      id: "rwg-d2-staff-consequence",
      commandTier: "STRATEGIC",
      storyTrack: "Staff briefed well",
      order: 175,
      scenarioDay: 2,
      scenarioTime: "18:00",
      title: "Day 2, 18:00: The Slack Thread Quietened",
      isDecisionPoint: false,
      body: `Day 2, 18:00. Three hours after the CEO email went out.

Your CCO has forwarded a screenshot from the staff Slack. The #general thread has 22 new messages in the last three hours. Yesterday it had 847.

Three of the messages are staff sharing the CEO's email externally, with positive comments. One says: 'At least someone is actually talking to us.'

The Guardian journalist who messaged senior staff earlier today has not received a response from anyone.`,
      facilitatorNotes:
        `Atmospheric, no vote. This is the reward for good internal comms.

The number to notice: 22 messages versus 847. That is what happens when leadership fills the information vacuum before rumour does. The staff aren't happy, the systems are still down, payroll is still at risk, but they are informed, and informed people behave differently under pressure.

The Guardian journalist getting no response matters for Day 3. The 'inside source' story only runs when people inside feel their leadership has abandoned them.`,
      targetRoles: ["CEO", "CCO"],
      expectedKeywords: ["Slack", "22 messages", "Guardian", "staff", "email"],
      delayMinutes: 0,
      decisionOptions: [],
    },
    {
      id: "rwg-d2-staff-silence",
      commandTier: "STRATEGIC",
      storyTrack: "Staff not briefed",
      order: 175,
      scenarioDay: 2,
      scenarioTime: "18:00",
      title: "Day 2, 18:00: Someone Talked",
      isDecisionPoint: true,
      timerMinutes: 8,
      recapLine: "responded to the Guardian staff story by {{recapFragment}}",
      body: `Day 2, 18:00. The CCO has sent an urgent message.

The Guardian has called for a comment on a story they're publishing tonight. The piece is titled: 'Veridian Power staff: 36 hours without a word from the top.'

They have quotes from three employees. All anonymous. One says: 'We're reading about our own company on the BBC. Nobody has told us anything. I don't know if my job is safe. I don't even know if I should come in tomorrow.'

The story publishes at 20:00 unless the company provides a statement.`,
      facilitatorNotes:
        `This is the direct consequence of holding the internal comms. The story isn't about the breach, it's about the leadership response. That's a harder narrative to manage because it's about character, not incidents.

Ask: what does the CEO say to the Guardian in the next two hours? More importantly: what does the CEO say to staff before the Guardian story runs?

The most powerful move here. CEO email to all staff in the next 90 minutes, referencing the Guardian story directly, is also the hardest one to pull off. Push the CEO to draft the first paragraph out loud.`,
      targetRoles: ["CEO", "CCO"],
      expectedKeywords: ["Guardian", "staff", "email", "CEO", "statement", "90 minutes"],
      delayMinutes: 0,
      decisionOptions: [
        {
          key: "A",
          label:
            "CEO sends the all-company email now, references the Guardian story directly, and thanks staff for their patience.",
          consequence:
            "The email lands at 19:30. The Guardian publish anyway but include: 'In a late development, Veridian Power's CEO sent a company-wide message acknowledging the communications gap and thanking staff for their patience.' The story runs. It runs softer. The Slack thread drops from 800 messages a day to 40.",
          rank: 1,
          recapFragment: "the CEO sending the all-company email and referencing the Guardian story directly",
        },
        {
          key: "B",
          label:
            "Provide a statement to the Guardian but hold the all-company email until morning, one communication at a time.",
          consequence:
            "The Guardian run the story with the company statement as a footnote. Staff read the Guardian story before they receive anything from leadership. Three more employees contact the Guardian overnight. The Day 3 board call opens with a question from Caroline Wu about staff communications management.",
          rank: 2,
          recapFragment: "providing a Guardian statement but holding the internal email until morning",
        },
        {
          key: "C",
          label:
            "No comment to the Guardian. The story will run regardless, engaging legitimises it.",
          consequence:
            "The Guardian story runs without any company response. The piece includes: 'Veridian Power did not respond to requests for comment.' By midnight, 14 staff have shared the story internally. The CEO gets a message from the chairman at 23:00: 'We need to talk about internal communications first thing.'",
          rank: 3,
          recapFragment: "declining to comment on the Guardian story and providing no staff communication",
        },
      ],
    },
  ],
};