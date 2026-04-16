import { useState } from "react";

const competitors = [
  {
    name: "Personio",
    type: "Incumbent",
    hq: "Munich, Germany",
    founded: 2015,
    funding: "$8.5B valuation",
    customers: "15,000+",
    segment: "HRIS + Basic ATS",
    targetMarket: "European SMEs (10–2,000 employees)",
    pricing: "~€5–15/employee/month, modular",
    keyStrengths: [
      "Dominant DACH/European brand awareness and trust",
      "All-in-one HRIS (payroll, time tracking, compliance, ATS in one)",
      "Native DACH/Swiss compliance and localized payroll (DE/UK/AT/ES)",
      "200+ integrations, massive partner ecosystem",
      "Deep employer trust: HR teams already live in Personio daily",
    ],
    keyWeaknesses: [
      "Recruiting module is basic — no AI sourcing, no AI interviews, limited candidate scoring",
      "ATS is a bolt-on, not a core product — limited customization",
      "No outbound sourcing or passive candidate engagement",
      "Users outgrow the recruiting module as hiring matures",
      "Mobile experience and reporting depth limited",
    ],
    allpsDifferentiators: [
      "ALLPS offers end-to-end AI-native recruitment (sourcing → interviews → hire) vs. Personio's basic pipeline tracker",
      "AI Interviews (screening + skills) are a capability Personio entirely lacks",
      "AI-recommended candidates and intelligent matching vs. manual resume review",
      "Purpose-built for hiring excellence, not a module inside HR admin",
    ],
    threatLevel: "HIGH",
    threatReason: "Personio is the default HRIS for DACH SMEs. Their ATS, while basic, creates switching costs. Biggest risk: Personio acquiring or building deeper AI recruiting.",
  },
  {
    name: "Teamtailor",
    type: "Incumbent",
    hq: "Stockholm, Sweden",
    founded: 2013,
    funding: "Private (profitable)",
    customers: "12,000+",
    segment: "ATS + Employer Branding",
    targetMarket: "SMEs (up to 2,500 employees), strong Nordics presence",
    pricing: "~€149+/month, plan-based",
    keyStrengths: [
      "Best-in-class employer branding with drag-and-drop career sites",
      "Strong Nordic + Scandinavian market dominance",
      "AI Co-Pilot for recruiter task automation",
      "450+ integrations including assessment and video tools",
      "Excellent candidate experience and UX",
    ],
    keyWeaknesses: [
      "AI is augmentation (Co-Pilot), not core intelligence — no AI interviews or deep matching",
      "No AI-conducted screening or skills interviews",
      "No outbound AI sourcing from candidate databases",
      "Template-driven: teams outgrow rigid workflows",
      "Advanced reporting locked behind higher plans",
    ],
    allpsDifferentiators: [
      "ALLPS conducts AI interviews autonomously (screening + technical); Teamtailor only assists recruiters",
      "AI matching and ranking is deep, not surface-level keyword matching",
      "ALLPS is AI-native from the ground up vs. AI bolted onto a traditional ATS",
      "Full AI pipeline (source → match → interview → recommend) in one platform",
    ],
    threatLevel: "HIGH",
    threatReason: "Teamtailor is the go-to ATS for Nordic SMEs and growing in DACH. Excellent UX and brand. Risk: they add deeper AI features via Co-Pilot evolution.",
  },
  {
    name: "Workable",
    type: "Incumbent",
    hq: "Athens/Boston",
    founded: 2012,
    funding: "$102M raised",
    customers: "27,000+",
    segment: "All-in-one ATS + AI Sourcing",
    targetMarket: "SMBs globally (20–500 employees)",
    pricing: "From $189/month, transparent",
    keyStrengths: [
      "AI Recruiter sources from 400M+ profiles across 200+ sites",
      "Transparent, published pricing — rare in this market",
      "One-click job posting to 200+ boards",
      "Full-cycle: sourcing, ATS, video interviews, assessments, HR management",
      "15-day free trial, fast onboarding",
    ],
    keyWeaknesses: [
      "AI sourcing is broad but shallow — finds candidates, doesn't deeply assess them",
      "No AI-conducted interviews (screening or skills)",
      "Reporting is less sophisticated than enterprise platforms",
      "CRM/nurturing capabilities are lighter than Lever/Ashby",
      "Less European compliance depth than Personio or Teamtailor",
    ],
    allpsDifferentiators: [
      "ALLPS AI interviews screen and assess candidates; Workable only finds and tracks them",
      "AI-recommended candidates with explainable matching vs. basic AI resume ranking",
      "Swiss-based with nLPD/GDPR-native architecture vs. US-centric compliance",
      "Deeper candidate quality signal through AI interviews, not just resume parsing",
    ],
    threatLevel: "MEDIUM-HIGH",
    threatReason: "Workable is well-priced and fast to deploy. Popular with growing European startups. Risk: they're investing heavily in AI and could add interview capabilities.",
  },
  {
    name: "Ashby",
    type: "New Entrant",
    hq: "San Francisco, USA",
    founded: 2018,
    funding: "$62M raised",
    customers: "Growing rapidly in tech",
    segment: "All-in-one ATS + Analytics",
    targetMarket: "Tech startups/scaleups (Series A → Enterprise)",
    pricing: "From $400/month",
    keyStrengths: [
      "Best-in-class recruiting analytics and custom reporting",
      "True all-in-one: ATS + CRM + Sourcing + Scheduling + Analytics",
      "AI candidate filtering with natural language queries",
      "Exceptional workflow automation with conditional logic",
      "Loved by tech recruiting teams; fastest-growing in the segment",
    ],
    keyWeaknesses: [
      "No AI interviews or AI-conducted screening",
      "Expensive for smaller SMEs ($400/mo minimum)",
      "US-centric; European compliance and localization still maturing",
      "No free trial — requires sales engagement",
      "Complexity can overwhelm lean HR teams without dedicated TA function",
    ],
    allpsDifferentiators: [
      "ALLPS serves lean SME teams with no dedicated recruiter; Ashby assumes TA professionals",
      "AI interviews replace the screening step entirely — Ashby doesn't automate the interview",
      "More accessible price point for European SMEs",
      "Swiss/European compliance-first architecture vs. US-first, Europe-adapted",
    ],
    threatLevel: "MEDIUM",
    threatReason: "Ashby is the darling of tech scaleups. Less of a direct threat to DACH SMEs today, but expanding into Europe and could encroach on the scaleup segment.",
  },
  {
    name: "Greenhouse",
    type: "Incumbent",
    hq: "New York, USA",
    founded: 2012,
    funding: "$110M raised",
    customers: "7,500+",
    segment: "Structured Hiring ATS",
    targetMarket: "Mid-market to Enterprise (Series B+ / 100–5,000)",
    pricing: "From ~$5,100/year",
    keyStrengths: [
      "#1 ATS on G2 (Winter 2026); massive market trust",
      "Structured hiring philosophy: scorecards, interview kits, DE&I reporting",
      "600+ integrations — largest ecosystem",
      "Best compliance framework (EEOC, GDPR, global)",
      "Industry standard that professional recruiters already know",
    ],
    keyWeaknesses: [
      "Expensive and complex for SMEs — overkill for 20-person startup",
      "No AI interviews, no AI-conducted screening",
      "AI features are incremental (resume formatting, job description help), not transformative",
      "Slow to implement; requires training",
      "Not built for lean teams without professional TA function",
    ],
    allpsDifferentiators: [
      "ALLPS replaces the need for a large TA team with AI automation; Greenhouse amplifies existing TA teams",
      "AI end-to-end pipeline vs. structured-but-manual hiring process",
      "Purpose-built for resource-constrained SMEs vs. process-heavy enterprises",
      "Faster time-to-value: AI starts working Day 1 vs. weeks of setup",
    ],
    threatLevel: "LOW-MEDIUM",
    threatReason: "Greenhouse dominates mid-market/enterprise. Less relevant for DACH SMEs due to price and complexity. Risk if they launch a 'Greenhouse Lite' for SMBs.",
  },
  {
    name: "SmartRecruiters (SAP)",
    type: "Incumbent",
    hq: "San Francisco / SAP (Walldorf, DE)",
    founded: 2010,
    funding: "Acquired by SAP (Sept 2025)",
    customers: "Enterprise focus",
    segment: "Enterprise ATS + AI",
    targetMarket: "Large enterprises (500+ employees)",
    pricing: "From $14,995/year",
    keyStrengths: [
      "Now part of SAP — massive DACH enterprise presence",
      "Winston Intelligence: AI screening, matching, scheduling (97% reduction)",
      "Free SmartStart tier for testing",
      "Global compliance and multi-region hiring",
      "Claims 70% time-to-hire reduction",
    ],
    keyWeaknesses: [
      "Enterprise pricing — out of reach for most SMEs",
      "SAP acquisition creating pricing uncertainty in 2026",
      "SmartStart free tier capped at 10 jobs, no AI/CRM",
      "Complex implementation requiring dedicated resources",
      "Potential SAP lock-in risk",
    ],
    allpsDifferentiators: [
      "ALLPS targets the SME gap that SAP/SmartRecruiters can't serve efficiently",
      "Self-service AI that works for 1-person HR teams vs. enterprise deployment model",
      "AI interviews are a fundamentally different capability than SmartRecruiters' AI screening",
      "Nimble, fast-moving product vs. enterprise software update cycles",
    ],
    threatLevel: "LOW",
    threatReason: "SAP/SmartRecruiters play in enterprise. Indirect threat: SAP could push SmartRecruiters into DACH Mittelstand through existing SAP customer base.",
  },
  {
    name: "Lever (Employ Inc.)",
    type: "Incumbent",
    hq: "San Francisco, USA",
    founded: 2012,
    funding: "Merged into Employ Inc.",
    customers: "5,000+",
    segment: "ATS + CRM (TRM)",
    targetMarket: "Mid-market tech companies",
    pricing: "Custom (LeverTRM tiers)",
    keyStrengths: [
      "Best CRM/talent relationship management in the market",
      "Unified pipeline: active applicants + passive prospects together",
      "Strong automation and candidate nurturing",
      "Good mid-market pricing relative to Greenhouse",
      "AI Interview Companion for engagement insights",
    ],
    keyWeaknesses: [
      "Part of Employ Inc. consolidation — product direction uncertain",
      "No AI-conducted interviews or autonomous screening",
      "Limited European compliance depth",
      "CRM strength is less relevant for SMEs with low-volume hiring",
      "Reporting less advanced than Ashby",
    ],
    allpsDifferentiators: [
      "ALLPS automates the entire top-of-funnel with AI; Lever helps manage relationships after humans engage",
      "AI interviews create structured assessment data; Lever relies on human interview quality",
      "Better fit for European SME compliance requirements",
      "More affordable and faster to deploy for small teams",
    ],
    threatLevel: "LOW",
    threatReason: "Lever is strong for mid-market tech CRM needs but not a natural fit for DACH/Nordic SMEs. Employ Inc. consolidation may slow innovation.",
  },
  {
    name: "Ribbon AI",
    type: "New Entrant",
    hq: "San Francisco, USA",
    founded: 2021,
    funding: "Venture-backed",
    customers: "Growing, SMB focus",
    segment: "AI Interviewing + ATS features",
    targetMarket: "SMBs wanting AI-led screening",
    pricing: "Custom pricing",
    keyStrengths: [
      "AI-led voice/video interviews at scale",
      "Automated resume screening + candidate matching",
      "White-label AI interviewer (brand-customizable)",
      "40+ integrations with existing hiring tools",
      "SOC II, GDPR, NYC 2021/144 compliant",
    ],
    keyWeaknesses: [
      "Relatively new — smaller user base and ecosystem",
      "Focused on interviews; not a full ATS",
      "US-market primary focus; limited European presence",
      "No AI sourcing from candidate databases",
      "Requires pairing with an ATS for full workflow",
    ],
    allpsDifferentiators: [
      "ALLPS is a complete platform (ATS + Sourcing + Matching + Interviews); Ribbon is interviews-only",
      "European-first with Swiss data residency and nLPD compliance",
      "Full AI-native ATS workflow eliminates need for multiple tools",
      "AI skills interviews in addition to screening — deeper assessment",
    ],
    threatLevel: "MEDIUM",
    threatReason: "Ribbon is the closest functional competitor on AI interviews. If they expand to full ATS and enter Europe, they become a direct threat.",
  },
  {
    name: "Carv",
    type: "New Entrant",
    hq: "Amsterdam, Netherlands",
    founded: 2020,
    funding: "Venture-backed",
    customers: "DHL, G4S, Carrefour",
    segment: "Agentic AI for Volume Hiring",
    targetMarket: "Staffing agencies & high-volume hiring",
    pricing: "Custom enterprise pricing",
    keyStrengths: [
      "European-headquartered AI recruitment platform",
      "Agentic AI: library of specialized agents for each hiring step",
      "Automates intake calls, screening, scheduling, compliance",
      "Strong enterprise clients (DHL, G4S, Carrefour)",
      "ISO + SOC 2 Type II certified",
    ],
    keyWeaknesses: [
      "Focused on volume/staffing hiring — not SME professional roles",
      "Enterprise-oriented pricing and deployment",
      "Still relatively new to market with limited SME traction",
      "Agents are task-specific; less of an integrated ATS experience",
      "No career site builder or employer branding tools",
    ],
    allpsDifferentiators: [
      "ALLPS targets SME professional hiring; Carv targets volume/staffing",
      "Integrated ATS with employer-facing workflow vs. agent library overlay",
      "AI interviews for knowledge-worker roles (skills assessment) vs. volume screening",
      "Self-service platform vs. enterprise deployment requiring support",
    ],
    threatLevel: "LOW-MEDIUM",
    threatReason: "Carv is European and AI-native — philosophically aligned. If they pivot downstream to SME professional hiring, they become a real threat.",
  },
  {
    name: "Paradox (Olivia)",
    type: "New Entrant",
    hq: "Scottsdale, USA",
    founded: 2016,
    funding: "$300M+ raised",
    customers: "McDonald's, GM, FedEx",
    segment: "Conversational AI / High-Volume",
    targetMarket: "Enterprise high-volume hourly hiring",
    pricing: "Enterprise custom (~$1K+/month)",
    keyStrengths: [
      "Best-in-class conversational AI (Olivia) — 24/7, 100+ languages",
      "85% application completion rate (vs. 50% baseline)",
      "Automates 90% of hiring process for volume roles",
      "Multi-channel: SMS, WhatsApp, web chat, Facebook Messenger",
      "Multiple 'Best HR Product' awards",
    ],
    keyWeaknesses: [
      "Built for hourly/frontline hiring — poor fit for professional roles",
      "Enterprise pricing, not accessible to SMEs",
      "Can feel impersonal to candidates in professional roles",
      "Not a full ATS — integrates with existing systems",
      "Limited European SME presence",
    ],
    allpsDifferentiators: [
      "ALLPS targets professional/knowledge-worker hiring; Paradox targets volume/hourly",
      "AI interviews assess job skills depth; Olivia asks screening knockout questions",
      "Complete ATS for SMEs vs. enterprise bolt-on",
      "European compliance-first vs. US-first with EU adaptation",
    ],
    threatLevel: "LOW",
    threatReason: "Different segment entirely (volume hourly vs. professional SME). Only a threat if they create a 'Paradox for Professional Hiring' product.",
  },
];

