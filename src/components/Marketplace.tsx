"use client";

import { useState, useEffect } from "react";
import { Lightbulb, ClipboardCheck, ChevronRight, Sparkles, ExternalLink, X, User, Home, Key, HeartHandshake, Trophy, Heart, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// 3×3 dot grid — the "apps" affordance shown in the design; lucide's LayoutGrid
// is 4 squares (2×2), not what we want here.
function DotGridIcon({ className, color }: { className?: string; color: string }) {
  const dots = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      dots.push(<circle key={`${r}-${c}`} cx={4 + c * 4} cy={4 + r * 4} r={1.7} fill={color} />);
    }
  }
  return (
    <svg className={className} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {dots}
    </svg>
  );
}

interface MarketplaceProps {
  isDark?: boolean;
}

// Left-column tiles. `icon` is the base filename in /public/insurance-icons/;
// dark variant is inferred as "<icon> Dark.png" unless `noDark` is true.
// `isNew` opts the tile into a "New" pill badge in the top-right corner —
// currently on the three shop-flow tiles (Inland Marine + the two newly-
// added personal/affinity lines).
const CATEGORIES: { label: string; icon: string; noDark?: boolean; isNew?: boolean }[] = [
  { label: "Contractor General Liability", icon: "General Liability" },
  { label: "Worker's Comp",                icon: "Workers Comp", noDark: true },
  { label: "Non-Contractors GL/BOP",       icon: "Business Owners" },
  { label: "Excess",                       icon: "Excess" },
  { label: "Bonds",                        icon: "Bonds", noDark: true },
  { label: "Commercial Auto",              icon: "Commercial Auto" },
  { label: "Lessor's Risk",                icon: "Lessor's Risk" },
  { label: "Professional Liability",       icon: "Professional Liability" },
  { label: "Cannabis",                     icon: "Cannabis" },
  { label: "Home Based Business",          icon: "Home Based Business" },
  { label: "Pollution Liability",          icon: "Pollution" },
  { label: "Builders Risk",                icon: "Builders Risk" },
  { label: "Inland Marine",                icon: "Inland Marine",           isNew: true },
  { label: "Boat/Marina Contractors GL",   icon: "Marine Contractors" },
  { label: "Cyber Risk",                   icon: "Cyber" },
  { label: "Vacant Risks",                 icon: "Vacant Risks" },
  { label: "Special Events",               icon: "Special Events", noDark: true },
  { label: "Truckers GL",                  icon: "Truckers GL" },
  // Dedicated light + dark art shipped for both.
  { label: "Personal Lines",               icon: "Personal Lines",          isNew: true },
  { label: "Non-Profit Risks",             icon: "Affinity Lines",          isNew: true },
];

type PromoCategory = "Products" | "Contests" | "Promotions" | "Learning";

