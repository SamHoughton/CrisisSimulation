import type { Scenario } from "@/types";

export const DEEPFAKE_SCENARIO: Scenario = {
  id: "tpl-deepfake-001",
  title: "The Deepfake CEO",
  description:
    "A hyper-realistic AI-generated video of your CEO making contemptuous, inflammatory statements goes viral at 06:04. Expanded 23-inject arc with 7 decision points and 4 score-routed endings. Tests crisis comms, identity verification, board governance, market integrity, employee welfare, forensics, and insider threat response: from first alert to long-term strategic recovery.",
  type: "SOCIAL_MEDIA_CRISIS",
  difficulty: "CRITICAL",
  durationMin: 180,
  isTemplate: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2026-04-14T00:00:00Z",
  coverGradient: "135deg, #1a0a2e 0%, #4a0080 50%, #E82222 100%",
  roles: ["CEO", "CCO", "CLO", "CISO", "CFO", "HR_LEAD"],
  regulatoryFrameworks: [
    "MAR (Market Abuse Regulation)",
    "FCA DTR 2.2",
    "NCSC Cyber Incident Management",
    "Companies Act 2006 s.172",
    "FCA SYSC 15A.2",
  ],
  realOutcome:
    "This scenario is fictional but draws on structural elements from the 2023 Ferrari CEO deepfake fraud attempt, the 2024 Arup Hong Kong BEC deepfake incident (HK$200M lost), and the coordinated short-selling disinformation campaigns documented by the FCA in 2024-25.",
  briefing:
    "You are the senior leadership team of Apex Dynamics plc, a FTSE 250 technology and professional services company with 8,000 employees globally and revenues of £2.1B. It is 06:04 on a Monday morning. Your social media listening tool has just fired an automated alert. A 47-second video of your CEO, posted from an account called @ApexLeaks, is going viral on X. In it, the CEO appears to deliver a contemptuous, abusive tirade: threatening mass layoffs in humiliating terms, disparaging two named enterprise clients by name, boasting about 'burying' regulators, and making crude personal attacks on a rival chief executive. The footage is forensically convincing. Your CEO is asleep, their phone is off, and their EA is trying to reach them. You have minutes before this becomes uncontrollable.",

  injects: [

    // ── ACT 1: THE UNKNOWN ─────────────────────────────────────────────
    // Four-way opening branch. Each option leads to a narrative inject
    // that plays out the consequences of that specific choice before the
    // paths converge again at df-i3.

    // ── INJECT 1: T+0. Video goes viral. Four-way branch. ──────────────
    {
      id: "df-i1",
      order: 0,
      scenarioDay: 1,
      scenarioTime: "06:04",
      title: "The Video Goes Viral",
      body: "06:04. The video has 340,000 views in 22 minutes and is trending #1 on X under #ApexCEO. Media outlets are running 'developing story' banners. Three FTSE 100 investors have already emailed Investor Relations. Your CEO's personal inbox is being flooded.\n\nThe footage is forensically convincing: off-the-shelf AI detectors return inconclusive results. The CEO's voice, mannerisms, and office background match perfectly. The CEO remains unreachable: phone off, EA trying every number.\n\nMarkets open in 2 hours 56 minutes. The team must decide how to respond before the story becomes the market open story.",
      facilitatorNotes:
        "This IS a deepfake. The CEO has been impersonated as part of a coordinated corporate espionage and short-selling operation: the team does not know this yet.\n\nOption C (measured holding statement) is the correct instinct: it buys time without lying and is legally defensible under DTR 2.2. Option A risks being catastrophically wrong if the video were real. Option B creates a dangerous vacuum the market will fill. Option D is an unorthodox but human move: the CLO should be furious.\n\nCoaching question: what is the asymmetry of being wrong in each direction? Getting a denial wrong is a career-ending error. Getting a holding statement wrong costs you 90 minutes.",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "VIRAL: 47-second video purportedly showing Apex Dynamics CEO in abusive tirade: 340,000 views in 22 minutes",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "SKY NEWS",
        tvHeadline: "APEX DYNAMICS CEO IN VIRAL SCANDAL - COMPANY YET TO RESPOND",
        tvTicker:
          "VIRAL: 340K views in 22 minutes. #ApexCEO trending #1 on X. Apex Dynamics shares pre-market: -4.1%. Markets open in 2h56m.",
        tvReporter: "LIVE - CITY OF LONDON",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CCO", "CLO"],
      expectedKeywords: ["deepfake", "verify", "statement", "legal", "forensic", "holding"],
      recapLine: "opened with {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Issue an immediate denial: 'This video is fabricated' - before any forensic confirmation",
          consequence:
            "Statement out in 11 minutes. If the video were real, this would be catastrophic and career-ending. The gamble pays off on authenticity grounds but the denial is aggressively questioned all morning.",
          rank: 4,
          recapFragment: "an immediate denial before forensics",
        },
        {
          key: "B",
          label: "Full silence: hold all public statements until forensic verification is complete (2-3 hours)",
          consequence:
            "The vacuum is filled by speculation. Two clients call to suspend contracts. Share price opens down 9.7%. Staff are in visible distress. The legally-safe choice is reputationally very expensive.",
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
          label: "Let the CEO's EA authorise a short personal statement from the CEO's family social account",
          consequence:
            "An unusual, humanising move. It works emotionally but bypasses the comms playbook entirely and exposes the CEO's family to scrutiny. Twitter sentiment warms slightly; legal counsel is furious.",
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

    // ── INJECT 1b: Board activates. Atmosphere beat, no vote. ──────────
    {
      id: "df-i1b",
      order: 3,
      scenarioDay: 1,
      scenarioTime: "06:11",
      title: "The Board Wakes Up",
      body: "06:11. While the leadership team is still debating its opening move, the board portal fires automatically. The governance machinery has been triggered by the social media alert reaching a threshold: a rule the Governance team quietly added after a regulatory review last year.\n\nThree of six board members have logged in within four minutes. One of them, Caroline Wu, the Non-Executive Director who chairs the Audit Committee, has already sent a message to the Chairman's mobile that the EA has just forwarded to the war room:\n\n'David: I assume we're monitoring this. I need to know within the hour: (1) is the company exposed to MAR disclosure obligations, (2) has legal privilege been established, (3) is there a board resolution process in place for emergency situations. I don't need to be in the room but I need answers. CW.'\n\nThe Chairman calls the CEO's office line.",
      facilitatorNotes:
        "No vote on this inject: it is a governance atmosphere beat. The purpose is to show that the board is NOT a passive spectator. They have automatic alert triggers and are already thinking about market abuse obligations independently of the exec team.\n\nCoaching: the Audit Committee chair is asking the right questions. Does the leadership team have answers? Has legal privilege been established over the forensics engagement? Is the company in a window where MAR Art. 17 requires disclosure?\n\nThis inject also surfaces a dynamic that often surprises exec teams: the board moves faster than expected and their first instinct is regulatory, not reputational.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Apex Dynamics board governance processes activate as video trends: no company statement yet",
      artifact: {
        type: "board_portal",
        boardPortalOrgName: "Apex Dynamics plc - Board Portal",
        boardPortalAlertCount: 1,
        boardPortalAlertTitle:
          "AUTOMATED ALERT: Social media crisis threshold triggered: Board briefing required",
        boardPortalMembers: [
          { name: "Sir David Ashworth", role: "Non-Executive Chairman", loggedInAt: "06:08", isOnline: true },
          { name: "Caroline Wu", role: "NED - Audit Committee Chair", loggedInAt: "06:09", isOnline: true },
          { name: "James Okafor", role: "NED - Remuneration Committee", loggedInAt: "06:12", isOnline: false },
          { name: "Priya Mehta", role: "NED - Risk Committee Chair", loggedInAt: undefined, isOnline: false },
          { name: "Caroline Merrick", role: "CEO (Executive)", loggedInAt: undefined, isOnline: false },
          { name: "Michael Chen", role: "CFO (Executive)", loggedInAt: "06:11", isOnline: true },
        ],
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CLO", "CFO"],
      expectedKeywords: ["board", "MAR", "legal privilege", "disclosure", "governance", "Caroline Wu"],
    },

    // ── INJECT 2a: Path A narrative. Denial under siege. ───────────────
    {
      id: "df-i2a",
      order: 10,
      scenarioDay: 1,
      scenarioTime: "07:00",
      title: "Path A - The Denial Is Questioned",
      body: "07:00. Your denial is being picked apart. A tech journalist has enhanced the audio and posted a thread saying it 'passes every AI-detection test I know of'. The @ApexLeaks account has vanished, but not before DMing the video to 22 journalists.\n\nAn FT reporter is demanding a named spokesperson on the record before 07:30, or the paper will run a piece with the headline 'Denial first, evidence later: the Apex Dynamics playbook'. Sky News now has the story running on a loop.\n\nThe CLO is quietly asking: if the forensic firm comes back and says the video is real, even at 10% probability, what is the company's legal position, having already issued a denial?",
      facilitatorNotes:
        "The group has taken a bold position without evidence. Keep them thinking about the cost of being wrong.\n\nThis is a narrative inject: no vote. All paths converge at df-i3. The facilitator should pressure the CCO on their talking points and the CLO on the legal exposure of a preemptive denial. The @ApexLeaks disappearing is a clue (it was a one-time attack account) but they don't have the forensics yet to use it.",
      delayMinutes: 0,
      timerMinutes: 6,
      tickerHeadline:
        "BREAKING: Apex Dynamics denial questioned: tech journalist says video 'passes every AI-detection test'",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "SKY NEWS",
        tvHeadline: "APEX DYNAMICS DENIES VIRAL VIDEO - TECH EXPERTS CHALLENGE CLAIM",
        tvTicker:
          "DEVELOPING: FT calls for spokesperson on record. Company issued denial without forensic confirmation. @ApexLeaks account deleted.",
        tvReporter: "LIVE - CANARY WHARF",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CCO", "CLO", "CEO"],
      expectedKeywords: ["denial", "FT", "evidence", "position", "forensic", "legal exposure"],
    },

    // ── INJECT 2b: Path B narrative. The silence deafens. ──────────────
    {
      id: "df-i2b",
      order: 10,
      scenarioDay: 1,
      scenarioTime: "07:45",
      title: "Path B - The Silence Deafens",
      body: "07:45. Nearly two hours of silence is being read by the market as confirmation. 240 staff have emailed HR asking for an emergency all-hands.\n\nThree of your largest enterprise clients have put morning meetings on hold. The Sunday Times website now leads with 'Apex Dynamics refuses to comment as viral CEO video spreads'. An FT op-ed has just gone live calling for a board statement within the hour.\n\nYour CEO is awake, incandescent, and wants to record a personal video from their kitchen 'right now'. Their exact words to the EA: 'Get me a phone. I am not going to let my company be destroyed by two minutes of silence.'",
      facilitatorNotes:
        "Silence has given the market free rein to fill the vacuum. The CEO's raw impulse to go live unprompted is high risk: a single fatigued or defensive word becomes the clip of the day.\n\nCoach the group: you can break the silence with a single sentence (internal first, then external) and still honour the forensics process. The CEO going kitchen-counter-live is a second crisis waiting to happen. The HR Lead and CCO need to be in that conversation.\n\nNarrative inject: no vote. All paths converge at df-i3.",
      delayMinutes: 0,
      timerMinutes: 6,
      tickerHeadline:
        "Apex Dynamics silent two hours as viral video spreads: share price opens down 9.7%",
      artifact: {
        type: "slack_thread",
        slackChannel: "#all-hands",
        slackMessages: [
          { author: "Priya Ramesh", role: "Eng Lead", time: "07:38", text: "Has anyone heard anything official? The video is everywhere and three of my team have messaged me asking if they should come in today." },
          { author: "Tom Whitfield", role: "Acct Exec", time: "07:40", text: "Two of my clients have emailed asking if the meetings this morning are still on. I don't know what to tell them." },
          { author: "Aisha Chowdhury", role: "People Ops", time: "07:42", text: "I am deeply upset by what I've seen. I need to know whether our leadership is taking this seriously. Silence is not a strategy." },
          { author: "Mark Harris", role: "Senior PM", time: "07:44", text: "The FT has just published an op-ed calling for the CEO to step aside pending investigation. Is comms planning to respond?" },
          { author: "Dani Bryant", role: "Designer", time: "07:45", text: "I love this company. Please, please say something. Anything. My mum saw the video and asked me why I still work here." },
        ],
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CCO", "HR_LEAD"],
      expectedKeywords: ["silence", "internal", "all-hands", "FT", "pressure", "CEO kitchen"],
    },

    // ── INJECT 2c: Path C narrative. The measured path holds. ──────────
    {
      id: "df-i2c",
      order: 10,
      scenarioDay: 1,
      scenarioTime: "07:20",
      title: "Path C - The Window Holds, Forensics Race",
      body: "07:20. Your measured holding statement is working. Media are covering the uncertainty angle: 'Company investigates viral CEO video'. The CEO has been reached, is calm, and is cooperating.\n\nYour CISO has engaged DeepDetect AI, a specialist forensic firm with FCA-recognised methodology. They have found early AI-generated audio artefacts in the first pass. ETA for full confirmation: 75 minutes.\n\nBut two complications have emerged: a campaigning journalist has published a thread accusing the company of running a 'cover-up playbook'. And a second deepfake, this one of your CFO announcing a fake £2.4B acquisition, has appeared on a financial forum and is being picked up by Bloomberg terminal users.",
      facilitatorNotes:
        "Path C is the most defensible position, legally and reputationally. The group is doing well.\n\nThe challenges now are: (1) internal comms: employees need something beyond a holding statement; (2) the CFO deepfake is a market abuse concern that may trigger separate FCA obligations; (3) the 'cover-up' narrative needs a proactive CCO strategy, not just reactive holding statements.\n\nNarrative inject: no vote. All paths converge at df-i3.",
      delayMinutes: 0,
      timerMinutes: 6,
      tickerHeadline:
        "Apex Dynamics investigation underway: authenticity disputed: CFO deepfake now also circulating on Bloomberg terminals",
      artifact: {
        type: "email",
        emailFrom: "forensics@deepdetect.ai",
        emailTo: "ciso@apexdynamics.com",
        emailSubject:
          "URGENT: Preliminary findings: AI-generated audio artefacts detected in CEO video: CFO video under review: ETA 75 minutes",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CISO", "CLO", "CCO", "HR_LEAD"],
      expectedKeywords: ["forensic", "employee comms", "CFO video", "cover-up narrative", "Bloomberg"],
    },

    // ── INJECT 2d: Path D narrative. The family statement gamble. ──────
    {
      id: "df-i2d",
      order: 10,
      scenarioDay: 1,
      scenarioTime: "07:15",
      title: "Path D - The Family Channel Lands",
      body: "07:15. The CEO's EA has posted a 180-character statement from the CEO's verified family account: 'I am aware of a video circulating that purports to show me. It is not me. I am safe, at home, with my family, and cooperating with my company and the authorities.'\n\nReaction is split. Sympathetic journalists are leading with 'CEO breaks silence from family home'. Hostile ones are calling it 'a bizarre sidestep of corporate process'.\n\nThe CLO is furious because the statement was never cleared with legal: if the video turned out to be real, a denial from the CEO's family account would be evidence of a coordinated cover-up. The CCO is processing it in real-time. It has 840,000 views in 15 minutes. The Chairman's EA has just called asking what the board should say.",
      facilitatorNotes:
        "This is an unorthodox but emotionally potent move. It humanises the CEO and breaks the vacuum with a low-stakes format.\n\nIt also bypasses the playbook and exposes the CEO's family. The CLO's anger is real: this could have been a disaster if the statement had been one word different. Push the group: is this a one-off or are they going to double down? How do they now fold the CLO back in?\n\nNarrative inject: no vote. All paths converge at df-i3.",
      delayMinutes: 0,
      timerMinutes: 6,
      tickerHeadline:
        "Apex Dynamics CEO breaks silence via family social account: 'It is not me': 840,000 views in 15 minutes",
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
      expectedKeywords: ["family account", "personal", "process", "legal", "humanise", "CLO"],
    },

    // ── INJECT 2v: Forensics early read. Tactical speed/confidence call.
    // All four Act 1 paths hit this before converging at df-i3.
    {
      id: "df-i2v",
      order: 15,
      scenarioDay: 1,
      scenarioTime: "07:50",
      title: "Forensics: Speed vs Confidence",
      body: "07:50. DeepDetect AI calls directly: 'We can give you a qualified preliminary read in five minutes at 84% confidence the video is AI-generated, or a final full-confidence report in ninety minutes at 99%+.'\n\nThe difference matters. Markets open in 70 minutes. The BBC needs a response in 55 minutes. Your CLO warns that a preliminary finding publicly announced and later contradicted would be 'genuinely career-ending'. Your CCO says the current silence is now visibly shaping the narrative against the company.\n\nNote: if the CFO deepfake is included, DeepDetect has only preliminary findings on that one: they need the same 90 minutes for full confidence.",
      facilitatorNotes:
        "Classic speed-vs-confidence tension. Option C (wait for full report, hold the line with measured language) is the textbook correct call: it preserves the option to respond definitively without risking a retraction.\n\nOption A (use preliminary internally only) is the strongest real-world compromise: internal leaders move with conviction while external messaging stays measured.\n\nOption B (release 84% figure publicly) is the tempting but riskiest option: an 84% claim cannot be walked back without severe credibility cost. The CLO's warning is the key signal.\n\nOption D (second independent pass) is a decent instinct applied at the wrong tempo.",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "Apex Dynamics forensic investigation underway: markets prepare to open: company yet to issue definitive statement",
      artifact: {
        type: "email",
        emailFrom: "lead@deepdetect.ai",
        emailTo: "ciso@apexdynamics.com",
        emailSubject:
          "URGENT: Preliminary read available NOW at 84% confidence. Final report ETA 90 minutes. Your call.",
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
            "The 90-minute wait is painful but disciplined. When the 99%+ report lands, Apex can move definitively and once. The BBC runs with 'company declines to speculate pending full forensic report': a defensible position.",
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
      scenarioDay: 1,
      scenarioTime: "08:15",
      title: "Convergence: Market Open and the CEO Returns",
      body: "08:15. Whatever path you took, the same three pressures have landed simultaneously.\n\nShare price is down 7.2% at open on volume five times normal. Three institutional investors are demanding a call with the Chairman before midday. The BBC, Sky News, FT and Bloomberg all have the story leading their markets coverage.\n\n340 staff have emailed HR asking for an all-hands. Your CEO is finally fully briefed and operational.\n\nForensics ETA: 45 minutes. The group now has to choose what to do in the next ten minutes.",
      facilitatorNotes:
        "This is the convergence point. Whatever happened in Act 1, the group now faces the same set of simultaneous pressures.\n\nNarrative inject: the decision lives in df-i3d. Use the timer to create urgency. The CEO being 'finally operational' is important: any failure to act is now on the room, not on an absent principal.",
      delayMinutes: 0,
      timerMinutes: 6,
      tickerHeadline:
        "Apex Dynamics shares fall 7.2% at open as institutional investors demand Chairman call",
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

    // ── INJECT 3b: LinkedIn problem. No vote. ───────────────────────────
    {
      id: "df-i3b",
      order: 23,
      scenarioDay: 1,
      scenarioTime: "08:52",
      title: "The LinkedIn Problem",
      body: "08:52. The CCO's phone buzzes. A notification from the social listening tool.\n\nDaniel Wright, Apex Dynamics' VP of Enterprise Sales (7,400 LinkedIn connections, primarily enterprise clients), has just posted publicly on LinkedIn. The post is well-intentioned: it defends the CEO's character with personal anecdotes and expresses pride in the company.\n\nIt has 1,200 likes in six minutes. Three enterprise clients have commented.\n\nThe problem: Wright's post names the two clients referenced in the deepfake video: 'I know Marcus at [Client A] and Sarah at [Client B] personally, and I know Caroline would never speak about them that way.'\n\nBoth clients did not know they had been named in the video until now. Client B's comms team has just called asking for a briefing. Wright is still in the building. His phone is off.",
      facilitatorNotes:
        "No vote on this inject: it is a well-intentioned-employee moment that creates a new problem.\n\nThis inject tests the CCO's instinct under fire. The post is genuine and human. It is also a disclosure problem: it has now confirmed to two enterprise clients that they were named in the deepfake, information the company had not yet decided how to handle.\n\nCoach: what does the CCO do first? (Call the clients directly, not through Wright.) What do they do about the post? (Do not ask him to take it down publicly: the delete would become the story.) What is the brief for the clients' comms teams?\n\nThis inject can be played quickly as a side problem that the CCO handles while the main crisis continues.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "Apex Dynamics VP LinkedIn post names enterprise clients referenced in deepfake: client comms teams seeking briefings",
      artifact: {
        type: "linkedin_post",
        linkedinAuthor: "Daniel Wright",
        linkedinAuthorTitle:
          "VP Enterprise Sales, Apex Dynamics | 17 years in enterprise technology | proud to work somewhere that values integrity",
        linkedinText:
          "I'm going to say something I don't usually say in public. I know the two clients mentioned in this video personally: Marcus and his team at [CLIENT A], and Sarah's team at [CLIENT B]. I've spent two decades building trust with people like them.\n\nI know Caroline Merrick. I know how she talks about clients, about our people, about our competitors. The version of Caroline in that video is not the person I have worked for and alongside for six years.\n\nI'm not speaking for the company. I'm speaking as someone who has sat across the table from our clients and knows what this company stands for.\n\nWe will get through this. And we'll get through it because the truth is the easiest thing in the world to defend.\n\n#ApexDynamics #Leadership #Integrity",
        linkedinLikes: 1247,
        linkedinComments: 89,
        linkedinShares: 44,
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CCO", "CLO", "CEO"],
      expectedKeywords: ["LinkedIn", "clients", "named", "disclosure", "Wright", "CCO", "delete"],
    },

    // ── INJECT 3d: Priority decision. 4 options, re-diverges. ──────────
    {
      id: "df-i3d",
      order: 22,
      scenarioDay: 1,
      scenarioTime: "08:20",
      title: "Priority Under Pressure",
      body: "08:20. The CEO turns to the room: 'We have ten minutes before the BBC piece drops. Who do we talk to first?'\n\nOn the table: staff (all-hands from the CEO), the national broadcaster (direct interview or statement), institutional investors (via Chairman), or a full handover of the crisis response to the external PR firm.\n\nEvery option has a cost. The CCO is watching the Twitter trend line. The HR Lead is watching their inbox refresh every 30 seconds. The Chairman has just texted the CEO: 'Whatever you decide, I need to know first. I have BlackRock on hold.'",
      facilitatorNotes:
        "Staff-first (A) is almost always the right move in a reputational crisis: long-term trust compounds faster than short-term share price damage.\n\nMedia-first (B) is defensible if the group genuinely has a message ready, but often they don't. Investors-first (C) is a classic financial-crisis answer that feels 'professional' but optically cold. External-PR handover (D) is abdication.\n\nOptions A/B route to df-i4a (staff-led narrative); C/D route to df-i4b (market-led narrative).",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "Apex Dynamics leadership team prioritises response as institutional investors press for contact",
      artifact: {
        type: "sms_thread",
        smsParticipants: ["BBC Business Desk", "CEO"],
        smsMessages: [
          { sender: "BBC Business Desk", text: "Marcus Reilly, BBC Business. Deadline 08:45 for on-record response on Apex CEO video. We have the story regardless. Would the CEO or CCO be available for a 90-second direct statement?", time: "08:17" },
          { sender: "BBC Business Desk", text: "Also: can you confirm whether the FCA has been notified of the CFO video and any potential market-moving disinformation? That line is going in the piece regardless.", time: "08:21" },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "HR_LEAD", "CCO", "CFO"],
      expectedKeywords: ["all-hands", "BBC", "investors", "chairman", "priority", "internal", "PR firm"],
      recapLine: "prioritised {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Staff first: CEO records a two-minute all-hands video and sends it company-wide before any external statement",
          consequence:
            "Morale stabilises within the hour. Union reps hold off a public statement. Investor calls later in the morning land on firmer internal ground. The long game is being played well.",
          rank: 1,
          recapFragment: "staff first with a CEO all-hands",
        },
        {
          key: "B",
          label: "Media first: CEO gives a tight 90-second on-the-record statement to the BBC before the 08:45 deadline",
          consequence:
            "The BBC piece is balanced. The CEO comes across as composed. But 240 staff later say 'we heard it from the BBC before we heard it from our CEO' and the internal trust cost lingers.",
          rank: 2,
          recapFragment: "media first with the BBC",
        },
        {
          key: "C",
          label: "Investors first: Chairman-led call with the top three institutional holders before any public statement",
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
      scenarioDay: 1,
      scenarioTime: "08:45",
      title: "Path: Staff-Led Recovery",
      body: "08:45. The internal comms landed well. A two-minute video from the CEO has been watched by 6,200 of 8,000 staff within thirty minutes. The Slack mood has shifted from panic to cautious solidarity.\n\nExternal pressure is still intense: the BBC story is running, the FT has a long read in progress, and the CFO deepfake is now spreading on finance forums. But your people are holding together.\n\nA senior engineer in Edinburgh has just posted a widely-shared thread defending the CEO's integrity with specific examples. A client who had cancelled a morning meeting has rebooked for this afternoon, with a note: 'We wanted to see how you handled it.'",
      facilitatorNotes:
        "Staff-led paths look slow on paper but they compound. This narrative inject is meant to show the group that the choice they made is paying off in ways they cannot always measure.\n\nBe careful not to overplay the victory: the CFO deepfake and the forensics question still loom. The LinkedIn complication inject (df-i3b) arrives next. This is a breather, not a resolution.",
      delayMinutes: 0,
      timerMinutes: 6,
      tickerHeadline:
        "Apex Dynamics staff rally behind CEO as internal video circulates: CFO deepfake complication emerges",
      artifact: {
        type: "slack_thread",
        slackChannel: "#all-hands",
        slackMessages: [
          { author: "Priya Ramesh", role: "Eng Lead", time: "08:42", text: "Just watched the CEO video. That was a human response. I am not going anywhere. If any of my team need to talk today my door is open." },
          { author: "Tom Whitfield", role: "Acct Exec", time: "08:43", text: "Two of my three clients have just reconfirmed this morning's meetings. One said: 'we just wanted to see how you were going to handle it'." },
          { author: "Mark Harris", role: "Senior PM", time: "08:44", text: "Engineering and product are both holding together. If the forensics come back soon we'll be fine." },
          { author: "Aisha Chowdhury", role: "People Ops", time: "08:45", text: "Thank you for the video. Really. Please keep communicating: don't go quiet again." },
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
      scenarioDay: 1,
      scenarioTime: "08:45",
      title: "Path: Market-Led Recovery",
      body: "08:45. The institutional investor calls went well. Share price has ticked back up to -5.4% from the open low. The BBC ran the story with a brief company statement from the PR firm.\n\nBloomberg picked up the line: 'Apex Dynamics: fully investigating; no staff action in contemplation.'\n\nBut your internal metrics are worrying: the #all-hands Slack channel has gone quiet in a bad way. 40 more staff have submitted sick-day requests since 08:00. The union rep is drafting a statement that begins: 'The leadership has prioritised the market over its people.' The CFO deepfake has just appeared on a finance forum.",
      facilitatorNotes:
        "Market-led paths look decisive in the moment but can corrode trust. This narrative inject is meant to show the group that share-price stabilisation has come at a cost.\n\nThe union rep drafting a statement is the key detail: in the next few hours, the group will have to win back the internal room. Do not let the group conclude they made the wrong call: this is a trade-off, not a failure. But they need to be honest about the cost.",
      delayMinutes: 0,
      timerMinutes: 6,
      tickerHeadline:
        "Apex Dynamics shares recover partially after Chairman-led investor call: BBC runs PR firm statement",
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
      scenarioDay: 1,
      scenarioTime: "09:05",
      title: "BlackRock Calls The Chairman Directly",
      body: "09:05. The Chairman has just been called on his mobile by the lead portfolio manager at BlackRock, your third-largest institutional shareholder (6.4% of the register).\n\nHis message is short: 'I need 20 minutes with the top of the house at 09:30 to hear this directly. I can do it privately, or I can do it on a group call with Legal & General and Aviva: they've both asked me the same thing.'\n\nThe Chairman has come back to the room. 'I can do one thing at 09:30, not two. Or we try to thread it. How do we handle this?' Share price is down 6.8% and the order book is thin. Investor relations are watching.",
      facilitatorNotes:
        "This is a genuine judgement call with defensible answers in every direction, which is why it matters for a vote.\n\nOption C (CEO takes BlackRock at 09:30 alone; Chairman runs L&G + Aviva group at 10:15) is the best balance: the biggest holder gets the principal, the others get the Chairman. But A, B and D are all defensible. Push the group to articulate what each holder actually needs right now, not just what is procedurally clean.\n\nThis is a good test of the CFO's investor relations knowledge: what is BlackRock's typical posture in a crisis? Do they sell quickly or hold to engage? The answer changes the optimal response format.",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "Apex Dynamics institutional holders request urgent engagement as shares trade down 6.8%",
      artifact: {
        type: "email",
        emailFrom: "mark.holloway@blackrock.com",
        emailTo: "chairman@apexdynamics.com",
        emailSubject:
          "Urgent: request for 09:30 call. L&G and Aviva have asked the same. Your call on format.",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CFO", "CCO"],
      expectedKeywords: ["BlackRock", "chairman", "shareholder", "group call", "private", "priority", "CEO"],
      recapLine: "handled the shareholders by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Chairman takes BlackRock privately at 09:30. Individual follow-ups with L&G and Aviva through the morning.",
          consequence:
            "BlackRock feels handled. L&G takes the follow-up well. Aviva is polite but notes they were 'second in the queue' in a later analyst note. Clean but slightly hierarchical.",
          rank: 3,
          recapFragment: "sending the Chairman to BlackRock alone",
        },
        {
          key: "B",
          label: "Single group call at 10:15 with all three lead portfolio managers, Chairman chairing.",
          consequence:
            "Efficient and fair. But the personal tone everyone came for is missing. BlackRock's PM arrives 40 seconds late and the first two minutes are formalities. Competent but cold.",
          rank: 2,
          recapFragment: "running a single group call",
        },
        {
          key: "C",
          label: "CEO takes BlackRock at 09:30 alone. Chairman runs the group call at 10:15 with L&G and Aviva.",
          consequence:
            "The biggest holder gets the CEO individually. The other two get the Chairman in a format that respects their seniority. By 11:00 all three have issued private 'supportive but watching' notes. Best balance.",
          rank: 1,
          recapFragment: "splitting CEO and Chairman across the three",
        },
        {
          key: "D",
          label: "Written briefing pack sent to all three at 09:30; offer individual calls later in the day.",
          consequence:
            "Procedurally clean but emotionally wrong. BlackRock's PM takes it as a brush-off and calls a peer at a competitor firm to compare notes. The call that eventually happens is tense.",
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
      scenarioDay: 1,
      scenarioTime: "08:55",
      title: "The Personal Cost",
      body: "08:55. The CEO's EA steps in quietly and closes the door.\n\nThe CEO's 14-year-old daughter has just been sent home from school after classmates played the video to her in the corridor and filmed her reaction. She is in tears in the car. The CEO's phone is ringing: their daughter is calling.\n\nAt the same moment, the Head of HR reports that a colleague in Finance has asked to take the day off: she is 'not sure she wants to come back to an office where people might look at her and think of that video'.\n\nThe CEO turns to the room and asks, quietly: 'What do I do?'",
      facilitatorNotes:
        "This inject is deliberately not a vote. It is a character test.\n\nThe purpose is to surface the human dimensions that crisis playbooks almost always underweight. Well-run teams will pause and acknowledge this. Poorly-run teams will treat it as a distraction from the 'real crisis'.\n\nPush the group: how does the CEO show up for their family AND the company in the next ten minutes? What does the HR Lead do for the colleague in Finance? This is where leadership either earns or loses long-term trust. There is no right operational answer: only a leadership one.",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "Reports emerge of Apex Dynamics staff distress as deepfake video circulates on school social media",
      artifact: {
        type: "voicemail",
        voicemailCaller: "Jess Okafor - Head of HR",
        voicemailCallerNumber: "+44 7700 900498",
        voicemailDuration: "0:52",
        voicemailTime: "08:51",
        voicemailTranscript:
          "Caroline, it's Jess. I'm going to say this quietly because I don't want to walk into the war room with it. Your EA just told me about your daughter. I'm so sorry. I want you to know: whatever you need to do in the next ten minutes, do it. We will hold the room. Also: we have a colleague in Finance who's in tears at her desk. And two members of my own team. This crisis has a human weight that's going to be felt more and more today. I just want you to know I see it. Call me when you can.",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "HR_LEAD", "CCO"],
      expectedKeywords: ["empathy", "family", "staff welfare", "personal", "leadership", "human"],
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
      scenarioDay: 1,
      scenarioTime: "09:30",
      title: "Forensic Vindication: Both Videos Confirmed Deepfakes",
      body: "09:30. DeepDetect AI have delivered the final report. Both the CEO and CFO videos are AI-generated. Voice synthesis fingerprints, facial mapping artefacts, identical infrastructure signature. The technical report is publishable and FCA-admissible.\n\nMore significantly, your CISO has separately uncovered something explosive: 840,000 Apex Dynamics put options were quietly purchased through three nominee accounts in the 48 hours before the videos dropped. Notional value approximately £18M. The trading pattern points to a coordinated short-selling attack, possibly tied to a corporate intelligence firm operating out of an offshore cluster.\n\nYou now hold the vindication. The question is how you spend it.",
      facilitatorNotes:
        "The vindication moment. The forensic report is unambiguously good news, but the short-selling angle is difficult: it is potentially criminal, incendiary if announced publicly, and could compromise an FCA or SFO investigation.\n\nOption B (publish forensics + private FCA brief) is the textbook correct call: it maintains the narrative win, gives investigators what they need without tipping the attacker, and protects the company from accusations of selective disclosure.\n\nOption A is dramatic and tempting but risks the FCA telling you to stand down. Option C introduces MAR selective disclosure risk. Option D wastes the most compelling part of the story.\n\nAll four branches converge to df-i6 where they discover the attacker had inside help.",
      delayMinutes: 0,
      timerMinutes: 12,
      tickerHeadline:
        "BREAKING: Forensic firm confirms both Apex Dynamics CEO and CFO videos as AI-generated deepfakes",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "SKY NEWS",
        tvHeadline: "APEX DYNAMICS: FORENSIC FIRM CONFIRMS CEO AND CFO VIDEOS ARE AI DEEPFAKES",
        tvTicker:
          "SKY NEWS BUSINESS - APEX DYNAMICS DEEPFAKE CONFIRMED - SHARES RECOVER 4% - FCA REPORTEDLY MONITORING UNUSUAL OPTIONS ACTIVITY - CEO TO MAKE STATEMENT",
        tvReporter: "Ian Whitfield, Sky News Business, City of London",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "CCO", "CISO"],
      expectedKeywords: ["publish", "forensic", "short selling", "FCA", "law enforcement", "narrative", "options"],
      recapLine: "played the vindication by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Publish the forensics AND publicly accuse a coordinated short-selling attack at a press conference",
          consequence:
            "Maximum drama. The story flips overnight. But within two hours the FCA contacts the CLO formally, asking the company to cease all public speculation as it may compromise their investigation. The CEO has to walk back publicly.",
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
            "The FT and Bloomberg run favourable pieces within an hour. But by Day 2 the FCA is asking whether the off-record briefing constituted selective disclosure under MAR. A second-order legal headache.",
          rank: 3,
          recapFragment: "briefing the FT and Bloomberg off-record first",
        },
        {
          key: "D",
          label: "Publish only the technical forensics; say nothing publicly about the short-selling angle at all",
          consequence:
            "Safe. Defensible. But journalists notice the absence and start asking 'who benefited from this attack?' independently. Within 24 hours half the financial press is speculating without your facts. You lose the most compelling part of the story.",
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

    // ── INJECT 5b: FCA Market Oversight confirms case opened. No vote. ──
    {
      id: "df-i5b",
      order: 43,
      scenarioDay: 1,
      scenarioTime: "09:52",
      title: "The FCA Confirms It Is Watching",
      body: "09:52. Twenty-two minutes after the forensic report was shared publicly, a submission confirmation appears on the FCA's Market Oversight portal.\n\nYour CISO's team submitted the short-selling evidence package: trading timestamps, nominee account clusters, the put-option position size, through the FCA's formal intelligence reporting channel at 09:48.\n\nThe portal has just returned a case reference and the status has moved to UNDER_REVIEW with a named Market Oversight officer assigned.\n\nThe CISO forwards it to the CLO with one line: 'We are on the record. They are moving. Do not say anything else publicly about the options until they advise.'",
      facilitatorNotes:
        "No vote: this is a confirmation beat. The regulator_portal artifact shows the FCA machinery engaging. The purpose is to make the FCA's involvement feel real and procedural, not abstract.\n\nCoaching point: being first to report to the FCA, before the FCA comes to you, is materially different in regulatory terms. The CLO's instruction to stay quiet is correct. Ask the group: what is the difference between a proactive FCA submission and a reactive one? How does that affect the cooperation argument later?\n\nThis inject only plays naturally when the team took Option B on df-i5. If they took Option D (stayed silent), the facilitator should note that this submission still happened, but that the FCA's posture will be different because the company wasn't also publicly leading the narrative.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline:
        "FCA Market Oversight confirms monitoring of Apex Dynamics options trading pattern: case opened",
      artifact: {
        type: "regulator_portal",
        regulatorName: "Financial Conduct Authority - Market Oversight",
        regulatorPortalUrl: "fca.org.uk/market-intelligence",
        regulatorCaseRef: "FCA-MKT-2026-11847",
        regulatorStatus: "UNDER_REVIEW",
        regulatorSubmittedAt: "Monday 14 April 2026 at 09:48 UTC",
        regulatorDeadline: "FCA to respond within 5 business days under SYSC 18.6",
        regulatorOfficerName: "D. Marchetti, Market Oversight - Financial Crime Intelligence",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CLO", "CISO", "CFO", "CEO"],
      expectedKeywords: ["FCA", "Market Oversight", "options", "submission", "cooperation", "under review"],
    },

    // ── INJECT 6: Copycat + internal leak (narrative convergence) ───────
    {
      id: "df-i6",
      order: 45,
      scenarioDay: 1,
      scenarioTime: "11:45",
      title: "The Picture Sharpens: A Rival Is Hit, And A Door Was Left Open",
      body: "11:45. Two things land in the same fifteen minutes.\n\nFirst: your CISO's contact at Helix Corp, a major rival, calls in confidence. A less-polished deepfake of their CEO has just begun circulating on Reddit. Same voice-cloning signature, same distribution vector, same offshore infrastructure.\n\nSecond: while reviewing access logs, your CISO's team has identified the source of the leaked investor day footage used to train the voice model. It came from a personal encrypted drive belonging to a senior communications manager who is currently in the building. The footage was copied 10 days ago.\n\nThe two pieces snap together: the attacker had inside help, and they are now hunting other targets. The room goes very quiet.",
      facilitatorNotes:
        "This is the narrative pivot from 'we are the victim' to 'we are part of a wider attack with an internal dimension'. No decision point here on purpose: the group needs a beat to absorb both shocks.\n\nInformally push: how do they want to handle Helix? (Right answer: via NCSC, never directly.) How do they handle the comms manager? (Preserve evidence first, brief police Economic Crime Unit, do NOT confront yet.)\n\nThese are not voted on, but they colour the df-i6a decision. If the group rushes a confrontation, flag it: that is the mistake that ruins an otherwise strong endgame.",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "Second FTSE 250 firm reportedly hit by similar AI deepfake attack: common infrastructure signature identified",
      artifact: {
        type: "internal_memo",
        memoTitle: "CONFIDENTIAL: ATTRIBUTION BRIEF - TWO FINDINGS - EYES ONLY",
        memoClassification: "STRICTLY CONFIDENTIAL - LEGAL PRIVILEGE - NOT FOR DISTRIBUTION",
        memoTo: "CEO, CLO, CFO",
        memoFrom: "CISO - Technical Intelligence",
        memoDate: "Monday 14 April 2026 - 11:43",
        memoRef: "APEX-CISO-2026-IR-007",
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
      scenarioDay: 1,
      scenarioTime: "12:15",
      title: "Two Fronts, Thirty Minutes",
      body: "12:15. Two clocks are running simultaneously.\n\nFirst: the Helix CISO is waiting on a response. Bloomberg is going to print a 'second FTSE 250 company may have been hit' piece at 13:30 whether you engage or not.\n\nSecond: HR has just flagged that your comms manager booked a 16:00 train to Edinburgh at 11:58 for 'a personal matter'. Their laptop is still on their desk. Nobody has confronted them.\n\nThe CLO, CISO and Head of HR are in the room. They keep looking at each other and then at you. They need a decision in the next fifteen minutes.\n\nThe CLO's final word before the door closed: 'Whatever we pick, we pick both at once. They interact. A fast decision on one and a slow decision on the other will cost us.'",
      facilitatorNotes:
        "Coupling decision: both problems need handling in the same window and the way you handle one shapes the other.\n\nOption A (NCSC for Helix, police-led remote evidence preservation, no confrontation) is textbook correct: it keeps both processes clean. Option C is a decent second-best (trades some evidential cleanliness for operational control). Option B is emotionally satisfying but forfeits the device evidence. Option D is the fear-response option.\n\nAsk the group: what do they want the headline of this day to be? 'Apex helped expose a market disinformation attack' or 'Apex suspended an employee'? That shapes the endgame.",
      delayMinutes: 0,
      timerMinutes: 12,
      tickerHeadline:
        "Bloomberg preparing second FTSE 250 deepfake story; Apex Dynamics internal investigation continues",
      artifact: {
        type: "slack_thread",
        slackChannel: "dm: CLO to CEO",
        slackMessages: [
          { author: "CLO", role: "direct message", time: "12:12", text: "Time pressure on two fronts. Need to know how to play both before 12:30." },
          { author: "CLO", role: "direct message", time: "12:13", text: "Helix: NCSC is the clean channel. Direct contact risks coordination accusation later. But Helix CISO is waiting right now and Bloomberg goes at 13:30 either way." },
          { author: "CLO", role: "direct message", time: "12:14", text: "Comms manager: if we suspend now, personal devices leave at 16:00. If we involve the ECU first, we can preserve those devices remotely and interview with police present. Stronger case. But 48-72 hours." },
          { author: "CLO", role: "direct message", time: "12:15", text: "Whatever we pick, we pick both at once. Cannot have a fast decision on one and a slow decision on the other: they interact." },
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
            "The NCSC opens a coordinated advisory within the hour. Economic Crime Unit briefed, manager's devices preserved remotely, formal interview with police present on Day 4. Strongest legal and reputational position.",
          rank: 1,
          recapFragment: "routing Helix via NCSC and preserving evidence remotely",
        },
        {
          key: "B",
          label: "Direct informal call to Helix's CISO. Suspend the comms manager immediately, search their desk before 16:00.",
          consequence:
            "Helix moves fast but the informal contact is later flagged by the FCA during disclosure review. The manager's personal devices leave the building with them at 16:00. Police note the missed opportunity.",
          rank: 3,
          recapFragment: "calling Helix informally and suspending on the spot",
        },
        {
          key: "C",
          label: "NCSC for Helix. Hold the comms manager in the building on a pretext (urgent client call) while police move into position.",
          consequence:
            "Helix cleanly handled. Manager retained on plausible grounds. Police arrive at 14:30 and secure personal devices. Small legal risk if the pretext is later framed as detention.",
          rank: 2,
          recapFragment: "routing Helix via NCSC and holding the manager in-building",
        },
        {
          key: "D",
          label: "Decline Helix outreach on legal advice. Suspend the comms manager immediately and call police after.",
          consequence:
            "Helix struggles without context. Industry later notes Apex's caution as 'unhelpful'. Manager's devices leave the building. Police interview on Day 4 without personal devices. Weakest outcome on both fronts.",
          rank: 4,
          recapFragment: "declining Helix and suspending before police were in place",
        },
      ],
      branches: [
        { optionKey: "A", nextInjectId: "df-i6-strong" },
        { optionKey: "B", nextInjectId: "df-i6-weak" },
        { optionKey: "C", nextInjectId: "df-i6-strong" },
        { optionKey: "D", nextInjectId: "df-i6-weak" },
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
      scenarioDay: 2,
      scenarioTime: "09:15",
      title: "Day 2: The Clean Hand",
      body: "Day 2, 09:15. You walk into the boardroom with something you didn't have yesterday: a clean evidential trail.\n\nOvernight, the Economic Crime Unit secured the comms manager's personal devices remotely: laptop, two phones, an old tablet still logged into a personal Gmail. The interview happened at 07:30 with two officers and your CLO present. The manager has not been charged but is cooperating, and has already named the offshore PR firm that paid them.\n\nThe CLO slides a single-page summary across to you: 'This is the version of this story we want the FCA to read first. We control the disclosure. We can go to them this morning before they come to us.'\n\nSky News has the arrest as their 09:00 headline. Critically: the Apex name is not in it yet. You have a choice about how the next 24 hours play out, and for once you have the strong position.",
      facilitatorNotes:
        "Pure narrative bridge: no decision required. This inject only fires for groups that handled df-i6a well (options A or C).\n\nReward the clean play. The participants should feel the difference between this Day 2 opening and the alternative one. The 'name not in the headline yet' line is the key beat: good decisions yesterday bought them the option to lead the disclosure rather than react to it.",
      delayMinutes: 0,
      timerMinutes: 3,
      tickerHeadline:
        "Sky News: Economic Crime Unit makes arrest in alleged FTSE 250 disinformation case: company not yet named",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "SKY NEWS",
        tvHeadline: "ARREST IN FTSE 250 DEEPFAKE PROBE - INSIDER LINK SUSPECTED",
        tvTicker:
          "SKY NEWS - ECONOMIC CRIME UNIT CONFIRMS OVERNIGHT ARREST - SUSPECT BELIEVED TO BE EMPLOYEE OF AFFECTED FTSE 250 FIRM - COMPANY NOT YET NAMED - INVESTIGATION ONGOING",
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
    // comms manager has retained counsel overnight, personal devices gone,
    // police frustrated, FCA cooperation case materially weaker
    // going into the endgame.
    {
      id: "df-i6-weak",
      order: 49,
      scenarioDay: 2,
      scenarioTime: "09:15",
      title: "Day 2: The Mess You're In",
      body: "Day 2, 09:15. You walk into the boardroom and the CLO does not look up.\n\nThey slide a single sheet across to you: 'We have a problem from yesterday. The comms manager left the building at 16:08 with their personal devices. They retained criminal counsel by 19:00. As of 06:00 their solicitor has informed us they will be making no statement and any further contact must go through the firm.'\n\n'The Economic Crime Unit are still working with us but they are, and I quote, frustrated. Without the personal devices the case is largely circumstantial. The FCA will see the same set of facts and they will see that we suspended an employee before involving police, which weakens our cooperation argument.'\n\n'The disclosure is going to be reactive, not proactive. We are still in the game but we are in it on the back foot.'\n\nOutside the window, the share price shows a small bounce. It will not last.",
      facilitatorNotes:
        "Pure narrative bridge: no decision required. This inject only fires for groups that handled df-i6a poorly (options B or D).\n\nDo not soften it. The participants need to feel the cost of yesterday's call before they make today's endgame decision. The CLO's frustration is the key beat: a competent senior person telling the room, in plain language, that they have been put in a worse position by an avoidable choice.",
      delayMinutes: 0,
      timerMinutes: 3,
      tickerHeadline:
        "Apex Dynamics suspends senior communications manager amid internal investigation: police inquiries continuing",
      artifact: {
        type: "slack_thread",
        slackChannel: "dm: CLO to CEO",
        slackMessages: [
          { author: "CLO", role: "direct message", time: "08:42", text: "Reading you in before the 09:15. The personal devices are gone. Counsel was retained by 19:00 last night. We will not get a voluntary interview." },
          { author: "CLO", role: "direct message", time: "08:43", text: "ECU view: case is still live but circumstantial. They asked, politely, why we didn't loop them in before suspending. I don't have a good answer." },
          { author: "CLO", role: "direct message", time: "08:44", text: "FCA cooperation argument is weaker. We can still play it but we're reacting to the disclosure cycle, not driving it. We need to plan for that this morning." },
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
      scenarioDay: 2,
      scenarioTime: "16:00",
      title: "The Endgame: How Do You Want This Story To End?",
      body: "Day 2, 16:00. The first 36 hours are over.\n\nThe forensics are public. The Helix link is being quietly worked through NCSC channels. The internal leak investigation is sealed with the police. Share price has clawed back to -3.1% from the worst point.\n\nThe narrative is moving in your favour but it is not yet decided. Three things have just landed on your desk simultaneously:\n\nFirst: the government's AI Safety Institute has invited the CEO to chair a new working group on AI disinformation in financial markets.\n\nSecond: your law firm has drafted a pre-emptive defamation lawsuit against the offshore intelligence firm believed to be behind the attack.\n\nThird: your PR firm has prepared a 'minimal disclosure, recovery posture' brief that they say will let the company quietly move on within six weeks.\n\nThe CEO turns to the room and asks: 'How do you want this story to end?'",
      facilitatorNotes:
        "This is the endgame, but note the scoring model: the ending you see is decided by the compound rank average across ALL decisions in the session. This one is a tiebreaker, not the sole decider.\n\nThresholds: avg rank ≤1.6 = TRIUMPH, ≤2.3 = RECOVERY, ≤3.0 = DIMINISHED, >3.0 = CATASTROPHIC.\n\nOption A is 'lead from the front': almost always the right long-game choice. Option D (lawsuit) is almost always wrong: it gives the attacker a free platform and forces evidence into discovery. Use the debrief to trace which earlier decisions did the most to earn the ending the group received.",
      delayMinutes: 0,
      timerMinutes: 15,
      tickerHeadline:
        "Apex Dynamics weighs response strategy as AI Safety Institute extends invitation: legal options under review",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "FT LIVE",
        tvHeadline: "APEX DYNAMICS: FROM TARGET TO TEST CASE - WHAT WILL THE BOARD DO NEXT?",
        tvTicker:
          "FT LIVE - APEX DYNAMICS RECOVERS TO -3.1% - AI SAFETY INSTITUTE INVITATION - HELIX CORP CONFIRMS SIMILAR ATTACK - LEGAL ACTION REPORTEDLY UNDER CONSIDERATION - INDUSTRY WATCHES",
        tvReporter: "Helena Marsh, Financial Times Live",
      },
      isDecisionPoint: true,
      branchMode: "score",
      targetRoles: ["CEO", "CLO", "CCO", "CFO", "CISO"],
      expectedKeywords: ["AI Safety Institute", "transparency", "lawsuit", "recovery", "leadership", "long game"],
      recapLine: "and closed the endgame by {{recapFragment}}",
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
        { optionKey: "D", nextInjectId: "df-end4", scoreMax: 99 },  // CATASTROPHIC
      ],
    },

    // ── ENDING 1: TRIUMPH ───────────────────────────────────────────────
    {
      id: "df-end1",
      order: 60,
      scenarioDay: 42,
      title: "Ending: The Industry Test Case",
      body: "Six weeks later.\n\nShare price closed yesterday at +1.8% YTD, ahead of the FTSE 250. The CEO chairs the AI Safety Institute working group on financial-markets disinformation; the Helix CEO joined as deputy chair. The Apex incident report is being studied at three business schools and was referenced in a Lords Select Committee report on AI and market integrity.\n\nThe comms manager is awaiting trial. The offshore intelligence firm has been named in a joint UK-US enforcement action.\n\nLast night the CEO was named an FT Person of the Year runner-up. The citation: 'Integrity, when paired with disclosure, compounds.'\n\nOne last vote. Looking back over the whole exercise: which earlier call did the most to earn this ending?",
      facilitatorNotes:
        "Best possible ending. Reward the long-game choice but do not narrate the through-line yourself: the reflection vote is designed to make the group find it.\n\nMost groups land on a combination of: the early staff-first call (df-i3d), the disciplined forensics handling (df-i2v / df-i5), and the courage of the endgame. Use the vote split as your debrief opener.",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "Apex Dynamics CEO named FT Person of the Year runner-up after landmark AI disinformation response",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "SKY NEWS",
        tvHeadline: "APEX DYNAMICS CEO NAMED FT PERSON OF THE YEAR RUNNER-UP - 'INTEGRITY WHEN PAIRED WITH DISCLOSURE COMPOUNDS'",
        tvTicker:
          "SKY NEWS - APEX DYNAMICS +1.8% YTD - AI SAFETY INSTITUTE WORKING GROUP CONVENES - COMMS MANAGER AWAITING TRIAL - JOINT UK-US ENFORCEMENT ACTION ANNOUNCED - GRADUATE HIRING AT FIVE-YEAR HIGH",
        tvReporter: "Ian Whitfield, Sky News Business",
      },
      isDecisionPoint: true,
      isEnding: true,
      targetRoles: ["CEO", "CCO", "CISO", "HR_LEAD"],
      expectedKeywords: ["transparency", "leadership", "long game", "industry", "trust"],
      decisionOptions: [
        { key: "A", label: "The early staff-first instinct" },
        { key: "B", label: "The disciplined forensics handling: speed vs confidence" },
        { key: "C", label: "The clean police-led leak investigation" },
        { key: "D", label: "The endgame courage to lead from the front" },
      ],
    },

    // ── ENDING 2: RECOVERY ──────────────────────────────────────────────
    {
      id: "df-end2",
      order: 60,
      scenarioDay: 42,
      title: "Ending: Quiet Competence",
      body: "Six weeks later.\n\nShare price is back within 1.2% of pre-attack levels. Internal remediation is on track and the comms manager has been charged.\n\nThe CEO declined the AI Safety Institute invitation; the chair was taken by a rival firm's CFO, now the public face of the issue.\n\nAt last week's board meeting, an independent director asked whether Apex 'might have done more with the moment'. There was a long silence. The CEO said: 'Probably. But we're here, and the lights are on.' Nobody challenged it. Nobody quite endorsed it.\n\nOne last vote. Was 'quiet competence' the right call for this company?",
      facilitatorNotes:
        "The 'good but not great' ending. Recovery achieved, but the closing image: the silent boardroom, is the point.\n\nThe reflection vote is a forced-choice debrief tool: groups that chose this path often defend it, which is fine, but make them articulate the trade-off they consciously accepted.",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "Apex Dynamics shares recover to within 1.2% of pre-attack levels as company completes internal remediation",
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
      isEnding: true,
      targetRoles: ["CEO", "CFO", "CISO", "HR_LEAD"],
      expectedKeywords: ["recovery", "remediation", "missed opportunity", "quiet competence"],
      decisionOptions: [
        { key: "A", label: "Yes: recovery is the win" },
        { key: "B", label: "Yes for this team, but a sharper comms function would change the answer" },
        { key: "C", label: "No: we left credibility on the table" },
        { key: "D", label: "No: the silent boardroom is the real ending" },
      ],
    },

    // ── ENDING 3: DIMINISHED ────────────────────────────────────────────
    {
      id: "df-end3",
      order: 60,
      scenarioDay: 42,
      title: "Ending: The Long Shadow",
      body: "Six weeks later.\n\nShare price is still down 6.4% YTD, lagging the FTSE 250 by nine points. Two institutional investors have publicly downgraded, citing 'concerns about communications maturity'.\n\nThree senior executives have resigned in the last month, all citing some version of 'I'm no longer sure what we stand for'. The Sunday Times ran an 8,000-word account of the crisis titled 'The company that survived a deepfake attack and still lost'.\n\nAt Davos last week, the Helix CEO referred to 'one peer in our sector that chose to look away'. Everyone in the room knew who he meant.\n\nOne last vote. Where did this story actually go wrong?",
      facilitatorNotes:
        "The 'fear ending': and it is meant to bite. The company is not destroyed but it is materially worse off, and the damage is invisible from the inside until too late.\n\nThe reflection vote forces the group to locate the wound. Most groups land on D once they trace the cascade: which is the lesson.",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline:
        "Sunday Times: 'The company that survived a deepfake attack and still lost': Apex Dynamics analysis",
      artifact: {
        type: "news_headline",
      },
      isDecisionPoint: true,
      isEnding: true,
      targetRoles: ["CEO", "CCO", "CFO"],
      expectedKeywords: ["minimal disclosure", "long shadow", "identity", "trust erosion", "missed opportunity"],
      decisionOptions: [
        { key: "A", label: "The early under-communication to staff" },
        { key: "B", label: "The cautious forensics handling: waiting too long" },
        { key: "C", label: "The minimal-disclosure brief at the endgame" },
        { key: "D", label: "All of the above, compounding silently" },
      ],
    },

    // ── ENDING 4: CATASTROPHIC ──────────────────────────────────────────
    {
      id: "df-end4",
      order: 60,
      scenarioDay: 42,
      title: "Ending: The Counter-Attack That Backfired",
      body: "Six weeks later.\n\nThe defamation lawsuit was counter-filed within 48 hours. Discovery forced internal Day 1 messages onto the FT front page, including executives speculating that the video might be 'closer to the truth than we're admitting'. The statement was ambiguous: it didn't mean the video was real; it meant execs were privately afraid. But it read catastrophically in print.\n\nThe FCA has opened a parallel investigation into Apex's own conduct around the period of the short-selling discovery. Share price is down 22% YTD. Two NEDs have resigned.\n\nLast night, the CLO who had advised against the lawsuit said only one thing before leaving the room: 'I told you so.'\n\nOne last vote. If you could rewind 48 hours, where would you intervene?",
      facilitatorNotes:
        "Worst ending. Pre-emptive litigation in a reputational crisis is almost always wrong: it gives the attacker a free platform and forces evidence into discovery.\n\nDon't shame the D-vote groups; use the reflection vote to make them articulate the exact moment they would replay. Often the right answer is not the lawsuit itself, but the defensive posture that made the lawsuit feel inevitable.",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline:
        "Apex Dynamics shares close -22% as FCA opens parallel investigation following lawsuit disclosure leak",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "BBC NEWS",
        tvHeadline: "APEX DYNAMICS LAWSUIT BACKFIRES - INTERNAL MESSAGES LEAKED - SHARES DOWN 22% - CHAIRMAN UNDER PRESSURE",
        tvTicker:
          "BBC NEWS BUSINESS - APEX DYNAMICS -22% YTD - FCA OPENS PARALLEL INVESTIGATION - TWO NEDS RESIGN - PROXY ADVISORS RECOMMEND AGAINST CEO CONTRACT RENEWAL - LAWSUIT COUNTER-FILED",
        tvReporter: "Marcus Reilly, BBC News, Westminster",
      },
      isDecisionPoint: true,
      isEnding: true,
      targetRoles: ["CEO", "CLO", "CFO", "CCO"],
      expectedKeywords: ["lawsuit", "backfire", "discovery", "FCA", "reputational collapse", "defensive"],
      decisionOptions: [
        { key: "A", label: "Refuse the lawsuit, take the AI Safety Institute role instead" },
        { key: "B", label: "Refuse the lawsuit, take the quiet recovery posture" },
        { key: "C", label: "Lock down internal comms before any external action" },
        { key: "D", label: "Different choices much earlier in the day" },
      ],
    },
  ],
};