const featureMatrix = [
  { feature: "AI CV Screening & Matching", allps: true, personio: false, teamtailor: "partial", workable: true, ashby: true, greenhouse: false, ribbon: true, carv: true },
  { feature: "AI-Conducted Interviews (Screening)", allps: true, personio: false, teamtailor: false, workable: false, ashby: false, greenhouse: false, ribbon: true, carv: true },
  { feature: "AI Skills/Technical Interviews", allps: true, personio: false, teamtailor: false, workable: false, ashby: false, greenhouse: false, ribbon: false, carv: false },
  { feature: "AI-Recommended Candidates", allps: true, personio: false, teamtailor: false, workable: true, ashby: "partial", greenhouse: false, ribbon: false, carv: false },
  { feature: "AI Sourcing (Passive Candidates)", allps: true, personio: false, teamtailor: false, workable: true, ashby: true, greenhouse: false, ribbon: false, carv: false },
  { feature: "Full ATS Workflow", allps: true, personio: true, teamtailor: true, workable: true, ashby: true, greenhouse: true, ribbon: false, carv: false },
  { feature: "Career Site / Employer Branding", allps: true, personio: true, teamtailor: true, workable: true, ashby: true, greenhouse: true, ribbon: false, carv: false },
  { feature: "European Data Residency", allps: true, personio: true, teamtailor: true, workable: "partial", ashby: false, greenhouse: "partial", ribbon: "partial", carv: true },
  { feature: "GDPR/nLPD Native Compliance", allps: true, personio: true, teamtailor: true, workable: "partial", ashby: "partial", greenhouse: true, ribbon: true, carv: true },
  { feature: "DACH Market Focus", allps: true, personio: true, teamtailor: "partial", workable: false, ashby: false, greenhouse: false, ribbon: false, carv: "partial" },
  { feature: "SME-Friendly Pricing", allps: true, personio: true, teamtailor: true, workable: true, ashby: false, greenhouse: false, ribbon: "partial", carv: false },
  { feature: "Browser Extension", allps: true, personio: false, teamtailor: false, workable: false, ashby: false, greenhouse: true, ribbon: false, carv: false },
  { feature: "Candidate Talent Platform", allps: true, personio: false, teamtailor: false, workable: false, ashby: false, greenhouse: false, ribbon: false, carv: false },
];

