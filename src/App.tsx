import { useState, type CSSProperties, type ReactNode } from "react";

const C = {
  navy:"#0d1b2e", navyMid:"#1a2f4a", teal:"#0e9e8e", tealLight:"#d0f5f1",
  amber:"#e8922a", amberLight:"#fdf3e7", slate:"#64748b", slateLight:"#f1f5f9",
  border:"#e2e8f0", white:"#ffffff",
  eom:{ bg:"#c2410c", light:"#fff7ed", border:"#c2410c", text:"#7c2d12" },
  fft:{ bg:"#b45309", light:"#fffbeb", border:"#b45309", text:"#78350f" },
  gdt:{ bg:"#15803d", light:"#f0fdf4", border:"#15803d", text:"#14532d" },
  cst:{ bg:"#1d4ed8", light:"#eff6ff", border:"#1d4ed8", text:"#1e3a8a" },
  pt: { bg:"#6d28d9", light:"#f5f3ff", border:"#6d28d9", text:"#3b0764" },
};

const teams = [
  { id:"eom", name:"Gas Emergency & Operations", abbr:"EOM", territory:"Gas EOM Zone", color:C.eom,
    agents:["Gas Emergency Technician","Gas Operations Engineer","Pipeline Technician","EOM Supervisor","Network Control Operator"],
    woTypes:["Emergency Gas Operation","Corrective Gas Maintenance","Preventive Gas Maintenance","Gas Facility Operation","Post-Incident Repair"],
    services:["Emergency Gas Isolation","PRV Inspection & Service","Gas Compressor Service","Pipeline Leak Repair","CGS/DRS Full Service"],
    ppm:["Monthly — PRV & ECV Test","Monthly — CGS Walk-through","Quarterly — M&R Station Service","Semi-Annual — DRS Inspection","Annual — Pipeline Integrity"],
    jobSheet:"EOM Gas Operations Checklist" },
  { id:"fft", name:"Firefighting Team", abbr:"FFT", territory:"Emergency Response Zone", color:C.fft,
    agents:["Emergency Response Technician","Incident Commander","Safety Officer","FFT Supervisor"],
    woTypes:["Emergency Response","Hot Work Standby","High-Risk Work Standby","Post-Incident Assessment"],
    services:["Gas Fire Emergency Response","Hot Work Standby","Post-Incident Safety Assessment","Emergency Drill"],
    ppm:["Monthly — Equipment Inspection","Monthly — BA Set Test","Quarterly — Emergency Drill","Annual — Civil Defense Exercise"],
    jobSheet:"FFT Emergency Response Checklist" },
  { id:"gdt", name:"Gas Distribution Team", abbr:"GDT", territory:"Distribution Zone", color:C.gdt,
    agents:["Distribution Technician","Pipeline Patrol Officer","Meter Technician","GDT Supervisor"],
    woTypes:["Pipeline Patrol Inspection","Valve Inspection & Test","Meter Reading","Leak Survey"],
    services:["GDT - Pipeline Route Patrol","GDT - Valve Inspection","GDT - Industrial Meter Reading","GDT - Leak Survey"],
    ppm:["Quarterly — Pipeline Patrol","Semi-Annual — Valve Exercise","Annual — Network Audit"],
    jobSheet:"GDT Pipeline Inspection Checklist" },
  { id:"cst", name:"Customer Service Team", abbr:"CST", territory:"Customer Service Zone", color:C.cst,
    agents:["Customer Service Engineer","Customer Liaison Officer","CST Supervisor"],
    woTypes:["New Gas Connection","Gas Disconnection","Meter Complaint","Gas Smell Investigation","Reconnection"],
    services:["CST - New Gas Connection","CST - Gas Disconnection","CST - Meter Fault Investigation","CST - Gas Smell Investigation","CST - Domestic Safety Inspection"],
    ppm:["Annual — Domestic Safety Inspection","Semi-Annual — Commercial Meter Audit"],
    jobSheet:"CST Customer Service Checklist" },
  { id:"pt", name:"Project Team", abbr:"PT", territory:"Projects Zone", color:C.pt,
    agents:["Project Engineer","Installation Technician","Commissioning Engineer","Project Manager"],
    woTypes:["New Installation","Network Upgrade","Commissioning & Handover","Post-Commissioning Inspection"],
    services:["PT - New Installation","PT - Network Upgrade","PT - Commissioning","PT - 6-Month Post-Commission Check"],
    ppm:["6-Month Post-Commissioning Check","Annual — Project Asset Handover"],
    jobSheet:"PT Project Work Checklist" },
];

const flowSteps = [
  { id:1, icon:"📥", label:"Service Request / PPM Trigger", desc:"Manual request, customer call, or PPM auto-generates WO", who:"Dispatcher / System",
    actions:["Customer calls → CST raises Service Request","PPM schedule auto-generates WO (14 days in advance)","EOM/FFT raise Emergency WO manually","GDT patrol triggers WO from inspection finding"],
    result:"Work Order created with: Asset, Service, Priority, Territory" },
  { id:2, icon:"📋", label:"Work Order Created", desc:"WO raised with Asset, Service, Territory, Priority", who:"Dispatcher / System",
    actions:["WO Number auto-generated","Asset linked (Parent + Child)","Service selected from catalogue","Priority set: Critical / High / Medium / Normal","Territory assigned → routes to correct team"],
    result:"WO status: Open — ready for scheduling" },
  { id:3, icon:"🗺️", label:"Dispatch Console", desc:"Dispatcher assigns appointment via Gantt/Map view", who:"Dispatcher",
    actions:["Open Dispatch Console","Filter by Territory (e.g. Gas EOM Zone)","View Gantt / Map / Grid of available agents","Drag WO onto available technician","Assisted scheduling suggests best agent by skill + proximity"],
    result:"Service Appointment created — Technician notified" },
  { id:4, icon:"📅", label:"Service Appointment", desc:"Technician notified, travel tracked via mobile app", who:"Field Technician (Mobile App)",
    actions:["Push notification received on FSM mobile app","Tap START TRAVEL → dispatcher sees agent en route","Navigate to site via integrated maps","Tap ARRIVED ON SITE → GPS confirmed","Job Sheet unlocked and ready to fill"],
    result:"Appointment status: In Progress" },
  { id:5, icon:"📝", label:"On Site — Job Sheet", desc:"Technician fills job sheet, records readings, photos", who:"Field Technician (Mobile App)",
    actions:["Open Job Sheet linked to the service","Fill Section: Safety & Permits (PTW, Isolation)","Fill Section: Gas Readings Before Work","Fill Section: Work Performed","Capture Before/During/After photos","Works OFFLINE if no signal — auto-syncs on reconnect"],
    result:"Job Sheet status: Draft → Completed" },
  { id:6, icon:"🔩", label:"Parts Used", desc:"Parts logged against appointment from catalogue", who:"Field Technician (Mobile App)",
    actions:["Pre-populated parts list shown from WO","Adjust quantities actually used","Add extra parts from catalogue if needed","Parts logged against the appointment","Stock deducted in Zoho Inventory (if integrated)"],
    result:"Parts usage recorded against WO" },
  { id:7, icon:"✍️", label:"Sign Off", desc:"Technician + Site Rep sign on mobile app", who:"Technician + Site Representative",
    actions:["Technician enters work summary","Technician signs on mobile screen","Hand device to site representative","Site rep confirms work satisfactory and signs","Date and time auto-captured"],
    result:"Job Sheet status: Completed — signatures attached" },
  { id:8, icon:"✅", label:"WO Closed", desc:"Work Order status set to Completed", who:"Technician / Dispatcher",
    actions:["Technician marks appointment as Completed on mobile","Dispatcher reviews and closes WO from console","Asset record updated: Last Service Date, Next Due","PPM schedule auto-updates next due date"],
    result:"Work Order status: Completed — all records updated" },
  { id:9, icon:"📄", label:"Service Report PDF", desc:"Auto-generated PDF sent to SERGAS records", who:"System (Auto-generated)",
    actions:["PDF Service Report auto-generated from WO data","Includes: WO details, asset info, work performed, gas readings","Includes: technician + site rep signatures and photos","Sent automatically to SERGAS records/email"],
    result:"Service Report PDF archived and distributed" },
];

const assetHierarchy = [
  { parent:"City Gate Station (CGS-001)", children:["PRV Unit A","PRV Unit B","Gas Compressor #1","ECV #1","Gas Detector Panel"], team:"eom" },
  { parent:"District Regulating Station (DRS-001)", children:["Filter Separator","Pressure Regulator Primary","Safety Relief Valve","SCADA Unit"], team:"eom" },
  { parent:"Pipeline Network — North Zone", children:["Section NZ-001","Section NZ-002","Block Valve BV-001","CP Test Point CP-001"], team:"gdt" },
  { parent:"Customer Connection — Commercial", children:["Service Riser","Meter Assembly","Emergency Control Valve"], team:"cst" },
];

