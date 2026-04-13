import type { Scenario } from "@/types";

export const SUPPLY_CHAIN_SCENARIO: Scenario =
  {
    id: "tpl-supply-chain-001",
    title: "The Trusted Vendor",
    description:
      "Your cloud payroll vendor calls at 07:22 on a Monday: they've been breached. Your tenant data — 620,000 employee records across 140 client organisations — is confirmed exfiltrated. You are simultaneously victim, processor, and attack vector. Branching 19-inject arc with 4 score-routed endings. Tests vendor management, GDPR dual-role obligations, regulatory triage, commercial negotiation under duress, and the impossible question: cut the vendor and nobody gets paid, or stay and trust the provider that just failed you.",
    type: "SUPPLY_CHAIN",
    difficulty: "CRITICAL",
    durationMin: 180,
    isTemplate: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-13T00:00:00Z",
    coverGradient: "135deg, #0a0a12 0%, #0d2818 40%, #E82222 100%",
    roles: ["CEO", "CISO", "CFO", "CLO", "COO", "HR_LEAD"],
    briefing:
      "You are the executive leadership team of Ashworth & Lyle plc, a FTSE 250 UK outsourcing and professional services group with 12,000 staff. You process HR and payroll for 140 client organisations — from FTSE retailers to NHS trusts — serving 620,000 employees through a cloud platform called PeopleCore. It is 07:22 on a Monday morning. PeopleCore's CISO is on the phone to yours. Their environment has been compromised. Your tenant data is confirmed affected. Over the next five days you will discover that you are not just a victim — you are the vector. Every client whose people you pay is now exposed because of a vendor you chose, onboarded, and trusted. You will be judged on what you did at 07:22, and on every call after.",

    injects: [

      // ── ACT 1: THE VENDOR CALL ─────────────────────────────────────────
      // Four-way opening branch. Each option leads to a narrative inject
      // that plays out the consequences before re-converging at sc-i2v.

      // ── INJECT 1: 07:22 - The first vendor call ────────────────────────
      {
        id: "sc-i1",
        order: 0,
        title: "Vendor Breach Notification: PeopleCore",
        body: "07:22, Monday. PeopleCore's CISO is on the line with yours. Their SIEM detected bulk data staging and exfiltration from their multi-tenant HR platform over the past 11 days. Ashworth & Lyle's tenant is confirmed affected. The threat actor — tracked as 'Brass Badger', a financially-motivated group — had read access to the full payroll dataset: names, NI numbers, bank sort codes and account numbers, salaries, home addresses, emergency contacts. 620,000 records across all 140 client tenants. PeopleCore has engaged CrowdStrike. They are requesting TLP:AMBER — no public disclosure yet. They have not notified the ICO. Your CISO needs an instruction.",
        facilitatorNotes:
          "Opening decision. Tests whether the team's instinct is technical containment (A), executive escalation to the vendor (B), board governance (C), or passive waiting (D). A is the textbook answer — isolate the integration, capture forensic state. B is understandable but costs time. C is premature but gets the governance clock right. D is the worst — burning time while the vendor stalls.",
        delayMinutes: 0,
        timerMinutes: 5,
        tickerHeadline: "Markets open: FTSE 250 flat, no sector alerts",
        artifact: {
          type: "email",
          emailFrom: "j.whitfield@peoplecore.io",
          emailTo: "ciso@ashworthlyle.com",
          emailSubject: "URGENT / TLP:AMBER — Security Incident Notification",
        },
        isDecisionPoint: true,
        targetRoles: ["CISO", "CEO", "CLO"],
        expectedKeywords: ["isolate", "SSO", "forensics", "vendor", "containment", "ICO"],
        recapLine: "opened with {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Activate full IR — kill the SSO federation to PeopleCore, image the integration servers, engage our own IR firm",
            consequence: "Textbook response. Stops any ongoing exfiltration through your systems, captures forensic state, and demonstrates to regulators that you acted immediately. Costs nothing but the temporary loss of payroll platform access.",
            rank: 1,
            recapFragment: "an immediate technical isolation and forensic capture",
          },
          {
            key: "B",
            label: "Call PeopleCore's CEO directly — demand full scope, written timeline, and containment evidence before we act",
            consequence: "Reasonable executive instinct but costs time. While you're on the phone demanding answers, the SSO integration remains live. PeopleCore's CEO will be evasive — they delayed notification by 72 hours already.",
            rank: 2,
            recapFragment: "a direct CEO-to-CEO demand for scope and proof",
          },
          {
            key: "C",
            label: "Brief the board chair immediately — this is a material risk event requiring governance oversight before operational decisions",
            consequence: "Gets the governance clock right and demonstrates board-level awareness, but the technical environment remains uncontained while you brief upward. The board chair will ask 'what have you done?' and the answer is 'called you.'",
            rank: 3,
            recapFragment: "an immediate board escalation before any operational response",
          },
          {
            key: "D",
            label: "Wait for PeopleCore's formal written notification — we need their incident report before we can assess our exposure",
            consequence: "The worst option. PeopleCore already delayed 72 hours. Their written notification may be days away, or may never come in the form you need. Meanwhile, the SSO integration remains live and the GDPR clock is ticking from the moment your CISO took this call.",
            rank: 4,
            recapFragment: "waiting for the vendor's formal written report",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "sc-i2a" },
          { optionKey: "B", nextInjectId: "sc-i2b" },
          { optionKey: "C", nextInjectId: "sc-i2c" },
          { optionKey: "D", nextInjectId: "sc-i2d" },
        ],
      },

      // ── INJECT 2A: Isolation Complete ──────────────────────────────────
      {
        id: "sc-i2a",
        order: 10,
        title: "Isolation Complete, But the Data Already Left",
        body: "Your team kills the SSO federation to PeopleCore within 18 minutes. SIEM confirms no active exfiltration from your own environment — the integration was read-only and the threat actor never pivoted into your infrastructure. Good news ends there. CrowdStrike's preliminary timeline shows Brass Badger had access to PeopleCore's platform for 11 days. Your payroll data was staged and exfiltrated in a single batch on Day 6. You contained your side cleanly — the horse bolted from their stable a week ago. Your HR Director is asking whether the 12,000 Ashworth & Lyle employees whose bank details are now in threat actor hands need to be told. Your CLO is asking about the other 608,000.",
        facilitatorNotes:
          "Best-case narrative branch. The team isolated quickly and have clean forensic evidence of their response. The question now shifts from 'are we still leaking?' to 'what do we owe 620,000 people whose data left through a vendor we chose?' Converges to sc-i2v.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "Ashworth & Lyle shares unchanged in early trading",
        artifact: {
          type: "siem_alert",
          siemAlertId: "ALY-IR-2026-0041",
          siemSeverity: "HIGH",
          siemSourceIp: "10.40.1.200 (PeopleCore SSO Gateway)",
          siemEventType: "Federation terminated — all PeopleCore SAML assertions revoked",
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "CLO", "HR_LEAD"],
        expectedKeywords: ["contained", "exfiltrated", "Day 6", "bank details", "notification"],
        branches: [
          { optionKey: "_", nextInjectId: "sc-i2v" },
        ],
      },

      // ── INJECT 2B: The CEO Call ────────────────────────────────────────
      {
        id: "sc-i2b",
        order: 10,
        title: "The CEO Call: Worse Than Expected",
        body: "PeopleCore's CEO, Marcus Gale, is defensive and evasive. Under pressure he admits they discovered the breach 72 hours ago but delayed notification to 'complete their investigation'. Their IR firm found evidence of staging activity across all 140 client tenants — Ashworth & Lyle is one of the larger ones. He cannot confirm whether data was exfiltrated, only that the threat actor had 'persistent read access to the production datastore'. He asks you not to notify the ICO yet because 'it would be premature and could trigger a market reaction that hurts us both.' Your CLO is listening on the call. She is writing one word on a notepad and holding it up: GDPR.",
        facilitatorNotes:
          "Second-best narrative branch. The team got useful intelligence from the call — they know about the 72-hour delay, the scope across all tenants, and PeopleCore's attempt to suppress notification. But time was spent talking instead of containing. The SSO integration was live for the duration of this call. Converges to sc-i2v.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "PeopleCore status page shows 'Planned Maintenance' — no explanation",
        artifact: { type: "default" },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CLO", "CISO"],
        expectedKeywords: ["delayed", "72 hours", "read access", "GDPR", "ICO", "suppress"],
        branches: [
          { optionKey: "_", nextInjectId: "sc-i2v" },
        ],
      },

      // ── INJECT 2C: The Board Chair ─────────────────────────────────────
      {
        id: "sc-i2c",
        order: 10,
        title: "The Board Chair's First Question",
        body: "The board chair, Dame Helen Ashworth, listens for ninety seconds and asks one question: 'Are we controller or processor for this data?' The answer is both — controller for your own 12,000 employees, processor for your 140 clients' 608,000 employees. 'Then we have two separate GDPR clocks running,' she says. 'For our own people, the 72 hours started when your CISO picked up the phone. For the client data, each of those 140 organisations is the controller — they need to know so they can start their own clocks. Have you killed the integration yet?' You have not. 'Do that. Then get me an emergency board call for 14:00 with the CLO and a timeline.'",
        facilitatorNotes:
          "Third-best narrative branch. The governance instinct was right but the board chair immediately identified the gap: why haven't you contained yet? The team gets a masterclass in dual-role GDPR obligations but lost time. The SSO integration was live for the entire briefing. Converges to sc-i2v.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "Ashworth & Lyle: 'Strong H1 outlook' — analyst note from last week",
        artifact: { type: "default" },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CLO", "CFO"],
        expectedKeywords: ["controller", "processor", "72 hours", "dual", "GDPR", "kill integration"],
        branches: [
          { optionKey: "_", nextInjectId: "sc-i2v" },
        ],
      },

      // ── INJECT 2D: The Written Notice That Doesn't Come ────────────────
      {
        id: "sc-i2d",
        order: 10,
        title: "The Written Notice That Doesn't Come",
        body: "Two hours pass. No formal written notification from PeopleCore. At 09:30, their status page updates to 'Planned Maintenance' on the HR data platform — no mention of a security incident. Your SIEM team notices the PeopleCore API endpoints returning 503s — they are taking systems offline without telling you. Your CCO's phone buzzes: a journalist from the Financial Times has sent a LinkedIn message asking about 'a significant data breach at a major payroll provider affecting FTSE-listed companies.' Meanwhile, the SSO integration to PeopleCore is still live. The GDPR clock has been running since 07:22. You have done nothing.",
        facilitatorNotes:
          "Worst-case narrative branch. The team waited passively and lost two hours. PeopleCore is going dark, the press are circling, and the SSO integration — the one thing that was within their control — is still live. The facilitator should let this sting. Converges to sc-i2v.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "PeopleCore status page: 'Planned Maintenance' — clients report payroll portal offline",
        artifact: { type: "default" },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CISO", "CCO", "CEO"],
        expectedKeywords: ["waited", "journalist", "SSO", "live", "GDPR", "clock"],
        branches: [
          { optionKey: "_", nextInjectId: "sc-i2v" },
        ],
      },

      // ── ACT 2: THE CASCADE ─────────────────────────────────────────────
      // All paths converge. The question shifts from "what happened?" to
      // "who do we tell, and in what order?"

      // ── INJECT 2V: The Notification Question ───────────────────────────
      {
        id: "sc-i2v",
        order: 20,
        title: "09:45 - The Notification Question",
        body: "09:45. Regardless of your opening move, the picture is now clear: the breach is real, the data is gone, and PeopleCore is being evasive about timelines. Your CLO convenes the room.\n\n'We have two separate GDPR obligations running in parallel. As controller for our own 12,000 employees, Article 33 requires us to notify the ICO within 72 hours of becoming aware — and that clock started at 07:22 this morning. As processor for 140 client organisations, Article 33(2) requires us to notify each controller without undue delay so they can meet their own 72-hour obligations. We also have contractual notification clauses in most of those DPAs — some as short as 24 hours. And one of those clients is an NHS trust with mandatory DSPT reporting. We cannot do everything at once. Who goes first?'",
        facilitatorNotes:
          "Convergence decision. Tests the team's GDPR understanding and their instinct for prioritisation under multiple competing obligations. A (ICO first) is the textbook answer — demonstrates good faith and starts the formal clock cleanly. B (clients first) is operationally smart but risks the ICO hearing about it second-hand. C (employees first) is empathetic but doesn't address the legal obligations. D (wait) is the worst — burning the clock while hoping for better information.",
        delayMinutes: 0,
        timerMinutes: 5,
        tickerHeadline: "GDPR Article 33: 72-hour notification clock — ICO enforcement actions up 34% YoY",
        artifact: {
          type: "email",
          emailFrom: "CLO@ashworthlyle.com",
          emailTo: "exec-committee@ashworthlyle.com",
          emailSubject: "PRIVILEGED — Dual GDPR Notification Obligations: Timeline & Priority",
        },
        isDecisionPoint: true,
        targetRoles: ["CLO", "CEO", "CISO", "COO"],
        expectedKeywords: ["ICO", "72 hours", "controller", "processor", "GDPR", "clients", "NHS"],
        recapLine: "notified {{recapFragment}} first",
        decisionOptions: [
          {
            key: "A",
            label: "ICO first — file the Article 33 notification now and demonstrate proactive good faith",
            consequence: "The textbook answer. Filing first demonstrates you are ahead of the story, not reacting to it. The ICO values early, honest notification — even if incomplete — over late, polished ones. This also gives you a timestamp to show every subsequent regulator.",
            rank: 1,
            recapFragment: "the ICO, establishing the regulatory baseline",
          },
          {
            key: "B",
            label: "The 140 clients first — they are controllers and need to start their own GDPR clocks",
            consequence: "Operationally smart and legally defensible. Your clients need to know so they can discharge their own Article 33 obligations. But this is a massive operational lift — 140 organisations, each with their own DPA, their own legal team, their own capacity to panic. And the ICO may hear about it from one of them before they hear from you.",
            rank: 2,
            recapFragment: "the 140 client organisations, triggering the notification cascade",
          },
          {
            key: "C",
            label: "Our own 12,000 employees first — their bank details are exposed and they need to protect themselves",
            consequence: "Empathetic and defensible on a human level, but doesn't address the legal obligations to the ICO or the 140 clients. By the time you've set up the employee comms, your GDPR clocks are burning. The 608,000 people in the client tenants are no less exposed than your own staff.",
            rank: 3,
            recapFragment: "their own employees, prioritising people over process",
          },
          {
            key: "D",
            label: "No one yet — wait for CrowdStrike's full scope report so our notifications are accurate",
            consequence: "The worst option. The GDPR clock started at 07:22 when your CISO took the call. Waiting for a 'full scope' that may take weeks means you will blow the 72-hour window and every client DPA deadline. The ICO specifically warns against waiting for complete information before notifying.",
            rank: 4,
            recapFragment: "nobody — waiting for the full forensic picture",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "sc-i3" },
          { optionKey: "B", nextInjectId: "sc-i3" },
          { optionKey: "C", nextInjectId: "sc-i3" },
          { optionKey: "D", nextInjectId: "sc-i3" },
        ],
      },

      // ── INJECT 3: The Full Scope ──────────────────────────────────────
      {
        id: "sc-i3",
        order: 30,
        title: "14:00 - The Full Scope: 620,000 Records",
        body: "14:00. CrowdStrike's interim report lands. The breach is worse than PeopleCore initially disclosed. The threat actor Brass Badger had persistent access for 11 days and exfiltrated the full payroll dataset across all 140 client tenants. Total exposure:\n\n• 620,000 individuals\n• Full names, dates of birth, NI numbers\n• Bank sort codes and account numbers\n• Gross and net salary, tax codes\n• Home addresses and emergency contact details\n• HR notes including disciplinary records and medical adjustments\n\nBrass Badger is a financially-motivated group known for two plays: selling bulk PII on dark web markets and conducting targeted spear-phishing using payroll data to impersonate employers. CrowdStrike assesses with high confidence that the data will surface on dark web markets within 48 hours. Your CFO asks: 'What does containment even look like when the data is already out?'",
        facilitatorNotes:
          "Tests the team's containment thinking when the breach is upstream and the data is already exfiltrated. There is no 'contain the breach' option — the question is how you protect 620,000 people whose data is in the wild. A (bank flagging) is proactive and addresses the highest-risk vector (financial fraud). B (breach response line + credit monitoring) is the standard playbook. C (own employees only) is legally risky — you're a processor for all 620k. D (wait for final report) is unconscionable at this point.",
        delayMinutes: 8,
        timerMinutes: 5,
        tickerHeadline: "UK Finance reports 23% increase in payroll-data-linked fraud in Q1 2026",
        artifact: {
          type: "dark_web_listing",
          darkWebSiteName: "Brass Badger Market",
          darkWebOnionUrl: "brassbdgr4fke7onion.onion",
          darkWebTitle: "UK PAYROLL DUMP — 620K RECORDS — BANKING + NI + SALARY",
          darkWebPrice: "18 BTC",
          darkWebRecordCount: "620,000 records",
          darkWebSampleRows: [
            { name: "J. Whitmore", account: "40618823", sortCode: "20-45-18", email: "j.whitmore@redacted.co.uk" },
            { name: "S. Kapadia", account: "71534209", sortCode: "30-92-14", email: "s.kapadia@redacted.nhs.uk" },
            { name: "R. Chen", account: "55201847", sortCode: "09-01-28", email: "r.chen@redacted.com" },
          ],
        },
        isDecisionPoint: true,
        targetRoles: ["CFO", "CISO", "CLO", "HR_LEAD"],
        expectedKeywords: ["containment", "bank", "credit monitoring", "notification", "620k", "dark web"],
        recapLine: "structured the containment by {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Engage UK Finance and the major banks — flag all 620,000 accounts for enhanced fraud monitoring",
            consequence: "The most proactive option. Addresses the highest-probability harm (financial fraud) at source. UK Finance's Mule Insights Tactical Solution (MITS) can flag accounts within hours. This also gives you a strong 'what we did' story for every regulator and client. Operationally complex — requires sharing account data with banks, which itself raises data protection questions — but defensible as a legitimate interest.",
            rank: 1,
            recapFragment: "engaging the banking sector for proactive fraud prevention",
          },
          {
            key: "B",
            label: "Set up a dedicated breach response helpline and offer free credit monitoring to all 620,000 individuals",
            consequence: "The standard playbook. Credit monitoring is expected and its absence would be noted by the ICO. But it is reactive — it tells people after they've been defrauded, not before. And standing up a helpline for 620,000 people in 48 hours is a massive operational challenge.",
            rank: 2,
            recapFragment: "the standard response playbook — helpline and credit monitoring",
          },
          {
            key: "C",
            label: "Focus on our own 12,000 employees first — the clients must handle their own people",
            consequence: "Legally fragile. You are the processor — you held this data, chose this vendor, and failed to prevent its exfiltration. Telling 140 clients 'you handle your own people' when they trusted you to hold the data securely is a position that will not survive regulatory scrutiny or commercial litigation.",
            rank: 3,
            recapFragment: "focusing on their own staff and leaving clients to self-serve",
          },
          {
            key: "D",
            label: "Hold off on individual notification until CrowdStrike delivers the final report — we need confirmed, not assessed, exposure",
            consequence: "Unconscionable. CrowdStrike has confirmed exfiltration with high confidence. Waiting for a final report that may take weeks while 620,000 people's bank details circulate on dark web markets is indefensible to any regulator.",
            rank: 4,
            recapFragment: "holding off until the forensic report was finalised",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "sc-i3d" },
          { optionKey: "B", nextInjectId: "sc-i3d" },
          { optionKey: "C", nextInjectId: "sc-i3d" },
          { optionKey: "D", nextInjectId: "sc-i3d" },
        ],
      },

      // ── INJECT 3D: The NHS Trust ──────────────────────────────────────
      {
        id: "sc-i3d",
        order: 40,
        title: "15:30 - The NHS Trust",
        body: "15:30. Your COO flags a complication. One of the 140 client organisations is Northmoor NHS Foundation Trust — 4,200 clinical and administrative staff whose payroll you process through PeopleCore. NHS England's Data Security and Protection Toolkit (DSPT) requires immediate mandatory reporting of any data security incident involving NHS staff data. The trust's Caldicott Guardian, Dr. Priya Sharma, has been trying to reach your team since 11:00.\n\nWhen she finally gets through, her question is precise: 'Your processor agreement with us required annual penetration testing of any sub-processor handling our data. We have no record of PeopleCore being tested. Was it?' Your CLO checks. It wasn't. The DPIA for the PeopleCore onboarding recommended a sub-processor audit programme. It was never implemented.\n\nDr. Sharma says: 'I need to report to NHS England within 24 hours. What I report depends on what you tell me in the next thirty minutes.'",
        facilitatorNotes:
          "The NHS trust is the scenario's emotional and regulatory hinge. The Caldicott Guardian has found a genuine gap — the sub-processor audit was recommended but never implemented. This is the 'how did we get here?' moment. A (in-person, full transparency) is the best answer — it demonstrates accountability and gives the trust what they need to report accurately. B (formal written process) is adequate but cold. C (same as other clients) is tone-deaf — the NHS has specific obligations and specific leverage. D (point to PeopleCore) is catastrophic — you chose PeopleCore, you failed to audit them, and the data was in your care.",
        delayMinutes: 5,
        timerMinutes: 5,
        tickerHeadline: "NHS England: 'Data security incidents affecting patient or staff data must be reported within 24 hours'",
        artifact: {
          type: "email",
          emailFrom: "p.sharma@northmoornhs.nhs.uk",
          emailTo: "coo@ashworthlyle.com",
          emailSubject: "URGENT — Northmoor NHS FT: Data Security Incident — Sub-Processor Audit Records Required",
        },
        isDecisionPoint: true,
        targetRoles: ["COO", "CLO", "CISO", "CEO"],
        expectedKeywords: ["NHS", "Caldicott", "DSPT", "sub-processor", "audit", "DPIA", "penetration test"],
        recapLine: "handled the NHS trust by {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Send the CISO and CLO to the trust in person today — full transparency, joint incident statement, share everything",
            consequence: "The right answer. In-person attendance demonstrates accountability. Sharing everything — including the DPIA gap — is painful but gives Dr. Sharma what she needs to report accurately to NHS England. It also builds the relationship you will need when litigation starts. The NHS trust becomes an ally in holding PeopleCore accountable, not an adversary holding you accountable.",
            rank: 1,
            recapFragment: "going in person with full transparency",
          },
          {
            key: "B",
            label: "Formal written notification through the contractual DPA process — copy NHS England directly",
            consequence: "Adequate but cold. The formal channel is correct but the Caldicott Guardian asked for a conversation, not a letter. Copying NHS England directly is smart — it demonstrates you are not trying to hide behind the trust — but the written format will not convey the nuance of the DPIA gap in a way that protects you.",
            rank: 2,
            recapFragment: "a formal written notification through the DPA channel",
          },
          {
            key: "C",
            label: "Handle them the same as the other 139 clients — fair treatment, no special treatment",
            consequence: "Tone-deaf. The NHS trust has specific statutory reporting obligations, a Caldicott Guardian with statutory authority, and — critically — has found a genuine gap in your vendor management. Treating them 'the same' means slow, generic communication that doesn't address their specific regulatory deadline or their specific question about the sub-processor audit.",
            rank: 3,
            recapFragment: "treating them the same as every other client",
          },
          {
            key: "D",
            label: "The breach is PeopleCore's fault — direct the trust to PeopleCore's IR team for all technical queries",
            consequence: "Catastrophic. You chose PeopleCore. You failed to audit them. The data was in your processing environment. Pointing a Caldicott Guardian — someone with statutory authority — to a vendor who is already being evasive and blame-shifting is a position that will not survive 30 seconds in front of the ICO, let alone NHS England.",
            rank: 4,
            recapFragment: "deflecting to PeopleCore",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "sc-i4" },
          { optionKey: "B", nextInjectId: "sc-i4" },
          { optionKey: "C", nextInjectId: "sc-i4" },
          { optionKey: "D", nextInjectId: "sc-i4" },
        ],
      },

      // ── INJECT 4: PeopleCore Goes Public ───────────────────────────────
      {
        id: "sc-i4",
        order: 50,
        title: "Day 2, 08:15 - PeopleCore Goes Public",
        body: "Day 2, 08:15. PeopleCore releases a press statement:\n\n'PeopleCore confirms that a sophisticated cyber attack by a state-affiliated threat actor affected a limited portion of our platform infrastructure. Our investigation, supported by CrowdStrike, has identified that a small number of client organisations were impacted due to misconfigured single sign-on (SSO) integrations on the client side. PeopleCore's core platform security was not compromised. We are working with affected clients to remediate.'\n\nYour CCO calls this what it is: they are blaming you. The Financial Times runs it at 08:42: 'Payroll data breach hits FTSE companies — vendor points to client security failures.' Your switchboard lights up. By 09:00, three clients have threatened immediate contract termination. Two more are asking for the sub-processor audit records you don't have. The Ashworth & Lyle share price drops 4.2% on the open.",
        facilitatorNotes:
          "Narrative inject — no decision here. The team should feel the compound pressure: PeopleCore has gone public and blamed them, the press have the story, clients are threatening to leave, and the share price is falling. The next inject (sc-i4v) will force the commercial decision about the vendor relationship.",
        delayMinutes: 6,
        timerMinutes: 0,
        tickerHeadline: "BREAKING: Payroll data breach hits FTSE companies — vendor points to client security failures — FT",
        artifact: {
          type: "tweet",
          tweetHandle: "@FaborSteinFT",
          tweetDisplayName: "Rebecca Fabor-Stein",
          tweetLikes: 847,
          tweetRetweets: 312,
        },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CCO", "CEO", "CFO", "CLO"],
        expectedKeywords: ["blame", "SSO", "misconfigured", "FT", "share price", "clients"],
        branches: [
          { optionKey: "_", nextInjectId: "sc-i4v" },
        ],
      },

      // ── INJECT 4V: The Commercial Question ─────────────────────────────
      {
        id: "sc-i4v",
        order: 60,
        title: "Day 2, 11:00 - The Commercial Question",
        body: "Day 2, 11:00. Your CFO presents the numbers. The PeopleCore contract is £4.2M per year with three years remaining. Termination requires 12 months' notice under the standard clause, or immediate termination for material breach — which your CLO argues this clearly is.\n\nBut your COO has the operational reality: PeopleCore runs your entire payroll infrastructure. 12,000 Ashworth & Lyle employees and 608,000 client employees are paid through that platform. The next pay run is in 9 days. Migration to a new provider takes 3-6 months minimum. If you pull the plug, nobody gets paid on the 25th.\n\nPeopleCore knows this. Their CEO's voicemail to yours at 10:45 was conciliatory but carried an undertone: 'We should work through this together. A public separation right now helps neither of us.'\n\nYour CLO says: 'That's not a partnership offer. That's a hostage negotiation.'",
        facilitatorNotes:
          "The central commercial dilemma. Tests whether the team can think operationally under pressure. B (orderly transition with enhanced controls) is the right answer — it protects payroll continuity while establishing the exit. A (terminate immediately) is emotionally satisfying but operationally catastrophic. C (escrow/suspend) is legally creative but may not survive challenge. D (continue as normal) is capitulation.",
        delayMinutes: 5,
        timerMinutes: 5,
        tickerHeadline: "Ashworth & Lyle plc (ALY.L) down 4.2% — analysts cite vendor risk exposure",
        artifact: {
          type: "slack_thread",
          slackChannel: "#exec-crisis",
          slackMessages: [
            { author: "CFO", role: "Chief Financial Officer", time: "10:52", text: "Contract value: £4.2M/yr, 3 years remaining. Material breach clause is clear. But early termination triggers a £2.1M break fee if they contest 'cause'." },
            { author: "COO", role: "Chief Operating Officer", time: "10:55", text: "Next pay run is 9 days out. 620,000 people. We cannot run payroll manually. Migration is 3-6 months minimum." },
            { author: "CLO", role: "Chief Legal Officer", time: "10:58", text: "Their voicemail is leverage, not partnership. If we stay, we validate the 'client misconfiguration' narrative. If we go, 620k people don't get paid." },
            { author: "HR Director", role: "HR Lead", time: "11:00", text: "Our own staff are asking whether their salaries are safe. The union rep called twice this morning." },
          ],
        },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CFO", "COO", "CLO"],
        expectedKeywords: ["terminate", "payroll", "migration", "hostage", "contract", "breach", "pay run"],
        recapLine: "played the commercial hand by {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Terminate for cause immediately — stand up an emergency manual payroll process and begin vendor migration",
            consequence: "Emotionally satisfying and sends a strong signal. But 620,000 people need to be paid in 9 days and you have no backup platform. Manual payroll for 12,000 is heroic; for 620,000 across 140 client organisations it is impossible. This creates a second crisis.",
            rank: 3,
            recapFragment: "terminating immediately and accepting the operational risk",
          },
          {
            key: "B",
            label: "Formal notice of material breach — negotiate a 90-day orderly transition with enhanced security controls, monitoring, and audit rights",
            consequence: "The right answer. Preserves payroll continuity, establishes the exit timeline, and — critically — forces PeopleCore to accept enhanced security controls and audit rights as a condition of the continued relationship. The 'material breach' notice also defeats the break fee clause.",
            rank: 1,
            recapFragment: "negotiating an orderly transition with enhanced controls",
          },
          {
            key: "C",
            label: "Suspend the contract and escrow all payments pending investigation — demand full audit access as a condition of resumption",
            consequence: "Legally creative but commercially risky. Escrow is not a standard remedy in UK SaaS contracts and PeopleCore may argue it is a repudiatory breach. If they stop providing the service in response, you are in the same position as option A but with a weaker legal standing.",
            rank: 2,
            recapFragment: "escrowing payments and demanding audit rights",
          },
          {
            key: "D",
            label: "Continue the relationship — the breach was a one-off, migration risk is higher than staying, and going public with a termination validates the media narrative",
            consequence: "Capitulation. Continuing as normal after a vendor blamed you publicly for their breach is indefensible. Your clients, your board, and the ICO will all ask why you maintained the relationship with a vendor whose security failed and whose first instinct was to shift blame.",
            rank: 4,
            recapFragment: "continuing the relationship as if nothing had changed",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "sc-i5" },
          { optionKey: "B", nextInjectId: "sc-i5" },
          { optionKey: "C", nextInjectId: "sc-i5" },
          { optionKey: "D", nextInjectId: "sc-i5" },
        ],
      },

      // ── ACT 3: THE RECKONING ───────────────────────────────────────────
      // ICO investigation, board presentation, and the score-routed finale.

      // ── INJECT 5: The Legal Posture ────────────────────────────────────
      {
        id: "sc-i5",
        order: 70,
        title: "Week 3 - The ICO Investigation",
        body: "Week 3. The Information Commissioner's Office has opened a formal investigation under UK GDPR Article 83. Their scope letter identifies three areas of inquiry:\n\n1. Whether Ashworth & Lyle conducted adequate due diligence before onboarding PeopleCore as a sub-processor — specifically, whether a Data Protection Impact Assessment (DPIA) was completed\n2. Whether the processor agreement with PeopleCore included adequate audit rights and whether those rights were exercised\n3. Whether Ashworth & Lyle's notification to affected data subjects was timely and adequate\n\nYour CLO has reviewed the file. The DPIA was started but never completed. The processor agreement included audit rights but they were never exercised. The sub-processor register listed PeopleCore but did not include a risk rating.\n\nThe ICO's penalties for GDPR violations can reach £17.5 million or 4% of global annual turnover, whichever is higher. Your global revenue last year was £1.8 billion.\n\nYour CLO needs a legal strategy for the ICO engagement.",
        facilitatorNotes:
          "Tests the team's regulatory posture. A (full cooperation, open the file) is the best answer — the ICO values transparency and the gaps are going to be found regardless. Trying to hide them makes it worse. B (cooperative but selective) is defensible but risks the ICO feeling managed. C (challenge jurisdiction) is aggressive and will antagonise the regulator. D (delay) is transparent obstruction.",
        delayMinutes: 8,
        timerMinutes: 5,
        tickerHeadline: "ICO opens formal investigation into payroll data breach — penalties up to 4% of global turnover",
        artifact: {
          type: "legal_letter",
          legalCaseRef: "ICO/INV/2026/0847",
          legalAuthority: "Information Commissioner's Office",
        },
        isDecisionPoint: true,
        targetRoles: ["CLO", "CEO", "CISO", "CFO"],
        expectedKeywords: ["ICO", "DPIA", "audit rights", "processor", "transparency", "cooperation", "penalty"],
        recapLine: "took the legal posture of {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Full cooperation — open the entire vendor management file to the ICO, including the incomplete DPIA, and demonstrate what you have done since",
            consequence: "The right answer. The gaps are going to be found regardless — the ICO has compulsory information powers. Volunteering them first, alongside a comprehensive remediation programme, is the single most effective mitigant. The ICO's own regulatory action policy explicitly cites proactive cooperation as a factor in reducing penalties.",
            rank: 1,
            recapFragment: "full transparency and proactive cooperation with the ICO",
          },
          {
            key: "B",
            label: "Cooperative but selective — share what is required under the information notice, assert legal professional privilege over internal risk assessments",
            consequence: "Defensible but risky. LPP is a legitimate protection but asserting it over documents that the ICO may argue are not genuinely privileged (internal risk assessments are often operational, not legal) can antagonise the investigator and invite a challenge.",
            rank: 2,
            recapFragment: "selective cooperation, asserting privilege over internal assessments",
          },
          {
            key: "C",
            label: "Challenge the ICO's framing — argue that PeopleCore, as the platform operator, is the primary controller and A&L's processor obligations are limited",
            consequence: "Aggressive and unlikely to succeed. The ICO will look at the substance, not the label: A&L chose the vendor, determined the purposes of processing, and held the data. Arguing limited processor obligations when you made the onboarding decision is a position that will invite the ICO to prove you wrong — publicly.",
            rank: 3,
            recapFragment: "challenging the ICO's jurisdictional framing",
          },
          {
            key: "D",
            label: "Delay — request extensions on every information notice deadline while you remediate the gaps they will find",
            consequence: "Transparent obstruction. The ICO has seen this playbook hundreds of times. Requesting extensions to remediate before disclosure does not change what happened — it changes the ICO's assessment of your attitude. Regulatory cooperation is the primary mitigant in GDPR penalty calculations. This option removes it.",
            rank: 4,
            recapFragment: "requesting extensions to buy remediation time",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "sc-i6a" },
          { optionKey: "B", nextInjectId: "sc-i6a" },
          { optionKey: "C", nextInjectId: "sc-i6a" },
          { optionKey: "D", nextInjectId: "sc-i6a" },
        ],
      },

      // ── INJECT 6A: The Board Presentation ──────────────────────────────
      {
        id: "sc-i6a",
        order: 80,
        title: "Week 4 - The Emergency Board Meeting",
        body: "Week 4. Dame Helen Ashworth has convened an emergency board meeting. The agenda has one item: the PeopleCore breach — root cause, regulatory exposure, commercial impact, and the leadership team's handling of the crisis.\n\nThe board pack lands at 18:00 the night before. The non-executive directors have read it. They have questions.\n\nThe CFO's exposure estimate: £12-18M in direct costs (IR, legal, credit monitoring, client remediation), plus £8-14M in potential ICO penalties, plus unquantified litigation risk from clients and affected individuals. The share price is down 11% since the breach became public. Two major clients have served termination notices.\n\nThe board chair's private message to the CEO at 22:15: 'I need to know whether this is a vendor management failure or a governance failure. The answer determines what I recommend to the board tomorrow. How do you want to present this?'",
        facilitatorNotes:
          "The board presentation decision. Tests whether the team takes accountability (A), focuses on remediation (B), shifts blame to the vendor (C), or minimises exposure (D). A+B route to the strong bridge; C+D route to the weak bridge. A is the best answer — the board needs to hear the truth before they can make good decisions.",
        delayMinutes: 6,
        timerMinutes: 5,
        tickerHeadline: "Ashworth & Lyle emergency board meeting — two NEDs request independent review of vendor governance",
        artifact: { type: "default" },
        isDecisionPoint: true,
        targetRoles: ["CEO", "CFO", "CLO", "CISO"],
        expectedKeywords: ["board", "governance", "vendor management", "accountability", "remediation", "root cause"],
        recapLine: "answered the board by {{recapFragment}}",
        decisionOptions: [
          {
            key: "A",
            label: "Full accountability — present the DPIA gap, the missing audits, and the leadership team's remediation plan as a governance failure that you own",
            consequence: "The right answer. The board needs the truth to make good decisions. Owning the governance failure — not just the vendor's technical failure — gives the board confidence that the leadership team understands what went wrong and can prevent it happening again.",
            rank: 1,
            recapFragment: "taking full accountability for the governance failure",
          },
          {
            key: "B",
            label: "Focus forward — acknowledge the gaps briefly but spend 80% of the presentation on the remediation programme and client retention plan",
            consequence: "Strong but incomplete. The remediation plan is important but the board's question is about root cause, not next steps. Spending 80% on the future signals you are uncomfortable with the past. The NEDs will notice.",
            rank: 2,
            recapFragment: "focusing on the remediation programme and forward plan",
          },
          {
            key: "C",
            label: "Vendor-focused — present PeopleCore's failures, their delayed notification, their blame-shifting press statement, and argue that A&L was a victim",
            consequence: "The board will see through this. PeopleCore's behaviour was poor, but A&L chose the vendor, failed to complete the DPIA, and never exercised the audit rights. Blaming the vendor when the governance gaps are in your own house collapses under the first question from a competent NED.",
            rank: 3,
            recapFragment: "framing A&L as a victim of the vendor's failures",
          },
          {
            key: "D",
            label: "Minimise — present the exposure at the low end of estimates, emphasise that no A&L systems were breached, and argue that the market reaction is overdone",
            consequence: "Delusional. The board has the CFO's pack with the real numbers. Presenting a sanitised version to people who have already read the unvarnished data destroys trust instantly.",
            rank: 4,
            recapFragment: "minimising the exposure and downplaying the governance gaps",
          },
        ],
        branches: [
          { optionKey: "A", nextInjectId: "sc-i6-strong" },
          { optionKey: "B", nextInjectId: "sc-i6-strong" },
          { optionKey: "C", nextInjectId: "sc-i6-weak" },
          { optionKey: "D", nextInjectId: "sc-i6-weak" },
        ],
      },

      // ── INJECT 6-strong: Bridge narrative for strong play ──────────────
      {
        id: "sc-i6-strong",
        order: 90,
        title: "Week 5 - The Accountability Dividend",
        body: "Week 5. The board accepted the leadership team's presentation and endorsed the remediation programme. Dame Helen's closing remark: 'This is a governance failure, not a character failure. I can work with the first.' The ICO investigation is proceeding — your full cooperation has been noted in their file. CrowdStrike's final report is in: Brass Badger monetised the data on three dark web markets but your proactive engagement with UK Finance flagged 89% of the exposed accounts before any fraudulent transactions cleared. The NHS trust's Caldicott Guardian sent a private note to your CEO: 'Thank you for being straight with us. That is rarer than it should be.' Client attrition has stabilised at 8 of the 140 — painful but survivable. The PeopleCore migration is on track for Month 3. You are not out of the woods. But you are walking forward, not looking back.",
        facilitatorNotes:
          "Rewarded narrative for strong play. The team should feel the dividend of their earlier choices — the board trusts them, the ICO is noting cooperation, the NHS trust is an ally, and client attrition stabilised. The next inject is the score-routed finale.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "Ashworth & Lyle vendor governance review underway — board endorses remediation programme",
        artifact: { type: "default" },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CLO", "COO"],
        expectedKeywords: ["accountability", "cooperation", "stabilised", "migration", "trust"],
      },

      // ── INJECT 6-weak: Bridge narrative for weak play ──────────────────
      {
        id: "sc-i6-weak",
        order: 90,
        title: "Week 5 - The Credibility Gap",
        body: "Week 5. The board meeting did not go well. Two non-executive directors have requested an independent review of the executive team's handling of the crisis. Dame Helen's private feedback to the CEO: 'You told me what you thought I wanted to hear. I needed the truth.' The ICO has escalated its investigation to the enforcement team — your cooperation has been assessed as 'reactive and inconsistent.' The NHS trust has filed a formal complaint with NHS England and engaged solicitors. Client attrition is at 23 of the 140 — each one citing 'loss of confidence in data governance.' The dark web data surfaced on a Telegram channel and 2,100 individuals have reported fraudulent transactions on accounts linked to the breach. The PeopleCore migration has been delayed by contractual disputes. The Financial Times has published a feature: 'The vendor you trusted: inside Ashworth & Lyle's payroll breach.' The board chair has asked for a 1:1 with the CEO at 18:00.",
        facilitatorNotes:
          "Punishing narrative for weak play. The team should feel the cost of evasion, blame-shifting, or minimisation. The board doesn't trust them, the ICO is in enforcement mode, the NHS trust is hostile, clients are leaving, and the press have the story. The next inject is the score-routed finale.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "ICO escalates Ashworth & Lyle investigation to enforcement team — FT publishes 'The Vendor You Trusted' feature",
        artifact: { type: "default" },
        isDecisionPoint: false,
        decisionOptions: [],
        targetRoles: ["CEO", "CLO", "CFO"],
        expectedKeywords: ["enforcement", "independent review", "credibility", "attrition", "Telegram"],
      },

      // ── INJECT 7: How Does This End? (score-routed finale) ─────────────
      {
        id: "sc-i7",
        order: 100,
        title: "Month 3 - How Does This End?",
        body: "Month 3. The operational crisis is closing. CrowdStrike's final attribution report is published: Brass Badger monetised the data across four dark web markets and a Telegram channel before takedown. 620,000 individuals were notified. The breach response line has handled 34,000 calls. Fraud cases linked to the breach are being processed through the banks. The ICO has a draft enforcement notice. The board has a governance report. The insurers have a coverage position. The clients have a migration timeline. The CEO has a microphone — the annual results presentation is in 48 hours and every analyst on the call will ask about PeopleCore. How does this end?",
        facilitatorNotes:
          "Score-routed finale. The compound average rank of all decisions taken across the session is the input. Thresholds: <=1.6 -> end1 (TRIUMPH), <=2.3 -> end2 (RECOVERY), <=3.0 -> end3 (DIMINISHED), Infinity -> end4 (CATASTROPHIC). The team should be told this is the moment their cumulative choices land.",
        delayMinutes: 0,
        timerMinutes: 6,
        tickerHeadline: "Ashworth & Lyle annual results in 48 hours — analysts expect PeopleCore breach to dominate Q&A",
        artifact: { type: "default" },
        isDecisionPoint: false,
        decisionOptions: [],
        branchMode: "score",
        branches: [
          { optionKey: "_", nextInjectId: "sc-end1", scoreMax: 1.6 },
          { optionKey: "_", nextInjectId: "sc-end2", scoreMax: 2.3 },
          { optionKey: "_", nextInjectId: "sc-end3", scoreMax: 3.0 },
          { optionKey: "_", nextInjectId: "sc-end4", scoreMax: 99 },
        ],
        targetRoles: ["CEO", "CFO", "CLO", "CISO"],
        expectedKeywords: ["finale", "ICO", "results", "PeopleCore"],
      },

      // ── ENDING 1: TRIUMPH ──────────────────────────────────────────────
      {
        id: "sc-end1",
        order: 110,
        title: "Month 6 - The New Standard",
        body: "Six months on. The ICO closed its investigation with a formal reprimand but no fine — citing 'exceptional cooperation and a remediation programme that now represents sector-leading practice.' The board endorsed the governance review and the new vendor assurance framework has been published as an open-source playbook. Three competitors have adopted it. The NHS trust renewed its contract — Dr. Sharma cited the in-person transparency as the deciding factor. Client attrition stabilised at 5 of 140, and two have since returned. UK Finance invited the CISO to co-chair a working group on payroll data protection. The annual results call went smoothly — the CEO's prepared statement on vendor governance was described by one analyst as 'the most honest 90 seconds I've heard from a FTSE board in five years.'\n\nLast week, PeopleCore filed for administration. Their other clients were not as forgiving.\n\nOne last vote. Looking back across the whole exercise — which call did the most to earn this ending?",
        facilitatorNotes:
          "Triumph ending. The team executed cleanly across the board. Every major decision landed in the top two ranks. The reflection vote is unranked — it asks them to look back and identify the call that mattered most.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "ICO closes Ashworth & Lyle investigation — 'sector-leading remediation' — vendor governance playbook goes open source",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "BBC NEWS",
          tvHeadline: "ASHWORTH & LYLE VENDOR GOVERNANCE FRAMEWORK ADOPTED AS INDUSTRY STANDARD",
          tvTicker: "BBC NEWS BUSINESS - ICO CLOSES INVESTIGATION WITH NO FINE - NHS TRUST RENEWS CONTRACT - PEOPLECORE FILES FOR ADMINISTRATION - FTSE 250 VENDOR ASSURANCE PLAYBOOK GOES OPEN SOURCE",
          tvReporter: "Emma Blackwell, BBC News, Westminster",
        },
        isDecisionPoint: true,
        isEnding: true,
        targetRoles: ["CEO", "CISO", "CLO", "COO"],
        expectedKeywords: ["reflection"],
        decisionOptions: [
          { key: "A", label: "The 07:22 isolation instinct — killing the SSO before anything else" },
          { key: "B", label: "Going to the NHS trust in person with full transparency" },
          { key: "C", label: "Opening the entire vendor file to the ICO, gaps and all" },
          { key: "D", label: "Owning the governance failure at the board, not blaming the vendor" },
        ],
      },

      // ── ENDING 2: RECOVERY ─────────────────────────────────────────────
      {
        id: "sc-end2",
        order: 110,
        title: "Month 6 - The Long Walk Back",
        body: "Six months on. The ICO issued a formal reprimand and a £2.4 million fine — reduced from the indicative £8 million because of 'meaningful cooperation in the later stages of the investigation.' The board endorsed the remediation programme but commissioned an independent review of vendor governance that surfaced three additional sub-processors with incomplete DPIAs. Client attrition settled at 18 of 140 — painful but the pipeline is rebuilding. The NHS trust stayed, reluctantly, after the CLO negotiated enhanced audit rights and a quarterly governance review. The annual results call was difficult but the CEO's candour on vendor governance earned a cautious 'Hold' from two analysts who had been at 'Sell.'\n\nPeopleCore is in administration. Your migration to the replacement platform completes next month.\n\nOne last vote. Looking back — which single call would you change if you could do this again?",
        facilitatorNotes:
          "Recovery ending. The team made some strong calls but enough weak ones to take a fine and lose clients. The reflection vote asks what they would change — a different question from the triumph ending's 'what earned this?'",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "ICO fines Ashworth & Lyle £2.4M for vendor governance failures — reduced from £8M for cooperation",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "SKY NEWS",
          tvHeadline: "ASHWORTH & LYLE FINED £2.4M OVER PAYROLL DATA BREACH",
          tvTicker: "SKY NEWS BUSINESS - A&L FINE REDUCED FROM £8M FOR COOPERATION - 18 CLIENTS LOST - PEOPLECORE IN ADMINISTRATION - NHS TRUST STAYS WITH ENHANCED OVERSIGHT",
          tvReporter: "James Moran, Sky News, City of London",
        },
        isDecisionPoint: true,
        isEnding: true,
        targetRoles: ["CEO", "CLO", "CFO", "CISO"],
        expectedKeywords: ["reflection", "change"],
        decisionOptions: [
          { key: "A", label: "The opening response — we should have isolated faster" },
          { key: "B", label: "The notification sequence — we got the GDPR triage wrong" },
          { key: "C", label: "The vendor relationship — we should have terminated or escrowed earlier" },
          { key: "D", label: "The board presentation — we should have been fully transparent from the start" },
        ],
      },

      // ── ENDING 3: DIMINISHED ───────────────────────────────────────────
      {
        id: "sc-end3",
        order: 110,
        title: "Month 6 - The Slow Erosion",
        body: "Six months on. The ICO issued a £9.2 million fine — the maximum was £72 million but the Commissioner cited 'systemic vendor governance failures partially mitigated by belated remediation.' The fine is under appeal but your CLO rates the chances at 30/70. The board's independent review found that the DPIA gap was one of eleven vendor governance failures across the outsourcing portfolio. Three non-executive directors have resigned, citing 'loss of confidence in management's risk culture.' Client attrition hit 41 of 140. The NHS trust terminated and its Caldicott Guardian gave evidence to the Health and Social Care Committee about 'a processor who chose cost over care.' The share price is down 24% from pre-breach levels. The PeopleCore migration completed but the replacement vendor demanded a 40% premium given your risk profile.\n\nThe annual results call was brutal. One analyst asked: 'Can you name a single vendor in your supply chain that you have audited in the last three years?' The silence lasted four seconds.\n\nOne last vote. Was this a failure of people, process, or culture?",
        facilitatorNotes:
          "Diminished ending. The team made enough poor calls to take a major fine, lose a third of their clients, and face board resignations. The reflection vote asks a systems question — people, process, or culture — to push the debrief toward root cause, not blame.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "ICO fines Ashworth & Lyle £9.2M — three NEDs resign — NHS trust terminates — share price -24%",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "CHANNEL 4 NEWS",
          tvHeadline: "ASHWORTH & LYLE: 'THE PROCESSOR WHO CHOSE COST OVER CARE'",
          tvTicker: "CHANNEL 4 NEWS - ICO ISSUES £9.2M FINE FOR VENDOR GOVERNANCE FAILURES - THREE NON-EXECUTIVE DIRECTORS RESIGN - NHS CALDICOTT GUARDIAN GIVES EVIDENCE TO HEALTH COMMITTEE - 41 CLIENTS TERMINATE",
          tvReporter: "Fatima Al-Rashid, Channel 4 News, Westminster",
        },
        isDecisionPoint: true,
        isEnding: true,
        targetRoles: ["CEO", "CLO", "CFO", "COO"],
        expectedKeywords: ["reflection", "failure", "culture"],
        decisionOptions: [
          { key: "A", label: "People — the leadership team didn't have the expertise to manage vendor risk at this scale" },
          { key: "B", label: "Process — the DPIA and audit frameworks existed on paper but were never operationalised" },
          { key: "C", label: "Culture — cost and speed were prioritised over due diligence at every decision point" },
          { key: "D", label: "All three — and they reinforced each other" },
        ],
      },

      // ── ENDING 4: CATASTROPHIC ─────────────────────────────────────────
      {
        id: "sc-end4",
        order: 110,
        title: "Month 6 - The Reckoning",
        body: "Six months on. The ICO issued the maximum penalty: £72 million — 4% of global turnover. The enforcement notice cited 'a systemic failure of vendor governance compounded by obstructive and misleading engagement with the investigation.' The fine is under appeal but your insurers have denied coverage, citing a policy exclusion for 'failure to maintain reasonable security controls over sub-processors.' Client attrition reached 94 of 140. The NHS trust terminated, reported Ashworth & Lyle to NHS England's Oversight Framework, and its Caldicott Guardian's evidence to the Health and Social Care Committee was broadcast live on Parliament TV. The board voted no confidence in the CEO. The share price is down 58%. Two class action lawsuits have been filed — one by affected individuals, one by client organisations — with combined claims exceeding £200 million.\n\nThe Financial Times headline this morning: 'The Trusted Vendor: How Ashworth & Lyle's payroll empire collapsed in 90 days.'\n\nThe replacement CEO starts on Monday.\n\nOne last vote. At what point was this ending inevitable — or was it?",
        facilitatorNotes:
          "Catastrophic ending. The team's cumulative choices were consistently poor — evasion, blame-shifting, minimisation, and obstruction. The reflection vote asks whether the ending was inevitable or whether there was a single moment where a different choice would have changed the arc.",
        delayMinutes: 0,
        timerMinutes: 0,
        tickerHeadline: "BREAKING: ICO issues maximum £72M fine — CEO removed — class actions filed — 'payroll empire collapsed in 90 days'",
        artifact: {
          type: "tv_broadcast",
          tvNetwork: "BBC NEWS",
          tvHeadline: "ASHWORTH & LYLE CEO REMOVED AFTER £72M ICO FINE — LARGEST UK DATA BREACH PENALTY",
          tvTicker: "BBC NEWS BUSINESS - £72M ICO FINE IS UK RECORD FOR GDPR VIOLATION - 94 OF 140 CLIENTS TERMINATE - NHS TRUST EVIDENCE BROADCAST ON PARLIAMENT TV - CLASS ACTIONS EXCEED £200M - INSURERS DENY COVERAGE - SHARE PRICE DOWN 58% - REPLACEMENT CEO STARTS MONDAY",
          tvReporter: "Emma Blackwell, BBC News, Westminster",
        },
        isDecisionPoint: true,
        isEnding: true,
        targetRoles: ["CEO", "CLO", "CFO", "CISO", "COO"],
        expectedKeywords: ["inevitable", "reflection", "turning point"],
        decisionOptions: [
          {
            key: "A",
            label: "It was inevitable from 07:22 — we never had the vendor governance to survive a breach of this scale",
            consequence: "The structural answer. Argues that the DPIA gap, the missing audits, and the lack of a sub-processor framework meant the organisation was always one breach away from this outcome.",
          },
          {
            key: "B",
            label: "The PeopleCore press statement was the turning point — after that, every path led here",
            consequence: "The narrative answer. Argues that PeopleCore's blame-shifting created a public framing that A&L could never overcome, regardless of what they did internally.",
          },
          {
            key: "C",
            label: "The board presentation — if we had been honest there, the board would have protected us",
            consequence: "The governance answer. Argues that the board was willing to work with a team that took accountability, and the failure to do so turned potential allies into adversaries.",
          },
          {
            key: "D",
            label: "It was never inevitable — different choices at every stage would have produced a completely different outcome",
            consequence: "The agency answer. Rejects determinism and argues that the scenario was a sequence of decisions, not a predetermined arc. The most mature answer — but only if the team can identify which specific choices they would change.",
          },
        ],
      },
    ],
  };
