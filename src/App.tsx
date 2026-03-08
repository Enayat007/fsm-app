import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

const C = {
  navy:"#0d1b2e", navyMid:"#1a2f4a", teal:"#0e9e8e", tealLight:"#d0f5f1",
  amber:"#e8922a", amberLight:"#fdf3e7", slate:"#64748b", slateLight:"#f1f5f9",
  border:"#e2e8f0", white:"#ffffff",
  eom:{ bg:"#c2410c", light:"#fff7ed", border:"#c2410c", text:"#7c2d12" },
  fft:{ bg:"#b45309", light:"#fffbeb", border:"#b45309", text:"#78350f" },
  got:{ bg:"#15803d", light:"#f0fdf4", border:"#15803d", text:"#14532d" },
  cst:{ bg:"#1d4ed8", light:"#eff6ff", border:"#1d4ed8", text:"#1e3a8a" },
  pt: { bg:"#6d28d9", light:"#f5f3ff", border:"#6d28d9", text:"#3b0764" },
  ig: { bg:"#0f766e", light:"#ecfeff", border:"#0f766e", text:"#134e4a" },
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
  { id:"got", name:"Gas Operations Team", abbr:"GOT", territory:"Distribution Zone", color:C.got,
    agents:["Distribution Technician","Pipeline Patrol Officer","Meter Technician","GOT Supervisor"],
    woTypes:["Pipeline Patrol Inspection","Valve Inspection & Test","Meter Reading","Leak Survey"],
    services:["GOT - Pipeline Route Patrol","GOT - Valve Inspection","GOT - Industrial Meter Reading","GOT - Leak Survey"],
    ppm:["Quarterly — Pipeline Patrol","Semi-Annual — Valve Exercise","Annual — Network Audit"],
    jobSheet:"GOT Pipeline Inspection Checklist" },
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
  { id:"ig", name:"Industrial Gas", abbr:"IG", territory:"Industrial Gas Zone", color:C.ig,
    agents:["Industrial Gas Technician","Pressure Systems Engineer","Gas Plant Operator","IG Supervisor"],
    woTypes:["Industrial Gas Inspection","Bulk Gas Supply Maintenance","Industrial Meter Calibration","Industrial Gas Emergency Response"],
    services:["IG - Industrial Gas Safety Inspection","IG - Bulk Gas Supply Service","IG - Industrial Meter Calibration","IG - Pipeline Pressure Validation"],
    ppm:["Monthly — Industrial Meter Calibration","Quarterly — Bulk Gas Supply Inspection","Annual — Industrial Gas Safety Audit"],
    jobSheet:"IG Industrial Gas Checklist" },
];

