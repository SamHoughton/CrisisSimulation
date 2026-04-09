import type { Scenario } from "@/types";
import { makeId } from "@/lib/utils";

// IDs are stable so they don't change between sessions
export const BUILT_IN_TEMPLATES: Scenario[] = [

  // ─── SCENARIO 1: RANSOMWARE WITH DATA EXFILTRATION ───────────────────────────
  // Full 2-hour arc. 12 main-path injects + 4 branch injects.
  // Major decision trees at: containment approach, ransom response,
  // GDPR notification, board disclosure, threat actor deadline, backdoor handling.
  {
    id: "tpl-ransomware-001",
    title: "Ransomware with Data Exfiltration",
    description:
      "Sophisticated ransomware encrypts core systems while evidence emerges of prior data theft. Attribution to a known threat actor group. Regulatory, media, board and operational pressures escalate simultaneously over two hours.",
    type: "RANSOMWARE",
    difficulty: "HIGH",
    durationMin: 120,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    coverGradient: "135deg, #0a0000 0%, #1f000a 40%, #e8002d 100%",
    roles: ["CEO", "CISO", "CFO", "CLO", "CCO", "COO"],
    briefing:
      "You are the executive leadership team of Meridian Financial Services — a mid-sized financial services organisation with 3,200 employees and 1.4 million customers across the UK and EU. It is Tuesday morning and you have each just arrived at the office. At 07:43 your CISO's phone rings. You will receive a series of escalating developments over the next two hours. Respond as you would in a real crisis — in character, under time pressure. The facilitator controls the pace.",

    injects: [

      // ── INJECT 1: T+0 — Initial alert ─────────────────────────────────────
      {
        id: "rw-i1",
        order: 0,
        title: "SOC Alert: Mass Encryption Activity",
        body: "07:43 — Your CISO receives an automated alert: multiple servers in the primary data centre are showing unusual encryption activity. The SOC has isolated three servers but the activity is spreading rapidly. One analyst has identified what appears to be a ransom note on an affected endpoint. 47 endpoints flagged in the last 8 minutes.",
        facilitatorNotes:
          "BlackCat/ALPHV variant. Exfiltration occurred 48–72 hours ago via compromised VPN credentials. Without containment, backup systems will be hit in 4–6 hours. The correct initial response is aggressive isolation even at the cost of business disruption. Watch how quickly the CISO takes charge — or doesn't.",
        delayMinutes: 0,
        isDecisionPoint: true,
        timerMinutes: 10,
        tickerHeadline: "DEVELOPING: Reports of major cyber incident at UK financial services firm",
        artifact: {
          type: "siem_alert",
          siemAlertId: "SOC-2024-8847",
          siemSeverity: "CRITICAL",
          siemSourceIp: "10.14.22.187 (INTERNAL)",
          siemEventType: "Mass File Encryption — 47 endpoints affected and rising",
        },
        targetRoles: ["CISO", "COO", "CEO"],
        expectedKeywords: ["isolate", "contain", "IR", "incident response", "shutdown"],
        decisionOptions: [
          {
            key: "A",
            label: "Aggressive isolation — take all affected network segments offline immediately",
            consequence:
              "Spread halted within 20 minutes. 40% of IT infrastructure offline. Trading platform goes dark. Customers cannot access accounts. IR firm engaged. Business continuity plan needed urgently.",
          },
          {
            key: "B",
            label: "Selective isolation — keep core customer-facing systems up while IR team assesses",
            consequence:
              "Customer access maintained for 45 minutes longer. But encryption spreads to backup systems during the window. Recovery timeline extends from 5 days to 9 days.",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "rw-i2a" },
          { optionKey: "B", nextInjectId: "rw-i2b" },
        ],
      },

      // ── INJECT 2a: Path A — Aggressive isolation consequences ────────────
      {
        id: "rw-i2a",
        order: 10,
        title: "Path A: Systems Dark — Business Impact Escalates",
        body: "08:05 — The aggressive isolation has stopped the spread. But three major consequences: (1) your customer portal is completely offline — 14,000 customers attempted login in the last 10 minutes and hit an error page. (2) Your trading desk is down — estimated £2.1M in delayed settlements. (3) Your external IR firm, Mandiant, is en route and will arrive in 90 minutes. Your COO is asking: do we activate the business continuity plan now, or wait for IR to assess?",
        facilitatorNotes:
          "The correct answer is to activate BCP now — waiting for IR adds another 90 minutes of uncoordinated response. The customer-facing outage is already generating social media noise. The trading desk disruption may trigger regulatory reporting obligations under MAR.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Major financial services platform offline — thousands of customers unable to access accounts",
        artifact: {
          type: "email",
          emailFrom: "bcp@meridianfs.com",
          emailTo: "coo@meridianfs.com",
          emailSubject: "BCP Activation Request — IT incident — authorisation required",
        },
        isDecisionPoint: true,
        targetRoles: ["COO", "CEO", "CISO"],
        expectedKeywords: ["BCP", "business continuity", "MAR", "trading", "customer comms"],
        decisionOptions: [
          {
            key: "A",
            label: "Activate BCP immediately — switch to manual processing for critical operations",
            consequence: "Operations team mobilised. Manual processing begins. Adds cost and error risk but keeps critical functions moving. Mandiant arrives to a structured response.",
          },
          {
            key: "B",
            label: "Hold BCP activation — wait for Mandiant assessment before committing",
            consequence: "90-minute vacuum. Settlement failures accumulate. Customer complaints triple. Mandiant arrive and recommend immediate BCP — now delayed by 90 minutes.",
          },
        ],
      },

      // ── INJECT 2b: Path B — Delayed isolation, spread to backups ─────────
      {
        id: "rw-i2b",
        order: 10,
        title: "Path B: Backups Hit — Recovery Extended",
        body: "08:20 — Selective isolation has failed. The ransomware has reached your primary backup servers. Your CISO delivers the news: the 5-day recovery estimate has just become 9 days. Two customer-facing systems that were kept live to 'protect customer experience' are now also encrypted. You are now in the same position as aggressive isolation, but 45 minutes later and with significantly more damage. Mandiant are now en route.",
        facilitatorNotes:
          "This is the consequence of the wrong call at inject 1. Use this to drive home the cost of delay in containment decisions. The group should feel the weight of that choice. The discussion should naturally move to: what do we tell the board, and when?",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Financial services firm's backup systems hit in ransomware attack — recovery timeline now 9 days",
        artifact: {
          type: "siem_alert",
          siemAlertId: "SOC-2024-8849",
          siemSeverity: "CRITICAL",
          siemSourceIp: "10.14.22.187 (INTERNAL → BACKUP SEGMENT)",
          siemEventType: "Backup System Encryption — Recovery Timeline Extended",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "COO", "CEO"],
        expectedKeywords: ["backup", "recovery", "9 days", "Mandiant", "BCP"],
      },

      // ── INJECT 3: T+45 — Both paths converge — Scope + exfiltration ──────
      {
        id: "rw-i3",
        order: 20,
        title: "Scope Confirmed — Exfiltration Evidence Found",
        body: "08:30 — Mandiant's initial assessment is in. Encrypted: payroll, customer database, two production trading platforms — approximately 55% of IT infrastructure. The ransom note demands $4.8M in Bitcoin within 72 hours. Critically: Mandiant have found evidence of data being staged and exfiltrated approximately 60–72 hours ago. An estimated 220,000 customer records — names, account numbers, partial card data — may have been taken. The GDPR 72-hour notification clock started when you became aware of this potential breach.",
        facilitatorNotes:
          "This is the pivot point of the exercise. The team now faces simultaneous crises: operational recovery AND a potential data breach. The GDPR clock: 72 hours from now is Thursday 08:30. No notification = fines up to 4% of global annual turnover. The ransom decision and the GDPR decision are linked but separate. Push the group: what's the priority order?",
        delayMinutes: 0,
        timerMinutes: 15,
        tickerHeadline: "Financial services firm reportedly hit by $4.8M ransomware demand — customer data potentially exposed",
        artifact: {
          type: "ransomware_note",
          ransomAmount: "$4.8M",
          ransomDeadlineHours: 72,
          ransomWalletAddress: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CISO", "CLO", "CFO"],
        expectedKeywords: ["GDPR", "notify", "ICO", "72 hours", "ransom", "legal", "exfiltration"],
        decisionOptions: [
          {
            key: "A",
            label: "Refuse ransom — full IR response, restore from backup, notify ICO immediately",
            consequence:
              "IR firm engaged on full response. ICO notified — they acknowledge and request further detail within 72 hours. Recovery begins. Estimated 5–9 days to full restoration.",
          },
          {
            key: "B",
            label: "Open negotiations with threat actor while assessing options — delay ICO notification",
            consequence:
              "Negotiators engaged. Threat actor responds quickly — they know about the exfiltration and are threatening to publish data. GDPR notification clock continues to run. ICO notification window narrows.",
          },
          {
            key: "C",
            label: "Pay the ransom — obtain decryption key, assess data situation after",
            consequence:
              "Payment processed via negotiators. FBI/NCA make contact warning against payment. Insurer queries policy exclusions. Decryption key received but is slow — some files don't decrypt. Data may still be published regardless.",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "rw-i4" },
          { optionKey: "B", nextInjectId: "rw-i4b" },
          { optionKey: "C", nextInjectId: "rw-i4c" },
        ],
      },

      // ── INJECT 4: Main path — Media + regulatory pressure ────────────────
      {
        id: "rw-i4",
        order: 30,
        title: "Media Calls — ICO Acknowledges — Stock Moves",
        body: "09:15 — Three things simultaneously: (1) A Financial Times journalist calls your Head of Comms with specific details about the incident — details that haven't been made public. Someone is leaking. (2) The ICO has acknowledged your notification and requests a follow-up call within 24 hours, with a full timeline and data mapping. (3) Your stock price is down 4.7% on unusual volume. The LSE has not halted trading but your investor relations team is fielding calls.",
        facilitatorNotes:
          "The leak is significant — it suggests either an employee or someone within the IR process. The FT journalist has details about the $4.8M demand and the 220,000 records. The CCO needs to decide: engage the FT (risk of confirming details) or no comment (risk of looking evasive). The ICO call needs a lawyer on the line — not just the CISO.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "FT sources: major financial firm hit by $4.8M ransom demand — 220,000 customer records potentially exposed",
        artifact: {
          type: "email",
          emailFrom: "j.hartley@ft.com",
          emailTo: "press@meridianfs.com",
          emailSubject: "FT: Request for comment — ransomware incident affecting 220,000 customers",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CCO", "CFO"],
        expectedKeywords: ["holding statement", "ICO", "legal", "leak", "stock", "no comment"],
        decisionOptions: [
          {
            key: "A",
            label: "Issue a holding statement confirming a cyber incident — no financial details",
            consequence:
              "FT runs a story with your holding statement. Narrative is partially controlled. Stock price stabilises at -5.1%. ICO notes the proactive communication positively.",
          },
          {
            key: "B",
            label: "No comment to FT — brief major shareholders directly before media breaks",
            consequence:
              "FT runs the story without your comment. 'Company refuses to comment' becomes part of the headline. Two institutional shareholders call IR demanding answers.",
          },
        ],
      },

      // ── INJECT 4b: Path B — Negotiations backfire ─────────────────────────
      {
        id: "rw-i4b",
        order: 30,
        title: "Path B: Threat Actor Publishes Sample Data",
        body: "09:00 — The threat actor has posted a sample of 1,200 customer records on a dark web forum as proof of exfiltration. The sample includes full names, account numbers, sort codes, and partial card data. A security researcher has found it and posted about it on X. GDPR notification window: 63 hours remain. The threat actor's message: 'You have 48 hours to pay before we publish everything. Non-negotiable.' Mandiant advise the negotiation window has closed.",
        facilitatorNotes:
          "The negotiation gamble has failed. The team is now in a worse position: GDPR clock running, data already published, and they've lost 30 minutes of response time. The group should now pivot to: refuse further engagement, notify ICO immediately, begin customer notification planning. The published sample means customers may find out before the company notifies them.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "BREAKING: Dark web post shows customer data from financial services breach — security researchers alarmed",
        artifact: {
          type: "dark_web_listing",
          darkWebSiteName: "ALPHV Data Market",
          darkWebOnionUrl: "http://alphvmmm27o3abo3r2mlmjrpdmzle3rykajqc5xwn4bd3j4lujhpack3ad.onion",
          darkWebTitle: "MERIDIAN FINANCIAL SERVICES — FULL DATABASE DUMP (220,000 RECORDS)",
          darkWebPrice: "18 XMR",
          darkWebRecordCount: "220,000 records",
          darkWebSampleRows: [
            { name: "James R. Hartley",    account: "12847391", sortCode: "20-14-53", email: "j.hartley@gmail.com" },
            { name: "Priya Subramaniam",   account: "73920184", sortCode: "20-14-53", email: "priya.s@hotmail.co.uk" },
            { name: "David O'Connor",      account: "84736102", sortCode: "20-14-82", email: "doconnor1974@gmail.com" },
            { name: "Sarah Louise Briggs", account: "29384710", sortCode: "20-14-82", email: "sbriggs@yahoo.co.uk" },
            { name: "Mohammed Al-Farsi",   account: "56102938", sortCode: "20-14-53", email: "m.alfarsi@outlook.com" },
          ],
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CISO", "CLO", "CCO"],
        expectedKeywords: ["ICO", "notify", "customer notification", "dark web", "published"],
      },

      // ── INJECT 4c: Path C — Ransom paid, complications ───────────────────
      {
        id: "rw-i4c",
        order: 30,
        title: "Path C: Payment Made — New Complications",
        body: "09:45 — Ransom paid via negotiators. Decryption keys received. But: (1) FBI/NCA have made contact — they are aware of the payment and are treating it as potential sanctions violation (threat actor linked to sanctioned entity). (2) Your insurer has formally put the claim 'under review' — policy exclusions for payments to sanctioned entities may void coverage. (3) Decryption is working on only 60% of files — the rest may be permanently damaged. The data exfiltration threat remains unresolved.",
        facilitatorNotes:
          "This is the consequence of paying. The sanctions issue is a real risk — the US OFAC has published guidance that paying ransomware actors linked to sanctioned entities can itself be a sanctions violation, regardless of intent. The insurance void is a financial shock. The partial decryption means recovery is still needed. Push the group: what do you tell the board about why you paid?",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "Sources: financial firm paid ransomware demand — FBI involvement reported",
        artifact: {
          type: "email",
          emailFrom: "enforcement@fbi.gov",
          emailTo: "legal@meridianfs.com",
          emailSubject: "NOTICE: Ransomware payment — potential sanctions implications — mandatory cooperation required",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CLO", "CFO", "CISO"],
        expectedKeywords: ["sanctions", "OFAC", "FBI", "insurance", "decryption", "board"],
      },

      // ── INJECT 5: T+75 — Insurance and legal exposure ────────────────────
      {
        id: "rw-i5",
        order: 40,
        title: "Insurance Dispute and Legal Exposure",
        body: "10:00 — Your cyber insurer, Beazley, has sent a formal letter. They are querying whether the exploited VPN vulnerability was on your last penetration test's exceptions list. Your CISO confirms: it was flagged 8 months ago, deprioritised due to resource constraints, and never remediated. If the vulnerability was a known risk, the insurer may deny the claim — approximately £12M in coverage. Separately, a data protection law firm has sent a letter before claim on behalf of 340 affected customers they identified from the dark web posting.",
        facilitatorNotes:
          "The VPN vulnerability on the pen test is the governance failure that underpins everything. It creates: (1) insurance denial risk, (2) D&O liability, (3) regulatory aggravation. This is where the CEO and CLO should be having a very uncomfortable conversation about what the board knew. The 340-customer legal letter will grow — class action risk is real.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "Law firm launches action on behalf of data breach victims — group litigation expected",
        artifact: {
          type: "legal_letter",
          legalCaseRef: "BEZ-2024-POL-9847",
          legalAuthority: "Beazley Insurance — Cyber Claims Division",
        },
        isDecisionPoint: true,
        targetRoles: ["CLO", "CFO", "CEO", "CISO"],
        expectedKeywords: ["pen test", "insurance", "D&O", "class action", "remediation", "disclosure"],
        decisionOptions: [
          {
            key: "A",
            label: "Disclose the pen test finding to insurers proactively — engage external coverage counsel",
            consequence:
              "Insurer acknowledges the disclosure. Coverage counsel advises the exclusion may not apply — the vulnerability was known but not exploited until now. Expensive legal process begins but claim stays alive.",
          },
          {
            key: "B",
            label: "Contest the insurer's query — argue the pen test exception was within acceptable risk tolerance",
            consequence:
              "Insurer initiates formal coverage dispute. Mandiant's report surfaces the pen test finding independently. Legal costs escalate. The dispute becomes public in regulatory filings.",
          },
        ],
      },

      // ── INJECT 6: T+90 — Board escalation ────────────────────────────────
      {
        id: "rw-i6",
        order: 50,
        title: "Board Escalation — Chairman Calls",
        body: "10:30 — Your Chairman calls. Three NEDs have been contacted by major institutional shareholders. An emergency board briefing is demanded within 90 minutes. The Chairman has one direct question: 'Did the board know about any security vulnerabilities that were not remediated?' Two NEDs reviewed and signed off the IT risk register 6 months ago — a register that included the VPN vulnerability as 'medium risk, remediation deferred'. Your stock is now down 6.8%. Trading has been flagged as potentially disorderly by the LSE.",
        facilitatorNotes:
          "This is the D&O moment. Two NEDs may have personal liability. The CEO's answer to the Chairman will define the governance narrative for the next 12 months. The correct answer is full disclosure — but it's personally difficult for the NEDs. Watch whether the group protects individuals or takes a transparent position. The LSE 'disorderly trading' flag means a public announcement may be required.",
        delayMinutes: 0,
        timerMinutes: 15,
        tickerHeadline: "LSE flags disorderly trading in Meridian Financial shares as breach details emerge",
        artifact: {
          type: "email",
          emailFrom: "r.whitmore@meridian-board.com",
          emailTo: "ceo@meridianfs.com",
          emailSubject: "URGENT — Emergency board briefing required within 90 minutes — D&O questions",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CFO", "CLO"],
        expectedKeywords: ["board", "D&O", "NED", "disclosure", "LSE", "liability", "risk register"],
        decisionOptions: [
          {
            key: "A",
            label: "Full transparent board briefing — including the pen test and risk register finding",
            consequence:
              "Board informed. Two NEDs voluntarily step aside pending review. D&O insurers notified. Chairman concerned but supportive of transparency. LSE notified of material development.",
          },
          {
            key: "B",
            label: "Brief the board on the incident without surfacing the risk register issue yet",
            consequence:
              "Buys 48 hours. Legal later flags serious D&O exposure when the risk register is disclosed in regulatory proceedings. The omission becomes part of the ICO investigation.",
          },
        ],
      },

      // ── INJECT 7: T+105 — Threat actor deadline approaching ──────────────
      {
        id: "rw-i7",
        order: 60,
        title: "48-Hour Mark — Threat Actor Ultimatum",
        body: "11:00 — 24 hours have passed since the ransom note. The threat actor has sent a new message: they are publishing a second, larger sample of 8,000 customer records in 4 hours unless payment negotiations begin. Mandiant confirm the threat actor is ALPHV/BlackCat — currently under FBI disruption but still operational. Your recovery team reports core systems will be partially restored in 36 hours. The FCA has made contact — they are aware of the incident and are treating it as a potential operational resilience failure under PS21/3.",
        facilitatorNotes:
          "The FCA angle is serious — PS21/3 (operational resilience policy) requires firms to be able to remain within impact tolerances during severe but plausible scenarios. A 9-day outage almost certainly breaches this. The threat actor's second sample is a pressure tactic. The group must decide: engage or hold? This is also where the CEO needs to make the call on customer notification — waiting any longer risks customers finding out from the dark web before the company.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "FCA confirms investigation into Meridian Financial operational resilience failures",
        artifact: {
          type: "email",
          emailFrom: "supervisory@fca.org.uk",
          emailTo: "ceo@meridianfs.com",
          emailSubject: "FCA — Operational Resilience — PS21/3 — Supervisory Engagement Required",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CISO", "CLO", "CCO"],
        expectedKeywords: ["customer notification", "FCA", "PS21/3", "ALPHV", "publish", "engage"],
        decisionOptions: [
          {
            key: "A",
            label: "Begin customer notification now — do not engage the threat actor further",
            consequence:
              "Customer notifications go out. Call centre overwhelmed within 2 hours — 22,000 calls in first hour. Dark web sample becomes less damaging as customers are already informed. FCA notes the proactive notification.",
          },
          {
            key: "B",
            label: "Hold customer notification — attempt to negotiate takedown of the second sample",
            consequence:
              "Negotiators reach the threat actor. They agree to delay the second posting for 12 hours for £500k. A security blogger discovers the second sample independently 6 hours later — before customer notification goes out.",
          },
        ],
      },

      // ── INJECT 8: T+120 — Staff and operational HR crisis ────────────────
      {
        id: "rw-i8",
        order: 70,
        title: "Staff Revolt — Payroll at Risk",
        body: "11:30 — HR has a critical update: payroll systems are among the encrypted servers. 3,200 employees are due to be paid on Friday — 72 hours away. Manual payroll processing would take 5 days minimum. Your HR Director has fielded 140 employee queries. Three union representatives have requested an urgent meeting. Separately: two members of the IT team have been identified as potential sources of the FT leak — both are currently in the building.",
        facilitatorNotes:
          "The payroll failure is a direct employee relations crisis that the HR lead must own. There are legal obligations — employees must be paid on time or the company is in breach of contract. Options: emergency manual payroll (expensive, error-prone), short-term advance payments, or banking on recovery within 72 hours (optimistic). The leak investigation: care needed — if the company acts punitively on a suspicion, it creates whistleblowing protection risk.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Staff at breached firm face Friday payroll uncertainty as systems remain down",
        artifact: {
          type: "email",
          emailFrom: "hr@meridianfs.com",
          emailTo: "coo@meridianfs.com",
          emailSubject: "URGENT: Payroll systems encrypted — Friday pay at risk — union contact made",
        },
        isDecisionPoint: true,
        targetRoles: ["COO", "CFO", "CEO"],
        expectedKeywords: ["payroll", "union", "employees", "manual", "advance", "leak investigation"],
        decisionOptions: [
          {
            key: "A",
            label: "Authorise emergency payroll advances — brief staff with an all-hands communication",
            consequence:
              "Bank agrees to advance payroll funding. Emergency payments processed. Staff all-hands reduces panic. Union representatives satisfied. Cost: £340k in emergency processing fees.",
          },
          {
            key: "B",
            label: "Communicate that payroll may be delayed — request staff patience",
            consequence:
              "Union formally threatens industrial action. Employment tribunal complaint filed within 24 hours. Story becomes 'company won't pay staff' alongside the breach story. Significant reputational and legal escalation.",
          },
        ],
      },

      // ── INJECT 9: T+135 — Backdoor discovered ────────────────────────────
      {
        id: "rw-i9",
        order: 80,
        title: "Backdoor Discovered — Recovery Halted",
        body: "Day 2, 09:00 — Recovery is progressing. But your head of technology has found a second, dormant backdoor in the network — the threat actor may still have access. All recovery progress could be undermined if the backdoor is active. Mandiant recommend halting all recovery activity until the backdoor is fully eradicated — adding 24–48 hours. Customer notification emails went out yesterday and generated 31,000 customer contacts. Three national news channels are running the story as their lead business item.",
        facilitatorNotes:
          "The backdoor is the technical sting in the tail. The group needs to authorise the recovery halt — which has real cost — against the pressure to restore service as fast as possible. This is the CISO's call but the CEO needs to back it. The customer contact volume (31,000) is the human reality of the breach — the group should be asked: are you satisfied with how the customer notification was handled?",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "Second backdoor halts Meridian Financial recovery — customers furious as outage enters day two",
        artifact: {
          type: "siem_alert",
          siemAlertId: "SOC-2024-8851",
          siemSeverity: "CRITICAL",
          siemSourceIp: "185.220.101.47 (TOR EXIT NODE)",
          siemEventType: "Dormant C2 Beacon — Active Exfiltration Channel Identified",
        },
        isDecisionPoint: true,
        targetRoles: ["CISO", "CEO", "COO"],
        expectedKeywords: ["threat hunt", "halt recovery", "backdoor", "Mandiant", "eradicate", "C2"],
        decisionOptions: [
          {
            key: "A",
            label: "Halt all recovery — engage specialist threat hunting team to eradicate backdoor first",
            consequence:
              "Correct call. 36-hour delay. Backdoor eradicated. Recovery resumes on clean infrastructure. FCA notes the methodical approach positively in their eventual report.",
          },
          {
            key: "B",
            label: "Continue recovery on unaffected segments — monitor the backdoor while restoring",
            consequence:
              "Threat actor activates the backdoor 18 hours later. Second encryption event — partial — adds 4 more days to recovery. Mandiant later state this was avoidable.",
          },
        ],
      },

      // ── INJECT 10: Day 2 — Regulatory enforcement signals ────────────────
      {
        id: "rw-i10",
        order: 90,
        title: "ICO and FCA Signal Enforcement Intent",
        body: "Day 2, 13:00 — Two regulatory signals arrive simultaneously. The ICO has sent a formal information notice requiring full documentation of the data breach within 14 days — failure to comply carries criminal liability for senior officers. The FCA has formally classified the incident as a 'major operational incident' and is opening an investigation into PS21/3 compliance. Your external legal team estimates potential combined regulatory fines of £18–32M. Credit rating agency Moody's has placed Meridian on 'review for downgrade'.",
        facilitatorNotes:
          "This is the long tail of the crisis becoming real. The group needs to decide: do you fight both regulators, cooperate fully, or try to negotiate? The credit downgrade will affect the cost of capital. The combined fines would be painful but survivable — what's less survivable is a prolonged enforcement battle that keeps the story alive. This is also the moment to discuss: who is accountable? Has anyone been held responsible internally?",
        delayMinutes: 0,
        timerMinutes: 15,
        tickerHeadline: "Moody's places Meridian Financial on downgrade watch as dual regulatory investigations confirmed",
        artifact: {
          type: "legal_letter",
          legalCaseRef: "ICO-2024-ENF-0441 / FCA-PS21/3-2024-0093",
          legalAuthority: "Information Commissioner's Office and Financial Conduct Authority",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CFO", "CISO"],
        expectedKeywords: ["cooperate", "enforce", "fines", "Moody's", "accountability", "remediation roadmap"],
        decisionOptions: [
          {
            key: "A",
            label: "Full cooperation with both regulators — appoint dedicated regulatory liaison team",
            consequence:
              "ICO and FCA both note the cooperative posture. Investigation timeline: 9–12 months. Fine likely in lower range (£8–14M combined). No criminal referral for officers.",
          },
          {
            key: "B",
            label: "Contest the FCA classification — challenge PS21/3 application as unprecedented",
            consequence:
              "FCA escalates to formal enforcement proceedings. Legal costs mount. Story remains live. ICO investigation unaffected. Fine likely in upper range and proceedings extend to 18 months.",
          },
        ],
      },

      // ── INJECT 11: Day 2 — Lessons, accountability, and future ───────────
      {
        id: "rw-i11",
        order: 100,
        title: "The Accountability Question",
        body: "Day 3, 09:00 — Systems are coming back online. The immediate crisis is passing. But the board has convened and has a list of questions: (1) Who is accountable for the unpatched VPN vulnerability? (2) Should the CISO's position be reviewed? (3) What does a credible remediation programme look like for investors and regulators? (4) What do we say to the 1,200 customers whose data has already been published publicly? The CFO presents: total estimated cost of the incident — £28–44M.",
        facilitatorNotes:
          "This is the debrief inject — the wrap-up question set. The facilitator should use this to draw out the group's reflections on their own decisions across the session. Key questions to pose: what was the single decision that made the biggest difference? What would you do differently? Who in the organisation needs to change? This is where the AI report will be most valuable — it will have scored each decision and roleplay.",
        delayMinutes: 0,
        timerMinutes: 15,
        tickerHeadline: "Meridian Financial total breach cost estimated at £28–44M — board accountability review underway",
        artifact: {
          type: "email",
          emailFrom: "chairman@meridian-board.com",
          emailTo: "board@meridianfs.com",
          emailSubject: "Board resolution: accountability review, remediation programme, and investor communication required",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CISO", "CLO", "CFO"],
        expectedKeywords: ["accountability", "CISO", "remediation", "investor", "programme", "culture"],
        decisionOptions: [
          {
            key: "A",
            label: "Commission an independent post-incident review — results to be shared with regulators",
            consequence:
              "Regulators view this as best practice. External review firm engaged. Findings are uncomfortable but credible. Remediation roadmap accepted by ICO as mitigation evidence.",
          },
          {
            key: "B",
            label: "Internal review only — protect commercially sensitive findings",
            consequence:
              "Regulators specifically request the review findings. Failure to provide them is noted. ICO uses the absence of external review as evidence of inadequate governance culture.",
          },
        ],
      },
    ],
  },


  // ─── SCENARIO 2: THE DEEPFAKE CEO ────────────────────────────────────────────
  // Full 2-hour arc. 3-way branch at inject 1, all paths converge at inject 5.
  // Then 6 more injects through corporate espionage discovery, regulatory scrutiny,
  // board fallout, and long-term resilience decisions.
  {
    id: "tpl-deepfake-001",
    title: "The Deepfake CEO",
    description:
      "A hyper-realistic AI-generated video of your CEO making inflammatory statements goes viral at 6am. Tests crisis comms, legal, identity verification, market integrity, and board governance across a full two-hour arc.",
    type: "SOCIAL_MEDIA_CRISIS",
    difficulty: "CRITICAL",
    durationMin: 120,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    coverGradient: "135deg, #1a0a2e 0%, #4a0080 50%, #e8002d 100%",
    roles: ["CEO", "CCO", "CLO", "CISO", "CFO", "HR_LEAD"],
    briefing:
      "You are the senior leadership team of Apex Dynamics — a FTSE 250 technology and professional services company with 8,000 employees globally. It is 06:04 on a Monday morning. Your social media listening tool fires an automated alert. A 47-second video of your CEO — posted from an account called @ApexLeaks — is going viral on X. In it, the CEO appears to make openly racist remarks and threatens to fire half the workforce. Your CEO is asleep and their phone is off. Their EA has been woken and is trying to reach them. You have minutes before this becomes uncontrollable.",

    injects: [

      // ── INJECT 1: T+0 — Video goes viral — 3-way decision ────────────────
      {
        id: "df-i1",
        order: 0,
        title: "The Video Goes Viral",
        body: "06:04 — The video now has 340,000 views in 22 minutes and is trending #1 on X under #ApexCEO. Media outlets are running 'developing story' banners. Three FTSE 100 investors have emailed IR. Your CEO's personal email is being flooded. The video is forensically convincing — standard AI detection filters show inconclusive results. Your CEO is still unreachable. You have three paths.",
        facilitatorNotes:
          "This IS a deepfake. The CEO has been impersonated as part of a coordinated corporate espionage and short-selling operation. The challenge: the team doesn't know this yet. The correct instinct is Option C (holding statement) — it buys time without lying. Option A risks being wrong. Option B creates a dangerous vacuum. Key coaching question: what's the cost of being wrong in each direction?",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "VIRAL: Video purportedly showing Apex Dynamics CEO making racist remarks — 340K views in 20 minutes",
        artifact: {
          type: "tweet",
          tweetHandle: "@ApexLeaks",
          tweetDisplayName: "Apex Leaks",
          tweetLikes: 186000,
          tweetRetweets: 41200,
        },
        isDecisionPoint: true,
        imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
        targetRoles: ["CEO", "CCO", "CLO"],
        expectedKeywords: ["deepfake", "verify", "statement", "legal", "forensic", "holding"],
        decisionOptions: [
          {
            key: "A",
            label: "Issue an immediate denial — 'This video is fabricated' — before forensic confirmation",
            consequence:
              "Statement out in 11 minutes. If it were real, this would be catastrophic. Forensics later confirms it IS fake — credibility preserved, but it was a gamble. A second video surfaces of the CFO making fake acquisition statements.",
          },
          {
            key: "B",
            label: "Hold all public statements — forensic verification first (estimated 2–3 hours)",
            consequence:
              "Vacuum filled by speculation. Two major clients call to suspend contracts pending clarity. Share price opens down 8.4% at 08:00. Forensic confirmation arrives at 09:15. Staff are in crisis.",
          },
          {
            key: "C",
            label: "Issue a holding statement: 'We are aware and urgently investigating authenticity'",
            consequence:
              "Buys time. Media covers the uncertainty angle. Pressure builds but no major errors made. Forensic firm engaged immediately. CEO reached at 07:20.",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i2a" },
          { optionKey: "B", nextInjectId: "df-i2b" },
          { optionKey: "C", nextInjectId: "df-i2c" },
        ],
      },

      // ── INJECT 2a: Path A — Denial issued, second video surfaces ─────────
      {
        id: "df-i2a",
        order: 10,
        title: "Path A: Denial Questioned — Second Video Emerges",
        body: "07:00 — Your denial is being challenged. A tech journalist has enhanced the audio and says it 'passes every test I know of'. The @ApexLeaks account has vanished — but not before sending the video to 22 journalists. Your stock is down 5.9% at open. Then: a second video surfaces on a financial forum — this one shows your CFO announcing a fake £2.4B acquisition of a competitor. Markets briefly spike on the fake announcement before algorithms flag it. The FCA has called.",
        facilitatorNotes:
          "The CFO video is also a deepfake by the same actor. This is now clearly a coordinated attack. The FCA call is about potential market manipulation — the fake acquisition video caused a real market move. The team now faces: two simultaneous deepfakes, a questioned denial, an FCA inquiry, and a stock in freefall. This is the maximum pressure point of Path A.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "Second deepfake video causes brief market spike — CFO impersonated in fake £2.4B acquisition announcement",
        artifact: {
          type: "siem_alert",
          siemAlertId: "THREAT-2024-DF-02",
          siemSeverity: "HIGH",
          siemEventType: "Second AI Deepfake Detected — Same Threat Infrastructure — Market Impact Confirmed",
          siemSourceIp: "185.220.xxx.xxx (TOR)",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CCO", "CLO", "CISO", "CFO"],
        expectedKeywords: ["FCA", "market manipulation", "coordinated", "two videos", "forensic", "law enforcement"],
        decisionOptions: [
          {
            key: "A",
            label: "Immediately notify FCA formally and engage law enforcement — joint statement on both videos",
            consequence:
              "FCA acknowledges proactive engagement. Law enforcement opens investigation. Joint statement on both deepfakes neutralises the CFO video. Market partially recovers.",
          },
          {
            key: "B",
            label: "Focus on the CEO video denial first — address the CFO video separately",
            consequence:
              "Fragmented response. Media treats them as two separate stories, doubling coverage. FCA sends a formal information notice within the hour.",
          },
        ],
      },

      // ── INJECT 2b: Path B — Silence costs dearly ─────────────────────────
      {
        id: "df-i2b",
        order: 10,
        title: "Path B: The Silence Costs You",
        body: "08:00 — Two hours of silence has been read by the market as confirmation. Your largest retail partner has suspended co-marketing. 240 staff have emailed HR asking for emergency all-hands. The Sunday Times website publishes: 'Apex Dynamics refuses to comment as CEO racism video spreads'. Share price opens down 9.7%. Your CEO is now awake and incandescent — they want to make a personal live video immediately, without a brief.",
        facilitatorNotes:
          "The CEO going live unplanned and emotional is high risk. But two hours of silence has already done serious damage. This is a test of whether the group can manage the CEO as an asset or a liability. The HR crisis (240 emails) is real — employees need to hear something. The CCO and HR lead should be pushing for an internal communication at minimum, even if the external position is still 'investigating'.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Apex Dynamics silent for two hours as CEO deepfake video spreads — share price -9.7%",
        artifact: { type: "news_headline" },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CCO", "HR_LEAD"],
        expectedKeywords: ["CEO", "live", "brief", "all-hands", "employees", "internal communication"],
        decisionOptions: [
          {
            key: "A",
            label: "Let CEO go live immediately on LinkedIn — authentic, unscripted response",
            consequence:
              "CEO is emotional but convincing — video gets 1.2M views. Authenticity works. Share price recovers partially. But CEO's fatigue shows, and 20 minutes later the CFO deepfake surfaces.",
          },
          {
            key: "B",
            label: "30-minute brief first — then CEO goes live with prepared key messages",
            consequence:
              "CEO goes live with a calm, clear rebuttal. Forensics not yet back but CEO's personal authenticity carries the message. Share price stabilises. CFO video appears as CEO finishes.",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i3" },
          { optionKey: "B", nextInjectId: "df-i3" },
        ],
      },

      // ── INJECT 2c: Path C — Holding statement buys time ──────────────────
      {
        id: "df-i2c",
        order: 10,
        title: "Path C: The Window Holds — Forensics Race",
        body: "07:20 — Your holding statement is working. Media are covering the uncertainty angle: 'Company investigates viral CEO video'. CEO reached — they are calm and cooperative. Your CISO has engaged DeepDetect AI — a specialist forensic firm. They've found early AI-generated audio artefacts. ETA for confirmation: 75 minutes. Meanwhile: a campaigning journalist has published a thread calling the holding statement 'a cover-up playbook'. 180 staff have emailed HR. The CFO deepfake has just appeared on a financial forum.",
        facilitatorNotes:
          "Path C is the most defensible legally and reputationally. The group is doing well. The challenge now is internal — employees need something. The CFO video is a complication that the group now has to absorb mid-investigation. The journalist's 'cover-up' narrative is dangerous — the CCO needs a proactive media strategy, not just reactive holding statements.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Apex Dynamics investigation underway — authenticity of CEO video disputed — CFO video appears",
        artifact: {
          type: "email",
          emailFrom: "forensics@deepdetect.ai",
          emailTo: "ciso@apexdynamics.com",
          emailSubject: "URGENT: Preliminary findings — AI-generated audio artefacts detected in CEO video",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "CLO", "CCO", "HR_LEAD"],
        expectedKeywords: ["forensic", "employee comms", "CFO video", "internal communication", "cover-up narrative"],
      },

      // ── INJECT 3: ALL PATHS CONVERGE — CEO reached, staff crisis ─────────
      {
        id: "df-i3",
        order: 20,
        title: "All Hands: Staff Crisis and Market Open",
        body: "08:15 — Whatever path you took, three simultaneous crises: (1) 340 staff members have sent emails or Slack messages asking what's happening — your Head of HR says morale is in freefall. (2) Share price at market open: -7.2%. Three major institutional investors are demanding a call with the Chairman before midday. (3) A national broadcaster has announced they are running the story on the morning news at 09:00. Your CEO is now fully briefed and operational. The forensic firm ETA for confirmation is 45 minutes.",
        facilitatorNotes:
          "This is the convergence point. Regardless of path, the group now faces the same set of simultaneous pressures. The key question: what order do you tackle these in? The internal crisis (staff) is underweighted in most crisis response frameworks — but it matters enormously for long-term recovery. The institutional investor calls should go through the Chairman, not the CEO directly.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "Apex Dynamics shares fall 7.2% at open — institutional investors demand chairman call",
        artifact: {
          type: "tweet",
          tweetHandle: "@BBCBusinessNews",
          tweetDisplayName: "BBC Business News",
          tweetLikes: 28000,
          tweetRetweets: 12400,
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "HR_LEAD", "CFO", "CCO"],
        expectedKeywords: ["all-hands", "investors", "chairman", "BBC", "priority", "internal"],
        decisionOptions: [
          {
            key: "A",
            label: "Prioritise internal: all-hands message from CEO first, then investor calls",
            consequence:
              "Staff morale stabilises. Three union reps who were about to send a press statement hold off. Investor calls are brief but manage to prevent panic selling. Share price holds at -7.2%.",
          },
          {
            key: "B",
            label: "Prioritise external: investor calls and BBC response first, internal comms after",
            consequence:
              "Investors reassured. BBC story runs with a company statement. But a union rep sends a press statement citing 'leadership silence on staff welfare'. This becomes a secondary story.",
          },
        ],
      },

      // ── INJECT 4: T+120 — Forensic confirmation ───────────────────────────
      {
        id: "df-i4",
        order: 30,
        title: "Forensic Confirmation: Both Videos Are Deepfakes",
        body: "09:15 — DeepDetect AI confirm both videos are AI-generated. Voice synthesis, facial mapping, identical infrastructure. Technical report publishable. The threat actor is traced to an offshore server cluster with known links to a corporate intelligence firm — suggesting a coordinated disinformation attack, possibly linked to a short-selling position. FCA trading data shows 840,000 Apex Dynamics put options were purchased in the 48 hours before the videos were released. Now: how do you use this confirmation?",
        facilitatorNotes:
          "This is the vindication moment — but it has to be handled carefully. The short-selling link is potentially criminal — publishing it prematurely could compromise an FCA/SFO investigation. The forensic report itself is publishable and should be. The question of whether to go public on the short-selling theory is genuinely difficult — it's explosive but not yet proven. Push the group on the difference between what they know and what they can say.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "CONFIRMED: Both Apex Dynamics videos determined to be AI deepfakes — forensic report published",
        artifact: {
          type: "email",
          emailFrom: "report@deepdetect.ai",
          emailTo: "ciso@apexdynamics.com",
          emailSubject: "Final Forensic Report — CEO and CFO Videos — AI Deepfake Confirmed — Publishable",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CCO", "CISO"],
        expectedKeywords: ["publish", "forensic", "short selling", "FCA", "law enforcement", "narrative"],
        decisionOptions: [
          {
            key: "A",
            label: "Publish forensic report and allege publicly that this may be a short-selling attack",
            consequence:
              "Maximum transparency — media pivot to 'company vindicated, attack exposed'. FCA contacts you asking you to stop public speculation as it may compromise their investigation. Tense.",
          },
          {
            key: "B",
            label: "Publish forensic report only — give the short-selling evidence to FCA privately",
            consequence:
              "FCA grateful for cooperation. Investigation proceeds. Media story: 'Company vindicated'. Controlled narrative. Attacker doesn't know investigators are closing in.",
          },
          {
            key: "C",
            label: "Brief the forensic report to major media off-record first — then publish",
            consequence:
              "Journalists publish their own analysis alongside the report. Narrative strongly favourable. FCA investigates whether the off-record briefing itself constitutes selective disclosure.",
          },
        ],
      },

      // ── INJECT 5: T+140 — The short-selling investigation opens ───────────
      {
        id: "df-i5",
        order: 40,
        title: "FCA Opens Market Manipulation Investigation",
        body: "10:30 — The FCA formally opens a market manipulation investigation under the Market Abuse Regulation. They confirm 840,000 put options — worth approximately £18M — were purchased in the 48 hours prior. They are requesting all company communications since last Monday and want a senior officer available for voluntary interview within 48 hours. Your own internal review has found that the deepfake videos were created using footage from a recent investor day — footage that was shared with 14 external parties including two hedge funds.",
        facilitatorNotes:
          "The investor day footage link is significant — the attacker had access to high-quality video material, which means someone either leaked it or it was obtained through a breach. The 14 external parties list needs immediate review. The CISO should be running a parallel investigation. The voluntary FCA interview should be handled carefully — 'voluntary' doesn't mean unimportant. The CLO should be advising on the correct legal approach.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "FCA opens market manipulation investigation — 840,000 put options purchased before deepfake attack",
        artifact: {
          type: "legal_letter",
          legalCaseRef: "FCA/MAR/2024/1094",
          legalAuthority: "Financial Conduct Authority — Market Oversight Division",
        },
        isDecisionPoint: true,
        targetRoles: ["CLO", "CISO", "CEO", "CFO"],
        expectedKeywords: ["MAR", "market manipulation", "investor day", "put options", "FCA interview", "leak"],
        decisionOptions: [
          {
            key: "A",
            label: "Full cooperation — provide all communications, identify the investor day footage recipients",
            consequence:
              "FCA moves quickly. Two hedge funds flagged. SFO briefed. One fund freezes its position. Company is treated as a victim and cooperating witness — protected from regulatory action.",
          },
          {
            key: "B",
            label: "Provide only what is strictly required — take legal advice on each document before disclosure",
            consequence:
              "FCA issues a formal information notice. Legal privilege review takes 3 weeks. By then, the attacker has closed their short position. Investigation stalls without the early evidence.",
          },
        ],
      },

      // ── INJECT 6: T+155 — Internal leak investigation surfaces ────────────
      {
        id: "df-i6",
        order: 50,
        title: "Internal Source Identified — HR and Legal Crisis",
        body: "11:00 — Your CISO's investigation has identified the source of the investor day footage leak. It traces to the personal laptop of a senior communications manager — access logs show the footage was copied to an encrypted drive 10 days ago. The individual is currently in the office. HR and Legal need to decide: confront immediately, or preserve evidence and coordinate with law enforcement first? Additionally: two major enterprise clients have each emailed asking for reassurance calls about data security following the breach revelations.",
        facilitatorNotes:
          "This is a genuinely difficult HR-legal-investigation intersection. Confronting the employee immediately risks: evidence destruction, a hostile reaction, and potential whistleblowing claims if the process is mishandled. Coordinating with law enforcement first is the right instinct — but it takes longer and the individual may suspect something. The client reassurance calls are important commercially — the CISO should lead them, not the CEO.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Apex Dynamics investigates internal source of deepfake footage leak",
        artifact: {
          type: "siem_alert",
          siemAlertId: "THREAT-2024-INT-01",
          siemSeverity: "HIGH",
          siemEventType: "Data Exfiltration — Investor Day Footage — Internal Source Identified",
          siemSourceIp: "INTERNAL — COMMS DEPT DEVICE — Personal encrypted drive",
        },
        isDecisionPoint: true,
        targetRoles: ["CLO", "HR_LEAD", "CISO", "CEO"],
        expectedKeywords: ["evidence", "law enforcement", "HR process", "preserve", "client", "investigation"],
        decisionOptions: [
          {
            key: "A",
            label: "Preserve evidence and brief law enforcement — do not confront the employee yet",
            consequence:
              "Police Economic Crime Unit briefed. Employee's devices preserved remotely. Formal interview conducted 48 hours later with police present. Strongest evidential position.",
          },
          {
            key: "B",
            label: "Suspend the employee immediately and interview under company HR process",
            consequence:
              "Employee's personal devices leave the building that evening. Company process legally valid but the police later note the missed opportunity to seize personal devices with evidence.",
          },
        ],
      },

      // ── INJECT 7: T+170 — Board governance and accountability ─────────────
      {
        id: "df-i7",
        order: 60,
        title: "Board Governance: Who Is Accountable?",
        body: "Day 2, 09:00 — Share price has recovered to -3.1% from the worst point. The narrative is moving in Apex's favour. But the board has convened with hard questions: (1) How did a communications manager have unsupervised access to high-quality executive footage? (2) Was there a failure of media security policy? (3) Should the CISO have detected the data exfiltration from the comms device earlier? (4) Investors want a formal board statement on what has changed. A FTSE governance advisory firm has contacted your Chairman suggesting a 'board resilience review'.",
        facilitatorNotes:
          "This is the systemic governance question. The correct answer involves: improved access controls, a media asset management policy, enhanced endpoint monitoring, and probably an independent security review. The CISO accountability question is nuanced — they were the victim of a sophisticated attack, but internal data exfiltration is within their remit. The board review: advisable to accept it rather than resist — signals maturity.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "Board convenes governance review — investors demand formal response to deepfake attack",
        artifact: {
          type: "email",
          emailFrom: "governance@ftseadvisory.co.uk",
          emailTo: "chairman@apexdynamics.com",
          emailSubject: "Board Resilience Review — Deepfake Attack — Governance Advisory",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CISO", "CLO", "CFO"],
        expectedKeywords: ["access controls", "media policy", "CISO accountability", "board review", "resilience", "governance"],
        decisionOptions: [
          {
            key: "A",
            label: "Accept the board resilience review — commission independently with results to shareholders",
            consequence:
              "Investors satisfied. Review takes 6 weeks and costs £120k. Findings lead to a new media security policy, access review, and CISO resource increase. Strong ESG signal.",
          },
          {
            key: "B",
            label: "Resist the external review — conduct internal review and publish a remediation summary",
            consequence:
              "Two institutional investors publicly state they consider the internal review inadequate. Proxy advisory firm recommends voting against the CISO's continued board-level reporting at AGM.",
          },
        ],
      },

      // ── INJECT 8: T+180 — Long-term: AI threat doctrine ──────────────────
      {
        id: "df-i8",
        order: 70,
        title: "The Industry Moment — Setting a Precedent",
        body: "Day 3, 11:00 — The Apex Dynamics case has become a landmark. The government's AI Safety Institute has asked your CEO to contribute to a new code of practice on AI-generated disinformation in financial markets. Three peer companies have privately asked to adopt your incident playbook. Your law firm advises that this is a chance to shape the regulatory environment before it shapes you. But your CFO notes that public engagement on AI policy will bring fresh media scrutiny to what happened. How does Apex want to be remembered for this?",
        facilitatorNotes:
          "This is the final inject — forward-looking and reflective. It gives the group an opportunity to think beyond the crisis to the organisational identity question: are you a company that hides from hard moments, or one that uses them to build credibility? The AI Safety Institute angle is real — regulators are actively looking for business input. This is also a natural debrief trigger: what would you do differently? What did this crisis reveal about your team?",
        delayMinutes: 0,
        timerMinutes: 15,
        tickerHeadline: "Apex Dynamics case becomes landmark AI disinformation test — government seeks input on new code of practice",
        artifact: {
          type: "email",
          emailFrom: "engagement@ai-safety-institute.gov.uk",
          emailTo: "ceo@apexdynamics.com",
          emailSubject: "AI Safety Institute — Invitation: Code of Practice on AI Disinformation in Financial Markets",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CCO", "CISO"],
        expectedKeywords: ["AI policy", "precedent", "industry", "resilience", "code of practice", "reputation"],
        decisionOptions: [
          {
            key: "A",
            label: "Accept — Apex leads the working group, publishes a public incident account",
            consequence:
              "CEO becomes a recognised voice on AI disinformation. Media narrative shifts from 'attacked' to 'leader'. Share price recovers to +1.2% within 30 days. Reputational long game won.",
          },
          {
            key: "B",
            label: "Decline — keep a low profile while legal proceedings continue",
            consequence:
              "Legally cautious. Another company leads the working group. Apex remains defined by the attack rather than the response. Institutional investors note the missed opportunity in ESG assessment.",
          },
        ],
      },
    ],
  },
];
