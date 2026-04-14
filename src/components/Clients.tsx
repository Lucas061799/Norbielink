"use client";

import { useState } from "react";
import {
  Search, Plus, MoreVertical, Pencil, Building2, ChevronLeft, ChevronDown,
  Activity, FileText, ClipboardList, Shield, Star, Phone, Mail,
  Calendar, DollarSign, TrendingUp, FileStack, Upload, Download,
  MessageSquare, UserCircle, X, MapPin, Users, ChevronRight, RefreshCw,
} from "lucide-react";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Client {
  id: string; type: "Individual" | "Business";
  companyName?: string; dbaName?: string;
  firstName?: string; lastName?: string;
  email: string; phone: string;
  address: { street: string; city: string; state: string; zipCode: string };
  status: "Active" | "Inactive" | "Prospect";
  assignedAgent: string; agencyId: string;
  createdDate: string; lastActivity: string; isStarred?: boolean;
  totalPremium: number; activePolicies: number; pendingQuotes: number;
  notes?: string; tags?: string[]; industry?: string; website?: string;
}
interface Quote { id: string; quoteId: string; policyType: string; status: "Pending"|"Approved"|"Declined"|"Expired"; createdDate: string; premium: number; clientId: string; }
interface Policy { id: string; policyNumber: string; policyType: string; status: "Active"|"Expired"|"Cancelled"; effectiveDate: string; expirationDate: string; premium: number; clientId: string; }
interface Document { id: string; name: string; type: string; uploadDate: string; size: string; clientId: string; }
interface ActivityLog { id: string; action: string; description: string; timestamp: string; user: string; clientId: string; }

