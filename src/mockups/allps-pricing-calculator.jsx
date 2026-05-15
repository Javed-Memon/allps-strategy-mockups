import { useState, useMemo } from "react";

const C = {
  green: "#16a36a", greenDk: "#0d7a4e", greenLt: "#e8f7f0",
  blue: "#1e3a5f", blueMid: "#2d5a9e", blueLt: "#eff6ff",
  amber: "#b45309", amberLt: "#fef9c3",
  purple: "#4f46e5", purpleLt: "#ede9fe",
  red: "#991b1b",
  g50: "#f8fafc", g100: "#f1f5f9", g200: "#e2e8f0",
  g400: "#94a3b8", g600: "#475569", g800: "#1e293b", white: "#ffffff",
};

const PACKS_A = [
  { name: "Starter", credits: 10,  chf: 59,  pc: 5.90 },
  { name: "Plus",    credits: 25,  chf: 119, pc: 4.76 },
  { name: "Growth",  credits: 50,  chf: 199, pc: 3.98 },
  { name: "Scale",   credits: 100, chf: 349, pc: 3.49 },
  { name: "Power",   credits: 250, chf: 749, pc: 3.00 },
];
const PACKS_B = [
  { name: "Starter", credits: 10,  chf: 39,  pc: 3.90 },
  { name: "Plus",    credits: 25,  chf: 89,  pc: 3.56 },
  { name: "Growth",  credits: 50,  chf: 159, pc: 3.18 },
  { name: "Scale",   credits: 100, chf: 289, pc: 2.89 },
  { name: "Power",   credits: 250, chf: 649, pc: 2.60 },
];

const BASE_B = 49;
const INCL_B = 10;

const PROFILES = [
  { label: "Occasional hirer", jobs: 1,  mins: 30,  desc: "~1 role/month, light screening" },
  { label: "Active SME",       jobs: 3,  mins: 90,  desc: "~3 roles/month, standard AI screening" },
  { label: "Growth company",   jobs: 6,  mins: 180, desc: "~6 roles/month, full AI pipeline" },
  { label: "Scale-up",         jobs: 12, mins: 360, desc: "~12 roles/month, high volume" },
];

function bestCost(packs, credits) {
  if (credits <= 0) return 0;
  let rem = credits, total = 0;
  const sorted = [...packs].sort((a, b) => b.credits - a.credits);
  for (const p of sorted) { while (rem >= p.credits) { rem -= p.credits; total += p.chf; } }
  if (rem > 0) total += sorted[sorted.length - 1].chf;
  return total;
}
const costA = (c) => bestCost(PACKS_A, c);
const costB = (c) => BASE_B + bestCost(PACKS_B, Math.max(0, c - INCL_B));
const totalCr = (j, m) => j + Math.ceil(m / 10);
const fmt = (n) => Math.round(n);

const Chip = ({ children, color }) => (
  <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", background: color + "20", color }}>
    {children}
  </span>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.white, border: `1px solid ${C.g200}`, borderRadius: 12, padding: "20px 24px", ...style }}>
    {children}
  </div>
);

