
import { useState } from "react";

const platforms = [
  {
    name: "MakerKit",
    url: "makerkit.dev",
    stack: "Next.js / React / TS",
    type: "Commercial",
    price: 299,
    priceLabel: "$299 one-time",
    priceNote: "Pro plan. Team ~$599. Full source. Daily updates since 2022.",
    withinBudget: true,
    sourceCode: true,
    db: "Supabase / Prisma / Drizzle",
    auth: "Better Auth / Supabase Auth",
    multiTenancy: 5, sso: 4, billing: 5, appOnboarding: 2,
    adminPanel: 5, docker: 3, trialSupport: 4, rbac: 5, futureProof: 5,
    pros: [
      "Most actively maintained — daily updates since 2022",
      "Most advanced billing: per-seat, tiered, usage-based, add-ons",
      "Full admin panel: impersonate, ban, monitor revenue/subscriptions",
      "AI-optimized: MCP server + Claude Code / Cursor rules built in",
      "Swap DB/auth/billing provider anytime — no vendor lock-in",
      "Rich plugin ecosystem: roadmap, waitlist, blog, feedback widget",
    ],
    cons: [
      "Next.js/React only — .NET/Angular apps need API bridge",
      "Multi-app marketplace requires custom portal development",
      "No built-in SAML/enterprise SSO (needs Zitadel pairing)",
    ],
    verdict: "⭐ TOP PICK", verdictColor: "#f59e0b", tag: "TOP PICK",
  },
  {
    name: "SaasRock",
    url: "saasrock.com",
    stack: "Remix / React / Node.js",
    type: "Commercial",
    price: 249,
    priceLabel: "$249–$1,999 one-time",
    priceNote: "Core $249 includes source. Higher tiers add more features.",
    withinBudget: true,
    sourceCode: true,
    db: "PostgreSQL / Prisma",
    auth: "Custom Auth",
    multiTenancy: 4, sso: 4, billing: 5, appOnboarding: 2,
    adminPanel: 5, docker: 3, trialSupport: 4, rbac: 5, futureProof: 4,
    pros: [
      "Entity Builder auto-generates CRUD + REST API for any model",
      "B2B2C portals — closest structure to a multi-app marketplace",
      "All Stripe billing: flat, per-seat, usage-based, one-time",
      "Best-in-class admin panel with full tenant management",
      "Lowest entry price: full source from $249",
    ],
    cons: [
      "Remix framework — smaller ecosystem vs Next.js",
      "Single-product focused — marketplace = significant custom work",
      "Weaker Docker/K8s documentation",
    ],
    verdict: "RUNNER-UP", verdictColor: "#60a5fa", tag: "RUNNER-UP",
  },
  {
    name: "SupaStarter",
    url: "supastarter.dev",
    stack: "Next.js / Nuxt / React",
    type: "Commercial",
    price: 299,
    priceLabel: "$299 one-time",
    priceNote: "Was $349. Lifetime access + updates. Full source code.",
    withinBudget: true,
    sourceCode: true,
    db: "Prisma / Drizzle (any DB)",
    auth: "Better Auth / OAuth",
    multiTenancy: 4, sso: 3, billing: 4, appOnboarding: 2,
    adminPanel: 4, docker: 4, trialSupport: 3, rbac: 4, futureProof: 4,
    pros: [
      "Supports Next.js AND Nuxt — widest framework flexibility",
      "Built-in i18n (35+ languages) out of the box",
      "AI integration via Vercel AI SDK included",
      "Docker + serverless + Node.js deployment options",
      "Stripe + Lemon Squeezy + Chargebee billing providers",
    ],
    cons: [
      "No SAML/enterprise SSO — basic OAuth only",
      "Admin panel less feature-rich than MakerKit/SaasRock",
      "No cross-app marketplace functionality built in",
    ],
    verdict: "SOLID CHOICE", verdictColor: "#a78bfa", tag: "CONSIDER",
  },
  {
    name: "SaaSykit Complete",
    url: "saasykit.com",
    stack: "Laravel / PHP / Livewire",
    type: "Commercial",
    price: 299,
    priceLabel: "$299 one-time (bundle)",
    priceNote: "Includes user + multi-tenant versions. Was $399. 14-day refund.",
    withinBudget: true,
    sourceCode: true,
    db: "MySQL / PostgreSQL / SQLite",
    auth: "Laravel Auth + Social Login",
    multiTenancy: 5, sso: 3, billing: 5, appOnboarding: 2,
    adminPanel: 5, docker: 3, trialSupport: 4, rbac: 4, futureProof: 3,
    pros: [
      "ONLY kit bundling both single-user + multi-tenant versions",
      "Stripe + Paddle + Lemon Squeezy — widest payment support",
      "Filament admin with MRR / churn / ARPU analytics",
      "Invoice generator + transaction report built-in",
      "14-day money-back guarantee — lowest purchase risk",
    ],
    cons: [
      "PHP/Laravel stack — mismatches your Node.js / .NET preference",
      "No SAML/OIDC SSO for cross-app federation",
      "PHP ecosystem declining vs TypeScript — lower future-proof score",
    ],
    verdict: "PHP OPTION", verdictColor: "#a78bfa", tag: "CONSIDER",
  },
  {
    name: "BoxyHQ Starter",
    url: "boxyhq.com",
    stack: "Next.js / TypeScript",
    type: "Open Source",
    price: 0,
    priceLabel: "Free (Apache 2.0)",
    priceNote: "Full source on GitHub. No restrictions for commercial use.",
    withinBudget: true,
    sourceCode: true,
    db: "PostgreSQL (Prisma)",
    auth: "SAML SSO via Jackson",
    multiTenancy: 3, sso: 5, billing: 1, appOnboarding: 1,
    adminPanel: 3, docker: 4, trialSupport: 1, rbac: 4, futureProof: 3,
    pros: [
      "Best enterprise SAML SSO of any boilerplate (Jackson engine)",
      "Apache 2.0 — no restrictions, truly free forever",
      "Webhooks (Svix) + audit logs built-in",
      "Ideal SSO foundation — pair with Stripe + Lago for billing",
    ],
    cons: [
      "Zero billing built-in — must add Stripe from scratch",
      "No marketplace UI, no free trial logic",
      "Single-app only — marketplace requires full rebuild",
    ],
    verdict: "FOUNDATION", verdictColor: "#6ee7b7", tag: "FOUNDATION",
  },
  {
    name: "Gravity (Node.js)",
    url: "usegravity.app",
    stack: "Node.js / React / Express",
    type: "Commercial",
    price: 799,
    priceLabel: "~$799 one-time",
    priceNote: "One-time purchase. Full source code included.",
    withinBudget: true,
    sourceCode: true,
    db: "MySQL / PostgreSQL / MongoDB / MSSQL",
    auth: "JWT + Social OAuth",
    multiTenancy: 4, sso: 3, billing: 4, appOnboarding: 2,
    adminPanel: 4, docker: 3, trialSupport: 3, rbac: 4, futureProof: 3,
    pros: [
      "Widest DB support: MySQL, PostgreSQL, MongoDB, MSSQL",
      "Node.js + React — matches your preferred stack",
      "Multi-tenancy + team management built-in",
      "Admin panel + Stripe billing included",
    ],
    cons: [
      "Smaller community and slower update frequency",
      "No SAML/enterprise SSO",
      "Single SaaS product focused — no marketplace catalog",
    ],
    verdict: "CONSIDER", verdictColor: "#fbbf24", tag: "CONSIDER",
  },
  {
    name: "SellYourSaas",
    url: "sellyoursaas.org",
    stack: "PHP / Dolibarr",
    type: "Open Source",
    price: 0,
    priceLabel: "Free (GPL v3)",
    priceNote: "Fully open source, self-hosted. Any web app stack.",
    withinBudget: true,
    sourceCode: true,
    db: "MySQL / PostgreSQL",
    auth: "Dolibarr Auth",
    multiTenancy: 5, sso: 2, billing: 4, appOnboarding: 5,
    adminPanel: 3, docker: 3, trialSupport: 5, rbac: 3, futureProof: 2,
    pros: [
      "Only OSS built specifically for selling multiple web apps as SaaS",
      "Provisions any web app (any stack) via Linux containers",
      "Free trials with automated conversion built-in",
      "Zero license cost, production proven",
    ],
    cons: [
      "PHP/Dolibarr — big mismatch for Node.js / .NET teams",
      "Very small community (~150 GitHub stars)",
      "Dated UI, no enterprise SSO, lowest future-proof rating",
    ],
    verdict: "NICHE", verdictColor: "#94a3b8", tag: "NICHE",
  },
  {
    name: "ABP Commercial",
    url: "abp.io",
    stack: ".NET Core / Angular",
    type: "Commercial",
    price: 2999,
    priceLabel: "$2,999–$9,999/yr",
    priceNote: "EXCEEDS $900 BUDGET. Annual recurring license.",
    withinBudget: false,
    sourceCode: true,
    db: "SQL Server / PostgreSQL / MySQL",
    auth: "OpenIddict / IdentityServer",
    multiTenancy: 5, sso: 5, billing: 4, appOnboarding: 3,
    adminPanel: 5, docker: 5, trialSupport: 4, rbac: 5, futureProof: 5,
    pros: [
      "Perfect .NET / Angular stack match for your team",
      "Best multi-tenancy in .NET — SaaS module + edition management",
      "Docker + Kubernetes + Helm charts included",
      "Full source code on Business tier and above",
    ],
    cons: [
      "EXCEEDS BUDGET — starts at $2,999/yr",
      "Annual recurring cost — not a one-time purchase",
      "Non-.NET apps require API gateway bridging",
    ],
    verdict: "OVER BUDGET", verdictColor: "#f87171", tag: "OVER BUDGET",
  },
  {
    name: "Composable Stack",
    url: "Zitadel + Stripe + K8s",
    stack: "Any / Stack-Agnostic",
    type: "OSS DIY",
    price: 0,
    priceLabel: "$0 license + infra",
    priceNote: "No license cost. 3–6 months dev effort required.",
    withinBudget: true,
    sourceCode: true,
    db: "Any (you choose)",
    auth: "Zitadel OIDC/SAML",
    multiTenancy: 5, sso: 5, billing: 5, appOnboarding: 5,
    adminPanel: 2, docker: 5, trialSupport: 5, rbac: 5, futureProof: 5,
    pros: [
      "Truly stack-agnostic — onboard ANY Docker app (Node, .NET, PHP)",
      "True enterprise SSO: OIDC/SAML across ALL apps via Zitadel",
      "No vendor lock-in whatsoever",
      "Kubernetes-native, scales to any number of tenants/apps",
    ],
    cons: [
      "3–6 months custom engineering investment",
      "No admin panel, marketplace UI, or catalog out of the box",
      "Requires Kubernetes/DevOps expertise",
    ],
    verdict: "BEST LONG-TERM", verdictColor: "#34d399", tag: "LONG-TERM",
  },
];

