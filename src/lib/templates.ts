import type { Scenario } from "@/types";
import { makeId } from "@/lib/utils";

// IDs are stable so they don't change between sessions
export const BUILT_IN_TEMPLATES: Scenario[] = [
  {
    id: "tpl-ransomware-001",
    title: "Ransomware with Data Exfiltration",
    description:
      "Sophisticated ransomware encrypts core systems. Evidence of prior data exfiltration. Attribution to a known threat actor group.",
    type: "RANSOMWARE",
    difficulty: "HIGH",
    durationMin: 120,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    coverGradient: "135deg, #0a0000 0%, #1f000a 40%, #e8002d 100%",
    roles: ["CEO", "CISO", "CFO", "CLO", "CCO", "COO"],
    briefing:
      "You are the executive leadership team of a mid-sized financial services organisation. It is Tuesday morning and you have each just arrived at the office. You will receive a series of escalating developments. Respond as you would in a real crisis — in character, under time pressure.",
    injects: [
      {
        id: "tpl-r-i1",
        order: 0,
        title: "Initial SOC Alert",
        body: "07:43 — Your CISO receives an automated alert: multiple servers in the primary data centre are showing unusual encryption activity. The SOC has isolated three servers but the activity is spreading. One analyst has identified what appears to be a ransom note on an affected endpoint.",
        facilitatorNotes:
          "BlackCat/ALPHV variant. Exfiltration occurred 48–72 hours ago via compromised VPN credentials. Without containment, backup systems will be hit in 4–6 hours.",
        delayMinutes: 0,
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "COO"],
        expectedKeywords: ["isolate", "contain", "IR", "incident response"],
        timerMinutes: 8,
        tickerHeadline: "DEVELOPING: Reports of major cyber incident at UK financial services firm",
        artifact: {
          type: "siem_alert",
          siemAlertId: "SOC-2024-8847",
          siemSeverity: "CRITICAL",
          siemSourceIp: "10.14.22.187 (INTERNAL)",
          siemEventType: "Mass File Encryption — 147 endpoints affected",
        },
      },
      {
        id: "tpl-r-i2",
        order: 1,
        title: "Scope Confirmed — Critical Systems Affected",
        body: "08:15 — The IR team confirms: payroll systems, customer database, and two production trading platforms are encrypted. ~40% of IT infrastructure affected. Ransom note demands $4.2M in Bitcoin within 72 hours. Your head of IT has also found evidence of data being accessed and downloaded 3 days ago.",
        facilitatorNotes:
          "The exfiltration included ~180,000 customer records (names, account numbers, partial card data). GDPR Art. 33 notification window is now running — 72 hours from when you became aware.",
        delayMinutes: 30,
        isDecisionPoint: true,
        targetRoles: ["CEO", "CISO", "CLO", "CFO"],
        expectedKeywords: ["GDPR", "notify", "regulator", "ICO", "legal"],
        timerMinutes: 12,
        tickerHeadline: "Financial services firm reportedly hit by $4.2M ransomware demand — sources",
        artifact: {
          type: "ransomware_note",
          ransomAmount: "$4.2M",
          ransomDeadlineHours: 72,
          ransomWalletAddress: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
        },
        decisionOptions: [
          {
            key: "A",
            label: "Engage ransom negotiators and begin payment process",
            consequence:
              "Negotiators engaged. FBI/NCA make contact warning against payment. Insurance queries coverage exclusions.",
          },
          {
            key: "B",
            label: "Refuse payment — full IR response and restore from backup",
            consequence:
              "IR firm engaged. Backup restoration begins, 5–7 days. Trading platforms offline. Business continuity plan activated.",
          },
          {
            key: "C",
            label: "Stall — open communication with threat actor while assessing options",
            consequence:
              "Threat actor sets hard deadline. A journalist calls. Stock price starts moving.",
          },
        ],
      },
      {
        id: "tpl-r-i3",
        order: 2,
        title: "Media and Regulatory Pressure",
        body: "10:30 — A Financial Times journalist has called your Head of Comms asking for comment on a 'significant cyber incident affecting customer data'. Separately, the ICO has received an anonymous tip and made contact requesting information on any potential data breach. Your stock price is down 3.2% on unusual volume.",
        facilitatorNotes:
          "GDPR 72-hour clock started at inject 2. Approx. 48 hours remain. No notification = fines up to 4% of global annual turnover.",
        delayMinutes: 45,
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CLO", "CCO", "CFO"],
        expectedKeywords: ["holding statement", "ICO", "notification", "counsel", "no comment"],
        timerMinutes: 10,
        tickerHeadline: "FT sources: major financial firm refuses comment on 'significant' data breach",
        artifact: {
          type: "email",
          emailFrom: "j.hartley@ft.com",
          emailTo: "press@yourcompany.com",
          emailSubject: "FT: Request for comment — cyber incident affecting customer data",
        },
      },
      {
        id: "tpl-r-i4",
        order: 3,
        title: "Board Escalation",
        body: "13:00 — Your Chairman calls. Three NEDs have been contacted by major shareholders. A board briefing is demanded within 2 hours. Your cyber insurer is querying whether the exploited VPN vulnerability was on the exceptions list from your last penetration test.",
        facilitatorNotes:
          "The VPN vulnerability WAS on the pen test exceptions list — deprioritised 8 months ago. This creates significant governance exposure and potential D&O liability.",
        delayMinutes: 30,
        isDecisionPoint: true,
        tickerHeadline: "Shareholders demand answers as breached firm's board holds emergency meeting",
        targetRoles: ["CEO", "CFO", "CLO"],
        expectedKeywords: ["board", "D&O", "insurance", "disclosure", "liability"],
        timerMinutes: 12,
        artifact: {
          type: "email",
          emailFrom: "r.whitmore@company-board.com",
          emailTo: "ceo@yourcompany.com",
          emailSubject: "URGENT — Emergency board briefing required within 2 hours",
        },
        decisionOptions: [
          {
            key: "A",
            label: "Full transparent board briefing — including the pen test finding",
            consequence:
              "Board informed. Legal begins privileged investigation. D&O insurers notified. Chairman concerned but supportive.",
          },
          {
            key: "B",
            label: "Brief the board on the incident without surfacing the pen test issue yet",
            consequence:
              "Short-term breathing space. Legal later flags serious D&O exposure if the pen test finding emerges.",
          },
        ],
      },
      {
        id: "tpl-r-i5",
        order: 4,
        title: "Backdoor Discovered",
        body: "Day 2, 09:00 — Recovery is progressing. Your head of technology has found a second, dormant backdoor in the network. The threat actor may still have access. Customer notification emails must go out today per GDPR. Your PR agency is pushing for a proactive press release.",
        facilitatorNotes:
          "Critical: the backdoor means the incident is not contained. All recovery progress could be undermined. A specialist threat-hunting team is needed before full recovery.",
        delayMinutes: 0,
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "CEO", "CLO", "CCO"],
        expectedKeywords: ["threat hunt", "contain", "customer notification", "backdoor"],
        timerMinutes: 10,
        tickerHeadline: "Cyber firm: second backdoor found at breached financial institution — recovery halted",
        artifact: {
          type: "siem_alert",
          siemAlertId: "SOC-2024-8851",
          siemSeverity: "CRITICAL",
          siemSourceIp: "185.220.101.47 (TOR EXIT NODE)",
          siemEventType: "Dormant C2 Beacon — Active Exfiltration Resumed",
        },
      },
    ],
  },

  {
    id: "tpl-breach-001",
    title: "Third-Party Data Breach Notification",
    description:
      "A critical SaaS vendor notifies you they suffered a breach affecting data you shared under a data processing agreement. You have no direct control over the incident.",
    type: "DATA_BREACH",
    difficulty: "MEDIUM",
    durationMin: 120,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    coverGradient: "135deg, #000a14 0%, #001e3c 50%, #0057b8 100%",
    roles: ["CEO", "CISO", "CLO", "CFO", "CCO"],
    briefing:
      "Your organisation processes payments for approximately 2 million customers across Europe and the US. You share customer data with several third-party vendors under data processing agreements. This morning you received a notification from one of those vendors.",
    injects: [
      {
        id: "tpl-b-i1",
        order: 0,
        title: "Vendor Notification Received",
        body: "You receive an email from CloudProcess Ltd, a customer analytics vendor used for 3 years. They report a 'security incident' between 15–22 March affecting 'some customer data'. They are 'still investigating' and will 'provide further details'. The email was sent to your IT security team's generic inbox — and was only spotted today, 5 days after it was sent.",
        timerMinutes: 10,
        tickerHeadline: "CloudProcess Ltd under scrutiny over reported data security incident",
        artifact: { type: "email", emailFrom: "security-incident@cloudprocess.io", emailTo: "itsecurity@yourcompany.com", emailSubject: "Important: Security Incident Notification — Customer Data Affected" },
        facilitatorNotes:
          "CloudProcess hold ~450,000 of your customer records: names, emails, and behavioural data. The 72-hour GDPR notification clock likely started when the processor became aware, not today — legal opinion needed urgently.",
        delayMinutes: 0,
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "CLO"],
        expectedKeywords: ["DPA", "data processing agreement", "controller", "processor", "GDPR"],
      },
      {
        id: "tpl-b-i2",
        order: 1,
        title: "Scope of Data Confirmed",
        body: "CloudProcess confirm: 450,000 customer records accessed — names, emails, and browsing/purchase history. No financial data taken. Attacker had access for 7 days. CloudProcess say they have 'notified the relevant authorities' in Ireland but have not confirmed whether they have specifically notified the UK ICO.",
        timerMinutes: 10,
        tickerHeadline: "450,000 customers affected in third-party data breach — ICO notification status unclear",
        artifact: { type: "email", emailFrom: "dpo@cloudprocess.io", emailTo: "legal@yourcompany.com", emailSubject: "Updated Incident Report — 450,000 customer records confirmed affected" },
        facilitatorNotes:
          "As data controller, YOUR organisation has independent ICO notification obligations regardless of what the processor does. The processor's Irish DPA notification does not discharge your duty.",
        delayMinutes: 20,
        isDecisionPoint: true,
        targetRoles: ["CLO", "CISO", "CEO"],
        expectedKeywords: ["ICO", "controller", "72 hours", "notification", "obligation"],
        decisionOptions: [
          {
            key: "A",
            label: "Notify ICO immediately and begin customer notification",
            consequence:
              "ICO acknowledges. Notes the delay since vendor notification and requests explanation. Customer notification process begins.",
          },
          {
            key: "B",
            label: "Gather more information from CloudProcess before notifying",
            consequence:
              "72-hour window passes. ICO receives a complaint from a customer alerted by a third party. Enforcement investigation begins.",
          },
        ],
      },
      {
        id: "tpl-b-i3",
        order: 2,
        title: "Contractual and Commercial Exposure",
        body: "Legal has reviewed the DPA with CloudProcess. Their 5-day notification delay is a material breach. Their cyber insurance appears inadequate for your potential losses. Additionally, a competitor is now running targeted ads at 'customers of data-exposed financial platforms'.",
        timerMinutes: 12,
        artifact: { type: "legal_letter", legalCaseRef: "ICO-2024-CS-1847", legalAuthority: "Information Commissioner's Office" },
        facilitatorNotes:
          "Decision point: pursue CloudProcess for damages (expensive, uncertain) vs prioritise customer trust and regulatory relationship. The competitor angle is a reputational crisis layered on top.",
        delayMinutes: 25,
        isDecisionPoint: true,
        targetRoles: ["CLO", "CFO", "CEO", "CCO"],
        expectedKeywords: ["indemnity", "liability", "contractual breach", "customer trust", "remediation"],
        decisionOptions: [
          {
            key: "A",
            label: "Issue a formal legal claim against CloudProcess for breach of DPA",
            consequence: "Signals seriousness to regulators and board. Process will take 12–18 months and cost £200–400k in legal fees. CloudProcess immediately goes into defensive mode and stops cooperating on the investigation.",
          },
          {
            key: "B",
            label: "Negotiate a remediation settlement privately — prioritise cooperation",
            consequence: "CloudProcess agree to fund customer notification costs and credit monitoring. ICO notes the collaborative approach favourably. No precedent set for other vendors.",
          },
        ],
      },
      {
        id: "tpl-b-i4",
        order: 3,
        title: "ICO Opens Formal Investigation",
        body: "Three days after your notification, the ICO write formally. They are treating this as a 'serious incident' requiring investigation into your oversight of data processors and your own data retention practices. They want a full timeline, copies of your DPA with CloudProcess, and your data mapping records within 14 days. Separately: a data protection law firm has written to you threatening a group litigation on behalf of 2,400 affected customers.",
        timerMinutes: 12,
        tickerHeadline: "ICO opens formal investigation into third-party data breach — group litigation threatened",
        artifact: { type: "legal_letter", legalCaseRef: "ICO-2024-ENF-0293", legalAuthority: "Information Commissioner's Office — Enforcement Division" },
        facilitatorNotes:
          "The ICO will focus on two things: (1) whether the controller's vendor oversight was adequate, and (2) whether your own data was being retained longer than necessary. The data mapping request is a test of whether you have a record of processing activities as required by GDPR Art. 30.",
        delayMinutes: 20,
        isDecisionPoint: true,
        targetRoles: ["CLO", "CISO", "CEO"],
        expectedKeywords: ["ICO", "Art. 30", "ROPA", "data mapping", "processor oversight", "litigation"],
        decisionOptions: [
          {
            key: "A",
            label: "Full cooperation — provide all documents, appoint a lead regulatory counsel",
            consequence: "ICO notes the cooperative posture. Investigation expected to take 6 months. External counsel bills £80k in first month. Good chance of reduced fine.",
          },
          {
            key: "B",
            label: "Provide only what is strictly required — protect commercial sensitivity",
            consequence: "ICO notes the narrow disclosure and escalates to a formal information notice. Failure to comply with an information notice can result in criminal prosecution.",
          },
        ],
      },
      {
        id: "tpl-b-i5",
        order: 4,
        title: "Customer Backlash and Media Exposure",
        body: "Your customer notification emails are out. Within 6 hours: 14,000 customers have called your support line (it was overwhelmed in under an hour), a BBC journalist is running a piece on 'how this breach was handled', and a personal finance influencer with 800k followers has published a thread titled 'How [Company] failed me — and what to do if you're affected'. Your NPS has dropped 22 points in 48 hours.",
        timerMinutes: 10,
        tickerHeadline: "BBC investigation: customers furious as 450,000 affected by third-party data breach",
        artifact: { type: "tweet", tweetHandle: "@MoneyProtect_UK", tweetDisplayName: "Money Protect UK", tweetLikes: 62000, tweetRetweets: 24000 },
        facilitatorNotes:
          "The support line collapse is a secondary crisis — customers who can't get through become significantly more likely to complain to the ICO, switch provider, and join the group litigation. The influencer thread is actually providing better advice than your customer notification email, which is a problem.",
        delayMinutes: 15,
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CCO", "COO", "CFO"],
        expectedKeywords: ["support", "customer", "NPS", "churn", "influencer", "media", "communication"],
      },
      {
        id: "tpl-b-i6",
        order: 5,
        title: "Board Demands Systemic Review",
        body: "The board has met. Three NEDs are concerned about their personal liability. Your cyber insurer is querying whether vendor oversight failures constitute a policy exclusion. The CFO presents: £2.4M in estimated costs so far (legal, support, notification, credit monitoring), with ICO fines of up to £17.5M possible. The Chairman wants a systemic review of every third-party data processor you use — you have 47 of them.",
        timerMinutes: 15,
        tickerHeadline: "Board liability fears mount as data breach costs projected to exceed £20M",
        artifact: { type: "email", emailFrom: "chairman@company-board.com", emailTo: "ceo@yourcompany.com", emailSubject: "Board resolution: full processor audit required — NED liability concerns" },
        facilitatorNotes:
          "This is the systemic governance question that the breach has exposed. The 47 processors is not unusual — most mid-sized organisations have far more. The question is whether there was a structured programme to oversee them. The D&O angle: NEDs can face personal liability if they failed to exercise adequate oversight.",
        delayMinutes: 20,
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CISO", "CFO"],
        expectedKeywords: ["D&O", "NED", "processor audit", "governance", "insurance", "systemic"],
        decisionOptions: [
          {
            key: "A",
            label: "Commission an immediate external audit of all 47 processors — pause non-critical data sharing",
            consequence: "Board satisfied. Insurance notified — policy may still respond. Operational disruption while 12 processors are paused for review. Cost: £150k and 8 weeks.",
          },
          {
            key: "B",
            label: "Internal prioritisation — audit top 10 highest-risk processors first",
            consequence: "Pragmatic but ICO notes in their investigation that no systematic review was completed. Used as evidence of inadequate oversight culture.",
          },
        ],
      },
    ],
  },

  {
    id: "tpl-regulatory-001",
    title: "Regulatory Dawn Raid",
    description:
      "Regulators arrive unannounced. Tests legal preparedness, document handling, employee rights, and communication under extreme time pressure.",
    type: "REGULATORY_INVESTIGATION",
    difficulty: "HIGH",
    durationMin: 135,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    coverGradient: "135deg, #0a0800 0%, #1a1300 50%, #8b6200 100%",
    updatedAt: "2024-01-01T00:00:00Z",
    roles: ["CEO", "CLO", "CISO", "CFO", "COO"],
    briefing:
      "Your organisation is a retail bank. It is 07:30 on a Wednesday morning. Several executives are already in the building. Without warning, a group of officials arrives at your main office reception.",
    injects: [
      {
        id: "tpl-reg-i1",
        order: 0,
        title: "Officials Arrive at Reception",
        body: "07:31 — Your head of reception calls: eight individuals have arrived identifying themselves as FCA officials with a warrant. They hand over a 'Notice of Entry and Search' and ask to be taken immediately to your Head of Compliance. They intend to image servers and seize documents related to a specific trading desk.",
        timerMinutes: 8,
        tickerHeadline: "BREAKING: FCA enforcement officials arrive at major London bank — sources",
        artifact: { type: "legal_letter", legalCaseRef: "FCA/ENF/2024/0847", legalAuthority: "Financial Conduct Authority — Enforcement Division" },
        facilitatorNotes:
          "The warrant relates to suspected market manipulation on the fixed income desk — a whistleblower complaint 6 months ago. The CEO may not be aware of the underlying investigation.",
        delayMinutes: 0,
        isDecisionPoint: true,
        targetRoles: ["CLO", "CEO"],
        expectedKeywords: ["legal counsel", "warrant", "cooperate", "privilege", "legal professional privilege"],
        decisionOptions: [
          {
            key: "A",
            label: "Cooperate immediately — admit officials and alert legal counsel simultaneously",
            consequence:
              "Legal counsel arrives within 40 minutes. Officials are cooperative. Privilege claims made correctly over specific documents.",
          },
          {
            key: "B",
            label: "Delay admission until legal counsel is physically present",
            consequence:
              "FCA notes the 12-minute delay. Treat it as obstruction. Enforcement aggravation factor added.",
          },
        ],
      },
      {
        id: "tpl-reg-i2",
        order: 1,
        title: "Employees Begin to Panic",
        body: "08:15 — Two traders from the fixed income desk are asking if they should delete files as 'routine housekeeping'. A PA has sent a message to a senior trader warning them. HR has received a call from a trader asking if they need their own legal representation. The story is already circulating on a financial markets Slack channel.",
        timerMinutes: 10,
        tickerHeadline: "Sources: employees at raided bank asked to delete files — legal implications unclear",
        artifact: { type: "tweet", tweetHandle: "@FinancialMarketNews", tweetDisplayName: "Financial Market News", tweetLikes: 8400, tweetRetweets: 3200 },
        facilitatorNotes:
          "Document destruction = obstruction of justice (criminal). The PA's message could be characterised as tipping off. HR must accurately advise traders they are entitled to independent legal advice.",
        delayMinutes: 30,
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CLO", "CEO", "COO"],
        expectedKeywords: ["preserve", "no deletion", "independent counsel", "HR", "comms lockdown"],
      },
      {
        id: "tpl-reg-i3",
        order: 2,
        title: "Media, Investors, and Encryption Keys",
        body: "09:45 — Reuters have called asking for comment on 'enforcement activity at your HQ'. Two institutional investors have called investor relations. Your Chairman has called. FCA officials have reached the server room and are requesting encryption keys for archived communications.",
        timerMinutes: 10,
        tickerHeadline: "Reuters: FCA enforcement raid at City bank entering second hour — investors alarmed",
        artifact: { type: "news_headline" },
        facilitatorNotes:
          "FCA can compel encryption keys under RIPA — refusal is contempt. Any statement to Reuters must be accurate. A narrow no-comment holding statement is appropriate here.",
        delayMinutes: 20,
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CLO", "CCO", "CISO"],
        expectedKeywords: ["no comment", "holding statement", "RIPA", "compel", "privilege", "board"],
      },
      {
        id: "tpl-reg-i4",
        order: 3,
        title: "FCA Requests Compelled Interviews",
        body: "11:30 — FCA officials formally notify you that they intend to conduct compelled interviews under s.165 FSMA with the Head of Fixed Income and your Chief Risk Officer. Both individuals are now in the building. Their personal solicitors have been called but won't arrive for 90 minutes. The FCA says they are prepared to begin interviews now. Both employees are visibly distressed.",
        timerMinutes: 12,
        tickerHeadline: "Sources: FCA conducting compelled interviews with senior bank staff under FSMA powers",
        artifact: { type: "email", emailFrom: "enforcement@fca.org.uk", emailTo: "legal@yourcompany.com", emailSubject: "Notice of Compelled Interview — s.165 FSMA — Head of Fixed Income and CRO" },
        facilitatorNotes:
          "s.165 FSMA compelled interviews: individuals must answer (privilege against self-incrimination is limited — answers cannot be used directly in criminal proceedings against them, but can be used in regulatory action). The 90-minute delay is technically permissible but the FCA may characterise it as obstruction. HR's role: ensure employees know they may have their own legal representation, separate from the company's counsel.",
        delayMinutes: 25,
        isDecisionPoint: true,
        targetRoles: ["CLO", "CEO", "COO"],
        expectedKeywords: ["s.165 FSMA", "legal representation", "compelled", "privilege", "HR", "independent counsel"],
        decisionOptions: [
          {
            key: "A",
            label: "Begin interviews now — company counsel present, personal solicitors join by phone",
            consequence: "FCA notes the cooperation positively. Interviews proceed. Company counsel later flags one answer that requires a follow-up clarification letter — normal process.",
          },
          {
            key: "B",
            label: "Wait for personal solicitors — 90-minute delay",
            consequence: "FCA formally notes the delay as non-cooperation in their investigation report. This becomes an aggravating factor in any eventual enforcement action.",
          },
        ],
      },
      {
        id: "tpl-reg-i5",
        order: 4,
        title: "Board Emergency Convenes — Directors' Liability",
        body: "14:00 — The board has assembled. The investigation relates to trades made over 8 months — trades that were flagged in a compliance report that two NEDs reviewed and signed off. The Chairman asks a direct question: did any board member know about the whistleblower complaint before today? Your D&O insurer has called asking for a briefing. Share price is down 8.4% and trading has been temporarily halted.",
        timerMinutes: 12,
        tickerHeadline: "Trading halted: bank share price drops 8% as FCA investigation deepens — board convenes",
        artifact: { type: "email", emailFrom: "chairman@company-board.com", emailTo: "board@yourcompany.com", emailSubject: "URGENT: Emergency board meeting — 14:00 — Directors' duties and liability briefing required" },
        facilitatorNotes:
          "Two NEDs reviewed and signed off the compliance report — this creates personal exposure. If they failed to escalate a risk they should have identified, they may face FCA enforcement personally. The D&O insurance call is significant — insurers will want to establish whether this falls within the policy scope or constitutes a known risk exclusion.",
        delayMinutes: 20,
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CFO"],
        expectedKeywords: ["D&O", "NED", "directors' duties", "insurance", "trading halt", "disclosure"],
        decisionOptions: [
          {
            key: "A",
            label: "Full board disclosure — each director confirms what they knew and when",
            consequence: "Two NEDs voluntarily step aside pending investigation. Board retains credibility with FCA. D&O insurer begins coverage assessment — the disclosure may actually protect the policy.",
          },
          {
            key: "B",
            label: "Restrict disclosure — wait for legal advice before board members say anything",
            consequence: "Legally prudent but FCA later discovers the compliance report was circulated to NEDs. Failure to disclose this in the board meeting becomes a separate concern.",
          },
        ],
      },
      {
        id: "tpl-reg-i6",
        order: 5,
        title: "FCA Issues Formal Notice of Investigation",
        body: "Day 2, 09:00 — The FCA have departed the premises. They leave a Formal Notice of Investigation and a list of 340 documents they are seizing or requiring copies of. Their press office has issued a brief statement confirming an investigation is underway — the first public confirmation. Your stock opens down 11.2%. A major credit rating agency has placed you on 'watch negative'. Three senior traders have submitted resignation notices.",
        timerMinutes: 15,
        tickerHeadline: "FCA confirms formal market misconduct investigation — bank shares drop 11%, credit outlook negative",
        artifact: { type: "legal_letter", legalCaseRef: "FCA/ENF/2024/0847-B", legalAuthority: "Financial Conduct Authority — Formal Notice of Investigation" },
        facilitatorNotes:
          "This is the transition from the acute crisis to the long investigation phase. The exercise should close here with a debrief on: what went wrong, what was handled well, and what the next 6 months look like. The resignation of senior traders may indicate wider knowledge of the underlying misconduct — or simply reputational flight. Worth asking the group which they think it is.",
        delayMinutes: 0,
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CLO", "CFO", "CCO"],
        expectedKeywords: ["credit rating", "morale", "talent retention", "public statement", "long investigation", "remediation"],
      },
    ],
  },

  {
    id: "tpl-social-001",
    title: "Public Social Media Crisis",
    description:
      "A senior employee's social media post goes viral and is interpreted as discriminatory. Media, staff, and investors react simultaneously.",
    type: "SOCIAL_MEDIA_CRISIS",
    difficulty: "MEDIUM",
    durationMin: 120,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    coverGradient: "135deg, #08000f 0%, #18002e 50%, #7209b7 100%",
    roles: ["CEO", "CLO", "CCO", "HR_LEAD", "CFO"],
    briefing:
      "It is a Friday afternoon. A post made last night by one of your Managing Directors on their personal social media account is gaining traction online. By morning it has been screenshotted, shared widely, and the hashtag carrying your company name is trending.",
    injects: [
      {
        id: "tpl-s-i1",
        order: 0,
        title: "Post Goes Viral",
        body: "09:15 — The MD's post — a comment on a political topic, since deleted — has been shared 40,000 times. Several major news outlets have reached out. Your social media team is reporting a surge of negative comments on all company channels. Three members of staff have emailed HR saying they feel 'unsafe' following the post.",
        timerMinutes: 8,
        tickerHeadline: "TRENDING: Senior exec's controversial post sparks company boycott calls",
        artifact: { type: "tweet", tweetHandle: "@CorporateWatchdog", tweetDisplayName: "Corporate Watchdog", tweetLikes: 41000, tweetRetweets: 18000 },
        facilitatorNotes:
          "The post, while deleted, is still circulating in screenshots. The MD is currently travelling internationally and is not reachable. Their personal account has no disclaimer separating personal views from the company.",
        delayMinutes: 0,
        isDecisionPoint: true,
        targetRoles: ["CEO", "CCO", "HR_LEAD", "CLO"],
        decisionOptions: [
          {
            key: "A",
            label: "Issue an immediate company statement distancing from the MD's views",
            consequence:
              "Statement reduces immediate media pressure but the MD's lawyer calls within the hour citing potential defamation and employment law implications.",
          },
          {
            key: "B",
            label: "Hold — wait until the MD is reached before making any public statement",
            consequence:
              "Media fills the vacuum with speculation. A second journalist calls with a quote from an anonymous employee calling the company's response 'deafening silence'.",
          },
        ],
      },
      {
        id: "tpl-s-i2",
        order: 1,
        title: "Staff and Investor Reaction",
        body: "11:30 — An internal Slack post by a junior employee, calling the MD's comments 'unacceptable', has received 200 reactions and 40 supportive replies. Your largest institutional shareholder has emailed your CEO asking for a call. A major client has put a contract renewal 'on hold pending clarity on company values'.",
        timerMinutes: 10,
        tickerHeadline: "Institutional investors demand clarity from firm at centre of exec social media row",
        artifact: { type: "email", emailFrom: "portfolio@institutionalfund.com", emailTo: "ceo@yourcompany.com", emailSubject: "Request for urgent call — governance and values concerns" },
        facilitatorNotes:
          "The internal Slack response represents a significant employee relations issue regardless of the external story. The client contract is worth £4M annually.",
        delayMinutes: 45,
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "HR_LEAD", "CFO", "CCO"],
        expectedKeywords: ["internal comms", "all-hands", "client", "shareholder", "values"],
      },
      {
        id: "tpl-s-i3",
        order: 2,
        title: "MD Makes Contact — Disciplinary Decision Required",
        body: "14:00 — The MD is now reachable. They insist the post was 'taken out of context' and are refusing to issue a personal apology. They are threatening to resign if 'scapegoated'. A national broadcaster has confirmed they are running the story on the evening news.",
        timerMinutes: 10,
        tickerHeadline: "Breaking: national broadcaster to run exec social media story on tonight's evening news",
        artifact: { type: "news_headline" },
        facilitatorNotes:
          "Employment law constraints on discipline vs speed of reputational response is the core tension here. Any disciplinary action must follow correct HR process or creates constructive dismissal risk.",
        delayMinutes: 30,
        isDecisionPoint: true,
        targetRoles: ["CEO", "HR_LEAD", "CLO", "CCO"],
        decisionOptions: [
          {
            key: "A",
            label: "Suspend the MD pending formal investigation — issue a firm public statement",
            consequence:
              "Media pressure reduces. MD's lawyer issues a statement. Process risk but narrative is controlled.",
          },
          {
            key: "B",
            label: "Negotiate a joint statement with the MD — no disciplinary action yet",
            consequence:
              "MD agrees to a personal apology. Statement lands poorly — seen as corporate-speak. The story runs a second day.",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "tpl-s-i4a" },
          { optionKey: "B", nextInjectId: "tpl-s-i4b" },
        ],
      },
      {
        id: "tpl-s-i4a",
        order: 30,
        title: "Path A: MD's Legal Team Strikes Back",
        body: "16:30 — The MD's solicitors have issued a letter before claim alleging unfair suspension and potential defamation in the public statement. They are also threatening to disclose private board communications 'relevant to the company's culture'. HR flags that the suspension letter was sent before a formal investigation was opened — a procedural error. The evening news piece runs anyway.",
        timerMinutes: 12,
        tickerHeadline: "Suspended MD's lawyers threaten defamation claim and board leak — employment dispute escalates",
        artifact: { type: "legal_letter", legalCaseRef: "PLD-2024-0441", legalAuthority: "Kingsley Napley LLP — Employment Department" },
        facilitatorNotes:
          "The procedural error in the suspension letter is significant — it potentially invalidates the suspension and creates constructive dismissal risk. This is a classic HR process failure under time pressure. The threat to leak board communications is high-stakes: it suggests the MD has something on the company's culture.",
        delayMinutes: 0,
        isDecisionPoint: true,
        targetRoles: ["CLO", "CEO", "HR_LEAD"],
        expectedKeywords: ["constructive dismissal", "procedure", "settlement", "culture", "legal privilege"],
        decisionOptions: [
          {
            key: "A",
            label: "Open without-prejudice settlement negotiations immediately",
            consequence: "MD agrees to a confidential exit. Settlement costs £320k plus a non-disparagement clause. Story dies within 48 hours. Internal culture question remains unresolved.",
          },
          {
            key: "B",
            label: "Stand firm — reissue the suspension on correct procedural grounds",
            consequence: "Legally defensible. MD's lawyers file an employment tribunal claim. Story runs for another 5 days. The board communications threat later proves to be a bluff.",
          },
        ],
      },
      {
        id: "tpl-s-i4b",
        order: 30,
        title: "Path B: Joint Statement Backfires",
        body: "15:30 — The joint statement has been widely criticised as 'corporate damage control'. The Guardian has published an editorial titled 'When companies protect executives over employees'. Two senior employees — including one director — have forwarded the editorial internally with supportive comments. Your largest client, a FTSE 50 company with a strong ESG mandate, has sent a letter formally requesting a meeting about 'recent events'.",
        timerMinutes: 12,
        tickerHeadline: "Guardian editorial: 'How [Company] chose reputation over responsibility' — staff revolt grows",
        artifact: { type: "email", emailFrom: "sustainability@ftse50client.com", emailTo: "ceo@yourcompany.com", emailSubject: "Request for urgent meeting — ESG obligations and recent events" },
        facilitatorNotes:
          "The ESG client letter is commercially serious — losing this client would cost £8M ARR. The director who forwarded the Guardian piece is a protected disclosure risk if disciplined. The joint statement route has given up moral authority without gaining legal safety.",
        delayMinutes: 0,
        isDecisionPoint: true,
        targetRoles: ["CEO", "CCO", "CFO", "HR_LEAD"],
        expectedKeywords: ["ESG", "client", "values", "whistleblowing", "protected disclosure", "remediation"],
        decisionOptions: [
          {
            key: "A",
            label: "Move to suspend the MD now — accept this reversal publicly",
            consequence: "Media calls it a U-turn but public sentiment shifts positive. ESG client meeting is rescheduled rather than cancelled. HR must restart process correctly.",
          },
          {
            key: "B",
            label: "Hold the joint statement position — manage the ESG client privately",
            consequence: "ESG client meeting happens. They give a 30-day 'values review' window. Internal trust continues to erode. A second employee posts publicly.",
          },
        ],
      },
      {
        id: "tpl-s-i5",
        order: 40,
        title: "Culture Audit Demanded — Systemic Questions Surface",
        body: "Day 2, 10:00 — Whatever path you took: an employment law firm has written to you on behalf of six current and former employees alleging a broader pattern of discriminatory behaviour by the MD spanning 18 months. HR has found two prior complaints that were 'informally resolved' without formal process. The board has received a letter from a major pension fund investor requesting a full culture audit.",
        timerMinutes: 15,
        tickerHeadline: "Six employees allege broader pattern of discrimination — board faces culture audit demand",
        artifact: { type: "email", emailFrom: "employment@claimsfirm.co.uk", emailTo: "hr@yourcompany.com", emailSubject: "Letter Before Claim — Group Employment Action — Six Claimants" },
        facilitatorNotes:
          "This is the systemic failure surfacing. The prior complaints that were 'informally resolved' create significant liability — informal resolution of formal discrimination complaints is a well-known HR failure mode that compounds original liability. The pension fund letter signals ESG investor pressure is mainstream now, not a niche concern.",
        delayMinutes: 20,
        isDecisionPoint: true,
        targetRoles: ["CEO", "HR_LEAD", "CLO", "CFO"],
        expectedKeywords: ["culture audit", "prior complaints", "systemic", "pension fund", "ESG", "remediation"],
        decisionOptions: [
          {
            key: "A",
            label: "Commission an independent culture audit — pause all senior hiring",
            consequence: "Pension fund investor is satisfied. Audit takes 8 weeks and costs £180k. Findings are uncomfortable but the transparency protects the company legally.",
          },
          {
            key: "B",
            label: "Internal HR review — resist external audit as admission of fault",
            consequence: "Pension fund escalates to public statement. Employment tribunal for original claimants proceeds without confidential settlement. Legal costs mount.",
          },
        ],
      },
    ],
  },

  // ─── NEW: The Deepfake CEO ────────────────────────────────────────────────────
  {
    id: "tpl-deepfake-001",
    title: "The Deepfake CEO",
    description:
      "A hyper-realistic AI-generated video of your CEO making inflammatory statements goes viral at 6am. Tests crisis comms, legal, and identity verification protocols under extreme social media pressure.",
    type: "SOCIAL_MEDIA_CRISIS",
    difficulty: "CRITICAL",
    durationMin: 75,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
    coverGradient: "135deg, #1a0a2e 0%, #4a0080 50%, #e8002d 100%",
    roles: ["CEO", "CCO", "CLO", "CISO", "HR_LEAD"],
    briefing:
      "It is 06:04 on a Monday morning. Your social media listening tool fires an automated alert. A 47-second video of your CEO — posted from an account called @CEOLeaks — is going viral. In it, the CEO appears to make openly racist remarks and threatens to fire half the workforce. Your CEO is asleep and their phone is off.",
    injects: [
      {
        id: "df-i1",
        order: 0,
        title: "The Video Goes Viral",
        body: "06:04 — The video now has 280,000 views and is trending on X under #[YourCompany]CEO. Media outlets are running 'developing story' banners. Three FTSE 100 investors have emailed your IR team. Your CEO's personal email is being flooded. The video is forensically convincing — standard filters can't detect it as fake.",
        facilitatorNotes: "This IS a deepfake. The CEO has been impersonated. The challenge: how quickly can the team establish that, and how do they communicate under uncertainty?",
        delayMinutes: 0,
        timerMinutes: 8,
        tickerHeadline: "VIRAL: Video purportedly showing CEO making racist remarks amasses 280K views in hours",
        artifact: { type: "tweet", tweetHandle: "@CEOLeaks", tweetDisplayName: "CEO Leaks", tweetLikes: 142000, tweetRetweets: 28400 },
        isDecisionPoint: true,
        decisionOptions: [
          {
            key: "A",
            label: "Issue an immediate denial — 'This video is fake' — before forensic confirmation",
            consequence: "Statement goes out in 12 minutes. Media runs with it. If the video were real, this would be catastrophic. Forensics later confirms it IS fake — credibility saved, but narrow escape.",
          },
          {
            key: "B",
            label: "Hold all public statements — forensic verification first (est. 2–3 hours)",
            consequence: "Vacuum filled by speculation. Two major clients call to ask for reassurance. Share price drops 6% at open. Forensic confirmation arrives at 08:45.",
          },
          {
            key: "C",
            label: "Issue holding statement: 'We are aware and urgently investigating'",
            consequence: "Buys time without committing. Media pressure builds but no major factual errors made. Forensic confirmation arrives at 08:30.",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i2a" },
          { optionKey: "B", nextInjectId: "df-i2b" },
          { optionKey: "C", nextInjectId: "df-i2c" },
        ],
        imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
        targetRoles: ["CEO", "CCO", "CLO"],
        expectedKeywords: ["deepfake", "verify", "statement", "legal", "forensic"],
      },

      // Branch A — immediate denial
      {
        id: "df-i2a",
        order: 10,
        title: "Path A: Denial Backfires — Scope Escalates",
        body: "07:15 — Your immediate denial is now being questioned. A tech journalist has enhanced the audio and claims 'it sounds too real to be AI'. The account that posted the video has disappeared, but not before sending it to 14 journalists. Your stock is down 4.1%. A second, unrelated video surfaces — this one showing the CFO making comments about a competitor. QUESTION: Is this a coordinated attack?",
        timerMinutes: 10,
        tickerHeadline: "Tech journalist challenges company denial on CEO video: 'audio is too convincing'",
        artifact: { type: "tweet", tweetHandle: "@TechInvestigates", tweetDisplayName: "Tech Investigates", tweetLikes: 54000, tweetRetweets: 21000 },
        facilitatorNotes: "The CFO video is also fake — same threat actor. This is a targeted disinformation campaign. The team now has to deal with two simultaneous deepfakes AND the fact their first denial is being questioned.",
        delayMinutes: 0,
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CCO", "CLO", "CISO"],
        expectedKeywords: ["forensic", "coordinated", "threat actor", "law enforcement", "two videos"],
      },

      // Branch B — waited too long
      {
        id: "df-i2b",
        order: 10,
        title: "Path B: The Silence Costs You",
        body: "08:00 — Two hours of silence has been read as confirmation. Your largest retail partner has paused co-marketing. 140 staff have emailed HR asking for emergency all-hands. A Sunday Times journalist publishes a piece titled 'Company refuses to comment on CEO racism video'. Your CEO is now awake and incandescent — they want to make a personal live video immediately.",
        timerMinutes: 10,
        tickerHeadline: "Sunday Times: company silent for two hours as CEO deepfake video spreads unchecked",
        artifact: { type: "news_headline" },
        facilitatorNotes: "The CEO going live unplanned is high risk — exhausted, emotional, no briefing. But staying silent is also costly. The team must manage the CEO as much as the crisis.",
        delayMinutes: 0,
        isDecisionPoint: true,
        decisionOptions: [
          {
            key: "A",
            label: "Let CEO go live immediately on LinkedIn",
            consequence: "CEO is emotional but convincing. Video gets 800k views. Authenticity wins. But one journalist asks about the CFO video that surfaces 20 minutes later.",
          },
          {
            key: "B",
            label: "Brief CEO first — 30-minute delay for prep",
            consequence: "CEO goes live with a clear, calm rebuttal. Timing is tight — forensics not yet back — but CEO's authenticity and the prepared messaging lands well.",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i3" },
          { optionKey: "B", nextInjectId: "df-i3" },
        ],
        targetRoles: ["CEO", "CCO", "HR_LEAD"],
        expectedKeywords: ["CEO", "live", "brief", "all-hands", "reputational"],
      },

      // Branch C — holding statement
      {
        id: "df-i2c",
        order: 10,
        title: "Path C: The Window Holds — Forensics Race",
        body: "07:30 — Your holding statement is working. Media are covering the uncertainty angle: 'Company investigates viral CEO video — authenticity questioned'. Your CISO has engaged a specialist deepfake detection firm. Early indicators suggest AI-generated audio artefacts. However, a campaigning journalist has published a thread calling the holding statement 'a cover-up playbook'. Employees are getting nervous.",
        timerMinutes: 10,
        artifact: { type: "email", emailFrom: "forensics@deepdetect.ai", emailTo: "ciso@yourcompany.com", emailSubject: "URGENT: Preliminary findings — AI-generated audio artefacts detected" },
        facilitatorNotes: "This path is the most defensible legally but creates internal tension. HR needs to act on employee comms while the investigation continues.",
        delayMinutes: 0,
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "CLO", "CCO", "HR_LEAD"],
        expectedKeywords: ["forensic", "employee comms", "investigation", "cover-up narrative"],
      },

      // Convergence inject — all paths lead here
      {
        id: "df-i3",
        order: 20,
        title: "Forensic Confirmation: It's a Deepfake",
        body: "09:15 — Your specialist forensic firm confirms: the video is AI-generated. Voice synthesis, facial mapping. They provide a technical report you can publish. The threat actor is linked to an offshore account — likely corporate espionage or activist sabotage. Now the question is: how do you communicate the confirmation, and do you go public with the forensic evidence?",
        timerMinutes: 12,
        tickerHeadline: "CONFIRMED: Viral CEO video determined to be AI-generated deepfake — forensic report",
        artifact: { type: "email", emailFrom: "report@deepdetect.ai", emailTo: "ciso@yourcompany.com", emailSubject: "Final Forensic Report — AI Deepfake Confirmed — Publishable" },
        facilitatorNotes: "This is now a 'win' moment but it has to be handled carefully. Publishing the forensic report may invite counter-arguments. Not publishing it leaves lingering doubt. There's also a law enforcement decision to make.",
        delayMinutes: 0,
        isDecisionPoint: true,
        decisionOptions: [
          {
            key: "A",
            label: "Publish the full forensic report publicly and file a police report",
            consequence: "Maximum transparency. Media pivot to 'company vindicated' narrative. Law enforcement involvement signals seriousness. Risk: draws attention to the attack methodology.",
          },
          {
            key: "B",
            label: "Brief media off-record and publish a summary statement only",
            consequence: "Controls the narrative tightly. Some journalists feel misled. Story dies within 24 hours. No law enforcement trail — attacker may repeat.",
          },
        ],
        targetRoles: ["CEO", "CLO", "CCO", "CISO"],
        expectedKeywords: ["publish", "forensic", "police", "law enforcement", "narrative"],
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      },

      {
        id: "df-i4",
        order: 30,
        title: "The Copycat",
        body: "Day 2, 14:00 — A competitor's PR firm has reached out to ask 'how you handled it so well'. But simultaneously: a second deepfake — this time of your CFO announcing a fake acquisition — appears on a financial forum. Markets briefly spike on the fake news before trading algorithms flag it. Your CISO believes the same threat actor is behind both. You now have to decide: was this espionage, a short seller, or an activist?",
        timerMinutes: 10,
        tickerHeadline: "ALERT: Second deepfake video causes brief market spike — CFO impersonated in fake acquisition announcement",
        artifact: { type: "siem_alert", siemAlertId: "THREAT-2024-DF-02", siemSeverity: "HIGH", siemEventType: "Second AI Deepfake Detected — Same Threat Actor", siemSourceIp: "185.220.xxx.xxx (TOR)" },
        facilitatorNotes: "End the session here or extend. The short-seller angle is the most legally interesting — market manipulation using AI-generated disinformation is a novel regulatory frontier.",
        delayMinutes: 0,
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CLO", "CISO", "CFO"],
        expectedKeywords: ["short seller", "market manipulation", "FCA", "threat intelligence", "repeat attack"],
      },
    ],
  },

  // ─── NEW: Black Friday Zero-Day ───────────────────────────────────────────────
  {
    id: "tpl-blackfriday-001",
    title: "Black Friday Zero-Day",
    description:
      "A critical zero-day vulnerability in your e-commerce platform is disclosed publicly at 11pm on Thanksgiving. Your biggest trading day starts in 8 hours. Pay the ransom, patch and go dark, or gamble on a hotfix?",
    type: "RANSOMWARE",
    difficulty: "CRITICAL",
    durationMin: 90,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
    coverGradient: "135deg, #0a0a0a 0%, #1a1a00 50%, #e8002d 100%",
    roles: ["CEO", "CISO", "CFO", "CTO", "CLO", "CCO"],
    briefing:
      "It is 23:07 on Thanksgiving Thursday. You are a senior leader at a major e-commerce retailer. Black Friday — your single biggest trading day, worth £180M in projected revenue — starts in less than 9 hours. A security researcher has just published a proof-of-concept exploit for a critical SQL injection vulnerability in the open-source checkout library you use. There are already signs of active exploitation in the wild.",
    injects: [
      {
        id: "bf-i1",
        order: 0,
        title: "Zero-Day Goes Public",
        body: "23:07 — The vulnerability (CVSSv3: 9.8 CRITICAL) allows unauthenticated attackers to dump your entire customer database via your checkout flow. The researcher published the full exploit code. Your CISO estimates you have 30–90 minutes before automated scanners hit every retailer running this library. You have three options.",
        facilitatorNotes: "There is no perfect option. Option A protects customers but kills revenue. Option B is a gamble. Option C buys time but is a form of deliberate concealment. Watch how the team handles the moral dimensions alongside the technical ones.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "BREAKING: Security researcher publishes full exploit for critical checkout vulnerability — retailers at risk",
        artifact: { type: "siem_alert", siemAlertId: "SOC-2024-BF-001", siemSeverity: "CRITICAL", siemSourceIp: "0.0.0.0/0 (INTERNET WIDE)", siemEventType: "Zero-Day Exploit Published — Active Scanning Detected" },
        isDecisionPoint: true,
        decisionOptions: [
          {
            key: "A",
            label: "Take the platform offline — emergency maintenance window until patched",
            consequence: "Platform goes dark at 23:45. All Black Friday traffic gets a maintenance page. No breach. Revenue loss: £180M. Media: 'Retailer ruins Black Friday'. Board emergency call at 06:00.",
          },
          {
            key: "B",
            label: "Apply emergency WAF rules and rate-limiting — stay live, patch in background",
            consequence: "Platform stays up. WAF rules block known exploit patterns but not zero-days by definition. At 02:40, SIEM detects 4 successful exploitations. 22,000 card records compromised.",
          },
          {
            key: "C",
            label: "Go live as planned — quietly disable the affected checkout feature and route via legacy path",
            consequence: "Revenue continues. 'Legacy path' has its own issues — 3x slower, causes £12M in abandoned carts. At 04:15, a security blogger notices the silent feature flag and tweets about it.",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "bf-i2a" },
          { optionKey: "B", nextInjectId: "bf-i2b" },
          { optionKey: "C", nextInjectId: "bf-i2c" },
        ],
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
        targetRoles: ["CEO", "CISO", "CTO", "CFO"],
        expectedKeywords: ["patch", "offline", "WAF", "breach", "revenue", "GDPR"],
      },

      // Branch A — went offline
      {
        id: "bf-i2a",
        order: 10,
        title: "Path A: Dark — The Backlash Arrives",
        body: "07:30 — Patch deployed. Platform coming back up. But Twitter is a warzone: customers are furious, 'BlackFridayFail' is trending #1, and a rival has run emergency ads targeting your customers. Three national papers have 'Why did [Company] go dark on Black Friday?' as their lead business story. Your board has called an emergency 09:00. Key question: was this the right call, and how do you communicate it?",
        timerMinutes: 10,
        tickerHeadline: "#BlackFridayFail trending as major retailer goes dark — rival brands capitalise",
        artifact: { type: "tweet", tweetHandle: "@BlackFridayFail", tweetDisplayName: "Black Friday Fail", tweetLikes: 87000, tweetRetweets: 42000 },
        facilitatorNotes: "This is where the RIGHT decision looks wrong in the short term. The team need to articulate WHY this was correct — protecting customer data — without revealing technical details that would confirm the severity of the vulnerability.",
        delayMinutes: 0,
        isDecisionPoint: true,
        decisionOptions: [
          {
            key: "A",
            label: "Full transparency — publish a post-incident report explaining the vulnerability",
            consequence: "Security community praises the decision. Media story pivots to 'Company puts customers first'. Competitor copy-cat patch kicks in 6 hours later. Long-term credibility gain.",
          },
          {
            key: "B",
            label: "Minimal disclosure — 'planned maintenance' narrative",
            consequence: "Works until the security researcher tweets that the outage was related to their disclosure. Story becomes about the cover-up, not the original decision.",
          },
        ],
        targetRoles: ["CEO", "CCO", "CLO"],
        expectedKeywords: ["transparency", "narrative", "maintenance", "board", "customer trust"],
      },

      // Branch B — stayed live, breach happened
      {
        id: "bf-i2b",
        order: 10,
        title: "Path B: Breach Confirmed — 22,000 Cards",
        body: "02:40 — SIEM alert: 22,000 card records exfiltrated via the zero-day. Attacker IP traced to a Tor exit node. Your payment processor has been notified. GDPR 72-hour clock starts NOW. Black Friday is in 5 hours — the platform is technically still running. Do you keep trading or shut down?",
        timerMinutes: 10,
        tickerHeadline: "URGENT: Major retailer confirms card data breach — GDPR 72-hour clock ticking",
        artifact: { type: "siem_alert", siemAlertId: "SOC-2024-BF-009", siemSeverity: "CRITICAL", siemSourceIp: "185.220.xxx.xxx (TOR EXIT)", siemEventType: "22,000 Card Records Exfiltrated — Active Exfiltration Ongoing" },
        facilitatorNotes: "This is now a combined breach + Black Friday crisis. The GDPR clock is ticking. The team made the wrong call at inject 1 — this is the consequence. Shutting down NOW after a breach is worse optics than pre-emptive maintenance.",
        delayMinutes: 0,
        isDecisionPoint: true,
        decisionOptions: [
          {
            key: "A",
            label: "Shut down immediately and notify affected customers before Black Friday starts",
            consequence: "Painful but correct. ICO acknowledges the swift notification. Forensics engaged. Platform back up at 11:00 — late but recoverable.",
          },
          {
            key: "B",
            label: "Continue trading — patch running — only notify after Black Friday ends",
            consequence: "Revenue saved. A journalist receives a tip at 14:30. Story breaks mid-Black Friday: 'Company knew about breach and kept trading'. ICO investigation, maximum fine likely.",
          },
        ],
        targetRoles: ["CEO", "CISO", "CLO", "CFO"],
        expectedKeywords: ["GDPR", "notification", "ICO", "shut down", "72 hours", "customer notification"],
      },

      // Branch C — silent feature flag
      {
        id: "bf-i2c",
        order: 10,
        title: "Path C: The Blogger Knows",
        body: "04:15 — @SecurityResearch247 has 80,000 followers and just tweeted: 'Interesting: [Company] silently disabled their checkout V2 at 23:30 last night. Correlated with last night's zero-day disclosure. No announcement made. Thread incoming.' The tweet already has 4,000 RTs. You have approximately 20 minutes before this goes mainstream.",
        timerMinutes: 8,
        tickerHeadline: "@SecurityResearch247: retailer silently patched zero-day without disclosure — thread going viral",
        artifact: { type: "tweet", tweetHandle: "@SecurityResearch247", tweetDisplayName: "Security Research 247", tweetLikes: 9800, tweetRetweets: 4100 },
        facilitatorNotes: "The 'quiet fix' approach has failed. The team now has a second crisis layered on top: the appearance of concealment. How quickly can they get ahead of this narrative?",
        delayMinutes: 0,
        isDecisionPoint: true,
        decisionOptions: [
          {
            key: "A",
            label: "Get ahead of it — immediate statement: 'We acted swiftly to protect customers'",
            consequence: "Narrative partially recovers. Security community broadly supportive. Revenue continues. ICO makes enquiries about GDPR notification obligations.",
          },
          {
            key: "B",
            label: "Ignore the tweet — hope it doesn't go viral",
            consequence: "Three national journalists pick it up by 05:30. 'Secret cyber cover-up during Black Friday' is the morning headline. Board meeting called for 07:00.",
          },
        ],
        targetRoles: ["CEO", "CCO", "CLO"],
        expectedKeywords: ["blogger", "narrative", "statement", "ahead of", "concealment"],
      },

      // Convergence
      {
        id: "bf-i3",
        order: 20,
        title: "Post-Black Friday: The Board Wants Answers",
        body: "Saturday 09:00 — Whatever path you took, the board has convened. The Finance Director has circulated a P&L impact analysis. The question on everyone's lips: was this a one-off or systemic? Your CTO has discovered that 11 other open-source libraries you depend on have similar potential vulnerabilities — never audited. The board is asking whether this needs to go to shareholders.",
        timerMinutes: 12,
        tickerHeadline: "Retailer board convenes emergency Saturday session following Black Friday cyber incident",
        artifact: { type: "email", emailFrom: "finance@company-board.com", emailTo: "ceo@yourcompany.com", emailSubject: "Board P&L Analysis — Black Friday incident — shareholder disclosure required?" },
        facilitatorNotes: "This is a governance and culture question. Was this a failure of process (no library auditing) or a failure of investment (understaffed security team)? The answer determines the remediation path.",
        delayMinutes: 0,
        isDecisionPoint: true,
        decisionOptions: [
          {
            key: "A",
            label: "Commission an urgent third-party security audit — pause new feature development",
            consequence: "Correct call. Dev team frustrated. Audit reveals 3 more critical issues. Remediation roadmap prepared for board. Takes 6 weeks and £400k.",
          },
          {
            key: "B",
            label: "Internal review only — accelerate patching programme without external audit",
            consequence: "Faster and cheaper. 8 months later, a second vulnerability is exploited. External audit is then mandated by the board anyway, now under legal scrutiny.",
          },
        ],
        targetRoles: ["CEO", "CTO", "CFO", "CISO"],
        expectedKeywords: ["audit", "board", "systemic", "remediation", "investment", "governance"],
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      },
    ],
  },
];
