"use client";

import { useState } from "react";
import norbieface from "@/assets/norbieface.png";
import {
  Search, Plus, MoreVertical, Pencil, Building2, ChevronLeft, ChevronDown,
  Activity, FileText, ClipboardList, Shield, Star, Phone, Mail,
  Calendar, DollarSign, TrendingUp, FileStack, Upload, Download,
  MessageSquare, UserCircle, X, MapPin, Users, ChevronRight, RefreshCw,
  StickyNote, LayoutGrid, AlertTriangle, Trash2, FileArchive, FolderOpen, NotebookPen, CopyPlus, Video, Clock, Link, Bell, Paperclip,
} from "lucide-react";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Client {
  id: string; type: "Individual" | "Business";
  companyName?: string; dbaName?: string;
  firstName?: string; lastName?: string;
  contactFirstName?: string; contactLastName?: string;
  inspectionFirstName?: string; inspectionLastName?: string;
  email: string; phone: string;
  address: { street: string; city: string; state: string; zipCode: string };
  status: "Active" | "Inactive" | "Prospect";
  assignedAgent: string; agencyId: string;
  createdDate: string; lastActivity: string; isStarred?: boolean;
  totalPremium: number; activePolicies: number; pendingQuotes: number;
  notes?: string; tags?: string[]; industry?: string; website?: string;
  primaryClassCode?: string; federalId?: string; contractorLicense?: string;
  grossSales?: string; payroll?: string; owners?: string; employees?: string;
}
interface Quote { id: string; quoteId: string; policyType: string; status: "Pending"|"Approved"|"Declined"|"Expired"|"Sold/Issued"|"Incomplete"; createdDate: string; premium: number; clientId: string; applicant: string; dba?: string; effectiveDate?: string; lob: string; producer: string; }
interface Policy { id: string; policyNumber: string; policyType: string; status: "Active"|"Expired"|"Cancelled"|"Upcoming Renewal"; effectiveDate: string; expirationDate: string; premium: number; clientId: string; applicant: string; dba?: string; lob: string; producer: string; createdDate: string; }
interface Document { id: string; name: string; type: string; uploadDate: string; size: string; clientId: string; category: string; }
interface ActivityLog { id: string; action: string; description: string; timestamp: string; user: string; clientId: string; type: "policy"|"quote"|"document"|"email"|"call"|"note"; }
interface Note { id: string; content: string; author: string; timestamp: string; clientId: string; }

/* ─── Mock Data ──────────────────────────────────────────────────────────── */
const mockClients: Client[] = [
  { id:"1", type:"Business", companyName:"Tech Solutions Inc.", dbaName:"TechSol", contactFirstName:"David", contactLastName:"Chen", inspectionFirstName:"Lisa", inspectionLastName:"Wang", email:"contact@techsolutions.com", phone:"(555) 123-4567", address:{street:"123 Innovation Drive",city:"San Francisco",state:"CA",zipCode:"94105"}, status:"Active", assignedAgent:"Jane Smith", agencyId:"1", createdDate:"2024-01-15", lastActivity:"2024-04-10", isStarred:true, totalPremium:45000, activePolicies:3, pendingQuotes:1, industry:"Technology", website:"www.techsolutions.com", primaryClassCode:"8810 - Auto Repair Shops", federalId:"82-1234567", contractorLicense:"CA-789456", grossSales:"$12,500,000", payroll:"$3,200,000", owners:"2", employees:"85" },
  { id:"2", type:"Individual", firstName:"John", lastName:"Anderson", email:"john.anderson@email.com", phone:"(555) 234-5678", address:{street:"456 Oak Street",city:"Los Angeles",state:"CA",zipCode:"90001"}, status:"Active", assignedAgent:"Mike Chen", agencyId:"1", createdDate:"2024-02-20", lastActivity:"2024-04-08", isStarred:false, totalPremium:12000, activePolicies:2, pendingQuotes:0 },
  { id:"3", type:"Business", companyName:"Green Earth Logistics", dbaName:"GEL Transport", contactFirstName:"Tom", contactLastName:"Harris", inspectionFirstName:"Amy", inspectionLastName:"Lee", email:"info@greenearth.com", phone:"(555) 345-6789", address:{street:"789 Commerce Blvd",city:"Chicago",state:"IL",zipCode:"60601"}, status:"Prospect", assignedAgent:"Sarah Johnson", agencyId:"1", createdDate:"2024-03-10", lastActivity:"2024-04-12", isStarred:true, totalPremium:0, activePolicies:0, pendingQuotes:2, industry:"Logistics", website:"www.greenearthlogistics.com", primaryClassCode:"7219 - Trucking", federalId:"36-9876543", grossSales:"$8,750,000", payroll:"$2,100,000", owners:"3", employees:"120" },
  { id:"4", type:"Business", companyName:"Metro Construction LLC", dbaName:"MetroBuild", contactFirstName:"James", contactLastName:"Wilson", inspectionFirstName:"Robert", inspectionLastName:"Kim", email:"contact@metroconstruction.com", phone:"(555) 456-7890", address:{street:"321 Builder Lane",city:"New York",state:"NY",zipCode:"10001"}, status:"Active", assignedAgent:"Jane Smith", agencyId:"1", createdDate:"2023-11-05", lastActivity:"2024-04-11", isStarred:true, totalPremium:78000, activePolicies:5, pendingQuotes:0, industry:"Construction", website:"www.metroconstruction.com", primaryClassCode:"5403 - Carpentry", federalId:"13-5678901", contractorLicense:"NY-654321", grossSales:"$25,000,000", payroll:"$6,800,000", owners:"2", employees:"210" },
  { id:"5", type:"Individual", firstName:"Maria", lastName:"Rodriguez", email:"maria.r@email.com", phone:"(555) 567-8901", address:{street:"654 Palm Avenue",city:"Miami",state:"FL",zipCode:"33101"}, status:"Inactive", assignedAgent:"Mike Chen", agencyId:"1", createdDate:"2023-08-15", lastActivity:"2024-01-20", isStarred:false, totalPremium:8500, activePolicies:1, pendingQuotes:0 },
];
const mockQuotes: Quote[] = [
  { id:"1", quoteId:"QMWC123456789", policyType:"Commercial Auto", status:"Sold/Issued", createdDate:"2024-05-01", premium:15000, clientId:"1", applicant:"Jane Smith", dba:"TechSol", effectiveDate:"2024-01-01", lob:"Worker's Comp", producer:"Jane Smith" },
  { id:"2", quoteId:"QMWC111222333", policyType:"General Liability", status:"Declined", createdDate:"2024-01-01", premium:8000, clientId:"1", applicant:"Joe Smith", dba:"Tech Solutions Inc.", effectiveDate:"2024-06-15", lob:"General Liability", producer:"Joe Smith" },
  { id:"3", quoteId:"QMWC111222333", policyType:"Workers Compensation", status:"Incomplete", createdDate:"2024-06-15", premium:12000, clientId:"1", applicant:"Elvis Prestley", dba:"TechSol", effectiveDate:"2024-07-01", lob:"Vacant Risks", producer:"Elvis Prestley" },
  { id:"4", quoteId:"QMWC111222333", policyType:"Property Insurance", status:"Incomplete", createdDate:"2024-07-01", premium:9500, clientId:"1", applicant:"Elvis Prestley", dba:"TechSol", effectiveDate:"2024-07-01", lob:"Worker's Comp", producer:"Elvis Prestley" },
  { id:"5", quoteId:"QAA987654321-1", policyType:"Cyber Liability", status:"Incomplete", createdDate:"2024-07-01", premium:6200, clientId:"1", applicant:"Joe Smith", dba:"Tech Solutions Inc.", effectiveDate:"2024-07-01", lob:"General Liability", producer:"Joe Smith" },
  { id:"6", quoteId:"QAA987654321-1", policyType:"Umbrella", status:"Pending", createdDate:"2025-03-01", premium:4800, clientId:"1", applicant:"Elvis Prestley", dba:"TechSol", effectiveDate:"2025-03-01", lob:"Vacant Risks", producer:"Elvis Prestley" },
  { id:"7", quoteId:"Q-2024-015", policyType:"General Liability", status:"Approved", createdDate:"2024-04-05", premium:8000, clientId:"3", applicant:"Sarah Johnson", dba:"GEL Transport", effectiveDate:"2024-05-01", lob:"General Liability", producer:"Sarah Johnson" },
  { id:"8", quoteId:"Q-2024-016", policyType:"Workers Compensation", status:"Pending", createdDate:"2024-04-08", premium:12000, clientId:"3", applicant:"Sarah Johnson", dba:"GEL Transport", effectiveDate:"2024-06-01", lob:"Worker's Comp", producer:"Sarah Johnson" },
];
const mockPolicies: Policy[] = [
  { id:"1", policyNumber:"POL-2024-1001", policyType:"General Liability", status:"Active", effectiveDate:"2024-01-01", expirationDate:"2025-01-01", premium:15000, clientId:"1", applicant:"Jane Smith", dba:"TechSol", lob:"General Liability", producer:"Jane Smith", createdDate:"2024-01-01" },
  { id:"2", policyNumber:"POL-2024-1002", policyType:"Commercial Auto", status:"Active", effectiveDate:"2024-02-01", expirationDate:"2025-02-01", premium:18000, clientId:"1", applicant:"Joe Smith", dba:"Tech Solutions Inc.", lob:"Commercial Auto", producer:"Joe Smith", createdDate:"2024-02-01" },
  { id:"3", policyNumber:"POL-2024-1003", policyType:"Property Insurance", status:"Active", effectiveDate:"2024-01-15", expirationDate:"2025-01-15", premium:12000, clientId:"1", applicant:"Jane Smith", dba:"TechSol", lob:"Property", producer:"Jane Smith", createdDate:"2024-01-15" },
  { id:"4", policyNumber:"POL-2023-0856", policyType:"Auto Insurance", status:"Upcoming Renewal", effectiveDate:"2023-09-01", expirationDate:"2024-09-01", premium:7000, clientId:"2", applicant:"John Anderson", lob:"Auto Insurance", producer:"Mike Chen", createdDate:"2023-09-01" },
  { id:"5", policyNumber:"POL-2023-0857", policyType:"Homeowners", status:"Expired", effectiveDate:"2023-10-01", expirationDate:"2024-10-01", premium:5000, clientId:"2", applicant:"John Anderson", lob:"Homeowners", producer:"Mike Chen", createdDate:"2023-10-01" },
  { id:"6", policyNumber:"POL-2024-2201", policyType:"Workers Compensation", status:"Active", effectiveDate:"2024-03-01", expirationDate:"2025-03-01", premium:22000, clientId:"4", applicant:"Mike Chen", dba:"Metro LLC", lob:"Worker's Comp", producer:"Jane Smith", createdDate:"2024-03-01" },
];
const mockDocuments: Document[] = [
  { id:"1", name:"Certificate of Insurance", type:"PDF", uploadDate:"2024-04-05", size:"2.3 MB", clientId:"1", category:"Certificate" },
  { id:"2", name:"Policy Application - GL Coverage", type:"PDF", uploadDate:"2024-03-20", size:"1.8 MB", clientId:"1", category:"Application" },
  { id:"3", name:"Loss Run Report 2023", type:"PDF", uploadDate:"2024-02-15", size:"3.5 MB", clientId:"1", category:"Loss Run" },
  { id:"4", name:"Commercial Auto Schedule", type:"XLSX", uploadDate:"2024-02-10", size:"0.9 MB", clientId:"1", category:"Schedule" },
  { id:"5", name:"Signed Broker of Record Letter", type:"PDF", uploadDate:"2024-01-18", size:"0.4 MB", clientId:"1", category:"Authorization" },
  { id:"6", name:"W-9 Form", type:"PDF", uploadDate:"2024-01-15", size:"0.2 MB", clientId:"1", category:"Tax" },
];
const mockActivity: ActivityLog[] = [
  { id:"1",  action:"Policy Renewed",       description:"Policy POL-2024-1001 (General Liability) renewed for another year at $15,000 premium", timestamp:"2024-04-10 10:30 AM", user:"Jane Smith", clientId:"1", type:"policy" },
  { id:"2",  action:"Quote Requested",      description:"New quote requested for Commercial Auto coverage — $15,000 estimated premium", timestamp:"2024-04-10 09:15 AM", user:"System", clientId:"1", type:"quote" },
  { id:"3",  action:"Note Added",           description:"Called to discuss new policy options. Principal mentioned interest in expanding into commercial auto insurance.", timestamp:"2024-04-08 03:00 PM", user:"Jane Smith", clientId:"1", type:"note" },
  { id:"4",  action:"Email Sent",           description:"Sent quote summary and coverage comparison to contact@techsolutions.com", timestamp:"2024-04-07 11:45 AM", user:"Jane Smith", clientId:"1", type:"email" },
  { id:"5",  action:"Document Uploaded",    description:"Certificate of Insurance (2024) uploaded and shared with client portal", timestamp:"2024-04-05 02:45 PM", user:"Jane Smith", clientId:"1", type:"document" },
  { id:"6",  action:"Phone Call",           description:"30-min call — discussed Q2 coverage review, client wants to add Cyber Liability rider", timestamp:"2024-04-03 03:30 PM", user:"Jane Smith", clientId:"1", type:"call" },
  { id:"7",  action:"Renewal Reminder Sent","description":"Automated renewal reminder emailed for 3 policies expiring within 90 days", timestamp:"2024-04-03 11:00 AM", user:"System", clientId:"1", type:"email" },
  { id:"8",  action:"Quote Approved",       description:"General Liability quote QMWC111222333 approved and converted to policy — $8,000 premium", timestamp:"2024-03-28 01:15 PM", user:"Mike Chen", clientId:"1", type:"quote" },
  { id:"9",  action:"Meeting Scheduled",    description:"Quarterly coverage review meeting booked for Apr 15 at 2:00 PM via Zoom", timestamp:"2024-03-25 09:00 AM", user:"Jane Smith", clientId:"1", type:"call" },
  { id:"10", action:"Document Uploaded",    description:"Loss Run Report 2023 uploaded for underwriting review", timestamp:"2024-03-20 10:00 AM", user:"Jane Smith", clientId:"1", type:"document" },
  { id:"11", action:"Note Added",           description:"Client confirmed they are happy with current coverage. No changes requested for Property policy at this time.", timestamp:"2024-03-15 04:00 PM", user:"Mike Chen", clientId:"1", type:"note" },
  { id:"12", action:"Email Sent",           description:"Sent updated schedule of values for Property Insurance renewal to underwriter", timestamp:"2024-03-10 02:30 PM", user:"Jane Smith", clientId:"1", type:"email" },
  { id:"13", action:"Quote Declined",       description:"Commercial Umbrella quote declined — client opted to revisit in Q3", timestamp:"2024-03-05 11:00 AM", user:"System", clientId:"1", type:"quote" },
  { id:"14", action:"Policy Issued",        description:"Property Insurance policy POL-2024-1003 issued and bound at $12,000 annual premium", timestamp:"2024-01-15 09:00 AM", user:"System", clientId:"1", type:"policy" },
  { id:"15", action:"Phone Call",           description:"Onboarding call — reviewed all three policy applications and confirmed coverage requirements", timestamp:"2024-01-10 10:00 AM", user:"Jane Smith", clientId:"1", type:"call" },
  { id:"16", action:"Document Uploaded",    description:"Signed Broker of Record Letter uploaded and filed", timestamp:"2024-01-08 03:15 PM", user:"Jane Smith", clientId:"1", type:"document" },
  { id:"17", action:"Policy Issued",        description:"Commercial Auto policy POL-2024-1002 issued and bound at $18,000 annual premium", timestamp:"2024-02-01 09:00 AM", user:"System", clientId:"1", type:"policy" },
  { id:"18", action:"Email Sent",           description:"Welcome email sent with agent contact info and client portal login credentials", timestamp:"2024-01-06 08:30 AM", user:"System", clientId:"1", type:"email" },
  // Client 2 — John Anderson
  { id:"19", action:"Policy Renewed",       description:"Auto Insurance policy POL-2023-0856 renewed — $7,000 annual premium confirmed", timestamp:"2024-04-08 09:00 AM", user:"Mike Chen", clientId:"2", type:"policy" },
  { id:"20", action:"Email Sent",           description:"Homeowners policy expiration notice sent — expires 2024-10-01", timestamp:"2024-04-06 10:30 AM", user:"System", clientId:"2", type:"email" },
  { id:"21", action:"Phone Call",           description:"Discussed adding umbrella coverage on top of existing auto and homeowners policies", timestamp:"2024-03-20 02:00 PM", user:"Mike Chen", clientId:"2", type:"call" },
  { id:"22", action:"Note Added",           description:"Client prefers to be contacted by phone, not email. Follow up in May for homeowners renewal.", timestamp:"2024-03-18 04:30 PM", user:"Mike Chen", clientId:"2", type:"note" },
  { id:"23", action:"Document Uploaded",    description:"W-9 Form uploaded and verified for records", timestamp:"2024-02-28 11:00 AM", user:"Mike Chen", clientId:"2", type:"document" },
  // Client 3 — Green Earth Logistics
  { id:"24", action:"Quote Requested",      description:"General Liability quote Q-2024-015 requested — $8,000 estimated premium", timestamp:"2024-04-08 08:45 AM", user:"Sarah Johnson", clientId:"3", type:"quote" },
  { id:"25", action:"Quote Requested",      description:"Workers Compensation quote Q-2024-016 requested — $12,000 estimated premium", timestamp:"2024-04-08 08:50 AM", user:"Sarah Johnson", clientId:"3", type:"quote" },
  { id:"26", action:"Email Sent",           description:"Proposal package with two quote options sent to info@greenearth.com", timestamp:"2024-04-09 09:00 AM", user:"Sarah Johnson", clientId:"3", type:"email" },
  { id:"27", action:"Phone Call",           description:"Intro call — prospect confirmed interest in GL and Workers Comp bundle. Decision expected by April 20.", timestamp:"2024-04-05 03:00 PM", user:"Sarah Johnson", clientId:"3", type:"call" },
  { id:"28", action:"Note Added",           description:"Decision maker is the CFO. They want to compare against current carrier before committing. Strong potential.", timestamp:"2024-04-05 03:45 PM", user:"Sarah Johnson", clientId:"3", type:"note" },
  { id:"29", action:"Document Uploaded",    description:"Prospect intake form and ACORD application uploaded for underwriting review", timestamp:"2024-04-03 02:00 PM", user:"Sarah Johnson", clientId:"3", type:"document" },
  // Client 4 — Metro Construction LLC
  { id:"30", action:"Policy Renewed",       description:"Workers Compensation policy POL-2024-2201 renewed at $22,000 — 3rd consecutive renewal", timestamp:"2024-04-11 10:00 AM", user:"Jane Smith", clientId:"4", type:"policy" },
  { id:"31", action:"Phone Call",           description:"Annual coverage review — client expanding to 2 new job sites in NJ, needs updated liability limits", timestamp:"2024-04-09 02:30 PM", user:"Jane Smith", clientId:"4", type:"call" },
  { id:"32", action:"Note Added",           description:"Metro is expanding. Owner wants to discuss adding Commercial Umbrella and Equipment Floater in Q3.", timestamp:"2024-04-09 03:00 PM", user:"Jane Smith", clientId:"4", type:"note" },
  { id:"33", action:"Email Sent",           description:"Sent updated certificate of insurance to Metro's general contractor as requested", timestamp:"2024-04-07 11:00 AM", user:"Jane Smith", clientId:"4", type:"email" },
  { id:"34", action:"Document Uploaded",    description:"2024 payroll summary uploaded for WC audit — $4.2M total payroll reported", timestamp:"2024-04-02 09:30 AM", user:"Jane Smith", clientId:"4", type:"document" },
  { id:"35", action:"Quote Approved",       description:"Commercial Auto fleet quote approved — 12 vehicles, $31,000 annual premium", timestamp:"2024-03-15 01:00 PM", user:"Jane Smith", clientId:"4", type:"quote" },
  { id:"36", action:"Email Sent",           description:"Renewal reminder sent for 5 policies expiring within 60 days", timestamp:"2024-03-01 08:00 AM", user:"System", clientId:"4", type:"email" },
  { id:"37", action:"Policy Issued",        description:"General Liability policy issued and bound — $1M/$2M limits, $15,000 premium", timestamp:"2024-02-15 09:00 AM", user:"System", clientId:"4", type:"policy" },
  // Client 5 — Maria Rodriguez
  { id:"38", action:"Note Added",           description:"Client went inactive after job change. May resume coverage when new employer's benefits are confirmed.", timestamp:"2024-01-20 02:00 PM", user:"Mike Chen", clientId:"5", type:"note" },
  { id:"39", action:"Email Sent",           description:"Re-engagement email sent with updated plan options for individual coverage", timestamp:"2024-01-18 10:00 AM", user:"Mike Chen", clientId:"5", type:"email" },
  { id:"40", action:"Phone Call",           description:"Follow-up call — client confirmed she's reviewing options, will decide within 30 days", timestamp:"2024-01-15 03:30 PM", user:"Mike Chen", clientId:"5", type:"call" },
  { id:"41", action:"Policy Renewed",       description:"Auto Insurance policy renewed at $8,500 for one more year pending status review", timestamp:"2023-12-01 09:00 AM", user:"Mike Chen", clientId:"5", type:"policy" },
];
const mockNotes: Note[] = [
  { id:"1", content:"Called to discuss new policy options. Principal mentioned interest in expanding into commercial auto insurance. Follow up scheduled for next week.", author:"Sarah Johnson", timestamp:"2026-04-05T14:30:00", clientId:"1" },
  { id:"2", content:"Renewal documents sent via email. Waiting for signature on updated contract. Expected completion by end of week.", author:"Mike Chen", timestamp:"2026-04-03T10:15:00", clientId:"1" },
  { id:"3", content:"Outstanding performance this quarter — 25% increase in new policies. Discussed bonus structure for Q2.", author:"Sarah Johnson", timestamp:"2026-04-01T16:45:00", clientId:"1" },
  { id:"4", content:"Prospect meeting scheduled for next Tuesday at 2PM. Client is interested in Workers Comp and General Liability bundle.", author:"Jane Smith", timestamp:"2026-03-28T09:00:00", clientId:"3" },
];

