"use client";

import { useState } from "react";
import { Search, Plus, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, RefreshCw, Download, MessageSquare, MessageCircle, Mail, Phone, Printer, Minus, Maximize2, FileText, FolderOpen, Eye, X } from "lucide-react";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface PolicyRow {
  id: string;
  created: string;
  submissionId: string;
  applicant: string;
  dba: string;
  effective: string;
  lob: string;
  status: string;
  producer: string;
}

const mockPolicies: PolicyRow[] = [
  { id: "1",  created: "05/01/2024", submissionId: "QAA123456789",   applicant: "Elvis Prestley", dba: "NASA",                   effective: "05/01/2024", lob: "General Liability",    status: "Add'l Insured Request", producer: "Elvis Prestley" },
  { id: "2",  created: "01/01/2024", submissionId: "QAN555666123",   applicant: "Jane Smith",     dba: "VRG Plumbing, LLC",      effective: "01/01/2024", lob: "Worker's Comp",        status: "Sold/Issued",           producer: "Jane Smith" },
  { id: "3",  created: "06/15/2024", submissionId: "QMWC123456789",  applicant: "Joe Smith",      dba: "California Auto Sales",  effective: "06/15/2024", lob: "General Liability",    status: "Declined",              producer: "Joe Smith" },
  { id: "4",  created: "07/01/2024", submissionId: "QMWC111222333",  applicant: "Elvis Prestley", dba: "Restaurant R' Us",       effective: "07/01/2024", lob: "Vacant Risks",         status: "Incomplete",            producer: "Elvis Prestley" },
  { id: "5",  created: "07/01/2024", submissionId: "QMWC111222333",  applicant: "Elvis Prestley", dba: "Restaurant R' Us",       effective: "07/01/2024", lob: "Worker's Comp",        status: "Incomplete",            producer: "Elvis Prestley" },
  { id: "6",  created: "07/01/2024", submissionId: "QMWC111222333",  applicant: "Joe Smith",      dba: "Restaurant R' Us",       effective: "07/01/2024", lob: "General Liability",    status: "Incomplete",            producer: "Joe Smith" },
  { id: "7",  created: "03/01/2025", submissionId: "QAA987654321-1", applicant: "Elvis Prestley", dba: "Iron Gate Fencing",      effective: "03/01/2025", lob: "Vacant Risks",         status: "Upcoming Renewals",     producer: "Elvis Prestley" },
  { id: "8",  created: "03/01/2025", submissionId: "QAA987654321-1", applicant: "Joe Smith",      dba: "Iron Gate Fencing",      effective: "03/01/2025", lob: "Vacant Risks",         status: "Pending/Action Req.",   producer: "Joe Smith" },
  { id: "9",  created: "02/14/2025", submissionId: "QAA246813579",   applicant: "Maria Garcia",   dba: "Sunset Bakery",          effective: "02/14/2025", lob: "Business Owners",      status: "Sold/Issued",           producer: "Maria Garcia" },
  { id: "10", created: "02/20/2025", submissionId: "QMWC246813580",  applicant: "David Chen",     dba: "Dragon Express Logistics", effective: "02/20/2025", lob: "Commercial Auto",    status: "Pending",               producer: "David Chen" },
  { id: "11", created: "04/05/2025", submissionId: "QAN135792468",   applicant: "Sarah Johnson",  dba: "BlueSky Consulting",     effective: "04/05/2025", lob: "Professional Liability", status: "Approved",            producer: "Sarah Johnson" },
  { id: "12", created: "11/12/2024", submissionId: "QMWC998877665",  applicant: "Michael Brown",  dba: "Brown & Sons Roofing",   effective: "11/12/2024", lob: "Worker's Comp",        status: "Sold/Issued",           producer: "Michael Brown" },
  { id: "13", created: "09/03/2024", submissionId: "QAA112233445",   applicant: "Linda Wilson",   dba: "Wilson Dental Group",    effective: "09/03/2024", lob: "Professional Liability", status: "Upcoming Renewals",    producer: "Linda Wilson" },
  { id: "14", created: "12/18/2024", submissionId: "QMP778899001",   applicant: "Elvis Prestley", dba: "Prestley Properties",    effective: "12/18/2024", lob: "Property",             status: "Pending",               producer: "Elvis Prestley" },
  { id: "15", created: "10/25/2024", submissionId: "QCY554433221",   applicant: "Jane Smith",     dba: "Smith Tech Solutions",   effective: "10/25/2024", lob: "Cyber Liability",      status: "Sold/Issued",           producer: "Jane Smith" },
  { id: "16", created: "08/14/2024", submissionId: "QBR667788990",   applicant: "Joe Smith",      dba: "Smith Construction Co.", effective: "08/14/2024", lob: "Builder's Risk",       status: "Declined",              producer: "Joe Smith" },
  { id: "17", created: "01/28/2025", submissionId: "QEX445566778",   applicant: "Robert Taylor",  dba: "Taylor Manufacturing",   effective: "01/28/2025", lob: "Excess",               status: "Pending/Action Req.",   producer: "Robert Taylor" },
  { id: "18", created: "04/10/2025", submissionId: "QBD223344556",   applicant: "Amanda Martinez", dba: "Martinez Contracting",  effective: "04/10/2025", lob: "Bonds",                status: "Approved",              producer: "Amanda Martinez" },
  { id: "19", created: "03/22/2025", submissionId: "QEF889900112",   applicant: "Maria Garcia",   dba: "Garcia Landscaping",     effective: "03/22/2025", lob: "Equipment Floater",    status: "Incomplete",            producer: "Maria Garcia" },
  { id: "20", created: "04/18/2025", submissionId: "QAA778899123",   applicant: "David Chen",     dba: "Dragon Express Logistics", effective: "04/18/2025", lob: "General Liability",  status: "Pending",               producer: "David Chen" },
  { id: "21", created: "04/20/2025", submissionId: "QAN334455667",   applicant: "Sarah Johnson",  dba: "BlueSky Consulting",     effective: "04/20/2025", lob: "Worker's Comp",        status: "Add'l Insured Request", producer: "Sarah Johnson" },
  { id: "22", created: "04/21/2025", submissionId: "QMWC556677889",  applicant: "Michael Brown",  dba: "Brown & Sons Roofing",   effective: "04/21/2025", lob: "General Liability",    status: "Sold/Issued",           producer: "Michael Brown" },
];