// ─── ROADMAP DATA ─────────────────────────────────────
const processOwnerRoadmap = [
  { week:"Week 1", days:"Days 1–5", color:"#2563eb", light:"#eff6ff", tasks:[
    { activity:"Kick-off Workshop with All Dept. Heads", responsible:"Process Owner + Dept. Heads (EOM, CS, FF, PRJ)", deadline:"Day 1", note:"Set expectations, confirm scope & department leads" },
    { activity:"Define & Agree Territory Structure", responsible:"Process Owner + Dept. Heads", deadline:"Day 2", note:"Confirm PREFIX-LOCATION naming; approve territory list" },
    { activity:"Review & Validate Service Catalogue per Dept.", responsible:"Each Department Head", deadline:"Day 3", note:"Confirm services, WO types, priority levels per team" },
    { activity:"Collect & Cleanse Asset Master Data from CRM", responsible:"Process Owner + IT", deadline:"Day 3–4", note:"Export assets; validate fields, remove duplicates" },
    { activity:"Approve Job Sheet Templates (4 types)", responsible:"Dept. Heads + HSE Lead", deadline:"Day 5", note:"PPM Checklist, Normal Service, FF Inspection, Project Completion" },
    { activity:"Define PPM Schedules per Asset Type", responsible:"EOM / GDT Dept. Heads", deadline:"Day 5", note:"Confirm frequency: monthly, quarterly, semi-annual, annual" },
  ]},
  { week:"Week 2", days:"Days 6–10", color:"#0e9e8e", light:"#d0f5f1", tasks:[
    { activity:"User Role Matrix Sign-off", responsible:"Process Owner + HR / IT", deadline:"Day 6", note:"Define roles: Technician, Dispatcher, Supervisor, Back Office" },
    { activity:"Territory-to-User Mapping Approval", responsible:"Dept. Heads", deadline:"Day 7", note:"Assign each agent to their correct territory code" },
    { activity:"Work Order Automation Logic Review", responsible:"Process Owner + IT", deadline:"Day 7–8", note:"Confirm CRM Snag → FSM WO trigger rules and field mappings" },
    { activity:"Status Lifecycle Approval", responsible:"Process Owner", deadline:"Day 8", note:"Sign off CRM ↔ FSM status mapping table" },
    { activity:"UAT Scenario Design", responsible:"Process Owner + Dept. Heads", deadline:"Day 9–10", note:"Define 10–15 real-world test cases per department" },
    { activity:"Data Migration Sign-off (Assets + Accounts)", responsible:"Process Owner", deadline:"Day 10", note:"Approve final cleaned dataset before IT push to FSM" },
  ]},
  { week:"Week 3", days:"Days 11–17", color:"#e8922a", light:"#fdf3e7", tasks:[
    { activity:"Pilot UAT — EOM & CST Teams", responsible:"EOM Supervisor + CST Supervisor", deadline:"Day 11–13", note:"Run test work orders end-to-end on staging environment" },
    { activity:"Pilot UAT — FFT & PT Teams", responsible:"FFT Supervisor + PT Manager", deadline:"Day 13–15", note:"Validate job sheets, sign-off flow, territory access" },
    { activity:"Dispatcher Training (Gantt + Map Console)", responsible:"Dispatchers, facilitated by IT", deadline:"Day 14", note:"Hands-on dispatch console, assignment workflow" },
    { activity:"Technician Mobile App Training", responsible:"All Field Technicians", deadline:"Day 15–16", note:"Travel, arrival, job sheet, parts, signature flow" },
    { activity:"UAT Defect Log & Remediation", responsible:"Process Owner + IT", deadline:"Day 16–17", note:"Capture feedback; classify critical vs minor; prioritize fixes" },
    { activity:"Management Demo & Go-Live Approval", responsible:"Senior Management + Process Owner", deadline:"Day 17", note:"Present UAT results; obtain formal go-live authorization" },
  ]},
  { week:"Week 4", days:"Days 18–28", color:"#15803d", light:"#f0fdf4", tasks:[
    { activity:"Go-Live — Pilot Territory (DXB-CS)", responsible:"CST Team + Dispatcher", deadline:"Day 18", note:"First live territory; monitor all WO activity closely" },
    { activity:"Go-Live — EOM & GDT Territories", responsible:"EOM + GDT Teams", deadline:"Day 19–20", note:"Hypercare support; daily check-in calls with Process Owner" },
    { activity:"Go-Live — FFT & PT Territories", responsible:"FFT + PT Teams", deadline:"Day 21–22", note:"Full rollout across all territories" },
    { activity:"Legacy System Parallel Run", responsible:"Process Owner", deadline:"Day 18–25", note:"Run old & new systems in parallel; validate data parity" },
    { activity:"KPI Dashboard Review", responsible:"Process Owner + Management", deadline:"Day 25", note:"First live reporting: WO completion rate, SLA adherence" },
    { activity:"Hypercare Review & Sign-off", responsible:"Process Owner", deadline:"Day 28", note:"Close project; document lessons learned; confirm steady state" },
  ]},
];

const itRoadmap = [
  { week:"Week 1", days:"Days 1–5", color:"#2563eb", light:"#eff6ff", tasks:[
    { activity:"FSM Organization & Module Configuration", responsible:"Zoho FSM Admin / IT", deadline:"Day 1–2", note:"Set up org, time zones, currencies, modules" },
    { activity:"Territory Creation & Hierarchy Setup", responsible:"IT / FSM Admin", deadline:"Day 2–3", note:"Create all PREFIX-LOCATION territories; set parent/child hierarchy" },
    { activity:"Role & Profile Configuration in FSM", responsible:"IT / FSM Admin", deadline:"Day 3", note:"Create roles: Technician, Dispatcher, Supervisor, Back Office, Manager" },
    { activity:"CRM Integration Setup (API Auth)", responsible:"IT Developer", deadline:"Day 3–4", note:"Configure Zoho CRM ↔ FSM API connection; test auth tokens" },
    { activity:"Asset Data Import from CRM (cleaned data)", responsible:"IT / Data Analyst", deadline:"Day 4–5", note:"Import cleaned asset data from CRM into Zoho FSM — depends on Process Owner data sign-off by Day 4" },
  ]},
  { week:"Week 2", days:"Days 6–10", color:"#0e9e8e", light:"#d0f5f1", tasks:[
    { activity:"CRM → FSM Asset Sync (One-Way API)", responsible:"IT Developer", deadline:"Day 6–7", note:"Build and test Accounts + Assets sync via Zoho Flow / custom API" },
    { activity:"Automation: Snag → FSM Work Order", responsible:"IT Developer", deadline:"Day 7–8", note:"Webhook trigger on Snag Status = Complete; field mapping implementation" },
    { activity:"Status Webhook (FSM → CRM real-time)", responsible:"IT Developer", deadline:"Day 8–9", note:"FSM WO status change pushes update back to CRM Snag record" },
    { activity:"User Account Creation & Territory Assignment", responsible:"IT / HR", deadline:"Day 9–10", note:"Create all user accounts; assign territory codes and roles" },
  ]},
  { week:"Week 3", days:"Days 11–17", color:"#e8922a", light:"#fdf3e7", tasks:[
    { activity:"Integration End-to-End Testing", responsible:"IT Developer + QA", deadline:"Day 11–13", note:"Full CRM → FSM → CRM round-trip validation with test data" },
    { activity:"Territory Permission Testing", responsible:"IT / QA", deadline:"Day 13–15", note:"Validate that technicians cannot access cross-territory data" },
    { activity:"UAT Bug Fixes & Patches", responsible:"IT Developer", deadline:"Day 15–17", note:"Prioritize critical blockers first; document all changes" },
  ]},
  { week:"Week 4", days:"Days 18–28", color:"#15803d", light:"#f0fdf4", tasks:[
    { activity:"Production Environment Go-Live Preparation", responsible:"IT", deadline:"Day 17–18", note:"Final production config check; backups; rollback plan ready" },
    { activity:"Production Data Migration (Final Push)", responsible:"IT / Data Analyst", deadline:"Day 18", note:"Push final cleansed asset & account data to live environment" },
    { activity:"Monitoring & Alerting Setup", responsible:"IT", deadline:"Day 18–19", note:"Set up sync failure alerts, API error logging, webhook monitors" },
    { activity:"Territory Strict Permission Enforcement", responsible:"IT / FSM Admin", deadline:"Day 20–22", note:"ETA 4–5 weeks from Go-Live per Zoho roadmap — test when available" },
    { activity:"Performance & Load Testing", responsible:"IT / QA", deadline:"Day 22–24", note:"Simulate concurrent users; validate system response times" },
    { activity:"Hypercare Technical Support", responsible:"IT", deadline:"Day 18–28", note:"On-call support for all live territories; daily sync with Process Owner" },
  ]},
];

// ─── OUT OF SCOPE — PROCESS OWNER RESPONSIBILITIES ────
const outOfScopeItems = [
  {
    category: "Job Sheet Template Build",
    icon: "📝",
    owner: "Process Owner / Department Heads + HSE Lead",
    description: "Design, content, and sign-off of all job sheet templates (PPM Checklist, Normal Service, Fire Fighting Inspection, Project Completion). IT will configure the approved templates in FSM only after full Process Owner approval.",
    templates: [
      "PPM Checklist — 50-Point pass/fail per asset type",
      "Normal Service — Reactive repairs & call-out form",
      "Fire Fighting Inspection — Safety compliance audit",
      "Project Completion — Handover & commissioning sign-off",
    ],
    note: "IT will not build templates without a fully approved and signed-off template document from the Process Owner.",
  },
  {
    category: "PPM Schedule Configuration",
    icon: "🔄",
    owner: "Process Owner / EOM & GDT Department Heads",
    description: "Define and document PPM frequencies, asset types covered, and maintenance intervals. IT will configure the schedule in FSM only after the Process Owner provides a finalized and approved PPM matrix.",
    templates: [
      "Monthly — PRV & ECV Test schedule",
      "Monthly — CGS Walk-through plan",
      "Quarterly — M&R Station Service list",
      "Semi-Annual — DRS Inspection calendar",
      "Annual — Pipeline Integrity review",
    ],
    note: "The PPM matrix must be submitted to IT in writing before Week 2 Day 6 to avoid schedule delays.",
  },
];


