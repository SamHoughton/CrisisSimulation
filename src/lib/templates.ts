/**
 * templates.ts - Built-in scenario templates.
 *
 * Two full 2-hour scenarios with deep branching decision trees:
 *
 * 1. Ransomware with Data Exfiltration (tpl-ransomware-001)
 *    - Fake company: Meridian Financial Services (London, 3,200 employees, 1.4M customers)
 *    - 14 injects across 4 branching paths (aggressive/selective containment, ransom/refuse)
 *    - Artifacts: SIEM alerts, ransomware note, dark web listing, emails, legal letters
 *
 * 2. The Deepfake CEO (tpl-deepfake-001)
 *    - Fake company: Apex Dynamics (FTSE 250, 8,000 employees)
 *    - 10 injects across 3 branching paths (deny/silence/hold)
 *    - Artifacts: viral tweets, news headlines, legal letters
 *
 * Template IDs are stable strings (not random) so they persist correctly across
 * app restarts and don't duplicate in the library.
 */

import type { Scenario } from "@/types";
import { makeId } from "@/lib/utils";

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
      "You are the executive leadership team of Meridian Financial Services - a mid-sized financial services organisation with 3,200 employees and 1.4 million customers across the UK and EU. It is Tuesday morning and you have each just arrived at the office. At 07:43 your CISO's phone rings. You will receive a series of escalating developments over the next two hours. Respond as you would in a real crisis - in character, under time pressure. The facilitator controls the pace.",

    injects: [

      // ── INJECT 1: T+0 - Initial alert ─────────────────────────────────────
      {
        id: "rw-i1",
        order: 0,
        title: "SOC Alert: Mass Encryption Activity",
        body: "07:43 - Your CISO receives an automated alert: multiple servers in the primary data centre are showing unusual encryption activity. The SOC has isolated three servers but the activity is spreading rapidly. One analyst has identified what appears to be a ransom note on an affected endpoint. 47 endpoints flagged in the last 8 minutes.",
        facilitatorNotes:
          "BlackCat/ALPHV variant. Exfiltration occurred 48–72 hours ago via compromised VPN credentials. Without containment, backup systems will be hit in 4–6 hours. The correct initial response is aggressive isolation even at the cost of business disruption. Watch how quickly the CISO takes charge - or doesn't.",
        delayMinutes: 0,
        isDecisionPoint: true,
        timerMinutes: 10,
        tickerHeadline: "DEVELOPING: Reports of major cyber incident at UK financial services firm",
        artifact: {
          type: "siem_alert",
          siemAlertId: "SOC-2024-8847",
          siemSeverity: "CRITICAL",
          siemSourceIp: "10.14.22.187 (INTERNAL)",
          siemEventType: "Mass File Encryption -47 endpoints affected and rising",
        },
        targetRoles: ["CISO", "COO", "CEO"],
        expectedKeywords: ["isolate", "contain", "IR", "incident response", "shutdown"],
        decisionOptions: [
          {
            key: "A",
            label: "Aggressive isolation - take all affected network segments offline immediately",
            consequence:
              "Spread halted within 20 minutes. 40% of IT infrastructure offline. Trading platform goes dark. Customers cannot access accounts. IR firm engaged. Business continuity plan needed urgently.",
          },
          {
            key: "B",
            label: "Selective isolation - keep core customer-facing systems up while IR team assesses",
            consequence:
              "Customer access maintained for 45 minutes longer. But encryption spreads to backup systems during the window. Recovery timeline extends from 5 days to 9 days.",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "rw-i2a" },
          { optionKey: "B", nextInjectId: "rw-i2b" },
        ],
      },

      // ── INJECT 2a: Path A - Aggressive isolation consequences ────────────
      {
        id: "rw-i2a",
        order: 10,
        title: "Path A: Systems Dark - Business Impact Escalates",
        body: "08:05 - The aggressive isolation has stopped the spread. But three major consequences: (1) your customer portal is completely offline -14,000 customers attempted login in the last 10 minutes and hit an error page. (2) Your trading desk is down - estimated £2.1M in delayed settlements. (3) Your external IR firm, Mandiant, is en route and will arrive in 90 minutes. Your COO is asking: do we activate the business continuity plan now, or wait for IR to assess?",
        facilitatorNotes:
          "The correct answer is to activate BCP now - waiting for IR adds another 90 minutes of uncoordinated response. The customer-facing outage is already generating social media noise. The trading desk disruption may trigger regulatory reporting obligations under MAR.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Major financial services platform offline - thousands of customers unable to access accounts",
        artifact: {
          type: "email",
          emailFrom: "bcp@meridianfs.com",
          emailTo: "coo@meridianfs.com",
          emailSubject: "BCP Activation Request - IT incident - authorisation required",
        },
        isDecisionPoint: true,
        targetRoles: ["COO", "CEO", "CISO"],
        expectedKeywords: ["BCP", "business continuity", "MAR", "trading", "customer comms"],
        decisionOptions: [
          {
            key: "A",
            label: "Activate BCP immediately - switch to manual processing for critical operations",
            consequence: "Operations team mobilised. Manual processing begins. Adds cost and error risk but keeps critical functions moving. Mandiant arrives to a structured response.",
          },
          {
            key: "B",
            label: "Hold BCP activation - wait for Mandiant assessment before committing",
            consequence: "90-minute vacuum. Settlement failures accumulate. Customer complaints triple. Mandiant arrive and recommend immediate BCP - now delayed by 90 minutes.",
          },
        ],
      },

      // ── INJECT 2b: Path B - Delayed isolation, spread to backups ─────────
      {
        id: "rw-i2b",
        order: 10,
        title: "Path B: Backups Hit - Recovery Extended",
        body: "08:20 - Selective isolation has failed. The ransomware has reached your primary backup servers. Your CISO delivers the news: the 5-day recovery estimate has just become 9 days. Two customer-facing systems that were kept live to 'protect customer experience' are now also encrypted. You are now in the same position as aggressive isolation, but 45 minutes later and with significantly more damage. Mandiant are now en route.",
        facilitatorNotes:
          "This is the consequence of the wrong call at inject 1. Use this to drive home the cost of delay in containment decisions. The group should feel the weight of that choice. The discussion should naturally move to: what do we tell the board, and when?",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Financial services firm's backup systems hit in ransomware attack - recovery timeline now 9 days",
        artifact: {
          type: "siem_alert",
          siemAlertId: "SOC-2024-8849",
          siemSeverity: "CRITICAL",
          siemSourceIp: "10.14.22.187 (INTERNAL → BACKUP SEGMENT)",
          siemEventType: "Backup System Encryption - Recovery Timeline Extended",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "COO", "CEO"],
        expectedKeywords: ["backup", "recovery", "9 days", "Mandiant", "BCP"],
      },

      // ── INJECT 3: T+45 - Both paths converge - Scope + exfiltration ──────
      {
        id: "rw-i3",
        order: 20,
        title: "Scope Confirmed - Exfiltration Evidence Found",
        body: "08:30 - Mandiant's initial assessment is in. Encrypted: payroll, customer database, two production trading platforms - approximately 55% of IT infrastructure. The ransom note demands $4.8M in Bitcoin within 72 hours. Critically: Mandiant have found evidence of data being staged and exfiltrated approximately 60–72 hours ago. An estimated 220,000 customer records - names, account numbers, partial card data - may have been taken. The GDPR 72-hour notification clock started when you became aware of this potential breach.",
        facilitatorNotes:
          "This is the pivot point of the exercise. The team now faces simultaneous crises: operational recovery AND a potential data breach. The GDPR clock: 72 hours from now is Thursday 08:30. No notification = fines up to 4% of global annual turnover. The ransom decision and the GDPR decision are linked but separate. Push the group: what's the priority order?",
        delayMinutes: 0,
        timerMinutes: 15,
        tickerHeadline: "Financial services firm reportedly hit by $4.8M ransomware demand - customer data potentially exposed",
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
            label: "Refuse ransom - full IR response, restore from backup, notify ICO immediately",
            consequence:
              "IR firm engaged on full response. ICO notified - they acknowledge and request further detail within 72 hours. Recovery begins. Estimated 5–9 days to full restoration.",
          },
          {
            key: "B",
            label: "Open negotiations with threat actor while assessing options - delay ICO notification",
            consequence:
              "Negotiators engaged. Threat actor responds quickly - they know about the exfiltration and are threatening to publish data. GDPR notification clock continues to run. ICO notification window narrows.",
          },
          {
            key: "C",
            label: "Pay the ransom - obtain decryption key, assess data situation after",
            consequence:
              "Payment processed via negotiators. FBI/NCA make contact warning against payment. Insurer queries policy exclusions. Decryption key received but is slow - some files don't decrypt. Data may still be published regardless.",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "rw-i4" },
          { optionKey: "B", nextInjectId: "rw-i4b" },
          { optionKey: "C", nextInjectId: "rw-i4c" },
        ],
      },

      // ── INJECT 4: Main path - Media + regulatory pressure ────────────────
      {
        id: "rw-i4",
        order: 30,
        title: "Media Calls - ICO Acknowledges - Stock Moves",
        body: "09:15 - Three things simultaneously: (1) A Financial Times journalist calls your Head of Comms with specific details about the incident - details that haven't been made public. Someone is leaking. (2) The ICO has acknowledged your notification and requests a follow-up call within 24 hours, with a full timeline and data mapping. (3) Your stock price is down 4.7% on unusual volume. The LSE has not halted trading but your investor relations team is fielding calls.",
        facilitatorNotes:
          "The leak is significant - it suggests either an employee or someone within the IR process. The FT journalist has details about the $4.8M demand and the 220,000 records. The CCO needs to decide: engage the FT (risk of confirming details) or no comment (risk of looking evasive). The ICO call needs a lawyer on the line - not just the CISO.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "FT sources: major financial firm hit by $4.8M ransom demand -220,000 customer records potentially exposed",
        artifact: {
          type: "email",
          emailFrom: "j.hartley@ft.com",
          emailTo: "press@meridianfs.com",
          emailSubject: "FT: Request for comment - ransomware incident affecting 220,000 customers",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CCO", "CFO"],
        expectedKeywords: ["holding statement", "ICO", "legal", "leak", "stock", "no comment"],
        decisionOptions: [
          {
            key: "A",
            label: "Issue a holding statement confirming a cyber incident - no financial details",
            consequence:
              "FT runs a story with your holding statement. Narrative is partially controlled. Stock price stabilises at -5.1%. ICO notes the proactive communication positively.",
          },
          {
            key: "B",
            label: "No comment to FT - brief major shareholders directly before media breaks",
            consequence:
              "FT runs the story without your comment. 'Company refuses to comment' becomes part of the headline. Two institutional shareholders call IR demanding answers.",
          },
        ],
      },

      // ── INJECT 4b: Path B - Negotiations backfire ─────────────────────────
      {
        id: "rw-i4b",
        order: 30,
        title: "Path B: Threat Actor Publishes Sample Data",
        body: "09:00 - The threat actor has posted a sample of 1,200 customer records on a dark web forum as proof of exfiltration. The sample includes full names, account numbers, sort codes, and partial card data. A security researcher has found it and posted about it on X. GDPR notification window: 63 hours remain. The threat actor's message: 'You have 48 hours to pay before we publish everything. Non-negotiable.' Mandiant advise the negotiation window has closed.",
        facilitatorNotes:
          "The negotiation gamble has failed. The team is now in a worse position: GDPR clock running, data already published, and they've lost 30 minutes of response time. The group should now pivot to: refuse further engagement, notify ICO immediately, begin customer notification planning. The published sample means customers may find out before the company notifies them.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "BREAKING: Dark web post shows customer data from financial services breach - security researchers alarmed",
        artifact: {
          type: "dark_web_listing",
          darkWebSiteName: "ALPHV Data Market",
          darkWebOnionUrl: "http://alphvmmm27o3abo3r2mlmjrpdmzle3rykajqc5xwn4bd3j4lujhpack3ad.onion",
          darkWebTitle: "MERIDIAN FINANCIAL SERVICES - FULL DATABASE DUMP (220,000 RECORDS)",
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

      // ── INJECT 4c: Path C - Ransom paid, complications ───────────────────
      {
        id: "rw-i4c",
        order: 30,
        title: "Path C: Payment Made - New Complications",
        body: "09:45 - Ransom paid via negotiators. Decryption keys received. But: (1) FBI/NCA have made contact - they are aware of the payment and are treating it as potential sanctions violation (threat actor linked to sanctioned entity). (2) Your insurer has formally put the claim 'under review' - policy exclusions for payments to sanctioned entities may void coverage. (3) Decryption is working on only 60% of files - the rest may be permanently damaged. The data exfiltration threat remains unresolved.",
        facilitatorNotes:
          "This is the consequence of paying. The sanctions issue is a real risk - the US OFAC has published guidance that paying ransomware actors linked to sanctioned entities can itself be a sanctions violation, regardless of intent. The insurance void is a financial shock. The partial decryption means recovery is still needed. Push the group: what do you tell the board about why you paid?",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "Sources: financial firm paid ransomware demand - FBI involvement reported",
        artifact: {
          type: "email",
          emailFrom: "enforcement@fbi.gov",
          emailTo: "legal@meridianfs.com",
          emailSubject: "NOTICE: Ransomware payment - potential sanctions implications - mandatory cooperation required",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CLO", "CFO", "CISO"],
        expectedKeywords: ["sanctions", "OFAC", "FBI", "insurance", "decryption", "board"],
      },

      // ── INJECT 5: T+75 - Insurance and legal exposure ────────────────────
      {
        id: "rw-i5",
        order: 40,
        title: "Insurance Dispute and Legal Exposure",
        body: "10:00 - Your cyber insurer, Beazley, has sent a formal letter. They are querying whether the exploited VPN vulnerability was on your last penetration test's exceptions list. Your CISO confirms: it was flagged 8 months ago, deprioritised due to resource constraints, and never remediated. If the vulnerability was a known risk, the insurer may deny the claim - approximately £12M in coverage. Separately, a data protection law firm has sent a letter before claim on behalf of 340 affected customers they identified from the dark web posting.",
        facilitatorNotes:
          "The VPN vulnerability on the pen test is the governance failure that underpins everything. It creates: (1) insurance denial risk, (2) D&O liability, (3) regulatory aggravation. This is where the CEO and CLO should be having a very uncomfortable conversation about what the board knew. The 340-customer legal letter will grow - class action risk is real.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "Law firm launches action on behalf of data breach victims - group litigation expected",
        artifact: {
          type: "legal_letter",
          legalCaseRef: "BEZ-2024-POL-9847",
          legalAuthority: "Beazley Insurance - Cyber Claims Division",
        },
        isDecisionPoint: true,
        targetRoles: ["CLO", "CFO", "CEO", "CISO"],
        expectedKeywords: ["pen test", "insurance", "D&O", "class action", "remediation", "disclosure"],
        decisionOptions: [
          {
            key: "A",
            label: "Disclose the pen test finding to insurers proactively - engage external coverage counsel",
            consequence:
              "Insurer acknowledges the disclosure. Coverage counsel advises the exclusion may not apply - the vulnerability was known but not exploited until now. Expensive legal process begins but claim stays alive.",
          },
          {
            key: "B",
            label: "Contest the insurer's query - argue the pen test exception was within acceptable risk tolerance",
            consequence:
              "Insurer initiates formal coverage dispute. Mandiant's report surfaces the pen test finding independently. Legal costs escalate. The dispute becomes public in regulatory filings.",
          },
        ],
      },

      // ── INJECT 6: T+90 - Board escalation ────────────────────────────────
      {
        id: "rw-i6",
        order: 50,
        title: "Board Escalation - Chairman Calls",
        body: "10:30 - Your Chairman calls. Three NEDs have been contacted by major institutional shareholders. An emergency board briefing is demanded within 90 minutes. The Chairman has one direct question: 'Did the board know about any security vulnerabilities that were not remediated?' Two NEDs reviewed and signed off the IT risk register 6 months ago - a register that included the VPN vulnerability as 'medium risk, remediation deferred'. Your stock is now down 6.8%. Trading has been flagged as potentially disorderly by the LSE.",
        facilitatorNotes:
          "This is the D&O moment. Two NEDs may have personal liability. The CEO's answer to the Chairman will define the governance narrative for the next 12 months. The correct answer is full disclosure - but it's personally difficult for the NEDs. Watch whether the group protects individuals or takes a transparent position. The LSE 'disorderly trading' flag means a public announcement may be required.",
        delayMinutes: 0,
        timerMinutes: 15,
        tickerHeadline: "LSE flags disorderly trading in Meridian Financial shares as breach details emerge",
        artifact: {
          type: "email",
          emailFrom: "r.whitmore@meridian-board.com",
          emailTo: "ceo@meridianfs.com",
          emailSubject: "URGENT - Emergency board briefing required within 90 minutes - D&O questions",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CFO", "CLO"],
        expectedKeywords: ["board", "D&O", "NED", "disclosure", "LSE", "liability", "risk register"],
        decisionOptions: [
          {
            key: "A",
            label: "Full transparent board briefing - including the pen test and risk register finding",
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

      // ── INJECT 7: T+105 - Threat actor deadline approaching ──────────────
      {
        id: "rw-i7",
        order: 60,
        title: "48-Hour Mark - Threat Actor Ultimatum",
        body: "11:00 -24 hours have passed since the ransom note. The threat actor has sent a new message: they are publishing a second, larger sample of 8,000 customer records in 4 hours unless payment negotiations begin. Mandiant confirm the threat actor is ALPHV/BlackCat - currently under FBI disruption but still operational. Your recovery team reports core systems will be partially restored in 36 hours. The FCA has made contact - they are aware of the incident and are treating it as a potential operational resilience failure under PS21/3.",
        facilitatorNotes:
          "The FCA angle is serious - PS21/3 (operational resilience policy) requires firms to be able to remain within impact tolerances during severe but plausible scenarios. A 9-day outage almost certainly breaches this. The threat actor's second sample is a pressure tactic. The group must decide: engage or hold? This is also where the CEO needs to make the call on customer notification - waiting any longer risks customers finding out from the dark web before the company.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "FCA confirms investigation into Meridian Financial operational resilience failures",
        artifact: {
          type: "email",
          emailFrom: "supervisory@fca.org.uk",
          emailTo: "ceo@meridianfs.com",
          emailSubject: "FCA - Operational Resilience - PS21/3 - Supervisory Engagement Required",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CISO", "CLO", "CCO"],
        expectedKeywords: ["customer notification", "FCA", "PS21/3", "ALPHV", "publish", "engage"],
        decisionOptions: [
          {
            key: "A",
            label: "Begin customer notification now - do not engage the threat actor further",
            consequence:
              "Customer notifications go out. Call centre overwhelmed within 2 hours -22,000 calls in first hour. Dark web sample becomes less damaging as customers are already informed. FCA notes the proactive notification.",
          },
          {
            key: "B",
            label: "Hold customer notification - attempt to negotiate takedown of the second sample",
            consequence:
              "Negotiators reach the threat actor. They agree to delay the second posting for 12 hours for £500k. A security blogger discovers the second sample independently 6 hours later - before customer notification goes out.",
          },
        ],
      },

      // ── INJECT 8: T+120 - Staff and operational HR crisis ────────────────
      {
        id: "rw-i8",
        order: 70,
        title: "Staff Revolt - Payroll at Risk",
        body: "11:30 - HR has a critical update: payroll systems are among the encrypted servers. 3,200 employees are due to be paid on Friday -72 hours away. Manual payroll processing would take 5 days minimum. Your HR Director has fielded 140 employee queries. Three union representatives have requested an urgent meeting. Separately: two members of the IT team have been identified as potential sources of the FT leak - both are currently in the building.",
        facilitatorNotes:
          "The payroll failure is a direct employee relations crisis that the HR lead must own. There are legal obligations - employees must be paid on time or the company is in breach of contract. Options: emergency manual payroll (expensive, error-prone), short-term advance payments, or banking on recovery within 72 hours (optimistic). The leak investigation: care needed - if the company acts punitively on a suspicion, it creates whistleblowing protection risk.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Staff at breached firm face Friday payroll uncertainty as systems remain down",
        artifact: {
          type: "email",
          emailFrom: "hr@meridianfs.com",
          emailTo: "coo@meridianfs.com",
          emailSubject: "URGENT: Payroll systems encrypted - Friday pay at risk - union contact made",
        },
        isDecisionPoint: true,
        targetRoles: ["COO", "CFO", "CEO"],
        expectedKeywords: ["payroll", "union", "employees", "manual", "advance", "leak investigation"],
        decisionOptions: [
          {
            key: "A",
            label: "Authorise emergency payroll advances - brief staff with an all-hands communication",
            consequence:
              "Bank agrees to advance payroll funding. Emergency payments processed. Staff all-hands reduces panic. Union representatives satisfied. Cost: £340k in emergency processing fees.",
          },
          {
            key: "B",
            label: "Communicate that payroll may be delayed - request staff patience",
            consequence:
              "Union formally threatens industrial action. Employment tribunal complaint filed within 24 hours. Story becomes 'company won't pay staff' alongside the breach story. Significant reputational and legal escalation.",
          },
        ],
      },

      // ── INJECT 9: T+135 - Backdoor discovered ────────────────────────────
      {
        id: "rw-i9",
        order: 80,
        title: "Backdoor Discovered - Recovery Halted",
        body: "Day 2, 09:00 - Recovery is progressing. But your head of technology has found a second, dormant backdoor in the network - the threat actor may still have access. All recovery progress could be undermined if the backdoor is active. Mandiant recommend halting all recovery activity until the backdoor is fully eradicated - adding 24–48 hours. Customer notification emails went out yesterday and generated 31,000 customer contacts. Three national news channels are running the story as their lead business item.",
        facilitatorNotes:
          "The backdoor is the technical sting in the tail. The group needs to authorise the recovery halt - which has real cost - against the pressure to restore service as fast as possible. This is the CISO's call but the CEO needs to back it. The customer contact volume (31,000) is the human reality of the breach - the group should be asked: are you satisfied with how the customer notification was handled?",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "Second backdoor halts Meridian Financial recovery - customers furious as outage enters day two",
        artifact: {
          type: "siem_alert",
          siemAlertId: "SOC-2024-8851",
          siemSeverity: "CRITICAL",
          siemSourceIp: "185.220.101.47 (TOR EXIT NODE)",
          siemEventType: "Dormant C2 Beacon - Active Exfiltration Channel Identified",
        },
        isDecisionPoint: true,
        targetRoles: ["CISO", "CEO", "COO"],
        expectedKeywords: ["threat hunt", "halt recovery", "backdoor", "Mandiant", "eradicate", "C2"],
        decisionOptions: [
          {
            key: "A",
            label: "Halt all recovery - engage specialist threat hunting team to eradicate backdoor first",
            consequence:
              "Correct call. 36-hour delay. Backdoor eradicated. Recovery resumes on clean infrastructure. FCA notes the methodical approach positively in their eventual report.",
          },
          {
            key: "B",
            label: "Continue recovery on unaffected segments - monitor the backdoor while restoring",
            consequence:
              "Threat actor activates the backdoor 18 hours later. Second encryption event - partial - adds 4 more days to recovery. Mandiant later state this was avoidable.",
          },
        ],
      },

      // ── INJECT 10: Day 2 - Regulatory enforcement signals ────────────────
      {
        id: "rw-i10",
        order: 90,
        title: "ICO and FCA Signal Enforcement Intent",
        body: "Day 2, 13:00 - Two regulatory signals arrive simultaneously. The ICO has sent a formal information notice requiring full documentation of the data breach within 14 days - failure to comply carries criminal liability for senior officers. The FCA has formally classified the incident as a 'major operational incident' and is opening an investigation into PS21/3 compliance. Your external legal team estimates potential combined regulatory fines of £18–32M. Credit rating agency Moody's has placed Meridian on 'review for downgrade'.",
        facilitatorNotes:
          "This is the long tail of the crisis becoming real. The group needs to decide: do you fight both regulators, cooperate fully, or try to negotiate? The credit downgrade will affect the cost of capital. The combined fines would be painful but survivable - what's less survivable is a prolonged enforcement battle that keeps the story alive. This is also the moment to discuss: who is accountable? Has anyone been held responsible internally?",
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
            label: "Full cooperation with both regulators - appoint dedicated regulatory liaison team",
            consequence:
              "ICO and FCA both note the cooperative posture. Investigation timeline: 9–12 months. Fine likely in lower range (£8–14M combined). No criminal referral for officers.",
          },
          {
            key: "B",
            label: "Contest the FCA classification - challenge PS21/3 application as unprecedented",
            consequence:
              "FCA escalates to formal enforcement proceedings. Legal costs mount. Story remains live. ICO investigation unaffected. Fine likely in upper range and proceedings extend to 18 months.",
          },
        ],
      },

      // ── INJECT 11: Day 2 - Lessons, accountability, and future ───────────
      {
        id: "rw-i11",
        order: 100,
        title: "The Accountability Question",
        body: "Day 3, 09:00 - Systems are coming back online. The immediate crisis is passing. But the board has convened and has a list of questions: (1) Who is accountable for the unpatched VPN vulnerability? (2) Should the CISO's position be reviewed? (3) What does a credible remediation programme look like for investors and regulators? (4) What do we say to the 1,200 customers whose data has already been published publicly? The CFO presents: total estimated cost of the incident -£28–44M.",
        facilitatorNotes:
          "This is the debrief inject - the wrap-up question set. The facilitator should use this to draw out the group's reflections on their own decisions across the session. Key questions to pose: what was the single decision that made the biggest difference? What would you do differently? Who in the organisation needs to change? This is where the AI report will be most valuable - it will have scored each decision and roleplay.",
        delayMinutes: 0,
        timerMinutes: 15,
        tickerHeadline: "Meridian Financial total breach cost estimated at £28–44M - board accountability review underway",
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
            label: "Commission an independent post-incident review - results to be shared with regulators",
            consequence:
              "Regulators view this as best practice. External review firm engaged. Findings are uncomfortable but credible. Remediation roadmap accepted by ICO as mitigation evidence.",
          },
          {
            key: "B",
            label: "Internal review only - protect commercially sensitive findings",
            consequence:
              "Regulators specifically request the review findings. Failure to provide them is noted. ICO uses the absence of external review as evidence of inadequate governance culture.",
          },
        ],
      },
    ],
  },


  // ─── SCENARIO 2: THE DEEPFAKE CEO ────────────────────────────────────────────
  //
  // Full 3-hour arc across 17 injects. The graph has:
  //   - 4-way divergence at i1   (paths A/B/C/D each get their own narrative inject: i2a-i2d)
  //   - Full convergence at i3   (shared pressures regardless of opening path)
  //   - 2-way re-divergence at i3d (staff-led i4a vs market-led i4b)
  //   - Re-convergence at i4h    (the personal cost - character test, both paths see this)
  //   - Re-convergence at i5     (forensic vindication, 4 options all routing to i6)
  //   - Re-convergence at i6     (copycat + internal leak narrative)
  //   - 4-way divergence at i7   (endgame play - each option leads to a distinct ending)
  //   - 4 distinct endings       (end1=triumph, end2=recovery, end3=diminished, end4=catastrophic)
  //
  // Every decision inject has exactly 4 options. Each option has an optional
  // rank field (1 = best) to surface the designer's intended "right answer"
  // during debrief. Opinion-based options share ranks where there is genuinely
  // no single correct call.
  //
  // Content note: the in-universe video is a deepfake of the CEO making a
  // contemptuous, abusive tirade about staff, clients, and regulators. It is
  // deliberately non-racial - the test is about identity integrity, market
  // integrity, and crisis decision-making, not about handling a racism allegation.
  {
    id: "tpl-deepfake-001",
    title: "The Deepfake CEO",
    description:
      "A hyper-realistic AI-generated video of your CEO making contemptuous, inflammatory statements goes viral at 6am. Branching 17-inject arc with 4 possible endings. Tests crisis comms, legal, identity verification, market integrity, employee welfare, and board governance from first alert to long-term strategic recovery.",
    type: "SOCIAL_MEDIA_CRISIS",
    difficulty: "CRITICAL",
    durationMin: 180,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-10T00:00:00Z",
    coverGradient: "135deg, #1a0a2e 0%, #4a0080 50%, #e8002d 100%",
    roles: ["CEO", "CCO", "CLO", "CISO", "CFO", "HR_LEAD"],
    briefing:
      "You are the senior leadership team of Apex Dynamics, a FTSE 250 technology and professional services company with 8,000 employees globally. It is 06:04 on a Monday morning. Your social media listening tool has just fired an automated alert. A 47-second video of your CEO, posted from an account called @ApexLeaks, is going viral on X. In it, the CEO appears to deliver a contemptuous, abusive tirade: threatening mass layoffs in humiliating terms, disparaging two named enterprise clients by name, boasting about 'burying' regulators, and making crude personal attacks on a rival chief executive. The footage is forensically convincing. Your CEO is asleep, their phone is off, and their EA is trying to reach them. You have minutes before this becomes uncontrollable.",

    injects: [

      // ── ACT 1: THE UNKNOWN ─────────────────────────────────────────────
      // Four-way opening branch. Each option leads to a narrative inject
      // that plays out the consequences of that specific choice before the
      // paths converge again at df-i3.

      // ── INJECT 1: T+0. Video goes viral. Four-way branch. ──────────────
      {
        id: "df-i1",
        order: 0,
        title: "The Video Goes Viral",
        body: "06:04. The video has 340,000 views in 22 minutes and is trending #1 on X under #ApexCEO. Media outlets are running 'developing story' banners. Three FTSE 100 investors have already emailed Investor Relations. Your CEO's personal inbox is being flooded. The footage is forensically convincing: off-the-shelf AI detectors return inconclusive results. Your CEO remains unreachable. The team must decide how to respond before markets open.",
        facilitatorNotes:
          "This IS a deepfake. The CEO has been impersonated as part of a coordinated corporate espionage and short-selling operation - the team does not know this yet. Option C (measured holding statement) is the correct instinct: it buys time without lying and is legally defensible. Option A risks being catastrophically wrong if the video were real. Option B creates a dangerous vacuum. Option D is an interesting curveball - a personal tone from the CEO's family channel that humanises but bypasses process. Key coaching question: what is the cost of being wrong in each direction?",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "VIRAL: 47-second video purportedly showing Apex Dynamics CEO in abusive tirade passes 340,000 views",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "SKY NEWS",
          tvHeadline: "APEX DYNAMICS CEO IN VIRAL SCANDAL - COMPANY YET TO RESPOND",
          tvTicker: "VIRAL: 340K views in 22 minutes. #ApexCEO trending #1. Markets open in 3h.",
          tvReporter: "LIVE - CITY OF LONDON",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CCO", "CLO"],
        expectedKeywords: ["deepfake", "verify", "statement", "legal", "forensic", "holding"],
        decisionOptions: [
          {
            key: "A",
            label: "Issue an immediate denial: 'This video is fabricated', before any forensic confirmation",
            consequence:
              "Statement out in 11 minutes. If the video were real, this would be catastrophic. The gamble pays off on authenticity grounds but the denial is aggressively questioned. A second deepfake of the CFO follows within the hour.",
            rank: 4,
          },
          {
            key: "B",
            label: "Full silence: hold all public statements until forensic verification is complete (2-3 hours)",
            consequence:
              "The vacuum is filled by speculation. Two clients call to suspend contracts. Share price opens down 9.7%. Staff are in visible distress. The legally-safe choice is reputationally expensive.",
            rank: 3,
          },
          {
            key: "C",
            label: "Issue a measured holding statement: 'We are aware and urgently investigating authenticity'",
            consequence:
              "Buys time. Media covers the uncertainty angle without declaring a verdict. Pressure builds but no major errors are made. Forensic firm engaged immediately. CEO reached at 07:20.",
            rank: 1,
          },
          {
            key: "D",
            label: "Let the CEO's EA authorise a short personal statement from the CEO's family account",
            consequence:
              "An unusual, humanising move. It works emotionally but bypasses the comms playbook and exposes the EA and family members to scrutiny. Twitter sentiment warms slightly; legal counsel is furious.",
            rank: 2,
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i2a" },
          { optionKey: "B", nextInjectId: "df-i2b" },
          { optionKey: "C", nextInjectId: "df-i2c" },
          { optionKey: "D", nextInjectId: "df-i2d" },
        ],
      },

      // ── INJECT 2a: Path A narrative. Denial under siege. ───────────────
      {
        id: "df-i2a",
        order: 10,
        title: "Path A: The Denial Is Questioned",
        body: "07:00. Your denial is being picked apart. A tech journalist has enhanced the audio and posted a thread saying it 'passes every AI-detection test I know of'. The @ApexLeaks account has vanished, but not before DMing the video to 22 journalists. An FT reporter is demanding a named spokesperson on the record before 07:30 or the paper will run a piece with the headline 'Denial first, evidence later: the Apex Dynamics playbook'. Sky News now has the story running on a loop.",
        facilitatorNotes:
          "The group has taken a bold position without evidence. Keep them thinking about what they would do if the denial were proven wrong. This inject is a narrative inject - no vote. The facilitator should pressure them on evidence and talking points. All paths converge at df-i3.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "BREAKING: Apex Dynamics denial questioned as tech journalist says video 'passes every detection test'",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "SKY NEWS",
          tvHeadline: "APEX DYNAMICS DENIES VIRAL VIDEO - TECH EXPERTS CHALLENGE CLAIM",
          tvTicker: "DEVELOPING: FT calls for spokesperson on record. Company has issued denial without forensic confirmation.",
          tvReporter: "LIVE - CANARY WHARF",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CCO", "CLO", "CEO"],
        expectedKeywords: ["denial", "FT", "evidence", "position", "forensic"],
      },

      // ── INJECT 2b: Path B narrative. The silence deafens. ──────────────
      {
        id: "df-i2b",
        order: 10,
        title: "Path B: The Silence Deafens",
        body: "07:45. Nearly two hours of silence is being read by the market as confirmation. 240 staff have emailed HR asking for an emergency all-hands. Three of your largest enterprise clients have put morning meetings on hold. The Sunday Times website now leads with 'Apex Dynamics refuses to comment as viral CEO video spreads'. An FT op-ed has just gone live calling for a board statement within the hour. Your CEO is awake, incandescent, and wants to record a personal video from their kitchen 'right now'.",
        facilitatorNotes:
          "Silence has given the market free rein to fill the vacuum. The CEO's raw impulse to go live unprompted is high risk - a single fatigued or defensive word becomes the clip of the day. Coach the group: you can break the silence with a single sentence (internal first, then external) and still honour the forensics process. This inject is a narrative inject - no vote. All paths converge at df-i3.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Apex Dynamics silent two hours as viral video spreads. Share price opens down 9.7%.",
        artifact: {
          type: "slack_thread",
          slackChannel: "#all-hands",
          slackMessages: [
            { author: "Priya Ramesh",    role: "Eng Lead",   time: "07:38", text: "Has anyone heard anything official? The video is everywhere and three of my team have messaged me asking if they should come in today." },
            { author: "Tom Whitfield",   role: "Acct Exec",  time: "07:40", text: "Two of my clients have emailed asking if the meetings this morning are still on. I don't know what to tell them." },
            { author: "Aisha Chowdhury", role: "People Ops", time: "07:42", text: "I am deeply upset by what I've seen. I need to know whether our leadership is taking this seriously. Silence is not a strategy." },
            { author: "Mark Harris",     role: "Senior PM",  time: "07:44", text: "The FT has just published an op-ed calling for the CEO to step aside pending investigation. Is comms planning to respond?" },
            { author: "Dani Bryant",     role: "Designer",   time: "07:45", text: "I love this company. Please, please say something. Anything. My mum saw the video and asked me why I still work here." },
          ],
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CCO", "HR_LEAD"],
        expectedKeywords: ["silence", "internal", "all-hands", "FT", "pressure"],
      },

      // ── INJECT 2c: Path C narrative. The measured path holds. ──────────
      {
        id: "df-i2c",
        order: 10,
        title: "Path C: The Window Holds, Forensics Race",
        body: "07:20. Your measured holding statement is working. Media are covering the uncertainty angle: 'Company investigates viral CEO video'. The CEO has been reached, is calm, and is cooperating. Your CISO has engaged DeepDetect AI, a specialist forensic firm. They have found early AI-generated audio artefacts. ETA for full confirmation: 75 minutes. But a campaigning journalist has now published a thread accusing the company of running a 'cover-up playbook'. 180 staff have emailed HR asking what to do today. A second deepfake - this one of your CFO announcing a fake £2.4B acquisition - has appeared on a financial forum.",
        facilitatorNotes:
          "Path C is the most defensible position, legally and reputationally. The group is doing well. The challenge now is internal comms (employees need something) and the CFO video complication. The journalist's 'cover-up' narrative is dangerous: the CCO needs a proactive strategy, not just reactive holding statements. This inject is a narrative inject - no vote. All paths converge at df-i3.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Apex Dynamics investigation underway as authenticity of viral video is disputed. CFO video now also circulating.",
        artifact: {
          type: "email",
          emailFrom: "forensics@deepdetect.ai",
          emailTo: "ciso@apexdynamics.com",
          emailSubject: "URGENT: Preliminary findings. AI-generated audio artefacts detected in CEO video.",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "CLO", "CCO", "HR_LEAD"],
        expectedKeywords: ["forensic", "employee comms", "CFO video", "internal communication", "cover-up narrative"],
      },

      // ── INJECT 2d: Path D narrative. The family statement gamble. ──────
      {
        id: "df-i2d",
        order: 10,
        title: "Path D: The Family Channel Lands",
        body: "07:15. The CEO's EA has posted a 180-character statement from the CEO's verified family account: 'I am aware of a video circulating that purports to show me. It is not me. I am safe, at home, with my family, and cooperating with my company and the authorities.' Reaction is split. Sympathetic journalists are leading with 'CEO breaks silence from family home'. Hostile ones are calling it 'a bizarre sidestep of corporate process'. The CLO is furious because the statement was never cleared with legal. The CCO is processing it in real-time. It has 840,000 views in 15 minutes.",
        facilitatorNotes:
          "This is an unorthodox but emotionally potent move. It humanises the CEO and breaks the vacuum with a low-stakes format. It also bypasses the playbook and exposes the CEO's family. The CLO's anger is real - this could have been a disaster if the statement had been one word different. Push the group: is this a one-off, or are they going to double down on the family-channel tone? How do they now fold the CLO back in? This inject is a narrative inject - no vote. All paths converge at df-i3.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Apex Dynamics CEO breaks silence via family social account: 'It is not me'",
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
        expectedKeywords: ["family account", "personal", "process", "legal", "humanise"],
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
        title: "Convergence: Market Open and the CEO Returns",
        body: "08:15. Whatever path you took, the same three pressures have landed simultaneously. Share price is down 7.2% at open on volume five times normal. Three institutional investors are demanding a call with the Chairman before midday. The BBC, Sky News, FT and Bloomberg all have the story leading their markets coverage. 340 staff have emailed HR asking for an all-hands. Your CEO is finally fully briefed and operational. Forensics ETA: 45 minutes. The group now has to choose what to do in the next ten minutes.",
        facilitatorNotes:
          "This is the convergence point. Whatever happened in Act 1, the group now faces the same set of simultaneous pressures. This inject is a narrative inject - the decision itself lives in df-i3d. Use the timer to create urgency. The CEO being 'finally operational' is important: the group is no longer waiting on the principal, and any failure to act is now on the room.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Apex Dynamics shares fall 7.2% at open as institutional investors demand chairman call",
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

      // ── INJECT 3d: Priority decision. 4 options, re-diverges. ──────────
      {
        id: "df-i3d",
        order: 22,
        title: "Priority Under Pressure",
        body: "08:20. The CEO turns to the room: 'We have ten minutes before the BBC piece drops. Who do we talk to first?' On the table: staff (all-hands from the CEO), the national broadcaster (direct interview or statement), institutional investors (via Chairman), or a full handover of the crisis response to your external PR firm. Every option has a cost. The CCO is watching the Twitter trend line. The HR lead is watching their inbox refresh every 30 seconds.",
        facilitatorNotes:
          "Staff-first (A) is almost always the right move in a reputational crisis: long-term trust compounds faster than short-term share price damage. Media-first (B) is defensible if the group genuinely has a message ready - but often they don't. Investors-first (C) is a classic financial-crisis answer that feels 'professional' but optically cold. External-PR handover (D) is a form of abdication and usually produces a generic, corporate, tin-eared response. Options A/B route to df-i4a (staff-led narrative); C/D route to df-i4b (market-led narrative).",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Apex Dynamics leadership team prioritises response as institutional investors press for contact",
        artifact: {
          type: "email",
          emailFrom: "newsdesk@bbc.co.uk",
          emailTo: "press@apexdynamics.com",
          emailSubject: "BBC Business: Deadline 08:45 for on-the-record response on Apex CEO video",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "HR_LEAD", "CCO", "CFO"],
        expectedKeywords: ["all-hands", "BBC", "investors", "chairman", "priority", "internal", "PR firm"],
        decisionOptions: [
          {
            key: "A",
            label: "Staff first: CEO records a two-minute all-hands video and sends it company-wide",
            consequence:
              "Morale stabilises within the hour. Union reps hold off a public statement. Investor calls later in the morning land on firmer internal ground. The long game is being played well.",
            rank: 1,
          },
          {
            key: "B",
            label: "Media first: CEO gives a tight 90-second on-the-record statement to the BBC",
            consequence:
              "The BBC piece is balanced. The CEO comes across as composed. But 240 staff later say 'we heard it from the BBC before we heard it from our CEO' and the internal trust cost lingers.",
            rank: 2,
          },
          {
            key: "C",
            label: "Investors first: Chairman-led call with the top three institutional holders",
            consequence:
              "Institutional panic is defused. Share price holds. But the BBC story runs without a company voice, and staff see the leadership team treating the share price as the priority over their wellbeing.",
            rank: 3,
          },
          {
            key: "D",
            label: "Hand the whole response over to the external PR firm until forensics are back",
            consequence:
              "The PR firm issues a polished but generic statement. It holds the line but does not humanise. Staff read it as corporate and distant. The CCO later notes this was the moment the company 'outsourced its own voice'.",
            rank: 4,
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
        title: "Path: Staff-Led Recovery",
        body: "08:45. The internal comms landed well. A two-minute video from the CEO has been watched by 6,200 of 8,000 staff within thirty minutes. The Slack mood has shifted from panic to cautious solidarity. External pressure is still intense: the BBC story is running, the FT has a long read in progress, and the CFO deepfake is now spreading on finance forums. But your people are holding together. A senior engineer has just posted a widely-shared thread defending the CEO's integrity. A client who had cancelled a meeting has rebooked.",
        facilitatorNotes:
          "Staff-led paths look slow on paper but they compound. This narrative inject is meant to show the group that the choice they made is paying off in ways they cannot always measure. Be careful not to overplay the victory - the CFO deepfake and the forensics question still loom. This is a breather, not a resolution.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Apex Dynamics staff rally behind CEO as internal video circulates; CFO video complication emerges",
        artifact: {
          type: "slack_thread",
          slackChannel: "#all-hands",
          slackMessages: [
            { author: "Priya Ramesh",    role: "Eng Lead",   time: "08:42", text: "Just watched the CEO video. That was a human response. I am not going anywhere. If any of my team need to talk today my door is open." },
            { author: "Tom Whitfield",   role: "Acct Exec",  time: "08:43", text: "Two of my three clients have just reconfirmed this morning's meetings. One said: 'we just wanted to see how you were going to handle it'." },
            { author: "Mark Harris",     role: "Senior PM",  time: "08:44", text: "Engineering and product are both holding together. If the forensics come back soon we'll be fine." },
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
        title: "Path: Market-Led Recovery",
        body: "08:45. The institutional investor calls went well. Share price has ticked back up to -5.4% from the open low. The BBC ran the story with a brief company statement from your PR firm. Bloomberg picked up the line 'Apex Dynamics: fully investigating; no staff action in contemplation'. But your internal metrics are worrying: the Slack #all-hands channel has gone quiet in a bad way, 40 more staff have opened sick-day requests, and the union rep is drafting a statement that begins 'the leadership has prioritised the market over its people'. The CFO deepfake has just appeared on a finance forum.",
        facilitatorNotes:
          "Market-led paths look decisive in the moment but can corrode trust. This narrative inject is meant to show the group that share-price stabilisation has come at a cost. The union rep drafting a statement is the key detail: in the next few hours, the group will have to win back the internal room. Do not let the group conclude they made the wrong call - this is a trade-off, not a failure.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Apex Dynamics shares recover partially after chairman-led investor call; BBC runs PR firm statement",
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

      // ── INJECT 4h: The personal cost. Character test. Both paths see this.
      {
        id: "df-i4h",
        order: 35,
        title: "The Personal Cost",
        body: "08:55. The CEO's EA steps in quietly and closes the door. The CEO's 14-year-old daughter has just been sent home from school after classmates played the video to her in the corridor and filmed her reaction. She is in tears in the car. The CEO's phone is ringing. At the same moment, the Head of HR reports that a colleague in Finance has asked to take the day off - she is 'not sure she wants to come back to an office where people might look at her and think of that video'. The CEO turns to the room and asks, quietly: 'what do I do?'",
        facilitatorNotes:
          "This inject is deliberately not a vote. It is a character test. The purpose is to surface the human dimensions that crisis playbooks almost always underweight. Well-run teams will pause and acknowledge this. Poorly-run teams will treat it as a distraction. Push the group: how does the CEO show up for their family AND the company in the next ten minutes? What does the HR Lead do for the colleague in Finance? This is where leadership either earns or loses long-term trust. Both Act 2 paths (staff-led and market-led) land here.",
        delayMinutes: 0,
        timerMinutes: 8,
        tickerHeadline: "Reports emerge of Apex Dynamics staff distress as deepfake video circulates on school social media",
        artifact: {
          type: "slack_thread",
          slackChannel: "dm: HR Lead to CEO",
          slackMessages: [
            { author: "HR Lead",  role: "direct message", time: "08:52", text: "Confidential. A colleague in Finance has just come to me in tears. She said: 'I know it's not real, but I don't know how to walk past people today who might think it is.' She's asked for the day off. I've said yes. I think we need to do something more." },
            { author: "HR Lead",  role: "direct message", time: "08:53", text: "Also: your EA has just told me about your daughter. I'm so sorry. Whatever you need from me, I'm here." },
            { author: "HR Lead",  role: "direct message", time: "08:54", text: "And one more thing: two members of my own team have been crying at their desks this morning. This crisis has a human weight you will feel more over the next 24 hours." },
          ],
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "HR_LEAD", "CCO"],
        expectedKeywords: ["empathy", "family", "staff welfare", "personal", "leadership"],
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
        title: "Forensic Vindication: Both Videos Confirmed Deepfakes",
        body: "09:30. DeepDetect AI have just delivered the final report. Both the CEO and CFO videos are AI-generated. Voice synthesis fingerprints, facial mapping artefacts, identical infrastructure. The technical report is publishable. More significantly, your CISO has separately uncovered something explosive: 840,000 Apex Dynamics put options were quietly purchased through three nominee accounts in the 48 hours before the videos dropped. Notional value approximately £18M. The trading pattern points to a coordinated short-selling attack, possibly tied to a corporate intelligence firm operating out of an offshore cluster. You now hold the vindication. The question is how you spend it.",
        facilitatorNotes:
          "This is the vindication moment. The forensic report is unambiguously good news, but the short-selling angle is genuinely difficult: it is potentially criminal, it is incendiary if announced publicly, and going loud could compromise an FCA or SFO investigation. The four options offered are not equally strong. B (publish forensics + private FCA brief) is the textbook correct call: it maintains the narrative win, gives investigators what they need without tipping the attacker, and protects the company from accusations of selective disclosure. A is dramatic and tempting but risks the FCA telling you to stand down publicly. C is reckless. D is too cautious and wastes the moment. Push the group on the difference between what they know and what they can responsibly say. Whatever they choose, all four branches converge to df-i6, where they discover that the attacker had inside help.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "BREAKING: Forensic firm confirms Apex Dynamics CEO and CFO videos as AI-generated deepfakes",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "SKY NEWS",
          tvHeadline: "APEX DYNAMICS: FORENSIC FIRM CONFIRMS CEO AND CFO VIDEOS ARE AI DEEPFAKES",
          tvTicker: "SKY NEWS BUSINESS - APEX DYNAMICS DEEPFAKE - SHARES RECOVER 4% IN PRE-OPEN TRADING - FORENSIC REPORT TO BE PUBLISHED - FCA REPORTEDLY MONITORING UNUSUAL OPTIONS ACTIVITY - CEO TO MAKE STATEMENT",
          tvReporter: "Ian Whitfield, Sky News Business, City of London",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CCO", "CISO"],
        expectedKeywords: ["publish", "forensic", "short selling", "FCA", "law enforcement", "narrative"],
        decisionOptions: [
          {
            key: "A",
            label: "Publish the forensics AND publicly accuse a coordinated short-selling attack at a press conference",
            consequence:
              "Maximum drama. The story flips overnight: 'Apex vindicated, attackers exposed'. But within two hours the FCA contacts the CLO formally, asking the company to cease all public speculation as it may compromise their investigation. The CEO has to walk back. A small but real credibility cost.",
            rank: 4,
          },
          {
            key: "B",
            label: "Publish the forensics in full; brief the FCA privately on the short-selling evidence and let them lead",
            consequence:
              "The FCA is grateful. The investigation accelerates. Media coverage is overwhelmingly positive: 'company vindicated by independent forensics'. The attacker still believes they are unobserved. Strongest possible position going into Day 2.",
            rank: 1,
          },
          {
            key: "C",
            label: "Brief two trusted financial journalists off-record before publication to control the angle",
            consequence:
              "The FT and Bloomberg run favourable pieces within an hour. The narrative is yours. But by Day 2 the FCA is asking whether the off-record briefing constituted selective disclosure under MAR. A second-order legal headache.",
            rank: 3,
          },
          {
            key: "D",
            label: "Publish only the technical forensics; say nothing publicly about the short-selling angle at all",
            consequence:
              "Safe. Defensible. But journalists notice the absence and start asking 'who benefited from this attack?' independently. Within 24 hours half the financial press is speculating without your facts. You lose control of the most compelling part of the story.",
            rank: 2,
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i6" },
          { optionKey: "B", nextInjectId: "df-i6" },
          { optionKey: "C", nextInjectId: "df-i6" },
          { optionKey: "D", nextInjectId: "df-i6" },
        ],
      },

      // ── INJECT 6: Copycat + internal leak (narrative convergence) ───────
      {
        id: "df-i6",
        order: 45,
        title: "The Picture Sharpens: A Rival Is Hit, And A Door Was Left Open",
        body: "11:45. Two things land in the same fifteen minutes. First, your CISO's contact at Helix Corp - a major rival - calls in confidence: a less-polished deepfake of their CEO has just begun circulating on Reddit. Same voice-cloning signature, same distribution vector, same offshore infrastructure. Helix's Head of Security is asking, off the record, whether you can share your forensic approach. Second, while reviewing access logs, your CISO's team has identified the source of the leaked investor day footage: a personal encrypted drive belonging to a senior communications manager who is currently in the building. The footage was copied 10 days ago. The two pieces snap together: the attacker had inside help, and they are now hunting other targets. The room goes very quiet.",
        facilitatorNotes:
          "This is the narrative pivot from 'we are the victim' to 'we are part of a wider attack with an internal dimension'. There is no decision point here on purpose - the group needs a beat to absorb both shocks before the endgame. Push them informally: how do they want to handle Helix? (The right answer is via NCSC, never directly.) How do they want to handle the comms manager? (Preserve evidence first, brief the police Economic Crime Unit, do NOT confront yet.) These are not voted on, but they should colour what the group chooses in df-i7. If the group rushes a confrontation here, flag it - that is the kind of mistake that ruins an otherwise strong endgame.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Second FTSE 250 firm reportedly hit by similar AI deepfake attack as common signature emerges",
        artifact: {
          type: "slack_thread",
          slackChannel: "dm: CISO to CEO + CLO",
          slackMessages: [
            { author: "CISO", role: "direct message", time: "11:42", text: "Helix Corp just called. Their CEO has a deepfake circulating on Reddit. Same voice-clone fingerprint as ours. Same TOR cluster. Their head of security wants our forensic approach off the record." },
            { author: "CISO", role: "direct message", time: "11:43", text: "Separately. We've found the leak source for the investor day footage. It came off a personal encrypted drive belonging to a senior comms manager. Copied 10 days ago. They are in the office today." },
            { author: "CISO", role: "direct message", time: "11:44", text: "I want to brief the NCSC on the Helix link and the police Economic Crime Unit on the internal leak. I do NOT want to confront the comms manager yet - we will lose the device evidence the moment they realise. Please advise." },
            { author: "CISO", role: "direct message", time: "11:45", text: "One more thing. If we coordinate properly with Helix and the NCSC, this stops being 'Apex got attacked'. It becomes 'Apex helped expose a market disinformation operation'. That is a different story." },
          ],
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "CLO", "HR_LEAD", "CEO"],
        expectedKeywords: ["NCSC", "Helix", "internal leak", "Economic Crime Unit", "preserve evidence", "coordinated attack"],
      },

      // ── INJECT 7: Endgame decision. 4 options. 4 distinct endings. ──────
      {
        id: "df-i7",
        order: 50,
        title: "The Endgame: How Do You Want This Story To End?",
        body: "Day 2, 16:00. The first 36 hours are over. The forensics are public. The Helix link is being quietly worked through NCSC channels. The internal leak investigation is sealed with the police. Share price has clawed back to -3.1% from the worst point. The narrative is moving in your favour but it is not yet decided. Three things have just landed on your desk simultaneously. The government's AI Safety Institute has invited the CEO to chair a new working group on AI disinformation in financial markets. Your law firm has drafted a pre-emptive defamation lawsuit against the offshore intelligence firm believed to be behind the attack. And your PR firm has prepared a 'minimal disclosure, recovery posture' brief that they say will let the company quietly move on within six weeks. The CEO turns to the room and asks the question that has been hanging over every decision today: 'how do you want this story to end?'",
        facilitatorNotes:
          "This is the endgame and it is the most important decision of the exercise. The four options are not just about the next 24 hours - they are about who Apex Dynamics chooses to be after the crisis. A (transparency + AI working group) is the high-credibility long game: it converts the attack into industry leadership and is the path most likely to leave the company materially stronger than before. B (quiet internal recovery) is the safest legal path and produces a competent recovery, but Apex remains defined by the attack rather than the response. C (defensive legal posture, minimal disclosure) is the path of fear: it protects the company from short-term scrutiny but bleeds long-term trust. D (pre-emptive lawsuit) is the path of vengeance and is almost always wrong: it gives the attacker a public platform, exposes the company's evidence prematurely, and risks looking vindictive. Push the group hard. The 'right answer' is A, but the choice between A and B is genuinely strategic and reasonable people disagree. C and D have substantial costs that the group should be made to articulate before voting.",
        delayMinutes: 0,
        timerMinutes: 15,
        tickerHeadline: "Apex Dynamics weighs response strategy as AI Safety Institute extends invitation; legal options under review",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "FT LIVE",
          tvHeadline: "APEX DYNAMICS: FROM TARGET TO TEST CASE - WHAT WILL THE BOARD DO NEXT?",
          tvTicker: "FT LIVE - APEX DYNAMICS RECOVERS TO -3.1% - GOVERNMENT AI SAFETY INSTITUTE EXTENDS INVITATION - HELIX CORP CONFIRMS SIMILAR ATTACK - LEGAL ACTION REPORTEDLY UNDER CONSIDERATION - INDUSTRY WATCHES",
          tvReporter: "Helena Marsh, Financial Times Live",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CCO", "CFO", "CISO"],
        expectedKeywords: ["AI Safety Institute", "transparency", "lawsuit", "recovery", "leadership", "long game"],
        decisionOptions: [
          {
            key: "A",
            label: "Lead from the front: accept the AI Safety Institute role, publish a full incident account, brief the industry",
            consequence:
              "The high-credibility path. Apex becomes the case study other companies reference. Long game won. (Routes to END_TRIUMPH.)",
            rank: 1,
          },
          {
            key: "B",
            label: "Quiet competence: focus on internal remediation, brief peers privately, let the story fade",
            consequence:
              "The safe path. Operationally sound. But Apex never quite owns the narrative. (Routes to END_RECOVERY.)",
            rank: 2,
          },
          {
            key: "C",
            label: "Defensive posture: minimal disclosure, no public engagement, follow the PR firm's recovery brief",
            consequence:
              "The fearful path. Short-term safe, long-term corrosive. The attack defines the company. (Routes to END_DIMINISHED.)",
            rank: 3,
          },
          {
            key: "D",
            label: "Counter-attack: file the pre-emptive defamation lawsuit, publicly name the intelligence firm",
            consequence:
              "The path of vengeance. Almost always wrong. Gives the attacker a platform and exposes evidence. (Routes to END_CATASTROPHIC.)",
            rank: 4,
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-end1" },
          { optionKey: "B", nextInjectId: "df-end2" },
          { optionKey: "C", nextInjectId: "df-end3" },
          { optionKey: "D", nextInjectId: "df-end4" },
        ],
      },

      // ── ENDING 1: TRIUMPH (Path A) ──────────────────────────────────────
      {
        id: "df-end1",
        order: 60,
        title: "Ending: The Industry Test Case",
        body: "Six weeks later. The CEO has chaired the inaugural meeting of the AI Safety Institute working group on financial-markets disinformation. The Apex Dynamics incident report - 47 pages, technical appendix, full timeline - is being studied at three business schools and is the second most-downloaded document on the AISI website. Share price closed yesterday at +1.8% on the year, ahead of the FTSE 250. The Helix Corp CEO joined the working group as deputy chair. The offshore intelligence firm behind the attack has been formally identified by the FCA and is the subject of a joint UK-US enforcement action. The comms manager is awaiting trial. Internally, staff retention is at a five-year high and the company has just hired its largest-ever graduate intake on the back of the case. At the FT's Person of the Year shortlist event last night, the Apex CEO was named one of three runners-up. The citation read: 'showed that integrity, when paired with disclosure, compounds.'",
        facilitatorNotes:
          "This is the best possible ending and exists to validate the long-game choice. Use it in debrief to ask: what made this possible? The answer is usually a combination of (a) the early staff-first instinct in df-i3d, (b) the disciplined handling of forensics in df-i5, (c) the patient handling of the internal leak in df-i6, and (d) the courage of the endgame choice. Make sure the group sees the through-line.",
        delayMinutes: 0,
        timerMinutes: 8,
        tickerHeadline: "Apex Dynamics CEO named FT Person of the Year runner-up after landmark AI disinformation response",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "SKY NEWS",
          tvHeadline: "APEX DYNAMICS CEO NAMED FT PERSON OF THE YEAR RUNNER-UP - 'INTEGRITY WHEN PAIRED WITH DISCLOSURE COMPOUNDS'",
          tvTicker: "SKY NEWS - APEX DYNAMICS SHARES +1.8% YTD - AI SAFETY INSTITUTE WORKING GROUP CONVENES - COMMS MANAGER AWAITING TRIAL - JOINT UK-US ENFORCEMENT ACTION ANNOUNCED - GRADUATE HIRING AT FIVE-YEAR HIGH",
          tvReporter: "Ian Whitfield, Sky News Business",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CCO", "CISO", "HR_LEAD"],
        expectedKeywords: ["transparency", "leadership", "long game", "industry", "trust"],
      },

      // ── ENDING 2: RECOVERY (Path B) ─────────────────────────────────────
      {
        id: "df-end2",
        order: 60,
        title: "Ending: Quiet Competence",
        body: "Six weeks later. The deepfake story has faded from the front pages. Apex Dynamics' share price is back to within 1.2% of pre-attack levels. The internal remediation programme is on track: new media security policy, new endpoint controls, a quiet doubling of the CISO's budget. The comms manager has been arrested and charged. The Helix Corp link was worked discreetly through NCSC channels and a joint advisory was issued to the FTSE 350 last week without naming either company. Staff are largely past it - although exit interview data shows a small but persistent uptick in 'concerns about how the company handled communication during the crisis'. The CEO declined the AI Safety Institute invitation. The chair was taken by the CFO of a rival firm, who is now the public face of the issue. At the next board meeting, an independent director asks gently whether Apex 'might have done more with the moment'. There is a long silence before the chairman moves to the next agenda item.",
        facilitatorNotes:
          "This is the 'good but not great' ending. It is not a failure - the company recovered and the operational outcomes are sound. But the group should sit with the closing image: the silent boardroom. The cost of choosing safety over leadership is not a number on a P&L; it is a missed opportunity that will quietly shape the company's identity for years. Use this in debrief to ask: was it worth it? Some groups will defend B vigorously. That is a legitimate position. Make sure they articulate why.",
        delayMinutes: 0,
        timerMinutes: 8,
        tickerHeadline: "Apex Dynamics shares recover to within 1.2% of pre-attack levels as company completes internal remediation",
        artifact: {
          type: "stock_chart",
          stockTicker: "APEX.L",
          stockCompanyName: "Apex Dynamics plc",
          stockOpenPrice: 482.40,
          stockCurrentPrice: 476.60,
          stockChangePercent: -1.20,
          stockVolume: "8.2M",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CFO", "CISO", "HR_LEAD"],
        expectedKeywords: ["recovery", "remediation", "missed opportunity", "quiet competence"],
      },

      // ── ENDING 3: DIMINISHED (Path C) ───────────────────────────────────
      {
        id: "df-end3",
        order: 60,
        title: "Ending: The Long Shadow",
        body: "Six weeks later. The minimal-disclosure strategy has held the line technically, but it has not held the room. Share price is still down 6.4% on the year, lagging the FTSE 250 by nine points. Two institutional investors have publicly downgraded their position citing 'concerns about communications maturity'. A Sunday Times Business feature ran last weekend titled 'The company that survived a deepfake attack and still lost'. Internally, three senior executives have resigned in the last month, all citing some version of 'I joined a company I was proud of and I am no longer sure what we stand for'. The comms manager case is going to court next month and the trial is expected to bring fresh media attention - none of it framed by Apex. The Helix Corp CEO took the AI Safety Institute role and gave the keynote at the Davos cyber resilience panel last week. He referred to 'one peer in our sector that chose to look away'. Everyone in the room knew who he meant.",
        facilitatorNotes:
          "This is the 'fear ending' and it is meant to bite. The company is not destroyed, but it is materially worse off, and worst of all, the damage is invisible from the inside until it is too late. Use this in debrief to teach the lesson that bad PR advice is often the most internally persuasive: it sounds prudent, it minimises immediate risk, and it lets everyone in the room go home tonight feeling safe. The cost shows up later, in resignations, in investor calls, in the slow erosion of identity. The Helix CEO line at Davos is the punchline.",
        delayMinutes: 0,
        timerMinutes: 8,
        tickerHeadline: "Sunday Times: 'The company that survived a deepfake attack and still lost' - Apex Dynamics analysis",
        artifact: {
          type: "news_headline",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CCO", "CFO"],
        expectedKeywords: ["minimal disclosure", "long shadow", "identity", "trust erosion", "missed opportunity"],
      },

      // ── ENDING 4: CATASTROPHIC (Path D) ─────────────────────────────────
      {
        id: "df-end4",
        order: 60,
        title: "Ending: The Counter-Attack That Backfired",
        body: "Six weeks later. The pre-emptive defamation lawsuit was filed on Day 3 with a triumphant press conference. Within 48 hours the offshore intelligence firm had hired a London QC and counter-filed for malicious prosecution. Their statement, drafted by a former tabloid editor, framed Apex as 'a company so unable to cope with scrutiny that it sues the messenger'. The phrase trended for a week. Discovery in the lawsuit forced disclosure of internal communications from Day 1, including several messages where executives speculated openly about whether elements of the original video might have been 'closer to the truth than we are admitting'. Those messages were leaked. The FT ran them on the front page. The FCA, who had been working a clean market manipulation case, has now opened a parallel investigation into Apex's own conduct. Share price closed yesterday at -22% on the year. Two non-executive directors have resigned. The chairman is rumoured to be next. The CEO's contract is up for renewal in three months and the proxy advisors have already issued a 'recommend against' note. At an emergency board meeting last night, the CLO who advised against the lawsuit said only one thing before leaving the room: 'I told you so.'",
        facilitatorNotes:
          "This is the worst ending and it is meant to be cautionary. Pre-emptive litigation in a reputational crisis is almost always a mistake: it gives the attacker a free platform, forces evidence into discovery, and makes the company look defensive and afraid. The 'closer to the truth than we are admitting' detail is deliberately ambiguous - it does not mean the video was real, it means executives were privately worrying, and that worry leaks badly under discovery. Use this ending in debrief to teach the difference between a strong response and an aggressive one. Strong responses compound trust. Aggressive responses cost it. If the group chose D, do not shame them for it - the option was on the table for a reason - but make them articulate exactly which assumptions led them there.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Apex Dynamics shares close -22% as FCA opens parallel investigation following lawsuit disclosure leak",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "BBC NEWS",
          tvHeadline: "APEX DYNAMICS LAWSUIT BACKFIRES - INTERNAL MESSAGES LEAKED - SHARES DOWN 22% - CHAIRMAN UNDER PRESSURE",
          tvTicker: "BBC NEWS BUSINESS - APEX DYNAMICS -22% YTD - FCA OPENS PARALLEL INVESTIGATION - TWO NEDS RESIGN - PROXY ADVISORS RECOMMEND AGAINST CEO CONTRACT RENEWAL - LAWSUIT COUNTER-FILED",
          tvReporter: "Marcus Reilly, BBC News, Westminster",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CLO", "CFO", "CCO"],
        expectedKeywords: ["lawsuit", "backfire", "discovery", "FCA", "reputational collapse", "defensive"],
      },
    ],
  },
];