const ALL_LOBS = ["All LOBs","General Liability","Worker's Comp","Vacant Risks","Business Owners","Professional Liability","Excess","Bonds","Commercial Auto","Property","Cyber Liability","Builder's Risk","Equipment Floater"];
const POLICY_STATUSES = ["All Statuses","Sold/Issued","Pending","Approved","Incomplete","Declined","Add'l Insured Request","Upcoming Renewals","Pending/Action Req."];

type SortKey = "createdDate" | "submissionId" | "dba" | "effectiveDate";

export default function Policies({ isDark }: { isDark: boolean }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [applicantFilter, setApplicantFilter] = useState<Set<string>>(new Set());
  const [applicantOpen, setApplicantOpen] = useState(false);
  const [applicantSearch, setApplicantSearch] = useState("");
  const [lobFilter, setLobFilter] = useState("All LOBs");
  const [lobOpen, setLobOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [statusOpen, setStatusOpen] = useState(false);
  const [producerFilter, setProducerFilter] = useState<Set<string>>(new Set());
  const [producerOpen, setProducerOpen] = useState(false);
  const [producerSearch, setProducerSearch] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const COLUMNS: Array<{ key: string; label: string; width: string }> = [
    { key: "created",      label: "Created",       width: "1fr"    },
    { key: "submissionId", label: "Submission ID", width: "1.4fr"  },
    { key: "applicant",    label: "Applicant",     width: "1.15fr" },
    { key: "dba",          label: "DBA",           width: "1.6fr"  },
    { key: "effective",    label: "Effective",     width: "1.05fr" },
    { key: "lob",          label: "LOB",           width: "1.15fr" },
    { key: "status",       label: "Status",        width: "1.2fr"  },
    { key: "producer",     label: "Producer",      width: "1.15fr" },
  ];
  const visibleCols = COLUMNS.filter(c => !hiddenCols.has(c.key));
  const gridTemplate = visibleCols.map(c => c.width).join(" ");

  // Detail view state
  const [view, setView] = useState<"list" | "detail">("list");
  const [selected, setSelected] = useState<PolicyRow | null>(null);
  const [detailTab, setDetailTab] = useState<"uw" | "docs">("uw");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [actionOpen, setActionOpen] = useState(false);
  const [actionValue, setActionValue] = useState("");
  const [notePanel, setNotePanel] = useState<{ ref: string; date: string; body: string } | null>(null);

  const c = {
    text:         isDark ? "#F9FAFB" : "#1F2937",
    muted:        isDark ? "#8B8FA8" : "#6B7280",
    sub:          isDark ? "#6B7280" : "#9CA3AF",
    cardBg:       isDark ? "#191D35" : "#fff",
    border:       isDark ? "rgba(255,255,255,0.08)" : "#E9EAEC",
    borderStrong: isDark ? "rgba(255,255,255,0.18)" : "#D1D5DB",
    mutedBg:      isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
    hoverBg:      isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
    inputBg:      isDark ? "rgba(255,255,255,0.05)" : "#fff",
    linkColor:    isDark ? "#4ECDC4" : "#A614C3",
  };
  const btnGrad = isDark
    ? "radial-gradient(171.32% 99.33% at 33.13% -9%, #282550 0%, #191735 55.82%, rgba(0,0,0,0.3) 74%, rgba(0,0,0,0) 100%), linear-gradient(88.34deg, #5C2ED4 0.11%, #A614C3 63.8%)"
    : "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)";

  const closeAllDropdowns = () => { setApplicantOpen(false); setLobOpen(false); setStatusOpen(false); setProducerOpen(false); setHelpOpen(false); setViewOpen(false); };
  const toggleSet = (set: Set<string>, v: string, setter: (s: Set<string>) => void) => { const n = new Set(set); n.has(v) ? n.delete(v) : n.add(v); setter(n); };

  const uniqueApplicants = Array.from(new Set(mockPolicies.map(p => p.applicant))).sort();
  const uniqueProducers  = Array.from(new Set(mockPolicies.map(p => p.producer))).sort();

  const filtered = mockPolicies.filter(p => {
    if (search) {
      const q2 = search.toLowerCase();
      if (!(
        p.submissionId.toLowerCase().includes(q2) ||
        p.applicant.toLowerCase().includes(q2) ||
        p.dba.toLowerCase().includes(q2) ||
        p.lob.toLowerCase().includes(q2) ||
        p.producer.toLowerCase().includes(q2)
      )) return false;
    }
    if (applicantFilter.size > 0 && !applicantFilter.has(p.applicant)) return false;
    if (lobFilter !== "All LOBs" && p.lob !== lobFilter) return false;
    if (statusFilter !== "All Statuses" && p.status !== statusFilter) return false;
    if (producerFilter.size > 0 && !producerFilter.has(p.producer)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let av: string | number = ""; let bv: string | number = "";
    if (sortKey === "createdDate")         { av = new Date(a.created).getTime();   bv = new Date(b.created).getTime(); }
    else if (sortKey === "effectiveDate")  { av = new Date(a.effective).getTime(); bv = new Date(b.effective).getTime(); }
    else if (sortKey === "submissionId")   { av = a.submissionId; bv = b.submissionId; }
    else if (sortKey === "dba")            { av = a.dba; bv = b.dba; }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const pageItems = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
  };

  const SortArrows = ({ col }: { col: SortKey }) => (
    <span className="inline-flex ml-0.5">
      <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
        <path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={sortKey === col && sortDir === "asc" ? (isDark ? "#fff" : "#374151") : c.sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={sortKey === col && sortDir === "desc" ? (isDark ? "#fff" : "#374151") : c.sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );

  const FilterCaret = ({ active }: { active: boolean }) => (
    <span className="inline-flex ml-1">
      <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
        <path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={active ? "#A614C3" : c.sub}/>
      </svg>
    </span>
  );

  // ── DETAIL VIEW ──
  if (view === "detail" && selected) {
    const expirationDate = (() => {
      const [m, d, y] = selected.effective.split("/");
      return `${m}/${d}/${Number(y) + 1}`;
    })();

    const statusColorMap: Record<string, string> = {
      "Sold/Issued": "#10B981",
      "Approved": "#10B981",
      "Pending": "#F59E0B",
      "Incomplete": "#F59E0B",
      "Declined": "#EF4444",
      "Pending/Action Req.": "#EF4444",
      "Add'l Insured Request": "#A855F7",
      "Upcoming Renewals": "#F97316",
    };
    const statusClr = statusColorMap[selected.status] ?? c.muted;

    // Deterministic mock data per policy id — some have docs/comments, some don't
    const idNum = Number(selected.id);
    const hasComments = idNum % 2 === 1; // odd ids
    const hasDocs = idNum % 3 !== 0;     // not divisible by 3

    const mockComments = hasComments ? [
      { id: "c1", date: "11/20/2024 2:09:48 PM", ref: "PCN03262409" },
      { id: "c2", date: "11/20/2024 2:09:48 PM", ref: "PCN03262409" },
      { id: "c3", date: "11/20/2024 2:09:48 PM", ref: "PCN03262409" },
    ] : [];
    const mockDocs = hasDocs ? [
      { id: "d1", name: "Policy Document.pdf",  type: "Policy",       date: "11/20/2024 2:09:48 PM" },
      { id: "d2", name: "Declarations.pdf",     type: "Declaration",  date: "11/20/2024 2:09:48 PM" },
      { id: "d3", name: "Endorsement Form.pdf", type: "Endorsement",  date: "11/20/2024 2:09:48 PM" },
    ] : [];

    const rowBg = c.mutedBg;
    const toggleComment = (id: string) => {
      const n = new Set(expandedComments);
      n.has(id) ? n.delete(id) : n.add(id);
      setExpandedComments(n);
    };

    return (
      <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: FONT }} onClick={() => setActionOpen(false)}>
        {/* Section title */}
        <div className="flex flex-col justify-center flex-shrink-0 mb-12"
          style={{ height: 71, borderBottom: `0.87px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB"}`, marginLeft: -48, marginRight: -48, paddingLeft: 28, paddingRight: 28 }}>
          <h1 className="text-[22px] font-normal" style={{ fontFamily: FONT, color: c.text }}>Policies</h1>
        </div>

        {/* Back button */}
        <div className="flex-shrink-0 mb-3">
          <button onClick={() => { setView("list"); setSelected(null); setActionValue(""); setExpandedComments(new Set()); }}
            className="flex items-center gap-1.5 text-[12px] font-medium transition-colors"
            style={{ fontFamily: FONT, color: c.muted }}
            onMouseEnter={e => (e.currentTarget.style.color = c.text)}
            onMouseLeave={e => (e.currentTarget.style.color = c.muted)}>
            <ChevronLeft className="w-4 h-4" />Back to Policies
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto" style={{ marginLeft: -4, marginRight: -4, paddingLeft: 4, paddingRight: 4, paddingBottom: 48 }}>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: isDark ? "none" : "0 1px 3px rgba(15,23,42,0.04)" }}>
            <div style={{ height: 4, background: "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)" }} />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-8 pt-7 pb-6">
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-[22px] font-bold leading-tight" style={{ fontFamily: FONT, color: c.text }}>{selected.dba}</h1>
                  <span className="inline-flex items-center px-3 py-[3px] rounded-full text-[11px] font-semibold"
                    style={{ fontFamily: FONT, color: statusClr, background: `${statusClr}1A` }}>
                    {selected.status}
                  </span>
                </div>
                <p className="text-[13px] mt-1" style={{ fontFamily: FONT, color: c.muted }}>
                  {selected.lob} · <span style={{ color: c.linkColor, fontWeight: 600 }}>{selected.submissionId}</span>
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="relative" style={{ width: 220 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => setActionOpen(o => !o)}
                    className="w-full flex items-center justify-between gap-2 transition-colors outline-none"
                    style={{ fontFamily: FONT, background: c.inputBg, border: `1px solid ${c.border}`, color: actionValue ? c.text : c.sub, padding: "9px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer" }}>
                    <span>{actionValue || "I would like to..."}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${actionOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                  </button>
                  {actionOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg shadow-lg overflow-hidden"
                      style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                      {["Reassign Producer", "Edit/Issue"].map(a => (
                        <button key={a} onClick={() => { setActionValue(a); setActionOpen(false); }}
                          className="w-full text-left px-3 py-2 text-[13px] transition-colors"
                          style={{ fontFamily: FONT, color: c.text }}
                          onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          {a}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="flex items-center gap-2 text-[13px] font-semibold text-white"
                  style={{ fontFamily: FONT, background: btnGrad, padding: "9px 18px", borderRadius: 10, transition: "filter 0.15s", boxShadow: "0 4px 14px rgba(166,20,195,0.25)" }}
                  onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.12)")}
                  onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                  <Plus className="w-4 h-4" />Start a Quote
                </button>
              </div>
            </div>

            {/* Info row */}
            <div className="px-8 py-6 grid" style={{ borderTop: `1px solid ${c.border}`, background: c.cardBg, gridTemplateColumns: "repeat(4, 1fr)" }}>
              {[
                { label: "Effective Date",  value: selected.effective },
                { label: "Expiration Date", value: expirationDate },
                { label: "Producer",        value: selected.producer },
                { label: "Total Premium",   value: "$40,000" },
              ].map((f, i, arr) => (
                <div key={f.label} className="px-6 first:pl-0" style={i !== arr.length - 1 ? { borderRight: `1px solid ${c.border}` } : undefined}>
                  <div className="text-[11px] uppercase mb-1.5" style={{ fontFamily: FONT, color: c.muted, fontWeight: 600, letterSpacing: "0.06em" }}>{f.label}</div>
                  <div className="text-[16px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>{f.value}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-8" style={{ borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
              {([
                { k: "uw" as const,   label: "UW Comments", Icon: MessageCircle, iconSize: "w-[13.5px] h-[13.5px]" },
                { k: "docs" as const, label: "Documents",   Icon: FolderOpen,   iconSize: "w-[15px] h-[15px]" },
              ]).map(({ k, label, Icon, iconSize }) => (
                <button key={k} onClick={() => setDetailTab(k)}
                  className="flex items-center gap-1.5 px-4 py-3 text-[13px] font-normal relative transition-colors"
                  style={{ fontFamily: FONT, color: detailTab === k ? (isDark ? "#fff" : "#A614C3") : c.muted, letterSpacing: "0.01em" }}
                  onMouseEnter={e => { if (detailTab !== k) e.currentTarget.style.color = c.text; }}
                  onMouseLeave={e => { if (detailTab !== k) e.currentTarget.style.color = c.muted; }}>
                  <Icon className={iconSize} style={{ color: detailTab === k ? "#A614C3" : undefined }} />
                  {label}
                  {detailTab === k && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)" }} />}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="px-8 py-6">
              {detailTab === "uw" && (
                mockComments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 rounded-xl" style={{ background: rowBg, border: `1px dashed ${c.border}` }}>
                    <div className="flex items-center justify-center mb-4" style={{ width: 56, height: 56, borderRadius: 999, background: isDark ? "rgba(255,255,255,0.04)" : "#fff", border: `1px solid ${c.border}` }}>
                      <MessageCircle className="w-6 h-6" style={{ color: c.muted, opacity: 0.6 }} />
                    </div>
                    <span className="text-[14px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>No underwriting comments yet</span>
                    <span className="text-[12px] mt-1" style={{ fontFamily: FONT, color: c.muted }}>Comments from underwriters will appear here when available</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {mockComments.map(cm => {
                      const expanded = expandedComments.has(cm.id);
                      const body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                      return (
                        <div key={cm.id} className="rounded-lg overflow-hidden"
                          style={{ background: rowBg, border: `1px solid ${c.border}` }}>
                          <button onClick={() => toggleComment(cm.id)}
                            className="w-full flex items-center justify-between px-6 py-3.5 text-left">
                            <div className="flex items-center gap-16">
                              <span className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{cm.date}</span>
                              <span className="text-[13px] font-semibold" style={{ fontFamily: FONT, color: c.linkColor }}>{cm.ref}</span>
                            </div>
                            {expanded
                              ? <Minus className="w-4 h-4" style={{ color: "#A614C3" }} />
                              : <Plus  className="w-4 h-4" style={{ color: "#A614C3" }} />}
                          </button>
                          {expanded && (
                            <div className="mx-4 mb-4 rounded-lg overflow-hidden" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                                <div className="text-[12px] font-semibold uppercase" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.08em" }}>Text of Email</div>
                                <div className="flex items-center gap-4">
                                  <button className="flex items-center gap-1.5 text-[12px] font-semibold transition-opacity hover:opacity-70" style={{ fontFamily: FONT, color: "#A614C3", letterSpacing: "0.06em" }}>
                                    <Printer className="w-4 h-4" />PRINT
                                  </button>
                                  <button onClick={() => setNotePanel({ ref: cm.ref, date: cm.date, body })} className="transition-opacity hover:opacity-70">
                                    <Maximize2 className="w-4 h-4" style={{ color: "#A614C3" }} />
                                  </button>
                                </div>
                              </div>
                              <div className="px-5 py-4 text-[13px] leading-relaxed" style={{ fontFamily: FONT, color: c.text }}>
                                {body}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}
              {detailTab === "docs" && (
                mockDocs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 rounded-xl" style={{ background: rowBg, border: `1px dashed ${c.border}` }}>
                    <div className="flex items-center justify-center mb-4" style={{ width: 56, height: 56, borderRadius: 999, background: isDark ? "rgba(255,255,255,0.04)" : "#fff", border: `1px solid ${c.border}` }}>
                      <FolderOpen className="w-6 h-6" style={{ color: c.muted, opacity: 0.6 }} />
                    </div>
                    <span className="text-[14px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>No documents available</span>
                    <span className="text-[12px] mt-1" style={{ fontFamily: FONT, color: c.muted }}>Policy documents will appear here once issued</span>
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                    <div className="grid px-5 py-3 gap-4" style={{ gridTemplateColumns: "1fr 1fr 1fr 60px", borderBottom: `1px solid ${c.border}`, background: c.mutedBg }}>
                      {["Document Name", "Type", "Date", "View"].map((h, i) => (
                        <div key={i} className="text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily: FONT, color: c.muted, textAlign: i === 3 ? "center" : "left" }}>{h}</div>
                      ))}
                    </div>
                    {mockDocs.map((d, i, arr) => (
                      <div key={d.id} className="grid px-5 py-3.5 items-center gap-4 transition-colors"
                        style={{ gridTemplateColumns: "1fr 1fr 1fr 60px", borderBottom: i !== arr.length - 1 ? `1px solid ${c.border}` : "none" }}
                        onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.1)" }}>
                            <FileText className="w-4 h-4" style={{ color: "#EF4444" }} />
                          </div>
                          <span className="text-[13px] font-medium truncate" style={{ fontFamily: FONT, color: c.text }}>{d.name}</span>
                        </div>
                        <div className="text-[12px] px-2 py-0.5 rounded-lg" style={{ fontFamily: FONT, color: isDark ? "#4ECDC4" : "#A614C3", background: "rgba(168,85,247,0.08)", display: "inline-block", width: "fit-content" }}>{d.type}</div>
                        <div className="text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>{d.date}</div>
                        <button title="View" className="flex items-center justify-center transition-opacity hover:opacity-70" style={{ color: "#A614C3" }}>
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Side note panel */}
        {notePanel && (
          <>
            <div onClick={() => setNotePanel(null)}
              className="fixed inset-0 z-40 transition-opacity"
              style={{ background: "rgba(0,0,0,0.35)" }} />
            <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
              style={{ width: 480, maxWidth: "90vw", background: c.cardBg, borderLeft: `1px solid ${c.border}`, boxShadow: "-8px 0 30px rgba(0,0,0,0.12)" }}>
              <div className="flex items-center justify-between px-6 pt-6 pb-5 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider" style={{ fontFamily: FONT, color: c.muted, fontWeight: 600, letterSpacing: "0.08em" }}>Text of Email</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[13px] font-semibold" style={{ fontFamily: FONT, color: c.linkColor }}>{notePanel.ref}</span>
                    <span className="text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>{notePanel.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button className="flex items-center gap-1.5 text-[12px] font-semibold transition-opacity hover:opacity-70" style={{ fontFamily: FONT, color: "#A614C3", letterSpacing: "0.06em" }}>
                    <Printer className="w-4 h-4" />PRINT
                  </button>
                  <button onClick={() => setNotePanel(null)} className="p-1 rounded-md transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <X className="w-4 h-4" style={{ color: c.muted }} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pt-8 pb-6 text-[14px] leading-relaxed" style={{ fontFamily: FONT, color: c.text }}>
                {notePanel.body}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: FONT }} onClick={closeAllDropdowns}>
      {/* Section title */}
      <div className="flex flex-col justify-center flex-shrink-0 mb-12"
        style={{ height: 71, borderBottom: `0.87px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB"}`, marginLeft: -48, marginRight: -48, paddingLeft: 28, paddingRight: 28 }}>
        <h1 className="text-[22px] font-normal" style={{ fontFamily: FONT, color: c.text }}>Policies</h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <div className="flex items-stretch overflow-hidden transition-colors"
          style={{ background: c.cardBg, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, borderRadius: 10 }}>
          <input placeholder="Search Policies" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="outline-none px-4 py-2 text-[13px]"
            style={{ fontFamily: FONT, background: "transparent", color: c.text, width: 160, borderRadius: "10px 0 0 10px" }} />
          <button className="flex items-center gap-1.5 px-4 text-[12px] font-semibold text-white flex-shrink-0"
            style={{ background: btnGrad, fontFamily: FONT, borderRadius: "0 7px 7px 0", transition: "filter 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.12)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
            <Search className="w-3.5 h-3.5" />Search
          </button>
        </div>

        <div className="relative">
          <select className="appearance-none pl-3 pr-8 py-2 outline-none cursor-pointer"
            style={{ fontFamily: FONT, background: `linear-gradient(${c.cardBg},${c.cardBg}) padding-box, linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%) border-box`, border: "1px solid transparent", color: c.text, fontSize: 11, fontWeight: 500, borderRadius: 7 }}>
            <option>Past 20 Days</option><option>Past 60 Days</option><option>Past 90 Days</option><option>All Time</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: c.muted }} />
        </div>

        {/* Help dropdown */}
        <div className="relative" style={{ width: 260, height: 36 }} onClick={e => e.stopPropagation()}>
          <div className="absolute left-0 right-0 top-0 z-30 overflow-hidden transition-all flex flex-col items-center"
            style={{
              background: c.cardBg,
              border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`,
              borderRadius: 10,
              padding: "8px 14px",
              gap: 8,
              boxShadow: helpOpen ? "0 10px 30px rgba(0,0,0,0.08)" : "none",
              boxSizing: "border-box",
            }}>
            <button onClick={() => { setApplicantOpen(false); setLobOpen(false); setStatusOpen(false); setProducerOpen(false); setHelpOpen(o => !o); }}
              className="w-full flex items-center justify-between gap-3 text-left transition-colors"
              style={{ fontFamily: FONT, color: c.text, background: "transparent", border: "none", padding: 0, cursor: "pointer" }}>
              <span className="text-[13px] tracking-tight whitespace-nowrap" style={{ fontWeight: 400 }}>Need help finding something?</span>
              {helpOpen
                ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: c.muted }} />
                : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: c.muted }} />}
            </button>

            {helpOpen && (
              <>
                <div className="w-full text-[12px]" style={{ fontFamily: FONT, color: c.muted, marginTop: -6 }}>Reach out, we're here to help.</div>
                {[
                  { icon: MessageSquare, title: "Start a Chat", sub: "Get instant help", subColor: c.muted },
                  { icon: Mail,          title: "Send Email",  sub: "We'll respond soon", subColor: c.muted },
                  { icon: Phone,         title: "Call Us",     sub: "877-649-6682", subColor: "#A614C3" },
                ].map(({ icon: Icon, title, sub, subColor }) => (
                  <button key={title}
                    className="flex items-center gap-3 w-full text-left rounded-xl transition-colors"
                    style={{ fontFamily: FONT, border: `1px solid ${c.border}`, padding: "10px 12px", background: "transparent" }}
                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <div className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 34, height: 34, borderRadius: 8, background: isDark ? "rgba(166,20,195,0.15)" : "rgba(166,20,195,0.08)" }}>
                      <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} style={{ stroke: "url(#helpIconGradPolicy)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>{title}</div>
                      <div className="text-[12px]" style={{ fontFamily: FONT, color: subColor }}>{sub}</div>
                    </div>
                  </button>
                ))}
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <linearGradient id="helpIconGradPolicy" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#5C2ED4" />
                      <stop offset="100%" stopColor="#A614C3" />
                    </linearGradient>
                  </defs>
                </svg>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 ml-1" style={{ borderLeft: `1px solid ${c.border}`, paddingLeft: 10 }}>
          <button title="Reset filters" onClick={() => { setSearch(""); setSortKey("createdDate"); setSortDir("desc"); setPage(1); setItemsPerPage(10); setApplicantFilter(new Set()); setApplicantSearch(""); setLobFilter("All LOBs"); setStatusFilter("All Statuses"); setProducerFilter(new Set()); setProducerSearch(""); setHiddenCols(new Set()); closeAllDropdowns(); }}
            className="p-2 rounded-lg transition-colors" style={{ color: "#A614C3" }}
            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button title="View columns" onClick={() => { closeAllDropdowns(); setViewOpen(o => !o); }}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "#A614C3", background: viewOpen ? c.hoverBg : "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = viewOpen ? c.hoverBg : "transparent")}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="2" y="2" rx="1"/><rect width="5" height="5" x="9.5" y="2" rx="1"/><rect width="5" height="5" x="17" y="2" rx="1"/><rect width="5" height="5" x="2" y="9.5" rx="1"/><rect width="5" height="5" x="9.5" y="9.5" rx="1"/><rect width="5" height="5" x="17" y="9.5" rx="1"/><rect width="5" height="5" x="2" y="17" rx="1"/><rect width="5" height="5" x="9.5" y="17" rx="1"/><rect width="5" height="5" x="17" y="17" rx="1"/></svg>
            </button>
            {viewOpen && (
              <div className="absolute right-0 top-full mt-1 z-30 w-[220px] rounded-xl shadow-xl overflow-hidden"
                style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                <div className="px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold"
                  style={{ fontFamily: FONT, color: c.muted, borderBottom: `1px solid ${c.border}`, letterSpacing: "0.06em" }}>
                  Show Columns
                </div>
                <div className="py-1.5 max-h-[280px] overflow-y-auto">
                  {COLUMNS.map(col => {
                    const visible = !hiddenCols.has(col.key);
                    return (
                      <label key={col.key} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors"
                        onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        onClick={() => setHiddenCols(prev => { const s = new Set(prev); s.has(col.key) ? s.delete(col.key) : s.add(col.key); return s; })}>
                        <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                          style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                          {visible && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>{col.label}</span>
                      </label>
                    );
                  })}
                </div>
                <button onClick={() => setHiddenCols(new Set())}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors"
                  style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <RefreshCw className="w-3.5 h-3.5" />Show All
                </button>
              </div>
            )}
          </div>
          <button title="Export" className="p-2 rounded-lg transition-colors" style={{ color: "#A614C3" }}
            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <Download className="w-4 h-4" />
          </button>
        </div>

        <button
          className="flex items-center gap-2 text-[13px] font-semibold text-white flex-shrink-0 ml-auto"
          style={{ fontFamily: FONT, background: btnGrad, padding: "9px 18px", borderRadius: 10, transition: "filter 0.15s", boxShadow: "0 4px 14px rgba(166,20,195,0.25)" }}
          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.12)")}
          onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
          <Plus className="w-4 h-4" />Start a Quote
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl flex flex-col flex-1 min-h-0" style={{ background: c.cardBg, border: `1px solid ${c.border}`, marginBottom: 48 }}>
        <div className="grid px-5 py-3 gap-4" style={{ gridTemplateColumns: gridTemplate, borderBottom: `1px solid ${c.border}`, background: c.mutedBg }}>
          {/* Created */}
          {!hiddenCols.has("created") && (
          <button onClick={e => { e.stopPropagation(); toggleSort("createdDate"); }}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left"
            style={{ fontFamily: FONT, color: c.muted }}>
            Created<SortArrows col="createdDate" />
          </button>
          )}
          {/* Submission ID */}
          {!hiddenCols.has("submissionId") && (
          <button onClick={e => { e.stopPropagation(); toggleSort("submissionId"); }}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left"
            style={{ fontFamily: FONT, color: c.muted }}>
            Submission ID<SortArrows col="submissionId" />
          </button>
          )}
          {/* Applicant filter */}
          {!hiddenCols.has("applicant") && (
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => { closeAllDropdowns(); setApplicantOpen(o => !o); }}
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none"
              style={{ fontFamily: FONT, color: applicantFilter.size > 0 ? "#A614C3" : c.muted }}>
              Applicant<FilterCaret active={applicantFilter.size > 0} />
            </button>
            {applicantOpen && (
              <div className="absolute top-full mt-1 z-30 rounded-xl shadow-lg overflow-hidden min-w-[220px]"
                style={{ background: c.cardBg, border: `1px solid ${c.border}`, left: -50 }}>
                <div className="p-2" style={{ borderBottom: `1px solid ${c.border}` }}>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                    style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#F9FAFB", border: `1px solid ${c.border}` }}>
                    <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                    <input value={applicantSearch} onChange={e => setApplicantSearch(e.target.value)} placeholder="Search Agent"
                      className="outline-none text-[12px] flex-1 bg-transparent" style={{ fontFamily: FONT, color: c.text }} />
                  </div>
                </div>
                <div className="px-3 py-2" style={{ borderBottom: `1px solid ${c.border}` }}>
                  <button className="flex items-center gap-2 text-[12px] w-full text-left" style={{ fontFamily: FONT, color: c.text }}
                    onClick={() => { const all = uniqueApplicants; setApplicantFilter(applicantFilter.size === all.length ? new Set() : new Set(all)); }}>
                    <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                      style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                      {applicantFilter.size === uniqueApplicants.length && uniqueApplicants.length > 0 &&
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    Select All
                  </button>
                </div>
                <div className="max-h-[180px] overflow-y-auto py-1">
                  {uniqueApplicants.filter(a => !applicantSearch || a.toLowerCase().includes(applicantSearch.toLowerCase())).map(applicant => (
                    <button key={applicant} className="flex items-center gap-2 px-3 py-1.5 text-[12px] w-full text-left transition-colors"
                      style={{ fontFamily: FONT, color: c.text }}
                      onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      onClick={() => toggleSet(applicantFilter, applicant, setApplicantFilter)}>
                      <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                        style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                        {applicantFilter.has(applicant) &&
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      {applicant}
                    </button>
                  ))}
                </div>
                <button onClick={() => { setApplicantFilter(new Set()); setApplicantSearch(""); }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors"
                  style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                </button>
              </div>
            )}
          </div>
          )}
          {/* DBA */}
          {!hiddenCols.has("dba") && (
          <button onClick={e => { e.stopPropagation(); toggleSort("dba"); }}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left pl-[5px]"
            style={{ fontFamily: FONT, color: c.muted }}>
            DBA<SortArrows col="dba" />
          </button>
          )}
          {/* Effective */}
          {!hiddenCols.has("effective") && (
          <button onClick={e => { e.stopPropagation(); toggleSort("effectiveDate"); }}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left pl-[5px]"
            style={{ fontFamily: FONT, color: c.muted }}>
            Effective<SortArrows col="effectiveDate" />
          </button>
          )}
          {/* LOB filter */}
          {!hiddenCols.has("lob") && (
          <div className="relative pl-[15px]" onClick={e => e.stopPropagation()}>
            <button onClick={() => { closeAllDropdowns(); setLobOpen(o => !o); }}
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none"
              style={{ fontFamily: FONT, color: lobFilter !== "All LOBs" ? "#A614C3" : c.muted }}>
              LOB<FilterCaret active={lobFilter !== "All LOBs"} />
            </button>
            {lobOpen && (
              <div className="absolute left-0 top-full mt-1 z-20 rounded-xl shadow-lg overflow-hidden min-w-[200px] max-h-[280px] overflow-y-auto"
                style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                {ALL_LOBS.map(lob => (
                  <button key={lob} onClick={() => { setLobFilter(lob); setLobOpen(false); }}
                    className="w-full text-left px-3 py-2 text-[12px] transition-colors flex items-center justify-between gap-2"
                    style={{ fontFamily: FONT, color: lobFilter === lob ? "#A614C3" : c.text, fontWeight: lobFilter === lob ? 600 : 400, background: lobFilter === lob ? "rgba(168,85,247,0.08)" : "transparent" }}
                    onMouseEnter={e => (e.currentTarget.style.background = lobFilter === lob ? "rgba(168,85,247,0.12)" : c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = lobFilter === lob ? "rgba(168,85,247,0.08)" : "transparent")}>
                    <span>{lob}</span>
                    {lobFilter === lob && <svg width="11" height="9" viewBox="0 0 9 7" fill="none" className="flex-shrink-0"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </button>
                ))}
              </div>
            )}
          </div>
          )}
          {/* Status filter */}
          {!hiddenCols.has("status") && (
          <div className="relative pl-[25px]" onClick={e => e.stopPropagation()}>
            <button onClick={() => { closeAllDropdowns(); setStatusOpen(o => !o); }}
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none"
              style={{ fontFamily: FONT, color: statusFilter !== "All Statuses" ? "#A614C3" : c.muted }}>
              Status<FilterCaret active={statusFilter !== "All Statuses"} />
            </button>
            {statusOpen && (
              <div className="absolute left-0 top-full mt-1 z-20 rounded-xl shadow-lg overflow-hidden min-w-[200px]"
                style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                {POLICY_STATUSES.map(status => (
                  <button key={status} onClick={() => { setStatusFilter(status); setStatusOpen(false); }}
                    className="w-full text-left px-3 py-2 text-[12px] transition-colors flex items-center justify-between gap-2"
                    style={{ fontFamily: FONT, color: statusFilter === status ? "#A614C3" : c.text, fontWeight: statusFilter === status ? 600 : 400, background: statusFilter === status ? "rgba(168,85,247,0.08)" : "transparent" }}
                    onMouseEnter={e => (e.currentTarget.style.background = statusFilter === status ? "rgba(168,85,247,0.12)" : c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = statusFilter === status ? "rgba(168,85,247,0.08)" : "transparent")}>
                    <span>{status}</span>
                    {statusFilter === status && <svg width="11" height="9" viewBox="0 0 9 7" fill="none" className="flex-shrink-0"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </button>
                ))}
              </div>
            )}
          </div>
          )}
          {/* Producer filter */}
          {!hiddenCols.has("producer") && (
          <div className="relative pl-[25px]" onClick={e => e.stopPropagation()}>
            <button onClick={() => { closeAllDropdowns(); setProducerOpen(o => !o); }}
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none"
              style={{ fontFamily: FONT, color: producerFilter.size > 0 ? "#A614C3" : c.muted }}>
              Producer<FilterCaret active={producerFilter.size > 0} />
            </button>
            {producerOpen && (
              <div className="absolute top-full mt-1 z-30 rounded-xl shadow-lg overflow-hidden min-w-[220px]"
                style={{ background: c.cardBg, border: `1px solid ${c.border}`, left: -50 }}>
                <div className="p-2" style={{ borderBottom: `1px solid ${c.border}` }}>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                    style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#F9FAFB", border: `1px solid ${c.border}` }}>
                    <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                    <input value={producerSearch} onChange={e => setProducerSearch(e.target.value)} placeholder="Search Agent"
                      className="outline-none text-[12px] flex-1 bg-transparent" style={{ fontFamily: FONT, color: c.text }} />
                  </div>
                </div>
                <div className="px-3 py-2" style={{ borderBottom: `1px solid ${c.border}` }}>
                  <button className="flex items-center gap-2 text-[12px] w-full text-left" style={{ fontFamily: FONT, color: c.text }}
                    onClick={() => { const all = uniqueProducers; setProducerFilter(producerFilter.size === all.length ? new Set() : new Set(all)); }}>
                    <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                      style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                      {producerFilter.size === uniqueProducers.length && uniqueProducers.length > 0 &&
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    Select All
                  </button>
                </div>
                <div className="max-h-[180px] overflow-y-auto py-1">
                  {uniqueProducers.filter(p => !producerSearch || p.toLowerCase().includes(producerSearch.toLowerCase())).map(producer => (
                    <button key={producer} className="flex items-center gap-2 px-3 py-1.5 text-[12px] w-full text-left transition-colors"
                      style={{ fontFamily: FONT, color: c.text }}
                      onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      onClick={() => toggleSet(producerFilter, producer, setProducerFilter)}>
                      <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                        style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                        {producerFilter.has(producer) &&
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      {producer}
                    </button>
                  ))}
                </div>
                <button onClick={() => { setProducerFilter(new Set()); setProducerSearch(""); }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors"
                  style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                </button>
              </div>
            )}
          </div>
          )}
        </div>
        {/* Rows — no detail navigation */}
        <div className="overflow-y-auto">
          {pageItems.length === 0 ? (
            <div className="py-16 text-center text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>
              No policies found
            </div>
          ) : pageItems.map((p, i, arr) => (
            <div key={p.id} className="grid px-5 py-3.5 items-center gap-4 transition-colors cursor-pointer"
              style={{ gridTemplateColumns: gridTemplate, borderBottom: i !== arr.length - 1 ? `1px solid ${c.border}` : "none" }}
              onClick={() => { setSelected(p); setView("detail"); setDetailTab("uw"); setExpandedComments(new Set()); setActionValue(""); }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              {!hiddenCols.has("created")      && <div className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>{p.created}</div>}
              {!hiddenCols.has("submissionId") && <div className="text-[12px] font-semibold" style={{ fontFamily: FONT, color: c.linkColor }}>{p.submissionId}</div>}
              {!hiddenCols.has("applicant")    && <div className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>{p.applicant}</div>}
              {!hiddenCols.has("dba")          && <div className="text-[12px] pl-[5px]" style={{ fontFamily: FONT, color: c.text }}>{p.dba}</div>}
              {!hiddenCols.has("effective")    && <div className="text-[12px] pl-[5px]" style={{ fontFamily: FONT, color: c.text }}>{p.effective}</div>}
              {!hiddenCols.has("lob")          && <div className="text-[12px] pl-[15px]" style={{ fontFamily: FONT, color: c.text }}>{p.lob}</div>}
              {!hiddenCols.has("status")       && <div className="text-[12px] pl-[25px]" style={{ fontFamily: FONT, color: c.text }}>{p.status}</div>}
              {!hiddenCols.has("producer")     && <div className="text-[12px] pl-[25px]" style={{ fontFamily: FONT, color: c.text }}>{p.producer}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex-shrink-0 mt-auto flex items-center justify-between py-3"
        style={{ marginLeft: "-48px", marginRight: "-48px", marginBottom: "-48px", paddingLeft: "48px", paddingRight: "48px", paddingBottom: "16px", borderTop: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "#F9FAFB" }}>
        <div className="flex-1 flex items-center gap-2 text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>
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