type ViewType = "list" | "detail";
type DetailTab = "overview" | "policies" | "quotes" | "documents" | "activity" | "notes";
type FilterStatus = "All" | "Active" | "Inactive" | "Prospect" | "Starred" | "Business" | "Individual";
type SortKey = "name" | "status" | "lastActivity" | "activePolicies" | "assignedAgent" | "type" | null;
type SortDir = "asc" | "desc";

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function getClientName(c: Client) {
  return c.type === "Business" ? c.companyName || "Unnamed" : `${c.firstName} ${c.lastName}`;
}

/* ─── Tiny Dropdown ──────────────────────────────────────────────────────── */
function ActionMenu({ isDark, items, menuId, openMenuId, setOpenMenuId }: {
  isDark: boolean; items: string[];
  menuId: string; openMenuId: string | null; setOpenMenuId: (id: string | null) => void;
}) {
  const open = openMenuId === menuId;
  const bg = isDark ? "#1E2240" : "#fff";
  const border = isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB";
  const textColor = isDark ? "#F9FAFB" : "#374151";
  const hover = isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6";

  return (
    <div className="relative" style={{ fontFamily: FONT }}>
      <button
        onClick={e => { e.stopPropagation(); setOpenMenuId(open ? null : menuId); }}
        className="p-1.5 rounded-lg transition-colors"
        style={{ color: isDark ? "#8B8FA8" : "#9CA3AF" }}
        onMouseEnter={e => (e.currentTarget.style.background = hover)}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-50 rounded-xl py-1 shadow-lg min-w-[160px]"
          style={{ background: bg, border: `1px solid ${border}`, fontFamily: FONT }}
          onMouseDown={e => e.preventDefault()}>
          {items.map(item => (
            <button key={item} onClick={() => setOpenMenuId(null)}
              className="w-full text-left px-3.5 py-2 text-[12px] transition-colors"
              style={{ color: item.toLowerCase().includes("delete") ? "#EF4444" : textColor }}
              onMouseEnter={e => (e.currentTarget.style.background = hover)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Status Badge ───────────────────────────────────────────────────────── */
function StatusBadge({ status, isDark }: { status: string; isDark: boolean }) {
  const styles: Record<string, React.CSSProperties> = {
    Active:    { color: "#73C9B7", background: "rgba(115,201,183,0.10)" },
    Inactive:  { color: isDark ? "#8B8FA8" : "#9CA3AF", background: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6" },
    Prospect:  { background: "rgba(147,51,234,0.05)" },
    Pending:   { color: "#F59E0B", background: "rgba(245,158,11,0.08)" },
    Approved:  { color: "#73C9B7", background: "rgba(115,201,183,0.10)" },
    Declined:  { color: "#EF4444", background: "rgba(239,68,68,0.08)" },
    Cancelled: { color: "#EF4444", background: "rgba(239,68,68,0.08)" },
    Expired:   { color: isDark ? "#8B8FA8" : "#9CA3AF", background: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6" },
  };
  const s = styles[status] || { color: "#9CA3AF", background: "#F3F4F6" };
  if (status === "Prospect") {
    return (
      <span className="inline-flex items-center px-3 py-[3px] rounded-full text-[11px] font-semibold w-fit"
        style={{ fontFamily: FONT, background: "rgba(147,51,234,0.05)" }}>
        <span style={{ backgroundImage: "linear-gradient(135deg, #5C2ED4 0%, #A614C3 65%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{status}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-[3px] rounded-full text-[11px] font-semibold w-fit"
      style={{ fontFamily: FONT, ...s }}>{status}</span>
  );
}

/* ─── Add Client Modal ───────────────────────────────────────────────────── */
function AddClientModal({ isOpen, onClose, isDark }: { isOpen: boolean; onClose: () => void; isDark: boolean }) {
  const [clientType, setClientType] = useState<"Business" | "Individual">("Business");
  const [sameAddress, setSameAddress] = useState(false);
  if (!isOpen) return null;

  const bg      = isDark ? "#191D35" : "#F9FAFB";
  const cardBg  = isDark ? "rgba(255,255,255,0.04)" : "#fff";
  const text    = isDark ? "#F9FAFB" : "#1F2937";
  const muted   = isDark ? "#8B8FA8" : "#6B7280";
  const border  = isDark ? "rgba(255,255,255,0.08)" : "#E9EAEC";
  const inputBg = isDark ? "rgba(255,255,255,0.05)" : "#fff";
  const teal    = isDark ? "#A78BFA" : "#74C3B7";
  const tealBg  = isDark ? "linear-gradient(90deg,#5C2ED4 0%,#A614C3 100%)" : "linear-gradient(to bottom,#ACD697,#75C9B7)";

  const lblSty: React.CSSProperties = { fontFamily: FONT, fontSize: 12, fontWeight: 600, color: text, marginBottom: 5, display: "block" };
  const reqStar = <span style={{ color: "#EF4444", marginLeft: 1 }}>*</span>;
  const inpSty: React.CSSProperties = { fontFamily: FONT, background: inputBg, border: `1px solid ${border}`, color: text, width: "100%", padding: "9px 12px", borderRadius: 7, fontSize: 13, outline: "none" };
  const secCard: React.CSSProperties = { border: `1px solid ${border}`, borderRadius: 10, padding: "20px 20px 24px", background: cardBg };
  const secTitle: React.CSSProperties = { fontFamily: FONT, fontSize: 14, fontWeight: 700, color: text, marginBottom: 16 };

  const F = ({ label, placeholder, req, type = "text", cols = 1 }: { label: string; placeholder?: string; req?: boolean; type?: string; cols?: number }) => (
    <div style={cols > 1 ? { gridColumn: `span ${cols}` } : {}}>
      <label style={lblSty}>{label}{req && reqStar}</label>
      <input type={type} placeholder={placeholder} style={inpSty} className="outline-none w-full" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="w-[680px] max-h-[92vh] flex flex-col rounded-2xl shadow-2xl"
        style={{ background: bg, border: `1px solid ${border}`, fontFamily: FONT }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-start justify-between px-7 py-5 flex-shrink-0" style={{ borderBottom: `1px solid ${border}`, background: cardBg, borderRadius: "16px 16px 0 0" }}>
          <div>
            <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: text, marginBottom: 2 }}>Add New Client</h2>
            <p style={{ fontFamily: FONT, fontSize: 12, color: muted }}>Create a new client account</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg transition-colors mt-0.5" style={{ color: muted }}
            onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#E9EAEC")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          {/* Client Type */}
          <div>
            <label style={{ ...lblSty, marginBottom: 8 }}>Client Type{reqStar}</label>
            <div className="grid grid-cols-2 gap-3">
              {(["Business", "Individual"] as const).map(t => (
                <button key={t} onClick={() => setClientType(t)}
                  className="flex items-center justify-center gap-2 py-[10px] rounded-lg text-[13px] font-semibold transition-all"
                  style={clientType === t
                    ? { background: "#F0FAF9", border: `2px solid ${teal}`, color: teal, fontFamily: FONT }
                    : { background: cardBg, border: `1px solid ${border}`, color: text, fontFamily: FONT }}>
                  {t === "Business" ? <Building2 className="w-4 h-4" /> : <UserCircle className="w-4 h-4" />}
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* ── Account Information ── */}
          <div style={secCard}>
            <p style={secTitle}>Account Information</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <F label="Company Name"   placeholder="Enter company name" req />
              <F label="DBA Name or Operating Name" placeholder="Doing business as" />
              <F label="Contact First Name" placeholder="Enter first name" />
              <F label="Contact Last Name"  placeholder="Enter last name" />
              <F label="Inspection First Name" placeholder="Enter first name" />
              <F label="Inspection Last Name"  placeholder="Enter last name" />
              <F label="Email"           placeholder="email@example.com" type="email" req />
              <F label="Phone"           placeholder="(555) 123-4567" req />
              <F label="Website"         placeholder="www.example.com" />
              <F label="Primary Class Code" placeholder="(555) 123-4567" req />
              <div style={{ gridColumn: "span 2" }}>
                <label style={lblSty}>Description of Operations</label>
                <textarea rows={4} placeholder="Installation, maintenance, and repair of water, sewage, and drainage systems in residential and commercial properties..."
                  style={{ ...inpSty, resize: "none", height: "calc(100% - 22px)" }} className="outline-none w-full" />
              </div>
              <F label="Federal ID # (optional)" placeholder="ABC123456" req />
              <F label="Contractor License # (optional)" placeholder="987654321" />
              <F label="Gross Sales" placeholder="email@example.com" req />
              <F label="Payroll"     placeholder="(555) 123-4567" req />
              <F label="# Owners"    placeholder="email@example.com" />
              <F label="# Employees" placeholder="www.example.com" />
            </div>
          </div>

          {/* ── Physical Address ── */}
          <div style={secCard}>
            <p style={secTitle}>Physical Address</p>
            <div className="grid gap-y-4">
              <F label="Street Address" placeholder="123 Main Street" req />
              <div className="grid grid-cols-3 gap-x-4">
                <F label="City" placeholder="City" req />
                <F label="State" placeholder="" req />
                <F label="ZIP Code" placeholder="12345" req />
              </div>
            </div>
          </div>

          {/* ── Mailing Address ── */}
          <div style={secCard}>
            <p style={{ ...secTitle, marginBottom: 12 }}>Mailing Address</p>
            <label className="flex items-center gap-2 cursor-pointer select-none mb-4" style={{ fontFamily: FONT, fontSize: 12, color: "#6B7280" }}>
              <div onClick={() => setSameAddress(!sameAddress)}
                className="w-[16px] h-[16px] rounded flex items-center justify-center flex-shrink-0"
                style={{ background: sameAddress ? teal : "transparent", border: `1.5px solid ${sameAddress ? teal : border}` }}>
                {sameAddress && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              Same as Physical Address
            </label>
            <div className="grid gap-y-4">
              <F label="Street Address" placeholder="123 Main Street" />
              <div className="grid grid-cols-3 gap-x-4">
                <F label="City" placeholder="City" />
                <F label="State" placeholder="" />
                <F label="ZIP Code" placeholder="12345" />
              </div>
            </div>
          </div>

          {/* ── Additional Information ── */}
          <div style={secCard}>
            <p style={secTitle}>Additional Information</p>
            <div>
              <label style={lblSty}>Notes</label>
              <textarea rows={3} placeholder="Additional notes about this client..."
                style={{ ...inpSty, resize: "none" }} className="outline-none w-full" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-4 flex-shrink-0" style={{ borderTop: `1px solid ${border}`, background: cardBg, borderRadius: "0 0 16px 16px" }}>
          <button onClick={onClose}
            className="px-5 py-[8px] rounded-lg text-[12px] font-normal transition-colors"
            style={{ fontFamily: FONT, border: `1px solid #E5E7EB`, color: muted, background: "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(192,192,192,0.10), rgba(172,172,172,0.10))" }}>
            Cancel
          </button>
          <button className="px-5 py-[8px] rounded-lg text-[12px] font-semibold text-white"
            style={{ fontFamily: FONT, background: "linear-gradient(to bottom,#ACD697,#75C9B7)" }}>
            Create Client
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Clients({ isDark = false }: { isDark?: boolean }) {
  const [view, setView] = useState<ViewType>("list");
  const [selected, setSelected] = useState<Client | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [highlightFilter, setHighlightFilter] = useState<"pending-quotes" | "renewals" | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All");
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [stars, setStars] = useState<Set<string>>(new Set(mockClients.filter(c => c.isStarred).map(c => c.id)));
  const [detailSearch, setDetailSearch] = useState("");
  const [docDragOver, setDocDragOver] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [newNote, setNewNote] = useState("");
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<"all"|"policy"|"quote"|"document"|"email"|"call"|"note">("all");
  const [activityLogs, setActivityLogs] = useState(mockActivity);
  const [addActivityOpen, setAddActivityOpen] = useState(false);
  const [newActivityType, setNewActivityType] = useState<"policy"|"quote"|"document"|"email"|"call"|"note">("call");
  const [newActivityAction, setNewActivityAction] = useState("");
  const [newActivityDesc, setNewActivityDesc] = useState("");
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [createQuoteOpen, setCreateQuoteOpen] = useState(false);
  const [zoomTopic, setZoomTopic] = useState("");
  const [zoomDate, setZoomDate] = useState("");
  const [zoomTime, setZoomTime] = useState("14:00");
  const [zoomDuration, setZoomDuration] = useState("30");
  const [zoomNotes, setZoomNotes] = useState("");
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingAddr, setEditingAddr] = useState(false);
  const [editFields, setEditFields] = useState<Record<string, string>>({});

  /* Colours */
  const c = {
    text:        isDark ? "#F9FAFB" : "#1F2937",
    muted:       isDark ? "#8B8FA8" : "#6B7280",
    sub:         isDark ? "#6B7280" : "#9CA3AF",
    cardBg:      isDark ? "#191D35" : "#fff",
    border:      isDark ? "rgba(255,255,255,0.08)" : "#E9EAEC",
    borderStrong: isDark ? "rgba(255,255,255,0.18)" : "#D1D5DB",
    hoverBg:     isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
    mutedBg:     isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
    inputBg:     isDark ? "rgba(255,255,255,0.05)" : "#fff",
    primary:     "#A614C3",
    primaryBg:   "rgba(166,20,195,0.10)",
    teal:        isDark ? "#A78BFA" : "#74C3B7",
    accentGrad:  isDark ? "linear-gradient(90deg,#5C2ED4 0%,#A614C3 100%)" : "linear-gradient(to bottom,#ACD697,#75C9B7)",
    accentShadow: isDark ? "0 4px 14px rgba(92,46,212,0.4)" : "0 4px 10px rgba(116,195,183,0.35)",
  };

  const font = { fontFamily: FONT };

  /* Filter + search */
  const allClients = mockClients.map(cl => ({ ...cl, isStarred: stars.has(cl.id) }));
  const filtered = allClients.filter(cl => {
    if (filterStatus === "Starred") return cl.isStarred;
    if (filterStatus === "Business") return cl.type === "Business";
    if (filterStatus === "Individual") return cl.type === "Individual";
    if (filterStatus !== "All" && cl.status !== filterStatus) return false;
    if (search) {
      const name = getClientName(cl).toLowerCase();
      return name.includes(search.toLowerCase()) || cl.email.toLowerCase().includes(search.toLowerCase()) || cl.phone.includes(search);
    }
    return true;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...filtered].sort((a, b) => {
    // stars always first when no sort key
    if (!sortKey) {
      if (a.isStarred && !b.isStarred) return -1;
      if (!a.isStarred && b.isStarred) return 1;
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    }
    let valA: string | number = "";
    let valB: string | number = "";
    if (sortKey === "name") { valA = getClientName(a).toLowerCase(); valB = getClientName(b).toLowerCase(); }
    else if (sortKey === "status") { valA = a.status; valB = b.status; }
    else if (sortKey === "lastActivity") { valA = new Date(a.lastActivity).getTime(); valB = new Date(b.lastActivity).getTime(); }
    else if (sortKey === "activePolicies") { valA = a.activePolicies; valB = b.activePolicies; }
    else if (sortKey === "assignedAgent") { valA = a.assignedAgent.toLowerCase(); valB = b.assignedAgent.toLowerCase(); }
    else if (sortKey === "type") { valA = a.type; valB = b.type; }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const pageItems = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const starredClients = allClients.filter(cl => cl.isStarred);

  const toggleStar = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setStars(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const openDetail = (cl: Client) => {
    setSelected({ ...cl, isStarred: stars.has(cl.id) });
    setView("detail");
    setDetailTab("overview");
    setDetailSearch("");
  };

  /* Section title */
  const sectionTitle = <h1 className="text-[22px] font-semibold pb-4 mb-5"
    style={{ ...font, color: c.text, borderBottom: `1px solid ${c.border}` }}>Clients</h1>;

  /* Filter pill btn — image 2 style: rounded rect with border, no count */
  const filterPill = (label: FilterStatus) => {
    const active = filterStatus === label;
    return (
      <button key={label} onClick={() => { setFilterStatus(label); setPage(1); }}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-all"
        style={{
          fontFamily: FONT,
          background: active ? (isDark ? "rgba(255,255,255,0.10)" : "#F3F3F3") : "transparent",
          color: active ? c.text : c.muted,
          border: `1px solid ${active ? c.borderStrong : c.border}`,
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "#F5F5F5"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
        {label === "Starred" && <Star className="w-3.5 h-3.5" style={{ fill: "#F59E0B", color: "#F59E0B" }} />}
        {label}
      </button>
    );
  };

  /* Sort arrow icon — rounded up/down arrows */
  const SortIcon = ({ col }: { col: SortKey }) => {
    const active = sortKey === col;
    const upColor   = active && sortDir === "asc"  ? c.text : c.sub;
    const downColor = active && sortDir === "desc" ? c.text : c.sub;
    return (
      <span className="inline-flex items-center ml-1 flex-shrink-0" style={{ verticalAlign: "middle", gap: 1 }}>
        {/* Up arrow */}
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <path d="M3.5 9V2M3.5 2L1.5 4M3.5 2L5.5 4" stroke={upColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* Down arrow */}
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <path d="M3.5 1V8M3.5 8L1.5 6M3.5 8L5.5 6" stroke={downColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    );
  };

  /* Sortable table header cell */
  const th = (label: string, col?: SortKey) => (
    <button
      className="flex items-center gap-0.5 text-[11px] font-bold uppercase tracking-wider text-left w-full"
      style={{ fontFamily: FONT, color: c.muted, cursor: col ? "pointer" : "default", background: "none", border: "none", padding: 0 }}
      onClick={() => col && handleSort(col)}
    >
      {label}
      {col && <SortIcon col={col} />}
    </button>
  );

  /* Input style */
  const inputSty: React.CSSProperties = {
    fontFamily: FONT, background: c.inputBg, border: `1px solid ${c.border}`,
    color: c.text, padding: "8px 14px", borderRadius: 10, fontSize: 13, outline: "none",
  };

  /* ── DETAIL TAB BUTTON ── */
  const detailTabBtn = (tab: DetailTab, label: string, Icon: React.ComponentType<{ className?: string }>) => (
    <button onClick={() => { setDetailTab(tab); setDetailSearch(""); setHighlightFilter(null); }}
      className="flex items-center gap-1.5 px-4 py-3 text-[13px] font-normal relative transition-colors"
      style={{ fontFamily: FONT, color: detailTab === tab ? c.teal : c.muted, letterSpacing: "0.01em" }}>
      <Icon className="w-[15px] h-[15px]" />
      {label}
      {detailTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: c.teal }} />}
    </button>
  );

  /* ── DETAIL CLIENT DATA ── */
  const clientPolicies = selected ? mockPolicies.filter(p => p.clientId === selected.id && (!detailSearch || p.policyNumber.toLowerCase().includes(detailSearch.toLowerCase()) || p.policyType.toLowerCase().includes(detailSearch.toLowerCase()))) : [];
  const clientQuotes   = selected ? mockQuotes.filter(q => q.clientId === selected.id && (!detailSearch || q.quoteId.toLowerCase().includes(detailSearch.toLowerCase()) || q.policyType.toLowerCase().includes(detailSearch.toLowerCase()))) : [];
  const clientDocs     = selected ? mockDocuments.filter(d => d.clientId === selected.id && (!detailSearch || d.name.toLowerCase().includes(detailSearch.toLowerCase()))) : [];
  const clientActivity = selected ? activityLogs.filter(a => a.clientId === selected.id) : [];
  const clientNotes    = selected ? notes.filter(n => n.clientId === selected.id) : [];

  /* ══════════════════════ LIST VIEW ══════════════════════ */
  if (view === "list") return (
    <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: FONT }} onClick={() => setOpenMenuId(null)}>
      {/* Top section */}
      <div>
        {sectionTitle}

        {/* Search + Add */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex flex-1 max-w-[340px]" style={{ border: `1px solid ${c.border}`, borderRadius: 10, overflow: "hidden", background: c.inputBg }}>
            <input placeholder="Search clients..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 outline-none" style={{ fontFamily: FONT, background: "transparent", color: c.text, padding: "8px 14px", fontSize: 13, border: "none" }} />
            <button className="flex items-center gap-1.5 px-4 text-[12px] font-normal text-white flex-shrink-0"
              style={{ background: "linear-gradient(to bottom,#ACD697,#75C9B7)", fontFamily: FONT }}>
              <Search className="w-3.5 h-3.5" />Submit
            </button>
          </div>
          <button onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-[17px] py-[9px] rounded-lg text-[12px] font-normal text-white transition-all"
            style={{ fontFamily: FONT, background: "linear-gradient(to bottom,#ACD697,#75C9B7)" }}>
            <Plus className="w-4 h-4" />Add Client
          </button>
        </div>

        {/* Filter Pills — no divider line */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {filterPill("All")}
          {filterPill("Active")}
          {filterPill("Inactive")}
          {filterPill("Starred")}
          {filterPill("Business")}
          {filterPill("Individual")}
        </div>
      </div>

      {/* Starred Cards */}
      {starredClients.length > 0 && filterStatus !== "Starred" && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4" style={{ fill: "#F59E0B", color: "#F59E0B" }} />
            <span className="text-[13px] font-bold" style={{ fontFamily: FONT, color: c.text }}>
              Starred Clients <span style={{ color: c.muted, fontWeight: 400 }}>({starredClients.length} of {allClients.length})</span>
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {starredClients.map(cl => (
              <button key={cl.id} onClick={() => openDetail(cl)}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-left transition-all"
                style={{ background: c.cardBg, border: `1px solid ${c.border}`, width: 190, flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.20)" : "#D1D5DB"; e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "#F5F5F5"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.cardBg; }}>
                <Star className="w-4 h-4 flex-shrink-0" style={{ fill: "#F59E0B", color: "#F59E0B" }} />
                <div style={{ minWidth: 0 }}>
                  <div className="text-[13px] font-semibold truncate" style={{ fontFamily: FONT, color: c.text }}>{getClientName(cl)}</div>
                  <div className="text-[11px]" style={{ fontFamily: FONT, color: c.teal }}>{cl.type}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table — no outer card border, just row dividers */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="grid py-3" style={{
          gridTemplateColumns: "32px 2fr 1fr 1.8fr 1.3fr 1fr 0.7fr 1.1fr 80px",
          borderBottom: `1px solid ${c.border}`,
          background: isDark ? "rgba(255,255,255,0.02)" : "#FDFDFD",
          gap: "20px",
          padding: "12px 0",
        }}>
          <div />
          {th("Client Name", "name")}
          {th("Type", "type")}
          {th("Contact")}
          {th("Agent", "assignedAgent")}
          {th("Status", "status")}
          {th("Policies", "activePolicies")}
          {th("Last Activity", "lastActivity")}
          {th("Action")}
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto">
          {pageItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <Users className="w-8 h-8" style={{ color: c.sub }} />
              <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>No clients found</span>
            </div>
          ) : pageItems.map((cl, i) => (
            <div key={cl.id} onClick={() => openDetail(cl)}
              className="grid py-4 items-center cursor-pointer transition-colors"
              style={{ gridTemplateColumns: "32px 2fr 1fr 1.8fr 1.3fr 1fr 0.7fr 1.1fr 80px", gap: "20px", borderBottom: `1px solid ${c.border}`, padding: "18px 0" }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              {/* Star */}
              <button onClick={e => toggleStar(cl.id, e)} className="transition-colors">
                <Star className="w-4 h-4" style={{ fill: cl.isStarred ? "#F59E0B" : "none", color: cl.isStarred ? "#F59E0B" : c.sub }} />
              </button>
              {/* Name */}
              <div>
                <div className="text-[13px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>{getClientName(cl)}</div>
                {cl.dbaName && <div className="text-[11px]" style={{ fontFamily: FONT, color: c.muted }}>DBA: {cl.dbaName}</div>}
              </div>
              {/* Type */}
              <div className="text-[12px]" style={{ fontFamily: FONT, color: c.teal }}>
                {cl.type}
              </div>
              {/* Contact */}
              <div>
                <div className="text-[11px] mb-0.5 truncate" style={{ fontFamily: FONT, color: c.muted }}>{cl.email}</div>
                <div className="text-[11px]" style={{ fontFamily: FONT, color: c.muted }}>{cl.phone}</div>
              </div>
              {/* Agent */}
              <div className="text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>{cl.assignedAgent}</div>
              {/* Status */}
              <div><StatusBadge status={cl.status} isDark={isDark} /></div>
              {/* Policies */}
              <div className="text-[13px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>
                {cl.activePolicies}
                {cl.pendingQuotes > 0 && <span className="text-[11px] font-normal ml-1" style={{ color: c.muted }}>(+{cl.pendingQuotes})</span>}
              </div>
              {/* Last activity */}
              <div className="text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>{new Date(cl.lastActivity).toLocaleDateString()}</div>
              {/* Menu */}
              <div onClick={e => e.stopPropagation()}>
                <ActionMenu isDark={isDark} items={["Edit Client","New Quote","New Policy","Send Email"]} menuId={`client-${cl.id}`} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination — sticky at bottom */}
      <div className="flex-shrink-0 flex items-center justify-between py-3 mt-auto"
        style={{ marginLeft: "-48px", marginRight: "-48px", marginBottom: "-24px", paddingLeft: "48px", paddingRight: "48px", paddingBottom: "16px", borderTop: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "#F9FAFB" }}>
        {/* Per page */}
        <div className="flex items-center gap-2 text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>
          Show
          <div className="relative">
            <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
              className="appearance-none pr-7 pl-3 py-1.5 rounded-xl outline-none cursor-pointer"
              style={{ fontFamily: FONT, background: c.inputBg, border: `1px solid ${c.border}`, color: c.text, fontSize: 13 }}>
              <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: c.muted }} />
          </div>
          per page
        </div>
        {/* Pages */}
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30"
            style={{ color: c.muted }}
            onMouseEnter={e => { if (page > 1) e.currentTarget.style.background = c.hoverBg; }}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[12px] font-semibold transition-all"
              style={{ fontFamily: FONT, background: page === n ? c.teal : "transparent", color: page === n ? "#fff" : c.muted }}>
              {n}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30"
            style={{ color: c.muted }}
            onMouseEnter={e => { if (page < totalPages) e.currentTarget.style.background = c.hoverBg; }}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {/* Page label */}
        <div className="text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>
          Page {page} of {totalPages}
        </div>
      </div>

      <AddClientModal isOpen={modalOpen} onClose={() => setModalOpen(false)} isDark={isDark} />
    </div>
  );

  /* ══════════════════════ DETAIL VIEW ══════════════════════ */
  if (!selected) return null;
  const isStarred = stars.has(selected.id);

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: FONT }} onClick={() => setOpenMenuId(null)}>
      {/* Back + header */}
      <div className="pb-4 mb-5" style={{ borderBottom: `1px solid ${c.border}` }}>
        <button onClick={() => { setView("list"); setSelected(null); }}
          className="flex items-center gap-1.5 text-[12px] font-medium mb-3 transition-colors"
          style={{ fontFamily: FONT, color: c.muted }}
          onMouseEnter={e => (e.currentTarget.style.color = c.text)}
          onMouseLeave={e => (e.currentTarget.style.color = c.muted)}>
          <ChevronLeft className="w-4 h-4" />Back to Clients
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-start gap-3 mb-1">
              <button onClick={() => toggleStar(selected.id)} className="mt-1 flex-shrink-0">
                <Star className="w-5 h-5 transition-colors" style={{ fill: isStarred ? "#F59E0B" : "none", color: isStarred ? "#F59E0B" : c.sub }} />
              </button>
              <h1 className="text-[24px] font-bold" style={{ fontFamily: FONT, color: c.text }}>{getClientName(selected)}</h1>
              <StatusBadge status={selected.status} isDark={isDark} />
            </div>
            <p className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{selected.type} · Client ID: {selected.id}</p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { icon: <FileText className="w-3.5 h-3.5" />, label: "Create Quote" },
              { icon: <MessageSquare className="w-3.5 h-3.5" />, label: "Send Email" },
              { icon: <Video className="w-3.5 h-3.5" />, label: "Zoom Meeting" },
            ].map(({ icon, label }, i) => (
              <button key={label}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all text-white"
                style={{ fontFamily: FONT, background: i === 0 ? "linear-gradient(to bottom,#ACD697,#75C9B7)" : "transparent", border: i === 0 ? "none" : `1px solid ${c.border}`, color: i === 0 ? "#fff" : c.muted }}
                onMouseEnter={e => { if (i !== 0) e.currentTarget.style.borderColor = "rgba(116,195,183,0.5)"; }}
                onMouseLeave={e => { if (i !== 0) e.currentTarget.style.borderColor = c.border; }}
                onClick={() => {
                  if (label === "Zoom Meeting") { setZoomTopic(`Meeting with ${getClientName(selected)}`); setZoomDate(""); setZoomTime("14:00"); setZoomDuration("30"); setZoomNotes(""); setZoomModalOpen(true); }
                  if (label === "Create Quote") { setCreateQuoteOpen(true); }
                }}>
                {icon}{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Pending Quotes",    value: String(selected.pendingQuotes),  icon: <ClipboardList className="w-5 h-5" style={{ color: c.teal }} />, onClick: () => { setDetailTab("quotes");   setHighlightFilter("pending-quotes"); setDetailSearch(""); }, highlight: selected.pendingQuotes > 0  },
          { label: "Active Policies",   value: String(selected.activePolicies), icon: <Shield className="w-5 h-5" style={{ color: c.teal }} />,        onClick: () => { setDetailTab("policies"); setHighlightFilter(null);            setDetailSearch(""); }, highlight: false },
          { label: "Upcoming Renewals", value: String(selected.pendingQuotes),  icon: <Bell className="w-5 h-5" style={{ color: c.teal }} />,           onClick: () => { setDetailTab("policies"); setHighlightFilter("renewals");       setDetailSearch(""); }, highlight: selected.pendingQuotes > 0  },
          { label: "Primary Contact",   value: selected.assignedAgent,          icon: <UserCircle className="w-5 h-5" style={{ color: c.teal }} />,     onClick: () => { setDetailTab("overview"); setHighlightFilter(null);            setDetailSearch(""); document.getElementById("contact-info-section")?.scrollIntoView({ behavior: "smooth" }); }, highlight: false },
        ].map((card, i) => (
          <button key={i} onClick={card.onClick}
            className="rounded-xl p-4 text-left transition-all"
            style={{ background: c.cardBg, border: `1px solid ${card.highlight ? c.teal : c.border}`, cursor: "pointer", width: "100%" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(116,195,183,0.18)"; e.currentTarget.style.borderColor = c.teal; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = card.highlight ? c.teal : c.border; }}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg" style={{ background: "rgba(116,195,183,0.10)" }}>{card.icon}</div>
              {card.highlight && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>Action needed</span>}
            </div>
            <div className="text-[18px] font-bold mb-0.5" style={{ fontFamily: FONT, color: c.text }}>{card.value}</div>
            <div className="text-[11px]" style={{ fontFamily: FONT, color: c.muted }}>{card.label}</div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5" style={{ borderBottom: `1px solid ${c.border}` }}>
        {detailTabBtn("overview",   "Overview",   ClipboardList)}
        {detailTabBtn("quotes",     "Quotes",     FileText)}
        {detailTabBtn("policies",   "Policies",   Shield)}
        {detailTabBtn("documents",  "Documents",  FolderOpen)}
        {detailTabBtn("notes",      "Notes",      CopyPlus)}
        {detailTabBtn("activity",   "Activity",   Activity)}
      </div>

      {/* ── OVERVIEW ── */}
      {detailTab === "overview" && (() => {
        const inpSty: React.CSSProperties = { fontFamily: FONT, background: c.inputBg, border: `1px solid ${c.border}`, color: c.text, width: "100%", padding: "8px 12px", borderRadius: 7, fontSize: 13, outline: "none" };
        const lblSty: React.CSSProperties = { fontFamily: FONT, fontSize: 12, fontWeight: 600, color: c.muted, marginBottom: 4, display: "block" };
        const viewField = (label: string, value: string | undefined, tealColor?: boolean) => (
          <div>
            <div className="text-[12px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>{label}:</div>
            <div className="text-[13px]" style={{ fontFamily: FONT, color: tealColor ? c.teal : c.text }}>{value || "—"}</div>
          </div>
        );
        const editField = (label: string, key: string, placeholder?: string) => (
          <div>
            <label style={lblSty}>{label}:</label>
            <input value={editFields[key] || ""} onChange={e => setEditFields(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} style={inpSty} className="outline-none" />
          </div>
        );
        const editSelect = (label: string, key: string, options: string[]) => (
          <div style={{ position: "relative" }}>
            <label style={lblSty}>{label}:</label>
            <select value={editFields[key] || options[0]} onChange={e => setEditFields(f => ({ ...f, [key]: e.target.value }))} style={{ ...inpSty, appearance: "none" as const }} className="outline-none cursor-pointer">
              {options.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-3 w-3.5 h-3.5 pointer-events-none" style={{ color: c.muted, bottom: 10 }} />
          </div>
        );
        const startEditInfo = () => {
          setEditFields({
            companyName: selected.companyName || "", dbaName: selected.dbaName || "", agencyType: selected.type,
            contactName: selected.type === "Business" ? "" : `${selected.firstName || ""} ${selected.lastName || ""}`.trim(),
            inspectionName: "", email: selected.email, phone: selected.phone, websiteUrl: selected.website || "",
            primaryClassCode: "", federalId: "", contractorLicense: "",
            grossSales: "", payroll: "", owners: "", employees: "",
            firstName: selected.firstName || "", lastName: selected.lastName || "",
          });
          setEditingInfo(true);
        };
        const startEditAddr = () => {
          setEditFields(f => ({
            ...f, street: selected.address.street, city: selected.address.city, state: selected.address.state, zipCode: selected.address.zipCode,
            mailStreet: selected.address.street, mailCity: selected.address.city, mailState: selected.address.state, mailZip: selected.address.zipCode,
            sameAddr: "true",
          }));
          setEditingAddr(true);
        };

        return (
        <div className="space-y-4 overflow-y-auto flex-1">
          {/* Client Information */}
          <div id="contact-info-section" className="rounded-xl p-6" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold" style={{ fontFamily: FONT, color: c.text }}>Client Information</h3>
              {!editingInfo ? (
                <button onClick={startEditInfo} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                  style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.muted }}>
                  <Pencil className="w-3.5 h-3.5" />Edit
                </button>
              ) : (
                <button onClick={() => setEditingInfo(false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                  style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.muted }}>
                  <Pencil className="w-3.5 h-3.5" />Cancel Edit
                </button>
              )}
            </div>

            {!editingInfo ? (
              /* ── View Mode ── */
              <div className="grid gap-x-8 gap-y-5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {selected.type === "Business" ? (<>
                  {viewField("Company Name", selected.companyName)}
                  {viewField("DBA Name or Operating Name", selected.dbaName)}
                  {viewField("Agency Type", selected.type, true)}
                  {viewField("Contact Name", selected.contactFirstName && selected.contactLastName ? `${selected.contactFirstName} ${selected.contactLastName}` : undefined)}
                  {viewField("Inspection Name", selected.inspectionFirstName && selected.inspectionLastName ? `${selected.inspectionFirstName} ${selected.inspectionLastName}` : undefined)}
                  <div />
                </>) : (<>
                  {viewField("First Name", selected.firstName)}
                  {viewField("Last Name", selected.lastName)}
                  {viewField("Agency Type", selected.type, true)}
                  {viewField("Contact Name", selected.contactFirstName && selected.contactLastName ? `${selected.contactFirstName} ${selected.contactLastName}` : undefined)}
                  {viewField("Inspection Name", selected.inspectionFirstName && selected.inspectionLastName ? `${selected.inspectionFirstName} ${selected.inspectionLastName}` : undefined)}
                  <div />
                </>)}
                {viewField("Email", selected.email)}
                {viewField("Phone Number", selected.phone)}
                {viewField("Website Url", selected.website)}
                {viewField("Primary Class Code", selected.primaryClassCode)}
                {viewField("Federal ID # (optional)", selected.federalId)}
                {viewField("Contractor License # (optional)", selected.contractorLicense)}
                {viewField("Gross Sales", selected.grossSales)}
                {viewField("Payroll", selected.payroll)}
                {viewField("# Owners", selected.owners)}
                {viewField("# Employees", selected.employees)}
              </div>
            ) : (
              /* ── Edit Mode ── */
              <>
                <div className="grid gap-x-6 gap-y-5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                  {selected.type === "Business" ? (<>
                    {editField("Company Name", "companyName")}
                    {editField("DBA Name or Operating Name", "dbaName")}
                    {editSelect("Agency Type", "agencyType", ["Business", "Individual"])}
                    {editField("Contact Name", "contactName")}
                    {editField("Inspection Name", "inspectionName")}
                    <div />
                  </>) : (<>
                    {editField("First Name", "firstName")}
                    {editField("Last Name", "lastName")}
                    {editSelect("Agency Type", "agencyType", ["Business", "Individual"])}
                    {editField("Contact Name", "contactName")}
                    {editField("Inspection Name", "inspectionName")}
                    <div />
                  </>)}
                  {editField("Email", "email")}
                  {editField("Phone Number", "phone")}
                  {editField("Website Url", "websiteUrl")}
                  {editField("Primary Class Code", "primaryClassCode", "8810-Auto Repair Shops")}
                  {editField("Federal ID # (optional)", "federalId")}
                  {editField("Contractor License # (optional)", "contractorLicense")}
                  {editField("Gross Sales", "grossSales", "$1000")}
                  {editField("Payroll", "payroll", "$1000")}
                  {editField("# Owners", "owners", "3")}
                  {editField("# Employees", "employees", "$1000")}
                </div>
                <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: `1px solid ${c.border}` }}>
                  <button onClick={() => setEditingInfo(false)} className="px-4 py-[7px] rounded-lg text-[12px] font-normal"
                    style={{ fontFamily: FONT, border: `1px solid #E5E7EB`, color: c.muted, background: "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(192,192,192,0.10), rgba(172,172,172,0.10))" }}>Cancel</button>
                  <button onClick={() => setEditingInfo(false)} className="px-5 py-[7px] rounded-lg text-[12px] font-semibold text-white"
                    style={{ fontFamily: FONT, background: "linear-gradient(to bottom,#ACD697,#75C9B7)" }}>Save Changes</button>
                </div>
              </>
            )}
          </div>

          {/* Address Information */}
          <div className="rounded-xl p-6" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold" style={{ fontFamily: FONT, color: c.text }}>Address Information</h3>
              {!editingAddr ? (
                <button onClick={startEditAddr} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                  style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.muted }}>
                  <Pencil className="w-3.5 h-3.5" />Edit
                </button>
              ) : (
                <button onClick={() => setEditingAddr(false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                  style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.muted }}>
                  <Pencil className="w-3.5 h-3.5" />Cancel Edit
                </button>
              )}
            </div>

            {!editingAddr ? (
              /* ── View Mode ── */
              <div className="grid gap-x-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <div className="text-[12px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Physical Address:</div>
                  <div className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{selected.address.street}, {selected.address.city}, {selected.address.state}, {selected.address.zipCode}</div>
                </div>
                <div>
                  <div className="text-[12px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Mailing Address:</div>
                  <div className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>Same as Agency Address</div>
                </div>
              </div>
            ) : (
              /* ── Edit Mode ── */
              <>
                <div className="mb-5">
                  <div className="text-[12px] font-semibold mb-3" style={{ fontFamily: FONT, color: c.muted }}>Physical Address:</div>
                  <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 2fr" }}>
                    <div style={{ position: "relative" }}>
                      <select value={editFields.country || "United States of America"} onChange={e => setEditFields(f => ({ ...f, country: e.target.value }))}
                        style={{ ...inpSty, appearance: "none" as const }} className="outline-none cursor-pointer">
                        <option>United States of America</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: c.muted }} />
                    </div>
                    <input value={editFields.street || ""} onChange={e => setEditFields(f => ({ ...f, street: e.target.value }))} placeholder="Street Address" style={inpSty} className="outline-none" />
                  </div>
                  <div className="grid gap-3 mt-3" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                    <input value={editFields.city || ""} onChange={e => setEditFields(f => ({ ...f, city: e.target.value }))} placeholder="City" style={inpSty} className="outline-none" />
                    <div style={{ position: "relative" }}>
                      <select value={editFields.state || ""} onChange={e => setEditFields(f => ({ ...f, state: e.target.value }))}
                        style={{ ...inpSty, appearance: "none" as const }} className="outline-none cursor-pointer">
                        <option value="">State</option>
                        {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: c.muted }} />
                    </div>
                    <input value={editFields.zipCode || ""} onChange={e => setEditFields(f => ({ ...f, zipCode: e.target.value }))} placeholder="Zip Code" style={inpSty} className="outline-none" />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-[12px] font-semibold mb-2" style={{ fontFamily: FONT, color: c.muted }}>Mailing Address:</div>
                  <label className="flex items-center gap-2 mb-3 cursor-pointer select-none" style={{ fontFamily: FONT, fontSize: 12, color: c.text }}>
                    <div onClick={() => setEditFields(f => ({ ...f, sameAddr: f.sameAddr === "true" ? "false" : "true" }))}
                      className="w-[16px] h-[16px] rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: editFields.sameAddr === "true" ? "linear-gradient(to bottom,#ACD697,#75C9B7)" : c.inputBg, border: `1px solid ${editFields.sameAddr === "true" ? "#75C9B7" : c.border}` }}>
                      {editFields.sameAddr === "true" && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    Same as Agency Address
                  </label>
                  <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 2fr" }}>
                    <div style={{ position: "relative" }}>
                      <select value="United States of America" style={{ ...inpSty, appearance: "none" as const }} className="outline-none cursor-pointer">
                        <option>United States of America</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: c.muted }} />
                    </div>
                    <input value={editFields.sameAddr === "true" ? editFields.street || "" : editFields.mailStreet || ""} readOnly={editFields.sameAddr === "true"}
                      onChange={e => setEditFields(f => ({ ...f, mailStreet: e.target.value }))} placeholder="Street Address" style={{ ...inpSty, opacity: editFields.sameAddr === "true" ? 0.6 : 1 }} className="outline-none" />
                  </div>
                  <div className="grid gap-3 mt-3" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                    <input value={editFields.sameAddr === "true" ? editFields.city || "" : editFields.mailCity || ""} readOnly={editFields.sameAddr === "true"}
                      onChange={e => setEditFields(f => ({ ...f, mailCity: e.target.value }))} placeholder="City" style={{ ...inpSty, opacity: editFields.sameAddr === "true" ? 0.6 : 1 }} className="outline-none" />
                    <div style={{ position: "relative" }}>
                      <select value={editFields.sameAddr === "true" ? editFields.state || "" : editFields.mailState || ""}
                        onChange={e => setEditFields(f => ({ ...f, mailState: e.target.value }))} disabled={editFields.sameAddr === "true"}
                        style={{ ...inpSty, appearance: "none" as const, opacity: editFields.sameAddr === "true" ? 0.6 : 1 }} className="outline-none cursor-pointer">
                        <option value="">State</option>
                        {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: c.muted }} />
                    </div>
                    <input value={editFields.sameAddr === "true" ? editFields.zipCode || "" : editFields.mailZip || ""} readOnly={editFields.sameAddr === "true"}
                      onChange={e => setEditFields(f => ({ ...f, mailZip: e.target.value }))} placeholder="Zip Code" style={{ ...inpSty, opacity: editFields.sameAddr === "true" ? 0.6 : 1 }} className="outline-none" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${c.border}` }}>
                  <button onClick={() => setEditingAddr(false)} className="px-4 py-[7px] rounded-lg text-[12px] font-normal"
                    style={{ fontFamily: FONT, border: `1px solid #E5E7EB`, color: c.muted, background: "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(192,192,192,0.10), rgba(172,172,172,0.10))" }}>Cancel</button>
                  <button onClick={() => setEditingAddr(false)} className="px-5 py-[7px] rounded-lg text-[12px] font-semibold text-white"
                    style={{ fontFamily: FONT, background: "linear-gradient(to bottom,#ACD697,#75C9B7)" }}>Save Changes</button>
                </div>
              </>
            )}
          </div>
        </div>
        );
      })()}

      {/* ── POLICIES ── */}
      {detailTab === "policies" && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-stretch overflow-hidden" style={{ border: `1px solid ${c.border}`, borderRadius: 10 }}>
              <input placeholder="Search Policies" value={detailSearch} onChange={e => setDetailSearch(e.target.value)}
                className="outline-none px-4 py-2 text-[13px]"
                style={{ fontFamily: FONT, background: c.inputBg, color: c.text, width: 200, borderRadius: "10px 0 0 10px" }} />
              <button className="px-5 text-[12px] font-normal text-white flex-shrink-0"
                style={{ background: "linear-gradient(to bottom,#ACD697,#75C9B7)", fontFamily: FONT, borderRadius: "0 7px 7px 0" }}>Submit</button>
            </div>
            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-2 outline-none cursor-pointer"
                style={{ fontFamily: FONT, background: c.inputBg, border: `1px solid ${c.teal}`, color: "#5C5C5C", fontSize: 11, fontWeight: 500, borderRadius: 7 }}>
                <option>Past 20 Days</option><option>Past 60 Days</option><option>Past 90 Days</option><option>All Time</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: c.muted }} />
            </div>
            <div className="flex items-center gap-1 ml-1" style={{ borderLeft: `1px solid ${c.border}`, paddingLeft: 10 }}>
              <button className="p-2 rounded-lg transition-colors" style={{ color: c.teal }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <RefreshCw className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg transition-colors" style={{ color: c.teal }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <LayoutGrid className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg transition-colors" style={{ color: c.teal }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <Download className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden flex flex-col flex-1 min-h-0" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <div className="grid px-5 py-3 gap-4" style={{ gridTemplateColumns:"1.1fr 1.6fr 1.2fr 1fr 1.1fr 1.1fr 1.2fr 1.2fr", borderBottom:`1px solid ${c.border}`, background:c.mutedBg }}>
              {["Created","Submission ID","Applicant","DBA","Effective","LOB","Status","Producer"].map((h,i) => (
                <div key={i} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none"
                  style={{ fontFamily:FONT, color:c.muted }}>
                  {h}
                  {i !== 2 && i !== 3 && <span className="inline-flex gap-[1px] ml-0.5">
                    <svg width="6" height="9" viewBox="0 0 6 9" fill="none"><path d="M3 1L1 3.5H5L3 1Z" fill={c.sub}/><path d="M3 8L1 5.5H5L3 8Z" fill={c.sub}/></svg>
                  </span>}
                </div>
              ))}
            </div>
            <div className="overflow-y-auto flex-1">
              {clientPolicies.map((p,i,arr) => {
                const isRenewal = p.status === "Upcoming Renewal";
                const isHighlighted = highlightFilter === "renewals" && isRenewal;
                return (
                <div key={p.id} className="grid px-5 py-3.5 items-center gap-4 transition-colors cursor-pointer"
                  style={{ gridTemplateColumns:"1.1fr 1.6fr 1.2fr 1fr 1.1fr 1.1fr 1.2fr 1.2fr", borderBottom:i!==arr.length-1?`1px solid ${c.border}`:"none", background: isHighlighted ? "rgba(116,195,183,0.08)" : "transparent", borderLeft: isHighlighted ? "3px solid #74C3B7" : "3px solid transparent" }}
                  onMouseEnter={e=>(e.currentTarget.style.background=isHighlighted?"rgba(116,195,183,0.14)":c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background=isHighlighted?"rgba(116,195,183,0.08)":"transparent")}>
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{new Date(p.createdDate).toLocaleDateString()}</div>
                  <div className="text-[12px] font-semibold" style={{ fontFamily:FONT, color:c.teal }}>{p.policyNumber}</div>
                  <div className="text-[13px]" style={{ fontFamily:FONT, color:c.text }}>{p.applicant}</div>
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{p.dba || "—"}</div>
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{new Date(p.effectiveDate).toLocaleDateString()}</div>
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{p.lob}</div>
                  <StatusBadge status={p.status} isDark={isDark} />
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{p.producer}</div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── QUOTES ── */}
      {detailTab === "quotes" && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-stretch overflow-hidden" style={{ border: `1px solid ${c.border}`, borderRadius: 10 }}>
              <input placeholder="Search Quotes" value={detailSearch} onChange={e => setDetailSearch(e.target.value)}
                className="outline-none px-4 py-2 text-[13px]"
                style={{ fontFamily: FONT, background: c.inputBg, color: c.text, width: 200, borderRadius: "10px 0 0 10px" }} />
              <button className="px-5 text-[12px] font-normal text-white flex-shrink-0"
                style={{ background: "linear-gradient(to bottom,#ACD697,#75C9B7)", fontFamily: FONT, borderRadius: "0 7px 7px 0" }}>Submit</button>
            </div>
            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-2 outline-none cursor-pointer"
                style={{ fontFamily: FONT, background: c.inputBg, border: `1px solid ${c.teal}`, color: "#5C5C5C", fontSize: 11, fontWeight: 500, borderRadius: 7 }}>
                <option>Past 20 Days</option><option>Past 60 Days</option><option>Past 90 Days</option><option>All Time</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: c.muted }} />
            </div>
            <div className="flex items-center gap-1 ml-1" style={{ borderLeft: `1px solid ${c.border}`, paddingLeft: 10 }}>
              <button className="p-2 rounded-lg transition-colors" style={{ color: c.teal }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg transition-colors" style={{ color: c.teal }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg transition-colors" style={{ color: c.teal }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden flex flex-col flex-1 min-h-0" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <div className="grid px-5 py-3 gap-4" style={{ gridTemplateColumns:"1.1fr 1.6fr 1.2fr 1fr 1.1fr 1.1fr 1.2fr 1.2fr", borderBottom:`1px solid ${c.border}`, background:c.mutedBg }}>
              {["Created","Submission ID","Applicant","DBA","Effective","LOB","Status","Producer"].map((h,i) => (
                <div key={i} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none"
                  style={{ fontFamily:FONT, color:c.muted }}>
                  {h}
                  {i !== 2 && i !== 3 && <span className="inline-flex gap-[1px] ml-0.5">
                    <svg width="6" height="9" viewBox="0 0 6 9" fill="none"><path d="M3 1L1 3.5H5L3 1Z" fill={c.sub}/><path d="M3 8L1 5.5H5L3 8Z" fill={c.sub}/></svg>
                  </span>}
                </div>
              ))}
            </div>
            <div className="overflow-y-auto flex-1">
              {clientQuotes.map((q,i,arr) => {
                const isPending = q.status === "Pending";
                const isHighlighted = highlightFilter === "pending-quotes" && isPending;
                return (
                <div key={q.id} className="grid px-5 py-3.5 items-center gap-4 transition-colors cursor-pointer"
                  style={{ gridTemplateColumns:"1.1fr 1.6fr 1.2fr 1fr 1.1fr 1.1fr 1.2fr 1.2fr", borderBottom:i!==arr.length-1?`1px solid ${c.border}`:"none", background: isHighlighted ? "rgba(245,158,11,0.06)" : "transparent", borderLeft: isHighlighted ? "3px solid #F59E0B" : "3px solid transparent" }}
                  onMouseEnter={e=>(e.currentTarget.style.background=isHighlighted?"rgba(245,158,11,0.10)":c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background=isHighlighted?"rgba(245,158,11,0.06)":"transparent")}>
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{new Date(q.createdDate).toLocaleDateString()}</div>
                  <div className="text-[12px] font-semibold" style={{ fontFamily:FONT, color:c.teal }}>{q.quoteId}</div>
                  <div className="text-[13px]" style={{ fontFamily:FONT, color:c.text }}>{q.applicant}</div>
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{q.dba || "—"}</div>
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{q.effectiveDate ? new Date(q.effectiveDate).toLocaleDateString() : "—"}</div>
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{q.lob}</div>
                  <StatusBadge status={q.status} isDark={isDark} />
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{q.producer}</div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── DOCUMENTS ── */}
      {detailTab === "documents" && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex" style={{ border: `1px solid ${c.border}`, borderRadius: 10, overflow: "hidden", background: c.inputBg, width: 320 }}>
              <input placeholder="Search documents..." value={detailSearch} onChange={e => setDetailSearch(e.target.value)}
                className="flex-1 outline-none"
                style={{ fontFamily: FONT, background: "transparent", color: c.text, padding: "8px 14px", fontSize: 13, border: "none" }} />
              <button className="flex items-center gap-1.5 px-4 text-[12px] font-normal text-white flex-shrink-0"
                style={{ fontFamily: FONT, background: "linear-gradient(to bottom,#ACD697,#75C9B7)" }}>
                <Search className="w-3.5 h-3.5" />Submit
              </button>
            </div>
            <button className="flex items-center gap-2 px-[17px] py-[9px] rounded-lg text-[12px] font-normal text-white"
              style={{ fontFamily:FONT, background:"linear-gradient(to bottom,#ACD697,#75C9B7)" }}>
              <Upload className="w-4 h-4" />Upload Document
            </button>
          </div>
          <div className="rounded-xl overflow-hidden flex flex-col flex-1 min-h-0" style={{ background:c.cardBg, border:`1px solid ${c.border}` }}>
            <div className="grid px-5 py-3 gap-4" style={{ gridTemplateColumns:"2.5fr 1fr 1fr 1.5fr 1fr 40px", borderBottom:`1px solid ${c.border}`, background:c.mutedBg }}>
              {["Document Name","Category","Type","Upload Date","Size",""].map((h,i) => (
                <div key={i} className="text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily:FONT, color:c.muted }}>{h}</div>
              ))}
            </div>
            <div className="overflow-y-auto flex-1"
              onDragOver={e => { e.preventDefault(); setDocDragOver(true); }}
              onDragLeave={() => setDocDragOver(false)}
              onDrop={e => { e.preventDefault(); setDocDragOver(false); }}>
              {clientDocs.length === 0 && (
                <label className="flex flex-col items-center justify-center h-full min-h-[220px] cursor-pointer transition-colors"
                  style={{ background: docDragOver ? "rgba(116,195,183,0.06)" : "transparent" }}>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" multiple />
                  <Paperclip className="w-7 h-7 mb-3" style={{ color: "#74C3B7" }} />
                  <span className="text-[13px] font-medium" style={{ fontFamily: FONT, color: c.text }}>Drag &amp; Drop or Click to Browse</span>
                  <span className="text-[11px] mt-1" style={{ fontFamily: FONT, color: c.muted }}>PDF, JPG, PNG · Max 10MB</span>
                </label>
              )}
              {clientDocs.map((d,i,arr) => (
                <div key={d.id} className="grid px-5 py-3.5 items-center gap-4 transition-colors"
                  style={{ gridTemplateColumns:"2.5fr 1fr 1fr 1.5fr 1fr 40px", borderBottom:i!==arr.length-1?`1px solid ${c.border}`:"none" }}
                  onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: d.type === "PDF" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)" }}>
                      {d.type === "PDF"
                        ? <FileText className="w-4 h-4" style={{ color: "#EF4444" }} />
                        : <FileArchive className="w-4 h-4" style={{ color: "#22C55E" }} />}
                    </div>
                    <span className="text-[13px] font-medium" style={{ fontFamily:FONT, color:c.text }}>{d.name}</span>
                  </div>
                  <div className="text-[12px] px-2 py-0.5 rounded-lg" style={{ fontFamily:FONT, color:c.teal, background:"rgba(116,195,183,0.10)", display:"inline-block", width:"fit-content" }}>{d.category}</div>
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{d.type}</div>
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{new Date(d.uploadDate).toLocaleDateString()}</div>
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{d.size}</div>
                  <ActionMenu isDark={isDark} items={["Download","View","Delete"]} menuId={`doc-${d.id}`} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ACTIVITY ── */}
      {detailTab === "activity" && (() => {
        // Icons matching the tab icons exactly
        const iconMap: Record<string, React.ReactNode> = {
          policy:   <Shield className="w-3.5 h-3.5" style={{ color:"#74C3B7" }} />,
          quote:    <FileText className="w-3.5 h-3.5" style={{ color:"#A78BFA" }} />,
          document: <FolderOpen className="w-3.5 h-3.5" style={{ color:"#60A5FA" }} />,
          email:    <Mail className="w-3.5 h-3.5" style={{ color:"#F59E0B" }} />,
          call:     <Phone className="w-3.5 h-3.5" style={{ color:"#34D399" }} />,
          note:     <CopyPlus className="w-3.5 h-3.5" style={{ color:"#F97316" }} />,
        };
        const bgMap: Record<string, string> = {
          policy:"rgba(116,195,183,0.12)", quote:"rgba(167,139,250,0.12)",
          document:"rgba(96,165,250,0.12)", email:"rgba(245,158,11,0.12)",
          call:"rgba(52,211,153,0.12)", note:"rgba(249,115,22,0.12)",
        };
        const colorMap: Record<string, string> = {
          all: c.teal, policy:"#74C3B7", quote:"#A78BFA",
          document:"#60A5FA", email:"#F59E0B", call:"#34D399", note:"#F97316",
        };
        const labelMap: Record<string, string> = {
          all:"All", policy:"Policy", quote:"Quote",
          document:"Document", email:"Email", call:"Call", note:"Note",
        };
        const filteredActivity = activityFilter === "all"
          ? clientActivity
          : clientActivity.filter(a => a.type === activityFilter);
        return (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Filter pills + Add button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {(["all","policy","quote","document","email","call","note"] as const).map(f => {
                  const active = activityFilter === f;
                  const count = f === "all" ? clientActivity.length : clientActivity.filter(a => a.type === f).length;
                  return (
                    <button key={f} onClick={() => setActivityFilter(f)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-normal transition-all"
                      style={{
                        fontFamily: FONT,
                        background: active ? `${colorMap[f]}15` : c.mutedBg,
                        border: `1px solid ${active ? colorMap[f] : c.border}`,
                        color: active ? colorMap[f] : c.muted,
                      }}>
                      {f !== "all" && iconMap[f]}
                      {labelMap[f]}
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full ml-0.5"
                        style={{ background: active ? `${colorMap[f]}20` : isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB", color: active ? colorMap[f] : c.sub }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setAddActivityOpen(true)}
                className="flex items-center gap-2 px-[17px] py-[9px] rounded-lg text-[12px] font-normal text-white flex-shrink-0"
                style={{ fontFamily: FONT, background: "linear-gradient(to bottom,#ACD697,#75C9B7)" }}>
                <Plus className="w-3.5 h-3.5" />Add Activity
              </button>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto rounded-xl p-5" style={{ background:c.cardBg, border:`1px solid ${c.border}` }}>
              {filteredActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 gap-2">
                  <Activity className="w-8 h-8" style={{ color:c.sub }} />
                  <span className="text-[13px]" style={{ fontFamily:FONT, color:c.muted }}>No activity found</span>
                </div>
              ) : filteredActivity.map((a,i) => (
                <div key={a.id} className="flex gap-4">
                  <div className="flex flex-col items-center pt-0.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: bgMap[a.type] || "rgba(116,195,183,0.12)" }}>
                      {iconMap[a.type]}
                    </div>
                    {i !== filteredActivity.length-1 && <div className="w-px flex-1 my-2" style={{ background:c.border }} />}
                  </div>
                  <div className="flex-1 pb-5">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-[13px] font-semibold" style={{ fontFamily:FONT, color:c.text }}>{a.action}</h4>
                      <span className="text-[11px] flex-shrink-0 ml-4" style={{ fontFamily:FONT, color:c.muted }}>{a.timestamp}</span>
                    </div>
                    <p className="text-[12px] mb-1" style={{ fontFamily:FONT, color:c.muted }}>{a.description}</p>
                    <p className="text-[11px]" style={{ fontFamily:FONT, color:c.sub }}>by {a.user}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Activity Modal */}
            {addActivityOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background:"rgba(0,0,0,0.4)" }}
                onClick={() => setAddActivityOpen(false)}>
                <div className="w-[480px] rounded-2xl shadow-2xl p-6" style={{ background:c.cardBg, border:`1px solid ${c.border}` }}
                  onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[16px] font-bold" style={{ fontFamily:FONT, color:c.text }}>Add Activity</h3>
                    <button onClick={() => setAddActivityOpen(false)} style={{ color:c.muted }}><X className="w-4 h-4" /></button>
                  </div>
                  {/* Type selector */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(["call","email","note","policy","quote","document"] as const).map(t => {
                      const active = newActivityType === t;
                      return (
                        <button key={t} onClick={() => setNewActivityType(t)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-normal transition-all capitalize"
                          style={{
                            fontFamily: FONT,
                            background: active ? `${colorMap[t]}15` : c.mutedBg,
                            border: `1px solid ${active ? colorMap[t] : c.border}`,
                            color: active ? colorMap[t] : c.muted,
                          }}>
                          {iconMap[t]}{labelMap[t]}
                        </button>
                      );
                    })}
                  </div>
                  {/* Action title */}
                  <div className="mb-3">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ fontFamily:FONT, color:c.muted }}>Title</label>
                    <input value={newActivityAction} onChange={e => setNewActivityAction(e.target.value)}
                      placeholder="e.g. Phone call with client"
                      className="w-full outline-none rounded-xl px-3 py-2.5 text-[13px]"
                      style={{ fontFamily:FONT, background:c.inputBg, border:`1px solid ${c.border}`, color:c.text }} />
                  </div>
                  {/* Description */}
                  <div className="mb-5">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ fontFamily:FONT, color:c.muted }}>Description</label>
                    <textarea value={newActivityDesc} onChange={e => setNewActivityDesc(e.target.value)}
                      placeholder="Describe what happened..."
                      rows={3}
                      className="w-full outline-none resize-none rounded-xl px-3 py-2.5 text-[13px]"
                      style={{ fontFamily:FONT, background:c.inputBg, border:`1px solid ${c.border}`, color:c.text }} />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setAddActivityOpen(false)}
                      className="px-[17px] py-[9px] rounded-lg text-[12px] font-normal transition-colors"
                      style={{ fontFamily:FONT, border:`1px solid #E5E7EB`, color:c.muted, background:"linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(192,192,192,0.10), rgba(172,172,172,0.10))" }}>Cancel</button>
                    <button onClick={() => {
                      if (!newActivityAction.trim() || !selected) return;
                      const now = new Date();
                      const ts = `${now.toLocaleDateString()} ${now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}`;
                      const entry: ActivityLog = {
                        id: Date.now().toString(),
                        action: newActivityAction.trim(),
                        description: newActivityDesc.trim() || "",
                        timestamp: ts,
                        user: "Jane Smith",
                        clientId: selected.id,
                        type: newActivityType,
                      };
                      setActivityLogs(prev => [entry, ...prev]);
                      setNewActivityAction(""); setNewActivityDesc(""); setAddActivityOpen(false);
                    }}
                      className="px-[17px] py-[9px] rounded-lg text-[12px] font-normal text-white"
                      style={{ fontFamily:FONT, background:"linear-gradient(to bottom,#ACD697,#75C9B7)" }}>
                      Add Activity
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── NOTES ── */}
      {detailTab === "notes" && (
        <div className="flex flex-col flex-1 min-h-0 gap-4 overflow-y-auto">
          {/* Add Note */}
          <div className="rounded-xl p-5" style={{ background:c.cardBg, border:`1px solid ${c.border}` }}>
            <h3 className="text-[15px] font-bold mb-3" style={{ fontFamily:FONT, color:c.text }}>Add New Note</h3>
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Write your note here..."
              rows={4}
              className="w-full outline-none resize-none rounded-xl p-3 text-[13px]"
              style={{ fontFamily:FONT, background:c.inputBg, border:`1px solid ${c.border}`, color:c.text }}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={() => {
                  if (!newNote.trim() || !selected) return;
                  const n: Note = { id: Date.now().toString(), content: newNote.trim(), author: "Sarah Johnson", timestamp: new Date().toISOString(), clientId: selected.id };
                  setNotes(prev => [n, ...prev]);
                  setNewNote("");
                }}
                className="flex items-center gap-2 px-[17px] py-[9px] rounded-lg text-[12px] font-normal text-white"
                style={{ fontFamily:FONT, background:"linear-gradient(to bottom,#ACD697,#75C9B7)" }}>
                <Plus className="w-4 h-4" />Add Note
              </button>
            </div>
          </div>

          {/* Notes History */}
          {clientNotes.length > 0 && (
            <div>
              <h3 className="text-[14px] font-bold mb-3" style={{ fontFamily:FONT, color:c.text }}>Notes History</h3>
              <div className="flex flex-col gap-3">
                {clientNotes.map(n => (
                  <div key={n.id} className="rounded-xl p-4" style={{ background:c.cardBg, border:`1px solid ${c.border}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                          style={{ background:"linear-gradient(to bottom,#ACD697,#75C9B7)" }}>
                          {n.author.charAt(0)}
                        </div>
                        <span className="text-[13px] font-semibold" style={{ fontFamily:FONT, color:c.text }}>{n.author}</span>
                        <span className="text-[11px]" style={{ fontFamily:FONT, color:c.muted }}>·</span>
                        <span className="text-[11px]" style={{ fontFamily:FONT, color:c.muted }}>
                          {new Date(n.timestamp).toLocaleDateString("en-US",{month:"numeric",day:"numeric",year:"numeric"})} at {new Date(n.timestamp).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                        </span>
                      </div>
                      <button onClick={() => setDeleteNoteId(n.id)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color:"#EF4444" }}
                        onMouseEnter={e=>(e.currentTarget.style.background="rgba(239,68,68,0.08)")}
                        onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ fontFamily:FONT, color:c.muted }}>{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── DELETE NOTE CONFIRM ── */}
      {deleteNoteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background:"rgba(0,0,0,0.4)" }}
          onClick={() => setDeleteNoteId(null)}>
          <div className="rounded-2xl p-6 w-[400px] shadow-2xl" style={{ background:c.cardBg }} onClick={e=>e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:"rgba(239,68,68,0.10)" }}>
                <AlertTriangle className="w-6 h-6" style={{ color:"#EF4444" }} />
              </div>
              <div>
                <h3 className="text-[17px] font-bold mb-1" style={{ fontFamily:FONT, color:c.text }}>Delete Note</h3>
                <p className="text-[13px] leading-relaxed" style={{ fontFamily:FONT, color:c.muted }}>Are you sure you want to delete this note? This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteNoteId(null)}
                className="px-[17px] py-[9px] rounded-lg text-[12px] font-normal transition-colors"
                style={{ fontFamily:FONT, border:`1px solid #E5E7EB`, color:c.muted, background:"linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(192,192,192,0.10), rgba(172,172,172,0.10))" }}>
                Cancel
              </button>
              <button onClick={() => { setNotes(prev => prev.filter(n => n.id !== deleteNoteId)); setDeleteNoteId(null); }}
                className="px-[17px] py-[9px] rounded-lg text-[12px] font-normal text-white"
                style={{ fontFamily:FONT, background:"#EF4444" }}>
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}

      <AddClientModal isOpen={modalOpen} onClose={() => setModalOpen(false)} isDark={isDark} />

      {/* ── Zoom Meeting Modal ── */}
      {zoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setZoomModalOpen(false)}>
          <div className="w-[520px] rounded-2xl shadow-2xl" style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between px-7 py-5 rounded-t-2xl" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(243,244,246,0.30)", borderBottom: `1px solid ${c.border}` }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: "rgba(116,195,183,0.12)" }}>
                  <Video className="w-5 h-5" style={{ color: c.teal }} />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold" style={{ fontFamily: FONT, color: c.text }}>Schedule Zoom Meeting</h2>
                  <p className="text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>Set up a video call with {selected ? getClientName(selected) : "client"}</p>
                </div>
              </div>
              <button onClick={() => setZoomModalOpen(false)} className="p-1 rounded-lg transition-colors" style={{ color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-7 py-6 space-y-5">
              {/* Topic */}
              <div>
                <label className="text-[12px] font-medium block mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Meeting Topic</label>
                <input value={zoomTopic} onChange={e => setZoomTopic(e.target.value)} placeholder="e.g. Quarterly coverage review"
                  className="outline-none w-full" style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text, padding: "9px 12px", borderRadius: 7, fontSize: 13 }} />
              </div>

              {/* Date + Time + Duration row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[12px] font-medium block mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Date</span>
                  </label>
                  <input type="date" value={zoomDate} onChange={e => setZoomDate(e.target.value)}
                    className="outline-none w-full" style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text, padding: "9px 12px", borderRadius: 7, fontSize: 13 }} />
                </div>
                <div>
                  <label className="text-[12px] font-medium block mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Time</span>
                  </label>
                  <input type="time" value={zoomTime} onChange={e => setZoomTime(e.target.value)}
                    className="outline-none w-full" style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text, padding: "9px 12px", borderRadius: 7, fontSize: 13 }} />
                </div>
                <div style={{ position: "relative" }}>
                  <label className="text-[12px] font-medium block mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Duration</label>
                  <select value={zoomDuration} onChange={e => setZoomDuration(e.target.value)}
                    className="outline-none w-full cursor-pointer" style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text, padding: "9px 12px", borderRadius: 7, fontSize: 13, appearance: "none" as const }}>
                    <option value="15">15 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">1 hour</option><option value="90">1.5 hours</option>
                  </select>
                  <ChevronDown className="absolute right-3 w-3.5 h-3.5 pointer-events-none" style={{ color: c.muted, bottom: 11 }} />
                </div>
              </div>

              {/* Attendees preview */}
              <div>
                <label className="text-[12px] font-medium block mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Attendees</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {selected && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]" style={{ fontFamily: FONT, background: "rgba(116,195,183,0.10)", color: c.teal, border: `1px solid rgba(116,195,183,0.25)` }}>
                      <UserCircle className="w-3 h-3" />{getClientName(selected)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]" style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#F3F4F6", color: c.muted }}>
                    <UserCircle className="w-3 h-3" />{selected?.assignedAgent || "Agent"}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[12px] font-medium block mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Notes (optional)</label>
                <textarea rows={3} value={zoomNotes} onChange={e => setZoomNotes(e.target.value)} placeholder="Add agenda or talking points..."
                  className="outline-none w-full" style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text, padding: "9px 12px", borderRadius: 7, fontSize: 13, resize: "none" }} />
              </div>

              {/* Zoom link preview */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB", border: `1px solid ${c.border}` }}>
                <Link className="w-4 h-4 flex-shrink-0" style={{ color: c.teal }} />
                <span className="text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>Zoom meeting link will be generated automatically</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-7 py-4" style={{ borderTop: `1px solid ${c.border}` }}>
              <button onClick={() => setZoomModalOpen(false)}
                className="px-5 py-[9px] rounded-lg text-[12px] font-normal transition-colors"
                style={{ fontFamily: FONT, border: `1px solid #E5E7EB`, color: c.muted, background: "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(192,192,192,0.10), rgba(172,172,172,0.10))" }}>
                Cancel
              </button>
              <button onClick={() => {
                if (selected && zoomDate) {
                  const ts = `${zoomDate} ${zoomTime.replace(/^(\d{2}):(\d{2})$/, (_, h, m) => { const hr = parseInt(h); return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? "PM" : "AM"}`; })}`;
                  setActivityLogs(prev => [{ id: String(Date.now()), action: "Zoom Meeting Scheduled", description: `${zoomTopic} — ${zoomDuration} min${zoomNotes ? ". " + zoomNotes : ""}`, timestamp: ts, user: selected.assignedAgent, clientId: selected.id, type: "call" as const }, ...prev]);
                }
                setZoomModalOpen(false);
              }}
                className="px-5 py-[9px] rounded-lg text-[12px] font-normal text-white"
                style={{ fontFamily: FONT, background: "linear-gradient(to bottom,#ACD697,#75C9B7)" }}>
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Quote / Cross-Sell Modal ── */}
      {createQuoteOpen && selected && (() => {
        const existingLobs = new Set(mockQuotes.filter(q => q.clientId === selected.id).map(q => q.lob).concat(mockPolicies.filter(p => p.clientId === selected.id).map(p => p.lob)));
        const img = (name: string) => {
          const dark = isDark ? ` Dark` : ``;
          const darkPath = `/insurance-icons/${name}${dark}.png`;
          const lightPath = `/insurance-icons/${name}.png`;
          return <img src={isDark ? darkPath : lightPath} onError={(e) => { (e.target as HTMLImageElement).src = lightPath; }} alt={name} className="w-10 h-10 object-contain" />;
        };
        const allProducts = [
          { id:"gl",  name:"General Liability",       desc:"Third-party bodily injury & property damage claims",          price:"$450",  tag:"BEST VALUE",  tagColor:"#74C3B7", imgKey:"General Liability",      features:["Legal defense costs included","Premises & operations coverage","Products & completed ops"] },
          { id:"wc",  name:"Worker's Comp",            desc:"Required coverage for work-related employee injuries",         price:"$1,450",tag:"TOP PICK",    tagColor:"#9333EA", imgKey:"Workers Comp",            features:["Medical expense coverage","Lost wage replacement","Employer liability protection"] },
          { id:"bo",  name:"Business Owners",          desc:"GL, property & business interruption in one package",          price:"$2,230",tag:"RECOMMENDED", tagColor:"#74C3B7", imgKey:"Business Owners",         features:["General liability included","Commercial property","Business interruption"] },
          { id:"pro", name:"Professional Liability",   desc:"E&O coverage for professional services & advice",              price:"$890",  tag:"",            tagColor:"",        imgKey:"Professional Liability",  features:["Errors & omissions","Defense costs covered","Claims-made policy"] },
          { id:"ex",  name:"Excess",                   desc:"Additional liability limits on top of existing policies",      price:"$380",  tag:"",            tagColor:"",        imgKey:"Excess",                  features:["Extends underlying limits","Broad coverage scope","Cost-effective protection"] },
          { id:"bd",  name:"Bonds",                    desc:"Surety bonds for contractors and businesses",                  price:"$300",  tag:"",            tagColor:"",        imgKey:"Bonds",                   features:["Contract & commercial bonds","License & permit bonds","Court & judicial bonds"] },
          { id:"ca",  name:"Commercial Auto",          desc:"Coverage for vehicles used for business purposes",             price:"$1,200",tag:"",            tagColor:"",        imgKey:"Commercial Auto",         features:["Collision & comprehensive","Uninsured motorist","Medical payments coverage"] },
          { id:"br",  name:"Builders Risk",            desc:"Protects buildings under construction from damage",            price:"$600",  tag:"",            tagColor:"",        imgKey:"Builders Risk",           features:["Structure & materials","Equipment breakdown","Soft costs coverage"] },
          { id:"can", name:"Cannabis",                 desc:"Specialized coverage for cannabis businesses",                 price:"$2,500",tag:"",            tagColor:"",        imgKey:"Cannabis",                features:["Product liability","Crop & inventory","Premises coverage"] },
          { id:"cy",  name:"Cyber",                    desc:"Protection against data breaches and cyber attacks",           price:"$650",  tag:"",            tagColor:"",        imgKey:"Cyber",                   features:["Data breach response","Ransomware coverage","Business interruption"] },
          { id:"hbb", name:"Home Based Business",      desc:"Coverage for businesses operated from home",                   price:"$350",  tag:"",            tagColor:"",        imgKey:"Home Based Business",     features:["Business property","Liability coverage","Business income"] },
          { id:"im",  name:"Inland Marine",            desc:"Coverage for goods & equipment in transit",                    price:"$450",  tag:"",            tagColor:"",        imgKey:"Inland Marine",           features:["Equipment floater","Installation floater","Fine arts coverage"] },
          { id:"lr",  name:"Lessor's Risk",            desc:"Property & liability for commercial landlords",                price:"$800",  tag:"",            tagColor:"",        imgKey:"Lessor's Risk",           features:["Building coverage","Liability protection","Loss of rents"] },
          { id:"np",  name:"Non-Profit",               desc:"Tailored coverage for non-profit organizations",               price:"$500",  tag:"",            tagColor:"",        imgKey:"Non-Profit",              features:["D&O liability","General liability","Professional liability"] },
          { id:"pl",  name:"Pollution Liability",      desc:"Coverage for pollution-related claims & cleanup",              price:"$1,100",tag:"",            tagColor:"",        imgKey:"Pollution",               features:["Cleanup costs","Third-party claims","Legal defense"] },
          { id:"se",  name:"Special Events",           desc:"One-time coverage for events & gatherings",                    price:"$250",  tag:"",            tagColor:"",        imgKey:"Special Events",          features:["Event cancellation","Liability coverage","Liquor liability"] },
          { id:"tg",  name:"Truckers GL",              desc:"General liability for trucking operations",                    price:"$1,800",tag:"",            tagColor:"",        imgKey:"Truckers GL",             features:["Primary liability","Physical damage","Cargo coverage"] },
          { id:"vr",  name:"Vacant Risks",             desc:"Coverage for unoccupied or vacant properties",                 price:"$700",  tag:"",            tagColor:"",        imgKey:"Vacant Risks",            features:["Vandalism protection","Fire & lightning","Liability coverage"] },
          { id:"mc",  name:"Boats/Marine Contractors GL", desc:"GL for marine contractors & watercraft operations",         price:"$950",  tag:"",            tagColor:"",        imgKey:"Marine Contractors",      features:["Marine liability","Watercraft coverage","Pollution liability"] },
        ];
        const recommended = allProducts.filter(p => !existingLobs.has(p.name)).slice(0, 3);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setCreateQuoteOpen(false)}>
            <div className="w-[920px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ background: c.cardBg, fontFamily: FONT }} onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="relative flex items-start justify-between px-8 pt-7 pb-6 overflow-hidden" style={{ borderBottom: `1px solid ${c.border}`, background: c.cardBg }}>
<div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full" style={{ background: "linear-gradient(135deg,rgba(92,46,212,0.10),rgba(166,20,195,0.10))", color: "#7C3AED" }}>⚡ Complete Your Coverage</span>
                  </div>
                  <h2 className="text-[20px] font-bold mb-1.5" style={{ color: c.text }}>We Already Have {getClientName(selected)}'s Info—Get Quotes Faster!</h2>
                  <p className="text-[12px]" style={{ color: c.muted }}>Business info is already saved. Select a coverage type to start a quote in minutes.</p>
                </div>
                <button onClick={() => setCreateQuoteOpen(false)} className="p-1.5 rounded-lg transition-colors mt-1" style={{ color: c.muted }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-8 py-6">
                {/* Recommended */}
                {recommended.length > 0 && (
                  <div className="mb-7">
                    <div className="flex items-center gap-2.5 mb-4">
                      <Star className="w-4 h-4 flex-shrink-0" style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                      <span className="text-[13px] font-bold" style={{ color: c.text }}>Recommended for {getClientName(selected)}</span>
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border" style={{ background: "rgba(245,158,11,0.07)", color: "#D97706", borderColor: "rgba(245,158,11,0.20)" }}>Based on client profile</span>
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border" style={{ background: "linear-gradient(135deg,rgba(92,46,212,0.07),rgba(166,20,195,0.07))", color: "#7C3AED", borderColor: "rgba(92,46,212,0.15)" }}>
                        <img src={norbieface.src} alt="Norbie" className="w-3.5 h-3.5 rounded-full object-cover" />
                        Norbie's Pick
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {recommended.map(p => (
                        <div key={p.id} className="rounded-2xl p-5 relative flex flex-col transition-all cursor-pointer"
                          style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#fff", border: "1.1px solid #E5E7EB", boxShadow: "0 0 14.9px 0 rgba(110,33,196,0.15)" }}
                          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 20px 0 rgba(110,33,196,0.25)"; }}
                          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 14.9px 0 rgba(110,33,196,0.15)"; }}>
                          {p.tag && (
                            <span className="absolute top-3 right-3 text-[9px] font-bold px-2.5 py-1 rounded-lg text-white"
                              style={{ background: p.tag === "BEST VALUE" ? "#74C3B7" : "linear-gradient(90deg,#5C2ED4 0%,#A614C3 100%)" }}>{p.tag}</span>
                          )}
                          <div className="p-3 rounded-xl mb-3 w-fit" style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", transform: "scale(0.9)", transformOrigin: "center" }}>{img(p.imgKey)}</div>
                          <div className="text-[14px] font-bold mb-0.5" style={{ color: c.text }}>{p.name}</div>
                          <div className="text-[11px] mb-3" style={{ color: c.muted }}>{p.desc}</div>
                          <div className="text-[22px] font-bold mb-0.5" style={{ background: "linear-gradient(135deg,#9333EA,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{p.price}</div>
                          <div className="text-[10px] mb-3" style={{ color: c.muted }}>per year (estimated)</div>
                          <div style={{ borderTop: `1px solid ${c.border}`, marginBottom: 10 }} />
                          <div className="flex flex-col gap-1.5 mb-4 flex-1">
                            {p.features.map((f, fi) => (
                              <div key={fi} className="flex items-center gap-1.5">
                                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(116,195,183,0.15)" }}>
                                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="#74C3B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                                <span className="text-[11px]" style={{ color: c.muted }}>{f}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] mb-3" style={{ color: c.muted }}>
                            <Calendar className="w-3 h-3" /><span>Takes only 5 minutes</span>
                          </div>
                          <button className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white flex items-center justify-center gap-1.5 transition-all"
                            style={{ background: "linear-gradient(90deg,#5C2ED4 0%,#A614C3 100%)" }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                            Get Quote Now →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Products */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ClipboardList className="w-4 h-4" style={{ color: c.muted }} />
                    <span className="text-[13px] font-bold" style={{ color: c.text }}>All Available Coverages</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {allProducts.filter(p => !recommended.includes(p)).map(p => {
                      const hasIt = existingLobs.has(p.name);
                      return (
                        <button key={p.id} disabled={hasIt}
                          className="rounded-xl p-4 flex flex-col items-center text-center gap-2 transition-all"
                          style={{ background: c.cardBg, border: `1px solid ${c.border}`, opacity: hasIt ? 0.45 : 1, cursor: hasIt ? "default" : "pointer" }}
                          onMouseEnter={e => { if (!hasIt) { e.currentTarget.style.boxShadow = "0 2px 12px rgba(92,46,212,0.18)"; e.currentTarget.style.background = "linear-gradient(white,white) padding-box, linear-gradient(90deg,#5C2ED4,#A614C3) border-box"; e.currentTarget.style.border = "1px solid transparent"; } }}
                          onMouseLeave={e => { e.currentTarget.style.background = c.cardBg; e.currentTarget.style.border = `1px solid ${c.border}`; e.currentTarget.style.boxShadow = "none"; }}>
                          <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: isDark ? "rgba(255,255,255,0.07)" : "#EFEFEF" }}>
                            <div style={{ transform: `scale(0.8)${p.id === "ca" ? " translateY(5px)" : p.id === "br" ? " translateY(-5px)" : ""}` }}>{img(p.imgKey)}</div>
                          </div>
                          <div className="text-[12px] font-bold leading-tight" style={{ color: c.text }}>{p.name}</div>
                          <div className="text-[11px] font-semibold" style={{ background: "linear-gradient(135deg,#9333EA,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{p.price}<span className="text-[10px] font-normal" style={{ color: c.muted, WebkitTextFillColor: c.muted }}>/yr</span></div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-8 py-4" style={{ borderTop: `1px solid ${c.border}` }}>
                <span className="text-[11px]" style={{ color: c.muted }}>Prices are estimated. Final premium subject to underwriting.</span>
                <button onClick={() => setCreateQuoteOpen(false)} className="px-5 py-[9px] rounded-lg text-[12px] font-normal"
                  style={{ border: `1px solid ${c.border}`, color: c.muted, fontFamily: FONT }}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