/* ─── Mock Data ──────────────────────────────────────────────────────────── */
const mockClients: Client[] = [
  { id:"1", type:"Business", companyName:"Tech Solutions Inc.", dbaName:"TechSol", email:"contact@techsolutions.com", phone:"(555) 123-4567", address:{street:"123 Innovation Drive",city:"San Francisco",state:"CA",zipCode:"94105"}, status:"Active", assignedAgent:"Jane Smith", agencyId:"1", createdDate:"2024-01-15", lastActivity:"2024-04-10", isStarred:true, totalPremium:45000, activePolicies:3, pendingQuotes:1, industry:"Technology", website:"www.techsolutions.com" },
  { id:"2", type:"Individual", firstName:"John", lastName:"Anderson", email:"john.anderson@email.com", phone:"(555) 234-5678", address:{street:"456 Oak Street",city:"Los Angeles",state:"CA",zipCode:"90001"}, status:"Active", assignedAgent:"Mike Chen", agencyId:"1", createdDate:"2024-02-20", lastActivity:"2024-04-08", isStarred:false, totalPremium:12000, activePolicies:2, pendingQuotes:0 },
  { id:"3", type:"Business", companyName:"Green Earth Logistics", dbaName:"GEL Transport", email:"info@greenearth.com", phone:"(555) 345-6789", address:{street:"789 Commerce Blvd",city:"Chicago",state:"IL",zipCode:"60601"}, status:"Prospect", assignedAgent:"Sarah Johnson", agencyId:"1", createdDate:"2024-03-10", lastActivity:"2024-04-12", isStarred:true, totalPremium:0, activePolicies:0, pendingQuotes:2, industry:"Logistics" },
  { id:"4", type:"Business", companyName:"Metro Construction LLC", email:"contact@metroconstruction.com", phone:"(555) 456-7890", address:{street:"321 Builder Lane",city:"New York",state:"NY",zipCode:"10001"}, status:"Active", assignedAgent:"Jane Smith", agencyId:"1", createdDate:"2023-11-05", lastActivity:"2024-04-11", isStarred:true, totalPremium:78000, activePolicies:5, pendingQuotes:0, industry:"Construction" },
  { id:"5", type:"Individual", firstName:"Maria", lastName:"Rodriguez", email:"maria.r@email.com", phone:"(555) 567-8901", address:{street:"654 Palm Avenue",city:"Miami",state:"FL",zipCode:"33101"}, status:"Inactive", assignedAgent:"Mike Chen", agencyId:"1", createdDate:"2023-08-15", lastActivity:"2024-01-20", isStarred:false, totalPremium:8500, activePolicies:1, pendingQuotes:0 },
];
const mockQuotes: Quote[] = [
  { id:"1", quoteId:"Q-2024-001", policyType:"Commercial Auto", status:"Pending", createdDate:"2024-04-10", premium:15000, clientId:"1" },
  { id:"2", quoteId:"Q-2024-015", policyType:"General Liability", status:"Approved", createdDate:"2024-04-05", premium:8000, clientId:"3" },
  { id:"3", quoteId:"Q-2024-016", policyType:"Workers Compensation", status:"Pending", createdDate:"2024-04-08", premium:12000, clientId:"3" },
];
const mockPolicies: Policy[] = [
  { id:"1", policyNumber:"POL-2024-1001", policyType:"General Liability", status:"Active", effectiveDate:"2024-01-01", expirationDate:"2025-01-01", premium:15000, clientId:"1" },
  { id:"2", policyNumber:"POL-2024-1002", policyType:"Commercial Auto", status:"Active", effectiveDate:"2024-02-01", expirationDate:"2025-02-01", premium:18000, clientId:"1" },
  { id:"3", policyNumber:"POL-2024-1003", policyType:"Property Insurance", status:"Active", effectiveDate:"2024-01-15", expirationDate:"2025-01-15", premium:12000, clientId:"1" },
  { id:"4", policyNumber:"POL-2023-0856", policyType:"Auto Insurance", status:"Active", effectiveDate:"2023-09-01", expirationDate:"2024-09-01", premium:7000, clientId:"2" },
  { id:"5", policyNumber:"POL-2023-0857", policyType:"Homeowners", status:"Active", effectiveDate:"2023-10-01", expirationDate:"2024-10-01", premium:5000, clientId:"2" },
];
const mockDocuments: Document[] = [
  { id:"1", name:"Certificate of Insurance", type:"PDF", uploadDate:"2024-04-05", size:"2.3 MB", clientId:"1" },
  { id:"2", name:"Policy Application", type:"PDF", uploadDate:"2024-03-20", size:"1.8 MB", clientId:"1" },
  { id:"3", name:"Loss Run Report", type:"PDF", uploadDate:"2024-02-15", size:"3.5 MB", clientId:"1" },
];
const mockActivity: ActivityLog[] = [
  { id:"1", action:"Policy Renewed", description:"Policy POL-2024-1001 renewed for another year", timestamp:"2024-04-10 10:30 AM", user:"Jane Smith", clientId:"1" },
  { id:"2", action:"Quote Requested", description:"New quote requested for Commercial Auto coverage", timestamp:"2024-04-10 09:15 AM", user:"System", clientId:"1" },
  { id:"3", action:"Document Uploaded", description:"Certificate of Insurance uploaded", timestamp:"2024-04-05 02:45 PM", user:"Jane Smith", clientId:"1" },
  { id:"4", action:"Email Sent", description:"Renewal reminder sent to client", timestamp:"2024-04-03 11:00 AM", user:"System", clientId:"1" },
  { id:"5", action:"Phone Call", description:"Discussed coverage options and policy updates", timestamp:"2024-04-01 03:30 PM", user:"Jane Smith", clientId:"1" },
];

type ViewType = "list" | "detail";
type DetailTab = "overview" | "policies" | "quotes" | "documents" | "activity";
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
    Active:    { color: "#0EA882", background: "rgba(14,168,130,0.08)" },
    Inactive:  { color: isDark ? "#8B8FA8" : "#9CA3AF", background: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6" },
    Prospect:  { color: "#3B82F6", background: "rgba(59,130,246,0.08)" },
    Pending:   { color: "#F59E0B", background: "rgba(245,158,11,0.08)" },
    Approved:  { color: "#0EA882", background: "rgba(14,168,130,0.08)" },
    Declined:  { color: "#EF4444", background: "rgba(239,68,68,0.08)" },
    Cancelled: { color: "#EF4444", background: "rgba(239,68,68,0.08)" },
    Expired:   { color: isDark ? "#8B8FA8" : "#9CA3AF", background: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6" },
  };
  const s = styles[status] || { color: "#9CA3AF", background: "#F3F4F6" };
  return (
    <span className="inline-flex px-2.5 py-[3px] rounded-full text-[11px] font-semibold"
      style={{ fontFamily: FONT, ...s }}>{status}</span>
  );
}