// ─── SHARED COMPONENTS ────────────────────────────────
type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

type CardProps = {
  children: ReactNode;
  style?: CSSProperties;
};

type PillProps = {
  label: string;
  bg?: string;
  color?: string;
  style?: CSSProperties;
};

type DotProps = {
  color?: string;
};

function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:C.teal, marginBottom:6 }}>{eyebrow}</div>
      <h2 style={{ margin:0, fontSize:26, fontWeight:900, color:C.navy, lineHeight:1.2, fontFamily:"Georgia,serif" }}>{title}</h2>
      {subtitle && <p style={{ margin:"8px 0 0", fontSize:14, color:C.slate, lineHeight:1.65, maxWidth:700 }}>{subtitle}</p>}
    </div>
  );
}
function Card({ children, style={} }: CardProps) {
  return <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:20, boxShadow:"0 2px 10px rgba(0,0,0,0.04)", ...style }}>{children}</div>;
}
function Pill({ label, bg, color, style={} }: PillProps) {
  return <span style={{ display:"inline-block", background:bg||C.tealLight, color:color||C.teal, borderRadius:20, padding:"3px 11px", fontSize:11, fontWeight:700, ...style }}>{label}</span>;
}
function Dot({ color }: DotProps) {
  return <div style={{ width:6, height:6, borderRadius:"50%", background:color||C.teal, marginTop:6, flexShrink:0 }} />;
}

