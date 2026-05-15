import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, BarChart, Bar } from "recharts";

// ── Design tokens ─────────────────────────────────────────────────────────────
const G = {
  green: "#16a36a",
  greenDark: "#0d7a4e",
  greenLight: "#e8f7f0",
  blue: "#1e3a5f",
  blueMid: "#2d5a9e",
  blueLight: "#eff6ff",
  amber: "#b45309",
  amberLight: "#fef9c3",
  purple: "#4f46e5",
  purpleLight: "#ede9fe",
  red: "#991b1b",
  redLight: "#fef2f2",
  gray50: "#f8fafc",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray400: "#94a3b8",
  gray600: "#475569",
  gray800: "#1e293b",
  white: "#ffffff",
};

// ── Credit pricing data ───────────────────────────────────────────────────────
const MODEL_A_PACKS = [
  { name: "Starter",  credits: 10,  chf: 59,  perCredit: 5.90 },
  { name: "Plus",     credits: 25,  chf: 119, perCredit: 4.76 },
  { name: "Growth",   credits: 50,  chf: 199, perCredit: 3.98 },
  { name: "Scale",    credits: 100, chf: 349, perCredit: 3.49 },
  { name: "Power",    credits: 250, chf: 749, perCredit: 3.00 },
];

const MODEL_B_TOPUPS = [
  { name: "Starter",  credits: 10,  chf: 39,  perCredit: 3.90 },
  { name: "Plus",     credits: 25,  chf: 89,  perCredit: 3.56 },
  { name: "Growth",   credits: 50,  chf: 159, perCredit: 3.18 },
  { name: "Scale",    credits: 100, chf: 289, perCredit: 2.89 },
  { name: "Power",    credits: 250, chf: 649, perCredit: 2.60 },
];

const MODEL_B_BASE_MONTHLY = 49;
const MODEL_B_INCLUDED_CREDITS = 10; // per month
const MODEL_B_ANNUAL_BASE = 490; // 2 months free

const COMPETITORS = [
  { name: "Softgarden", monthly: 179, model: "Flat subscription", note: "5 active jobs" },
  { name: "Coveto",     monthly: 79,  model: "Flat subscription", note: "German SME budget" },
  { name: "Workable",   monthly: 189, model: "Flat subscription", note: "Global SMB" },
  { name: "Teamtailor", monthly: 149, model: "Flat subscription", note: "Nordic/EU" },
  { name: "Recruitee",  monthly: 109, model: "Flat subscription", note: "EU scale-ups" },
];

const PROFILES = [
  { label: "Occasional hirer", jobs: 1, intMins: 30,  desc: "1–3 roles/month, light screening" },
  { label: "Active SME",        jobs: 3, intMins: 90,  desc: "3–5 roles/month, standard screening" },
  { label: "Growth company",    jobs: 6, intMins: 180, desc: "6–10 roles/month, full AI pipeline" },
  { label: "Scale-up",          jobs: 12, intMins: 360, desc: "10–15 roles/month, high volume" },
];

// ── Pricing calculation helpers ───────────────────────────────────────────────
function bestPackCost(packs, credits) {
  if (credits <= 0) return 0;
  // Find cheapest combination: try largest pack first
  let remaining = credits;
  let total = 0;
  const sorted = [...packs].sort((a, b) => b.credits - a.credits);
  for (const pack of sorted) {
    while (remaining >= pack.credits) {
      remaining -= pack.credits;
      total += pack.chf;
    }
  }
  // Remaining < smallest pack — buy smallest pack to cover
  if (remaining > 0) {
    total += sorted[sorted.length - 1].chf;
  }
  return total;
}

function costModelA(creditsPerMonth) {
  return bestPackCost(MODEL_A_PACKS, creditsPerMonth);
}

function costModelB(creditsPerMonth) {
  const base = MODEL_B_BASE_MONTHLY;
  const extra = Math.max(0, creditsPerMonth - MODEL_B_INCLUDED_CREDITS);
  const topup = bestPackCost(MODEL_B_TOPUPS, extra);
  return base + topup;
}

function creditsForUsage(jobs, intMins) {
  const jobCredits = jobs;
  const intCredits = Math.ceil(intMins / 10);
  return jobCredits + intCredits;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Chip({ children, color = G.green, bg }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
      background: bg || color + "18", color
    }}>{children}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: G.white, border: `1px solid ${G.gray200}`, borderRadius: 12,
      padding: "20px 24px", ...style
    }}>{children}</div>
  );
}