/* ─── Add Client Modal ───────────────────────────────────────────────────── */
function AddClientModal({ isOpen, onClose, isDark }: { isOpen: boolean; onClose: () => void; isDark: boolean }) {
  const [clientType, setClientType] = useState<"Business" | "Individual">("Business");
  if (!isOpen) return null;
  const bg = isDark ? "#191D35" : "#fff";
  const text = isDark ? "#F9FAFB" : "#1F2937";
  const muted = isDark ? "#8B8FA8" : "#6B7280";
  const border = isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB";
  const inputBg = isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB";
  const labelStyle: React.CSSProperties = { fontFamily: FONT, fontSize: "11px", fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 };
  const inputStyle: React.CSSProperties = { fontFamily: FONT, background: inputBg, border: `1px solid ${border}`, color: text, width: "100%", padding: "8px 12px", borderRadius: 8, fontSize: 13, outline: "none" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="w-[560px] max-h-[82vh] overflow-y-auto rounded-2xl shadow-2xl" style={{ background: bg, border: `1px solid ${border}`, fontFamily: FONT }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${border}` }}>
          <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: text }}>Add New Client</h2>
          <button onClick={onClose} style={{ color: muted }}><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label style={labelStyle}>Client Type</label>
            <div className="flex gap-2">
              {(["Business","Individual"] as const).map(t => (
                <button key={t} onClick={() => setClientType(t)} className="flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all"
                  style={clientType === t
                    ? { background: "linear-gradient(to bottom,#ACD697,#75C9B7)", color: "#fff", fontFamily: FONT }
                    : { background: inputBg, border: `1px solid ${border}`, color: muted, fontFamily: FONT }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {clientType === "Business" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label style={labelStyle}>Company Name</label><input style={inputStyle} placeholder="Enter company name" /></div>
              <div><label style={labelStyle}>DBA Name</label><input style={inputStyle} placeholder="Optional" /></div>
              <div><label style={labelStyle}>Industry</label><input style={inputStyle} placeholder="e.g. Technology" /></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div><label style={labelStyle}>First Name</label><input style={inputStyle} placeholder="First name" /></div>
              <div><label style={labelStyle}>Last Name</label><input style={inputStyle} placeholder="Last name" /></div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div><label style={labelStyle}>Email</label><input style={inputStyle} placeholder="email@example.com" /></div>
            <div><label style={labelStyle}>Phone</label><input style={inputStyle} placeholder="(555) 000-0000" /></div>
            <div className="col-span-2"><label style={labelStyle}>Street Address</label><input style={inputStyle} placeholder="123 Main Street" /></div>
            <div><label style={labelStyle}>City</label><input style={inputStyle} placeholder="City" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label style={labelStyle}>State</label><input style={inputStyle} placeholder="CA" /></div>
              <div><label style={labelStyle}>ZIP</label><input style={inputStyle} placeholder="00000" /></div>
            </div>
            <div><label style={labelStyle}>Assigned Agent</label><input style={inputStyle} placeholder="Agent name" /></div>
            <div><label style={labelStyle}>Status</label>
              <select style={inputStyle}><option>Active</option><option>Inactive</option><option>Prospect</option></select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: `1px solid ${border}` }}>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors"
            style={{ fontFamily: FONT, background: inputBg, border: `1px solid ${border}`, color: muted }}>Cancel</button>
          <button className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white"
            style={{ fontFamily: FONT, background: "linear-gradient(to bottom,#ACD697,#75C9B7)" }}>Add Client</button>
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
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All");
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [stars, setStars] = useState<Set<string>>(new Set(mockClients.filter(c => c.isStarred).map(c => c.id)));
  const [detailSearch, setDetailSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

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
    teal:        "#74C3B7",
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
        }}>
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
      <span className="inline-flex items-center gap-[2px] ml-1 flex-shrink-0" style={{ verticalAlign: "middle" }}>
        {/* Up arrow */}
        <svg width="8" height="11" viewBox="0 0 8 11" fill="none">
          <path d="M4 10V2M4 2L1.5 4.5M4 2L6.5 4.5" stroke={upColor} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* Down arrow */}
        <svg width="8" height="11" viewBox="0 0 8 11" fill="none">
          <path d="M4 1V9M4 9L1.5 6.5M4 9L6.5 6.5" stroke={downColor} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
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
    <button onClick={() => { setDetailTab(tab); setDetailSearch(""); }}
      className="flex items-center gap-1.5 px-5 py-3 text-[13px] font-semibold relative transition-colors"
      style={{ fontFamily: FONT, color: detailTab === tab ? c.teal : c.muted }}>
      <Icon className="w-4 h-4" />
      {label}
      {detailTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full" style={{ background: c.teal }} />}
    </button>
  );

  /* ── DETAIL CLIENT DATA ── */
  const clientPolicies = selected ? mockPolicies.filter(p => p.clientId === selected.id && (!detailSearch || p.policyNumber.toLowerCase().includes(detailSearch.toLowerCase()) || p.policyType.toLowerCase().includes(detailSearch.toLowerCase()))) : [];
  const clientQuotes   = selected ? mockQuotes.filter(q => q.clientId === selected.id && (!detailSearch || q.quoteId.toLowerCase().includes(detailSearch.toLowerCase()) || q.policyType.toLowerCase().includes(detailSearch.toLowerCase()))) : [];
  const clientDocs     = selected ? mockDocuments.filter(d => d.clientId === selected.id && (!detailSearch || d.name.toLowerCase().includes(detailSearch.toLowerCase()))) : [];
  const clientActivity = selected ? mockActivity.filter(a => a.clientId === selected.id) : [];

  /* ══════════════════════ LIST VIEW ══════════════════════ */
  if (view === "list") return (
    <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: FONT }} onClick={() => setOpenMenuId(null)}>
      {/* Top section */}
      <div>
        {sectionTitle}

        {/* Search + Add */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-[340px]">
            <input placeholder="Search clients..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pr-10" style={{ ...inputSty, paddingRight: 40 }} />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: c.muted }} />
          </div>
          <button onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-all"
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
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(166,20,195,0.35)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = c.border)}>
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
          gridTemplateColumns: "28px 2fr 1fr 1.8fr 1.2fr 0.9fr 0.6fr 0.9fr 80px",
          borderBottom: `1px solid ${c.border}`,
          background: isDark ? "rgba(255,255,255,0.02)" : "#FDFDFD",
          gap: "10px",
          padding: "10px 0",
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
              style={{ gridTemplateColumns: "28px 2fr 1fr 1.8fr 1.2fr 0.9fr 0.6fr 0.9fr 80px", gap: "10px", borderBottom: `1px solid ${c.border}`, padding: "14px 0" }}
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
              <div className="flex items-center gap-1.5 text-[12px]" style={{ fontFamily: FONT, color: c.teal }}>
                {cl.type === "Business" ? <Building2 className="w-3.5 h-3.5" /> : <UserCircle className="w-3.5 h-3.5" />}
                {cl.type}
              </div>
              {/* Contact */}
              <div>
                <div className="flex items-center gap-1.5 text-[11px] mb-0.5" style={{ fontFamily: FONT, color: c.muted }}><Mail className="w-3 h-3 flex-shrink-0" /><span className="truncate">{cl.email}</span></div>
                <div className="flex items-center gap-1.5 text-[11px]" style={{ fontFamily: FONT, color: c.muted }}><Phone className="w-3 h-3 flex-shrink-0" />{cl.phone}</div>
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
        style={{ marginLeft: "-24px", marginRight: "-24px", marginBottom: "-24px", paddingLeft: "24px", paddingRight: "24px", paddingBottom: "16px", borderTop: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "#F9FAFB" }}>
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
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-[24px] font-bold" style={{ fontFamily: FONT, color: c.text }}>{getClientName(selected)}</h1>
              <StatusBadge status={selected.status} isDark={isDark} />
              <button onClick={() => toggleStar(selected.id)}>
                <Star className="w-5 h-5 transition-colors" style={{ fill: isStarred ? "#F59E0B" : "none", color: isStarred ? "#F59E0B" : c.sub }} />
              </button>
            </div>
            {selected.type === "Business" && selected.industry && (
              <p className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{selected.industry} · Client ID: {selected.id}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white"
              style={{ fontFamily: FONT, background: "linear-gradient(to bottom,#ACD697,#75C9B7)" }}>
              <Plus className="w-4 h-4" />New Quote
            </button>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total Premium", value: `$${selected.totalPremium.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" style={{ color: c.teal }} />, extra: <TrendingUp className="w-4 h-4" style={{ color: "#0EA882" }} /> },
          { label: "Active Policies", value: String(selected.activePolicies), icon: <Shield className="w-5 h-5" style={{ color: c.teal }} />, extra: null },
          { label: "Pending Quotes", value: String(selected.pendingQuotes), icon: <ClipboardList className="w-5 h-5" style={{ color: c.teal }} />, extra: null },
          { label: "Assigned Agent", value: selected.assignedAgent, icon: <UserCircle className="w-5 h-5" style={{ color: c.teal }} />, extra: null },
        ].map((card, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg" style={{ background: "rgba(116,195,183,0.10)" }}>{card.icon}</div>
              {card.extra}
            </div>
            <div className="text-[18px] font-bold mb-0.5" style={{ fontFamily: FONT, color: c.text }}>{card.value}</div>
            <div className="text-[11px]" style={{ fontFamily: FONT, color: c.muted }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5" style={{ borderBottom: `1px solid ${c.border}` }}>
        {detailTabBtn("overview",   "Overview",   FileText)}
        {detailTabBtn("policies",   "Policies",   Shield)}
        {detailTabBtn("quotes",     "Quotes",     ClipboardList)}
        {detailTabBtn("documents",  "Documents",  FileStack)}
        {detailTabBtn("activity",   "Activity",   Activity)}
      </div>

      {/* ── OVERVIEW ── */}
      {detailTab === "overview" && (
        <div className="space-y-4 overflow-y-auto flex-1">
          {/* Quick Actions */}
          <div className="rounded-xl p-5" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <h3 className="text-[15px] font-bold mb-4" style={{ fontFamily: FONT, color: c.text }}>Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: <FileText className="w-3.5 h-3.5" />, label: "Create Quote" },
                { icon: <Shield className="w-3.5 h-3.5" />, label: "Generate Policy" },
                { icon: <Upload className="w-3.5 h-3.5" />, label: "Upload Document" },
                { icon: <MessageSquare className="w-3.5 h-3.5" />, label: "Send Email" },
                { icon: <Calendar className="w-3.5 h-3.5" />, label: "Schedule Meeting" },
              ].map(({ icon, label }) => (
                <button key={label} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-colors"
                  style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.muted, background: c.mutedBg }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(116,195,183,0.4)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = c.border)}>
                  {icon}{label}
                </button>
              ))}
            </div>
          </div>

          {/* Client Information */}
          <div className="rounded-xl p-5" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold" style={{ fontFamily: FONT, color: c.text }}>Client Information</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.muted }}>
                <Pencil className="w-3.5 h-3.5" />Edit
              </button>
            </div>
            <div className="grid gap-x-8 gap-y-5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {selected.type === "Business" ? (<>
                <div><div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: FONT, color: c.muted }}>Company Name:</div><div className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{selected.companyName}</div></div>
                {selected.dbaName && <div><div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: FONT, color: c.muted }}>DBA Name:</div><div className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{selected.dbaName}</div></div>}
                {selected.industry && <div><div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: FONT, color: c.muted }}>Industry:</div><div className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{selected.industry}</div></div>}
                {selected.website && <div><div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: FONT, color: c.muted }}>Website:</div><div className="text-[13px]" style={{ fontFamily: FONT, color: c.teal }}>{selected.website}</div></div>}
              </>) : (<>
                <div><div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: FONT, color: c.muted }}>First Name:</div><div className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{selected.firstName}</div></div>
                <div><div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: FONT, color: c.muted }}>Last Name:</div><div className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{selected.lastName}</div></div>
              </>)}
              <div><div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: FONT, color: c.muted }}>Email Address:</div><div className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{selected.email}</div></div>
              <div><div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: FONT, color: c.muted }}>Phone Number:</div><div className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{selected.phone}</div></div>
              <div><div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: FONT, color: c.muted }}>Assigned Agent:</div><div className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{selected.assignedAgent}</div></div>
              <div><div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: FONT, color: c.muted }}>Client Since:</div><div className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{new Date(selected.createdDate).toLocaleDateString()}</div></div>
              <div className="col-span-3" style={{ borderTop: `1px solid ${c.border}`, paddingTop: 16 }}>
                <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: FONT, color: c.muted }}>Agency Address:</div>
                <div className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{selected.address.street}</div>
                <div className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{selected.address.city}, {selected.address.state} {selected.address.zipCode}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── POLICIES ── */}
      {detailTab === "policies" && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex justify-end mb-4">
            <div className="relative"><input placeholder="Search policies..." value={detailSearch} onChange={e => setDetailSearch(e.target.value)} style={{ ...inputSty, paddingRight: 38, width: 240 }} className="outline-none" /><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: c.muted }} /></div>
          </div>
          <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <div className="grid px-5 py-3 gap-3" style={{ gridTemplateColumns:"1.5fr 2fr 1.1fr 1.3fr 1.3fr 1.2fr 40px", borderBottom:`1px solid ${c.border}`, background:c.mutedBg }}>
              {["Policy Number","Policy Type","Status","Effective","Expiration","Premium",""].map((h,i) => <div key={i} className="text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily:FONT, color:c.muted }}>{h}</div>)}
            </div>
            <div className="overflow-y-auto">
              {clientPolicies.map((p,i,arr) => (
                <div key={p.id} className="grid px-5 py-3.5 items-center gap-3 transition-colors"
                  style={{ gridTemplateColumns:"1.5fr 2fr 1.1fr 1.3fr 1.3fr 1.2fr 40px", borderBottom:i!==arr.length-1?`1px solid ${c.border}`:"none" }}
                  onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <div className="text-[12px] font-semibold font-mono" style={{ fontFamily:FONT, color:c.teal }}>{p.policyNumber}</div>
                  <div className="text-[13px]" style={{ fontFamily:FONT, color:c.muted }}>{p.policyType}</div>
                  <StatusBadge status={p.status} isDark={isDark} />
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{new Date(p.effectiveDate).toLocaleDateString()}</div>
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{new Date(p.expirationDate).toLocaleDateString()}</div>
                  <div className="text-[13px] font-semibold" style={{ fontFamily:FONT, color:c.text }}>${p.premium.toLocaleString()}</div>
                  <ActionMenu isDark={isDark} items={["View Details","Download Policy","Renew Policy"]} menuId={`policy-${p.id}`} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── QUOTES ── */}
      {detailTab === "quotes" && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex justify-end mb-4">
            <div className="relative"><input placeholder="Search quotes..." value={detailSearch} onChange={e => setDetailSearch(e.target.value)} style={{ ...inputSty, paddingRight: 38, width: 240 }} className="outline-none" /><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: c.muted }} /></div>
          </div>
          <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <div className="grid px-5 py-3 gap-3" style={{ gridTemplateColumns:"1.5fr 2.5fr 1.1fr 1.5fr 1.5fr 40px", borderBottom:`1px solid ${c.border}`, background:c.mutedBg }}>
              {["Quote ID","Policy Type","Status","Created","Premium",""].map((h,i) => <div key={i} className="text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily:FONT, color:c.muted }}>{h}</div>)}
            </div>
            <div className="overflow-y-auto">
              {clientQuotes.map((q,i,arr) => (
                <div key={q.id} className="grid px-5 py-3.5 items-center gap-3 transition-colors"
                  style={{ gridTemplateColumns:"1.5fr 2.5fr 1.1fr 1.5fr 1.5fr 40px", borderBottom:i!==arr.length-1?`1px solid ${c.border}`:"none" }}
                  onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <div className="text-[12px] font-semibold font-mono" style={{ fontFamily:FONT, color:c.teal }}>{q.quoteId}</div>
                  <div className="text-[13px]" style={{ fontFamily:FONT, color:c.muted }}>{q.policyType}</div>
                  <StatusBadge status={q.status} isDark={isDark} />
                  <div className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>{new Date(q.createdDate).toLocaleDateString()}</div>
                  <div className="text-[13px] font-semibold" style={{ fontFamily:FONT, color:c.text }}>${q.premium.toLocaleString()}</div>
                  <ActionMenu isDark={isDark} items={["View Details","Convert to Policy","Download Quote"]} menuId={`quote-${q.id}`} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DOCUMENTS ── */}
      {detailTab === "documents" && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-4">
            <div className="relative"><input placeholder="Search documents..." value={detailSearch} onChange={e => setDetailSearch(e.target.value)} style={{ ...inputSty, paddingRight: 38, width: 240 }} className="outline-none" /><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: c.muted }} /></div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white" style={{ fontFamily:FONT, background:"linear-gradient(to bottom,#ACD697,#75C9B7)" }}><Upload className="w-4 h-4" />Upload Document</button>
          </div>
          <div className="rounded-xl overflow-hidden flex flex-col" style={{ background:c.cardBg, border:`1px solid ${c.border}` }}>
            <div className="grid px-5 py-3 gap-3" style={{ gridTemplateColumns:"2.5fr 1fr 1.5fr 1fr 40px", borderBottom:`1px solid ${c.border}`, background:c.mutedBg }}>
              {["Document Name","Type","Upload Date","Size",""].map((h,i) => <div key={i} className="text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily:FONT, color:c.muted }}>{h}</div>)}
            </div>
            <div className="overflow-y-auto">
              {clientDocs.map((d,i,arr) => (
                <div key={d.id} className="grid px-5 py-3.5 items-center gap-3 transition-colors"
                  style={{ gridTemplateColumns:"2.5fr 1fr 1.5fr 1fr 40px", borderBottom:i!==arr.length-1?`1px solid ${c.border}`:"none" }}
                  onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <div className="flex items-center gap-2 text-[13px]" style={{ fontFamily:FONT, color:c.text }}><FileText className="w-4 h-4 flex-shrink-0" style={{ color:c.muted }} />{d.name}</div>
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
      {detailTab === "activity" && (
        <div className="flex-1 overflow-y-auto rounded-xl p-5" style={{ background:c.cardBg, border:`1px solid ${c.border}` }}>
          <h3 className="text-[15px] font-bold mb-5" style={{ fontFamily:FONT, color:c.text }}>Activity Timeline</h3>
          {clientActivity.map((a,i) => (
            <div key={a.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ background:c.teal }} />
                {i !== clientActivity.length-1 && <div className="w-px flex-1 mt-2" style={{ background:c.border }} />}
              </div>
              <div className="flex-1 pb-5">
                <div className="flex items-start justify-between mb-0.5">
                  <h4 className="text-[13px] font-semibold" style={{ fontFamily:FONT, color:c.text }}>{a.action}</h4>
                  <span className="text-[11px]" style={{ fontFamily:FONT, color:c.muted }}>{a.timestamp}</span>
                </div>
                <p className="text-[12px] mb-0.5" style={{ fontFamily:FONT, color:c.muted }}>{a.description}</p>
                <p className="text-[11px]" style={{ fontFamily:FONT, color:c.sub }}>by {a.user}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddClientModal isOpen={modalOpen} onClose={() => setModalOpen(false)} isDark={isDark} />
    </div>
  );
}
