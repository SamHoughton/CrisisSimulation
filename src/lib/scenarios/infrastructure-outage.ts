import type { Scenario } from "@/types";

export const INFRASTRUCTURE_OUTAGE_SCENARIO: Scenario = {
  id: "tpl-infrastructure-outage-001",
  title: "Infrastructure: The Window",
  description:
    "At 07:43 on a Monday morning, month-end with 60,000 salary payments due at 09:00, Clearpoint Bank's cloud-native core banking platform goes dark after a vendor applies an emergency patch without completing change control. Covers operational resilience obligations, PRA notification timing, vendor management, branch cash access, media and regulatory escalation, and customer remediation.",
  type: "INFRASTRUCTURE_OUTAGE",
  difficulty: "CRITICAL",
  durationMin: 180,
  isTemplate: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2026-04-14T00:00:00Z",
  coverGradient: "135deg, #0a0a1a 0%, #001a0a 40%, #00b37d 100%",
  regulatoryFrameworks: [
    "PRA Operational Resilience SS1/21",
    "FCA SYSC 15A",
    "Payment Services Regulations 2017",
    "FCA Consumer Duty",
    "FCA BCOBS",
  ],
  realOutcome:
    "This scenario draws on three real UK banking failures: the TSB migration disaster of 2018, a series of Nationwide IT incidents in 2022 and 2023, and the broader pattern of UK retail banks' dependency on a small number of third-party core banking vendors.\n\nIn TSB's case, a botched migration to a new core banking platform locked out over 1.9 million customers for several weeks, triggered a wave of fraud, and ultimately resulted in the FCA fining TSB £48.7 million in 2022: the largest operational resilience fine levied against a UK bank at the time. The TSB CEO resigned. Parliamentary committees took evidence. The vendor, Sabis, faced scrutiny it had never anticipated from a UK audience.\n\nThe PRA's operational resilience policy statement SS1/21 now requires all UK banks to set measurable impact tolerances for their important business services, including retail payments, and to demonstrate they can remain within those tolerances during a severe but plausible disruption. Firms that cannot do so must set out a credible remediation plan.\n\nThe critical lesson from real incidents is not the technical failure itself. It is the customer communication decision: specifically, when to publish a public outage notice and whether to give a specific estimated time of restoration. In the TSB incident, the decision to downplay the severity in early communications made the eventual scale of the failure land far harder in the press and in Parliament. Several firms that communicated plainly and early, including some that suffered longer outages, retained customer trust in ways TSB did not. The narrative was set by what the board said in the first two hours, not by what the engineers did in the first two days.",

  roles: ["CEO", "CFO", "CISO", "CLO", "COO", "CCO"],
  briefing:
    "You are the executive leadership team of Clearpoint Bank plc, a UK retail bank with 600,000 customers, 140 branches, and a FTSE SmallCap listing (CLRP.L). Eighteen months ago, you completed a £47 million digital transformation onto a cloud-native core banking platform provided by NexCore Systems, a US-headquartered vendor. It was supposed to be the future. It is now 07:43 on a Monday morning, month-end. Sixty thousand salary payments are scheduled to process at 09:00. Your online banking is down. Your mobile app is down. Your CHAPS rails are dark. The IT monitoring team is paging the COO. NexCore applied an emergency security patch at 07:38, without completing your change control process, and the database cluster has cascaded into failure. You have 77 minutes before 60,000 of your customers do not get paid. The 140 branch managers, 600,000 customers, and the PRA are all about to learn what it means to bank on a platform you do not control.",

  injects: [

    // ── ACT 1: DETECTION ──────────────────────────────────────────────────────

    {
      id: "io-i01",
      commandTier: "BRONZE",
      order: 0,
      scenarioDay: 1,
      scenarioTime: "07:43",
      title: "SIEM: Cascading Database Failure - NexCore UK-PROD",
      body: "07:43. The COO's pager fires. The SIEM is showing a cascading failure across all three database replica nodes in CORE-DB-CLUSTER-01, the NexCore UK-PROD environment that runs every critical banking system Clearpoint operates. Node 1 failed at 07:41:52. Node 2 at 07:42:08. Node 3 at 07:43:01. There is no quorum. Online banking, mobile app, CHAPS payment rails, internal branch systems, and Direct Debit processing have all dropped. The monitoring console shows 47 dependent services in a critical state. Month-end salary processing is scheduled to begin at 09:00. The last successful system heartbeat was 07:38, four minutes before the cluster began to fail.",
      facilitatorNotes:
        "This is a pure scene-setter: no decision, no vote. Give participants 2 minutes to absorb the artifact and orient. Prompt them: what do you know? What do you not know? Who owns this? The absence of an obvious cyber threat here is deliberate: this is an operational failure, and the temptation to treat it as a cyber incident should be resisted until more information arrives. The COO and CISO should be talking to each other immediately. The CEO does not need to be woken yet: that is a facilitator discussion point, not a decision vote.",
      delayMinutes: 0,
      tickerHeadline: "Clearpoint Bank CLRP.L | pre-market: no alerts | month-end trading session opens 08:00",
      artifact: {
        type: "siem_alert",
        siemAlertId: "CLR-SIEM-2026-00841",
        siemSeverity: "CRITICAL",
        siemSourceIp: "10.200.41.1 / 10.200.41.2 / 10.200.41.3 (CORE-DB-CLUSTER-01 / NexCore UK-PROD)",
        siemEventType: "Database Cluster Quorum Loss: All Replica Nodes Down, 47 Dependent Services Critical",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["COO", "CISO"],
    },

    {
      id: "io-i02",
      commandTier: "SILVER",
      order: 5,
      scenarioDay: 1,
      scenarioTime: "07:51",
      title: "NexCore First Contact - 'Resolved Within 30 Minutes'",
      body: "07:51. An email arrives from Priya Mehta, NexCore UK Support Lead, to the Clearpoint IT Director and COO: 'We are aware of an issue following an emergency security patch applied at 07:38 to the UK-PROD environment. The patch was applied in response to an NCSC advisory issued at 07:15. We are investigating the root cause and expect resolution within 30 minutes. We apologise for the disruption.' There is no mention of change control. The NCSC advisory reference number given is NCSC-ALT-2026-1142. The Clearpoint change control log shows no NexCore emergency patch request received today. The emergency change control process requires a minimum 2-hour notice period even for critical patches, with written sign-off from the Clearpoint IT Director. That process was not followed.",
      facilitatorNotes:
        "Option A (escalate to NexCore CEO) is aggressive but defensible. The CLO should flag it as potentially relevant to later breach-of-contract arguments; however, it may not get the outage fixed faster. Option C (activate internal IR) is the best call right now, because the internal response cannot wait for NexCore. Option B (wait 30 minutes) is the natural instinct and the most dangerous: every tabletop after TSB showed teams defaulting to vendor-optimism bias. Option D (notify PRA now) is premature at 07:51; the PRA notification question comes properly in inject 3. Push the team: what does 'monitoring' actually mean in practice? Who is doing what while you wait?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "Clearpoint Bank systems | no public statement issued | social media quiet at 07:51",
      artifact: {
        type: "internal_memo",
        memoTitle: "NexCore Systems: Incident Communication 07:51",
        memoClassification: "INTERNAL: INCIDENT RESPONSE",
        memoFrom: "Priya Mehta, UK Support Lead, NexCore Systems",
        memoTo: "D. Okafor, IT Director; L. Brennan, COO, Clearpoint Bank plc",
        memoDate: "Monday 14 April 2026, 07:51",
        memoRef: "NXC-INC-2026-UK-0049",
      },
      isDecisionPoint: true,
      targetRoles: ["COO", "CISO", "CLO", "CEO"],
      expectedKeywords: ["incident", "change control", "NexCore", "escalate", "activate", "IR", "PRA"],
      recapLine: "responded to NexCore's first contact by choosing {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Escalate directly to NexCore's CEO now: demand a Global Incident Commander on a call within 15 minutes",
          consequence:
            "NexCore's CEO is asleep in Boston. You reach an escalation manager within 22 minutes. It signals seriousness but does not accelerate the technical fix. The CLO quietly notes the call record for later contract proceedings.",
          rank: 3,
          recapFragment: "direct CEO-level escalation to NexCore",
        },
        {
          key: "B",
          label: "Monitor: hold the 30-minute window and await NexCore's next update before taking further action",
          consequence:
            "At 08:21 NexCore say they need another 60 minutes. You have lost 30 minutes of your internal response window. The salary payments deadline is now 39 minutes away and you have no parallel workstream running.",
          rank: 4,
          recapFragment: "waiting for NexCore's 30-minute window",
        },
        {
          key: "C",
          label: "Activate the internal incident management team immediately: stand up the war room, do not wait for NexCore",
          consequence:
            "The right call. Your internal IR process runs in parallel with NexCore's fix attempt. By 08:10 the war room has identified the payment contingency routes, briefed the contact centre, and begun drafting a customer statement, regardless of when NexCore restore.",
          rank: 1,
          recapFragment: "activating the internal incident management team",
        },
        {
          key: "D",
          label: "Notify the PRA immediately: they need to hear about this from you, not the press",
          consequence:
            "The CLO will later note this was 9 minutes too early: the scope is not yet confirmed. The PRA acknowledge receipt but ask you to call back with impact figures. You have used the PRA's time without the information they need. The formal notification question returns in inject 3.",
          rank: 3,
          recapFragment: "an immediate PRA notification before scope was confirmed",
        },
      ],
    },

    {
      id: "io-i03",
      commandTier: "GOLD",
      order: 10,
      scenarioDay: 1,
      scenarioTime: "08:05",
      title: "PRA Notification Window - Two-Hour Clock",
      body: "08:05. The CLO, Rachel Winters, has sent an urgent message to the COO and CEO: 'Under PRA SS1/21 and FCA SYSC 15A, we are required to notify the PRA of a major operational incident within 2 hours of becoming aware. Our awareness time is 07:43. Our notification deadline is 09:43. I need a decision on timing. Notifying early, before we have full scope, is permitted and signals good culture. Waiting until 09:30 is a calculated risk. Notifying at the deadline is defensible only if we have a clear reason for the delay. I have the PRA's operational incident reporting portal open.' It is 08:05. You have 22 minutes before the salary payments are due to fail.",
      facilitatorNotes:
        "This is the inject where CLOs often shine and CEOs often want to defer. The right answer is Option A: early voluntary notification before full scope is known. The PRA published clear guidance after TSB that firms which notified early, even with incomplete information, were treated more favourably than firms that waited. Option B is understandable but sets up a crunch at 09:30 when the team will be dealing with the payment failure simultaneously. Option C (deadline-only) is a red flag for the PRA. Option D (legal advice first) sounds prudent but burns 30-40 minutes during which the clock continues running. The CLO should know this law cold.",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "PRA guidance: firms must report major operational incidents within 2 hours | reminder issued January 2026",
      artifact: {
        type: "internal_memo",
        memoTitle: "PRA SS1/21: Notification Obligation, Urgent",
        memoClassification: "STRICTLY CONFIDENTIAL: LEGAL PRIVILEGE",
        memoFrom: "Rachel Winters, Chief Legal Officer, Clearpoint Bank plc",
        memoTo: "CEO; COO; CISO",
        memoDate: "Monday 14 April 2026, 08:05",
        memoRef: "CLRP-LEGAL-2026-0412",
      },
      isDecisionPoint: true,
      targetRoles: ["CLO", "CEO", "COO"],
      expectedKeywords: ["PRA", "SS1/21", "notification", "2 hours", "SYSC", "early", "scope"],
      recapLine: "decided on PRA notification by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Notify the PRA now: voluntary early notification with what we know, flag that scope is still being assessed",
          consequence:
            "The PRA acknowledge at 08:14 and assign a named supervisor. In the post-incident review the PRA note the early notification as evidence of a good operational resilience culture. The firm is not penalised for incomplete initial information.",
          rank: 1,
          recapFragment: "filing an early voluntary notification with the PRA",
        },
        {
          key: "B",
          label: "Wait until scope is confirmed: target 09:30 notification once the payment failure picture is clear",
          consequence:
            "At 09:30 the team is simultaneously dealing with 60,000 failed payments, a contact centre in crisis, and a BBC inquiry. The PRA notification is filed late and with less care than it deserved. The PRA later ask why the delay.",
          rank: 2,
          recapFragment: "holding for a 09:30 notification once scope was confirmed",
        },
        {
          key: "C",
          label: "Notify at the 09:43 deadline only: comply with the letter of the obligation, no earlier",
          consequence:
            "The notification arrives at the deadline with the system still down and the press already running the story. The PRA's supervision team note in writing that the bank 'chose the deadline over early engagement.' This language appears in the final supervisory review.",
          rank: 4,
          recapFragment: "notifying at the two-hour deadline and no earlier",
        },
        {
          key: "D",
          label: "Take external legal advice first: do not notify until counsel has reviewed the obligation",
          consequence:
            "External counsel is reachable by 08:30. Their advice is: notify now. You have spent 25 minutes confirming what the CLO already knew. The notification goes in at 08:35, well within the window, but the delay was unnecessary.",
          rank: 3,
          recapFragment: "taking external legal advice before notifying",
        },
      ],
    },

    {
      id: "io-i04",
      commandTier: "SILVER",
      order: 15,
      scenarioDay: 1,
      scenarioTime: "08:12",
      title: "Customer Communications - Three Drafts on the Table",
      body: "08:12. The Head of Customer Communications, Tom Bassett, has brought three draft statements to the war room. Draft A reads: 'We are experiencing a systems issue affecting online banking and payments. We are working to resolve this. We will provide updates every 30 minutes. We apologise to all customers affected.' Draft B reads: 'Some customers may be experiencing difficulty accessing services. We are investigating and will provide updates shortly.' Draft C is a holding statement for internal use only: no public communication until an ETA is known. It is 08:12. The mobile banking app has been down for 29 minutes. No public statement has been issued. There is no ETA. Twitter is quiet. For now.",
      facilitatorNotes:
        "Option A is the right call. It commits to a 30-minute update cadence, which is achievable and forces the team to maintain discipline. It is transparent without promising a fix time that does not exist. Option B is the weakest: 'some customers may be experiencing difficulty' is demonstrably false when the whole system is down, and it will read as dishonest the moment anyone checks. Option C (hold until ETA is known) is the TSB mistake in its purest form. If no ETA is known for 90 minutes, customers have been in the dark for 90 minutes. Option D (branches first) sounds customer-centric but takes time and delays the digital audience who will find out via social media before any branch manager has been briefed. Ask the CCO: what is the cost of saying nothing for the next hour if the hashtag starts trending?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "Clearpoint Bank | no public statement on systems | first customer posts beginning to appear",
      isDecisionPoint: true,
      targetRoles: ["CCO", "CEO", "COO"],
      expectedKeywords: ["statement", "communicate", "customers", "30 minutes", "transparency", "social media", "ETA"],
      recapLine: "chose the customer communications approach of {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Post Draft A: transparent status update now with a 30-minute update commitment",
          consequence:
            "The statement goes live at 08:19. Customer complaints on social media initially spike but settle because there is something to respond to. The 30-minute cadence forces internal discipline. Later analysis shows this decision materially limited the social media escalation.",
          rank: 1,
          recapFragment: "a transparent public statement with a 30-minute update cadence",
        },
        {
          key: "B",
          label: "Post Draft B: a brief holding message that does not commit to update timing",
          consequence:
            "The vague language reads as evasive within 20 minutes as customers can see from their own screens that the app is completely down, not partially disrupted. The gap between what is said and what is visible erodes trust before the outage is even an hour old.",
          rank: 3,
          recapFragment: "a vague holding message without an update commitment",
        },
        {
          key: "C",
          label: "Hold all public communications until an ETA is known",
          consequence:
            "By 09:30, when an ETA finally arrives, there are 4,100 customer tweets and the BBC has already filed an inquiry. The silence has been interpreted as contempt. The CCO will spend the next 48 hours apologising for the silence as much as the outage.",
          rank: 4,
          recapFragment: "holding all public communications until an ETA was known",
        },
        {
          key: "D",
          label: "Brief the 140 branch managers first before any public digital communication",
          consequence:
            "Branch managers are briefed by 08:40. By that point the hashtag #ClearpointDown is already trending and branch staff are being asked about it by customers queuing outside. The sequence is inverted: the digital audience knew before the branches did.",
          rank: 2,
          recapFragment: "briefing branch managers before issuing any public statement",
        },
      ],
    },

    {
      id: "io-i05",
      commandTier: "GOLD",
      order: 20,
      scenarioDay: 1,
      scenarioTime: "09:00",
      title: "09:00 - Salary Payments Fail",
      body: "09:00. An email from the Payments Operations team lands in the war room: 'Confirmed: 60,000 Direct Debit salary payment instructions have failed to process. The batch ran at 09:00:00 as scheduled and returned 60,000 individual rejections within 4 seconds: the payment gateway has no connection to core banking. The processing window has now passed. These payments will not be re-attempted automatically. Manual reprocessing will require system restoration first. We have never failed on payday. I do not have words for this.' The email is from Helen Marsh, Head of Payments Operations, and was sent at 09:04. It is month-end. These are 60,000 people's salaries.",
      facilitatorNotes:
        "No decision here. Let the weight of this land. Give the room 2-3 minutes of silence if needed. The facilitator should then prompt: who does each role think is now responsible for contacting those 60,000 customers? What is the plan for the people whose mortgage direct debit was going to come out of that salary today? Who is the most vulnerable person in that cohort? This inject is designed to shift the room from 'systems problem' to 'human problem'. That shift is necessary for everything that follows.",
      delayMinutes: 0,
      tickerHeadline: "Clearpoint Bank | reports of payment failures emerging | social media volume rising",
      artifact: {
        type: "email",
        emailFrom: "h.marsh@clearpointbank.co.uk",
        emailTo: "war-room@clearpointbank.co.uk",
        emailSubject: "URGENT: 60,000 salary payment failures confirmed, batch ref CLRP-DD-20260414-0900",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CFO", "COO", "CCO"],
    },

    // ── ACT 2: ESCALATION ─────────────────────────────────────────────────────

    {
      id: "io-i06",
      commandTier: "SILVER",
      order: 22,
      scenarioDay: 1,
      scenarioTime: "09:41",
      title: "Contact Centre - 11,000 Calls in 40 Minutes",
      body: "09:41. A voicemail from Sandra Obi, Contact Centre Director, left for the COO 4 minutes ago: 'It's Sandra. I need you to listen carefully because I am going to lose my voice. We have taken 11,000 inbound calls in 40 minutes. Average wait time is 34 minutes. My agents have no more information than the customers calling them. Two agents have had customers in tears on the phone about mortgage payments and rent. One customer said she has no food in the house and her salary was supposed to be there this morning. I am asking my team to hold a line they cannot hold. I need a script. I need an ETA. I need both in the next 20 minutes or I am going to lose people.' The contact centre has 180 agents on shift.",
      facilitatorNotes:
        "This inject is designed to test whether the CCO and COO have thought about second-order impacts. The contact centre cannot be fixed by giving agents a better script if the underlying information does not exist. The coaching question: what can you tell agents that is true, specific, and does not promise something you cannot deliver? The CCO should be drafting a script right now. The answer is not 'we are working on it': that is what agents are already saying. The answer is: what do we know, what do we not know, and when will we next communicate.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "#ClearpointDown | trending UK | 'My salary hasn't arrived' | customer posts accelerating",
      artifact: {
        type: "voicemail",
        voicemailCaller: "Sandra Obi, Contact Centre Director",
        voicemailCallerNumber: "+44 7700 900341",
        voicemailDuration: "1:02",
        voicemailTime: "09:37",
        voicemailTranscript: "It's Sandra. I need you to listen carefully because I am going to lose my voice. We have taken eleven thousand inbound calls in forty minutes. Average wait time is thirty-four minutes. My agents have no more information than the customers calling them. Two agents have had customers in tears on the phone about mortgage payments and rent. One customer said she has no food in the house and her salary was supposed to be there this morning. I am asking my team to hold a line they cannot hold. I need a script. I need an ETA. I need both in the next twenty minutes or I am going to lose people.",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["COO", "CCO"],
    },

    {
      id: "io-i07",
      commandTier: "SILVER",
      order: 25,
      scenarioDay: 1,
      scenarioTime: "09:48",
      title: "#ClearpointDown - Trending",
      body: "09:48. The hashtag #ClearpointDown is trending in the UK. A tweet from @RachelT_London, with 11,400 followers, has been retweeted 3,200 times in the last 22 minutes: 'Clearpoint Bank have not paid my salary. I have a mortgage payment going out today. I have been on hold for 40 minutes. THIS IS MY MONEY. Do better. #ClearpointDown'. Sky News has sent a press inquiry. The BBC has sent a press inquiry. ITV Money has sent a press inquiry. The Guardian personal finance desk has sent a press inquiry. The communications team has not yet issued a second statement since the opening one.",
      facilitatorNotes:
        "The tweet is not from a journalist: it is from a real customer with real reach. The room should notice the difference between a media problem and a genuine customer harm problem that has now become a media problem. The CCO needs to decide whether to respond directly to the tweet (risky, as it can escalate), issue the next 30-minute update now (ahead of schedule because the situation has changed), or do both. The CEO needs to decide whether they are now 'on camera'. The wrong answer is to wait.",
      delayMinutes: 0,
      tickerHeadline: "#ClearpointDown trending UK | 3,200 retweets in 22 minutes | BBC / Sky / ITV press inquiries received",
      artifact: {
        type: "tweet",
        tweetHandle: "@RachelT_London",
        tweetDisplayName: "Rachel T",
        tweetLikes: 8700,
        tweetRetweets: 3200,
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CCO", "CEO"],
    },

    {
      id: "io-i08",
      commandTier: "SILVER",
      order: 28,
      scenarioDay: 1,
      scenarioTime: "10:04",
      title: "NexCore ETA Miss Number One",
      body: "10:04. The Clearpoint CEO, James Cordell, has been texting NexCore's UK Director, Sean Hargreaves, for the last 20 minutes. At 08:15 NexCore said restoration by 08:45. At 09:30 they said restoration by 10:00. At 10:02, Hargreaves sends: 'Revised ETA 10:30. Confident. We have identified a secondary complication during the rollback process but we are through the worst of it.' Cordell replies: 'Sean, you said 08:45, then 09:30, now 10:30. What has materially changed?' Hargreaves: 'We identified a secondary issue in the rollback that was not visible in our staging environment. We are addressing it now.' The 60,000 salary payments are sitting on a queue that cannot process until core banking is restored.",
      facilitatorNotes:
        "Option A (contingency payment route) is the right call. The Faster Payments workaround is real: many banks maintain an emergency payment route precisely for this scenario, though it is slower and more expensive. Option B (continue waiting) is vendor-optimism bias: they have missed three ETAs. Option C (global CTO demand) is compatible with A and should be done in parallel, not instead of. Option D (press release blaming vendor) is the worst call at this stage: it will damage the vendor relationship at the moment you still need them to fix the system, and it invites a counter-narrative from NexCore. Ask the CFO: what is the cost differential of the Faster Payments contingency route versus waiting another 90 minutes?",
      delayMinutes: 0,
      timerMinutes: 12,
      tickerHeadline: "Clearpoint Bank | no restoration update | payments queue unresolved | analysts watching",
      artifact: {
        type: "sms_thread",
        smsParticipants: ["James Cordell, CEO", "Sean Hargreaves, NexCore UK Director"],
        smsMessages: [
          { sender: "James Cordell, CEO", text: "Sean, we need a confirmed restoration time now. Not an estimate. What is the picture?", time: "09:44" },
          { sender: "Sean Hargreaves, NexCore UK Director", text: "Working it, James. On track for 10:00. Very confident.", time: "09:47" },
          { sender: "James Cordell, CEO", text: "You said 08:45. Then 09:30. Now 10:00. What has changed?", time: "09:51" },
          { sender: "Sean Hargreaves, NexCore UK Director", text: "Revised ETA 10:30. Confident. Secondary complication during rollback, but we are through the worst of it.", time: "10:02" },
          { sender: "James Cordell, CEO", text: "That is three missed ETAs. What materially changed between 09:30 and 10:02?", time: "10:04" },
          { sender: "Sean Hargreaves, NexCore UK Director", text: "Secondary issue in the rollback not visible in staging. Addressing now. 10:30 is firm.", time: "10:06" },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "COO", "CFO"],
      expectedKeywords: ["contingency", "Faster Payments", "workaround", "NexCore", "CTO", "missed ETA"],
      recapLine: "responded to the third missed ETA by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Activate the contingency payment processing route: Faster Payments workaround, up to 40,000 payments, higher unit cost",
          consequence:
            "The contingency route processes 38,000 of the 60,000 payments by 11:45. The remaining 22,000 require manual batch processing once core banking is restored. The cost uplift is £140,000. The COO calls it the best £140,000 the bank has ever spent.",
          rank: 1,
          recapFragment: "activating the Faster Payments contingency route",
        },
        {
          key: "B",
          label: "Continue holding for NexCore: their ETA is 90 minutes and triggering contingency will complicate the reconciliation",
          consequence:
            "10:30 passes without restoration. 11:00 passes. NexCore update their ETA to 14:00 at 11:45. Every hour of delay is another hour of customer harm and another hour of contact centre deterioration.",
          rank: 4,
          recapFragment: "waiting for NexCore's next ETA rather than activating contingency",
        },
        {
          key: "C",
          label: "Demand NexCore's Global CTO joins the call within 30 minutes: the UK director does not have sufficient authority",
          consequence:
            "NexCore's Global CTO, Dana Reeves, is reached at 10:41. She provides more technical detail but no faster resolution. The call is useful for the later vendor review. It should have been done in parallel with A, not instead of it.",
          rank: 2,
          recapFragment: "demanding NexCore's Global CTO on a call",
        },
        {
          key: "D",
          label: "Issue a press release naming NexCore as responsible for the outage: the public deserves to know who failed",
          consequence:
            "NexCore's legal team call within 45 minutes. The media angle becomes 'bank blames vendor' rather than 'bank fixes problem'. NexCore's CTO privately tells Cordell that public attribution will slow cooperation. The CLO begins drafting a withdrawal notice.",
          rank: 3,
          recapFragment: "publicly blaming NexCore in a press statement",
        },
      ],
    },

    {
      id: "io-i09",
      commandTier: "SILVER",
      order: 32,
      scenarioDay: 1,
      scenarioTime: "10:22",
      title: "Manchester Deansgate - Customers Queuing, Safe Question",
      body: "10:22. A voicemail from David Kim, branch manager at Manchester Deansgate, Clearpoint's fourth-largest branch, left for the COO: 'David Kim, Manchester Deansgate. I have approximately 60 people queuing on the pavement before we opened this morning. I now have the branch full and more outside. Customers are asking for cash. The branch systems are partially down. I can see some account balances but cannot process transactions normally. I have three elderly customers who cannot access any money. One says she has no cash at home. She is asking me, personally, if she can have enough to buy food today. I know the policy says no emergency cash releases without full system access. But I am standing in front of her. Do I open the safe?'",
      facilitatorNotes:
        "This is the FCA Consumer Duty decision in human form. Option A (discretionary emergency cash with identity checks) is the right call: Consumer Duty requires firms to act in the genuine interest of customers, and leaving elderly customers without food money because the policy manual says so would be a stark failure of that duty. Option B (normal process only) ignores Consumer Duty. Option C (close branches) will generate photographs of Clearpoint locking its doors on payday: do not do this. Option D (direct to other ATMs) is the right supplementary action but is not a substitute for doing something for the person standing in front of the branch manager right now. The COO should also be thinking: who else in those 140 branches is about to face this same question?",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline: "Clearpoint Bank branches | customers queuing | reports of elderly customers unable to access cash",
      artifact: {
        type: "voicemail",
        voicemailCaller: "David Kim, Branch Manager, Manchester Deansgate",
        voicemailCallerNumber: "+44 7700 900198",
        voicemailDuration: "1:14",
        voicemailTime: "10:22",
        voicemailTranscript: "David Kim, Manchester Deansgate. I have approximately sixty people queuing on the pavement before we opened this morning. I now have the branch full and more outside. Customers are asking for cash. The branch systems are partially down. I can see some account balances but cannot process transactions normally. I have three elderly customers who cannot access any money. One says she has no cash at home. She is asking me, personally, if she can have enough to buy food today. I know the policy says no emergency cash releases without full system access. But I am standing in front of her. Do I open the safe?",
      },
      isDecisionPoint: true,
      targetRoles: ["COO", "CCO", "CEO"],
      expectedKeywords: ["Consumer Duty", "emergency", "cash", "branch", "elderly", "vulnerable", "identity"],
      recapLine: "handled the branch cash access question by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Authorise emergency discretionary cash access for customers in genuine need: identity checks required, amounts capped at £200",
          consequence:
            "140 branch managers receive a clear instruction within 15 minutes. The branch network handles approximately 840 emergency cash requests during the outage period. The FCA later notes this as a concrete demonstration of Consumer Duty in action.",
          rank: 1,
          recapFragment: "authorising emergency cash access for customers in genuine need",
        },
        {
          key: "B",
          label: "Tell branches to remain open but follow normal process only: no cash releases without full system access",
          consequence:
            "Three branches report that elderly customers were turned away without access to money. Photographs of queuing customers are taken outside Deansgate and used in the BBC report at 13:30. The FCA Consumer Duty assessment notes the policy rigidity during a vulnerable customer moment.",
          rank: 3,
          recapFragment: "maintaining normal process only and making no emergency cash releases",
        },
        {
          key: "C",
          label: "Close branches temporarily to manage customer expectations and reduce reputational exposure",
          consequence:
            "Images of closed Clearpoint branches on payday appear on BBC News within 40 minutes. The headline 'Bank closes its doors on payday' follows the firm for 18 months. The board later identifies this as one of the two worst individual decisions of the incident.",
          rank: 4,
          recapFragment: "closing branches during the outage to manage expectations",
        },
        {
          key: "D",
          label: "Brief branch managers to direct customers without cash to other banks' ATMs and offer sympathy",
          consequence:
            "Branch managers do what they can. Customers with other bank cards use those ATMs. The segment of customers who bank only with Clearpoint and have no alternative has no good option. The instruction fails the person standing in front of David Kim.",
          rank: 2,
          recapFragment: "directing branch customers to alternative ATMs",
        },
      ],
    },

    {
      id: "io-i10",
      commandTier: "GOLD",
      order: 35,
      scenarioDay: 1,
      scenarioTime: "10:55",
      title: "CLRP.L - Down 6.1% on the Open",
      body: "10:55. Clearpoint Bank plc shares (CLRP.L) opened at 247p this morning. They are currently trading at 232p, a fall of 6.1% on volume of 8.4 million shares, against an average daily volume of 1.9 million. City analysts at Peel Hunt and Panmure Gordon have both published intraday notes. Peel Hunt: 'Operational incident at Clearpoint: watching for customer impact duration and regulatory response.' Panmure Gordon: 'Clearpoint Bank: systems failure on payday raises questions about NexCore dependency risk and insurance coverage. Maintain Hold pending resolution.' The CFO's IR team are fielding calls from three institutional shareholders.",
      facilitatorNotes:
        "No decision point: this is a temperature read. The facilitator should ask: does the share price move change anything about how you communicate? Does it change the PRA notification? The CFO should think about whether there is a market disclosure obligation if the outage is material. In the UK, listed companies have an obligation under MAR to disclose inside information as soon as possible. The question of whether a 6.1% price move on a payment failure constitutes inside information is worth a brief discussion: the CLO and CFO should be aligned on this before the next press inquiry.",
      delayMinutes: 0,
      tickerHeadline: "CLRP.L -6.1% | Clearpoint Bank shares fall on outage | analysts flag NexCore dependency",
      artifact: {
        type: "stock_chart",
        stockTicker: "CLRP.L",
        stockCompanyName: "Clearpoint Bank plc",
        stockOpenPrice: 247,
        stockCurrentPrice: 232,
        stockChangePercent: -6.1,
        stockVolume: "8.4M",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CFO", "CEO", "CLO"],
    },

    {
      id: "io-i11",
      commandTier: "SILVER",
      order: 40,
      scenarioDay: 1,
      scenarioTime: "11:45",
      title: "NexCore ETA Miss Number Two - 14:00 BST",
      body: "11:45. An email from Dana Reeves, Global CTO at NexCore Systems, to James Cordell and the war room: 'Following our call this morning, I want to give you a direct update. Our engineering team has identified the root cause of the cascading failure: the emergency patch applied at 07:38 had an undocumented dependency conflict with a database index that was updated during last week's maintenance window. The patch is being correctly rolled back. Full restoration of CORE-DB-CLUSTER-01 is estimated at 14:00 BST. I am personally supervising this. I understand the gravity of what has occurred and I am available to you directly.' It is 11:45. It has been four hours and two minutes since the outage began. A 14:00 restoration means four hours and seventeen minutes from now before payments can be processed.",
      facilitatorNotes:
        "This is the ETA credibility test. Options A and D are the two poles. The problem with Option A (publish the 14:00 ETA) is that NexCore have missed three ETAs already: a fourth miss would be catastrophically damaging if the team has committed publicly to 14:00. Option B (no ETA) frustrates customers but protects against a fourth public failure. Option C (commit to hourly updates without an ETA) is the best answer: it is honest about the uncertainty without leaving customers with nothing. Ask the CCO: what is the cost of saying '14:00' in a press release and then missing it? Compare to the cost of saying 'we will update you every hour'.",
      delayMinutes: 0,
      timerMinutes: 12,
      tickerHeadline: "Clearpoint Bank | NexCore gives 14:00 restoration estimate | fourth ETA of the morning",
      artifact: {
        type: "email",
        emailFrom: "d.reeves@nexcoresystems.com",
        emailTo: "j.cordell@clearpointbank.co.uk; war-room@clearpointbank.co.uk",
        emailSubject: "Clearpoint Bank: Direct Update from NexCore Global CTO, Restoration ETA 14:00 BST",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CCO", "COO"],
      expectedKeywords: ["ETA", "14:00", "update", "communicate", "public", "hourly", "credibility"],
      recapLine: "decided on the 14:00 ETA communications strategy by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Issue an updated public statement committing to the 14:00 restoration ETA",
          consequence:
            "14:00 passes without restoration. NexCore update their ETA to 15:48 at 14:10. The bank has publicly missed a fourth ETA. The CCO's 14:00 statement is screenshot and circulated extensively. The media narrative shifts from 'outage' to 'bank cannot give straight answers'.",
          rank: 3,
          recapFragment: "publicly committing to the 14:00 NexCore ETA",
        },
        {
          key: "B",
          label: "Do not publish an ETA: past ETAs have all been wrong, this one may be too",
          consequence:
            "Customers and media note the absence of a time commitment. The silence is uncomfortable but defensible. When restoration arrives at 15:48, the first statement the bank makes is: 'We are pleased to confirm systems are restored.' It is received better than expected.",
          rank: 2,
          recapFragment: "refusing to publish an ETA after three previous misses",
        },
        {
          key: "C",
          label: "Issue a statement without an ETA but commit explicitly to hourly public updates at 12:00, 13:00, and 14:00",
          consequence:
            "The hourly update structure gives customers and media something to hold the bank to. The 12:00 and 13:00 updates carry partial good news: systems recovering, some services coming back. The structured cadence materially reduces the sense of silence.",
          rank: 1,
          recapFragment: "committing to hourly updates without a specific ETA",
        },
        {
          key: "D",
          label: "Hold all comms until restoration is confirmed: do not say anything until the system is back",
          consequence:
            "Three hours of silence while #ClearpointDown continues to trend. The BBC segment at 13:30 goes ahead with no bank comment. The absence of engagement becomes the story. 'Clearpoint refuses to comment' appears in eight national newspapers the next morning.",
          rank: 4,
          recapFragment: "holding all communications until systems were fully restored",
        },
      ],
    },

    // ── ACT 3: REGULATORY AND MEDIA ───────────────────────────────────────────

    {
      id: "io-i12",
      commandTier: "GOLD",
      order: 45,
      scenarioDay: 1,
      scenarioTime: "12:10",
      title: "PRA Formal Engagement - 14:00 Call Requested",
      body: "12:10. An email from Katherine Elliot, PRA Supervision Director, to James Cordell: 'The Prudential Regulation Authority notes reports of a significant operational disruption at Clearpoint Bank plc affecting retail payment services on what we understand is a high-volume salary payment date. We request a call with the CEO and Chief Risk Officer at 14:00 today to discuss: (1) impact scope and number of customers affected; (2) your customer remediation plan; (3) your response under the operational resilience impact tolerance framework; and (4) your current assessment of vendor management and change control failures. Please confirm attendance by return.' The Chief Risk Officer is Marcus Webb. It is 12:10. The PRA call is in 110 minutes.",
      facilitatorNotes:
        "Option A (full attendance, full timeline) is the right answer. The PRA have been signalled this is coming: if you chose Option A in inject 3, they received the voluntary early notification. The 14:00 call is a supervisory conversation, not a formal enforcement action, yet. Going in with a complete timeline signals candour. Option B (request a delay) will be politely refused and signals that the bank is not ready. Option C (CLO only) signals that the CEO is not engaged: the PRA have specifically requested the CEO. Option D (off the record) is not how PRA supervision works: the conversation will be noted regardless.",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "PRA requests call with Clearpoint CEO | regulatory engagement underway",
      artifact: {
        type: "email",
        emailFrom: "k.elliot@bankofengland.co.uk",
        emailTo: "j.cordell@clearpointbank.co.uk",
        emailSubject: "PRA: Clearpoint Bank plc, Operational Incident, Call Request 14:00 BST",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "COO"],
      expectedKeywords: ["PRA", "CEO", "timeline", "remediation", "vendor", "change control", "attend"],
      recapLine: "decided to handle the PRA 14:00 call by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "CEO and CRO attend at 14:00: bring a complete incident timeline and be fully open about the change control failure",
          consequence:
            "The PRA call lasts 52 minutes. The supervisors note the candour and the completeness of the timeline in their file. The meeting becomes the foundation of a cooperative supervisory relationship during the post-incident review period.",
          rank: 1,
          recapFragment: "the CEO and CRO attending the PRA call with a full timeline",
        },
        {
          key: "B",
          label: "Request a 24-hour delay: the incident is ongoing and a fuller picture would make the call more productive",
          consequence:
            "The PRA decline the delay request. The call proceeds anyway at 14:00 but Clearpoint is represented by the CLO alone because the CEO is still managing the incident. The PRA note: 'CEO unavailable for initial supervisory call during active incident.'",
          rank: 3,
          recapFragment: "requesting a 24-hour delay to the PRA call",
        },
        {
          key: "C",
          label: "The CLO attends as sole representative: the CEO and CRO need to remain focused on the incident",
          consequence:
            "The PRA specifically requested the CEO and CRO. The CLO attends alone. The PRA supervision note records: 'CEO not present. Bank represented solely by legal function.' This note appears in the post-incident supervisory assessment.",
          rank: 3,
          recapFragment: "sending the CLO alone to the PRA call",
        },
        {
          key: "D",
          label: "Attend but request the discussion remain off the record and not noted formally",
          consequence:
            "The PRA supervision officer politely explains that all supervisory conversations are recorded for regulatory purposes. There is no 'off the record' in PRA supervision. The request itself is noted.",
          rank: 4,
          recapFragment: "requesting the PRA call be kept off the record",
        },
      ],
    },

    {
      id: "io-i13",
      commandTier: "GOLD",
      order: 50,
      scenarioDay: 1,
      scenarioTime: "12:35",
      title: "CFO Liquidity Note - £47M Intraday Exposure",
      body: "12:35. A strictly confidential memo from Catherine Park, CFO, to James Cordell: '60,000 failed salary payment instructions represent a £47M intraday liquidity exposure that remains on Clearpoint's books until remediation payments are processed. Our intraday liquidity buffer is £85M. In normal circumstances this exposure would clear by 11:00, but today it has not. If restoration does not occur by 16:00 and we are required to fund remediation payments through an emergency overnight facility, we will approach but not breach the buffer limit. This is within operating parameters today. If the outage extends to tomorrow morning and creates a second batch failure, the position changes materially. I am flagging this now, not as an immediate crisis, but because the Bank of England's supervision team will ask. Do we tell them now or wait until the picture is clearer?'",
      facilitatorNotes:
        "Option A (proactive Bank of England notification) is the better governance call. The Bank of England's supervision function for intraday liquidity is separate from PRA operational resilience supervision: the CFO knows this. Option B (manage internally) is defensible today but sets a tone. Option C (brief board finance chair) is a good parallel action but not a substitute for Option A. Option D (no action) ignores the governance logic the CFO herself has laid out. Push the CFO: what does 'approaching the buffer' look like in practice? What is the trigger for mandatory notification?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "Clearpoint Bank | analysts flag intraday liquidity questions | no official comment",
      artifact: {
        type: "internal_memo",
        memoTitle: "Intraday Liquidity Position: Confidential Update, 12:35",
        memoClassification: "STRICTLY CONFIDENTIAL: BOARD EYES ONLY",
        memoFrom: "Catherine Park, Chief Financial Officer, Clearpoint Bank plc",
        memoTo: "James Cordell, CEO",
        memoDate: "Monday 14 April 2026, 12:35",
        memoRef: "CLRP-CFO-LIQ-2026-0414",
      },
      isDecisionPoint: true,
      targetRoles: ["CFO", "CEO", "CLO"],
      expectedKeywords: ["liquidity", "Bank of England", "buffer", "intraday", "exposure", "notify"],
      recapLine: "responded to the CFO liquidity note by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Inform the Bank of England supervision team proactively: flag the exposure now, before they ask",
          consequence:
            "The Bank of England supervision team acknowledge the notification at 13:10 and confirm they are monitoring. In the post-incident review they specifically note proactive liquidity disclosure as good practice. No adverse supervisory finding is made on liquidity management.",
          rank: 1,
          recapFragment: "proactively notifying the Bank of England of the intraday liquidity position",
        },
        {
          key: "B",
          label: "Manage internally: the exposure is well within buffer limits and does not require external disclosure today",
          consequence:
            "The position is managed successfully within the buffer. However, when the Bank of England's supervision team later review the incident file they note that no proactive liquidity disclosure was made. They ask the CFO why. The answer 'it was within limits' is not wrong, but it is noted.",
          rank: 2,
          recapFragment: "managing the liquidity exposure internally without external disclosure",
        },
        {
          key: "C",
          label: "Brief the board finance committee chair privately: this is a board governance matter first",
          consequence:
            "The finance committee chair is briefed by 13:15 and supports the CFO's assessment. The Bank of England is not told. This is a reasonable governance step but does not address the external notification question.",
          rank: 3,
          recapFragment: "briefing the board finance committee chair without external disclosure",
        },
        {
          key: "D",
          label: "Take no action: the exposure is within normal operating parameters and does not require notification",
          consequence:
            "The CFO's own memo identified this as a notification question. Choosing no action ignores the governance signal she gave. When the Bank of England's team review the incident documentation they find the CFO's memo in discovery and note the decision not to notify.",
          rank: 4,
          recapFragment: "taking no action on the CFO's liquidity notification question",
        },
      ],
    },

    {
      id: "io-i14",
      commandTier: "GOLD",
      order: 55,
      scenarioDay: 1,
      scenarioTime: "13:30",
      title: "BBC News - Live Segment Outside Clearpoint Branch",
      body: "13:30. BBC News is running a live segment titled 'Clearpoint Bank customers locked out on payday: what went wrong?' The lower-third reads: 'BREAKING: CLEARPOINT BANK SYSTEMS DOWN. CUSTOMERS UNABLE TO ACCESS SALARIES.' Reporter Eleanor Walsh is standing outside the Clearpoint branch on Tottenham Court Road, London. Behind her, a queue of approximately 30 customers is visible. Walsh: 'The bank has issued one public statement this morning and declined to answer questions about when services will be restored. The BBC has learned that the outage is linked to a software patch applied by the bank's US-based technology vendor, NexCore Systems. Sixty thousand salary payments are understood to have failed.' The communications team has one hour to respond before the segment airs again at 14:30.",
      facilitatorNotes:
        "This is a media management decision that also has strategic implications. Option A (CEO interview) is the strongest signal: it puts the top of the house on camera and demonstrates accountability. The risk is that the CEO must say something meaningful, not just 'we are sorry and working on it'. Option B (written statement) is safer but reads as the bank hiding its CEO. Option C (CCO does the interview) is a plausible choice for a CCO who is a strong media performer, but the BBC have specifically asked for the CEO. Option D (decline until resolved) gave us 'Clearpoint refuses to comment' in the morning editions. Ask the CCO: what does a good CEO interview sound like at 13:30 when the system is still down? It is not an apology for the system. It is an account of what the bank is doing for every one of those 60,000 people.",
      delayMinutes: 0,
      timerMinutes: 12,
      tickerHeadline: "BBC News LIVE | Clearpoint Bank systems outage segment | reporter at Tottenham Court Road branch",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "BBC NEWS",
        tvHeadline: "CLEARPOINT BANK: CUSTOMERS LOCKED OUT ON PAYDAY",
        tvTicker: "Clearpoint Bank systems down since 07:43 | 60,000 salary payments failed | NexCore patch blamed | #ClearpointDown trending",
        tvReporter: "Eleanor Walsh, Tottenham Court Road, London",
      },
      isDecisionPoint: true,
      targetRoles: ["CCO", "CEO"],
      expectedKeywords: ["CEO", "interview", "BBC", "statement", "media", "accountability", "ETA"],
      recapLine: "responded to the BBC media request by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "CEO does a live interview: 'we owe our customers an explanation and I am going to give one'",
          consequence:
            "Cordell does a 4-minute interview. He does not have an ETA. He says what is true: the bank caused this through poor vendor oversight, 60,000 people have been failed, and every resource is on it. The clip is broadly well-received. Evening coverage is gentler than the morning.",
          rank: 1,
          recapFragment: "the CEO doing a live BBC interview",
        },
        {
          key: "B",
          label: "Issue a detailed written statement to the BBC instead of providing an interviewee",
          consequence:
            "The statement is thorough and accurate. The BBC use two sentences from it and note three times during the segment that 'Clearpoint Bank declined to provide an interviewee.' The written statement is the footnote. The declined interview is the headline.",
          rank: 2,
          recapFragment: "issuing a written statement without providing a BBC interviewee",
        },
        {
          key: "C",
          label: "CCO does the interview, not the CEO: save the CEO for the board and the PRA",
          consequence:
            "The CCO performs well and delivers clear messaging. However, the BBC note that the CEO did not appear. The following morning's coverage includes: 'Chief Executive James Cordell was not available for interview during the crisis.' The board raises it that evening.",
          rank: 3,
          recapFragment: "the CCO doing the BBC interview in place of the CEO",
        },
        {
          key: "D",
          label: "Decline all media contact until the incident is fully resolved",
          consequence:
            "The bank's silence through the afternoon session is noted in every evening bulletin. 'Clearpoint Bank refuses to comment' becomes a recurring phrase. The following morning, eight newspapers run variants of the same story: the bank went silent when customers needed answers.",
          rank: 4,
          recapFragment: "declining all media contact until after resolution",
        },
      ],
    },

    {
      id: "io-i15",
      commandTier: "GOLD",
      order: 60,
      scenarioDay: 1,
      scenarioTime: "14:17",
      title: "NexCore CEO on the Line - Change Control Confrontation",
      body: "14:17. James Cordell has finally reached Marcus Webb, CEO of NexCore Systems, directly. It has taken four hours of escalation to get him on a call. Webb opens: 'James, I want to say how sorry I am for the disruption today. My team is absolutely committed to restoring your services and they are close.' Cordell: 'Marcus, the patch applied at 07:38 was not approved through our change control process. Your UK director did not notify us. Your SLA requires a minimum 2-hour notice window for emergency changes, with written sign-off. That did not happen.' Webb: 'We followed our own emergency protocol in response to an NCSC advisory. The advisory indicated a time-critical vulnerability. Our legal position is that a credible security alert does not require you to authorise an emergency security patch on our own infrastructure.' The 2-hour notice requirement is explicit in schedule 4 of the NexCore contract.",
      facilitatorNotes:
        "Option A (formal breach notice) is the CLO's recommendation and is legally correct, but the timing is the question. Option B (hold vendor escalation) is what most teams instinctively prefer during an active incident: do not do anything that might slow the fix. Option C (contract review and termination triggers) is the right parallel workstream for the CLO. Option D (public statement naming NexCore) was available in inject 8 and has been addressed: it is still the wrong call. The coaching question: can you hold someone contractually accountable and still need them to fix your system? Yes. The two things are not incompatible. The CLO and CEO should be able to articulate how you do both simultaneously.",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "NexCore Systems | no public comment | Clearpoint Bank contract under scrutiny",
      artifact: {
        type: "sms_thread",
        smsParticipants: ["James Cordell, CEO, Clearpoint", "Marcus Webb, CEO, NexCore Systems"],
        smsMessages: [
          { sender: "James Cordell, CEO, Clearpoint", text: "Marcus, we need to speak. When are you available for a call? It is urgent.", time: "12:41" },
          { sender: "Marcus Webb, CEO, NexCore Systems", text: "James, available from 14:00. My team is on it. Dana is running point.", time: "12:55" },
          { sender: "James Cordell, CEO, Clearpoint", text: "14:00 call confirmed. I need you directly, not Dana.", time: "13:02" },
          { sender: "Marcus Webb, CEO, NexCore Systems", text: "Understood. I will be on.", time: "13:04" },
          { sender: "James Cordell, CEO, Clearpoint", text: "Marcus, the patch at 07:38 bypassed our change control process. Schedule 4 of the contract requires 2 hours notice and written sign-off. That did not happen. What is your position?", time: "14:18" },
          { sender: "Marcus Webb, CEO, NexCore Systems", text: "We followed our emergency security protocol. The NCSC advisory was time-critical. Our legal team's position is that a credible security advisory does not require your sign-off on patches to our own infrastructure. We can discuss this after restoration.", time: "14:22" },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "COO"],
      expectedKeywords: ["breach", "contract", "change control", "notice", "termination", "legal", "CLO"],
      recapLine: "handled the NexCore contract confrontation by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Put NexCore on formal breach notice immediately: the contract position is clear",
          consequence:
            "The CLO files the formal notice at 15:05. NexCore's legal team respond by 16:30. The notice does not slow the technical restoration: the engineers continue working regardless. The breach notice becomes exhibit A in the subsequent contract review.",
          rank: 2,
          recapFragment: "putting NexCore on formal breach notice during the incident",
        },
        {
          key: "B",
          label: "Hold vendor escalation until after restoration: the priority is the fix, not the contract argument",
          consequence:
            "Restoration occurs at 15:48. The contract conversation begins at 16:30. NexCore's legal team have had an additional 90 minutes to prepare their position. The CLO notes the delay cost some leverage but the relationship is better during the fix.",
          rank: 2,
          recapFragment: "holding the contract confrontation until after systems were restored",
        },
        {
          key: "C",
          label: "Ask the CLO to begin a formal contract review and identify termination triggers, in parallel with the fix",
          consequence:
            "The CLO begins the review at 14:30. By 17:00 she has identified three separate clauses under which the contract is terminable, including the change control breach and a service level failure provision. The work is complete before the board meeting.",
          rank: 1,
          recapFragment: "commissioning a parallel CLO contract review to identify termination triggers",
        },
        {
          key: "D",
          label: "Threaten a public statement naming NexCore as solely responsible for the outage",
          consequence:
            "Webb's response is measured but immediate: 'If you go public with that today, our legal team will have a counter-statement ready within the hour.' The threat accelerates nothing technically and creates a legal exposure for Clearpoint if the facts later prove more nuanced.",
          rank: 3,
          recapFragment: "threatening public attribution to pressure NexCore",
        },
      ],
    },

    // ── ACT 4: RECOVERY ───────────────────────────────────────────────────────

    {
      id: "io-i16",
      commandTier: "GOLD",
      order: 65,
      scenarioDay: 1,
      scenarioTime: "17:00",
      title: "Emergency Board Session - 'How Did We Get Here?'",
      body: "17:00. All six Non-Executive Directors are online. The Chairman, Sir Peter Albury, has called an emergency board session. The NED for Audit and Risk, Frances Osei, has sent a message ahead of the meeting: 'I need to understand one thing before this meeting starts. We approved the NexCore transformation 18 months ago. Our operational resilience framework was signed off by this board in March 2025. Our impact tolerance for the retail payments service was set at 4 hours. Today we failed our customers for more than eight hours, and counting. This is exactly the scenario our framework was supposed to address. I would like the CEO to explain how we got here, and what this tells us about the strength of our third-party oversight programme.' The board meeting is in 10 minutes.",
      facilitatorNotes:
        "Option A (full timeline, accept accountability, commit to independent review) is the right answer. This is a governance moment. The board needs to see a CEO who can be honest about what went wrong, including the systemic vendor oversight failure, without deflecting to the vendor. Option B (frame as vendor failure) will not land with Frances Osei. She has read the operational resilience framework. She knows the bank owns its impact tolerances regardless of what the vendor does. Option C (defer the meeting) is a red flag: the board has been called and is online. Option D (send General Counsel to lead) is an evasion. The CEO should be in that room.",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "Clearpoint Bank board emergency session | NEDs online | governance questions raised",
      artifact: {
        type: "board_portal",
        boardPortalOrgName: "Clearpoint Bank plc",
        boardPortalAlertCount: 1,
        boardPortalAlertTitle: "Emergency Board Session: 17:00, Operational Incident Response",
        boardPortalMembers: [
          { name: "Sir Peter Albury", role: "Non-Executive Chairman", isOnline: true, loggedInAt: "16:51" },
          { name: "Frances Osei", role: "NED, Audit and Risk Committee Chair", isOnline: true, loggedInAt: "16:48" },
          { name: "Jonathan Hale", role: "Senior Independent Director", isOnline: true, loggedInAt: "16:53" },
          { name: "Miriam Lau", role: "NED, Remuneration Committee Chair", isOnline: true, loggedInAt: "16:55" },
          { name: "David Carruthers", role: "NED", isOnline: true, loggedInAt: "16:58" },
          { name: "Amara Osei-Bonsu", role: "NED", isOnline: true, loggedInAt: "16:50" },
          { name: "James Cordell", role: "Chief Executive Officer", isOnline: true, loggedInAt: "16:47" },
          { name: "Catherine Park", role: "Chief Financial Officer", isOnline: true, loggedInAt: "16:52" },
          { name: "Rachel Winters", role: "Chief Legal Officer", isOnline: true, loggedInAt: "16:49" },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CLO", "CFO"],
      expectedKeywords: ["board", "accountability", "independent review", "vendor", "impact tolerance", "framework"],
      recapLine: "presented to the emergency board by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "CEO presents the full incident timeline, acknowledges the vendor oversight gap, and commits to an independent post-incident review",
          consequence:
            "The board session is difficult but productive. Frances Osei is satisfied with the candour. The board resolves to commission an independent review within 14 days and requires monthly progress reports for 12 months. The resolution is filed with the PRA.",
          rank: 1,
          recapFragment: "the CEO accepting accountability and committing to an independent review",
        },
        {
          key: "B",
          label: "CEO presents the timeline but frames the failure as a vendor failure, not a bank governance failure",
          consequence:
            "Frances Osei specifically challenges the framing: 'We set an impact tolerance of 4 hours. We failed at 8 hours. The vendor is not a party to our SS1/21 obligations: we are.' The board resolves the same independent review but notes the CEO's framing in the minutes.",
          rank: 2,
          recapFragment: "framing the incident as a vendor failure rather than a governance gap",
        },
        {
          key: "C",
          label: "Request the board meeting be deferred until the full incident review is complete: a clearer picture will be available in 72 hours",
          consequence:
            "The Chairman declines to defer. The board meets regardless, but without the CEO's prepared remarks, the session is unstructured. The minutes reflect a board that was not well-served by its management team during a major operational incident.",
          rank: 4,
          recapFragment: "requesting the board meeting be deferred pending a full review",
        },
        {
          key: "D",
          label: "Ask the General Counsel to lead the board presentation: this is primarily a legal and contractual matter at this stage",
          consequence:
            "The Chairman asks directly whether the CEO is available. He is. The decision to send the CLO instead is noted. Frances Osei requests that the CEO present at the next session within 48 hours. The governance dynamic is damaged.",
          rank: 3,
          recapFragment: "delegating the board presentation to the General Counsel",
        },
      ],
    },

    {
      id: "io-i17",
      commandTier: "SILVER",
      order: 70,
      scenarioDay: 1,
      scenarioTime: "15:48",
      title: "Restoration - Systems Coming Back, CISO Flag",
      body: "15:48. The IT war room Slack lights up. Systems are coming back online. NexCore have restored the core banking cluster. Payments team: 'Core banking is live. We can begin processing the outstanding 60,000 payment queue, estimated 90 minutes for full batch completion.' CISO, Sanjay Patel: 'Before we go live on payments I need 45 minutes to validate the NexCore patch. We do not have the patch notes in advance. I have not seen the code. We are being asked to run 60,000 financial transactions on a system that failed this morning because of a patch we did not approve. I want to know what is in it before customers' money moves.' The payments team: 'Every minute we wait is another minute someone cannot access their salary.' Both positions are correct.",
      facilitatorNotes:
        "This is the tension between speed and security: the genuine dilemma of the CISO's role during an operational recovery. Option B (wait for CISO validation) is the right call in a pure security sense. Option A (begin immediately) is the natural operational pressure. Option C (begin payments but publish a notice) is a reasonable compromise if the CISO can confirm that the risk is bounded. Option D (Mandiant validation) is too slow: 4 hours for an emergency Mandiant engagement will cost more customer time than the 45-minute internal validation. Push the CISO: what exactly are you validating for in 45 minutes? What is the worst-case scenario if the patch has a second issue? Could it affect payment data integrity? That answer changes the calculus.",
      delayMinutes: 0,
      timerMinutes: 12,
      tickerHeadline: "Clearpoint Bank | systems restoration reported | payment processing status unknown",
      artifact: {
        type: "slack_thread",
        slackChannel: "#war-room-live",
        slackMessages: [
          { author: "nexcore-status-bot", role: "NexCore Status Feed", time: "15:48", text: "CORE-DB-CLUSTER-01: All nodes operational. Quorum restored. Service health: GREEN." },
          { author: "Helen Marsh", role: "Head of Payments Operations", time: "15:49", text: "Core banking is live. Ready to begin the outstanding 60k payment queue. Est 90 mins to full completion. Requesting go-ahead." },
          { author: "Sanjay Patel", role: "CISO", time: "15:51", text: "Not yet. I need 45 mins to validate the patch. We haven't seen the patch notes. I am not running 60k transactions on a system restored by a patch we didn't approve without at least checking what's in it." },
          { author: "Helen Marsh", role: "Head of Payments Operations", time: "15:52", text: "Sanjay, every minute we wait is another minute these people don't have their salary. Some of them have been waiting since 09:00." },
          { author: "Sanjay Patel", role: "CISO", time: "15:53", text: "I understand. Forty-five minutes. That is my ask." },
          { author: "COO-LBrennan", role: "COO", time: "15:54", text: "War room, I need a decision from the CEO on this. @all" },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CISO", "COO", "CFO"],
      expectedKeywords: ["validate", "patch", "CISO", "payments", "security", "45 minutes", "restore"],
      recapLine: "resolved the post-restoration payments decision by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Begin remediation payments immediately: the customer cost of further delay outweighs the security risk",
          consequence:
            "Payments begin at 15:55. The batch completes at 17:25. No data integrity issues are subsequently found. The CISO documents his objection formally. In the post-incident review, the decision is noted as a risk accepted under time pressure, not a best-practice model.",
          rank: 3,
          recapFragment: "beginning payment processing immediately without CISO validation",
        },
        {
          key: "B",
          label: "Wait 45 minutes for the CISO's patch validation before any payments run",
          consequence:
            "Validation is complete by 16:33. The patch is clean. Payments begin at 16:35 and complete at 18:05. Customers wait an additional 45 minutes beyond restoration. The CISO's validation log becomes a key document in the vendor review.",
          rank: 1,
          recapFragment: "waiting for the CISO's 45-minute patch validation before resuming payments",
        },
        {
          key: "C",
          label: "Begin payments but publish a notice that CISO validation is running concurrently",
          consequence:
            "Payments begin at 15:57. The concurrent validation is complete at 16:42: the patch is clean. The public notice generates some media attention: 'Bank resumes payments before security check is complete.' The framing is unkind but accurate.",
          rank: 2,
          recapFragment: "beginning payments concurrently with CISO validation",
        },
        {
          key: "D",
          label: "Commission an emergency Mandiant validation of the NexCore patch before any systems go live",
          consequence:
            "Mandiant can have a team engaged within 4 hours. Payments would begin at approximately 20:00. The security assurance is the strongest available. The customer cost, an additional 4 hours of delay after restoration, is very high and extremely difficult to defend publicly.",
          rank: 4,
          recapFragment: "commissioning an emergency Mandiant validation before resuming payments",
        },
      ],
    },

    {
      id: "io-i18",
      commandTier: "GOLD",
      order: 75,
      scenarioDay: 1,
      scenarioTime: "17:30",
      title: "Customer Remediation - What Do We Owe People?",
      body: "17:30. Systems are restored. Payments are processing. The war room turns to the question every customer-facing business dreads: what do we owe the people we failed today? Catherine Park, CFO: '60,000 salary payment failures. An estimated 840 emergency branch cash releases. Contact centre at breaking point from 09:00 to 17:00. Some customers will have incurred bank charges because of failed standing orders triggered off salary payments that never arrived. Some will have paid overdraft fees. Some will have experienced genuine hardship.' Tom Bassett, CCO: 'Consumer Duty requires us to act in the genuine financial interest of affected customers. The question is how proactive we are prepared to be.' Four options are on the table.",
      facilitatorNotes:
        "This is the Consumer Duty decision at its most concrete. Option A (proactive £50 per customer) is bold, operationally complex, and sends the clearest signal. It costs £3M if fully paid. Option B (complaint-led only) is the minimum legal position and will be seen as the minimum legal position by both customers and the FCA: Consumer Duty specifically pushes against complaint-led models. Option C (one month free banking) is creative and delivers clear value for loyal customers but does not help those who have already incurred specific charges. Option D (apology only) is almost certainly insufficient under Consumer Duty. The FCA's Consumer Duty guidance is explicit: firms must provide redress that is fair and proportionate to the harm caused. Ask the CFO: what is the cost of each option? Ask the CLO: what does Consumer Duty case precedent say?",
      delayMinutes: 0,
      timerMinutes: 14,
      tickerHeadline: "Clearpoint Bank payments processing | remediation strategy under discussion | customer compensation expected",
      isDecisionPoint: true,
      branchMode: "score",
      targetRoles: ["CEO", "CFO", "CCO", "CLO"],
      expectedKeywords: ["Consumer Duty", "compensation", "remediation", "£50", "apology", "proactive", "FCA"],
      recapLine: "decided on customer remediation by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Proactive £50 compensation to all 60,000 affected customers: automatic, no claim required",
          consequence:
            "Cost: £3M. The FCA notes this as a clear Consumer Duty response. Media coverage the following morning shifts from 'bank failure' to 'bank does the right thing'. 94% of affected customers receive payment within 72 hours.",
          rank: 1,
          recapFragment: "a proactive £50 payment to all 60,000 affected customers",
        },
        {
          key: "B",
          label: "Complaint-led compensation only: respond generously to every customer who contacts us",
          consequence:
            "Cost: approximately £400,000 (based on complaint volumes). The FCA's Consumer Duty assessment notes the complaint-led approach as inconsistent with the proactive harm-prevention principle of Consumer Duty. Most customers affected by the outage do not complain. They simply leave.",
          rank: 3,
          recapFragment: "a complaint-led compensation model",
        },
        {
          key: "C",
          label: "One month free banking for all current account holders: a goodwill gesture for the community",
          consequence:
            "Cost: approximately £1.8M in foregone fee income. The gesture is well-received and garners positive press. The CLO notes it does not specifically address customers who incurred charges due to the failed payments, which may not satisfy Consumer Duty in those individual cases.",
          rank: 2,
          recapFragment: "a one-month free banking goodwill gesture for all current account holders",
        },
        {
          key: "D",
          label: "No financial compensation: issue a formal apology and commit to operational improvements",
          consequence:
            "The FCA's Consumer Duty review finds the response inadequate. The firm is required to conduct a past business review and retrospectively pay compensation, at higher operational cost than a proactive scheme would have been. The review takes 14 months.",
          rank: 4,
          recapFragment: "a formal apology without financial compensation",
        },
      ],
      branches: [
        { optionKey: "A", nextInjectId: "io-end-strong", scoreMax: 2.0 },
        { optionKey: "B", nextInjectId: "io-end-moderate", scoreMax: 3.0 },
        { optionKey: "C", nextInjectId: "io-end-weak", scoreMax: 4.0 },
        { optionKey: "D", nextInjectId: "io-end-weak", scoreMax: 5.0 },
      ],
    },

    // ── ACT 5: ENDINGS ────────────────────────────────────────────────────────

    {
      id: "io-end-strong",
      commandTier: "GOLD",
      order: 80,
      scenarioDay: 2,
      scenarioTime: "08:00",
      title: "Outcome: Clearpoint Holds",
      isEnding: true,
      body: "Your team moved fast, communicated clearly, and put customers first. The PRA noted your early voluntary notification. The emergency cash authorisation for branch customers drew a direct Consumer Duty commendation from the FCA in correspondence. The £50 proactive compensation was paid to 59,800 eligible customers within 72 hours, with the 200 exceptions cleared within a week. CLRP.L recovered to 241p by Thursday. The NexCore contract is under formal legal review. The board has commissioned an independent operational resilience review, with findings due in 90 days. Four institutional shareholders have called to say they are monitoring but not selling.\n\nThe lesson the team took from this incident is the one that matters most: you do not control whether your vendor fails. You control how you respond when they do. You controlled it well.\n\nThe PRA's supervision note closes: 'Clearpoint Bank demonstrated a mature operational resilience response under significant time pressure. Early notification, proactive customer communication, and swift Consumer Duty action were noted. The residual finding, the vendor change control failure, is the subject of an ongoing contract review. This matter is under continued supervisory monitoring but is not currently subject to enforcement action.'",
      facilitatorNotes:
        "Strong outcome. The team hit the key decisions: early PRA notification, transparent customer comms, emergency branch cash, contingency payments, CISO validation, proactive compensation. Debrief focus: which of these was the hardest decision in the room? Which did the team get right instinctively, and which required the exercise pressure to surface? The vendor change control failure is a structural risk that persists regardless of today's decisions: that is the 90-day review question.",
      delayMinutes: 0,
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CFO", "CISO", "CLO", "COO", "CCO"],
    },

    {
      id: "io-end-moderate",
      commandTier: "GOLD",
      order: 80,
      scenarioDay: 2,
      scenarioTime: "08:00",
      title: "Outcome: Mixed - PRA Review Opened",
      isEnding: true,
      body: "Your team held together but made enough hesitations that the regulatory and reputational picture is murkier than it needed to be. The PRA has opened a formal operational resilience review under SS1/21. The review is not an enforcement action yet. They are asking three specific questions: why was the PRA notification delayed past the voluntary early window; why were branch cash releases not authorised more promptly; and what does the bank's operational resilience impact tolerance framework say about third-party vendor change control? The FCA is monitoring.\n\nCLRP.L recovered from 232p to 238p by Friday but has not returned to the 247p open. Three institutional shareholders have written to the board requesting a briefing on vendor dependency risk. The NexCore relationship is under review but no action has been taken. Two thousand customers have switched accounts in the week following the incident, within normal monthly attrition levels but at the top of the range.\n\nThe PRA's supervision note: 'Clearpoint Bank's response to the operational incident of 14 April 2026 was adequate in most respects but fell short of best practice in three areas identified for supervisory discussion. This firm remains under enhanced monitoring for the next 12 months.'",
      facilitatorNotes:
        "Moderate outcome. Identify the two or three decision points where the team stalled or chose the wrong option. The pattern in moderate outcomes is usually: vendor-optimism bias on the ETAs, delayed PRA notification, and an inadequate customer communication approach in the first two hours. These are the TSB failure modes. Map them for the debrief.",
      delayMinutes: 0,
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CFO", "CISO", "CLO", "COO", "CCO"],
    },

    {
      id: "io-end-weak",
      commandTier: "GOLD",
      order: 80,
      scenarioDay: 3,
      scenarioTime: "09:00",
      title: "Outcome: Enforcement - £12M Fine, 18,000 Customers Gone",
      isEnding: true,
      body: "The FCA has opened a formal enforcement investigation into Clearpoint Bank plc. Preliminary findings indicate failures under FCA SYSC 15A (operational resilience), FCA Consumer Duty (customer harm prevention), and FCA BCOBS (banking conduct). A fine of approximately £12M is assessed as likely based on comparator cases, including the TSB precedent. The PRA has issued a Requirement Notice requiring Clearpoint to conduct a full operational resilience review and submit a remediation plan within 60 days.\n\n18,000 customers switched accounts in the four weeks following the incident, a 3% outflow of the retail base and the largest single-month attrition in the bank's history. The branch network has seen a measurable shift in customer trust. Three parliamentary questions have been tabled about the bank's dependence on US-based technology vendors. CLRP.L is trading at 218p, 12% below the day of the incident.\n\nThe NexCore contract remains in force. The termination clause was never formally activated. NexCore have submitted a counter-claim for breach of their emergency security protocol provisions.\n\nThe PRA's supervision note: 'Clearpoint Bank's response to the operational incident of 14 April 2026 was materially inadequate. Notification delays, failure to activate contingency payment routes promptly, inadequate customer communication, and an insufficient Consumer Duty response have together produced significant customer harm. This matter has been referred for enforcement consideration.'",
      facilitatorNotes:
        "Weak outcome. The team made the TSB mistakes: they waited for the vendor, they held communications, they failed vulnerable customers in branches, and they did not activate contingency payment routes until too late. Map each of these to the actual decision points. The 18,000 customer figure is calibrated to the real TSB attrition data. The £12M fine is below the TSB level (£48.7M) because Clearpoint is a smaller firm: scale it to the firm's size during debrief. The parliamentary questions element is real: TSB faced a Commons Select Committee. Ask the room: what would you have said to that committee?",
      delayMinutes: 0,
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CFO", "CISO", "CLO", "COO", "CCO"],
    },

  ],
};
