"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, Plus, Star, MapPin, Users, ChevronDown, ChevronUp,
  ChevronsUpDown, Building2, ChevronLeft, ChevronRight, X,
  Calendar, RefreshCw, FileText, Edit2, Network, User,
  FileText as QuoteIcon, Shield,
  StickyNote, LayoutGrid, Trash2, Archive, Pin, List, Table2,
  CheckSquare, Maximize2, Minimize2, Lock, Unlock, Copy, CopyPlus,
  MoreVertical, UserCircle, Download, Upload, UserCog, Pencil, Link as LinkIcon, Globe, Eye, Headphones, Crown,
} from "lucide-react";
import { AddressAutocomplete } from "./AddressAutocomplete";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

function generateAgencyCode(): string {
  const letters = Array.from({ length: 2 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join("");
  const digits = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return letters + digits;
}

function DatePicker({ value, onChange, inputStyle, c, btnGrad, font }: {
  value: string;
  onChange: (v: string) => void;
  inputStyle: React.CSSProperties;
  c: { text: string; muted: string; cardBg: string; border: string; borderStrong: string; hoverBg: string };
  btnGrad: string;
  font: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"day" | "month" | "year">("day");
  const parts = value?.split("/") ?? [];
  const initDate = parts[2] ? new Date(+parts[2], +parts[0] - 1, +parts[1]) : new Date();
  const [viewY, setViewY] = useState(initDate.getFullYear());
  const [viewM, setViewM] = useState(initDate.getMonth());
  const [yearPage, setYearPage] = useState(Math.floor(initDate.getFullYear() / 12) * 12);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) { setOpen(false); setMode("day"); }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const WEEKDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
  const firstDay = new Date(viewY, viewM, 1).getDay();
  const selY = parts[2] ? +parts[2] : null;
  const selM = parts[0] ? +parts[0] - 1 : null;
  const selD = parts[1] ? +parts[1] : null;
  const today = new Date();

  const prev = () => {
    if (mode === "day") { if (viewM === 0) { setViewY(viewY - 1); setViewM(11); } else setViewM(viewM - 1); }
    else if (mode === "month") setViewY(viewY - 1);
    else setYearPage(yearPage - 12);
  };
  const next = () => {
    if (mode === "day") { if (viewM === 11) { setViewY(viewY + 1); setViewM(0); } else setViewM(viewM + 1); }
    else if (mode === "month") setViewY(viewY + 1);
    else setYearPage(yearPage + 12);
  };
  const pick = (d: number) => {
    const mm = String(viewM + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    onChange(`${mm}/${dd}/${viewY}`);
    setOpen(false);
    setMode("day");
  };

  const headerLabel = mode === "day"
    ? `${MONTHS[viewM]} ${viewY}`
    : mode === "month"
    ? String(viewY)
    : `${yearPage} – ${yearPage + 11}`;
  const onHeaderClick = () => {
    if (mode === "day") setMode("month");
    else if (mode === "month") { setYearPage(Math.floor(viewY / 12) * 12); setMode("year"); }
    else setMode("day");
  };

  const cellStyle = (isSel: boolean, isCurrent: boolean): React.CSSProperties => ({
    height: 30,
    color: isSel ? "#fff" : (isCurrent ? "#A855F7" : c.text),
    background: isSel ? btnGrad : "transparent",
    fontWeight: (isSel || isCurrent) ? 700 : 500,
    border: isCurrent && !isSel ? "1px solid rgba(168,85,247,0.45)" : "1px solid transparent",
  });

  return (
    <div ref={wrapRef} className="relative">
      <input value={value} readOnly style={{ ...inputStyle, cursor: "pointer" }} onClick={() => setOpen(o => !o)} />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer" style={{ color: c.muted }} onClick={() => setOpen(o => !o)} />
      {open && (
        <div className="absolute z-50 mt-2 rounded-2xl p-4"
          style={{ ...font, background: c.cardBg, border: `1px solid ${c.border}`, width: 280, boxShadow: "0 10px 30px rgba(0,0,0,0.12)", left: 0 }}>
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prev} className="p-1.5 rounded-lg transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <ChevronLeft className="w-4 h-4" style={{ color: c.text }} />
            </button>
            <button type="button" onClick={onHeaderClick}
              className="text-[13px] font-semibold px-2 py-1 rounded-lg transition-colors"
              style={{ color: c.text }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              {headerLabel}
            </button>
            <button type="button" onClick={next} className="p-1.5 rounded-lg transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <ChevronRight className="w-4 h-4" style={{ color: c.text }} />
            </button>
          </div>
          {mode === "day" && (
            <>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((w, i) => (
                  <div key={i} className="text-center text-[10px] font-semibold py-1" style={{ color: c.muted }}>{w}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const isSel = selY === viewY && selM === viewM && selD === d;
                  const isToday = !isSel && today.getFullYear() === viewY && today.getMonth() === viewM && today.getDate() === d;
                  return (
                    <button key={d} type="button" onClick={() => pick(d)}
                      className="text-[12px] rounded-lg transition-all"
                      style={cellStyle(isSel, isToday)}
                      onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = c.hoverBg; }}
                      onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                      {d}
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {mode === "month" && (
            <div className="grid grid-cols-3 gap-2">
              {MONTHS_SHORT.map((m, i) => {
                const isSel = selY === viewY && selM === i;
                const isCurrent = !isSel && today.getFullYear() === viewY && today.getMonth() === i;
                return (
                  <button key={m} type="button" onClick={() => { setViewM(i); setMode("day"); }}
                    className="text-[12px] rounded-lg transition-all"
                    style={{ ...cellStyle(isSel, isCurrent), height: 40 }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = c.hoverBg; }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                    {m}
                  </button>
                );
              })}
            </div>
          )}
          {mode === "year" && (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const y = yearPage + i;
                const isSel = selY === y;
                const isCurrent = !isSel && today.getFullYear() === y;
                return (
                  <button key={y} type="button" onClick={() => { setViewY(y); setMode("month"); }}
                    className="text-[12px] rounded-lg transition-all"
                    style={{ ...cellStyle(isSel, isCurrent), height: 40 }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = c.hoverBg; }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                    {y}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Agency {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  totalUsers: number;
  status: "Appointed" | "Unappointed";
  isStarred: boolean;
}

type FilterStatus = "All" | "Starred" | "Appointed" | "Unappointed";
type SortKey = "name" | "code" | "location" | "totalUsers" | "status" | null;
type SortDir = "asc" | "desc";
type TabKey = "agencies" | "users";

/* ─── Mock Data ─────────────────────────────────────────────────────────── */
const mockAgencies: Agency[] = [
  { id: "1", name: "Acme Insurance Agency", code: "ACME01", city: "Des Moines", state: "IA", totalUsers: 7,  status: "Appointed",   isStarred: true  },
  { id: "2", name: "Summit Solutions",      code: "SUMIT22", city: "Chicago",    state: "IL", totalUsers: 3,  status: "Appointed",   isStarred: true  },
  { id: "3", name: "Pioneer Brokers",       code: "PION33",  city: "Des Moines", state: "IA", totalUsers: 1,  status: "Unappointed", isStarred: true  },
  { id: "4", name: "Lakefront Coverage",    code: "LAKE04",  city: "Denver",     state: "CO", totalUsers: 10, status: "Appointed",   isStarred: false },
  { id: "5", name: "Ridgeline Insurance",   code: "RIDG05",  city: "Des Moines", state: "IA", totalUsers: 23, status: "Appointed",   isStarred: false },
  { id: "6", name: "Harbor Risk Group",     code: "HARB06",  city: "New York",   state: "NY", totalUsers: 5,  status: "Unappointed", isStarred: false },
  { id: "7", name: "Midland Shield Co.",    code: "MIDL07",  city: "Des Moines", state: "IA", totalUsers: 3,  status: "Unappointed", isStarred: false },
  { id: "8", name: "Coastal Guard LLC",     code: "COAS08",  city: "New York",   state: "NY", totalUsers: 6,  status: "Unappointed", isStarred: false },
  { id: "9", name: "Apex Risk Partners",    code: "APEX09",  city: "Austin",     state: "TX", totalUsers: 12, status: "Appointed",   isStarred: false },
  { id: "10", name: "Keystone Group",       code: "KEYS10",  city: "Philadelphia", state: "PA", totalUsers: 8, status: "Appointed",  isStarred: false },
  { id: "11", name: "BlueSky Brokers",      code: "BLUE11",  city: "Seattle",    state: "WA", totalUsers: 4,  status: "Unappointed", isStarred: false },
  { id: "12", name: "Ironclad Insurance",   code: "IRON12",  city: "Dallas",     state: "TX", totalUsers: 15, status: "Appointed",   isStarred: false },
];

/* ─── Extended mock detail data ─────────────────────────────────────────── */
interface AgencyDetail extends Agency {
  website: string;
  street: string;
  zip: string;
  apptDate: string;
  contact: string;
  contactPhone: string;
  contactEmail: string;
  bizType: string;
  taxId: string;
  phone: string;
  tollFree: string;
  licenseNo: string;
  licenseExp: string;
  eoPolicyNo: string;
  eoExp: string;
  agencyBill: boolean;
  directBill: boolean;
  premiumFin: boolean;
  agencyType: "Retail" | "Wholesale";
  affiliations: string[];
  workersComp: string[];
  badge?: string;
}

const mockDetails: Record<string, Partial<AgencyDetail>> = {
  "1": { website: "www.acmeins.com",      street: "1111 6th Ave",   zip: "50314", apptDate: "03/24/2026", contact: "Jason Smith",      contactPhone: "650-768-0850", contactEmail: "jason@acmeins.com",     bizType: "LLC",            taxId: "121222334455", phone: "515-222-1000", tollFree: "",             licenseNo: "LC-88210", licenseExp: "03/24/2026", eoPolicyNo: "EO-4421", eoExp: "03/24/2026", agencyBill: true,  directBill: true,  premiumFin: true,  agencyType: "Retail",     affiliations: ["AAA/ACG (AC364)", "Acrisure"], workersComp: ["AIG", "AmTrust"], badge: "Strategic Partner" },
  "2": { website: "www.summitsol.com",    street: "200 N Michigan",  zip: "60601", apptDate: "01/15/2025", contact: "Maria Chen",       contactPhone: "312-555-0190", contactEmail: "m.chen@summitsol.com",  bizType: "Corporation",    taxId: "930011223",   phone: "312-555-0100", tollFree: "800-555-0100", licenseNo: "LC-22110", licenseExp: "01/15/2027", eoPolicyNo: "EO-1120", eoExp: "01/15/2027", agencyBill: true,  directBill: false, premiumFin: true,  agencyType: "Wholesale",  affiliations: ["Acrisure", "BTIS"], workersComp: ["CNA"], badge: "" },
  "3": { website: "www.pioneerbrok.com",  street: "333 Walnut St",   zip: "50309", apptDate: "06/01/2024", contact: "Tom Lawson",       contactPhone: "515-333-4400", contactEmail: "tom@pioneerbrok.com",   bizType: "Sole Proprietor",taxId: "456789012",   phone: "515-333-4400", tollFree: "",             licenseNo: "LC-77001", licenseExp: "06/01/2026", eoPolicyNo: "EO-7701", eoExp: "06/01/2026", agencyBill: false, directBill: true,  premiumFin: false, agencyType: "Retail",     affiliations: ["Farmers", "ISU"], workersComp: ["GUARD", "Zenith"], badge: "" },
};

function getDetail(a: Agency): AgencyDetail {
  const d = mockDetails[a.id] ?? {};
  return {
    ...a,
    website:       d.website       ?? "www.example.com",
    street:        d.street        ?? "100 Main St",
    zip:           d.zip           ?? "00000",
    apptDate:      d.apptDate      ?? "03/24/2026",
    contact:       d.contact       ?? "Agency Contact",
    contactPhone:  d.contactPhone  ?? "000-000-0000",
    contactEmail:  d.contactEmail  ?? "contact@example.com",
    bizType:       d.bizType       ?? "-Business Type",
    taxId:         d.taxId         ?? "",
    phone:         d.phone         ?? "000-000-0000",
    tollFree:      d.tollFree      ?? "",
    licenseNo:     d.licenseNo     ?? "",
    licenseExp:    d.licenseExp    ?? "03/24/2026",
    eoPolicyNo:    d.eoPolicyNo    ?? "",
    eoExp:         d.eoExp         ?? "03/24/2026",
    agencyBill:    d.agencyBill    ?? true,
    directBill:    d.directBill    ?? true,
    premiumFin:    d.premiumFin    ?? true,
    agencyType:    d.agencyType    ?? "Retail",
    affiliations:  d.affiliations  ?? ["AAA/ACG (AC364)"],
    workersComp:   d.workersComp   ?? ["AIG"],
    badge:         d.badge         ?? "",
  };
}

/* ─── Agency Quotes & Policies ──────────────────────────────────────────── */
interface AgencyQuote {
  id: string; quoteId: string; applicant: string; dba?: string;
  createdDate: string; effectiveDate?: string; lob: string;
  status: string; producer: string; agencyId: string; premium: number;
}
interface AgencyPolicy {
  id: string; policyNumber: string; applicant: string; dba?: string;
  createdDate: string; effectiveDate: string; lob: string;
  status: string; producer: string; agencyId: string; premium: number;
}

const mockAgencyQuotes: AgencyQuote[] = [
  { id:"aq1",  quoteId:"QMWC-A001-2026", applicant:"Riverside Auto LLC",   dba:"Riverside",    createdDate:"2026-01-10", effectiveDate:"2026-02-01", lob:"Commercial Auto",  status:"Sold/Issued", producer:"Jane Smith",    agencyId:"1", premium:14200 },
  { id:"aq2",  quoteId:"QMWC-A002-2026", applicant:"Summit Builders Inc",  dba:"SummitBuild",  createdDate:"2026-02-05", effectiveDate:"2026-03-01", lob:"General Liability", status:"Pending",     producer:"Sarah Johnson", agencyId:"1", premium:8500  },
  { id:"aq3",  quoteId:"QMWC-A003-2026", applicant:"NorthStar Logistics",  dba:"NSL",          createdDate:"2026-02-18", effectiveDate:"2026-04-01", lob:"Worker's Comp",    status:"Approved",    producer:"Jane Smith",    agencyId:"1", premium:22000 },
  { id:"aq4",  quoteId:"QMWC-A004-2026", applicant:"Prairie Home Rentals", dba:"PHR",          createdDate:"2026-03-01", effectiveDate:"2026-04-15", lob:"Property",          status:"Incomplete",  producer:"Mike Chen",     agencyId:"1", premium:6800  },
  { id:"aq5",  quoteId:"QMWC-A005-2026", applicant:"Keystone Transport",                       createdDate:"2026-03-15", effectiveDate:"2026-05-01", lob:"Commercial Auto",  status:"Declined",    producer:"Sarah Johnson", agencyId:"1", premium:9300  },
  { id:"aq6",  quoteId:"QMWC-B001-2026", applicant:"Great Lakes Freight",  dba:"GLF",          createdDate:"2026-01-20", effectiveDate:"2026-02-15", lob:"Worker's Comp",    status:"Sold/Issued", producer:"Maria Chen",    agencyId:"2", premium:31500 },
  { id:"aq7",  quoteId:"QMWC-B002-2026", applicant:"Lakeview Contractors",                     createdDate:"2026-03-08", effectiveDate:"2026-04-01", lob:"General Liability", status:"Pending",     producer:"Tom Harris",    agencyId:"2", premium:7200  },
];
const mockAgencyPolicies: AgencyPolicy[] = [
  { id:"ap1", policyNumber:"POL-A-10041", applicant:"Riverside Auto LLC",  dba:"Riverside",   createdDate:"2026-02-01", effectiveDate:"2026-02-01", lob:"Commercial Auto",  status:"Active",           producer:"Jane Smith",    agencyId:"1", premium:14200 },
  { id:"ap2", policyNumber:"POL-A-10042", applicant:"NorthStar Logistics", dba:"NSL",         createdDate:"2026-04-01", effectiveDate:"2026-04-01", lob:"Worker's Comp",    status:"Active",           producer:"Jane Smith",    agencyId:"1", premium:22000 },
  { id:"ap3", policyNumber:"POL-A-10039", applicant:"Clearfield Bakery",   dba:"CB Sweets",   createdDate:"2025-06-01", effectiveDate:"2025-06-01", lob:"General Liability", status:"Upcoming Renewal", producer:"Sarah Johnson", agencyId:"1", premium:5500  },
  { id:"ap4", policyNumber:"POL-A-10022", applicant:"Delta Roofing Co",                       createdDate:"2025-01-15", effectiveDate:"2025-01-15", lob:"Property",          status:"Expired",          producer:"Mike Chen",     agencyId:"1", premium:8100  },
  { id:"ap5", policyNumber:"POL-B-20011", applicant:"Great Lakes Freight", dba:"GLF",         createdDate:"2026-02-15", effectiveDate:"2026-02-15", lob:"Worker's Comp",    status:"Active",           producer:"Maria Chen",    agencyId:"2", premium:31500 },
];

/* ─── Agency Notes ───────────────────────────────────────────────────────── */
interface AgencyNote {
  id: string; title: string; content: string; author: string;
  timestamp: string; agencyId: string;
  type: "General" | "Policy" | "Follow-up" | "Meeting" | "Task";
  visibility?: "Private" | "Shared" | "Public";
}
const mockAgencyNotes: AgencyNote[] = [
  { id:"an1", title:"Initial Appointment Call",   content:"Spoke with Jason Smith about getting appointed. They handle primarily commercial lines in the Midwest. Sent onboarding packet.",       author:"Sarah Johnson", timestamp:"2026-03-01T10:00:00", agencyId:"1", type:"Meeting",   visibility:"Shared"  },
  { id:"an2", title:"E&O Verification",           content:"Confirmed E&O policy is current. Expires 03/24/2026. Requested updated cert for file.",                                              author:"Jane Smith",    timestamp:"2026-03-10T14:30:00", agencyId:"1", type:"Policy",    visibility:"Public"  },
  { id:"an3", title:"Follow up on license renewal", content:"License renewal reminder sent. LC-88210 expires soon. Jason confirmed they are in process.",                                      author:"Sarah Johnson", timestamp:"2026-03-20T09:00:00", agencyId:"1", type:"Follow-up", visibility:"Private" },
  { id:"an4", title:"Portal access set up",       content:"Created login credentials for the agency portal. Sent welcome email with training links.",                                          author:"Mike Chen",     timestamp:"2026-04-01T11:15:00", agencyId:"1", type:"General",   visibility:"Shared"  },
  { id:"an5", title:"Q1 Performance Review",      content:"Agency submitted 12 quotes in Q1. Conversion rate 41%. Strong performance in Workers Comp and GL lines. Recommended for Pro tier.", author:"Jane Smith",    timestamp:"2026-04-10T16:00:00", agencyId:"1", type:"Meeting",   visibility:"Public"  },
];

/* ─── Quote / Policy filter constants ───────────────────────────────────── */
const ALL_LOBS = [
  "All LOBs","General Liability","Worker's Comp","Business Owners","Professional Liability",
  "Excess","Bonds","Commercial Auto","Builders Risk","Cannabis","Cyber","Home Based Business",
  "Inland Marine","Lessor's Risk","Non-Profit","Pollution Liability","Special Events",
  "Truckers GL","Vacant Risks","Boats/Marine","Contractors GL",
];
const QUOTE_STATUSES  = ["All Statuses","Sold/Issued","Pending","Approved","Incomplete","Declined"];
const POLICY_STATUSES = ["All Statuses","Active","Expired","Upcoming Renewal","Cancelled"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortItems<T>(items: T[], key: string | null, dir: "asc" | "desc"): T[] {
  if (!key) return items;
  return [...items].sort((a, b) => {
    const va = String((a as any)[key] ?? "");
    const vb = String((b as any)[key] ?? "");
    return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });
}

/* ─── Agency Users ───────────────────────────────────────────────────────── */
interface AgencyUser {
  id: string; name: string; isAdmin: boolean;
  jobTitle: string; email: string; phone: string; ext: string; agencyId: string;
}
const mockAgencyUsers: AgencyUser[] = [
  { id:"u1", name:"Jason Smith",    isAdmin:true,  jobTitle:"Principal",      email:"jason@acmeins.com",       phone:"(888) 888-8888", ext:"125", agencyId:"1" },
  { id:"u3", name:"Tom Garfield",   isAdmin:true,  jobTitle:"Producer",        email:"tom.g@acmeins.com",       phone:"(888) 888-8888", ext:"125", agencyId:"1" },
  { id:"u4", name:"Amy Chen",       isAdmin:true,  jobTitle:"Producer",        email:"amy.chen@acmeins.com",    phone:"(888) 888-8888", ext:"125", agencyId:"1" },
  { id:"u5", name:"Brian Nguyen",   isAdmin:true,  jobTitle:"Producer",        email:"b.nguyen@acmeins.com",    phone:"(888) 888-8888", ext:"125", agencyId:"1" },
  { id:"u6", name:"Sandra Park",    isAdmin:true,  jobTitle:"Producer",        email:"s.park@acmeins.com",      phone:"(888) 888-8888", ext:"125", agencyId:"1" },
  { id:"u8", name:"Maria Chen",     isAdmin:true,  jobTitle:"Principal",       email:"m.chen@summitsol.com",    phone:"(312) 555-0190", ext:"",    agencyId:"2" },
  { id:"u9", name:"Tom Harris",     isAdmin:false, jobTitle:"Producer",        email:"tom@summitsol.com",       phone:"(312) 555-0191", ext:"201", agencyId:"2" },
];

/* ─── Agency Detail View ─────────────────────────────────────────────────── */
type DetailTab = "overview" | "quotes" | "policies" | "users" | "notes";

function AgencyDetailView({ agency, isDark, onBack, c, btnGrad, stars, onToggleStar }: {
  agency: AgencyDetail;
  isDark: boolean;
  onBack: () => void;
  c: Record<string, string>;
  btnGrad: string;
  stars: Set<string>;
  onToggleStar: (id: string) => void;
}) {
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [isEditing, setIsEditing]           = useState(false);
  const [editExpanded, setEditExpanded]     = useState(false);
  const [contactCardEditing, setContactCardEditing] = useState(false);
  const currentUserIsAdmin = true; // toggle to test — non-admin users see permission popup
  const [contactRequestOpen, setContactRequestOpen] = useState(false);
  const [requestedName, setRequestedName] = useState("");
  const [requestedPhone, setRequestedPhone] = useState("");
  const [requestedEmail, setRequestedEmail] = useState("");
  const [contactRequestSent, setContactRequestSent] = useState(false);
  const [eContactPhone, setEContactPhone]   = useState(agency.contactPhone);
  const font = { fontFamily: FONT };
  const isStarred = stars.has(agency.id);

  /* ── edit form states (pre-filled from agency) ── */
  const [eName,       setEName]       = useState(agency.name);
  const [eCode,       setECode]       = useState(agency.code);
  const [eType,       setEType]       = useState<"Retail"|"Wholesale">(agency.agencyType);
  const [eCountry,    setECountry]    = useState("United States of America");
  const [eStreet,     setEStreet]     = useState(agency.street);
  const [eCity,       setECity]       = useState(agency.city);
  const [eState,      setEState]      = useState(agency.state);
  const [eZip,        setEZip]        = useState(agency.zip);
  const [eSameAddr,   setESameAddr]   = useState(true);
  const [eMCountry,   setEMCountry]   = useState("United States of America");
  const [eMStreet,    setEMStreet]    = useState("");
  const [eMCity,      setEMCity]      = useState("");
  const [eMState,     setEMState]     = useState("");
  const [eMZip,       setEMZip]       = useState("");
  const [eStatus,     setEStatus]     = useState<string>(agency.status);
  const [eApptDate,   setEApptDate]   = useState(agency.apptDate);
  const [eContact,    setEContact]    = useState(agency.contact);
  const [eEmail,      setEEmail]      = useState(agency.contactEmail);
  const [eBizType,    setEBizType]    = useState(agency.bizType);
  const [eTaxId,      setETaxId]      = useState(agency.taxId);
  const [eWebsite,    setEWebsite]    = useState(agency.website);
  const [ePhone,      setEPhone]      = useState(agency.phone);
  const [eTollFree,   setETollFree]   = useState(agency.tollFree);
  const [eLicNo,      setELicNo]      = useState(agency.licenseNo);
  const [eLicExp,     setELicExp]     = useState(agency.licenseExp);
  const [eEoNo,       setEEoNo]       = useState(agency.eoPolicyNo);
  const [eEoExp,      setEEoExp]      = useState(agency.eoExp);
  const [eAgencyBill, setEAgencyBill] = useState(agency.agencyBill);
  const [eDirectBill, setEDirectBill] = useState(agency.directBill);
  const [ePremFin,    setEPremFin]    = useState(agency.premiumFin);
  const [eAffil,      setEAffil]      = useState<Set<string>>(new Set(agency.affiliations));
  const [eWC,         setEWC]         = useState<Set<string>>(new Set(agency.workersComp));

  /* ── extra colours ── */
  const teal    = "#73C9B7";
  const mutedBg = isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB";
  const sub     = isDark ? "#6B7280" : "#9CA3AF";

  /* ── quotes / policies state ── */
  const [detailSearch,    setDetailSearch]    = useState("");
  const [lobFilter,       setLobFilter]       = useState("All LOBs");
  const [statusFilter,    setStatusFilter]    = useState("All Statuses");
  const [applicantFilter, setApplicantFilter] = useState<Set<string>>(new Set());
  const [producerFilter,  setProducerFilter]  = useState<Set<string>>(new Set());
  const [lobOpen,         setLobOpen]         = useState(false);
  const [statusOpen,      setStatusOpen]      = useState(false);
  const [applicantOpen,   setApplicantOpen]   = useState(false);
  const [producerOpen,    setProducerOpen]    = useState(false);
  const [applicantSearch, setApplicantSearch] = useState("");
  const [producerSearch,  setProducerSearch]  = useState("");
  const [qpSortKey,       setQpSortKey]       = useState<string|null>(null);
  const [qpSortDir,       setQpSortDir]       = useState<"asc"|"desc">("asc");

  const closeAllDropdowns = () => { setLobOpen(false); setStatusOpen(false); setApplicantOpen(false); setProducerOpen(false); };

  const rawQuotes   = mockAgencyQuotes.filter(q => q.agencyId === agency.id);
  const rawPolicies = mockAgencyPolicies.filter(p => p.agencyId === agency.id);
  const uniqueQApplicants = [...new Set(rawQuotes.map(q => q.applicant))];
  const uniqueQProducers  = [...new Set(rawQuotes.map(q => q.producer))];
  const uniquePApplicants = [...new Set(rawPolicies.map(p => p.applicant))];
  const uniquePProducers  = [...new Set(rawPolicies.map(p => p.producer))];

  const agencyQuotes = sortItems(
    rawQuotes
      .filter(q => !detailSearch || q.applicant.toLowerCase().includes(detailSearch.toLowerCase()) || q.quoteId.toLowerCase().includes(detailSearch.toLowerCase()))
      .filter(q => lobFilter === "All LOBs" || q.lob === lobFilter)
      .filter(q => statusFilter === "All Statuses" || q.status === statusFilter)
      .filter(q => applicantFilter.size === 0 || applicantFilter.has(q.applicant))
      .filter(q => producerFilter.size === 0 || producerFilter.has(q.producer)),
    qpSortKey, qpSortDir
  );
  const agencyPolicies = sortItems(
    rawPolicies
      .filter(p => !detailSearch || p.applicant.toLowerCase().includes(detailSearch.toLowerCase()) || p.policyNumber.toLowerCase().includes(detailSearch.toLowerCase()))
      .filter(p => lobFilter === "All LOBs" || p.lob === lobFilter)
      .filter(p => statusFilter === "All Statuses" || p.status === statusFilter)
      .filter(p => applicantFilter.size === 0 || applicantFilter.has(p.applicant))
      .filter(p => producerFilter.size === 0 || producerFilter.has(p.producer)),
    qpSortKey, qpSortDir
  );

  /* ── notes states ── */
  const NOTE_TYPES: AgencyNote["type"][] = ["General","Policy","Follow-up","Meeting","Task"];
  const typeColor: Record<string, { bg: string; text: string }> = {
    "General":   { bg: isDark ? "rgba(156,163,175,0.15)" : "#F3F4F6",                text: isDark ? "#9CA3AF" : "#6B7280" },
    "Policy":    { bg: isDark ? "rgba(166,20,195,0.18)"  : "rgba(166,20,195,0.10)",  text: isDark ? "#C87BE0" : "#A614C3" },
    "Follow-up": { bg: isDark ? "rgba(255,164,124,0.18)" : "rgba(255,164,124,0.20)", text: isDark ? "#FFA47C" : "#D96B3E" },
    "Meeting":   { bg: isDark ? "rgba(115,201,183,0.18)" : "rgba(115,201,183,0.20)", text: "#73C9B7" },
    "Task":      { bg: isDark ? "rgba(239,68,68,0.15)"   : "rgba(239,68,68,0.10)",   text: "#EF4444" },
  };
  const [agNotes,        setAgNotes]        = useState<AgencyNote[]>(mockAgencyNotes.filter(n => n.agencyId === agency.id));
  const [newNote,        setNewNote]        = useState("");
  const [newNoteTitle,   setNewNoteTitle]   = useState("");
  const [newNoteType,    setNewNoteType]    = useState<AgencyNote["type"]>("General");
  const [noteView,       setNoteView]       = useState<"list"|"board"|"table">("list");
  const [noteSearch,     setNoteSearch]     = useState("");
  const [noteSearchOpen, setNoteSearchOpen] = useState(false);
  const [noteSortDir,    setNoteSortDir]    = useState<"asc"|"desc">("desc");
  const [noteFilterType, setNoteFilterType] = useState<"All"|AgencyNote["type"]>("All");
  const [noteFilterOpen, setNoteFilterOpen] = useState(false);
  const [noteSortOpen,   setNoteSortOpen]   = useState(false);
  const [noteNewOpen,    setNoteNewOpen]    = useState(false);
  const [noteAddOpen,    setNoteAddOpen]    = useState(false);
  const [selectedNote,   setSelectedNote]   = useState<AgencyNote|null>(null);
  const [editNoteTitle,  setEditNoteTitle]  = useState("");
  const [editNoteContent,setEditNoteContent]= useState("");
  const [editNoteType,   setEditNoteType]   = useState<AgencyNote["type"]>("General");
  const [editNoteVisibility, setEditNoteVisibility] = useState<NonNullable<AgencyNote["visibility"]>>("Shared");
  const [visibilityFilter, setVisibilityFilter] = useState<"All"|"Private"|"Shared"|"Public">("All");
  const [noteExpanded,   setNoteExpanded]   = useState(false);
  const [noteLocked,     setNoteLocked]     = useState(false);
  const [lockedBy,       setLockedBy]       = useState("Sarah Johnson");
  const [archivedIds,    setArchivedIds]    = useState<Set<string>>(new Set());
  const [trashedIds,     setTrashedIds]     = useState<Set<string>>(new Set());
  const [pinnedIds,      setPinnedIds]      = useState<Set<string>>(new Set());
  const [showArchived,   setShowArchived]   = useState(false);
  const [showTrashed,    setShowTrashed]    = useState(false);
  const [noteMoreOpen,   setNoteMoreOpen]   = useState(false);
  const [noteShareOpen,  setNoteShareOpen]  = useState(false);
  const [inviteEmail,    setInviteEmail]    = useState("");
  const [shareAccess,    setShareAccess]    = useState<Record<string,string>>({ "Jane Smith": "edit", "Mike Chen": "view", "Sarah Johnson": "view", "Tom Harris": "view" });
  const [noteOwner,      setNoteOwner]      = useState("Sarah Johnson");
  const [shareMenuFor,   setShareMenuFor]   = useState<string|null>(null);
  const [removedShares,  setRemovedShares]  = useState<Set<string>>(new Set());
  const [removeConfirm,  setRemoveConfirm]  = useState<string|null>(null);
  const [pendingRequests, setPendingRequests] = useState<{name:string; email:string; access:"view"|"edit"}[]>([
    { name: "Lokesh", email: "lokesh.gorijavolu@amyntagroup.com", access: "edit" },
  ]);
  const [extraMembers,   setExtraMembers]   = useState<{name:string; email:string}[]>([]);
  const [copyToast,      setCopyToast]      = useState("");
  const [isSelectMode,   setIsSelectMode]   = useState(false);
  const [selectedNoteIds,setSelectedNoteIds]= useState<Set<string>>(new Set());
  const [deleteNoteId,   setDeleteNoteId]   = useState<string|null>(null);
  const CURRENT_USER = "Sarah Johnson";

  /* ── users tab state ── */
  const [importUsersOpen, setImportUsersOpen] = useState(false);
  const [addUserOpen,     setAddUserOpen]     = useState(false);
  const [userSearch,      setUserSearch]      = useState("");
  const [jobTitleFilter,  setJobTitleFilter]  = useState<Set<string>>(new Set());
  const [jobTitleOpen,    setJobTitleOpen]    = useState(false);
  const [jobTitleSearch,  setJobTitleSearch]  = useState("");
  const [userMenuId,      setUserMenuId]      = useState<string|null>(null);
  /* add-user form fields */
  const [auFirstName,  setAuFirstName]  = useState("");
  const [auLastName,   setAuLastName]   = useState("");
  const [auIsAdmin,    setAuIsAdmin]    = useState(false);
  const [auAdminLevel, setAuAdminLevel] = useState("");
  const [auAdminLevelOpen, setAuAdminLevelOpen] = useState(false);
  const [auJobTitle,   setAuJobTitle]   = useState("");
  const [auJobOpen,    setAuJobOpen]    = useState(false);
  const [auStatus,     setAuStatus]     = useState("");
  const [auStatusOpen, setAuStatusOpen] = useState(false);
  const [auPhone,      setAuPhone]      = useState("");
  const [auExt,        setAuExt]        = useState("");
  const [auMobile,     setAuMobile]     = useState("");
  const [auSms,        setAuSms]        = useState(false);
  const [auEmail,      setAuEmail]      = useState("");
  const [auAddress,    setAuAddress]    = useState("");
  const [auCity,       setAuCity]       = useState("");
  const [auState,      setAuState]      = useState("");
  const [auStateOpen,  setAuStateOpen]  = useState(false);
  const [auZip,        setAuZip]        = useState("");
  const JOB_TITLES   = ["Principal","Producer","CSR","Accounting","Account Manager"];
  const USER_STATUSES = ["Active","Inactive","Pending"];
  const US_STATES    = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
  const agencyUsers = mockAgencyUsers
    .filter(u => u.agencyId === agency.id)
    .filter(u => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
    .filter(u => jobTitleFilter.size === 0 || jobTitleFilter.has(u.jobTitle))
    .sort((a, b) => {
      if (a.jobTitle === "Principal" && b.jobTitle !== "Principal") return -1;
      if (b.jobTitle === "Principal" && a.jobTitle !== "Principal") return 1;
      return 0;
    });

  const fmtDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) + " " +
      d.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
  };
  const openNote = (n: AgencyNote) => { setSelectedNote(n); setEditNoteTitle(n.title); setEditNoteContent(n.content); setEditNoteType(n.type); setEditNoteVisibility(n.visibility || "Shared"); };
  const saveNote = () => { if (!selectedNote) return; setAgNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, title: editNoteTitle, content: editNoteContent, type: editNoteType, visibility: editNoteVisibility } : n)); setSelectedNote(s => s ? { ...s, title: editNoteTitle, content: editNoteContent, type: editNoteType, visibility: editNoteVisibility } : s); };

  const TEAMMATES = [
    { name: CURRENT_USER, email: "sarah.johnson@btis.com" },
    { name: "Mike Chen",  email: "mike.chen@btis.com" },
    { name: "Jane Smith", email: "jane.smith@btis.com" },
    { name: "Tom Harris", email: "tom.harris@btis.com" },
    { name: "Amy Lee",    email: "amy.lee@btis.com" },
  ];
  const initials = (n: string) => { const parts = n.trim().split(/\s+/); return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : n.slice(0, 2).toUpperCase(); };
  const avatarStyle: React.CSSProperties = { background: isDark ? "rgba(168,85,247,0.18)" : "rgba(168,85,247,0.12)" };
  const avatarTextStyle: React.CSSProperties = { backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };
  const renderSharePanel = () => (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-6"
      onClick={() => setNoteShareOpen(false)}
      style={{ background: "rgba(0,0,0,0.45)" }}>
      <div id="note-share-panel" className="relative w-[480px] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{ background: c.cardBg, border: `1px solid ${c.border}`, maxHeight: "min(640px, 85vh)" }}>
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
        <span className="text-[13px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>Share note</span>
        <div className="flex items-center gap-3">
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); setCopyToast("Link copied!"); setTimeout(()=>setCopyToast(""),2000); }}
            className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
            style={{ fontFamily: FONT, color: "#A855F7" }}>
            <LinkIcon className="w-3 h-3" />Copy link
          </button>
          <button onClick={() => setNoteShareOpen(false)} className="p-1 rounded-md transition-colors" style={{ color: c.muted }}
            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Pending requests */}
      {pendingRequests.length > 0 && (
        <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
          {pendingRequests.map(req => (
            <div key={req.email} className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={avatarStyle}><span style={avatarTextStyle}>{initials(req.name)}</span></div>
                <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full" style={{ background: "#EF4444", border: `2px solid ${c.cardBg}` }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}><strong>{req.name}</strong> wants to {req.access}</p>
                <p className="text-[11px] truncate" style={{ fontFamily: FONT, color: c.muted }}>{req.email}</p>
              </div>
              <button onClick={() => { setPendingRequests(prev => prev.filter(p => p.email !== req.email)); setCopyToast(`Denied ${req.name}`); setTimeout(()=>setCopyToast(""),2000); }}
                className="px-3 py-1.5 rounded-lg text-[11px] font-normal transition-colors"
                style={{ fontFamily: FONT, border: `1px solid #E5E7EB`, color: "#090D11", background: "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(192,192,192,0.10), rgba(172,172,172,0.10))" }}>Deny</button>
              <button onClick={() => {
                setExtraMembers(prev => [...prev, { name: req.name, email: req.email }]);
                setShareAccess(prev => ({ ...prev, [req.name]: req.access }));
                setPendingRequests(prev => prev.filter(p => p.email !== req.email));
                setCopyToast(`${req.name} joined the note`); setTimeout(()=>setCopyToast(""),2000);
              }}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all"
                style={{ fontFamily: FONT, background: btnGrad }}
                onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.filter = "none")}>Approve</button>
            </div>
          ))}
        </div>
      )}
      {/* Visibility selector */}
      <div className="px-4 pt-3 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: FONT, color: c.muted }}>Visibility</p>
        <div className="flex gap-1.5">
          {([["Private",Lock,"Only you"],["Shared",Users,"Specific teammates"],["Public",Globe,"Everyone in team"]] as const).map(([v,Ic,desc]) => {
            const active = editNoteVisibility === v;
            return (
            <button key={v} onClick={() => setEditNoteVisibility(v)}
              className="flex-1 flex flex-col items-start gap-1 px-3 py-2 rounded-lg text-[11px] font-medium transition-all"
              style={{ fontFamily:FONT, background:active?"rgba(168,85,247,0.10)":"transparent", color:c.text, border:`1px solid ${active?"rgba(168,85,247,0.35)":c.border}` }}>
              <span className="flex items-center gap-1.5 font-semibold">
                <Ic className="w-3 h-3" style={{ color: active ? "#A614C3" : c.text }} />
                {active
                  ? <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v}</span>
                  : <span>{v}</span>}
              </span>
              <span className="text-[10px] font-normal" style={{ color: c.muted }}>{desc}</span>
            </button>
          ); })}
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
        <input placeholder="Add email to invite" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
          className="flex-1 outline-none px-3 py-2 text-[12px] rounded-lg"
          style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB", border: `1px solid ${c.border}`, color: c.text }} />
        <button onClick={() => { if (inviteEmail.trim()) { setCopyToast(`Invited ${inviteEmail.trim()}`); setTimeout(()=>setCopyToast(""),2000); setInviteEmail(""); } }}
          disabled={!inviteEmail.trim()}
          className="px-3 py-2 rounded-lg text-[11px] font-semibold transition-all"
          style={{ fontFamily: FONT, background: inviteEmail.trim() ? btnGrad : (isDark ? "rgba(255,255,255,0.05)" : "#F3F4F6"), color: inviteEmail.trim() ? "#fff" : c.muted, cursor: inviteEmail.trim() ? "pointer" : "not-allowed" }}>
          Invite
        </button>
      </div>
      <div className="px-4 pt-3 pb-1 flex-shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ fontFamily: FONT, color: c.muted }}>Who has access</p>
      </div>
      <div className="flex-1 overflow-y-auto pb-2 min-h-0">
        {[...TEAMMATES, ...extraMembers].filter(a => !removedShares.has(a.name)).map(a => {
          const isOwner = a.name === noteOwner;
          const isYou = a.name === CURRENT_USER;
          const access = shareAccess[a.name] || "view";
          const accessLabel = isOwner ? "Owner" : access === "edit" ? "can edit" : "can view";
          return (
            <div key={a.name} className="flex items-center justify-between px-4 py-2 transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={avatarStyle}>
                  <span style={avatarTextStyle}>{initials(a.name)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium truncate" style={{ fontFamily: FONT, color: c.text }}>
                    {a.name}{isYou && <span className="ml-1 font-normal" style={{ color: c.muted }}>(You)</span>}
                  </p>
                  <p className="text-[10px] truncate" style={{ fontFamily: FONT, color: c.muted }}>{a.email}</p>
                </div>
              </div>
              {isOwner ? (
                <span className="text-[11px] font-medium flex-shrink-0" style={{ fontFamily: FONT, color: c.muted }}>Owner</span>
              ) : (
                <div className="relative flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <button onClick={e => { e.stopPropagation(); setShareMenuFor(p => p === a.name ? null : a.name); }}
                    className="flex items-center gap-1 text-[11px] font-medium pl-2 pr-1 py-1 rounded-md transition-colors"
                    style={{ fontFamily: FONT, background: "transparent", color: c.text }}
                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    {accessLabel}
                    <ChevronDown className="w-3 h-3" style={{ color: c.muted }} />
                  </button>
                  {shareMenuFor === a.name && (
                    <div className="absolute right-0 top-8 z-50 w-36 rounded-xl shadow-2xl py-1.5"
                      style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
                      onClick={e => e.stopPropagation()}>
                      <button onClick={() => { setNoteOwner(a.name); setShareAccess(prev => ({ ...prev, [noteOwner]: "edit" })); setShareMenuFor(null); }}
                        className="w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between transition-colors"
                        style={{ fontFamily: FONT, color: c.text }}
                        onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        Owner
                      </button>
                      <button onClick={() => { setShareAccess(prev => ({ ...prev, [a.name]: "edit" })); setShareMenuFor(null); }}
                        className="w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between transition-colors"
                        style={{ fontFamily: FONT, color: c.text }}
                        onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        can edit{access === "edit" && <span style={{ color: "#A855F7" }}>✓</span>}
                      </button>
                      <button onClick={() => { setShareAccess(prev => ({ ...prev, [a.name]: "view" })); setShareMenuFor(null); }}
                        className="w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between transition-colors"
                        style={{ fontFamily: FONT, color: c.text }}
                        onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        can view{access === "view" && <span style={{ color: "#A855F7" }}>✓</span>}
                      </button>
                      <div style={{ height: 1, background: c.border, margin: "4px 0" }} />
                      <button onClick={() => { setRemoveConfirm(a.name); setShareMenuFor(null); }}
                        className="w-full text-left px-3 py-1.5 text-[12px] transition-colors"
                        style={{ fontFamily: FONT, color: "#EF4444" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {removeConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={e => { e.stopPropagation(); setRemoveConfirm(null); }}>
          <div className="rounded-2xl p-6 w-[380px] shadow-2xl" style={{ background: c.cardBg }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.10)" }}>
                <X className="w-6 h-6" style={{ color: "#EF4444" }} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold mb-1" style={{ fontFamily: FONT, color: c.text }}>Remove access?</h3>
                <p className="text-[12px] leading-relaxed" style={{ fontFamily: FONT, color: c.muted }}><strong style={{ color: c.text }}>{removeConfirm}</strong> will no longer have access to this note.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRemoveConfirm(null)} className="px-4 py-2 rounded-lg text-[12px] font-medium transition-colors"
                style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>Cancel</button>
              <button onClick={() => { setRemovedShares(prev => { const s = new Set(prev); s.add(removeConfirm!); return s; }); setRemoveConfirm(null); }}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-colors"
                style={{ fontFamily: FONT, background: "#EF4444" }}>Remove</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );

  const TypeBadge = ({ type }: { type: string }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap"
      style={{ fontFamily: FONT, background: typeColor[type]?.bg, color: typeColor[type]?.text }}>{type}</span>
  );

  const visibleNotes = agNotes
    .filter(n => showTrashed ? trashedIds.has(n.id) : showArchived ? archivedIds.has(n.id) : (!trashedIds.has(n.id) && !archivedIds.has(n.id)))
    .filter(n => (n.visibility ?? "Shared") !== "Private" || n.author === CURRENT_USER)
    .filter(n => noteFilterType === "All" || n.type === noteFilterType)
    .filter(n => visibilityFilter === "All" || (n.visibility ?? "Shared") === visibilityFilter)
    .filter(n => !noteSearch || n.title.toLowerCase().includes(noteSearch.toLowerCase()) || n.content.toLowerCase().includes(noteSearch.toLowerCase()))
    .sort((a, b) => {
      const pa = pinnedIds.has(a.id) ? 1 : 0, pb = pinnedIds.has(b.id) ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return noteSortDir === "desc"
        ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

  const inputStyle: React.CSSProperties = {
    fontFamily: FONT, color: c.text, background: c.cardBg,
    border: `1px solid ${c.borderStrong}`, borderRadius: 8,
    padding: "9px 12px", fontSize: 13, outline: "none", width: "100%",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: FONT, fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 6, display: "block",
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle, appearance: "none", cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
  };

  const Radio = ({ checked, onClick }: { checked: boolean; onClick: () => void }) => (
    <button onClick={onClick} className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 transition-all"
      style={{ border: `2px solid ${checked ? "#A855F7" : c.borderStrong}`, background: "transparent" }}>
      {checked && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#A855F7" }} />}
    </button>
  );

  const Checkbox = ({ checked, onClick }: { checked: boolean; onClick: () => void }) => (
    <button onClick={onClick} className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0 transition-all"
      style={{
        border: checked ? "none" : `1.5px solid ${c.borderStrong}`,
        background: checked ? "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" : c.cardBg,
      }}>
      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </button>
  );

  const SectionDivider = ({ title }: { title: string }) => (
    <div className="mt-8 mb-4 pb-2" style={{ borderBottom: `1px solid ${c.border}` }}>
      <h3 className="text-[15px] font-bold" style={{ ...font, color: c.text }}>{title}</h3>
    </div>
  );

  const InfoCard = ({ title, icon, children }: { title: string; icon: React.ReactElement; children: React.ReactNode }) => (
    <div className="flex-1 rounded-2xl p-5 relative min-w-0" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
      <p className="text-[12px] font-semibold mb-3" style={{ ...font, color: c.muted }}>{title}</p>
      <div className="absolute top-4 right-4 p-2 rounded-lg" style={{ background: "rgba(168,85,247,0.10)" }}>{icon}</div>
      {children}
    </div>
  );

  const LabelValue = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
      <p className="text-[13px] font-semibold mb-1" style={{ ...font, color: c.text }}>{label}:</p>
      <p className="text-[13px]" style={{ ...font, color: c.muted }}>{value}</p>
    </div>
  );

  const detailTabs: [DetailTab, string, React.ReactElement][] = [
    ["overview",  "Overview",  <Building2 className="w-[15px] h-[15px]" />],
    ["quotes",    "Quotes",    <QuoteIcon className="w-[15px] h-[15px]" />],
    ["policies",  "Policies",  <Shield    className="w-[15px] h-[15px]" />],
    ["users",     "Users",     <Users     className="w-[15px] h-[15px]" />],
    ["notes",     "Notes",     <FileText  className="w-[15px] h-[15px]" />],
  ];

  /* ── helpers ── */
  const toggleSet = (set: Set<string>, val: string, setter: (s: Set<string>) => void) => {
    const s = new Set(set);
    s.has(val) ? s.delete(val) : s.add(val);
    setter(s);
  };

  const AppointedBadge = () => (
    <span className="inline-flex items-center justify-center w-fit"
      style={{ fontFamily: FONT, background: "linear-gradient(88.54deg, rgba(92,46,212,0.05) 0.1%, rgba(166,20,195,0.05) 63.88%)", borderRadius: 9999, padding: "3px 10px" }}>
      <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", fontSize: 11, fontWeight: 600, lineHeight: "16px" }}>Appointed</span>
    </span>
  );
  const UnapptBadge = () => (
    <span className="inline-flex items-center px-3 py-[3px] rounded-full text-[11px] font-semibold"
      style={{ fontFamily: FONT, color: "#73C9B7", background: "rgba(115,201,183,0.10)" }}>Unappointed</span>
  );

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: FONT }}>
      {/* Section title */}
      <div className="pb-4 mb-0 flex items-center gap-2" style={{ borderBottom: `1px solid ${c.border}`, marginLeft: -48, marginRight: -48, paddingLeft: 48, paddingRight: 48, paddingTop: 24 }}>
        <h1 className="text-[22px] font-normal" style={{ ...font, color: c.text }}>Agencies</h1>
      </div>

        {/* Back link */}
        <div className="pt-5 pb-4 flex-shrink-0">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] transition-all" style={{ ...font, color: c.muted }}
            onMouseEnter={e => (e.currentTarget.style.color = c.text)}
            onMouseLeave={e => (e.currentTarget.style.color = c.muted)}>
            <ChevronLeft className="w-3.5 h-3.5" />Back to Agencies
          </button>
        </div>

        {/* Agency hero row */}
        <div className="flex items-start justify-between mb-5 flex-shrink-0">
          <div>
            {/* Title row — star inline with h2 and badge */}
            <div className="flex items-center gap-2.5">
              <button onClick={() => onToggleStar(agency.id)} className="flex-shrink-0 transition-all"
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.18)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                <Star className="w-5 h-5" style={{ color: "#F59E0B", fill: isStarred ? "#F59E0B" : "none" }} />
              </button>
              <h2 className="text-[24px] font-bold" style={{ ...font, color: c.text }}>{agency.name}</h2>
              {agency.badge && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap"
                  style={{ background: "rgba(168,85,247,0.10)" }}>
                  <span style={{
                    backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>{agency.badge}</span>
                </span>
              )}
            </div>
            {/* Subtitle indented to sit under the title text */}
            <p className="text-[12px] mt-0.5 ml-[29px]" style={{ ...font, color: c.muted }}>Agency Code: {agency.code}</p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="text-[13px]" style={{ ...font, color: c.muted }}>{agency.website}</p>
            <p className="text-[13px]" style={{ ...font, color: c.muted }}>{agency.street}, {agency.city}, {agency.state}, {agency.zip}</p>
          </div>
        </div>

        {/* 4 info cards */}
        <div className="flex gap-4 mb-6 flex-shrink-0">
          {/* Agency Contact — editable card */}
          <div className="flex-1 rounded-2xl p-5 relative min-w-0 group transition-all cursor-pointer"
            style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
            onMouseEnter={e => { if (!contactCardEditing) { e.currentTarget.style.background = `linear-gradient(${c.cardBg},${c.cardBg}) padding-box, linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%) border-box`; e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(110,33,196,0.18)"; }}}
            onMouseLeave={e => { if (!contactCardEditing) { e.currentTarget.style.background = c.cardBg; e.currentTarget.style.border = `1px solid ${c.border}`; e.currentTarget.style.boxShadow = "none"; }}}>
            {/* Header row */}
            <div className="flex items-center mb-3">
              <p className="text-[12px] font-semibold" style={{ ...font, color: c.muted }}>Agency Contact</p>
            </div>
            {/* User icon — pinned at top-right, purple chip matching InfoCards */}
            {!contactCardEditing && (
              <div className="absolute top-4 right-4 p-2 rounded-lg" style={{ background: "rgba(168,85,247,0.10)" }}>
                <User className="w-5 h-5" style={{ color: "#A855F7" }} />
              </div>
            )}
            {/* Edit button — floats left of icon on hover only */}
            {!contactCardEditing && (
              <button onClick={() => { if (currentUserIsAdmin) { setContactCardEditing(true); } else { setRequestedName(agency.contact); setRequestedPhone(agency.contactPhone); setRequestedEmail(agency.contactEmail); setContactRequestOpen(true); } }}
                className="absolute opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 rounded-lg text-[12px] font-semibold transition-all"
                style={{ top: "16px", right: "56px", height: 36, fontFamily: FONT, color: c.text, border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#E5E7EB"}`, background: isDark ? "rgba(255,255,255,0.05)" : c.cardBg }}
                onMouseEnter={e => e.currentTarget.style.background = c.hoverBg}
                onMouseLeave={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : c.cardBg}>
                <Pencil className="w-3.5 h-3.5" />Edit
              </button>
            )}
            {/* Content */}
            <p className="text-[13px] font-semibold mb-0.5" style={{ ...font, color: c.text }}>{eContact}</p>
            <p className="text-[12px]" style={{ ...font, color: c.muted }}>{eContactPhone}</p>
            <p className="text-[12px]" style={{ ...font, color: c.muted }}>{eEmail}</p>
          </div>
          <InfoCard title="Agency Status" icon={<Building2 className="w-5 h-5" style={{ color: "#A855F7" }} />}>
            {agency.status === "Appointed" ? <AppointedBadge /> : <UnapptBadge />}
          </InfoCard>
          <InfoCard title="Appointed Date" icon={<Calendar className="w-5 h-5" style={{ color: "#A855F7" }} />}>
            <p className="text-[14px] font-semibold" style={{ ...font, color: c.text }}>{agency.apptDate}</p>
          </InfoCard>
          <InfoCard title="Affiliations" icon={<Network className="w-5 h-5" style={{ color: "#A855F7" }} />}>
            <div className="text-[12px] leading-relaxed" style={{ ...font, color: c.muted }}>
              {agency.affiliations.slice(0, 4).join(" | ")}
            </div>
          </InfoCard>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 mb-5 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
          {detailTabs.map(([key, label, icon]) => {
            const active = detailTab === key;
            const activeTextColor  = isDark ? "#fff"     : "#A614C3";
            const activeIconColor  = "#A614C3";
            const activeUnderline  = "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)";
            return (
              <button key={key} onClick={() => { setDetailTab(key); }}
                className="flex items-center gap-1.5 px-4 py-3 text-[13px] font-normal relative transition-colors"
                style={{ ...font, color: active ? activeTextColor : c.muted, letterSpacing: "0.01em" }}>
                <span style={{ color: active ? activeIconColor : undefined }}>{icon}</span>
                {label}
                {active && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: activeUnderline }} />}
              </button>
            );
          })}
        </div>

        {/* ── Overview tab ── */}
        {detailTab === "overview" && !isEditing && (
          <div className="flex-1 overflow-y-auto pb-6">
          <div className="rounded-2xl p-8 mb-8" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[17px] font-bold" style={{ ...font, color: c.text }}>Agency Information</h3>
              <button onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                style={{ ...font, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <Pencil className="w-3.5 h-3.5" />Edit
              </button>
            </div>
            <div className="grid grid-cols-3 gap-x-12 gap-y-6">
              <LabelValue label="Agency Name" value={agency.name} />
              <LabelValue label="Agency Code" value={agency.code} />
              <LabelValue label="Agency Type" value={<span style={{ color: c.text }}>{agency.agencyType}</span>} />
              <LabelValue label="Agency Address" value={`${agency.street}, ${agency.city}, ${agency.state}, ${agency.zip}`} />
              <LabelValue label="Mailing Address" value="Same as Agency Address" />
              <div />
              <div>
                <p className="text-[13px] font-semibold mb-2" style={{ ...font, color: c.text }}>Status:</p>
                {agency.status === "Appointed" ? <AppointedBadge /> : <UnapptBadge />}
              </div>
              <LabelValue label="Appt. Date" value={agency.apptDate} />
              <div />
              <LabelValue label="Agency Contact" value={agency.contact} />
              <LabelValue label="Email Address"  value={agency.contactEmail} />
              <div />
              <LabelValue label="Type of Business" value={agency.bizType} />
              <LabelValue label="Tax ID"           value={agency.taxId || "—"} />
              <LabelValue label="Website Url"      value={agency.website} />
              <LabelValue label="Phone Number"     value={agency.phone} />
              <LabelValue label="Toll Free Number" value={agency.tollFree || "—"} />
              <div />
              <LabelValue label="License Number"  value={agency.licenseNo || "—"} />
              <LabelValue label="Expiration Date" value={agency.licenseExp} />
              <div />
              <LabelValue label="E&O Policy #"    value={agency.eoPolicyNo || "—"} />
              <LabelValue label="Expiration Date" value={agency.eoExp} />
              <div />
              <div>
                <p className="text-[13px] font-semibold mb-1" style={{ ...font, color: c.text }}>Agency Bill:</p>
                <p className="text-[13px]" style={{ ...font, color: c.text }}>{agency.agencyBill ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-[13px] font-semibold mb-1" style={{ ...font, color: c.text }}>Direct Bill:</p>
                <p className="text-[13px]" style={{ ...font, color: c.text }}>{agency.directBill ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-[13px] font-semibold mb-1" style={{ ...font, color: c.text }}>Premium Finance:</p>
                <p className="text-[13px]" style={{ ...font, color: c.text }}>{agency.premiumFin ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-[13px] font-semibold mb-2" style={{ ...font, color: c.text }}>Affiliations</p>
                <div className="space-y-1">{agency.affiliations.map(a => <p key={a} className="text-[13px]" style={{ ...font, color: c.text }}>{a}</p>)}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[13px] font-semibold" style={{ ...font, color: c.text }}>Direct Appointments</p>
                  <span style={{ color: c.border }}>|</span>
                  <p className="text-[13px] font-semibold" style={{ ...font, color: "#A614C3" }}>Workers Compensation</p>
                </div>
                <div className="space-y-1">{agency.workersComp.map(w => <p key={w} className="text-[13px]" style={{ ...font, color: c.text }}>{w}</p>)}</div>
              </div>
              <div />
            </div>
          </div>
          </div>
        )}

        {/* ── Edit form + footer ── */}
        {detailTab === "overview" && isEditing && (
          <>
          {editExpanded && <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.35)" }} onClick={() => setEditExpanded(false)} />}
          <div className={editExpanded ? "fixed inset-y-0 right-0 z-50 flex flex-col shadow-2xl overflow-y-auto" : "flex-1 overflow-y-auto pb-6"}
            style={editExpanded ? { width: "70vw", background: c.cardBg, borderLeft: `1px solid ${c.border}` } : undefined}>
          <div className={editExpanded ? "p-8 mb-6" : "rounded-2xl p-8 mb-6"} style={editExpanded ? { background: c.cardBg } : { background: c.cardBg, border: `1px solid ${c.border}` }}>
            {/* Card header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[17px] font-bold" style={{ ...font, color: c.text }}>Agency Information</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditExpanded(p => !p)} title={editExpanded ? "Collapse" : "Expand"}
                  className="p-1.5 rounded-md transition-colors" style={{ color: editExpanded ? "#A855F7" : c.muted }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  {editExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => { setIsEditing(false); setEditExpanded(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                  style={{ ...font, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, color: c.text }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <Pencil className="w-3.5 h-3.5" />Cancel Edit
                </button>
              </div>
            </div>

            {/* Row 1: Name | Code | Type */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label style={labelStyle}>Agency Name:</label>
                <input value={eName} onChange={e => setEName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Agency Code:</label>
                <div className="flex gap-2">
                  <input value={eCode} onChange={e => setECode(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                  <button type="button" onClick={() => setECode(generateAgencyCode())}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all"
                    style={{ ...font, border: `1px solid #A855F7`, background: "transparent" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(168,85,247,0.08)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <RefreshCw className="w-3 h-3" style={{ color: "#7C3AED" }} />
                    <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Create Code</span>
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Agency Type:</label>
                <div className="flex" style={{ gap: 10 }}>
                  {(["Retail","Wholesale"] as const).map(t => {
                    const active = eType === t;
                    return (
                      <button key={t} onClick={() => setEType(t)}
                        className="flex items-center gap-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap justify-center transition-all"
                        style={{ ...font, width: 120, height: 40, boxSizing: "border-box",
                          border: "1px solid transparent",
                          backgroundImage: active
                            ? `linear-gradient(88.54deg, rgba(92,46,212,0.06) 0.1%, rgba(166,20,195,0.06) 63.88%), linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)`
                            : `linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(#E5E7EB, #E5E7EB)`,
                          backgroundOrigin: "padding-box, padding-box, border-box",
                          backgroundClip: "padding-box, padding-box, border-box",
                        }}>
                        <Radio checked={active} onClick={() => setEType(t)} />
                        {active
                          ? <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t}</span>
                          : <span style={{ color: "#6B7280" }}>{t}</span>
                        }
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Agency Address */}
            <div className="mb-4">
              <label style={{ ...labelStyle, marginBottom: 12 }}>Agency Address:</label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-6">
                  <select value={eCountry} onChange={e => setECountry(e.target.value)} style={selectStyle}>
                    <option>United States of America</option><option>Canada</option><option>Mexico</option>
                  </select>
                  <AddressAutocomplete
                    value={eStreet}
                    onChange={setEStreet}
                    onSelect={a => {
                      setEStreet(a.street);
                      if (a.city) setECity(a.city);
                      if (a.state) setEState(a.state);
                      if (a.zip) setEZip(a.zip);
                      if (a.country) setECountry(a.country);
                    }}
                    placeholder="Street address"
                    inputStyle={inputStyle}
                    dropdownBg={c.cardBg} dropdownText={c.text} dropdownBorder={c.border}
                  />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <input value={eCity} onChange={e => setECity(e.target.value)} placeholder="City" style={inputStyle} />
                  <select value={eState} onChange={e => setEState(e.target.value)} style={selectStyle}>
                    {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <input value={eZip} onChange={e => setEZip(e.target.value)} placeholder="ZIP" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Mailing Address */}
            <div className="mb-6">
              <label style={{ ...labelStyle, marginBottom: 8 }}>Mailing Address:</label>
              <div className="flex items-center gap-2 mb-3">
                <Checkbox checked={eSameAddr} onClick={() => setESameAddr(p => !p)} />
                <span className="text-[13px] font-semibold" style={{ ...font, color: c.text }}>Same as Agency Address</span>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-6">
                  <select value={eSameAddr ? eCountry : eMCountry} onChange={e => setEMCountry(e.target.value)}
                    style={{ ...selectStyle, opacity: eSameAddr ? 0.5 : 1 }} disabled={eSameAddr}>
                    <option>United States of America</option><option>Canada</option><option>Mexico</option>
                  </select>
                  <AddressAutocomplete
                    value={eSameAddr ? eStreet : eMStreet}
                    onChange={setEMStreet}
                    onSelect={a => {
                      setEMStreet(a.street);
                      if (a.city) setEMCity(a.city);
                      if (a.state) setEMState(a.state);
                      if (a.zip) setEMZip(a.zip);
                      if (a.country) setEMCountry(a.country);
                    }}
                    placeholder="Street address"
                    containerStyle={{ opacity: eSameAddr ? 0.5 : 1 }}
                    inputStyle={inputStyle}
                    disabled={eSameAddr}
                    dropdownBg={c.cardBg} dropdownText={c.text} dropdownBorder={c.border}
                  />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <input value={eSameAddr ? eCity : eMCity} onChange={e => setEMCity(e.target.value)}
                    placeholder="City" style={{ ...inputStyle, opacity: eSameAddr ? 0.5 : 1 }} disabled={eSameAddr} />
                  <select value={eSameAddr ? eState : eMState} onChange={e => setEMState(e.target.value)}
                    style={{ ...selectStyle, opacity: eSameAddr ? 0.5 : 1 }} disabled={eSameAddr}>
                    {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <input value={eSameAddr ? eZip : eMZip} onChange={e => setEMZip(e.target.value)}
                    placeholder="ZIP" style={{ ...inputStyle, opacity: eSameAddr ? 0.5 : 1 }} disabled={eSameAddr} />
                </div>
              </div>
            </div>

            {/* Status | Appt Date */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label style={labelStyle}>Status:</label>
                <select value={eStatus} onChange={e => setEStatus(e.target.value)} style={selectStyle}>
                  <option value="">- Select one</option>
                  <option value="Appointed">Appointed</option>
                  <option value="Unappointed">Un Appointed</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Appt. Date</label>
                <DatePicker value={eApptDate} onChange={setEApptDate} inputStyle={inputStyle} c={c} btnGrad={btnGrad} font={font} />
              </div>
              <div />
            </div>

            {/* Agency Contact | Email */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label style={labelStyle}>Agency Contact:</label>
                <input value={eContact} onChange={e => setEContact(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Address:</label>
                <input value={eEmail} onChange={e => setEEmail(e.target.value)} style={inputStyle} type="email" />
              </div>
            </div>

            {/* Business Type | Tax ID | Website */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label style={labelStyle}>Type of Business:</label>
                <select value={eBizType} onChange={e => setEBizType(e.target.value)} style={selectStyle}>
                  <option value="">-Business Type</option>
                  <option>Corporation</option>
                  <option>Joint Venture</option>
                  <option>Limited Liability Company</option>
                  <option>Limited Partnership</option>
                  <option>Partnership</option>
                  <option>Sole Proprietorship or individual</option>
                  <option>Sole Proprietorship</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tax ID:</label>
                <input value={eTaxId} onChange={e => setETaxId(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Website Url:</label>
                <input value={eWebsite} onChange={e => setEWebsite(e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Phone | Toll Free */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label style={labelStyle}>Phone Number:</label>
                <input value={ePhone} onChange={e => setEPhone(e.target.value)} placeholder="(000) 000-0000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Toll Free Number:</label>
                <input value={eTollFree} onChange={e => setETollFree(e.target.value)} placeholder="(000) 000-0000" style={inputStyle} />
              </div>
              <div />
            </div>

            {/* License */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label style={labelStyle}>License Number:</label>
                <input value={eLicNo} onChange={e => setELicNo(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Expiration Date:</label>
                <DatePicker value={eLicExp} onChange={setELicExp} inputStyle={inputStyle} c={c} btnGrad={btnGrad} font={font} />
              </div>
              <div />
            </div>

            {/* E&O */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label style={labelStyle}>E&O Policy #:</label>
                <input value={eEoNo} onChange={e => setEEoNo(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Expiration Date:</label>
                <DatePicker value={eEoExp} onChange={setEEoExp} inputStyle={inputStyle} c={c} btnGrad={btnGrad} font={font} />
              </div>
              <div />
            </div>

            {/* Agency Bill | Direct Bill | Premium Finance */}
            <div className="grid grid-cols-3 gap-6 mb-2">
              {([
                ["Agency Bill:", eAgencyBill, setEAgencyBill],
                ["Direct Bill:", eDirectBill, setEDirectBill],
                ["Premium Finance:", ePremFin, setEPremFin],
              ] as [string, boolean, (v: boolean) => void][]).map(([lbl, val, set]) => (
                <div key={lbl}>
                  <label style={labelStyle}>{lbl}</label>
                  <div className="flex gap-3">
                    {([["Yes", true], ["No", false]] as [string, boolean][]).map(([opt, bool]) => {
                      const active = val === bool;
                      return (
                        <button key={opt} onClick={() => set(bool)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all flex-1 justify-center"
                          style={{ ...font, boxSizing: "border-box",
                            border: "1.65px solid transparent",
                            backgroundImage: active
                              ? `linear-gradient(88.54deg, rgba(92,46,212,0.06) 0.1%, rgba(166,20,195,0.06) 63.88%), linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)`
                              : `linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(#E5E7EB, #E5E7EB)`,
                            backgroundOrigin: "padding-box, padding-box, border-box",
                            backgroundClip: "padding-box, padding-box, border-box",
                          }}>
                          <Radio checked={active} onClick={() => set(bool)} />
                          {active
                            ? <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{opt}</span>
                            : <span style={{ color: "#6B7280" }}>{opt}</span>
                          }
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Affiliations */}
            <SectionDivider title="Affiliations" />
            <div className="grid grid-cols-4 gap-x-6 gap-y-3">
              {AFFILIATIONS.map(aff => (
                <label key={aff} className="flex items-center gap-2.5 cursor-pointer select-none min-w-0" style={{ height: 24 }}>
                  <div className="flex-shrink-0">
                    <Checkbox checked={eAffil.has(aff)} onClick={() => toggleSet(eAffil, aff, setEAffil)} />
                  </div>
                  <span className="text-[12px] truncate" style={{ ...font, color: c.text }} title={aff}>{aff}</span>
                </label>
              ))}
            </div>

            {/* Direct Appointments */}
            <SectionDivider title="Direct Appointments" />
            <p className="text-[12px] mb-3" style={{ ...font, color: c.muted }}>Workers Compensation</p>
            <div className="grid grid-cols-4 gap-x-6 gap-y-3">
              {WORKERS_COMP.map(w => (
                <label key={w} className="flex items-center gap-2.5 cursor-pointer select-none min-w-0" style={{ height: 24 }}>
                  <div className="flex-shrink-0">
                    <Checkbox checked={eWC.has(w)} onClick={() => toggleSet(eWC, w, setEWC)} />
                  </div>
                  <span className="text-[12px] truncate" style={{ ...font, color: c.text }} title={w}>{w}</span>
                </label>
              ))}
            </div>
          </div>

        {/* Footer buttons */}
          <div style={{ borderTop: editExpanded ? `1px solid ${c.border}` : "none", marginTop: editExpanded ? 24 : 0, paddingTop: editExpanded ? 20 : 0, marginLeft: editExpanded ? 32 : 0, marginRight: editExpanded ? 32 : 0 }}>
          <div className="flex items-center justify-between pb-2">
            <button onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
              style={{ ...font, border: `1px solid ${c.borderStrong}`, color: "#090D11", background: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              Cancel
            </button>
            <button onClick={() => setIsEditing(false)}
              className="text-[13px] font-semibold text-white transition-all"
              style={{ ...font, background: btnGrad, padding:"10px 24px", borderRadius:"5.58px" }}
              onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.10)")}
              onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
              Save Changes
            </button>
          </div>
          </div>
          </div>
          </>
        )}

        {/* ── Notes tab ── */}
        {detailTab === "notes" && (
          <div className="flex flex-1 min-h-0 gap-4 pb-4" onClick={() => { setNoteFilterOpen(false); setNoteSortOpen(false); setNoteNewOpen(false); setNoteMoreOpen(false); }}>

            {/* Left panel */}
            <div className="flex flex-col min-h-0 transition-all"
              style={{ flex: selectedNote && !noteExpanded ? "0 0 30%" : "1 1 100%", minWidth: 0 }}>

              {/* Toolbar */}
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <div className="flex items-center gap-0.5">
                  {(() => { const collapsed = !!selectedNote && !noteExpanded; return (<>
                  {([["list","All Notes",List],["board","By Type",LayoutGrid],["table","Table",Table2]] as [typeof noteView, string, ({className}:{className?:string})=>React.ReactElement][]).map(([v, label, Icon]) => {
                    const isActive = noteView === v && !showArchived && !showTrashed;
                    return (
                      <button key={v} title={label} onClick={e => { e.stopPropagation(); setNoteView(v); setShowArchived(false); setShowTrashed(false); setIsSelectMode(false); setSelectedNoteIds(new Set()); }}
                        className={`flex items-center ${collapsed ? "px-1.5" : "gap-1.5 px-3"} py-1.5 rounded-md text-[12px] font-medium transition-all whitespace-nowrap`}
                        style={{ fontFamily: FONT, background: isActive ? (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6") : "transparent", color: isActive ? c.text : c.muted }}>
                        <Icon className="w-3 h-3" />{!collapsed && label}
                      </button>
                    );
                  })}
                  <div className="mx-1.5" style={{ width:1, height:16, background:c.border }} />
                  {(() => { const n = agNotes.filter(x => archivedIds.has(x.id)).length; return (
                    <button title="Archive" onClick={e => { e.stopPropagation(); setShowArchived(true); setShowTrashed(false); }}
                      className={`flex items-center ${collapsed ? "px-1.5" : "gap-1.5 px-2.5"} py-1.5 rounded-md text-[12px] font-medium transition-all`}
                      style={{ fontFamily: FONT, background: showArchived ? "rgba(245,158,11,0.10)" : "transparent", color: showArchived ? "#F59E0B" : c.muted }}>
                      <Archive className="w-3 h-3" />{!collapsed && "Archive"}
                      {!collapsed && n > 0 && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: showArchived ? "rgba(245,158,11,0.25)" : (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"), color: showArchived ? "#F59E0B" : c.muted }}>{n}</span>}
                    </button>
                  ); })()}
                  {(() => { const n = agNotes.filter(x => trashedIds.has(x.id)).length; return (
                    <button title="Trash" onClick={e => { e.stopPropagation(); setShowTrashed(true); setShowArchived(false); }}
                      className={`flex items-center ${collapsed ? "px-1.5" : "gap-1.5 px-2.5"} py-1.5 rounded-md text-[12px] font-medium transition-all`}
                      style={{ fontFamily: FONT, background: showTrashed ? "rgba(239,68,68,0.10)" : "transparent", color: showTrashed ? "#EF4444" : c.muted }}>
                      <Trash2 className="w-3 h-3" />{!collapsed && "Trash"}
                      {!collapsed && n > 0 && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: showTrashed ? "rgba(239,68,68,0.20)" : (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"), color: showTrashed ? "#EF4444" : c.muted }}>{n}</span>}
                    </button>
                  ); })()}
                  </>); })()}
                </div>
                <div className="flex items-center gap-1">
                  {/* Filter */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setNoteFilterOpen(p => !p); setNoteSortOpen(false); setNoteNewOpen(false); }}
                      className="p-1.5 rounded-md transition-all"
                      style={{ color: (noteFilterType !== "All" || visibilityFilter !== "All") ? "#A855F7" : c.muted, background: (noteFilterType !== "All" || visibilityFilter !== "All") ? "rgba(168,85,247,0.10)" : "transparent" }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M1 3h14v1.5L9.5 10v5l-3-1.5V10L1 4.5V3z"/></svg>
                    </button>
                    {noteFilterOpen && (
                      <div className="absolute right-0 top-8 z-30 w-52 rounded-xl shadow-xl py-1.5" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5" style={{ fontFamily: FONT, color: c.muted }}>Filter by Type</p>
                        {(["All",...NOTE_TYPES] as const).map(t => (
                          <button key={t} onClick={() => { setNoteFilterType(t as typeof noteFilterType); }}
                            className="w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between transition-colors"
                            style={{ fontFamily: FONT, color: noteFilterType === t ? "#A614C3" : c.text, background: noteFilterType === t ? "rgba(168,85,247,0.08)" : "transparent" }}>
                            {t === "All" ? "All Types" : t}
                            {noteFilterType === t && <span style={{ color: "#A614C3" }}>✓</span>}
                          </button>
                        ))}
                        <div style={{ height:1, background:c.border, margin:"6px 0" }} />
                        <p className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5" style={{ fontFamily: FONT, color: c.muted }}>Filter by Visibility</p>
                        {([
                          ["All", null],
                          ["Private", Lock],
                          ["Shared", Users],
                          ["Public", Globe],
                        ] as const).map(([v, Icon]) => (
                          <button key={v} onClick={() => { setVisibilityFilter(v as typeof visibilityFilter); }}
                            className="w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between transition-colors"
                            style={{ fontFamily: FONT, color: visibilityFilter === v ? "#A614C3" : c.text, background: visibilityFilter === v ? "rgba(168,85,247,0.08)" : "transparent" }}>
                            <span className="flex items-center gap-2">{Icon && <Icon className="w-3 h-3" />}{v === "All" ? "All Visibility" : v}</span>
                            {visibilityFilter === v && <span style={{ color: "#A614C3" }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Sort */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setNoteSortOpen(p => !p); setNoteFilterOpen(false); setNoteNewOpen(false); }}
                      className="p-1.5 rounded-md transition-all" style={{ color: c.muted }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h12v1.5H2V4zm2 3.5h8V9H4V7.5zm2 3.5h4v1.5H6V11z"/></svg>
                    </button>
                    {noteSortOpen && (
                      <div className="absolute right-0 top-8 z-30 w-40 rounded-xl shadow-xl overflow-hidden" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wide px-3 pt-2 pb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Sort by Date</p>
                        {([["desc","Newest first"],["asc","Oldest first"]] as const).map(([d, label]) => (
                          <button key={d} onClick={() => { setNoteSortDir(d); setNoteSortOpen(false); }}
                            className="w-full text-left px-3 py-2 text-[12px] flex items-center justify-between"
                            style={{ fontFamily: FONT, color: noteSortDir === d ? "#A614C3" : c.text, background: noteSortDir === d ? "rgba(168,85,247,0.08)" : "transparent" }}>
                            {label}{noteSortDir === d && <span style={{ color:"#A614C3" }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Search */}
                  <div className="flex items-center transition-all overflow-hidden" style={{ width: noteSearchOpen ? 160 : 28 }}>
                    <button onClick={e => { e.stopPropagation(); setNoteSearchOpen(p => !p); if (noteSearchOpen) setNoteSearch(""); }}
                      className="p-1.5 rounded-md flex-shrink-0" style={{ color: noteSearch ? "#A855F7" : c.muted }}>
                      <Search className="w-3.5 h-3.5" />
                    </button>
                    {noteSearchOpen && (
                      <input autoFocus value={noteSearch} onChange={e => setNoteSearch(e.target.value)}
                        onClick={e => e.stopPropagation()} placeholder="Search notes…"
                        className="outline-none text-[12px] flex-1 min-w-0"
                        style={{ fontFamily: FONT, color: c.text, background: "transparent", borderBottom: `1px solid ${c.border}` }} />
                    )}
                  </div>
                  {/* Select toggle */}
                  <button onClick={e => { e.stopPropagation(); setIsSelectMode(p => { if (p) setSelectedNoteIds(new Set()); return !p; }); }}
                    className="p-1.5 rounded-md transition-all"
                    style={{ color: isSelectMode ? "#A855F7" : c.muted, background: isSelectMode ? "rgba(168,85,247,0.10)" : "transparent" }}>
                    <CheckSquare className="w-3.5 h-3.5" />
                  </button>
                  {/* New button — hidden in archive/trash */}
                  {!showArchived && !showTrashed && <div className="relative ml-1" onClick={e => e.stopPropagation()}>
                    {selectedNote ? (
                      <button onClick={() => setNoteAddOpen(true)} className="w-7 h-7 flex items-center justify-center rounded-lg text-white transition-all" style={{ background: btnGrad }}>
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="flex items-center rounded-lg overflow-hidden" style={{ background: btnGrad }}>
                        <button onClick={() => setNoteAddOpen(true)} className="px-3 py-1.5 text-[12px] font-semibold text-white" style={{ fontFamily: FONT }}>New</button>
                        <div style={{ width:1, height:20, background:"rgba(255,255,255,0.2)" }} />
                        <button onClick={() => setNoteNewOpen(p => !p)} className="px-2 py-1.5 text-white flex items-center"><ChevronDown className="w-3 h-3" /></button>
                      </div>
                    )}
                    {noteNewOpen && (
                      <div className="absolute right-0 top-9 z-30 w-44 rounded-xl shadow-xl py-1.5" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5" style={{ fontFamily: FONT, color: c.muted }}>Create new</p>
                        {NOTE_TYPES.map(t => (
                          <button key={t} onClick={() => { setNewNoteType(t); setNoteNewOpen(false); setNoteAddOpen(true); }}
                            className="w-full text-left px-3 py-1.5 text-[12px] flex items-center gap-2 transition-colors"
                            style={{ fontFamily: FONT, color: c.text }}
                            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: typeColor[t]?.text }} />{t} Note
                          </button>
                        ))}
                      </div>
                    )}
                  </div>}
                </div>
              </div>

              {/* Divider */}
              <div className="flex-shrink-0 mb-3" style={{ height:1, background:c.border }} />

              {/* Batch action bar */}
              {isSelectMode && selectedNoteIds.size > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 mb-2.5 rounded-xl flex-shrink-0"
                  style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#ffffff", border: `1px solid ${c.border}` }}>
                  {(() => {
                    const allSel = visibleNotes.length > 0 && visibleNotes.every(n => selectedNoteIds.has(n.id));
                    const someSel = !allSel && selectedNoteIds.size > 0;
                    return (
                      <button onClick={() => { if (allSel) setSelectedNoteIds(new Set()); else setSelectedNoteIds(new Set(visibleNotes.map(n => n.id))); }}
                        className="flex items-center gap-2 transition-all">
                        <div className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ border: `1.5px solid ${allSel ? "#A855F7" : (isDark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.13)")}`, background: allSel ? "#A855F7" : (isDark ? "rgba(255,255,255,0.08)" : "#ffffff") }}>
                          {allSel && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          {someSel && <div className="w-2 h-0.5 rounded-full" style={{ background:"#A855F7" }} />}
                        </div>
                        <span className="text-[12px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>{selectedNoteIds.size} selected</span>
                      </button>
                    );
                  })()}
                  <div className="flex-1" />
                  <button onClick={() => { setPinnedIds(prev => { const s = new Set(prev); const allPinned = [...selectedNoteIds].every(id => s.has(id)); selectedNoteIds.forEach(id => allPinned ? s.delete(id) : s.add(id)); return s; }); }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all"
                    style={{ fontFamily: FONT, color: c.text, background: isDark ? "rgba(255,255,255,0.07)" : "#ffffff", border: `1px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)"}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.12)" : "#F3F4F6")}
                    onMouseLeave={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.07)" : "#F3F4F6")}>
                    <Pin className="w-3 h-3" style={{ color:"#F59E0B" }} />Pin
                  </button>
                  <button onClick={() => { setArchivedIds(prev => { const s = new Set(prev); selectedNoteIds.forEach(id => s.add(id)); return s; }); setSelectedNoteIds(new Set()); setIsSelectMode(false); }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all"
                    style={{ fontFamily: FONT, color: c.text, background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.40)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,158,11,0.18)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(245,158,11,0.10)")}>
                    <Archive className="w-3 h-3" style={{ color:"#F59E0B" }} />Archive
                  </button>
                  <button onClick={() => { setTrashedIds(prev => { const s = new Set(prev); selectedNoteIds.forEach(id => s.add(id)); return s; }); setSelectedNoteIds(new Set()); setIsSelectMode(false); }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all"
                    style={{ fontFamily: FONT, color: c.text, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.35)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.18)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.10)")}>
                    <Trash2 className="w-3 h-3" style={{ color:"#EF4444" }} />Trash
                  </button>
                  <button onClick={() => setSelectedNoteIds(new Set())} className="p-1 rounded-md ml-1 transition-all" style={{ color: c.muted }}
                    onMouseEnter={e => (e.currentTarget.style.color = c.text)} onMouseLeave={e => (e.currentTarget.style.color = c.muted)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* List view */}
              {noteView === "list" && (
                <div className="flex flex-col gap-2.5 overflow-y-auto flex-1 pr-1">
                  {visibleNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                      <StickyNote className="w-8 h-8" style={{ color: c.muted, opacity: 0.4 }} />
                      <p className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>No notes found</p>
                    </div>
                  ) : visibleNotes.map(n => {
                    const isChecked = selectedNoteIds.has(n.id);
                    const isPinned = pinnedIds.has(n.id);
                    return (
                      <div key={n.id} className="rounded-xl p-4 transition-all cursor-pointer"
                        style={{ background: isChecked ? (isDark ? "rgba(168,85,247,0.12)" : "rgba(92,46,212,0.07)") : selectedNote?.id === n.id ? (isDark ? "rgba(168,85,247,0.07)" : "rgba(92,46,212,0.04)") : c.cardBg, border: `1px solid ${isChecked ? (isDark ? "rgba(168,85,247,0.45)" : "rgba(92,46,212,0.35)") : selectedNote?.id === n.id ? (isDark ? "rgba(168,85,247,0.35)" : "rgba(92,46,212,0.30)") : c.border}` }}
                        onClick={e => { e.stopPropagation(); if (isSelectMode) { setSelectedNoteIds(prev => { const s = new Set(prev); s.has(n.id) ? s.delete(n.id) : s.add(n.id); return s; }); } else { openNote(n); } }}
                        onMouseEnter={e => { if (!isChecked && selectedNote?.id !== n.id) e.currentTarget.style.borderColor = isDark ? "rgba(168,85,247,0.25)" : "rgba(92,46,212,0.20)"; }}
                        onMouseLeave={e => { if (!isChecked && selectedNote?.id !== n.id) e.currentTarget.style.borderColor = c.border; }}>
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            {isSelectMode && (
                              <div className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                                style={{ border: `1.5px solid ${isChecked ? "#A855F7" : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.13)")}`, background: isChecked ? "#A855F7" : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)") }}>
                                {isChecked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                            )}
                            <button onClick={e => { e.stopPropagation(); setPinnedIds(prev => { const s = new Set(prev); s.has(n.id) ? s.delete(n.id) : s.add(n.id); return s; }); }}
                              className="p-0.5 rounded flex-shrink-0 transition-all"
                              style={{ color: isPinned ? "#F59E0B" : c.muted, opacity: isPinned ? 1 : (isDark ? 0.6 : 0.3) }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.color = "#F59E0B"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = isPinned ? "1" : "0.3"; (e.currentTarget as HTMLElement).style.color = isPinned ? "#F59E0B" : c.muted; }}>
                              <Pin className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[13px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>{n.title}</span>
                            <TypeBadge type={n.type} />
                          </div>
                          {!isSelectMode && (
                            <button onClick={e => { e.stopPropagation(); if (showTrashed) { setDeleteNoteId(n.id); } else { setTrashedIds(prev => { const s = new Set(prev); s.add(n.id); return s; }); } }} className="p-1 rounded-md flex-shrink-0" style={{ color:"#EF4444", opacity:0.6 }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity="1"; (e.currentTarget as HTMLElement).style.background="rgba(239,68,68,0.08)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity="0.6"; (e.currentTarget as HTMLElement).style.background="transparent"; }}>
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-[12px] leading-relaxed mb-2" style={{ fontFamily: FONT, color: isDark ? "rgba(255,255,255,0.72)" : c.muted }}>{n.content}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                            style={{ background: isDark ? "rgba(168,85,247,0.18)" : "rgba(168,85,247,0.10)", color: "#A855F7" }}>{n.author.charAt(0)}</div>
                          <span className="text-[11px]" style={{ fontFamily: FONT, color: c.muted }}>{n.author} · {fmtDate(n.timestamp)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Board view */}
              {noteView === "board" && (
                <div className="flex gap-3 flex-1 pb-2 overflow-y-auto">
                  {NOTE_TYPES.map(type => {
                    const col = visibleNotes.filter(n => n.type === type);
                    return (
                      <div key={type} className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 px-1">
                          <span className="w-2 h-2 rounded-full" style={{ background: typeColor[type]?.text }} />
                          <span className="text-[12px] font-semibold" style={{ fontFamily: FONT, color: typeColor[type]?.text }}>{type}</span>
                          <span className="text-[11px] ml-auto" style={{ fontFamily: FONT, color: c.muted }}>{col.length}</span>
                        </div>
                        <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                          {col.map(n => {
                            const isChecked = selectedNoteIds.has(n.id);
                            const isPinned = pinnedIds.has(n.id);
                            return (
                              <div key={n.id} className="rounded-xl transition-all cursor-pointer"
                                style={{ padding: selectedNote ? "8px 10px" : "14px", background: isChecked ? (isDark ? "rgba(168,85,247,0.12)" : "rgba(92,46,212,0.07)") : selectedNote?.id === n.id ? (isDark ? "rgba(168,85,247,0.07)" : "rgba(92,46,212,0.04)") : c.cardBg, border: `1px solid ${isChecked ? "rgba(168,85,247,0.45)" : selectedNote?.id === n.id ? typeColor[type]?.text + "66" : c.border}` }}
                                onClick={e => { e.stopPropagation(); if (isSelectMode) { setSelectedNoteIds(prev => { const s = new Set(prev); s.has(n.id) ? s.delete(n.id) : s.add(n.id); return s; }); } else { openNote(n); } }}
                                onMouseEnter={e => { if (!isChecked && selectedNote?.id !== n.id) e.currentTarget.style.borderColor = typeColor[type]?.text + "55"; }}
                                onMouseLeave={e => { if (!isChecked && selectedNote?.id !== n.id) e.currentTarget.style.borderColor = c.border; }}>
                                <div className="flex items-start justify-between gap-1" style={{ marginBottom: selectedNote ? 0 : 4 }}>
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {isSelectMode && (
                                      <div className="w-3.5 h-3.5 rounded-md flex items-center justify-center flex-shrink-0"
                                        style={{ border: `1.5px solid ${isChecked ? "#A855F7" : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.13)")}`, background: isChecked ? "#A855F7" : "transparent" }}>
                                        {isChecked && <svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M0.5 2.5L2.5 4.5L6.5 0.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                      </div>
                                    )}
                                    <button onClick={e => { e.stopPropagation(); setPinnedIds(prev => { const s = new Set(prev); s.has(n.id) ? s.delete(n.id) : s.add(n.id); return s; }); }}
                                      className="p-0.5 rounded flex-shrink-0 transition-all"
                                      style={{ color: isPinned ? "#F59E0B" : c.muted, opacity: isPinned ? 1 : (isDark ? 0.6 : 0.3) }}
                                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity="1"; (e.currentTarget as HTMLElement).style.color="#F59E0B"; }}
                                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity=isPinned?"1":(isDark?"0.6":"0.3"); (e.currentTarget as HTMLElement).style.color=isPinned?"#F59E0B":c.muted; }}>
                                      <Pin className="w-2.5 h-2.5" />
                                    </button>
                                    <span className="text-[11px] font-semibold leading-snug truncate" style={{ fontFamily: FONT, color: c.text }}>{n.title}</span>
                                  </div>
                                  {!isSelectMode && (
                                    <button onClick={e => { e.stopPropagation(); if (showTrashed) { setDeleteNoteId(n.id); } else { setTrashedIds(prev => { const s = new Set(prev); s.add(n.id); return s; }); } }} className="p-0.5 rounded flex-shrink-0" style={{ color: c.muted, opacity:0.5 }}
                                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity="1"; (e.currentTarget as HTMLElement).style.color="#EF4444"; }}
                                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity="0.5"; (e.currentTarget as HTMLElement).style.color=c.muted; }}>
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                {/* Content + author — hidden in compact mode */}
                                {!selectedNote && <>
                                  <p className="text-[11px] leading-relaxed mb-2.5 line-clamp-3" style={{ fontFamily: FONT, color: isDark ? "rgba(255,255,255,0.72)" : c.muted }}>{n.content}</p>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                                      style={{ background: isDark ? "rgba(168,85,247,0.18)" : "rgba(168,85,247,0.10)", color: "#A855F7" }}>{n.author.charAt(0)}</div>
                                    <span className="text-[10px]" style={{ fontFamily: FONT, color: c.muted }}>{fmtDate(n.timestamp).split(" ").slice(0,3).join(" ")}</span>
                                  </div>
                                </>}
                              </div>
                            );
                          })}
                          {col.length === 0 && (
                            <div className="rounded-xl p-4 text-center" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "#FAFAFA", border: `1px dashed ${c.border}` }}>
                              <p className="text-[11px]" style={{ fontFamily: FONT, color: c.muted }}>No {type} notes</p>
                            </div>
                          )}
                          {!showArchived && !showTrashed && (
                            <button onClick={() => { setNewNoteType(type); setNoteAddOpen(true); }}
                              className="flex items-center gap-1.5 px-2 py-2 rounded-lg text-[11px] transition-all w-full"
                              style={{ fontFamily: FONT, color: c.muted, border: `1px dashed ${c.border}` }}
                              onMouseEnter={e => (e.currentTarget.style.borderColor = typeColor[type]?.text + "66")}
                              onMouseLeave={e => (e.currentTarget.style.borderColor = c.border)}>
                              <Plus className="w-3 h-3" />New {type}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Table view */}
              {noteView === "table" && (
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                        {isSelectMode && <th className="pb-2 w-8" />}
                        {(!!selectedNote && !noteExpanded ? ["Title","Created"] : ["Title","Created","Created By","Type"]).map(h => (
                          <th key={h} className="text-[11px] font-semibold pb-2 pr-6" style={{ fontFamily: FONT, color: c.muted }}>{h}</th>
                        ))}
                        <th className="text-[11px] font-semibold pb-2 w-12" />
                      </tr>
                    </thead>
                    <tbody>
                      {visibleNotes.map((n, i) => {
                        const isChecked = selectedNoteIds.has(n.id);
                        const isPinned = pinnedIds.has(n.id);
                        return (
                          <tr key={n.id} className="cursor-pointer"
                            style={{ borderBottom: `1px solid ${c.border}`, background: isChecked ? (isDark ? "rgba(168,85,247,0.10)" : "rgba(92,46,212,0.06)") : selectedNote?.id === n.id ? (isDark ? "rgba(168,85,247,0.07)" : "rgba(92,46,212,0.04)") : (i%2===0 ? "transparent" : (isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)")) }}
                            onClick={e => { e.stopPropagation(); if (isSelectMode) { setSelectedNoteIds(prev => { const s = new Set(prev); s.has(n.id) ? s.delete(n.id) : s.add(n.id); return s; }); } else { openNote(n); } }}
                            onMouseEnter={e => { if (!isChecked && selectedNote?.id !== n.id) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB"; }}
                            onMouseLeave={e => { if (!isChecked && selectedNote?.id !== n.id) e.currentTarget.style.background = i%2===0 ? "transparent" : (isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)"); }}>
                            {isSelectMode && (
                              <td className="py-2.5 pr-2 w-8">
                                <div className="w-4 h-4 rounded-md flex items-center justify-center"
                                  style={{ border: `1.5px solid ${isChecked ? "#A855F7" : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.13)")}`, background: isChecked ? "#A855F7" : "transparent" }}>
                                  {isChecked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </div>
                              </td>
                            )}
                            <td className="py-2.5 pr-6">
                              <div className="flex items-center gap-1.5">
                                <button onClick={e => { e.stopPropagation(); setPinnedIds(prev => { const s = new Set(prev); s.has(n.id) ? s.delete(n.id) : s.add(n.id); return s; }); }}
                                  className="p-0.5 rounded flex-shrink-0 transition-all"
                                  style={{ color: isPinned ? "#F59E0B" : c.muted, opacity: isPinned ? 1 : (isDark ? 0.6 : 0.3) }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity="1"; (e.currentTarget as HTMLElement).style.color="#F59E0B"; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity=isPinned?"1":(isDark?"0.6":"0.3"); (e.currentTarget as HTMLElement).style.color=isPinned?"#F59E0B":c.muted; }}>
                                  <Pin className="w-3 h-3" />
                                </button>
                                <div>
                                  <span className="text-[12px] font-medium" style={{ fontFamily: FONT, color: c.text }}>{n.title}</span>
                                  <p className="text-[11px] truncate max-w-[200px]" style={{ fontFamily: FONT, color: isDark ? "rgba(255,255,255,0.72)" : c.muted }}>{n.content}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 pr-6 text-[12px] whitespace-nowrap" style={{ fontFamily: FONT, color: c.muted }}>{fmtDate(n.timestamp)}</td>
                            {!(!!selectedNote && !noteExpanded) && <td className="py-2.5 pr-6 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                                  style={{ background: isDark ? "rgba(168,85,247,0.18)" : "rgba(168,85,247,0.10)", color: "#A855F7" }}>{n.author.charAt(0)}</div>
                                <span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>{n.author}</span>
                              </div>
                            </td>}
                            {!(!!selectedNote && !noteExpanded) && <td className="py-2.5 pr-6 whitespace-nowrap"><TypeBadge type={n.type} /></td>}
                            <td className="py-2.5">
                              {!isSelectMode && (
                                <button onClick={e => { e.stopPropagation(); setDeleteNoteId(n.id); }} className="p-1 rounded" style={{ color: c.muted, opacity:0.5 }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity="1"; (e.currentTarget as HTMLElement).style.color="#EF4444"; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity="0.5"; (e.currentTarget as HTMLElement).style.color=c.muted; }}>
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {visibleNotes.length === 0 && (
                        <tr><td colSpan={isSelectMode ? 6 : 5} className="py-12 text-center text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>No notes found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Delete confirmation */}
              {deleteNoteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}
                  onClick={() => setDeleteNoteId(null)}>
                  <div className="w-80 rounded-2xl shadow-2xl p-6" style={{ background: c.cardBg, border: `1px solid ${c.border}` }} onClick={e => e.stopPropagation()}>
                    <p className="text-[15px] font-bold mb-2" style={{ fontFamily: FONT, color: c.text }}>Delete note?</p>
                    <p className="text-[13px] mb-5" style={{ fontFamily: FONT, color: c.muted }}>This action cannot be undone.</p>
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => setDeleteNoteId(null)} className="px-4 py-2 rounded-lg text-[12px]" style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: "#090D11" }}>Cancel</button>
                      <button onClick={() => { setAgNotes(prev => prev.filter(n => n.id !== deleteNoteId)); if (selectedNote?.id === deleteNoteId) { setSelectedNote(null); setNoteExpanded(false); } setDeleteNoteId(null); }}
                        className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white" style={{ fontFamily: FONT, background: "#EF4444" }}>Delete</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Note modal */}
              {noteAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background:"rgba(0,0,0,0.45)" }} onClick={() => setNoteAddOpen(false)}>
                  <div className="w-[480px] rounded-2xl shadow-2xl" style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }} onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${c.border}` }}>
                      <h2 className="text-[15px] font-bold" style={{ fontFamily: FONT, color: c.text }}>New Note</h2>
                      <button onClick={() => setNoteAddOpen(false)} style={{ color: c.muted }}><X className="w-4 h-4" /></button>
                    </div>
                    <div className="px-6 py-5 space-y-4">
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Title</label>
                        <input value={newNoteTitle} onChange={e => setNewNoteTitle(e.target.value)} placeholder="Note title…" className="outline-none w-full text-[13px]"
                          style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#F9FAFB", border: `1px solid ${c.border}`, color: c.text, padding:"9px 12px", borderRadius:8 }} />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Type</label>
                        <div className="flex flex-wrap gap-2">
                          {NOTE_TYPES.map(t => (
                            <button key={t} onClick={() => setNewNoteType(t)}
                              className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                              style={{ fontFamily: FONT, background: newNoteType === t ? typeColor[t]?.bg : "transparent", color: newNoteType === t ? typeColor[t]?.text : c.muted, border: `1px solid ${newNoteType === t ? typeColor[t]?.text + "44" : c.border}` }}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Content</label>
                        <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Write your note here…" rows={4} className="w-full outline-none resize-none text-[13px]"
                          style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#F9FAFB", border: `1px solid ${c.border}`, color: c.text, padding:"9px 12px", borderRadius:8 }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${c.border}` }}>
                      <button onClick={() => setNoteAddOpen(false)} className="px-4 py-[7px] rounded-lg text-[12px]"
                        style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: "#090D11", background: "transparent" }}>Cancel</button>
                      <button onClick={() => {
                        const titleFinal = newNoteTitle.trim() || (newNote.trim() ? newNote.trim().slice(0,40)+(newNote.trim().length>40?"…":"") : "Untitled Note");
                        if (!titleFinal) return;
                        setAgNotes(prev => [{ id: Date.now().toString(), title: titleFinal, content: newNote.trim(), author: CURRENT_USER, timestamp: new Date().toISOString(), agencyId: agency.id, type: newNoteType }, ...prev]);
                        setNewNoteTitle(""); setNewNote(""); setNoteAddOpen(false);
                      }} className="px-5 py-[7px] rounded-lg text-[12px] font-semibold text-white" style={{ fontFamily: FONT, background: btnGrad }}>
                        Create Note
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right panel: note detail */}
            {selectedNote && !noteExpanded && (
              <div className="flex flex-col flex-1 min-h-0 rounded-2xl overflow-hidden transition-all"
                style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
                onClick={e => { e.stopPropagation(); setNoteMoreOpen(false); setNoteShareOpen(false); }}>
                {(() => {
                  const isLockedByOther = noteLocked && lockedBy !== CURRENT_USER;
                  return (
                    <>
                      {/* Top bar */}
                      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
                        style={{ borderBottom: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "rgba(249,250,251,0.80)" }}>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <StickyNote className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                          <span className="text-[11px] flex-shrink-0" style={{ fontFamily: FONT, color: c.muted }}>Notes</span>
                          <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: c.muted }} />
                          <span className="text-[11px] font-medium truncate" style={{ fontFamily: FONT, color: c.text }}>{selectedNote.title}</span>
                          {noteLocked && <Lock className="w-3 h-3 flex-shrink-0 ml-0.5" style={{ color: "#A855F7" }} />}
                          {pinnedIds.has(selectedNote.id) && <Pin className="w-3 h-3 flex-shrink-0" style={{ color: "#F59E0B" }} />}
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <button onClick={e => { e.stopPropagation(); setNoteShareOpen(p => !p); setNoteMoreOpen(false); }}
                            className="p-1.5 rounded-md transition-colors"
                            style={{ color: noteShareOpen ? "#A855F7" : c.muted, background: noteShareOpen ? "rgba(168,85,247,0.10)" : "transparent" }}>
                            <Users className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={e => { e.stopPropagation(); setPinnedIds(prev => { const s = new Set(prev); s.has(selectedNote.id) ? s.delete(selectedNote.id) : s.add(selectedNote.id); return s; }); }}
                            className="p-1.5 rounded-md transition-colors"
                            style={{ color: pinnedIds.has(selectedNote.id) ? "#F59E0B" : c.muted, background: pinnedIds.has(selectedNote.id) ? "rgba(245,158,11,0.10)" : "transparent" }}>
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={e => { e.stopPropagation(); if (noteLocked && isLockedByOther) return; setNoteLocked(p => !p); if (!noteLocked) setLockedBy(CURRENT_USER); }}
                            className="p-1.5 rounded-md transition-colors"
                            style={{ color: noteLocked ? "#A855F7" : c.muted, background: noteLocked ? "rgba(168,85,247,0.10)" : "transparent" }}>
                            {noteLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={e => { e.stopPropagation(); setNoteExpanded(p => !p); }} className="p-1.5 rounded-md transition-colors">
                            <Maximize2 className="w-3.5 h-3.5" style={{ color: c.muted }} />
                          </button>
                          <div className="relative" onClick={e => e.stopPropagation()}>
                            <button onClick={() => { setNoteMoreOpen(p => !p); setNoteShareOpen(false); }} className="p-1.5 rounded-md" style={{ color: c.muted }}>
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                            {noteMoreOpen && (
                              <div className="absolute right-0 top-9 z-50 w-52 rounded-xl shadow-2xl py-1.5" style={{ background: c.cardBg, border: `1px solid ${c.border}` }} onClick={e => e.stopPropagation()}>
                                {!showTrashed && <>
                                  <button onClick={() => { navigator.clipboard.writeText(`${editNoteTitle}\n\n${editNoteContent}`); setCopyToast("Copied!"); setTimeout(()=>setCopyToast(""),2000); setNoteMoreOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: c.text }}
                                    onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                    <Copy className="w-3.5 h-3.5" style={{ color: c.muted }} />Copy content
                                  </button>
                                  <button onClick={() => { setAgNotes(prev => [{ ...selectedNote, id: Date.now().toString(), title: `Copy of ${editNoteTitle}`, content: editNoteContent, timestamp: new Date().toISOString() }, ...prev]); setCopyToast("Duplicated!"); setTimeout(()=>setCopyToast(""),2000); setNoteMoreOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: c.text }}
                                    onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                    <CopyPlus className="w-3.5 h-3.5" style={{ color: c.muted }} />Duplicate
                                  </button>
                                  <div style={{ height:1, background:c.border, margin:"4px 0" }} />
                                  <button onClick={() => { setArchivedIds(prev => { const s = new Set(prev); s.has(selectedNote.id)?s.delete(selectedNote.id):s.add(selectedNote.id); return s; }); setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#F59E0B" }}
                                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(245,158,11,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                    <Archive className="w-3.5 h-3.5" />{archivedIds.has(selectedNote.id) ? "Unarchive" : "Archive"}
                                  </button>
                                  <div style={{ height:1, background:c.border, margin:"4px 0" }} />
                                  <button onClick={() => { setTrashedIds(prev => { const s = new Set(prev); s.add(selectedNote.id); return s; }); setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#EF4444" }}
                                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(239,68,68,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                    <Trash2 className="w-3.5 h-3.5" />Move to Trash
                                  </button>
                                </>}
                                {showTrashed && <>
                                  <button onClick={() => { setTrashedIds(prev => { const s = new Set(prev); s.delete(selectedNote.id); return s; }); setSelectedNote(null); setNoteMoreOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#10B981" }}
                                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(16,185,129,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                    <RefreshCw className="w-3.5 h-3.5" />Restore note
                                  </button>
                                  <button onClick={() => { setDeleteNoteId(selectedNote.id); setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#EF4444" }}
                                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(239,68,68,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                    <Trash2 className="w-3.5 h-3.5" />Delete permanently
                                  </button>
                                </>}
                                <div className="px-3 pt-1.5 pb-1" style={{ borderTop: `1px solid ${c.border}`, marginTop:4 }}>
                                  <p className="text-[10px]" style={{ fontFamily: FONT, color: c.muted }}>Last edited {fmtDate(selectedNote.timestamp)}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          {!noteLocked && !showTrashed && (
                            <button onClick={saveNote} className="ml-1 px-3 py-1 rounded-lg text-[11px] font-semibold text-white transition-all"
                              style={{ fontFamily: FONT, background: btnGrad }}
                              onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.12)")} onMouseLeave={e=>(e.currentTarget.style.filter="none")}>Save</button>
                          )}
                          <button onClick={() => { setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); setNoteShareOpen(false); }}
                            className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                            onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="flex-1 overflow-y-auto py-6 relative" style={{ paddingLeft:28, paddingRight:28 }}>
                        {copyToast && <div className="absolute top-3 right-4 z-50 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white shadow-lg" style={{ background: btnGrad, fontFamily: FONT }}>{copyToast}</div>}
                        {noteShareOpen && renderSharePanel()}
                        {noteLocked && isLockedByOther && (
                          <div className="mb-4 flex items-center justify-between px-4 py-3 rounded-xl" style={{ background:"rgba(168,85,247,0.07)", border:"1px solid rgba(168,85,247,0.20)" }}>
                            <div className="flex items-center gap-2">
                              <Lock className="w-4 h-4" style={{ color:"#A855F7" }} />
                              <span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>Locked by <strong>{lockedBy}</strong></span>
                            </div>
                            <button onClick={() => { setCopyToast(`Access requested from ${lockedBy.split(" ")[0]}`); setTimeout(()=>setCopyToast(""),3000); }}
                              className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                              style={{ fontFamily: FONT, background:"rgba(168,85,247,0.12)", color:"#A855F7", border:"1px solid rgba(168,85,247,0.25)" }}>
                              Request Access
                            </button>
                          </div>
                        )}
                        <input value={editNoteTitle} onChange={e => setEditNoteTitle(e.target.value)} readOnly={noteLocked || showTrashed}
                          className="w-full outline-none font-bold bg-transparent mb-5"
                          style={{ fontFamily: FONT, color: c.text, fontSize:22, border:"none", cursor:(noteLocked||showTrashed)?"default":"text" }} />
                        {/* Properties */}
                        <div className="mb-6 rounded-xl overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
                          {[
                            { icon: <Calendar className="w-3.5 h-3.5" />, label:"Created", value:<span className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{fmtDate(selectedNote.timestamp)}</span> },
                            { icon: <UserCircle className="w-3.5 h-3.5" />, label:"Created By", value:<div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background:isDark?"rgba(168,85,247,0.18)":"rgba(168,85,247,0.10)", color:"#A855F7" }}>{selectedNote.author.charAt(0)}</div><span className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{selectedNote.author}</span></div> },
                            { icon: <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="8" r="2.5"/></svg>, label:"Type", value:<div className="flex flex-wrap gap-1.5">{NOTE_TYPES.map(t => (<button key={t} onClick={() => (!noteLocked&&!showTrashed)&&setEditNoteType(t)} className="px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all" style={{ fontFamily:FONT, background:editNoteType===t?typeColor[t]?.bg:"transparent", color:editNoteType===t?typeColor[t]?.text:c.muted, border:`1px solid ${editNoteType===t?typeColor[t]?.text+"44":c.border}`, cursor:(noteLocked||showTrashed)?"default":"pointer" }}>{t}</button>))}</div> },
                            { icon: <Lock className="w-3.5 h-3.5" />, label:"Visibility", value:(
  <div className="flex flex-col gap-2 min-w-0">
    <div className="flex flex-wrap gap-1.5">
      {([["Private",Lock,"Only you can see this note"],["Shared",Users,"Shared with specific teammates"],["Public",Globe,"Visible to everyone in your team"]] as const).map(([v,Ic,tip]) => (
        <button key={v} title={tip} onClick={() => (!noteLocked&&!showTrashed)&&setEditNoteVisibility(v)}
          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5"
          style={{ fontFamily:FONT, background:editNoteVisibility===v?"rgba(168,85,247,0.10)":"transparent", color:editNoteVisibility===v?"#A855F7":c.muted, border:`1px solid ${editNoteVisibility===v?"rgba(168,85,247,0.35)":c.border}`, cursor:(noteLocked||showTrashed)?"default":"pointer" }}>
          <Ic className="w-3 h-3" />{v}
        </button>
      ))}
    </div>
    {editNoteVisibility === "Shared" && (
      <div className="text-[11px] flex items-center gap-1.5 flex-wrap" style={{ fontFamily:FONT, color: c.muted }}>
        <div className="flex -space-x-1">
          {TEAMMATES.filter(t => t.name !== CURRENT_USER).slice(0,3).map(t => (
            <div key={t.name} className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ ...avatarStyle, border: `1.5px solid ${c.cardBg}` }}><span style={avatarTextStyle}>{initials(t.name)}</span></div>
          ))}
        </div>
        <span>You + {TEAMMATES.length - 1} teammates</span>
        <span>·</span>
        <button onClick={e => { e.stopPropagation(); setNoteShareOpen(true); }}
          className="font-medium transition-colors" style={{ color: "#A855F7" }}>Manage</button>
      </div>
    )}
  </div>
) },
                            { icon: <Building2 className="w-3.5 h-3.5" />, label:"Agency", value:<span className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{agency.name}</span> },
                          ].map(({ icon, label, value }, idx, arr) => (
                            <div key={label} className="flex items-center px-4 py-2.5" style={{ borderBottom: idx<arr.length-1 ? `1px solid ${c.border}` : undefined }}>
                              <div className="flex items-center gap-2 flex-shrink-0" style={{ width:130, color:c.muted }}>{icon}<span className="text-[12px]" style={{ fontFamily:FONT }}>{label}</span></div>
                              {value}
                            </div>
                          ))}
                        </div>
                        <div className="mb-4" style={{ height:1, background:c.border }} />
                        <textarea value={editNoteContent} onChange={e => setEditNoteContent(e.target.value)} readOnly={noteLocked||showTrashed}
                          placeholder={(noteLocked||showTrashed) ? "" : "Start writing your note here…"}
                          className="w-full outline-none resize-none leading-relaxed bg-transparent" rows={12}
                          style={{ fontFamily:FONT, fontSize:13, color:c.text, border:"none", cursor:(noteLocked||showTrashed)?"default":"text" }} />
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between px-5 py-2.5 flex-shrink-0" style={{ borderTop: `1px solid ${c.border}` }}>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px]" style={{ fontFamily:FONT, color:c.muted }}>{editNoteContent.trim().split(/\s+/).filter(Boolean).length} words</span>
                          {noteLocked && <span className="text-[11px] flex items-center gap-1.5" style={{ fontFamily:FONT, color:"#A855F7" }}><Lock className="w-3 h-3" />{lockedBy===CURRENT_USER ? "Locked by you · Read-only for others" : `Locked by ${lockedBy} · Read-only`}</span>}
                          {pinnedIds.has(selectedNote.id) && <span className="text-[11px] flex items-center gap-1" style={{ fontFamily:FONT, color:"#F59E0B" }}><Pin className="w-3 h-3" />Pinned</span>}
                        </div>
                        <span className="text-[11px]" style={{ fontFamily:FONT, color:c.muted }}>{fmtDate(selectedNote.timestamp)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Expanded overlay */}
            {selectedNote && noteExpanded && (() => {
              const isLockedByOther = noteLocked && lockedBy !== CURRENT_USER;
              return (
              <div className="fixed inset-y-0 right-0 z-50 flex" style={{ width:"58vw" }}
                onClick={e => { e.stopPropagation(); setNoteMoreOpen(false); setNoteShareOpen(false); }}>
                <div className="flex-1 cursor-pointer" onClick={() => setNoteExpanded(false)} style={{ background:"rgba(0,0,0,0.25)" }} />
                <div className="flex flex-col h-full shadow-2xl" style={{ width:"100%", background:c.cardBg, borderLeft:`1px solid ${c.border}` }}>
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ borderBottom:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.02)":"rgba(249,250,251,0.8)" }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <StickyNote className="w-3.5 h-3.5 flex-shrink-0" style={{ color:c.muted }} />
                      <span className="text-[11px] flex-shrink-0" style={{ fontFamily:FONT, color:c.muted }}>Notes</span>
                      <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color:c.muted }} />
                      <span className="text-[12px] font-semibold truncate max-w-[280px]" style={{ fontFamily:FONT, color:c.text }}>{selectedNote.title}</span>
                      {noteLocked && <Lock className="w-3 h-3 flex-shrink-0" style={{ color:"#A855F7" }} />}
                      {pinnedIds.has(selectedNote.id) && <Pin className="w-3 h-3 flex-shrink-0" style={{ color:"#F59E0B" }} />}
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button onClick={e => { e.stopPropagation(); setNoteShareOpen(p => !p); setNoteMoreOpen(false); }}
                        className="p-1.5 rounded-md transition-colors"
                        style={{ color: noteShareOpen ? "#A855F7" : c.muted, background: noteShareOpen ? "rgba(168,85,247,0.10)" : "transparent" }}>
                        <Users className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); setPinnedIds(prev => { const s = new Set(prev); s.has(selectedNote.id) ? s.delete(selectedNote.id) : s.add(selectedNote.id); return s; }); }}
                        className="p-1.5 rounded-md transition-colors"
                        style={{ color: pinnedIds.has(selectedNote.id) ? "#F59E0B" : c.muted, background: pinnedIds.has(selectedNote.id) ? "rgba(245,158,11,0.10)" : "transparent" }}>
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); if (noteLocked && isLockedByOther) return; setNoteLocked(p => !p); if (!noteLocked) setLockedBy(CURRENT_USER); }}
                        className="p-1.5 rounded-md transition-colors"
                        style={{ color: noteLocked ? "#A855F7" : c.muted, background: noteLocked ? "rgba(168,85,247,0.10)" : "transparent" }}>
                        {noteLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => setNoteExpanded(false)} className="p-1.5 rounded-md transition-colors" title="Collapse">
                        <Minimize2 className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />
                      </button>
                      <div className="relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setNoteMoreOpen(p => !p); setNoteShareOpen(false); }} className="p-1.5 rounded-md" style={{ color: c.muted }}>
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        {noteMoreOpen && (
                          <div className="absolute right-0 top-9 z-50 w-52 rounded-xl shadow-2xl py-1.5" style={{ background: c.cardBg, border: `1px solid ${c.border}` }} onClick={e => e.stopPropagation()}>
                            {!showTrashed && <>
                              <button onClick={() => { navigator.clipboard.writeText(`${editNoteTitle}\n\n${editNoteContent}`); setCopyToast("Copied!"); setTimeout(()=>setCopyToast(""),2000); setNoteMoreOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: c.text }}
                                onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <Copy className="w-3.5 h-3.5" style={{ color: c.muted }} />Copy content
                              </button>
                              <button onClick={() => { setAgNotes(prev => [{ ...selectedNote, id: Date.now().toString(), title: `Copy of ${editNoteTitle}`, content: editNoteContent, timestamp: new Date().toISOString() }, ...prev]); setCopyToast("Duplicated!"); setTimeout(()=>setCopyToast(""),2000); setNoteMoreOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: c.text }}
                                onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <CopyPlus className="w-3.5 h-3.5" style={{ color: c.muted }} />Duplicate
                              </button>
                              <div style={{ height:1, background:c.border, margin:"4px 0" }} />
                              <button onClick={() => { setArchivedIds(prev => { const s = new Set(prev); s.has(selectedNote.id)?s.delete(selectedNote.id):s.add(selectedNote.id); return s; }); setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#F59E0B" }}
                                onMouseEnter={e=>(e.currentTarget.style.background="rgba(245,158,11,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <Archive className="w-3.5 h-3.5" />{archivedIds.has(selectedNote.id) ? "Unarchive" : "Archive"}
                              </button>
                              <div style={{ height:1, background:c.border, margin:"4px 0" }} />
                              <button onClick={() => { setTrashedIds(prev => { const s = new Set(prev); s.add(selectedNote.id); return s; }); setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#EF4444" }}
                                onMouseEnter={e=>(e.currentTarget.style.background="rgba(239,68,68,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <Trash2 className="w-3.5 h-3.5" />Move to Trash
                              </button>
                            </>}
                            {showTrashed && <>
                              <button onClick={() => { setTrashedIds(prev => { const s = new Set(prev); s.delete(selectedNote.id); return s; }); setSelectedNote(null); setNoteMoreOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#10B981" }}
                                onMouseEnter={e=>(e.currentTarget.style.background="rgba(16,185,129,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <RefreshCw className="w-3.5 h-3.5" />Restore note
                              </button>
                              <button onClick={() => { setDeleteNoteId(selectedNote.id); setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#EF4444" }}
                                onMouseEnter={e=>(e.currentTarget.style.background="rgba(239,68,68,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <Trash2 className="w-3.5 h-3.5" />Delete permanently
                              </button>
                            </>}
                            <div className="px-3 pt-1.5 pb-1" style={{ borderTop: `1px solid ${c.border}`, marginTop:4 }}>
                              <p className="text-[10px]" style={{ fontFamily: FONT, color: c.muted }}>Last edited {fmtDate(selectedNote.timestamp)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {!noteLocked && !showTrashed && (
                        <button onClick={saveNote} className="ml-1 px-3 py-1 rounded-lg text-[11px] font-semibold text-white transition-all"
                          style={{ fontFamily: FONT, background: btnGrad }}
                          onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.12)")} onMouseLeave={e=>(e.currentTarget.style.filter="none")}>Save</button>
                      )}
                      <button onClick={() => { setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); setNoteShareOpen(false); }}
                        className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                        onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="flex-1 overflow-y-auto relative" style={{ paddingLeft:72, paddingRight:72, paddingTop:24, paddingBottom:24 }}>
                    {copyToast && <div className="absolute top-3 right-6 z-50 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white shadow-lg" style={{ background:btnGrad, fontFamily:FONT }}>{copyToast}</div>}
                    {noteShareOpen && renderSharePanel()}
                    {noteLocked && isLockedByOther && (
                      <div className="mb-4 flex items-center justify-between px-4 py-3 rounded-xl" style={{ background:"rgba(168,85,247,0.07)", border:"1px solid rgba(168,85,247,0.20)" }}>
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" style={{ color:"#A855F7" }} />
                          <span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>Locked by <strong>{lockedBy}</strong></span>
                        </div>
                        <button onClick={() => { setCopyToast(`Access requested from ${lockedBy.split(" ")[0]}`); setTimeout(()=>setCopyToast(""),3000); }}
                          className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                          style={{ fontFamily: FONT, background:"rgba(168,85,247,0.12)", color:"#A855F7", border:"1px solid rgba(168,85,247,0.25)" }}>
                          Request Access
                        </button>
                      </div>
                    )}
                    <input value={editNoteTitle} onChange={e=>setEditNoteTitle(e.target.value)} readOnly={noteLocked||showTrashed}
                      className="w-full outline-none font-bold bg-transparent mb-5"
                      style={{ fontFamily:FONT, color:c.text, fontSize:26, border:"none", cursor:(noteLocked||showTrashed)?"default":"text" }} />
                    {/* Properties */}
                    <div className="mb-6 rounded-xl overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
                      {[
                        { icon: <Calendar className="w-3.5 h-3.5" />, label:"Created", value:<span className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{fmtDate(selectedNote.timestamp)}</span> },
                        { icon: <UserCircle className="w-3.5 h-3.5" />, label:"Created By", value:<div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background:isDark?"rgba(168,85,247,0.18)":"rgba(168,85,247,0.10)", color:"#A855F7" }}>{selectedNote.author.charAt(0)}</div><span className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{selectedNote.author}</span></div> },
                        { icon: <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="8" r="2.5"/></svg>, label:"Type", value:<div className="flex flex-wrap gap-1.5">{NOTE_TYPES.map(t => (<button key={t} onClick={() => (!noteLocked&&!showTrashed)&&setEditNoteType(t)} className="px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all" style={{ fontFamily:FONT, background:editNoteType===t?typeColor[t]?.bg:"transparent", color:editNoteType===t?typeColor[t]?.text:c.muted, border:`1px solid ${editNoteType===t?typeColor[t]?.text+"44":c.border}`, cursor:(noteLocked||showTrashed)?"default":"pointer" }}>{t}</button>))}</div> },
                        { icon: <Lock className="w-3.5 h-3.5" />, label:"Visibility", value:(
  <div className="flex flex-col gap-2 min-w-0">
    <div className="flex flex-wrap gap-1.5">
      {([["Private",Lock,"Only you can see this note"],["Shared",Users,"Shared with specific teammates"],["Public",Globe,"Visible to everyone in your team"]] as const).map(([v,Ic,tip]) => (
        <button key={v} title={tip} onClick={() => (!noteLocked&&!showTrashed)&&setEditNoteVisibility(v)}
          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5"
          style={{ fontFamily:FONT, background:editNoteVisibility===v?"rgba(168,85,247,0.10)":"transparent", color:editNoteVisibility===v?"#A855F7":c.muted, border:`1px solid ${editNoteVisibility===v?"rgba(168,85,247,0.35)":c.border}`, cursor:(noteLocked||showTrashed)?"default":"pointer" }}>
          <Ic className="w-3 h-3" />{v}
        </button>
      ))}
    </div>
    {editNoteVisibility === "Shared" && (
      <div className="text-[11px] flex items-center gap-1.5 flex-wrap" style={{ fontFamily:FONT, color: c.muted }}>
        <div className="flex -space-x-1">
          {TEAMMATES.filter(t => t.name !== CURRENT_USER).slice(0,3).map(t => (
            <div key={t.name} className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ ...avatarStyle, border: `1.5px solid ${c.cardBg}` }}><span style={avatarTextStyle}>{initials(t.name)}</span></div>
          ))}
        </div>
        <span>You + {TEAMMATES.length - 1} teammates</span>
        <span>·</span>
        <button onClick={e => { e.stopPropagation(); setNoteShareOpen(true); }}
          className="font-medium transition-colors" style={{ color: "#A855F7" }}>Manage</button>
      </div>
    )}
  </div>
) },
                        { icon: <Building2 className="w-3.5 h-3.5" />, label:"Agency", value:<span className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{agency.name}</span> },
                      ].map(({ icon, label, value }, idx, arr) => (
                        <div key={label} className="flex items-center px-4 py-2.5" style={{ borderBottom: idx<arr.length-1 ? `1px solid ${c.border}` : undefined }}>
                          <div className="flex items-center gap-2 flex-shrink-0" style={{ width:130, color:c.muted }}>{icon}<span className="text-[12px]" style={{ fontFamily:FONT }}>{label}</span></div>
                          {value}
                        </div>
                      ))}
                    </div>
                    <div className="mb-4" style={{ height:1, background:c.border }} />
                    <textarea value={editNoteContent} onChange={e=>setEditNoteContent(e.target.value)} readOnly={noteLocked||showTrashed}
                      placeholder={(noteLocked||showTrashed)?"":"Start writing your note here…"}
                      className="w-full outline-none resize-none leading-relaxed bg-transparent" rows={22}
                      style={{ fontFamily:FONT, fontSize:13, color:c.text, border:"none", cursor:(noteLocked||showTrashed)?"default":"text" }} />
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between px-6 py-2.5 flex-shrink-0" style={{ borderTop:`1px solid ${c.border}` }}>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px]" style={{ fontFamily:FONT, color:c.muted }}>{editNoteContent.trim().split(/\s+/).filter(Boolean).length} words</span>
                      {noteLocked && <span className="text-[11px] flex items-center gap-1.5" style={{ fontFamily:FONT, color:"#A855F7" }}><Lock className="w-3 h-3" />{lockedBy===CURRENT_USER ? "Locked by you · Read-only for others" : `Locked by ${lockedBy} · Read-only`}</span>}
                      {pinnedIds.has(selectedNote.id) && <span className="text-[11px] flex items-center gap-1" style={{ fontFamily:FONT, color:"#F59E0B" }}><Pin className="w-3 h-3" />Pinned</span>}
                    </div>
                    <span className="text-[11px]" style={{ fontFamily:FONT, color:c.muted }}>{fmtDate(selectedNote.timestamp)}</span>
                  </div>
                </div>
              </div>
              );
            })()}
          </div>
        )}

        {/* ── Policies tab ── */}
        {detailTab === "policies" && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-stretch overflow-hidden transition-all"
                style={{ background: c.cardBg, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, borderRadius:10 }}
                onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.12)")} onMouseLeave={e=>(e.currentTarget.style.filter="none")}>
                <input placeholder="Search Policies" value={detailSearch} onChange={e=>setDetailSearch(e.target.value)}
                  className="outline-none px-4 py-2 text-[13px]"
                  style={{ fontFamily:FONT, background:"transparent", color:c.text, width:200, borderRadius:"10px 0 0 10px" }} />
                <button className="px-5 text-[12px] font-semibold text-white flex-shrink-0"
                  style={{ background:btnGrad, fontFamily:FONT, borderRadius:"0 7px 7px 0" }}>Submit</button>
              </div>
              <div className="relative">
                <select className="appearance-none pl-3 pr-8 py-2 outline-none cursor-pointer"
                  style={{ fontFamily:FONT, background:`linear-gradient(${c.cardBg},${c.cardBg}) padding-box, linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%) border-box`, border:"1px solid transparent", color:c.text, fontSize:11, fontWeight:500, borderRadius:7 }}>
                  <option>Past 20 Days</option><option>Past 60 Days</option><option>Past 90 Days</option><option>All Time</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color:c.muted }} />
              </div>
              <div className="flex items-center gap-1 ml-1" style={{ borderLeft:`1px solid ${c.border}`, paddingLeft:10 }}>
                <button className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-4 h-4"/></button>
                <button className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><LayoutGrid className="w-4 h-4"/></button>
                <button className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><Download className="w-4 h-4"/></button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden flex flex-col flex-1 min-h-0" style={{ background:c.cardBg, border:`1px solid ${c.border}` }}>
              <div className="grid px-5 py-3 gap-4" style={{ gridTemplateColumns:"1.1fr 1.6fr 1.2fr 1fr 1.1fr 1.1fr 1.2fr 1.2fr", borderBottom:`1px solid ${c.border}`, background:mutedBg }}>
                {/* Created */}
                <button onClick={()=>{if(qpSortKey==="createdDate")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("createdDate");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Created<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="createdDate"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="createdDate"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                {/* Policy Number */}
                <button onClick={()=>{if(qpSortKey==="policyNumber")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("policyNumber");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Policy Number<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="policyNumber"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="policyNumber"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                {/* Applicant */}
                <div className="relative">
                  <button onClick={()=>{closeAllDropdowns();setApplicantOpen(o=>!o);}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none" style={{fontFamily:FONT,color:applicantFilter.size>0?"#A614C3":c.muted}}>
                    Applicant<span className="inline-flex ml-1"><svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={applicantFilter.size>0?"#A614C3":sub}/></svg></span>
                  </button>
                  {applicantOpen&&(<>
                    <div className="fixed inset-0 z-10" onClick={()=>setApplicantOpen(false)}/>
                    <div className="absolute top-full mt-1 z-30 rounded-xl shadow-lg overflow-hidden min-w-[220px]" style={{background:c.cardBg,border:`1px solid ${c.border}`, left: -50}}>
                      <div className="p-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{background:isDark?"rgba(255,255,255,0.05)":"#F9FAFB",border:`1px solid ${c.border}`}}>
                          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{color:c.muted}}/><input value={applicantSearch} onChange={e=>setApplicantSearch(e.target.value)} placeholder="Search Agent" className="outline-none text-[12px] flex-1 bg-transparent" style={{fontFamily:FONT,color:c.text}}/>
                        </div>
                      </div>
                      <div className="px-3 py-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <button className="flex items-center gap-2 text-[12px] w-full text-left" style={{fontFamily:FONT,color:c.text}} onClick={()=>{const all=uniquePApplicants;setApplicantFilter(applicantFilter.size===all.length?new Set():new Set(all));}}>
                          <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{applicantFilter.size===uniquePApplicants.length&&uniquePApplicants.length>0&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                          Select All
                        </button>
                      </div>
                      <div className="max-h-[180px] overflow-y-auto py-1">
                        {uniquePApplicants.filter(a=>!applicantSearch||a.toLowerCase().includes(applicantSearch.toLowerCase())).map(applicant=>(
                          <button key={applicant} className="flex items-center gap-2 px-3 py-1.5 text-[12px] w-full text-left transition-colors" style={{fontFamily:FONT,color:c.text}} onMouseEnter={e=>e.currentTarget.style.background=c.hoverBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"} onClick={()=>toggleSet(applicantFilter,applicant,setApplicantFilter)}>
                            <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{applicantFilter.has(applicant)&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                            {applicant}
                          </button>
                        ))}
                      </div>
                      <button onClick={()=>{setApplicantFilter(new Set());setApplicantSearch("");}} className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors" style={{fontFamily:FONT,color:"#A614C3",borderTop:`1px solid ${c.border}`}} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-3.5 h-3.5"/>Reset Filter</button>
                    </div>
                  </>)}
                </div>
                {/* DBA */}
                <button onClick={()=>{if(qpSortKey==="dba")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("dba");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  DBA<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="dba"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="dba"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                {/* Effective */}
                <button onClick={()=>{if(qpSortKey==="effectiveDate")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("effectiveDate");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Effective<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="effectiveDate"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="effectiveDate"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                {/* LOB */}
                <div className="relative">
                  <button onClick={()=>{closeAllDropdowns();setLobOpen(o=>!o);}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none" style={{fontFamily:FONT,color:lobFilter!=="All LOBs"?"#A614C3":c.muted}}>
                    LOB<span className="inline-flex ml-1"><svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={lobFilter!=="All LOBs"?"#A614C3":sub}/></svg></span>
                  </button>
                  {lobOpen&&(<>
                    <div className="fixed inset-0 z-10" onClick={()=>setLobOpen(false)}/>
                    <div className="absolute left-0 top-full mt-1 z-20 rounded-xl shadow-lg overflow-hidden min-w-[200px] max-h-[280px] overflow-y-auto" style={{background:c.cardBg,border:`1px solid ${c.border}`}}>
                      {ALL_LOBS.map(lob=>(
                        <button key={lob} onClick={()=>{setLobFilter(lob);setLobOpen(false);}} className="w-full text-left px-3 py-2 text-[12px] transition-colors flex items-center justify-between gap-2" style={{fontFamily:FONT,color:lobFilter===lob?"#A614C3":c.text,fontWeight:lobFilter===lob?600:400,background:lobFilter===lob?"rgba(168,85,247,0.08)":"transparent"}} onMouseEnter={e=>e.currentTarget.style.background=lobFilter===lob?"rgba(168,85,247,0.12)":c.hoverBg} onMouseLeave={e=>e.currentTarget.style.background=lobFilter===lob?"rgba(168,85,247,0.08)":"transparent"}>
                          <span>{lob}</span>
                          {lobFilter===lob && <svg width="11" height="9" viewBox="0 0 9 7" fill="none" className="flex-shrink-0"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </button>
                      ))}
                    </div>
                  </>)}
                </div>
                {/* Status */}
                <div className="relative">
                  <button onClick={()=>{closeAllDropdowns();setStatusOpen(o=>!o);}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none" style={{fontFamily:FONT,color:statusFilter!=="All Statuses"?"#A614C3":c.muted}}>
                    Status<span className="inline-flex ml-1"><svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={statusFilter!=="All Statuses"?"#A614C3":sub}/></svg></span>
                  </button>
                  {statusOpen&&(<>
                    <div className="fixed inset-0 z-10" onClick={()=>setStatusOpen(false)}/>
                    <div className="absolute left-0 top-full mt-1 z-20 rounded-xl shadow-lg overflow-hidden min-w-[170px]" style={{background:c.cardBg,border:`1px solid ${c.border}`}}>
                      {POLICY_STATUSES.map(status=>(
                        <button key={status} onClick={()=>{setStatusFilter(status);setStatusOpen(false);}} className="w-full text-left px-3 py-2 text-[12px] transition-colors flex items-center justify-between gap-2" style={{fontFamily:FONT,color:statusFilter===status?"#A614C3":c.text,fontWeight:statusFilter===status?600:400,background:statusFilter===status?"rgba(168,85,247,0.08)":"transparent"}} onMouseEnter={e=>e.currentTarget.style.background=statusFilter===status?"rgba(168,85,247,0.12)":c.hoverBg} onMouseLeave={e=>e.currentTarget.style.background=statusFilter===status?"rgba(168,85,247,0.08)":"transparent"}>
                          <span>{status}</span>
                          {statusFilter===status && <svg width="11" height="9" viewBox="0 0 9 7" fill="none" className="flex-shrink-0"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </button>
                      ))}
                    </div>
                  </>)}
                </div>
                {/* Producer */}
                <div className="relative">
                  <button onClick={()=>{closeAllDropdowns();setProducerOpen(o=>!o);}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none" style={{fontFamily:FONT,color:producerFilter.size>0?"#A614C3":c.muted}}>
                    Producer<span className="inline-flex ml-1"><svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={producerFilter.size>0?"#A614C3":sub}/></svg></span>
                  </button>
                  {producerOpen&&(<>
                    <div className="fixed inset-0 z-10" onClick={()=>setProducerOpen(false)}/>
                    <div className="absolute top-full mt-1 z-30 rounded-xl shadow-lg overflow-hidden min-w-[220px]" style={{background:c.cardBg,border:`1px solid ${c.border}`, left: -50}}>
                      <div className="p-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{background:isDark?"rgba(255,255,255,0.05)":"#F9FAFB",border:`1px solid ${c.border}`}}>
                          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{color:c.muted}}/><input value={producerSearch} onChange={e=>setProducerSearch(e.target.value)} placeholder="Search Agent" className="outline-none text-[12px] flex-1 bg-transparent" style={{fontFamily:FONT,color:c.text}}/>
                        </div>
                      </div>
                      <div className="px-3 py-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <button className="flex items-center gap-2 text-[12px] w-full text-left" style={{fontFamily:FONT,color:c.text}} onClick={()=>{const all=uniquePProducers;setProducerFilter(producerFilter.size===all.length?new Set():new Set(all));}}>
                          <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{producerFilter.size===uniquePProducers.length&&uniquePProducers.length>0&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                          Select All
                        </button>
                      </div>
                      <div className="max-h-[180px] overflow-y-auto py-1">
                        {uniquePProducers.filter(p=>!producerSearch||p.toLowerCase().includes(producerSearch.toLowerCase())).map(producer=>(
                          <button key={producer} className="flex items-center gap-2 px-3 py-1.5 text-[12px] w-full text-left transition-colors" style={{fontFamily:FONT,color:c.text}} onMouseEnter={e=>e.currentTarget.style.background=c.hoverBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"} onClick={()=>toggleSet(producerFilter,producer,setProducerFilter)}>
                            <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{producerFilter.has(producer)&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                            {producer}
                          </button>
                        ))}
                      </div>
                      <button onClick={()=>{setProducerFilter(new Set());setProducerSearch("");}} className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors" style={{fontFamily:FONT,color:"#A614C3",borderTop:`1px solid ${c.border}`}} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-3.5 h-3.5"/>Reset Filter</button>
                    </div>
                  </>)}
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                {agencyPolicies.length === 0 ? (
                  <div className="flex items-center justify-center py-16 text-[13px]" style={{ fontFamily:FONT, color:c.muted }}>No policies found</div>
                ) : agencyPolicies.map((p,i,arr) => {
                  const isRenewal = p.status === "Upcoming Renewal";
                  return (
                    <div key={p.id} className="grid px-5 py-3.5 items-center gap-4 transition-colors cursor-pointer"
                      style={{ gridTemplateColumns:"1.1fr 1.6fr 1.2fr 1fr 1.1fr 1.1fr 1.2fr 1.2fr", borderBottom:i!==arr.length-1?`1px solid ${c.border}`:"none", background:isRenewal?"rgba(116,195,183,0.08)":"transparent", borderLeft:isRenewal?"3px solid #74C3B7":"3px solid transparent" }}
                      onMouseEnter={e=>(e.currentTarget.style.background=isRenewal?"rgba(116,195,183,0.14)":c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background=isRenewal?"rgba(116,195,183,0.08)":"transparent")}>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{new Date(p.createdDate).toLocaleDateString()}</div>
                      <div className="text-[12px] font-semibold" style={{ fontFamily:FONT, color: isDark ? "#4ECDC4" : "#A614C3" }}>{p.policyNumber}</div>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.applicant}</div>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.dba||"—"}</div>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{new Date(p.effectiveDate).toLocaleDateString()}</div>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.lob}</div>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.status}</div>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.producer}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Quotes tab ── */}
        {detailTab === "quotes" && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-stretch overflow-hidden transition-all"
                style={{ background: c.cardBg, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, borderRadius:10 }}
                onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.12)")} onMouseLeave={e=>(e.currentTarget.style.filter="none")}>
                <input placeholder="Search Quotes" value={detailSearch} onChange={e=>setDetailSearch(e.target.value)}
                  className="outline-none px-4 py-2 text-[13px]"
                  style={{ fontFamily:FONT, background:"transparent", color:c.text, width:200, borderRadius:"10px 0 0 10px" }} />
                <button className="px-5 text-[12px] font-semibold text-white flex-shrink-0"
                  style={{ background:btnGrad, fontFamily:FONT, borderRadius:"0 7px 7px 0" }}>Submit</button>
              </div>
              <div className="relative">
                <select className="appearance-none pl-3 pr-8 py-2 outline-none cursor-pointer"
                  style={{ fontFamily:FONT, background:`linear-gradient(${c.cardBg},${c.cardBg}) padding-box, linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%) border-box`, border:"1px solid transparent", color:c.text, fontSize:11, fontWeight:500, borderRadius:7 }}>
                  <option>Past 20 Days</option><option>Past 60 Days</option><option>Past 90 Days</option><option>All Time</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color:c.muted }} />
              </div>
              <div className="flex items-center gap-1 ml-1" style={{ borderLeft:`1px solid ${c.border}`, paddingLeft:10 }}>
                <button className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-4 h-4"/></button>
                <button className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><LayoutGrid className="w-4 h-4"/></button>
                <button className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><Download className="w-4 h-4"/></button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden flex flex-col flex-1 min-h-0" style={{ background:c.cardBg, border:`1px solid ${c.border}` }}>
              <div className="grid px-5 py-3 gap-4" style={{ gridTemplateColumns:"1.1fr 1.6fr 1.2fr 1fr 1.1fr 1.1fr 1.2fr 1.2fr", borderBottom:`1px solid ${c.border}`, background:mutedBg }}>
                {/* Created */}
                <button onClick={()=>{if(qpSortKey==="createdDate")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("createdDate");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Created<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="createdDate"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="createdDate"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                {/* Submission ID */}
                <button onClick={()=>{if(qpSortKey==="quoteId")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("quoteId");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Submission ID<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="quoteId"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="quoteId"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                {/* Applicant */}
                <div className="relative">
                  <button onClick={()=>{closeAllDropdowns();setApplicantOpen(o=>!o);}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none" style={{fontFamily:FONT,color:applicantFilter.size>0?"#A614C3":c.muted}}>
                    Applicant<span className="inline-flex ml-1"><svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={applicantFilter.size>0?"#A614C3":sub}/></svg></span>
                  </button>
                  {applicantOpen&&(<>
                    <div className="fixed inset-0 z-10" onClick={()=>setApplicantOpen(false)}/>
                    <div className="absolute top-full mt-1 z-30 rounded-xl shadow-lg overflow-hidden min-w-[220px]" style={{background:c.cardBg,border:`1px solid ${c.border}`, left: -50}}>
                      <div className="p-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{background:isDark?"rgba(255,255,255,0.05)":"#F9FAFB",border:`1px solid ${c.border}`}}>
                          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{color:c.muted}}/><input value={applicantSearch} onChange={e=>setApplicantSearch(e.target.value)} placeholder="Search Agent" className="outline-none text-[12px] flex-1 bg-transparent" style={{fontFamily:FONT,color:c.text}}/>
                        </div>
                      </div>
                      <div className="px-3 py-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <button className="flex items-center gap-2 text-[12px] w-full text-left" style={{fontFamily:FONT,color:c.text}} onClick={()=>{const all=uniqueQApplicants;setApplicantFilter(applicantFilter.size===all.length?new Set():new Set(all));}}>
                          <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{applicantFilter.size===uniqueQApplicants.length&&uniqueQApplicants.length>0&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                          Select All
                        </button>
                      </div>
                      <div className="max-h-[180px] overflow-y-auto py-1">
                        {uniqueQApplicants.filter(a=>!applicantSearch||a.toLowerCase().includes(applicantSearch.toLowerCase())).map(applicant=>(
                          <button key={applicant} className="flex items-center gap-2 px-3 py-1.5 text-[12px] w-full text-left transition-colors" style={{fontFamily:FONT,color:c.text}} onMouseEnter={e=>e.currentTarget.style.background=c.hoverBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"} onClick={()=>toggleSet(applicantFilter,applicant,setApplicantFilter)}>
                            <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{applicantFilter.has(applicant)&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                            {applicant}
                          </button>
                        ))}
                      </div>
                      <button onClick={()=>{setApplicantFilter(new Set());setApplicantSearch("");}} className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors" style={{fontFamily:FONT,color:"#A614C3",borderTop:`1px solid ${c.border}`}} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-3.5 h-3.5"/>Reset Filter</button>
                    </div>
                  </>)}
                </div>
                {/* DBA */}
                <button onClick={()=>{if(qpSortKey==="dba")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("dba");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  DBA<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="dba"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="dba"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                {/* Effective */}
                <button onClick={()=>{if(qpSortKey==="effectiveDate")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("effectiveDate");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Effective<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="effectiveDate"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="effectiveDate"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                {/* LOB */}
                <div className="relative">
                  <button onClick={()=>{closeAllDropdowns();setLobOpen(o=>!o);}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none" style={{fontFamily:FONT,color:lobFilter!=="All LOBs"?"#A614C3":c.muted}}>
                    LOB<span className="inline-flex ml-1"><svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={lobFilter!=="All LOBs"?"#A614C3":sub}/></svg></span>
                  </button>
                  {lobOpen&&(<>
                    <div className="fixed inset-0 z-10" onClick={()=>setLobOpen(false)}/>
                    <div className="absolute left-0 top-full mt-1 z-20 rounded-xl shadow-lg overflow-hidden min-w-[200px] max-h-[280px] overflow-y-auto" style={{background:c.cardBg,border:`1px solid ${c.border}`}}>
                      {ALL_LOBS.map(lob=>(
                        <button key={lob} onClick={()=>{setLobFilter(lob);setLobOpen(false);}} className="w-full text-left px-3 py-2 text-[12px] transition-colors flex items-center justify-between gap-2" style={{fontFamily:FONT,color:lobFilter===lob?"#A614C3":c.text,fontWeight:lobFilter===lob?600:400,background:lobFilter===lob?"rgba(168,85,247,0.08)":"transparent"}} onMouseEnter={e=>e.currentTarget.style.background=lobFilter===lob?"rgba(168,85,247,0.12)":c.hoverBg} onMouseLeave={e=>e.currentTarget.style.background=lobFilter===lob?"rgba(168,85,247,0.08)":"transparent"}>
                          <span>{lob}</span>
                          {lobFilter===lob && <svg width="11" height="9" viewBox="0 0 9 7" fill="none" className="flex-shrink-0"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </button>
                      ))}
                    </div>
                  </>)}
                </div>
                {/* Status */}
                <div className="relative">
                  <button onClick={()=>{closeAllDropdowns();setStatusOpen(o=>!o);}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none" style={{fontFamily:FONT,color:statusFilter!=="All Statuses"?"#A614C3":c.muted}}>
                    Status<span className="inline-flex ml-1"><svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={statusFilter!=="All Statuses"?"#A614C3":sub}/></svg></span>
                  </button>
                  {statusOpen&&(<>
                    <div className="fixed inset-0 z-10" onClick={()=>setStatusOpen(false)}/>
                    <div className="absolute left-0 top-full mt-1 z-20 rounded-xl shadow-lg overflow-hidden min-w-[170px]" style={{background:c.cardBg,border:`1px solid ${c.border}`}}>
                      {QUOTE_STATUSES.map(status=>(
                        <button key={status} onClick={()=>{setStatusFilter(status);setStatusOpen(false);}} className="w-full text-left px-3 py-2 text-[12px] transition-colors flex items-center justify-between gap-2" style={{fontFamily:FONT,color:statusFilter===status?"#A614C3":c.text,fontWeight:statusFilter===status?600:400,background:statusFilter===status?"rgba(168,85,247,0.08)":"transparent"}} onMouseEnter={e=>e.currentTarget.style.background=statusFilter===status?"rgba(168,85,247,0.12)":c.hoverBg} onMouseLeave={e=>e.currentTarget.style.background=statusFilter===status?"rgba(168,85,247,0.08)":"transparent"}>
                          <span>{status}</span>
                          {statusFilter===status && <svg width="11" height="9" viewBox="0 0 9 7" fill="none" className="flex-shrink-0"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </button>
                      ))}
                    </div>
                  </>)}
                </div>
                {/* Producer */}
                <div className="relative">
                  <button onClick={()=>{closeAllDropdowns();setProducerOpen(o=>!o);}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none" style={{fontFamily:FONT,color:producerFilter.size>0?"#A614C3":c.muted}}>
                    Producer<span className="inline-flex ml-1"><svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={producerFilter.size>0?"#A614C3":sub}/></svg></span>
                  </button>
                  {producerOpen&&(<>
                    <div className="fixed inset-0 z-10" onClick={()=>setProducerOpen(false)}/>
                    <div className="absolute top-full mt-1 z-30 rounded-xl shadow-lg overflow-hidden min-w-[220px]" style={{background:c.cardBg,border:`1px solid ${c.border}`, left: -50}}>
                      <div className="p-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{background:isDark?"rgba(255,255,255,0.05)":"#F9FAFB",border:`1px solid ${c.border}`}}>
                          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{color:c.muted}}/><input value={producerSearch} onChange={e=>setProducerSearch(e.target.value)} placeholder="Search Agent" className="outline-none text-[12px] flex-1 bg-transparent" style={{fontFamily:FONT,color:c.text}}/>
                        </div>
                      </div>
                      <div className="px-3 py-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <button className="flex items-center gap-2 text-[12px] w-full text-left" style={{fontFamily:FONT,color:c.text}} onClick={()=>{const all=uniqueQProducers;setProducerFilter(producerFilter.size===all.length?new Set():new Set(all));}}>
                          <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{producerFilter.size===uniqueQProducers.length&&uniqueQProducers.length>0&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                          Select All
                        </button>
                      </div>
                      <div className="max-h-[180px] overflow-y-auto py-1">
                        {uniqueQProducers.filter(p=>!producerSearch||p.toLowerCase().includes(producerSearch.toLowerCase())).map(producer=>(
                          <button key={producer} className="flex items-center gap-2 px-3 py-1.5 text-[12px] w-full text-left transition-colors" style={{fontFamily:FONT,color:c.text}} onMouseEnter={e=>e.currentTarget.style.background=c.hoverBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"} onClick={()=>toggleSet(producerFilter,producer,setProducerFilter)}>
                            <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{producerFilter.has(producer)&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                            {producer}
                          </button>
                        ))}
                      </div>
                      <button onClick={()=>{setProducerFilter(new Set());setProducerSearch("");}} className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors" style={{fontFamily:FONT,color:"#A614C3",borderTop:`1px solid ${c.border}`}} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-3.5 h-3.5"/>Reset Filter</button>
                    </div>
                  </>)}
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                {agencyQuotes.length === 0 ? (
                  <div className="flex items-center justify-center py-16 text-[13px]" style={{ fontFamily:FONT, color:c.muted }}>No quotes found</div>
                ) : agencyQuotes.map((q,i,arr) => {
                  const isIncomplete = q.status === "Incomplete";
                  return (
                    <div key={q.id} className="grid px-5 py-3.5 items-center gap-4 transition-colors cursor-pointer"
                      style={{ gridTemplateColumns:"1.1fr 1.6fr 1.2fr 1fr 1.1fr 1.1fr 1.2fr 1.2fr", borderBottom:i!==arr.length-1?`1px solid ${c.border}`:"none", background:isIncomplete?"rgba(245,158,11,0.06)":"transparent", borderLeft:isIncomplete?"3px solid #F59E0B":"3px solid transparent" }}
                      onMouseEnter={e=>(e.currentTarget.style.background=isIncomplete?"rgba(245,158,11,0.10)":c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background=isIncomplete?"rgba(245,158,11,0.06)":"transparent")}>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{new Date(q.createdDate).toLocaleDateString()}</div>
                      <div className="text-[12px] font-semibold" style={{ fontFamily:FONT, color: isDark ? "#4ECDC4" : "#A614C3" }}>{q.quoteId}</div>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.applicant}</div>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.dba||"—"}</div>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.effectiveDate?new Date(q.effectiveDate).toLocaleDateString():"—"}</div>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.lob}</div>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.status}</div>
                      <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.producer}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Users tab ── */}
        {detailTab === "users" && (
          <div className="flex flex-col flex-1 min-h-0" onClick={() => { setUserMenuId(null); setJobTitleOpen(false); }}>
            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
              <div className="flex items-stretch overflow-hidden transition-all"
                style={{ background: c.cardBg, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, borderRadius:10 }}
                onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.12)")} onMouseLeave={e=>(e.currentTarget.style.filter="none")}>
                <input placeholder="Search User" value={userSearch} onChange={e=>setUserSearch(e.target.value)}
                  className="outline-none px-4 py-2 text-[13px]"
                  style={{ fontFamily:FONT, background:"transparent", color:c.text, width:180, borderRadius:"10px 0 0 10px" }} />
                <button className="px-5 text-[12px] font-semibold text-white flex-shrink-0"
                  style={{ background:btnGrad, fontFamily:FONT, borderRadius:"0 7px 7px 0" }}>Submit</button>
              </div>
              <button className="flex items-center gap-1.5 text-[12px] font-semibold text-white transition-all flex-shrink-0"
                style={{ fontFamily:FONT, background:btnGrad, height:37, padding:"9px 16px", borderRadius:10, boxSizing:"border-box" as const }}
                onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.1)")}
                onMouseLeave={e=>(e.currentTarget.style.filter="none")}
                onClick={e=>{e.stopPropagation();setAddUserOpen(true);}}>
                <Plus className="w-3.5 h-3.5" />Add New User
              </button>
              <button className="flex items-center gap-[10px] text-[12px] font-semibold transition-all flex-shrink-0"
                style={{ fontFamily:FONT, height:37, padding:"9px 16px", borderRadius:"5.58px",
                  border: isDark ? "1.04px solid rgba(255,255,255,0.15)" : "1.04px solid #E5E7EB",
                  background: isDark
                    ? "linear-gradient(180deg, rgba(255,255,255,0.10) -0.44%, rgba(192,192,192,0.10) 49.45%, rgba(172,172,172,0.10) 99.33%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.1) -0.44%, rgba(192,192,192,0.1) 49.45%, rgba(172,172,172,0.1) 99.33%), #FFFFFF",
                  color: c.text, boxSizing:"border-box" as const }}
                onMouseEnter={e=>(e.currentTarget.style.background = isDark
                  ? "linear-gradient(180deg, rgba(255,255,255,0.18) -0.44%, rgba(192,192,192,0.18) 49.45%, rgba(172,172,172,0.18) 99.33%)"
                  : "linear-gradient(180deg, rgba(255,255,255,0.15) -0.44%, rgba(192,192,192,0.15) 49.45%, rgba(172,172,172,0.15) 99.33%), #F9FAFB")}
                onMouseLeave={e=>(e.currentTarget.style.background = isDark
                  ? "linear-gradient(180deg, rgba(255,255,255,0.10) -0.44%, rgba(192,192,192,0.10) 49.45%, rgba(172,172,172,0.10) 99.33%)"
                  : "linear-gradient(180deg, rgba(255,255,255,0.1) -0.44%, rgba(192,192,192,0.1) 49.45%, rgba(172,172,172,0.1) 99.33%), #FFFFFF")}
                onClick={e=>{e.stopPropagation();setImportUsersOpen(true);}}>
                <Upload className="w-3.5 h-3.5" style={{ color: teal }} />Import Users
              </button>
              <div className="ml-auto">
                <button className="p-2 rounded-lg transition-colors" style={{ color:teal }}
                  onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0" style={{ border:`1px solid ${c.border}` }}>
              {/* Header */}
              <div className="flex-shrink-0" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFA", borderBottom:`1px solid ${c.border}` }}>
                <div className="grid items-center px-6" style={{ gridTemplateColumns:"150px 290px 1fr 1.8fr 1.3fr 0.4fr 44px", gap:16, height:44 }}>
                  {[
                    { label:"NAME", sort:true, filter:false },
                    { label:"ADMIN", sort:false, filter:false },
                    { label:"JOB TITLE", sort:false, filter:true },
                    { label:"EMAIL", sort:false, filter:false },
                    { label:"PHONE", sort:false, filter:false },
                    { label:"EXT", sort:false, filter:false },
                    { label:"ACTION", sort:false, filter:false },
                  ].map(({ label, sort, filter }) => (
                    filter ? (
                      <div key={label} className="relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setJobTitleOpen(p => !p)}
                          className="flex items-center gap-1 select-none cursor-pointer"
                          style={{ color: jobTitleFilter.size > 0 ? "#A614C3" : c.muted }}>
                          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ fontFamily:FONT }}>{label}</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        {jobTitleOpen && (
                          <div className="absolute left-0 top-8 z-30 w-[240px] rounded-xl shadow-xl overflow-hidden"
                            style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                            <div className="p-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" }}>
                                <Search className="w-3.5 h-3.5" style={{ color: c.muted }} />
                                <input placeholder="Search Title" value={jobTitleSearch} onChange={e => setJobTitleSearch(e.target.value)}
                                  className="flex-1 outline-none text-[12px] bg-transparent" style={{ fontFamily: FONT, color: c.text }} />
                              </div>
                            </div>
                            <div className="py-1.5 max-h-[260px] overflow-y-auto">
                              {JOB_TITLES.filter(t => !jobTitleSearch || t.toLowerCase().includes(jobTitleSearch.toLowerCase())).map(t => {
                                const checked = jobTitleFilter.has(t);
                                return (
                                  <label key={t} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors"
                                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                    <Checkbox checked={checked} onClick={() => { setJobTitleFilter(prev => { const s = new Set(prev); checked ? s.delete(t) : s.add(t); return s; }); }} />
                                    <span className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{t}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <button onClick={() => { setJobTitleFilter(new Set()); setJobTitleSearch(""); }}
                              className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors"
                              style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                              <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div key={label} className={`flex items-center gap-1 select-none ${label === "ADMIN" ? "justify-center" : "justify-start"}`} style={{ cursor: sort ? "pointer" : "default" }}>
                        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ fontFamily:FONT, color:c.muted }}>{label}</span>
                        {sort && <span className="inline-flex opacity-60"><svg width="6" height="9" viewBox="0 0 6 9" fill="none"><path d="M3 1L1 3.5H5L3 1Z" fill={sub}/><path d="M3 8L1 5.5H5L3 8Z" fill={sub}/></svg></span>}
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Rows */}
              <div className="overflow-y-auto flex-1" style={{ background: c.cardBg }}>
                {agencyUsers.length === 0 ? (
                  <div className="flex items-center justify-center py-16 text-[13px]" style={{ fontFamily:FONT, color:c.muted }}>No users found</div>
                ) : agencyUsers.map((u, i, arr) => {
                  const isPrincipal = u.jobTitle === "Principal";
                  return (
                    <div key={u.id}
                      className="grid items-center px-6 cursor-pointer transition-colors relative"
                      style={{ gridTemplateColumns:"150px 290px 1fr 1.8fr 1.3fr 0.4fr 44px", gap:16, height:60,
                        borderBottom: i !== arr.length-1 ? `1px solid ${c.border}` : "none" }}
                      onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>

                      {/* Principal indicator — absolute so it doesn't shift grid */}
                      {isPrincipal && (
                        <div className="absolute left-0 top-0 bottom-0 rounded-l-sm" style={{ width:3, background:teal }} />
                      )}

                      {/* Name */}
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold truncate" style={{ fontFamily:FONT, color:c.text }}>{u.name}</div>
                      </div>

                      {/* Admin */}
                      <div className="flex items-center justify-center">
                        {u.isAdmin
                          ? <UserCog className="w-[18px] h-[18px]" style={{ color:teal }}/>
                          : <Users   className="w-[18px] h-[18px]" style={{ color:c.muted }}/>
                        }
                      </div>

                      {/* Job title */}
                      <div className="text-[13px] text-left" style={{ fontFamily:FONT, color:c.text }}>{u.jobTitle || "—"}</div>

                      {/* Email */}
                      <div className="text-[13px] truncate text-left" style={{ fontFamily:FONT, color:c.muted }}>{u.email}</div>

                      {/* Phone */}
                      <div className="text-[13px] text-left" style={{ fontFamily:FONT, color:c.text }}>{u.phone || "—"}</div>

                      {/* Ext */}
                      <div className="text-[13px] text-left" style={{ fontFamily:FONT, color:c.muted }}>{u.ext || "—"}</div>

                      {/* Action */}
                      <div className="relative flex justify-center" onClick={e=>e.stopPropagation()}>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color:c.muted }}
                          onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                          onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                          onClick={()=>setUserMenuId(userMenuId===u.id?null:u.id)}>
                          <MoreVertical className="w-4 h-4"/>
                        </button>
                        {userMenuId === u.id && (
                          <div className="absolute right-0 top-9 z-20 rounded-xl shadow-xl py-1.5 min-w-[150px]"
                            style={{ background:isDark?"#1E2240":c.cardBg, border:`1px solid ${c.border}` }}>
                            {["Edit User","Reset Password","Deactivate","Remove"].map(action => (
                              <button key={action} className="w-full text-left px-4 py-2 text-[12px] transition-colors"
                                style={{ fontFamily:FONT, color:action==="Remove"?"#EF4444":c.text }}
                                onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                                onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      {/* ── Add User Modal ── */}
      {addUserOpen && (() => {
        const fieldBg   = isDark ? "rgba(255,255,255,0.06)" : "#fff";
        const fieldBorder = isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #E5E7EB";
        const labelColor  = isDark ? "#D1D5DB" : "#374151";
        const inputStyle  = { fontFamily:FONT, background:fieldBg, border:fieldBorder, color:c.text } as React.CSSProperties;
        const labelStyle  = { fontFamily:FONT, color:labelColor } as React.CSSProperties;
        const dropdownBg  = isDark ? "#1E2240" : "#fff";
        const closeAll    = () => { setAuJobOpen(false); setAuStatusOpen(false); setAuStateOpen(false); };

        const Field = ({ label, children }: { label:string; children:React.ReactNode }) => (
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>{label}</label>
            {children}
          </div>
        );

        const TextInput = ({ value, onChange, placeholder }: { value:string; onChange:(v:string)=>void; placeholder?:string }) => (
          <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-colors"
            style={{ ...inputStyle, boxSizing:"border-box" as const }} />
        );

        const DropTrigger = ({ label, open, onClick }: { label:string; open:boolean; onClick:()=>void }) => (
          <button onClick={e=>{e.stopPropagation();onClick();}}
            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] flex items-center justify-between transition-colors"
            style={{ ...inputStyle, color: label ? c.text : c.muted, boxSizing:"border-box" as const,
              border: fieldBorder }}>
            <span>{label}</span>
            <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color:c.muted }} />
          </button>
        );

        const DropList = ({ items, selected, onSelect, disabledReasons }: { items:string[]; selected:string; onSelect:(v:string)=>void; disabledReasons?: Record<string,string> }) => (
          <div className="absolute left-0 right-0 top-full mt-1 rounded-xl overflow-y-auto z-20"
            style={{ background:dropdownBg, boxShadow:"0 8px 24px rgba(0,0,0,0.18)", border:`1px solid ${c.border}`, maxHeight:200 }}>
            {items.map(item => {
              const disabledReason = disabledReasons?.[item];
              const disabled = !!disabledReason;
              return (
                <button key={item} onClick={e=>{e.stopPropagation(); if (!disabled) onSelect(item);}}
                  title={disabledReason}
                  disabled={disabled}
                  className="w-full text-left px-4 py-2.5 text-[13px] transition-colors"
                  style={{ fontFamily:FONT, color: disabled ? c.muted : c.text, background:selected===item?(isDark?"rgba(255,255,255,0.08)":"#F9FAFB"):"transparent", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1 }}
                  onMouseEnter={e=>{ if (!disabled) e.currentTarget.style.background=isDark?"rgba(255,255,255,0.08)":"#F9FAFB"; }}
                  onMouseLeave={e=>(e.currentTarget.style.background=selected===item?(isDark?"rgba(255,255,255,0.08)":"#F9FAFB"):"transparent")}>
                  <div className="flex items-center justify-between gap-2">
                    <span>{item}</span>
                    {disabledReason && <span className="text-[10px] italic flex-shrink-0" style={{ color: c.muted }}>{disabledReason}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        );

        const hasPrincipal = agencyUsers.some(u => u.jobTitle === "Principal");
        const jobTitleDisabled: Record<string,string> = hasPrincipal ? { "Principal": "Only 1 allowed" } : {};

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background:"rgba(0,0,0,0.45)" }}
            onClick={()=>{ setAddUserOpen(false); closeAll(); }}>
            <div className="rounded-2xl w-[620px] max-w-[95vw] max-h-[92vh] flex flex-col"
              style={{ background:isDark?"#1E2240":"#fff", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}
              onClick={e=>{ e.stopPropagation(); closeAll(); }}>

              {/* Header */}
              <div className="flex items-center justify-between px-8 pt-7 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
                <h2 className="text-[20px] font-semibold" style={{ fontFamily:FONT, color:c.text }}>Add User</h2>
                <button onClick={()=>{ setAddUserOpen(false); closeAll(); }}
                  className="p-1.5 rounded-lg transition-colors" style={{ color:c.muted }}
                  onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <X className="w-5 h-5"/>
                </button>
              </div>

              {/* Scrollable body */}
              <div className="px-8 pt-5 overflow-y-auto flex-1 space-y-4 pb-2">

                {/* Row: First Name, Last Name, Admin toggle */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>First Name</label>
                    <TextInput value={auFirstName} onChange={setAuFirstName} placeholder="First name" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Last Name</label>
                    <TextInput value={auLastName} onChange={setAuLastName} placeholder="Last name" />
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl flex-shrink-0 self-end"
                    style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC" }}>
                    <span className="text-[13px] font-medium" style={{ fontFamily:FONT, color:c.text }}>Admin</span>
                    <button onClick={e=>{e.stopPropagation();setAuIsAdmin(!auIsAdmin);}}
                      className="w-11 h-6 rounded-full relative transition-all flex-shrink-0"
                      style={{ background: auIsAdmin ? "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" : "#D1D5DB" }}>
                      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                        style={{ left:auIsAdmin?"22px":"2px" }} />
                    </button>
                  </div>
                </div>

                {/* Admin Level — only enabled when admin toggle is on */}
                <div style={{ opacity: auIsAdmin ? 1 : 0.4, transition:"opacity 0.2s", pointerEvents: auIsAdmin ? "auto" : "none" }}>
                  <Field label="Admin Level">
                    <div className="relative" onClick={e => e.stopPropagation()}>
                      {(() => {
                        const levels: [string, React.ComponentType<{className?:string;style?:React.CSSProperties}>][] = [
                          ["Read-Only Admin", Eye as never],
                          ["Agency Support Admin", Headphones as never],
                          ["Super Admin", Crown as never],
                        ];
                        const currentIcon = levels.find(([n])=>n===auAdminLevel)?.[1];
                        const CI = currentIcon;
                        return (<>
                          <button type="button" onClick={() => setAuAdminLevelOpen(p=>!p)}
                            disabled={!auIsAdmin}
                            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] outline-none"
                            style={{ ...inputStyle, color:auAdminLevel?c.text:c.muted, cursor: auIsAdmin ? "pointer" : "not-allowed", textAlign: "left" }}>
                            {CI && <CI className="w-4 h-4" style={{ color: c.muted }} />}
                            <span className="flex-1">{auAdminLevel || "Select Level..."}</span>
                            <ChevronDown className="w-4 h-4" style={{ color:c.muted }} />
                          </button>
                          {auAdminLevelOpen && (
                            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 rounded-xl shadow-xl py-2"
                              style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                              {levels.map(([name, Ic]) => (
                                <button key={name} type="button" onClick={() => { setAuAdminLevel(name); setAuAdminLevelOpen(false); }}
                                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] transition-colors"
                                  style={{ fontFamily: FONT, color: c.text, background: auAdminLevel === name ? (isDark ? "rgba(168,85,247,0.08)" : "rgba(168,85,247,0.06)") : "transparent" }}
                                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                  onMouseLeave={e => (e.currentTarget.style.background = auAdminLevel === name ? (isDark ? "rgba(168,85,247,0.08)" : "rgba(168,85,247,0.06)") : "transparent")}>
                                  <Ic className="w-4 h-4 flex-shrink-0" style={{ color: c.muted }} />
                                  <span>{name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </>);
                      })()}
                    </div>
                  </Field>
                </div>

                {/* Row: Job Title + Status */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Job Title</label>
                    <DropTrigger label={auJobTitle} open={auJobOpen} onClick={()=>{ setAuJobOpen(!auJobOpen); setAuStatusOpen(false); setAuStateOpen(false); }} />
                    {auJobOpen && <DropList items={JOB_TITLES} selected={auJobTitle} onSelect={v=>{setAuJobTitle(v);setAuJobOpen(false);}} disabledReasons={jobTitleDisabled} />}
                  </div>
                  <div className="flex-1 relative">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Status</label>
                    <DropTrigger label={auStatus} open={auStatusOpen} onClick={()=>{ setAuStatusOpen(!auStatusOpen); setAuJobOpen(false); setAuStateOpen(false); }} />
                    {auStatusOpen && <DropList items={USER_STATUSES} selected={auStatus} onSelect={v=>{setAuStatus(v);setAuStatusOpen(false);}} />}
                  </div>
                </div>

                {/* Row: Phone + Ext */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Phone</label>
                    <TextInput value={auPhone} onChange={setAuPhone} placeholder="(888) 888-8888" />
                  </div>
                  <div style={{ width:140 }}>
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Ext</label>
                    <TextInput value={auExt} onChange={setAuExt} placeholder="175" />
                  </div>
                </div>

                {/* Row: Mobile Phone + SMS */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Mobile Phone</label>
                    <TextInput value={auMobile} onChange={setAuMobile} placeholder="(888) 888-8888" />
                  </div>
                  <button onClick={e=>{e.stopPropagation();setAuSms(!auSms);}}
                    className="flex items-center gap-2 pb-2.5 flex-shrink-0 transition-opacity"
                    style={{ fontFamily:FONT, color:c.text, fontSize:13 }}>
                    <span className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ border:`1.5px solid ${auSms?"#4ECDC4":"#D1D5DB"}`, background:auSms?"#4ECDC4":"transparent" }}>
                      {auSms && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </span>
                    I agree to receive SMS texts
                  </button>
                </div>

                {/* Email */}
                <Field label="Email">
                  <TextInput value={auEmail} onChange={setAuEmail} placeholder="Email@gmail.com" />
                </Field>

                {/* Address */}
                <Field label="Address">
                  <TextInput value={auAddress} onChange={setAuAddress} placeholder="123 Main Street" />
                </Field>

                {/* Row: City, State, Zip */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>City</label>
                    <TextInput value={auCity} onChange={setAuCity} placeholder="Anytown" />
                  </div>
                  <div className="flex-1 relative">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>State</label>
                    <DropTrigger label={auState} open={auStateOpen} onClick={()=>{ setAuStateOpen(!auStateOpen); setAuJobOpen(false); setAuStatusOpen(false); }} />
                    {auStateOpen && <DropList items={US_STATES} selected={auState} onSelect={v=>{setAuState(v);setAuStateOpen(false);}} />}
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Zip Code</label>
                    <TextInput value={auZip} onChange={setAuZip} placeholder="21354" />
                  </div>
                </div>

                {/* Info note */}
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{ background:isDark?"rgba(255,255,255,0.03)":"#fff", border:`1px solid ${c.border}` }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5"/>
                    <line x1="12" y1="12" x2="12" y2="16"/>
                  </svg>
                  <span className="text-[13px]" style={{ fontFamily:FONT, color:c.muted }}>An email will be sent to the user.</span>
                </div>

              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-8 py-5 flex-shrink-0">
                <button
                  className="px-[17px] py-[9px] rounded-lg text-[12px] font-normal transition-colors"
                  style={{ fontFamily:FONT, border:`1px solid #E5E7EB`, color:"#090D11", background:"linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(192,192,192,0.10), rgba(172,172,172,0.10))" }}
                  onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                  onMouseLeave={e=>(e.currentTarget.style.background="linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(192,192,192,0.10), rgba(172,172,172,0.10))")}
                  onClick={()=>{ setAddUserOpen(false); closeAll(); }}>
                  Cancel Changes
                </button>
                <button
                  className="text-[13px] font-semibold text-white transition-all"
                  style={{ fontFamily:FONT, background:btnGrad, padding:"10px 32px", borderRadius:"8px" }}
                  onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.12)")}
                  onMouseLeave={e=>(e.currentTarget.style.filter="none")}
                  onClick={()=>{ setAddUserOpen(false); closeAll(); }}>
                  Save
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ── Edit Agency Contact Modal (admin) ── */}
      {contactCardEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setContactCardEditing(false)}>
          <div className="rounded-2xl w-[440px] max-w-[95vw] overflow-hidden"
            style={{ background: c.cardBg, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: `1px solid ${c.border}` }}>
              <h3 className="text-[16px] font-bold" style={{ fontFamily: FONT, color: c.text }}>Edit Agency Contact</h3>
              <button onClick={() => setContactCardEditing(false)} className="p-1 rounded-md transition-colors" style={{ color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ fontFamily: FONT, color: c.text }}>Contact Name</label>
                <input value={eContact} onChange={e => setEContact(e.target.value)} placeholder="Full name"
                  className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                  style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }}
                  onFocus={e => e.currentTarget.style.borderColor = "#A855F7"}
                  onBlur={e => e.currentTarget.style.borderColor = c.border} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ fontFamily: FONT, color: c.text }}>Phone</label>
                <input value={eContactPhone} onChange={e => setEContactPhone(e.target.value)} placeholder="(000) 000-0000"
                  className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                  style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }}
                  onFocus={e => e.currentTarget.style.borderColor = "#A855F7"}
                  onBlur={e => e.currentTarget.style.borderColor = c.border} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ fontFamily: FONT, color: c.text }}>Email</label>
                <input value={eEmail} onChange={e => setEEmail(e.target.value)} placeholder="email@example.com"
                  className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                  style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }}
                  onFocus={e => e.currentTarget.style.borderColor = "#A855F7"}
                  onBlur={e => e.currentTarget.style.borderColor = c.border} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 px-6 py-4" style={{ borderTop: `1px solid ${c.border}` }}>
              <button onClick={() => setContactCardEditing(false)}
                className="px-[17px] py-[9px] rounded-lg text-[12px] font-normal transition-colors"
                style={{ fontFamily: FONT, border: `1px solid #E5E7EB`, color: "#090D11", background: "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(192,192,192,0.10), rgba(172,172,172,0.10))" }}>
                Cancel
              </button>
              <button onClick={() => setContactCardEditing(false)}
                className="px-[17px] py-[9px] rounded-lg text-[12px] font-semibold text-white transition-all"
                style={{ fontFamily: FONT, background: btnGrad }}
                onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Contact Request Modal (non-admin) ── */}
      {contactRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => { setContactRequestOpen(false); setContactRequestSent(false); }}>
          <div className="rounded-2xl w-[460px] max-w-[95vw] overflow-hidden"
            style={{ background: c.cardBg, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: `1px solid ${c.border}` }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(168,85,247,0.10)" }}>
                  <Lock className="w-4 h-4" style={{ color: "#A855F7" }} />
                </div>
                <h2 className="text-[16px] font-bold" style={{ fontFamily: FONT, color: c.text }}>Request Contact Update</h2>
              </div>
              <button onClick={() => { setContactRequestOpen(false); setContactRequestSent(false); }}
                className="p-1.5 rounded-lg transition-colors" style={{ color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              {contactRequestSent ? (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: "rgba(115,201,183,0.15)" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 7" stroke="#73C9B7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <p className="text-[14px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.text }}>Request submitted</p>
                  <p className="text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>An admin will review and approve your change.</p>
                </div>
              ) : (<>
                <p className="text-[12px] mb-4 leading-relaxed" style={{ fontFamily: FONT, color: c.muted }}>
                  You don't have permission to edit the agency contact. Submit the new contact info below and an admin will review.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5" style={{ fontFamily: FONT, color: c.text }}>Contact Name</label>
                    <input value={requestedName} onChange={e => setRequestedName(e.target.value)} placeholder="Full name"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5" style={{ fontFamily: FONT, color: c.text }}>Phone</label>
                    <input value={requestedPhone} onChange={e => setRequestedPhone(e.target.value)} placeholder="(000) 000-0000"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5" style={{ fontFamily: FONT, color: c.text }}>Email</label>
                    <input value={requestedEmail} onChange={e => setRequestedEmail(e.target.value)} placeholder="email@example.com"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} />
                  </div>
                </div>
              </>)}
            </div>
            {!contactRequestSent && (
              <div className="flex items-center justify-between gap-2 px-6 py-4" style={{ borderTop: `1px solid ${c.border}` }}>
                <button onClick={() => setContactRequestOpen(false)}
                  className="px-[17px] py-[9px] rounded-lg text-[12px] font-normal transition-colors"
                  style={{ fontFamily: FONT, border: `1px solid #E5E7EB`, color: "#090D11", background: "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(192,192,192,0.10), rgba(172,172,172,0.10))" }}>
                  Cancel
                </button>
                <button onClick={() => { setContactRequestSent(true); setTimeout(() => { setContactRequestOpen(false); setContactRequestSent(false); }, 1800); }}
                  className="px-[17px] py-[9px] rounded-lg text-[12px] font-semibold text-white transition-all"
                  style={{ fontFamily: FONT, background: btnGrad }}
                  onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
                  onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                  Submit Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Import Users Modal ── */}
      {importUsersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background:"rgba(0,0,0,0.45)" }}
          onClick={()=>setImportUsersOpen(false)}>
          <div className="rounded-2xl w-[600px] max-w-[90vw] overflow-hidden"
            style={{ background:isDark?"#1E2240":"#fff", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}
            onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-8 pt-7 pb-5" style={{ borderBottom:`1px solid ${c.border}` }}>
              <h2 className="text-[20px] font-bold" style={{ fontFamily:FONT, color:c.text }}>Bulk Upload Users</h2>
              <button onClick={()=>setImportUsersOpen(false)} className="p-1.5 rounded-lg transition-colors" style={{ color:c.muted }}
                onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="px-8 py-6 space-y-4">
              {/* CSV format info */}
              <div className="rounded-xl p-5" style={{ border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.03)":"#F9FAFB" }}>
                <p className="text-[14px] font-bold mb-2" style={{ fontFamily:FONT, color:c.text }}>CSV File Format</p>
                <p className="text-[13px] mb-2" style={{ fontFamily:FONT, color:c.muted }}>Please upload a CSV file with the following columns (header row required):</p>
                <p className="text-[13px] font-mono mb-3 px-2 py-1 rounded-md inline-block" style={{ color:"#A614C3", background: isDark ? "rgba(168,85,247,0.10)" : "rgba(168,85,247,0.08)" }}>Name, Role, Job Title, Email, Phone, Ext</p>
                <p className="text-[13px]" style={{ fontFamily:FONT, color:c.muted }}>Example: John Doe, Admin, Manager, john@example.com, 555-1234, 123</p>
              </div>

              {/* Download button */}
              <a href="data:text/csv;charset=utf-8,Name%2CRole%2CJob%20Title%2CEmail%2CPhone%2CExt%0AJohn%20Doe%2CAdmin%2CManager%2Cjohn%40example.com%2C555-1234%2C123"
                download="users_template.csv"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[13px] font-semibold transition-all"
                style={{ fontFamily:FONT, border:`1.5px solid rgba(168,85,247,0.35)`, color:"#A614C3", background:"transparent", textDecoration:"none" }}
                onMouseEnter={e=>(e.currentTarget.style.background="rgba(168,85,247,0.06)")}
                onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                <FileText className="w-4 h-4"/>Download Template CSV
              </a>

              {/* Upload area — gray dashed, white bg */}
              <div className="rounded-xl flex flex-col items-center justify-center py-12 cursor-pointer transition-all"
                style={{ border:`1.5px dashed ${isDark?"rgba(255,255,255,0.2)":"#D1D5DB"}`, background:isDark?"rgba(255,255,255,0.02)":"#fff" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor = "rgba(168,85,247,0.45)"; e.currentTarget.style.background = "rgba(168,85,247,0.04)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor = isDark?"rgba(255,255,255,0.2)":"#D1D5DB"; e.currentTarget.style.background = isDark?"rgba(255,255,255,0.02)":"#fff"; }}>
                <svg className="mb-3" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#A614C3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                <p className="text-[14px] font-semibold mb-1" style={{ fontFamily:FONT, color:c.text }}>Click to upload or drag and drop</p>
                <p className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>CSV files only</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Add New Agency Form ────────────────────────────────────────────────── */
const AFFILIATIONS = [
  "AAA/ACG (AC364)","Acceptance (TI091)","Acrisure","Affordable American Insurance",
  "American Family (AM102)","ASNOA (AL335)","Brown & Brown Insurance","BTIS",
  "Dream Insurance (IN432)","EPIC Insurance Brokers & Consultants","Farmers","Fiesta Insurance (FI062)",
  "First Choice Agents Alliance","First Connect Insurance Services (FI475)","Foundation Risk Partners","GlobalGreen Insurance Agency",
  "Green Path","Horizon Agency Systems (RC021)","HUB International Limited","IMSG/Insurance Market Solutions Group",
  "Insurance Alliance Network","InterWest Insurance Services","IronPeak","ISU",
  "Join the Brokers","LTA Marketing Group (LT006)","Nationwide","New Age Underwriters Agency Inc",
  "NowCerts (NO147)","Pacific Crest (PA004)","Pacwest Alliance","PIIB",
  "Premier Group (PR196)","Reliable Insurance","Renaissance Alliance","SIAA",
  "Smart Choice","The Agency Collective","TWFG (TW037)","United Agencies",
  "United Valley","Victor",
];
const WORKERS_COMP = [
  "AIG","AmTrust","Clear Spring","CNA","CNA2.0","Cornerstone","Employers","Great American",
  "GUARD","ICW Group","LIBERTYMUTUAL","Pie","Travelers","Zenith",
];

function AddAgencyForm({ isDark, onCancel, c, btnGrad, FONT }: {
  isDark: boolean; onCancel: () => void;
  c: Record<string, string>; btnGrad: string; FONT: string;
}) {
  const [agencyName, setAgencyName]   = useState("");
  const [agencyCode, setAgencyCode]   = useState("");
  const [agencyType, setAgencyType]   = useState<"Retail"|"Wholesale">("Retail");
  const [country, setCountry]         = useState("United States of America");
  const [street, setStreet]           = useState("");
  const [city, setCity]               = useState("");
  const [stateVal, setStateVal]       = useState("");
  const [zip, setZip]                 = useState("");
  const [sameAddress, setSameAddress] = useState(true);
  const [mCountry, setMCountry]       = useState("United States of America");
  const [mStreet, setMStreet]         = useState("");
  const [mCity, setMCity]             = useState("");
  const [mState, setMState]           = useState("");
  const [mZip, setMZip]               = useState("");
  const [status, setStatus]           = useState("Appointed");
  const [apptDate, setApptDate]       = useState("03/24/2026");
  const [contact, setContact]         = useState("");
  const [email, setEmail]             = useState("");
  const [bizType, setBizType]         = useState("");
  const [taxId, setTaxId]             = useState("");
  const [website, setWebsite]         = useState("");
  const [phone, setPhone]             = useState("");
  const [tollFree, setTollFree]       = useState("");
  const [licenseNo, setLicenseNo]     = useState("");
  const [licenseExp, setLicenseExp]   = useState("03/24/2026");
  const [eoPolicyNo, setEoPolicyNo]   = useState("");
  const [eoExp, setEoExp]             = useState("03/24/2026");
  const [agencyBill, setAgencyBill]   = useState(true);
  const [directBill, setDirectBill]   = useState(true);
  const [premiumFin, setPremiumFin]   = useState(true);
  const [affiliations, setAffiliations] = useState<Set<string>>(new Set(["AAA/ACG (AC364)"]));
  const [workersComp, setWorkersComp]   = useState<Set<string>>(new Set(["AIG"]));
  const [note, setNote]               = useState("");
  const [notes, setNotes]             = useState<string[]>([]);

  const font = { fontFamily: FONT };

  const inputStyle: React.CSSProperties = {
    fontFamily: FONT, color: c.text, background: c.cardBg,
    border: `1px solid ${c.borderStrong}`, borderRadius: 14,
    padding: "14px 16px", fontSize: 13, outline: "none", width: "100%",
    height: 50, boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: FONT, fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 10, display: "block",
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle, appearance: "none", cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
  };

  const Radio = ({ checked, onClick }: { checked: boolean; onClick: () => void }) => (
    <button onClick={onClick} className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 transition-all"
      style={{ border: `2px solid ${checked ? "#8B3DD4" : "#D1D5DB"}`, background: "transparent" }}>
      {checked && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" }} />}
    </button>
  );

  const Checkbox = ({ checked, onClick }: { checked: boolean; onClick: () => void; color?: string }) => (
    <button onClick={onClick} className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0 transition-all"
      style={{
        border: checked ? "none" : `1.5px solid ${c.borderStrong}`,
        background: checked ? "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" : c.cardBg,
      }}>
      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </button>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="mt-8 mb-4 pb-2" style={{ borderBottom: `1px solid ${c.border}` }}>
      <h3 className="text-[15px] font-bold" style={{ ...font, color: c.text }}>{title}</h3>
    </div>
  );

  const AddressBlock = ({ prefix, vals, setters }: {
    prefix: string;
    vals: { country: string; street: string; city: string; state: string; zip: string };
    setters: { country: (v:string)=>void; street: (v:string)=>void; city: (v:string)=>void; state: (v:string)=>void; zip: (v:string)=>void };
  }) => (
    <div className="space-y-3">
      {/* Row 1: Country | Street (spans 2 cols) */}
      <div className="grid grid-cols-3 gap-6">
        <select value={vals.country} onChange={e => setters.country(e.target.value)}
          autoComplete="country-name"
          style={{ ...selectStyle, opacity: (prefix === "m" && sameAddress) ? 0.5 : 1 }}
          disabled={prefix === "m" && sameAddress}>
          <option>United States of America</option><option>Canada</option><option>Mexico</option>
        </select>
        <div className="col-span-2">
          <AddressAutocomplete
            value={vals.street}
            onChange={setters.street}
            onSelect={a => {
              setters.street(a.street);
              if (a.city) setters.city(a.city);
              if (a.state) setters.state(a.state);
              if (a.zip) setters.zip(a.zip);
              if (a.country) setters.country(a.country);
            }}
            placeholder="Street address"
            containerStyle={{ width: "100%", opacity: (prefix === "m" && sameAddress) ? 0.5 : 1 }}
            inputStyle={{ ...inputStyle, width: "100%" }}
            disabled={prefix === "m" && sameAddress}
            dropdownBg={c.cardBg} dropdownText={c.text} dropdownBorder={c.border}
          />
        </div>
      </div>
      {/* Row 2: City | State | ZIP */}
      <div className="grid grid-cols-3 gap-6">
        <input value={vals.city} onChange={e => setters.city(e.target.value)} placeholder="City"
          autoComplete="address-level2"
          style={{ ...inputStyle, opacity: (prefix === "m" && sameAddress) ? 0.5 : 1 }}
          disabled={prefix === "m" && sameAddress} />
        <select value={vals.state} onChange={e => setters.state(e.target.value)}
          autoComplete="address-level1"
          style={{ ...selectStyle, opacity: (prefix === "m" && sameAddress) ? 0.5 : 1 }}
          disabled={prefix === "m" && sameAddress}>
          {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s => <option key={s}>{s}</option>)}
        </select>
        <input value={vals.zip} onChange={e => setters.zip(e.target.value)} placeholder="ZIP"
          autoComplete="postal-code"
          style={{ ...inputStyle, opacity: (prefix === "m" && sameAddress) ? 0.5 : 1 }}
          disabled={prefix === "m" && sameAddress} />
      </div>
    </div>
  );

  const mailingVals = sameAddress
    ? { country, street, city, state: stateVal, zip }
    : { country: mCountry, street: mStreet, city: mCity, state: mState, zip: mZip };

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: FONT }}>
      {/* Form card + breadcrumb scroll together */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* Breadcrumb */}
        <div className="pb-2 mb-3 flex items-center gap-2" style={{ marginLeft: -48, marginRight: -48, paddingLeft: 48, paddingRight: 48, paddingTop: 12 }}>
          <button onClick={onCancel} className="flex items-center gap-1.5 transition-all" style={{ color: c.muted }}
            onMouseEnter={e => (e.currentTarget.style.color = c.text)}
            onMouseLeave={e => (e.currentTarget.style.color = c.muted)}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[13px]" style={{ color: c.muted }}>Admin Tasks</span>
          <span style={{ color: c.muted }}>/</span>
          <span className="text-[13px] font-semibold" style={{ color: c.text }}>Add New</span>
        </div>
        <form autoComplete="on" onSubmit={e => e.preventDefault()}>
        <div className="rounded-2xl p-8 mb-6" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-bold" style={{ ...font, color: c.text }}>Add New Agency Information</h2>
            <button onClick={onCancel} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
              style={{ ...font, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, color: "#090D11" }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <Pencil className="w-3.5 h-3.5" />Cancel Edit
            </button>
          </div>

          {/* Row 1: Name | Code | Type */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Agency Name:</label>
              <input value={agencyName} onChange={e => setAgencyName(e.target.value)} placeholder="Agency name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Agency Code:</label>
              <div className="flex" style={{ gap: 10 }}>
                <input value={agencyCode} onChange={e => setAgencyCode(e.target.value)} placeholder="Code" style={{ ...inputStyle, flex: 1 }} />
                <button type="button" onClick={() => setAgencyCode(generateAgencyCode())}
                  className="flex items-center justify-center gap-2 flex-shrink-0 transition-all"
                  style={{ ...font, background: isDark ? c.cardBg : "#FFFFFF", border: `1px solid ${c.borderStrong}`, borderRadius: 14, height: 50, width: 140, whiteSpace: "nowrap", boxSizing: "border-box" }}
                  onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#F9FAFB")}
                  onMouseLeave={e => (e.currentTarget.style.background = isDark ? c.cardBg : "#FFFFFF")}>
                  <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#7C3AED" }} />
                  <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 13, fontWeight: 600 }}>Create Code</span>
                </button>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Agency Type:</label>
              <div className="flex" style={{ gap: 10 }}>
                {(["Retail","Wholesale"] as const).map(t => {
                  const active = agencyType === t;
                  return (
                    <button key={t} onClick={() => setAgencyType(t)}
                      className="flex items-center gap-2 justify-center transition-all"
                      style={{ ...font, fontSize: 13, fontWeight: 600, width: 186, height: 50, borderRadius: 14, boxSizing: "border-box",
                        border: "1.65px solid transparent",
                        backgroundImage: active
                          ? `linear-gradient(88.54deg, rgba(92,46,212,0.06) 0.1%, rgba(166,20,195,0.06) 63.88%), linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)`
                          : `linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(#E5E7EB, #E5E7EB)`,
                        backgroundOrigin: "padding-box, padding-box, border-box",
                        backgroundClip: "padding-box, padding-box, border-box",
                      }}>
                      <Radio checked={active} onClick={() => setAgencyType(t)} />
                      {active
                        ? <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t}</span>
                        : <span style={{ color: "#6B7280" }}>{t}</span>
                      }
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Agency Address */}
          <div className="mb-4">
            <label style={{ ...labelStyle, marginBottom: 12 }}>Agency Address:</label>
            <AddressBlock prefix="a" vals={{ country, street, city, state: stateVal, zip }}
              setters={{ country: setCountry, street: setStreet, city: setCity, state: setStateVal, zip: setZip }} />
          </div>

          {/* Mailing Address */}
          <div className="mb-6">
            <label style={{ ...labelStyle, marginBottom: 8 }}>Mailing Address:</label>
            <div className="flex items-center gap-2 mb-3">
              <Checkbox checked={sameAddress} onClick={() => setSameAddress(p => !p)} />
              <span className="text-[13px] font-semibold" style={{ ...font, color: c.text }}>Same as Agency Address</span>
            </div>
            <AddressBlock prefix="m" vals={sameAddress ? { country, street, city, state: stateVal, zip } : { country: mCountry, street: mStreet, city: mCity, state: mState, zip: mZip }}
              setters={{ country: setMCountry, street: setMStreet, city: setMCity, state: setMState, zip: setMZip }} />
          </div>

          {/* Status + Appt Date */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Status:</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
                <option>Appointed</option><option>Unappointed</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Appt. Date</label>
              <DatePicker value={apptDate} onChange={setApptDate} inputStyle={inputStyle} c={c as any} btnGrad={btnGrad} font={font} />
            </div>
            <div />
          </div>

          {/* Agency Contact + Email */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Agency Contact:</label>
              <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email Address:</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={inputStyle} type="email" />
            </div>
          </div>

          {/* Business Type | Tax ID | Website */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Type of Business:</label>
              <select value={bizType} onChange={e => setBizType(e.target.value)} style={selectStyle}>
                <option value="">-Business Type</option><option>LLC</option><option>Corporation</option><option>Sole Proprietor</option><option>Partnership</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tax ID:</label>
              <input value={taxId} onChange={e => setTaxId(e.target.value)} placeholder="Tax ID" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Website Url:</label>
              <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://" style={inputStyle} />
            </div>
          </div>

          {/* Phone | Toll Free */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Phone Number:</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(000) 000-0000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Toll Free Number:</label>
              <input value={tollFree} onChange={e => setTollFree(e.target.value)} placeholder="(000) 000-0000" style={inputStyle} />
            </div>
            <div />
          </div>

          {/* License + Expiry */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>License Number:</label>
              <input value={licenseNo} onChange={e => setLicenseNo(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Expiration Date:</label>
              <DatePicker value={licenseExp} onChange={setLicenseExp} inputStyle={inputStyle} c={c as any} btnGrad={btnGrad} font={font} />
            </div>
            <div />
          </div>

          {/* E&O Policy + Expiry */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>E&O Policy #:</label>
              <input value={eoPolicyNo} onChange={e => setEoPolicyNo(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Expiration Date:</label>
              <DatePicker value={eoExp} onChange={setEoExp} inputStyle={inputStyle} c={c as any} btnGrad={btnGrad} font={font} />
            </div>
            <div />
          </div>

          {/* Agency Bill | Direct Bill | Premium Finance */}
          <div className="grid grid-cols-3 gap-6 mb-2">
            {([
              ["Agency Bill:", agencyBill, setAgencyBill],
              ["Direct Bill:", directBill, setDirectBill],
              ["Premium Finance:", premiumFin, setPremiumFin],
            ] as [string, boolean, (v:boolean)=>void][]).map(([label, val, set]) => (
              <div key={label}>
                <label style={labelStyle}>{label}</label>
                <div className="flex" style={{ gap: 10 }}>
                  {([["Yes", true],["No", false]] as [string, boolean][]).map(([opt, bool]) => {
                    const active = val === bool;
                    return (
                      <button key={opt} onClick={() => set(bool)}
                        className="flex items-center gap-2 justify-center transition-all"
                        style={{ ...font, height: 50, flex: 1, borderRadius: 14, boxSizing: "border-box",
                          border: "1.65px solid transparent",
                          backgroundImage: active
                            ? `linear-gradient(88.54deg, rgba(92,46,212,0.06) 0.1%, rgba(166,20,195,0.06) 63.88%), linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)`
                            : `linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(#E5E7EB, #E5E7EB)`,
                          backgroundOrigin: "padding-box, padding-box, border-box",
                          backgroundClip: "padding-box, padding-box, border-box",
                        }}>
                        <Radio checked={active} onClick={() => set(bool)} />
                        {active
                          ? <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 13, fontWeight: 600 }}>{opt}</span>
                          : <span style={{ color: "#6B7280", fontSize: 13, fontWeight: 600 }}>{opt}</span>
                        }
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Affiliations */}
          <SectionHeader title="Affiliations" />
          <div className="grid grid-cols-4 gap-x-6 gap-y-3">
            {AFFILIATIONS.map(aff => (
              <label key={aff} className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className="flex-shrink-0">
                  <Checkbox checked={affiliations.has(aff)} onClick={() => setAffiliations(prev => { const s = new Set(prev); s.has(aff) ? s.delete(aff) : s.add(aff); return s; })} color="#73C9B7" />
                </div>
                <span className="text-[12px]" style={{ ...font, color: c.text }}>{aff}</span>
              </label>
            ))}
          </div>

          {/* Direct Appointments */}
          <SectionHeader title="Direct Appointments" />
          <p className="text-[12px] mb-3" style={{ ...font, color: c.muted }}>Workers Compensation</p>
          <div className="grid grid-cols-4 gap-x-6 gap-y-3 mb-4">
            {WORKERS_COMP.map(w => (
              <label key={w} className="flex items-center gap-2.5 cursor-pointer select-none">
                <Checkbox checked={workersComp.has(w)} onClick={() => setWorkersComp(prev => { const s = new Set(prev); s.has(w) ? s.delete(w) : s.add(w); return s; })} color="#73C9B7" />
                <span className="text-[12px]" style={{ ...font, color: c.text }}>{w}</span>
              </label>
            ))}
          </div>

          {/* Notes */}
          <SectionHeader title="Notes" />
          <div className="rounded-xl p-5" style={{ border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "#FAFAFA" }}>
            <p className="text-[13px] font-bold mb-3" style={{ ...font, color: c.text }}>Add New Note</p>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Write your note here..."
              rows={4} className="w-full outline-none resize-none text-[13px] rounded-lg p-3"
              style={{ ...font, color: c.text, background: c.cardBg, border: `1px solid ${c.border}` }} />
            <div className="flex justify-end mt-3">
              <button onClick={() => { if (note.trim()) { setNotes(p => [...p, note.trim()]); setNote(""); } }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                style={{ ...font, background: btnGrad }}
                onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.10)")}
                onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                <Plus className="w-3.5 h-3.5" />Add Note
              </button>
            </div>
            {notes.length > 0 && (
              <div className="mt-3 space-y-2">
                {notes.map((n, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                    <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: c.muted }} />
                    <span className="text-[12px]" style={{ ...font, color: c.text }}>{n}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </form>

        {/* Footer buttons */}
        <div className="flex items-center justify-between pb-6">
          <button onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={{ ...font, border: `1px solid ${c.borderStrong}`, color: "#090D11", background: "transparent" }}
            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            Cancel
          </button>
          <button className="text-[13px] font-semibold text-white transition-all"
            style={{ ...font, background: btnGrad, padding:"10px 24px", borderRadius:"5.58px" }}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.10)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
            Add New Agency
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function Agencies({ isDark }: { isDark: boolean }) {
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All");
  const [sortKey, setSortKey]         = useState<SortKey>(null);
  const [sortDir, setSortDir]         = useState<SortDir>("asc");
  const [page, setPage]               = useState(1);
  const [addOpen, setAddOpen]         = useState(false);
  const [perPage, setPerPage]         = useState(10);
  const [perPageOpen, setPerPageOpen] = useState(false);
  const [tab, setTab]                 = useState<TabKey>("agencies");
  const [selectedAgency, setSelectedAgency] = useState<AgencyDetail | null>(null);
  const [stars, setStars]             = useState<Set<string>>(
    new Set(mockAgencies.filter(a => a.isStarred).map(a => a.id))
  );
  const [starLimitToast, setStarLimitToast] = useState(false);

  /* colours */
  const c = {
    text:        isDark ? "#F9FAFB" : "#1F2937",
    muted:       isDark ? "#8B8FA8" : "#6B7280",
    border:      isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6",
    borderStrong:isDark ? "rgba(255,255,255,0.18)" : "#D1D5DB",
    cardBg:      isDark ? "#1E2240" : "#ffffff",
    hoverBg:     isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
    bg:          isDark ? "#0F1120" : "#ffffff",
    teal:        "#73C9B7",
  };
  const font = { fontFamily: FONT };
  const btnGrad = isDark
    ? "radial-gradient(171.32% 99.33% at 33.13% -9%, #282550 0%, #191735 55.82%, rgba(0,0,0,0.3) 74%, rgba(0,0,0,0) 100%), linear-gradient(88.34deg, #5C2ED4 0.11%, #A614C3 63.8%)"
    : "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)";

  /* filtered + sorted list */
  const allAgencies = mockAgencies.map(a => ({ ...a, isStarred: stars.has(a.id) }));
  const filtered = allAgencies.filter(a => {
    if (filterStatus === "Starred")     return a.isStarred;
    if (filterStatus === "Appointed")   return a.status === "Appointed";
    if (filterStatus === "Unappointed") return a.status === "Unappointed";
    return true;
  }).filter(a => {
    if (!search) return true;
    return (
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase())
    );
  }).sort((a, b) => {
    if (!sortKey) return 0;
    let av = "", bv = "";
    if (sortKey === "name")       { av = a.name;      bv = b.name; }
    if (sortKey === "code")       { av = a.code;      bv = b.code; }
    if (sortKey === "location")   { av = a.city;      bv = b.city; }
    if (sortKey === "status")     { av = a.status;    bv = b.status; }
    if (sortKey === "totalUsers") { return sortDir === "asc" ? a.totalUsers - b.totalUsers : b.totalUsers - a.totalUsers; }
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);
  const starred    = allAgencies.filter(a => a.isStarred);

  const toggleStar = (id: string) => {
    setStars(prev => {
      const s = new Set(prev);
      if (s.has(id)) { s.delete(id); } else if (s.size < 6) { s.add(id); } else { setStarLimitToast(true); setTimeout(() => setStarLimitToast(false), 3000); }
      return s;
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    const active = sortKey === col;
    const sub = isDark ? "#6B7280" : "#9CA3AF";
    const upColor   = active && sortDir === "asc"  ? c.text : sub;
    const downColor = active && sortDir === "desc" ? c.text : sub;
    return (
      <span className="inline-flex items-center ml-1 flex-shrink-0" style={{ verticalAlign: "middle", gap: 1 }}>
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <path d="M3.5 9V2M3.5 2L1.5 4M3.5 2L5.5 4" stroke={upColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <path d="M3.5 1V8M3.5 8L1.5 6M3.5 8L5.5 6" stroke={downColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    );
  };

  const StatusBadge = ({ status }: { status: Agency["status"] }) => (
    status === "Appointed"
      ? <span className="inline-flex items-center justify-center w-fit"
          style={{ fontFamily: FONT, background: "linear-gradient(88.54deg, rgba(92,46,212,0.05) 0.1%, rgba(166,20,195,0.05) 63.88%)", borderRadius: 9999, padding: "3px 10px" }}>
          <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", fontSize: 11, fontWeight: 600, lineHeight: "16px", whiteSpace: "nowrap" }}>
            Appointed
          </span>
        </span>
      : <span className="inline-flex items-center px-3 py-[3px] rounded-full text-[11px] font-semibold w-fit whitespace-nowrap"
          style={{ fontFamily: FONT, color: "#73C9B7", background: "rgba(115,201,183,0.10)" }}>
          Unappointed
        </span>
  );

  const filterPill = (label: FilterStatus) => {
    const active = filterStatus === label;
    return (
      <button key={label} onClick={() => { setFilterStatus(label); setPage(1); }}
        className="flex-shrink-0 transition-all"
        style={{ fontFamily: FONT, background: active ? "linear-gradient(88.54deg,#5C2ED4 0.1%,#A614C3 63.88%)" : "transparent", padding: active ? 1 : 0, borderRadius: 12, border: active ? "none" : `1px solid ${c.border}` }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "#F5F5F5"; } }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
        <span className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ fontFamily: FONT, background: active ? `linear-gradient(88.54deg, rgba(92,46,212,0.05) 0.1%, rgba(166,20,195,0.05) 63.88%), ${isDark ? "#0F1120" : "#ffffff"}` : "transparent", borderRadius: 11, padding: "5px 15px" }}>
          {label === "Starred" && <Star className="w-3.5 h-3.5" style={{ fill: "#F59E0B", color: "#F59E0B" }} />}
          <span style={active ? { backgroundImage: "linear-gradient(88.54deg,#5C2ED4 0.1%,#A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" } : { color: c.muted }}>{label}</span>
        </span>
      </button>
    );
  };

  /* Section title — same full-width divider style as Clients */
  const sectionTitle = (
    <div className="flex flex-col justify-center flex-shrink-0 mb-5"
      style={{ height: 71, borderBottom: `0.87px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB"}`, marginLeft: -48, marginRight: -48, paddingLeft: 28, paddingRight: 28 }}>
      <h1 className="text-[22px] font-normal" style={{ ...font, color: c.text }}>Agencies</h1>
    </div>
  );

  if (addOpen) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        {sectionTitle}
        <AddAgencyForm isDark={isDark} onCancel={() => setAddOpen(false)} c={c} btnGrad={btnGrad} FONT={FONT} />
      </div>
    );
  }

  if (selectedAgency) {
    return (
      <AgencyDetailView
        agency={selectedAgency}
        isDark={isDark}
        onBack={() => setSelectedAgency(null)}
        c={c}
        btnGrad={btnGrad}
        stars={stars}
        onToggleStar={toggleStar}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: FONT }} onClick={() => setPerPageOpen(false)}>
      {starLimitToast && (
        <div className="fixed top-[68px] right-6 z-50 px-4 py-2.5 rounded-xl text-[13px] font-semibold"
          style={{ background: isDark ? "#1E2240" : "#fff", color: c.text, border: `1px solid ${c.border}`, fontFamily: FONT, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          ⭐ You can only pin up to 6 agencies
        </div>
      )}

      {/* Section title */}
      {sectionTitle}

      {/* Search + buttons */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex flex-1 max-w-[360px] transition-all"
          style={{ background: c.cardBg, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, borderRadius: 10, overflow: "hidden" }}>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search agencies or users..."
            className="flex-1 outline-none"
            style={{ fontFamily: FONT, background: "transparent", color: c.text, padding: "8px 14px", fontSize: 13, border: "none" }} />
          <button className="flex items-center gap-1.5 px-4 text-[12px] font-semibold text-white flex-shrink-0 transition-all"
            style={{ background: btnGrad, fontFamily: FONT }}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.12)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
            <Search className="w-3.5 h-3.5" />Search
          </button>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-white transition-all"
          style={{ fontFamily: FONT, background: btnGrad, padding:"9px 16px", borderRadius: 10 }}
          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.10)")}
          onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
          <Plus className="w-4 h-4" />Add New Agency
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {filterPill("All")}
        {filterPill("Starred")}
        {filterPill("Appointed")}
        {filterPill("Unappointed")}
      </div>

      {/* Starred agencies strip */}
      {starred.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 flex-shrink-0" style={{ color: "#F59E0B", fill: "#F59E0B" }} />
            <span className="text-[13px] font-bold" style={{ fontFamily: FONT, color: c.text }}>
              Starred Agencies <span className="font-normal" style={{ color: c.muted }}>({starred.length} of {allAgencies.length})</span>
            </span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {starred.map(a => (
              <div key={a.id} onClick={() => setSelectedAgency(getDetail(a))}
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all"
                style={{ background: c.cardBg, border: `1px solid ${c.border}`, minWidth: 180 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.45)"; e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "#F5F5F5"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.cardBg; }}>
                <Star className="w-4 h-4 flex-shrink-0" style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ fontFamily: FONT, color: c.text }}>{a.name}</p>
                  <p className="text-[11px]" style={{ fontFamily: FONT, color: c.muted }}>Code: {a.code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-0 mb-0 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
        {([["agencies", "Agencies", Building2], ["users", "All Users", Users]] as [TabKey, string, React.ComponentType<{className?:string;style?:React.CSSProperties}>][]).map(([key, label, Icon]) => {
          const active = tab === key;
          return (
            <button key={key} onClick={() => setTab(key)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-normal relative transition-colors"
              style={{ fontFamily: FONT, color: active ? (isDark ? "#fff" : "#A614C3") : c.muted, letterSpacing: "0.01em" }}>
              <Icon className="w-[15px] h-[15px]" style={{ color: active ? "#A614C3" : undefined }} />
              {label}
              {active && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)" }} />}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto mt-0" style={{ scrollbarGutter: "stable" }}>
        <table className="w-full text-left border-collapse" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${c.border}` }}>
              {([
                ["name",       "Agency Name", "26%"],
                ["code",       "Agency Code", "16%"],
                ["location",   "Location",    "22%"],
                ["totalUsers", "Total User",  "14%"],
                ["status",     "Status",      "14%"],
              ] as [SortKey, string, string][]).map(([key, label, w]) => (
                <th key={key} onClick={() => handleSort(key)}
                  className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 cursor-pointer select-none whitespace-nowrap"
                  style={{ fontFamily: FONT, color: c.muted, width: w, paddingLeft: key === "status" ? 20 : undefined }}>
                  {label}<SortIcon col={key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((a, i) => (
              <tr key={a.id} className="cursor-pointer transition-colors"
                style={{ borderBottom: `1px solid ${c.border}` }}
                onClick={() => setSelectedAgency(getDetail(a))}
                onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                {/* Agency Name */}
                <td className="py-3 pr-6">
                  <div className="flex items-center gap-5">
                    <button onClick={e => { e.stopPropagation(); toggleStar(a.id); setSelectedAgency(null); }}
                      className="flex-shrink-0 transition-all"
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.15)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                      <Star className="w-4 h-4" style={{ color: "#F59E0B", fill: stars.has(a.id) ? "#F59E0B" : "none" }} />
                    </button>
                    <span className="text-[13px] font-semibold whitespace-nowrap" style={{ fontFamily: FONT, color: c.text }}>{a.name}</span>
                  </div>
                </td>
                {/* Agency Code */}
                <td className="py-3 pr-6">
                  <span className="text-[12px] font-semibold" style={{ fontFamily: FONT, color: isDark ? "#4ECDC4" : "#A614C3" }}>{a.code}</span>
                </td>
                {/* Location */}
                <td className="py-3 pr-6 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                    <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{a.city}, {a.state}</span>
                  </div>
                </td>
                {/* Total User */}
                <td className="py-3 pr-6 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                    <span className="text-[13px] font-medium" style={{ fontFamily: FONT, color: c.text }}>{a.totalUsers}</span>
                  </div>
                </td>
                {/* Status */}
                <td className="py-3" style={{ paddingLeft: 20 }}><StatusBadge status={a.status} /></td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>
                  No agencies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex-shrink-0 flex items-center justify-between py-3 mt-auto"
        style={{ marginLeft: "-48px", marginRight: "-48px", marginBottom: "-24px", paddingLeft: "48px", paddingRight: "48px", paddingBottom: "16px", borderTop: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "#F9FAFB" }}>
        {/* Per page */}
        <div className="flex-1 flex items-center gap-2 text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>
          <span>Show</span>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPerPageOpen(p => !p)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all"
              style={{ border: `1px solid ${c.border}`, color: c.text, background: c.cardBg }}>
              {perPage}
              <ChevronDown className="w-3 h-3" style={{ color: c.muted }} />
            </button>
            {perPageOpen && (
              <div className="absolute bottom-8 left-0 rounded-xl shadow-xl py-1 z-30 w-20"
                style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                {[5, 10, 20, 50].map(n => (
                  <button key={n} onClick={() => { setPerPage(n); setPage(1); setPerPageOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-[12px] transition-colors"
                    style={{ fontFamily: FONT, color: perPage === n ? "#A855F7" : c.text, background: perPage === n ? "rgba(168,85,247,0.08)" : "transparent" }}>
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span>per page</span>
        </div>

        {/* Page nav */}
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30"
            style={{ color: c.muted }}
            onMouseEnter={e => { if (page > 1) e.currentTarget.style.background = c.hoverBg; }}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-[12px] font-bold text-white"
            style={{ fontFamily: FONT, background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" }}>
            {page}
          </button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30"
            style={{ color: c.muted }}
            onMouseEnter={e => { if (page < totalPages) e.currentTarget.style.background = c.hoverBg; }}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 text-right text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>
          Page {page} of {totalPages}
        </div>
      </div>
    </div>
  );
}
