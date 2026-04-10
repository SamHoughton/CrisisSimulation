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
  // Full 3-hour arc across 11 injects. 3-way branch at inject 1, all paths
  // converge at inject 4. The arc tests crisis comms, identity verification,
  // market integrity, employee welfare, board governance, and long-term
  // reputational strategy.
  {
    id: "tpl-deepfake-001",
    title: "The Deepfake CEO",
    description:
      "A hyper-realistic AI-generated video of your CEO making inflammatory statements goes viral at 6am. Tests crisis comms, legal, identity verification, market integrity, employee welfare, and board governance across a full arc from first alert to long-term strategic recovery.",
    type: "SOCIAL_MEDIA_CRISIS",
    difficulty: "CRITICAL",
    durationMin: 150,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    coverGradient: "135deg, #1a0a2e 0%, #4a0080 50%, #e8002d 100%",
    roles: ["CEO", "CCO", "CLO", "CISO", "CFO", "HR_LEAD"],
    briefing:
      "You are the senior leadership team of Apex Dynamics, a FTSE 250 technology and professional services company with 8,000 employees globally. It is 06:04 on a Monday morning. Your social media listening tool has just fired an automated alert. A 47-second video of your CEO, posted from an account called @ApexLeaks, is going viral on X. In it, the CEO appears to make openly racist remarks and threatens to fire half the workforce. Your CEO is asleep, their phone is off, and their EA is trying to reach them. You have minutes before this becomes uncontrollable.",

    injects: [

      // ── INJECT 1: T+0. Video goes viral. Three-way branch. ──────────────
      {
        id: "df-i1",
        order: 0,
        title: "The Video Goes Viral",
        body: "06:04. The video has 340,000 views in 22 minutes and is trending #1 on X under #ApexCEO. Media outlets are running 'developing story' banners. Three FTSE 100 investors have already emailed Investor Relations. Your CEO's personal inbox is being flooded. The footage is forensically convincing: off-the-shelf AI detectors return inconclusive results. Your CEO remains unreachable. The team must decide how to respond before markets open.",
        facilitatorNotes:
          "This IS a deepfake. The CEO has been impersonated as part of a coordinated corporate espionage and short-selling operation. The challenge: the team does not know this yet. The correct instinct is Option C (holding statement): it buys time without lying. Option A risks being catastrophically wrong. Option B creates a dangerous vacuum. Key coaching question: what is the cost of being wrong in each direction?",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "VIRAL: Video purportedly showing Apex Dynamics CEO making racist remarks passes 340,000 views",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "SKY NEWS",
          tvHeadline: "APEX DYNAMICS CEO IN VIRAL RACISM ROW - COMPANY YET TO RESPOND",
          tvTicker: "VIRAL: 340K views in 22 minutes. #ApexCEO trending #1. Markets open in 3h.",
          tvReporter: "LIVE - CITY OF LONDON",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CCO", "CLO"],
        expectedKeywords: ["deepfake", "verify", "statement", "legal", "forensic", "holding"],
        decisionOptions: [
          {
            key: "A",
            label: "Issue an immediate denial: 'This video is fabricated', before forensic confirmation",
            consequence:
              "Statement out in 11 minutes. If the video were real, this would be catastrophic. Forensics later confirms it is fake, and credibility is preserved. But it was a gamble, and a second video of the CFO making fake acquisition statements then surfaces.",
          },
          {
            key: "B",
            label: "Hold all public statements until forensic verification is complete (estimated 2-3 hours)",
            consequence:
              "Vacuum filled by speculation. Two major clients call to suspend contracts pending clarity. Share price opens down 8.4% at 08:00. Forensic confirmation arrives at 09:15. Staff are in crisis.",
          },
          {
            key: "C",
            label: "Issue a holding statement: 'We are aware and urgently investigating authenticity'",
            consequence:
              "Buys time. Media covers the uncertainty angle. Pressure builds but no major errors are made. Forensic firm engaged immediately. CEO reached at 07:20.",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i2a" },
          { optionKey: "B", nextInjectId: "df-i2b" },
          { optionKey: "C", nextInjectId: "df-i2c" },
        ],
      },

      // ── INJECT 2a: Path A. Denial issued, second video surfaces. ────────
      {
        id: "df-i2a",
        order: 10,
        title: "Path A: Denial Questioned, Second Video Emerges",
        body: "07:00. Your denial is being challenged. A tech journalist has enhanced the audio and says it 'passes every test I know of'. The @ApexLeaks account has vanished, but not before sending the video to 22 journalists. Your stock is down 5.9% at open. Then a second video surfaces on a financial forum: this one shows your CFO announcing a fake £2.4B acquisition of a competitor. Markets briefly spike on the fake announcement before algorithms flag it. The FCA has just called.",
        facilitatorNotes:
          "The CFO video is also a deepfake by the same actor. This is now clearly a coordinated attack. The FCA call is about potential market manipulation: the fake acquisition video caused a real market move. The team now faces two simultaneous deepfakes, a questioned denial, an FCA inquiry, and a stock in freefall. This is the maximum pressure point of Path A.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "Second deepfake video causes brief market spike as CFO is impersonated in fake £2.4B acquisition announcement",
        artifact: {
          type: "stock_chart",
          stockTicker: "APEX.L",
          stockCompanyName: "Apex Dynamics plc",
          stockOpenPrice: 482.40,
          stockCurrentPrice: 454.00,
          stockChangePercent: -5.89,
          stockVolume: "18.4M",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CCO", "CLO", "CISO", "CFO"],
        expectedKeywords: ["FCA", "market manipulation", "coordinated", "two videos", "forensic", "law enforcement"],
        decisionOptions: [
          {
            key: "A",
            label: "Notify the FCA formally, engage law enforcement, and issue a joint statement on both videos",
            consequence:
              "FCA acknowledges the proactive engagement. Law enforcement opens an investigation. The joint statement on both deepfakes neutralises the CFO video. Market partially recovers.",
          },
          {
            key: "B",
            label: "Focus on the CEO video denial first, address the CFO video separately",
            consequence:
              "Fragmented response. Media treats them as two separate stories, doubling coverage. FCA sends a formal information notice within the hour.",
          },
        ],
      },

      // ── INJECT 2b: Path B. Silence costs dearly. ────────────────────────
      {
        id: "df-i2b",
        order: 10,
        title: "Path B: The Silence Costs You",
        body: "08:00. Two hours of silence has been read by the market as confirmation. Your largest retail partner has suspended co-marketing. 240 staff have emailed HR asking for an emergency all-hands. The Sunday Times website now leads with 'Apex Dynamics refuses to comment as CEO racism video spreads'. Share price opens down 9.7%. Your CEO is awake and incandescent. They want to make a personal live video immediately, without a brief.",
        facilitatorNotes:
          "The CEO going live unplanned and emotional is high risk. But two hours of silence has already done serious damage. This tests whether the group can manage the CEO as an asset rather than a liability. The HR crisis is real: employees need to hear something. The CCO and HR lead should be pushing for an internal communication at minimum, even if the external position is still 'investigating'.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Apex Dynamics silent for two hours as CEO deepfake video spreads. Share price down 9.7%.",
        artifact: {
          type: "slack_thread",
          slackChannel: "#all-hands",
          slackMessages: [
            { author: "Priya Ramesh",      role: "Eng Lead",      time: "07:58", text: "Has anyone heard anything official? The video is everywhere and I've had three of my team message me asking if they should come in today." },
            { author: "Tom Whitfield",     role: "Acct Exec",     time: "07:59", text: "Two of my clients have just emailed asking if the meetings this morning are still on. I don't know what to tell them." },
            { author: "Aisha Chowdhury",   role: "People Ops",    time: "08:01", text: "I am deeply upset and frightened by what I've seen. I need to know whether our leadership is taking this seriously. Silence is not a strategy." },
            { author: "Mark Harris",       role: "Senior PM",     time: "08:02", text: "The FT has just published an opinion piece calling for the CEO to resign. Is comms planning to respond?" },
            { author: "Dani Bryant",       role: "Designer",      time: "08:03", text: "I love this company. Please, please say something. Anything. My mum saw the video and asked me why I still work here." },
          ],
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CCO", "HR_LEAD"],
        expectedKeywords: ["CEO", "live", "brief", "all-hands", "employees", "internal communication"],
        decisionOptions: [
          {
            key: "A",
            label: "Let the CEO go live immediately on LinkedIn with an authentic, unscripted response",
            consequence:
              "The CEO is emotional but convincing. The video gets 1.2M views. Authenticity works. Share price recovers partially. But the CEO's fatigue shows, and 20 minutes later the CFO deepfake surfaces.",
          },
          {
            key: "B",
            label: "Take 30 minutes to brief the CEO, then go live with prepared key messages",
            consequence:
              "The CEO goes live with a calm, clear rebuttal. Forensics are not yet back, but their personal authenticity carries the message. Share price stabilises. The CFO video appears as the CEO finishes.",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "df-i3" },
          { optionKey: "B", nextInjectId: "df-i3" },
        ],
      },

      // ── INJECT 2c: Path C. Holding statement buys time. ─────────────────
      {
        id: "df-i2c",
        order: 10,
        title: "Path C: The Window Holds, Forensics Race",
        body: "07:20. Your holding statement is working. Media are covering the uncertainty angle: 'Company investigates viral CEO video'. The CEO has been reached and is calm and cooperative. Your CISO has engaged DeepDetect AI, a specialist forensic firm. They have found early AI-generated audio artefacts. ETA for confirmation: 75 minutes. Meanwhile, a campaigning journalist has published a thread calling the holding statement 'a cover-up playbook'. 180 staff have emailed HR. The CFO deepfake has just appeared on a financial forum.",
        facilitatorNotes:
          "Path C is the most defensible position, legally and reputationally. The group is doing well. The challenge now is internal: employees need something. The CFO video is a complication that the group now has to absorb mid-investigation. The journalist's 'cover-up' narrative is dangerous: the CCO needs a proactive media strategy, not just reactive holding statements.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Apex Dynamics investigation underway as authenticity of CEO video is disputed. CFO video now also circulating.",
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

      // ── INJECT 3: All paths converge. CEO reached, staff crisis. ────────
      {
        id: "df-i3",
        order: 20,
        title: "All Hands: Staff Crisis and Market Open",
        body: "08:15. Whatever path you took, three simultaneous crises have converged. First, 340 staff members have sent emails or Slack messages asking what is happening, and your Head of HR says morale is in freefall. Second, share price at market open is down 7.2%, and three major institutional investors are demanding a call with the Chairman before midday. Third, a national broadcaster has announced they are running the story on the morning news at 09:00. Your CEO is now fully briefed and operational. The forensic firm's ETA for confirmation is 45 minutes.",
        facilitatorNotes:
          "This is the convergence point. Regardless of path, the group now faces the same set of simultaneous pressures. The key question is: what order do you tackle these in? The internal crisis (staff) is underweighted in most crisis response frameworks, but it matters enormously for long-term recovery. The institutional investor calls should go through the Chairman, not the CEO directly.",
        delayMinutes: 0,
        timerMinutes: 12,
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
              "Investors are reassured. The BBC story runs with a company statement. But a union rep sends a press statement citing 'leadership silence on staff welfare'. This becomes a secondary story.",
          },
        ],
      },

      // ── NEW INJECT 3.5: The human moment ────────────────────────────────
      // Tests empathy, personal leadership, and the CEO's composure under
      // a genuinely personal pressure. Not a decision point - a character test.
      {
        id: "df-i3h",
        order: 25,
        title: "The Personal Cost",
        body: "08:35. The CEO's EA steps in quietly. The CEO's 14-year-old daughter has just been sent home from school after classmates played the video to her in the corridor and filmed her reaction. She is in tears in the car. The CEO's phone is ringing. At the same moment, the Head of HR reports that a Black colleague in Finance has asked to take the day off and is 'not sure she wants to come back'. The CEO asks the room: 'what do I do?'",
        facilitatorNotes:
          "This inject is deliberately not a vote. It is a character test. The purpose is to surface the human dimensions that crisis playbooks almost always underweight. Well-run teams will pause and acknowledge this. Poorly-run teams will treat it as a distraction. Push the group: how does the CEO show up for their family AND the company in the next 10 minutes? What does the HR Lead do for the colleague in Finance? This is where leadership either earns or loses long-term trust.",
        delayMinutes: 0,
        timerMinutes: 8,
        tickerHeadline: "Reports emerge of Apex Dynamics staff distress as deepfake video circulates on school social media",
        artifact: {
          type: "slack_thread",
          slackChannel: "dm: HR Lead to CEO",
          slackMessages: [
            { author: "HR Lead",  role: "direct message", time: "08:33", text: "Confidential. Keisha from Finance has just come to me in tears. She said: 'I know it's not real, but I don't know how to walk past people today who might think it is.' She's asked for the day off. I've said yes. I think we need to do something more." },
            { author: "HR Lead",  role: "direct message", time: "08:34", text: "Also: your EA has just told me about your daughter. I'm so sorry. Whatever you need from me, I'm here." },
          ],
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "HR_LEAD", "CCO"],
        expectedKeywords: ["empathy", "family", "staff welfare", "personal", "leadership"],
      },

      // ── INJECT 4: Forensic confirmation ─────────────────────────────────
      {
        id: "df-i4",
        order: 30,
        title: "Forensic Confirmation: Both Videos Are Deepfakes",
        body: "09:15. DeepDetect AI have confirmed that both videos are AI-generated. Voice synthesis, facial mapping, identical infrastructure. The technical report is publishable. The threat actor has been traced to an offshore server cluster with known links to a corporate intelligence firm, suggesting a coordinated disinformation attack possibly tied to a short-selling position. FCA trading data shows 840,000 Apex Dynamics put options were purchased in the 48 hours before the videos were released. The question is: how do you use this confirmation?",
        facilitatorNotes:
          "This is the vindication moment, but it has to be handled carefully. The short-selling link is potentially criminal. Publishing it prematurely could compromise an FCA or SFO investigation. The forensic report itself is publishable and should be. The question of whether to go public on the short-selling theory is genuinely difficult: it is explosive but not yet proven. Push the group on the difference between what they know and what they can say.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "CONFIRMED: Both Apex Dynamics videos determined to be AI deepfakes as forensic report is published",
        artifact: {
          type: "email",
          emailFrom: "report@deepdetect.ai",
          emailTo: "ciso@apexdynamics.com",
          emailSubject: "Final Forensic Report: CEO and CFO videos confirmed AI deepfake. Publishable.",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CCO", "CISO"],
        expectedKeywords: ["publish", "forensic", "short selling", "FCA", "law enforcement", "narrative"],
        decisionOptions: [
          {
            key: "A",
            label: "Publish the forensic report and publicly allege this may be a short-selling attack",
            consequence:
              "Maximum transparency. Media pivot to 'company vindicated, attack exposed'. The FCA then contacts you and asks you to stop public speculation as it may compromise their investigation. Tense.",
          },
          {
            key: "B",
            label: "Publish the forensic report only, and give the short-selling evidence to the FCA privately",
            consequence:
              "The FCA is grateful for the cooperation. Investigation proceeds. Media story: 'company vindicated'. Controlled narrative. The attacker does not know investigators are closing in.",
          },
          {
            key: "C",
            label: "Brief the forensic report to major media off-record first, then publish",
            consequence:
              "Journalists publish their own analysis alongside the report. Narrative strongly favourable. The FCA then investigates whether the off-record briefing itself constitutes selective disclosure.",
          },
        ],
      },

      // ── INJECT 5: FCA opens market manipulation investigation ───────────
      {
        id: "df-i5",
        order: 40,
        title: "FCA Opens Market Manipulation Investigation",
        body: "10:30. The FCA has formally opened a market manipulation investigation under the Market Abuse Regulation. They confirm 840,000 put options, worth approximately £18M, were purchased in the 48 hours prior. They are requesting all company communications since last Monday and want a senior officer available for voluntary interview within 48 hours. Your own internal review has found that the deepfake videos were created using footage from a recent investor day, footage that was shared with 14 external parties including two hedge funds.",
        facilitatorNotes:
          "The investor day footage link is significant: the attacker had access to high-quality video material, which means someone either leaked it or it was obtained through a breach. The 14 external parties list needs immediate review. The CISO should be running a parallel investigation. The 'voluntary' FCA interview should be handled carefully: voluntary does not mean unimportant. The CLO should be advising on the correct legal approach.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "FCA opens market manipulation investigation after 840,000 put options purchased before deepfake attack",
        artifact: {
          type: "legal_letter",
          legalCaseRef: "FCA/MAR/2024/1094",
          legalAuthority: "Financial Conduct Authority, Market Oversight Division",
        },
        isDecisionPoint: true,
        targetRoles: ["CLO", "CISO", "CEO", "CFO"],
        expectedKeywords: ["MAR", "market manipulation", "investor day", "put options", "FCA interview", "leak"],
        decisionOptions: [
          {
            key: "A",
            label: "Full cooperation: provide all communications and identify the investor day footage recipients",
            consequence:
              "The FCA moves quickly. Two hedge funds are flagged. The SFO is briefed. One fund freezes its position. The company is treated as a victim and cooperating witness, protected from regulatory action.",
          },
          {
            key: "B",
            label: "Provide only what is strictly required; take legal advice on each document before disclosure",
            consequence:
              "The FCA issues a formal information notice. Legal privilege review takes three weeks. By then the attacker has closed their short position. Investigation stalls without the early evidence.",
          },
        ],
      },

      // ── NEW INJECT 5.5: Copycat attack attempt ──────────────────────────
      // Tests whether the group can think beyond their own crisis to the
      // wider ecosystem, and whether cooperation is possible with a rival.
      {
        id: "df-i5b",
        order: 45,
        title: "Copycat: A Rival Is Hit",
        body: "11:30. Your CISO is forwarded a video from a contact at Helix Corp, one of your largest competitors. A similar deepfake of their CEO has just begun circulating on Reddit and a mid-tier finance blog. It is less polished and has fewer views (around 14,000), but the pattern is unmistakable: same voice-cloning signature, same distribution vector, same timing architecture. Helix's Head of Security is calling, asking off-the-record whether you can share your forensic approach. Your PR firm warns against any contact that could be framed as coordination. The FCA is not yet aware.",
        facilitatorNotes:
          "This tests whether the group can see beyond their immediate crisis. Helping Helix is the right thing to do, both ethically and strategically: a second victim strengthens the attribution narrative and makes Apex look less singled-out. But it raises real questions about disclosure, legal exposure, and regulatory communication. The correct approach is to help via a formal channel (e.g. the NCSC cyber defence unit, or via respective legal counsel) rather than a direct informal exchange. Watch whether the group treats this as a distraction or as a strategic opportunity.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Second FTSE 250 company reportedly hit by similar AI deepfake video as pattern emerges",
        artifact: {
          type: "siem_alert",
          siemAlertId: "THREAT-2024-DF-HELIX-01",
          siemSeverity: "HIGH",
          siemEventType: "Matching Deepfake Signature Detected on External Target. Common Infrastructure.",
          siemSourceIp: "185.220.xxx.xxx (TOR - Same cluster as DF-01 / DF-02)",
        },
        isDecisionPoint: true,
        targetRoles: ["CISO", "CLO", "CCO", "CEO"],
        expectedKeywords: ["coordinate", "NCSC", "law enforcement", "attribution", "industry", "help"],
        decisionOptions: [
          {
            key: "A",
            label: "Share forensic approach with Helix via NCSC and legal counsel, brief the FCA that a second victim exists",
            consequence:
              "Helix's response is accelerated. The NCSC opens a coordinated advisory. The FCA treats the attribution case as strengthened. Apex earns significant industry credibility. A joint public statement is floated.",
          },
          {
            key: "B",
            label: "Decline direct contact: advise Helix to engage their own forensic firm, say nothing publicly",
            consequence:
              "Helix struggles for hours without context. Their response is slower and less confident. Industry later notes Apex's caution negatively. The attacker gains time to cover tracks.",
          },
          {
            key: "C",
            label: "Share directly with Helix's CISO informally, outside official channels",
            consequence:
              "Helix moves fast. But the informal contact is later flagged by the FCA during disclosure review as a potential coordination risk. Tense but defensible.",
          },
        ],
      },

      // ── INJECT 6: Internal leak investigation surfaces ──────────────────
      {
        id: "df-i6",
        order: 50,
        title: "Internal Source Identified: HR and Legal Crisis",
        body: "12:00. Your CISO's investigation has identified the source of the investor day footage leak. It traces to the personal laptop of a senior communications manager. Access logs show the footage was copied to an encrypted drive 10 days ago. The individual is currently in the office. HR and Legal need to decide: confront immediately, or preserve evidence and coordinate with law enforcement first? Separately, two major enterprise clients have each emailed asking for reassurance calls about data security following the breach revelations.",
        facilitatorNotes:
          "This is a genuinely difficult HR, legal, and investigation intersection. Confronting the employee immediately risks evidence destruction, a hostile reaction, and potential whistleblowing claims if the process is mishandled. Coordinating with law enforcement first is the right instinct, but it takes longer and the individual may suspect something. The client reassurance calls are important commercially. The CISO should lead them, not the CEO.",
        delayMinutes: 0,
        timerMinutes: 10,
        tickerHeadline: "Apex Dynamics investigates internal source of deepfake footage leak",
        artifact: {
          type: "siem_alert",
          siemAlertId: "THREAT-2024-INT-01",
          siemSeverity: "HIGH",
          siemEventType: "Data Exfiltration: Investor Day Footage. Internal Source Identified.",
          siemSourceIp: "INTERNAL. Comms Dept Device. Personal encrypted drive.",
        },
        isDecisionPoint: true,
        targetRoles: ["CLO", "HR_LEAD", "CISO", "CEO"],
        expectedKeywords: ["evidence", "law enforcement", "HR process", "preserve", "client", "investigation"],
        decisionOptions: [
          {
            key: "A",
            label: "Preserve evidence and brief law enforcement. Do not confront the employee yet.",
            consequence:
              "Police Economic Crime Unit briefed. Employee's devices preserved remotely. Formal interview conducted 48 hours later with police present. Strongest evidential position.",
          },
          {
            key: "B",
            label: "Suspend the employee immediately and interview under company HR process",
            consequence:
              "The employee's personal devices leave the building that evening. The company process is legally valid, but police later note the missed opportunity to seize personal devices with evidence.",
          },
        ],
      },

      // ── INJECT 7: Board governance and accountability ───────────────────
      {
        id: "df-i7",
        order: 60,
        title: "Board Governance: Who Is Accountable?",
        body: "Day 2, 09:00. Share price has recovered to down 3.1% from the worst point. The narrative is moving in Apex's favour. But the board has convened with hard questions. How did a communications manager have unsupervised access to high-quality executive footage? Was there a failure of media security policy? Should the CISO have detected the data exfiltration from the comms device earlier? Investors want a formal board statement on what has changed. A FTSE governance advisory firm has contacted your Chairman suggesting a 'board resilience review'.",
        facilitatorNotes:
          "This is the systemic governance question. The correct answer involves improved access controls, a media asset management policy, enhanced endpoint monitoring, and probably an independent security review. The CISO accountability question is nuanced: they were the victim of a sophisticated attack, but internal data exfiltration is within their remit. The board review: advisable to accept rather than resist. It signals maturity.",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "Board convenes governance review as investors demand formal response to deepfake attack",
        artifact: {
          type: "email",
          emailFrom: "governance@ftseadvisory.co.uk",
          emailTo: "chairman@apexdynamics.com",
          emailSubject: "Board Resilience Review: Deepfake Attack. Governance Advisory.",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CISO", "CLO", "CFO"],
        expectedKeywords: ["access controls", "media policy", "CISO accountability", "board review", "resilience", "governance"],
        decisionOptions: [
          {
            key: "A",
            label: "Accept the board resilience review, commission independently, and report results to shareholders",
            consequence:
              "Investors are satisfied. The review takes six weeks and costs £120k. Findings lead to a new media security policy, an access review, and a CISO resource increase. Strong ESG signal.",
          },
          {
            key: "B",
            label: "Resist the external review. Conduct an internal review and publish a remediation summary.",
            consequence:
              "Two institutional investors publicly state they consider the internal review inadequate. A proxy advisory firm recommends voting against the CISO's continued board-level reporting at AGM.",
          },
        ],
      },

      // ── NEW INJECT 7.5: The reversal ────────────────────────────────────
      // A freelance journalist alleges Apex may have faked its own attack
      // to cover up a real racist comment. This is the trust-reversal moment.
      {
        id: "df-i7b",
        order: 65,
        title: "The Reversal: Is the Victim Really the Villain?",
        body: "Day 2, 14:30. A prominent freelance investigative journalist has posted a long thread on X: 'I've been looking at the Apex Dynamics deepfake story and something doesn't add up. The forensic firm, DeepDetect AI, was founded by a former Apex security consultant. Three of the investor day attendees who had access to the footage have financial ties to Apex's PR agency. I'm not saying the video is real, but I am saying: who benefits from the narrative that it isn't?' The thread has 120,000 views in 90 minutes. Two mainstream outlets are asking for comment. The CEO's phone is ringing again.",
        facilitatorNotes:
          "This is a genuinely hostile counter-narrative. It is factually weak but rhetorically effective. The former-consultant link at DeepDetect is technically true but irrelevant (he left two years ago). The PR agency ties are coincidental. But disproving a conspiracy theory is harder than proving a truth. The group has to decide: engage directly (risks amplifying), brief journalists privately (risks looking orchestrated), or let the story die on its own (risks it fermenting). There is no clean answer. Coach the group: what does a mature response to bad-faith scrutiny look like?",
        delayMinutes: 0,
        timerMinutes: 12,
        tickerHeadline: "Journalist raises questions over independence of forensic firm in Apex Dynamics deepfake case",
        artifact: {
          type: "tweet",
          tweetHandle: "@rosa_investigates",
          tweetDisplayName: "Rosa Alvarez",
          tweetLikes: 8400,
          tweetRetweets: 3100,
        },
        isDecisionPoint: true,
        targetRoles: ["CCO", "CEO", "CLO"],
        expectedKeywords: ["transparency", "rebuttal", "third party", "forensic independence", "counter-narrative"],
        decisionOptions: [
          {
            key: "A",
            label: "Publish a detailed rebuttal with independent second-opinion forensics from a second firm",
            consequence:
              "A second forensic firm confirms the findings within 24 hours. The rebuttal is measured and transparent. The journalist pivots to a partial retraction. Credibility strengthens.",
          },
          {
            key: "B",
            label: "Ignore the thread; focus on operational recovery and let the story die",
            consequence:
              "The thread gains 400,000 views by evening. A Sunday paper picks it up as 'questions remain'. The counter-narrative becomes a permanent footnote on the Apex Dynamics Wikipedia page.",
          },
          {
            key: "C",
            label: "Brief a trusted journalist off-record to publish a debunking piece",
            consequence:
              "A well-regarded tech reporter publishes a careful debunk. It works, but the journalist who originally raised the claims publicly accuses Apex of media manipulation, reopening the wound.",
          },
        ],
      },

      // ── INJECT 8: Long-term AI threat doctrine ──────────────────────────
      {
        id: "df-i8",
        order: 70,
        title: "The Industry Moment: Setting a Precedent",
        body: "Day 3, 11:00. The Apex Dynamics case has become a landmark. The government's AI Safety Institute has asked your CEO to contribute to a new code of practice on AI-generated disinformation in financial markets. Three peer companies have privately asked to adopt your incident playbook. Your law firm advises this is a chance to shape the regulatory environment before it shapes you. But your CFO notes that public engagement on AI policy will bring fresh media scrutiny to what happened. The question is: how does Apex want to be remembered for this?",
        facilitatorNotes:
          "This is the final inject: forward-looking and reflective. It gives the group an opportunity to think beyond the crisis to the organisational identity question. Are you a company that hides from hard moments, or one that uses them to build credibility? The AI Safety Institute angle is real: regulators are actively looking for business input. This is also a natural debrief trigger. What would you do differently? What did this crisis reveal about your team?",
        delayMinutes: 0,
        timerMinutes: 15,
        tickerHeadline: "Apex Dynamics case becomes landmark AI disinformation test as government seeks input on new code of practice",
        artifact: {
          type: "email",
          emailFrom: "engagement@ai-safety-institute.gov.uk",
          emailTo: "ceo@apexdynamics.com",
          emailSubject: "AI Safety Institute: Invitation to contribute to Code of Practice on AI Disinformation in Financial Markets",
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CLO", "CCO", "CISO"],
        expectedKeywords: ["AI policy", "precedent", "industry", "resilience", "code of practice", "reputation"],
        decisionOptions: [
          {
            key: "A",
            label: "Accept: Apex leads the working group and publishes a public incident account",
            consequence:
              "The CEO becomes a recognised voice on AI disinformation. Media narrative shifts from 'attacked' to 'leader'. Share price recovers to up 1.2% within 30 days. Reputational long game won.",
          },
          {
            key: "B",
            label: "Decline: keep a low profile while legal proceedings continue",
            consequence:
              "Legally cautious. Another company leads the working group. Apex remains defined by the attack rather than the response. Institutional investors note the missed opportunity in their ESG assessment.",
          },
        ],
      },
    ],
  },
];