// The right column is a curated editorial feed, not a rotating carousel. The
// first item is the featured "hero" (gradient card); the rest render as a
// compact "More this week" list so the pattern scales cleanly from 1 to N
// without pagination dots. The category tabs above the mini list toggle which
// non-hero items are visible; the hero itself stays fixed.
const HIGHLIGHTS: {
  category: PromoCategory;
  tag: string;
  tagColor: string;
  title: string;
  body: string;
  cta: string;
  // Hero-specific — only the first entry uses this gradient
  gradient?: string;
  // Full promo art in /public/marketplace-promos/. When present, fills the
  // mini-card left tile edge-to-edge or sits behind the hero's overlay.
  // Absent on mock promos, which fall back to `imageGradient` + `thumb`.
  image?: string;
  // Per-card object-position override for the mini-tile crop.
  imagePosition?: string;
  // Placeholder art for promos without real campaign imagery yet. Rendered
  // as a gradient tile with a centered icon — visually signals "coming soon"
  // vs. the photo-real banner tiles from live campaigns.
  imageGradient?: string;
  thumb?: LucideIcon;
}[] = [
  {
    category: "Contests",
    tag: "CONTEST",
    tagColor: "#5C2ED4",
    title: "Write big. Win Foo Fighters in Vegas.",
    body: "Top binder in GL, WC, Bonds, or BOP between Mar 1 and Aug 1 wins a suite at Allegiant Stadium on Sept 26.",
    cta: "See contest details",
    gradient: "linear-gradient(135deg,#5C2ED4 0%,#7A2FBE 40%,#A614C3 70%,#C8408E 100%)",
    image: "/marketplace-promos/foo-fighters.png",
  },
  {
    category: "Products",
    tag: "NEW BOND",
    tagColor: "#A614C3",
    title: "California MVD dealer bonds",
    body: "$50k used-dealer bond from $400/yr, $10k wholesale from $90/yr. Verifier and yacht broker bonds too.",
    cta: "Quote a bond",
    image: "/marketplace-promos/ca-mvd-bonds.png",
  },
  {
    category: "Products",
    tag: "NEW MARKET",
    tagColor: "#6366F1",
    title: "Non-Contractor GL & BOP marketplace",
    body: "Quote, bind, and issue GL and BOP online across 100+ classes including accounting, retail, food services, and tech.",
    cta: "Explore marketplace",
    image: "/marketplace-promos/bop-marketplace.png",
    // ~86% ≈ 25px focal-point shift left of the default `right center`
    // crop (banner is 900×352 → scales to ~281px in a 96px-wide tile, so
    // 100% - 25px/185px ≈ 86%). The gorilla illustration sits slightly
    // left of the banner's right edge, so the crop lands better there.
    imagePosition: "86% center",
  },
  {
    category: "Products",
    tag: "PRODUCT UPDATE",
    tagColor: "#0EA5A5",
    title: "Brivado adds 17 contractor classes",
    body: "General Liability program expands to specialty trades and hard-to-place contractors with flexible limits up to $2M.",
    cta: "Get a quote",
    image: "/marketplace-promos/brivado-new-classes.png",
  },
  {
    category: "Promotions",
    tag: "PROMO",
    tagColor: "#5C2ED4",
    title: "$50 gift card per WC bind",
    body: "Bind AmTrust or GUARD Workers' Comp between Jul 1 and Sept 30 to earn $50 gift cards. Unlimited earnings, no size caps.",
    cta: "Start quoting",
    image: "/marketplace-promos/wc-gift-cards.png",
  },
  {
    category: "Learning",
    tag: "WEBINAR",
    tagColor: "#3B82F6",
    title: "USLI habitational life-cycle webinar",
    body: "Free 30-min session with Sr. Underwriter Matt McShane on property trends and coverage at every stage. Register to enter for a $100 gift card. July 15, 10 AM PT.",
    cta: "Register now",
    image: "/marketplace-promos/usli-webinar.png",
  },
];

// Ordered filter tabs. "All" sits first so users land on the widest set.
const FILTERS: ("All" | PromoCategory)[] = ["All", "Products", "Contests", "Promotions", "Learning"];

// Category-tuned empty-state copy — leans marketing so a barren tab reads
// as anticipation rather than a dead end.
const EMPTY_STATE_COPY: Record<"All" | PromoCategory, string> = {
  All:        "New drops incoming — stay tuned",
  Products:   "New product updates on the way",
  Contests:   "New contests brewing — stay tuned",
  Promotions: "Fresh perks incoming",
  Learning:   "New training dropping soon",
};

