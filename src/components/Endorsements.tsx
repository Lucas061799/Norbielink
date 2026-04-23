"use client";

import { useRef, useState } from "react";
import { Search, ChevronDown, Calendar, Paperclip, X } from "lucide-react";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

type SearchBy = "Policy Number" | "Submission ID" | "Named Insured";
type View = "search" | "form" | "success";

const SEARCH_OPTIONS: SearchBy[] = ["Policy Number", "Submission ID", "Named Insured"];
const LOBS = [
  "General Liability", "Worker's Comp", "Commercial Auto", "Property",
  "Professional Liability", "Cyber Liability", "Builder's Risk", "Bonds",
  "Umbrella", "Business Owners", "Vacant Risks",
];
const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

export default function Endorsements({ isDark }: { isDark: boolean }) {
  const [view, setView] = useState<View>("search");

  const [searchBy, setSearchBy] = useState<SearchBy>("Policy Number");
  const [searchByOpen, setSearchByOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Form state
  const [policyNumber, setPolicyNumber] = useState("");
  const [namedInsured, setNamedInsured] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [lob, setLob] = useState<string[]>([]);
  const [lobOpen, setLobOpen] = useState(false);
  const [state, setState] = useState("");
  const [stateOpen, setStateOpen] = useState(false);
  const [carrierName, setCarrierName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    bananaBg:     isDark ? "rgba(250,204,21,0.12)" : "#FEF9C3",
    bananaBorder: isDark ? "rgba(250,204,21,0.25)" : "#FDE68A",
    bananaText:   isDark ? "#FDE68A" : "#713F12",
  };
  const btnGrad = isDark
    ? "radial-gradient(171.32% 99.33% at 33.13% -9%, #282550 0%, #191735 55.82%, rgba(0,0,0,0.3) 74%, rgba(0,0,0,0) 100%), linear-gradient(88.34deg, #5C2ED4 0.11%, #A614C3 63.8%)"
    : "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)";

  const closeAll = () => { setSearchByOpen(false); setLobOpen(false); setStateOpen(false); };

  const submitReady = policyNumber.trim() && namedInsured.trim() && contactEmail.trim();

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    // Mock: always "not found" — goes to form view
    setView("form");
    if (searchBy === "Policy Number") setPolicyNumber(searchValue);
    if (searchBy === "Named Insured") setNamedInsured(searchValue);
  };

  const handleSubmit = () => {
    if (!submitReady) return;
    setView("success");
  };

  const handleBack = () => {
    setView("search");
  };

  const toggleLob = (v: string) => {
    setLob(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: FONT,
    background: c.inputBg,
    border: `1px solid ${c.border}`,
    color: c.text,
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 13,
    width: "100%",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: FONT,
    color: c.muted,
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 6,
    display: "block",
  };

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: FONT }} onClick={closeAll}>
      {/* Section title */}
      <div className="flex flex-col justify-center flex-shrink-0 mb-12"
        style={{ height: 71, borderBottom: `0.87px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB"}`, marginLeft: -48, marginRight: -48, paddingLeft: 28, paddingRight: 28 }}>
        <h1 className="text-[22px] font-normal" style={{ fontFamily: FONT, color: c.text }}>Endorsements</h1>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto" style={{ paddingBottom: 48 }}>
        {view === "search" && (
          <div className="rounded-2xl overflow-hidden"
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: isDark ? "none" : "0 1px 3px rgba(15,23,42,0.04)" }}>
            <div style={{ height: 4, background: "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)" }} />
            <div className="px-8 py-8">
              <div className="text-[15px] font-semibold mb-1" style={{ color: c.text }}>Find a policy to endorse</div>
              <div className="text-[13px] mb-6" style={{ color: c.muted }}>Search by policy number, submission ID, or insured name.</div>

              <div className="flex items-end gap-3" onClick={e => e.stopPropagation()}>
                <div className="flex-1" style={{ maxWidth: 240 }}>
                  <label style={labelStyle}>Search By</label>
                  <div className="relative">
                    <button onClick={() => { closeAll(); setSearchByOpen(o => !o); }}
                      className="w-full flex items-center justify-between"
                      style={{ ...inputStyle, cursor: "pointer", textAlign: "left" }}>
                      <span>{searchBy}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${searchByOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                    </button>
                    {searchByOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg shadow-lg overflow-hidden"
                        style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        {SEARCH_OPTIONS.map(o => (
                          <button key={o} onClick={() => { setSearchBy(o); setSearchByOpen(false); }}
                            className="w-full text-left px-3 py-2 text-[13px] transition-colors"
                            style={{ fontFamily: FONT, color: c.text }}
                            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            {o}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <label style={labelStyle}>Enter Info</label>
                  <input value={searchValue} onChange={e => setSearchValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                    placeholder="Enter search term"
                    style={inputStyle} />
                </div>

                <button onClick={handleSearch}
                  disabled={!searchValue.trim()}
                  className="flex items-center gap-2 text-[13px] font-semibold text-white transition-all"
                  style={{
                    fontFamily: FONT,
                    background: btnGrad,
                    padding: "10px 28px",
                    borderRadius: 10,
                    opacity: searchValue.trim() ? 1 : 0.5,
                    cursor: searchValue.trim() ? "pointer" : "not-allowed",
                    boxShadow: "0 4px 14px rgba(166,20,195,0.25)",
                  }}
                  onMouseEnter={e => { if (searchValue.trim()) e.currentTarget.style.filter = "brightness(1.08)"; }}
                  onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                  <Search className="w-4 h-4" />Search
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "form" && (
          <div className="flex flex-col gap-5" onClick={e => e.stopPropagation()}>
            {/* Banana banner */}
            <div className="flex items-start justify-between gap-4 rounded-2xl px-6 py-4 overflow-hidden relative"
              style={{ background: c.bananaBg, border: `1px solid ${c.bananaBorder}` }}>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold mb-1" style={{ color: c.bananaText }}>Well, that&apos;s bananas!</div>
                <div className="text-[13px] leading-relaxed" style={{ color: c.bananaText }}>
                  We couldn&apos;t find records matching that policy info. Not all policies are in NorbieLink yet, so just fill out the form below and we&apos;ll get your request to the right team.
                </div>
              </div>
              <div className="text-[36px] flex-shrink-0 leading-none" aria-hidden>🍌</div>
            </div>

            {/* Form card */}
            <div className="rounded-2xl"
              style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: isDark ? "none" : "0 1px 3px rgba(15,23,42,0.04)" }}>
              <div className="px-8 py-8 grid gap-5" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
                {/* Row 1 */}
                <div style={{ gridColumn: "span 3" }}>
                  <label style={labelStyle}>Policy Number</label>
                  <input value={policyNumber} onChange={e => setPolicyNumber(e.target.value)}
                    placeholder="Enter policy number" style={inputStyle} />
                </div>
                <div style={{ gridColumn: "span 3" }}>
                  <label style={labelStyle}>Named Insured</label>
                  <input value={namedInsured} onChange={e => setNamedInsured(e.target.value)}
                    placeholder="Enter insured name" style={inputStyle} />
                </div>

                {/* Row 2 */}
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>Policy Effective Date</label>
                  <div className="relative">
                    <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)}
                      placeholder="YYYY-MM-DD" style={{ ...inputStyle, paddingRight: 38 }} />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: c.muted }} />
                  </div>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>Line of Business</label>
                  <div className="relative">
                    <button onClick={() => { closeAll(); setLobOpen(o => !o); }}
                      className="w-full flex items-center justify-between"
                      style={{ ...inputStyle, cursor: "pointer", textAlign: "left", color: lob.length ? c.text : c.sub }}>
                      <span className="truncate">{lob.length ? `${lob.length} selected` : "Select Line(s) of Business"}</span>
                      <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${lobOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                    </button>
                    {lobOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg shadow-lg overflow-hidden max-h-[240px] overflow-y-auto"
                        style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        {LOBS.map(l => (
                          <button key={l} onClick={() => toggleLob(l)}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-[13px] transition-colors"
                            style={{ fontFamily: FONT, color: c.text }}
                            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                              style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                              {lob.includes(l) && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                            {l}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>State</label>
                  <div className="relative">
                    <button onClick={() => { closeAll(); setStateOpen(o => !o); }}
                      className="w-full flex items-center justify-between"
                      style={{ ...inputStyle, cursor: "pointer", textAlign: "left", color: state ? c.text : c.sub }}>
                      <span>{state || "Select state"}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${stateOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                    </button>
                    {stateOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg shadow-lg overflow-hidden max-h-[240px] overflow-y-auto"
                        style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        {STATES.map(s => (
                          <button key={s} onClick={() => { setState(s); setStateOpen(false); }}
                            className="w-full text-left px-3 py-2 text-[13px] transition-colors"
                            style={{ fontFamily: FONT, color: c.text }}
                            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 3 */}
                <div style={{ gridColumn: "span 6" }}>
                  <label style={labelStyle}>Carrier Name</label>
                  <input value={carrierName} onChange={e => setCarrierName(e.target.value)}
                    placeholder="Enter carrier name" style={inputStyle} />
                </div>

                {/* Row 4 */}
                <div style={{ gridColumn: "span 3" }}>
                  <label style={labelStyle}>Contact Email</label>
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                    placeholder="email@example.com" style={inputStyle} />
                </div>
                <div style={{ gridColumn: "span 3" }}>
                  <label style={labelStyle}>Contact Phone</label>
                  <input value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                    placeholder="(123) 456-7890" style={inputStyle} />
                </div>

                {/* Row 5 */}
                <div style={{ gridColumn: "span 3" }}>
                  <label style={labelStyle}>Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Free text notes (optional)"
                    rows={5}
                    style={{ ...inputStyle, resize: "vertical", minHeight: 140 }} />
                </div>
                <div style={{ gridColumn: "span 3" }}>
                  <label style={labelStyle}>Upload Documents</label>
                  <div
                    onDrop={onDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors"
                    style={{
                      background: c.mutedBg,
                      border: `1.5px dashed ${c.border}`,
                      minHeight: 140,
                      padding: "14px",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#A614C3")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = c.border)}>
                    <Paperclip className="w-5 h-5 mb-2" style={{ color: "#A614C3" }} />
                    <div className="text-[13px] font-semibold" style={{ color: c.text }}>Drag &amp; Drop or Click to Browse</div>
                    <div className="text-[11px] mt-1" style={{ color: c.muted }}>PDF, JPG, PNG · Max 10MB</div>
                    {files.length > 0 && (
                      <div className="mt-3 flex flex-col gap-1 w-full" onClick={e => e.stopPropagation()}>
                        {files.map((f, i) => (
                          <div key={i} className="flex items-center justify-between gap-2 px-2 py-1 rounded"
                            style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                            <span className="text-[12px] truncate" style={{ color: c.text }}>{f.name}</span>
                            <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                              className="flex-shrink-0 p-0.5 rounded hover:opacity-70">
                              <X className="w-3 h-3" style={{ color: c.muted }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" multiple onChange={onFileChange} style={{ display: "none" }} accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button onClick={handleBack}
                className="text-[13px] font-medium transition-colors"
                style={{
                  fontFamily: FONT,
                  background: c.cardBg,
                  border: `1px solid ${c.border}`,
                  color: c.text,
                  padding: "9px 28px",
                  borderRadius: 10,
                  cursor: "pointer",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = c.cardBg)}>
                Back
              </button>
              <button onClick={handleSubmit}
                disabled={!submitReady}
                className="text-[13px] font-semibold text-white transition-all"
                style={{
                  fontFamily: FONT,
                  background: btnGrad,
                  padding: "10px 32px",
                  borderRadius: 10,
                  opacity: submitReady ? 1 : 0.5,
                  cursor: submitReady ? "pointer" : "not-allowed",
                  boxShadow: "0 4px 14px rgba(166,20,195,0.25)",
                }}
                onMouseEnter={e => { if (submitReady) e.currentTarget.style.filter = "brightness(1.08)"; }}
                onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                Submit
              </button>
            </div>
          </div>
        )}

        {view === "success" && (
          <div className="rounded-2xl flex flex-col items-center justify-center text-center"
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: isDark ? "none" : "0 1px 3px rgba(15,23,42,0.04)", padding: "72px 32px" }}>
            <div className="flex items-center justify-center mb-5"
              style={{ width: 64, height: 64, borderRadius: 999, background: "rgba(52,211,153,0.12)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5 9-11" stroke="#A614C3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-[18px] font-bold mb-2" style={{ color: c.text }}>Request submitted</div>
            <div className="text-[13px] mb-6 max-w-md" style={{ color: c.muted }}>
              We received your endorsement request and forwarded it to the right team. You&apos;ll hear back by email.
            </div>
            <button onClick={() => {
              setView("search");
              setSearchValue("");
              setPolicyNumber(""); setNamedInsured(""); setEffectiveDate("");
              setLob([]); setState(""); setCarrierName("");
              setContactEmail(""); setContactPhone(""); setNotes(""); setFiles([]);
            }}
              className="text-[13px] font-semibold text-white"
              style={{
                fontFamily: FONT,
                background: btnGrad,
                padding: "10px 28px",
                borderRadius: 10,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(166,20,195,0.25)",
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.08)")}
              onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
              Start another request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
