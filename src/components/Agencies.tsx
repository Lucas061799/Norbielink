"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, Plus, Star, MapPin, Users, ChevronDown, ChevronUp,
  ChevronsUpDown, Building2, ChevronLeft, ChevronRight, X,
  Calendar, RefreshCw, FileText, Edit2, Network, User,
  FileText as QuoteIcon, Shield,
  StickyNote, LayoutGrid, Trash2, Archive, Pin, List, Table2, FolderOpen, FileCheck,
  CheckSquare, Maximize2, Minimize2, Lock, Unlock, Copy, CopyPlus,
  MoreVertical, UserCircle, Download, Upload, UserCog, Pencil, Globe, Eye, Headphones, Crown, Mail, Phone, Bell, Bookmark, FilePen, AlertCircle, Filter,
} from "lucide-react";
import { AddressAutocomplete } from "./AddressAutocomplete";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const AGENCY_PHONE = "+1 (888) 555-0188";

// UserCog icon stroked with the brand magenta. Used to denote admins.
function GradientUserCog({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block" aria-hidden="true">
      <path d="M10 15H6a4 4 0 0 0-4 4v2" />
      <path d="m14.305 16.53.923-.382" />
      <path d="m15.228 13.852-.923-.383" />
      <path d="m16.852 12.228-.383-.923" />
      <path d="m16.852 17.772-.383.924" />
      <path d="m19.148 12.228.383-.923" />
      <path d="m19.53 18.696-.382-.924" />
      <path d="m20.772 13.852.924-.383" />
      <path d="m20.772 16.148.924.383" />
      <circle cx="18" cy="15" r="3" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  );
}