function FeatureIcon({ val }) {
  if (val === true) return <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 18 }}>●</span>;
  if (val === "partial") return <span style={{ color: "#eab308", fontWeight: 700, fontSize: 18 }}>◐</span>;
  return <span style={{ color: "#4a4a5a", fontWeight: 700, fontSize: 18 }}>○</span>;
}

function ThreatBadge({ level }) {
  const colors = {
    HIGH: { bg: "#dc2626", text: "#fff" },
    "MEDIUM-HIGH": { bg: "#ea580c", text: "#fff" },
    MEDIUM: { bg: "#d97706", text: "#fff" },
    "LOW-MEDIUM": { bg: "#65a30d", text: "#fff" },
    LOW: { bg: "#16a34a", text: "#fff" },
  };
  const c = colors[level] || colors.MEDIUM;
  return (
    <span style={{ background: c.bg, color: c.text, padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
      {level}
    </span>
  );
}

function TypeBadge({ type }) {
  const isNew = type === "New Entrant";
  return (
    <span style={{ background: isNew ? "rgba(99,102,241,0.15)" : "rgba(234,179,8,0.15)", color: isNew ? "#818cf8" : "#ca8a04", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, letterSpacing: 0.3 }}>
      {type}
    </span>
  );
}

export default function CompetitiveAnalysis() {
  const [view, setView] = useState("overview");
  const [selected, setSelected] = useState(null);

  const font = "'Instrument Serif', Georgia, serif";
  const mono = "'JetBrains Mono', 'Fira Code', monospace";
  const sans = "'DM Sans', 'Helvetica Neue', sans-serif";

  return (
    <div style={{ fontFamily: sans, background: "linear-gradient(180deg, #0a0a12 0%, #0f0f1a 100%)", minHeight: "100vh", color: "#e4e4ef", padding: 0 }}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "32px 32px 24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 6 }}>
          <h1 style={{ fontFamily: font, fontSize: 36, fontWeight: 400, margin: 0, color: "#fff", letterSpacing: -0.5 }}>
            Competitive Landscape
          </h1>
          <span style={{ fontFamily: mono, fontSize: 12, color: "#6b6b7b", letterSpacing: 1 }}>
            ALLPS.AI — APRIL 2026
          </span>
        </div>
        <p style={{ margin: "8px 0 20px", color: "#8888a0", fontSize: 14, maxWidth: 700, lineHeight: 1.6 }}>
          AI-Native Hiring Platform benchmarked against incumbents and new entrants across the European SME / Startup / Scaleup segment — DACH & Nordics focus.
        </p>
        <div style={{ display: "flex", gap: 2 }}>
          {[
            { key: "overview", label: "Market Map" },
            { key: "matrix", label: "Feature Matrix" },
            { key: "details", label: "Competitor Deep-Dives" },
            { key: "positioning", label: "Strategic Positioning" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setView(t.key); setSelected(null); }}
              style={{
                fontFamily: sans, fontSize: 13, fontWeight: view === t.key ? 600 : 400,
                padding: "10px 20px", border: "none", cursor: "pointer", borderRadius: "6px 6px 0 0",
                background: view === t.key ? "rgba(255,255,255,0.06)" : "transparent",
                color: view === t.key ? "#fff" : "#6b6b7b",
                transition: "all 0.2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 32px 48px" }}>

        {/* MARKET MAP */}
        {view === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontFamily: font, fontStyle: "italic", fontSize: 20, fontWeight: 400, margin: "0 0 16px", color: "#c4b5fd" }}>Incumbents</h3>
                <p style={{ fontSize: 12, color: "#7a7a90", margin: "0 0 16px", lineHeight: 1.5 }}>Established platforms with existing DACH/Nordic customer bases. These are the tools your target buyers are currently using.</p>
                {competitors.filter(c => c.type === "Incumbent").map(c => (
                  <div key={c.name} onClick={() => { setView("details"); setSelected(c.name); }}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 8, marginBottom: 6, cursor: "pointer", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(196,181,253,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)"; }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>{c.name}</span>
                      <span style={{ fontSize: 12, color: "#6b6b7b", marginLeft: 10 }}>{c.segment}</span>
                    </div>
                    <ThreatBadge level={c.threatLevel} />
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontFamily: font, fontStyle: "italic", fontSize: 20, fontWeight: 400, margin: "0 0 16px", color: "#67e8f9" }}>New Entrants</h3>
                <p style={{ fontSize: 12, color: "#7a7a90", margin: "0 0 16px", lineHeight: 1.5 }}>AI-native platforms building new categories. These are the players redefining what a hiring platform can do.</p>
                {competitors.filter(c => c.type === "New Entrant").map(c => (
                  <div key={c.name} onClick={() => { setView("details"); setSelected(c.name); }}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 8, marginBottom: 6, cursor: "pointer", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(103,232,249,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)"; }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>{c.name}</span>
                      <span style={{ fontSize: 12, color: "#6b6b7b", marginLeft: 10 }}>{c.segment}</span>
                    </div>
                    <ThreatBadge level={c.threatLevel} />
                  </div>
                ))}
              </div>
            </div>

            {/* Threat Summary */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 24 }}>
              <h3 style={{ fontFamily: font, fontStyle: "italic", fontSize: 20, fontWeight: 400, margin: "0 0 16px", color: "#fbbf24" }}>Threat Assessment Summary</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", margin: "0 0 6px" }}>⚠ Primary Threats</p>
                  <p style={{ fontSize: 13, color: "#a0a0b0", lineHeight: 1.7, margin: 0 }}>
                    <strong style={{ color: "#e4e4ef" }}>Personio</strong> — owns the DACH SME HR stack. Even with a weak ATS, they're the default. If they acquire or build AI recruiting, it's a critical threat.<br/>
                    <strong style={{ color: "#e4e4ef" }}>Teamtailor</strong> — owns the Nordic SME segment with superior UX. Their AI Co-Pilot is evolving and could close the gap.
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#22c55e", margin: "0 0 6px" }}>✦ ALLPS Unique Position</p>
                  <p style={{ fontSize: 13, color: "#a0a0b0", lineHeight: 1.7, margin: 0 }}>
                    No competitor in the DACH/Nordic SME segment combines <strong style={{ color: "#e4e4ef" }}>AI Sourcing + AI Matching + AI Interviews (Screening & Skills) + Full ATS</strong> in one platform. This end-to-end AI-native architecture is ALLPS's structural moat. The window is 12–18 months before incumbents close the gap.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FEATURE MATRIX */}
        {view === "matrix" && (
          <div style={{ overflowX: "auto" }}>
            <p style={{ fontSize: 13, color: "#7a7a90", marginBottom: 20 }}>
              <span style={{ color: "#22c55e" }}>●</span> Full capability &nbsp;&nbsp;
              <span style={{ color: "#eab308" }}>◐</span> Partial / basic &nbsp;&nbsp;
              <span style={{ color: "#4a4a5a" }}>○</span> Not available
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#8888a0", fontWeight: 500, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", minWidth: 220 }}>
                    Capability
                  </th>
                  {["ALLPS", "Personio", "Teamtailor", "Workable", "Ashby", "Greenhouse", "Ribbon", "Carv"].map(h => (
                    <th key={h} style={{ textAlign: "center", padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.08)", color: h === "ALLPS" ? "#c4b5fd" : "#8888a0", fontWeight: h === "ALLPS" ? 700 : 500, fontSize: 11, letterSpacing: 0.5, minWidth: 80 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureMatrix.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                    <td style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.03)", color: "#c4c4d4", fontSize: 13 }}>
                      {row.feature}
                    </td>
                    {["allps", "personio", "teamtailor", "workable", "ashby", "greenhouse", "ribbon", "carv"].map(k => (
                      <td key={k} style={{ textAlign: "center", padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.03)", background: k === "allps" ? "rgba(196,181,253,0.04)" : "transparent" }}>
                        <FeatureIcon val={row[k]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 24, background: "rgba(196,181,253,0.06)", border: "1px solid rgba(196,181,253,0.15)", borderRadius: 8, padding: 20 }}>
              <p style={{ margin: 0, fontSize: 13, color: "#c4b5fd", fontWeight: 600, marginBottom: 8 }}>Key Takeaway</p>
              <p style={{ margin: 0, fontSize: 13, color: "#b0b0c0", lineHeight: 1.7 }}>
                ALLPS AI is the only platform in this analysis that covers all 13 capabilities. The three columns that define ALLPS's structural differentiation are <strong style={{ color: "#e4e4ef" }}>AI-Conducted Screening Interviews</strong>, <strong style={{ color: "#e4e4ef" }}>AI Skills/Technical Interviews</strong>, and <strong style={{ color: "#e4e4ef" }}>Candidate Talent Platform</strong>. No incumbent or new entrant currently matches this combination in the European SME segment.
              </p>
            </div>
          </div>
        )}

        {/* COMPETITOR DEEP-DIVES */}
        {view === "details" && (
          <div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
              {competitors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelected(c.name)}
                  style={{
                    fontFamily: sans, fontSize: 12, fontWeight: selected === c.name ? 600 : 400,
                    padding: "8px 16px", border: "1px solid", cursor: "pointer", borderRadius: 6,
                    background: selected === c.name ? "rgba(255,255,255,0.08)" : "transparent",
                    borderColor: selected === c.name ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
                    color: selected === c.name ? "#fff" : "#8888a0",
                    transition: "all 0.15s",
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {selected && (() => {
              const c = competitors.find(x => x.name === selected);
              if (!c) return null;
              return (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div>
                      <h2 style={{ fontFamily: font, fontSize: 28, fontWeight: 400, margin: "0 0 8px", color: "#fff" }}>{c.name}</h2>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <TypeBadge type={c.type} />
                        <ThreatBadge level={c.threatLevel} />
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                    {[
                      { label: "HQ", value: c.hq },
                      { label: "Founded", value: c.founded },
                      { label: "Funding", value: c.funding },
                      { label: "Customers", value: c.customers },
                    ].map(m => (
                      <div key={m.label} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 6, padding: "12px 14px" }}>
                        <div style={{ fontFamily: mono, fontSize: 10, color: "#6b6b7b", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>{m.label}</div>
                        <div style={{ fontSize: 13, color: "#e4e4ef", fontWeight: 500 }}>{m.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                    {[
                      { label: "Segment", value: c.segment },
                      { label: "Target Market", value: c.targetMarket },
                      { label: "Pricing", value: c.pricing },
                    ].map(m => (
                      <div key={m.label} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 6, padding: "12px 14px" }}>
                        <div style={{ fontFamily: mono, fontSize: 10, color: "#6b6b7b", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>{m.label}</div>
                        <div style={{ fontSize: 13, color: "#e4e4ef" }}>{m.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                    <div>
                      <h4 style={{ fontFamily: mono, fontSize: 11, color: "#22c55e", letterSpacing: 0.5, textTransform: "uppercase", margin: "0 0 12px" }}>Strengths</h4>
                      {c.keyStrengths.map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: "#b0b0c0", lineHeight: 1.5 }}>
                          <span style={{ color: "#22c55e", flexShrink: 0 }}>+</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 style={{ fontFamily: mono, fontSize: 11, color: "#ef4444", letterSpacing: 0.5, textTransform: "uppercase", margin: "0 0 12px" }}>Weaknesses</h4>
                      {c.keyWeaknesses.map((w, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: "#b0b0c0", lineHeight: 1.5 }}>
                          <span style={{ color: "#ef4444", flexShrink: 0 }}>−</span>
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: "rgba(196,181,253,0.06)", border: "1px solid rgba(196,181,253,0.12)", borderRadius: 8, padding: 20, marginBottom: 20 }}>
                    <h4 style={{ fontFamily: mono, fontSize: 11, color: "#c4b5fd", letterSpacing: 0.5, textTransform: "uppercase", margin: "0 0 12px" }}>ALLPS Differentiators vs. {c.name}</h4>
                    {c.allpsDifferentiators.map((d, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: "#d4d4e4", lineHeight: 1.5 }}>
                        <span style={{ color: "#c4b5fd", flexShrink: 0 }}>◆</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.12)", borderRadius: 8, padding: 16 }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#fbbf24", fontWeight: 500, marginBottom: 4 }}>Threat Assessment</p>
                    <p style={{ margin: 0, fontSize: 13, color: "#b0b0c0", lineHeight: 1.6 }}>{c.threatReason}</p>
                  </div>
                </div>
              );
            })()}

            {!selected && (
              <div style={{ textAlign: "center", padding: 60, color: "#6b6b7b" }}>
                <p style={{ fontFamily: font, fontStyle: "italic", fontSize: 20 }}>Select a competitor above to see the deep-dive analysis</p>
              </div>
            )}
          </div>
        )}

        {/* STRATEGIC POSITIONING */}
        {view === "positioning" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
              <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontFamily: font, fontStyle: "italic", fontSize: 22, fontWeight: 400, margin: "0 0 16px", color: "#22c55e" }}>ALLPS Structural Moat</h3>
                <p style={{ fontSize: 13, color: "#b0b0c0", lineHeight: 1.7, margin: "0 0 16px" }}>
                  ALLPS AI occupies a unique position as the only European, AI-native, full-stack hiring platform targeting SMEs. The moat has three layers:
                </p>
                {[
                  { title: "1. End-to-End AI Pipeline", desc: "No competitor in this segment combines AI sourcing, AI matching, AI interviews (both screening and skills), and a full ATS in a single integrated platform. Incumbents have ATS with bolt-on AI; new entrants have point solutions." },
                  { title: "2. AI Interviews as Category Differentiator", desc: "AI-conducted screening AND job skills interviews are ALLPS's most defensible feature. This eliminates the biggest bottleneck in SME hiring (time-to-screen) while generating structured assessment data no ATS-only platform can match." },
                  { title: "3. European Compliance-First Architecture", desc: "Swiss HQ with nLPD compliance, European data residency, and GDPR-native design. US competitors (Ashby, Ribbon, Workable) adapt to EU regs as an afterthought. With the EU AI Act enforcement in August 2026, this becomes a competitive weapon." },
                ].map((m, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#e4e4ef" }}>{m.title}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9090a0", lineHeight: 1.6 }}>{m.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 10, padding: 24 }}>
                <h3 style={{ fontFamily: font, fontStyle: "italic", fontSize: 22, fontWeight: 400, margin: "0 0 16px", color: "#ef4444" }}>Critical Risks & Gaps</h3>
                {[
                  { title: "Personio Acqui-hires or Builds AI Recruiting", desc: "Personio's 15K customer base in DACH SMEs is the #1 distribution advantage. If they launch deep AI recruiting (interviewing, matching), ALLPS loses the 'complement' positioning and must compete head-on.", timing: "12–18 months" },
                  { title: "Teamtailor Co-Pilot Evolution", desc: "Teamtailor's AI Co-Pilot is a foundation. If they add AI-conducted interviews to their existing employer branding + ATS stack, they become extremely competitive in Nordics.", timing: "6–12 months" },
                  { title: "Integration Ecosystem Gap", desc: "Personio has 200+ integrations, Teamtailor 450+, Greenhouse 600+. ALLPS's integration ecosystem will be a buying factor for SMEs with existing HR stacks.", timing: "Ongoing" },
                  { title: "Brand Awareness in Target Segment", desc: "ALLPS has near-zero brand awareness vs. incumbents with thousands of customers. Distribution and GTM velocity are more important than feature parity.", timing: "Immediate" },
                ].map((r, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#e4e4ef" }}>{r.title}</p>
                      <span style={{ fontFamily: mono, fontSize: 10, color: "#ef4444" }}>{r.timing}</span>
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9090a0", lineHeight: 1.6 }}>{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 24, marginBottom: 28 }}>
              <h3 style={{ fontFamily: font, fontStyle: "italic", fontSize: 22, fontWeight: 400, margin: "0 0 20px", color: "#fff" }}>Competitive Positioning by Battleground</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  {
                    battle: "DACH SMEs (Current Personio users)",
                    strategy: "Position as AI recruiting complement to Personio HRIS",
                    message: '"Your HR lives in Personio. Your hiring intelligence lives in ALLPS."',
                    play: "Integration play: build Personio integration so customers don't need to choose. Win the recruiting workflow; let Personio keep HR admin.",
                  },
                  {
                    battle: "Nordic Scaleups (Current Teamtailor users)",
                    strategy: "Position on AI interviews as the capability Teamtailor can't match",
                    message: '"Teamtailor gets candidates in the door. ALLPS tells you which ones to hire."',
                    play: "Wedge play: offer AI interview + matching as a layer on top of Teamtailor, then expand to full ATS replacement.",
                  },
                  {
                    battle: "Net-New European Startups (No ATS yet)",
                    strategy: "Position as the first and only hiring platform a lean team needs",
                    message: '"One platform. Zero recruiters needed. AI handles sourcing through interviewing."',
                    play: "PLG play: free trial with AI job posting + matching. Convert on AI interviews. This is ALLPS's strongest battleground — no switching costs.",
                  },
                ].map((b, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: 18, border: "1px solid rgba(255,255,255,0.04)" }}>
                    <p style={{ fontFamily: mono, fontSize: 10, color: "#c4b5fd", letterSpacing: 0.5, textTransform: "uppercase", margin: "0 0 8px" }}>{b.battle}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#e4e4ef", margin: "0 0 8px" }}>{b.strategy}</p>
                    <p style={{ fontSize: 12, fontStyle: "italic", color: "#8888a0", margin: "0 0 10px" }}>{b.message}</p>
                    <p style={{ fontSize: 12, color: "#7a7a90", lineHeight: 1.6, margin: 0 }}>{b.play}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(196,181,253,0.08), rgba(103,232,249,0.05))", border: "1px solid rgba(196,181,253,0.15)", borderRadius: 10, padding: 24 }}>
              <h3 style={{ fontFamily: font, fontStyle: "italic", fontSize: 22, fontWeight: 400, margin: "0 0 16px", color: "#c4b5fd" }}>The 12-Month Strategic Imperative</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                {[
                  { q: "Q2 2026", actions: ["Ship Personio + Teamtailor integrations", "Launch EU AI Act compliance documentation", "Target 50 pilot customers in DACH"] },
                  { q: "Q3 2026", actions: ["EU AI Act enforcement (Aug 2): position as compliant-by-design", "Scale AI interviews as the hero feature in all GTM", "Build case studies with pilot customers"] },
                  { q: "Q4 2026", actions: ["Expand to Nordic markets via partner channel", "Launch candidate-facing talent platform publicly", "Hit 200 paying customers milestone"] },
                  { q: "Q1 2027", actions: ["Series A readiness with European traction data", "Integration ecosystem: 30+ HRIS/ATS connectors", "AI interview benchmark report: publish hiring quality data"] },
                ].map((q, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 16 }}>
                    <p style={{ fontFamily: mono, fontSize: 12, color: "#c4b5fd", fontWeight: 600, margin: "0 0 10px" }}>{q.q}</p>
                    {q.actions.map((a, j) => (
                      <p key={j} style={{ fontSize: 12, color: "#a0a0b0", lineHeight: 1.5, margin: "0 0 6px", paddingLeft: 12, borderLeft: "2px solid rgba(196,181,253,0.2)" }}>{a}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
