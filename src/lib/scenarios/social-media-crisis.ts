import type { Scenario } from "@/types";

export const SOCIAL_MEDIA_CRISIS_SCENARIO: Scenario = {
  id: "tpl-social-media-crisis-001",
  title: "Social Media: The Post",
  description:
    "At 18:47 on a Tuesday, a contractor accidentally posts a politically contentious tweet from Hartley & Webb's official account. It is live for 23 minutes. By the time it is deleted: 4,200 retweets, 2.1 million impressions, screenshots everywhere. Covers corporate communications, FCA MAR obligations, employment law, board governance, and the reputational calculus of a firm whose entire business is selling judgement.",
  type: "SOCIAL_MEDIA_CRISIS",
  difficulty: "HIGH",
  durationMin: 150,
  isTemplate: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2026-04-14T00:00:00Z",
  coverGradient: "135deg, #0a0a1a 0%, #1a0a2e 40%, #7928ca 100%",
  regulatoryFrameworks: [
    "FCA MAR / DTR",
    "UK Defamation Act 2013",
    "Employment Rights Act 1996",
    "FCA SYSC 12",
    "UK GDPR",
  ],
  realOutcome:
    "This scenario draws on several real UK corporate social media crises between 2018 and 2024, including incidents where contractors and employees accidentally posted from company accounts after managing both personal and organisational profiles through scheduling tools such as Hootsuite and Buffer.\n\nIn real cases, the first 90 minutes determined whether the story became a two-day news item or a week-long reputational crisis. Specifically, whether leadership responded personally or through their PR function shaped how journalists framed the narrative: a human, direct apology from a named executive consistently shortened the cycle. A corporate holding statement with no named individual consistently lengthened it.\n\nFCA-listed companies face additional complexity. Social media posts can constitute market-sensitive communications under the Market Abuse Regulation, particularly where the post could be read as commenting on the company's operating environment, regulatory position, or commercial relationships. Several firms received FCA letters of enquiry following social media incidents in the 2020 to 2024 period, even where no formal enforcement action followed. The common factor was inadequate social media governance: specifically, the absence of formal controls preventing single-person access to corporate accounts without secondary approval.",
  roles: ["CEO", "CLO", "CFO", "CCO", "HR_LEAD", "BOARD_REP"],
  briefing:
    "You are the executive leadership team of Hartley & Webb plc, a FTSE SmallCap executive search and board advisory firm (ticker: HWB.L). In 31 years the firm has placed more than 400 FTSE board members, 60 FTSE 100 chief executives, and dozens of public-sector permanent secretaries. Your clients are, by definition, the most senior and reputationally sensitive people in British business. The judgement you sell is the product. If Hartley & Webb looks disorganised, ideologically tainted, or incapable of managing its own communications, clients begin to wonder whether the judgement they are paying for is real.\n\nIt is 18:47 on a Tuesday evening. The exercise begins now.",

  injects: [

    // ─── ACT 1 - DISCOVERY ────────────────────────────────────────────────────

    {
      id: "smc-i01",
      commandTier: "GOLD",
      order: 0,
      scenarioDay: 1,
      scenarioTime: "18:47",
      title: "The Post",
      body: "At 18:47 this evening, Priya Mehta, Head of Digital Marketing and a contractor six months into her engagement, accidentally posted the following from the company's official @HartleyWebb Twitter account. She was managing both her personal account and the company account through Hootsuite and hit the wrong send button. She did not notice for 23 minutes. By the time it was deleted it had 4,200 retweets, 2.1 million impressions, and screenshots were already circulating across political and business Twitter.\n\nYour CCO has just called you. The tweet is deleted. The screenshots are not.",
      facilitatorNotes:
        "This is a narrative inject. No decision vote required. Let the room see the tweet and sit with it for 60 to 90 seconds before moving on. The tweet is deliberately ambiguous: contentious but not illegal, personal but posted from a corporate account. The key coaching point to surface later: the problem is not the view, it is the account from which it was expressed. Ask participants: what is your instinctive read of the public response? What does your most important client see when they open Twitter tonight?",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "BREAKING: @HartleyWebb tweet goes viral | screenshots circulating | 2.1M impressions in 23 minutes",
      artifact: {
        type: "tweet",
        tweetHandle: "@HartleyWebb",
        tweetDisplayName: "Hartley & Webb plc",
        tweetLikes: 847,
        tweetRetweets: 4200,
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CCO", "CLO", "HR_LEAD", "CFO", "BOARD_REP"],
      expectedKeywords: ["delete", "screenshot", "retweet", "contractor", "Priya", "impressions"],
    },

    {
      id: "smc-i02",
      commandTier: "GOLD",
      order: 5,
      scenarioDay: 1,
      scenarioTime: "19:02",
      title: "First Response: What Does Hartley & Webb Say?",
      body: "It is 19:02. The tweet has been deleted but the screenshots are on at least 40 accounts with a combined following of 3.1 million. Your CCO, Dominic Farrow, has drafted three possible response approaches and is asking for a decision within the next 15 minutes. Journalists from the Financial Times, City A.M., and the Evening Standard have already made contact via the press office. One blogger who covers executive search has published a screenshot with the caption: 'The firm that places your board doesn't seem to know who is running its own Twitter.'\n\nThe decision you make in the next quarter-hour will define how this story is told.",
      facilitatorNotes:
        "The best answer is A: a personal, named response from the CEO is the single biggest de-escalation lever available. It signals accountability, it is human, and it is harder for journalists to build a narrative around than a corporate statement. Option B is defensible but positions Hartley & Webb as an institution hiding behind language. Option C is a real trap: legal review will take hours and the story will move without you. Option D is the worst call: silence with a deletion reads as guilty knowledge and hands the narrative entirely to others.\n\nWatch for teams that jump to HR or legal as the first move. The comms decision and the employment decision are separate tracks. They must be run in parallel, not sequentially.",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "Hartley & Webb silent as Twitter row grows | press office swamped with enquiries",
      artifact: {
        type: "email",
        emailFrom: "d.farrow@hartleywebb.com",
        emailTo: "c.webb@hartleywebb.com",
        emailSubject: "URGENT: Response options, @HartleyWebb tweet, need decision by 19:15",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CCO", "CLO"],
      recapLine: "responded publicly with {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Immediate personal apology from the CEO on Twitter, named, signed, acknowledging the error within minutes, expressing regret, and confirming it does not reflect the company's position",
          consequence:
            "Journalists report the CEO responded personally within the hour. The FT's morning story leads with 'swift accountability'. The cycle shortens. Clients who call over the next 24 hours are met with a coherent account rather than silence.",
          rank: 1,
          recapFragment: "a named personal apology from the CEO",
        },
        {
          key: "B",
          label: "Corporate statement via the press office: 'This post does not represent the views of Hartley & Webb. We are investigating and will update shortly'",
          consequence:
            "The statement is accurate but faceless. Political commentators and several journalists note the absence of any named individual. The Evening Standard runs the story under 'Top headhunter firm in social media row: company declines to name who is responsible'. The cycle runs two days longer than it needs to.",
          rank: 2,
          recapFragment: "a corporate holding statement",
        },
        {
          key: "C",
          label: "No public comment until the CLO has reviewed. Hold the press office and wait for legal clearance.",
          consequence:
            "Legal review takes until 21:40. By that point three national newspapers have filed their online versions of the story with Hartley & Webb listed as 'declining to comment'. The silence is interpreted as disarray. The FCA notes the delay in its subsequent letter of enquiry.",
          rank: 3,
          recapFragment: "a decision to hold for legal review",
        },
        {
          key: "D",
          label: "Delete and say nothing further. The tweet is gone; the news cycle will move on.",
          consequence:
            "The deletion without comment is treated by media and commentators as confirmation that the company knows it was wrong and is hoping no one noticed. Within 90 minutes, three Twitter accounts dedicated to corporate accountability have pinned the screenshot with the caption 'Hartley & Webb: deleted. Silent. Watching.' The story runs all week.",
          rank: 4,
          recapFragment: "a decision to delete and stay silent",
        },
      ],
    },

    {
      id: "smc-i03",
      commandTier: "SILVER",
      order: 10,
      scenarioDay: 1,
      scenarioTime: "19:04",
      title: "Priya's Voicemail",
      body: "At 19:04, Priya Mehta calls the CCO's personal mobile. She is in tears. She leaves a voicemail. She has already told two friends what happened. She is asking whether she should post a personal apology from her own Twitter account, which has 3,400 followers.\n\nYour HR Lead and CLO need to give guidance. She is a contractor, not an employee, and her contract runs through Meridian Talent Solutions Ltd. What do you tell her?",
      facilitatorNotes:
        "The decision here sits primarily with HR and Legal. The key tensions: (1) she is a contractor not an employee, which changes the formal disciplinary route but not the duty of care; (2) a personal public apology from her could inadvertently amplify the story and add a named individual for journalists to pursue; (3) immediate suspension or termination before any investigation is an employment law risk even for contractors, and the engagement contract terms matter.\n\nOption A is correct: personal support, clear instruction not to post publicly yet, and begin the formal investigation process. Option B may feel decisive but could be premature without a short investigation. Option C risks amplifying the story with a second personal account. Option D is legally and ethically disproportionate at this stage.\n\nAsk the HR Lead: what is your first call to Meridian Talent Solutions, and what does it say?",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline: "Social media contractor at centre of Hartley & Webb row | identity being sought online",
      artifact: {
        type: "voicemail",
        voicemailCaller: "Priya Mehta, Head of Digital Marketing (contractor)",
        voicemailCallerNumber: "+44 7891 234567",
        voicemailDuration: "1:14",
        voicemailTime: "19:04",
        voicemailTranscript: "Hi Dominic, it's Priya. I'm so, so sorry. I don't even know where to start. I had both accounts open in Hootsuite and I posted to the wrong one. I deleted it as soon as I saw but it was up for nearly half an hour. I've been watching the retweets. I'm horrified. I wanted to say, I was thinking, should I post something from my own account? Just to explain? I just don't want Hartley and Webb to take the hit for something that was completely my fault. Please call me. Or don't. I understand if you don't want to. I'm just, I'm really sorry. I don't know what to do.",
      },
      isDecisionPoint: true,
      targetRoles: ["HR_LEAD", "CLO", "CCO"],
      recapLine: "managed Priya's situation by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Call Priya personally: express support, make clear she should not post anything publicly yet, explain that a formal process will follow, and tell her you will speak to her again tomorrow",
          consequence:
            "Priya does not post. The investigation can proceed without the additional complication of a second named account entering the story. She feels heard and is less likely to speak to journalists.",
          rank: 1,
          recapFragment: "offering personal support while asking her not to post publicly",
        },
        {
          key: "B",
          label: "Notify Meridian Talent Solutions and suspend the contractor engagement pending a formal investigation. No contact with Priya directly tonight.",
          consequence:
            "The formal process is triggered correctly but Priya, left without any personal contact, calls a journalist at City A.M. by 22:00. The story now has a named individual and a quote: 'I reached out and heard nothing.' The CCO spends tomorrow morning managing that.",
          rank: 2,
          recapFragment: "initiating a formal suspension through Meridian Talent Solutions",
        },
        {
          key: "C",
          label: "Encourage Priya to post a personal apology from her own account. It keeps the narrative human and accepts responsibility.",
          consequence:
            "Priya's personal account becomes part of the story. Journalists have a name. By 08:00 the next morning, several outlets are running 'Who is Priya Mehta?' pieces. The crisis has acquired a human face that takes weeks to disappear.",
          rank: 3,
          recapFragment: "encouraging Priya to post a personal public apology",
        },
        {
          key: "D",
          label: "Terminate the contractor engagement immediately with immediate effect. Send a formal notice tonight via email.",
          consequence:
            "The termination without due process is a legal risk. Meridian Talent Solutions' counsel contacts Hartley & Webb the following morning. The FT gets hold of the termination story and runs 'Headhunter fires contractor within hours of Twitter row', which damages the firm more than the original tweet.",
          rank: 4,
          recapFragment: "terminating Priya's contract immediately",
        },
      ],
    },

    {
      id: "smc-i04",
      commandTier: "GOLD",
      order: 15,
      scenarioDay: 1,
      scenarioTime: "19:45",
      title: "FCA Question: Does This Tweet Constitute Market-Sensitive Communication?",
      body: "At 19:45, your CLO, Sasha Okafor, has circulated an urgent internal memo to the CEO and CFO. As a company listed on the London Stock Exchange under the FCA's DTR regime, Hartley & Webb has obligations under FCA MAR Article 17 regarding market-sensitive communications. Okafor's concern: the tweet, posted from an official corporate account, expressed a view on UK immigration policy. Given that H&W's business depends on placing senior executives, several of whom are international nationals or dual nationals, a perceived company view on immigration could be material to investor assessments of the firm's commercial relationships and regulatory standing.\n\nThis may be a stretch. It may not be. The clock is ticking and the FCA has a monitoring function for listed company social media.",
      facilitatorNotes:
        "This inject tests whether the team can separate 'probably not a breach' from 'we have properly considered it and documented our reasoning'. The correct answer is B: take external FCA counsel advice tonight. The practical answer for most firms is C combined with B.\n\nOption A is premature before you have legal advice. Option D is the dangerous answer: dismissing the FCA dimension because it feels like a social media incident. The FCA's letters of enquiry in real cases frequently note that companies failed to apply their MAR procedures to social media because they did not conceptually classify a tweet as a company communication.\n\nAsk the CLO: what does your social media policy say about who has authority to speak on behalf of the company? Does the contractor agreement with Meridian Talent Solutions address this?",
      delayMinutes: 0,
      timerMinutes: 9,
      tickerHeadline: "FCA monitors listed company social media for market-sensitive disclosures | analyst note",
      artifact: {
        type: "internal_memo",
        memoTitle: "URGENT LEGAL OPINION: FCA MAR Article 17: Does Tonight's Twitter Incident Trigger Notification Obligations?",
        memoClassification: "STRICTLY CONFIDENTIAL: LEGAL PRIVILEGE",
        memoTo: "CEO, CFO",
        memoFrom: "S. Okafor, Chief Legal Officer",
        memoDate: "Tuesday, 14 April 2026, 19:45",
        memoRef: "HW-LEGAL-2026-0147",
      },
      isDecisionPoint: true,
      targetRoles: ["CLO", "CFO", "CEO"],
      recapLine: "handled the FCA question by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Make a voluntary notification to the FCA tonight. Get ahead of it before they contact us.",
          consequence:
            "External FCA counsel, when reached at 20:30, advises this is premature and likely unnecessary. The voluntary notification has been submitted and cannot be easily withdrawn. The FCA acknowledges it and opens a monitoring file. You have notified yourself into scrutiny.",
          rank: 3,
          recapFragment: "making a voluntary FCA notification without external advice",
        },
        {
          key: "B",
          label: "Instruct external FCA specialist counsel tonight. Get a written opinion before making any decision on notification.",
          consequence:
            "Herbert Smith Freehills' regulatory team is reached at 20:15. Their written opinion arrives at 22:10: the tweet does not on its current facts constitute a breach of MAR Article 17, but the company should prepare a written record of its analysis and review its social media policy within 14 days. You have a defensible paper trail.",
          rank: 1,
          recapFragment: "instructing external FCA counsel for a written opinion",
        },
        {
          key: "C",
          label: "The CLO drafts a short internal record of the analysis tonight, concludes no notification is warranted, and takes no external action",
          consequence:
            "The internal record is completed at 21:00. When the FCA letter arrives 11 days later, the company has a contemporaneous document showing the analysis was done. It is thin on legal substance but it exists. The FCA's follow-up is more pointed than it would have been with external counsel.",
          rank: 2,
          recapFragment: "creating an internal legal record without external advice",
        },
        {
          key: "D",
          label: "No action. This is a social media incident, not a regulatory matter, and the FCA has no interest in a deleted tweet.",
          consequence:
            "The FCA Market Watch team, which monitors listed company social media, has already flagged the tweet. Their letter arrives 9 working days later. There is no contemporaneous record of any internal analysis. The FCA notes the absence of documentation in its subsequent enquiry.",
          rank: 4,
          recapFragment: "concluding it was not a regulatory matter and taking no action",
        },
      ],
    },

    // ─── ACT 2 - OVERNIGHT ───────────────────────────────────────────────────

    {
      id: "smc-i05",
      commandTier: "GOLD",
      order: 18,
      scenarioDay: 1,
      scenarioTime: "21:12",
      title: "Board Portal: The SID Is Watching",
      body: "At 21:12, your Company Secretary alerts you that three of the six non-executive directors are logged into the board portal. The Senior Independent Director, Sir Geoffrey Barnard, has posted a message in the board discussion thread: 'Have seen the tweet. Assume it was deleted in error. Presume this is being handled. Would appreciate a brief note on the situation before I field any calls tomorrow. The Chairman is not yet online.'\n\nBarnard sits on two other audit committees and is careful with his words. 'Assume deleted in error' is not quite the same as 'I understand what happened'. He has not yet spoken to media but he will be asked.",
      facilitatorNotes:
        "Governance question: who briefs the board and when? The correct answer is A: call the SID now, brief verbally, give him the facts he needs to respond to any enquiries overnight. Option B is second best: a written update is slower but covers everyone simultaneously. Option C risks the SID feeling managed rather than included. Option D is the worst call: waiting until morning means the Chairman hears about it from someone other than the executive team, which damages trust.\n\nAsk the BOARD_REP: does your board have a social media communications protocol? What does the relationship between the Chairman and CEO normally look like in a crisis? Has anyone told the Chairman yet?",
      delayMinutes: 0,
      timerMinutes: 7,
      tickerHeadline: "Hartley & Webb NEDs briefed | board oversight of crisis response under scrutiny",
      artifact: {
        type: "board_portal",
        boardPortalOrgName: "Hartley & Webb plc",
        boardPortalAlertCount: 1,
        boardPortalAlertTitle: "New message in Board Discussion, from Senior Independent Director",
        boardPortalMembers: [
          { name: "Sir Geoffrey Barnard", role: "Senior Independent Director", isOnline: true, loggedInAt: "21:08" },
          { name: "Caroline Finch", role: "Chair, Audit Committee", isOnline: true, loggedInAt: "21:03" },
          { name: "Dr. Marcus Lowe", role: "Non-Executive Director", isOnline: true, loggedInAt: "20:58" },
          { name: "Lord Henry Ashworth", role: "Non-Executive Director", isOnline: false },
          { name: "Natasha Reid", role: "Non-Executive Director", isOnline: false },
          { name: "Richard Hartley", role: "Chairman", isOnline: false },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "BOARD_REP", "CLO"],
      recapLine: "briefed the board by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Call the SID now. Brief verbally, give him the full factual picture, confirm what is being done and when he can expect the next update.",
          consequence:
            "Barnard is appreciative and concise. 'Thank you. I'll hold any calls until your morning update. Please make sure Richard hears it from you first.' The Chairman is called at 21:30. Board governance is intact.",
          rank: 1,
          recapFragment: "calling the SID personally and briefing him that evening",
        },
        {
          key: "B",
          label: "Post a written factual update to all board members via the portal: brief, professional, covering what happened, what was done, and what comes next.",
          consequence:
            "The update is posted at 21:45. The SID reads it and replies: 'Noted. Thank you.' The Chairman reads it the next morning before the CEO has called him, which creates a brief awkwardness in their 08:30 call.",
          rank: 2,
          recapFragment: "posting a written brief to all NEDs via the board portal",
        },
        {
          key: "C",
          label: "Ask the Company Secretary to respond with 'being managed at executive level, full brief to follow in the morning'",
          consequence:
            "The SID reads this as 'the executives are managing us'. He calls the Chairman directly at 21:30. The Chairman, hearing about it from the SID before the CEO, calls the CEO at 21:48. It is not a comfortable call.",
          rank: 3,
          recapFragment: "asking the Company Secretary to send a holding message",
        },
        {
          key: "D",
          label: "Wait until morning. Brief the Chairman first thing, then hold a full board call before markets open.",
          consequence:
            "The SID, hearing nothing, assumes the matter is more serious than it is. He calls the Chairman at 22:15. By 07:00 the next morning, the Chairman has already formed a view that the executive team was slow to communicate, which colours the entire morning board call.",
          rank: 4,
          recapFragment: "waiting until morning to brief the board",
        },
      ],
    },

    {
      id: "smc-i06",
      commandTier: "GOLD",
      order: 22,
      scenarioDay: 1,
      scenarioTime: "21:58",
      title: "The Former Employee Weighs In",
      body: "At 21:58, a former Hartley & Webb senior consultant who left the firm acrimoniously 18 months ago has posted on LinkedIn. James Cartwright was asked to leave following a disagreement over client billing practices. The matter was settled with a compromise agreement and a confidentiality clause. His post is now circulating widely within the City and executive search communities. It has accumulated 1,400 likes in 40 minutes and is being shared by several people Hartley & Webb consider close clients.\n\nYour CLO has flagged the confidentiality clause. Your CCO has flagged the 1,400 likes.",
      facilitatorNotes:
        "A multi-layered problem. The confidentiality clause may or may not cover the substance of Cartwright's post. He has not disclosed specifics of the settlement, only made a general reputational claim. Option A is correct: the defamation analysis needs to happen and no public response should be made until it is complete. Option B is the trap: a public response from the company to a LinkedIn post from a disgruntled ex-employee dignifies the post and guarantees it a second news cycle. Option C is tempting but risks escalating to litigation if handled badly. Option D is the hidden correct answer for some teams but can backfire if staff perception of the ex-employee is sympathetic.\n\nAsk the CLO: what does the compromise agreement actually cover? Ask the CCO: which clients are sharing this? Are they sharing it with a comment?",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline: "Former H&W consultant posts on LinkedIn | 'Culture has always been out of touch'",
      artifact: {
        type: "linkedin_post",
        linkedinAuthor: "James Cartwright",
        linkedinAuthorTitle: "Former Senior Consultant, Hartley & Webb | Independent Search Adviser",
        linkedinText: "Not surprised by what happened at Hartley & Webb today. The culture there has always been, shall we say, out of touch. This is just the public version of what goes on inside. I hope the people affected are okay. Sometimes the mask slips.",
        linkedinLikes: 1400,
        linkedinComments: 87,
        linkedinShares: 214,
      },
      isDecisionPoint: true,
      targetRoles: ["CLO", "CCO", "CEO"],
      recapLine: "addressed the ex-employee LinkedIn post by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Ask legal to review the post against the compromise agreement and assess defamation risk. Take no immediate public action; monitor the engagement.",
          consequence:
            "Legal confirms by 23:00 that the post, while damaging in tone, does not breach the compromise agreement and does not meet the threshold for a defamation claim. No action is taken publicly. The post peaks at 1,800 likes and fades within 36 hours.",
          rank: 1,
          recapFragment: "instructing legal to review for defamation and taking no immediate public action",
        },
        {
          key: "B",
          label: "Respond publicly via LinkedIn: a brief, professional response that politely corrects the narrative without engaging the substance.",
          consequence:
            "The public response guarantees the post a second news cycle. Several journalists screenshot the exchange. City A.M. runs 'Hartley & Webb in LinkedIn spat with former consultant' the following morning. The original tweet story now has a second chapter.",
          rank: 3,
          recapFragment: "responding publicly to the LinkedIn post",
        },
        {
          key: "C",
          label: "Contact Cartwright's solicitor directly. Reference the compromise agreement and ask that the post be removed.",
          consequence:
            "Cartwright's solicitor responds that the post contains no confidential information and declines to act. Cartwright adds a comment to his post: 'I note that my former employer has already been in touch through lawyers. Draw your own conclusions.' The post reaches 2,600 likes.",
          rank: 4,
          recapFragment: "contacting Cartwright's solicitor to seek removal",
        },
        {
          key: "D",
          label: "Share the LinkedIn post internally with a brief factual note to staff acknowledging the situation and confirming the company's position",
          consequence:
            "Staff feel the company is being transparent. Several senior directors respond positively to the note. One junior staff member shares it externally, which has no further impact. The post fades. The internal communication is later cited as an example of good internal crisis management.",
          rank: 2,
          recapFragment: "sharing the post internally with a factual staff note",
        },
      ],
    },

    // ─── ACT 3 - MORNING ─────────────────────────────────────────────────────

    {
      id: "smc-i07",
      commandTier: "GOLD",
      order: 25,
      scenarioDay: 2,
      scenarioTime: "08:10",
      title: "Sky News Business: The Story Has Gone National",
      body: "08:10, Wednesday. Sky News Business is running the story as their second item in the morning bulletin. The presenter says: 'One of the UK's most prestigious executive search firms is facing questions this morning after a politically contentious tweet was posted from its official account yesterday evening. Hartley & Webb, which places FTSE board members and advises on senior public appointments, deleted the post after approximately 23 minutes, but not before it had been seen by more than two million accounts. The firm is yet to make a full public statement.'\n\nThe lower-third reads: 'HARTLEY & WEBB TWITTER ROW: CLIENTS ASK QUESTIONS.' The share price has not yet opened.",
      facilitatorNotes:
        "Narrative inject. No formal decision. Use this to reset the room and mark the shift from overnight crisis management to public daylight. The television coverage means the story has graduated: it is no longer a Twitter event, it is a business news event.\n\nKey coaching point: 'The firm is yet to make a full public statement' reflects whether the team chose Option A in Inject 2. If they did, the broadcast would say something different. If they didn't, this is the consequence. Let it land.\n\nAsk: who is watching this bulletin this morning? Your clients. Your candidates. Your NEDs. The FCA market abuse monitoring team. What do each of them need to hear from you by 09:00?",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "SKY NEWS: 'Hartley & Webb Twitter row | FTSE headhunter faces client questions' | 08:10",
      artifact: {
        type: "tv_broadcast",
        tvNetwork: "SKY NEWS BUSINESS",
        tvHeadline: "HARTLEY & WEBB TWITTER ROW: CLIENTS ASK QUESTIONS",
        tvTicker: "Hartley & Webb plc (HWB.L) | tweet deleted after 23 minutes | 2.1M impressions | no formal statement | share price to open shortly",
        tvReporter: "Charlotte Graves, City Reporter",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CCO", "CFO", "BOARD_REP"],
      expectedKeywords: ["Sky News", "broadcast", "national", "clients", "share price", "statement"],
    },

    {
      id: "smc-i08",
      commandTier: "GOLD",
      order: 28,
      scenarioDay: 2,
      scenarioTime: "08:34",
      title: "HWB.L Opens Down 4.2%",
      body: "HWB.L opens at 08:34. The share price is down 4.2% on the opening. Volume in the first four minutes is 3.1 million shares, roughly 14 times the average daily volume for a normal morning session. Your CFO, Rachel Greenwood, is on the line with your investor relations adviser, Mark Deacon at Buchanan Communications. Deacon says: 'The market is pricing in client uncertainty, not a fundamental. If you get a client statement out by lunchtime with a named FTSE board member expressing continued confidence, we can probably stop this here. If you don't, the short-sellers move.'",
      facilitatorNotes:
        "No formal decision in this inject but it should provoke a conversation. The CFO and CEO need to be thinking about: (1) whether an RNS is warranted; (2) who they can call to provide a public endorsement; (3) what the investor relations message is.\n\nThe 4.2% drop is not catastrophic but it is meaningful for a FTSE SmallCap. The volume signal is more important: it indicates institutional holders are repositioning. Ask the CFO: do you need to speak to your largest three shareholders this morning? Who are they and what is your relationship with them?\n\nNote: if the team chose Option D in Inject 2 (silence), the drop would be 6.1% instead.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "HWB.L opens -4.2% on heavy volume | investor relations under pressure",
      artifact: {
        type: "stock_chart",
        stockTicker: "HWB.L",
        stockCompanyName: "Hartley & Webb plc",
        stockOpenPrice: 5.40,
        stockCurrentPrice: 5.17,
        stockChangePercent: -4.2,
        stockVolume: "3.1M",
      },
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CFO", "CEO", "BOARD_REP"],
      expectedKeywords: ["share price", "volume", "RNS", "investor relations", "short seller", "Buchanan"],
    },

    {
      id: "smc-i09",
      commandTier: "SILVER",
      order: 30,
      scenarioDay: 2,
      scenarioTime: "08:52",
      title: "Three Client Emails: The Clients Are Asking Questions",
      body: "By 08:52 the CEO's inbox contains emails from three FTSE board members who have previously been placed by Hartley & Webb. Two are asking for an urgent call. The third, Lord Henry Ashworth, a non-executive director on the boards of three FTSE 100 companies all placed through Hartley & Webb, has written: 'Dear Caroline, I am being asked by at least two journalists about my association with Hartley and Webb this morning. I need to understand the full picture before I make any statement, public or otherwise. I would appreciate a call before 10:00. I cannot have my name associated with this story without knowing what I am dealing with.' Lord Ashworth is Hartley & Webb's most prominent placed board member and a standing reference for new client pitches.",
      facilitatorNotes:
        "The relationship management decision. Option A is best: the CEO calls personally, proactively, before the clients speak to press. This is a moment where the CEO's personal credibility is the asset being deployed. A comms team briefing note (Option B) is slower and less personal. Holding (Option C) is dangerous: Lord Ashworth has said he has a 10:00 deadline. Option D (relationship managers) is appropriate for the broader client base but not for Lord Ashworth.\n\nAsk the CEO: what do you actually say to Lord Ashworth on that call? Can you give him enough of the facts to answer journalists without putting him in a position where he is defending you? What does he need from you compared with what he wants from you?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "Hartley & Webb clients contacted by journalists | placed board members face questions",
      artifact: {
        type: "email",
        emailFrom: "h.ashworth@chambersgroup.co.uk",
        emailTo: "c.webb@hartleywebb.com",
        emailSubject: "Urgent: call before 10:00 please",
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CCO"],
      recapLine: "handled client relations by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "CEO calls all three personally and proactively before 09:30. Gives them the full factual account and asks whether they are willing to make a brief supportive statement.",
          consequence:
            "Lord Ashworth takes the call at 09:10. At 10:45 his communications team issues a brief statement: 'Lord Ashworth has spoken with the Chief Executive of Hartley and Webb and is satisfied with their response. He has every confidence in the firm's leadership.' The FT's afternoon update leads with that quote.",
          rank: 1,
          recapFragment: "the CEO calling all three clients personally before 09:30",
        },
        {
          key: "B",
          label: "CCO drafts a client briefing note by 09:00 and sends it to all 47 active client contacts with a named CCO contact for calls",
          consequence:
            "Lord Ashworth receives the note at 09:05 but calls the CEO's PA asking for a direct call. The PA puts him through at 09:40. The delay costs 50 minutes against his stated 10:00 deadline. He speaks to a journalist at 10:15 with incomplete information.",
          rank: 2,
          recapFragment: "sending a CCO client briefing note to all active contacts",
        },
        {
          key: "C",
          label: "Hold. Wait for the morning news cycle to settle before making client contact, to avoid over-amplifying the story.",
          consequence:
            "Lord Ashworth, having heard nothing by 09:55, speaks to a Financial Times journalist at 10:00. He says: 'I have not yet spoken to Hartley and Webb this morning.' This becomes the headline: 'Top H&W client not yet contacted'. The news cycle is extended by 48 hours.",
          rank: 4,
          recapFragment: "deciding to wait for the news cycle to settle before contacting clients",
        },
        {
          key: "D",
          label: "Ask relationship managers to contact their own client portfolios individually. The CEO handles Lord Ashworth directly.",
          consequence:
            "Lord Ashworth is briefed by 09:15 and is supportive. The broader relationship manager calls are patchy: two relationship managers are not yet in the office and their clients are not called until after 10:00. Three clients issue cautious responses to press before being briefed.",
          rank: 2,
          recapFragment: "splitting the client calls between the CEO and relationship managers",
        },
      ],
    },

    {
      id: "smc-i10",
      commandTier: "SILVER",
      order: 35,
      scenarioDay: 2,
      scenarioTime: "09:18",
      title: "Internal Slack: Staff Are Talking",
      body: "Your Head of Digital Operations has forwarded a screenshot of the #general Slack channel. Opinions are divided. Several employees are supportive of Priya: 'Everyone knows this was a mistake, she's a good person.' Some are angry: 'This looks appalling for the firm. We work in a reputation business.' One senior director, Tom Hartley (the founder's son, a director of research), has messaged: 'Should we even be in the office today? The press are outside.' Three people have not turned up for their 09:00 teams calls without explanation.\n\nStaff are forming their own views on what happened and the company has not yet said anything internally.",
      facilitatorNotes:
        "Internal communications during an external crisis is a common gap. Option A (CEO all-staff email within the hour) is the best answer: staff need to hear from the most senior person, they need to hear the facts as the company understands them, and they need to be told what to do if they are approached by media. Option B (all-hands) is good but 10:00 is tight and it risks delay if the logistics are not ready. Option C (line managers) is unreliable: line managers will say different things.\n\nAsk the CEO: what does your internal message actually say? Can you say who was responsible? Can you address the substance of the tweet? What do you say to the staff member who agrees with the sentiment in the tweet?\n\nTom Hartley is a complication. He is the founder's son. He has an informal authority that does not match his job title. His 'should we be in the office' message is being watched by 240 people.",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline: "H&W staff divided as internal chatter grows | press camped outside Mayfair office",
      artifact: {
        type: "slack_thread",
        slackChannel: "#general",
        slackMessages: [
          { author: "Priya Mehta", role: "Head of Digital Marketing", time: "08:44", text: "I am so sorry everyone. I can't say much but I want you all to know this was my mistake and mine alone. I hope it hasn't caused too much damage." },
          { author: "Sophie Aldred", role: "Senior Researcher", time: "08:51", text: "Priya please don't worry. Everyone knows this was an accident. This is not on you." },
          { author: "Tom Hartley", role: "Director of Research", time: "09:02", text: "I don't think everyone does know that actually. From the outside this looks like the company said it. Should we even be in the office today? There's a photographer outside." },
          { author: "Marcus Lee", role: "Associate Consultant", time: "09:07", text: "I've had two headhunters message me this morning asking if I'm looking. Not great." },
          { author: "Anita Varma", role: "Head of Client Relationships", time: "09:14", text: "We need a company statement. Something. Anything. I'm getting calls and I don't know what to say." },
          { author: "James Robson", role: "Managing Director, Public Sector", time: "09:17", text: "A journalist called my personal mobile 10 minutes ago. I told them to contact the press office. Is that right?" },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "HR_LEAD", "CCO"],
      recapLine: "addressed staff by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "CEO sends a direct all-staff email within the hour: factual, warm, confirming what happened, what is being done, and what staff should do if approached by media.",
          consequence:
            "The email lands at 09:55. Staff respond positively. Several forward it to clients unprompted, which is an unexpected benefit. Tom Hartley replies to the CEO privately: 'Thank you. Needed this.' The Slack chatter quietens.",
          rank: 1,
          recapFragment: "the CEO sending a direct all-staff email within the hour",
        },
        {
          key: "B",
          label: "Hold an emergency virtual all-hands at 10:00. CEO leads, gives full account, takes questions.",
          consequence:
            "The all-hands is called at 09:20 for 10:00. Seven people can't join due to client meetings. Tom Hartley asks a pointed question about governance that the CEO handles well but which is summarised on social media by an attendee at 10:45. The meeting itself is well received.",
          rank: 2,
          recapFragment: "calling an emergency virtual all-hands at 10:00",
        },
        {
          key: "C",
          label: "Ask line managers to brief their teams individually. Consistent message, no big meeting risk.",
          consequence:
            "Fourteen line managers deliver fourteen versions of the story. By 11:00, two people believe Priya has been terminated, one person believes the CEO is resigning, and the Director of Research has told his team the matter is 'under legal review and cannot be discussed'. The Slack chatter intensifies.",
          rank: 3,
          recapFragment: "asking line managers to brief their teams individually",
        },
        {
          key: "D",
          label: "No specific staff communication. Focus all resource on external crisis management first.",
          consequence:
            "Staff hear nothing official all morning. By 12:00, three of the seven senior directors have told their teams they have 'no information'. Anita Varma, Head of Client Relationships, gives an off-the-record comment to a journalist at 12:30: 'It's been chaotic internally.' This runs in the Standard's afternoon edition.",
          rank: 4,
          recapFragment: "prioritising external comms and making no internal statement",
        },
      ],
    },

    {
      id: "smc-i11",
      commandTier: "GOLD",
      order: 40,
      scenarioDay: 2,
      scenarioTime: "10:05",
      title: "The Short Seller",
      body: "At 10:05, your CFO Rachel Greenwood receives a call from Mark Deacon at Buchanan Communications. A known activist short-seller, Hargate Capital, has disclosed a 2.1% short position in HWB.L this morning through a regulatory filing. This is within the legal threshold for disclosure and entirely legal. Deacon says the position was taken between 19:00 and 21:00 yesterday evening, within hours of the tweet. He describes it as 'deliberate and opportunistic'. The volume in the opening session confirms institutional repositioning. Hargate Capital has done this before: they took short positions in two other FTSE SmallCap firms during reputational crises in 2023 and 2024.\n\nDeacon's advice: 'You need to say something about the company's financial fundamentals before 11:00 or this becomes a market story, not a comms story.'",
      facilitatorNotes:
        "Option D (urgent RNS on financial position) is the correct answer if the share price drop or short position could be read as market-sensitive. Option C (no action: short positions are normal) is wrong in the specific context of a reputational crisis and a coordinated short. Option A is legally awkward: you cannot characterise a short position in a public statement without specific evidence of market manipulation, which you do not have. Option B (engage the short-seller directly) is unusual but not unheard of. Some IR advisers recommend it.\n\nAsk the CFO: what does an RNS actually say? Can you confirm that the firm's financial position is unaffected by a social media incident without creating new market-sensitivity? What does your legal team need to sign off before an RNS is issued?",
      delayMinutes: 0,
      timerMinutes: 8,
      tickerHeadline: "Hargate Capital discloses 2.1% short in HWB.L | opportunistic positioning flagged by IR advisers",
      artifact: {
        type: "email",
        emailFrom: "m.deacon@buchanan.co.uk",
        emailTo: "r.greenwood@hartleywebb.com",
        emailSubject: "HWB.L: Hargate short position, recommend immediate call",
      },
      isDecisionPoint: true,
      targetRoles: ["CFO", "CEO", "CLO"],
      recapLine: "responded to the short-seller position by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Disclose the Hargate short position context in a company statement: name it, describe it as opportunistic, and note the company's strong fundamentals.",
          consequence:
            "The CLO advises within 20 minutes that publicly characterising Hargate's position as 'opportunistic' in a company statement is legally inadvisable without specific evidence of market manipulation. The statement is redrafted to remove the reference. The delay costs 45 minutes.",
          rank: 3,
          recapFragment: "drafting a statement that referenced the short position directly",
        },
        {
          key: "B",
          label: "Engage Hargate Capital directly. Ask Buchanan to arrange a call and give them the facts before they brief journalists.",
          consequence:
            "Hargate declines to take the call. Buchanan's contact at Hargate says the position is 'commercially motivated'. The call attempt is not wasted. It demonstrates to the FCA, if asked, that the company sought to manage the situation proactively.",
          rank: 2,
          recapFragment: "attempting direct engagement with Hargate Capital",
        },
        {
          key: "C",
          label: "Take no action. Short positions are a normal market activity and responding draws attention to it.",
          consequence:
            "Hargate's position is noted by financial journalists and two analysts downgrade their recommendation by 11:30 citing 'governance uncertainty'. The share price falls a further 1.8% by midday. By afternoon, the story has two dimensions: the tweet and the market response.",
          rank: 4,
          recapFragment: "taking no action and treating the short as a normal market event",
        },
        {
          key: "D",
          label: "Issue an urgent RNS before 11:00 confirming the company's financial position is unaffected and pipeline remains strong",
          consequence:
            "The RNS is issued at 10:52. It is three sentences. It confirms trading is in line with expectations and that the company's client pipeline is unaffected by the social media incident. The share price recovers 1.4% within 20 minutes of the RNS. Hargate closes 40% of its position by 13:00.",
          rank: 1,
          recapFragment: "issuing an RNS confirming the financial position before 11:00",
        },
      ],
    },

    // ─── ACT 4 - AFTERNOON ───────────────────────────────────────────────────

    {
      id: "smc-i12",
      commandTier: "GOLD",
      order: 45,
      scenarioDay: 2,
      scenarioTime: "14:17",
      title: "FCA Market Watch: Formal Letter Received",
      body: "At 14:17 on Wednesday, the FCA's Market Watch supervision team has sent a formal letter to the Chief Legal Officer via the firm's FCA-registered secure portal. The letter requests that Hartley & Webb confirm, in writing and within 10 working days: (1) whether the tweet of 14 April constituted a breach of the company's social media policy; (2) whether internal controls over social media access by contractors were adequate at the time of the incident; (3) what steps have been taken or are planned to prevent recurrence. The letter is marked as a regulatory information request under section 165 of the Financial Services and Markets Act 2000. Failure to respond is a criminal offence.\n\nThe CLO has 10 working days. The clock is running.",
      facilitatorNotes:
        "This is a real mechanism. Section 165 FSMA 2000 gives the FCA statutory power to require information from authorised firms. Failure to comply is a criminal offence. This is not a soft letter of enquiry: it requires a formal response.\n\nOption A (specialist FCA counsel immediately, full response) is the correct answer. Option B (brief factual account) underestimates the formality of the request and the specificity of the answers required. Option C (holding response acknowledging receipt) buys time but must be followed by a substantive response within the 10-day window. Option D (informal discussion before formal response) can work if the FCA is receptive but is risky: you do not yet have a relationship with the supervising officer.\n\nAsk the CLO: who is your specialist FCA regulatory counsel? Are they on retainer? What does your social media policy actually say about contractor access?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "FCA sends formal s.165 information request to Hartley & Webb | 10-day deadline",
      artifact: {
        type: "regulator_portal",
        regulatorName: "Financial Conduct Authority, Market Watch Supervision",
        regulatorPortalUrl: "connect.fca.org.uk",
        regulatorCaseRef: "FCA-MW-2026-HWB-00412",
        regulatorStatus: "UNDER_REVIEW",
        regulatorSubmittedAt: "2026-04-14T14:17:00Z",
        regulatorDeadline: "10 working days from receipt",
        regulatorOfficerName: "Emma Carlisle, Senior Specialist, Market Conduct",
      },
      isDecisionPoint: true,
      targetRoles: ["CLO", "CEO", "CFO"],
      recapLine: "responded to the FCA formal request by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "Instruct specialist FCA regulatory counsel immediately (Herbert Smith Freehills or equivalent) and prepare a full, transparent response to all three questions within the 10-day window.",
          consequence:
            "The specialist counsel is instructed at 15:00. A draft response is completed by day 7 and submitted on day 8. The FCA acknowledges receipt and closes the file 22 days later with no further action, noting the 'prompt and comprehensive response'.",
          rank: 1,
          recapFragment: "instructing specialist FCA counsel and preparing a full response",
        },
        {
          key: "B",
          label: "The CLO drafts a brief factual account covering the three questions and submits it within 5 days. No external counsel needed.",
          consequence:
            "The response is submitted on day 5. The FCA comes back within 3 days with a follow-up request for additional documentation: the contractor agreement, the social media policy, and evidence of any policy training completed by contractors. The CLO did not anticipate the follow-up. The file remains open for 60 days.",
          rank: 2,
          recapFragment: "drafting a brief internal response without specialist counsel",
        },
        {
          key: "C",
          label: "Submit a short holding response acknowledging receipt and confirming a full substantive response will follow by day 9",
          consequence:
            "The FCA acknowledges the holding response. Specialist counsel is instructed the next morning. The holding response is legally sound and buys time without conceding ground. The substantive response is submitted on day 9. The file is closed after one follow-up.",
          rank: 2,
          recapFragment: "submitting a holding response and buying time for counsel",
        },
        {
          key: "D",
          label: "Seek an informal discussion with Emma Carlisle at the FCA before submitting a formal response. Explore whether the matter can be resolved conversationally.",
          consequence:
            "Emma Carlisle declines to have an informal discussion ahead of the formal response, citing the statutory nature of the request. The attempt is noted on the file. Day 3 is now gone and specialist counsel has not yet been instructed.",
          rank: 3,
          recapFragment: "attempting an informal conversation with the FCA before responding",
        },
      ],
    },

    {
      id: "smc-i13",
      commandTier: "SILVER",
      order: 50,
      scenarioDay: 2,
      scenarioTime: "15:30",
      title: "Employment Outcome: What Happens to Priya?",
      body: "At 15:30, your HR Lead and CLO have completed a preliminary investigation interview with Priya Mehta. She attended with a personal adviser. She has accepted full responsibility and provided a written account confirming the Hootsuite error was genuine and unintentional. There is no evidence of malicious intent. Her contractor record through Meridian Talent Solutions is clean. Her engagement was due to run for another four months.\n\nMeridian Talent Solutions have their own view on the appropriate outcome and have requested a call with your CLO before any decision is communicated to Priya.",
      facilitatorNotes:
        "The employment decision under ERA 1996 and standard contractor practice. Priya is not an employee. She is a contractor engaged through Meridian Talent Solutions Ltd. This means formal disciplinary procedures under ERA do not strictly apply, but the contractor agreement terms govern and wrongful termination claims are possible.\n\nOption A (end the engagement with a reference) is clean and fair given the genuine error and clean record. She is not retained but is not punished punitively. Option B (written warning) is odd in a contractor context and difficult to enforce. Option C (terminate with PILON) is more formal and defensible if properly documented. Option D (mutual parting with agreed statement) is the most sophisticated answer: it protects both parties and gives the company control over the narrative.\n\nAsk HR: what does the Meridian Talent Solutions contract say about termination without cause? What notice period applies? Ask the CLO: does the company need Priya's cooperation with the FCA response?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "Hartley & Webb contractor investigation concludes | outcome to be communicated",
      isDecisionPoint: true,
      targetRoles: ["HR_LEAD", "CLO", "CEO"],
      recapLine: "resolved Priya's employment situation by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "End the contractor engagement at the natural conclusion of the investigation, with a reference confirming dates and satisfactory performance. No formal disciplinary record.",
          consequence:
            "Priya's engagement ends within the week. Meridian Talent Solutions are satisfied. Priya does not speak to journalists. In the FCA response, the company can correctly state that the individual accepted responsibility and the engagement has concluded.",
          rank: 2,
          recapFragment: "ending the engagement with a reference and no formal sanction",
        },
        {
          key: "B",
          label: "Issue a formal written warning and retain Priya for the remaining four months, with enhanced supervision over social media access",
          consequence:
            "Meridian Talent Solutions advise that a formal warning in a contractor context is unusual and potentially unenforceable. Priya's continued presence in the office becomes a distraction. Two senior staff members raise the optics with HR.",
          rank: 3,
          recapFragment: "issuing a written warning and retaining Priya with supervision",
        },
        {
          key: "C",
          label: "Terminate the contractor engagement immediately with payment in lieu of the remaining contract notice period. Clean break, no reference.",
          consequence:
            "Meridian Talent Solutions accept the termination with PILON. The payment is made. Priya's solicitor writes one letter querying whether there was procedural fairness, which the CLO answers within 48 hours. The matter closes.",
          rank: 2,
          recapFragment: "terminating with payment in lieu and no reference",
        },
        {
          key: "D",
          label: "Offer a mutual parting with a short, jointly agreed public statement. Priya takes responsibility; the company confirms the matter is resolved and no further action will be taken.",
          consequence:
            "The agreed statement is drafted by 17:00 and issued by both parties the following morning. It reads as human and considered. The FT runs a short item: 'Hartley and Webb and contractor reach agreed parting following social media incident.' The story ends. Priya's cooperation with the FCA documentation process is confirmed in the agreement.",
          rank: 1,
          recapFragment: "negotiating a mutual parting with a jointly agreed public statement",
        },
      ],
    },

    {
      id: "smc-i14",
      commandTier: "GOLD",
      order: 55,
      scenarioDay: 2,
      scenarioTime: "16:45",
      title: "Recovery: How Do You Draw a Line Under This?",
      body: "It is 16:45. The immediate crisis is managed. The response is out, the board has been briefed, the FCA letter is in hand, and the employment situation is moving toward resolution. The share price has recovered to -2.1% on the day. The question now is what Hartley & Webb says next. The Chairman, Richard Hartley, has messaged the CEO: 'We need to draw a line. What do you want to do?'\n\nYour CCO has four options on the table. Whatever you choose, it will be the last thing you say publicly on this matter for some time. Make it count.",
      facilitatorNotes:
        "The recovery narrative decision. Option A (CEO personal blog post) is the strongest: it is personal, named, specific about the changes being made, and signals that the company has reflected rather than just reacted. Option B (independent review) is good governance but takes weeks and feels like delay. Option C (joint client statement) is tempting but clients who are asked to endorse you publicly in the middle of a crisis are being asked to take a reputational risk on your behalf. Some will decline. Option D (say nothing) may be right for some firms in some crises but not for Hartley & Webb, whose value proposition is judgement.\n\nAsk the CEO: what do you personally say in the blog post? Can you be specific about what went wrong and what you are changing? Can you name the governance gap without it reading as blame-shifting?",
      delayMinutes: 0,
      timerMinutes: 10,
      tickerHeadline: "H&W share price partially recovers | markets await recovery statement",
      artifact: {
        type: "sms_thread",
        smsParticipants: ["Richard Hartley (Chairman)", "Caroline Webb (CEO)"],
        smsMessages: [
          { sender: "Richard Hartley (Chairman)", text: "I think we're through the worst. Good work today.", time: "16:38" },
          { sender: "Caroline Webb (CEO)", text: "Thank you. Still a lot to do. FCA response, Priya, the board paper.", time: "16:40" },
          { sender: "Richard Hartley (Chairman)", text: "Agreed. But we need to draw a line on the public side. What do you want to do?", time: "16:43" },
          { sender: "Caroline Webb (CEO)", text: "Thinking. Give me 15 minutes.", time: "16:44" },
        ],
      },
      isDecisionPoint: true,
      targetRoles: ["CEO", "CCO", "BOARD_REP"],
      recapLine: "drew a line under the crisis by {{recapFragment}}",
      decisionOptions: [
        {
          key: "A",
          label: "CEO writes a direct personal blog post on the company website, in their own voice, acknowledging what happened, describing the specific governance changes being made, and thanking clients and staff for their response.",
          consequence:
            "The post is published at 09:00 on Thursday. It is picked up by the FT, which runs a piece: 'Hartley and Webb chief writes personal account of social media crisis, calls for sector-wide governance standards.' Several other executive search firms quietly contact the CCO to ask if they can adopt the same policy changes.",
          rank: 1,
          recapFragment: "the CEO writing a personal blog post describing the changes being made",
        },
        {
          key: "B",
          label: "Commission an independent review of Hartley & Webb's social media governance. Announce it publicly and let the review speak for itself in six weeks.",
          consequence:
            "The announcement of the review is received positively by institutional shareholders. The FCA notes it in their file. The review is completed six weeks later and its recommendations are implemented. The story does not re-emerge.",
          rank: 2,
          recapFragment: "announcing an independent review of social media governance",
        },
        {
          key: "C",
          label: "Issue a joint statement with three retained FTSE clients expressing continued confidence in Hartley & Webb. Let the clients speak.",
          consequence:
            "Two of the three clients agree to be named. The third declines, asking not to be associated with the story. The joint statement runs on Wednesday evening. The FT notes that one prominent client was absent from the statement, which creates a brief second round of enquiries.",
          rank: 3,
          recapFragment: "issuing a joint client statement expressing continued confidence",
        },
        {
          key: "D",
          label: "Say nothing further. The immediate crisis is resolved and additional communications risk extending the story.",
          consequence:
            "No further public statement is made. The story fades from the news but lingers in professional forums and within the executive search community. Several prospective clients raise the incident in pitch meetings over the following three months. No recovery narrative exists.",
          rank: 4,
          recapFragment: "deciding not to say anything further",
        },
      ],
    },

    // ─── ACT 5 - ENDINGS ─────────────────────────────────────────────────────

    {
      id: "smc-i15",
      commandTier: "GOLD",
      order: 60,
      scenarioDay: 2,
      scenarioTime: "17:30",
      title: "Thirty Days On: How Did Hartley & Webb Do?",
      body: "Thirty days have passed since the tweet. The FCA response has been submitted. The employment matter is resolved. The share price has settled. It is time to assess how your leadership team performed: not by intent, but by outcome.",
      facilitatorNotes:
        "Score-routing inject. Do not release this inject to participants. It is the routing mechanism for the three endings. The average rank score from all scored decisions determines which ending is shown. Scores of 1.0 to 2.0 route to the strong ending. Scores of 2.1 to 3.0 route to the moderate ending. Scores of 3.1 and above route to the weak ending.",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "Hartley & Webb 30-day review | outcome determined",
      branchMode: "score",
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CLO", "CFO", "CCO", "HR_LEAD", "BOARD_REP"],
      branches: [
        { optionKey: "score-strong", nextInjectId: "smc-end-strong", scoreMax: 2.0 },
        { optionKey: "score-moderate", nextInjectId: "smc-end-moderate", scoreMax: 3.0 },
        { optionKey: "score-weak", nextInjectId: "smc-end-weak", scoreMax: 4.0 },
      ],
    },

    {
      id: "smc-end-strong",
      commandTier: "GOLD",
      order: 65,
      scenarioDay: 2,
      scenarioTime: "17:30",
      title: "Outcome: Decisive and Human",
      isEnding: true,
      body: "Thirty days on.\n\nHWB.L closed yesterday at £5.38, effectively flat versus the pre-incident price. The share price recovered within eight trading days. Volume has normalised.\n\nThe FCA closed its file last week. The written response was assessed as comprehensive and timely. The supervising officer noted the company's 'prompt engagement and clear evidence of internal control improvement'. No further action was taken.\n\nAll three FTSE client relationships remain active. Lord Ashworth has since referred two new board search mandates to the firm. The CEO's blog post was cited by the Institute of Directors in a guidance paper on social media governance for listed companies.\n\nInternally, Priya Mehta's mutual parting was handled with sufficient care that no member of staff spoke to the press. Several staff members described the CEO's all-staff email as 'the best internal communication we've had in a crisis'. A new social media governance policy requiring dual-approval for all posts from corporate accounts was adopted within 21 days.\n\nThis is what decisive, human crisis leadership looks like in practice. The tweet was bad. The 23 minutes it was live were bad. But the 30 days that followed were defined by the quality of the response, and your team delivered.",
      facilitatorNotes:
        "Best outcome. Celebrate specifically what the team did well: the personal response, the early board briefing, the named individual taking accountability, the RNS, the FCA engagement. Ask: what would you do differently in the first 15 minutes? What governance change would have prevented this entirely?",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "HWB.L recovers | FCA closes file | client relationships intact",
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CLO", "CFO", "CCO", "HR_LEAD", "BOARD_REP"],
    },

    {
      id: "smc-end-moderate",
      commandTier: "GOLD",
      order: 65,
      scenarioDay: 2,
      scenarioTime: "17:30",
      title: "Outcome: Mixed Performance",
      isEnding: true,
      body: "Thirty days on.\n\nHWB.L is trading at £5.22, still 3.3% below the pre-incident price. The share price recovered partially in week two but stalled when the FCA matter became publicly known through a freedom of information request by a financial journalist.\n\nThe FCA file remains open. The response was submitted on time but the supervising officer has sent two follow-up requests for additional documentation, including the original contractor agreement with Meridian Talent Solutions and evidence of any social media training provided to contractors. The CLO expects closure within the next 30 days but cannot guarantee it.\n\nTwo of the three FTSE client relationships remain fully active. One client, whose relationship manager did not make proactive contact until day 2, has 'paused' a current mandate pending an internal review of the firm's governance. They have not formally ended the relationship.\n\nInternally, the all-hands call was well received but the gap before it was filled with speculation. Three members of staff mentioned the incident in exit interviews conducted in the following month: not as the reason for leaving, but as an example of a communications gap during a difficult period.\n\nYou managed the crisis. You did not lead through it. The difference matters in a reputation business.",
      facilitatorNotes:
        "Middle outcome. Identify the specific decision gaps: the delayed client contact, the FCA response depth, the internal communications timing. Ask: at which point did the team shift from reactive to proactive? What was the cost of each delay? What did the team get right that limited the damage?",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "HWB.L partially recovers | FCA file open | one client mandate paused",
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CLO", "CFO", "CCO", "HR_LEAD", "BOARD_REP"],
    },

    {
      id: "smc-end-weak",
      commandTier: "GOLD",
      order: 65,
      scenarioDay: 2,
      scenarioTime: "17:30",
      title: "Outcome: The Damage Runs Deep",
      isEnding: true,
      body: "Thirty days on.\n\nHWB.L is trading at £4.91, down 9.1% from the pre-incident price. A second analyst downgrade landed last week citing 'persistent governance uncertainty and client retention risk'. Hargate Capital has not closed its short position.\n\nThe FCA has escalated the file. The initial response was considered insufficient. A formal investigation under section 167 FSMA has been opened. The firm has instructed external counsel but the process is expected to run for six to twelve months.\n\nTwo major clients have quietly paused their active mandates. One has formally moved a board search mandate to a competitor firm. The lost mandate represents approximately £340,000 in fee income. A third client has asked for a meeting with the Chairman before committing to a new engagement.\n\nInternally, three members of staff left within 30 days. One, a senior director, gave an interview to a trade publication describing 'a week of confusion and silence from the top'. The interview was read by 14,000 people in the executive search industry.\n\nThe tweet was 23 minutes. The damage is still running.\n\nThis exercise exists to make the cost of slow, disconnected leadership visible before it becomes real. Every decision that delayed, deferred, or handed the narrative to someone else added to this total. Leadership in a social media crisis is not a communications function. It is a judgement function. And judgement is what Hartley and Webb is supposed to sell.",
      facilitatorNotes:
        "Worst outcome. Be direct about the specific decisions that led here: the delayed public response, the failure to contact clients early, the absence of an RNS, the weak FCA engagement, the internal communications gap. Do not soften the debrief. The purpose of the strong consequence is to make the learning visceral. Ask: if this had happened to your firm, which of these decisions would you have made differently? Which would you have made the same way?",
      delayMinutes: 0,
      timerMinutes: 0,
      tickerHeadline: "HWB.L down 9.1% | FCA investigation opened | two client mandates paused",
      isDecisionPoint: false,
      decisionOptions: [],
      targetRoles: ["CEO", "CLO", "CFO", "CCO", "HR_LEAD", "BOARD_REP"],
    },

  ],
};