function MetricCard({ label, value, sub, accent = G.green }) {
  return (
    <div style={{
      background: G.gray50, borderRadius: 10, padding: "16px 18px",
      borderLeft: `3px solid ${accent}`
    }}>
      <div style={{ fontSize: 11, color: G.gray600, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: G.gray800, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: G.gray400, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function PackTable({ packs, title, accent, tag }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: G.gray800 }}>{title}</span>
        <Chip color={accent}>{tag}</Chip>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${G.gray200}` }}>
            {["Pack", "Credits", "Price (CHF)", "Per credit"].map(h => (
              <th key={h} style={{ padding: "6px 8px", textAlign: h === "Pack" ? "left" : "right", color: G.gray600, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {packs.map((p, i) => (
            <tr key={p.name} style={{ background: i % 2 === 0 ? "transparent" : G.gray50 }}>
              <td style={{ padding: "8px 8px", fontWeight: 600, color: G.gray800 }}>{p.name}</td>
              <td style={{ padding: "8px 8px", textAlign: "right", color: G.gray800 }}>{p.credits}</td>
              <td style={{ padding: "8px 8px", textAlign: "right", color: G.gray800, fontWeight: 600 }}>CHF {p.chf}</td>
              <td style={{ padding: "8px 8px", textAlign: "right", color: accent, fontWeight: 700 }}>CHF {p.perCredit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: G.white, border: `1px solid ${G.gray200}`, borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
      <div style={{ fontWeight: 700, color: G.gray800, marginBottom: 6 }}>{label} credits/month</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, display: "flex", gap: 8, justifyContent: "space-between" }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 700 }}>CHF {Math.round(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function PricingStrategy() {
  const [jobs, setJobs] = useState(3);
  const [intMins, setIntMins] = useState(90);
  const [activeTab, setActiveTab] = useState("calculator");

  const credits = creditsForUsage(jobs, intMins);
  const intCredits = Math.ceil(intMins / 10);
  const costA = costModelA(credits);
  const costB = costModelB(credits);
  const saving = costA - costB;
  const cheaperModel = saving > 0 ? "B" : saving < 0 ? "A" : "equal";
  const annualCostA = costA * 12;
  const annualCostB = MODEL_B_ANNUAL_BASE + (costB - MODEL_B_BASE_MONTHLY) * 12;

  // Break-even chart data
  const breakEvenData = useMemo(() => {
    return Array.from({ length: 41 }, (_, i) => {
      const c = i * 2;
      return { credits: c, "Model A — Pure PAYG": costModelA(c), "Model B — Base + PAYG": costModelB(c) };
    });
  }, []);

  // Profile comparison data
  const profileData = PROFILES.map(p => {
    const c = creditsForUsage(p.jobs, p.intMins);
    return {
      name: p.label,
      "Model A": costModelA(c) * 12,
      "Model B": MODEL_B_ANNUAL_BASE + Math.max(0, (costModelB(c) - MODEL_B_BASE_MONTHLY)) * 12,
      credits: c,
    };
  });

  const tabs = [
    { key: "calculator", label: "Usage calculator" },
    { key: "packs", label: "Pack pricing" },
    { key: "breakeven", label: "Break-even analysis" },
    { key: "benchmarks", label: "Market benchmarks" },
    { key: "recommendation", label: "Recommendation" },
  ];

  const tabStyle = (key) => ({
    padding: "8px 16px", border: "none", cursor: "pointer", borderRadius: 6,
    fontSize: 13, fontWeight: activeTab === key ? 700 : 400,
    background: activeTab === key ? G.green : "transparent",
    color: activeTab === key ? G.white : G.gray600,
    transition: "all 0.15s",
  });

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", color: G.gray800, maxWidth: 900, margin: "0 auto", padding: "0 0 48px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital@1&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${G.gray200}`, paddingBottom: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: G.green, letterSpacing: 1, textTransform: "uppercase" }}>ALLPS AI · ATS on Demand</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 28, fontWeight: 400, margin: "0 0 6px", color: G.blue }}>
          Credit Pricing Strategy
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: G.gray600 }}>
          Comparing <strong>Model A</strong> (pure pay-as-you-go) vs <strong>Model B</strong> (low base subscription + PAYG top-ups) · 1 credit = 1 job posting or 10 interview minutes
        </p>
      </div>

      {/* Credit definition bar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <div style={{ background: G.greenLight, border: `1px solid ${G.green}30`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: G.green, lineHeight: 1 }}>1</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: G.green, textTransform: "uppercase", letterSpacing: 0.5 }}>Credit =</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: G.blue }}>1 active job posting</div>
            <div style={{ fontSize: 12, color: G.gray600 }}>Unlimited applicants per job</div>
          </div>
        </div>
        <div style={{ background: G.purpleLight, border: `1px solid ${G.purple}30`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: G.purple, lineHeight: 1 }}>1</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: G.purple, textTransform: "uppercase", letterSpacing: 0.5 }}>Credit =</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: G.blue }}>10 AI interview minutes</div>
            <div style={{ fontSize: 12, color: G.gray600 }}>Screening + skills interviews</div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={tabStyle(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* ── TAB: CALCULATOR ── */}
      {activeTab === "calculator" && (
        <div>
          <Card style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: G.blue, marginBottom: 16 }}>Configure your monthly usage</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: G.gray800 }}>Job postings per month</label>
                  <span style={{ fontSize: 16, fontWeight: 800, color: G.green }}>{jobs}</span>
                </div>
                <input type="range" min={0} max={20} step={1} value={jobs}
                  onChange={e => setJobs(+e.target.value)}
                  style={{ width: "100%", accentColor: G.green }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: G.gray400, marginTop: 4 }}>
                  <span>0</span><span>= {jobs} credit{jobs !== 1 ? "s" : ""}</span><span>20</span>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: G.gray800 }}>AI interview minutes per month</label>
                  <span style={{ fontSize: 16, fontWeight: 800, color: G.purple }}>{intMins}</span>
                </div>
                <input type="range" min={0} max={600} step={10} value={intMins}
                  onChange={e => setIntMins(+e.target.value)}
                  style={{ width: "100%", accentColor: G.purple }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: G.gray400, marginTop: 4 }}>
                  <span>0 min</span><span>= {intCredits} credit{intCredits !== 1 ? "s" : ""}</span><span>600 min</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: "10px 14px", background: G.gray50, borderRadius: 8, fontSize: 13, color: G.gray600 }}>
              <strong style={{ color: G.gray800 }}>{credits} total credits/month</strong> — {jobs} job credit{jobs !== 1 ? "s" : ""} + {intCredits} interview credit{intCredits !== 1 ? "s" : ""} ({intMins} min ÷ 10)
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {/* Model A */}
            <Card style={{ borderTop: `3px solid ${G.blueMid}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: G.blueMid, textTransform: "uppercase", letterSpacing: 0.5 }}>Model A</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: G.blue }}>Pure pay-as-you-go</div>
                </div>
                <Chip color={G.blueMid}>No subscription</Chip>
              </div>
              <div style={{ fontSize: 11, color: G.gray600, marginBottom: 16 }}>No base fee · Buy credit packs as needed · 12-month validity · Full rollover</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <MetricCard label="Monthly cost" value={`CHF ${costA}`} sub="best pack combination" accent={G.blueMid} />
                <MetricCard label="Annual cost" value={`CHF ${annualCostA}`} sub="12 × monthly" accent={G.blueMid} />
              </div>
              <div style={{ marginTop: 12, fontSize: 13, color: G.gray600 }}>
                Per credit this month: <strong style={{ color: G.gray800 }}>CHF {credits > 0 ? (costA / credits).toFixed(2) : "—"}</strong>
              </div>
            </Card>

            {/* Model B */}
            <Card style={{ borderTop: `3px solid ${G.green}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: G.green, textTransform: "uppercase", letterSpacing: 0.5 }}>Model B</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: G.blue }}>Base subscription + PAYG</div>
                </div>
                <Chip color={G.green}>CHF 49/month</Chip>
              </div>
              <div style={{ fontSize: 11, color: G.gray600, marginBottom: 16 }}>CHF 49/mo base · Includes 10 credits/mo · Lower top-up rates · CHF 490/yr billed annually</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <MetricCard label="Monthly cost" value={`CHF ${costB}`} sub={`CHF 49 base + top-ups`} accent={G.green} />
                <MetricCard label="Annual cost" value={`CHF ${annualCostB}`} sub="annual billing + top-ups" accent={G.green} />
              </div>
              <div style={{ marginTop: 12, fontSize: 13, color: G.gray600 }}>
                Per credit this month: <strong style={{ color: G.gray800 }}>CHF {credits > 0 ? (costB / credits).toFixed(2) : "—"}</strong>
              </div>
            </Card>
          </div>

          {/* Verdict */}
          {credits === 0 ? (
            <div style={{ background: G.gray50, border: `1px solid ${G.gray200}`, borderRadius: 10, padding: "16px 20px", fontSize: 14, color: G.gray600, textAlign: "center" }}>
              Set your usage above to see the cost comparison.
            </div>
          ) : cheaperModel === "A" ? (
            <div style={{ background: G.blueLight, border: `1px solid ${G.blueMid}30`, borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ fontWeight: 700, color: G.blue, marginBottom: 4 }}>✦ Model A is cheaper for this usage — save CHF {Math.abs(saving)}/month (CHF {Math.abs(saving) * 12}/year)</div>
              <div style={{ fontSize: 13, color: G.gray600 }}>At {credits} credits/month, the pure PAYG model costs less. Model B's CHF 49 base fee isn't offset by the included 10 credits and cheaper top-up rates at this volume. Typical for: occasional hirers with fewer than 8–9 credits/month.</div>
            </div>
          ) : cheaperModel === "B" ? (
            <div style={{ background: G.greenLight, border: `1px solid ${G.green}30`, borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ fontWeight: 700, color: G.greenDark, marginBottom: 4 }}>✦ Model B is cheaper for this usage — save CHF {Math.abs(saving)}/month (CHF {Math.abs(saving) * 12}/year)</div>
              <div style={{ fontSize: 13, color: G.gray600 }}>At {credits} credits/month, the subscription base + lower top-up rates beat pure PAYG. The CHF 49 base fee is more than offset by the included 10 credits (worth CHF {(10 * MODEL_A_PACKS[0].perCredit).toFixed(0)} at PAYG rates) and cheaper additional credits. Typical for: active SMEs hiring 3+ roles/month.</div>
            </div>
          ) : (
            <div style={{ background: G.amberLight, border: `1px solid ${G.amber}30`, borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ fontWeight: 700, color: G.amber, marginBottom: 4 }}>Both models cost the same at this usage level.</div>
              <div style={{ fontSize: 13, color: G.gray600 }}>This is exactly the break-even point. For occasional hirers, prefer Model A (no commitment). For companies expecting to grow hiring volume, Model B locks in lower per-credit rates as volume increases.</div>
            </div>
          )}

          {/* Quick profiles */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: G.gray600, marginBottom: 10 }}>Quick profiles</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {PROFILES.map(p => (
                <button key={p.label} onClick={() => { setJobs(p.jobs); setIntMins(p.intMins); }}
                  style={{ textAlign: "left", padding: "12px 14px", border: `1px solid ${G.gray200}`, borderRadius: 8, cursor: "pointer", background: G.white, transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = G.green}
                  onMouseLeave={e => e.currentTarget.style.borderColor = G.gray200}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: G.blue }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: G.gray600 }}>{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: PACKS ── */}
      {activeTab === "packs" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <PackTable packs={MODEL_A_PACKS} title="Model A — Pure PAYG credit packs" accent={G.blueMid} tag="No subscription" />
            <div style={{ marginTop: 16, padding: "12px 14px", background: G.blueLight, borderRadius: 8, fontSize: 13, color: G.gray600 }}>
              <strong style={{ color: G.blue }}>Policy:</strong> Credits valid 12 months from purchase. Unused credits roll over within validity period. No cap on rollover balance. No monthly fee ever.
            </div>
          </Card>
          <Card>
            <div style={{ marginBottom: 14, padding: "12px 14px", background: G.greenLight, borderRadius: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: G.green }}>Base subscription</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: G.blue }}>CHF 49<span style={{ fontSize: 14, fontWeight: 400 }}>/month</span></div>
              <div style={{ fontSize: 12, color: G.gray600 }}>CHF 490/year billed annually (2 months free) · Includes 10 credits/month · Unused monthly credits roll to next month (max 3-month bank = 30 credits)</div>
            </div>
            <PackTable packs={MODEL_B_TOPUPS} title="Model B — Top-up packs (subscription required)" accent={G.green} tag="Lower rates" />
            <div style={{ marginTop: 16, padding: "12px 14px", background: G.greenLight, borderRadius: 8, fontSize: 13, color: G.gray600 }}>
              <strong style={{ color: G.greenDark }}>Policy:</strong> Top-up packs valid 12 months. Base subscription credits roll up to 30 (3-month cap prevents excessive banking). Cancel subscription anytime — remaining purchased top-up credits stay valid until their 12-month expiry.
            </div>
          </Card>

          {/* Gross margin table */}
          <Card style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: G.blue, marginBottom: 4 }}>Gross margin analysis</div>
            <div style={{ fontSize: 12, color: G.gray600, marginBottom: 16 }}>Estimated ALLPS infrastructure cost per credit: CHF 0.80–1.20 (LLM processing, storage, infrastructure). Job posting credits have near-zero marginal cost; interview credits are the primary variable cost driver.</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${G.gray200}` }}>
                  {["Pack", "Selling price/credit", "Est. cost/credit", "Gross margin"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "right", color: G.gray600, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4, "&:first-child": { textAlign: "left" } }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Model A — Starter (10 cr)", 5.90, 1.00, "83%"],
                  ["Model A — Growth (50 cr)", 3.98, 1.00, "75%"],
                  ["Model A — Power (250 cr)", 3.00, 1.00, "67%"],
                  ["Model B — Base sub (included)", 4.90, 1.00, "80%"],
                  ["Model B — Growth top-up", 3.18, 1.00, "69%"],
                  ["Model B — Power top-up", 2.60, 1.00, "62%"],
                ].map(([name, sell, cost, margin], i) => (
                  <tr key={name} style={{ background: i % 2 === 0 ? "transparent" : G.gray50 }}>
                    <td style={{ padding: "8px 10px", fontWeight: 500, color: G.gray800 }}>{name}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right" }}>CHF {sell.toFixed(2)}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", color: G.gray600 }}>~CHF {cost.toFixed(2)}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, color: parseFloat(margin) >= 70 ? G.green : G.amber }}>{margin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12, fontSize: 12, color: G.gray400 }}>Note: Cost per credit is an estimate and varies based on interview length mix, LLM provider rates, and infrastructure. Target blended gross margin: 65–70%. Both models achieve this at mid-to-large pack sizes.</div>
          </Card>
        </div>
      )}

      {/* ── TAB: BREAK-EVEN ── */}
      {activeTab === "breakeven" && (
        <div>
          <Card style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: G.blue, marginBottom: 4 }}>Monthly cost by credit volume</div>
            <div style={{ fontSize: 13, color: G.gray600, marginBottom: 20 }}>Where the lines cross is the break-even point. Below it, Model A is cheaper. Above it, Model B is cheaper.</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={breakEvenData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={G.gray200} />
                <XAxis dataKey="credits" label={{ value: "Credits/month", position: "insideBottom", offset: -4, fontSize: 12, fill: G.gray600 }} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={v => `CHF ${v}`} tick={{ fontSize: 12 }} width={75} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
                <ReferenceLine x={8} stroke={G.amber} strokeDasharray="4 3" label={{ value: "Break-even ~8 credits", position: "insideTopRight", fontSize: 11, fill: G.amber }} />
                <Line type="stepAfter" dataKey="Model A — Pure PAYG" stroke={G.blueMid} strokeWidth={2.5} dot={false} />
                <Line type="stepAfter" dataKey="Model B — Base + PAYG" stroke={G.green} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            <MetricCard label="Break-even point" value="~8 credits/mo" sub="~2 jobs + 60 min interviews" accent={G.amber} />
            <MetricCard label="Model A wins" value="0–7 credits/mo" sub="≤ 1–2 roles + light screening" accent={G.blueMid} />
            <MetricCard label="Model B wins" value="9+ credits/mo" sub="≥ 2–3 roles + regular screening" accent={G.green} />
          </div>

          <Card style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: G.blue, marginBottom: 4 }}>Annual cost by company profile</div>
            <div style={{ fontSize: 13, color: G.gray600, marginBottom: 20 }}>Annual billing used for Model B (CHF 490/yr base). Top-ups calculated monthly at best pack rates.</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={profileData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={G.gray200} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={v => `CHF ${v}`} tick={{ fontSize: 11 }} width={75} />
                <Tooltip formatter={(v, name) => [`CHF ${Math.round(v)}`, name]} />
                <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
                <Bar dataKey="Model A" fill={G.blueMid} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Model B" fill={G.green} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, color: G.blue, marginBottom: 12 }}>Break-even detail by profile</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${G.gray200}` }}>
                  {["Profile", "Monthly credits", "Model A (annual)", "Model B (annual)", "Cheaper by"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: h === "Profile" ? "left" : "right", color: G.gray600, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PROFILES.map((p, i) => {
                  const c = creditsForUsage(p.jobs, p.intMins);
                  const annA = costModelA(c) * 12;
                  const annB = MODEL_B_ANNUAL_BASE + Math.max(0, (costModelB(c) - MODEL_B_BASE_MONTHLY)) * 12;
                  const diff = annA - annB;
                  const winner = diff > 0 ? `Model B saves CHF ${Math.round(diff)}` : diff < 0 ? `Model A saves CHF ${Math.round(-diff)}` : "Equal";
                  const wColor = diff > 0 ? G.green : diff < 0 ? G.blueMid : G.amber;
                  return (
                    <tr key={p.label} style={{ background: i % 2 === 0 ? "transparent" : G.gray50 }}>
                      <td style={{ padding: "10px 10px", fontWeight: 600, color: G.gray800 }}>
                        {p.label}
                        <div style={{ fontSize: 11, fontWeight: 400, color: G.gray400 }}>{p.desc}</div>
                      </td>
                      <td style={{ padding: "10px 10px", textAlign: "right" }}>{c}</td>
                      <td style={{ padding: "10px 10px", textAlign: "right" }}>CHF {Math.round(annA)}</td>
                      <td style={{ padding: "10px 10px", textAlign: "right" }}>CHF {Math.round(annB)}</td>
                      <td style={{ padding: "10px 10px", textAlign: "right", fontWeight: 700, color: wColor }}>{winner}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ── TAB: BENCHMARKS ── */}
      {activeTab === "benchmarks" && (
        <div>
          <Card style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: G.blue, marginBottom: 4 }}>ALLPS vs. market — entry cost comparison</div>
            <div style={{ fontSize: 13, color: G.gray600, marginBottom: 20 }}>All competitors use flat monthly subscriptions with no pay-as-you-go option. ALLPS is the only credit-based, usage-aligned pricing model in the DACH ATS market.</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${G.gray200}` }}>
                  {["Platform", "Pricing model", "Minimum monthly", "AI features", "Lock-in", "DACH focus"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: h === "Platform" ? "left" : "center", color: G.gray600, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["ALLPS Model A", "Pure PAYG credits", "CHF 0", "Full AI pipeline", "None", "✓"],
                  ["ALLPS Model B", "Base CHF 49 + PAYG", "CHF 49", "Full AI pipeline", "Monthly / Annual", "✓"],
                  ["Softgarden", "Flat subscription", "€179", "No AI interviews", "Annual", "✓"],
                  ["Coveto", "Flat subscription", "~€79", "None", "Annual", "✓"],
                  ["Workable", "Flat subscription", "$189", "Basic AI sourcing", "Annual", "✗"],
                  ["Teamtailor", "Flat subscription", "€149", "AI Co-pilot only", "Annual", "Partial"],
                  ["Recruitee", "Flat subscription", "$109", "Basic", "Annual", "Partial"],
                ].map((row, i) => {
                  const isAllps = i < 2;
                  return (
                    <tr key={row[0]} style={{ background: isAllps ? G.greenLight : (i % 2 === 0 ? "transparent" : G.gray50), fontWeight: isAllps ? 600 : 400 }}>
                      <td style={{ padding: "10px 10px", color: isAllps ? G.green : G.gray800, fontWeight: isAllps ? 700 : 600 }}>{row[0]}</td>
                      <td style={{ padding: "10px 10px", textAlign: "center", color: G.gray800 }}>{row[1]}</td>
                      <td style={{ padding: "10px 10px", textAlign: "center", fontWeight: 700, color: isAllps ? G.green : G.gray800 }}>{row[2]}</td>
                      <td style={{ padding: "10px 10px", textAlign: "center", color: isAllps ? G.green : G.gray600 }}>{row[3]}</td>
                      <td style={{ padding: "10px 10px", textAlign: "center", color: row[4] === "None" ? G.green : G.amber }}>{row[4]}</td>
                      <td style={{ padding: "10px 10px", textAlign: "center", color: row[5] === "✓" ? G.green : row[5] === "✗" ? G.red : G.amber }}>{row[5]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card style={{ background: G.blueLight, border: `1px solid ${G.blueMid}20` }}>
              <div style={{ fontWeight: 700, color: G.blue, marginBottom: 10 }}>What competitors charge a low-volume hirer</div>
              <div style={{ fontSize: 13, color: G.gray600, marginBottom: 14 }}>A company hiring 2 roles/month (±20 applicants each, no AI screening):</div>
              {[
                { name: "Softgarden", cost: "€179/month", note: "Whether you hire 1 or 50 roles" },
                { name: "Coveto", cost: "~€79/month", note: "Flat regardless of usage" },
                { name: "Teamtailor", cost: "€149/month", note: "Minimum, no AI interviews" },
                { name: "ALLPS Model A", cost: "CHF 59–119", note: "Only what you use" },
                { name: "ALLPS Model B", cost: "CHF 49–98", note: "Base + top-up for extras" },
              ].map((r, i) => (
                <div key={r.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 4 ? `1px solid ${G.gray200}` : "none" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: r.name.startsWith("ALLPS") ? G.green : G.gray800 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: G.gray400 }}>{r.note}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: r.name.startsWith("ALLPS") ? G.green : G.gray800 }}>{r.cost}</div>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{ fontWeight: 700, color: G.blue, marginBottom: 10 }}>ALLPS pricing positioning</div>
              {[
                { label: "Minimum entry cost", allps: "CHF 0 (Model A)", market: "€79–189/month", winner: "allps" },
                { label: "AI interviews included", allps: "Yes — credit-based", market: "None in this segment", winner: "allps" },
                { label: "Lock-in required", allps: "None (Model A) / Monthly (B)", market: "Annual contract standard", winner: "allps" },
                { label: "Pay only when hiring", allps: "Yes — credits expire in 12 mo", market: "No — flat monthly regardless", winner: "allps" },
                { label: "GDPR/nLPD native", allps: "Yes — Swiss-hosted", market: "Varies — Coveto/Softgarden yes", winner: "tie" },
                { label: "DACH job board integration", allps: "Phase 2 (Jobs.ch, Xing)", market: "Yes — deep multiposting", winner: "market" },
                { label: "Brand recognition (DACH)", allps: "Near zero", market: "High (Softgarden, Personio)", winner: "market" },
              ].map((row, i) => (
                <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 0", borderBottom: i < 6 ? `1px solid ${G.gray200}` : "none" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: G.gray800 }}>{row.label}</div>
                    <div style={{ fontSize: 11, color: G.green }}>{row.allps}</div>
                    <div style={{ fontSize: 11, color: G.gray400 }}>Market: {row.market}</div>
                  </div>
                  <Chip color={row.winner === "allps" ? G.green : row.winner === "market" ? G.red : G.amber}>
                    {row.winner === "allps" ? "ALLPS wins" : row.winner === "market" ? "Market wins" : "Tie"}
                  </Chip>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: RECOMMENDATION ── */}
      {activeTab === "recommendation" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <Card style={{ borderLeft: `4px solid ${G.blueMid}` }}>
              <Chip color={G.blueMid}>Model A</Chip>
              <div style={{ fontSize: 18, fontWeight: 700, color: G.blue, margin: "8px 0 4px" }}>Pure pay-as-you-go</div>
              <div style={{ fontSize: 13, color: G.gray600, marginBottom: 16 }}>Zero monthly commitment. Buy credits when you need them. 12-month validity.</div>
              <div style={{ marginBottom: 16 }}>
                {[
                  "No financial risk — zero cost when not hiring",
                  "No sales objection on 'lock-in' or 'contract'",
                  "Highest per-credit rate (CHF 3.00–5.90)",
                  "Best for: 0–7 credits/month, seasonal hirers",
                  "Credits valid 12 months — no urgency to use",
                ].map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: G.gray600 }}>
                    <span style={{ color: i < 2 ? G.green : i >= 3 ? G.gray400 : G.red, flexShrink: 0 }}>{i < 2 ? "✓" : i === 2 ? "−" : "→"}</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: G.blueLight, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: G.blueMid }}>
                <strong>Ideal client:</strong> A 20–50 person company hiring 3–8 roles per year. They don't want a monthly bill when they're not actively hiring.
              </div>
            </Card>

            <Card style={{ borderLeft: `4px solid ${G.green}` }}>
              <Chip color={G.green}>Model B</Chip>
              <div style={{ fontSize: 18, fontWeight: 700, color: G.blue, margin: "8px 0 4px" }}>Base subscription + PAYG</div>
              <div style={{ fontSize: 13, color: G.gray600, marginBottom: 16 }}>CHF 49/mo base, 10 credits included, cheaper top-ups.</div>
              <div style={{ marginBottom: 16 }}>
                {[
                  "Lower per-credit cost at 9+ credits/month",
                  "Predictable base + variable top-up billing",
                  "CHF 49 base introduces a monthly commitment",
                  "Best for: 9+ credits/month, steady hirers",
                  "Annual billing (CHF 490) saves 2 months = CHF 98",
                ].map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: G.gray600 }}>
                    <span style={{ color: i < 2 ? G.green : i === 2 ? G.amber : G.gray400, flexShrink: 0 }}>{i < 2 ? "✓" : i === 2 ? "!" : "→"}</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: G.greenLight, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: G.greenDark }}>
                <strong>Ideal client:</strong> A 30–100 person company in a growth phase, hiring 5–15 roles/month consistently, wanting lower per-credit rates and predictable budgeting.
              </div>
            </Card>
          </div>

          {/* Strategic recommendation */}
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: G.blue, marginBottom: 12 }}>Strategic recommendation: offer both, position A as default</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: G.gray800, marginBottom: 8 }}>Why Model A should be the entry default</div>
                {[
                  "Removes every objection to trial: zero cost, zero commitment, no credit card required until first pack purchase",
                  "Matches the partner's stated goal: low barrier to entry, no lock-in, full flexibility",
                  "90% of DACH SMEs hiring fewer than 10 roles/year will find Model A sufficient and cheaper",
                  "First pack purchase (CHF 59 for 10 credits) is a psychologically safe starting point vs. a recurring subscription",
                  "Model A is the industry-first positioning: no competitor offers a zero-subscription ATS with AI features",
                ].map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: G.gray600 }}>
                    <span style={{ color: G.green, flexShrink: 0 }}>◆</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: G.gray800, marginBottom: 8 }}>Model B as the natural upgrade trigger</div>
                {[
                  "When a client purchases their 3rd credit pack within 6 months, ALLPS dashboard shows: 'You've spent CHF X on credits. Model B would have saved you CHF Y.'",
                  "In-product upgrade prompt after first top-up purchase: frame as 'commit to hiring' rather than 'subscribe to software'",
                  "Annual Model B (CHF 490) positioned as a 'hiring budget' — a CFO-friendly line item rather than a SaaS subscription",
                  "Model B creates revenue predictability for ALLPS and lower churn signal vs. pure PAYG customers who disappear between hiring cycles",
                ].map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: G.gray600 }}>
                    <span style={{ color: G.purple, flexShrink: 0 }}>◆</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card style={{ background: G.greenLight, border: `1px solid ${G.green}30` }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: G.greenDark, marginBottom: 12 }}>Pricing policy guardrails</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { label: "Credit validity", value: "12 months", note: "From purchase date. Applies to both models. Prevents revenue recognition issues and forces usage cycle." },
                { label: "Model B rollover cap", value: "30 credits", note: "3 months of included credits. Prevents excessive banking; clients who bank 6+ months of credits are not active users." },
                { label: "Cancellation policy", value: "Anytime", note: "No cancellation fee. Top-up credits survive cancellation until their 12-month expiry. No lock-in ever." },
                { label: "Price floor", value: "CHF 2.60/credit", note: "Power top-up in Model B. Below this, gross margin falls under 60% at current infrastructure costs." },
                { label: "Annual discount", value: "~17% (2 months free)", note: "CHF 490/yr vs CHF 588/yr monthly. Standard SaaS annual discount — justified, not excessive." },
                { label: "Partner margin", value: "20–30%", note: "Sales partner marks up credit packs. ALLPS sells at wholesale; partner sets retail price within a defined ceiling." },
              ].map(item => (
                <div key={item.label} style={{ background: G.white, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: G.green, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: G.blue, marginBottom: 4 }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: G.gray600, lineHeight: 1.5 }}>{item.note}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
