"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import btisLogo from "@/assets/btislogo.png";

interface TopBarProps {
  isDark?: boolean;
}

export default function TopBar({ isDark = false }: TopBarProps) {
  return (
    <header
      className="h-[52px] flex items-center px-5 gap-4 flex-shrink-0 transition-colors duration-300"
      style={{
        background: isDark ? "#151828" : "#ffffff",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"}`,
      }}
    >
      {/* Search */}
      <div
        className="flex items-center gap-2 rounded-md px-3 py-[7px] w-[280px] transition-colors duration-300"
        style={{
          background: isDark ? "rgba(255,255,255,0.06)" : "#F9FAFB",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`,
        }}
      >
        <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isDark ? "#6B7280" : "#9CA3AF" }} />
        <input
          type="text"
          placeholder="Search clients, quotes or policies..."
          className="bg-transparent text-[12px] outline-none w-full"
          style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}
        />
      </div>

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
