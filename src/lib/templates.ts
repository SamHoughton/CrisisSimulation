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
        targetRoles: ["CISO", "COO"],
        expectedKeywords: ["isolate", "contain", "IR", "incident response"],
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
        targetRoles: ["CEO", "CLO", "CCO", "CFO"],
        expectedKeywords: ["holding statement", "ICO", "notification", "counsel", "no comment"],
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
        targetRoles: ["CEO", "CFO", "CLO"],
        expectedKeywords: ["board", "D&O", "insurance", "disclosure", "liability"],
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
        targetRoles: ["CISO", "CEO", "CLO", "CCO"],
        expectedKeywords: ["threat hunt", "contain", "customer notification", "backdoor"],
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
    durationMin: 90,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    roles: ["CEO", "CISO", "CLO", "CFO", "CCO"],
    briefing:
      "Your organisation processes payments for approximately 2 million customers across Europe and the US. You share customer data with several third-party vendors under data processing agreements. This morning you received a notification from one of those vendors.",
    injects: [
      {
        id: "tpl-b-i1",
        order: 0,
        title: "Vendor Notification Received",
        body: "You receive an email from CloudProcess Ltd, a customer analytics vendor used for 3 years. They report a 'security incident' between 15–22 March affecting 'some customer data'. They are 'still investigating' and will 'provide further details'. The email was sent to your IT security team's generic inbox — and was only spotted today, 5 days after it was sent.",
        facilitatorNotes:
          "CloudProcess hold ~450,000 of your customer records: names, emails, and behavioural data. The 72-hour GDPR notification clock likely started when the processor became aware, not today — legal opinion needed urgently.",
        delayMinutes: 0,
        isDecisionPoint: false,
        targetRoles: ["CISO", "CLO"],
        expectedKeywords: ["DPA", "data processing agreement", "controller", "processor", "GDPR"],
      },
      {
        id: "tpl-b-i2",
        order: 1,
        title: "Scope of Data Confirmed",
        body: "CloudProcess confirm: 450,000 customer records accessed — names, emails, and browsing/purchase history. No financial data taken. Attacker had access for 7 days. CloudProcess say they have 'notified the relevant authorities' in Ireland but have not confirmed whether they have specifically notified the UK ICO.",
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
        facilitatorNotes:
          "Decision point: pursue CloudProcess for damages (expensive, uncertain) vs prioritise customer trust and regulatory relationship. The competitor angle is a reputational crisis layered on top.",
        delayMinutes: 25,
        isDecisionPoint: false,
        targetRoles: ["CLO", "CFO", "CEO", "CCO"],
        expectedKeywords: ["indemnity", "liability", "contractual breach", "customer trust", "remediation"],
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
    durationMin: 90,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
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
        facilitatorNotes:
          "Document destruction = obstruction of justice (criminal). The PA's message could be characterised as tipping off. HR must accurately advise traders they are entitled to independent legal advice.",
        delayMinutes: 30,
        isDecisionPoint: false,
        targetRoles: ["CLO", "CEO", "COO"],
        expectedKeywords: ["preserve", "no deletion", "independent counsel", "HR", "comms lockdown"],
      },
      {
        id: "tpl-reg-i3",
        order: 2,
        title: "Media, Investors, and Encryption Keys",
        body: "09:45 — Reuters have called asking for comment on 'enforcement activity at your HQ'. Two institutional investors have called investor relations. Your Chairman has called. FCA officials have reached the server room and are requesting encryption keys for archived communications.",
        facilitatorNotes:
          "FCA can compel encryption keys under RIPA — refusal is contempt. Any statement to Reuters must be accurate. A narrow no-comment holding statement is appropriate here.",
        delayMinutes: 20,
        isDecisionPoint: false,
        targetRoles: ["CEO", "CLO", "CCO", "CISO"],
        expectedKeywords: ["no comment", "holding statement", "RIPA", "compel", "privilege", "board"],
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
    durationMin: 60,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    roles: ["CEO", "CLO", "CCO", "HR_LEAD", "CFO"],
    briefing:
      "It is a Friday afternoon. A post made last night by one of your Managing Directors on their personal social media account is gaining traction online. By morning it has been screenshotted, shared widely, and the hashtag carrying your company name is trending.",
    injects: [
      {
        id: "tpl-s-i1",
        order: 0,
        title: "Post Goes Viral",
        body: "09:15 — The MD's post — a comment on a political topic, since deleted — has been shared 40,000 times. Several major news outlets have reached out. Your social media team is reporting a surge of negative comments on all company channels. Three members of staff have emailed HR saying they feel 'unsafe' following the post.",
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
        facilitatorNotes:
          "The internal Slack response represents a significant employee relations issue regardless of the external story. The client contract is worth £4M annually.",
        delayMinutes: 45,
        isDecisionPoint: false,
        targetRoles: ["CEO", "HR_LEAD", "CFO", "CCO"],
        expectedKeywords: ["internal comms", "all-hands", "client", "shareholder", "values"],
      },
      {
        id: "tpl-s-i3",
        order: 2,
        title: "MD Makes Contact — Disciplinary Decision Required",
        body: "14:00 — The MD is now reachable. They insist the post was 'taken out of context' and are refusing to issue a personal apology. They are threatening to resign if 'scapegoated'. A national broadcaster has confirmed they are running the story on the evening news.",
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
      },
    ],
  },
];