// ─── STRATEGY ─────────────────────────────────────────
function StrategySection() {
  return (
    <div>
      <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 100%)`, borderRadius:18, padding:"44px 48px", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-60, top:-60, width:300, height:300, borderRadius:"50%", border:"2px solid rgba(14,158,142,0.12)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:40, bottom:-40, width:200, height:200, borderRadius:"50%", border:"1px solid rgba(232,146,42,0.12)", pointerEvents:"none" }} />
        <Pill label="ZOHO FSM · SERGAS" bg="rgba(14,158,142,0.18)" color={C.teal} style={{ marginBottom:14 }} />
        <h1 style={{ margin:"0 0 12px", fontSize:36, fontWeight:900, color:C.white, lineHeight:1.15, fontFamily:"Georgia,serif" }}>Centralized Implementation<br/>Strategy</h1>
        <p style={{ margin:"0 0 28px", fontSize:15, color:"rgba(255,255,255,0.6)", maxWidth:560, lineHeight:1.65 }}>One Platform. Multiple Departments. Full Control. — Unifying diverse operations into a single, cohesive ecosystem.</p>
        <div style={{ display:"flex", gap:14 }}>
          {[["⚖","Governance","Standardized protocols across all units"],["🔗","Integration","Seamless data flow: CRM ↔ FSM"],["📈","Scalability","Ready for multi-region expansion"]].map(([ic,t,d]) => (
            <div key={t} style={{ background:"rgba(255,255,255,0.06)", borderRadius:12, padding:"14px 18px", borderLeft:`3px solid ${C.teal}`, flex:1 }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{ic}</div>
              <div style={{ color:C.white, fontWeight:800, fontSize:13, marginBottom:3 }}>{t}</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
        <Card style={{ borderTop:`3px solid #dc2626` }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
            <div style={{ background:"#fef2f2", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>⚠️</div>
            <div><div style={{ fontSize:10, fontWeight:700, color:"#dc2626", textTransform:"uppercase", letterSpacing:1 }}>Current State</div><div style={{ fontWeight:800, fontSize:16, color:C.navy }}>Multiple Fragmented Systems</div></div>
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
            {[["Siloed Data","Customer & asset data in disconnected pockets, causing version conflicts"],["Inconsistent Processes","Each department follows different workflows, making standard audits impossible"],["Fragmented Reporting","Consolidating reports requires manual Excel work, causing delays and errors"],["Higher Maintenance","Multiple licenses and support contracts increase operational overhead"]].map(([t,d]) => (
              <div key={t} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                <Dot color="#dc2626" />
                <div><span style={{ fontWeight:700, fontSize:12, color:C.navy }}>{t}: </span><span style={{ fontSize:12, color:C.slate }}>{d}</span></div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ borderTop:`3px solid ${C.teal}` }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
            <div style={{ background:C.tealLight, borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>✅</div>
            <div><div style={{ fontSize:10, fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:1 }}>Future State</div><div style={{ fontWeight:800, fontSize:16, color:C.navy }}>Single Centralized System</div></div>
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
            {[["Unified Reporting","Real-time dashboards across all departments from a single source of truth"],["Centralized Control","Full visibility over all field operations and resource allocation"],["Seamless CRM Integration","Bi-directional sync ensures all teams see the same customer data"],["Standardized Processes","Uniform workflows for all territories ensure consistent service delivery"]].map(([t,d]) => (
              <div key={t} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                <Dot color={C.teal} />
                <div><span style={{ fontWeight:700, fontSize:12, color:C.navy }}>{t}: </span><span style={{ fontSize:12, color:C.slate }}>{d}</span></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Business Objective</div>
            <div style={{ fontWeight:900, fontSize:18, color:C.navy }}>Unified FSM Hub — Central Control</div>
            <div style={{ fontSize:13, color:C.slate, marginTop:4 }}>Implement one centralized platform while maintaining logical separation via Territory Structure</div>
          </div>
          <div style={{ background:C.navy, borderRadius:12, width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>🌐</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {[{l:"EOM",d:"Enterprise Operations & Maintenance",c:C.eom},{l:"Projects",d:"Capital Projects & Installations",c:C.pt},{l:"Customer Service",d:"Client Requests & Support",c:C.cst},{l:"Fire Fighting",d:"Specialized Safety Inspections",c:C.fft}].map(x => (
            <div key={x.l} style={{ background:x.c.light, borderTop:`3px solid ${x.c.bg}`, borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontWeight:800, fontSize:14, color:x.c.bg, marginBottom:4 }}>{x.l}</div>
              <div style={{ fontSize:11, color:x.c.text }}>{x.d}</div>
            </div>
          ))}
        </div>
      </Card>

      <SectionHeader eyebrow="Critical Success Factors" title="Five Pillars of Success" subtitle="Required to ensure system stability and user adoption across all departments" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
        {[{n:"01",ic:"🗄",t:"Clean CRM Data",c:C.teal,d:"Accurate master data (Assets, Accounts, Contacts) is the foundation. Legacy data must be cleansed before migration — garbage in, garbage out."},
          {n:"02",ic:"🗺",t:"Correct Territory Mapping",c:"#2563eb",d:"Logical separation of EOM, Projects, and Fire Fighting is critical. Incorrect mapping breaks access controls and reporting logic."},
          {n:"03",ic:"🔗",t:"Strong Integration Logic",c:"#6d28d9",d:"The API handshake between CRM and FSM must be robust. Sync failures cause operational delays and status mismatches."},
          {n:"04",ic:"👥",t:"Department Accountability",c:C.amber,d:"Each department head must own their specific process workflows. A centralized system does not mean a centralized workload."},
          {n:"05",ic:"⚖",t:"Management Alignment",c:C.navy,d:"Top-down enforcement is mandatory. Field technicians will not adopt the mobile app without strong leadership directives."}].map(f => (
          <div key={f.n} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:18, borderTop:`3px solid ${f.c}`, position:"relative" }}>
            <div style={{ position:"absolute", bottom:14, right:14, fontSize:36, fontWeight:900, color:`${f.c}10`, lineHeight:1, fontFamily:"Georgia,serif" }}>{f.n}</div>
            <div style={{ fontSize:26, marginBottom:10 }}>{f.ic}</div>
            <div style={{ fontWeight:800, fontSize:13, color:C.navy, marginBottom:6, lineHeight:1.3 }}>{f.t}</div>
            <div style={{ fontSize:11, color:C.slate, lineHeight:1.65 }}>{f.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ARCHITECTURE ─────────────────────────────────────
function ArchitectureSection() {
  return (
    <div>
      <SectionHeader eyebrow="System Architecture" title="Architecture Overview" subtitle="Clear delineation between Master Data management and Field Execution" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:20, alignItems:"center", marginBottom:24 }}>
        <Card style={{ borderTop:`4px solid ${C.navy}` }}>
          <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
            <div style={{ background:C.navy, borderRadius:10, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🗄</div>
            <div><div style={{ fontWeight:900, fontSize:16, color:C.navy }}>ZOHO CRM</div><div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1 }}>Master System</div></div>
          </div>
          {["Accounts (Customers)","Contacts","Snag Module (Issues)","Service Assets","Contracts / SLAs"].map(item => (
            <div key={item} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}><Dot color={C.slate} /><span style={{ fontSize:13, color:"#334155" }}>{item}</span></div>
          ))}
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:12, alignItems:"center" }}>
          <div style={{ background:C.amberLight, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"10px 16px", textAlign:"center", width:140 }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.amber, textTransform:"uppercase", letterSpacing:1 }}>Master Data Push</div>
            <div style={{ fontSize:24, margin:"4px 0", color:C.amber }}>→</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#92400e" }}>Sync Data</div>
          </div>
          <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:10, padding:"8px 16px", textAlign:"center", width:140 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#15803d" }}>API Integration</div>
          </div>
          <div style={{ background:C.tealLight, border:`1px solid ${C.teal}40`, borderRadius:10, padding:"10px 16px", textAlign:"center", width:140 }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:1 }}>Status Updates</div>
            <div style={{ fontSize:24, margin:"4px 0", color:C.teal }}>←</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#0f766e" }}>Real-time Status</div>
          </div>
        </div>
        <Card style={{ borderTop:`4px solid ${C.teal}` }}>
          <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
            <div style={{ background:C.teal, borderRadius:10, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🔧</div>
            <div><div style={{ fontWeight:900, fontSize:16, color:C.navy }}>ZOHO FSM</div><div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1 }}>Execution System</div></div>
          </div>
          {["Work Orders","Service Appointments","Job Sheets","Territory Dispatch","Mobile App Access"].map(item => (
            <div key={item} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}><Dot color={C.teal} /><span style={{ fontSize:13, color:"#334155" }}>{item}</span></div>
          ))}
        </Card>
      </div>

      <div style={{ background:C.amberLight, border:`1px solid ${C.amber}40`, borderRadius:12, padding:"14px 20px", marginBottom:28, display:"flex", gap:14 }}>
        <span style={{ fontSize:24, flexShrink:0 }}>💡</span>
        <div><span style={{ fontWeight:800, fontSize:13, color:C.navy }}>Architecture Principle: </span><span style={{ fontSize:13, color:"#7c3d12", lineHeight:1.7 }}>CRM acts as the "Single Source of Truth" for all customer and asset data. FSM is strictly for operational execution, consuming data from CRM and returning job completion status via API.</span></div>
      </div>

      <SectionHeader eyebrow="Data Governance" title="Asset Strategy Flow" subtitle="Controlled data propagation from Master CRM to Field Execution" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
        {[{n:1,t:"CRM Main Asset",c:"#2563eb",l:"#eff6ff",rows:[["Master Record","Created & managed by Back Office"],["Details","Purchase Date, Warranty, Location, Contract"],["Ownership","Full Read/Write access"]]},
          {n:2,t:"FSM Service Asset",c:C.teal,l:C.tealLight,rows:[["Operational Replica","Synced automatically via API"],["Enhancement","QR Codes generated for tagging"],["Access","Read-Only for basic details"]]},
          {n:3,t:"Child Assets",c:"#15803d",l:"#f0fdf4",rows:[["Components","Sub-parts linked to Parent Asset"],["Granularity","Allows specific maintenance tracking"],["Mapping","Inherits territory from Parent"]]},
          {n:4,t:"Execution Activities",c:C.amber,l:C.amberLight,rows:[["Work Orders","Linked to specific Asset ID"],["History","Full service audit trail builds up"],["Evidence","Photos/Readings tagged to Asset"]]}].map((s,i) => (
          <div key={s.n} style={{ background:C.white, borderRadius:14, border:`1.5px solid ${s.c}25`, overflow:"hidden" }}>
            <div style={{ background:s.l, borderBottom:`2px solid ${s.c}30`, padding:"12px 14px", display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ background:s.c, color:"#fff", borderRadius:"50%", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, flexShrink:0 }}>{s.n}</div>
              <div style={{ fontWeight:800, fontSize:13, color:s.c }}>{s.t}</div>
              {i<3 && <div style={{ marginLeft:"auto", fontSize:14, color:`${s.c}60` }}>→</div>}
            </div>
            <div style={{ padding:14 }}>
              {s.rows.map(([k,v]) => (<div key={k} style={{ marginBottom:10 }}><div style={{ fontSize:11, fontWeight:700, color:s.c }}>{k}</div><div style={{ fontSize:11, color:C.slate, lineHeight:1.55 }}>{v}</div></div>))}
            </div>
          </div>
        ))}
      </div>

      <SectionHeader eyebrow="Lifecycle Alignment" title="Status Synchronization" subtitle="Real-time status mapping between Field Operations and Back Office" />
      <Card style={{ marginBottom:28 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:0 }}>
          <div>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
              <div style={{ background:C.teal, borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>🔧</div>
              <div><div style={{ fontWeight:800, fontSize:14, color:C.navy }}>FSM Work Order</div><div style={{ fontSize:11, color:C.slate }}>Field View (Technician)</div></div>
            </div>
            {[{s:"New",c:"#64748b",bg:"#f1f5f9"},{s:"Scheduled",c:"#2563eb",bg:"#eff6ff"},{s:"In Progress",c:"#15803d",bg:"#f0fdf4"},{s:"Paused",c:"#dc2626",bg:"#fef2f2"},{s:"Completed",c:"#15803d",bg:"#dcfce7"},{s:"Cancelled",c:"#dc2626",bg:"#fef2f2"}].map(st => (
              <div key={st.s} style={{ background:st.bg, borderRadius:8, padding:"9px 14px", marginBottom:6, fontSize:13, fontWeight:600, color:st.c }}>{st.s}</div>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"0 24px", gap:38, paddingTop:50 }}>
            {["⇄","⇄","✓","⇄","✓","⇄"].map((ic,i) => <div key={i} style={{ fontSize:16, color:ic==="✓"?C.teal:C.slate, fontWeight:700 }}>{ic}</div>)}
          </div>
          <div>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
              <div style={{ background:C.navy, borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>🗄</div>
              <div><div style={{ fontWeight:800, fontSize:14, color:C.navy }}>CRM Snag</div><div style={{ fontSize:11, color:C.slate }}>Office View (Management)</div></div>
            </div>
            {[{s:"Open",c:"#64748b",bg:"#f1f5f9"},{s:"Scheduled",c:"#2563eb",bg:"#eff6ff"},{s:"In Progress",c:"#15803d",bg:"#f0fdf4"},{s:"On Hold",c:"#b45309",bg:"#fffbeb"},{s:"Completed",c:"#15803d",bg:"#dcfce7"},{s:"Cancelled",c:"#dc2626",bg:"#fef2f2"}].map(st => (
              <div key={st.s} style={{ background:st.bg, borderRadius:8, padding:"9px 14px", marginBottom:6, fontSize:13, fontWeight:600, color:st.c }}>{st.s}</div>
            ))}
          </div>
        </div>
        <div style={{ background:C.navy, borderRadius:10, padding:"10px 16px", marginTop:16, display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:18 }}>⚡</span>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.85)" }}><strong style={{ color:C.teal }}>Real-time API Webhooks:</strong> Updates in FSM trigger immediate status reflection in CRM. No manual sync required.</span>
        </div>
      </Card>

      <SectionHeader eyebrow="Process Efficiency" title="Work Order Automation" subtitle="Automated transition from CRM Snag reporting to Field Execution" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr 1fr", gap:16 }}>
        <Card style={{ borderTop:`3px solid ${C.amber}` }}>
          <Pill label="TRIGGER SOURCE" bg={C.amberLight} color={C.amber} />
          <h3 style={{ margin:"12px 0 6px", fontSize:18, fontWeight:900, color:C.navy }}>ZOHO CRM Snag</h3>
          <div style={{ background:C.amberLight, border:`2px dashed ${C.amber}60`, borderRadius:10, padding:"12px 14px", margin:"14px 0" }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.amber, textTransform:"uppercase", letterSpacing:1 }}>Automation Trigger</div>
            <div style={{ fontSize:15, fontWeight:900, color:"#92400e", marginTop:4 }}>⚡ Status = Complete</div>
          </div>
          <p style={{ fontSize:12, color:C.slate, lineHeight:1.65, margin:0 }}>When a snag is validated and marked complete by the back office, the automation fires instantly.</p>
        </Card>
        <Card style={{ borderTop:`3px solid ${C.navy}` }}>
          <div style={{ textAlign:"center", marginBottom:14 }}>
            <div style={{ background:C.navy, color:"#fff", borderRadius:20, padding:"4px 14px", fontSize:11, fontWeight:700, display:"inline-block" }}>🤖 AUTO-MAPPING LOGIC</div>
            <div style={{ fontSize:10, color:C.slate, marginTop:6, textTransform:"uppercase", letterSpacing:1 }}>Data Field Transformation</div>
          </div>
          {[["Account Name","Service Account"],["Contact Person","Contact"],["Site Location","Service Address"],["Asset ID","Asset"],["Priority","Work Order Priority"],["Territory Code","Service Territory"],["Target Date","Due Date"]].map(([f,t]) => (
            <div key={f} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
              <div style={{ flex:1, background:"#f8fafc", border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 10px", fontSize:12, color:"#334155" }}>{f}</div>
              <div style={{ color:C.amber, fontSize:16, fontWeight:700 }}>→</div>
              <div style={{ flex:1, background:C.tealLight, border:`1px solid ${C.teal}30`, borderRadius:6, padding:"5px 10px", fontSize:12, color:"#0f766e" }}>{t}</div>
            </div>
          ))}
        </Card>
        <Card style={{ borderTop:`3px solid ${C.teal}` }}>
          <Pill label="OUTPUT RESULT" bg={C.tealLight} color={C.teal} />
          <h3 style={{ margin:"12px 0 6px", fontSize:18, fontWeight:900, color:C.navy }}>FSM Work Order</h3>
          <div style={{ background:C.tealLight, border:`2px solid ${C.teal}40`, borderRadius:10, padding:"16px", margin:"14px 0", textAlign:"center" }}>
            <div style={{ fontSize:28 }}>📋</div>
            <div style={{ fontWeight:800, fontSize:14, color:C.teal, marginTop:6 }}>New Record Created</div>
          </div>
          {["Description Populated","Attachments Cloned","Audit Trail Logged"].map(item => (
            <div key={item} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:7 }}><span style={{ color:C.teal, fontWeight:700 }}>✓</span><span style={{ fontSize:12, color:"#334155" }}>{item}</span></div>
          ))}
          <div style={{ background:C.amberLight, borderRadius:8, padding:"8px 12px", marginTop:12 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#92400e" }}>🤖 Zero Manual Creation</div>
            <div style={{ fontSize:10, color:C.slate, marginTop:2 }}>Eliminates data entry errors & admin delays</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── TERRITORIES ──────────────────────────────────────
function TerritoriesSection() {
  return (
    <div>
      <SectionHeader eyebrow="Structured Organization" title="Territory Structure Strategy" subtitle="Standardized naming conventions for logical data separation across departments and regions" />
      <Card style={{ marginBottom:24, textAlign:"center" }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:1.5, marginBottom:20 }}>Naming Convention Formula</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, flexWrap:"wrap" }}>
          {[["Department Prefix","PREFIX","border"],["Geographic Code","LOCATION","border"],["Unique Territory Name","PREFIX-LOCATION","filled"]].map(([label,val,style],i) => (
            <div key={val} style={{ display:"flex", alignItems:"center", gap:16 }}>
              {i>0 && <div style={{ fontSize:28, color:C.slate, fontWeight:300 }}>{i===2?"=":"+"}</div>}
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>{label}</div>
                <div style={style==="filled" ? { background:C.navy, borderRadius:10, padding:"14px 28px", fontSize:20, fontWeight:900, color:C.white } : { border:`2px dashed ${C.border}`, borderRadius:10, padding:"14px 24px", fontSize:20, fontWeight:900, color:C.navy }}>{val}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:28 }}>
        <Card>
          <div style={{ fontSize:11, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>👥 Department Prefixes (Level 1)</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
            {[{ab:"EOM",f:"Enterprise Ops & Maintenance",c:C.eom},{ab:"PRJ",f:"Capital Projects",c:C.pt},{ab:"CS",f:"Customer Service",c:C.cst},{ab:"FF",f:"Fire Fighting",c:C.fft}].map(d => (
              <div key={d.ab} style={{ borderLeft:`3px solid ${d.c.bg}`, paddingLeft:12, paddingTop:4, paddingBottom:4 }}>
                <div style={{ fontWeight:900, fontSize:18, color:d.c.bg }}>{d.ab}</div>
                <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{d.f}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>📍 Location Codes (Level 2)</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {[["🏙","AUH","Abu Dhabi"],["🏙","DXB","Dubai"],["🏙","SHJ","Sharjah"],["🏙","FUJ","Fujairah"]].map(([ic,code,city]) => (
                <div key={code} style={{ background:"#f8fafc", border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 14px", display:"flex", gap:6, alignItems:"center" }}>
                  <span style={{ fontSize:14 }}>{ic}</span>
                  <div><div style={{ fontWeight:800, fontSize:13, color:C.navy }}>{code}</div><div style={{ fontSize:10, color:C.slate }}>{city}</div></div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ fontSize:11, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Generated Territory Examples</div>
          {[{code:"EOM-AUH",desc:"Ops Team in Abu Dhabi",tag:"OPERATIONS",c:C.eom},{code:"PRJ-DXB",desc:"Projects Team in Dubai",tag:"PROJECTS",c:C.pt},{code:"CS-AUH",desc:"Support Team in Abu Dhabi",tag:"SERVICE",c:C.cst},{code:"FF-SHJ",desc:"Fire Fighting Team in Sharjah",tag:"FIRE FIGHTING",c:C.fft}].map(t => (
            <div key={t.code} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#f8fafc", border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
              <div><div style={{ fontWeight:900, fontSize:16, color:C.navy }}>{t.code}</div><div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{t.desc}</div></div>
              <Pill label={t.tag} bg={t.c.light} color={t.c.bg} />
            </div>
          ))}
          <div style={{ background:C.slateLight, borderRadius:8, padding:"10px 14px", marginTop:4 }}>
            <div style={{ fontSize:11, color:C.slate }}>💡 Department Heads can be assigned <strong>multiple territories</strong> for regional oversight — Managerial Override</div>
          </div>
        </Card>
      </div>

      <SectionHeader eyebrow="Security & Governance" title="Territory-Based Access Control" subtitle="Hierarchical data security model ensuring operational integrity" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        {[{n:1,ic:"👤",t:"System User",c:C.navy,d:"Technician or Back Office staff logs into the FSM portal or mobile app."},
          {n:2,ic:"🪪",t:"Assigned Role",c:"#2563eb",d:"Profile determines functional capabilities (e.g., 'View Only' vs 'Edit')."},
          {n:3,ic:"🗺",t:"Territory Scope",c:C.teal,d:"User is linked to specific location codes (e.g., EOM-AUH).",badge:"ROADMAP: ETA 4–5 Weeks"},
          {n:4,ic:"🗄",t:"Data Access",c:C.navy,d:"System filters records based on territory match.",items:["✓ Work Orders","✓ Service Assets","🔒 Other Territories (blocked)"]}].map(s => (
          <div key={s.n} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
            {s.badge && <div style={{ background:C.amberLight, padding:"6px 12px", fontSize:10, fontWeight:700, color:C.amber }}>⚑ {s.badge}</div>}
            <div style={{ padding:16 }}>
              <div style={{ background:`${s.c}12`, width:44, height:44, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:12 }}>{s.ic}</div>
              <div style={{ fontWeight:800, fontSize:14, color:s.c, marginBottom:6 }}>{s.n}. {s.t}</div>
              <div style={{ fontSize:12, color:C.slate, lineHeight:1.6 }}>{s.d}</div>
              {s.items && <div style={{ marginTop:10 }}>{s.items.map((it,j) => <div key={j} style={{ fontSize:12, color:it.startsWith("🔒")?"#dc2626":"#15803d", marginBottom:4 }}>{it}</div>)}</div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card style={{ borderLeft:`4px solid #dc2626` }}><div style={{ fontWeight:800, fontSize:14, color:C.navy, marginBottom:6 }}>🛡 Data Isolation</div><p style={{ margin:0, fontSize:13, color:C.slate, lineHeight:1.65 }}>Technicians in Dubai (DXB) cannot view or modify assets in Abu Dhabi (AUH), preventing accidental cross-region errors.</p></Card>
        <Card style={{ borderLeft:`4px solid ${C.teal}` }}><div style={{ fontWeight:800, fontSize:14, color:C.navy, marginBottom:6 }}>🔄 Dynamic Updates</div><p style={{ margin:0, fontSize:13, color:C.slate, lineHeight:1.65 }}>If a technician moves permanently, updating their User Profile Territory immediately grants access to the new region's data.</p></Card>
      </div>
    </div>
  );
}

// ─── TEAMS ────────────────────────────────────────────
function TeamsSection() {
  const [active, setActive] = useState("eom");
  const team = teams.find(t => t.id === active);
  return (
    <div>
      <SectionHeader eyebrow="Field Operations" title="Teams & Territories" subtitle="Five specialized teams operating within the unified FSM ecosystem" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:24 }}>
        {teams.map(t => (
          <div key={t.id} onClick={() => setActive(t.id)} style={{ background:active===t.id?t.color.bg:C.white, border:`2px solid ${t.color.border}`, borderRadius:14, padding:16, cursor:"pointer", transition:"all 0.2s", boxShadow:active===t.id?`0 6px 20px ${t.color.bg}40`:"0 2px 6px rgba(0,0,0,0.04)" }}>
            <Pill label={t.abbr} bg={active===t.id?"rgba(255,255,255,0.2)":t.color.bg} color="#fff" style={{ marginBottom:10 }} />
            <div style={{ fontSize:12, fontWeight:800, color:active===t.id?"#fff":C.navy, lineHeight:1.35, marginBottom:6 }}>{t.name}</div>
            <div style={{ fontSize:11, color:active===t.id?"rgba(255,255,255,0.65)":C.slate }}>📍 {t.territory}</div>
          </div>
        ))}
      </div>
      {team && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
          {[{title:"👤 Agents / Roles",items:team.agents},{title:"📋 Work Order Types",items:team.woTypes},{title:"🔧 Service Catalogue",items:team.services},{title:"🔄 PPM Schedule",items:team.ppm}].map(block => (
            <Card key={block.title} style={{ borderTop:`3px solid ${team.color.bg}` }}>
              <div style={{ fontWeight:700, fontSize:12, color:team.color.bg, marginBottom:12 }}>{block.title}</div>
              {block.items.map(item => (<div key={item} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:8 }}><Dot color={team.color.bg} /><span style={{ fontSize:12, color:"#334155", lineHeight:1.5 }}>{item}</span></div>))}
              <div style={{ marginTop:14, background:team.color.light, border:`1px solid ${team.color.border}30`, borderRadius:8, padding:"8px 10px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:team.color.bg, textTransform:"uppercase" }}>Job Sheet Template</div>
                <div style={{ fontSize:11, color:team.color.text, marginTop:2 }}>{team.jobSheet}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <SectionHeader eyebrow="Service Execution" title="Job Sheet Templates" subtitle="Four core service execution templates requiring final stakeholder sign-off" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:28 }}>
        {[{ic:"📅",t:"PPM Checklist",sub:"Quarterly & Annual Maintenance",tag:"TO FINALIZE",tagC:C.amber,tagBg:C.amberLight,c:C.teal,items:[["Asset Details","MANDATORY"],["50-Point Checklist","PASS/FAIL"],["Condition Photos","MIN 4"],["Tech Signature","REQ"]]},
          {ic:"🔧",t:"Normal Service",sub:"Reactive Repairs & Call-outs",tag:"IN REVIEW",tagC:"#2563eb",tagBg:"#eff6ff",c:C.navy,items:[["Time Logs","BILLABLE"],["Materials Used","INVENTORY"],["Before/After Photos","PROOF"],["Customer Sign-off","MANDATORY"]]},
          {ic:"🔴",t:"Fire Fighting Insp.",sub:"Safety Compliance Audits",tag:"TO FINALIZE",tagC:C.amber,tagBg:C.amberLight,c:C.eom.bg,items:[["Tag Scanning","QR CODE"],["Pressure Checks","VALUES"],["Defect Logging","CRITICAL"],["Certification","AUTO-GEN"]]},
          {ic:"✅",t:"Project Completion",sub:"Handover & Commissioning",tag:"IN REVIEW",tagC:"#2563eb",tagBg:"#eff6ff",c:C.pt.bg,items:[["Phase Summary","OVERVIEW"],["Warranty Docs","ATTACH"],["Site Gallery","FULL SET"],["Final Acceptance","MULTI-SIG"]]}].map(tpl => (
          <Card key={tpl.t} style={{ borderTop:`3px solid ${tpl.c}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ background:tpl.c, borderRadius:10, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{tpl.ic}</div>
                <div><div style={{ fontWeight:800, fontSize:15, color:C.navy }}>{tpl.t}</div><div style={{ fontSize:11, color:C.slate }}>{tpl.sub}</div></div>
              </div>
              <Pill label={tpl.tag} bg={tpl.tagBg} color={tpl.tagC} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {tpl.items.map(([name,type]) => (
                <div key={name} style={{ background:"#f8fafc", border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, color:"#334155", fontWeight:500 }}>{name}</span>
                  <span style={{ fontSize:10, color:C.slate, fontWeight:600 }}>{type}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <SectionHeader eyebrow="Project Hierarchy" title="Large Work Order Management" subtitle="Hierarchical breakdown for complex, multi-phase project execution" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Card>
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ display:"inline-flex", gap:10, alignItems:"center", background:C.navy, borderRadius:10, padding:"10px 18px" }}>
              <span style={{ fontSize:18 }}>🔀</span>
              <div style={{ textAlign:"left" }}><div style={{ color:"#fff", fontWeight:800, fontSize:13 }}>Parent Work Order</div><div style={{ color:"rgba(255,255,255,0.55)", fontSize:11 }}>Main Project Container (ID: PRJ-1001)</div></div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:4 }}><div style={{ width:2, height:20, background:C.border }} /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[{phase:"Phase 1: Rough-In",wo:"WO-001",sa:"Tech Team A (Mon-Wed)",js:"Execution Tasks & Parts",c:C.teal},{phase:"Phase 2: Final Fit-out",wo:"WO-002",sa:"Tech Team B (Thu-Fri)",js:"Sign-off & Handover",c:"#2563eb"}].map(p => (
              <div key={p.wo} style={{ border:`2px solid ${p.c}30`, borderRadius:10, overflow:"hidden" }}>
                <div style={{ background:p.c, padding:"8px 12px" }}><div style={{ color:"#fff", fontWeight:700, fontSize:12 }}>{p.phase}</div><div style={{ color:"rgba(255,255,255,0.7)", fontSize:10 }}>Child Work Order ({p.wo})</div></div>
                <div style={{ padding:10 }}>
                  <div style={{ background:"#eff6ff", borderRadius:7, padding:"7px 10px", marginBottom:7 }}><div style={{ fontWeight:700, fontSize:11, color:"#1e40af" }}>📅 Service Appointment</div><div style={{ color:C.slate, fontSize:11, marginTop:2 }}>{p.sa}</div></div>
                  <div style={{ background:C.amberLight, borderRadius:7, padding:"7px 10px" }}><div style={{ fontWeight:700, fontSize:11, color:"#92400e" }}>📝 Job Sheet</div><div style={{ color:C.slate, fontSize:11, marginTop:2 }}>{p.js}</div></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[{ic:"📈",t:"Phase Tracking",d:"Monitor progress per phase (Rough-in vs Finish) independently"},{ic:"💰",t:"Better Reporting",d:"Roll-up costs and hours from child jobs to parent project"},{ic:"👥",t:"Controlled Scheduling",d:"Prevent Phase 2 booking until Phase 1 status is 'Complete'"},{ic:"🛡",t:"SLA Clarity",d:"Define different SLA targets for urgent vs planned phases"}].map(b => (
            <Card key={b.t}><div style={{ fontSize:26, marginBottom:8 }}>{b.ic}</div><div style={{ fontWeight:800, fontSize:13, color:C.navy, marginBottom:6 }}>{b.t}</div><div style={{ fontSize:12, color:C.slate, lineHeight:1.65 }}>{b.d}</div></Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ASSETS ───────────────────────────────────────────
function AssetsSection() {
  return (
    <div>
      <SectionHeader eyebrow="Asset Management" title="Asset Hierarchy" subtitle="Parent → Child asset structure mapped to territories across all departments" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginBottom:28 }}>
        {assetHierarchy.map((a,i) => {
          const team = teams.find(t => t.id === a.team);
          if (!team) {
            return null;
          }
          return (
            <div key={i} style={{ border:`2px solid ${team.color.border}30`, borderRadius:14, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ background:team.color.bg, padding:"12px 16px", display:"flex", gap:12, alignItems:"center" }}>
                <span style={{ fontSize:22 }}>🏭</span>
                <div><div style={{ color:"#fff", fontWeight:800, fontSize:13 }}>{a.parent}</div><div style={{ color:"rgba(255,255,255,0.65)", fontSize:11 }}>Parent Asset · {team.abbr} — {team.territory}</div></div>
              </div>
              <div style={{ padding:"12px 16px", background:team.color.light }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Child Assets (Equipment)</div>
                <div style={{ borderLeft:`3px solid ${team.color.bg}`, paddingLeft:12, display:"flex", flexDirection:"column", gap:6 }}>
                  {a.children.map((c,j) => (<div key={j} style={{ display:"flex", gap:10, alignItems:"center", background:C.white, borderRadius:7, padding:"6px 10px", border:`1px solid ${C.border}` }}><span style={{ fontSize:14 }}>⚙</span><span style={{ fontSize:12, color:"#334155", fontWeight:500 }}>{c}</span></div>))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <SectionHeader eyebrow="Configuration" title="Asset Custom Fields" subtitle="Additional fields configured for gas operations data capture" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {[{f:"Asset Code",t:"Text",e:"SERGAS-CGS-001-PRV-A"},{f:"Gas Asset Type",t:"Picklist",e:"PRV / Compressor / Valve…"},{f:"Operating Pressure (bar)",t:"Decimal",e:"10.5"},{f:"Pipeline Material",t:"Picklist",e:"PE / Steel / Cast Iron"},{f:"Last Inspection Date",t:"Date",e:"22/02/2026"},{f:"Next Inspection Due",t:"Date",e:"22/05/2026"},{f:"Risk Level",t:"Picklist",e:"Low / Medium / High / Critical"},{f:"Condition Rating",t:"Picklist",e:"Good / Fair / Poor"},{f:"SCADA Tag",t:"Text",e:"CGS-001-PRV-A-TAG"}].map(x => (
          <Card key={x.f}>
            <div style={{ fontWeight:700, fontSize:13, color:C.navy, marginBottom:8 }}>{x.f}</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}><Pill label={x.t} bg="#dbeafe" color="#1e40af" /><span style={{ fontSize:11, color:C.slate, fontStyle:"italic" }}>{x.e}</span></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── SERVICE FLOW ─────────────────────────────────────
function ServiceFlowSection() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const sc = ["#c2410c","#b45309","#d97706","#65a30d","#15803d","#0891b2","#2563eb","#6d28d9","#0f172a"];
  return (
    <div>
      <SectionHeader eyebrow="Operational Logic" title="End-to-End Service Flow" subtitle="From service request to PDF report — complete field execution chain" />
      <Card style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Service Appointment Logic — Execution Chain</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
          {[{ic:"📋",t:"Work Order",sub:"Parent Object",tag:"Defining the Scope",items:["Customer Details","Location Data","Priority Level","Linked to Asset"]},
            {ic:"≡",t:"Line Items",sub:"Services & Parts",tag:"What needs to be done?",items:["Required Services","Required Parts","Est. Duration","Price Calculation"]},
            {ic:"📅",t:"Service Appt.",sub:"Scheduling Unit",tag:"When & Who?",items:["Start / End Time","Actual Duration","Multi-Day Jobs Support"]},
            {ic:"👥",t:"Technicians",sub:"Resources (1-5)",tag:"Field Execution",items:["Tech A (Lead)","Tech B (Assistant)","Pause / Resume Controls"]}].map(c => (
            <div key={c.t} style={{ background:"#f8fafc", borderRadius:12, padding:14, border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:10 }}>
                <div style={{ background:C.navy, borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{c.ic}</div>
                <div><div style={{ fontWeight:800, fontSize:13, color:C.navy }}>{c.t}</div><div style={{ fontSize:10, color:C.slate }}>{c.sub}</div></div>
              </div>
              <div style={{ fontSize:11, fontWeight:600, color:C.teal, marginBottom:8 }}>{c.tag}</div>
              {c.items.map(item => <div key={item} style={{ fontSize:11, color:"#334155", marginBottom:4 }}>· {item}</div>)}
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {[{ic:"🗺",t:"Territory Matching",d:"Only techs in 'DXB' can view Dubai jobs."},{ic:"🎓",t:"Skill Requirements",d:"Matches 'Electrician' skill to job type."},{ic:"⏱",t:"Time Tracking",d:"Logs Travel, Work, Break times accurately."}].map(d => (
            <div key={d.t} style={{ background:C.slateLight, borderRadius:10, padding:"10px 14px", display:"flex", gap:12, alignItems:"flex-start" }}>
              <span style={{ fontSize:22 }}>{d.ic}</span>
              <div><div style={{ fontWeight:700, fontSize:12, color:C.navy }}>{d.t}</div><div style={{ fontSize:11, color:C.slate, marginTop:3 }}>{d.d}</div></div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20 }}>
        <div>
          {flowSteps.map((s,i) => {
            const isExp = expanded === s.id;
            return (
              <div key={s.id} style={{ marginBottom:10 }}>
                <div onClick={() => setExpanded(isExp?null:s.id)} style={{ display:"flex", alignItems:"center", gap:12, background:C.white, border:`2px solid ${isExp?sc[i]:C.border}`, borderRadius:isExp?"12px 12px 0 0":12, padding:"12px 16px", cursor:"pointer", boxShadow:isExp?`0 0 0 3px ${sc[i]}18`:"0 2px 6px rgba(0,0,0,0.04)", transition:"all 0.15s" }}>
                  <div style={{ background:sc[i], color:"#fff", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, flexShrink:0 }}>{s.id}</div>
                  <div style={{ fontSize:20, flexShrink:0 }}>{s.icon}</div>
                  <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:14, color:C.navy }}>{s.label}</div><div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{s.desc}</div></div>
                  <div style={{ color:C.slate, fontSize:12 }}>{isExp?"▲":"▼"}</div>
                </div>
                {isExp && (
                  <div style={{ background:"#f8fafc", border:`2px solid ${sc[i]}`, borderTop:"none", borderRadius:"0 0 12px 12px", padding:16 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", marginBottom:6 }}>👤 Performed By</div>
                        <div style={{ background:C.white, borderRadius:8, padding:"8px 12px", border:`1px solid ${sc[i]}40`, fontSize:13, fontWeight:600, color:C.navy, marginBottom:10 }}>{s.who}</div>
                        <div style={{ fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", marginBottom:6 }}>✅ Result</div>
                        <div style={{ background:`${sc[i]}10`, borderRadius:8, padding:"8px 12px", border:`1px solid ${sc[i]}30`, fontSize:12, color:C.navy }}>{s.result}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", marginBottom:6 }}>📌 Actions</div>
                        {s.actions.map((a,j) => (<div key={j} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 }}><div style={{ width:18, height:18, borderRadius:"50%", background:sc[i], color:"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>{j+1}</div><span style={{ fontSize:12, color:"#334155", lineHeight:1.5 }}>{a}</span></div>))}
                      </div>
                    </div>
                  </div>
                )}
                {i<flowSteps.length-1 && <div style={{ display:"flex", justifyContent:"center" }}><div style={{ width:2, height:8, background:C.border }} /></div>}
              </div>
            );
          })}
        </div>
        <div>
          <div style={{ background:C.white, borderRadius:16, border:`2px solid ${C.navy}`, boxShadow:"0 4px 16px rgba(0,0,0,0.1)", overflow:"hidden", position:"sticky", top:76 }}>
            <div style={{ background:C.navy, padding:"12px 16px" }}><div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>📄 Service Report PDF</div><div style={{ color:"rgba(255,255,255,0.5)", fontSize:10, marginTop:2 }}>Auto-generated on WO completion</div></div>
            <div style={{ padding:14 }}>
              <div style={{ background:"#f8fafc", borderRadius:8, padding:10, marginBottom:10, border:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}><div style={{ fontSize:14, fontWeight:900, color:C.navy }}>SERGAS</div><div style={{ fontSize:9, color:C.slate, fontWeight:700 }}>SERVICE REPORT</div></div>
                <div style={{ fontSize:10, color:"#334155", marginTop:4 }}>WO# WO-2026-0892 · 22/02/2026</div>
              </div>
              {[{s:"Asset Details",items:["Asset: PRV Unit A","Parent: CGS-001","Territory: EOM Zone"]},{s:"Work Performed",items:["Service: PRV Inspection","Fault: Worn diaphragm","Duration: 1h 47m"]},{s:"Gas Readings",items:["Inlet: 7.2 bar","Outlet: 4.5 bar","Post-Test: PASSED"]},{s:"Parts Used",items:["PRV Diaphragm Kit × 1","PRV Spring Set × 1"]},{s:"Sign Off",items:["Tech: Ahmed Hassan ✍","Site Rep: Saeed Al-M. ✍","Status: COMPLETED ✅"]}].map((block,i) => (
                <div key={i} style={{ background:i%2===0?"#f8fafc":C.white, borderRadius:8, padding:10, marginBottom:8, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:9, fontWeight:700, color:C.slate, textTransform:"uppercase", marginBottom:5 }}>{block.s}</div>
                  {block.items.map((item,j) => (<div key={j} style={{ fontSize:11, color:"#334155", marginBottom:2, paddingLeft:8, borderLeft:`2px solid ${C.border}` }}>{item}</div>))}
                </div>
              ))}
              <div style={{ background:"#dcfce7", borderRadius:8, padding:8, border:"1px solid #86efac", textAlign:"center" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#14532d" }}>✅ Report Complete</div>
                <div style={{ fontSize:9, color:"#166534", marginTop:2 }}>PDF archived · Asset updated · PPM rescheduled</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROADMAP ──────────────────────────────────────────
function RoadmapSection() {
  const [scope, setScope] = useState<"process" | "it">("process");
  const [expandedWeek, setExpandedWeek] = useState<string | null>("Week 1");
  const [expandedOos, setExpandedOos] = useState<number | null>(null);
  const data = scope === "process" ? processOwnerRoadmap : itRoadmap;

  return (
    <div>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 100%)`, borderRadius:18, padding:"36px 40px", marginBottom:28 }}>
        <Pill label="STRATEGIC EXECUTION — 4 WEEK PLAN" bg="rgba(14,158,142,0.18)" color={C.teal} style={{ marginBottom:12 }} />
        <h2 style={{ margin:"0 0 8px", fontSize:28, fontWeight:900, color:C.white, fontFamily:"Georgia,serif" }}>Implementation Roadmap</h2>
        <p style={{ margin:"0 0 24px", fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>Compressed 4-week delivery plan — dual-track execution. Select a scope to view its detailed activity schedule.</p>
        <div style={{ display:"flex", gap:12 }}>
          {[{id:"process",label:"👔 Process Owner Scope",sub:"Business decisions, UAT, approvals & training"},
            {id:"it",label:"💻 IT Scope",sub:"Configuration, integration & testing"}].map(s => (
            <div key={s.id} onClick={() => { setScope(s.id as "process" | "it"); setExpandedWeek("Week 1"); }} style={{ flex:1, borderRadius:12, padding:"14px 18px", cursor:"pointer", transition:"all 0.2s", background:scope===s.id?C.white:"rgba(255,255,255,0.06)", border:scope===s.id?`2px solid ${C.teal}`:"2px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontWeight:800, fontSize:14, color:scope===s.id?C.navy:C.white, marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:12, color:scope===s.id?C.slate:"rgba(255,255,255,0.5)" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Week selector */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {data.map(w => (
          <div key={w.week} onClick={() => setExpandedWeek(expandedWeek===w.week?null:w.week)} style={{ borderRadius:12, padding:"14px 16px", cursor:"pointer", transition:"all 0.2s", background:expandedWeek===w.week?w.color:w.light, border:`2px solid ${expandedWeek===w.week?w.color:w.color+"40"}`, boxShadow:expandedWeek===w.week?`0 6px 20px ${w.color}40`:"none" }}>
            <div style={{ fontWeight:900, fontSize:18, color:expandedWeek===w.week?"#fff":w.color, marginBottom:3 }}>{w.week}</div>
            <div style={{ fontSize:12, color:expandedWeek===w.week?"rgba(255,255,255,0.75)":C.slate, marginBottom:8 }}>{w.days}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ background:expandedWeek===w.week?"rgba(255,255,255,0.2)":`${w.color}20`, borderRadius:6, padding:"2px 8px" }}><span style={{ fontSize:12, fontWeight:700, color:expandedWeek===w.week?"#fff":w.color }}>{w.tasks.length} tasks</span></div>
              <span style={{ fontSize:14, color:expandedWeek===w.week?"#fff":C.slate }}>{expandedWeek===w.week?"▲":"▼"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Week detail table */}
      {data.map(w => expandedWeek===w.week && (
        <Card key={w.week} style={{ marginBottom:24, border:`2px solid ${w.color}30` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, paddingBottom:14, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ background:w.color, borderRadius:10, padding:"8px 18px" }}>
                <div style={{ fontWeight:900, fontSize:15, color:"#fff" }}>{w.week}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>{w.days}</div>
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:C.navy }}>{scope==="process"?"👔 Process Owner Activities":"💻 IT Team Activities"}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{w.tasks.length} activities planned</div>
              </div>
            </div>
            <Pill label={scope==="process"?"PROCESS OWNER":"IT SCOPE"} bg={w.light} color={w.color} />
          </div>
          {/* Table header */}
          <div style={{ display:"grid", gridTemplateColumns:"2.2fr 1.2fr 0.65fr 1.5fr", background:"#f8fafc", borderRadius:"8px 8px 0 0", border:`1px solid ${C.border}` }}>
            {["Activity","Responsible","Deadline","Notes / Dependencies"].map((h,hi) => (
              <div key={h} style={{ padding:"9px 12px", fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:0.8, borderRight:hi<3?`1px solid ${C.border}`:"none" }}>{h}</div>
            ))}
          </div>
          {/* Table rows */}
          {w.tasks.map((task,i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"2.2fr 1.2fr 0.65fr 1.5fr", background:i%2===0?C.white:"#fafbfc", borderLeft:`1px solid ${C.border}`, borderRight:`1px solid ${C.border}`, borderBottom:i<w.tasks.length-1?`1px solid ${C.border}`:undefined, borderRadius:i===w.tasks.length-1?"0 0 8px 8px":undefined }}>
              <div style={{ padding:"11px 12px", borderRight:`1px solid ${C.border}` }}>
                <div style={{ fontWeight:700, fontSize:13, color:C.navy, lineHeight:1.35 }}>{task.activity}</div>
              </div>
              <div style={{ padding:"11px 12px", borderRight:`1px solid ${C.border}` }}>
                <div style={{ fontSize:11, color:"#334155", lineHeight:1.55 }}>{task.responsible}</div>
              </div>
              <div style={{ padding:"11px 12px", borderRight:`1px solid ${C.border}`, display:"flex", alignItems:"flex-start", paddingTop:13 }}>
                <Pill label={task.deadline} bg={w.light} color={w.color} style={{ fontSize:10 }} />
              </div>
              <div style={{ padding:"11px 12px" }}>
                <div style={{ fontSize:11, color:C.slate, lineHeight:1.6 }}>{task.note}</div>
              </div>
            </div>
          ))}
          <div style={{ height:1, background:C.border, borderRadius:"0 0 8px 8px" }} />
        </Card>
      ))}

      {/* ── OUT OF IMPLEMENTATION SCOPE ── */}
      <div style={{ background:"#fff8f0", border:`2px solid ${C.amber}`, borderRadius:16, padding:"24px 28px", marginBottom:28 }}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:20 }}>
          <div style={{ background:C.amber, borderRadius:10, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>⚠️</div>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:C.amber, textTransform:"uppercase", letterSpacing:2, marginBottom:4 }}>Scope Boundary</div>
            <h3 style={{ margin:"0 0 4px", fontSize:20, fontWeight:900, color:C.navy, fontFamily:"Georgia,serif" }}>Out of Implementation Scope — Process Owner Responsibilities</h3>
            <p style={{ margin:0, fontSize:13, color:C.slate, lineHeight:1.65 }}>The following items are <strong>not included</strong> in the technical implementation scope. They must be owned, designed, and approved by the Process Owner before IT can configure them in the system.</p>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
          {outOfScopeItems.map((item, i) => (
            <div key={i} style={{ background:C.white, border:`1.5px solid ${C.amber}40`, borderRadius:12, overflow:"hidden" }}>
              <div onClick={() => setExpandedOos(expandedOos===i?null:i)} style={{ padding:"14px 18px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", background:expandedOos===i?"#fff3e0":C.white, transition:"background 0.15s" }}>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ background:C.amberLight, borderRadius:8, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:14, color:C.navy }}>{item.category}</div>
                    <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>Owner: {item.owner}</div>
                  </div>
                </div>
                <span style={{ color:C.slate, fontSize:12 }}>{expandedOos===i?"▲":"▼"}</span>
              </div>
              {expandedOos===i && (
                <div style={{ padding:"14px 18px", borderTop:`1px solid ${C.amber}20` }}>
                  <p style={{ margin:"0 0 12px", fontSize:12, color:"#334155", lineHeight:1.65 }}>{item.description}</p>
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.amber, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Deliverables Process Owner Must Provide</div>
                    {item.templates.map((t,j) => (
                      <div key={j} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 }}>
                        <div style={{ width:5, height:5, borderRadius:"50%", background:C.amber, marginTop:6, flexShrink:0 }} />
                        <span style={{ fontSize:12, color:"#334155", lineHeight:1.5 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:C.amberLight, border:`1px solid ${C.amber}40`, borderRadius:8, padding:"9px 12px", display:"flex", gap:8, alignItems:"flex-start" }}>
                    <span style={{ fontSize:14, flexShrink:0 }}>📌</span>
                    <span style={{ fontSize:11, color:"#7c3d12", lineHeight:1.6 }}><strong>Dependency Note:</strong> {item.note}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

     

      {/* Capabilities */}
      <SectionHeader eyebrow="Platform Readiness" title="System Capabilities" subtitle="Available now vs upcoming enhancements on the Zoho FSM roadmap" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Card style={{ borderTop:`3px solid ${C.teal}` }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:16 }}>
            <div style={{ background:"#dcfce7", border:"1px solid #86efac", borderRadius:"50%", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#15803d" }}>✓</div>
            <div><div style={{ fontWeight:900, fontSize:16, color:C.navy }}>Available Now</div><div style={{ fontSize:11, color:C.slate }}>Live features ready for immediate deployment</div></div>
          </div>
          <div style={{ borderBottom:`1px solid ${C.teal}`, marginBottom:14 }} />
          {[["CRM-FSM Sync","Bi-directional data synchronization for Accounts, Contacts, and Assets"],["Automated Work Orders","Trigger-based creation from CRM Snag status updates"],["Parent / Child Logic","Hierarchical Work Order management for complex projects"],["Multi-Technician","Scheduling multiple resources (Crew) to a single appointment"],["Status Mapping","Real-time status reflection between Field App and Back Office"],["Mobile App Access","Full job execution via FSM mobile app with offline support"]].map(([t,d]) => (
            <div key={t} style={{ display:"flex", gap:12, alignItems:"flex-start", background:"#f8fafc", border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 14px", marginBottom:8 }}>
              <span style={{ color:C.teal, fontWeight:700, flexShrink:0 }}>✓</span>
              <div><div style={{ fontWeight:700, fontSize:13, color:C.navy }}>{t}</div><div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{d}</div></div>
            </div>
          ))}
        </Card>
        <div style={{ background:C.navy, borderRadius:14, padding:20 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:16 }}><span style={{ fontSize:24 }}>🚧</span><div><div style={{ fontWeight:900, fontSize:16, color:C.white }}>Under Development</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>Scheduled enhancements & known limitations</div></div></div>
          <div style={{ borderBottom:"1px solid rgba(255,255,255,0.1)", marginBottom:14 }} />
          {[{t:"Territory Strict Permission",d:"Enforced data isolation based on user territory assignment.",eta:"ETA: 4–5 WEEKS",ec:C.amber},{t:"Dependent Picklists",d:"Conditional field logic for smarter data entry forms.",eta:"ETA: ~6 MONTHS",ec:"#8b5cf6"},{t:"Geo-Fencing",d:"Location-based restrictions for clock-in/clock-out actions.",eta:"IN DEVELOPMENT",ec:C.teal},{t:"Custom Modules",d:"FSM does not currently support custom module creation.",eta:"NOT AVAILABLE",ec:"#dc2626"}].map(item => (
            <div key={item.t} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
                <div style={{ fontWeight:700, fontSize:13, color:C.white, flex:1, marginRight:10 }}>{item.t}</div>
                <Pill label={item.eta} bg={`${item.ec}22`} color={item.ec} />
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.55 }}>{item.d}</div>
            </div>
          ))}
          <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"10px 12px", fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.65 }}>
            <strong style={{ color:"rgba(255,255,255,0.6)" }}>Note:</strong> Timelines based on current Zoho product roadmap and subject to change.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────
const navTabs = [
  {id:"strategy",label:"Strategy"},{id:"architecture",label:"Architecture"},
  {id:"territories",label:"Territories & Access"},{id:"teams",label:"Teams"},
  {id:"assets",label:"Assets"},{id:"flow",label:"Service Flow"},
  {id:"roadmap",label:"Implementation Roadmap"},
] as const;

type TabId = (typeof navTabs)[number]["id"];

export default function App() {
  const [tab, setTab] = useState<TabId>("strategy");
  const map: Record<TabId, ReactNode> = { strategy:<StrategySection/>, architecture:<ArchitectureSection/>, territories:<TerritoriesSection/>, teams:<TeamsSection/>, assets:<AssetsSection/>, flow:<ServiceFlowSection/>, roadmap:<RoadmapSection/> };
  return (
    <div style={{ fontFamily:"'Trebuchet MS','Gill Sans',sans-serif", background:"#eef2f7", minHeight:"100vh" }}>
      <div style={{ background:C.navy, position:"sticky", top:0, zIndex:100, boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 20px 14px 0", borderRight:`1px solid rgba(255,255,255,0.1)`, marginRight:16, flexShrink:0 }}>
            <div style={{ background:C.teal, borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🔧</div>
            <div><div style={{ color:C.white, fontWeight:900, fontSize:14, lineHeight:1 }}>ZOHO FSM</div><div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, marginTop:2 }}>SERGAS Implementation</div></div>
          </div>
          <div style={{ display:"flex", gap:0, overflowX:"auto" }}>
            {navTabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:"16px 13px", border:"none", cursor:"pointer", fontSize:12, fontWeight:700, background:"transparent", color:tab===t.id?C.white:"rgba(255,255,255,0.45)", borderBottom:tab===t.id?`3px solid ${C.teal}`:"3px solid transparent", transition:"all 0.2s", whiteSpace:"nowrap", flexShrink:0 }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 24px 64px" }}>{map[tab]}</div>
      <div style={{ background:C.navy, padding:"16px 24px", textAlign:"center" }}>
        <div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, fontWeight:600, letterSpacing:1 }}>ZOHO FSM · SERGAS Centralized Implementation Strategy · One Platform. Multiple Departments. Full Control.</div>
      </div>
    </div>
  );
}
