"use client";

import { useState } from "react";
import Image from "next/image";
import norbielinkLogo from "@/assets/norbielink-logo.png";
import norbielinkLogoDark from "@/assets/norbielink-logo-dark.png";
import norbieface from "@/assets/norbieface.png";
import jungleBg from "@/assets/sidebar-bg.png";
import {
  LayoutGrid, Sparkles, FileText, Shield,
  Briefcase, CreditCard, BookOpen, FileEdit,
  Wrench, HelpCircle, UserCog, Building2, Globe, ChevronDown, Users,
} from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  hasChevron?: boolean;
  isDark?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, active, badge, hasChevron, isDark, onClick }: NavItemProps) {
  const [hovered, setHovered] = useState(false);

  const getStyle = () => {
    if (active) {
      return isDark
        ? { background: "linear-gradient(to bottom, #191D35 0%, #582A75 48%, #9D37BC 100%)", boxShadow: "inset 0 0 0 1px rgba(166,20,195,0.8), 0 0 8px rgba(166,20,195,0.5)" }
        : { background: "linear-gradient(white,white) padding-box, linear-gradient(to right,#5C2ED4,#A614C3) border-box", border: "1px solid transparent", boxShadow: "0 0 8px rgba(166,20,195,0.4)" };
    }
    if (hovered) {
      return isDark
        ? { background: "linear-gradient(to bottom, #191D35 0%, #582A75 48%, #9D37BC 100%)" }
        : { background: "linear-gradient(white,white) padding-box, linear-gradient(to right,#5C2ED4,#A614C3) border-box", border: "1px solid transparent" };
    }
    return isDark ? {} : { border: "1px solid transparent" };
  };

  const isHoveredDark = hovered && isDark && !active;
  const isActiveDark = active && isDark;
  const iconColor  = isActiveDark ? "#A614C3" : active ? "#A614C3" : isHoveredDark ? "#ffffff" : isDark ? "#8B8FA8" : "#9CA3AF";
  const textColor  = isActiveDark ? "#ffffff" : active ? "#2D3653" : isHoveredDark ? "#ffffff" : isDark ? "#8B8FA8" : "#6B7280";
  const chevronColor = isActiveDark ? "#ffffff" : isHoveredDark ? "#ffffff" : isDark ? "#8B8FA8" : "#9CA3AF";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center gap-3 px-3 py-[7px] rounded-xl text-left transition-all cursor-pointer"
      style={getStyle()}
    >
      <span className="w-[18px] h-[18px] flex-shrink-0" style={{ color: iconColor }}>
        {icon}
      </span>
      <span className="flex-1 font-medium text-[13px] whitespace-nowrap truncate" style={{ color: textColor }}>
        {label}
      </span>
      {badge && (
        isDark ? (
          <span
            className="text-[10px] font-semibold px-[7px] py-[2px] rounded-full leading-tight"
            style={isActiveDark ? {
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "#ffffff",
            } : {
              background: "linear-gradient(#1E2240, #1E2240) padding-box, linear-gradient(to right, #5C2ED4, #A614C3) border-box",
              border: "1px solid transparent",
              color: "#C084FC",
            }}
          >
            {badge}
          </span>
        ) : (
          <span className="text-[10px] font-semibold px-[6px] py-[1px] rounded-full leading-tight" style={{ border: "1px solid #74C3B7", color: "#74C3B7" }}>
            {badge}
          </span>
        )
      )}
      {hasChevron && (
        <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: chevronColor }} />
      )}
    </button>
  );
}

interface SidenavProps {
  isDark?: boolean;
  onToggleDark?: () => void;
  activeItem?: string;
  onActiveChange?: (item: string) => void;
}