export default function Marketplace({ isDark = false }: MarketplaceProps) {
  const text     = isDark ? "#F9FAFB" : "#1F2937";
  const heading  = isDark ? "#F9FAFB" : "#2D3653";
  const muted    = isDark ? "#8B8FA8" : "#6B7280";
  const subtle   = isDark ? "#8B8FA8" : "#9CA3AF";
  const border   = isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB";
  const cardBg   = isDark ? "#1E2240" : "#FFFFFF";
  const surface  = isDark ? "#191D35" : "#FFFFFF";
  const tileHover = isDark ? "rgba(166,20,195,0.10)" : "rgba(166,20,195,0.06)";

  const [inlandOpen, setInlandOpen] = useState(false);
  const [personalOpen, setPersonalOpen] = useState(false);
  const [affinityOpen, setAffinityOpen] = useState(false);

  return (
    <div
      style={{
        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
        color: text,
      }}
    >
      {/* Page title bar — matches Quotes / Policies: 71px full-bleed strip
          extending past the main's px-12, with 28px inner padding.
          `marginTop: -24` cancels the 24px `paddingTop` the shell adds to non-
          fullHeight pages, so the title sits flush against the TopBar exactly
          like on the Quotes / Policies pages (which run with paddingTop:0). */}
      <div
        className="flex flex-col justify-center flex-shrink-0 mb-12"
        style={{
          height: 71,
          borderBottom: `0.87px solid ${isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"}`,
          marginTop: -24,
          marginLeft: -48,
          marginRight: -48,
          paddingLeft: 28,
          paddingRight: 28,
        }}
      >
        <h1 className="text-[22px] font-normal" style={{ color: heading }}>Marketplace</h1>
      </div>

      {/* Two-column layout — column widths follow the Figma 888 : 600 ratio
          (≈ 1.48 : 1) so the grid and the right rail stay proportional at any width.
          The "Start a new quote…" header lives in its own row so it only spans the
          LEFT column; that lets the tiles grid and the right-side banner start at
          the same y (both anchored to row 2). */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "minmax(0, 888fr) minmax(0, 600fr)",
          gridTemplateRows: "auto auto",
          columnGap: 32,
          rowGap: 0,
        }}
      >
        {/* LEFT header — row 1, column 1 only */}
        <div
          className="mb-5"
          style={{ gridColumn: 1, gridRow: 1 }}
        >
          <h2 className="text-[20px] font-bold leading-tight" style={{ color: heading }}>
            Start a new quote...
          </h2>
          <p className="text-[13px] mt-1" style={{ color: muted }}>
            Select line of business to begin submission
          </p>
        </div>

        {/* RIGHT header — grid/list toggle, right-aligned with the aside below. */}
        <div
          className="mb-5 flex justify-end"
          style={{ gridColumn: 2, gridRow: 1 }}
        >
          <button
            className="rounded-lg flex items-center justify-center transition-colors"
            style={{
              width: 48, height: 48,
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = tileHover)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            aria-label="Grid view"
          >
            <DotGridIcon className="w-6 h-6" color={heading} />
          </button>
        </div>

        {/* LEFT tiles — row 2, column 1. Tiles keep their natural
            (~140px) height regardless of how tall the aside next to them
            grows; `alignSelf: start` opts this cell out of the grid's
            default stretch so tiles no longer inflate to match the
            weekly-highlights column. */}
        <section
          style={{ gridColumn: 1, gridRow: 2, alignSelf: "start" }}
          className="flex flex-col"
        >
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            }}
          >
            {CATEGORIES.map(cat => {
              const iconFile = isDark && !cat.noDark
                ? `/insurance-icons/${cat.icon} Dark.png`
                : `/insurance-icons/${cat.icon}.png`;
              return (
                <button
                  key={cat.label}
                  onClick={
                    cat.label === "Inland Marine"   ? () => setInlandOpen(true)
                    : cat.label === "Personal Lines" ? () => setPersonalOpen(true)
                    : cat.label === "Non-Profit Risks" ? () => setAffinityOpen(true)
                    : undefined
                  }
                  className="group flex flex-col items-center justify-center gap-3 rounded-2xl transition-all cursor-pointer relative"
                  style={{
                    background: cardBg,
                    border: `1px solid ${border}`,
                    padding: "20px 12px",
                    minHeight: 140,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `linear-gradient(${cardBg}, ${cardBg}) padding-box, linear-gradient(to right, #5C2ED4 0%, #A614C3 65%) border-box`;
                    e.currentTarget.style.border = "1px solid transparent";
                    e.currentTarget.style.boxShadow = "0 0 8px rgba(166,20,195,0.35)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = cardBg;
                    e.currentTarget.style.border = `1px solid ${border}`;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {cat.isNew && (
                    <span
                      style={{
                        position: "absolute",
                        // Center of the badge sits on the top-right rounded corner.
                        // Tile has rounded-2xl (16px radius); nudging the badge
                        // half-out both top and right anchors it visually on the arc.
                        top: -9,
                        right: -8,
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#fff",
                        background: "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        padding: "3px 8px",
                        borderRadius: 9999,
                        boxShadow: "0 1px 3px rgba(166,20,195,0.35)",
                      }}
                    >
                      New
                    </span>
                  )}
                  <span
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      width: 60, height: 60,
                      background: isDark ? "rgba(255,255,255,0.06)" : "#EFEFEF",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={iconFile}
                      alt=""
                      style={{ width: 38, height: 38, objectFit: "contain" }}
                    />
                  </span>
                  <span
                    className="text-[12px] font-medium text-center leading-tight px-1"
                    style={{ color: heading }}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* RIGHT — weekly spotlight + quick links + footer. Anchored to row 2 so
            its top edge aligns with the tiles grid rather than the section header.
            HIGHLIGHTS[0] renders as the featured hero; the rest render as a
            compact "More this week" list so the layout scales to N items without
            pagination. */}
        {/* RIGHT rail — placeholder. Real content (This Week's Highlights /
            spotlights) lives in the internal design repo; deliberately
            unpushed here until copy + editorial approvals land. */}
        <aside
          className="flex flex-col items-center justify-center rounded-2xl"
          style={{
            gridColumn: 2,
            gridRow: 2,
            border: `1.5px dashed ${border}`,
            background: cardBg,
            minHeight: 320,
            padding: 32,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: muted,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Placeholder — waiting for approval
          </div>
        </aside>
      </div>

      <InlandMarineModal open={inlandOpen} onClose={() => setInlandOpen(false)} />
      <PortalListModal
        open={personalOpen}
        onClose={() => setPersonalOpen(false)}
        pill="Personal Lines"
        cards={PERSONAL_LINES_CARDS}
      />
      <PortalListModal
        open={affinityOpen}
        onClose={() => setAffinityOpen(false)}
        pill="Non-Profit Risks"
        cards={AFFINITY_LINES_CARDS}
      />
    </div>
  );
}

interface QuickCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  surface: string;
  border: string;
  heading: string;
  muted: string;
}

// Compact horizontal quick action — icon on the left, title + one-line subtitle
// stacked in the middle, chevron on the right. Shorter than a full editorial
// card so the right column's total height matches the left tiles grid.
function QuickCard({ icon, title, subtitle, surface, border, heading, muted }: QuickCardProps) {
  return (
    <a
      href="#"
      className="rounded-xl p-3 flex items-center gap-3 transition-all"
      style={{
        background: surface,
        border: `1px solid ${border}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `linear-gradient(${surface}, ${surface}) padding-box, linear-gradient(to right,#5C2ED4 0%,#A614C3 65%) border-box`;
        e.currentTarget.style.border = "1px solid transparent";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = surface;
        e.currentTarget.style.border = `1px solid ${border}`;
      }}
    >
      <span
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#5C2ED4 0%,#A614C3 65%)" }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-bold leading-tight" style={{ color: heading }}>
          {title}
        </div>
        <div className="text-[11px] mt-0.5 leading-tight truncate" style={{ color: muted }}>
          {subtitle}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "#A614C3" }} strokeWidth={2.25} />
    </a>
  );
}

interface InlandMarineModalProps {
  open: boolean;
  onClose: () => void;
}

// Modal opened from the Inland Marine tile. Structure mirrors the legacy
// index.html #inlandModal: a hero Marketplace card (btis) with partner logos,
// two direct-portal cards (USLI, Great American), then a "New offering"
// divider and a Farm & Agriculture Equipment portal card that funnels into
// the same shop-flow.
function InlandMarineModal({ open, onClose }: InlandMarineModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const cardStyle: React.CSSProperties = {
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    padding: "0 16px",
    height: 72,
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: 25,
    cursor: "pointer",
    transition: "border-color 0.15s ease",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: 16,
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
          width: 512,
          maxWidth: "calc(100% - 32px)",
          maxHeight: "calc(100vh - 40px)",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ padding: "29px 26px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", flexDirection: "column", gap: 19 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ padding: "4px 14px", border: "1.5px solid #A614C3", borderRadius: 15, color: "#A614C3", fontWeight: 500, fontSize: 12, lineHeight: "14px" }}>
              Inland Marine
            </span>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
            >
              <X size={20} strokeWidth={1.8} />
            </button>
          </div>
          <h3 style={{ fontWeight: 400, fontSize: 24, lineHeight: "28px", color: "#101828", margin: 0 }}>
            Where would you like to shop?
          </h3>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px 29px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Marketplace hero card */}
          <div
            style={{ border: "1px solid #E5E7EB", borderRadius: 15, padding: 22, background: "#ffffff", display: "flex", flexDirection: "column", gap: 11, cursor: "pointer", transition: "border-color 0.15s ease" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#A614C3")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#E5E7EB")}
          >
            <div style={{ display: "flex", gap: 18, paddingLeft: 6, alignItems: "flex-start" }}>
              <div style={{ width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/vendor-logos/btis.png" alt="btis" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 80 }}>
                <div style={{ fontWeight: 400, fontSize: 18, lineHeight: "26px", color: "#101828" }}>Inland Marine Marketplace</div>
                <div style={{ fontWeight: 400, fontSize: 12, lineHeight: "16px", color: "#4A5565", marginTop: 2 }}>One app. Multiple quotes. Get options from Great American and Rivet.</div>
              </div>
              <ExternalLink size={19} color="#E3E3E3" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 15 }} />
            </div>
          </div>

          {/* NEW OFFERING divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "2px 0" }}>
            <span style={{ fontWeight: 700, fontSize: 10.5, color: "#ffffff", background: "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)", letterSpacing: "1px", padding: "3px 10px", borderRadius: 3, textTransform: "uppercase" }}>
              New offering
            </span>
            <span style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>

          {/* Farm & Agriculture portal card */}
          <div
            style={cardStyle}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#A614C3")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#E5E7EB")}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#ffffff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 24,
                  fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                  background: "linear-gradient(135deg, #5C2ED4 0%, #A614C3 65%, #A614C3 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                agriculture
              </span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
              <div style={{ fontWeight: 400, fontSize: 14.5, lineHeight: "18px", color: "#101828" }}>Farm &amp; Agriculture Equipment</div>
              <div style={{ fontWeight: 400, fontSize: 12, lineHeight: "16px", color: "#4A5565" }}>Coverage for farm and agricultural equipment.</div>
            </div>
            <ExternalLink size={19} color="#E3E3E3" strokeWidth={1.8} style={{ flexShrink: 0 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shop-flow popup for personal / affinity lines ─────────────────────────
// Both tiles open the same layout: pill header + "Where would you like to
// shop?" question + a vertical list of portal cards. Ported from the legacy
// site (norbielink-legacy-view.vercel.app) with the app's design tokens.
interface PortalCard {
  title: string;
  desc: string;
  Icon?: LucideIcon;
  // Optional escape hatch for icons whose Lucide equivalent doesn't render right
  // with a gradient stroke (e.g. the `h.01` dot-window trick paints nothing when
  // the stroke is `url(#…)` because the sub-pixel path has no bounding box).
  customIcon?: React.ReactNode;
}

// Building icon with proper `<circle>` windows so the gradient stroke actually
// renders — matches the legacy .portal-icon-badge Condominium icon.
const CondoBuildingIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="url(#portalIconGradient)" strokeWidth={1.75}
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M9 22v-4h6v4" />
    {/* Windows painted as solid-purple filled circles (gradient fill on 1.6px
        circles gets swallowed by SVG's per-element bounding box math, so use
        the gradient endpoint color instead). */}
    {[6, 10, 14].map(y => [8, 12, 16].map(x => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" fill="#A614C3" stroke="none" />
    )))}
  </svg>
);

const PERSONAL_LINES_CARDS: PortalCard[] = [
  { title: "Rental Dwellings",        desc: "Landlords, property owners, and real estate investors.", Icon: Home },
  { title: "Renters Coverage (HO4)",  desc: "Apartment renters, tenants, and young professionals.",  Icon: Key },
  { title: "Condominium Unit Owners", desc: "Condo owners, co-op residents & townhome buyers.",      customIcon: CondoBuildingIcon },
];

const AFFINITY_LINES_CARDS: PortalCard[] = [
  { title: "Non-Profit",             desc: "Foundations, religious orgs & community groups.",     Icon: HeartHandshake },
  { title: "Sport Teams",            desc: "Youth leagues, adult rec teams, and tournaments.",    Icon: Trophy },
  { title: "Charities",              desc: "501(c)(3)s, food banks, and fundraising orgs.",       Icon: Heart },
  { title: "Business Associations",  desc: "Chambers, trade groups, and professional networks.",  Icon: Briefcase },
];

interface PortalListModalProps {
  open: boolean;
  onClose: () => void;
  pill: string;
  cards: PortalCard[];
}

function PortalListModal({ open, onClose, pill, cards }: PortalListModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#ffffff",
          border: "1px solid #E5E7EB",
          borderRadius: 16,
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
          width: 512,
          maxWidth: "calc(100% - 32px)",
          maxHeight: "calc(100vh - 40px)",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ padding: "29px 26px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", flexDirection: "column", gap: 19 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ padding: "4px 14px", border: "1.5px solid #A614C3", borderRadius: 15, color: "#A614C3", fontWeight: 500, fontSize: 12, lineHeight: "14px" }}>
              {pill}
            </span>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
            >
              <X size={20} strokeWidth={1.8} />
            </button>
          </div>
          <h3 style={{ fontWeight: 400, fontSize: 24, lineHeight: "28px", color: "#101828", margin: 0 }}>
            Where would you like to shop?
          </h3>
        </div>

        {/* Body — portal cards. Gradient defs sit once inside a zero-size SVG at
            the top so every icon below can reference url(#portalIconGradient) —
            matches the legacy .portal-icon-badge icon stroke gradient. */}
        <div style={{ padding: "16px 20px 29px", display: "flex", flexDirection: "column", gap: 12 }}>
          <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
            <defs>
              <linearGradient id="portalIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5C2ED4" />
                <stop offset="65%" stopColor="#A614C3" />
                <stop offset="100%" stopColor="#A614C3" />
              </linearGradient>
            </defs>
          </svg>
          {cards.map(({ title, desc, Icon, customIcon }) => (
            <div
              key={title}
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                padding: "14px 16px",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                transition: "border-color 0.15s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#A614C3")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#E5E7EB")}
            >
              <div style={{
                width: 44, height: 44, flexShrink: 0, borderRadius: 12,
                background: "#ffffff", border: "1px solid #E5E7EB",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {customIcon
                  ? customIcon
                  : Icon ? <Icon size={22} stroke="url(#portalIconGradient)" strokeWidth={1.75} /> : null}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 14.5, lineHeight: "18px", color: "#101828" }}>{title}</div>
                <div style={{ fontWeight: 400, fontSize: 12, lineHeight: "16px", color: "#4A5565" }}>{desc}</div>
              </div>
              <ExternalLink size={19} color="#E3E3E3" strokeWidth={1.8} style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