const CRITERIA = [
  { key: "multiTenancy", label: "Multi-Tenancy", icon: "🏢" },
  { key: "sso", label: "SSO/Auth", icon: "🔐" },
  { key: "billing", label: "Billing", icon: "💳" },
  { key: "appOnboarding", label: "Multi-Stack", icon: "📦" },
  { key: "adminPanel", label: "Admin Panel", icon: "⚙️" },
  { key: "docker", label: "Docker/K8s", icon: "🐳" },
  { key: "trialSupport", label: "Free Trial", icon: "🎁" },
  { key: "rbac", label: "RBAC", icon: "👥" },
];

function Dots({ score }) {
  const color = score >= 4 ? "#34d399" : score === 3 ? "#fbbf24" : "#f87171";
  return (
    <div style={{ display:"flex", gap:3, justifyContent:"center" }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width:7, height:7, borderRadius:"50%",
          background: i <= score ? color : "rgba(255,255,255,0.1)",
          boxShadow: i <= score && score>=4 ? `0 0 4px ${color}88` : "none",
        }}/>
      ))}
    </div>
  );
}

function Bar({ score }) {
  const color = score >= 4 ? "#34d399" : score === 3 ? "#fbbf24" : "#f87171";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <div style={{ flex:1, height:5, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${score*20}%`, background:color, borderRadius:99 }}/>
      </div>
      <span style={{ fontSize:10, color, fontWeight:700, minWidth:18, fontFamily:"monospace" }}>{score}/5</span>
    </div>
  );
}

function Chip({ label, color }) {
  return (
    <span style={{
      fontSize:9, fontWeight:800, letterSpacing:"0.07em", padding:"3px 7px",
      borderRadius:4, background:`${color}18`, color, border:`1px solid ${color}35`,
      fontFamily:"monospace", whiteSpace:"nowrap",
    }}>{label}</span>
  );
}

export default function App() {
  const [showOver, setShowOver] = useState(false);
  const [selected, setSelected] = useState("MakerKit");
  const [view, setView] = useState("table");

  const visible = showOver ? platforms : platforms.filter(p => p.withinBudget);
  const sel = platforms.find(p => p.name === selected);
  const totalScore = p => CRITERIA.reduce((s,c) => s + p[c.key], 0) + p.futureProof;

  return (
    <div style={{ minHeight:"100vh", background:"#06090f", color:"#e2e8f0", fontFamily:"'Outfit','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#0d1117}
        ::-webkit-scrollbar-thumb{background:#1e2d42;border-radius:3px}
        .tr:hover{background:rgba(52,211,153,0.04)!important;cursor:pointer}
        .tr.sel{background:rgba(52,211,153,0.07)!important;border-left:2px solid #34d399!important}
        .btn{border:none;cursor:pointer;font-family:inherit;transition:all .15s}
        .btn:hover{opacity:.8}
        .chip{border:none;cursor:pointer;font-family:inherit;transition:all .15s}
        .chip:hover{transform:translateY(-1px)}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.55}}
        .fade{animation:fadeIn .3s ease}
      `}</style>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(160deg,#0d1a2b,#06090f)", borderBottom:"1px solid rgba(52,211,153,.12)", padding:"26px 32px 20px" }}>
        <div style={{ maxWidth:1360, margin:"0 auto" }}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:12, alignItems:"flex-start", justifyContent:"space-between" }}>
            <div>
              <div style={{ display:"flex", gap:7, alignItems:"center", marginBottom:7 }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 10px #34d399",animation:"pulse 2s infinite" }}/>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#34d399", letterSpacing:".15em", textTransform:"uppercase" }}>SaaS Marketplace Platform Comparison · 2026</span>
              </div>
              <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:"-.03em", lineHeight:1.15 }}>9 Platforms Compared · Complete Source Code Only</h1>
              <p style={{ fontSize:12, color:"#64748b", marginTop:5 }}>
                Budget: <span style={{ color:"#34d399", fontWeight:700 }}>≤ $900</span> &nbsp;·&nbsp; Stack: Node.js/React + .NET/Angular &nbsp;·&nbsp; Requirements: Multi-app marketplace, Multi-tenant, SSO, Billing
              </p>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <button className="btn" onClick={()=>setShowOver(!showOver)} style={{
                padding:"7px 13px", borderRadius:7, fontSize:11, fontWeight:600,
                background: showOver ? "rgba(248,113,113,0.12)" : "rgba(255,255,255,0.05)",
                color: showOver ? "#f87171" : "#64748b",
                border:`1px solid ${showOver ? "#f8717128" : "rgba(255,255,255,0.08)"}`,
              }}>{showOver ? "🔒 ≤$900 only" : "👁 Show all 9"}</button>
              {["table","detail"].map(v => (
                <button key={v} className="btn" onClick={()=>setView(v)} style={{
                  padding:"7px 13px", borderRadius:7, fontSize:11, fontWeight:600,
                  background: view===v ? "#34d399" : "rgba(255,255,255,0.04)",
                  color: view===v ? "#06090f" : "#64748b",
                  border:`1px solid ${view===v ? "#34d399" : "rgba(255,255,255,0.07)"}`,
                }}>{v==="table" ? "📊 Table" : "🔍 Detail"}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1360, margin:"0 auto", padding:"24px 32px" }}>

        {/* WINNER BANNER */}
        <div className="fade" style={{
          background:"linear-gradient(120deg,rgba(245,158,11,0.09),rgba(52,211,153,0.06))",
          border:"1px solid rgba(245,158,11,0.28)", borderRadius:12, padding:"16px 22px",
          marginBottom:22, display:"flex", gap:14, alignItems:"flex-start", flexWrap:"wrap",
        }}>
          <span style={{ fontSize:32 }}>🏆</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#f59e0b", letterSpacing:".15em", marginBottom:4 }}>RECOMMENDED · UNDER $900 · ALIGNED WITH YOUR REQUIREMENTS</div>
            <div style={{ fontSize:14, fontWeight:700, lineHeight:1.6 }}>
              <span style={{ color:"#f59e0b" }}>MakerKit ($299)</span> — best maintained, advanced billing, RBAC, admin panel, multi-tenancy. Pair with{" "}
              <span style={{ color:"#60a5fa" }}>Zitadel (free)</span> for cross-app SSO as you scale to 3+ apps.
            </div>
            <div style={{ fontSize:11, color:"#64748b", marginTop:3 }}>
              PHP preferred? → SaaSykit Complete ($299). Long-term multi-stack marketplace → Composable Stack (Zitadel + Stripe + K8s). Over budget? → ABP Commercial is perfect for .NET/Angular but costs $2,999/yr.
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {[["#1 Best Fit","MakerKit","#f59e0b"],["#2 Runner-Up","SaasRock","#60a5fa"],["#3 PHP Option","SaaSykit Complete","#a78bfa"],["#4 Long-Term","Composable Stack","#34d399"]].map(([r,n,c])=>(
              <div key={n} style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ fontSize:9, color:c, fontWeight:700, minWidth:80, fontFamily:"monospace" }}>{r}</span>
                <span style={{ fontSize:11, color:"#e2e8f0" }}>{n}</span>
              </div>
            ))}
          </div>
        </div>

        {view==="table" && (
          <>
            <div style={{ overflowX:"auto", borderRadius:12, border:"1px solid rgba(255,255,255,0.06)" }} className="fade">
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:1200 }}>
                <thead>
                  <tr style={{ background:"rgba(255,255,255,0.025)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    {["#","Platform","Stack","Price","Src","DB",...CRITERIA.map(c=>c.icon+" "+c.label),"🔮 Future","Score","Verdict"].map((h,i)=>(
                      <th key={i} style={{
                        padding:"10px 11px", textAlign: i<=1?"left":"center",
                        fontSize:9, fontWeight:700, color:"#475569",
                        textTransform:"uppercase", letterSpacing:".07em",
                        fontFamily:"'JetBrains Mono',monospace", whiteSpace:"nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p,i)=>{
                    const sc=totalScore(p);
                    const isSel=selected===p.name;
                    return (
                      <tr key={p.name}
                        className={`tr${isSel?" sel":""}`}
                        onClick={()=>{ setSelected(p.name); setView("detail"); }}
                        style={{
                          borderBottom:"1px solid rgba(255,255,255,0.04)",
                          background: i%2===0?"transparent":"rgba(255,255,255,0.012)",
                          borderLeft:"2px solid transparent", transition:"all .12s",
                          opacity: !p.withinBudget ? 0.5 : 1,
                        }}
                      >
                        <td style={{ padding:"12px 11px", textAlign:"center" }}>
                          <span style={{ fontFamily:"monospace", fontSize:10, color:"#475569" }}>{i+1}</span>
                        </td>
                        <td style={{ padding:"12px 11px", minWidth:130 }}>
                          <div style={{ fontWeight:700, fontSize:12 }}>{p.name}</div>
                          <div style={{ fontSize:9, color:"#475569", fontFamily:"monospace" }}>{p.url}</div>
                          {!p.withinBudget && <div style={{ fontSize:8, color:"#f87171", fontWeight:800, marginTop:1 }}>OVER BUDGET</div>}
                          {p.name==="MakerKit" && <div style={{ fontSize:8, color:"#f59e0b", fontWeight:800, marginTop:1 }}>★ TOP PICK</div>}
                        </td>
                        <td style={{ padding:"12px 9px", textAlign:"center" }}>
                          <span style={{ fontSize:9, color:"#8a9bb0", background:"rgba(255,255,255,0.05)", padding:"2px 5px", borderRadius:4, whiteSpace:"nowrap" }}>{p.stack}</span>
                        </td>
                        <td style={{ padding:"12px 9px", textAlign:"center", minWidth:120 }}>
                          <div style={{ fontWeight:700, fontSize:11, color: !p.withinBudget?"#f87171":p.price===0?"#34d399":"#e2e8f0" }}>{p.priceLabel}</div>
                          <div style={{ fontSize:9, color:"#475569", marginTop:1 }}>{p.type}</div>
                        </td>
                        <td style={{ padding:"12px 9px", textAlign:"center" }}>
                          <span style={{ fontSize:14 }}>{p.sourceCode?"✅":"❌"}</span>
                        </td>
                        <td style={{ padding:"12px 9px", textAlign:"center", minWidth:110 }}>
                          <span style={{ fontSize:9, color:"#64748b", whiteSpace:"nowrap" }}>{p.db}</span>
                        </td>
                        {CRITERIA.map(c=>(
                          <td key={c.key} style={{ padding:"9px 8px", textAlign:"center" }}>
                            <Dots score={p[c.key]}/>
                          </td>
                        ))}
                        <td style={{ padding:"9px 11px", minWidth:85 }}><Bar score={p.futureProof}/></td>
                        <td style={{ padding:"9px 11px", textAlign:"center" }}>
                          <span style={{ fontFamily:"monospace", fontSize:14, fontWeight:800, color:sc>=38?"#34d399":sc>=32?"#fbbf24":"#94a3b8" }}>{sc}</span>
                          <span style={{ fontSize:8, color:"#475569" }}>/45</span>
                        </td>
                        <td style={{ padding:"9px 11px", textAlign:"center" }}>
                          <Chip label={p.tag} color={p.verdictColor}/>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display:"flex", gap:16, marginTop:10, flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ fontSize:10, color:"#475569" }}>🟢 4-5 Excellent · 🟡 3 Good · 🔴 1-2 Poor &nbsp;·&nbsp; Score = sum of 8 criteria + future-proof (max 45)</span>
              <span className="btn" style={{ marginLeft:"auto", fontSize:11, color:"#34d399", cursor:"pointer" }} onClick={()=>setShowOver(!showOver)}>
                {showOver ? "Hide over-budget" : `+ Show ${platforms.filter(p=>!p.withinBudget).length} over-budget platform`}
              </span>
            </div>

            {/* ROADMAP */}
            <div style={{ marginTop:32, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:26 }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#34d399", letterSpacing:".15em", marginBottom:14 }}>YOUR PHASED ROADMAP — ALIGNED WITH REQUIREMENTS</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:12 }}>
                {[
                  { phase:"Phase 1 · Now", icon:"🚀", color:"#f59e0b", title:"MakerKit ($299) + Zitadel (free)",
                    desc:"Buy MakerKit for your marketplace portal (Next.js/React). Build the app catalog, subscription flows, and admin panel on top of it. Add Zitadel as a free self-hosted OIDC/SAML identity provider — enabling SSO across OpenSign (Node.js) and your .NET apps without code changes.", cost:"$299 one-time + $0 Zitadel" },
                  { phase:"Phase 2 · Scale to 3+ Apps", icon:"🔐", color:"#60a5fa", title:"Lago (free) + Kubernetes",
                    desc:"As you add more apps, containerize each with Docker and deploy to Kubernetes namespaces (one per tenant). Add Lago for open-source usage-based billing and invoice management. MakerKit's admin panel becomes your central control plane.", cost:"$100–200/mo infra" },
                  { phase:"Phase 3 · Full Marketplace", icon:"🌐", color:"#a78bfa", title:"Custom App Catalog + App Onboarding Pipeline",
                    desc:"Build a custom app catalog UI (on top of MakerKit) with app pages, screenshots, categories, and search. Build an app onboarding pipeline: any Docker image → registered in Zitadel → Helm chart → listed in catalog. Fully stack-agnostic marketplace.", cost:"3–4 months dev + infra" },
                ].map(r=>(
                  <div key={r.phase} style={{ background:`${r.color}09`, border:`1px solid ${r.color}22`, borderRadius:11, padding:18 }}>
                    <div style={{ display:"flex", gap:9, alignItems:"flex-start", marginBottom:10 }}>
                      <span style={{ fontSize:18 }}>{r.icon}</span>
                      <div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:r.color, letterSpacing:".1em", marginBottom:2 }}>{r.phase}</div>
                        <div style={{ fontWeight:700, fontSize:13 }}>{r.title}</div>
                      </div>
                    </div>
                    <p style={{ fontSize:11, color:"#8a9bb0", lineHeight:1.7, marginBottom:10 }}>{r.desc}</p>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:r.color, background:`${r.color}12`, padding:"4px 9px", borderRadius:5, display:"inline-block" }}>{r.cost}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view==="detail" && (
          <div className="fade">
            <div style={{ display:"flex", gap:7, marginBottom:20, flexWrap:"wrap" }}>
              {platforms.map(p=>(
                <button key={p.name} className="chip" onClick={()=>setSelected(p.name)} style={{
                  padding:"6px 12px", borderRadius:7, fontSize:10, fontWeight:600,
                  background: selected===p.name ? `${p.verdictColor}20` : "rgba(255,255,255,0.04)",
                  color: selected===p.name ? p.verdictColor : "#64748b",
                  border:`1px solid ${selected===p.name ? `${p.verdictColor}40` : "rgba(255,255,255,0.07)"}`,
                  opacity: !p.withinBudget && selected!==p.name ? 0.5 : 1,
                }}>
                  {p.name}{!p.withinBudget ? " ⚠️" : ""}
                </button>
              ))}
            </div>

            {sel && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {/* Header */}
                <div style={{ gridColumn:"1/-1", background:`linear-gradient(135deg,${sel.verdictColor}10,rgba(255,255,255,.02))`, border:`1px solid ${sel.verdictColor}28`, borderRadius:12, padding:22 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12, alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:sel.verdictColor, letterSpacing:".15em", marginBottom:5 }}>{sel.type} · {sel.url}</div>
                      <h2 style={{ fontSize:22, fontWeight:800, marginBottom:3 }}>{sel.name}</h2>
                      <div style={{ fontSize:11, color:"#64748b" }}>Stack: <b style={{ color:"#e2e8f0" }}>{sel.stack}</b> &nbsp;·&nbsp; DB: <b style={{ color:"#e2e8f0" }}>{sel.db}</b> &nbsp;·&nbsp; Auth: <b style={{ color:"#e2e8f0" }}>{sel.auth}</b></div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:20, fontWeight:800, color: !sel.withinBudget?"#f87171":sel.price===0?"#34d399":"#e2e8f0" }}>{sel.priceLabel}</div>
                      <div style={{ fontSize:10, color:"#64748b", marginTop:3, maxWidth:210 }}>{sel.priceNote}</div>
                      <div style={{ marginTop:8, display:"flex", gap:5, justifyContent:"flex-end" }}>
                        <Chip label={sel.tag} color={sel.verdictColor}/>
                        <Chip label={sel.withinBudget ? "✓ WITHIN $900" : "✗ OVER BUDGET"} color={sel.withinBudget ? "#34d399" : "#f87171"}/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scores */}
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:20 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#475569", letterSpacing:".1em", marginBottom:14, textTransform:"uppercase" }}>Feature Scores</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {CRITERIA.map(c=>(
                      <div key={c.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                        <span style={{ fontSize:11, color:"#8a9bb0", minWidth:130 }}>{c.icon} {c.label}</span>
                        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <Dots score={sel[c.key]}/>
                          <span style={{ fontSize:9, fontFamily:"monospace", color:sel[c.key]>=4?"#34d399":sel[c.key]===3?"#fbbf24":"#f87171", width:20, textAlign:"right" }}>{sel[c.key]}/5</span>
                        </div>
                      </div>
                    ))}
                    <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:11, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:11, fontWeight:700 }}>🔮 Future-Proof</span>
                      <div style={{ width:120 }}><Bar score={sel.futureProof}/></div>
                    </div>
                    <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:12, fontWeight:800 }}>Total Score</span>
                      <span style={{ fontFamily:"monospace", fontSize:20, fontWeight:800, color:totalScore(sel)>=38?"#34d399":totalScore(sel)>=32?"#fbbf24":"#94a3b8" }}>
                        {totalScore(sel)}<span style={{ fontSize:11, color:"#475569" }}>/45</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pros/Cons */}
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:20 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#475569", letterSpacing:".1em", marginBottom:14, textTransform:"uppercase" }}>Pros & Cons vs Your Requirements</div>
                  <div style={{ marginBottom:16 }}>
                    {sel.pros.map(p=>(
                      <div key={p} style={{ display:"flex", gap:8, marginBottom:9 }}>
                        <span style={{ color:"#34d399", fontSize:12, flexShrink:0, marginTop:1 }}>✓</span>
                        <span style={{ fontSize:11, color:"#c8d5e3", lineHeight:1.6 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:14 }}>
                    {sel.cons.map(c=>(
                      <div key={c} style={{ display:"flex", gap:8, marginBottom:9 }}>
                        <span style={{ color:"#f87171", fontSize:12, flexShrink:0, marginTop:1 }}>✗</span>
                        <span style={{ fontSize:11, color:"#8a9bb0", lineHeight:1.6 }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fit Grid */}
                <div style={{ gridColumn:"1/-1", background:`${sel.verdictColor}07`, border:`1px solid ${sel.verdictColor}18`, borderRadius:12, padding:18 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:sel.verdictColor, letterSpacing:".15em", marginBottom:12 }}>FIT FOR YOUR EXACT REQUIREMENTS</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:10 }}>
                    {[
                      { q:"Node.js / React fit?", a: sel.stack.includes("Node")||sel.stack.includes("React")||sel.stack.includes("Next") ? "✅ Yes" : sel.stack.includes("Any") ? "✅ Stack-agnostic" : "⚠️ PHP — needs bridge" },
                      { q:".NET / Angular fit?", a: sel.stack.includes(".NET") ? "✅ Perfect" : sel.stack.includes("Any") ? "✅ Stack-agnostic" : "❌ JS/PHP — needs bridge" },
                      { q:"Multi-app marketplace?", a: sel.appOnboarding>=4 ? "✅ Built-in" : sel.appOnboarding===3 ? "⚠️ Partial" : "❌ Custom build needed" },
                      { q:"Within $900 budget?", a: sel.withinBudget ? `✅ ${sel.priceLabel}` : `❌ ${sel.priceLabel}` },
                      { q:"Source code included?", a: sel.sourceCode ? "✅ Full source" : "❌ No" },
                      { q:"Future-proof (3–5 yrs)?", a: sel.futureProof>=4 ? "✅ Strong" : sel.futureProof===3 ? "⚠️ Moderate" : "❌ Risky" },
                    ].map(item=>(
                      <div key={item.q} style={{ background:"rgba(0,0,0,0.25)", borderRadius:8, padding:"9px 12px" }}>
                        <div style={{ fontSize:10, color:"#64748b", marginBottom:3 }}>{item.q}</div>
                        <div style={{ fontSize:11, fontWeight:700, color:item.a.startsWith("✅")?"#34d399":item.a.startsWith("⚠️")?"#fbbf24":"#f87171" }}>{item.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