export default function Sidenav({ isDark = false, onToggleDark, activeItem = "Marketplace", onActiveChange }: SidenavProps) {
  const [legacyView, setLegacyView] = useState(false);

  const darkMode = isDark;

  const navItems = [
    { label: "Marketplace",       icon: <LayoutGrid className="w-[18px] h-[18px]" /> },
    { label: "Appetite Assistant", icon: <Sparkles  className="w-[16px] h-[16px]" /> },
    { label: "Quotes",            icon: <FileText   className="w-[18px] h-[18px]" /> },
    { label: "Policies",          icon: <Shield     className="w-[18px] h-[18px]" /> },
    { label: "Clients",           icon: <Users      className="w-[18px] h-[18px]" /> },
    { label: "ProSuite",          icon: <Briefcase  className="w-[18px] h-[18px]" />, badge: "PRO", hasChevron: true },
    { label: "Make a Payment",    icon: <CreditCard className="w-[18px] h-[18px]" /> },
    { label: "Accounting",        icon: <BookOpen   className="w-[18px] h-[18px]" />, hasChevron: true },
    { label: "Endorsements",      icon: <FileEdit   className="w-[18px] h-[18px]" /> },
    { label: "Tools & Resources", icon: <Wrench     className="w-[18px] h-[18px]" />, hasChevron: true },
    { label: "Support",           icon: <HelpCircle className="w-[18px] h-[18px]" /> },
    { label: "Admin",             icon: <UserCog    className="w-[18px] h-[18px]" /> },
    { label: "Agencies",          icon: <Building2  className="w-[18px] h-[18px]" /> },
    { label: "Website",           icon: <Globe      className="w-[18px] h-[18px]" /> },
  ];

  return (
    <aside
      className="w-[220px] min-h-screen flex flex-col relative overflow-hidden flex-shrink-0 transition-colors duration-300"
      style={{
        background: isDark ? "#191D35" : "#ffffff",
        borderRight: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #F3F4F6",
      }}
    >
      {/* Jungle bg — full image, no crop */}
      <Image
        src={jungleBg} alt=""
        className="absolute bottom-0 left-0 w-full pointer-events-none select-none"
        style={{ height: "auto", opacity: 1, clipPath: "inset(0 1px 0 0)" }}
      />

      {/* Logo */}
      <div className="px-4 pt-5 pb-3 relative z-10">
        <Image src={isDark ? norbielinkLogoDark : norbielinkLogo} alt="Norbielink" className="h-7 w-auto" />
      </div>

      {/* User Profile */}
      <div className="px-3 pb-3 relative z-10">
        <button className="w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-colors"
          style={{ "&:hover": { background: isDark ? "rgba(255,255,255,0.06)" : "#F9FAFB" } } as React.CSSProperties}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ border: "2.5px solid #4ECDC4", background: isDark ? "rgba(78,205,196,0.12)" : "#E8FAF9" }}>
            <span
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                background: "linear-gradient(135deg, #4ECDC4 0%, #2D9B8A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              JS
            </span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-[13px] font-bold truncate leading-tight" style={{ color: isDark ? "#F9FAFB" : "#2D3653" }}>
              John Smith
            </div>
            <div className="text-[11px] leading-tight" style={{ color: isDark ? "#8B8FA8" : "#9CA3AF" }}>
              ProSuite Member
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isDark ? "#8B8FA8" : "#9CA3AF" }} />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-2 relative z-10" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6"}` }} />

      {/* Nav Items */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto relative z-10" style={{ scrollbarWidth: "none" }}>
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activeItem === item.label}
            badge={item.badge}
            hasChevron={item.hasChevron}
            isDark={isDark}
            onClick={() => onActiveChange?.(item.label)}
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-4 pt-2 space-y-2 relative z-10">

        {/* Chat with Norbie — always has border + subtle bg */}
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
          style={{
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)",
            border: isDark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid #E5E7EB",
          }}
        >
          <Image src={norbieface} alt="Norbie" className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
          <div className="text-left">
            <div className="text-[12px] font-semibold" style={{ color: isDark ? "#F9FAFB" : "#2D3653" }}>
              Chat with Norbie
            </div>
            <div className="text-[10px]" style={{ color: isDark ? "#8B8FA8" : "#9CA3AF" }}>AI Assistant</div>
          </div>
        </button>

        {/* Divider */}
        <div style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"}` }} />

        {/* Dark Mode — no border */}
        <button
          onClick={onToggleDark}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
          style={{ background: isDark ? "rgba(255,255,255,0.06)" : "transparent" }}
        >
          <div className="w-9 h-5 rounded-full relative transition-all shrink-0"
            style={{ background: isDark ? "#E8622A" : "#D1D5DB" }}>
            <div className="absolute top-0.5 w-4 h-4 rounded-full shadow transition-all flex items-center justify-center bg-white"
              style={{ left: isDark ? "19px" : "2px" }}>
              {isDark ? (
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
              ) : (
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )}
            </div>
          </div>
          <span style={{ fontSize: "13px", fontWeight: 400, color: isDark ? "#F9FAFB" : "#6B7280" }}>Dark Mode</span>
        </button>

        {/* Legacy View — no border, no icon in knob */}
        <button
          onClick={() => setLegacyView(!legacyView)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
          style={{ background: legacyView && isDark ? "rgba(255,255,255,0.06)" : "transparent" }}
        >
          <div className="w-9 h-5 rounded-full relative transition-all shrink-0"
            style={{ background: legacyView ? "#E8622A" : "#D1D5DB" }}>
            <div className="absolute top-0.5 w-4 h-4 rounded-full shadow-sm bg-white transition-all"
              style={{ left: legacyView ? "19px" : "2px" }} />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 400, color: isDark ? "#F9FAFB" : "#6B7280" }}>Legacy View</span>
        </button>

      </div>
    </aside>
  );
}