const Metric = ({ label, value, sub, accent = C.green }) => (
  <div style={{ background: C.g50, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${accent}` }}>
    <div style={{ fontSize: 11, color: C.g600, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: C.g800, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: C.g400, marginTop: 4 }}>{sub}</div>}
  </div>
);

function LineChart({ dataA, dataB, maxX, maxY, breakEven }) {
  const W = 560, H = 230, PL = 68, PR = 16, PT = 20, PB = 40;
  const iW = W - PL - PR, iH = H - PT - PB;
  const px = (x) => PL + (x / maxX) * iW;
  const py = (y) => PT + iH - Math.min(y / maxY, 1) * iH;
  const pathOf = (data) => data.map((d, i) => `${i === 0 ? "M" : "L"}${px(d.x).toFixed(1)},${py(d.y).toFixed(1)}`).join(" ");
  const yTicks = [0, 100, 200, 300, 400, 500].filter(v => v <= maxY);
  const xTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80].filter(v => v <= maxX);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", fontFamily: "inherit" }}>
      {yTicks.map(v => (
        <g key={v}>
          <line x1={PL} y1={py(v)} x2={W - PR} y2={py(v)} stroke={C.g200} strokeWidth={1} />
          <text x={PL - 6} y={py(v)} textAnchor="end" dominantBaseline="central" fontSize={11} fill={C.g400}>{v}</text>
        </g>
      ))}
      {xTicks.map(v => (
        <g key={v}>
          <line x1={px(v)} y1={PT} x2={px(v)} y2={PT + iH} stroke={C.g100} strokeWidth={1} />
          <text x={px(v)} y={PT + iH + 16} textAnchor="middle" fontSize={11} fill={C.g400}>{v}</text>
        </g>
      ))}
      <text x={14} y={PT + iH / 2} textAnchor="middle" fontSize={11} fill={C.g600} transform={`rotate(-90,14,${PT + iH / 2})`}>CHF/mo</text>
      <text x={PL + iW / 2} y={H - 4} textAnchor="middle" fontSize={11} fill={C.g600}>Credits / month</text>
      {breakEven && <>
        <line x1={px(breakEven)} y1={PT} x2={px(breakEven)} y2={PT + iH} stroke={C.amber} strokeWidth={1.5} strokeDasharray="5 3" />
        <text x={px(breakEven) + 4} y={PT + 14} fontSize={10} fill={C.amber}>Break-even ~{breakEven}</text>
      </>}
      <path d={pathOf(dataA)} fill="none" stroke={C.blueMid} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={pathOf(dataB)} fill="none" stroke={C.green} strokeWidth={2.5} strokeLinejoin="round" />
      <rect x={PL + 8} y={PT + 4} width={10} height={3} fill={C.blueMid} rx={1} />
      <text x={PL + 22} y={PT + 8} fontSize={11} fill={C.g600}>Model A — Pure PAYG</text>
      <rect x={PL + 160} y={PT + 4} width={10} height={3} fill={C.green} rx={1} />
      <text x={PL + 174} y={PT + 8} fontSize={11} fill={C.g600}>Model B — Base + PAYG</text>
    </svg>
  );
}

function BarChart({ profiles }) {
  const W = 560, H = 230, PL = 68, PR = 16, PT = 20, PB = 52;
  const iW = W - PL - PR, iH = H - PT - PB;
  const maxVal = Math.max(...profiles.flatMap(p => [p.a, p.b]));
  const maxY = Math.ceil(maxVal / 500) * 500;
  const py = (v) => PT + iH - (v / maxY) * iH;
  const groupW = iW / profiles.length;
  const barW = Math.min(28, groupW * 0.33);
  const yTicks = [0, 1, 2, 3, 4].map(i => Math.round((maxY / 4) * i));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", fontFamily: "inherit" }}>
      {yTicks.map(v => (
        <g key={v}>
          <line x1={PL} y1={py(v)} x2={W - PR} y2={py(v)} stroke={C.g200} strokeWidth={1} />
          <text x={PL - 6} y={py(v)} textAnchor="end" dominantBaseline="central" fontSize={11} fill={C.g400}>{v >= 1000 ? `${v / 1000}k` : v}</text>
        </g>
      ))}
      <text x={14} y={PT + iH / 2} textAnchor="middle" fontSize={11} fill={C.g600} transform={`rotate(-90,14,${PT + iH / 2})`}>CHF/yr</text>
      {profiles.map((p, i) => {
        const cx = PL + groupW * i + groupW / 2;
        const gap = 4;
        const aX = cx - barW - gap / 2;
        const bX = cx + gap / 2;
        const aH = iH - (py(p.a) - PT);
        const bH = iH - (py(p.b) - PT);
        return (
          <g key={p.label}>
            <rect x={aX} y={py(p.a)} width={barW} height={aH} fill={C.blueMid} rx={3} />
            <rect x={bX} y={py(p.b)} width={barW} height={bH} fill={C.green} rx={3} />
            <text x={cx} y={PT + iH + 16} textAnchor="middle" fontSize={10} fill={C.g600}>{p.label.split(" ")[0]}</text>
            <text x={cx} y={PT + iH + 28} textAnchor="middle" fontSize={10} fill={C.g400}>{p.label.split(" ").slice(1).join(" ")}</text>
          </g>
        );
      })}
      <rect x={PL + 8} y={PT + 4} width={10} height={3} fill={C.blueMid} rx={1} />
      <text x={PL + 22} y={PT + 8} fontSize={11} fill={C.g600}>Model A</text>
      <rect x={PL + 80} y={PT + 4} width={10} height={3} fill={C.green} rx={1} />
      <text x={PL + 94} y={PT + 8} fontSize={11} fill={C.g600}>Model B</text>
    </svg>
  );
}

export default function PricingStrategy() {
  const [jobs, setJobs] = useState(3);
  const [mins, setMins] = useState(90);
  const [tab, setTab] = useState("calculator");

  const cr = totalCr(jobs, mins);
  const intCr = Math.ceil(mins / 10);
  const cA = costA(cr);
  const cB = costB(cr);
  const diff = cA - cB;
  const annA = cA * 12;
  const annB = 490 + Math.max(0, cB - BASE_B) * 12;

  const lineData = useMemo(() => {
    const pts = Array.from({ length: 81 }, (_, i) => i);
    return { a: pts.map(x => ({ x, y: costA(x) })), b: pts.map(x => ({ x, y: costB(x) })) };
  }, []);

  const profileBars = PROFILES.map(p => {
    const c = totalCr(p.jobs, p.mins);
    return { label: p.label, a: costA(c) * 12, b: 490 + Math.max(0, (costB(c) - BASE_B)) * 12 };
  });

  const tabs = [
    { key: "calculator", label: "Usage calculator" },
    { key: "packs",      label: "Pack pricing" },
    { key: "breakeven",  label: "Break-even" },
    { key: "benchmarks", label: "Market benchmarks" },
    { key: "strategy",   label: "Recommendation" },
  ];

  const sans = "'DM Sans', 'Helvetica Neue', sans-serif";

  return (
    <div style={{ fontFamily: sans, color: C.g800, padding: "0 0 48px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet" />

      <div style={{ borderBottom: `1px solid ${C.g200}`, paddingBottom: 20, marginBottom: 24 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: 1, textTransform: "uppercase" }}>ALLPS AI · ATS on Demand</span>
        <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontSize: 28, fontWeight: 400, margin: "4px 0 6px", color: C.blue }}>Credit Pricing Strategy</h1>
        <p style={{ margin: 0, fontSize: 13, color: C.g600 }}>
          Model A (pure PAYG) vs Model B (CHF 49/month base + PAYG) · <strong>1 credit = 1 job posting or 10 AI interview minutes</strong>
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { label: "1 job posting", color: C.green, bg: C.greenLt, note: "Unlimited applicants per job" },
          { label: "10 AI interview minutes", color: C.purple, bg: C.purpleLt, note: "Screening + skills interviews" },
        ].map(d => (
          <div key={d.label} style={{ background: d.bg, border: `1px solid ${d.color}30`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: d.color, lineHeight: 1 }}>1</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: d.color, textTransform: "uppercase", letterSpacing: 0.4 }}>Credit =</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>{d.label}</div>
              <div style={{ fontSize: 12, color: C.g600 }}>{d.note}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 3, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "8px 16px", border: "none", cursor: "pointer", borderRadius: 6,
            fontSize: 13, fontWeight: tab === t.key ? 700 : 400, fontFamily: sans,
            background: tab === t.key ? C.green : "transparent",
            color: tab === t.key ? C.white : C.g600,
          }}>{t.label}</button>
        ))}
      </div>

      {/* CALCULATOR */}
      {tab === "calculator" && (
        <div>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.blue, marginBottom: 16 }}>Configure monthly usage</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600 }}>Job postings / month</label>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.green }}>{jobs} cr</span>
                </div>
                <input type="range" min={0} max={20} step={1} value={jobs} onChange={e => setJobs(+e.target.value)} style={{ width: "100%", accentColor: C.green }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.g400, marginTop: 2 }}><span>0</span><span>20 jobs</span></div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600 }}>AI interview minutes / month</label>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.purple }}>{intCr} cr</span>
                </div>
                <input type="range" min={0} max={600} step={10} value={mins} onChange={e => setMins(+e.target.value)} style={{ width: "100%", accentColor: C.purple }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.g400, marginTop: 2 }}><span>0 min</span><span>600 min</span></div>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: "10px 14px", background: C.g50, borderRadius: 8, fontSize: 13, color: C.g600 }}>
              <strong style={{ color: C.g800 }}>{cr} total credits / month</strong> — {jobs} job credit{jobs !== 1 ? "s" : ""} + {intCr} interview credit{intCr !== 1 ? "s" : ""} ({mins} min ÷ 10)
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Card style={{ borderTop: `3px solid ${C.blueMid}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.blueMid, textTransform: "uppercase", letterSpacing: 0.4 }}>Model A</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.blue }}>Pure pay-as-you-go</div>
                </div>
                <Chip color={C.blueMid}>No subscription</Chip>
              </div>
              <div style={{ fontSize: 12, color: C.g600, marginBottom: 14 }}>No base fee · Buy packs as needed · 12-month credit validity · Full rollover</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Metric label="Monthly" value={`CHF ${fmt(cA)}`} sub="best pack combo" accent={C.blueMid} />
                <Metric label="Annual" value={`CHF ${fmt(annA)}`} sub="12 × monthly" accent={C.blueMid} />
              </div>
              {cr > 0 && <div style={{ marginTop: 10, fontSize: 12, color: C.g600 }}>Effective per credit: <strong>CHF {(cA / cr).toFixed(2)}</strong></div>}
            </Card>

            <Card style={{ borderTop: `3px solid ${C.green}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: 0.4 }}>Model B</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.blue }}>Base subscription + PAYG</div>
                </div>
                <Chip color={C.green}>CHF 49/month</Chip>
              </div>
              <div style={{ fontSize: 12, color: C.g600, marginBottom: 14 }}>CHF 49/mo base · Includes 10 credits/mo · Lower top-up rates · CHF 490/yr annual billing</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Metric label="Monthly" value={`CHF ${fmt(cB)}`} sub="CHF 49 base + top-ups" accent={C.green} />
                <Metric label="Annual" value={`CHF ${fmt(annB)}`} sub="annual billing" accent={C.green} />
              </div>
              {cr > 0 && <div style={{ marginTop: 10, fontSize: 12, color: C.g600 }}>Effective per credit: <strong>CHF {(cB / cr).toFixed(2)}</strong></div>}
            </Card>
          </div>

          {cr === 0
            ? <div style={{ background: C.g50, border: `1px solid ${C.g200}`, borderRadius: 10, padding: "16px 20px", fontSize: 14, color: C.g600, textAlign: "center" }}>Set your usage above to compare costs.</div>
            : diff > 1
            ? <div style={{ background: C.greenLt, border: `1px solid ${C.green}30`, borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ fontWeight: 700, color: C.greenDk, marginBottom: 4 }}>✦ Model B saves CHF {fmt(diff)}/month (CHF {fmt(diff * 12)}/year) at this volume</div>
                <div style={{ fontSize: 13, color: C.g600 }}>At {cr} credits/month the included 10 credits and lower top-up rates more than offset the CHF 49 base. Best for companies hiring 3+ roles/month with regular AI screening.</div>
              </div>
            : diff < -1
            ? <div style={{ background: C.blueLt, border: `1px solid ${C.blueMid}30`, borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ fontWeight: 700, color: C.blue, marginBottom: 4 }}>✦ Model A saves CHF {fmt(-diff)}/month (CHF {fmt(-diff * 12)}/year) at this volume</div>
                <div style={{ fontSize: 13, color: C.g600 }}>At {cr} credits/month the CHF 49 base isn't offset by the 10 included credits and lower rates. Best for occasional hirers using fewer than 8–9 credits/month.</div>
              </div>
            : <div style={{ background: C.amberLt, border: `1px solid ${C.amber}30`, borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ fontWeight: 700, color: C.amber, marginBottom: 4 }}>Both models cost the same at this volume — you're at the break-even point.</div>
                <div style={{ fontSize: 13, color: C.g600 }}>For occasional hirers prefer Model A (zero commitment). For companies expecting volume growth, Model B locks in lower rates as usage scales.</div>
              </div>
          }

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.g600, marginBottom: 10 }}>Quick company profiles</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {PROFILES.map(p => (
                <button key={p.label} onClick={() => { setJobs(p.jobs); setMins(p.mins); }}
                  style={{ textAlign: "left", padding: "12px 14px", border: `1px solid ${C.g200}`, borderRadius: 8, cursor: "pointer", background: C.white, fontFamily: sans }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.green}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.g200}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: C.g600 }}>{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PACKS */}
      {tab === "packs" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.g800 }}>Model A — Credit packs</span>
              <Chip color={C.blueMid}>No subscription</Chip>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: `1px solid ${C.g200}` }}>
                {["Pack","Credits","CHF","Per credit"].map(h => <th key={h} style={{ padding: "6px 8px", textAlign: h === "Pack" ? "left" : "right", color: C.g600, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>)}
              </tr></thead>
              <tbody>{PACKS_A.map((p, i) => (
                <tr key={p.name} style={{ background: i % 2 ? C.g50 : "transparent" }}>
                  <td style={{ padding: "8px 8px", fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: "8px 8px", textAlign: "right" }}>{p.credits}</td>
                  <td style={{ padding: "8px 8px", textAlign: "right", fontWeight: 600 }}>CHF {p.chf}</td>
                  <td style={{ padding: "8px 8px", textAlign: "right", color: C.blueMid, fontWeight: 700 }}>CHF {p.pc.toFixed(2)}</td>
                </tr>
              ))}</tbody>
            </table>
            <div style={{ marginTop: 14, padding: "10px 14px", background: C.blueLt, borderRadius: 8, fontSize: 13, color: C.g600 }}>
              Credits valid 12 months from purchase. Full rollover within validity. No monthly fee.
            </div>
          </Card>

          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.g800 }}>Model B — Base + top-ups</span>
              <Chip color={C.green}>CHF 49/mo</Chip>
            </div>
            <div style={{ background: C.greenLt, border: `1px solid ${C.green}30`, borderRadius: 8, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.blue }}>CHF 49<span style={{ fontSize: 14, fontWeight: 400 }}>/month</span></div>
              <div style={{ fontSize: 12, color: C.g600, marginTop: 4 }}>CHF 490/year annual billing (2 months free) · Includes 10 credits/month · Unused credits roll up to 30 (3-month cap)</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: `1px solid ${C.g200}` }}>
                {["Top-up","Credits","CHF","Per credit"].map(h => <th key={h} style={{ padding: "6px 8px", textAlign: h === "Top-up" ? "left" : "right", color: C.g600, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>)}
              </tr></thead>
              <tbody>{PACKS_B.map((p, i) => (
                <tr key={p.name} style={{ background: i % 2 ? C.g50 : "transparent" }}>
                  <td style={{ padding: "8px 8px", fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: "8px 8px", textAlign: "right" }}>{p.credits}</td>
                  <td style={{ padding: "8px 8px", textAlign: "right", fontWeight: 600 }}>CHF {p.chf}</td>
                  <td style={{ padding: "8px 8px", textAlign: "right", color: C.green, fontWeight: 700 }}>CHF {p.pc.toFixed(2)}</td>
                </tr>
              ))}</tbody>
            </table>
            <div style={{ marginTop: 14, padding: "10px 14px", background: C.greenLt, borderRadius: 8, fontSize: 13, color: C.g600 }}>
              Top-ups valid 12 months. Purchased credits survive subscription cancellation.
            </div>
          </Card>

          <Card style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.blue, marginBottom: 4 }}>Gross margin analysis</div>
            <div style={{ fontSize: 12, color: C.g600, marginBottom: 14 }}>Estimated infrastructure cost per credit: CHF 0.80–1.00. Job posting credits have near-zero marginal cost; AI interview credits are the variable driver. Target blended gross margin: 65–70%.</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: `1px solid ${C.g200}` }}>
                {["Pack","Sell price / credit","Est. cost / credit","Gross margin"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "Pack" ? "left" : "right", color: C.g600, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[
                  ["A — Starter (10 cr)", "5.90", "~1.00", 83],
                  ["A — Growth (50 cr)",  "3.98", "~1.00", 75],
                  ["A — Power (250 cr)",  "3.00", "~1.00", 67],
                  ["B — Included credits","4.90", "~1.00", 80],
                  ["B — Growth top-up",   "3.18", "~1.00", 69],
                  ["B — Power top-up",    "2.60", "~1.00", 62],
                ].map(([name, sell, cost, margin], i) => (
                  <tr key={name} style={{ background: i % 2 ? C.g50 : "transparent" }}>
                    <td style={{ padding: "8px 10px", fontWeight: 500 }}>{name}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right" }}>CHF {sell}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", color: C.g600 }}>CHF {cost}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, color: margin >= 70 ? C.green : C.amber }}>{margin}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* BREAK-EVEN */}
      {tab === "breakeven" && (
        <div>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.blue, marginBottom: 4 }}>Monthly cost by credit volume</div>
            <div style={{ fontSize: 13, color: C.g600, marginBottom: 16 }}>Where the lines cross is the break-even (~8 credits/month). Below it Model A is cheaper; above it Model B is cheaper.</div>
            <LineChart dataA={lineData.a} dataB={lineData.b} maxX={80} maxY={500} breakEven={8} />
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <Metric label="Break-even" value="~8 credits/mo" sub="2 jobs + 60 min AI interviews" accent={C.amber} />
            <Metric label="Model A wins" value="0–7 credits" sub="Occasional / seasonal hirer" accent={C.blueMid} />
            <Metric label="Model B wins" value="9+ credits" sub="Consistent monthly hiring" accent={C.green} />
          </div>

          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.blue, marginBottom: 4 }}>Annual cost by company profile</div>
            <div style={{ fontSize: 13, color: C.g600, marginBottom: 16 }}>Annual billing for Model B (CHF 490/yr base). Top-ups at best pack rates per month.</div>
            <BarChart profiles={profileBars} />
          </Card>

          <Card>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.blue, marginBottom: 12 }}>Profile detail</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: `1px solid ${C.g200}` }}>
                {["Profile","Credits/mo","Model A (annual)","Model B (annual)","Winner"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "Profile" ? "left" : "right", color: C.g600, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{PROFILES.map((p, i) => {
                const c = totalCr(p.jobs, p.mins);
                const a = costA(c) * 12;
                const b = 490 + Math.max(0, (costB(c) - BASE_B)) * 12;
                const d = a - b;
                return (
                  <tr key={p.label} style={{ background: i % 2 ? C.g50 : "transparent" }}>
                    <td style={{ padding: "10px 10px" }}>
                      <div style={{ fontWeight: 600 }}>{p.label}</div>
                      <div style={{ fontSize: 11, color: C.g400 }}>{p.desc}</div>
                    </td>
                    <td style={{ padding: "10px 10px", textAlign: "right" }}>{c}</td>
                    <td style={{ padding: "10px 10px", textAlign: "right" }}>CHF {fmt(a)}</td>
                    <td style={{ padding: "10px 10px", textAlign: "right" }}>CHF {fmt(b)}</td>
                    <td style={{ padding: "10px 10px", textAlign: "right", fontWeight: 700, color: d > 1 ? C.green : d < -1 ? C.blueMid : C.amber }}>
                      {d > 1 ? `B saves CHF ${fmt(d)}` : d < -1 ? `A saves CHF ${fmt(-d)}` : "Equal"}
                    </td>
                  </tr>
                );
              })}</tbody>
            </table>
          </Card>
        </div>
      )}

      {/* BENCHMARKS */}
      {tab === "benchmarks" && (
        <div>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.blue, marginBottom: 4 }}>ALLPS vs. market — entry cost comparison</div>
            <div style={{ fontSize: 13, color: C.g600, marginBottom: 16 }}>Every competitor in DACH uses a flat monthly subscription. ALLPS is the only usage-aligned, credit-based model with native AI interviews in this segment.</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: `1px solid ${C.g200}` }}>
                {["Platform","Model","Min monthly","AI interviews","Lock-in","DACH focus"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "Platform" ? "left" : "center", color: C.g600, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{[
                ["ALLPS Model A", "Pure PAYG credits", "CHF 0",   "✓ Full AI pipeline", "None",    "✓", true],
                ["ALLPS Model B", "Base + PAYG",       "CHF 49",  "✓ Full AI pipeline", "Monthly", "✓", true],
                ["Softgarden",   "Flat subscription",  "€179",    "✗ None",             "Annual",  "✓", false],
                ["Coveto",       "Flat subscription",  "~€79",    "✗ None",             "Annual",  "✓", false],
                ["Teamtailor",   "Flat subscription",  "€149",    "~ Co-pilot only",    "Annual",  "~", false],
                ["Workable",     "Flat subscription",  "$189",    "✗ None",             "Annual",  "✗", false],
                ["Recruitee",    "Flat subscription",  "$109",    "✗ None",             "Annual",  "~", false],
              ].map((row, i) => (
                <tr key={row[0]} style={{ background: row[6] ? C.greenLt : (i % 2 === 0 ? "transparent" : C.g50) }}>
                  <td style={{ padding: "10px 10px", fontWeight: row[6] ? 700 : 600, color: row[6] ? C.green : C.g800 }}>{row[0]}</td>
                  <td style={{ padding: "10px 10px", textAlign: "center", color: C.g600 }}>{row[1]}</td>
                  <td style={{ padding: "10px 10px", textAlign: "center", fontWeight: 700, color: row[6] ? C.green : C.g800 }}>{row[2]}</td>
                  <td style={{ padding: "10px 10px", textAlign: "center", color: row[3].startsWith("✓") ? C.green : row[3].startsWith("~") ? C.amber : C.red }}>{row[3]}</td>
                  <td style={{ padding: "10px 10px", textAlign: "center", color: row[4] === "None" ? C.green : C.amber }}>{row[4]}</td>
                  <td style={{ padding: "10px 10px", textAlign: "center", color: row[5] === "✓" ? C.green : row[5] === "✗" ? C.red : C.amber }}>{row[5]}</td>
                </tr>
              ))}</tbody>
            </table>
          </Card>

          <Card>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.blue, marginBottom: 4 }}>Cost comparison: company hiring 3 roles/month with 90 min AI screening = 12 credits/month</div>
            <div style={{ fontSize: 13, color: C.g600, marginBottom: 16 }}>A fair comparison for a typical active SME in the target segment.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { name: "ALLPS Model A", mo: costA(12), color: C.blueMid, ai: true },
                { name: "ALLPS Model B", mo: costB(12), color: C.green,   ai: true },
                { name: "Softgarden",    mo: 179,       color: C.g600,    ai: false },
                { name: "Coveto",        mo: 79,        color: C.g600,    ai: false },
                { name: "Teamtailor",    mo: 149,       color: C.g600,    ai: false },
                { name: "Workable",      mo: 189,       color: C.g600,    ai: false },
              ].map(item => (
                <div key={item.name} style={{ background: C.g50, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${item.color}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.g800 }}>CHF/€ {fmt(item.mo)}</div>
                  <div style={{ fontSize: 11, color: C.g600, marginTop: 2 }}>/month</div>
                  <div style={{ marginTop: 8 }}>
                    <Chip color={item.ai ? C.green : C.red}>{item.ai ? "AI interviews ✓" : "No AI interviews"}</Chip>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* STRATEGY */}
      {tab === "strategy" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Card style={{ borderLeft: `4px solid ${C.blueMid}` }}>
              <Chip color={C.blueMid}>Model A</Chip>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.blue, margin: "8px 0 4px" }}>Pure pay-as-you-go</div>
              <div style={{ fontSize: 13, color: C.g600, marginBottom: 14 }}>Zero monthly commitment. Buy credits when hiring. 12-month validity.</div>
              {[
                ["✓", C.green,  "Zero cost when not actively hiring"],
                ["✓", C.green,  "Removes every lock-in objection from buyer"],
                ["→", C.g400,  "Best for 0–7 credits/month"],
                ["→", C.g400,  "Occasional and seasonal hirers"],
                ["−", C.red,   "Highest per-credit rate (CHF 3.00–5.90)"],
              ].map(([icon, color, text], i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: C.g600 }}>
                  <span style={{ color, flexShrink: 0 }}>{icon}</span><span>{text}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, background: C.blueLt, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.blueMid }}>
                <strong>Ideal client:</strong> 20–50 person company, 3–8 roles/year, doesn't want a monthly bill in quiet periods.
              </div>
            </Card>

            <Card style={{ borderLeft: `4px solid ${C.green}` }}>
              <Chip color={C.green}>Model B</Chip>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.blue, margin: "8px 0 4px" }}>Base subscription + PAYG</div>
              <div style={{ fontSize: 13, color: C.g600, marginBottom: 14 }}>CHF 49/mo, 10 credits included, lower top-up rates.</div>
              {[
                ["✓", C.green,  "Lower per-credit cost at 9+ credits/month"],
                ["✓", C.green,  "Predictable base + flexible variable top-up"],
                ["→", C.g400,  "Best for 9+ credits/month"],
                ["→", C.g400,  "Consistent growth-phase companies"],
                ["!", C.amber,  "CHF 49 base is a monthly commitment"],
              ].map(([icon, color, text], i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: C.g600 }}>
                  <span style={{ color, flexShrink: 0 }}>{icon}</span><span>{text}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, background: C.greenLt, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.greenDk }}>
                <strong>Ideal client:</strong> 30–100 person company, growth phase, 5–15 roles/month consistently.
              </div>
            </Card>
          </div>

          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.blue, marginBottom: 12 }}>Strategic recommendation: offer both, position Model A as the default entry</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.g800, marginBottom: 8 }}>Why Model A is the right default</div>
                {[
                  "Zero cost to start — removes every financial objection to trial",
                  "Matches partner brief exactly: low barrier, no lock-in, full flexibility",
                  "90% of DACH SMEs hiring under 10 roles/year will find Model A sufficient",
                  "CHF 59 first pack is psychologically safe vs. a recurring subscription",
                  "No competitor offers a zero-subscription AI ATS — genuine first-mover position",
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: C.g600 }}>
                    <span style={{ color: C.green, flexShrink: 0 }}>◆</span><span>{t}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.g800, marginBottom: 8 }}>Model B as the upgrade trigger</div>
                {[
                  "After 3rd credit pack: dashboard shows 'Model B would have saved you CHF X'",
                  "Annual CHF 490 framed as a 'hiring budget' — CFO-friendly, not a SaaS subscription",
                  "Model B creates revenue predictability and reduces churn between hiring cycles",
                  "Upgrade path: Model A → Model B → full ALLPS platform subscription",
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: C.g600 }}>
                    <span style={{ color: C.purple, flexShrink: 0 }}>◆</span><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card style={{ background: C.greenLt, border: `1px solid ${C.green}30` }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.greenDk, marginBottom: 12 }}>Pricing policy guardrails</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { label: "Credit validity",      value: "12 months", note: "From purchase. Prevents revenue recognition issues; forces active use." },
                { label: "Model B rollover cap", value: "30 credits", note: "3 months of included credits. Beyond this, clients are inactive." },
                { label: "Cancellation",         value: "Anytime",   note: "No fee. Top-up credits survive cancellation until 12-month expiry." },
                { label: "Price floor",          value: "CHF 2.60",  note: "Power top-up in Model B. Below this, gross margin falls under 60%." },
                { label: "Annual discount",      value: "~17%",      note: "CHF 490/yr vs CHF 588/yr monthly. 2 months free." },
                { label: "Partner margin",       value: "20–30%",    note: "Partner marks up credit packs within a ALLPS-defined ceiling." },
              ].map(item => (
                <div key={item.label} style={{ background: C.white, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.blue, marginBottom: 4 }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: C.g600, lineHeight: 1.5 }}>{item.note}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