function generateAgencyCode(): string {
  const letters = Array.from({ length: 2 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join("");
  const digits = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return letters + digits;
}

function DatePicker({ value, onChange, inputStyle, c, btnGrad, font }: {
  value: string;
  onChange: (v: string) => void;
  inputStyle: React.CSSProperties;
  c: Record<string, string>;
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
  affiliations: string[];
  lastLogin: string;
}

type FilterStatus = "All" | "Starred" | "Appointed" | "Unappointed";
type SortKey = "name" | "code" | "location" | "totalUsers" | "lastLogin" | "status" | null;
type SortDir = "asc" | "desc";
type TabKey = "agencies" | "users" | "affiliations";

/* ─── Mock Data ─────────────────────────────────────────────────────────── */
const mockAgencies: Agency[] = [
  { id: "1", name: "Acme Insurance Agency", code: "ACME01", city: "Des Moines", state: "IA", totalUsers: 7,  status: "Appointed",   isStarred: true,  affiliations: ["AAA/ACG (AC364)", "Acrisure"], lastLogin: "04/24/2026" },
  { id: "2", name: "Summit Solutions",      code: "SUMIT22", city: "Chicago",    state: "IL", totalUsers: 3,  status: "Appointed",   isStarred: true,  affiliations: ["Acrisure", "Acceptance"], lastLogin: "04/22/2026" },
  { id: "3", name: "Pioneer Brokers",       code: "PION33",  city: "",           state: "",   totalUsers: 1,  status: "Unappointed", isStarred: true,  affiliations: ["SIAA"], lastLogin: "03/18/2026" },
  { id: "4", name: "Lakefront Coverage",    code: "LAKE04",  city: "Denver",     state: "CO", totalUsers: 10, status: "Appointed",   isStarred: false, affiliations: ["Farmers", "HUB International Limited", "SIAA"], lastLogin: "04/23/2026" },
  { id: "5", name: "Ridgeline Insurance",   code: "RIDG05",  city: "Des Moines", state: "IA", totalUsers: 23, status: "Appointed",   isStarred: false, affiliations: ["AAA/ACG (AC364)", "ASNOA (AL335)", "Acrisure"], lastLogin: "04/24/2026" },
  { id: "6", name: "Harbor Risk Group",     code: "HARB06",  city: "New York",   state: "NY", totalUsers: 5,  status: "Unappointed", isStarred: false, affiliations: ["IronPeak", "ISU"], lastLogin: "02/05/2026" },
  { id: "7", name: "Midland Shield Co.",    code: "MIDL07",  city: "Des Moines", state: "IA", totalUsers: 3,  status: "Unappointed", isStarred: false, affiliations: ["Premier Group (PR196)"], lastLogin: "01/12/2026" },
  { id: "8", name: "Coastal Guard LLC",     code: "COAS08",  city: "New York",   state: "NY", totalUsers: 6,  status: "Unappointed", isStarred: false, affiliations: ["SIAA", "Smart Choice"], lastLogin: "12/02/2025" },
  { id: "9", name: "Apex Risk Partners",    code: "APEX09",  city: "Austin",     state: "TX", totalUsers: 12, status: "Appointed",   isStarred: false, affiliations: ["Foundation Risk Partners", "Renaissance Alliance", "PIIB"], lastLogin: "04/20/2026" },
  { id: "10", name: "Keystone Group",       code: "KEYS10",  city: "Philadelphia", state: "PA", totalUsers: 8, status: "Appointed",  isStarred: false, affiliations: ["United Agencies"], lastLogin: "04/18/2026" },
  { id: "11", name: "BlueSky Brokers",      code: "BLUE11",  city: "Seattle",    state: "WA", totalUsers: 4,  status: "Unappointed", isStarred: false, affiliations: ["Insurance Alliance Network", "Join the Brokers"], lastLogin: "03/30/2026" },
  { id: "12", name: "Ironclad Insurance",   code: "IRON12",  city: "Dallas",     state: "TX", totalUsers: 15, status: "Appointed",   isStarred: false, affiliations: ["LTA Marketing Group (LT006)", "Pacific Crest (PA004)", "TWFG (TW037)"], lastLogin: "04/24/2026" },
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
  "2": { website: "www.summitsol.com",    street: "200 N Michigan",  zip: "60601", apptDate: "01/15/2025", contact: "Maria Chen",       contactPhone: "312-555-0190", contactEmail: "m.chen@summitsol.com",  bizType: "Corporation",    taxId: "930011223",   phone: "312-555-0100", tollFree: "800-555-0100", licenseNo: "LC-22110", licenseExp: "01/15/2027", eoPolicyNo: "EO-1120", eoExp: "01/15/2027", agencyBill: true,  directBill: false, premiumFin: true,  agencyType: "Wholesale",  affiliations: ["Acrisure", "Acceptance"], workersComp: ["CNA"], badge: "" },
  "3": { website: "",                     street: "",                zip: "",      apptDate: "06/01/2024", contact: "Tom Lawson",       contactPhone: "",             contactEmail: "",                      bizType: "Sole Proprietor",taxId: "456789012",   phone: "",             tollFree: "",             licenseNo: "LC-77001", licenseExp: "06/01/2026", eoPolicyNo: "EO-7701", eoExp: "06/01/2026", agencyBill: false, directBill: true,  premiumFin: false, agencyType: "Retail",     affiliations: ["Farmers", "ISU"], workersComp: ["GUARD", "Zenith"], badge: "" },
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
  visibility?: "Private" | "Shared";
}
const mockAgencyNotes: AgencyNote[] = [
  { id:"an1", title:"Initial Appointment Call",   content:"Spoke with Jason Smith about getting appointed. They handle primarily commercial lines in the Midwest. Sent onboarding packet.",       author:"Sarah Johnson", timestamp:"2026-03-01T10:00:00", agencyId:"1", type:"Meeting",   visibility:"Shared"  },
  { id:"an2", title:"E&O Verification",           content:"Confirmed E&O policy is current. Expires 03/24/2026. Requested updated cert for file.",                                              author:"Jane Smith",    timestamp:"2026-03-10T14:30:00", agencyId:"1", type:"Policy",    visibility:"Shared"  },
  { id:"an3", title:"Follow up on license renewal", content:"License renewal reminder sent. LC-88210 expires soon. Jason confirmed they are in process.",                                      author:"Sarah Johnson", timestamp:"2026-03-20T09:00:00", agencyId:"1", type:"Follow-up", visibility:"Private" },
  { id:"an4", title:"Portal access set up",       content:"Created login credentials for the agency portal. Sent welcome email with training links.",                                          author:"Mike Chen",     timestamp:"2026-04-01T11:15:00", agencyId:"1", type:"General",   visibility:"Shared"  },
  { id:"an5", title:"Q1 Performance Review",      content:"Agency submitted 12 quotes in Q1. Conversion rate 41%. Strong performance in Workers Comp and GL lines. Recommended for Pro tier.", author:"Jane Smith",    timestamp:"2026-04-10T16:00:00", agencyId:"1", type:"Meeting",   visibility:"Shared"  },
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
  // Acme Insurance Agency (1)
  { id:"u1",  name:"Jason Smith",      isAdmin:true,  jobTitle:"Principal",       email:"jason@acmeins.com",        phone:"(888) 888-8888", ext:"125", agencyId:"1" },
  { id:"u3",  name:"Tom Garfield",     isAdmin:true,  jobTitle:"Producer",        email:"tom.g@acmeins.com",        phone:"(888) 888-8888", ext:"126", agencyId:"1" },
  { id:"u4",  name:"Amy Chen",         isAdmin:true,  jobTitle:"Producer",        email:"amy.chen@acmeins.com",     phone:"(888) 888-8888", ext:"127", agencyId:"1" },
  { id:"u5",  name:"Brian Nguyen",     isAdmin:false, jobTitle:"Producer",        email:"b.nguyen@acmeins.com",     phone:"(888) 888-8888", ext:"128", agencyId:"1" },
  { id:"u6",  name:"Sandra Park",      isAdmin:false, jobTitle:"Producer",        email:"s.park@acmeins.com",       phone:"(888) 888-8888", ext:"129", agencyId:"1" },
  { id:"u7",  name:"Lisa Wong",        isAdmin:false, jobTitle:"CSR",             email:"l.wong@acmeins.com",       phone:"(888) 888-8888", ext:"130", agencyId:"1" },
  { id:"u10", name:"Diane Kim",        isAdmin:false, jobTitle:"Accounting",      email:"d.kim@acmeins.com",        phone:"(888) 888-8888", ext:"131", agencyId:"1" },

  // Summit Solutions (2)
  { id:"u8",  name:"Maria Chen",       isAdmin:true,  jobTitle:"Principal",       email:"m.chen@summitsol.com",     phone:"(312) 555-0190", ext:"",    agencyId:"2" },
  { id:"u9",  name:"Tom Harris",       isAdmin:false, jobTitle:"Producer",        email:"tom@summitsol.com",        phone:"(312) 555-0191", ext:"201", agencyId:"2" },
  { id:"u11", name:"Rachel Brooks",    isAdmin:false, jobTitle:"Account Manager", email:"r.brooks@summitsol.com",   phone:"(312) 555-0192", ext:"202", agencyId:"2" },

  // Pioneer Brokers (3)
  { id:"u12", name:"Tom Lawson",       isAdmin:true,  jobTitle:"Principal",       email:"t.lawson@pioneerbrok.com", phone:"(515) 555-3300", ext:"",    agencyId:"3" },

  // Lakefront Coverage (4)
  { id:"u13", name:"Karen Wells",      isAdmin:true,  jobTitle:"Principal",       email:"k.wells@lakefrontcov.com", phone:"(303) 555-1010", ext:"",    agencyId:"4" },
  { id:"u14", name:"Michael Foster",   isAdmin:true,  jobTitle:"Producer",        email:"m.foster@lakefrontcov.com",phone:"(303) 555-1011", ext:"110", agencyId:"4" },
  { id:"u15", name:"Jenna Patel",      isAdmin:false, jobTitle:"Producer",        email:"j.patel@lakefrontcov.com", phone:"(303) 555-1012", ext:"111", agencyId:"4" },
  { id:"u16", name:"David Cho",        isAdmin:false, jobTitle:"Account Manager", email:"d.cho@lakefrontcov.com",   phone:"(303) 555-1013", ext:"112", agencyId:"4" },
  { id:"u17", name:"Erin Stewart",     isAdmin:false, jobTitle:"CSR",             email:"e.stewart@lakefrontcov.com",phone:"(303) 555-1014", ext:"113", agencyId:"4" },
  { id:"u18", name:"Paul Ramirez",     isAdmin:false, jobTitle:"Producer",        email:"p.ramirez@lakefrontcov.com",phone:"(303) 555-1015", ext:"114", agencyId:"4" },
  { id:"u19", name:"Olivia Bennett",   isAdmin:false, jobTitle:"Accounting",      email:"o.bennett@lakefrontcov.com",phone:"(303) 555-1016", ext:"115", agencyId:"4" },

  // Ridgeline Insurance (5)
  { id:"u20", name:"Marcus Reed",      isAdmin:true,  jobTitle:"Principal",       email:"m.reed@ridgelineins.com",  phone:"(515) 555-2020", ext:"",    agencyId:"5" },
  { id:"u21", name:"Hannah Lee",       isAdmin:true,  jobTitle:"Producer",        email:"h.lee@ridgelineins.com",   phone:"(515) 555-2021", ext:"210", agencyId:"5" },
  { id:"u22", name:"Trevor Howard",    isAdmin:false, jobTitle:"Producer",        email:"t.howard@ridgelineins.com",phone:"(515) 555-2022", ext:"211", agencyId:"5" },
  { id:"u23", name:"Sophie Martin",    isAdmin:false, jobTitle:"Account Manager", email:"s.martin@ridgelineins.com",phone:"(515) 555-2023", ext:"212", agencyId:"5" },
  { id:"u24", name:"Caleb Hughes",     isAdmin:false, jobTitle:"CSR",             email:"c.hughes@ridgelineins.com",phone:"(515) 555-2024", ext:"213", agencyId:"5" },
  { id:"u25", name:"Nicole Avery",     isAdmin:false, jobTitle:"Accounting",      email:"n.avery@ridgelineins.com", phone:"(515) 555-2025", ext:"214", agencyId:"5" },

  // Harbor Risk Group (6)
  { id:"u26", name:"Frank DeLuca",     isAdmin:true,  jobTitle:"Principal",       email:"f.deluca@harborrisk.com",  phone:"(212) 555-6060", ext:"",    agencyId:"6" },
  { id:"u27", name:"Megan O'Brien",    isAdmin:false, jobTitle:"Producer",        email:"m.obrien@harborrisk.com",  phone:"(212) 555-6061", ext:"310", agencyId:"6" },
  { id:"u28", name:"Ethan Park",       isAdmin:false, jobTitle:"Account Manager", email:"e.park@harborrisk.com",    phone:"(212) 555-6062", ext:"311", agencyId:"6" },

  // Midland Shield Co. (7)
  { id:"u29", name:"Greg Sullivan",    isAdmin:true,  jobTitle:"Principal",       email:"g.sullivan@midlandshield.com",phone:"(515) 555-7070", ext:"",    agencyId:"7" },
  { id:"u30", name:"Aiden Cole",       isAdmin:false, jobTitle:"Producer",        email:"a.cole@midlandshield.com", phone:"(515) 555-7071", ext:"410", agencyId:"7" },

  // Coastal Guard LLC (8)
  { id:"u31", name:"Priya Shah",       isAdmin:true,  jobTitle:"Principal",       email:"p.shah@coastalguard.com",  phone:"(212) 555-8080", ext:"",    agencyId:"8" },
  { id:"u32", name:"Jordan Blake",     isAdmin:false, jobTitle:"Producer",        email:"j.blake@coastalguard.com", phone:"(212) 555-8081", ext:"510", agencyId:"8" },
  { id:"u33", name:"Megan Russo",      isAdmin:false, jobTitle:"CSR",             email:"m.russo@coastalguard.com", phone:"(212) 555-8082", ext:"511", agencyId:"8" },

  // Apex Risk Partners (9)
  { id:"u34", name:"Diana Cole",       isAdmin:true,  jobTitle:"Principal",       email:"d.cole@apexrisk.com",      phone:"(512) 555-9090", ext:"",    agencyId:"9" },
  { id:"u35", name:"Ryan Walsh",       isAdmin:true,  jobTitle:"Producer",        email:"r.walsh@apexrisk.com",     phone:"(512) 555-9091", ext:"610", agencyId:"9" },
  { id:"u36", name:"Lauren Kim",       isAdmin:false, jobTitle:"Producer",        email:"l.kim@apexrisk.com",       phone:"(512) 555-9092", ext:"611", agencyId:"9" },
  { id:"u37", name:"Henry Tan",        isAdmin:false, jobTitle:"Account Manager", email:"h.tan@apexrisk.com",       phone:"(512) 555-9093", ext:"612", agencyId:"9" },
  { id:"u38", name:"Beth Carlson",     isAdmin:false, jobTitle:"Accounting",      email:"b.carlson@apexrisk.com",   phone:"(512) 555-9094", ext:"613", agencyId:"9" },

  // Keystone Group (10)
  { id:"u39", name:"Marvin Lopez",     isAdmin:true,  jobTitle:"Principal",       email:"m.lopez@keystonegrp.com",  phone:"(215) 555-1010", ext:"",    agencyId:"10" },
  { id:"u40", name:"Kayla Bryant",     isAdmin:false, jobTitle:"Producer",        email:"k.bryant@keystonegrp.com", phone:"(215) 555-1011", ext:"710", agencyId:"10" },
  { id:"u41", name:"Sean Murphy",      isAdmin:false, jobTitle:"CSR",             email:"s.murphy@keystonegrp.com", phone:"(215) 555-1012", ext:"711", agencyId:"10" },

  // BlueSky Brokers (11)
  { id:"u42", name:"Anna Rivera",      isAdmin:true,  jobTitle:"Principal",       email:"a.rivera@blueskybrok.com", phone:"(206) 555-1100", ext:"",    agencyId:"11" },
  { id:"u43", name:"Devin Yamamoto",   isAdmin:false, jobTitle:"Producer",        email:"d.yamamoto@blueskybrok.com",phone:"(206) 555-1101", ext:"810", agencyId:"11" },

  // Ironclad Insurance (12)
  { id:"u44", name:"Bruno Mancini",    isAdmin:true,  jobTitle:"Principal",       email:"b.mancini@ironcladins.com",phone:"(214) 555-1200", ext:"",    agencyId:"12" },
  { id:"u45", name:"Vera Holmes",      isAdmin:true,  jobTitle:"Producer",        email:"v.holmes@ironcladins.com", phone:"(214) 555-1201", ext:"910", agencyId:"12" },
  { id:"u46", name:"Carlos Mendez",    isAdmin:false, jobTitle:"Account Manager", email:"c.mendez@ironcladins.com", phone:"(214) 555-1202", ext:"911", agencyId:"12" },
  { id:"u47", name:"Holly Park",       isAdmin:false, jobTitle:"Producer",        email:"h.park@ironcladins.com",   phone:"(214) 555-1203", ext:"912", agencyId:"12" },
  { id:"u48", name:"Trevor Knox",      isAdmin:false, jobTitle:"CSR",             email:"t.knox@ironcladins.com",   phone:"(214) 555-1204", ext:"913", agencyId:"12" },
];

/* ─── Agency Detail View ─────────────────────────────────────────────────── */
type DetailTab = "overview" | "quotes" | "policies" | "users" | "documents" | "notes";

function AgencyDetailView({ agency, isDark, onBack, c, btnGrad, stars, onToggleStar, inactiveUserIds, setInactiveUserIds, removedUserIds, setRemovedUserIds, bookRolled, setBookRolled, allAgencies }: {
  agency: AgencyDetail;
  isDark: boolean;
  onBack: () => void;
  c: Record<string, string>;
  btnGrad: string;
  stars: Set<string>;
  onToggleStar: (id: string) => void;
  inactiveUserIds: Set<string>;
  setInactiveUserIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  removedUserIds: Set<string>;
  setRemovedUserIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  bookRolled: Map<string, { targetCode: string; date: string }>;
  setBookRolled: React.Dispatch<React.SetStateAction<Map<string, { targetCode: string; date: string }>>>;
  allAgencies: Agency[];
}) {
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [isEditing, setIsEditing]           = useState(false);
  const [editExpanded, setEditExpanded]     = useState(false);
  const [contactCardEditing, setContactCardEditing] = useState(false);
  const [contactMode, setContactMode] = useState<"edit"|"reassign"|"new">("edit");
  const [reassignSelection, setReassignSelection] = useState<string>("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const currentUserIsAdmin = true; // toggle to false to hide admin-only actions (Deactivate, Reactivate, Remove)
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
  const [eStatusOpen, setEStatusOpen] = useState(false);
  const [eBizTypeOpen, setEBizTypeOpen] = useState(false);
  const [eReason, setEReason] = useState("");
  const [eReasonOpen, setEReasonOpen] = useState(false);
  const E_REASON_OPTIONS = ["Closed", "Sold", "Credit Hold", "Missing Info", "Terminated"];

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

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
  const [qpViewOpen,      setQpViewOpen]      = useState(false);
  const [qpHiddenCols,    setQpHiddenCols]    = useState<Set<string>>(new Set());
  const QP_COLUMNS: Array<{ key: string; label: string; width: string }> = [
    { key: "created",      label: "Created",       width: "1.1fr" },
    { key: "policyNumber", label: "Policy Number", width: "1.6fr" },
    { key: "applicant",    label: "Applicant",     width: "1.2fr" },
    { key: "dba",          label: "DBA",           width: "1fr"   },
    { key: "effective",    label: "Effective",     width: "1.1fr" },
    { key: "lob",          label: "LOB",           width: "1.1fr" },
    { key: "status",       label: "Status",        width: "1.2fr" },
    { key: "producer",     label: "Producer",      width: "1.2fr" },
  ];
  const qpVisibleCols = QP_COLUMNS.filter(c => !qpHiddenCols.has(c.key));
  const qpGridTemplate = qpVisibleCols.map(c => c.width).join(" ");

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
  const [visibilityFilter, setVisibilityFilter] = useState<"All"|"Private"|"Shared">("All");
  const [noteExpanded,   setNoteExpanded]   = useState(false);
  const [noteLocked,     setNoteLocked]     = useState(false);
  const [lockedBy,       setLockedBy]       = useState("Sarah Johnson");
  const [archivedIds,    setArchivedIds]    = useState<Set<string>>(new Set());
  const [trashedIds,     setTrashedIds]     = useState<Set<string>>(new Set());
  const [pinnedIds,      setPinnedIds]      = useState<Set<string>>(new Set());
  const [showArchived,   setShowArchived]   = useState(false);
  const [showTrashed,    setShowTrashed]    = useState(false);
  const [noteMoreOpen,   setNoteMoreOpen]   = useState(false);
  const [copyToast,      setCopyToast]      = useState("");
  const [isSelectMode,   setIsSelectMode]   = useState(false);
  const [selectedNoteIds,setSelectedNoteIds]= useState<Set<string>>(new Set());
  const [deleteNoteId,   setDeleteNoteId]   = useState<string|null>(null);
  const CURRENT_USER = "Sarah Johnson";

  /* ── users tab state ── */
  const [importUsersOpen, setImportUsersOpen] = useState(false);
  const [addUserOpen,     setAddUserOpen]     = useState(false);
  const [editUserId,      setEditUserId]      = useState<string|null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [userSearch,      setUserSearch]      = useState("");
  const [jobTitleFilter,  setJobTitleFilter]  = useState<Set<string>>(new Set());
  const [jobTitleOpen,    setJobTitleOpen]    = useState(false);
  const [jobTitleSearch,  setJobTitleSearch]  = useState("");
  const [userMenuId,      setUserMenuId]      = useState<string|null>(null);
  // inactiveUserIds and removedUserIds are now lifted to the parent Agencies component
  // so the All Users tab in the main view can also respect deactivation/removal state.
  const [usersView,       setUsersView]       = useState<"active"|"inactive">("active");
  type ToastData = { title: string; description?: string; action?: { label: string; onClick: () => void } };
  const [userToast,       setUserToast]       = useState<ToastData | null>(null);
  const showToast = (t: ToastData, ms = 4000) => { setUserToast(t); setTimeout(() => setUserToast(null), ms); };
  const [removeUserConfirm, setRemoveUserConfirm] = useState<{id: string; name: string} | null>(null);
  // When deactivating/removing a Principal or Agency Contact, force the user to pick a replacement first.
  const [roleReassign, setRoleReassign] = useState<{
    userId: string;
    userName: string;
    action: "deactivate" | "remove";
    needsPrincipal: boolean;
    needsContact: boolean;
  } | null>(null);
  const [reassignPrincipalId, setReassignPrincipalId] = useState("");
  const [reassignContactId, setReassignContactId] = useState("");
  // Optional overrides applied after a reassign — used to reflect the new Principal / Contact in the UI.
  const [principalOverride, setPrincipalOverride] = useState<{ oldId: string; newId: string } | null>(null);
  const [agencyContactOverride, setAgencyContactOverride] = useState<string | null>(null);
  // Track users granted admin permissions via the Principal-reassign flow (Principal implies admin).
  const [adminGrantOverrides, setAdminGrantOverrides] = useState<Set<string>>(new Set());
  // ── Documents tab state (demo only — files are mock entries; uploads add rows but don't store anything). ──
  type AgencyDocCategory = "bor" | "w9" | "license" | "agreement";
  type AgencyDoc = { id: string; category: AgencyDocCategory; name: string; date: string; archived?: boolean };
  const [agencyDocs, setAgencyDocs] = useState<AgencyDoc[]>([
    { id: "d1", category: "bor",       name: "BOR Request - 2025.pdf",      date: "Mar 15, 2025" },
    { id: "d2", category: "bor",       name: "BOR Letter Signed.pdf",       date: "Mar 20, 2025" },
    { id: "d3", category: "w9",        name: "W9-2025.pdf",                  date: "Feb 1, 2025" },
    { id: "d4", category: "w9",        name: "W9-2024.pdf",                  date: "Feb 1, 2024",  archived: true },
    { id: "d5", category: "license",   name: `${agency.state || "NY"}-License.pdf`, date: "Jan 10, 2025" },
    { id: "d6", category: "agreement", name: "Appointment Letter.pdf",      date: agency.apptDate || "Mar 24, 2026" },
    { id: "d7", category: "agreement", name: "Producer Agreement.pdf",      date: agency.apptDate || "Mar 24, 2026" },
  ]);
  const [imageRightSyncMins, setImageRightSyncMins] = useState(5);
  // After saving Agency Info edits, prompt the user to upload fresh docs if W-9/license-relevant fields drifted.
  const [docUpdateModal, setDocUpdateModal] = useState<{ w9: boolean; license: boolean } | null>(null);

  // Book Roll modal — admin sells the entire policy book to another agency.
  const [bookRollOpen, setBookRollOpen] = useState(false);
  const [bookRollTargetId, setBookRollTargetId] = useState("");
  const [bookRollDate, setBookRollDate] = useState(() => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
  });
  const [bookRollConfirmText, setBookRollConfirmText] = useState("");
  // "Assign Principal" modal — fired when an agency has no Principal at all.
  const [assignPrincipalOpen, setAssignPrincipalOpen] = useState(false);
  const [assignPrincipalChoice, setAssignPrincipalChoice] = useState("");
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
  const USER_STATUSES = ["Active","Inactive"];
  const US_STATES    = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
  const agencyUsers = mockAgencyUsers
    .filter(u => u.agencyId === agency.id)
    .filter(u => !removedUserIds.has(u.id))
    .filter(u => usersView === "active" ? !inactiveUserIds.has(u.id) : inactiveUserIds.has(u.id))
    .filter(u => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
    .filter(u => jobTitleFilter.size === 0 || jobTitleFilter.has(u.jobTitle))
    .sort((a, b) => {
      // Pin the effective Principal to the top so role-transferred users surface immediately.
      const aJob = principalOverride && a.id === principalOverride.newId ? "Principal"
        : principalOverride && a.id === principalOverride.oldId && a.jobTitle === "Principal" ? "Producer"
        : a.jobTitle;
      const bJob = principalOverride && b.id === principalOverride.newId ? "Principal"
        : principalOverride && b.id === principalOverride.oldId && b.jobTitle === "Principal" ? "Producer"
        : b.jobTitle;
      if (aJob === "Principal" && bJob !== "Principal") return -1;
      if (bJob === "Principal" && aJob !== "Principal") return 1;
      return 0;
    });
  const inactiveCount = mockAgencyUsers.filter(u => u.agencyId === agency.id && !removedUserIds.has(u.id) && inactiveUserIds.has(u.id)).length;
  const activeCount = mockAgencyUsers.filter(u => u.agencyId === agency.id && !removedUserIds.has(u.id) && !inactiveUserIds.has(u.id)).length;

  const fmtDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) + " " +
      d.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
  };
  const openNote = (n: AgencyNote) => { setSelectedNote(n); setEditNoteTitle(n.title); setEditNoteContent(n.content); setEditNoteType(n.type); setEditNoteVisibility(n.visibility || "Shared"); };
  const saveNote = () => { if (!selectedNote) return; setAgNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, title: editNoteTitle, content: editNoteContent, type: editNoteType, visibility: editNoteVisibility } : n)); setSelectedNote(s => s ? { ...s, title: editNoteTitle, content: editNoteContent, type: editNoteType, visibility: editNoteVisibility } : s); };

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
    ["overview",  "Overview",  <Building2  className="w-[15px] h-[15px]" />],
    ["quotes",    "Quotes",    <QuoteIcon  className="w-[15px] h-[15px]" />],
    ["policies",  "Policies",  <Shield     className="w-[15px] h-[15px]" />],
    ["users",     "Users",     <Users      className="w-[15px] h-[15px]" />],
    ["documents", "Documents", <FolderOpen className="w-[15px] h-[15px]" />],
    ["notes",     "Notes",     <FileText   className="w-[15px] h-[15px]" />],
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
      {userToast && (
        <div className="fixed top-[68px] right-6 z-50 flex items-center gap-8"
          style={{ background: isDark ? "#1E2240" : "#fff", border: `1px solid ${c.border}`, borderRadius: 12, padding: "12px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", minWidth: 360, maxWidth: 460, fontFamily: FONT }}>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold truncate" style={{ color: c.text }}>{userToast.title}</div>
            {userToast.description && (
              <div className="text-[12px] mt-0.5" style={{ color: c.muted }}>{userToast.description}</div>
            )}
          </div>
          {userToast.action && (
            <button onClick={() => { userToast.action!.onClick(); setUserToast(null); }}
              className="flex-shrink-0 text-[12px] font-semibold transition-colors"
              style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              {userToast.action.label}
            </button>
          )}
        </div>
      )}
      {bookRollOpen && (() => {
        // Admin-only flow. Excludes the source agency itself from the target picker.
        const targetCandidates = allAgencies.filter(a => a.id !== agency.id);
        const target = targetCandidates.find(a => a.id === bookRollTargetId);
        const policyCount = rawPolicies.length;
        const canConfirm = !!target && bookRollConfirmText.trim().toUpperCase() === agency.code.toUpperCase();
        const proceed = () => {
          if (!canConfirm || !target) return;
          // 1. Track the book-roll mapping (source → target).
          setBookRolled(prev => { const m = new Map(prev); m.set(agency.id, { targetCode: target.code, date: bookRollDate }); return m; });
          // 2. Auto-add a system note in the source agency's Notes tab.
          const noteContent = `Book of business rolled from ${agency.name} (${agency.code}) to ${target.name} (${target.code}) on ${bookRollDate}. ${policyCount} ${policyCount === 1 ? "policy" : "policies"} reassigned.`;
          const newNote: AgencyNote = {
            id: `br-${Date.now()}`,
            title: `Book Roll → ${target.code}`,
            content: noteContent,
            author: "System",
            timestamp: new Date().toISOString(),
            agencyId: agency.id,
            type: "General",
            visibility: "Shared",
          };
          setAgNotes(prev => [newNote, ...prev]);
          // 3. Update agency status to Unappointed with reason "Sold".
          setEStatus("Unappointed");
          setEReason("Sold");
          // 4. Toast.
          showToast({ title: "Book rolled", description: `${policyCount} ${policyCount === 1 ? "policy" : "policies"} transferred to ${target.name}. Agency unappointed.` }, 5000);
          setBookRollOpen(false);
        };
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setBookRollOpen(false)}>
            <div className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: c.cardBg, border: `1px solid ${c.border}`, width: "min(540px, 92vw)", boxShadow: "0 20px 50px rgba(0,0,0,0.20)" }}
              onClick={e => e.stopPropagation()}>
              <div className="px-6 pt-5 pb-4">
                <h3 className="text-[16px] font-bold mb-1" style={{ fontFamily: FONT, color: c.text }}>Book Roll</h3>
                <p className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>
                  Transfer <strong style={{ color: c.text }}>{agency.name}</strong>&apos;s entire policy book to another agency. This action <strong style={{ color: "#EF4444" }}>cannot be undone</strong>.
                </p>
              </div>
              <div className="px-6 pb-4 flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Target Agency</label>
                  <select value={bookRollTargetId} onChange={e => setBookRollTargetId(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 rounded-lg text-[13px] outline-none appearance-none cursor-pointer"
                    style={{ fontFamily: FONT, background: `${c.cardBg} url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>") no-repeat right 12px center`, border: `1px solid ${c.border}`, color: c.text }}>
                    <option value="">Select an agency…</option>
                    {targetCandidates.map(a => (
                      <option key={a.id} value={a.id}>{a.name} · {a.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Effective Date</label>
                  <input value={bookRollDate} onChange={e => setBookRollDate(e.target.value)}
                    placeholder="MM/DD/YYYY"
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                    style={{ fontFamily: FONT, background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }} />
                </div>
                <div className="px-3 py-2.5 rounded-lg text-[12px] flex items-start gap-2"
                  style={{ backgroundImage: "linear-gradient(88.54deg, rgba(92,46,212,0.06) 0.1%, rgba(166,20,195,0.08) 63.88%)", border: "1px solid rgba(166,20,195,0.18)", color: c.text, fontFamily: FONT }}>
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#A614C3" }} />
                  <div>
                    <strong>{policyCount}</strong> {policyCount === 1 ? "policy" : "policies"} will be transferred. {agency.name} will be unappointed (reason: Sold).
                    Quotes, clients, and users stay with the source agency.
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Type <span style={{ color: "#A614C3" }}>{agency.code}</span> to confirm</label>
                  <input value={bookRollConfirmText} onChange={e => setBookRollConfirmText(e.target.value)}
                    placeholder={agency.code}
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                    style={{ fontFamily: FONT, background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }} />
                </div>
              </div>
              <div className="px-6 py-3 flex justify-end gap-2" style={{ borderTop: `1px solid ${c.border}` }}>
                <button onClick={() => setBookRollOpen(false)}
                  className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                  style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: c.cardBg }}>
                  Cancel
                </button>
                <button onClick={proceed} disabled={!canConfirm}
                  className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                  style={{ fontFamily: FONT, background: btnGrad, opacity: canConfirm ? 1 : 0.5, cursor: canConfirm ? "pointer" : "not-allowed", boxShadow: canConfirm ? "0 4px 14px rgba(166,20,195,0.25)" : "none" }}>
                  Confirm Book Roll
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {assignPrincipalOpen && (() => {
        // Standalone assign — used when agency has no Principal at all (after deactivations/removals).
        const candidates = mockAgencyUsers.filter(u =>
          u.agencyId === agency.id
          && !removedUserIds.has(u.id)
          && !inactiveUserIds.has(u.id)
        );
        const picked = candidates.find(u => u.id === assignPrincipalChoice);
        const willGrantAdmin = picked && !picked.isAdmin && !adminGrantOverrides.has(picked.id);
        const proceed = () => {
          if (!picked) return;
          setPrincipalOverride({ oldId: "", newId: picked.id });
          showToast({ title: "Principal assigned", description: `${picked.name} is now the Principal.` });
          if (willGrantAdmin) {
            setAdminGrantOverrides(prev => { const s = new Set(prev); s.add(picked.id); return s; });
            showToast({ title: "Admin permissions granted", description: `${picked.name} was granted admin access (required for Principal).` });
          }
          setAssignPrincipalOpen(false);
        };
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setAssignPrincipalOpen(false)}>
            <div className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: c.cardBg, border: `1px solid ${c.border}`, width: "min(480px, 92vw)", boxShadow: "0 20px 50px rgba(0,0,0,0.20)" }}
              onClick={e => e.stopPropagation()}>
              <div className="px-6 pt-5 pb-4">
                <h3 className="text-[16px] font-bold mb-1" style={{ fontFamily:FONT, color: c.text }}>Assign Principal</h3>
                <p className="text-[13px]" style={{ fontFamily:FONT, color: c.muted }}>
                  This agency has no Principal. Choose one from the active users below.
                </p>
              </div>
              <div className="px-6 pb-4">
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>New Principal</label>
                <select value={assignPrincipalChoice} onChange={e => setAssignPrincipalChoice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                  style={{ fontFamily: FONT, background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }}>
                  <option value="">Select a user…</option>
                  {candidates.map(u => (
                    <option key={u.id} value={u.id}>{u.name} · {u.jobTitle}{!u.isAdmin && !adminGrantOverrides.has(u.id) ? " · (no admin yet)" : ""}</option>
                  ))}
                </select>
                {willGrantAdmin && (
                  <div className="mt-2 px-3 py-2 rounded-lg text-[12px] flex items-start gap-2"
                    style={{ backgroundImage: "linear-gradient(88.54deg, rgba(92,46,212,0.08) 0.1%, rgba(166,20,195,0.10) 63.88%)", border: "1px solid rgba(166,20,195,0.22)", color: "#5C2ED4", fontFamily: FONT }}>
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#A614C3" }} />
                    <span>{picked!.name} doesn&apos;t have admin yet. Promoting them to Principal will also grant admin permissions.</span>
                  </div>
                )}
              </div>
              <div className="px-6 py-3 flex justify-end gap-2" style={{ borderTop: `1px solid ${c.border}` }}>
                <button onClick={() => setAssignPrincipalOpen(false)}
                  className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                  style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: c.cardBg }}>
                  Cancel
                </button>
                <button onClick={proceed} disabled={!picked}
                  className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                  style={{ fontFamily: FONT, background: btnGrad, opacity: picked ? 1 : 0.5, cursor: picked ? "pointer" : "not-allowed" }}>
                  Assign Principal
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {roleReassign && (() => {
        // Eligible replacements: active, non-removed, not the user being deactivated/removed.
        const candidates = mockAgencyUsers.filter(u =>
          u.agencyId === agency.id
          && u.id !== roleReassign.userId
          && !removedUserIds.has(u.id)
          && !inactiveUserIds.has(u.id)
        );
        const canConfirm =
          (!roleReassign.needsPrincipal || !!reassignPrincipalId)
          && (!roleReassign.needsContact || !!reassignContactId);
        const proceed = () => {
          if (!canConfirm) return;
          if (roleReassign.needsPrincipal) {
            const newPrin = candidates.find(u => u.id === reassignPrincipalId);
            if (newPrin) {
              setPrincipalOverride({ oldId: roleReassign.userId, newId: newPrin.id });
              showToast({ title: "Principal role transferred", description: `${newPrin.name} is now the Principal.` });
              // Principal implies admin — auto-grant admin permissions to a non-admin pick.
              if (!newPrin.isAdmin && !adminGrantOverrides.has(newPrin.id)) {
                setAdminGrantOverrides(prev => { const s = new Set(prev); s.add(newPrin.id); return s; });
                showToast({ title: "Admin permissions granted", description: `${newPrin.name} was granted admin access (required for Principal).` });
              }
            }
          }
          if (roleReassign.needsContact) {
            const newCon = candidates.find(u => u.id === reassignContactId);
            if (newCon) {
              setAgencyContactOverride(newCon.name);
              setEContact(newCon.name);
              if (newCon.email) setEEmail(newCon.email);
              if (newCon.phone) setEContactPhone(newCon.phone);
              showToast({ title: "Agency Contact updated", description: `${newCon.name} is now the Agency Contact.` });
            }
          }
          if (roleReassign.action === "deactivate") {
            const id = roleReassign.userId;
            const name = roleReassign.userName;
            setInactiveUserIds(prev => { const s = new Set(prev); s.add(id); return s; });
            showToast({
              title: "User deactivated",
              description: `${name} moved to Inactive Users.`,
              action: { label: "Undo", onClick: () => setInactiveUserIds(prev => { const s = new Set(prev); s.delete(id); return s; }) },
            });
          } else if (roleReassign.action === "remove") {
            setRemoveUserConfirm({ id: roleReassign.userId, name: roleReassign.userName });
          }
          setRoleReassign(null);
        };
        const rolesText = [roleReassign.needsPrincipal && "Principal", roleReassign.needsContact && "Agency Contact"].filter(Boolean).join(" and ");
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setRoleReassign(null)}>
            <div className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: c.cardBg, border: `1px solid ${c.border}`, width: "min(480px, 92vw)", boxShadow: "0 20px 50px rgba(0,0,0,0.20)" }}
              onClick={e => e.stopPropagation()}>
              <div className="px-6 pt-5 pb-4">
                <h3 className="text-[16px] font-bold mb-1" style={{ fontFamily:FONT, color: c.text }}>Reassign {rolesText} first</h3>
                <p className="text-[13px]" style={{ fontFamily:FONT, color: c.muted }}>
                  <strong style={{ color: c.text }}>{roleReassign.userName}</strong> is the {rolesText}. Choose {roleReassign.needsPrincipal && roleReassign.needsContact ? "replacements" : "a replacement"} before {roleReassign.action === "deactivate" ? "deactivating" : "removing"} them.
                </p>
              </div>
              <div className="px-6 pb-4 flex flex-col gap-3">
                {candidates.length === 0 ? (
                  <div className="px-3 py-4 rounded-lg text-[12px]" style={{ background: c.hoverBg, border: `1px dashed ${c.border}`, color: c.muted, fontFamily: FONT }}>
                    No other active users in this agency. Add or reactivate a user before continuing.
                  </div>
                ) : (
                  <>
                    {roleReassign.needsPrincipal && (() => {
                      const picked = candidates.find(u => u.id === reassignPrincipalId);
                      const willGrantAdmin = picked && !picked.isAdmin && !adminGrantOverrides.has(picked.id);
                      return (
                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>New Principal</label>
                          <select value={reassignPrincipalId} onChange={e => setReassignPrincipalId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                            style={{ fontFamily: FONT, background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }}>
                            <option value="">Select a user…</option>
                            {candidates.map(u => (
                              <option key={u.id} value={u.id}>{u.name} · {u.jobTitle}{!u.isAdmin && !adminGrantOverrides.has(u.id) ? " · (no admin yet)" : ""}</option>
                            ))}
                          </select>
                          {willGrantAdmin && (
                            <div className="mt-2 px-3 py-2 rounded-lg text-[12px] flex items-start gap-2"
                              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.20)", color: "#92400E", fontFamily: FONT }}>
                              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                              <span>{picked!.name} doesn&apos;t have admin yet. Promoting them to Principal will also grant admin permissions.</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    {roleReassign.needsContact && (
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>New Agency Contact</label>
                        <select value={reassignContactId} onChange={e => setReassignContactId(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                          style={{ fontFamily: FONT, background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }}>
                          <option value="">Select a user…</option>
                          {candidates.map(u => (
                            <option key={u.id} value={u.id}>{u.name} · {u.jobTitle}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="px-6 py-3 flex justify-end gap-2" style={{ borderTop: `1px solid ${c.border}` }}>
                <button onClick={() => setRoleReassign(null)}
                  className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                  style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: c.cardBg }}>
                  Cancel
                </button>
                <button onClick={proceed} disabled={!canConfirm || candidates.length === 0}
                  className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                  style={{ fontFamily: FONT, background: btnGrad, opacity: canConfirm && candidates.length > 0 ? 1 : 0.5, cursor: canConfirm && candidates.length > 0 ? "pointer" : "not-allowed" }}>
                  Reassign & {roleReassign.action === "deactivate" ? "Deactivate" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {docUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setDocUpdateModal(null)}
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-[460px] rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(88.54deg, rgba(92,46,212,0.12) 0.1%, rgba(166,20,195,0.12) 63.88%)" }}>
                <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                  <defs>
                    <linearGradient id="doc-modal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#5C2ED4" />
                      <stop offset="100%" stopColor="#A614C3" />
                    </linearGradient>
                  </defs>
                  <circle cx="8" cy="8" r="7" stroke="url(#doc-modal-grad)" strokeWidth="1.5" />
                  <rect x="7.25" y="3.5" width="1.5" height="5.5" rx="0.75" fill="url(#doc-modal-grad)" />
                  <circle cx="8" cy="11.5" r="0.9" fill="url(#doc-modal-grad)" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-bold mb-1.5" style={{ color: c.text }}>Documents need an update</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: c.muted }}>
                  Agency information was changed. Per compliance, please upload an updated copy of the affected document{docUpdateModal.w9 && docUpdateModal.license ? "s" : ""}.
                </p>
              </div>
            </div>
            <div className="rounded-lg p-3 mb-5"
              style={{ background: "linear-gradient(88.54deg, rgba(92,46,212,0.05) 0.1%, rgba(166,20,195,0.05) 63.88%)", border: "1px solid rgba(166,20,195,0.18)" }}>
              <ul className="text-[12px] space-y-1.5" style={{ color: c.text }}>
                {docUpdateModal.w9 && (
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" }} />
                    <span>New <strong>W-9</strong> required</span>
                    <span className="ml-auto text-[11px]" style={{ color: c.muted }}>name · entity · address · TIN</span>
                  </li>
                )}
                {docUpdateModal.license && (
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" }} />
                    <span>New <strong>License copy</strong> required</span>
                    <span className="ml-auto text-[11px]" style={{ color: c.muted }}>license number changed</span>
                  </li>
                )}
              </ul>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDocUpdateModal(null)}
                className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Later
              </button>
              <button onClick={() => { setDetailTab("documents"); setDocUpdateModal(null); }}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                style={{ background: btnGrad }}
                onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.10)")}
                onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                Go to Documents
              </button>
            </div>
          </div>
        </div>
      )}
      {removeUserConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setRemoveUserConfirm(null)}
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-[420px] rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.10)" }}>
                <Trash2 className="w-6 h-6" style={{ color: "#EF4444" }} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold mb-1" style={{ color: c.text }}>Remove {removeUserConfirm.name}?</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: c.muted }}>
                  This action <strong style={{ color: c.text }}>cannot be undone</strong>. The user will be permanently removed from this agency. If you just want to suspend access, choose <strong style={{ color: c.text }}>Deactivate</strong> instead.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRemoveUserConfirm(null)}
                className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Cancel
              </button>
              <button onClick={() => {
                  const removedId = removeUserConfirm.id;
                  const removedName = removeUserConfirm.name;
                  setRemovedUserIds(prev => { const s = new Set(prev); s.add(removedId); return s; });
                  showToast({
                    title: "User removed",
                    description: `${removedName} was removed from this agency.`,
                  }, 3000);
                  setRemoveUserConfirm(null);
                }}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-colors"
                style={{ background: "#EF4444" }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Section title — same as list view */}
      <div className="flex flex-col justify-center flex-shrink-0 mb-12"
        style={{ height: 71, borderBottom: `0.87px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB"}`, marginLeft: -48, marginRight: -48, paddingLeft: 28, paddingRight: 28 }}>
        <h1 className="text-[22px] font-normal" style={{ ...font, color: c.text }}>Agencies</h1>
      </div>

        {/* Back link */}
        <div className="pb-4 flex-shrink-0">
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
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            {agency.website ? (
              <a href={agency.website.startsWith("http") ? agency.website : `https://${agency.website}`}
                target="_blank" rel="noopener noreferrer"
                title={agency.website}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{ ...font, background: "transparent", border: `1px solid ${c.border}`, color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <Globe className="w-3.5 h-3.5" />Website
              </a>
            ) : (
              <button onClick={() => setIsEditing(true)}
                title="Add a website"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all"
                style={{ ...font, background: "transparent", border: `1px dashed ${c.borderStrong}`, color: c.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                <Plus className="w-3.5 h-3.5" />Add Website
              </button>
            )}
            {(agency.street || agency.city || agency.state || agency.zip) ? (
              <button onClick={() => setAddressModalOpen(true)}
                title={`${agency.street}, ${agency.city}, ${agency.state}, ${agency.zip}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{ ...font, background: "transparent", border: `1px solid ${c.border}`, color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <MapPin className="w-3.5 h-3.5" />Address
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)}
                title="Add an address"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all"
                style={{ ...font, background: "transparent", border: `1px dashed ${c.borderStrong}`, color: c.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                <Plus className="w-3.5 h-3.5" />Add Address
              </button>
            )}
            {agency.contactEmail ? (
              <a href={`mailto:${agency.contactEmail}`}
                title={agency.contactEmail}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{ ...font, background: "transparent", border: `1px solid ${c.border}`, color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <Mail className="w-3.5 h-3.5" />Send Email
              </a>
            ) : (
              <button onClick={() => setIsEditing(true)}
                title="Add an email"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all"
                style={{ ...font, background: "transparent", border: `1px dashed ${c.borderStrong}`, color: c.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                <Plus className="w-3.5 h-3.5" />Add Email
              </button>
            )}
            {agency.contactPhone ? (
              <button onClick={() => setCallModalOpen(true)}
                title="Phone Call"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{ ...font, background: "transparent", border: `1px solid ${c.border}`, color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <Phone className="w-3.5 h-3.5" />Phone Call
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)}
                title="Add a phone number"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all"
                style={{ ...font, background: "transparent", border: `1px dashed ${c.borderStrong}`, color: c.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                <Plus className="w-3.5 h-3.5" />Add Phone
              </button>
            )}
            {/* Admin-only: Book Roll — sells this agency's entire policy book to another agency. */}
            {currentUserIsAdmin && !bookRolled.has(agency.id) && (
              <button onClick={() => { setBookRollTargetId(""); setBookRollConfirmText(""); setBookRollOpen(true); }}
                title="Sell this agency's policy book to another agency"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{ ...font, background: "transparent", border: `1px solid ${c.border}`, color: c.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                <Archive className="w-3.5 h-3.5" />Book Roll
              </button>
            )}
            {bookRolled.has(agency.id) && (
              <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold"
                style={{ ...font, backgroundImage: "linear-gradient(88.54deg, rgba(92,46,212,0.08) 0.1%, rgba(166,20,195,0.10) 63.88%)", border: "1px solid rgba(166,20,195,0.22)" }}>
                {/* Gradient-stroked archive icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id={`soldArchiveGrad-${agency.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#5C2ED4" />
                      <stop offset="100%" stopColor="#A614C3" />
                    </linearGradient>
                  </defs>
                  <g stroke={`url(#soldArchiveGrad-${agency.id})`}>
                    <rect width="20" height="5" x="2" y="3" rx="1" />
                    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
                    <path d="M10 12h4" />
                  </g>
                </svg>
                <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sold to {bookRolled.get(agency.id)!.targetCode}</span>
              </span>
            )}
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
            {bookRolled.has(agency.id) || eStatus === "Unappointed" ? <UnapptBadge /> : <AppointedBadge />}
          </InfoCard>
          {/* Appointed Date card swaps to "Sold Date" when the agency has been book-rolled. */}
          {bookRolled.has(agency.id) ? (
            <InfoCard title="Sold Date" icon={<Archive className="w-5 h-5" style={{ color: "#A855F7" }} />}>
              <p className="text-[14px] font-semibold" style={{ ...font, color: c.text }}>{bookRolled.get(agency.id)!.date}</p>
              <p className="text-[11px] mt-1" style={{ ...font, color: c.muted }}>Originally appointed {agency.apptDate}</p>
            </InfoCard>
          ) : (
            <InfoCard title="Appointed Date" icon={<Calendar className="w-5 h-5" style={{ color: "#A855F7" }} />}>
              <p className="text-[14px] font-semibold" style={{ ...font, color: c.text }}>{agency.apptDate}</p>
            </InfoCard>
          )}
          <InfoCard title="Affiliations" icon={<Network className="w-5 h-5" style={{ color: "#A855F7" }} />}>
            <div className="space-y-1" style={{ paddingRight: 40 }}>
              {agency.affiliations.slice(0, 5).map(a => (
                <p key={a} className="text-[12px] leading-snug" style={{ ...font, color: c.text }}>{a}</p>
              ))}
              {agency.affiliations.length > 5 && (
                <p className="text-[11px] leading-snug" style={{ ...font, color: c.muted }}>+{agency.affiliations.length - 5} more</p>
              )}
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
                style={{ ...font, color: active ? activeTextColor : c.muted, letterSpacing: "0.01em" }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = c.muted; }}>
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
                {bookRolled.has(agency.id) || eStatus === "Unappointed"
                  ? <UnapptBadge />
                  : <AppointedBadge />}
              </div>
              {/* When sold or unappointed, swap Appt. Date → Reason. Book-rolled agencies always show "Sold". */}
              {bookRolled.has(agency.id) || eStatus === "Unappointed" ? (() => {
                const reasonText = bookRolled.has(agency.id) ? "Sold" : (eReason || "—");
                return <LabelValue label="Reason" value={<span style={{ color: "#A614C3", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{reasonText}</span>} />;
              })() : (
                <LabelValue label="Appt. Date" value={agency.apptDate} />
              )}
              {bookRolled.has(agency.id)
                ? <LabelValue label="Sold To" value={<span style={{ color: "#A614C3", fontWeight: 600 }}>{bookRolled.get(agency.id)!.targetCode}</span>} />
                : <div />}
              <LabelValue label="Agency Contact" value={agency.contact} />
              <LabelValue label="Email Address"  value={agency.contactEmail} />
              <div />
              <LabelValue label="Type of Business" value={agency.bizType} />
              <LabelValue label="Tax ID"           value={agency.taxId || "—"} />
              <LabelValue
                label="Website Url"
                value={
                  agency.website
                    ? agency.website
                    : <span style={{ fontStyle: "italic", color: c.muted }}>No website added for this agency yet.</span>
                }
              />
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
          <div className={editExpanded ? "p-8 mb-6" : "rounded-2xl p-8 mb-6"} style={editExpanded ? { background: c.cardBg } : { background: c.cardBg, border: `1px solid ${c.border}`, maxWidth: 1590 }}>
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
                          border: active ? "1px solid transparent" : `1px solid ${c.border}`,
                          background: active ? undefined : c.cardBg,
                          backgroundImage: active
                            ? `linear-gradient(88.54deg, rgba(92,46,212,0.06) 0.1%, rgba(166,20,195,0.06) 63.88%), linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)`
                            : undefined,
                          backgroundOrigin: active ? "padding-box, padding-box, border-box" : undefined,
                          backgroundClip: active ? "padding-box, padding-box, border-box" : undefined,
                        }}>
                        <Radio checked={active} onClick={() => setEType(t)} />
                        {active
                          ? <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t}</span>
                          : <span style={{ color: c.muted }}>{t}</span>
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
                <div className="grid grid-cols-3 gap-6">
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
                    containerStyle={{ width: "100%" }}
                    inputStyle={{ ...inputStyle, width: "100%" }}
                    dropdownBg={c.cardBg} dropdownText={c.text} dropdownBorder={c.border}
                  />
                  <div />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <input value={eCity} onChange={e => setECity(e.target.value)} placeholder="City" style={inputStyle} />
                  <div className="flex gap-4">
                    <select value={eState} onChange={e => setEState(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
                      {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <input value={eZip} onChange={e => setEZip(e.target.value)} placeholder="ZIP" style={{ ...inputStyle, flex: 1 }} />
                  </div>
                  <div />
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
                <div className="grid grid-cols-3 gap-6">
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
                    containerStyle={{ width: "100%", opacity: eSameAddr ? 0.5 : 1 }}
                    inputStyle={{ ...inputStyle, width: "100%" }}
                    disabled={eSameAddr}
                    dropdownBg={c.cardBg} dropdownText={c.text} dropdownBorder={c.border}
                  />
                  <div />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <input value={eSameAddr ? eCity : eMCity} onChange={e => setEMCity(e.target.value)}
                    placeholder="City" style={{ ...inputStyle, opacity: eSameAddr ? 0.5 : 1 }} disabled={eSameAddr} />
                  <div className="flex gap-4">
                    <select value={eSameAddr ? eState : eMState} onChange={e => setEMState(e.target.value)}
                      style={{ ...selectStyle, flex: 1, opacity: eSameAddr ? 0.5 : 1 }} disabled={eSameAddr}>
                      {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <input value={eSameAddr ? eZip : eMZip} onChange={e => setEMZip(e.target.value)}
                      placeholder="ZIP" style={{ ...inputStyle, flex: 1, opacity: eSameAddr ? 0.5 : 1 }} disabled={eSameAddr} />
                  </div>
                  <div />
                </div>
              </div>
            </div>

            {/* Status | Appt Date */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label style={labelStyle}>Status:</label>
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <button type="button" onClick={() => { setEStatusOpen(o => !o); setEBizTypeOpen(false); }}
                    className="w-full flex items-center justify-between outline-none"
                    style={{ ...inputStyle, cursor: "pointer" }}>
                    <span style={{ color: eStatus ? c.text : c.muted }}>{eStatus || "- Select one"}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${eStatusOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                  </button>
                  {eStatusOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
                      style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                      {["Appointed", "Unappointed"].map(opt => {
                        const active = eStatus === opt;
                        return (
                          <button key={opt} type="button" onClick={() => { setEStatus(opt); setEStatusOpen(false); }}
                            className="w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors"
                            style={{ ...font, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                            <span>{opt}</span>
                            {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              {eStatus === "Unappointed" ? (
                <div>
                  <label style={labelStyle}>Reason:</label>
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button type="button" onClick={() => { setEReasonOpen(o => !o); setEStatusOpen(false); setEBizTypeOpen(false); }}
                      className="w-full flex items-center justify-between outline-none"
                      style={{ ...inputStyle, cursor: "pointer" }}>
                      <span style={{ color: eReason ? c.text : c.muted }}>{eReason || "Select reason"}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${eReasonOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                    </button>
                    {eReasonOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
                        style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                        {E_REASON_OPTIONS.map(opt => {
                          const active = eReason === opt;
                          return (
                            <button key={opt} type="button" onClick={() => { setEReason(opt); setEReasonOpen(false); }}
                              className="w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors"
                              style={{ ...font, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                              onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                              <span>{opt}</span>
                              {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label style={labelStyle}>Appt. Date</label>
                  <DatePicker value={eApptDate} onChange={setEApptDate} inputStyle={inputStyle} c={c} btnGrad={btnGrad} font={font} />
                </div>
              )}
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
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <button type="button" onClick={() => { setEBizTypeOpen(o => !o); setEStatusOpen(false); }}
                    className="w-full flex items-center justify-between outline-none"
                    style={{ ...inputStyle, cursor: "pointer" }}>
                    <span style={{ color: eBizType && eBizType !== "-Business Type" ? c.text : c.muted }}>{eBizType && eBizType !== "-Business Type" ? eBizType : "-Business Type"}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${eBizTypeOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                  </button>
                  {eBizTypeOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
                      style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                      {["Corporation","Joint Venture","Limited Liability Company","Limited Partnership","Partnership","Sole Proprietorship or individual","Sole Proprietorship"].map(opt => {
                        const active = eBizType === opt;
                        return (
                          <button key={opt} type="button" onClick={() => { setEBizType(opt); setEBizTypeOpen(false); }}
                            className="w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors"
                            style={{ ...font, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                            <span>{opt}</span>
                            {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
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
                <input value={ePhone} onChange={e => setEPhone(formatPhone(e.target.value))} placeholder="(000) 000-0000" style={inputStyle} inputMode="tel" />
              </div>
              <div>
                <label style={labelStyle}>Toll Free Number:</label>
                <input value={eTollFree} onChange={e => setETollFree(formatPhone(e.target.value))} placeholder="(000) 000-0000" style={inputStyle} inputMode="tel" />
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
                          className="flex items-center gap-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap justify-center transition-all"
                          style={{ ...font, width: 120, height: 40, boxSizing: "border-box",
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
              style={{ ...font, border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              Cancel
            </button>
            <button onClick={() => {
                const w9Changed = (
                  eName !== agency.name
                  || eType !== agency.agencyType
                  || eStreet !== agency.street || eCity !== agency.city || eState !== agency.state || eZip !== agency.zip
                  || eTaxId !== agency.taxId
                );
                const licChanged = eLicNo !== agency.licenseNo;
                setIsEditing(false);
                if (w9Changed || licChanged) setDocUpdateModal({ w9: w9Changed, license: licChanged });
              }}
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

        {/* ── Documents tab ── */}
        {detailTab === "documents" && (() => {
          // Smart triggers — fire when source-of-truth fields drift from current agency baseline.
          const w9Drift = (
            eName !== agency.name
            || eType !== agency.agencyType
            || eStreet !== agency.street || eCity !== agency.city || eState !== agency.state || eZip !== agency.zip
            || eTaxId !== agency.taxId
          );
          const licenseDrift = eLicNo !== agency.licenseNo;
          const docsByCat = (cat: AgencyDocCategory) => agencyDocs.filter(d => d.category === cat);
          // Mock E&O record — read-only per agreement clause.
          const eoExpiry = agency.eoExp || "Mar 1, 2027";
          const isAdmin = currentUserIsAdmin;
          const handleUpload = (cat: AgencyDocCategory) => {
            // Demo: add a mock row for the new upload. Old W-9 auto-archives.
            const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const fileName = cat === "bor" ? `BOR-${Date.now()}.pdf`
              : cat === "w9" ? `W9-${new Date().getFullYear()}.pdf`
              : cat === "license" ? `${agency.state || "NY"}-License-Updated.pdf`
              : `Agreement-${Date.now()}.pdf`;
            setAgencyDocs(prev => {
              if (cat === "w9") {
                // Archive previous current W-9, add new one as current.
                return [
                  { id: `d${Date.now()}`, category: "w9", name: fileName, date: today },
                  ...prev.map(d => d.category === "w9" && !d.archived ? { ...d, archived: true } : d),
                ];
              }
              return [{ id: `d${Date.now()}`, category: cat, name: fileName, date: today }, ...prev];
            });
            showToast({ title: "Document uploaded", description: `${fileName} added to ${cat === "bor" ? "Broker of Record" : cat === "w9" ? "W-9" : cat === "license" ? "License" : "Agreements"}.` });
          };
          const archiveDoc = (id: string) => {
            setAgencyDocs(prev => prev.map(d => d.id === id ? { ...d, archived: true } : d));
          };
          const removeDoc = (id: string) => {
            setAgencyDocs(prev => prev.filter(d => d.id !== id));
          };

          // Reusable section component
          const Section = ({ category, title, count, hint }: { category: AgencyDocCategory; title: string; count: string; hint?: string }) => (
            <div className="rounded-xl mb-4" style={{ border: `1px solid ${c.border}`, background: c.cardBg }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" style={{ color: "#A855F7" }} />
                  <span className="text-[13px] font-bold" style={{ ...font, color: c.text }}>{title}</span>
                  <span className="text-[12px]" style={{ ...font, color: c.muted }}>({count})</span>
                </div>
                {isAdmin && (
                  <button onClick={() => handleUpload(category)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold transition-colors"
                    style={{ ...font, color: "#A614C3", background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.20)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(168,85,247,0.14)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(168,85,247,0.08)")}>
                    <Upload className="w-3 h-3" />Upload
                  </button>
                )}
              </div>
              {docsByCat(category).length === 0 ? (
                <div className="px-5 py-6 text-center text-[12px]" style={{ ...font, color: c.muted }}>
                  No documents yet. {isAdmin && "Click Upload to add one."}
                </div>
              ) : (
                <div>
                  {docsByCat(category).map((d, idx, arr) => (
                    <div key={d.id} className="flex items-center gap-3 px-5 py-2.5"
                      style={{ borderBottom: idx !== arr.length - 1 ? `1px solid ${c.border}` : "none" }}>
                      <FileText className="w-4 h-4 flex-shrink-0" style={{ color: c.muted }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] truncate" style={{ ...font, color: c.text }}>{d.name}</span>
                          {category === "w9" && !d.archived && (
                            <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ ...font, color: "#A614C3", background: "rgba(168,85,247,0.10)", letterSpacing: "0.04em" }}>Current</span>
                          )}
                          {d.archived && (
                            <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ ...font, color: c.muted, background: c.hoverBg, letterSpacing: "0.04em" }}>Archived</span>
                          )}
                        </div>
                        <div className="text-[11px]" style={{ ...font, color: c.muted }}>{d.date}</div>
                      </div>
                      <button title="View" className="p-1.5 rounded transition-colors"
                        style={{ color: c.muted }}
                        onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button title="Download" className="p-1.5 rounded transition-colors"
                        style={{ color: c.muted }}
                        onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      {isAdmin && !d.archived && category === "w9" && (
                        <button title="Archive" onClick={() => archiveDoc(d.id)}
                          className="p-1.5 rounded transition-colors"
                          style={{ color: c.muted }}
                          onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isAdmin && (d.archived || category !== "w9") && (
                        <button title="Delete" onClick={() => removeDoc(d.id)}
                          className="p-1.5 rounded transition-colors"
                          style={{ color: c.muted }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#EF4444"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {hint && (
                <div className="px-5 py-2.5 text-[11px] flex items-start gap-1.5" style={{ ...font, color: c.muted, borderTop: `1px solid ${c.border}` }}>
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>{hint}</span>
                </div>
              )}
            </div>
          );

          return (
            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto pb-4">
              {/* ImageRight sync strip */}
              <div className="flex items-center gap-2 px-5 py-2 mb-4 rounded-lg text-[12px] flex-shrink-0"
                style={{ ...font, color: c.muted, background: c.cardBg, border: `1px solid ${c.border}` }}>
                <RefreshCw className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />
                <span>Synced from <strong style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>ImageRight</strong> · {imageRightSyncMins === 0 ? "just now" : `${imageRightSyncMins} min ago`}</span>
                <button onClick={() => { setImageRightSyncMins(0); showToast({ title: "Synced", description: "ImageRight is up to date." }); }}
                  className="ml-auto font-semibold transition-opacity hover:opacity-80"
                  style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Sync now
                </button>
              </div>

              {/* Trigger banners */}
              {w9Drift && (
                <div className="flex items-center gap-2.5 px-4 py-2 mb-3 rounded-lg text-[12px] flex-shrink-0 relative overflow-hidden"
                  style={{ ...font, color: c.text, background: isDark ? "rgba(166,20,195,0.10)" : "rgba(166,20,195,0.05)", border: `1px solid rgba(166,20,195,${isDark ? "0.35" : "0.22"})` }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                    <defs>
                      <linearGradient id="w9-alert-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#5C2ED4" />
                        <stop offset="100%" stopColor="#A614C3" />
                      </linearGradient>
                    </defs>
                    <circle cx="8" cy="8" r="7" stroke="url(#w9-alert-grad)" strokeWidth="1.5" />
                    <rect x="7.25" y="3.5" width="1.5" height="5.5" rx="0.75" fill="url(#w9-alert-grad)" />
                    <circle cx="8" cy="11.5" r="0.9" fill="url(#w9-alert-grad)" />
                  </svg>
                  <span>Agency information changed — please upload an updated <strong>W-9</strong>.</span>
                  <button onClick={() => handleUpload("w9")} className="ml-auto font-semibold transition-opacity hover:opacity-80"
                    style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Upload W-9
                  </button>
                </div>
              )}
              {licenseDrift && (
                <div className="flex items-center gap-2.5 px-4 py-2 mb-3 rounded-lg text-[12px] flex-shrink-0 relative overflow-hidden"
                  style={{ ...font, color: c.text, background: isDark ? "rgba(166,20,195,0.10)" : "rgba(166,20,195,0.05)", border: `1px solid rgba(166,20,195,${isDark ? "0.35" : "0.22"})` }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                    <defs>
                      <linearGradient id="lic-alert-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#5C2ED4" />
                        <stop offset="100%" stopColor="#A614C3" />
                      </linearGradient>
                    </defs>
                    <circle cx="8" cy="8" r="7" stroke="url(#lic-alert-grad)" strokeWidth="1.5" />
                    <rect x="7.25" y="3.5" width="1.5" height="5.5" rx="0.75" fill="url(#lic-alert-grad)" />
                    <circle cx="8" cy="11.5" r="0.9" fill="url(#lic-alert-grad)" />
                  </svg>
                  <span>License number changed — please upload the updated <strong>license copy</strong>.</span>
                  <button onClick={() => handleUpload("license")} className="ml-auto font-semibold transition-opacity hover:opacity-80"
                    style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Upload License
                  </button>
                </div>
              )}

              {/* Sections */}
              <Section category="bor"       title="Broker of Record" count={String(docsByCat("bor").length)} />
              <Section category="w9"        title="W-9"              count={`${docsByCat("w9").filter(d => !d.archived).length} current · ${docsByCat("w9").filter(d => d.archived).length} archived`} hint="Required when name, entity type, address, or TIN changes." />
              <Section category="license"   title="License"          count={String(docsByCat("license").length)} hint="Required when license number changes." />
              <Section category="agreement" title="Agreements"       count={String(docsByCat("agreement").length)} />

              {/* E&O (read-only) */}
              <div className="rounded-xl mb-4" style={{ border: `1px solid ${c.border}`, background: c.cardBg }}>
                <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4" style={{ color: "#A855F7" }} />
                    <span className="text-[13px] font-bold" style={{ ...font, color: c.text }}>E&amp;O Certificate</span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ ...font, color: c.muted, background: c.hoverBg, letterSpacing: "0.04em" }}>
                    <Lock className="w-3 h-3" />Read-only
                  </span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5">
                  <FileText className="w-4 h-4 flex-shrink-0" style={{ color: c.muted }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px]" style={{ ...font, color: c.text }}>EO-Certificate.pdf</div>
                    <div className="text-[11px]" style={{ ...font, color: c.muted }}>Expires {eoExpiry}</div>
                  </div>
                  <button title="View" className="p-1.5 rounded transition-colors"
                    style={{ color: c.muted }}
                    onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button title="Download" className="p-1.5 rounded transition-colors"
                    style={{ color: c.muted }}
                    onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="px-5 py-2.5 text-[11px] flex items-start gap-1.5" style={{ ...font, color: c.muted, borderTop: `1px solid ${c.border}` }}>
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>E&amp;O must remain active per agreement clause — contact compliance to update.</span>
                </div>
              </div>
            </div>
          );
        })()}

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
                            {noteFilterType === t && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </button>
                        ))}
                        <div style={{ height:1, background:c.border, margin:"6px 0" }} />
                        <p className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5" style={{ fontFamily: FONT, color: c.muted }}>Filter by Visibility</p>
                        {([
                          ["All", null],
                          ["Private", Lock],
                          ["Shared", Users],
                        ] as const).map(([v, Icon]) => (
                          <button key={v} onClick={() => { setVisibilityFilter(v as typeof visibilityFilter); }}
                            className="w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between transition-colors"
                            style={{ fontFamily: FONT, color: visibilityFilter === v ? "#A614C3" : c.text, background: visibilityFilter === v ? "rgba(168,85,247,0.08)" : "transparent" }}>
                            <span className="flex items-center gap-2">{Icon && <Icon className="w-3 h-3" />}{v === "All" ? "All Visibility" : v}</span>
                            {visibilityFilter === v && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
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
                            <span>{label}</span>{noteSortDir === d && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
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
                      <button onClick={() => setDeleteNoteId(null)} className="px-4 py-2 rounded-lg text-[12px]" style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text }}>Cancel</button>
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
                        style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: "transparent" }}>Cancel</button>
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
                onClick={e => { e.stopPropagation(); setNoteMoreOpen(false); }}>
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
                            <button onClick={() => { setNoteMoreOpen(p => !p); }} className="p-1.5 rounded-md" style={{ color: c.muted }}>
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
                          <button onClick={() => { setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                            className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                            onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="flex-1 overflow-y-auto py-6 relative" style={{ paddingLeft:28, paddingRight:28 }}>
                        {copyToast && <div className="absolute top-3 right-4 z-50 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white shadow-lg" style={{ background: btnGrad, fontFamily: FONT }}>{copyToast}</div>}
                        {noteLocked && isLockedByOther && (
                          <div className="mb-4 flex items-center justify-between px-4 py-3 rounded-xl" style={{ background:"rgba(168,85,247,0.07)", border:"1px solid rgba(168,85,247,0.20)" }}>
                            <div className="flex items-center gap-2">
                              <Lock className="w-4 h-4" style={{ color:"#A855F7" }} />
                              <span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>Locked by <strong>{lockedBy}</strong></span>
                            </div>
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
      {([["Private",Lock,"Only you can see this note"],["Shared",Users,"Visible to everyone in your team"]] as const).map(([v,Ic,tip]) => (
        <button key={v} title={tip} onClick={() => (!noteLocked&&!showTrashed)&&setEditNoteVisibility(v)}
          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5"
          style={{ fontFamily:FONT, background:editNoteVisibility===v?"rgba(168,85,247,0.10)":"transparent", color:editNoteVisibility===v?"#A855F7":c.muted, border:`1px solid ${editNoteVisibility===v?"rgba(168,85,247,0.35)":c.border}`, cursor:(noteLocked||showTrashed)?"default":"pointer" }}>
          <Ic className="w-3 h-3" />{v}
        </button>
      ))}
    </div>
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
                onClick={e => { e.stopPropagation(); setNoteMoreOpen(false); }}>
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
                        <button onClick={() => { setNoteMoreOpen(p => !p); }} className="p-1.5 rounded-md" style={{ color: c.muted }}>
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
                      <button onClick={() => { setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                        className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                        onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="flex-1 overflow-y-auto relative" style={{ paddingLeft:72, paddingRight:72, paddingTop:24, paddingBottom:24 }}>
                    {copyToast && <div className="absolute top-3 right-6 z-50 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white shadow-lg" style={{ background:btnGrad, fontFamily:FONT }}>{copyToast}</div>}
                    {noteLocked && isLockedByOther && (
                      <div className="mb-4 flex items-center justify-between px-4 py-3 rounded-xl" style={{ background:"rgba(168,85,247,0.07)", border:"1px solid rgba(168,85,247,0.20)" }}>
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" style={{ color:"#A855F7" }} />
                          <span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>Locked by <strong>{lockedBy}</strong></span>
                        </div>
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
      {([["Private",Lock,"Only you can see this note"],["Shared",Users,"Visible to everyone in your team"]] as const).map(([v,Ic,tip]) => (
        <button key={v} title={tip} onClick={() => (!noteLocked&&!showTrashed)&&setEditNoteVisibility(v)}
          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5"
          style={{ fontFamily:FONT, background:editNoteVisibility===v?"rgba(168,85,247,0.10)":"transparent", color:editNoteVisibility===v?"#A855F7":c.muted, border:`1px solid ${editNoteVisibility===v?"rgba(168,85,247,0.35)":c.border}`, cursor:(noteLocked||showTrashed)?"default":"pointer" }}>
          <Ic className="w-3 h-3" />{v}
        </button>
      ))}
    </div>
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
                <button title="Reset filters" onClick={() => { setDetailSearch(""); setLobFilter("All LOBs"); setStatusFilter("All Statuses"); setApplicantFilter(new Set()); setProducerFilter(new Set()); setApplicantSearch(""); setProducerSearch(""); setLobOpen(false); setStatusOpen(false); setApplicantOpen(false); setProducerOpen(false); setQpSortKey(null); setQpSortDir("asc"); }}
                  className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-4 h-4"/></button>
                <div className="relative" onClick={e=>e.stopPropagation()}><button title="View columns" onClick={()=>setQpViewOpen(o=>!o)} className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3", background: qpViewOpen ? c.hoverBg : "transparent" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background = qpViewOpen ? c.hoverBg : "transparent")}><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="2" y="2" rx="1"/><rect width="5" height="5" x="9.5" y="2" rx="1"/><rect width="5" height="5" x="17" y="2" rx="1"/><rect width="5" height="5" x="2" y="9.5" rx="1"/><rect width="5" height="5" x="9.5" y="9.5" rx="1"/><rect width="5" height="5" x="17" y="9.5" rx="1"/><rect width="5" height="5" x="2" y="17" rx="1"/><rect width="5" height="5" x="9.5" y="17" rx="1"/><rect width="5" height="5" x="17" y="17" rx="1"/></svg></button>{qpViewOpen && (<div className="absolute right-0 top-full mt-1 z-30 w-[220px] rounded-xl shadow-xl overflow-hidden" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}><div className="px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold" style={{ fontFamily: FONT, color: c.muted, borderBottom: `1px solid ${c.border}`, letterSpacing: "0.06em" }}>Show Columns</div><div className="py-1.5 max-h-[280px] overflow-y-auto">{QP_COLUMNS.map(col => { const visible = !qpHiddenCols.has(col.key); return (<label key={col.key} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors" onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} onClick={() => setQpHiddenCols(prev => { const s = new Set(prev); s.has(col.key) ? s.delete(col.key) : s.add(col.key); return s; })}><div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>{visible && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div><span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>{col.label}</span></label>); })}</div><button onClick={() => setQpHiddenCols(new Set())} className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors" style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }} onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}><RefreshCw className="w-3.5 h-3.5" />Show All</button></div>)}</div>
                <button title="Export" className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><Download className="w-4 h-4"/></button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden flex flex-col flex-1 min-h-0" style={{ background:c.cardBg, border:`1px solid ${c.border}` }}>
              <div className="grid px-5 py-3 gap-4" style={{ gridTemplateColumns:qpGridTemplate, borderBottom:`1px solid ${c.border}`, background:mutedBg }}>
                {/* Created */}
                {!qpHiddenCols.has("created") && (
                <button onClick={()=>{if(qpSortKey==="createdDate")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("createdDate");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Created<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="createdDate"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="createdDate"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* Policy Number */}
                {!qpHiddenCols.has("policyNumber") && (
                <button onClick={()=>{if(qpSortKey==="policyNumber")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("policyNumber");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Policy Number<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="policyNumber"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="policyNumber"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* Applicant */}
                {!qpHiddenCols.has("applicant") && (
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
                )}
                {/* DBA */}
                {!qpHiddenCols.has("dba") && (
                <button onClick={()=>{if(qpSortKey==="dba")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("dba");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  DBA<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="dba"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="dba"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* Effective */}
                {!qpHiddenCols.has("effective") && (
                <button onClick={()=>{if(qpSortKey==="effectiveDate")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("effectiveDate");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Effective<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="effectiveDate"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="effectiveDate"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* LOB */}
                {!qpHiddenCols.has("lob") && (
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
                )}
                {/* Status */}
                {!qpHiddenCols.has("status") && (
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
                )}
                {/* Producer */}
                {!qpHiddenCols.has("producer") && (
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
                )}
              </div>
              <div className="overflow-y-auto flex-1">
                {agencyPolicies.length === 0 ? (
                  <div className="flex items-center justify-center py-16 text-[13px]" style={{ fontFamily:FONT, color:c.muted }}>No policies found</div>
                ) : agencyPolicies.map((p,i,arr) => {
                  const isRenewal = p.status === "Upcoming Renewal";
                  return (
                    <div key={p.id} className="grid px-5 py-3.5 items-center gap-4 transition-colors cursor-pointer"
                      style={{ gridTemplateColumns:qpGridTemplate, borderBottom:i!==arr.length-1?`1px solid ${c.border}`:"none", background:isRenewal?"rgba(116,195,183,0.08)":"transparent", borderLeft:isRenewal?"3px solid #74C3B7":"3px solid transparent" }}
                      onMouseEnter={e=>(e.currentTarget.style.background=isRenewal?"rgba(116,195,183,0.14)":c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background=isRenewal?"rgba(116,195,183,0.08)":"transparent")}>
                      {!qpHiddenCols.has("created")      && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{new Date(p.createdDate).toLocaleDateString()}</div>}
                      {!qpHiddenCols.has("policyNumber") && <div className="text-[12px] font-semibold" style={{ fontFamily:FONT, color: isDark ? "#4ECDC4" : "#A614C3" }}>{p.policyNumber}</div>}
                      {!qpHiddenCols.has("applicant")    && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.applicant}</div>}
                      {!qpHiddenCols.has("dba")          && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.dba||"—"}</div>}
                      {!qpHiddenCols.has("effective")    && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{new Date(p.effectiveDate).toLocaleDateString()}</div>}
                      {!qpHiddenCols.has("lob")          && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.lob}</div>}
                      {!qpHiddenCols.has("status")       && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.status}</div>}
                      {!qpHiddenCols.has("producer")     && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.producer}</div>}
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
                <button title="Reset filters" onClick={() => { setDetailSearch(""); setLobFilter("All LOBs"); setStatusFilter("All Statuses"); setApplicantFilter(new Set()); setProducerFilter(new Set()); setApplicantSearch(""); setProducerSearch(""); setLobOpen(false); setStatusOpen(false); setApplicantOpen(false); setProducerOpen(false); setQpSortKey(null); setQpSortDir("asc"); }}
                  className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-4 h-4"/></button>
                <div className="relative" onClick={e=>e.stopPropagation()}><button title="View columns" onClick={()=>setQpViewOpen(o=>!o)} className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3", background: qpViewOpen ? c.hoverBg : "transparent" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background = qpViewOpen ? c.hoverBg : "transparent")}><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="2" y="2" rx="1"/><rect width="5" height="5" x="9.5" y="2" rx="1"/><rect width="5" height="5" x="17" y="2" rx="1"/><rect width="5" height="5" x="2" y="9.5" rx="1"/><rect width="5" height="5" x="9.5" y="9.5" rx="1"/><rect width="5" height="5" x="17" y="9.5" rx="1"/><rect width="5" height="5" x="2" y="17" rx="1"/><rect width="5" height="5" x="9.5" y="17" rx="1"/><rect width="5" height="5" x="17" y="17" rx="1"/></svg></button>{qpViewOpen && (<div className="absolute right-0 top-full mt-1 z-30 w-[220px] rounded-xl shadow-xl overflow-hidden" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}><div className="px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold" style={{ fontFamily: FONT, color: c.muted, borderBottom: `1px solid ${c.border}`, letterSpacing: "0.06em" }}>Show Columns</div><div className="py-1.5 max-h-[280px] overflow-y-auto">{QP_COLUMNS.map(col => { const visible = !qpHiddenCols.has(col.key); return (<label key={col.key} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors" onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} onClick={() => setQpHiddenCols(prev => { const s = new Set(prev); s.has(col.key) ? s.delete(col.key) : s.add(col.key); return s; })}><div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>{visible && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div><span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>{col.label}</span></label>); })}</div><button onClick={() => setQpHiddenCols(new Set())} className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors" style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }} onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}><RefreshCw className="w-3.5 h-3.5" />Show All</button></div>)}</div>
                <button title="Export" className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><Download className="w-4 h-4"/></button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden flex flex-col flex-1 min-h-0" style={{ background:c.cardBg, border:`1px solid ${c.border}` }}>
              <div className="grid px-5 py-3 gap-4" style={{ gridTemplateColumns:qpGridTemplate, borderBottom:`1px solid ${c.border}`, background:mutedBg }}>
                {/* Created */}
                {!qpHiddenCols.has("created") && (
                <button onClick={()=>{if(qpSortKey==="createdDate")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("createdDate");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Created<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="createdDate"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="createdDate"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* Submission ID */}
                {!qpHiddenCols.has("policyNumber") && (
                <button onClick={()=>{if(qpSortKey==="quoteId")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("quoteId");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Submission ID<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="quoteId"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="quoteId"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* Applicant */}
                {!qpHiddenCols.has("applicant") && (
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
                )}
                {/* DBA */}
                {!qpHiddenCols.has("dba") && (
                <button onClick={()=>{if(qpSortKey==="dba")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("dba");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  DBA<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="dba"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="dba"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* Effective */}
                {!qpHiddenCols.has("effective") && (
                <button onClick={()=>{if(qpSortKey==="effectiveDate")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("effectiveDate");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Effective<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="effectiveDate"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="effectiveDate"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* LOB */}
                {!qpHiddenCols.has("lob") && (
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
                )}
                {/* Status */}
                {!qpHiddenCols.has("status") && (
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
                )}
                {/* Producer */}
                {!qpHiddenCols.has("producer") && (
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
                )}
              </div>
              <div className="overflow-y-auto flex-1">
                {agencyQuotes.length === 0 ? (
                  <div className="flex items-center justify-center py-16 text-[13px]" style={{ fontFamily:FONT, color:c.muted }}>No quotes found</div>
                ) : agencyQuotes.map((q,i,arr) => {
                  const isIncomplete = q.status === "Incomplete";
                  return (
                    <div key={q.id} className="grid px-5 py-3.5 items-center gap-4 transition-colors cursor-pointer"
                      style={{ gridTemplateColumns:qpGridTemplate, borderBottom:i!==arr.length-1?`1px solid ${c.border}`:"none", background:isIncomplete?"rgba(245,158,11,0.06)":"transparent", borderLeft:isIncomplete?"3px solid #F59E0B":"3px solid transparent" }}
                      onMouseEnter={e=>(e.currentTarget.style.background=isIncomplete?"rgba(245,158,11,0.10)":c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background=isIncomplete?"rgba(245,158,11,0.06)":"transparent")}>
                      {!qpHiddenCols.has("created")      && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{new Date(q.createdDate).toLocaleDateString()}</div>}
                      {!qpHiddenCols.has("policyNumber") && <div className="text-[12px] font-semibold" style={{ fontFamily:FONT, color: isDark ? "#4ECDC4" : "#A614C3" }}>{q.quoteId}</div>}
                      {!qpHiddenCols.has("applicant")    && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.applicant}</div>}
                      {!qpHiddenCols.has("dba")          && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.dba||"—"}</div>}
                      {!qpHiddenCols.has("effective")    && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.effectiveDate?new Date(q.effectiveDate).toLocaleDateString():"—"}</div>}
                      {!qpHiddenCols.has("lob")          && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.lob}</div>}
                      {!qpHiddenCols.has("status")       && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.status}</div>}
                      {!qpHiddenCols.has("producer")     && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.producer}</div>}
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
              <div className="ml-auto flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); setUsersView(v => v === "inactive" ? "active" : "inactive"); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                  title={usersView === "inactive" ? "Click to go back to Active Users" : "Show deactivated users"}
                  style={{ fontFamily: FONT,
                    background: usersView === "inactive" ? "rgba(245,158,11,0.10)" : "transparent",
                    color: usersView === "inactive" ? "#F59E0B" : c.muted,
                    border: `1px solid ${usersView === "inactive" ? "rgba(245,158,11,0.25)" : c.border}` }}
                  onMouseEnter={e => { if (usersView !== "inactive") e.currentTarget.style.background = c.hoverBg; }}
                  onMouseLeave={e => { if (usersView !== "inactive") e.currentTarget.style.background = "transparent"; }}>
                  <Archive className="w-3.5 h-3.5" />
                  {usersView === "inactive" ? "Back to Active Users" : "View Inactive Users"}
                  {usersView !== "inactive" && inactiveCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6", color: c.muted }}>{inactiveCount}</span>
                  )}
                </button>
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

              {/* No-Principal guard — if the agency has active users but none of them is Principal,
                  surface a CTA to assign one. Either pick from existing users or jump to the Add User flow. */}
              {(() => {
                const activeForAgency = mockAgencyUsers.filter(u => u.agencyId === agency.id && !removedUserIds.has(u.id) && !inactiveUserIds.has(u.id));
                const hasPrincipal = activeForAgency.some(u =>
                  principalOverride && u.id === principalOverride.newId ? true
                  : principalOverride && u.id === principalOverride.oldId ? false
                  : u.jobTitle === "Principal"
                );
                if (hasPrincipal || usersView !== "active" || activeForAgency.length === 0) return null;
                return (
                  <div className="px-6 py-2.5 flex items-center gap-2 text-[12px]"
                    style={{ fontFamily: FONT, color: c.text, background: c.cardBg, borderBottom: `1px solid ${c.border}` }}>
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#F59E0B" }} />
                    <span>No Principal assigned — every agency requires one.</span>
                    <button onClick={() => { setAssignPrincipalChoice(""); setAssignPrincipalOpen(true); }}
                      className="font-semibold transition-colors ml-auto" style={{ color: "#A614C3" }}>Pick existing</button>
                    <span style={{ color: c.muted }}>·</span>
                    <button onClick={() => { setAuJobTitle("Principal"); setAddUserOpen(true); }}
                      className="font-semibold transition-colors" style={{ color: "#A614C3" }}>Add new user</button>
                  </div>
                );
              })()}

              {/* Rows */}
              <div className="overflow-y-auto flex-1" style={{ background: c.cardBg }}>
                {agencyUsers.length === 0 ? (() => {
                  // When search has 0 active matches, check if any inactive users would match the same query
                  // and offer to surface them with a one-click "Show inactive" affordance.
                  const q = userSearch.trim().toLowerCase();
                  const inactiveMatchCount = q && usersView === "active"
                    ? mockAgencyUsers.filter(u =>
                        u.agencyId === agency.id
                        && !removedUserIds.has(u.id)
                        && inactiveUserIds.has(u.id)
                        && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
                        && (jobTitleFilter.size === 0 || jobTitleFilter.has(u.jobTitle))
                      ).length
                    : 0;
                  return (
                    <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ fontFamily: FONT }}>
                      <span className="text-[13px]" style={{ color: c.muted }}>No users found</span>
                      {inactiveMatchCount > 0 && (
                        <button onClick={() => setUsersView("inactive")}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                          style={{ background: "rgba(245,158,11,0.10)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.25)" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,158,11,0.16)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(245,158,11,0.10)")}>
                          {inactiveMatchCount} inactive {inactiveMatchCount === 1 ? "user" : "users"} also match — Show inactive
                        </button>
                      )}
                    </div>
                  );
                })() : agencyUsers.map((u, i, arr) => {
                  // Honor a Principal-role transfer: the new user becomes Principal, the old one is demoted in the UI.
                  const effectiveJobTitle =
                    principalOverride && u.id === principalOverride.newId ? "Principal"
                    : principalOverride && u.id === principalOverride.oldId && u.jobTitle === "Principal" ? "Producer"
                    : u.jobTitle;
                  const isPrincipal = effectiveJobTitle === "Principal";
                  const isInactive = inactiveUserIds.has(u.id);
                  return (
                    <div key={u.id}
                      className="grid items-center px-6 cursor-pointer transition-colors relative"
                      style={{ gridTemplateColumns:"150px 290px 1fr 1.8fr 1.3fr 0.4fr 44px", gap:16, height:60,
                        borderBottom: i !== arr.length-1 ? `1px solid ${c.border}` : "none" }}
                      onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>

                      {/* Principal indicator — absolute so it doesn't shift grid */}
                      {isPrincipal && !isInactive && (
                        <div className="absolute left-0 top-0 bottom-0 rounded-l-sm" style={{ width:3, background:"#A614C3" }} />
                      )}
                      {isInactive && (
                        <div className="absolute left-0 top-0 bottom-0 rounded-l-sm" style={{ width:3, background:"#F59E0B" }} />
                      )}

                      {/* Name */}
                      <div className="min-w-0 flex items-center gap-2">
                        <div className="text-[13px] font-semibold truncate" style={{ fontFamily:FONT, color:c.text }}>{u.name}</div>
                        {isInactive && (
                          <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{ fontFamily:FONT, background:"rgba(245,158,11,0.12)", color:"#F59E0B", letterSpacing: "0.04em" }}>
                            Inactive
                          </span>
                        )}
                      </div>

                      {/* Admin — render gear icon when the user has admin permissions (including auto-grants from Principal reassignment). */}
                      <div className="flex items-center justify-center">
                        {(u.isAdmin || adminGrantOverrides.has(u.id))
                          ? <GradientUserCog size={18} />
                          : <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>—</span>}
                      </div>

                      {/* Job title */}
                      <div className="text-[13px] text-left" style={{ fontFamily:FONT, color:c.text }}>{effectiveJobTitle || "—"}</div>

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
                        {userMenuId === u.id && (() => {
                          const isInactive = inactiveUserIds.has(u.id);
                          const base = ["Edit User", "Reset Password"];
                          const adminOnly = isInactive ? ["Reactivate", "Remove"] : ["Deactivate", "Remove"];
                          const actions = currentUserIsAdmin ? [...base, ...adminOnly] : base;
                          return (
                          <div className="absolute right-0 top-9 z-20 rounded-xl shadow-xl overflow-hidden min-w-[150px]"
                            style={{ background:isDark?"#1E2240":"#FFFFFF", border:`1px solid ${c.border}` }}>
                            {actions.map(action => (
                              <button key={action} className="w-full text-left px-4 py-2 text-[12px] transition-colors"
                                style={{ fontFamily:FONT, color:action==="Remove"?"#EF4444":action==="Reactivate"?"#10B981":c.text }}
                                onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                                onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                                onClick={() => {
                                  if (action === "Edit User") {
                                    const parts = u.name.trim().split(/\s+/);
                                    setAuFirstName(parts[0] || "");
                                    setAuLastName(parts.slice(1).join(" "));
                                    setAuIsAdmin(u.isAdmin);
                                    setAuAdminLevel("");
                                    setAuJobTitle(u.jobTitle);
                                    setAuStatus("Active");
                                    setAuPhone(u.phone);
                                    setAuExt(u.ext);
                                    setAuMobile("");
                                    setAuSms(false);
                                    setAuEmail(u.email);
                                    setAuAddress("");
                                    setAuCity("");
                                    setAuState("");
                                    setAuZip("");
                                    setEditUserId(u.id);
                                  } else if (action === "Deactivate") {
                                    // If Principal or Agency Contact, require reassignment before deactivating.
                                    // Use effective role (honors a previous reassignment override).
                                    const isPrin = principalOverride
                                      ? u.id === principalOverride.newId
                                      : u.jobTitle === "Principal";
                                    const currentContactName = agencyContactOverride ?? agency.contact;
                                    const isCon = u.name === currentContactName;
                                    if (isPrin || isCon) {
                                      setRoleReassign({ userId: u.id, userName: u.name, action: "deactivate", needsPrincipal: isPrin, needsContact: isCon });
                                      setReassignPrincipalId("");
                                      setReassignContactId("");
                                    } else {
                                      setInactiveUserIds(prev => { const s = new Set(prev); s.add(u.id); return s; });
                                      showToast({
                                        title: "User deactivated",
                                        description: `${u.name} moved to Inactive Users.`,
                                        action: { label: "Undo", onClick: () => setInactiveUserIds(prev => { const s = new Set(prev); s.delete(u.id); return s; }) },
                                      });
                                    }
                                  } else if (action === "Reactivate") {
                                    setInactiveUserIds(prev => { const s = new Set(prev); s.delete(u.id); return s; });
                                    showToast({
                                      title: "User reactivated",
                                      description: `${u.name} is active again.`,
                                      action: { label: "Undo", onClick: () => setInactiveUserIds(prev => { const s = new Set(prev); s.add(u.id); return s; }) },
                                    });
                                  } else if (action === "Remove") {
                                    const isPrin = u.jobTitle === "Principal" && !(principalOverride && principalOverride.oldId === u.id);
                                    const currentContactName = agencyContactOverride ?? agency.contact;
                                    const isCon = u.name === currentContactName;
                                    if (isPrin || isCon) {
                                      setRoleReassign({ userId: u.id, userName: u.name, action: "remove", needsPrincipal: isPrin, needsContact: isCon });
                                      setReassignPrincipalId("");
                                      setReassignContactId("");
                                    } else {
                                      setRemoveUserConfirm({ id: u.id, name: u.name });
                                    }
                                  }
                                  setUserMenuId(null);
                                }}>
                                {action}
                              </button>
                            ))}
                          </div>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      {/* ── Add/Edit User Modal ── */}
      {(addUserOpen || editUserId) && (() => {
        const isEditMode = !!editUserId;
        const closeModal = () => { setAddUserOpen(false); setEditUserId(null); };
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
            onClick={()=>{ closeModal(); closeAll(); }}>
            <div className="rounded-2xl w-[620px] max-w-[95vw] max-h-[92vh] flex flex-col"
              style={{ background:isDark?"#1E2240":"#fff", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}
              onClick={e=>{ e.stopPropagation(); closeAll(); }}>

              {/* Header */}
              <div className="flex items-center justify-between px-8 pt-7 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
                <h2 className="text-[20px] font-semibold" style={{ fontFamily:FONT, color:c.text }}>{isEditMode ? "Edit User" : "Add User"}</h2>
                <button onClick={()=>{ closeModal(); closeAll(); }}
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
                      style={{ border:`1.5px solid ${auSms?"transparent":c.borderStrong}`, backgroundImage: auSms ? "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" : "none", background: auSms ? undefined : "transparent" }}>
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
                  style={{ fontFamily:FONT, border:`1px solid ${c.borderStrong}`, color: c.text, background:"transparent" }}
                  onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                  onClick={()=>{ closeModal(); closeAll(); }}>
                  Cancel Changes
                </button>
                <button
                  className="text-[13px] font-semibold text-white transition-all"
                  style={{ fontFamily:FONT, background:btnGrad, padding:"10px 32px", borderRadius:"8px" }}
                  onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.12)")}
                  onMouseLeave={e=>(e.currentTarget.style.filter="none")}
                  onClick={()=>{ closeModal(); closeAll(); }}>
                  {isEditMode ? "Save Changes" : "Save"}
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ── Address Modal ── */}
      {addressModalOpen && (() => {
        const fullAddress = `${agency.street}, ${agency.city}, ${agency.state} ${agency.zip}`;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
        const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setAddressModalOpen(false)}>
            <div className="w-[480px] max-w-[95vw] rounded-2xl shadow-2xl overflow-hidden" style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }} onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-start justify-between px-6 py-5" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(243,244,246,0.30)", borderBottom: `1px solid ${c.border}` }}>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl" style={{ background: "linear-gradient(135deg,rgba(92,46,212,0.15) 0%,rgba(166,20,195,0.15) 100%)" }}>
                    <MapPin className="w-5 h-5" style={{ color: "#A855F7" }} />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold" style={{ fontFamily: FONT, color: c.text }}>{agency.name}</h2>
                    <p className="text-[11px] mt-0.5" style={{ fontFamily: FONT, color: c.muted }}>Agency location</p>
                  </div>
                </div>
                <button onClick={() => setAddressModalOpen(false)} className="p-1 rounded-lg transition-colors" style={{ color: c.muted }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <div className="rounded-xl p-4 relative" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB", border: `1px solid ${c.border}` }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-wide font-semibold mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Address</p>
                      <p className="text-[14px] font-semibold leading-relaxed" style={{ fontFamily: FONT, color: c.text }}>{agency.street}</p>
                      <p className="text-[14px] font-semibold leading-relaxed" style={{ fontFamily: FONT, color: c.text }}>{agency.city}, {agency.state} {agency.zip}</p>
                    </div>
                    <button onClick={() => { setAddressModalOpen(false); setIsEditing(true); }}
                      title="Edit in Agency Info"
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors flex-shrink-0"
                      style={{ fontFamily: FONT, color: c.muted, border: `1px solid ${c.border}`, background: "transparent" }}
                      onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                      <Pencil className="w-3 h-3" />Edit
                    </button>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
                  <iframe src={embedUrl} className="w-full" style={{ height: 220, border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${c.border}` }}>
                <button onClick={() => setAddressModalOpen(false)}
                  className="px-5 py-[9px] rounded-lg text-[12px] font-normal transition-colors"
                  style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: "transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  Close
                </button>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-[9px] rounded-lg text-[12px] font-semibold text-white no-underline"
                  style={{ fontFamily: FONT, background: btnGrad }}>
                  <Globe className="w-3.5 h-3.5" />Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Phone Call Modal ── */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setCallModalOpen(false)}>
          <div className="w-[420px] rounded-2xl shadow-2xl" style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 rounded-t-2xl" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(243,244,246,0.30)", borderBottom: `1px solid ${c.border}` }}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ background: "linear-gradient(135deg,rgba(92,46,212,0.15) 0%,rgba(166,20,195,0.15) 100%)" }}>
                  <Phone className="w-5 h-5" style={{ color: "#A855F7" }} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold" style={{ fontFamily: FONT, color: c.text }}>Call {agency.name}</h2>
                  <p className="text-[11px] mt-0.5" style={{ fontFamily: FONT, color: c.muted }}>Outbound call from your agency line</p>
                </div>
              </div>
              <button onClick={() => setCallModalOpen(false)} className="p-1 rounded-lg" style={{ color: c.muted }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl p-4 space-y-3" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB", border: `1px solid ${c.border}` }}>
                {/* From (your line) */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,rgba(92,46,212,0.15) 0%,rgba(166,20,195,0.15) 100%)" }}>
                    <Phone className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wide font-semibold mb-0.5" style={{ fontFamily: FONT, color: c.muted }}>From (Your Agency Line)</p>
                    <p className="text-[14px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>{AGENCY_PHONE}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-4">
                  <div className="w-px h-4 ml-3.5" style={{ background: c.border }} />
                </div>

                {/* To (agency) */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-white" style={{ background: btnGrad }}>
                    {agency.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wide font-semibold mb-0.5" style={{ fontFamily: FONT, color: c.muted }}>To (Agency)</p>
                    <p className="text-[14px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>{agency.contactPhone || "No number on file"}</p>
                    <p className="text-[11px] mt-0.5" style={{ fontFamily: FONT, color: c.muted }}>{agency.name}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg" style={{ background: isDark ? "rgba(168,85,247,0.06)" : "rgba(92,46,212,0.04)", border: `1px solid ${isDark ? "rgba(168,85,247,0.15)" : "rgba(92,46,212,0.10)"}` }}>
                <Bell className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#A855F7" }} />
                <p className="text-[11px] leading-relaxed" style={{ fontFamily: FONT, color: c.muted }}>
                  Clicking <span style={{ color: c.text, fontWeight: 600 }}>Call Now</span> will open your default phone dialer. On desktop this may launch software like FaceTime, Skype, or your VoIP app.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${c.border}` }}>
              <button onClick={() => setCallModalOpen(false)}
                className="px-5 py-[9px] rounded-lg text-[12px] font-normal"
                style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: "transparent" }}>
                Cancel
              </button>
              <a href={`tel:${(agency.contactPhone || "").replace(/\D/g, "")}`}
                onClick={() => setCallModalOpen(false)}
                className="inline-flex items-center gap-2 px-5 py-[9px] rounded-lg text-[12px] font-semibold text-white no-underline"
                style={{ fontFamily: FONT, background: btnGrad }}>
                <Phone className="w-3.5 h-3.5" />Call Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Update Agency Contact Modal (admin) — Edit / Reassign / Add New ── */}
      {contactCardEditing && (() => {
        const eligibleUsers = mockAgencyUsers
          .filter(u => u.agencyId === agency.id)
          .filter(u => !inactiveUserIds.has(u.id) && !removedUserIds.has(u.id));
        const closeModal = () => { setContactCardEditing(false); setContactMode("edit"); setReassignSelection(""); setNewContactName(""); setNewContactPhone(""); setNewContactEmail(""); };
        const canSave =
          contactMode === "edit" ? eContact.trim().length > 0 :
          contactMode === "reassign" ? reassignSelection !== "" :
          newContactName.trim().length > 0;
        const handleSave = () => {
          if (contactMode === "reassign") {
            const u = eligibleUsers.find(x => x.id === reassignSelection);
            if (u) { setEContact(u.name); setEContactPhone(u.phone); setEEmail(u.email); }
            showToast({ title: "Contact reassigned", description: `Agency contact set to ${u?.name ?? "selected user"}.` });
          } else if (contactMode === "new") {
            setEContact(newContactName.trim());
            setEContactPhone(newContactPhone.trim());
            setEEmail(newContactEmail.trim());
            showToast({ title: "Contact added", description: `${newContactName.trim()} is now the agency contact.` });
          } else {
            // edit mode: eContact / eContactPhone / eEmail are already updated via inputs
            showToast({ title: "Contact updated", description: "Changes saved." });
          }
          closeModal();
        };
        const tabs: [typeof contactMode, string][] = [["edit", "Edit Info"], ["reassign", "Reassign"], ["new", "Add New"]];
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={closeModal}>
          <div className="rounded-2xl w-[480px] max-w-[95vw] max-h-[85vh] flex flex-col overflow-hidden"
            style={{ background: c.cardBg, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
              <div>
                <h3 className="text-[16px] font-bold" style={{ fontFamily: FONT, color: c.text }}>Update Agency Contact</h3>
                <p className="text-[12px] mt-0.5 flex items-center gap-1.5" style={{ fontFamily: FONT, color: c.muted }}>
                  {contactMode === "new" && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#A855F7" }} />}
                  {contactMode === "edit" ? "Tweak the current contact's info." :
                   contactMode === "reassign" ? "Hand off to another existing user." :
                   "Only add new if the contact isn't an existing user."}
                </p>
              </div>
              <button onClick={closeModal} className="p-1 rounded-md transition-colors flex-shrink-0" style={{ color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Segmented tab control */}
            <div className="px-6 pt-4 pb-1 flex-shrink-0">
              <div className="flex p-1 rounded-lg" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#F3F4F6" }}>
                {tabs.map(([key, label]) => {
                  const active = contactMode === key;
                  return (
                    <button key={key} onClick={() => setContactMode(key)}
                      className="flex-1 text-[12px] font-semibold py-1.5 rounded-md transition-all"
                      style={{ fontFamily: FONT,
                        background: active ? c.cardBg : "transparent",
                        color: active ? "#A614C3" : c.muted,
                        boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {contactMode === "edit" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Contact Name<span style={{ color: "#EF4444" }}>*</span></label>
                    <input value={eContact} onChange={e => setEContact(e.target.value)} placeholder="Full name"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Phone</label>
                    <input value={eContactPhone} onChange={e => setEContactPhone(formatPhone(e.target.value))} placeholder="(000) 000-0000"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} inputMode="tel" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Email</label>
                    <input value={eEmail} onChange={e => setEEmail(e.target.value)} placeholder="email@example.com"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} type="email" />
                  </div>
                  <p className="text-[11px] mt-2" style={{ fontFamily: FONT, color: c.muted }}>Use this to fix typos. To change who the contact is, switch to <strong style={{ color: c.text }}>Reassign</strong>.</p>
                </div>
              )}
              {contactMode === "reassign" && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ fontFamily: FONT, color: c.muted }}>Existing Users</p>
                  <div className="space-y-1.5">
                    {eligibleUsers.length === 0 && (
                      <p className="text-[12px] py-3" style={{ fontFamily: FONT, color: c.muted }}>No active users for this agency.</p>
                    )}
                    {eligibleUsers.map(u => {
                      const checked = reassignSelection === u.id;
                      return (
                        <label key={u.id} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                          style={{ border: `1px solid ${checked ? "rgba(168,85,247,0.35)" : c.border}`, background: checked ? "rgba(168,85,247,0.06)" : "transparent" }}
                          onMouseEnter={e => { if (!checked) e.currentTarget.style.background = c.hoverBg; }}
                          onMouseLeave={e => { if (!checked) e.currentTarget.style.background = "transparent"; }}>
                          <div onClick={() => setReassignSelection(u.id)}
                            className="w-[16px] h-[16px] rounded flex items-center justify-center flex-shrink-0"
                            style={{ background: checked ? "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" : c.cardBg, border: checked ? "none" : `1.5px solid ${c.borderStrong}` }}>
                            {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3 5.5L8 1" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <input type="radio" checked={checked} onChange={() => setReassignSelection(u.id)} className="sr-only" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-semibold truncate" style={{ fontFamily: FONT, color: c.text }}>{u.name}</span>
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0"
                                style={{ fontFamily: FONT, background: "rgba(168,85,247,0.10)", color: "#A855F7" }}>{u.jobTitle}</span>
                            </div>
                            <div className="text-[11px] truncate mt-0.5" style={{ fontFamily: FONT, color: c.muted }}>{u.email}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
              {contactMode === "new" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Contact Name<span style={{ color: "#EF4444" }}>*</span></label>
                    <input value={newContactName} onChange={e => setNewContactName(e.target.value)} placeholder="Full name"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Phone</label>
                    <input value={newContactPhone} onChange={e => setNewContactPhone(formatPhone(e.target.value))} placeholder="(000) 000-0000"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} inputMode="tel" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Email</label>
                    <input value={newContactEmail} onChange={e => setNewContactEmail(e.target.value)} placeholder="email@example.com"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} type="email" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 px-6 py-4 flex-shrink-0" style={{ borderTop: `1px solid ${c.border}` }}>
              <button onClick={closeModal}
                className="px-[17px] py-[9px] rounded-lg text-[12px] font-normal transition-colors"
                style={{ fontFamily: FONT, border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={!canSave}
                className="px-[17px] py-[9px] rounded-lg text-[12px] font-semibold text-white transition-all"
                style={{ fontFamily: FONT, background: canSave ? btnGrad : (isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"), color: canSave ? "#fff" : c.muted, cursor: canSave ? "pointer" : "not-allowed" }}
                onMouseEnter={e => { if (canSave) e.currentTarget.style.filter = "brightness(1.1)"; }}
                onMouseLeave={e => { if (canSave) e.currentTarget.style.filter = "none"; }}>
                {contactMode === "edit" ? "Save Changes" : contactMode === "reassign" ? "Reassign Contact" : "Add Contact"}
              </button>
            </div>
          </div>
        </div>
        );
      })()}

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
                  style={{ fontFamily: FONT, border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}>
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
                <p className="text-[13px] font-mono mb-3 px-2 py-1 rounded-md inline-block" style={{ color:"#73C9B7", background: isDark ? "rgba(115,201,183,0.14)" : "rgba(115,201,183,0.12)" }}>Name, Role, Job Title, Email, Phone, Ext</p>
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
  "AAA/ACG (AC364)","Acceptance","Acrisure","Affordable American Insurance",
  "American Family (AM102)","ASNOA (AL335)",
  "EPIC Insurance Brokers & Consultants","Farmers","Fiesta Insurance (FI062)",
  "First Choice Agents Alliance","First Connect Insurance Services (FI475)","Foundation Risk Partners",
  "Horizon Agency Systems (RC021)","HUB International Limited",
  "Insurance Alliance Network","IronPeak","ISU",
  "Join the Brokers","LTA Marketing Group (LT006)","New Age Underwriters Agency Inc",
  "NowCerts (NO147)","Pacific Crest (PA004)","PIIB",
  "Premier Group (PR196)","Renaissance Alliance","SIAA",
  "Smart Choice","The Agency Collective","TWFG (TW037)","United Agencies",
  "United Valley","Victor",
];
const WORKERS_COMP = [
  "AIG","AmTrust","Clear Spring","CNA","CNA2.0","Cornerstone","Employers","Great American",
  "GUARD","ICW Group","LIBERTYMUTUAL","Pie","Travelers","Zenith",
];

export type AgencyDraft = {
  agencyName: string; agencyCode: string; agencyType: "Retail"|"Wholesale";
  country: string; street: string; city: string; stateVal: string; zip: string;
  sameAddress: boolean;
  mCountry: string; mStreet: string; mCity: string; mState: string; mZip: string;
  status: string; apptDate: string;
  contact: string; email: string;
  bizType: string; taxId: string; website: string;
  phone: string; tollFree: string;
  licenseNo: string; licenseExp: string;
  eoPolicyNo: string; eoExp: string;
  agencyBill: boolean; directBill: boolean; premiumFin: boolean;
  affiliations: string[]; workersComp: string[];
};

function AddAgencyForm({ isDark, onSaveForLater, onDiscard, initialDraft, c, btnGrad, FONT }: {
  isDark: boolean; onSaveForLater: (d: AgencyDraft) => void; onDiscard: () => void;
  initialDraft: AgencyDraft | null;
  c: Record<string, string>; btnGrad: string; FONT: string;
}) {
  const [agencyName, setAgencyName]   = useState(initialDraft?.agencyName ?? "");
  const [agencyCode, setAgencyCode]   = useState(initialDraft?.agencyCode ?? "");
  const [agencyType, setAgencyType]   = useState<"Retail"|"Wholesale">(initialDraft?.agencyType ?? "Retail");
  const [country, setCountry]         = useState(initialDraft?.country ?? "United States of America");
  const [street, setStreet]           = useState(initialDraft?.street ?? "");
  const [city, setCity]               = useState(initialDraft?.city ?? "");
  const [stateVal, setStateVal]       = useState(initialDraft?.stateVal ?? "");
  const [zip, setZip]                 = useState(initialDraft?.zip ?? "");
  const [sameAddress, setSameAddress] = useState(initialDraft?.sameAddress ?? true);
  const [mCountry, setMCountry]       = useState(initialDraft?.mCountry ?? "United States of America");
  const [mStreet, setMStreet]         = useState(initialDraft?.mStreet ?? "");
  const [mCity, setMCity]             = useState(initialDraft?.mCity ?? "");
  const [mState, setMState]           = useState(initialDraft?.mState ?? "");
  const [mZip, setMZip]               = useState(initialDraft?.mZip ?? "");
  const [status, setStatus]           = useState(initialDraft?.status ?? "Appointed");
  const [apptDate, setApptDate]       = useState(initialDraft?.apptDate ?? "03/24/2026");
  const [contact, setContact]         = useState(initialDraft?.contact ?? "");
  const [email, setEmail]             = useState(initialDraft?.email ?? "");
  const [bizType, setBizType]         = useState(initialDraft?.bizType ?? "");
  const [taxId, setTaxId]             = useState(initialDraft?.taxId ?? "");
  const [website, setWebsite]         = useState(initialDraft?.website ?? "");
  const [phone, setPhone]             = useState(initialDraft?.phone ?? "");
  const [tollFree, setTollFree]       = useState(initialDraft?.tollFree ?? "");
  const [licenseNo, setLicenseNo]     = useState(initialDraft?.licenseNo ?? "");
  const [licenseExp, setLicenseExp]   = useState(initialDraft?.licenseExp ?? "03/24/2026");
  const [eoPolicyNo, setEoPolicyNo]   = useState(initialDraft?.eoPolicyNo ?? "");
  const [eoExp, setEoExp]             = useState(initialDraft?.eoExp ?? "03/24/2026");
  const [agencyBill, setAgencyBill]   = useState(initialDraft?.agencyBill ?? true);
  const [directBill, setDirectBill]   = useState(initialDraft?.directBill ?? true);
  const [premiumFin, setPremiumFin]   = useState(initialDraft?.premiumFin ?? true);
  const [affiliations, setAffiliations] = useState<Set<string>>(new Set(initialDraft?.affiliations ?? ["AAA/ACG (AC364)"]));
  const [workersComp, setWorkersComp]   = useState<Set<string>>(new Set(initialDraft?.workersComp ?? ["AIG"]));

  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [bizTypeOpen, setBizTypeOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);
  const REASON_OPTIONS = ["Closed", "Sold", "Credit Hold", "Missing Info", "Terminated"];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validators: Record<string, (v: string) => string | null> = {
    email: v => !v ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email",
    phone: v => !v ? null : v.replace(/\D/g, "").length === 10 ? null : "Enter a 10-digit phone",
    zip: v => !v ? null : /^\d{5}(-\d{4})?$/.test(v) ? null : "Enter a valid ZIP (5 digits)",
    website: v => !v ? null : /^(https?:\/\/)?([\w-]+\.)+[\w-]+.*$/.test(v) ? null : "Enter a valid URL",
    number: v => !v ? null : /^\d+$/.test(v.replace(/[,\s-]/g, "")) ? null : "Digits only",
  };

  const requiredKeys = new Set([
    "agencyName", "agencyCode",
    "street", "city", "stateVal", "zip",
    "contact", "email",
    "bizType", "taxId", "phone",
    "licenseNo", "eoPolicyNo",
  ]);

  const fieldFormat: Record<string, keyof typeof validators> = {
    email: "email",
    phone: "phone",
    tollFree: "phone",
    zip: "zip",
    mZip: "zip",
    website: "website",
    taxId: "number",
  };

  const getFieldVal = (k: string): string => {
    switch (k) {
      case "agencyName": return agencyName;
      case "agencyCode": return agencyCode;
      case "street": return street;
      case "city": return city;
      case "stateVal": return stateVal;
      case "zip": return zip;
      case "mStreet": return sameAddress ? street : mStreet;
      case "mCity": return sameAddress ? city : mCity;
      case "mState": return sameAddress ? stateVal : mState;
      case "mZip": return sameAddress ? zip : mZip;
      case "contact": return contact;
      case "email": return email;
      case "bizType": return bizType;
      case "taxId": return taxId;
      case "website": return website;
      case "phone": return phone;
      case "tollFree": return tollFree;
      case "licenseNo": return licenseNo;
      case "eoPolicyNo": return eoPolicyNo;
      default: return "";
    }
  };

  const validateKey = (k: string, val?: string): string | null => {
    const v = val !== undefined ? val : getFieldVal(k);
    if (requiredKeys.has(k) && !v.trim()) return "Required";
    const f = fieldFormat[k];
    if (f) return validators[f](v);
    return null;
  };

  const runValidate = (k: string, val: string) => {
    const hasFormat = !!fieldFormat[k];
    if (submitted || errors[k] || (hasFormat && val)) {
      const err = validateKey(k, val);
      setErrors(e => {
        const n = { ...e };
        if (err && (err !== "Required" || submitted)) n[k] = err;
        else delete n[k];
        return n;
      });
    }
  };

  const errorStyleFor = (k: string): React.CSSProperties =>
    errors[k]
      ? { border: `1px solid #EF4444`, background: isDark ? "rgba(239,68,68,0.06)" : "#FEF2F2" }
      : {};

  const handleSubmit = () => {
    const keys = [...requiredKeys, ...Object.keys(fieldFormat)];
    const newErrors: Record<string, string> = {};
    for (const k of keys) {
      const err = validateKey(k);
      if (err) newErrors[k] = err;
    }
    setErrors(newErrors);
    setSubmitted(true);
    if (Object.keys(newErrors).length === 0) {
      // form submission would happen here
    }
  };

  const ErrMsg = ({ k }: { k: string }) =>
    errors[k] ? <p className="text-[11px] mt-1" style={{ color: "#EF4444", fontFamily: FONT }}>{errors[k]}</p> : null;

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const collectDraft = (): AgencyDraft => ({
    agencyName, agencyCode, agencyType,
    country, street, city, stateVal, zip,
    sameAddress, mCountry, mStreet, mCity, mState, mZip,
    status, apptDate, contact, email,
    bizType, taxId, website, phone, tollFree,
    licenseNo, licenseExp, eoPolicyNo, eoExp,
    agencyBill, directBill, premiumFin,
    affiliations: Array.from(affiliations), workersComp: Array.from(workersComp),
  });

  const font = { fontFamily: FONT };

  const inputStyle: React.CSSProperties = {
    fontFamily: FONT, color: c.text, background: c.cardBg,
    border: `1px solid ${c.borderStrong}`, borderRadius: 10,
    padding: "9px 12px", fontSize: 13, outline: "none", width: "100%",
    height: 40, boxSizing: "border-box",
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
  }) => {
    const disabled = prefix === "m" && sameAddress;
    const streetKey = prefix === "m" ? "mStreet" : "street";
    const cityKey = prefix === "m" ? "mCity" : "city";
    const stateKey = prefix === "m" ? "mState" : "stateVal";
    const zipKey = prefix === "m" ? "mZip" : "zip";
    return (
    <div className="space-y-3">
      {/* Row 1: Country | Street */}
      <div className="grid grid-cols-3 gap-6">
        <select value={vals.country} onChange={e => setters.country(e.target.value)}
          autoComplete="country-name"
          style={{ ...selectStyle, opacity: disabled ? 0.5 : 1 }}
          disabled={disabled}>
          <option>United States of America</option><option>Canada</option><option>Mexico</option>
        </select>
        <div>
          <AddressAutocomplete
            value={vals.street}
            onChange={v => { setters.street(v); runValidate(streetKey, v); }}
            onSelect={a => {
              setters.street(a.street);
              if (a.city) setters.city(a.city);
              if (a.state) setters.state(a.state);
              if (a.zip) setters.zip(a.zip);
              if (a.country) setters.country(a.country);
              runValidate(streetKey, a.street);
            }}
            placeholder="Street address"
            containerStyle={{ width: "100%", opacity: disabled ? 0.5 : 1 }}
            inputStyle={{ ...inputStyle, width: "100%", ...errorStyleFor(streetKey) }}
            disabled={disabled}
            dropdownBg={c.cardBg} dropdownText={c.text} dropdownBorder={c.border}
          />
          <ErrMsg k={streetKey} />
        </div>
        <div />
      </div>
      {/* Row 2: City | State + ZIP | (empty) */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <input value={vals.city}
            onChange={e => { setters.city(e.target.value); runValidate(cityKey, e.target.value); }}
            placeholder="City"
            autoComplete="address-level2"
            style={{ ...inputStyle, opacity: disabled ? 0.5 : 1, ...errorStyleFor(cityKey) }}
            disabled={disabled} />
          <ErrMsg k={cityKey} />
        </div>
        <div>
          <div className="flex gap-4">
            <div style={{ flex: 1 }}>
              <select value={vals.state}
                onChange={e => { setters.state(e.target.value); runValidate(stateKey, e.target.value); }}
                autoComplete="address-level1"
                style={{ ...selectStyle, width: "100%", opacity: disabled ? 0.5 : 1, ...errorStyleFor(stateKey) }}
                disabled={disabled}>
                {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s => <option key={s}>{s}</option>)}
              </select>
              <ErrMsg k={stateKey} />
            </div>
            <div style={{ flex: 1 }}>
              <input value={vals.zip}
                onChange={e => { setters.zip(e.target.value); runValidate(zipKey, e.target.value); }}
                onBlur={e => runValidate(zipKey, e.target.value)}
                placeholder="ZIP"
                autoComplete="postal-code"
                style={{ ...inputStyle, width: "100%", opacity: disabled ? 0.5 : 1, ...errorStyleFor(zipKey) }}
                disabled={disabled} />
              <ErrMsg k={zipKey} />
            </div>
          </div>
        </div>
        <div />
      </div>
    </div>
    );
  };

  const mailingVals = sameAddress
    ? { country, street, city, state: stateVal, zip }
    : { country: mCountry, street: mStreet, city: mCity, state: mState, zip: mZip };

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: FONT }}
      onClick={() => { setStatusOpen(false); setBizTypeOpen(false); setReasonOpen(false); }}>
      {/* Form card + breadcrumb scroll together */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* Breadcrumb */}
        <div className="pb-2 mb-3 flex items-center gap-2" style={{ marginLeft: -48, marginRight: -48, paddingLeft: 48, paddingRight: 48 }}>
          <button onClick={() => onSaveForLater(collectDraft())} className="flex items-center gap-1.5 transition-all" style={{ color: c.muted }}
            onMouseEnter={e => (e.currentTarget.style.color = c.text)}
            onMouseLeave={e => (e.currentTarget.style.color = c.muted)}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => onSaveForLater(collectDraft())}
            className="text-[13px] transition-colors"
            style={{ color: c.muted, background: "transparent", border: "none", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.color = c.text)}
            onMouseLeave={e => (e.currentTarget.style.color = c.muted)}>Back to Admin</button>
          <span style={{ color: c.muted }}>/</span>
          <span className="text-[13px] font-semibold" style={{ color: c.text }}>Add New</span>
        </div>
        <form autoComplete="on" onSubmit={e => e.preventDefault()}>
        <div className="rounded-2xl p-8 mb-6" style={{ background: c.cardBg, border: `1px solid ${c.border}`, maxWidth: 1590 }}>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-bold" style={{ ...font, color: c.text }}>Add New Agency Information</h2>
            <button onClick={() => onSaveForLater(collectDraft())} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
              style={{ ...font, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, color: c.text }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <Bookmark className="w-3.5 h-3.5" />Save for Later
            </button>
          </div>

          {/* Row 1: Name | Code | Type */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Agency Name:</label>
              <input value={agencyName}
                onChange={e => { setAgencyName(e.target.value); runValidate("agencyName", e.target.value); }}
                placeholder="Agency name" style={{ ...inputStyle, ...errorStyleFor("agencyName") }} />
              <ErrMsg k="agencyName" />
            </div>
            <div>
              <label style={labelStyle}>Agency Code:</label>
              <div className="flex gap-2">
                <input value={agencyCode}
                  onChange={e => { setAgencyCode(e.target.value); runValidate("agencyCode", e.target.value); }}
                  placeholder="Code" style={{ ...inputStyle, flex: 1, ...errorStyleFor("agencyCode") }} />
                <button type="button" onClick={() => setAgencyCode(generateAgencyCode())}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all"
                  style={{ ...font, border: `1px solid #A855F7`, background: "transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(168,85,247,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <RefreshCw className="w-3 h-3" style={{ color: "#7C3AED" }} />
                  <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Create Code</span>
                </button>
              </div>
              <ErrMsg k="agencyCode" />
            </div>
            <div>
              <label style={labelStyle}>Agency Type:</label>
              <div className="flex" style={{ gap: 10 }}>
                {(["Retail","Wholesale"] as const).map(t => {
                  const active = agencyType === t;
                  return (
                    <button key={t} onClick={() => setAgencyType(t)}
                      className="flex items-center gap-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap justify-center transition-all"
                      style={{ ...font, width: 120, height: 40, boxSizing: "border-box",
                        border: active ? "1px solid transparent" : `1px solid ${c.border}`,
                        background: active ? undefined : c.cardBg,
                        backgroundImage: active
                          ? `linear-gradient(88.54deg, rgba(92,46,212,0.06) 0.1%, rgba(166,20,195,0.06) 63.88%), linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)`
                          : undefined,
                        backgroundOrigin: active ? "padding-box, padding-box, border-box" : undefined,
                        backgroundClip: active ? "padding-box, padding-box, border-box" : undefined,
                      }}>
                      <Radio checked={active} onClick={() => setAgencyType(t)} />
                      {active
                        ? <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t}</span>
                        : <span style={{ color: c.muted }}>{t}</span>
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
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button type="button" onClick={() => { setStatusOpen(o => !o); setBizTypeOpen(false); }}
                  className="w-full flex items-center justify-between outline-none"
                  style={{ ...inputStyle, cursor: "pointer" }}>
                  <span style={{ color: status ? c.text : c.muted }}>{status || "Select status"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${statusOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                </button>
                {statusOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
                    style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                    {["Appointed", "Unappointed"].map(opt => {
                      const active = status === opt;
                      return (
                      <button key={opt} type="button" onClick={() => { setStatus(opt); setStatusOpen(false); }}
                        className="w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors"
                        style={{ ...font, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                        <span>{opt}</span>
                        {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {status === "Unappointed" ? (
              <div>
                <label style={labelStyle}>Reason:</label>
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <button type="button" onClick={() => { setReasonOpen(o => !o); setStatusOpen(false); setBizTypeOpen(false); }}
                    className="w-full flex items-center justify-between outline-none"
                    style={{ ...inputStyle, cursor: "pointer" }}>
                    <span style={{ color: reason ? c.text : c.muted }}>{reason || "Select reason"}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${reasonOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                  </button>
                  {reasonOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
                      style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                      {REASON_OPTIONS.map(opt => {
                        const active = reason === opt;
                        return (
                          <button key={opt} type="button" onClick={() => { setReason(opt); setReasonOpen(false); }}
                            className="w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors"
                            style={{ ...font, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                            <span>{opt}</span>
                            {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label style={labelStyle}>Appt. Date</label>
                <DatePicker value={apptDate} onChange={setApptDate} inputStyle={inputStyle} c={c as any} btnGrad={btnGrad} font={font} />
              </div>
            )}
            <div />
          </div>

          {/* Agency Contact + Email */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Agency Contact:</label>
              <input value={contact}
                onChange={e => { setContact(e.target.value); runValidate("contact", e.target.value); }}
                placeholder="Contact name" style={{ ...inputStyle, ...errorStyleFor("contact") }} />
              <ErrMsg k="contact" />
            </div>
            <div>
              <label style={labelStyle}>Email Address:</label>
              <input value={email}
                onChange={e => { setEmail(e.target.value); runValidate("email", e.target.value); }}
                onBlur={e => runValidate("email", e.target.value)}
                placeholder="Email" style={{ ...inputStyle, ...errorStyleFor("email") }} type="email" />
              <ErrMsg k="email" />
            </div>
          </div>

          {/* Business Type | Tax ID | Website */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Type of Business:</label>
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button type="button" onClick={() => { setBizTypeOpen(o => !o); setStatusOpen(false); }}
                  className="w-full flex items-center justify-between outline-none"
                  style={{ ...inputStyle, cursor: "pointer", ...errorStyleFor("bizType") }}>
                  <span style={{ color: bizType ? c.text : c.muted }}>{bizType || "-Business Type"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${bizTypeOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                </button>
                {bizTypeOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
                    style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                    {["LLC", "Corporation", "Sole Proprietor", "Partnership"].map(opt => {
                      const active = bizType === opt;
                      return (
                      <button key={opt} type="button" onClick={() => { setBizType(opt); setBizTypeOpen(false); runValidate("bizType", opt); }}
                        className="w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors"
                        style={{ ...font, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                        <span>{opt}</span>
                        {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <ErrMsg k="bizType" />
            </div>
            <div>
              <label style={labelStyle}>Tax ID:</label>
              <input value={taxId}
                onChange={e => { setTaxId(e.target.value); runValidate("taxId", e.target.value); }}
                placeholder="Tax ID" style={{ ...inputStyle, ...errorStyleFor("taxId") }} inputMode="numeric" />
              <ErrMsg k="taxId" />
            </div>
            <div>
              <label style={labelStyle}>Website Url:</label>
              <input value={website}
                onChange={e => { setWebsite(e.target.value); runValidate("website", e.target.value); }}
                onBlur={e => runValidate("website", e.target.value)}
                placeholder="https://" style={{ ...inputStyle, ...errorStyleFor("website") }} />
              <ErrMsg k="website" />
            </div>
          </div>

          {/* Phone | Toll Free */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Phone Number:</label>
              <input value={phone}
                onChange={e => { const v = formatPhone(e.target.value); setPhone(v); runValidate("phone", v); }}
                onBlur={e => runValidate("phone", e.target.value)}
                placeholder="(000) 000-0000" style={{ ...inputStyle, ...errorStyleFor("phone") }} inputMode="tel" />
              <ErrMsg k="phone" />
            </div>
            <div>
              <label style={labelStyle}>Toll Free Number:</label>
              <input value={tollFree}
                onChange={e => { const v = formatPhone(e.target.value); setTollFree(v); runValidate("tollFree", v); }}
                onBlur={e => runValidate("tollFree", e.target.value)}
                placeholder="(000) 000-0000" style={{ ...inputStyle, ...errorStyleFor("tollFree") }} inputMode="tel" />
              <ErrMsg k="tollFree" />
            </div>
            <div />
          </div>

          {/* License + Expiry */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>License Number:</label>
              <input value={licenseNo}
                onChange={e => { setLicenseNo(e.target.value); runValidate("licenseNo", e.target.value); }}
                style={{ ...inputStyle, ...errorStyleFor("licenseNo") }} />
              <ErrMsg k="licenseNo" />
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
              <input value={eoPolicyNo}
                onChange={e => { setEoPolicyNo(e.target.value); runValidate("eoPolicyNo", e.target.value); }}
                style={{ ...inputStyle, ...errorStyleFor("eoPolicyNo") }} />
              <ErrMsg k="eoPolicyNo" />
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
                <div className="flex gap-3">
                  {([["Yes", true],["No", false]] as [string, boolean][]).map(([opt, bool]) => {
                    const active = val === bool;
                    return (
                      <button key={opt} onClick={() => set(bool)}
                        className="flex items-center gap-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap justify-center transition-all"
                        style={{ ...font, width: 120, height: 40, boxSizing: "border-box",
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

        </div>
        </form>

        {/* Footer buttons */}
        <div className="flex items-center justify-between pb-6">
          <button onClick={() => setDiscardConfirmOpen(true)}
            className="px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={{ ...font, border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            Discard
          </button>
          <button onClick={handleSubmit}
            className="text-[13px] font-semibold text-white transition-all"
            style={{ ...font, background: btnGrad, padding:"10px 24px", borderRadius:"5.58px" }}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.10)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
            Save Changes
          </button>
        </div>
      </div>
      {discardConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setDiscardConfirmOpen(false)}
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-[420px] rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.10)" }}>
                <X className="w-6 h-6" style={{ color: "#EF4444" }} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold mb-1" style={{ color: c.text }}>Discard this draft?</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: c.muted }}>
                  Your progress will be lost and can&apos;t be recovered.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDiscardConfirmOpen(false)}
                className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Keep editing
              </button>
              <button onClick={() => { setDiscardConfirmOpen(false); onDiscard(); }}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-colors"
                style={{ background: "#EF4444" }}>
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
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
  const [agencyDraft, setAgencyDraft] = useState<AgencyDraft | null>(null);
  const [resumeDraftOpen, setResumeDraftOpen] = useState(false);
  const [saveForLaterToast, setSaveForLaterToast] = useState(false);
  const [resumeFromDraft, setResumeFromDraft] = useState(false);
  const [selectedAff, setSelectedAff] = useState<string | null>(null);
  const [allUsersJobFilter, setAllUsersJobFilter] = useState<Set<string>>(new Set());
  const [allUsersJobOpen, setAllUsersJobOpen] = useState(false);
  const [allUsersJobSearch, setAllUsersJobSearch] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [usersHiddenCols, setUsersHiddenCols] = useState<Set<string>>(new Set());
  const [agenciesHiddenCols, setAgenciesHiddenCols] = useState<Set<string>>(new Set());
  const USERS_COLS: Array<{ key: string; label: string }> = [
    { key: "admin",    label: "Admin"     },
    { key: "jobTitle", label: "Job Title" },
    { key: "email",    label: "Email"     },
    { key: "phone",    label: "Phone"     },
    { key: "ext",      label: "Ext"       },
    { key: "agency",   label: "Agency"    },
  ];
  const AGENCIES_COLS: Array<{ key: string; label: string }> = [
    { key: "code",       label: "Agency Code"   },
    { key: "location",   label: "Location"      },
    { key: "aff1",       label: "Affiliation 1" },
    { key: "aff2",       label: "Affiliation 2" },
    { key: "aff3",       label: "Affiliation 3" },
    { key: "totalUsers", label: "Total User"    },
    { key: "lastLogin",  label: "Last Login"    },
    { key: "status",     label: "Status"        },
  ];
  // Affiliations tab uses a *visible* set instead of *hidden* — the table has a small default set
  // of columns plus optional extras the user can add (e.g. Phone, Email, Contact Name).
  const AFFILIATIONS_COLS: Array<{ key: string; label: string }> = [
    { key: "code",       label: "Agency Code"   },
    { key: "location",   label: "Location"      },
    { key: "status",     label: "Status"        },
    { key: "lastLogin",  label: "Last Login"    },
    { key: "contact",    label: "Contact Name"  },
    { key: "phone",      label: "Phone"         },
    { key: "email",      label: "Email"         },
    { key: "totalUsers", label: "Total User"    },
  ];
  const AFF_DEFAULT_VISIBLE = ["code", "location", "status", "lastLogin"];
  const [affVisibleCols, setAffVisibleCols] = useState<Set<string>>(new Set(AFF_DEFAULT_VISIBLE));
  const [affListFilter, setAffListFilter] = useState<Set<string>>(new Set());
  const [affListFilterOpen, setAffListFilterOpen] = useState(false);
  const [affListFilterSearch, setAffListFilterSearch] = useState("");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx">("csv");
  const [exportFormatMenuOpen, setExportFormatMenuOpen] = useState(false);
  // Export-dialog-only state. Lazily initialized when the dialog is first opened.
  const AGENCIES_EXPORT_COLS_BASIC = ["code", "name", "city", "state", "aff1", "aff2", "aff3", "totalUsers", "lastLogin", "status"];
  const AGENCIES_EXPORT_COLS_CONTACTS = ["code", "name", "contact", "address", "city", "state", "zip", "phone", "email", "aff1", "aff2", "aff3", "totalUsers", "lastLogin", "status"];
  const [exportSelectedCols, setExportSelectedCols] = useState<Set<string>>(new Set(AGENCIES_EXPORT_COLS_CONTACTS));
  const [exportAffs, setExportAffs] = useState<Set<string>>(new Set());
  const [exportAffSearch, setExportAffSearch] = useState("");
  type ExportScope = "all" | "master" | "excludeMaster" | "withAffs";
  const [exportScope, setExportScope] = useState<ExportScope>("all");
  const [locationFilter, setLocationFilter] = useState<Set<string>>(new Set());
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [affiliationFilter, setAffiliationFilter] = useState<Set<string>>(new Set());
  const [affiliationOpen, setAffiliationOpen] = useState<number | null>(null);
  const [affiliationSearch, setAffiliationSearch] = useState("");
  const [agencyNameFilter, setAgencyNameFilter] = useState<Set<string>>(new Set());
  const [agencyNameOpen, setAgencyNameOpen] = useState(false);
  const [agencyNameSearch, setAgencyNameSearch] = useState("");
  const [allUsersSortDir, setAllUsersSortDir] = useState<"asc"|"desc">("asc");
  const ALL_JOB_TITLES = ["Principal", "Producer", "CSR", "Accounting", "Account Manager"];
  // Lifted from AgencyDetailView so deactivations propagate to the All Users tab in the main view.
  const [inactiveUserIds, setInactiveUserIds] = useState<Set<string>>(new Set());
  const [removedUserIds,  setRemovedUserIds]  = useState<Set<string>>(new Set());
  const [allUsersShowInactive, setAllUsersShowInactive] = useState(false);
  // Book Roll state: maps source agency id to the target agency code + effective date.
  // Used to flip the source agency's display to Unappointed (reason: Sold, soldTo: <code>).
  const [bookRolled, setBookRolled] = useState<Map<string, { targetCode: string; date: string }>>(new Map());

  // Whenever the search query changes, collapse the "Show inactive" toggle so each new search
  // starts from the default Active-only view. Users must explicitly click "Show inactive" again.
  useEffect(() => {
    setAllUsersShowInactive(false);
  }, [search]);

  // Auto-switch tab when the search box has a query that matches in a different tab.
  // Stays on the current tab if it has any match; otherwise jumps to the first tab that does.
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) return;
    const agencyById = new Map(allAgencies.map(a => [a.id, a]));
    const agenciesMatches = allAgencies.some(a =>
      a.name.toLowerCase().includes(q)
      || a.code.toLowerCase().includes(q)
      || a.city.toLowerCase().includes(q)
      || a.state.toLowerCase().includes(q)
    );
    const usersMatches = mockAgencyUsers.some(u =>
      u.name.toLowerCase().includes(q)
      || u.email.toLowerCase().includes(q)
      || u.jobTitle.toLowerCase().includes(q)
      || (agencyById.get(u.agencyId)?.name.toLowerCase().includes(q) ?? false)
    );
    const affMatches = Array.from(new Set(allAgencies.flatMap(a => a.affiliations))).some(n =>
      n.toLowerCase().includes(q)
    );
    const currentHasMatches = tab === "agencies" ? agenciesMatches : tab === "users" ? usersMatches : affMatches;
    if (currentHasMatches) return;
    if (agenciesMatches) setTab("agencies");
    else if (usersMatches) setTab("users");
    else if (affMatches) setTab("affiliations");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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
    if (locationFilter.size === 0) return true;
    return locationFilter.has(a.state);
  }).filter(a => {
    if (affiliationFilter.size === 0) return true;
    return a.affiliations.some(aff => affiliationFilter.has(aff));
  }).filter(a => {
    if (agencyNameFilter.size === 0) return true;
    return agencyNameFilter.has(a.name);
  }).filter(a => {
    if (!search) return true;
    return (
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.state.toLowerCase().includes(search.toLowerCase())
    );
  }).sort((a, b) => {
    if (!sortKey) return 0;
    let av = "", bv = "";
    if (sortKey === "name")       { av = a.name;      bv = b.name; }
    if (sortKey === "code")       { av = a.code;      bv = b.code; }
    if (sortKey === "location")   { av = a.city;      bv = b.city; }
    if (sortKey === "status")     { av = a.status;    bv = b.status; }
    if (sortKey === "totalUsers") { return sortDir === "asc" ? a.totalUsers - b.totalUsers : b.totalUsers - a.totalUsers; }
    if (sortKey === "lastLogin")  {
      const ta = new Date(a.lastLogin).getTime();
      const tb = new Date(b.lastLogin).getTime();
      return sortDir === "asc" ? ta - tb : tb - ta;
    }
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  // Filtered user count for All Users tab pagination
  const filteredUsersCount = (() => {
    if (tab !== "users") return 0;
    const q = search.trim().toLowerCase();
    const agencyById = new Map(allAgencies.map(a => [a.id, a]));
    return mockAgencyUsers
      .filter(u => !q
        || u.name.toLowerCase().includes(q)
        || u.email.toLowerCase().includes(q)
        || u.jobTitle.toLowerCase().includes(q)
        || (agencyById.get(u.agencyId)?.name.toLowerCase().includes(q) ?? false))
      .filter(u => allUsersJobFilter.size === 0 || allUsersJobFilter.has(u.jobTitle))
      .length;
  })();
  const totalPagesAgencies = Math.max(1, Math.ceil(filtered.length / perPage));
  const totalPagesUsers = Math.max(1, Math.ceil(filteredUsersCount / perPage));
  const totalPages = tab === "users" ? totalPagesUsers : totalPagesAgencies;
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

  const escapeCsv = (v: string | number | undefined): string => {
    const s = (v ?? "").toString();
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const downloadCsv = (filename: string, headers: string[], rows: string[]) => {
    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  // Compute export data (headers + 2D row values) for the current tab. Used by both the export
  // dialog preview and the download flow.
  const getExportData = (): { headers: string[]; rows: string[][]; filename: string } | null => {
    const stamp = new Date().toISOString().slice(0, 10);
    const safe = (s: string) => s.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
    if (tab === "affiliations") {
      const affMap = new Map<string, Agency[]>();
      for (const a of allAgencies) for (const aff of a.affiliations) {
        if (!affMap.has(aff)) affMap.set(aff, []);
        affMap.get(aff)!.push(a);
      }
      const q = search.trim().toLowerCase();
      const allRows = Array.from(affMap.entries())
        .map(([name, ags]) => ({ name, agencies: ags }))
        .filter(r => !q || r.name.toLowerCase().includes(q) || r.agencies.some(a => a.name.toLowerCase().includes(q)))
        .sort((a, b) => a.name.localeCompare(b.name));
      const affRows = affListFilter.size === 0 ? allRows : allRows.filter(r => affListFilter.has(r.name));
      const multiMode = affListFilter.size >= 2;
      let target: { name: string; agencies: Agency[] } | null;
      if (multiMode) {
        const deduped = Array.from(new Map(affRows.flatMap(r => r.agencies).map(a => [a.id, a])).values())
          .sort((a, b) => a.name.localeCompare(b.name));
        target = { name: Array.from(affListFilter).sort().join(" + "), agencies: deduped };
      } else {
        const activeAff = selectedAff && affRows.find(r => r.name === selectedAff)
          ? selectedAff
          : (affRows[0]?.name ?? null);
        target = activeAff ? affRows.find(r => r.name === activeAff)! : null;
      }
      if (!target) return null;
      const exportScope = multiMode ? affListFilter : new Set([target.name]);
      const otherAffs = (a: Agency) => a.affiliations.filter(x => !exportScope.has(x));
      const allCols: Array<{ key: string; label: string; get: (a: Agency) => string }> = [
        { key: "code",       label: "Agency Code",         get: a => a.code },
        { key: "name",       label: "Name",                get: a => a.name },
        { key: "otherAff1",  label: "Other Affiliation 1", get: a => otherAffs(a)[0] || "" },
        { key: "otherAff2",  label: "Other Affiliation 2", get: a => otherAffs(a)[1] || "" },
        { key: "contact",    label: "Contact Name",        get: a => getDetail(a).contact || "" },
        { key: "address",    label: "Address",             get: a => getDetail(a).street || "" },
        { key: "city",       label: "City",                get: a => a.city },
        { key: "state",      label: "State",               get: a => a.state },
        { key: "zip",        label: "ZIP Code",            get: a => getDetail(a).zip || "" },
        { key: "phone",      label: "Phone",               get: a => getDetail(a).phone || "" },
        { key: "email",      label: "Email",               get: a => getDetail(a).contactEmail || "" },
        { key: "totalUsers", label: "Total User",          get: a => String(a.totalUsers) },
        { key: "lastLogin",  label: "Last Login",          get: a => a.lastLogin },
        { key: "status",     label: "Status",              get: a => a.status },
        { key: "location",   label: "Location",            get: a => `${a.city || ""}${a.state ? `, ${a.state}` : ""}` },
      ];
      const togglable = new Set(AFFILIATIONS_COLS.map(col => col.key));
      const visible = allCols.filter(col => !togglable.has(col.key) || affVisibleCols.has(col.key));
      return {
        headers: visible.map(c => c.label),
        rows: target.agencies.map(a => visible.map(c => c.get(a))),
        filename: `affiliation-${safe(target.name)}-${stamp}`,
      };
    }
    if (tab === "users") {
      const q = search.trim().toLowerCase();
      const agencyById = new Map(allAgencies.map(a => [a.id, a]));
      const userRows = mockAgencyUsers
        .filter(u => !q
          || u.name.toLowerCase().includes(q)
          || u.email.toLowerCase().includes(q)
          || u.jobTitle.toLowerCase().includes(q)
          || (agencyById.get(u.agencyId)?.name.toLowerCase().includes(q) ?? false))
        .filter(u => allUsersJobFilter.size === 0 || allUsersJobFilter.has(u.jobTitle))
        .sort((a, b) => allUsersSortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
      const allCols: Array<{ key: string; label: string; get: (u: typeof mockAgencyUsers[number]) => string }> = [
        { key: "name",     label: "Name",      get: u => u.name },
        { key: "admin",    label: "Admin",     get: u => u.isAdmin ? "Yes" : "No" },
        { key: "jobTitle", label: "Job Title", get: u => u.jobTitle },
        { key: "email",    label: "Email",     get: u => u.email },
        { key: "phone",    label: "Phone",     get: u => u.phone },
        { key: "ext",      label: "Ext",       get: u => u.ext || "" },
        { key: "agency",   label: "Agency",    get: u => agencyById.get(u.agencyId)?.name ?? "" },
      ];
      const visible = allCols.filter(col => !usersHiddenCols.has(col.key));
      return {
        headers: visible.map(c => c.label),
        rows: userRows.map(u => visible.map(c => c.get(u))),
        filename: `users-${stamp}`,
      };
    }
    // agencies tab
    const allCols: Array<{ key: string; label: string; get: (a: Agency) => string }> = [
      { key: "code",       label: "Agency Code",   get: a => a.code },
      { key: "name",       label: "Name",          get: a => a.name },
      { key: "contact",    label: "Contact Name",  get: a => getDetail(a).contact || "" },
      { key: "address",    label: "Address",       get: a => getDetail(a).street || "" },
      { key: "city",       label: "City",          get: a => a.city },
      { key: "state",      label: "State",         get: a => a.state },
      { key: "zip",        label: "ZIP Code",      get: a => getDetail(a).zip || "" },
      { key: "phone",      label: "Phone",         get: a => getDetail(a).phone || "" },
      { key: "email",      label: "Email",         get: a => getDetail(a).contactEmail || "" },
      { key: "aff1",       label: "Affiliation 1", get: a => a.affiliations[0] || "" },
      { key: "aff2",       label: "Affiliation 2", get: a => a.affiliations[1] || "" },
      { key: "aff3",       label: "Affiliation 3", get: a => a.affiliations[2] || "" },
      { key: "totalUsers", label: "Total User",    get: a => String(a.totalUsers) },
      { key: "lastLogin",  label: "Last Login",    get: a => a.lastLogin },
      { key: "status",     label: "Status",        get: a => a.status },
    ];
    // The export dialog drives column selection + scope + affiliation row filter.
    // `filtered` already reflects table-level filters (search, status, affiliations, etc).
    // Master Agencies: we use `isStarred` as the master/strategic-partner proxy in this mock data.
    const visible = allCols.filter(col => exportSelectedCols.has(col.key));
    const scopeFiltered = filtered.filter(a => {
      if (exportScope === "master") return a.isStarred;
      if (exportScope === "excludeMaster") return !a.isStarred;
      if (exportScope === "withAffs") return a.affiliations.length > 0;
      return true;
    });
    const filteredByAff = exportAffs.size === 0
      ? scopeFiltered
      : scopeFiltered.filter(a => a.affiliations.some(aff => exportAffs.has(aff)));
    return {
      headers: visible.map(c => c.label),
      rows: filteredByAff.map(a => visible.map(c => c.get(a))),
      filename: `agencies-${stamp}`,
    };
  };
  const downloadXlsx = (filename: string, headers: string[], rows: string[][]) => {
    // Minimal XLSX-like download via TSV (Excel opens it cleanly)
    const tsv = [headers.join("\t"), ...rows.map(r => r.map(v => v.replace(/\t/g, " ")).join("\t"))].join("\n");
    const blob = new Blob(["\uFEFF" + tsv], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const runExport = () => {
    const data = getExportData();
    if (!data) return;
    if (exportFormat === "xlsx") {
      downloadXlsx(`${data.filename}.xls`, data.headers, data.rows);
    } else {
      const csvRows = data.rows.map(r => r.map(escapeCsv).join(","));
      downloadCsv(`${data.filename}.csv`, data.headers, csvRows);
    }
    setExportDialogOpen(false);
  };
  const exportAgencies = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    const safe = (s: string) => s.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
    if (tab === "affiliations") {
      // Export agencies in the currently selected affiliation, or the union when 2+ are filter-selected.
      const affMap = new Map<string, Agency[]>();
      for (const a of allAgencies) for (const aff of a.affiliations) {
        if (!affMap.has(aff)) affMap.set(aff, []);
        affMap.get(aff)!.push(a);
      }
      const q = search.trim().toLowerCase();
      const allRows = Array.from(affMap.entries())
        .map(([name, ags]) => ({ name, agencies: ags }))
        .filter(r => !q || r.name.toLowerCase().includes(q) || r.agencies.some(a => a.name.toLowerCase().includes(q)))
        .sort((a, b) => a.name.localeCompare(b.name));
      const affRows = affListFilter.size === 0 ? allRows : allRows.filter(r => affListFilter.has(r.name));
      const multiMode = affListFilter.size >= 2;
      let target: { name: string; agencies: Agency[] } | null;
      if (multiMode) {
        const deduped = Array.from(new Map(affRows.flatMap(r => r.agencies).map(a => [a.id, a])).values())
          .sort((a, b) => a.name.localeCompare(b.name));
        target = { name: Array.from(affListFilter).sort().join(" + "), agencies: deduped };
      } else {
        const activeAff = selectedAff && affRows.find(r => r.name === selectedAff)
          ? selectedAff
          : (affRows[0]?.name ?? null);
        target = activeAff ? affRows.find(r => r.name === activeAff)! : null;
      }
      if (!target) return;
      // Always export the underlying contact details (Address, City, State, ZIP, Contact Name, Phone, Email).
      // The View dropdown only toggles which agency-summary columns appear.
      // "Other" means the agency's affiliations that aren't part of the current export scope.
      const exportScope = multiMode ? affListFilter : new Set([target.name]);
      const otherAffs = (a: Agency) => a.affiliations.filter(x => !exportScope.has(x));
      const allCols: Array<{ key: string; label: string; get: (a: Agency) => string }> = [
        { key: "code",       label: "Agency Code",         get: a => a.code },
        { key: "name",       label: "Name",                get: a => a.name },
        { key: "otherAff1",  label: "Other Affiliation 1", get: a => otherAffs(a)[0] || "" },
        { key: "otherAff2",  label: "Other Affiliation 2", get: a => otherAffs(a)[1] || "" },
        { key: "contact",    label: "Contact Name", get: a => getDetail(a).contact || "" },
        { key: "address",    label: "Address",      get: a => getDetail(a).street || "" },
        { key: "city",       label: "City",         get: a => a.city },
        { key: "state",      label: "State",        get: a => a.state },
        { key: "zip",        label: "ZIP Code",     get: a => getDetail(a).zip || "" },
        { key: "phone",      label: "Phone",        get: a => getDetail(a).phone || "" },
        { key: "email",      label: "Email",        get: a => getDetail(a).contactEmail || "" },
        { key: "totalUsers", label: "Total User",   get: a => String(a.totalUsers) },
        { key: "lastLogin",  label: "Last Login",   get: a => a.lastLogin },
        { key: "status",     label: "Status",       get: a => a.status },
        { key: "location",   label: "Location",     get: a => `${a.city || ""}${a.state ? `, ${a.state}` : ""}` },
      ];
      const togglable = new Set(AFFILIATIONS_COLS.map(col => col.key));
      const visibleCols = allCols.filter(col => !togglable.has(col.key) || affVisibleCols.has(col.key));
      const headers = visibleCols.map(c => c.label);
      const rows = target.agencies.map(a => visibleCols.map(c => c.get(a)).map(escapeCsv).join(","));
      downloadCsv(`affiliation-${safe(target.name)}-${stamp}.csv`, headers, rows);
      return;
    }
    if (tab === "users") {
      // Export currently filtered users (search + job-title filter), respecting hidden columns
      const q = search.trim().toLowerCase();
      const agencyById = new Map(allAgencies.map(a => [a.id, a]));
      const userRows = mockAgencyUsers
        .filter(u => !q
          || u.name.toLowerCase().includes(q)
          || u.email.toLowerCase().includes(q)
          || u.jobTitle.toLowerCase().includes(q)
          || (agencyById.get(u.agencyId)?.name.toLowerCase().includes(q) ?? false))
        .filter(u => allUsersJobFilter.size === 0 || allUsersJobFilter.has(u.jobTitle))
        .sort((a, b) => allUsersSortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
      const allCols: Array<{ key: string; label: string; get: (u: typeof mockAgencyUsers[number]) => string }> = [
        { key: "name",     label: "Name",      get: u => u.name },
        { key: "admin",    label: "Admin",     get: u => u.isAdmin ? "Yes" : "No" },
        { key: "jobTitle", label: "Job Title", get: u => u.jobTitle },
        { key: "email",    label: "Email",     get: u => u.email },
        { key: "phone",    label: "Phone",     get: u => u.phone },
        { key: "ext",      label: "Ext",       get: u => u.ext || "" },
        { key: "agency",   label: "Agency",    get: u => agencyById.get(u.agencyId)?.name ?? "" },
      ];
      const visibleCols = allCols.filter(col => !usersHiddenCols.has(col.key));
      const headers = visibleCols.map(c => c.label);
      const rows = userRows.map(u => visibleCols.map(c => c.get(u)).map(escapeCsv).join(","));
      downloadCsv(`users-${stamp}.csv`, headers, rows);
      return;
    }
    // Always export the underlying contact details (Contact Name, Address, City, State, ZIP, Phone, Email).
    // The visible-column toggle only hides table columns: Code, Location, Affiliation 1/2/3, Total User, Last Login, Status.
    const allCols: Array<{ key: string; label: string; get: (a: Agency) => string }> = [
      { key: "code",       label: "Agency Code",   get: a => a.code },
      { key: "name",       label: "Name",          get: a => a.name },
      { key: "contact",    label: "Contact Name",  get: a => getDetail(a).contact || "" },
      { key: "address",    label: "Address",       get: a => getDetail(a).street || "" },
      { key: "city",       label: "City",          get: a => a.city },
      { key: "state",      label: "State",         get: a => a.state },
      { key: "zip",        label: "ZIP Code",      get: a => getDetail(a).zip || "" },
      { key: "phone",      label: "Phone",         get: a => getDetail(a).phone || "" },
      { key: "email",      label: "Email",         get: a => getDetail(a).contactEmail || "" },
      { key: "aff1",       label: "Affiliation 1", get: a => a.affiliations[0] || "" },
      { key: "aff2",       label: "Affiliation 2", get: a => a.affiliations[1] || "" },
      { key: "aff3",       label: "Affiliation 3", get: a => a.affiliations[2] || "" },
      { key: "totalUsers", label: "Total User",    get: a => String(a.totalUsers) },
      { key: "lastLogin",  label: "Last Login",    get: a => a.lastLogin },
      { key: "status",     label: "Status",        get: a => a.status },
    ];
    // Skip only columns that are togglable from the View dropdown AND currently hidden.
    // Contact details (name/contact/address/city/state/zip/phone/email) are always exported.
    const togglable = new Set(AGENCIES_COLS.map(col => col.key));
    const visibleCols = allCols.filter(col => !(togglable.has(col.key) && agenciesHiddenCols.has(col.key)));
    const headers = visibleCols.map(c => c.label);
    const rows = filtered.map(a => visibleCols.map(c => c.get(a)).map(escapeCsv).join(","));
    downloadCsv(`agencies-${stamp}.csv`, headers, rows);
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
    <div className="flex flex-col justify-center flex-shrink-0 mb-12"
      style={{ height: 71, borderBottom: `0.87px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB"}`, marginLeft: -48, marginRight: -48, paddingLeft: 28, paddingRight: 28 }}>
      <h1 className="text-[22px] font-normal" style={{ ...font, color: c.text }}>Agencies</h1>
    </div>
  );

  if (addOpen) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        {sectionTitle}
        <AddAgencyForm
          isDark={isDark}
          initialDraft={resumeFromDraft ? agencyDraft : null}
          onSaveForLater={(d) => {
            setAgencyDraft(d);
            setAddOpen(false);
            setResumeFromDraft(false);
            setSaveForLaterToast(true);
            setTimeout(() => setSaveForLaterToast(false), 2400);
          }}
          onDiscard={() => {
            setAddOpen(false);
            setResumeFromDraft(false);
            setAgencyDraft(null);
          }}
          c={c} btnGrad={btnGrad} FONT={FONT}
        />
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
        inactiveUserIds={inactiveUserIds}
        setInactiveUserIds={setInactiveUserIds}
        removedUserIds={removedUserIds}
        setRemovedUserIds={setRemovedUserIds}
        bookRolled={bookRolled}
        setBookRolled={setBookRolled}
        allAgencies={allAgencies}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: FONT }} onClick={() => { setPerPageOpen(false); setViewOpen(false); setAffListFilterOpen(false); setAgencyNameOpen(false); setLocationOpen(false); setAffiliationOpen(null); }}>
      {exportDialogOpen && (() => {
        const data = getExportData();
        const previewRows = data ? data.rows.slice(0, 3) : [];
        const totalRows = data ? data.rows.length : 0;
        const isAgenciesTab = tab === "agencies";
        // All available columns shown in the column-picker for the agencies tab.
        const ALL_AGENCY_COLS: Array<{ key: string; label: string }> = [
          { key: "code",       label: "Agency Code"   },
          { key: "name",       label: "Name"          },
          { key: "contact",    label: "Contact Name"  },
          { key: "address",    label: "Address"       },
          { key: "city",       label: "City"          },
          { key: "state",      label: "State"         },
          { key: "zip",        label: "ZIP Code"      },
          { key: "phone",      label: "Phone"         },
          { key: "email",      label: "Email"         },
          { key: "aff1",       label: "Affiliation 1" },
          { key: "aff2",       label: "Affiliation 2" },
          { key: "aff3",       label: "Affiliation 3" },
          { key: "totalUsers", label: "Total User"    },
          { key: "lastLogin",  label: "Last Login"    },
          { key: "status",     label: "Status"        },
        ];
        const allAffNames = Array.from(new Set(allAgencies.flatMap(a => a.affiliations))).sort();
        const filteredAffNames = allAffNames.filter(n => !exportAffSearch || n.toLowerCase().includes(exportAffSearch.toLowerCase()));
        // Compute which preset is currently active (if any) — used to highlight the preset button.
        const colsKey = Array.from(exportSelectedCols).sort().join(",");
        const basicKey = [...AGENCIES_EXPORT_COLS_BASIC].sort().join(",");
        const contactsKey = [...AGENCIES_EXPORT_COLS_CONTACTS].sort().join(",");
        const activePreset = colsKey === basicKey ? "basic" : colsKey === contactsKey ? "contacts" : null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setExportDialogOpen(false)}>
            <div className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: c.cardBg, border: `1px solid ${c.border}`, width: "min(960px, 94vw)", maxHeight: "88vh", boxShadow: "0 20px 50px rgba(0,0,0,0.20)" }}
              onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
                <div>
                  <h2 className="text-[16px] font-bold" style={{ fontFamily: FONT, color: c.text }}>Export {tab === "users" ? "Users" : tab === "affiliations" ? "Affiliation Agencies" : "Agencies"}</h2>
                  <p className="text-[12px] mt-0.5" style={{ fontFamily: FONT, color: c.muted }}>{data ? `${totalRows} ${totalRows === 1 ? "row" : "rows"} · ${data.headers.length} columns · respects your current filters` : "No data to export"}</p>
                </div>
                <button onClick={() => setExportDialogOpen(false)}
                  className="p-1.5 rounded-md transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <X className="w-4 h-4" style={{ color: c.muted }} />
                </button>
              </div>
              {/* Body — for agencies tab show full options; for other tabs simpler */}
              {isAgenciesTab ? (
                <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
                  {/* Scope */}
                  <div className="px-5 pt-4 pb-3 flex-shrink-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Scope</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {([
                        ["all",            "All Agencies"           ],
                        ["master",         "Master Agencies Only"   ],
                        ["excludeMaster",  "Exclude Master Agencies"],
                        ["withAffs",       "Agencies with Affiliations"],
                      ] as const).map(([key, label]) => {
                        const active = exportScope === key;
                        return (
                          <label key={key} className="flex items-center gap-1.5 cursor-pointer"
                            onClick={() => setExportScope(key)}>
                            <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full flex-shrink-0"
                              style={{ border: `1.5px solid ${active ? "#A614C3" : c.borderStrong}`, background: c.cardBg }}>
                              {active && <span style={{ width: 7, height: 7, borderRadius: 999, background: "#A614C3" }} />}
                            </span>
                            <span className="text-[12px]" style={{ fontFamily: FONT, color: active ? "#A614C3" : c.text, fontWeight: active ? 600 : 400 }}>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mx-5" style={{ borderBottom: `1px solid ${c.border}` }} />
                  {/* Quick Preset + Columns — combined into one section */}
                  <div className="px-5 pt-4 pb-4 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-x-6 gap-y-2">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Quick Preset</div>
                        {([["basic", "Agencies Only", AGENCIES_EXPORT_COLS_BASIC], ["contacts", "Agencies with Contacts", AGENCIES_EXPORT_COLS_CONTACTS]] as const).map(([key, label, cols]) => {
                          const active = activePreset === key;
                          return (
                            <label key={key} className="flex items-center gap-1.5 cursor-pointer"
                              onClick={() => setExportSelectedCols(new Set(cols))}>
                              <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full flex-shrink-0"
                                style={{ border: `1.5px solid ${active ? "#A614C3" : c.borderStrong}`, background: c.cardBg }}>
                                {active && <span style={{ width: 7, height: 7, borderRadius: 999, background: "#A614C3" }} />}
                              </span>
                              <span className="text-[12px]" style={{ fontFamily: FONT, color: active ? "#A614C3" : c.text, fontWeight: active ? 600 : 400 }}>{label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Columns ({exportSelectedCols.size}/{ALL_AGENCY_COLS.length})</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setExportSelectedCols(new Set(ALL_AGENCY_COLS.map(c => c.key)))}
                          className="text-[11px] font-semibold transition-colors"
                          style={{ fontFamily: FONT, color: "#A614C3" }}>All</button>
                        <span className="text-[11px]" style={{ color: c.muted }}>·</span>
                        <button onClick={() => setExportSelectedCols(new Set())}
                          className="text-[11px] font-semibold transition-colors"
                          style={{ fontFamily: FONT, color: "#A614C3" }}>None</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-y-1 gap-x-3">
                      {ALL_AGENCY_COLS.map(col => {
                        const checked = exportSelectedCols.has(col.key);
                        return (
                          <label key={col.key} className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors"
                            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            onClick={() => setExportSelectedCols(prev => { const s = new Set(prev); s.has(col.key) ? s.delete(col.key) : s.add(col.key); return s; })}>
                            <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                              style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                              {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                            <span className="text-[12px] truncate" style={{ fontFamily: FONT, color: c.text }}>{col.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  {/* Affiliation filter — only shown when scope is "Agencies with Affiliations" — moved BELOW Columns */}
                  {exportScope === "withAffs" && (
                    <>
                    <div className="mx-5" style={{ borderBottom: `1px solid ${c.border}` }} />
                    <div className="px-5 pt-4 pb-4 flex-shrink-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Filter by Affiliation {exportAffs.size > 0 ? `(${exportAffs.size})` : "(All)"}</div>
                        {exportAffs.size > 0 && (
                          <button onClick={() => { setExportAffs(new Set()); setExportAffSearch(""); }}
                            className="text-[11px] font-semibold" style={{ fontFamily: FONT, color: "#A614C3" }}>Clear</button>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-y-1 gap-x-3" style={{ maxHeight: 180, overflowY: "auto" }}>
                        {allAffNames.map(name => {
                          const checked = exportAffs.has(name);
                          return (
                            <label key={name} className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors"
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                              onClick={() => setExportAffs(prev => { const s = new Set(prev); s.has(name) ? s.delete(name) : s.add(name); return s; })}>
                              <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                                style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                                {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                              <span className="text-[12px] truncate" style={{ fontFamily: FONT, color: c.text }} title={name}>{name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="px-6 py-3 flex items-center gap-2 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}`, background: isDark ? "rgba(168,85,247,0.08)" : "rgba(168,85,247,0.06)" }}>
                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  <span className="text-[12px] inline-flex items-center gap-1.5 flex-wrap" style={{ fontFamily: FONT, color: c.text }}>
                    Want to drop columns? Click
                    <button onClick={() => { setExportDialogOpen(false); setTimeout(() => setViewOpen(true), 0); }}
                      title="Open View columns"
                      className="inline-flex items-center justify-center p-1 rounded-md transition-colors"
                      style={{ color: "#A614C3", background: isDark ? "rgba(168,85,247,0.15)" : "rgba(168,85,247,0.12)", verticalAlign: "middle" }}
                      onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(168,85,247,0.25)" : "rgba(168,85,247,0.20)")}
                      onMouseLeave={e => (e.currentTarget.style.background = isDark ? "rgba(168,85,247,0.15)" : "rgba(168,85,247,0.12)")}>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="2" y="2" rx="1"/><rect width="5" height="5" x="9.5" y="2" rx="1"/><rect width="5" height="5" x="17" y="2" rx="1"/><rect width="5" height="5" x="2" y="9.5" rx="1"/><rect width="5" height="5" x="9.5" y="9.5" rx="1"/><rect width="5" height="5" x="17" y="9.5" rx="1"/><rect width="5" height="5" x="2" y="17" rx="1"/><rect width="5" height="5" x="9.5" y="17" rx="1"/><rect width="5" height="5" x="17" y="17" rx="1"/></svg>
                    </button>
                    in the toolbar to hide any column — the export updates with it.
                  </span>
                </div>
              )}
              {/* Preview */}
              <div className="mx-5" style={{ borderTop: `1px solid ${c.border}` }} />
              <div className="px-6 py-3 flex-shrink-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>
                  Preview {totalRows > 3 ? `(first 3 of ${totalRows})` : ""}
                </div>
                {!data || previewRows.length === 0 ? (
                  <div className="py-8 text-center text-[13px] rounded-xl"
                    style={{ fontFamily: FONT, color: c.muted, border: `1px dashed ${c.border}`, background: c.hoverBg }}>
                    No rows match your current filters.
                  </div>
                ) : data.headers.length === 0 ? (
                  <div className="py-8 text-center text-[13px] rounded-xl"
                    style={{ fontFamily: FONT, color: c.muted, border: `1px dashed ${c.border}`, background: c.hoverBg }}>
                    No columns selected.
                  </div>
                ) : (
                  <div className="overflow-auto rounded-xl" style={{ border: `1px solid ${c.border}`, maxHeight: 200 }}>
                    <table className="text-left border-collapse" style={{ minWidth: "100%" }}>
                      <thead className="sticky top-0" style={{ background: c.hoverBg, zIndex: 1 }}>
                        <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                          {data.headers.map(h => (
                            <th key={h} className="text-[11px] font-bold uppercase tracking-wider py-2.5 px-4 whitespace-nowrap"
                              style={{ fontFamily: FONT, color: c.muted }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.map((row, i) => (
                          <tr key={i} style={{ borderBottom: i !== previewRows.length - 1 ? `1px solid ${c.border}` : "none" }}>
                            {row.map((v, j) => (
                              <td key={j} className="py-2.5 px-4 whitespace-nowrap text-[12px]"
                                style={{ fontFamily: FONT, color: c.text }}>{v || <span style={{ color: c.muted }}>—</span>}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="px-6 py-3 flex items-center justify-between gap-2 flex-shrink-0" style={{ borderTop: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "#FAFAFA" }}>
                {isAgenciesTab ? (
                  <button onClick={() => { setExportSelectedCols(new Set(AGENCIES_EXPORT_COLS_CONTACTS)); setExportAffs(new Set()); setExportAffSearch(""); setExportFormat("csv"); setExportScope("all"); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors"
                    style={{ fontFamily: FONT, color: "#A614C3" }}
                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <RefreshCw className="w-3.5 h-3.5" />Reset
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button onClick={() => setExportDialogOpen(false)}
                    className="px-4 py-2 rounded-lg text-[13px] transition-colors"
                    style={{ fontFamily: FONT, color: c.text, border: `1px solid ${c.border}`, background: c.cardBg }}
                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = c.cardBg)}>
                    Cancel
                  </button>
                  {/* Split button: shared gradient on the wrapper so both halves read as one continuous fill. */}
                  <div className="relative inline-flex transition-all"
                    onClick={e => e.stopPropagation()}
                    onMouseEnter={e => { if (data && totalRows > 0 && data.headers.length > 0) e.currentTarget.style.filter = "brightness(1.12)"; }}
                    onMouseLeave={e => (e.currentTarget.style.filter = "none")}
                    style={{ background: btnGrad, borderRadius: 10, boxShadow: "0 4px 14px rgba(166,20,195,0.25)", opacity: !data || totalRows === 0 || data.headers.length === 0 ? 0.5 : 1 }}>
                    <button onClick={runExport}
                      disabled={!data || totalRows === 0 || data.headers.length === 0}
                      className="flex items-center gap-2 pl-4 pr-3 py-2 text-[13px] font-semibold text-white"
                      style={{ fontFamily: FONT, background: "transparent", borderRadius: "10px 0 0 10px", cursor: !data || totalRows === 0 || data.headers.length === 0 ? "not-allowed" : "pointer" }}>
                      <Download className="w-4 h-4" />Download {exportFormat === "csv" ? "CSV" : "Excel"}
                    </button>
                    <button onClick={() => setExportFormatMenuOpen(o => !o)}
                      disabled={!data || totalRows === 0 || data.headers.length === 0}
                      className="flex items-center justify-center px-2 py-2 text-white"
                      style={{ fontFamily: FONT, background: "transparent", borderRadius: "0 10px 10px 0", borderLeft: "1px solid rgba(255,255,255,0.25)", cursor: !data || totalRows === 0 || data.headers.length === 0 ? "not-allowed" : "pointer" }}>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {exportFormatMenuOpen && (
                      <div className="absolute right-0 bottom-full mb-1 z-30 w-[160px] rounded-lg shadow-xl overflow-hidden"
                        style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        {([["csv", "CSV"], ["xlsx", "Excel"]] as const).map(([key, label]) => {
                          const active = exportFormat === key;
                          return (
                            <button key={key} onClick={() => { setExportFormat(key); setExportFormatMenuOpen(false); }}
                              className="w-full flex items-center justify-between px-3 py-2 text-[12px] transition-colors"
                              style={{ fontFamily: FONT, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent", fontWeight: active ? 600 : 400 }}
                              onMouseEnter={e => (e.currentTarget.style.background = active ? "rgba(168,85,247,0.12)" : c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = active ? "rgba(168,85,247,0.08)" : "transparent")}>
                              <span>{label}</span>
                              {active && <svg width="9" height="7" viewBox="0 0 9 7" fill="none" className="flex-shrink-0"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {starLimitToast && (
        <div className="fixed top-[68px] right-6 z-50 flex items-center gap-4"
          style={{ background: isDark ? "#1E2240" : "#fff", border: `1px solid ${c.border}`, borderRadius: 12, padding: "12px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", minWidth: 320, maxWidth: 420, fontFamily: FONT }}>
          <Star className="w-4 h-4 flex-shrink-0" style={{ color: "#F59E0B", fill: "#F59E0B" }} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold" style={{ color: c.text }}>Pin limit reached</div>
            <div className="text-[12px] mt-0.5" style={{ color: c.muted }}>You can only pin up to 6 agencies.</div>
          </div>
        </div>
      )}
      {saveForLaterToast && (
        <div className="fixed top-[68px] right-6 z-50 flex items-center gap-4"
          style={{ background: isDark ? "#1E2240" : "#fff", border: `1px solid ${c.border}`, borderRadius: 12, padding: "12px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", minWidth: 320, maxWidth: 420, fontFamily: FONT }}>
          <Bookmark className="w-4 h-4 flex-shrink-0" style={{ color: "#A855F7" }} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold" style={{ color: c.text }}>Draft saved</div>
            <div className="text-[12px] mt-0.5" style={{ color: c.muted }}>Pick up where you left off any time.</div>
          </div>
        </div>
      )}
      {resumeDraftOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setResumeDraftOpen(false)}
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-[420px] rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,0.12)" }}>
                <FilePen className="w-6 h-6" style={{ color: "#A855F7" }} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold mb-1" style={{ color: c.text }}>Continue your unfinished agency?</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: c.muted }}>
                  You saved a draft{agencyDraft?.agencyName ? <> for <strong style={{ color: c.text }}>{agencyDraft.agencyName}</strong></> : ""}. Pick up where you left off, or start from scratch.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setAgencyDraft(null); setResumeDraftOpen(false); setResumeFromDraft(false); setAddOpen(true); }}
                className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Start fresh
              </button>
              <button onClick={() => { setResumeFromDraft(true); setResumeDraftOpen(false); setAddOpen(true); }}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                style={{ background: btnGrad }}
                onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section title */}
      {sectionTitle}

      {/* Search + buttons */}
      <div className="flex items-center gap-2 mb-7">
        <div className="flex flex-1 max-w-[360px] transition-all"
          style={{ background: c.cardBg, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, borderRadius: 10, overflow: "hidden" }}>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder={tab === "affiliations" ? "Search affiliations, agencies, or codes..." : tab === "users" ? "Search users..." : "Search agencies, users, or codes..."}
            className="flex-1 outline-none"
            style={{ fontFamily: FONT, background: "transparent", color: c.text, padding: "8px 14px", fontSize: 13, border: "none" }} />
          <button className="flex items-center gap-1.5 px-4 text-[12px] font-semibold text-white flex-shrink-0 transition-all"
            style={{ background: btnGrad, fontFamily: FONT }}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.12)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
            <Search className="w-3.5 h-3.5" />Search
          </button>
        </div>
        <button onClick={() => { if (agencyDraft) { setResumeDraftOpen(true); } else { setResumeFromDraft(false); setAddOpen(true); } }}
          className="relative flex items-center gap-1.5 text-[13px] font-semibold text-white transition-all"
          style={{ fontFamily: FONT, background: btnGrad, padding:"9px 16px", borderRadius: 10 }}
          title={agencyDraft ? "You have an unfinished draft" : undefined}
          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.10)")}
          onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
          <Plus className="w-4 h-4" />Add New Agency
          {agencyDraft && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
              style={{ background: "#F59E0B", border: `2px solid ${isDark ? "#0B0F1C" : "#FFFFFF"}` }} />
          )}
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
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
              Starred Agencies <span className="font-normal" style={{ color: c.muted }}>({starred.length} of 6)</span>
            </span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {starred.map(a => (
              <div key={a.id} onClick={() => setSelectedAgency(getDetail(a))}
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors"
                style={{ background: c.cardBg, border: `1px solid ${c.border}`, minWidth: 180 }}
                onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB"; }}
                onMouseLeave={e => { e.currentTarget.style.background = c.cardBg; }}>
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
        <div className="flex items-center gap-0">
          {([["agencies", "Agencies", Building2], ["users", "All Users", Users], ["affiliations", "Affiliations", Network]] as [TabKey, string, React.ComponentType<{className?:string;style?:React.CSSProperties}>][]).map(([key, label, Icon]) => {
            const active = tab === key;
            return (
              <button key={key} onClick={() => setTab(key)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-normal relative transition-colors"
                style={{ fontFamily: FONT, color: active ? (isDark ? "#fff" : "#A614C3") : c.muted, letterSpacing: "0.01em" }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = c.muted; }}>
                <Icon className="w-[15px] h-[15px]" style={{ color: active ? "#A614C3" : undefined }} />
                {label}
                {active && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)" }} />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1" style={{ borderLeft: `1px solid ${c.border}`, paddingLeft: 10, marginLeft: 6 }}>
          <button title="Reset filters"
            onClick={() => {
              setSearch("");
              setFilterStatus("All");
              setSortKey(null);
              setSortDir("asc");
              setPage(1);
              setLocationFilter(new Set()); setLocationSearch(""); setLocationOpen(false);
              setAffiliationFilter(new Set()); setAffiliationSearch(""); setAffiliationOpen(null);
              setAgencyNameFilter(new Set()); setAgencyNameSearch(""); setAgencyNameOpen(false);
              setAllUsersJobFilter(new Set()); setAllUsersJobSearch(""); setAllUsersJobOpen(false);
              setAllUsersSortDir("asc");
            }}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "#A614C3" }}
            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button title="View columns" onClick={() => setViewOpen(o => !o)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "#A614C3", background: viewOpen ? c.hoverBg : "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = viewOpen ? c.hoverBg : "transparent")}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="2" y="2" rx="1"/><rect width="5" height="5" x="9.5" y="2" rx="1"/><rect width="5" height="5" x="17" y="2" rx="1"/><rect width="5" height="5" x="2" y="9.5" rx="1"/><rect width="5" height="5" x="9.5" y="9.5" rx="1"/><rect width="5" height="5" x="17" y="9.5" rx="1"/><rect width="5" height="5" x="2" y="17" rx="1"/><rect width="5" height="5" x="9.5" y="17" rx="1"/><rect width="5" height="5" x="17" y="17" rx="1"/></svg>
            </button>
            {viewOpen && (() => {
              // Unified column-visibility picker. Each tab tracks visibility differently:
              // - users/agencies use a "hidden" set (default = all visible)
              // - affiliations uses a "visible" set (default = base columns; user can also add extras)
              const cols = tab === "users" ? USERS_COLS : tab === "agencies" ? AGENCIES_COLS : AFFILIATIONS_COLS;
              const isVisible = (k: string) =>
                tab === "affiliations" ? affVisibleCols.has(k)
                  : tab === "users" ? !usersHiddenCols.has(k)
                  : !agenciesHiddenCols.has(k);
              const toggle = (k: string) => {
                if (tab === "affiliations") setAffVisibleCols(prev => { const s = new Set(prev); s.has(k) ? s.delete(k) : s.add(k); return s; });
                else if (tab === "users")   setUsersHiddenCols(prev => { const s = new Set(prev); s.has(k) ? s.delete(k) : s.add(k); return s; });
                else                        setAgenciesHiddenCols(prev => { const s = new Set(prev); s.has(k) ? s.delete(k) : s.add(k); return s; });
              };
              const reset = () => {
                if (tab === "affiliations") setAffVisibleCols(new Set(AFF_DEFAULT_VISIBLE));
                else if (tab === "users")   setUsersHiddenCols(new Set());
                else                        setAgenciesHiddenCols(new Set());
              };
              return (
                <div className="absolute right-0 top-full mt-1 z-30 w-[220px] rounded-xl shadow-xl overflow-hidden"
                  style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                  <div className="px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold"
                    style={{ fontFamily: FONT, color: c.muted, borderBottom: `1px solid ${c.border}`, letterSpacing: "0.06em" }}>
                    Show Columns
                  </div>
                  <div className="py-1.5 max-h-[280px] overflow-y-auto">
                    {cols.map(col => {
                      const visible = isVisible(col.key);
                      return (
                        <label key={col.key} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors"
                          onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                          onClick={() => toggle(col.key)}>
                          <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                            style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                            {visible && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>{col.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  <button onClick={reset}
                    className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors"
                    style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <RefreshCw className="w-3.5 h-3.5" />Reset
                  </button>
                </div>
              );
            })()}
          </div>
          <button onClick={() => setExportDialogOpen(true)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "#A614C3" }}
            title={tab === "affiliations" ? "Preview & export agencies in this affiliation" : tab === "users" ? "Preview & export users (filtered)" : "Preview & export agencies (filtered)"}
            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      {tab === "agencies" && (
      <div className="flex-1 overflow-auto mt-0" style={{ scrollbarGutter: "stable" }} onClick={() => { setLocationOpen(false); setAffiliationOpen(null); setAgencyNameOpen(false); setViewOpen(false); }}>
        <table className="w-full text-left border-collapse" style={{ tableLayout: "fixed" }}>
          <thead className="sticky top-0 z-10" style={{ background: isDark ? "rgba(30,34,64,0.25)" : "rgba(255,255,255,0.25)", backdropFilter: "blur(6px)" }}>
            <tr style={{ borderBottom: `1px solid ${c.border}` }}>
              {([
                ["name",       "Agency Name", "15%",  true ],
                ["code",       "Agency Code", "11%",  true ],
                ["location",   "Location",    "12%",  false],
                [null,         "Affiliation 1","10%", false],
                [null,         "Affiliation 2","10%", false],
                [null,         "Affiliation 3","10%", false],
                ["totalUsers", "Total User",  "8%",   true ],
                ["lastLogin",  "Last Login",  "12%",  true ],
                ["status",     "Status",      "12%",  true ],
              ] as [SortKey, string, string, boolean][]).map(([key, label, w, sortable], idx) => {
                const affMatch = label?.match(/^Affiliation (\d)$/);
                const affIdx = affMatch ? parseInt(affMatch[1]) : null;
                const colKey = affIdx !== null ? `aff${affIdx}` : key;
                if (colKey && colKey !== "name" && agenciesHiddenCols.has(colKey)) return null;
                return (
                <th key={`${key}-${idx}`} onClick={() => sortable && key && key !== "name" && handleSort(key)}
                  className={`text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap ${sortable && key !== "name" ? "cursor-pointer" : ""} ${(key === "name" || key === "location" || affIdx !== null) ? "relative" : ""}`}
                  style={{ fontFamily: FONT, color: (key === "name" && agencyNameFilter.size > 0) || (key === "location" && locationFilter.size > 0) || (affIdx !== null && affiliationFilter.size > 0) ? "#A614C3" : c.muted, width: w,
                    paddingLeft: idx === 0 ? 52
                      : key === "code" ? 20
                      : key === "location" ? 16
                      : affIdx === 1 ? 6
                      : (label?.startsWith("Affiliation")) ? 16
                      : key === "totalUsers" ? 25
                      : key === "lastLogin" ? 76
                      : key === "status" ? 25
                      : undefined,
                    textAlign: (key === "totalUsers" || key === "status") ? "center" : undefined }}>
                  {key === "name" ? (
                    <>
                      <button onClick={e => { e.stopPropagation(); setAgencyNameOpen(o => !o); setLocationOpen(false); setAffiliationOpen(null); }}
                        className="inline-flex items-center gap-1 select-none cursor-pointer text-[11px] font-bold uppercase tracking-wider"
                        style={{ fontFamily: FONT, color: agencyNameFilter.size > 0 || sortKey === "name" ? "#A614C3" : c.muted }}>
                        {label}
                        <ChevronDown className="w-3 h-3 ml-0.5" />
                      </button>
                      {agencyNameOpen && (() => {
                        const names = Array.from(new Set(allAgencies.map(a => a.name))).sort();
                        const toggleName = (n: string) => setAgencyNameFilter(prev => { const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s; });
                        const sortItem = (label: string, dir: "asc" | "desc") => {
                          const active = sortKey === "name" && sortDir === dir;
                          return (
                            <button onClick={() => { setSortKey("name"); setSortDir(dir); setAgencyNameOpen(false); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors text-left normal-case tracking-normal"
                              style={{ fontFamily: FONT, color: active ? "#A614C3" : c.text, fontWeight: active ? 600 : 400 }}
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                              {dir === "asc"
                                ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" />
                                : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />}
                              <span className="text-[12px] flex-1">{label}</span>
                              {active && <svg width="9" height="7" viewBox="0 0 9 7" fill="none" className="flex-shrink-0"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </button>
                          );
                        };
                        return (
                          <div className="absolute left-0 top-8 z-30 w-[260px] rounded-xl shadow-xl overflow-hidden normal-case tracking-normal"
                            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontWeight: 400, letterSpacing: "normal" }}
                            onClick={e => e.stopPropagation()}>
                            <div className="py-1.5">
                              {sortItem("Sort A → Z", "asc")}
                              {sortItem("Sort Z → A", "desc")}
                            </div>
                            <div className="p-3" style={{ borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" }}>
                                <Search className="w-3.5 h-3.5" style={{ color: c.muted }} />
                                <input placeholder="Search Agency" value={agencyNameSearch} onChange={e => setAgencyNameSearch(e.target.value)}
                                  className="flex-1 outline-none text-[12px] bg-transparent normal-case tracking-normal" style={{ fontFamily: FONT, color: c.text }} />
                              </div>
                            </div>
                            <div className="py-1.5 max-h-[260px] overflow-y-auto">
                              {names.filter(n => !agencyNameSearch || n.toLowerCase().includes(agencyNameSearch.toLowerCase())).map(n => {
                                const checked = agencyNameFilter.has(n);
                                return (
                                  <label key={n} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors normal-case tracking-normal"
                                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                    onClick={() => toggleName(n)}>
                                    <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                                      style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                                      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                    </div>
                                    <span className="text-[12px] font-normal truncate" style={{ fontFamily: FONT, color: c.text }} title={n}>{n}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <button onClick={() => { setAgencyNameFilter(new Set()); setAgencyNameSearch(""); }}
                              className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors normal-case tracking-normal"
                              style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                              <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                            </button>
                          </div>
                        );
                      })()}
                    </>
                  ) : key === "location" ? (
                    <>
                      <button onClick={e => { e.stopPropagation(); setLocationOpen(o => !o); }}
                        className="flex items-center gap-1 select-none cursor-pointer text-[11px] font-bold uppercase tracking-wider"
                        style={{ fontFamily: FONT, color: locationFilter.size > 0 ? "#A614C3" : c.muted }}>
                        Location<ChevronDown className="w-3 h-3 ml-0.5" />
                      </button>
                      {locationOpen && (() => {
                        const states = Array.from(new Set(allAgencies.map(a => a.state).filter(Boolean))).sort();
                        const toggleState = (s: string) => setLocationFilter(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });
                        return (
                          <div className="absolute left-0 top-8 z-30 w-[240px] rounded-xl shadow-xl overflow-hidden normal-case tracking-normal"
                            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontWeight: 400, letterSpacing: "normal" }}
                            onClick={e => e.stopPropagation()}>
                            <div className="p-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" }}>
                                <Search className="w-3.5 h-3.5" style={{ color: c.muted }} />
                                <input placeholder="Search State" value={locationSearch} onChange={e => setLocationSearch(e.target.value)}
                                  className="flex-1 outline-none text-[12px] bg-transparent normal-case tracking-normal" style={{ fontFamily: FONT, color: c.text }} />
                              </div>
                            </div>
                            <div className="py-1.5 max-h-[260px] overflow-y-auto">
                              {states.filter(s => !locationSearch || s.toLowerCase().includes(locationSearch.toLowerCase())).map(s => {
                                const checked = locationFilter.has(s);
                                return (
                                  <label key={s} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors normal-case tracking-normal"
                                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                    onClick={() => toggleState(s)}>
                                    <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                                      style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                                      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                    </div>
                                    <span className="text-[12px] font-normal" style={{ fontFamily: FONT, color: c.text }}>{s}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <button onClick={() => { setLocationFilter(new Set()); setLocationSearch(""); }}
                              className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors normal-case tracking-normal"
                              style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                              <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                            </button>
                          </div>
                        );
                      })()}
                    </>
                  ) : affIdx !== null ? (
                    <>
                      <button onClick={e => { e.stopPropagation(); setAffiliationOpen(o => o === affIdx ? null : affIdx); setLocationOpen(false); }}
                        className="flex items-center gap-1 select-none cursor-pointer text-[11px] font-bold uppercase tracking-wider"
                        style={{ fontFamily: FONT, color: affiliationFilter.size > 0 ? "#A614C3" : c.muted }}>
                        {label}<ChevronDown className="w-3 h-3 ml-0.5" />
                      </button>
                      {affiliationOpen === affIdx && (() => {
                        const allAffs = Array.from(new Set(allAgencies.flatMap(a => a.affiliations))).sort();
                        const toggleAff = (a: string) => setAffiliationFilter(prev => { const n = new Set(prev); n.has(a) ? n.delete(a) : n.add(a); return n; });
                        return (
                          <div className="absolute left-0 top-8 z-30 w-[260px] rounded-xl shadow-xl overflow-hidden normal-case tracking-normal"
                            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontWeight: 400, letterSpacing: "normal" }}
                            onClick={e => e.stopPropagation()}>
                            <div className="p-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" }}>
                                <Search className="w-3.5 h-3.5" style={{ color: c.muted }} />
                                <input placeholder="Search Affiliation" value={affiliationSearch} onChange={e => setAffiliationSearch(e.target.value)}
                                  className="flex-1 outline-none text-[12px] bg-transparent normal-case tracking-normal" style={{ fontFamily: FONT, color: c.text }} />
                              </div>
                            </div>
                            <div className="py-1.5 max-h-[260px] overflow-y-auto">
                              {allAffs.filter(a => !affiliationSearch || a.toLowerCase().includes(affiliationSearch.toLowerCase())).map(a => {
                                const checked = affiliationFilter.has(a);
                                return (
                                  <label key={a} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors normal-case tracking-normal"
                                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                    onClick={() => toggleAff(a)}>
                                    <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                                      style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                                      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                    </div>
                                    <span className="text-[12px] font-normal truncate" style={{ fontFamily: FONT, color: c.text }} title={a}>{a}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <button onClick={() => { setAffiliationFilter(new Set()); setAffiliationSearch(""); }}
                              className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors normal-case tracking-normal"
                              style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                              <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                            </button>
                          </div>
                        );
                      })()}
                    </>
                  ) : (
                    <>{label}{sortable && key && <SortIcon col={key} />}</>
                  )}
                </th>
                );
              })}
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
                  <div className="flex items-center gap-9">
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
                {!agenciesHiddenCols.has("code") && (
                <td className="py-3 pr-6" style={{ paddingLeft: 20 }}>
                  <span className="text-[12px] font-semibold" style={{ fontFamily: FONT, color: isDark ? "#4ECDC4" : "#A614C3" }}>{a.code}</span>
                </td>
                )}
                {/* Location */}
                {!agenciesHiddenCols.has("location") && (
                <td className="py-3 pr-6 whitespace-nowrap" style={{ paddingLeft: 16 }}>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                    <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{a.city}, {a.state}</span>
                  </div>
                </td>
                )}
                {/* Affiliation 1 / 2 / 3 */}
                {[0, 1, 2].filter(i => !agenciesHiddenCols.has(`aff${i + 1}`)).map(i => (
                  <td key={`aff-${i}`} className="py-3 pr-6" style={{ paddingLeft: i === 0 ? 6 : 16 }}>
                    <span className="text-[13px] truncate block" style={{ fontFamily: FONT, color: a.affiliations[i] ? c.text : c.muted }}
                      title={a.affiliations[i] || ""}>
                      {a.affiliations[i] || "—"}
                    </span>
                  </td>
                ))}
                {/* Total User */}
                {!agenciesHiddenCols.has("totalUsers") && (
                <td className="py-3 pr-6 whitespace-nowrap text-center" style={{ paddingLeft: 25 }}>
                  <div className="inline-flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                    <span className="text-[13px] font-medium" style={{ fontFamily: FONT, color: c.text }}>{a.totalUsers}</span>
                  </div>
                </td>
                )}
                {/* Last Login */}
                {!agenciesHiddenCols.has("lastLogin") && (
                <td className="py-3 pr-6 whitespace-nowrap" style={{ paddingLeft: 76 }}>
                  <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{a.lastLogin}</span>
                </td>
                )}
                {/* Status */}
                {!agenciesHiddenCols.has("status") && (
                <td className="py-3 pr-6 text-center" style={{ paddingLeft: 25 }}><StatusBadge status={a.status} /></td>
                )}
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={9 - agenciesHiddenCols.size} className="py-16 text-center text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>
                  No agencies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      {/* Affiliations tab content — master/detail layout */}
      {tab === "affiliations" && (() => {
        const affMap = new Map<string, Agency[]>();
        for (const a of allAgencies) {
          for (const aff of a.affiliations) {
            if (!affMap.has(aff)) affMap.set(aff, []);
            affMap.get(aff)!.push(a);
          }
        }
        const q = search.trim().toLowerCase();
        const allAffRows = Array.from(affMap.entries())
          .map(([name, ags]) => ({ name, agencies: ags, count: ags.length }))
          .filter(r => !q || r.name.toLowerCase().includes(q) || r.agencies.some(a => a.name.toLowerCase().includes(q)))
          .sort((a, b) => a.name.localeCompare(b.name));
        // When user has multi-selected via the filter, narrow the list and (for 2+) show a combined view on the right.
        const affRows = affListFilter.size === 0 ? allAffRows : allAffRows.filter(r => affListFilter.has(r.name));
        const multiMode = affListFilter.size >= 2;
        const activeAff = !multiMode && selectedAff && affRows.find(r => r.name === selectedAff)
          ? selectedAff
          : (!multiMode ? (affRows[0]?.name ?? null) : null);
        const activeRow = activeAff ? affRows.find(r => r.name === activeAff) : null;
        const combinedAgencies = multiMode
          ? Array.from(new Map(affRows.flatMap(r => r.agencies).map(a => [a.id, a])).values())
              .sort((a, b) => a.name.localeCompare(b.name))
          : [];
        return (
          <div className="flex-1 flex min-h-0 mt-0 rounded-xl overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
            {/* LEFT: affiliation list */}
            <div className="flex flex-col flex-shrink-0" style={{ width: 280, borderRight: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "#FAFAFA" }}>
              <div className="px-4 py-2.5 flex items-center justify-between flex-shrink-0 relative" style={{ borderBottom: `1px solid ${c.border}` }} onClick={e => e.stopPropagation()}>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily: FONT, color: c.muted }}>Affiliations</span>
                <button onClick={() => setAffListFilterOpen(o => !o)}
                  title="Filter affiliations"
                  className="p-1 rounded transition-colors"
                  style={{ color: affListFilter.size > 0 ? "#A614C3" : c.muted }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <Filter className="w-3.5 h-3.5" />
                </button>
                {affListFilterOpen && (
                  <div className="absolute right-2 top-9 z-30 w-[260px] rounded-xl shadow-xl overflow-hidden normal-case tracking-normal"
                    style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
                    onClick={e => e.stopPropagation()}>
                    <div className="p-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" }}>
                        <Search className="w-3.5 h-3.5" style={{ color: c.muted }} />
                        <input placeholder="Search Affiliation" value={affListFilterSearch} onChange={e => setAffListFilterSearch(e.target.value)}
                          className="flex-1 outline-none text-[12px] bg-transparent normal-case tracking-normal" style={{ fontFamily: FONT, color: c.text }} />
                      </div>
                    </div>
                    <div className="py-1.5 max-h-[260px] overflow-y-auto">
                      {allAffRows
                        .filter(r => !affListFilterSearch || r.name.toLowerCase().includes(affListFilterSearch.toLowerCase()))
                        .map(r => {
                          const checked = affListFilter.has(r.name);
                          return (
                            <label key={r.name} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors normal-case tracking-normal"
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                              onClick={() => setAffListFilter(prev => { const s = new Set(prev); s.has(r.name) ? s.delete(r.name) : s.add(r.name); return s; })}>
                              <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                                style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                                {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                              <span className="text-[12px] font-normal truncate" style={{ fontFamily: FONT, color: c.text }} title={r.name}>{r.name}</span>
                              <span className="text-[10px] flex-shrink-0 ml-auto px-1.5 py-0.5 rounded-full"
                                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB", color: c.muted }}>{r.count}</span>
                            </label>
                          );
                        })}
                    </div>
                    <button onClick={() => { setAffListFilter(new Set()); setAffListFilterSearch(""); }}
                      className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors normal-case tracking-normal"
                      style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                      onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                {affRows.length === 0 && (
                  <p className="px-4 py-8 text-center text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>No matches</p>
                )}
                {affRows.map(r => {
                  const on = r.name === activeAff;
                  return (
                    <button key={r.name} onClick={() => setSelectedAff(r.name)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left transition-colors"
                      style={{ fontFamily: FONT,
                        background: on ? (isDark ? "rgba(168,85,247,0.10)" : "#fff") : "transparent",
                        borderLeft: on ? "3px solid #A855F7" : "3px solid transparent",
                        paddingLeft: on ? 13 : 16 }}
                      onMouseEnter={e => { if (!on) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "#F3F4F6"; }}
                      onMouseLeave={e => { if (!on) e.currentTarget.style.background = "transparent"; }}>
                      <span className="text-[13px] font-medium truncate"
                        style={{ color: on ? (isDark ? "#fff" : "#A614C3") : c.text }}>{r.name}</span>
                      <span className="text-[11px] font-semibold flex-shrink-0 px-1.5 py-0.5 rounded-full"
                        style={{ background: on ? "rgba(168,85,247,0.18)" : (isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB"),
                          color: on ? "#A855F7" : c.muted }}>{r.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* RIGHT: agencies in selected affiliation (single) OR union of selected affiliations (multi) */}
            <div className="flex-1 flex flex-col min-w-0">
              {!activeRow && !multiMode ? (
                <div className="flex-1 flex items-center justify-center text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>
                  Select an affiliation to see its agencies.
                </div>
              ) : (() => {
                const headerName = multiMode
                  ? Array.from(affListFilter).sort().join(" + ")
                  : activeRow!.name;
                const rowsToRender = multiMode ? combinedAgencies : activeRow!.agencies;
                const count = rowsToRender.length;
                return (
                <>
                  <div className="px-6 py-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}`, background: c.cardBg }}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Network className="w-4 h-4 flex-shrink-0" style={{ color: "#A855F7" }} />
                      <h3 className="text-[14px] font-bold truncate" style={{ fontFamily: FONT, color: c.text }} title={headerName}>{headerName}</h3>
                      <span className="text-[12px] flex-shrink-0" style={{ fontFamily: FONT, color: c.muted }}>· {count} {count === 1 ? "agency" : "agencies"}{multiMode ? ` across ${affListFilter.size} affiliations` : ""}</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto" style={{ scrollbarGutter: "stable" }}>
                    <table className="text-left border-collapse" style={{ minWidth: "100%" }}>
                      <thead className="sticky top-0 z-10" style={{ background: isDark ? "rgba(30,34,64,0.25)" : "rgba(255,255,255,0.25)", backdropFilter: "blur(6px)" }}>
                        <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                          <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 whitespace-nowrap"
                            style={{ fontFamily: FONT, color: c.muted, paddingLeft: 24 }}>Agency Name</th>
                          {AFFILIATIONS_COLS.filter(col => affVisibleCols.has(col.key)).map(col => (
                            <th key={col.key} className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 whitespace-nowrap"
                              style={{ fontFamily: FONT, color: c.muted, textAlign: col.key === "totalUsers" ? "center" : undefined }}>{col.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rowsToRender.map(a => {
                          const d = getDetail(a);
                          const renderCell = (key: string) => {
                            switch (key) {
                              case "code":       return <span className="text-[12px] font-semibold" style={{ fontFamily: FONT, color: isDark ? "#4ECDC4" : "#A614C3" }}>{a.code}</span>;
                              case "location":   return <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} /><span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{a.city || "—"}{a.state ? `, ${a.state}` : ""}</span></div>;
                              case "status":     return <StatusBadge status={a.status} />;
                              case "lastLogin":  return <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{a.lastLogin}</span>;
                              case "contact":    return <span className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{d.contact || "—"}</span>;
                              case "phone":      return <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{d.phone || "—"}</span>;
                              case "email":      return <span className="text-[13px] truncate block" style={{ fontFamily: FONT, color: c.muted }} title={d.contactEmail || ""}>{d.contactEmail || "—"}</span>;
                              case "totalUsers": return <div className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} /><span className="text-[13px] font-medium" style={{ fontFamily: FONT, color: c.text }}>{a.totalUsers}</span></div>;
                              default: return null;
                            }
                          };
                          return (
                            <tr key={a.id} className="cursor-pointer transition-colors"
                              style={{ borderBottom: `1px solid ${c.border}` }}
                              onClick={() => setSelectedAgency(getDetail(a))}
                              onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB")}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                              <td className="py-3 pr-6" style={{ paddingLeft: 24 }}>
                                <span className="text-[13px] font-semibold whitespace-nowrap" style={{ fontFamily: FONT, color: c.text }}>{a.name}</span>
                              </td>
                              {AFFILIATIONS_COLS.filter(col => affVisibleCols.has(col.key)).map(col => (
                                <td key={col.key} className="py-3 pr-6 whitespace-nowrap" style={{ textAlign: col.key === "totalUsers" ? "center" : undefined }}>{renderCell(col.key)}</td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
                );
              })()}
            </div>
          </div>
        );
      })()}

      {/* All Users tab content */}
      {tab === "users" && (() => {
        const teal = isDark ? "#A78BFA" : "#73C9B7";
        const q = search.trim().toLowerCase();
        const agencyById = new Map(allAgencies.map(a => [a.id, a]));
        const matchesQuery = (u: typeof mockAgencyUsers[number]) => !q
          || u.name.toLowerCase().includes(q)
          || u.email.toLowerCase().includes(q)
          || u.jobTitle.toLowerCase().includes(q)
          || (agencyById.get(u.agencyId)?.name.toLowerCase().includes(q) ?? false);
        const matchesJobFilter = (u: typeof mockAgencyUsers[number]) =>
          allUsersJobFilter.size === 0 || allUsersJobFilter.has(u.jobTitle);
        // Hide removed users entirely. Hide inactive users by default unless allUsersShowInactive is true.
        const userRowsAll = mockAgencyUsers
          .filter(u => !removedUserIds.has(u.id))
          .filter(u => allUsersShowInactive || !inactiveUserIds.has(u.id))
          .filter(matchesQuery)
          .filter(matchesJobFilter)
          .sort((a, b) => allUsersSortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        const userRows = userRowsAll.slice((page - 1) * perPage, page * perPage);
        // Count how many inactive users would match the same query/filters — used for both the
        // empty-state banner (orange, when 0 active) and the inline hint (subtle gray, when ≥1 active).
        const inactiveMatchCount = !allUsersShowInactive && q
          ? mockAgencyUsers.filter(u => !removedUserIds.has(u.id) && inactiveUserIds.has(u.id) && matchesQuery(u) && matchesJobFilter(u)).length
          : 0;
        const toggleJob = (t: string) => {
          setAllUsersJobFilter(prev => { const s = new Set(prev); s.has(t) ? s.delete(t) : s.add(t); return s; });
        };
        const sub = isDark ? "#6B7280" : "#9CA3AF";
        return (
          <div className="flex-1 overflow-auto mt-0" style={{ scrollbarGutter: "stable" }} onClick={() => { setAllUsersJobOpen(false); setViewOpen(false); }}>
            {/* Inline hint — shown only when active list has matches AND inactive also has matches.
                Empty-state (0 active) keeps the orange banner inside the table body. */}
            {inactiveMatchCount > 0 && userRowsAll.length > 0 && (
              <div className="px-[52px] py-2.5 flex items-center gap-2 text-[12px]"
                style={{ fontFamily: FONT, color: c.text, background: c.cardBg, borderBottom: `1px solid ${c.border}` }}>
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#A614C3" }} />
                <span>Showing {userRowsAll.length} active {userRowsAll.length === 1 ? "user" : "users"} · {inactiveMatchCount} inactive also {inactiveMatchCount === 1 ? "matches" : "match"}</span>
                <button onClick={() => setAllUsersShowInactive(true)}
                  className="font-semibold transition-colors ml-auto"
                  style={{ color: "#A614C3" }}>Show inactive</button>
              </div>
            )}
            <table className="w-full text-left border-collapse" style={{ tableLayout: "fixed" }}>
              <thead className="sticky top-0 z-10" style={{ background: isDark ? "rgba(30,34,64,0.25)" : "rgba(255,255,255,0.25)", backdropFilter: "blur(6px)" }}>
                <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                  {/* NAME (sortable) */}
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 cursor-pointer select-none whitespace-nowrap"
                    style={{ fontFamily: FONT, color: c.muted, width: "16%", paddingLeft: 52 }}
                    onClick={() => setAllUsersSortDir(d => d === "asc" ? "desc" : "asc")}>
                    Name
                    <span className="inline-flex items-center ml-1 flex-shrink-0" style={{ verticalAlign: "middle", gap: 1 }}>
                      <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                        <path d="M3.5 9V2M3.5 2L1.5 4M3.5 2L5.5 4" stroke={allUsersSortDir === "asc" ? c.text : sub} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                        <path d="M3.5 1V8M3.5 8L1.5 6M3.5 8L5.5 6" stroke={allUsersSortDir === "desc" ? c.text : sub} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </th>
                  {!usersHiddenCols.has("admin") && (
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap text-center"
                    style={{ fontFamily: FONT, color: c.muted, width: "10%", paddingRight: 50 }}>Admin</th>
                  )}
                  {/* JOB TITLE filter */}
                  {!usersHiddenCols.has("jobTitle") && (
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap relative"
                    style={{ fontFamily: FONT, color: allUsersJobFilter.size > 0 ? "#A614C3" : c.muted, width: "14%", paddingLeft: 55 }}>
                    <button onClick={e => { e.stopPropagation(); setAllUsersJobOpen(o => !o); }}
                      className="flex items-center gap-1 select-none cursor-pointer text-[11px] font-bold uppercase tracking-wider"
                      style={{ fontFamily: FONT, color: allUsersJobFilter.size > 0 ? "#A614C3" : c.muted }}>
                      Job Title<ChevronDown className="w-3 h-3 ml-0.5" />
                    </button>
                    {allUsersJobOpen && (
                      <div className="absolute left-0 top-8 z-30 w-[240px] rounded-xl shadow-xl overflow-hidden normal-case tracking-normal"
                        style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontWeight: 400, letterSpacing: "normal" }}
                        onClick={e => e.stopPropagation()}>
                        <div className="p-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" }}>
                            <Search className="w-3.5 h-3.5" style={{ color: c.muted }} />
                            <input placeholder="Search Title" value={allUsersJobSearch} onChange={e => setAllUsersJobSearch(e.target.value)}
                              className="flex-1 outline-none text-[12px] bg-transparent normal-case tracking-normal" style={{ fontFamily: FONT, color: c.text }} />
                          </div>
                        </div>
                        <div className="py-1.5 max-h-[260px] overflow-y-auto">
                          {ALL_JOB_TITLES.filter(t => !allUsersJobSearch || t.toLowerCase().includes(allUsersJobSearch.toLowerCase())).map(t => {
                            const checked = allUsersJobFilter.has(t);
                            return (
                              <label key={t} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors normal-case tracking-normal"
                                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                onClick={() => toggleJob(t)}>
                                <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                                  style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                                  {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </div>
                                <span className="text-[12px] font-normal" style={{ fontFamily: FONT, color: c.text }}>{t}</span>
                              </label>
                            );
                          })}
                        </div>
                        <button onClick={() => { setAllUsersJobFilter(new Set()); setAllUsersJobSearch(""); }}
                          className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors normal-case tracking-normal"
                          style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                          onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                        </button>
                      </div>
                    )}
                  </th>
                  )}
                  {!usersHiddenCols.has("email") && (
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap"
                    style={{ fontFamily: FONT, color: c.muted, width: "24%", paddingLeft: 72 }}>Email</th>
                  )}
                  {!usersHiddenCols.has("phone") && (
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap"
                    style={{ fontFamily: FONT, color: c.muted, width: "14%" }}>Phone</th>
                  )}
                  {!usersHiddenCols.has("ext") && (
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap text-center"
                    style={{ fontFamily: FONT, color: c.muted, width: "10%", paddingLeft: 0, paddingRight: 120 }}>Ext</th>
                  )}
                  {!usersHiddenCols.has("agency") && (
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap text-left"
                    style={{ fontFamily: FONT, color: c.muted, width: "12%" }}>Agency</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {userRows.length === 0 ? (
                  <tr>
                    <td colSpan={7 - usersHiddenCols.size} className="py-16 text-center" style={{ fontFamily: FONT }}>
                      <div className="flex flex-col items-center justify-center gap-3">
                        <span className="text-[13px]" style={{ color: c.muted }}>No users found</span>
                        {inactiveMatchCount > 0 && (
                          <button onClick={() => setAllUsersShowInactive(true)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                            style={{ background: "rgba(245,158,11,0.10)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.25)" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,158,11,0.16)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "rgba(245,158,11,0.10)")}>
                            {inactiveMatchCount} inactive {inactiveMatchCount === 1 ? "user" : "users"} also match — Show inactive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : userRows.map(u => {
                  const ag = agencyById.get(u.agencyId);
                  const isPrincipal = u.jobTitle === "Principal";
                  const isInactive = inactiveUserIds.has(u.id);
                  return (
                    <tr key={u.id} className="cursor-pointer transition-colors"
                      style={{ borderBottom: `1px solid ${c.border}`, opacity: isInactive ? 0.5 : 1 }}
                      onClick={() => ag && setSelectedAgency(getDetail(ag))}
                      onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td className="py-3 pr-6 relative" style={{ paddingLeft: 52 }}>
                        {isPrincipal && (
                          <div className="absolute" style={{ left: 0, top: 0, bottom: 0, width: 3, background: "#A614C3" }} />
                        )}
                        <span className="text-[13px] font-semibold whitespace-nowrap" style={{ fontFamily: FONT, color: c.text }}>{u.name}</span>
                      </td>
                      {!usersHiddenCols.has("admin") && (
                      <td className="py-3 text-center" style={{ paddingRight: 50 }}>
                        {u.isAdmin ? (
                          <GradientUserCog size={16} />
                        ) : (
                          <span className="text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>—</span>
                        )}
                      </td>
                      )}
                      {!usersHiddenCols.has("jobTitle") && (
                      <td className="py-3 pr-6 whitespace-nowrap" style={{ paddingLeft: 55 }}>
                        <span className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{u.jobTitle}</span>
                      </td>
                      )}
                      {!usersHiddenCols.has("email") && (
                      <td className="py-3 pr-6 truncate" style={{ paddingLeft: 72 }}>
                        <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{u.email}</span>
                      </td>
                      )}
                      {!usersHiddenCols.has("phone") && (
                      <td className="py-3 pr-6 whitespace-nowrap">
                        <span className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{u.phone}</span>
                      </td>
                      )}
                      {!usersHiddenCols.has("ext") && (
                      <td className="py-3 whitespace-nowrap text-center" style={{ paddingLeft: 0, paddingRight: 120 }}>
                        <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{u.ext || "—"}</span>
                      </td>
                      )}
                      {!usersHiddenCols.has("agency") && (
                      <td className="py-3 pr-6 truncate text-left">
                        <span className="text-[12px] font-semibold" style={{ fontFamily: FONT, color: isDark ? "#4ECDC4" : "#A614C3" }}>{ag?.name ?? "—"}</span>
                      </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })()}

      {/* Pagination — Agencies & All Users tabs */}
      {(tab === "agencies" || tab === "users") && (
      <div className="flex-shrink-0 flex items-center justify-between py-3 mt-auto"
        style={{ marginLeft: "-48px", marginRight: "-48px", marginBottom: "-48px", paddingLeft: "48px", paddingRight: "48px", paddingBottom: "16px", borderTop: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "#F9FAFB" }}>
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
      )}
    </div>
  );
}
