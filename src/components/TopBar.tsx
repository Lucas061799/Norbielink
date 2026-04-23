"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import btisLogo from "@/assets/btislogo.png";

interface TopBarProps {
  isDark?: boolean;
  activePage?: string;
}

export default function TopBar({ isDark = false, activePage }: TopBarProps) {
  const hideSearch = activePage === "Quotes" || activePage === "Policies";
  return (
    <header
      className="h-[52px] flex items-center px-5 gap-4 flex-shrink-0 transition-colors duration-300"
      style={{
        background: isDark ? "#151828" : "#ffffff",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"}`,
      }}
    >
      {/* Search */}
      {!hideSearch && (
        <div className="relative transition-colors duration-300" style={{ width: 400 }}>
          <Search className="absolute left-[12.5px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 flex-shrink-0" style={{ color: isDark ? "#6B7280" : "#9CA3AF" }} />
          <input
            type="text"
            placeholder="Search clients, quotes or policies..."
            className="bg-transparent outline-none w-full"
            style={{
              background: isDark ? "rgba(255,255,255,0.06)" : "#FFFFFF",
              border: `0.78125px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`,
              borderRadius: 10.9375,
              padding: "7.8125px 12.5px 7.8125px 34.375px",
              height: 35.94,
              fontSize: 12,
              color: isDark ? "#9CA3AF" : "#6B7280",
              boxSizing: "border-box",
            }}
          />
        </div>
      )}

      <div className="flex-1" />

      {/* Powered by btis */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] tracking-widest uppercase font-medium"
          style={{ color: isDark ? "#4B5563" : "#9CA3AF" }}
        >
          POWERED BY
        </span>
        <Image
          src={btisLogo}
          alt="btis"
          className="h-5 w-auto"
          style={{ filter: isDark ? "brightness(0) invert(0.4)" : "none" }}
        />
      </div>
    </header>
  );
}