const flowSteps = [
  { id:1, icon:"📥", label:"Work Order Request / PPM Trigger", desc:"Manual request, customer call, or PPM auto-generates WO", who:"Dispatcher / System",
    actions:["Customer calls → CST raises Work Order Request","PPM schedule auto-generates WO (14 days in advance)","EOM/FFT raise Emergency WO manually","GOT patrol triggers WO from inspection finding"],
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
  { parent:"Americana (B123)", children:["PRV Unit A","PRV Unit B","Gas Compressor #1","ECV #1","Gas Detector Panel"], team:"eom" },
  { parent:"Abu Dhabi Mall (B101)", children:["Filter Separator","Pressure Regulator Primary","Safety Relief Valve"], team:"eom" },
  { parent:"Pipeline Network — North Zone", children:["Section NZ-001","Section NZ-002","Block Valve BV-001","CP Test Point CP-001"], team:"got" },
  { parent:"Customer Connection / Disconnection", children:["Gas Meter Connection","Gas Meter Dis-Connection","Gas Meter Inspection"], team:"cst" },
];

// ─── ROADMAP DATA ─────────────────────────────────────
const processOwnerRoadmap = [
  { week:"Week 1", days:"Days 1–7", color:"#2563eb", light:"#eff6ff", tasks:[
    { activity:"Kick-off Workshop with All Dept. Heads", responsible:"Process Owner + Dept. Heads (EOM, CS, FF, PRJ)", deadline:"Day 1", note:"Set expectations, confirm scope & department leads" },
    { activity:"Define & Agree Territory Structure", responsible:"Dept. Heads + IT", deadline:"Day 2", note:"Confirm PREFIX-LOCATION naming; approve territory list" },
    { activity:"Review & Validate Service Catalogue per Dept.", responsible:"Each Department Head", deadline:"Day 3", note:"Confirm services, WO types, priority levels per team" },
    { activity:"Collect & Cleanse Asset Master Data from CRM", responsible:"Process Owner + IT", deadline:"Day 3–4", note:"Export assets; validate fields, remove duplicates" },
    { activity:"Approve Job Sheet Templates", responsible:"Dept. Heads", deadline:"Day 5", note:"PPM Checklist, Normal Service, FF Inspection, Project Completion" },
    { activity:"Define PPM Schedules per Asset Type", responsible:"Dept. Heads", deadline:"Day 5", note:"Confirm frequency: monthly, quarterly, semi-annual, annual" },
  ]},
  { week:"Week 2", days:"Days 8–14", color:"#0e9e8e", light:"#d0f5f1", tasks:[
    { activity:"User Role Matrix Sign-off", responsible:"Dept. Heads + IT", deadline:"Day 8", note:"Define roles: Technician, Dispatcher, Supervisor, Back Office" },
    { activity:"Territory-to-User Mapping Approval", responsible:"Dept. Heads", deadline:"Day 8", note:"Assign each agent to their correct territory code" },
    { activity:"Work Order Automation Logic Review", responsible:"Process Owner + IT", deadline:"Day 8–9", note:"Confirm CRM Snag → FSM WO trigger rules and field mappings" },
    { activity:"Status Lifecycle Approval", responsible:"Process Owner", deadline:"Day 8", note:"Sign off CRM ↔ FSM status mapping table" },
    { activity:"UAT Scenario Design", responsible:"Process Owner + Dept. Heads", deadline:"Day 9–10", note:"Define 10–15 real-world test cases per department" },
    { activity:"Data Migration Sign-off (Assets + Accounts)", responsible:"Process Owner", deadline:"Day 10", note:"Approve final cleaned dataset before IT push to FSM" },
  ]},
  { week:"Week 3", days:"Days 15–21", color:"#e8922a", light:"#fdf3e7", tasks:[
    { activity:"Pilot UAT For All Territories", responsible:"All Departments", deadline:"Day 15–17", note:"Run test work orders end-to-end on staging environment" },
    { activity:"Technician Mobile App Training", responsible:"Each department coordinator is required to conduct training", deadline:"Day 15–16", note:"job sheet, parts, signature flow" },
    { activity:"UAT Defect Log & Remediation", responsible:"Process Owner + IT", deadline:"Day 16–17", note:"Capture feedback; classify critical vs minor; prioritize fixes" },
    { activity:"Management Demo & Go-Live Approval", responsible:"Senior Management + Process Owner", deadline:"Day 17", note:"Present UAT results; obtain formal go-live authorization" },
    { activity:"Go-Live", responsible:"CST Team + Dispatcher", deadline:"Day 18", note:"First live territory; monitor all WO activity closely; daily check-in calls with Process Owner; Full rollout across all territories" },
    
    // { activity:"KPI Dashboard Review", responsible:"Process Owner + Management", deadline:"Day 21", note:"First live reporting: WO completion rate, SLA adherence" },
    { activity:"Sign-off", responsible:"Process Owner", deadline:"Day 21", note:"Close project; document lessons learned; confirm steady state" },
  ]},
];

const itRoadmap = [
  { week:"Week 1", days:"Days 1–7", color:"#2563eb", light:"#eff6ff", tasks:[
    { activity:"FSM Organization & Module Configuration", responsible:"IT", deadline:"Day 1–2", note:"Set up org, time zones, currencies, modules" },
    { activity:"Territory Creation & Hierarchy Setup", responsible:"IT", deadline:"Day 2–3", note:"Create all PREFIX-LOCATION territories; set parent/child hierarchy" },
    { activity:"Role & Profile Configuration in FSM", responsible:"IT", deadline:"Day 3", note:"Create roles: Technician, Dispatcher, Supervisor, Back Office, Manager" },
    { activity:"CRM Integration Setup (API Auth)", responsible:"IT", deadline:"Day 3–4", note:"Configure Zoho CRM ↔ FSM API connection; test auth tokens" },
    { activity:"Asset Data Import from CRM (cleaned data)", responsible:"IT", deadline:"Day 4–5", note:"Import cleaned asset data from CRM into Zoho FSM — depends on Process Owner data sign-off by Day 4" },
  ]},
  { week:"Week 2", days:"Days 8–14", color:"#0e9e8e", light:"#d0f5f1", tasks:[
    { activity:"CRM → FSM Asset Sync (One-Way API)", responsible:"IT", deadline:"Day 8–9", note:"Build and test Accounts + Assets sync via Zoho Flow / custom API" },
    { activity:"Automation: Snag → FSM Work Order", responsible:"IT", deadline:"Day 8–9", note:"Webhook trigger on Snag Commercial Enquiry Status = Complete; field mapping implementation" },
    { activity:"Status Webhook (FSM → CRM real-time)", responsible:"IT", deadline:"Day 8–9", note:"FSM WO status change pushes update back to CRM Snag record" },
    { activity:"User Account Creation & Territory Assignment", responsible:"IT + Dept. Heads", deadline:"Day 9–10", note:"Create all user accounts; assign territory codes and roles" },
  ]},
  { week:"Week 3", days:"Days 15–21", color:"#e8922a", light:"#fdf3e7", tasks:[
    { activity:"Integration End-to-End Testing", responsible:"IT", deadline:"Day 15–17", note:"Full CRM → FSM → CRM round-trip validation with test data" },
    { activity:"Territory Permission Testing", responsible:"IT + Dept. Heads", deadline:"Day 15–17", note:"Validate that technicians cannot access cross-territory data" },
    { activity:"UAT Bug Fixes & Patches", responsible:"IT", deadline:"Day 15–17", note:"Prioritize critical blockers first; document all changes" },
    { activity:"Production Environment Go-Live Preparation", responsible:"IT + Dept. Heads", deadline:"Day 17–18", note:"Final production config check; backups; rollback plan ready" },
    { activity:"Production Data Migration (Final Push)", responsible:"IT", deadline:"Day 18", note:"Push final cleansed asset & account data to live environment" },
    { activity:"Monitoring & Alerting Setup", responsible:"IT", deadline:"Day 18–19", note:"Set up sync failure alerts, API error logging, webhook monitors" },
    { activity:"Territory Strict Permission Enforcement", responsible:"IT", deadline:"Day 19–21", note:"ETA 4–5 weeks from Go-Live per Zoho roadmap — test when available" },
    // { activity:"Performance & Load Testing", responsible:"IT / QA", deadline:"Day 19–21", note:"Simulate concurrent users; validate system response times" },
    { activity:"Technical Support", responsible:"IT", deadline:"Day 18–21", note:"On-call support for all live territories. Following go-live, transition to IT support portal." },
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
    owner: "Process Owner / EOM & GOT Department Heads",
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

const LIMITATIONS_DATA = [
  {
    section: "Work Order Management",
    items: [
      { name: "Requests", limit: null, included: true },
      { name: "Estimates", limit: null, included: true },
      { name: "Standard Estimates", limit: null, included: true },
      { name: "Optional Line Items", limit: null, included: true },
      { name: "Work Orders", limit: null, included: true },
      { name: "Service Line Items", limit: "30/work order", included: false },
      { name: "Part Line Items", limit: "30/work order", included: false },
      { name: "Service Task Line Items", limit: "100/service line item", included: false },
      { name: "Service Appointments", limit: null, included: true },
      { name: "Time Slot", limit: null, included: true },
      { name: "Queue Based (All Day)", limit: null, included: true },
      { name: "Multi Day", limit: null, included: true },
      { name: "Service Task", limit: "100/service", included: false },
      { name: "Service Report", limit: "10/appoinment", included: false },
      { name: "Record Templates", limit: "40/module", included: false },
      { name: "Gantt View", limit: null, included: true },
      { name: "Grid View", limit: null, included: true },
      { name: "Map View", limit: null, included: true },
      { name: "Calendar View", limit: "Day, Week, Month view", included: false },
      { name: "Trips", limit: "500/appointment", included: false },
      { name: "Time Sheet", limit: "15/user/day", included: false },
      { name: "Multi currency", limit: "20/organization", included: false },
      { name: "Notes and Attachments", limit: null, included: true },
      { name: "Unified Notes View", limit: null, included: true },
      { name: "Multi-day appointments", limit: null, included: true },
    ],
  },
  {
    section: "Maintenance Plans",
    items: [
      { name: "Scheduled Maintenance", limit: "200 active | Total 500", included: false },
    ],
  },
  {
    section: "Contact Management",
    items: [
      { name: "Customers", limit: null, included: true },
      { name: "Companies", limit: null, included: true },
      { name: "Customer History", limit: null, included: true },
      { name: "Notes", limit: null, included: true },
      { name: "Notifications", limit: null, included: true },
      { name: "Custom Notifications", limit: null, included: true },
      { name: "Timeline", limit: null, included: true },
      { name: "Advanced Filters", limit: null, included: true },
      { name: "Contact Merge", limit: null, included: true },
    ],
  },
  {
    section: "Workforce Management",
    items: [
      { name: "Users", limit: "200", included: false },
      { name: "Equipments", limit: null, included: true },
      { name: "Crew", limit: "50/organization", included: false },
      { name: "Skills", limit: "50/organization", included: false },
      { name: "Service Territories", limit: "50/organization", included: false },
      { name: "Attendance", limit: null, included: true },
      { name: "Availability", limit: null, included: true },
      { name: "Business Hours", limit: null, included: true },
      { name: "Holiday", limit: null, included: true },
      { name: "Time Off", limit: null, included: true },
      { name: "Field Agent Live Location Tracking", limit: null, included: true },
    ],
  },
  {
    section: "Service Management",
    items: [
      { name: "Services And Parts", limit: null, included: true },
    ],
  },
  {
    section: "Asset Management",
    items: [
      { name: "Manage Assets", limit: null, included: true },
    ],
  },
  {
    section: "Billing (Powered by Zoho Invoice)",
    items: [
      { name: "2-way sync between FSM and Zoho Invoice/Books", limit: null, included: true },
      { name: "Invoices", limit: null, included: true },
      { name: "Payments", limit: null, included: true },
      { name: "Payment Gateway Integration", limit: null, included: true },
      { name: "Taxes (Specific to local currencies and tax laws)", limit: null, included: true },
    ],
  },
  {
    section: "Product Customization",
    items: [
      { name: "Module Custom Fields", limit: "Max 10/module", included: false },
      { name: "Text & Choice fields", limit: "30/module", included: false },
      { name: "Decimal & Currency fields", limit: "14/module", included: false },
      { name: "Date Time & Long Integer fields", limit: "20/module", included: false },
      { name: "Checkbox", limit: "10/module", included: false },
      { name: "Number", limit: "10/module", included: false },
      { name: "Date", limit: "10/module", included: false },
      { name: "Job Sheets", limit: "10 Active | Total 20", included: false },
      { name: "Job Sheets Custom Fields", limit: "Max 200/job sheet", included: false },
      { name: "Text & Choice fields (Job Sheets)", limit: "72/job sheet", included: false },
      { name: "Decimal & Currency fields (Job Sheets)", limit: "28/job sheet", included: false },
      { name: "Date Time & Long Integer fields (Job Sheets)", limit: "20/job sheet", included: false },
      { name: "Checkbox (Job Sheets)", limit: "20/job sheet", included: false },
      { name: "Number & Rating fields (Job Sheets)", limit: "20/job sheet", included: false },
      { name: "Date (Job Sheets)", limit: "20/job sheet", included: false },
      { name: "Image Upload", limit: "20/job sheet", included: false },
      { name: "FSM List View", limit: null, included: true },
      { name: "Custom Views", limit: "110/module", included: false },
      { name: "PDF Templates", limit: "100/module", included: false },
    ],
  },
  {
    section: "Automation",
    items: [
      { name: "Workflow Rules", limit: "5 active/module | Total 40/module", included: false },
      { name: "Time-based Workflow Rules", limit: "5 active/module | Total 40/module", included: false },
      { name: "Custom Functions", limit: "5/module", included: false },
      { name: "Standalone Functions", limit: "3/organization", included: false },
      { name: "Field Updates", limit: "5/module", included: false },
      { name: "Email Template", limit: "11/module", included: false },
      { name: "Email Notification", limit: "5/module", included: false },
      { name: "Webhooks", limit: "11/module", included: false },
    ],
  },
  {
    section: "Reports",
    items: [
      { name: "Standard Reports", limit: null, included: true },
      { name: "Custom Reports", limit: "20/module | Total 50", included: false },
      { name: "Dashboard", limit: null, included: true },
    ],
  },
  {
    section: "Data Management",
    items: [
      { name: "Mass Update", limit: null, included: true },
    ],
  },
  {
    section: "File Storage",
    items: [
      { name: "File Storage", limit: "10 GB/organization + 50(100) appointments", included: false },
      { name: "Additional File Storage", limit: "AED 54.75/month for 25 GB", included: false },
    ],
  },
  {
    section: "Data Store",
    items: [
      { name: "Data Store", limit: "500,000 records", included: false },
      { name: "Import Data", limit: "20,000 records/batch", included: false },
      { name: "Export Data", limit: null, included: true },
      { name: "Import History", limit: null, included: true },
    ],
  },
  {
    section: "Security and Privacy",
    items: [
      { name: "Custom Profiles", limit: "15/organization", included: false },
      { name: "Data Encryption (EAR)", limit: null, included: true },
      { name: "Audit Trail", limit: null, included: true },
      { name: "GDPR Compliance", limit: null, included: true },
    ],
  },
  {
    section: "Developer Tools",
    items: [
      { name: "APIs (Daily call limit)", limit: "25000/Day/Org", included: false },
      { name: "API's Window Limit", limit: "5000/User/Min", included: false },
      { name: "API Concurrency Limit", limit: "15(Client)/Org", included: false },
      { name: "Connections", limit: "1", included: false },
      { name: "Webhooks", limit: "10 Active/module | Total 100/module", included: false },
    ],
  },
  {
    section: "Mobile Support",
    items: [
      { name: "Mobile App for Field Techs", limit: null, included: true },
    ],
  },
] as const;


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

type ResponsiveProps = {
  isMobile: boolean;
};

function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:C.teal, marginBottom:6 }}>{eyebrow}</div>
      <h2 style={{ margin:0, fontSize:"clamp(20px, 4vw, 26px)", fontWeight:900, color:C.navy, lineHeight:1.2, fontFamily:"Georgia,serif" }}>{title}</h2>
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
function StrategySection({ isMobile }: ResponsiveProps) {
  return (
    <div>
      <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 100%)`, borderRadius:18, padding:isMobile ? "26px 20px" : "44px 48px", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-60, top:-60, width:300, height:300, borderRadius:"50%", border:"2px solid rgba(14,158,142,0.12)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:40, bottom:-40, width:200, height:200, borderRadius:"50%", border:"1px solid rgba(232,146,42,0.12)", pointerEvents:"none" }} />
        <Pill label="ZOHO FSM · SERGAS" bg="rgba(14,158,142,0.18)" color={C.teal} style={{ marginBottom:14 }} />
        <h1 style={{ margin:"0 0 12px", fontSize:isMobile ? "clamp(22px,6vw,28px)" : 36, fontWeight:900, color:C.white, lineHeight:1.15, fontFamily:"Georgia,serif" }}>Centralized Implementation<br/>Strategy</h1>
        <p style={{ margin:"0 0 28px", fontSize:15, color:"rgba(255,255,255,0.6)", maxWidth:560, lineHeight:1.65 }}>One Platform. Multiple Departments. Full Control. — Unifying diverse operations into a single, cohesive ecosystem.</p>
        <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "repeat(3,1fr)", gap:14 }}>
          {[["⚖","Governance","Standardized protocols across all units"],["🔗","Integration","Seamless data flow: CRM ↔ FSM"],["📈","Scalability","Ready for multi-region expansion"]].map(([ic,t,d]) => (
            <div key={t} style={{ background:"rgba(255,255,255,0.06)", borderRadius:12, padding:"14px 18px", borderLeft:`3px solid ${C.teal}`, flex:1 }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{ic}</div>
              <div style={{ color:C.white, fontWeight:800, fontSize:13, marginBottom:3 }}>{t}</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:16, marginBottom:24 }}>
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
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexDirection:isMobile ? "column" : "row", gap:isMobile ? 12 : 0, marginBottom:16 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Business Objective</div>
            <div style={{ fontWeight:900, fontSize:18, color:C.navy }}>Unified FSM Hub — Central Control</div>
            <div style={{ fontSize:13, color:C.slate, marginTop:4 }}>Implement one centralized platform while maintaining logical separation via Territory Structure</div>
          </div>
          <div style={{ background:C.navy, borderRadius:12, width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>🌐</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "repeat(3,minmax(0,1fr))", gap:10 }}>
          {[{l:"EOM",d:"Emergency Operations & Maintenance",c:C.eom},{l:"Projects",d:"Projects & Installations",c:C.pt},{l:"Customer Service",d:"Client Requests & Support",c:C.cst},{l:"Fire Fighting",d:"Specialized Safety Inspections",c:C.fft},{l:"GOT",d:" ",d2:"Gas Operation Team",c:C.got},{l:"Industrial Gas",d:"Industrial Gas Operations",c:C.ig}].map(x => (
            <div key={x.l} style={{ background:x.c.light, borderTop:`3px solid ${x.c.bg}`, borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontWeight:800, fontSize:14, color:x.c.bg, marginBottom:4 }}>{x.l}</div>
              <div style={{ fontSize:11, color:x.c.text, lineHeight:1.45 }}>
                <div>{x.d}</div>
                {"d2" in x && x.d2 && <div>{x.d2}</div>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <SectionHeader eyebrow="Critical Success Factors" title="Five Pillars of Success" subtitle="Required to ensure system stability and user adoption across all departments" />
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "repeat(5,1fr)", gap:12 }}>
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
function ArchitectureSection({ isMobile }: ResponsiveProps) {
  return (
    <div>
      <SectionHeader eyebrow="System Architecture" title="Architecture Overview" subtitle="Clear delineation between Master Data management and Field Execution" />
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr auto 1fr", gap:20, alignItems:"center", marginBottom:24 }}>
        <Card style={{ borderTop:`4px solid ${C.navy}` }}>
          <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
            <div style={{ background:C.navy, borderRadius:10, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🗄</div>
            <div><div style={{ fontWeight:900, fontSize:16, color:C.navy }}>ZOHO CRM</div><div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1 }}>Master System</div></div>
          </div>
          {["Accounts (Customers)","Contacts","Systems (Assets)","Snag Module"].map(item => (
            <div key={item} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}><Dot color={C.slate} /><span style={{ fontSize:13, color:"#334155" }}>{item}</span></div>
          ))}
        </Card>
        <div style={{ display:"flex", flexDirection:isMobile ? "row" : "column", gap:12, alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:C.amberLight, border:`1px solid ${C.amber}40`, borderRadius:10, padding:"10px 16px", textAlign:"center", width:isMobile ? "auto" : 140 }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.amber, textTransform:"uppercase", letterSpacing:1 }}>Master Data Push</div>
            <div style={{ fontSize:24, margin:"4px 0", color:C.amber }}>→</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#92400e" }}>Sync Data</div>
          </div>
          <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:10, padding:"8px 16px", textAlign:"center", width:isMobile ? "auto" : 140 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#15803d" }}>API Integration</div>
          </div>
          <div style={{ background:C.tealLight, border:`1px solid ${C.teal}40`, borderRadius:10, padding:"10px 16px", textAlign:"center", width:isMobile ? "auto" : 140 }}>
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
          {["Accounts (Customers)","Contacts","Systems (Assets)","Work Order Request"].map(item => (
            <div key={item} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}><Dot color={C.teal} /><span style={{ fontSize:13, color:"#334155" }}>{item}</span></div>
          ))}
        </Card>
      </div>

      <div style={{ background:C.amberLight, border:`1px solid ${C.amber}40`, borderRadius:12, padding:isMobile ? "12px 14px" : "14px 20px", marginBottom:28, display:"flex", flexDirection:isMobile ? "column" : "row", gap:14 }}>
        <span style={{ fontSize:24, flexShrink:0 }}>💡</span>
        <div><span style={{ fontWeight:800, fontSize:13, color:C.navy }}>Architecture Principle: </span><span style={{ fontSize:13, color:"#7c3d12", lineHeight:1.7 }}>CRM acts as the "Single Source of Truth" for all customer and asset data. FSM is strictly for operational execution, consuming data from CRM and returning job completion status via API.</span></div>
      </div>

      <SectionHeader eyebrow="Data Governance" title="Asset Strategy Flow" subtitle="Controlled data propagation from CRM to FSM" />
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "repeat(4,1fr)", gap:14, marginBottom:28 }}>
        {[{n:1,t:"CRM Main Asset (System)",c:"#2563eb",l:"#eff6ff",rows:[["Master Record","Created & managed by CRM"],["Details","System Name, System Type, System Status, System Owner (Account Lookup),SERGAS System Code, State / City, Country, Latitude / Longitude"],["Ownership","Full Read / Write managed in CRM"]]},
          {n:2,t:"FSM Service Asset",c:C.teal,l:C.tealLight,rows:[["Synced From CRM","System Name, System Type, System Status, System Owner (Account Lookup),SERGAS System Code, State / City, Country, Latitude / Longitude"],["Purpose","Operational execution entity for field service"],["Access","Read-Only for basic details"]]},
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
        <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr auto 1fr", gap:0 }}>
          <div>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
              <div style={{ background:C.teal, borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>🔧</div>
              <div><div style={{ fontWeight:800, fontSize:14, color:C.navy }}>FSM Work Order</div><div style={{ fontSize:11, color:C.slate }}>Field View (Technician)</div></div>
            </div>
            {[{s:"New",c:"#64748b",bg:"#f1f5f9"},{s:"Scheduled",c:"#2563eb",bg:"#eff6ff"},{s:"In Progress",c:"#15803d",bg:"#f0fdf4"},{s:"Paused",c:"#dc2626",bg:"#fef2f2"},{s:"Completed",c:"#15803d",bg:"#dcfce7"},{s:"Cancelled",c:"#dc2626",bg:"#fef2f2"}].map(st => (
              <div key={st.s} style={{ background:st.bg, borderRadius:8, padding:"9px 14px", marginBottom:6, fontSize:13, fontWeight:600, color:st.c }}>{st.s}</div>
            ))}
          </div>
          <div style={{ display:isMobile ? "none" : "flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"0 24px", gap:38, paddingTop:50 }}>
            {["⇄","⇄","✓","⇄","✓","⇄"].map((ic,i) => <div key={i} style={{ fontSize:16, color:ic==="✓"?C.teal:C.slate, fontWeight:700 }}>{ic}</div>)}
          </div>
          <div>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
              <div style={{ background:C.navy, borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>🗄</div>
              <div><div style={{ fontWeight:800, fontSize:14, color:C.navy }}>CRM Snag (Snag Operational Status)</div><div style={{ fontSize:11, color:C.slate }}>Office View (Management)</div></div>
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
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1.4fr 1fr", gap:16 }}>
        <Card style={{ borderTop:`3px solid ${C.amber}` }}>
          <Pill label="TRIGGER SOURCE" bg={C.amberLight} color={C.amber} />
          <h3 style={{ margin:"12px 0 6px", fontSize:18, fontWeight:900, color:C.navy }}>ZOHO CRM Snag</h3>
          <div style={{ background:C.amberLight, border:`2px dashed ${C.amber}60`, borderRadius:10, padding:"12px 14px", margin:"14px 0" }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.amber, textTransform:"uppercase", letterSpacing:1 }}>Automation Trigger</div>
            <div style={{ fontSize:15, fontWeight:900, color:"#92400e", marginTop:4 }}>⚡ Commercial Enquiry Status = Complete</div>
          </div>
          <p style={{ fontSize:12, color:C.slate, lineHeight:1.65, margin:0 }}>When a snag is validated and the <b>Commercial Enquiry Status</b> is updated to <i>Complete</i> in <b>CRM</b>, the automation triggers instantly and automatically creates a <b>Work Order Request</b> in <b>FSM</b>.</p>
        </Card>
        <Card style={{ borderTop:`3px solid ${C.navy}` }}>
          <div style={{ textAlign:"center", marginBottom:14 }}>
            <div style={{ background:C.navy, color:"#fff", borderRadius:20, padding:"4px 14px", fontSize:11, fontWeight:700, display:"inline-block" }}>🤖 AUTO-MAPPING LOGIC</div>
            <div style={{ fontSize:10, color:C.slate, marginTop:6, textTransform:"uppercase", letterSpacing:1 }}>Data Field Transformation</div>
          </div>
          {[["Account","Account"],["Contact","Contact"],["Address","Address"],["Email","Email"],["Mobile","Mobile"],["Phone","Phone"]].map(([f,t]) => (
            <div key={f} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
              <div style={{ flex:1, background:"#f8fafc", border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 10px", fontSize:12, color:"#334155" }}>{f}</div>
              <div style={{ color:C.amber, fontSize:16, fontWeight:700 }}>→</div>
              <div style={{ flex:1, background:C.tealLight, border:`1px solid ${C.teal}30`, borderRadius:6, padding:"5px 10px", fontSize:12, color:"#0f766e" }}>{t}</div>
            </div>
          ))}
        </Card>
        <Card style={{ borderTop:`3px solid ${C.teal}` }}>
          <Pill label="OUTPUT RESULT" bg={C.tealLight} color={C.teal} />
          <h3 style={{ margin:"12px 0 6px", fontSize:18, fontWeight:900, color:C.navy }}>FSM Work Order Request</h3>
          <div style={{ background:C.tealLight, border:`2px solid ${C.teal}40`, borderRadius:10, padding:"16px", margin:"14px 0", textAlign:"center" }}>
            <div style={{ fontSize:28 }}>📋</div>
            <div style={{ fontWeight:800, fontSize:14, color:C.teal, marginTop:6 }}>New Record Created</div>
          </div>
          {["Description Populated"].map(item => (
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
const territoryLocationData = [
  { id:"uae", country:"United Arab Emirates", countryCode:"UAE", flag:"🇦🇪",
    subGroups:[
      { name:"Abu Dhabi", ref:"https://u.ae/en/about-the-uae/the-seven-emirates/abu-dhabi",
        locations:[
          { name:"Abu Dhabi Region", code:"AUH" },
          { name:"Al Ain Region",    code:"AAN" },
          { name:"Al Dhafra Region", code:"DFR" },
        ] },
      { name:"Dubai", ref:"https://en.wikipedia.org/wiki/List_of_communities_in_Dubai",
        locations:[
          { name:"Northwest – Sector 1",     code:"NWS" },
          { name:"North – Sector 2",         code:"NTH" },
          { name:"West – Sector 3",          code:"WST" },
          { name:"North Central – Sector 4", code:"NCT" },
          { name:"Southwest – Sector 5",     code:"SWT" },
          { name:"Central – Sector 6",       code:"CTR" },
          { name:"Northeast – Sector 7",     code:"NET" },
          { name:"East – Sector 8",          code:"EST" },
          { name:"South – Sector 9",         code:"STH" },
        ] },
    ] },
  { id:"omn", country:"Oman", countryCode:"OMN", flag:"🇴🇲",
    subGroups:[
      { name:"Oman", ref:"https://www.fm.gov.om/en/about-oman/state/oman-by-region/",
        locations:[
          { name:"Musandam",          code:"MSD" },
          { name:"Al Buraimi",        code:"BRM" },
          { name:"Al Batinah North",  code:"BNN" },
          { name:"Al Batinah South",  code:"BNS" },
          { name:"Muscat",            code:"MCT" },
          { name:"A'Dhahirah",        code:"DHR" },
          { name:"A'Dakhiliyah",      code:"DKH" },
          { name:"A'Sharqiyah North", code:"SHN" },
          { name:"A'Sharqiyah South", code:"SHS" },
          { name:"Al Wusta",          code:"WST" },
          { name:"Dhofar",            code:"DHF" },
        ] },
    ] },
  { id:"ksa", country:"Saudi Arabia", countryCode:"KSA", flag:"🇸🇦",
    subGroups:[
      { name:"Saudi Arabia", ref:"https://www.mofa.gov.sa/en/ksa/Pages/default.aspx",
        locations:[
          { name:"Riyadh",                           code:"RYD" },
          { name:"Makkah",                           code:"MKH" },
          { name:"Madinah",                          code:"MDN" },
          { name:"Eastern Province (Ash-Sharqiyah)", code:"ESP" },
          { name:"Al-Qassim",                        code:"QSM" },
          { name:"Hail",                             code:"HAL" },
          { name:"Tabuk",                            code:"TBK" },
          { name:"Al-Baha",                          code:"BAH" },
          { name:"Jazan",                            code:"JZN" },
          { name:"Najran",                           code:"NJR" },
          { name:"Asir",                             code:"ASR" },
          { name:"Al-Jouf",                          code:"JOF" },
          { name:"Northern Borders",                 code:"NBR" },
        ] },
    ] },
];

const deptList = [
  { id:"EOM", name:"Gas Emergency & Operations", color:C.eom },
  { id:"FFT", name:"Firefighting Team",          color:C.fft },
  { id:"GOT", name:"Gas Operations Team",        color:C.got },
  { id:"CST", name:"Customer Service Team",      color:C.cst },
  { id:"PT",  name:"Project Team",               color:C.pt  },
  { id:"IG",  name:"Industrial Gas",             color:C.ig  },
];

function TerritoriesSection({ isMobile }: ResponsiveProps) {
  const [activeDept, setActiveDept] = useState("EOM");
  const dept = deptList.find(d => d.id === activeDept)!;
  const totalTerritories = territoryLocationData.reduce((sum, c) => sum + c.subGroups.reduce((s2, g) => s2 + g.locations.length, 0), 0);
  return (
    <div>
      <SectionHeader eyebrow="Structured Organization" title="Territory Structure Strategy" subtitle="Standardized naming conventions for logical data separation across departments and regions" />
      <Card style={{ marginBottom:24, textAlign:"center" }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:1.5, marginBottom:20 }}>Naming Convention Formula</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:isMobile ? 8 : 16, flexWrap:"wrap" }}>
          {[["DEPARTMENT PREFIX (PREFIX)","PREFIX","border"],["COUNTRY PREFIX (COUNTRY)","COUNTRY","border"],["GEOGRAPHIC CODE (LOCATION)","LOCATION","border"],["UNIQUE TERRITORY NAME","PREFIX-COUNTRY-LOCATION","filled"]].map(([label,val,style],i) => (
            <div key={val} style={{ display:"flex", alignItems:"center", gap:16 }}>
              {i>0 && <div style={{ fontSize:28, color:C.slate, fontWeight:300 }}>{i===3?"=":"+"}</div>}
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>{label}</div>
                <div style={style==="filled" ? { background:C.navy, borderRadius:10, padding:"14px 28px", fontSize:20, fontWeight:900, color:C.white } : { border:`2px dashed ${C.border}`, borderRadius:10, padding:"14px 24px", fontSize:20, fontWeight:900, color:C.navy }}>{val}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:20, marginBottom:28 }}>
        <Card>
          <div style={{ fontSize:11, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>👥 Department Prefixes (Level 1)</div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:10, marginBottom:20 }}>
            {[{ab:"EOM",f:"Emergency Ops & Maintenance",c:C.eom},{ab:"PRJ",f:"Projects",c:C.pt},{ab:"CS",f:"Customer Service",c:C.cst},{ab:"FF",f:"Fire Fighting",c:C.fft},{ab:"IG",f:"Industrial Gas",c:C.ig}].map(d => (
              <div key={d.ab} style={{ borderLeft:`3px solid ${d.c.bg}`, paddingLeft:12, paddingTop:4, paddingBottom:4 }}>
                <div style={{ fontWeight:900, fontSize:18, color:d.c.bg }}>{d.ab}</div>
                <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{d.f}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>🌍 Country Prefixes (Level 2)</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {[["🌍","UAE","United Arab Emirates"],["🌍","OMN","Oman"],["🌍","KSA","Saudi Arabia"]].map(([ic,code,country]) => (
                <div key={code} style={{ background:"#f8fafc", border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 14px", display:"flex", gap:6, alignItems:"center" }}>
                  <span style={{ fontSize:14 }}>{ic}</span>
                  <div><div style={{ fontWeight:800, fontSize:13, color:C.navy }}>{code}</div><div style={{ fontSize:10, color:C.slate }}>{country}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:16, marginTop:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>📍 Location Codes (Level 3)</div>
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
          {[{code:"EOM-UAE-AUH",desc:"Ops Team in Abu Dhabi, United Arab Emirates",tag:"OPERATIONS",c:C.eom},{code:"PRJ-UAE-DXB",desc:"Projects Team in Dubai, United Arab Emirates",tag:"Projects",c:C.pt},{code:"CS-UAE-AUH",desc:"Support Team in Abu Dhabi, United Arab Emirates",tag:"SERVICE",c:C.cst},{code:"FF-UAE-SHJ",desc:"Fire Fighting Team in Sharjah, United Arab Emirates",tag:"FIRE FIGHTING",c:C.fft},{code:"IG-UAE-AUH",desc:"Industrial Gas Team in Abu Dhabi, United Arab Emirates",tag:"INDUSTRIAL GAS",c:C.ig}].map(t => (
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
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "repeat(4,1fr)", gap:14, marginBottom:20 }}>
        {[{n:1,ic:"👤",t:"System User",c:C.navy,d:"Technician or Back Office staff logs into the FSM portal or mobile app."},
          {n:2,ic:"🪪",t:"Assigned Role",c:"#2563eb",d:"Profile determines functional capabilities (e.g., 'View Only' vs 'Edit')."},
          {n:3,ic:"🗺",t:"Territory Scope",c:C.teal,d:"User is linked to specific location codes (e.g., EOM-UAE-AUH).",badge:"ROADMAP: ETA 4–5 Weeks"},
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
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:14 }}>
        <Card style={{ borderLeft:`4px solid #dc2626` }}><div style={{ fontWeight:800, fontSize:14, color:C.navy, marginBottom:6 }}>🛡 Data Isolation</div><p style={{ margin:0, fontSize:13, color:C.slate, lineHeight:1.65 }}>Technicians in Dubai (DXB) cannot view or modify assets in Abu Dhabi (AUH), preventing accidental cross-region errors.</p></Card>
        <Card style={{ borderLeft:`4px solid ${C.teal}` }}><div style={{ fontWeight:800, fontSize:14, color:C.navy, marginBottom:6 }}>🔄 Dynamic Updates</div><p style={{ margin:0, fontSize:13, color:C.slate, lineHeight:1.65 }}>If a technician moves permanently, updating their User Profile Territory immediately grants access to the new region's data.</p></Card>
      </div>

      <SectionHeader eyebrow="Department Territory Assignments" title="Territory Code Generator" subtitle="Select a department — territories update automatically with standardized PREFIX-COUNTRY-LOCATION codes" />

      {/* Department selector */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
        {deptList.map(d => {
          const active = activeDept === d.id;
          return (
            <button key={d.id} onClick={() => setActiveDept(d.id)} style={{
              display:"flex", alignItems:"center", gap:8,
              padding: isMobile ? "9px 14px" : "10px 20px",
              border:`2px solid ${active ? d.color.bg : C.border}`,
              borderRadius:10, cursor:"pointer", background: active ? d.color.bg : C.white,
              color: active ? "#fff" : C.navy,
              fontWeight:800, fontSize: isMobile ? 12 : 13,
              boxShadow: active ? `0 4px 14px ${d.color.bg}50` : "none",
              transition:"all 0.18s",
            }}>
              <span style={{ fontFamily:"monospace", letterSpacing:0.5 }}>{d.id}</span>
              {!isMobile && <span style={{ fontWeight:500, fontSize:11, opacity:0.85 }}>{d.name}</span>}
            </button>
          );
        })}
      </div>

      {/* Active department summary banner */}
      <div style={{ background:dept.color.light, border:`1.5px solid ${dept.color.bg}40`, borderRadius:14, padding:"14px 20px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontWeight:900, fontSize:17, color:dept.color.bg }}>{dept.id} — {dept.name}</div>
          <div style={{ fontSize:12, color:C.slate, marginTop:3 }}>{totalTerritories} territories across {territoryLocationData.length} country groups</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:dept.color.bg, color:"#fff", borderRadius:10, padding:"8px 16px" }}>
          <span style={{ fontFamily:"monospace", fontWeight:900, fontSize:14, letterSpacing:1 }}>{dept.id}-COUNTRY-LOC</span>
          <span style={{ fontSize:11, opacity:0.7 }}>format</span>
        </div>
      </div>

      {/* Country territory cards */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "repeat(3,1fr)", gap:16 }}>
        {territoryLocationData.map(country => {
          const total = country.subGroups.reduce((s, g) => s + g.locations.length, 0);
          return (
            <Card key={country.id} style={{ borderTop:`3px solid ${dept.color.bg}`, padding:0, overflow:"hidden" }}>
              {/* Card header */}
              <div style={{ background:`${dept.color.bg}08`, borderBottom:`1px solid ${dept.color.bg}20`, padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:22 }}>{country.flag}</span>
                  <div>
                    <div style={{ fontWeight:900, fontSize:15, color:C.navy }}>{country.country}</div>
                    <div style={{ fontSize:10, color:C.slate, textTransform:"uppercase", letterSpacing:0.8, marginTop:1 }}>{country.countryCode} · {total} territories</div>
                  </div>
                </div>
                <div style={{ background:dept.color.bg, color:"#fff", borderRadius:6, padding:"3px 10px", fontSize:10, fontWeight:800, letterSpacing:0.5 }}>{country.countryCode}</div>
              </div>

              {/* Sub-groups */}
              {country.subGroups.map((group, gi) => (
                <div key={group.name}>
                  {/* Sub-group label (only shown when >1 sub-group) */}
                  {country.subGroups.length > 1 && (
                    <div style={{ background:`${dept.color.bg}06`, borderBottom:`1px solid ${dept.color.bg}15`, padding:"7px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <span style={{ fontSize:11, fontWeight:800, color:dept.color.bg, textTransform:"uppercase", letterSpacing:0.8 }}>{group.name}</span>
                      <span style={{ fontSize:10, color:C.slate }}>{group.locations.length} locations</span>
                    </div>
                  )}

                  {/* Territory chips */}
                  <div style={{ padding:"10px 14px", display:"flex", flexWrap:"wrap", gap:6, borderBottom: gi < country.subGroups.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    {group.locations.map(loc => (
                      <div key={loc.code} style={{ background:dept.color.light, border:`1px solid ${dept.color.bg}35`, borderRadius:6, padding:"5px 8px", flexShrink:0 }}>
                        <div style={{ fontFamily:"monospace", fontWeight:900, fontSize:10, color:dept.color.bg, letterSpacing:0.4, whiteSpace:"nowrap" }}>
                          {dept.id}-{country.countryCode}-{loc.code}
                        </div>
                        <div style={{ fontSize:9, color:C.slate, marginTop:2, lineHeight:1.2, whiteSpace:"nowrap" }}>{loc.name}</div>
                      </div>
                    ))}
                  </div>

                  {/* Reference link per sub-group */}
                  <div style={{ padding:"8px 18px", borderBottom: gi < country.subGroups.length - 1 ? `1px solid ${dept.color.bg}15` : "none" }}>
                    <a href={group.ref} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, color:dept.color.bg, fontWeight:700, textDecoration:"none" }}>
                      <span>🔗</span>
                      <span>For more details, please visit this link</span>
                    </a>
                  </div>
                </div>
              ))}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── TEAMS ────────────────────────────────────────────
function TeamsSection({ isMobile }: ResponsiveProps) {
  const [active, setActive] = useState("eom");
  const team = teams.find(t => t.id === active);
  return (
    <div>
      <SectionHeader eyebrow="Field Operations" title="Teams & Territories" subtitle="Six specialized teams operating within the unified FSM ecosystem" />
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr 1fr" : "repeat(6,1fr)", gap:10, marginBottom:24 }}>
        {teams.map(t => (
          <div key={t.id} onClick={() => setActive(t.id)} style={{ background:active===t.id?t.color.bg:C.white, border:`2px solid ${t.color.border}`, borderRadius:14, padding:16, cursor:"pointer", transition:"all 0.2s", boxShadow:active===t.id?`0 6px 20px ${t.color.bg}40`:"0 2px 6px rgba(0,0,0,0.04)" }}>
            <Pill label={t.abbr} bg={active===t.id?"rgba(255,255,255,0.2)":t.color.bg} color="#fff" style={{ marginBottom:10 }} />
            <div style={{ fontSize:12, fontWeight:800, color:active===t.id?"#fff":C.navy, lineHeight:1.35, marginBottom:6 }}>{t.name}</div>
            <div style={{ fontSize:11, color:active===t.id?"rgba(255,255,255,0.65)":C.slate }}>📍 {t.territory}</div>
          </div>
        ))}
      </div>
      {team && (
        <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "repeat(4,1fr)", gap:14, marginBottom:28 }}>
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
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:14, marginBottom:28 }}>
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
            <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:8 }}>
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
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 0fr", gap:20 }}>
        <Card>
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ display:"inline-flex", gap:10, alignItems:"center", background:C.navy, borderRadius:10, padding:"10px 18px" }}>
              <span style={{ fontSize:18 }}>🔀</span>
              <div style={{ textAlign:"left" }}><div style={{ color:"#fff", fontWeight:800, fontSize:13 }}>Parent Work Order</div><div style={{ color:"rgba(255,255,255,0.55)", fontSize:11 }}>Main Project Container (ID: PRJ-1001)</div></div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:4 }}><div style={{ width:2, height:20, background:C.border }} /></div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:12 }}>
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
        {/* <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:10 }}>
          {[{ic:"📈",t:"Phase Tracking",d:"Monitor progress per phase (Rough-in vs Finish) independently"},{ic:"💰",t:"Better Reporting",d:"Roll-up costs and hours from child jobs to parent project"},{ic:"👥",t:"Controlled Scheduling",d:"Prevent Phase 2 booking until Phase 1 status is 'Complete'"},{ic:"🛡",t:"SLA Clarity",d:"Define different SLA targets for urgent vs planned phases"}].map(b => (
            <Card key={b.t}><div style={{ fontSize:26, marginBottom:8 }}>{b.ic}</div><div style={{ fontWeight:800, fontSize:13, color:C.navy, marginBottom:6 }}>{b.t}</div><div style={{ fontSize:12, color:C.slate, lineHeight:1.65 }}>{b.d}</div></Card>
          ))}
        </div> */}
      </div>
    </div>
  );
}

// ─── ASSETS ───────────────────────────────────────────
function AssetsSection({ isMobile }: ResponsiveProps) {
  return (
    <div>
      <SectionHeader eyebrow="Asset Management" title="Asset Hierarchy" subtitle="Parent → Child asset structure mapped to territories across all departments" />
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "repeat(2,1fr)", gap:16, marginBottom:28 }}>
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
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "repeat(3,1fr)", gap:10 }}>
        {[{f:"Asset Code",t:"Text",e:"SERGAS-CGS-001-PRV-A"},{f:"Asset type",t:"Picklist",e:"Regulator Station Asset"},{f:"Parent System / Asset",t:"Lookup",e:"Americana (DRS-001)"},{f:"Service And Part",t:"Lookup",e:"PRV Inspection + Diaphragm Kit"},{f:"Last Inspection Date",t:"Date",e:"22/02/2026"},{f:"Risk Level",t:"Picklist",e:"Low / Medium / High / Critical"},{f:"Condition Rating",t:"Picklist",e:"Good / Fair / Poor"},{f:"Assigned Engineer",t:"Picklist",e:"Ahmed Al Mansoori"},{f:"Ordered Date",t:"Date",e:"15/01/2026"},{f:"Installation Date",t:"Date",e:"02/02/2026"},{f:"Purchased Date",t:"Date",e:"10/01/2026"},{f:"Warranty Expiration",t:"Date",e:"10/01/2028"},{f:"Region",t:"Picklist",e:"UAE North Zone"}].map(x => (
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
function ServiceFlowSection({ isMobile }: ResponsiveProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const sc = ["#c2410c","#b45309","#d97706","#65a30d","#15803d","#0891b2","#2563eb","#6d28d9","#0f172a"];
  return (
    <div>
      <SectionHeader eyebrow="Operational Logic" title="End-to-End Service Flow" subtitle="From Work Order request to PDF report — complete field execution chain" />
      <Card style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Service Appointment Logic — Execution Chain</div>
        <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "repeat(4,1fr)", gap:12, marginBottom:16 }}>
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
        <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "repeat(3,1fr)", gap:10 }}>
          {[{ic:"🗺",t:"Territory Matching",d:"Only techs in 'DXB' can view Dubai jobs."},{ic:"🎓",t:"Skill Requirements",d:"Matches 'Electrician' skill to job type."},{ic:"⏱",t:"Time Tracking",d:"Logs Travel, Work, Break times accurately."}].map(d => (
            <div key={d.t} style={{ background:C.slateLight, borderRadius:10, padding:"10px 14px", display:"flex", gap:12, alignItems:"flex-start" }}>
              <span style={{ fontSize:22 }}>{d.ic}</span>
              <div><div style={{ fontWeight:700, fontSize:12, color:C.navy }}>{d.t}</div><div style={{ fontSize:11, color:C.slate, marginTop:3 }}>{d.d}</div></div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 300px", gap:20 }}>
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
                    <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:12 }}>
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
          <div style={{ background:C.white, borderRadius:16, border:`2px solid ${C.navy}`, boxShadow:"0 4px 16px rgba(0,0,0,0.1)", overflow:"hidden", position:isMobile ? "static" : "sticky", top:isMobile ? undefined : 76 }}>
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
function RoadmapSection({ isMobile }: ResponsiveProps) {
  const roadmapScheduleConfig = {
    overallTimeline: "24 February 2026 – 16 March 2026",
    overallStart: new Date(2026, 1, 24),
    overallEnd: new Date(2026, 2, 16),
    weekStarts: [new Date(2026, 1, 24), new Date(2026, 2, 3), new Date(2026, 2, 10)],
    workingDaysPerWeek: 5,
    followUpMeetings: {
      week1: "03/Mar/2026",
      week2: "10/Mar/2026",
      week3: "17/Mar/2026",
    },
    weekStartLabels: ["24/Feb/2026", "03/Mar/2026", "10/Mar/2026"],
  } as const;

  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
  const toDateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const addBusinessDays = (date: Date, daysToAdd: number) => {
    const next = new Date(date);
    let added = 0;
    while (added < daysToAdd) {
      next.setDate(next.getDate() + 1);
      if (!isWeekend(next)) {
        added += 1;
      }
    }
    return next;
  };
  const getCalendarDateFromWeekDay = (weekNumber: number, dayIndex: number) => {
    if (weekNumber < 1 || weekNumber > roadmapScheduleConfig.weekStarts.length) {
      return null;
    }
    if (dayIndex < 1 || dayIndex > roadmapScheduleConfig.workingDaysPerWeek) {
      return null;
    }
    return addBusinessDays(roadmapScheduleConfig.weekStarts[weekNumber - 1], dayIndex - 1);
  };
  const getWeekDayFromCalendarDate = (date: Date) => {
    const dateKey = toDateKey(date);
    for (let weekNumber = 1; weekNumber <= roadmapScheduleConfig.weekStarts.length; weekNumber += 1) {
      for (let dayIndex = 1; dayIndex <= roadmapScheduleConfig.workingDaysPerWeek; dayIndex += 1) {
        const mappedDate = getCalendarDateFromWeekDay(weekNumber, dayIndex);
        if (mappedDate && toDateKey(mappedDate) === dateKey) {
          return { weekNumber, dayIndex };
        }
      }
    }
    return null;
  };
  const getLegacyCalendarDateFromAbsoluteDay = (absoluteDay: number) => {
    const legacy = new Date(roadmapScheduleConfig.overallStart);
    legacy.setDate(legacy.getDate() + absoluteDay - 1);
    return legacy;
  };
  const normalizeDeadlineLabel = (deadline: string, weekNumber: number) => {
    const match = deadline.match(/Day\s*(\d+)(?:\s*[–-]\s*(\d+))?/);
    if (!match) {
      return deadline;
    }

    const convertDay = (day: number) => {
      if (day >= 1 && day <= roadmapScheduleConfig.workingDaysPerWeek) {
        return day;
      }

      const mapped = getWeekDayFromCalendarDate(getLegacyCalendarDateFromAbsoluteDay(day));
      if (mapped && mapped.weekNumber === weekNumber) {
        return mapped.dayIndex;
      }

      const weekBase = (weekNumber - 1) * 7 + 1;
      return Math.max(1, Math.min(roadmapScheduleConfig.workingDaysPerWeek, day - weekBase + 1));
    };

    const dayStart = convertDay(Number(match[1]));
    const dayEnd = match[2] ? convertDay(Number(match[2])) : null;
    if (!dayEnd || dayEnd === dayStart) {
      return `Day ${dayStart}`;
    }
    const sorted = [dayStart, dayEnd].sort((a, b) => a - b);
    return `Day ${sorted[0]}–${sorted[1]}`;
  };

  const [scope, setScope] = useState<"process" | "it">("process");
  const [expandedWeek, setExpandedWeek] = useState<string | null>("Week 1");
  const [expandedOos, setExpandedOos] = useState<number | null>(null);
  const rawData = scope === "process" ? processOwnerRoadmap : itRoadmap;
  const data = rawData.map((week, weekIndex) => ({
    ...week,
    days: `Days 1–${roadmapScheduleConfig.workingDaysPerWeek}`,
    startDate: roadmapScheduleConfig.weekStartLabels[weekIndex],
    followUpMeeting: roadmapScheduleConfig.followUpMeetings[`week${weekIndex + 1}` as "week1" | "week2" | "week3"],
    tasks: week.tasks.map(task => ({
      ...task,
      deadline: normalizeDeadlineLabel(task.deadline, weekIndex + 1),
    })),
  }));

  return (
    <div>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 100%)`, borderRadius:18, padding:isMobile ? "24px 18px" : "36px 40px", marginBottom:28 }}>
        <Pill label="STRATEGIC EXECUTION — 3 WEEK PLAN" bg="rgba(14,158,142,0.18)" color={C.teal} style={{ marginBottom:12 }} />
        <h2 style={{ margin:"0 0 8px", fontSize:28, fontWeight:900, color:C.white, fontFamily:"Georgia,serif" }}>Implementation Roadmap</h2>
        <p style={{ margin:"0 0 24px", fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>Compressed 3-week delivery plan — dual-track execution. Select a scope to view its detailed activity schedule.</p>
        <div style={{ margin:"-12px 0 24px", fontSize:12, color:"rgba(255,255,255,0.75)", lineHeight:1.7 }}>
          <div><strong>Overall timeline:</strong> {roadmapScheduleConfig.overallTimeline}</div>
          
        </div>
        <div style={{ display:"flex", gap:12, flexDirection:isMobile ? "column" : "row" }}>
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
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "repeat(3,1fr)", gap:12, marginBottom:20 }}>
        {data.map(w => (
          <div key={w.week} onClick={() => setExpandedWeek(expandedWeek===w.week?null:w.week)} style={{ borderRadius:12, padding:"14px 16px", cursor:"pointer", transition:"all 0.2s", background:expandedWeek===w.week?w.color:w.light, border:`2px solid ${expandedWeek===w.week?w.color:w.color+"40"}`, boxShadow:expandedWeek===w.week?`0 6px 20px ${w.color}40`:"none" }}>
            <div style={{ fontWeight:900, fontSize:18, color:expandedWeek===w.week?"#fff":w.color, marginBottom:3 }}>{w.week}</div>
            <div style={{ fontSize:12, color:expandedWeek===w.week?"rgba(255,255,255,0.75)":C.slate, marginBottom:8 }}>{w.days}</div>
            <div style={{ fontSize:10, color:expandedWeek===w.week?"rgba(255,255,255,0.65)":C.slate, marginBottom:8 }}>Start: {w.startDate}</div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:expandedWeek===w.week?"rgba(255,255,255,0.16)":`${w.color}16`, color:expandedWeek===w.week?"#fff":w.color, borderRadius:999, padding:"3px 8px", fontSize:10, fontWeight:700, marginBottom:8, maxWidth:"100%" }}>
              <span style={{ flexShrink:0 }}>📅</span>
              <span style={{ overflowWrap:"anywhere" }}>Follow-up meeting: {w.followUpMeeting}</span>
            </div>
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
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:isMobile ? "flex-start" : "center", flexDirection:isMobile ? "column" : "row", gap:isMobile ? 10 : 0, marginBottom:18, paddingBottom:14, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", alignItems:isMobile ? "flex-start" : "center", flexDirection:isMobile ? "column" : "row", gap:12 }}>
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
          {/* Table header - hidden on mobile */}
          {!isMobile && <div style={{ display:"grid", gridTemplateColumns:"2.2fr 1.2fr 0.65fr 1.5fr", background:"#f8fafc", borderRadius:"8px 8px 0 0", border:`1px solid ${C.border}` }}>
            {["Activity","Responsible","Deadline","Notes / Dependencies"].map((h,hi) => (
              <div key={h} style={{ padding:"9px 12px", fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:0.8, borderRight:hi<3?`1px solid ${C.border}`:"none" }}>{h}</div>
            ))}
          </div>}
          {/* Table rows */}
          {w.tasks.map((task,i) => (
            isMobile ? (
              <div key={i} style={{ background:i%2===0?C.white:"#fafbfc", border:`1px solid ${C.border}`, borderRadius:8, padding:"12px 14px", marginBottom:8 }}>
                <div style={{ fontWeight:700, fontSize:13, color:C.navy, lineHeight:1.35, marginBottom:6 }}>{task.activity}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <div style={{ fontSize:11, color:"#334155" }}>{task.responsible}</div>
                  <Pill label={task.deadline} bg={w.light} color={w.color} style={{ fontSize:10 }} />
                </div>
                <div style={{ fontSize:11, color:C.slate, lineHeight:1.6 }}>{task.note}</div>
              </div>
            ) : (
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
            )
          ))}
          <div style={{ height:1, background:C.border, borderRadius:"0 0 8px 8px" }} />
        </Card>
      ))}

      {/* ── OUT OF IMPLEMENTATION SCOPE ── */}
      <div style={{ background:"#fff8f0", border:`2px solid ${C.amber}`, borderRadius:16, padding:isMobile ? "16px 14px" : "24px 28px", marginBottom:28 }}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start", flexDirection:isMobile ? "column" : "row", marginBottom:20 }}>
          <div style={{ background:C.amber, borderRadius:10, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>⚠️</div>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:C.amber, textTransform:"uppercase", letterSpacing:2, marginBottom:4 }}>Scope Boundary</div>
            <h3 style={{ margin:"0 0 4px", fontSize:20, fontWeight:900, color:C.navy, fontFamily:"Georgia,serif" }}>Out of Implementation Scope — Process Owner Responsibilities</h3>
            <p style={{ margin:0, fontSize:13, color:C.slate, lineHeight:1.65 }}>The following items are <strong>not included</strong> in the technical implementation scope. They must be owned, designed, and approved by the Process Owner before IT can configure them in the system.</p>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:16, marginBottom:20 }}>
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
      <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:20 }}>
        <Card style={{ borderTop:`3px solid ${C.teal}` }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:16 }}>
            <div style={{ background:"#dcfce7", border:"1px solid #86efac", borderRadius:"50%", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#15803d" }}>✓</div>
            <div><div style={{ fontWeight:900, fontSize:16, color:C.navy }}>Available Now & Coming Soon</div><div style={{ fontSize:11, color:C.slate }}>Live features ready for immediate deployment</div></div>
          </div>
          <div style={{ borderBottom:`1px solid ${C.teal}`, marginBottom:14 }} />
          {[["CRM-FSM Sync","Bi-directional data synchronization for Accounts, Contacts, and Assets"],["Automated Work Order Request","Trigger-based creation from CRM Snag status updates"],["Parent / Child Logic","Hierarchical Work Order management for complex projects"],["Multi-Technician","Scheduling multiple resources (Crew) to a single appointment"],["Status Mapping","Real-time status reflection between FSM and CRM"],["Mobile App Access","Full job execution via FSM mobile app with offline support"]].map(([t,d]) => (
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
function LimitationsSection({ isMobile }: ResponsiveProps) {
  const [query, setQuery] = useState("");
  const keyword = query.trim().toLowerCase();
  const sections = LIMITATIONS_DATA
    .map(section => ({
      ...section,
      items: section.items.filter(item => !keyword || item.name.toLowerCase().includes(keyword) || (item.limit || "").toLowerCase().includes(keyword)),
    }))
    .filter(section => section.items.length > 0);
  return (
    <div>
      <SectionHeader eyebrow="Reference" title="Limitations" subtitle="Zoho FSM module limits and quotas (per org / per module)" />
      <Card style={{ marginBottom:16, background:`linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 100%)`, border:"none" }}>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", marginBottom:10 }}>Values are based on the current plan constraints.</div>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search limitations (invoice, webhook, users...)" style={{ width:"100%", borderRadius:10, border:"1px solid rgba(255,255,255,0.22)", background:"rgba(255,255,255,0.08)", color:"#fff", padding:"10px 12px", fontSize:13, outline:"none" }} />
      </Card>
      <div style={{ display:"grid", gap:14 }}>
        {sections.map(section => (
          <Card key={section.section}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, gap:10 }}>
              <div style={{ fontSize:16, fontWeight:900, color:C.navy }}>{section.section}</div>
              <Pill label={`${section.items.length} items`} bg={C.slateLight} color={C.slate} />
            </div>
            {isMobile ? (
              <div>
                {section.items.map(item => (
                  <div key={item.name} style={{ border:`1px solid ${C.border}`, borderRadius:10, background:"#fafbfc", padding:"10px 12px", marginBottom:8 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.navy, marginBottom:7 }}>{item.name}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10 }}>
                      <div style={{ fontSize:12, color:C.slate }}>{item.limit || "—"}</div>
                      {item.included ? <Pill label="Included" bg="#dcfce7" color="#15803d" /> : <Pill label="Limited" bg={C.slateLight} color={C.slate} />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1.7fr 1fr 0.7fr", background:"#f8fafc", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ padding:"9px 12px", fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:0.8 }}>Feature / Item</div>
                  <div style={{ padding:"9px 12px", fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:0.8, textAlign:"right", borderLeft:`1px solid ${C.border}` }}>Limit / Value</div>
                  <div style={{ padding:"9px 12px", fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:0.8, textAlign:"center", borderLeft:`1px solid ${C.border}` }}>Availability</div>
                </div>
                {section.items.map((item, i) => (
                  <div key={item.name} style={{ display:"grid", gridTemplateColumns:"1.7fr 1fr 0.7fr", background:i%2===0?C.white:"#fafbfc", borderBottom:i<section.items.length-1?`1px solid ${C.border}`:"none" }}>
                    <div style={{ padding:"10px 12px", fontSize:12, fontWeight:600, color:C.navy }}>{item.name}</div>
                    <div style={{ padding:"10px 12px", fontSize:12, color:"#334155", textAlign:"right", borderLeft:`1px solid ${C.border}` }}>{item.limit || "—"}</div>
                    <div style={{ padding:"10px 12px", textAlign:"center", borderLeft:`1px solid ${C.border}` }}>
                      {item.included ? <Pill label="Included" bg="#dcfce7" color="#15803d" /> : <Pill label="Limited" bg={C.slateLight} color={C.slate} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

const navTabs = [
  {id:"strategy",label:"Strategy"},{id:"architecture",label:"Architecture"},
  {id:"territories",label:"Territories & Access"},{id:"teams",label:"Teams"},
  {id:"assets",label:"Assets"},{id:"flow",label:"Service Flow"},
  {id:"roadmap",label:"Implementation Roadmap"},{id:"limitations",label:"Limitations"},
] as const;

type TabId = (typeof navTabs)[number]["id"];

export default function App() {
  const getIsMobileViewport = () => {
    if (typeof window === "undefined") {
      return false;
    }

    const widths = [
      window.innerWidth,
      window.outerWidth,
      document.documentElement?.clientWidth,
      document.body?.clientWidth,
      document.body?.getBoundingClientRect().width,
      window.visualViewport?.width,
      window.screen?.width,
    ].filter((w): w is number => typeof w === "number" && Number.isFinite(w) && w > 0);

    const minWidth = widths.length ? Math.min(...widths) : window.innerWidth;
    return window.matchMedia("(max-width: 480px)").matches || minWidth <= 480;
  };

  const [isMobile, setIsMobile] = useState(() => getIsMobileViewport());
  const [tab, setTab] = useState<TabId>("strategy");
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(getIsMobileViewport());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  const map: Record<TabId, ReactNode> = { strategy:<StrategySection isMobile={isMobile} />, architecture:<ArchitectureSection isMobile={isMobile} />, territories:<TerritoriesSection isMobile={isMobile} />, teams:<TeamsSection isMobile={isMobile} />, assets:<AssetsSection isMobile={isMobile} />, flow:<ServiceFlowSection isMobile={isMobile} />, roadmap:<RoadmapSection isMobile={isMobile} />, limitations:<LimitationsSection isMobile={isMobile} /> };
  return (
    <div style={{ fontFamily:"'Trebuchet MS','Gill Sans',sans-serif", background:"#eef2f7", minHeight:"100vh", overflowX:"hidden", WebkitTextSizeAdjust:"100%" as any }}>
      <div style={{ background:C.navy, position:"sticky", top:0, zIndex:100, boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:isMobile ? "0 8px" : "0 24px", display:"flex", flexDirection:isMobile ? "column" : "row", alignItems:isMobile ? "stretch" : "center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:isMobile ? "10px 4px 8px" : "14px 20px 14px 0", borderRight:isMobile ? "none" : `1px solid rgba(255,255,255,0.1)`, borderBottom:isMobile ? `1px solid rgba(255,255,255,0.1)` : "none", marginRight:isMobile ? 0 : 16, flexShrink:0 }}>
            <div style={{ background:C.teal, borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🔧</div>
            <div><div style={{ color:C.white, fontWeight:900, fontSize:14, lineHeight:1 }}>ZOHO FSM</div><div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, marginTop:2 }}>SERGAS Implementation</div></div>
          </div>
          <div style={{ display:"flex", gap:0, overflowX:"auto", WebkitOverflowScrolling:"touch" as any }}>
            {navTabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:isMobile ? "10px 10px" : "16px 13px", border:"none", cursor:"pointer", fontSize:isMobile ? 11 : 12, fontWeight:700, background:"transparent", color:tab===t.id?C.white:"rgba(255,255,255,0.45)", borderBottom:tab===t.id?`3px solid ${C.teal}`:"3px solid transparent", transition:"all 0.2s", whiteSpace:"nowrap", flexShrink:0 }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:isMobile ? "20px 12px 40px" : "32px 24px 64px" }}>{map[tab]}</div>
      <div style={{ background:C.navy, padding:"16px 24px", textAlign:"center" }}>
        <div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, fontWeight:600, letterSpacing:1 }}>ZOHO FSM · SERGAS Centralized Implementation Strategy · One Platform. Multiple Departments. Full Control.</div>
      </div>
    </div>
  );
}



